import { NextResponse } from 'next/server';
import { store } from '../store';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import { handleCorsPreflight, getCorsHeaders } from '@/lib/cors';

export const dynamic = 'force-dynamic';

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

function getInternalImages(): any[] {
  const list: any[] = [];
  try {
    const publicImagesDir = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(publicImagesDir)) return list;

    // Scan directories: root, product, banner, news
    const subdirs = ['', 'product', 'banner', 'news'];
    for (const sub of subdirs) {
      const dirPath = sub ? path.join(publicImagesDir, sub) : publicImagesDir;
      if (!fs.existsSync(dirPath)) continue;

      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      for (const ent of entries) {
        if (!ent.isFile()) continue;
        const ext = path.extname(ent.name).toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(ext)) continue;

        const relUrl = sub ? `/images/${sub}/${ent.name}` : `/images/${ent.name}`;
        list.push({
          id: `local_${sub ? sub + '_' : ''}${ent.name}`,
          url: relUrl,
          name: ent.name.replace(/[-_]/g, ' '),
          type: `Nội bộ: ${sub ? sub.toUpperCase() : 'HỆ THỐNG'}`,
          size: 0,
          createdAt: new Date().toISOString()
        });
      }
    }
  } catch (e) {
    // Ignore if file system error
  }
  return list;
}

export async function GET() {
  const result: any[] = [];
  const seenUrls = new Set<string>();

  // 1. Prisma Media (Cloudinary uploads in DB)
  if (process.env.DATABASE_URL) {
    try {
      const dbMedia = await prisma.media.findMany({
        orderBy: { createdAt: 'desc' }
      });
      for (const m of dbMedia) {
        if (!seenUrls.has(m.url)) {
          seenUrls.add(m.url);
          result.push({
            id: m.id,
            url: m.url,
            name: m.name || 'Cloudinary Media',
            type: 'Cloudinary',
            size: m.size || 0,
            createdAt: m.createdAt
          });
        }
      }
    } catch (e) {
      // Ignore
    }
  }

  // 2. In-memory store.media
  const storeMedia = (store as any).media || [];
  for (const m of storeMedia) {
    if (!seenUrls.has(m.url)) {
      seenUrls.add(m.url);
      result.push(m);
    }
  }

  // 3. Local internal images from /images/
  const localImages = getInternalImages();
  for (const m of localImages) {
    if (!seenUrls.has(m.url)) {
      seenUrls.add(m.url);
      result.push(m);
    }
  }

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newMedia = {
      id: `media_${Date.now()}`,
      url: data.url,
      name: data.name || 'Ảnh tải lên',
      type: data.type || 'Cloudinary',
      size: data.size || 0,
      createdAt: new Date().toISOString()
    };

    if (process.env.DATABASE_URL) {
      try {
        await prisma.media.create({
          data: {
            url: data.url,
            name: data.name || 'Ảnh tải lên',
            type: data.type || 'image/jpeg',
            size: data.size || 0
          }
        });
      } catch (e) {}
    }

    if (!(store as any).media) {
      (store as any).media = [];
    }
    (store as any).media.unshift(newMedia);
    return NextResponse.json(newMedia, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi thêm media' }, { status: 400 });
  }
}

/**
 * DELETE /api/v1/media
 * Body: { ids: string[] }
 * Bulk-delete multiple media items in a single request.
 * - Numeric IDs → Prisma deleteMany (single DB round-trip)
 * - String IDs ("local_*") → remove from in-memory store in one pass
 */
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const ids: string[] = Array.isArray(body?.ids) ? body.ids : [];

    if (ids.length === 0) {
      return NextResponse.json({ message: 'Không có ID nào được cung cấp', deleted: 0 }, { status: 400 });
    }

    let dbDeleted = 0;

    // 1. Collect numeric IDs → single Prisma deleteMany call
    const numericIds = ids
      .map(id => Number(id))
      .filter(n => !isNaN(n) && n > 0);

    if (numericIds.length > 0 && process.env.DATABASE_URL) {
      try {
        const result = await prisma.media.deleteMany({
          where: { id: { in: numericIds } }
        });
        dbDeleted = result.count;
      } catch (e) {
        console.warn('Prisma bulk media delete error:', e);
      }
    }

    // 2. Remove all matching IDs from in-memory store in one pass
    const idSet = new Set(ids.map(String));
    if (!(store as any).media) (store as any).media = [];
    const before = (store as any).media.length;
    (store as any).media = (store as any).media.filter((m: any) => !idSet.has(String(m.id)));
    const storeDeleted = before - (store as any).media.length;

    const totalDeleted = dbDeleted + storeDeleted;
    return NextResponse.json({
      message: `Đã xóa ${totalDeleted} ảnh thành công`,
      deleted: totalDeleted,
    });
  } catch (error) {
    console.error('Bulk media delete error:', error);
    return NextResponse.json({ message: 'Lỗi khi xóa media hàng loạt' }, { status: 500 });
  }
}

