-- ==============================================================================
-- AKSHAYA CATERERS — SUPABASE DATABASE SCHEMA MIGRATION
-- Compatible with PostgreSQL 15+ / Supabase
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Standard schema permissions for Supabase roles
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- 1. PROFILES (for Admin Dashboard Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'staff')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY DEFAULT ('cat-' || extract(epoch from now())::text),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MENU ITEMS
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY DEFAULT ('item-' || extract(epoch from now())::text),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT DEFAULT '',
    category_id TEXT REFERENCES public.categories(id) ON DELETE RESTRICT,
    dietary_type TEXT NOT NULL DEFAULT 'veg' CHECK (dietary_type IN ('veg', 'non-veg')),
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    unit TEXT DEFAULT 'portion',
    image_url TEXT DEFAULT '',
    is_featured BOOLEAN DEFAULT FALSE,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SERVICES
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY DEFAULT ('srv-' || extract(epoch from now())::text),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. GALLERY
CREATE TABLE IF NOT EXISTS public.gallery (
    id TEXT PRIMARY KEY DEFAULT ('gal-' || extract(epoch from now())::text),
    image_url TEXT NOT NULL,
    caption TEXT DEFAULT '',
    category TEXT DEFAULT 'General',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY DEFAULT ('test-' || extract(epoch from now())::text),
    customer_name TEXT NOT NULL,
    review TEXT NOT NULL,
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    event_type TEXT DEFAULT 'Catering Event',
    image_url TEXT DEFAULT '',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ENQUIRIES
CREATE TABLE IF NOT EXISTS public.enquiries (
    id TEXT PRIMARY KEY DEFAULT ('enq-' || extract(epoch from now())::text),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT DEFAULT '',
    enquiry_type TEXT NOT NULL DEFAULT 'general' CHECK (enquiry_type IN ('general', 'quotation')),
    subject TEXT DEFAULT '',
    message TEXT DEFAULT '',
    event_type TEXT DEFAULT '',
    event_date DATE,
    event_location TEXT DEFAULT '',
    guest_count INT DEFAULT 0,
    food_preference TEXT DEFAULT 'Both',
    budget TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quotation_sent', 'converted', 'closed')),
    admin_notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'settings-main',
    business_name TEXT NOT NULL DEFAULT 'Akshaya Caterers',
    logo_url TEXT DEFAULT '',
    hero_title TEXT DEFAULT 'Every Celebration Deserves Exceptional Food.',
    hero_description TEXT DEFAULT 'Bringing people together through delicious food, authentic hospitality, and unforgettable catering experiences.',
    hero_image_url TEXT DEFAULT '',
    about_title TEXT DEFAULT 'Crafting Culinary Memories Since Day One',
    about_description TEXT DEFAULT '',
    about_image_url TEXT DEFAULT '',
    contact_phone TEXT DEFAULT '+91 98765 43210',
    whatsapp_number TEXT DEFAULT '+919876543210',
    email TEXT DEFAULT 'info@akshayacaterers.com',
    address TEXT DEFAULT '',
    maps_url TEXT DEFAULT '',
    instagram_url TEXT DEFAULT '',
    facebook_url TEXT DEFAULT '',
    opening_hours TEXT DEFAULT 'Monday to Sunday: 8:00 AM – 10:00 PM',
    footer_description TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ----------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_active ON public.menu_items(is_active);
CREATE INDEX IF NOT EXISTS idx_menu_items_dietary ON public.menu_items(dietary_type);
CREATE INDEX IF NOT EXISTS idx_categories_order ON public.categories(display_order);
CREATE INDEX IF NOT EXISTS idx_services_order ON public.services(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_order ON public.gallery(display_order);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON public.enquiries(created_at DESC);

-- ----------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public can read active content
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active menu items" ON public.menu_items FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active gallery items" ON public.gallery FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active testimonials" ON public.testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);

-- Public can create enquiries
CREATE POLICY "Public can insert enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);

-- Service Role / Authenticated Admin can perform all operations
CREATE POLICY "Admins full access on categories" ON public.categories FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Admins full access on menu_items" ON public.menu_items FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Admins full access on services" ON public.services FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Admins full access on gallery" ON public.gallery FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Admins full access on testimonials" ON public.testimonials FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Admins full access on enquiries" ON public.enquiries FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Admins full access on site_settings" ON public.site_settings FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Admins full access on profiles" ON public.profiles FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

-- ----------------------------------------------------
-- STORAGE BUCKETS (for food images & gallery photos)
-- ----------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('catering-assets', 'catering-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access catering-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'catering-assets');

CREATE POLICY "Admin Upload catering-assets"
ON storage.objects FOR INSERT
TO authenticated, service_role
WITH CHECK (bucket_id = 'catering-assets');

CREATE POLICY "Admin Delete catering-assets"
ON storage.objects FOR DELETE
TO authenticated, service_role
USING (bucket_id = 'catering-assets');

-- Grant all permissions on all existing public tables and routines
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

