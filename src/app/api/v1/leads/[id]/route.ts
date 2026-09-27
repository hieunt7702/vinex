import { NextResponse } from 'next/server';
import { store, savePersistedData } from '../../store';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { handleCorsPreflight } from '@/lib/cors';

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leadId = parseInt(id, 10);

  try {
    const data = await request.json();
    let updatedLead: any = null;

    if (process.env.DATABASE_URL && !isNaN(leadId)) {
      try {
        const { id: _id, ...cleanData } = data;
        updatedLead = await prisma.lead.update({
          where: { id: leadId },
          data: {
            ...(cleanData.customerName !== undefined ? { customerName: cleanData.customerName } : {}),
            ...(cleanData.companyName !== undefined ? { companyName: cleanData.companyName } : {}),
            ...(cleanData.phone !== undefined ? { phone: cleanData.phone } : {}),
            ...(cleanData.email !== undefined ? { email: cleanData.email } : {}),
            ...(cleanData.location !== undefined ? { location: cleanData.location } : {}),
            ...(cleanData.source !== undefined ? { source: cleanData.source } : {}),
            ...(cleanData.productGroup !== undefined ? { productGroup: cleanData.productGroup } : {}),
            ...(cleanData.purpose !== undefined ? { purpose: cleanData.purpose } : {}),
            ...(cleanData.quantity !== undefined ? { quantity: cleanData.quantity } : {}),
            ...(cleanData.budget !== undefined ? { budget: cleanData.budget } : {}),
            ...(cleanData.timeline !== undefined ? { timeline: cleanData.timeline } : {}),
            ...(cleanData.customization !== undefined ? { customization: cleanData.customization } : {}),
            ...(cleanData.notes !== undefined ? { notes: cleanData.notes } : {}),
            ...(cleanData.status !== undefined ? { status: cleanData.status } : {}),
            ...(cleanData.leadClassification !== undefined ? { leadClassification: cleanData.leadClassification } : {}),
            ...(cleanData.assignee !== undefined ? { assignee: cleanData.assignee } : {})
          }
        });
      } catch (dbErr) {
        console.error('Prisma lead update error:', dbErr);
      }
    }

    if (store?.leads) {
      const index = store.leads.findIndex((l: any) => l.id === leadId);
      if (index !== -1) {
        store.leads[index] = { ...store.leads[index], ...data, ...(updatedLead || {}) };
        savePersistedData();
      }
    }

    if (updatedLead) return NextResponse.json(updatedLead);
    const fallback = store?.leads?.find((l: any) => l.id === leadId);
    if (fallback) return NextResponse.json(fallback);

    return NextResponse.json({ message: 'Lead không tồn tại' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leadId = parseInt(id, 10);

  if (process.env.DATABASE_URL && !isNaN(leadId)) {
    try {
      await prisma.lead.delete({ where: { id: leadId } });
    } catch (e) {
      console.error('Prisma lead delete error:', e);
    }
  }

  if (store?.leads) {
    const index = store.leads.findIndex((l: any) => l.id === leadId);
    if (index !== -1) {
      store.leads.splice(index, 1);
      if (store.stats && store.stats.totalLeads > 0) store.stats.totalLeads--;
      savePersistedData();
    }
  }

  return NextResponse.json({ message: 'Xóa thành công' });
}
