import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getMenuItems, saveMenuItem, updateMenuItemPrice } from '@/lib/db/adapter';

export async function GET() {
  try {
    const items = await getMenuItems();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.name || !body.category_id || body.price === undefined) {
      return NextResponse.json({ error: 'Name, category, and price are required' }, { status: 400 });
    }

    const saved = await saveMenuItem(body);
    return NextResponse.json(saved);
  } catch (error) {
    console.error('Save menu item error:', error);
    return NextResponse.json({ error: 'Failed to save menu item' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, price } = await request.json();
    if (!id || price === undefined) {
      return NextResponse.json({ error: 'Item ID and new price are required' }, { status: 400 });
    }

    const ok = await updateMenuItemPrice(id, Number(price));
    if (!ok) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update price' }, { status: 500 });
  }
}
