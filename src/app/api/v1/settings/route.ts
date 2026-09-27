import { NextResponse } from 'next/server';
import { store, savePersistedData } from '../store';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { handleCorsPreflight } from '@/lib/cors';

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

export async function GET() {
  if (process.env.DATABASE_URL) {
    try {
      const dbSettings = await prisma.setting.findMany({
        orderBy: { id: 'asc' }
      });
      if (dbSettings && dbSettings.length > 0) {
        return NextResponse.json(dbSettings);
      }
    } catch (e) {
      // fallback
    }
  }
  return NextResponse.json(store?.settings || []);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const key = data.key;
    const value = typeof data.value === 'string' ? data.value : JSON.stringify(data.value);

    let savedSetting: any = null;

    if (process.env.DATABASE_URL && key) {
      try {
        savedSetting = await prisma.setting.upsert({
          where: { key },
          update: { 
            value,
            updatedAt: new Date()
          },
          create: { 
            key, 
            value 
          }
        });
      } catch (dbErr) {
        console.error('Prisma setting upsert error:', dbErr);
      }
    }

    if (store?.settings) {
      const existingIndex = store.settings.findIndex((s: any) => s.key === key);

      if (existingIndex !== -1) {
        store.settings[existingIndex] = {
          ...store.settings[existingIndex],
          ...data,
          value,
          updatedAt: new Date().toISOString()
        };
        savePersistedData();
        return NextResponse.json(savedSetting || store.settings[existingIndex]);
      }

      const newSetting = {
        ...data,
        id: savedSetting?.id || (store.settings.length > 0 ? Math.max(...store.settings.map((s: any) => s.id)) + 1 : 1),
        value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      store.settings.push(newSetting);
      savePersistedData();
      return NextResponse.json(savedSetting || newSetting, { status: 201 });
    }

    return NextResponse.json(savedSetting || { key, value }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
