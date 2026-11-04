# FLEXO LIFESTYLE • "Wear it. Flaunt it. Flex it."

> A production-ready, animated luxury e-commerce platform built for fashion, automatic watches, footwear, leather goods, and lifestyle accessories. Designed for 100% **FREE-TIER** deployment on Next.js, Supabase, and Vercel with zero paid subscriptions. Includes Flipkart-inspired conversion features (pincode delivery estimator, deal timers, ratings) and instant WhatsApp ordering for customers.

---

## ⚡ Tech Stack (100% Free Tiers)
- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS (Luxury obsidian `#09090b` palette + metallic gold `#d4af37` accents)
- **Animations:** Framer Motion (headline text reveal, sliding drawers, scroll-reveal cards, infinite marquee)
- **Database & Auth:** Supabase Free Tier (PostgreSQL, Row Level Security, Storage Buckets, Auth)
- **Payments:** Instant UPI (Dynamic QR Code + Mobile `upi://pay` deep link + 12-digit UTR Verification) + Cash on Delivery (COD)
- **Customer Concierge:** WhatsApp Direct Ordering & Floating Chat Redirect
- **Hosting:** Vercel Free Tier with automatic ISR and `next/image` optimization

---

## 🛍️ Features Overview

### 1. Customer-Facing Storefront
- **Animated Home Page:**
  - Fullscreen hero with animated headline reveal, luxury mesh gradients, and CTA buttons.
  - Infinite running marquee ticker (`NEW SEASON DROPS • FREE SHIPPING • CASH ON DELIVERY`).
  - Interactive category tiles (Clothing, Watches, Shoes, Accessories, Lifestyle) with zoom on hover.
  - **Flipkart-Style Deals of the Day:** Live countdown urgency timer (Hours : Minutes : Seconds), discount percentage badges, and bank/UPI bonus tags.
  - Featured releases with category tab switcher and quick add to cart.
  - Brand story atelier section & verified customer reviews.
  - VIP drop email & WhatsApp club newsletter signup.
- **Shop Catalogue:**
  - Dynamic filtering by Category, Price range slider (₹1,000 – ₹20,000), Size, and In-Stock status.
  - Sorting (Featured, Price: Low to High, Price: High to Low, Highest Rated ★ 4+, Biggest Savings).
  - Instant live keyword search and 4-column vs. compact grid density toggle.
  - Mobile slide-out filter modal.
- **Product Detail Page:**
  - Multi-image zoom gallery with thumbnail previews and mobile swipe navigation.
  - Size and color swatch selectors with live active indicator.
  - Price breakdown with original price struck out and "You save ₹X" tag.
  - **Flipkart Pincode Estimator:** Customer enters their 6-digit Indian pincode to view estimated delivery date, free delivery availability, and COD eligibility.
  - Stock scarcity counter (`Only 9 units left in stock!`).
  - Direct **"Order / Inquire on WhatsApp"** button that opens WhatsApp with pre-filled product details.
  - Accordion tabs for Description, Material & Specifications, and Verified Buyer Reviews.
  - Related product recommendations.
- **Cart & Checkout:**
  - Sliding Cart Drawer with smooth Framer Motion animations.
  - Free shipping progress bar (`Add ₹300 more for FREE Express Shipping!`).
  - Coupon code system (e.g., `FLEXO10` for 10% off, `FIRST500` for flat ₹500 off).
  - Indian Rupee (₹) formatting across the entire checkout flow.
  - **Two Zero-Commission Payment Options:**
    1. **Instant UPI:** Dynamic QR code with exact payable total + `upi://pay` mobile app button + 12-digit UTR entry. Order stays in "Payment pending verification" until confirmed in Admin.
    2. **Cash on Delivery (COD):** Direct checkout with doorstep payment.
- **Order Confirmation & WhatsApp Redirect:**
  - Canvas-confetti celebration animation on mount.
  - Order Reference ID (e.g., `#FLX-X821-4921`).
  - **"Send Order on WhatsApp"** button: Opens WhatsApp directly to your merchant number (`NEXT_PUBLIC_WHATSAPP_NUMBER`) with pre-filled items, customer address, order amount, and payment method!
  - Printable packaging slip / receipt.
- **Live Order Tracking:**
  - Customers enter their Order ID + Phone number on `/track-order`.
  - Visual 4-stage milestone timeline: `Order Placed` &rarr; `Order Confirmed` &rarr; `Shipped & In Transit` &rarr; `Delivered`.
  - Instant courier inquiry link via WhatsApp.

### 2. Merchant Admin Panel (`/admin`)
- **Dashboard:** Real-time Gross Revenue, Total Orders count, Pending UPI orders, and Low Stock inventory alerts.
- **Orders & Payments Management:**
  - Filter by All, Pending UPI, Confirmed, Shipped, Delivered.
  - View full customer address and item breakdown.
  - One-click **"Verify UPI"** button for customer UTR submissions.
  - Update shipment status & add courier tracking numbers.
  - Printable packing slip.
