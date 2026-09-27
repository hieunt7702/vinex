import { NextResponse } from 'next/server';
import { store } from '../../store';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pageId = parseInt(id, 10);
  
  const page = store.seopages.find(p => p.id === pageId);
  if (!page) {
    return NextResponse.json({ message: 'Trang SEO không tồn tại' }, { status: 404 });
  }

  return NextResponse.json(page);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pageId = parseInt(id, 10);
  
  const index = store.seopages.findIndex(p => p.id === pageId);
  if (index === -1) {
    return NextResponse.json({ message: 'Trang SEO không tồn tại' }, { status: 404 });
  }

  try {
    const data = await request.json();
    store.seopages[index] = { 
      ...store.seopages[index], 
      ...data,
      updatedAt: new Date().toISOString()
    };
    return NextResponse.json(store.seopages[index]);
  } catch (error) {
    return NextResponse.json({ message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pageId = parseInt(id, 10);
  
  const index = store.seopages.findIndex(p => p.id === pageId);
  if (index === -1) {
    return NextResponse.json({ message: 'Trang SEO không tồn tại' }, { status: 404 });
  }

  store.seopages.splice(index, 1);
  return NextResponse.json({ message: 'Xóa trang SEO thành công' });
}
