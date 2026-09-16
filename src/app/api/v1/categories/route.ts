import { NextResponse } from 'next/server';
import { store } from '../store';

export async function GET() {
  return NextResponse.json(store.categories);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newCategory = {
      ...data,
      id: store.categories.length > 0 ? Math.max(...store.categories.map(c => c.id)) + 1 : 1,
    };
    store.categories.push(newCategory);
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
