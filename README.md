# Akshaya Caterers — Premium Catering Website & Admin CMS

A complete, production-ready catering business web application and Content Management System (CMS) designed for **Akshaya Caterers**.

Built with a sophisticated hospitality aesthetic:
- **Warm Ivory** (`#FAF9F4`) & **Soft Cream** (`#F1EFE5`) background
- **Forest Green** (`#244C3A`) primary brand & **Sage Green** (`#8FA58A`) secondary
- **Muted Champagne Gold** (`#C6A66B`) accents
- **Deep Charcoal** (`#252923`) typography
- **Playfair Display** (headings) & **Plus Jakarta Sans** (body text)

---

## 🌟 Key Features

### 1. Public Customer Website
- **Sticky Luxury Header**: Responsive desktop & mobile navigation, direct click-to-call, and WhatsApp instant messaging.
- **Hero Section**: High-resolution catering spread showcase, trust credentials (Master Chefs, 100% Hygiene, Royal Hospitality), and quick quotation CTAs.
- **Why Choose Us & Highlights**: 4 trust pillars and 6 service differentiators.
- **Dynamic Catering Services**: Cards for Wedding Catering, Event Catering, Corporate Catering, Birthday & Private Parties, Traditional Celebrations, and Custom Packages.
- **Interactive Food Menu (`/menu`)**:
  - Live instantaneous dish search by title, ingredient, or category
  - Category navigation pills (Breakfast, Lunch, Dinner, Snacks, Sweets & Desserts, Beverages, Live Counters)
  - Dietary filters (**Pure Veg** vs **Non-Veg**)
  - Real INR (`₹`) prices and serving/unit indicators
  - **Contextual WhatsApp Button**: Opens WhatsApp pre-filled with *"Hello Akshaya Caterers, I am interested in [Food Item]. Please share more details."*
- **Visual Celebration Gallery (`/gallery`)**: Responsive grid with category filtering and full-screen image lightbox.
- **Authentic Client Testimonials**: Verified ratings, quote cards, and event types.
- **Lead Generation & Quotation (`/contact`)**:
  - Multi-tabbed inquiry form (Custom Catering Quotation vs Quick General Enquiry)
  - Event date picker, guest count, dietary preference, venue, and approximate budget
  - Built-in anti-spam honeypot protection and server-side validation
- **Mobile Sticky Action Bar**: Bottom fixed bar for one-tap WhatsApp, Call Now, and Instant Quote.

---

### 2. Private Admin Dashboard CMS (`/admin`)
- **Secure Authentication (`/admin/login`)**:
  - Protected routes via Next.js middleware and signed HMAC session cookies
  - Single-admin credential check with bcrypt hashing
  - Default Credentials: **`admin`** / **`akshaya2026!`**
- **Dashboard Overview (`/admin`)**:
  - Live database metrics: Total Menu Items, Active Items, Categories, Services, Total Enquiries, and New Leads
  - Recent enquiries preview with instant WhatsApp & click-to-call shortcuts
- **Food Menu Management (`/admin/menu`)**:
  - Add, edit, and delete food items
  - Inline fast price editor (click price, type new figure, hit enter)
  - Toggle visibility (**Active** vs **Hidden**)
  - Mark dishes as **Featured** (appears on homepage) or **Popular**
  - Food photograph replacement & image upload
- **Category Management (`/admin/categories`)**:
  - Create, edit, and reorder categories
  - Safe deletion: prevents deleting categories that still have menu items assigned
- **Catering Services Management (`/admin/services`)**:
  - Add, edit, and reorder service packages and package bullet points
- **Gallery Management (`/admin/gallery`)**:
  - Upload new celebration photos, assign categories, and edit captions
- **Testimonials Management (`/admin/testimonials`)**:
  - Add, update, and toggle reviews and 1–5 star ratings
- **Lead Management System (`/admin/enquiries`)**:
  - View full enquiry details, guest counts, and customer requirements
  - Status progression workflow: `New Lead` → `Contacted` → `Quotation Sent` → `Converted` → `Closed`
  - Internal private follow-up notes for the catering team
  - Direct WhatsApp response with customer name pre-filled
- **Website Settings (`/admin/settings`)**:
  - Update business phone number, WhatsApp number, email, kitchen address, operating hours, hero titles, about story, and social media links.
  - Updates immediately reflect across the public website!

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 16 (App Router, Server Components & Server Actions)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Typography**: Google Fonts (`Playfair Display`, `Plus Jakarta Sans`)
- **Database & Persistence**:
  - Dual-mode architecture:
    - **Local Persistence Mode**: Defaults to `.data/db.json` when Supabase is not connected. Full CRUD, price updates, inquiries, and settings work immediately out-of-the-box.
    - **Supabase Cloud Mode**: Seamlessly switches to Supabase PostgreSQL and Supabase Storage when credentials are added to `.env.local`.

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Run Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the customer website.  
Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) to access the Admin CMS.

**Default Admin Credentials**:
- **Username**: `admin`
- **Password**: `akshaya2026!`

---

## 🗄️ Supabase Cloud Setup (Production)

If deploying to Supabase:
1. Create a new project in [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/migrations/20240101000000_initial_schema.sql` and run the script to create tables, indexes, RLS policies, and the storage bucket.
4. Run `supabase/seed.sql` to populate sample categories, menu items, services, gallery photographs, and site settings.
5. In your project, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
6. Add your Supabase project URL, Anon Key, and Service Role Key:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ADMIN_SESSION_SECRET=your-random-production-secret
   ```

---

## ☁️ Vercel Deployment

1. Push this repository to GitHub or GitLab.
2. Import the repository into [Vercel](https://vercel.com).
3. Set the Environment Variables defined in `.env.example`.
4. Deploy! Next.js will build and serve your application globally on Vercel's edge network.

---

## 🔒 Security Measures
- Protected `/admin` routes using secure session tokens.
- Spam protection via honeypot field (`hp_company`) on customer inquiry forms.
- Safe deletion validation for relational categories.
- File upload mime-type and size limits (JPEG, PNG, WebP ≤ 5MB).
