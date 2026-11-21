import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { saveCategory, deleteCategory } from '@/lib/db/adapter';
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
    const updated = await saveCategory({ ...body, id });

    try {
      revalidatePath('/menu');
      revalidatePath('/admin/menu');
      revalidatePath('/admin/categories');
      revalidatePath('/');
    } catch (e) {
      // ignore
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
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
    const result = await deleteCategory(id);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to delete category' }, { status: 400 });
    }

    try {
      revalidatePath('/menu');
      revalidatePath('/admin/menu');
      revalidatePath('/admin/categories');
      revalidatePath('/');
    } catch (e) {
      // ignore
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
