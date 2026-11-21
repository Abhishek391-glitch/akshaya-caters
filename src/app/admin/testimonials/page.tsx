import { getTestimonials } from '@/lib/db/adapter';
import TestimonialsManagerClient from '@/components/admin/TestimonialsManagerClient';

export const metadata = {
  title: 'Testimonials Management — Akshaya Caterers CMS',
};

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();
  return <TestimonialsManagerClient initialTestimonials={testimonials} />;
}
