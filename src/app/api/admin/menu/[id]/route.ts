import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { saveMenuItem, deleteMenuItem } from '@/lib/db/adapter';
import { revalidatePath } from 'next/cache';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const updated = await saveMenuItem({ ...body, id });

    try {
      revalidatePath('/menu');
      revalidatePath('/admin/menu');
      revalidatePath('/');
    } catch (e) {
      // ignore
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update item error:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const ok = await deleteMenuItem(id);
    if (!ok) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    try {
      revalidatePath('/menu');
      revalidatePath('/admin/menu');
      revalidatePath('/');
    } catch (e) {
      // ignore
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
