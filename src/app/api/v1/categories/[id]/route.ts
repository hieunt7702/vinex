import { NextResponse } from 'next/server';
import { store } from '../../store';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categoryId = parseInt(id, 10);
  
  const index = store.categories.findIndex(c => c.id === categoryId);
  if (index === -1) {
    return NextResponse.json({ message: 'Danh mục không tồn tại' }, { status: 404 });
  }

  try {
    const data = await request.json();
    store.categories[index] = { ...store.categories[index], ...data };
    return NextResponse.json(store.categories[index]);
  } catch (error) {
    return NextResponse.json({ message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categoryId = parseInt(id, 10);
  
  const index = store.categories.findIndex(c => c.id === categoryId);
  if (index === -1) {
    return NextResponse.json({ message: 'Danh mục không tồn tại' }, { status: 404 });
  }

  store.categories.splice(index, 1);
  return NextResponse.json({ message: 'Xóa thành công' });
}