- **Product Management:**
  - Add, edit, and delete products.
  - Toggle Featured on homepage & Active/Hidden from shop.
  - Image URLs, multiple sizes, colors, and stock count.
- **Category Management:**
  - Add and edit collection slugs, descriptions, and cover images.
- **Protected Access:**
  - Protected with Supabase Auth (or demo passcode `admin123` for quick local evaluation).

---

## 🚀 Step-by-Step Setup Instructions

### Step 1: Clone & Install Dependencies
Open your terminal inside this folder and run:
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Inside `.env.local`, update:
```env
NEXT_PUBLIC_BRAND_NAME="FLEXO LIFESTYLE"
NEXT_PUBLIC_BRAND_TAGLINE="Elevate Your Everyday • Luxury Streetwear & Timeless Goods"

# Your UPI ID (for QR code & deep links)
NEXT_PUBLIC_UPI_ID="yourname@upi"
NEXT_PUBLIC_UPI_NAME="Flexo Lifestyle"

# Your WhatsApp Number (country code + 10 digits, no '+' or spaces)
NEXT_PUBLIC_WHATSAPP_NUMBER="919876543210"

# Admin email allowed to sign in
ADMIN_EMAIL="admin@flexolifestyle.com"

# Supabase Credentials (from Step 3)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
```

*(Note: If you run without Supabase credentials initially, the website automatically falls back to the built-in mock products and local order store so you can test all customer and admin features right away!)*

---

### Step 3: Setting Up Supabase (100% Free Tier)
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **"New Project"**, name it `flexo-lifestyle`, choose a secure database password, and pick the region closest to your customers (e.g., South Asia / Mumbai).
3. Once the project is provisioned:
   - Click **SQL Editor** on the left menu.
   - Click **"New Query"**, copy the entire contents of `supabase/schema.sql`, paste it, and click **RUN**.
   - This creates all tables (`categories`, `products`, `orders`, `reviews`), configures Row Level Security (RLS) policies, creates the `product-images` storage bucket, and inserts 12 luxury sample products!
4. Go to **Project Settings** &rarr; **API**:
   - Copy **Project URL** &rarr; paste into `NEXT_PUBLIC_SUPABASE_URL`.
   - Copy **Project API Key (`anon public`)** &rarr; paste into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Copy **`service_role` key** &rarr; paste into `SUPABASE_SERVICE_ROLE_KEY`.
5. Under **Authentication** &rarr; **Users**, click **"Add user"** and create your admin account using the email specified in `ADMIN_EMAIL`.

---

### Step 4: Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
- Public Store: [http://localhost:3000](http://localhost:3000)
- Shop Catalogue: [http://localhost:3000/shop](http://localhost:3000/shop)
- Track Order: [http://localhost:3000/track-order](http://localhost:3000/track-order)
- Admin Panel: [http://localhost:3000/admin](http://localhost:3000/admin) *(Passcode for instant local testing: `admin123`)*

---

### Step 5: Push to GitHub
1. Initialize git and commit:
```bash
git init
git add .
git commit -m "Initial commit of Flexo Lifestyle e-commerce platform"
```
2. Create a repository on [github.com](https://github.com) named `flexo-lifestyle`.
3. Push to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/flexo-lifestyle.git
git branch -M main
git push -u origin main
```

---

### Step 6: Deploy to Vercel (Free Tier)
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **"Add New Project"** and select your `flexo-lifestyle` repository.
3. In **Environment Variables**, paste the variables from your `.env.local` file:
   - `NEXT_PUBLIC_BRAND_NAME`
   - `NEXT_PUBLIC_UPI_ID`
   - `NEXT_PUBLIC_UPI_NAME`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_EMAIL`
   - `NEXT_PUBLIC_SITE_URL` (set to your Vercel deployment URL, e.g. `https://flexolifestyle.vercel.app`)
4. Click **Deploy**. Vercel will build and deploy your site with global edge caching in under 2 minutes!

---

## 📋 Available Coupon Codes for Testing
- `FLEXO10` — Flat 10% OFF entire order
- `WELCOME10` — 10% OFF welcome discount
- `FIRST500` — Flat ₹500 OFF (minimum order value ₹2,999)

---

## 🔒 Free Tier Performance Optimizations
- **Edge Static Generation:** All primary catalogue pages and sitemaps are pre-rendered at build time.
- **Images:** All images utilize Next.js AVIF/WebP responsive sizing with automatic lazy loading.
- **Database Calls:** Queries are cached and paginated, preventing unnecessary Supabase egress bandwidth.
- **Zero Payment Fees:** Direct UPI and COD payments incur zero gateway commission.
