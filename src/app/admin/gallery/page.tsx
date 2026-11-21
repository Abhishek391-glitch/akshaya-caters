import { getGallery } from '@/lib/db/adapter';
import GalleryManagerClient from '@/components/admin/GalleryManagerClient';

export const metadata = {
  title: 'Gallery Management — Akshaya Caterers CMS',
};

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  const gallery = await getGallery();
  return <GalleryManagerClient initialGallery={gallery} />;
}
