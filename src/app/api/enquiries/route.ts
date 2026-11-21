import { NextRequest, NextResponse } from 'next/server';
import { createEnquiry, getEnquiries } from '@/lib/db/adapter';
import { getAdminSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Spam honeypot check: bot filled out hidden field
    if (body.website_url || body.hp_company) {
      // Silently accept without saving to thwart bot re-attempts
      return NextResponse.json({ success: true, message: 'Enquiry received' });
    }

    const {
      customer_name,
      phone,
      email,
      enquiry_type,
      subject,
      message,
      event_type,
      event_date,
      event_location,
      guest_count,
      food_preference,
      budget,
    } = body;

    if (!customer_name || !customer_name.trim()) {
      return NextResponse.json({ error: 'Customer name is required' }, { status: 400 });
    }

    if (!phone || !phone.trim() || phone.trim().length < 8) {
      return NextResponse.json({ error: 'A valid phone number is required' }, { status: 400 });
    }

    const newEnquiry = await createEnquiry({
      customer_name: customer_name.trim(),
      phone: phone.trim(),
      email: email?.trim() || '',
      enquiry_type: enquiry_type === 'quotation' ? 'quotation' : 'general',
      subject: subject?.trim() || '',
      message: message?.trim() || '',
      event_type: event_type || '',
      event_date: event_date || undefined,
      event_location: event_location?.trim() || '',
      guest_count: guest_count ? Number(guest_count) : undefined,
      food_preference: food_preference || 'Both',
      budget: budget?.trim() || '',
    });

    return NextResponse.json({
      success: true,
      message: 'Your enquiry has been submitted successfully! Our team will contact you shortly.',
      enquiryId: newEnquiry.id,
    });
  } catch (error) {
    console.error('Enquiry submission error:', error);
    return NextResponse.json({ error: 'Failed to submit enquiry. Please try again.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const status = request.nextUrl.searchParams.get('status') as any;
    const enquiries = await getEnquiries(status || undefined);
    return NextResponse.json(enquiries);
  } catch (error) {
    console.error('Fetch enquiries error:', error);
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}
