import { NextResponse } from 'next/server';
import { store } from '../../store';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customerId = parseInt(id, 10);
  
  const index = store.customers.findIndex(c => c.id === customerId);
  if (index === -1) {
    return NextResponse.json({ message: 'Khách hàng không tồn tại' }, { status: 404 });
  }

  try {
    const data = await request.json();
    store.customers[index] = { ...store.customers[index], ...data };
    return NextResponse.json(store.customers[index]);
  } catch (error) {
    return NextResponse.json({ message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customerId = parseInt(id, 10);
  
  const index = store.customers.findIndex(c => c.id === customerId);
  if (index === -1) {
    return NextResponse.json({ message: 'Khách hàng không tồn tại' }, { status: 404 });
  }

  store.customers.splice(index, 1);
  store.stats.totalCustomers--;

  return NextResponse.json({ message: 'Xóa thành công' });
}
