import { getServices } from '@/lib/db/adapter';
import ServicesManagerClient from '@/components/admin/ServicesManagerClient';

export const metadata = {
  title: 'Services Management — Akshaya Caterers CMS',
};

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  const services = await getServices();
  return <ServicesManagerClient initialServices={services} />;
}
