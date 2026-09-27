import { NextResponse } from 'next/server';
import { store } from '../store';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

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
