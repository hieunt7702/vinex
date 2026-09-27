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
  const decodedId = decodeURIComponent(id).toLowerCase().trim();

  const product = store.products.find(p => 
    String(p.id) === decodedId || 
    (p.slug && decodeURIComponent(p.slug).toLowerCase().trim() === decodedId) ||
    (p.productId && p.productId.toLowerCase().trim() === decodedId)
  );

  if (!product) {
    return NextResponse.json({ message: 'Sản phẩm không tồn tại' }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).toLowerCase().trim();
  
  const index = store.products.findIndex(p => 
    String(p.id) === decodedId || 
    (p.slug && decodeURIComponent(p.slug).toLowerCase().trim() === decodedId) ||
    (p.productId && p.productId.toLowerCase().trim() === decodedId)
  );
  if (index === -1) {
    return NextResponse.json({ message: 'Sản phẩm không tồn tại' }, { status: 404 });
  }

  try {
    const data = await request.json();
    store.products[index] = { ...store.products[index], ...data };
    return NextResponse.json(store.products[index]);
  } catch (error) {
    return NextResponse.json({ message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).toLowerCase().trim();
  
  const index = store.products.findIndex(p => 
    String(p.id) === decodedId || 
    (p.slug && decodeURIComponent(p.slug).toLowerCase().trim() === decodedId) ||
    (p.productId && p.productId.toLowerCase().trim() === decodedId)
  );
  if (index === -1) {
    return NextResponse.json({ message: 'Sản phẩm không tồn tại' }, { status: 404 });
  }

  store.products.splice(index, 1);
  if (store.stats.totalProducts > 0) store.stats.totalProducts--;

  return NextResponse.json({ message: 'Xóa thành công' });
}
