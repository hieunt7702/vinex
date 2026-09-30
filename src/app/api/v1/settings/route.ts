import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { store, savePersistedData } from '../store';
import prisma from '@/lib/prisma';
import { handleCorsPreflight, getCorsHeaders } from '@/lib/cors';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  const headers = { ...corsHeaders, ...NO_CACHE_HEADERS };

  if (process.env.DATABASE_URL) {
    try {
      const dbSettings = await prisma.setting.findMany({
        orderBy: { id: 'asc' },
      });
      if (dbSettings && dbSettings.length > 0) {
        return NextResponse.json(dbSettings, { headers });
      }
    } catch (e) {
      console.warn('Prisma get settings fallback:', e);
    }
  }
  return NextResponse.json(store?.settings || [], { headers });
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  const headers = { ...corsHeaders, ...NO_CACHE_HEADERS };

  try {
    const data = await request.json();
    const key = data.key || 'GLOBAL_SETTINGS';
    const value = typeof data.value === 'string' ? data.value : JSON.stringify(data.value);

    let savedSetting: any = null;

    if (process.env.DATABASE_URL && key) {
      try {
        savedSetting = await prisma.setting.upsert({
          where: { key },
          update: { 
            value,
            updatedAt: new Date(),
          },
          create: { 
            key, 
            value,
          },
        });
      } catch (dbErr) {
        console.error('Prisma setting upsert error:', dbErr);
      }
    }

    try {
      revalidatePath('/', 'layout');
    } catch (_) {}

    if (store?.settings) {
      const existingIndex = store.settings.findIndex((s: any) => s.key === key);

      if (existingIndex !== -1) {
        store.settings[existingIndex] = {
          ...store.settings[existingIndex],
          ...data,
          value,
          updatedAt: new Date().toISOString(),
        };
        savePersistedData();
        return NextResponse.json(savedSetting || store.settings[existingIndex], { headers });
      }

      const newSetting = {
        ...data,
        id: savedSetting?.id || (store.settings.length > 0 ? Math.max(...store.settings.map((s: any) => s.id)) + 1 : 1),
        value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.settings.push(newSetting);
      savePersistedData();
      return NextResponse.json(savedSetting || newSetting, { status: 201, headers });
    }

    return NextResponse.json(savedSetting || { key, value }, { status: 200, headers });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400, headers });
  }
}
