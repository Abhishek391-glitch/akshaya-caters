import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getCategories, saveCategory } from '@/lib/db/adapter';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const saved = await saveCategory(body);
    try {
      revalidatePath('/menu');
      revalidatePath('/admin/menu');
      revalidatePath('/admin/categories');
      revalidatePath('/');
    } catch (e) {
      // ignore
    }
    return NextResponse.json(saved);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
