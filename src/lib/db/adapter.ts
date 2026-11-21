import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  Category,
  MenuItem,
  Service,
  GalleryItem,
  Testimonial,
  Enquiry,
  SiteSettings,
  DatabaseSchema,
  EnquiryStatus,
} from './types';
import { INITIAL_DATA } from './initial-data';
import { supabaseAdmin, isSupabaseConfigured } from './supabase';

const DB_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Ensure database directory and file exist
function getLocalDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      return INITIAL_DATA;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content) as DatabaseSchema;
  } catch (error) {
    console.error('Error reading local DB, falling back to initial data:', error);
    return INITIAL_DATA;
  }
}

function saveLocalDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to local DB:', error);
  }
}

// ----------------------------------------------------
// CATEGORIES
// ----------------------------------------------------
export async function getCategories(onlyActive = false): Promise<Category[]> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    let query = supabaseAdmin.from('categories').select('*').order('display_order', { ascending: true });
    if (onlyActive) query = query.eq('is_active', true);
    const { data, error } = await query;
    if (!error && data) return data as Category[];
  }
  const db = getLocalDb();
  let list = db.categories;
  if (onlyActive) list = list.filter((c) => c.is_active);
  return list.sort((a, b) => a.display_order - b.display_order);
}

export async function saveCategory(category: Partial<Category>): Promise<Category> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured() && supabaseAdmin) {
    const payload = {
      ...category,
      updated_at: now,
      slug: category.slug || category.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };
    if (category.id) {
      const { data, error } = await supabaseAdmin.from('categories').update(payload).eq('id', category.id).select().single();
      if (!error && data) return data as Category;
    } else {
      const { data, error } = await supabaseAdmin.from('categories').insert(payload).select().single();
      if (!error && data) return data as Category;
    }
  }

  const db = getLocalDb();
  const slug = category.slug || category.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'category';

  if (category.id) {
    const idx = db.categories.findIndex((c) => c.id === category.id);
    if (idx !== -1) {
      const updated: Category = {
        ...db.categories[idx],
        ...category,
        slug,
        updated_at: now,
      };
      db.categories[idx] = updated;
      saveLocalDb(db);
      return updated;
    }
  }

  const newCategory: Category = {
    id: `cat-${Date.now()}`,
    name: category.name || 'New Category',
    slug,
    description: category.description || '',
    image_url: category.image_url || '',
    display_order: category.display_order ?? db.categories.length + 1,
    is_active: category.is_active ?? true,
    created_at: now,
    updated_at: now,
  };
  db.categories.push(newCategory);
  saveLocalDb(db);
  return newCategory;
}

export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  // Check if any menu items reference this category
  const items = await getMenuItems();
  const hasItems = items.some((item) => item.category_id === id);
  if (hasItems) {
    return {
      success: false,
      error: 'Cannot delete category: menu items are still assigned to it. Please reassign or delete those items first.',
    };
  }

  if (isSupabaseConfigured() && supabaseAdmin) {
    const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
    if (!error) return { success: true };
  }

  const db = getLocalDb();
  db.categories = db.categories.filter((c) => c.id !== id);
  saveLocalDb(db);
  return { success: true };
}

// ----------------------------------------------------
// MENU ITEMS
// ----------------------------------------------------
export async function getMenuItems(options?: {
  categoryId?: string;
  dietaryType?: string;
  onlyActive?: boolean;
  featuredOnly?: boolean;
}): Promise<MenuItem[]> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    let query = supabaseAdmin.from('menu_items').select('*, categories(name)').order('display_order', { ascending: true });
    if (options?.onlyActive) query = query.eq('is_active', true);
    if (options?.categoryId) query = query.eq('category_id', options.categoryId);
    if (options?.dietaryType) query = query.eq('dietary_type', options.dietaryType);
    if (options?.featuredOnly) query = query.eq('is_featured', true);
    const { data, error } = await query;
    if (!error && data) {
      return data.map((item: any) => ({
        ...item,
        category_name: item.categories?.name,
      })) as MenuItem[];
    }
  }

  const db = getLocalDb();
  let list = db.menu_items;
  if (options?.onlyActive) list = list.filter((i) => i.is_active);
  if (options?.categoryId) list = list.filter((i) => i.category_id === options.categoryId);
  if (options?.dietaryType) list = list.filter((i) => i.dietary_type === options.dietaryType);
  if (options?.featuredOnly) list = list.filter((i) => i.is_featured);

  // Attach category name
  const catMap = new Map(db.categories.map((c) => [c.id, c.name]));
  return list
    .map((item) => ({
      ...item,
      category_name: catMap.get(item.category_id) || item.category_name || 'General',
    }))
    .sort((a, b) => a.display_order - b.display_order);
}

