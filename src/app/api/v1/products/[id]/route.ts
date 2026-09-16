import { NextResponse } from 'next/server';
import { store } from '../../store';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  
  const index = store.products.findIndex(p => p.id === productId);
  if (index === -1) {
    return NextResponse.json({ message: 'Sản phẩm không tồn tại' }, { status: 404 });
  }

  try {
    const data = await request.json();
    store.products[index] = { ...store.products[index], ...data };
    return NextResponse.json(store.products[index]);
  } catch (error) {
    return NextResponse.json({ message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  
  const index = store.products.findIndex(p => p.id === productId);
  if (index === -1) {
    return NextResponse.json({ message: 'Sản phẩm không tồn tại' }, { status: 404 });
  }

  store.products.splice(index, 1);
  store.stats.totalProducts--;

  return NextResponse.json({ message: 'Xóa thành công' });
}
