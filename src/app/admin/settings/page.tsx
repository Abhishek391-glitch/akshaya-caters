import { getSiteSettings } from '@/lib/db/adapter';
import SettingsManagerClient from '@/components/admin/SettingsManagerClient';

export const metadata = {
  title: 'Website Settings — Akshaya Caterers CMS',
};

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  return <SettingsManagerClient initialSettings={settings} />;
}
