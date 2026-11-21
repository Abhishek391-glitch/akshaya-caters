import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getTestimonials, saveTestimonial } from '@/lib/db/adapter';

export async function GET() {
  try {
    const list = await getTestimonials();
    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.customer_name || !body.review) {
      return NextResponse.json({ error: 'Name and review text are required' }, { status: 400 });
    }

    const saved = await saveTestimonial(body);
    return NextResponse.json(saved);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save testimonial' }, { status: 500 });
  }
}
