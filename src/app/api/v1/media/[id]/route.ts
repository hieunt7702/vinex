import { NextResponse } from 'next/server';
import { store } from '../../store';
import prisma from '@/lib/prisma';
import { handleCorsPreflight, getCorsHeaders } from '@/lib/cors';

export const dynamic = 'force-dynamic';

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: 'ID không hợp lệ' }, { status: 400 });
  }

  // 1. If the id is numeric → it's a Prisma/Cloudinary media row
  const numericId = Number(id);
  if (!isNaN(numericId) && String(numericId) === id.trim()) {
    if (process.env.DATABASE_URL) {
      try {
        await prisma.media.delete({ where: { id: numericId } });
        return NextResponse.json({ message: 'Xóa media thành công' });
      } catch (e: any) {
        if (e?.code === 'P2025') {
          return NextResponse.json({ message: 'Không tìm thấy file trong DB' }, { status: 404 });
        }
        console.warn('Prisma media delete error:', e);
        return NextResponse.json({ message: 'Lỗi xóa media' }, { status: 500 });
      }
    }
  }

  // 2. Non-numeric id → it's an in-memory / local store item (e.g. "local_product_image.png")
  if (!(store as any).media) {
    (store as any).media = [];
  }

  // Also check if it exists in store
  const index = (store as any).media.findIndex((m: any) => m.id === id || String(m.id) === id);
  if (index !== -1) {
    (store as any).media.splice(index, 1);
    return NextResponse.json({ message: 'Xóa media thành công' });
  }

  // 3. "local_*" images are internal /public files — we don't physically delete them,
  //    but we return success so UI can remove from list without error
  if (id.startsWith('local_')) {
    return NextResponse.json({ message: 'Xóa media thành công' });
  }

  return NextResponse.json({ message: 'Không tìm thấy file' }, { status: 404 });
}
