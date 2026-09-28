import { NextResponse } from 'next/server';
import { store, savePersistedData } from '../../store';
import prisma from '@/lib/prisma';
import { handleCorsPreflight } from '@/lib/cors';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leadId = parseInt(id, 10);

  let lead: any = null;

  if (process.env.DATABASE_URL) {
    try {
      if (!isNaN(leadId)) {
        lead = await prisma.lead.findUnique({ where: { id: leadId } });
      } else {
        lead = await prisma.lead.findFirst({ where: { requestCode: id } });
      }
    } catch (e) {
      console.warn('Prisma get lead fallback:', e);
    }
  }

  if (!lead && store?.leads) {
    lead = store.leads.find((l: any) => l.id === leadId || l.requestCode === id);
  }

  if (!lead) {
    return NextResponse.json({ message: 'Không tìm thấy yêu cầu' }, { status: 404 });
  }

  return NextResponse.json(lead);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leadId = parseInt(id, 10);

  try {
    const data = await request.json();
    const actor = data.updatedBy || data.actor || 'Quản trị viên';

    let existingLead: any = null;

    if (process.env.DATABASE_URL) {
      try {
        if (!isNaN(leadId)) {
          existingLead = await prisma.lead.findUnique({ where: { id: leadId } });
        } else {
          existingLead = await prisma.lead.findFirst({ where: { requestCode: id } });
        }
      } catch (e) {
        console.warn('Prisma find lead error:', e);
      }
    }

    if (!existingLead && store?.leads) {
      existingLead = store.leads.find((l: any) => l.id === leadId || l.requestCode === id);
    }

    if (!existingLead) {
      return NextResponse.json({ message: 'Yêu cầu không tồn tại' }, { status: 404 });
    }

    const currentActivities: any[] = Array.isArray(existingLead.activities) ? [...existingLead.activities] : [];
    const currentQuotations: any[] = Array.isArray(existingLead.quotations) ? [...existingLead.quotations] : [];
    const currentAuditLog: any[] = Array.isArray(existingLead.auditLog) ? [...existingLead.auditLog] : [];
    const currentReopenHistory: any[] = Array.isArray(existingLead.reopenHistory) ? [...existingLead.reopenHistory] : [];

    const nowIso = new Date().toISOString();
    const auditEntries: any[] = [];

    // 1. Process New Activity / Note if provided
    let updatedLastContactDate = existingLead.lastContactDate;
    let updatedFirstResponseAt = existingLead.firstResponseAt;

    if (data.newActivity) {
      const act = data.newActivity;
      const activityId = `act_${Date.now()}`;
      const newActItem = {
        id: activityId,
        createdAt: nowIso,
        author: act.author || actor,
        type: act.type || 'NOTE', // NOTE, CALL, EMAIL, ZALO, MEETING
        title: act.title || '',
        content: act.content || '',
        contactResult: act.contactResult || null,
        nextAction: act.nextAction || null,
        nextActionDeadline: act.nextActionDeadline || null,
        attachments: Array.isArray(act.attachments) ? act.attachments : []
      };

      currentActivities.unshift(newActItem);

      // If activity is a contact interaction (CALL, EMAIL, ZALO, MEETING)
      if (['CALL', 'EMAIL', 'ZALO', 'MEETING'].includes(newActItem.type)) {
        updatedLastContactDate = nowIso;
        if (!updatedFirstResponseAt) {
          updatedFirstResponseAt = nowIso;
        }
      }

      auditEntries.push({
        id: `audit_${Date.now()}_act`,
        timestamp: nowIso,
        user: actor,
        action: 'Thêm hoạt động',
        details: `${newActItem.author} đã thêm hoạt động [${newActItem.type}]: ${newActItem.content?.slice(0, 60)}`
      });
    }

    // 2. Process Quotation
    if (data.newQuotation) {
      const q = data.newQuotation;
      const quoteId = `quote_${Date.now()}`;
      const newQuoteItem = {
        id: quoteId,
        quoteCode: q.quoteCode || `BG-${Date.now().toString().slice(-6)}`,
        version: q.version || `v${currentQuotations.length + 1}`,
        value: Number(q.value) || 0,
        validUntil: q.validUntil || null,
        sentAt: q.sentAt || nowIso,
        sentBy: q.sentBy || actor,
        fileUrl: q.fileUrl || null,
        fileName: q.fileName || 'Báo giá VINEX',
        notes: q.notes || ''
      };
      currentQuotations.unshift(newQuoteItem);

      auditEntries.push({
        id: `audit_${Date.now()}_q`,
        timestamp: nowIso,
        user: actor,
        action: 'Tạo báo giá',
        details: `Đã tạo báo giá ${newQuoteItem.quoteCode} (${newQuoteItem.version}) trị giá ${newQuoteItem.value.toLocaleString('vi-VN')}đ`
      });
    }

    // 3. Process Status changes & Rules
    let newStatus = data.status !== undefined ? data.status : existingLead.status;
    let closingResult = data.closingResult !== undefined ? data.closingResult : existingLead.closingResult;
    let closingNote = data.closingNote !== undefined ? data.closingNote : existingLead.closingNote;
    let linkedOrderCode = data.linkedOrderCode !== undefined ? data.linkedOrderCode : existingLead.linkedOrderCode;
    let orderValue = data.orderValue !== undefined ? Number(data.orderValue) : existingLead.orderValue;
    let linkedRequestId = data.linkedRequestId !== undefined ? data.linkedRequestId : existingLead.linkedRequestId;
    let closedAt = existingLead.closedAt;

    if (data.status && data.status !== existingLead.status) {
      auditEntries.push({
        id: `audit_${Date.now()}_st`,
        timestamp: nowIso,
        user: actor,
        action: 'Đổi trạng thái',
        details: `Chuyển trạng thái từ [${existingLead.status}] sang [${data.status}]`
      });

      // If closing
      if (data.status === 'CLOSED') {
        closedAt = nowIso;
        if (closingResult === 'ORDER_CREATED' && linkedOrderCode) {
          auditEntries.push({
            id: `audit_${Date.now()}_win`,
            timestamp: nowIso,
            user: actor,
            action: 'Chuyển thành đơn hàng',
            details: `Đã chốt đơn hàng: Mã [${linkedOrderCode}], giá trị: ${orderValue?.toLocaleString('vi-VN') || 0}đ`
          });
        }
      }

      // If reopening previously closed lead
      if (existingLead.status === 'CLOSED' && data.status !== 'CLOSED') {
        closedAt = null;
        currentReopenHistory.unshift({
          reopenedAt: nowIso,
          reopenedBy: actor,
          reason: data.reopenReason || 'Mở lại để tiếp tục xử lý'
        });
        auditEntries.push({
          id: `audit_${Date.now()}_reopen`,
          timestamp: nowIso,
          user: actor,
          action: 'Mở lại yêu cầu',
          details: `Lý do: ${data.reopenReason || 'Mở lại để tiếp tục xử lý'}`
        });
      }
    }

    // 4. Process Assignee change
    let assignee = data.assignee !== undefined ? data.assignee : existingLead.assignee;
    if (data.assignee && data.assignee !== existingLead.assignee) {
      auditEntries.push({
        id: `audit_${Date.now()}_asgn`,
        timestamp: nowIso,
        user: actor,
        action: 'Phân công',
        details: `Phân công cho nhân viên: ${data.assignee}`
      });
      if (newStatus === 'NEW') {
        newStatus = 'ASSIGNED';
      }
    }

    // 5. Process Priority change
    if (data.priority !== undefined && data.priority !== existingLead.priority) {
      const pLabel = {
        URGENT: 'Khẩn cấp',
        HIGH: 'Cao',
        NORMAL: 'Bình thường'
      }[data.priority as 'URGENT' | 'HIGH' | 'NORMAL'] || data.priority;
      auditEntries.push({
        id: `audit_${Date.now()}_prio`,
        timestamp: nowIso,
        user: actor,
        action: 'Đổi mức ưu tiên',
        details: `Đổi mức ưu tiên sang: ${pLabel}`
      });
    }

    // Append all audits
    currentAuditLog.unshift(...auditEntries);

    const updatedData: any = {
      customerName: data.customerName !== undefined ? data.customerName : existingLead.customerName,
      companyName: data.companyName !== undefined ? data.companyName : existingLead.companyName,
      phone: data.phone !== undefined ? data.phone : existingLead.phone,
      email: data.email !== undefined ? data.email : existingLead.email,
      location: data.location !== undefined ? data.location : existingLead.location,
      purpose: data.purpose !== undefined ? data.purpose : existingLead.purpose,
      productGroup: data.productGroup !== undefined ? data.productGroup : existingLead.productGroup,
      quantity: data.quantity !== undefined ? data.quantity : existingLead.quantity,
      budget: data.budget !== undefined ? data.budget : existingLead.budget,
      timeline: data.timeline !== undefined ? data.timeline : existingLead.timeline,
      customization: data.customization !== undefined ? data.customization : existingLead.customization,
      notes: data.notes !== undefined ? data.notes : existingLead.notes,
      preferredChannel: data.preferredChannel !== undefined ? data.preferredChannel : existingLead.preferredChannel,
      preferredTime: data.preferredTime !== undefined ? data.preferredTime : existingLead.preferredTime,
      priority: data.priority !== undefined ? data.priority : existingLead.priority,
      leadClassification: data.leadClassification !== undefined ? data.leadClassification : existingLead.leadClassification,
      assignee,
      internalReason: data.internalReason !== undefined ? data.internalReason : existingLead.internalReason,
      nextFollowUpDate: data.nextFollowUpDate !== undefined ? data.nextFollowUpDate : existingLead.nextFollowUpDate,
      lastContactDate: updatedLastContactDate,
      firstResponseAt: updatedFirstResponseAt,
      isRead: data.isRead !== undefined ? Boolean(data.isRead) : existingLead.isRead,
      status: newStatus,
      closingResult,
      closingNote,
      linkedOrderCode,
      orderValue,
      linkedRequestId,
      closedAt,
      verifiedInfo: data.verifiedInfo !== undefined ? data.verifiedInfo : existingLead.verifiedInfo,
      activities: currentActivities,
      quotations: currentQuotations,
      auditLog: currentAuditLog,
      reopenHistory: currentReopenHistory,
      updatedAt: new Date()
    };

    let resultLead: any = null;

    if (process.env.DATABASE_URL && existingLead.id) {
      try {
        resultLead = await prisma.lead.update({
          where: { id: existingLead.id },
          data: {
            customerName: updatedData.customerName,
            companyName: updatedData.companyName,
            phone: updatedData.phone,
            email: updatedData.email,
            location: updatedData.location,
            purpose: updatedData.purpose,
            productGroup: updatedData.productGroup,
            quantity: updatedData.quantity,
            budget: updatedData.budget,
            timeline: updatedData.timeline,
            customization: updatedData.customization,
            notes: updatedData.notes,
            preferredChannel: updatedData.preferredChannel,
            preferredTime: updatedData.preferredTime,
            priority: updatedData.priority,
            leadClassification: updatedData.leadClassification,
            assignee: updatedData.assignee,
            internalReason: updatedData.internalReason,
            nextFollowUpDate: updatedData.nextFollowUpDate,
            lastContactDate: updatedData.lastContactDate,
            firstResponseAt: updatedData.firstResponseAt,
            isRead: updatedData.isRead,
            status: updatedData.status,
            closingResult: updatedData.closingResult,
            closingNote: updatedData.closingNote,
            linkedOrderCode: updatedData.linkedOrderCode,
            orderValue: updatedData.orderValue,
            linkedRequestId: updatedData.linkedRequestId,
            closedAt: updatedData.closedAt,
            verifiedInfo: updatedData.verifiedInfo as any,
            activities: updatedData.activities as any,
            quotations: updatedData.quotations as any,
            auditLog: updatedData.auditLog as any,
            reopenHistory: updatedData.reopenHistory as any
          }
        });
      } catch (dbErr) {
        console.error('Prisma update lead error:', dbErr);
      }
    }

    if (store?.leads) {
      const idx = store.leads.findIndex((l: any) => l.id === existingLead.id || l.requestCode === existingLead.requestCode);
      if (idx !== -1) {
        store.leads[idx] = { ...store.leads[idx], ...updatedData, ...(resultLead || {}) };
        savePersistedData();
      }
    }

    return NextResponse.json(resultLead || { ...existingLead, ...updatedData });
  } catch (error: any) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ message: 'Dữ liệu không hợp lệ: ' + error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leadId = parseInt(id, 10);

  if (process.env.DATABASE_URL) {
    try {
      if (!isNaN(leadId)) {
        await prisma.lead.delete({ where: { id: leadId } });
      } else {
        await prisma.lead.delete({ where: { requestCode: id } });
      }
    } catch (e) {
      console.error('Prisma lead delete error:', e);
    }
  }

  if (store?.leads) {
    const index = store.leads.findIndex((l: any) => l.id === leadId || l.requestCode === id);
    if (index !== -1) {
      store.leads.splice(index, 1);
      if (store.stats && store.stats.totalLeads > 0) store.stats.totalLeads--;
      savePersistedData();
    }
  }

  return NextResponse.json({ message: 'Xóa yêu cầu thành công' });
}
