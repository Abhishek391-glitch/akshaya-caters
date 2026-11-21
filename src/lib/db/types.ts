export type DietaryType = 'veg' | 'non-veg';

export type EnquiryStatus = 'new' | 'contacted' | 'quotation_sent' | 'converted' | 'closed';

export type EventType =
  | 'Wedding'
  | 'Birthday'
  | 'Corporate Event'
  | 'Engagement'
  | 'Family Function'
  | 'Other';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  category_name?: string;
  dietary_type: DietaryType;
  price: number;
  unit: string;
  image_url: string;
  is_featured: boolean;
  is_popular: boolean;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  features: string[];
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  caption: string;
  category: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  review: string;
  rating: number;
  event_type: string;
  image_url?: string;
  is_active: boolean;
  created_at?: string;
}

export interface Enquiry {
  id: string;
  customer_name: string;
  phone: string;
  email?: string;
  enquiry_type: 'general' | 'quotation';
  subject?: string;
  message?: string;
  event_type?: EventType | string;
  event_date?: string;
  event_location?: string;
  guest_count?: number;
  food_preference?: 'Veg' | 'Non-Veg' | 'Both' | string;
  budget?: string;
  status: EnquiryStatus;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface SiteSettings {
  id: string;
  business_name: string;
  logo_url: string;
  hero_title: string;
  hero_description: string;
  hero_image_url: string;
  about_title: string;
  about_description: string;
  about_image_url?: string;
  contact_phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  maps_url: string;
  instagram_url: string;
  facebook_url: string;
  opening_hours: string;
  footer_description: string;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
  role: 'admin';
  created_at?: string;
}

export interface DatabaseSchema {
  categories: Category[];
  menu_items: MenuItem[];
  services: Service[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  enquiries: Enquiry[];
  site_settings: SiteSettings;
  admin_users: AdminUser[];
}
