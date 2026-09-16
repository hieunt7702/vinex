import { NextResponse } from 'next/server';
import { store } from '../store';

export async function GET() {
  return NextResponse.json(store.articles);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newArticle = {
      ...data,
      id: store.articles.length > 0 ? Math.max(...store.articles.map(a => a.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    };
    store.articles.push(newArticle);
    store.stats.totalArticles++;
    if (newArticle.status === 'PUBLISHED') store.stats.publishedArticles++;
    
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
