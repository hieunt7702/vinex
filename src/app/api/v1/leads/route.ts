import { NextResponse } from 'next/server';
import { store } from '../store';

export async function GET() {
  return NextResponse.json(store.leads);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newLead = {
      ...data,
      id: store.leads.length > 0 ? Math.max(...store.leads.map(l => l.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    };
    store.leads.push(newLead);
    store.stats.totalLeads++;
    
    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
