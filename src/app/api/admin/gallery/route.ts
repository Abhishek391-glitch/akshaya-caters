import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getGallery, saveGalleryItem } from '@/lib/db/adapter';

export async function GET() {
  try {
    const items = await getGallery();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.image_url) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const saved = await saveGalleryItem(body);
    return NextResponse.json(saved);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save gallery item' }, { status: 500 });
  }
}
