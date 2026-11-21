'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, MessageSquare, ChevronRight, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { SiteSettings } from '@/lib/db/types';
import { useCart } from '@/lib/cart/CartContext';

interface NavbarProps {
  settings?: SiteSettings;
}

export default function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { totalCount, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Food Menu', href: '/menu' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'About Us', href: '/#about' },
    { name: 'Contact', href: '/contact' },
  ];

  const whatsappNumber = settings?.whatsapp_number?.replace(/[^0-9]/g, '') || '917075968859';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hello Akshaya Caterers, I would like to enquire about your catering services.'
  )}`;

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF9F4]/98 backdrop-blur-md shadow-sm border-b border-[#E5E1D5]'
            : 'bg-[#FAF9F4] border-b border-[#E5E1D5]/60'
        }`}
      >
        {/* Top Contact Strip (Desktop) */}
        <div className="hidden lg:block bg-[#244C3A] text-[#FAF9F4] text-xs py-2 px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <p className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#C6A66B]"></span>
              Authentic Indian Cuisine & Premium Event Hospitality
            </p>
            <div className="flex items-center gap-6">
              <span className="text-[#C6A66B] font-medium">{settings?.opening_hours || 'Mon-Sun: 8:00 AM – 10:00 PM'}</span>
              <a
                href={`tel:${settings?.contact_phone || '+919876543210'}`}
                className="flex items-center gap-1.5 hover:text-[#C6A66B] transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{settings?.contact_phone || '+91 98765 43210'}</span>
              </a>
              <Link href="/admin/login" className="text-white/60 hover:text-white transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#244C3A] flex items-center justify-center text-[#C6A66B] shadow-sm shrink-0 transition-transform group-hover:scale-105">
                <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-[#244C3A] leading-tight truncate">
                  {settings?.business_name || 'Akshaya Caterers'}
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-widest uppercase text-[#8FA58A] font-semibold truncate">
                  Pure Taste & Royal Hospitality
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'text-[#244C3A] font-semibold bg-[#F1EFE5]'
                        : 'text-[#252923] hover:text-[#244C3A] hover:bg-[#F1EFE5]/50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {/* Cart Button */}
              <button
                type="button"
                onClick={openCart}
                className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#244C3A] bg-[#F1EFE5] hover:bg-[#E5E1D5] rounded-xl transition-all shadow-2xs border border-[#8FA58A]/30 cursor-pointer"
                title="View your catering cart"
              >
                <ShoppingBag className="w-4 h-4 text-[#244C3A]" />
                <span>Cart</span>
                {totalCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#244C3A] text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in-50">
                    {totalCount}
                  </span>
                )}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#244C3A] bg-[#8FA58A]/20 hover:bg-[#8FA58A]/30 rounded-lg transition-colors"
                title="Chat with us on WhatsApp"
              >
                <MessageSquare className="w-4 h-4 text-[#244C3A]" />
                <span>WhatsApp</span>
              </a>

              <Link
                href="/contact"
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#244C3A] hover:bg-[#193629] rounded-lg shadow-sm transition-all hover:shadow"
              >
                <span>Get a Quote</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C6A66B]" />
              </Link>
            </div>

            {/* Mobile Header Actions */}
            <div className="flex items-center md:hidden gap-1.5">
              {/* Mobile Cart Button */}
              <button
                type="button"
                onClick={openCart}
                className="relative p-2 text-[#244C3A] bg-[#F1EFE5] rounded-lg border border-[#8FA58A]/30"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-4 h-4 text-[#244C3A]" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#244C3A] text-white text-[9px] font-bold flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </button>
              <a
                href={`tel:${settings?.contact_phone || '+919876543210'}`}
                className="p-2 text-[#244C3A] bg-[#F1EFE5] rounded-lg border border-[#8FA58A]/20"
                aria-label="Call Akshaya Caterers"
              >
                <Phone className="w-4 h-4" />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-[#244C3A] bg-[#8FA58A]/20 rounded-lg"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-[#252923] hover:text-[#244C3A] hover:bg-[#F1EFE5] transition-colors ml-1"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="w-6 h-6 text-[#244C3A]" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Full-screen Backdrop & Drawer */}
        {isOpen && (
          <div className="md:hidden fixed inset-x-0 top-[65px] bottom-0 z-40 bg-black/50 backdrop-blur-xs flex flex-col justify-start">
            <div
              className="bg-[#FAF9F4] border-b border-[#E5E1D5] px-4 pt-3 pb-8 space-y-4 max-h-[85vh] overflow-y-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      pathname === link.href
                        ? 'text-[#244C3A] font-bold bg-[#F1EFE5]'
                        : 'text-[#252923] active:bg-[#F1EFE5]'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="pt-3 border-t border-[#E5E1D5] flex flex-col gap-3">
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#244C3A] active:bg-[#193629] rounded-xl shadow-sm"
                >
                  Request Custom Quotation
                </Link>

                <div className="flex items-center justify-between text-xs text-[#747970] pt-1 px-2">
                  <a
                    href={`tel:${settings?.contact_phone || '+919876543210'}`}
                    className="flex items-center gap-1.5 font-semibold text-[#244C3A]"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{settings?.contact_phone || '+91 98765 43210'}</span>
                  </a>
                  <Link
                    href="/admin/login"
                    onClick={() => setIsOpen(false)}
                    className="text-[#747970] hover:text-[#244C3A] font-medium"
                  >
                    Admin Login →
                  </Link>
                </div>
              </div>
            </div>
            {/* Click backdrop to close */}
            <div className="flex-1" onClick={() => setIsOpen(false)} />
          </div>
        )}
      </header>
    </>
  );
}
