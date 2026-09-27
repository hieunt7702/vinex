import { NextResponse } from 'next/server';
import { store, savePersistedData } from '../store';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { handleCorsPreflight } from '@/lib/cors';

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

export async function GET() {
  if (process.env.DATABASE_URL) {
    try {
      const dbLeads = await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' }
      });
      if (dbLeads && dbLeads.length > 0) {
        return NextResponse.json(dbLeads);
      }
    } catch (e) {
      // fallback
    }
  }
  return NextResponse.json(store?.leads || []);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    let createdLead: any = null;

    if (process.env.DATABASE_URL) {
      try {
        createdLead = await prisma.lead.create({
          data: {
            customerName: data.customerName || data.name || 'Khách hàng',
            phone: data.phone || data.phoneNumber || '',
            email: data.email || null,
            location: data.location || null,
            source: data.source || 'Website',
            projectType: data.projectType || null,
            budget: data.budget || null,
            notes: data.notes || data.message || null,
            status: data.status || 'PENDING'
          }
        });
      } catch (dbErr) {
        console.error('Prisma lead create error:', dbErr);
      }
    }

    const finalLead = createdLead || {
      ...data,
      id: store?.leads?.length ? Math.max(...store.leads.map(l => l.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    };

    if (store?.leads) {
      store.leads.unshift(finalLead);
      if (store.stats) store.stats.totalLeads++;
      savePersistedData();
    }
    
    return NextResponse.json(finalLead, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