export async function saveMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
  const now = new Date().toISOString();
  const slug = item.slug || item.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'dish';

  if (isSupabaseConfigured() && supabaseAdmin) {
    const payload = {
      ...item,
      slug,
      updated_at: now,
    };
    if (item.id) {
      const { data, error } = await supabaseAdmin.from('menu_items').update(payload).eq('id', item.id).select().single();
      if (!error && data) return data as MenuItem;
    } else {
      const { data, error } = await supabaseAdmin.from('menu_items').insert(payload).select().single();
      if (!error && data) return data as MenuItem;
    }
  }

  const db = getLocalDb();
  const catMap = new Map(db.categories.map((c) => [c.id, c.name]));

  if (item.id) {
    const idx = db.menu_items.findIndex((m) => m.id === item.id);
    if (idx !== -1) {
      const updated: MenuItem = {
        ...db.menu_items[idx],
        ...item,
        slug,
        category_name: item.category_id ? catMap.get(item.category_id) : db.menu_items[idx].category_name,
        updated_at: now,
      };
      db.menu_items[idx] = updated;
      saveLocalDb(db);
      return updated;
    }
  }

  const newItem: MenuItem = {
    id: `item-${Date.now()}`,
    name: item.name || 'New Dish',
    slug,
    description: item.description || '',
    category_id: item.category_id || db.categories[0]?.id || 'cat-breakfast',
    category_name: item.category_id ? catMap.get(item.category_id) : 'General',
    dietary_type: item.dietary_type || 'veg',
    price: Number(item.price) || 0,
    unit: item.unit || 'portion',
    image_url: item.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    is_featured: item.is_featured ?? false,
    is_popular: item.is_popular ?? false,
    is_active: item.is_active ?? true,
    display_order: item.display_order ?? db.menu_items.length + 1,
    created_at: now,
    updated_at: now,
  };
  db.menu_items.push(newItem);
  saveLocalDb(db);
  return newItem;
}

export async function updateMenuItemPrice(id: string, price: number): Promise<boolean> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured() && supabaseAdmin) {
    const { error } = await supabaseAdmin.from('menu_items').update({ price, updated_at: now }).eq('id', id);
    if (!error) return true;
  }

  const db = getLocalDb();
  const idx = db.menu_items.findIndex((m) => m.id === id);
  if (idx !== -1) {
    db.menu_items[idx].price = price;
    db.menu_items[idx].updated_at = now;
    saveLocalDb(db);
    return true;
  }
  return false;
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    const { error } = await supabaseAdmin.from('menu_items').delete().eq('id', id);
    if (!error) return true;
  }

  const db = getLocalDb();
  db.menu_items = db.menu_items.filter((m) => m.id !== id);
  saveLocalDb(db);
  return true;
}

// ----------------------------------------------------
// SERVICES
// ----------------------------------------------------
export async function getServices(onlyActive = false): Promise<Service[]> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    let query = supabaseAdmin.from('services').select('*').order('display_order', { ascending: true });
    if (onlyActive) query = query.eq('is_active', true);
    const { data, error } = await query;
    if (!error && data) return data as Service[];
  }

  const db = getLocalDb();
  let list = db.services;
  if (onlyActive) list = list.filter((s) => s.is_active);
  return list.sort((a, b) => a.display_order - b.display_order);
}

export async function saveService(service: Partial<Service>): Promise<Service> {
  const now = new Date().toISOString();
  const slug = service.slug || service.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'service';

  if (isSupabaseConfigured() && supabaseAdmin) {
    const payload = { ...service, slug, updated_at: now };
    if (service.id) {
      const { data, error } = await supabaseAdmin.from('services').update(payload).eq('id', service.id).select().single();
      if (!error && data) return data as Service;
    } else {
      const { data, error } = await supabaseAdmin.from('services').insert(payload).select().single();
      if (!error && data) return data as Service;
    }
  }

  const db = getLocalDb();
  if (service.id) {
    const idx = db.services.findIndex((s) => s.id === service.id);
    if (idx !== -1) {
      const updated: Service = {
        ...db.services[idx],
        ...service,
        slug,
        updated_at: now,
      };
      db.services[idx] = updated;
      saveLocalDb(db);
      return updated;
    }
  }

  const newService: Service = {
    id: `srv-${Date.now()}`,
    name: service.name || 'New Service',
    slug,
    description: service.description || '',
    image_url: service.image_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    features: service.features || ['Premium Hospitality', 'Hygiene Assured', 'Authentic Taste'],
    is_active: service.is_active ?? true,
    display_order: service.display_order ?? db.services.length + 1,
    created_at: now,
    updated_at: now,
  };
  db.services.push(newService);
  saveLocalDb(db);
  return newService;
}

