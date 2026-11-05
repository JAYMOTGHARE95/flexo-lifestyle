import { NextRequest, NextResponse } from 'next/server';
import { getServerStoreData, saveServerStoreData } from '@/lib/server-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const data = getServerStoreData();
  return NextResponse.json({ settings: data.settings }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { settings } = await req.json();
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'settings must be an object' }, { status: 400 });
    }
    const updated = saveServerStoreData({ settings });
    return NextResponse.json({ success: true, settings: updated.settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save settings' }, { status: 500 });
  }
}
