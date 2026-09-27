import { NextResponse } from 'next/server';
import { store } from '../store';

export async function GET() {
  return NextResponse.json(store.seopages);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newPage = {
      ...data,
      id: store.seopages.length > 0 ? Math.max(...store.seopages.map(p => Number(p.id) || 0)) + 1 : 1,
      views: data.views || 0,
      conversionRate: data.conversionRate || '0%',
      updatedAt: new Date().toISOString()
    };
    store.seopages.unshift(newPage);
    
    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
