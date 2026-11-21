import { getEnquiries } from '@/lib/db/adapter';
import EnquiriesManagerClient from '@/components/admin/EnquiriesManagerClient';

export const metadata = {
  title: 'Customer Enquiries & Leads — Akshaya Caterers CMS',
};

export const dynamic = 'force-dynamic';

export default async function AdminEnquiriesPage() {
  const enquiries = await getEnquiries();
  return <EnquiriesManagerClient initialEnquiries={enquiries} />;
}
