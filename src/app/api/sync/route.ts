import { NextRequest, NextResponse } from 'next/server';
import { getServerStoreData, saveServerStoreData } from '@/lib/server-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const data = getServerStoreData();
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'CDN-Cache-Control': 'no-store',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = saveServerStoreData(body);
    return NextResponse.json({ success: true, data: updated }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update store data' }, { status: 500 });
  }
}
