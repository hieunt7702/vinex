import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { store } from '@/app/api/v1/store';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ message: 'Không có file nào được tải lên' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name) || '.jpg';
      const cleanBaseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueName = `${Date.now()}_${cleanBaseName}${ext}`;
      const filePath = path.join(uploadDir, uniqueName);

      await writeFile(filePath, buffer);
      const fileUrl = `/uploads/${uniqueName}`;
      uploadedUrls.push(fileUrl);

      // Record to store.media if available
      if ((store as any).media) {
        (store as any).media.unshift({
          id: `media_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          url: fileUrl,
          name: file.name,
          size: file.size,
          createdAt: new Date().toISOString()
        });
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json({ message: 'Định dạng file không hợp lệ. Vui lòng chọn ảnh PNG, JPG, WEBP.' }, { status: 400 });
    }

    return NextResponse.json(uploadedUrls, { status: 201 });
  } catch (error: any) {
    console.error('Lỗi khi tải ảnh:', error);
    return NextResponse.json({ message: 'Lỗi máy chủ khi xử lý tải ảnh' }, { status: 500 });
  }
}
