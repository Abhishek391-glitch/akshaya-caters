import { getCategories } from '@/lib/db/adapter';
import CategoryManagerClient from '@/components/admin/CategoryManagerClient';

export const metadata = {
  title: 'Categories Management — Akshaya Caterers CMS',
};

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return <CategoryManagerClient initialCategories={categories} />;
}
