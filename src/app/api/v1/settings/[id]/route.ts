import { NextResponse } from 'next/server';
import { store } from '../../store';
import { handleCorsPreflight, getCorsHeaders } from '@/lib/cors';

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const settingId = parseInt(id, 10);
  const item = store.settings.find((s: any) => s.id === settingId);
  if (!item) {
    return NextResponse.json({ message: 'Cài đặt không tồn tại' }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const settingId = parseInt(id, 10);

  const index = store.settings.findIndex((s: any) => s.id === settingId);
  if (index === -1) {
    return NextResponse.json({ message: 'Cài đặt không tồn tại' }, { status: 404 });
  }

  try {
    const data = await request.json();
    store.settings[index] = {
      ...store.settings[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return NextResponse.json(store.settings[index]);
  } catch (error) {
    return NextResponse.json({ message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return PATCH(request, { params });
}
