import { NextResponse } from 'next/server';
import { store } from '../store';

export async function GET() {
  const sorted = [...store.products].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (diff !== 0) return diff;
    }
    return (Number(b.id) || 0) - (Number(a.id) || 0);
  });
  return NextResponse.json(sorted);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newProduct = {
      ...data,
      id: store.products.length > 0 ? Math.max(...store.products.map(p => p.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    };
    store.products.push(newProduct);
    
    // update stats
    store.stats.totalProducts++;
    store.stats.activeProducts++;

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
