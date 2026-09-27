import { NextResponse } from 'next/server';
import { store } from '../store';

export async function GET() {
  return NextResponse.json(store.settings);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const existingIndex = store.settings.findIndex((s: any) => s.key === data.key);

    if (existingIndex !== -1) {
      store.settings[existingIndex] = {
        ...store.settings[existingIndex],
        ...data,
        updatedAt: new Date().toISOString()
      };
      return NextResponse.json(store.settings[existingIndex]);
    }

    const newSetting = {
      ...data,
      id: store.settings.length > 0 ? Math.max(...store.settings.map((s: any) => s.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.settings.push(newSetting);
    return NextResponse.json(newSetting, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
