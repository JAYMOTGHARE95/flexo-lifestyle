import { NextRequest, NextResponse } from 'next/server';
import { getServerStoreData, saveServerStoreData } from '@/lib/server-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const data = getServerStoreData();
  return NextResponse.json({ categories: data.categories }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { categories } = await req.json();
    if (!Array.isArray(categories)) {
      return NextResponse.json({ error: 'categories must be an array' }, { status: 400 });
    }
    const updated = saveServerStoreData({ categories });
    return NextResponse.json({ success: true, categories: updated.categories });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save categories' }, { status: 500 });
  }
}
