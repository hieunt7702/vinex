import { NextResponse } from 'next/server';
import { store } from '../../store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    },
  });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categoryId = parseInt(id, 10);
  
  const index = store.categories.findIndex(c => 
    (!isNaN(categoryId) && c.id === categoryId) || 
    String(c.id) === String(id) || 
    c.slug === id
  );

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
  
  const index = store.categories.findIndex(c => 
    (!isNaN(categoryId) && c.id === categoryId) || 
    String(c.id) === String(id) || 
    c.slug === id
  );

  if (index === -1) {
    return NextResponse.json({ message: 'Danh mục không tồn tại' }, { status: 404 });
  }

  const deleted = store.categories.splice(index, 1)[0];
  return NextResponse.json({ message: 'Xóa thành công', id: deleted?.id });
}
