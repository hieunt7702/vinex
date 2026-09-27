import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function cleanStr(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[`'"]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
};

function serveFile(filePath: string): Response {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const buffer = fs.readFileSync(filePath);

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (err) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: rawSegments } = await params;
  if (!rawSegments || rawSegments.length === 0) {
    return new NextResponse('Not found', { status: 404 });
  }

  const decodedSegments = rawSegments.map((seg) => {
    try {
      return decodeURIComponent(seg);
    } catch {
      return seg;
    }
  });

  const publicImagesRoot = path.join(process.cwd(), 'public', 'images');
  const targetPath = path.resolve(publicImagesRoot, ...decodedSegments);

  // Security: prevent directory traversal outside public/images
  if (!targetPath.startsWith(publicImagesRoot)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // 1. Direct file check
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
    return serveFile(targetPath);
  }

  // 2. Fuzzy / diacritics / casing check in the parent directory
  const parentDir = path.dirname(targetPath);
  const targetFilename = path.basename(targetPath);

  if (fs.existsSync(parentDir) && fs.statSync(parentDir).isDirectory()) {
    try {
      const files = fs.readdirSync(parentDir);
      const cleanTarget = cleanStr(targetFilename);

      // Try exact clean match
      let match = files.find((f) => cleanStr(f) === cleanTarget);

      // If no exact clean match, try prefix match (e.g. "xoai say deo 1.png" -> "xoài sấy dẻo.png")
      if (!match) {
        const targetBase = cleanTarget.replace(/\.(png|jpe?g|webp|svg)$/i, '');
        match = files.find((f) => {
          const fBase = cleanStr(f).replace(/\.(png|jpe?g|webp|svg)$/i, '');
          return targetBase.startsWith(fBase) || fBase.startsWith(targetBase);
        });
      }

      if (match) {
        const matchedPath = path.join(parentDir, match);
        if (fs.existsSync(matchedPath) && fs.statSync(matchedPath).isFile()) {
          return serveFile(matchedPath);
        }
      }
    } catch {
      // Continue to fallback
    }
  }

  // 3. Graceful fallback if file does not exist anywhere
  // For product images, fall back to default cashew product image
  const isProduct = decodedSegments[0] === 'product';
  const fallbackFile = isProduct
    ? path.join(publicImagesRoot, 'product', 'Cashew1.png')
    : path.join(publicImagesRoot, 'placeholder.jpg');

  if (fs.existsSync(fallbackFile)) {
    return serveFile(fallbackFile);
  }

  return new NextResponse('Image not found', { status: 404 });
}
