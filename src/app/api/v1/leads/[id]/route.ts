import { NextResponse } from 'next/server';
import { store } from '../../store';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leadId = parseInt(id, 10);
  
  const index = store.leads.findIndex(l => l.id === leadId);
  if (index === -1) {
    return NextResponse.json({ message: 'Lead không tồn tại' }, { status: 404 });
  }

  try {
    const data = await request.json();
    store.leads[index] = { ...store.leads[index], ...data };
    return NextResponse.json(store.leads[index]);
  } catch (error) {
    return NextResponse.json({ message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leadId = parseInt(id, 10);
  
  const index = store.leads.findIndex(l => l.id === leadId);
  if (index === -1) {
    return NextResponse.json({ message: 'Lead không tồn tại' }, { status: 404 });
  }

  store.leads.splice(index, 1);
  store.stats.totalLeads--;

  return NextResponse.json({ message: 'Xóa thành công' });
}
