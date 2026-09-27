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
  const customerId = parseInt(id, 10);

  try {
    const data = await request.json();
    let updatedCustomer: any = null;

    if (process.env.DATABASE_URL && !isNaN(customerId)) {
      try {
        const { id: _id, ...cleanData } = data;
        updatedCustomer = await prisma.customer.update({
          where: { id: customerId },
          data: {
            ...(cleanData.fullName !== undefined ? { fullName: cleanData.fullName } : {}),
            ...(cleanData.phoneNumber !== undefined ? { phoneNumber: cleanData.phoneNumber } : {}),
            ...(cleanData.email !== undefined ? { email: cleanData.email } : {}),
            ...(cleanData.address !== undefined ? { address: cleanData.address } : {}),
            ...(cleanData.requestType !== undefined ? { requestType: cleanData.requestType } : {}),
            ...(cleanData.totalOrders !== undefined ? { totalOrders: Number(cleanData.totalOrders) } : {}),
            ...(cleanData.notes !== undefined ? { notes: cleanData.notes } : {})
          }
        });
      } catch (dbErr) {
        console.error('Prisma customer update error:', dbErr);
      }
    }

    if (store?.customers) {
      const index = store.customers.findIndex(c => c.id === customerId);
      if (index !== -1) {
        store.customers[index] = { ...store.customers[index], ...data, ...(updatedCustomer || {}) };
        savePersistedData();
      }
    }

    if (updatedCustomer) return NextResponse.json(updatedCustomer);
    const fallback = store?.customers?.find(c => c.id === customerId);
    if (fallback) return NextResponse.json(fallback);

    return NextResponse.json({ message: 'Khách hàng không tồn tại' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customerId = parseInt(id, 10);

  if (process.env.DATABASE_URL && !isNaN(customerId)) {
    try {
      await prisma.customer.delete({ where: { id: customerId } });
    } catch (e) {
      console.error('Prisma customer delete error:', e);
    }
  }

  if (store?.customers) {
    const index = store.customers.findIndex(c => c.id === customerId);
    if (index !== -1) {
      store.customers.splice(index, 1);
      if (store.stats && store.stats.totalCustomers > 0) store.stats.totalCustomers--;
      savePersistedData();
    }
  }

  return NextResponse.json({ message: 'Xóa thành công' });
}
