import { NextResponse } from 'next/server';
import { store, savePersistedData } from '../store';
import prisma from '@/lib/prisma';
import { handleCorsPreflight } from '@/lib/cors';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

// Helper to generate a unique readable request code
function generateRequestCode(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `REQ-${yyyy}${mm}${dd}-${random}`;
}

// Helper to determine overdue flags
function evaluateOverdue(lead: any): { isFirstResponseOverdue: boolean; isFollowUpOverdue: boolean } {
  let isFirstResponseOverdue = false;
  let isFollowUpOverdue = false;

  const now = new Date();

  // If newly received and no first response recorded yet
  if ((lead.status === 'NEW' || !lead.firstResponseAt) && lead.status !== 'CLOSED') {
    const created = new Date(lead.createdAt || now);
    const diffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
    // Overdue if > 4 business/calendar hours without initial response
    if (diffHours >= 4 && !lead.firstResponseAt) {
      isFirstResponseOverdue = true;
    }
  }

  // Follow-up overdue: if follow-up date has passed and lead is not closed
  if (lead.nextFollowUpDate && lead.status !== 'CLOSED') {
    const followUp = new Date(lead.nextFollowUpDate);
    if (!isNaN(followUp.getTime()) && followUp < now) {
      isFollowUpOverdue = true;
    }
  }

  return { isFirstResponseOverdue, isFollowUpOverdue };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search')?.toLowerCase().trim() || '';
  const purpose = url.searchParams.get('purpose');
  const status = url.searchParams.get('status');
  const priority = url.searchParams.get('priority');
  const assignee = url.searchParams.get('assignee');
  const isRead = url.searchParams.get('isRead');
  const isOverdue = url.searchParams.get('isOverdue');
  const unassigned = url.searchParams.get('unassigned');
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');

  let allLeads: any[] = [];

  if (process.env.DATABASE_URL) {
    try {
      const dbLeads = await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' }
      });
      if (dbLeads) {
        allLeads = dbLeads;
      }
    } catch (e) {
      console.warn('Prisma get leads fallback to store:', e);
      allLeads = store?.leads || [];
    }
  } else {
    allLeads = store?.leads || [];
  }

  // Enhance all leads with calculated flags
  let processed = allLeads.map((lead: any) => {
    const { isFirstResponseOverdue, isFollowUpOverdue } = evaluateOverdue(lead);
    return {
      ...lead,
      isFirstResponseOverdue,
      isFollowUpOverdue,
      hasWarning: isFirstResponseOverdue || isFollowUpOverdue || (!lead.assignee && lead.status === 'NEW'),
      requestCode: lead.requestCode || `REQ-OLD-${lead.id}`
    };
  });

  // Calculate summary stats
  const stats = {
    total: processed.length,
    new: processed.filter((l) => l.status === 'NEW').length,
    assigned: processed.filter((l) => l.status === 'ASSIGNED').length,
    processing: processed.filter((l) => l.status === 'PROCESSING').length,
    waitingCustomer: processed.filter((l) => l.status === 'WAITING_CUSTOMER').length,
    waitingInternal: processed.filter((l) => l.status === 'WAITING_INTERNAL').length,
    closed: processed.filter((l) => l.status === 'CLOSED').length,
    unassigned: processed.filter((l) => !l.assignee && l.status !== 'CLOSED').length,
    overdue: processed.filter((l) => l.isFirstResponseOverdue || l.isFollowUpOverdue).length,
    unread: processed.filter((l) => !l.isRead).length,
    ordersConverted: processed.filter((l) => l.closingResult === 'ORDER_CREATED').length,
    conversionRate: '0%'
  };

  const eligibleForConversion = processed.filter(
    (l) => l.status === 'CLOSED' && l.purpose !== 'SUPPORT'
  ).length;
  if (eligibleForConversion > 0) {
    stats.conversionRate = `${Math.round((stats.ordersConverted / eligibleForConversion) * 100)}%`;
  }

  // Filter application
  if (search) {
    processed = processed.filter(
      (l) =>
        (l.requestCode && l.requestCode.toLowerCase().includes(search)) ||
        (l.customerName && l.customerName.toLowerCase().includes(search)) ||
        (l.companyName && l.companyName.toLowerCase().includes(search)) ||
        (l.phone && l.phone.toLowerCase().includes(search)) ||
        (l.email && l.email.toLowerCase().includes(search)) ||
        (l.notes && l.notes.toLowerCase().includes(search)) ||
        (l.productGroup && l.productGroup.toLowerCase().includes(search))
    );
  }

  if (purpose && purpose !== 'ALL') {
    processed = processed.filter((l) => l.purpose === purpose || l.productGroup === purpose);
  }

  if (status && status !== 'ALL') {
    processed = processed.filter((l) => l.status === status);
  }

  if (priority && priority !== 'ALL') {
    processed = processed.filter((l) => l.priority === priority);
  }

  if (assignee && assignee !== 'ALL') {
    processed = processed.filter((l) => l.assignee === assignee);
  }

  if (unassigned === 'true') {
    processed = processed.filter((l) => !l.assignee && l.status !== 'CLOSED');
  }

  if (isOverdue === 'true') {
    processed = processed.filter((l) => l.isFirstResponseOverdue || l.isFollowUpOverdue);
  }

  if (isRead === 'false') {
    processed = processed.filter((l) => !l.isRead);
  }

  if (startDate) {
    const sDate = new Date(startDate);
    processed = processed.filter((l) => new Date(l.createdAt) >= sDate);
  }

  if (endDate) {
    const eDate = new Date(endDate);
    eDate.setHours(23, 59, 59, 999);
    processed = processed.filter((l) => new Date(l.createdAt) <= eDate);
  }

  return NextResponse.json({
    leads: processed,
    stats
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const customerName = data.customerName || data.name || data.fullName || 'Khách hàng';
    const companyName = data.companyName || data.company || null;
    const phone = data.phone || data.phoneNumber || '';
    const email = data.email || null;
    const location = data.location || data.shippingLocation || data.address || null;
    const source = data.source || 'Website - Form Liên Hệ';
    const sourceUrl = data.sourceUrl || null;
    const sourceProduct = data.sourceProduct || null;
    const utmParams = data.utmParams || null;

    const purpose = data.purpose || 'BUY_PRODUCT';
    const productGroup = data.productGroup || data.purposeLabel || 'Mua sản phẩm';

    const preferredChannel = data.preferredChannel || 'Điện thoại';
    const preferredTime = data.preferredTime || null;

    const quantity = data.quantity || data.details?.quantity || data.details?.giftQuantity || data.details?.expectedVolume || null;
    const budget = data.budget || data.details?.budgetRange || null;
    const timeline = data.timeline || data.details?.desiredDate || data.deliveryDate || null;
    const customization = data.customization || (Array.isArray(data.details?.customization) ? data.details.customization.join(', ') : null);
    const notes = data.notes || data.message || data.details?.issueDescription || data.details?.partnershipProposal || null;

    const details = data.details || {};
    const attachments = Array.isArray(data.attachments) ? data.attachments : [];

    const consentVersion = data.consentVersion || 'v1.0';
    const marketingOptIn = Boolean(data.marketingOptIn);

    const requestCode = data.requestCode || generateRequestCode();
    const status = data.status || 'NEW';
    const priority = data.priority || (purpose === 'CORPORATE_GIFT' || purpose === 'WHOLESALE' ? 'HIGH' : 'NORMAL');
    const leadClassification = data.leadClassification || 'WARM';
    const assignee = data.assignee || null;

    // Initial Audit Log entry
    const auditLog = [
      {
        id: `audit_${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: 'Hệ thống',
        action: 'Tiếp nhận yêu cầu',
        details: `Nhận yêu cầu [${requestCode}] từ ${source}`
      }
    ];

    let createdLead: any = null;

    if (process.env.DATABASE_URL) {
      try {
        // Anti-double submit check within last 15 seconds
        const fifteenSecondsAgo = new Date(Date.now() - 15000);
        const duplicate = await prisma.lead.findFirst({
          where: {
            customerName,
            ...(phone ? { phone } : {}),
            createdAt: { gte: fifteenSecondsAgo }
          }
        });

        if (duplicate) {
          return NextResponse.json(
            {
              message: 'Yêu cầu của bạn đã được tiếp nhận trước đó ít giây. Đang xử lý!',
              lead: duplicate,
              requestCode: duplicate.requestCode
            },
            { status: 200 }
          );
        }

        createdLead = await prisma.lead.create({
          data: {
            requestCode,
            customerName,
            companyName,
            phone,
            email,
            location,
            source,
            sourceUrl,
            sourceProduct,
            utmParams: utmParams ? (utmParams as any) : undefined,
            purpose,
            productGroup,
            preferredChannel,
            preferredTime,
            quantity: quantity ? String(quantity) : null,
            budget: budget ? String(budget) : null,
            timeline: timeline ? String(timeline) : null,
            customization: customization ? String(customization) : null,
            notes,
            details: details as any,
            attachments: attachments as any,
            consentVersion,
            marketingOptIn,
            isRead: false,
            status,
            priority,
            leadClassification,
            assignee,
            auditLog: auditLog as any,
            activities: [] as any,
            quotations: [] as any,
            projectType: productGroup
          }
        });

        // Automatically sync customer
        if (phone || email || customerName) {
          try {
            const existingCustomer = await prisma.customer.findFirst({
              where: {
                OR: [
                  ...(phone ? [{ phoneNumber: phone }] : []),
                  ...(email ? [{ email }] : [])
                ]
              }
            });

            if (!existingCustomer) {
              await prisma.customer.create({
                data: {
                  fullName: customerName,
                  phoneNumber: phone || '---',
                  email: email || null,
                  address: location || '---',
                  requestType: productGroup,
                  totalOrders: 0,
                  notes: `Tạo từ yêu cầu: ${requestCode} (${source})`
                }
              });
            } else {
              await prisma.customer.update({
                where: { id: existingCustomer.id },
                data: {
                  requestType: productGroup || existingCustomer.requestType,
                  notes: `${existingCustomer.notes || ''} | Yêu cầu mới: ${requestCode}`
                }
              });
            }
          } catch (custErr) {
            console.error('Lỗi đồng bộ customer:', custErr);
          }
        }
      } catch (dbErr) {
        console.error('Prisma lead create error:', dbErr);
      }
    }

    const finalLead = createdLead || {
      id: store?.leads?.length ? Math.max(...store.leads.map((l: any) => Number(l.id) || 0)) + 1 : 1,
      requestCode,
      customerName,
      companyName,
      phone,
      email,
      location,
      source,
      sourceUrl,
      sourceProduct,
      utmParams,
      purpose,
      productGroup,
      preferredChannel,
      preferredTime,
      quantity,
      budget,
      timeline,
      customization,
      notes,
      details,
      attachments,
      consentVersion,
      marketingOptIn,
      isRead: false,
      status,
      priority,
      leadClassification,
      assignee,
      auditLog,
      activities: [],
      quotations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (store?.leads) {
      store.leads.unshift(finalLead);
      if (store.stats) store.stats.totalLeads++;
      savePersistedData();
    }

    return NextResponse.json(
      {
        success: true,
        lead: finalLead,
        requestCode: finalLead.requestCode,
        message: 'Gửi yêu cầu thành công!'
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error handling lead submission:', error);
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào: ' + (error.message || '') }, { status: 400 });
  }
}
