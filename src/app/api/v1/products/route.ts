import { NextResponse } from 'next/server';
import { store, savePersistedData } from '../store';

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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    const id = url.searchParams.get('id');

    if (slug) {
      const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();
      const product = store.products.find(p => 
        p.slug && decodeURIComponent(p.slug).toLowerCase().trim() === decodedSlug
      );
      if (product) {
        return NextResponse.json(product);
      }
      return NextResponse.json({ message: 'Sản phẩm không tồn tại' }, { status: 404 });
    }

    if (id) {
      const decodedId = decodeURIComponent(id).toLowerCase().trim();
      const product = store.products.find(p => 
        String(p.id) === decodedId || 
        (p.productId && p.productId.toLowerCase().trim() === decodedId)
      );
      if (product) {
        return NextResponse.json(product);
      }
      return NextResponse.json({ message: 'Sản phẩm không tồn tại' }, { status: 404 });
    }

    const sorted = [...store.products].sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (diff !== 0) return diff;
      }
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });
    return NextResponse.json(sorted);
  } catch (err) {
    return NextResponse.json([...store.products]);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newProduct = {
      ...data,
      id: store.products.length > 0 ? Math.max(...store.products.map(p => Number(p.id) || 0)) + 1 : 1,
      status: data.status || 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    store.products.push(newProduct);
    savePersistedData();
    
    // update stats
    store.stats.totalProducts++;
    store.stats.activeProducts++;

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
