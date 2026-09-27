import { NextResponse } from 'next/server';
import { store } from '../../store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    },
  });
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const articleId = parseInt(id, 10);
  
  const article = store.articles.find(a => 
    (!isNaN(articleId) && a.id === articleId) || 
    String(a.id) === String(id) || 
    a.slug === id
  );

  if (!article) {
    return NextResponse.json({ message: 'Tin tức không tồn tại' }, { status: 404 });
  }

  return NextResponse.json(article);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const articleId = parseInt(id, 10);
  
  const index = store.articles.findIndex(a => 
    (!isNaN(articleId) && a.id === articleId) || 
    String(a.id) === String(id) || 
    a.slug === id
  );

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
  
  const index = store.articles.findIndex(a => 
    (!isNaN(articleId) && a.id === articleId) || 
    String(a.id) === String(id) || 
    a.slug === id
  );

  if (index === -1) {
    return NextResponse.json({ message: 'Tin tức không tồn tại' }, { status: 404 });
  }

  const deleted = store.articles.splice(index, 1)[0];
  store.stats.totalArticles = Math.max(0, store.stats.totalArticles - 1);
  if (deleted?.status === 'PUBLISHED') {
    store.stats.publishedArticles = Math.max(0, store.stats.publishedArticles - 1);
  }

  return NextResponse.json({ message: 'Xóa thành công' });
}
