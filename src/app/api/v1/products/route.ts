import { NextResponse } from 'next/server';
import { store } from '../store';

export async function GET() {
  return NextResponse.json(store.products);
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
