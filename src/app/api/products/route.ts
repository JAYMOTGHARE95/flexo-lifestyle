import { NextRequest, NextResponse } from 'next/server';
import { getServerStoreData, saveServerStoreData } from '@/lib/server-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const data = getServerStoreData();
  return NextResponse.json({ products: data.products }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { products } = await req.json();
    if (!Array.isArray(products)) {
      return NextResponse.json({ error: 'products must be an array' }, { status: 400 });
    }
    const updated = saveServerStoreData({ products });
    return NextResponse.json({ success: true, products: updated.products });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save products' }, { status: 500 });
  }
}
