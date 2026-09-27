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
      const dbCustomers = await prisma.customer.findMany({
        orderBy: { createdAt: 'desc' }
      });
      if (dbCustomers && dbCustomers.length > 0) {
        return NextResponse.json(dbCustomers);
      }
    } catch (e) {
      // fallback
    }
  }
  return NextResponse.json(store?.customers || []);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    let createdCustomer: any = null;

    if (process.env.DATABASE_URL) {
      try {
        createdCustomer = await prisma.customer.create({
          data: {
            fullName: data.fullName || data.name || 'Khách hàng',
            phoneNumber: data.phoneNumber || data.phone || '',
            email: data.email || null,
            address: data.address || null,
            totalOrders: Number(data.totalOrders) || 0,
            notes: data.notes || null
          }
        });
      } catch (dbErr) {
        console.error('Prisma customer create error:', dbErr);
      }
    }

    const finalCustomer = createdCustomer || {
      ...data,
      id: store?.customers?.length ? Math.max(...store.customers.map(c => c.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    };

    if (store?.customers) {
      store.customers.unshift(finalCustomer);
      if (store.stats) store.stats.totalCustomers++;
      savePersistedData();
    }
    
    return NextResponse.json(finalCustomer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
