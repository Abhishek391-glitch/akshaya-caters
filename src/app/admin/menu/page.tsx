import { getMenuItems, getCategories } from '@/lib/db/adapter';
import MenuManagerClient from '@/components/admin/MenuManagerClient';

export const metadata = {
  title: 'Menu Items Management — Akshaya Caterers CMS',
};

export const dynamic = 'force-dynamic';

export default async function AdminMenuPage() {
  const [items, categories] = await Promise.all([
    getMenuItems(),
    getCategories(),
  ]);

  return <MenuManagerClient initialItems={items} categories={categories} />;
}
