import { NextResponse } from 'next/server';
import { store } from '../../store';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(store as any).media) {
    (store as any).media = [];
  }
  const index = (store as any).media.findIndex((m: any) => m.id === id);
  if (index === -1) {
    return NextResponse.json({ message: 'Không tìm thấy file' }, { status: 404 });
  }

  (store as any).media.splice(index, 1);
  return NextResponse.json({ message: 'Xóa media thành công' });
}
