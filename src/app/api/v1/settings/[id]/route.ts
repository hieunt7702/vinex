import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { store, savePersistedData } from '../../store';
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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  const headers = { ...corsHeaders, ...NO_CACHE_HEADERS };

  const { id } = await params;
  const settingId = parseInt(id, 10);

  if (process.env.DATABASE_URL) {
    try {
      if (!isNaN(settingId)) {
        const dbItem = await prisma.setting.findUnique({ where: { id: settingId } });
        if (dbItem) return NextResponse.json(dbItem, { headers });
      } else {
        const dbItem = await prisma.setting.findUnique({ where: { key: id } });
        if (dbItem) return NextResponse.json(dbItem, { headers });
      }
    } catch (e) {
      console.warn('Prisma get setting by id fallback:', e);
    }
  }

  const item = store?.settings?.find((s: any) => s.id === settingId || s.key === id);
  if (!item) {
    return NextResponse.json({ message: 'Cài đặt không tồn tại' }, { status: 404, headers });
  }
  return NextResponse.json(item, { headers });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  const headers = { ...corsHeaders, ...NO_CACHE_HEADERS };

  const { id } = await params;
  const settingId = parseInt(id, 10);

  try {
    const data = await request.json();
    const key = data.key || 'GLOBAL_SETTINGS';
    const value = typeof data.value === 'string' ? data.value : (data.value !== undefined ? JSON.stringify(data.value) : undefined);

    let updatedDbSetting: any = null;

    if (process.env.DATABASE_URL) {
      try {
        if (!isNaN(settingId)) {
          updatedDbSetting = await prisma.setting.update({
            where: { id: settingId },
            data: {
              ...(key ? { key } : {}),
              ...(value !== undefined ? { value } : {}),
              updatedAt: new Date(),
            },
          });
        } else if (key) {
          updatedDbSetting = await prisma.setting.upsert({
            where: { key },
            update: {
              ...(value !== undefined ? { value } : {}),
              updatedAt: new Date(),
            },
            create: {
              key,
              value: value || '',
            },
          });
        }
      } catch (dbErr) {
        console.error('Prisma patch setting error:', dbErr);
      }
    }

    try {
      revalidatePath('/', 'layout');
    } catch (_) {}

    if (store?.settings) {
      const index = store.settings.findIndex((s: any) => s.id === settingId || (key && s.key === key));
      if (index !== -1) {
        store.settings[index] = {
          ...store.settings[index],
          ...data,
          ...(value !== undefined ? { value } : {}),
          updatedAt: new Date().toISOString(),
        };
        savePersistedData();
      }
    }

    return NextResponse.json(updatedDbSetting || { id: settingId, ...data }, { headers });
  } catch (error: any) {
    return NextResponse.json({ message: 'Dữ liệu không hợp lệ: ' + error.message }, { status: 400, headers });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return PATCH(request, { params });
}
