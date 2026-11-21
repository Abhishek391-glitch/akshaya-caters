'use client';

import { CartProvider } from '@/lib/cart/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';
import { SiteSettings } from '@/lib/db/types';

export default function CartWrapper({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings?: SiteSettings;
}) {
  return (
    <CartProvider>
      {children}
      <CartDrawer settings={settings} />
    </CartProvider>
  );
}
