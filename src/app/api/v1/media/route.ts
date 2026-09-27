import { NextResponse } from 'next/server';
import { store } from '../store';

export async function GET() {
  const mediaList = (store as any).media || [];
  return NextResponse.json(mediaList);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newMedia = {
      id: `media_${Date.now()}`,
      url: data.url,
      name: data.name || 'Ảnh tải lên',
      size: data.size || 0,
      createdAt: new Date().toISOString()
    };
    if (!(store as any).media) {
      (store as any).media = [];
    }
    (store as any).media.unshift(newMedia);
    return NextResponse.json(newMedia, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi thêm media' }, { status: 400 });
  }
}