export async function deleteService(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    const { error } = await supabaseAdmin.from('services').delete().eq('id', id);
    if (!error) return true;
  }

  const db = getLocalDb();
  db.services = db.services.filter((s) => s.id !== id);
  saveLocalDb(db);
  return true;
}

// ----------------------------------------------------
// GALLERY
// ----------------------------------------------------
export async function getGallery(category?: string, onlyActive = false): Promise<GalleryItem[]> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    let query = supabaseAdmin.from('gallery').select('*').order('display_order', { ascending: true });
    if (onlyActive) query = query.eq('is_active', true);
    if (category && category !== 'All') query = query.eq('category', category);
    const { data, error } = await query;
    if (!error && data) return data as GalleryItem[];
  }

  const db = getLocalDb();
  let list = db.gallery;
  if (onlyActive) list = list.filter((g) => g.is_active);
  if (category && category !== 'All') list = list.filter((g) => g.category.toLowerCase() === category.toLowerCase());
  return list.sort((a, b) => a.display_order - b.display_order);
}

export async function saveGalleryItem(item: Partial<GalleryItem>): Promise<GalleryItem> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured() && supabaseAdmin) {
    if (item.id) {
      const { data, error } = await supabaseAdmin.from('gallery').update(item).eq('id', item.id).select().single();
      if (!error && data) return data as GalleryItem;
    } else {
      const { data, error } = await supabaseAdmin.from('gallery').insert(item).select().single();
      if (!error && data) return data as GalleryItem;
    }
  }

  const db = getLocalDb();
  if (item.id) {
    const idx = db.gallery.findIndex((g) => g.id === item.id);
    if (idx !== -1) {
      const updated: GalleryItem = { ...db.gallery[idx], ...item };
      db.gallery[idx] = updated;
      saveLocalDb(db);
      return updated;
    }
  }

  const newItem: GalleryItem = {
    id: `gal-${Date.now()}`,
    image_url: item.image_url || '',
    caption: item.caption || '',
    category: item.category || 'General',
    display_order: item.display_order ?? db.gallery.length + 1,
    is_active: item.is_active ?? true,
    created_at: now,
  };
  db.gallery.push(newItem);
  saveLocalDb(db);
  return newItem;
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    const { error } = await supabaseAdmin.from('gallery').delete().eq('id', id);
    if (!error) return true;
  }

  const db = getLocalDb();
  db.gallery = db.gallery.filter((g) => g.id !== id);
  saveLocalDb(db);
  return true;
}

// ----------------------------------------------------
// TESTIMONIALS
// ----------------------------------------------------
export async function getTestimonials(onlyActive = false): Promise<Testimonial[]> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    let query = supabaseAdmin.from('testimonials').select('*').order('created_at', { ascending: false });
    if (onlyActive) query = query.eq('is_active', true);
    const { data, error } = await query;
    if (!error && data) return data as Testimonial[];
  }

  const db = getLocalDb();
  let list = db.testimonials;
  if (onlyActive) list = list.filter((t) => t.is_active);
  return list;
}

export async function saveTestimonial(testimonial: Partial<Testimonial>): Promise<Testimonial> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured() && supabaseAdmin) {
    if (testimonial.id) {
      const { data, error } = await supabaseAdmin.from('testimonials').update(testimonial).eq('id', testimonial.id).select().single();
      if (!error && data) return data as Testimonial;
    } else {
      const { data, error } = await supabaseAdmin.from('testimonials').insert(testimonial).select().single();
      if (!error && data) return data as Testimonial;
    }
  }

  const db = getLocalDb();
  if (testimonial.id) {
    const idx = db.testimonials.findIndex((t) => t.id === testimonial.id);
    if (idx !== -1) {
      const updated: Testimonial = { ...db.testimonials[idx], ...testimonial };
      db.testimonials[idx] = updated;
      saveLocalDb(db);
      return updated;
    }
  }

  const newTestimonial: Testimonial = {
    id: `test-${Date.now()}`,
    customer_name: testimonial.customer_name || 'Happy Customer',
    review: testimonial.review || '',
    rating: testimonial.rating || 5,
    event_type: testimonial.event_type || 'Special Event',
    image_url: testimonial.image_url || '',
    is_active: testimonial.is_active ?? true,
    created_at: now,
  };
  db.testimonials.push(newTestimonial);
  saveLocalDb(db);
  return newTestimonial;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    const { error } = await supabaseAdmin.from('testimonials').delete().eq('id', id);
    if (!error) return true;
  }

  const db = getLocalDb();
  db.testimonials = db.testimonials.filter((t) => t.id !== id);
  saveLocalDb(db);
  return true;
}

