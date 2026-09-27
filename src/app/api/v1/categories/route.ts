import { NextResponse } from 'next/server';
import { store } from '../store';

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

export async function GET() {
  return NextResponse.json(store.categories, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    },
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newCategory = {
      ...data,
      id: store.categories.length > 0 ? Math.max(...store.categories.map(c => Number(c.id) || 0)) + 1 : 1,
      status: data.status || 'ACTIVE'
    };
    store.categories.push(newCategory);
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
