-- ==============================================================================
-- FLEXO LIFESTYLE - COMPLETE SUPABASE SQL SCHEMA
-- Free-Tier Postgres Database, Row Level Security (RLS) & Seed Data
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image TEXT NOT NULL,
    item_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category TEXT NOT NULL REFERENCES public.categories(slug) ON UPDATE CASCADE ON DELETE RESTRICT,
    price NUMERIC(10, 2) NOT NULL,
    discount_price NUMERIC(10, 2),
    images TEXT[] NOT NULL DEFAULT '{}',
    sizes TEXT[] NOT NULL DEFAULT '{}',
    colors JSONB NOT NULL DEFAULT '[]'::jsonb,
    stock INT NOT NULL DEFAULT 10,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    rating NUMERIC(3, 2) DEFAULT 4.8,
    review_count INT DEFAULT 20,
    highlights TEXT[] DEFAULT '{}',
    specs JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY, -- e.g., FLX-8X2A-9102
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    address TEXT NOT NULL,
    pincode TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    shipping NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'upi')),
    payment_status TEXT NOT NULL DEFAULT 'pending_verification' CHECK (payment_status IN ('pending_verification', 'verified', 'failed', 'cod')),
    upi_utr TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    tracking_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    author TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Categories Policies
CREATE POLICY "Public can view categories" 
    ON public.categories FOR SELECT 
    USING (true);

CREATE POLICY "Admin can modify categories" 
    ON public.categories FOR ALL 
    USING (auth.role() = 'authenticated');

-- Products Policies
CREATE POLICY "Public can view active products" 
    ON public.products FOR SELECT 
    USING (is_active = true);

CREATE POLICY "Admin can view all products" 
    ON public.products FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert products" 
    ON public.products FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update products" 
    ON public.products FOR UPDATE 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete products" 
    ON public.products FOR DELETE 
    USING (auth.role() = 'authenticated');

-- Orders Policies
CREATE POLICY "Public can create orders" 
    ON public.orders FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Public can view their own order by id" 
    ON public.orders FOR SELECT 
    USING (true);

CREATE POLICY "Admin can manage all orders" 
    ON public.orders FOR ALL 
    USING (auth.role() = 'authenticated');

-- Reviews Policies
CREATE POLICY "Public can view reviews" 
    ON public.reviews FOR SELECT 
    USING (true);

CREATE POLICY "Public can create reviews" 
    ON public.reviews FOR INSERT 
    WITH CHECK (true);

