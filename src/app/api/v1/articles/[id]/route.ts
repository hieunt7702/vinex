import { NextResponse } from 'next/server';
import { store } from '../../store';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const articleId = parseInt(id, 10);
  
  const index = store.articles.findIndex(a => a.id === articleId);
  if (index === -1) {
    return NextResponse.json({ message: 'Tin tức không tồn tại' }, { status: 404 });
  }

  try {
    const data = await request.json();
    store.articles[index] = { ...store.articles[index], ...data };
    return NextResponse.json(store.articles[index]);
  } catch (error) {
    return NextResponse.json({ message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const articleId = parseInt(id, 10);
  
  const index = store.articles.findIndex(a => a.id === articleId);
  if (index === -1) {
    return NextResponse.json({ message: 'Tin tức không tồn tại' }, { status: 404 });
  }

  const deleted = store.articles.splice(index, 1)[0];
  store.stats.totalArticles--;
  if (deleted.status === 'PUBLISHED') store.stats.publishedArticles--;

  return NextResponse.json({ message: 'Xóa thành công' });
}
