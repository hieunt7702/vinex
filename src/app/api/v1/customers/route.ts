import { NextResponse } from 'next/server';
import { store } from '../store';

export async function GET() {
  return NextResponse.json(store.customers);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newCustomer = {
      ...data,
      id: store.customers.length > 0 ? Math.max(...store.customers.map(c => c.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    };
    store.customers.push(newCustomer);
    store.stats.totalCustomers++;
    
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