-- 7. STORAGE BUCKET CONFIGURATION (Run in Supabase SQL Editor)
-- Create public bucket 'product-images' if not already created
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public can view product images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete product images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- 8. SEED DATA - CATEGORIES
INSERT INTO public.categories (slug, name, description, image, item_count)
VALUES
('clothing', 'Clothing', 'Heavyweight oversized tees, structured hoodies & luxury streetwear tailoring.', 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80', 4),
('watches', 'Watches', 'Automatic chronographs, minimalist sapphire dials & exhibition casebacks.', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80', 3),
('shoes', 'Shoes', 'Chunky leather sneakers, sleek chelsea boots & handcrafted runners.', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80', 3),
('accessories', 'Accessories', 'Hand-burnished leather cardholders, polarized acetate eyewear & titanium chains.', 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80', 3),
('lifestyle', 'Lifestyle', 'Artisanal soy candles, matte black tech carry & architectural desk objects.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80', 2)
ON CONFLICT (slug) DO NOTHING;

-- 9. SEED DATA - 12 SAMPLE PRODUCTS
INSERT INTO public.products (
    id, name, slug, description, category, price, discount_price, 
    images, sizes, colors, stock, is_featured, is_active, rating, review_count, highlights, specs
) VALUES
(
    'prod-1',
    'Obsidian Heavyweight Oversized Hoodie',
    'obsidian-heavyweight-oversized-hoodie',
    'Crafted from custom-milled 500 GSM loopback French terry cotton. Features an architectural drop-shoulder silhouette, double-layered hood without drawstrings, and ribbed contour cuffs.',
    'clothing',
    4999.00,
    3499.00,
    ARRAY[
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80'
    ],
    ARRAY['S', 'M', 'L', 'XL'],
    '[{"name": "Pitch Black", "hex": "#0f0f10"}, {"name": "Washed Grey", "hex": "#3f3f46"}]'::jsonb,
    24,
    true,
    true,
    4.9,
    84,
    ARRAY['500 GSM ultra-heavyweight combed French terry', 'Preshrunk fabric with silicone wash finish', 'Seamless kangaroo pocket'],
    '{"Material": "100% Combed Organic Cotton", "Weight": "500 GSM", "Fit": "Relaxed Drop Shoulder"}'::jsonb
),
(
    'prod-2',
    'Chronograph Eclipse Skeleton Watch',
    'chronograph-eclipse-skeleton-watch',
    'An open-heart automatic timepiece featuring anti-reflective sapphire crystal glass, 316L surgical-grade stainless steel case, and an Italian vegetable-tanned calfskin leather strap.',
    'watches',
    18999.00,
    12499.00,
    ARRAY[
        'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80'
    ],
    ARRAY['41mm Case'],
    '[{"name": "Matte Black / Rose Gold", "hex": "#1c1917"}, {"name": "Silver / Navy", "hex": "#64748b"}]'::jsonb,
    11,
    true,
    true,
    4.95,
    62,
    ARRAY['Automatic self-winding movement (42-hour reserve)', 'Scratch-resistant synthetic sapphire crystal', 'Water resistant to 50 meters'],
    '{"Movement": "Miyota 8N24 Skeleton", "Case": "316L Stainless Steel", "Diameter": "41mm"}'::jsonb
),
(
    'prod-3',
    'Monolith Chunky Leather Sneaker',
    'monolith-chunky-leather-sneaker',
    'Architectural sole geometry meeting full-grain Italian nappa leather. Features high-density memory foam insoles, breathable perforated vamp, and custom molded geometric outsoles.',
    'shoes',
    9499.00,
    6999.00,
    ARRAY[
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80'
    ],
    ARRAY['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    '[{"name": "Ghost White", "hex": "#f8fafc"}, {"name": "Triple Black", "hex": "#09090b"}]'::jsonb,
    18,
    true,
    true,
    4.85,
    47,
    ARRAY['Full grain cowhide leather upper', 'Orthopedic memory-cushion footbed', 'Ultra-lightweight EVA tread outsole'],
    '{"Upper": "100% Nappa Leather", "Sole": "Custom EVA Tread"}'::jsonb
),
(
    'prod-4',
    'Aero polarized Japanese Acetate Sunglasses',
    'aero-polarized-japanese-acetate-sunglasses',
    'Handcrafted from 8mm cured Japanese cellulose acetate with 5-barrel German OBE hinges. Fitted with Category 3 CR-39 polarized lenses offering 100% UV400 radiation protection.',
    'accessories',
    4499.00,
    2899.00,
    ARRAY[
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=80'
    ],
    ARRAY['Universal Fit (50-21-145)'],
    '[{"name": "Smoked Tortoise", "hex": "#451a03"}, {"name": "Gloss Black", "hex": "#000000"}]'::jsonb,
    29,
    false,
    true,
    4.8,
    39,
    ARRAY['Hand-polished bio-acetate frame', 'Polarized anti-glare scratch resistant coating'],
    '{"Frame": "Japanese Acetate", "Protection": "UV400 Polarized"}'::jsonb
),
(
    'prod-5',
    'Vanguard Tailored Cargo Trouser',
    'vanguard-tailored-cargo-trouser',
    'High-performance technical cotton ripstop meets bespoke sartorial pleats. Features dual 3D gusseted cargo compartments, concealed magnetic flaps, and adjustable hem toggles.',
    'clothing',
    5499.00,
    3899.00,
    ARRAY[
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80'
    ],
    ARRAY['30', '32', '34', '36'],
    '[{"name": "Military Olive", "hex": "#3f4238"}, {"name": "Deep Noir", "hex": "#18181b"}]'::jsonb,
    16,
    true,
    true,
    4.9,
    52,
    ARRAY['DWR water-repellent ripstop', 'German Fidlock-inspired magnetic closures'],
    '{"Material": "70% Cotton 30% Nylon Ripstop"}'::jsonb
),
(
    'prod-6',
    'Heritage Minimalist 40mm Quartz Watch',
    'heritage-minimalist-40mm-quartz-watch',
    'Designed for purity of form. Ultra-slim 6.8mm profile case with sunray brushed dial, indices in applied polished steel, and quick-change Milanese mesh strap.',
    'watches',
    7999.00,
    4999.00,
    ARRAY[
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=1000&q=80'
    ],
    ARRAY['40mm Slim Case'],
    '[{"name": "Brushed Silver", "hex": "#cbd5e1"}, {"name": "Midnight Black", "hex": "#111827"}]'::jsonb,
    35,
    false,
    true,
    4.75,
    31,
    ARRAY['Ultra-thin 6.8mm stainless case profile', 'Japanese high-precision quartz caliber'],
    '{"Movement": "Japanese Quartz", "Thickness": "6.8mm"}'::jsonb
),
(
    'prod-7',
    'Solace Chelsea Leather Boots',
    'solace-chelsea-leather-boots',
    'Classic British heritage re-engineered with modern comfort. Handcrafted from supple pull-up oil leather with elasticated side gussets and Goodyear-welted rubber lug soles.',
    'shoes',
    11999.00,
    8499.00,
    ARRAY[
        'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80'
    ],
    ARRAY['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    '[{"name": "Chestnut Brown", "hex": "#451a03"}, {"name": "Onyx Black", "hex": "#0f172a"}]'::jsonb,
    9,
    true,
    true,
    4.95,
    73,
    ARRAY['100% full grain pull-up oiled leather', 'Goodyear storm welt construction'],
    '{"Construction": "Goodyear Welted", "Sole": "Crepe Hybrid Rubber"}'::jsonb
),
(
    'prod-8',
    'Sculptural Solid Brass Keyhook & Lanyard',
    'sculptural-solid-brass-keyhook-lanyard',
    'Precision CNC-machined from solid naval brass ingot. Develops a rich natural patina over time. Paired with vegetable-tanned bridle leather and custom D-ring.',
    'accessories',
    2499.00,
    1699.00,
    ARRAY[
        'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1585832770485-e68a5dbfad52?auto=format&fit=crop&w=1000&q=80'
    ],
    ARRAY['One Size'],
    '[{"name": "Natural Brass", "hex": "#ca8a04"}, {"name": "PVD Black", "hex": "#1c1917"}]'::jsonb,
    45,
    false,
    true,
    4.7,
    28,
    ARRAY['CNC milled solid lead-free brass', 'English bridle leather strap'],
    '{"Material": "Solid Naval Brass"}'::jsonb
),
(
    'prod-9',
    'Atelier Santal & Hinoki Soy Candle',
    'atelier-santal-hinoki-soy-candle',
    'Poured in a matte ceramic vessel with volcanic basalt finish. Notes of smoky hinoki cypress, aged Australian sandalwood, cardamom, and amber resin.',
    'lifestyle',
    2199.00,
    1499.00,
    ARRAY[
        'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80'
    ],
    ARRAY['320g / 65h Burn'],
    '[{"name": "Charcoal Ceramic", "hex": "#27272a"}]'::jsonb,
    30,
    false,
    true,
    4.9,
    42,
    ARRAY['100% natural organic soy and coconut wax', 'Crackling wooden wick'],
    '{"Wax": "Soy & Coconut", "Burn Time": "65 Hours"}'::jsonb
),
(
    'prod-10',
    'Aura Oversized Acid-Wash Graphic Tee',
    'aura-oversized-acid-wash-graphic-tee',
    '280 GSM premium single jersey cotton subjected to artisanal vintage stone-wash. Screenprinted with high-density puff ink graphics and distressed rib collar.',
    'clothing',
    2799.00,
    1899.00,
    ARRAY[
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'
    ],
    ARRAY['S', 'M', 'L', 'XL'],
    '[{"name": "Washed Charcoal", "hex": "#374151"}]'::jsonb,
    50,
    true,
    true,
    4.88,
    95,
    ARRAY['280 GSM combed compact cotton', 'Artisanal vintage stone-wash'],
    '{"Material": "100% Combed Cotton", "Weight": "280 GSM"}'::jsonb
),
(
    'prod-11',
    'Nomad Modular Cordura Backpack',
    'nomad-modular-cordura-backpack',
    'Indestructible 1000D ballistic Cordura fabric with YKK Aquaguard waterproof zippers. Features dedicated 16-inch suspended laptop sleeve and magnetic sternum clasp.',
    'lifestyle',
    8999.00,
    5999.00,
    ARRAY[
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=80'
    ],
    ARRAY['24 Liters'],
    '[{"name": "Stealth Black", "hex": "#09090b"}]'::jsonb,
    14,
    true,
    true,
    4.92,
    38,
    ARRAY['1000D Cordura ballistic nylon', 'YKK Aquaguard waterproof zippers'],
    '{"Capacity": "24 Liters", "Laptop Sleeve": "Up to 16-inch"}'::jsonb
),
(
    'prod-12',
    'Cipher Minimalist RFID Leather Wallet',
    'cipher-minimalist-rfid-leather-wallet',
    'Ultra-compact bifold sculpted from Horween Chromexcel leather. Integrated aerospace-grade aluminum RFID shield protects up to 8 cards from wireless skimming.',
    'accessories',
    3299.00,
    2199.00,
    ARRAY[
        'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?auto=format&fit=crop&w=1000&q=80'
    ],
    ARRAY['Slim Cardholder (10x7cm)'],
    '[{"name": "Cognac Brown", "hex": "#78350f"}]'::jsonb,
    40,
    false,
    true,
    4.82,
    66,
    ARRAY['USA Horween full-grain leather', 'Aerospace RFID blocking shield'],
    '{"Leather": "Horween Chromexcel", "Capacity": "8 Cards + Cash"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;