// ----------------------------------------------------
// ENQUIRIES & LEADS
// ----------------------------------------------------
export async function getEnquiries(status?: EnquiryStatus): Promise<Enquiry[]> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    let query = supabaseAdmin.from('enquiries').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (!error && data) return data as Enquiry[];
  }

  const db = getLocalDb();
  let list = db.enquiries;
  if (status) list = list.filter((e) => e.status === status);
  return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function createEnquiry(enquiry: Omit<Enquiry, 'id' | 'status' | 'created_at'>): Promise<Enquiry> {
  const now = new Date().toISOString();
  const payload = {
    ...enquiry,
    status: 'new' as EnquiryStatus,
    created_at: now,
    updated_at: now,
  };

  if (isSupabaseConfigured() && supabaseAdmin) {
    const { data, error } = await supabaseAdmin.from('enquiries').insert(payload).select().single();
    if (!error && data) return data as Enquiry;
  }

  const db = getLocalDb();
  const newEnquiry: Enquiry = {
    id: `enq-${Date.now()}`,
    ...payload,
  };
  db.enquiries.unshift(newEnquiry);
  saveLocalDb(db);
  return newEnquiry;
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus,
  adminNotes?: string
): Promise<boolean> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured() && supabaseAdmin) {
    const updatePayload: any = { status, updated_at: now };
    if (adminNotes !== undefined) updatePayload.admin_notes = adminNotes;
    const { error } = await supabaseAdmin.from('enquiries').update(updatePayload).eq('id', id);
    if (!error) return true;
  }

  const db = getLocalDb();
  const idx = db.enquiries.findIndex((e) => e.id === id);
  if (idx !== -1) {
    db.enquiries[idx].status = status;
    if (adminNotes !== undefined) db.enquiries[idx].admin_notes = adminNotes;
    db.enquiries[idx].updated_at = now;
    saveLocalDb(db);
    return true;
  }
  return false;
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    const { error } = await supabaseAdmin.from('enquiries').delete().eq('id', id);
    if (!error) return true;
  }

  const db = getLocalDb();
  db.enquiries = db.enquiries.filter((e) => e.id !== id);
  saveLocalDb(db);
  return true;
}

// ----------------------------------------------------
// SITE SETTINGS
// ----------------------------------------------------
export async function getSiteSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    const { data, error } = await supabaseAdmin.from('site_settings').select('*').limit(1).single();
    if (!error && data) return data as SiteSettings;
  }

  const db = getLocalDb();
  return db.site_settings || INITIAL_DATA.site_settings;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured() && supabaseAdmin) {
    const current = await getSiteSettings();
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .update({ ...settings, updated_at: now })
      .eq('id', current.id)
      .select()
      .single();
    if (!error && data) return data as SiteSettings;
  }

  const db = getLocalDb();
  const updated: SiteSettings = {
    ...db.site_settings,
    ...settings,
    updated_at: now,
  };
  db.site_settings = updated;
  saveLocalDb(db);
  return updated;
}

// ----------------------------------------------------
// DASHBOARD STATS
// ----------------------------------------------------
export async function getDashboardStats() {
  const [categories, menuItems, services, enquiries] = await Promise.all([
    getCategories(),
    getMenuItems(),
    getServices(),
    getEnquiries(),
  ]);

  const activeMenuItems = menuItems.filter((m) => m.is_active).length;
  const newEnquiries = enquiries.filter((e) => e.status === 'new').length;
  const convertedEnquiries = enquiries.filter((e) => e.status === 'converted').length;
  const quotationEnquiries = enquiries.filter((e) => e.enquiry_type === 'quotation').length;

  return {
    totalMenuItems: menuItems.length,
    activeMenuItems,
    totalCategories: categories.length,
    totalServices: services.length,
    totalEnquiries: enquiries.length,
    newEnquiries,
    convertedEnquiries,
    quotationEnquiries,
    recentEnquiries: enquiries.slice(0, 5),
  };
}

// ----------------------------------------------------
// ADMIN AUTHENTICATION
// ----------------------------------------------------
export async function verifyAdminCredentials(username: string, passwordPlain: string): Promise<boolean> {
  const userTrimmed = (username || '').trim();
  const defaultUser = process.env.ADMIN_DEFAULT_USERNAME || 'admin';
  const defaultPass = process.env.ADMIN_DEFAULT_PASSWORD || 'akshaya2026!';

  // Direct check against configured default credentials
  if (userTrimmed === defaultUser && passwordPlain === defaultPass) {
    return true;
  }

  const db = getLocalDb();
  const admin = db.admin_users?.find((u) => u.username.toLowerCase() === userTrimmed.toLowerCase());
  if (!admin) {
    return false;
  }

  try {
    return await bcrypt.compare(passwordPlain, admin.password_hash);
  } catch (err) {
    console.error('Password verification error:', err);
    return false;
  }
}
