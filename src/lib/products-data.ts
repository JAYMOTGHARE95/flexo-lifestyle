import { Category, Product } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-fashion',
    name: 'Fashion & Clothing',
    slug: 'fashion-clothing',
    description: 'Heavyweight oversized tees, structured hoodies, technical ripstop trousers & tailored streetwear.',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80',
    itemCount: 3,
    subcategories: [
      { id: 'sub-tees', name: 'Oversized Tees', slug: 'oversized-tees' },
      { id: 'sub-hoodies', name: 'Heavyweight Hoodies', slug: 'heavyweight-hoodies' },
      { id: 'sub-cargoes', name: 'Tailored Cargoes', slug: 'tailored-cargoes' },
      { id: 'sub-jackets', name: 'Jackets & Overshirts', slug: 'jackets-overshirts' },
    ],
  },
  {
    id: 'cat-footwear',
    name: 'Footwear',
    slug: 'footwear',
    description: 'Chunky architectural sneakers, Goodyear-welted chelsea boots, and handcrafted leather runners.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    itemCount: 2,
    subcategories: [
      { id: 'sub-sneakers', name: 'Chunky Sneakers', slug: 'chunky-sneakers' },
      { id: 'sub-boots', name: 'Chelsea Boots', slug: 'chelsea-boots' },
      { id: 'sub-loafers', name: 'Dress Loafers', slug: 'dress-loafers' },
    ],
  },
  {
    id: 'cat-watches',
    name: 'Watches',
    slug: 'watches',
    description: 'Automatic skeleton movements, anti-reflective sapphire crystal dials, and surgical steel chronographs.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    itemCount: 2,
    subcategories: [
      { id: 'sub-skeleton', name: 'Automatic Skeleton', slug: 'automatic-skeleton' },
      { id: 'sub-chronograph', name: 'Chronographs', slug: 'chronographs' },
      { id: 'sub-quartz', name: 'Minimalist Quartz', slug: 'minimalist-quartz' },
    ],
  },
  {
    id: 'cat-electronics',
    name: 'Electronics & Gadgets',
    slug: 'electronics-gadgets',
    description: 'Studio ANC headphones, MagSafe carbon powerbanks, titanium braided fast cables, and acoustic audio.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    itemCount: 2,
    subcategories: [
      { id: 'sub-headphones', name: 'Studio ANC Audio', slug: 'studio-anc-audio' },
      { id: 'sub-power', name: 'Fast GaN Chargers & Power', slug: 'fast-chargers-power' },
      { id: 'sub-desk-tech', name: 'Desk Tech & Docks', slug: 'desk-tech-docks' },
    ],
  },
  {
    id: 'cat-accessories',
    name: 'Fashion Accessories',
    slug: 'fashion-accessories',
    description: 'Polarized Japanese bio-acetate eyewear, RFID full-grain cardholders, and CNC naval brass keychains.',
    image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80',
    itemCount: 2,
    subcategories: [
      { id: 'sub-eyewear', name: 'Polarized Eyewear', slug: 'polarized-eyewear' },
      { id: 'sub-wallets', name: 'Leather Wallets', slug: 'leather-wallets' },
      { id: 'sub-chains', name: 'Brass & Titanium Accents', slug: 'brass-titanium-accents' },
    ],
  },
  {
    id: 'cat-personal-care',
    name: 'Personal Care',
    slug: 'personal-care',
    description: 'Extrait de parfum, organic cold-pressed grooming elixirs, and bespoke apothecary formulations.',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80',
    itemCount: 1,
    subcategories: [
      { id: 'sub-perfume', name: 'Artisanal Perfumes', slug: 'artisanal-perfumes' },
      { id: 'sub-grooming', name: 'Grooming & Elixirs', slug: 'grooming-elixirs' },
    ],
  },
  {
    id: 'cat-lifestyle',
    name: 'Home & Lifestyle',
    slug: 'home-lifestyle',
    description: 'Artisanal soy & hinoki candles, 1000D Cordura carry backpacks, and sculptural desk architecture.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    itemCount: 2,
    subcategories: [
      { id: 'sub-candles', name: 'Apothecary Candles', slug: 'apothecary-candles' },
      { id: 'sub-backpacks', name: 'Ballistic Backpacks', slug: 'ballistic-backpacks' },
      { id: 'sub-decor', name: 'Sculptural Objects', slug: 'sculptural-objects' },
    ],
  },
];

// Helper to get categories from localStorage if modified by the owner in admin panel
export function getCategoriesData(): Category[] {
  if (typeof window === 'undefined') {
    return INITIAL_CATEGORIES;
  }
  try {
    const stored = localStorage.getItem('flexo_categories_v2');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed reading categories from localStorage', e);
  }
  return INITIAL_CATEGORIES;
}

export const CATEGORIES: Category[] = INITIAL_CATEGORIES;

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Obsidian Heavyweight Oversized Hoodie',
    slug: 'obsidian-heavyweight-oversized-hoodie',
    description: 'Crafted from custom-milled 500 GSM loopback French terry cotton. Features an architectural drop-shoulder silhouette, double-layered hood without drawstrings, and ribbed contour cuffs.',
    category: 'fashion-clothing',
    subcategory: 'heavyweight-hoodies',
    price: 4999,
    discountPrice: 3499,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pitch Black', hex: '#0f0f10' },
      { name: 'Washed Grey', hex: '#3f3f46' },
      { name: 'Bone White', hex: '#f4f4f0' },
    ],
    stock: 24,
    isFeatured: true,
    isActive: true,
    rating: 4.9,
    reviewCount: 84,
    highlights: [
      '500 GSM ultra-heavyweight combed French terry',
      'Preshrunk fabric with silicone wash finish',
      'Seamless kangaroo pocket with reinforced bar-tacks',
      'Made in limited artisanal batches',
    ],
    specs: {
      Material: '100% Combed Organic Cotton',
      Weight: '500 GSM',
      Fit: 'Relaxed Drop Shoulder Boxy Fit',
      Care: 'Cold Machine Wash Inside Out',
    },
  },
  {
    id: 'prod-2',
    name: 'Chronograph Eclipse Skeleton Watch',
    slug: 'chronograph-eclipse-skeleton-watch',
    description: 'An open-heart automatic timepiece featuring anti-reflective sapphire crystal glass, 316L surgical-grade stainless steel case, and an Italian vegetable-tanned calfskin leather strap.',
    category: 'watches',
    subcategory: 'automatic-skeleton',
    price: 18999,
    discountPrice: 12499,
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1547996160-71dfabb1a9b1?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['41mm Case'],
    colors: [
      { name: 'Matte Black / Rose Gold', hex: '#1c1917' },
      { name: 'Silver / Navy', hex: '#64748b' },
    ],
    stock: 11,
    isFeatured: true,
    isActive: true,
    rating: 4.95,
    reviewCount: 62,
    highlights: [
      'Automatic self-winding movement (42-hour power reserve)',
      'Scratch-resistant synthetic sapphire crystal lens',
      'Water resistant to 50 meters (5 ATM)',
      'Interchangeable quick-release Italian leather strap',
    ],
    specs: {
      Movement: 'Miyota 8N24 Skeleton Automatic',
      CaseDiameter: '41mm',
      CaseThickness: '11.8mm',
      StrapWidth: '20mm',
    },
  },
  {
    id: 'prod-3',
    name: 'Monolith Chunky Leather Sneaker',
    slug: 'monolith-chunky-leather-sneaker',
    description: 'Architectural sole geometry meeting full-grain Italian nappa leather. Features high-density memory foam insoles, breathable perforated vamp, and custom molded geometric outsoles.',
    category: 'footwear',
    subcategory: 'chunky-sneakers',
    price: 9499,
    discountPrice: 6999,
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: [
      { name: 'Ghost White', hex: '#f8fafc' },
      { name: 'Triple Black', hex: '#09090b' },
    ],
    stock: 18,
    isFeatured: true,
    isActive: true,
    rating: 4.85,
    reviewCount: 47,
    highlights: [
      'Full grain cowhide leather upper',
      'Orthopedic memory-cushion dual density footbed',
      'Ultra-lightweight EVA tread outsole',
      'Waxed cotton laces with metal aglets',
    ],
    specs: {
      Upper: '100% Genuine Italian Nappa Leather',
      Lining: 'Antibacterial Breathable Mesh',
      Sole: 'Custom Lightweight Molded EVA',
    },
  },
  {
    id: 'prod-4',
    name: 'Aero Polarized Japanese Acetate Sunglasses',
    slug: 'aero-polarized-japanese-acetate-sunglasses',
    description: 'Handcrafted from 8mm cured Japanese cellulose acetate with 5-barrel German OBE hinges. Fitted with Category 3 CR-39 polarized lenses offering 100% UV400 radiation protection.',
    category: 'fashion-accessories',
    subcategory: 'polarized-eyewear',
    price: 4499,
    discountPrice: 2899,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['Universal Fit (50-21-145)'],
    colors: [
      { name: 'Smoked Tortoise', hex: '#451a03' },
      { name: 'Gloss Black', hex: '#000000' },
    ],
    stock: 29,
    isFeatured: false,
    isActive: true,
    rating: 4.8,
    reviewCount: 39,
    highlights: [
      'Hand-polished bio-acetate frame',
      'Polarized anti-glare scratch resistant coating',
      'Includes magnetic vegan leather case & micro-cloth',
    ],
  },
  {
    id: 'prod-5',
    name: 'Vanguard Tailored Cargo Trouser',
    slug: 'vanguard-tailored-cargo-trouser',
    description: 'High-performance technical cotton ripstop meets bespoke sartorial pleats. Features dual 3D gusseted cargo compartments, concealed magnetic flaps, and adjustable hem toggles.',
    category: 'fashion-clothing',
    subcategory: 'tailored-cargoes',
    price: 5499,
    discountPrice: 3899,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['30', '32', '34', '36'],
    colors: [
      { name: 'Military Olive', hex: '#3f4238' },
      { name: 'Deep Noir', hex: '#18181b' },
    ],
    stock: 16,
    isFeatured: true,
    isActive: true,
    rating: 4.9,
    reviewCount: 52,
    highlights: [
      'DWR water-repellent cotton-nylon ripstop',
      'Articulated knees for effortless movement',
      'German Fidlock-inspired magnetic closures',
    ],
  },
  {
    id: 'prod-6',
    name: 'Aura Studio Wireless ANC Headphones',
    slug: 'aura-studio-wireless-anc-headphones',
    description: 'Custom 40mm titanium diaphragm drivers with hybrid active noise cancellation (-42dB). Features ultra-low latency wireless, breathable memory protein ear cushions, and 50-hour playback.',
    category: 'electronics-gadgets',
    subcategory: 'studio-anc-audio',
    price: 12999,
    discountPrice: 8999,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['Over-Ear'],
    colors: [
      { name: 'Matte Obsidian', hex: '#18181b' },
      { name: 'Alabaster Silver', hex: '#e4e4e7' },
    ],
    stock: 15,
    isFeatured: true,
    isActive: true,
    rating: 4.94,
    reviewCount: 58,
    highlights: [
      '40mm custom titanium dynamic drivers',
      'Hybrid ANC with ambient pass-through transparency mode',
      '50-hour battery life with USB-C fast charge (10 min = 5 hours)',
      'Multipoint connection across laptop and phone',
    ],
    specs: {
      Battery: '50 Hours Playback',
      Bluetooth: '5.3 with AAC/aptX HD',
      Weight: '245 Grams',
    },
  },
  {
    id: 'prod-7',
    name: 'Solace Chelsea Leather Boots',
    slug: 'solace-chelsea-leather-boots',
    description: 'Classic British heritage re-engineered with modern comfort. Handcrafted from supple pull-up oil leather with elasticated side gussets and Goodyear-welted rubber lug soles.',
    category: 'footwear',
    subcategory: 'chelsea-boots',
    price: 11999,
    discountPrice: 8499,
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: [
      { name: 'Chestnut Brown', hex: '#451a03' },
      { name: 'Onyx Black', hex: '#0f172a' },
    ],
    stock: 9,
    isFeatured: true,
    isActive: true,
    rating: 4.95,
    reviewCount: 73,
    highlights: [
      '100% full grain pull-up oiled leather',
      'Durable Goodyear storm welt construction',
      'Shock-absorbing crepe-rubber hybrid lug sole',
    ],
  },
  {
    id: 'prod-8',
    name: 'Noir Santal 100ml Extrait de Parfum',
    slug: 'noir-santal-100ml-extrait-de-parfum',
    description: 'Concentrated 30% oil formulation blended in small artisanal batches. Opens with pink pepper and smoky cardamom, yielding to rare Mysore sandalwood, vetiver, and dark ambergris.',
    category: 'personal-care',
    subcategory: 'artisanal-perfumes',
    price: 4999,
    discountPrice: 3499,
    images: [
      'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['100ml / 3.4 fl. oz.'],
    colors: [{ name: 'Smoked Glass Flacon', hex: '#1c1917' }],
    stock: 22,
    isFeatured: true,
    isActive: true,
    rating: 4.92,
    reviewCount: 45,
    highlights: [
      '30% Extrait de Parfum high-concentration oil',
      'Lasts 12+ hours with rich projection',
      'Cruelty-free, vegan, allergen-certified',
    ],
  },
  {
    id: 'prod-9',
    name: 'Atelier Hinoki & Volcanic Soy Candle',
    slug: 'atelier-hinoki-volcanic-soy-candle',
    description: 'Poured in a hand-thrown matte ceramic vessel with volcanic basalt finish. Notes of smoky hinoki cypress, Australian sandalwood, cardamom, and amber resin.',
    category: 'home-lifestyle',
    subcategory: 'apothecary-candles',
    price: 2199,
    discountPrice: 1499,
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['320g / 65h Burn'],
    colors: [{ name: 'Charcoal Ceramic', hex: '#27272a' }],
    stock: 30,
    isFeatured: false,
    isActive: true,
    rating: 4.9,
    reviewCount: 42,
    highlights: [
      '100% natural organic soy and coconut wax',
      'FSC-certified crackling wooden wick',
      'Zero petroleum or parabens',
    ],
  },
  {
    id: 'prod-10',
    name: 'Aura Oversized Acid-Wash Graphic Tee',
    slug: 'aura-oversized-acid-wash-graphic-tee',
    description: '280 GSM premium single jersey cotton subjected to artisanal vintage stone-wash. Screenprinted with high-density puff ink graphics and distressed rib collar.',
    category: 'fashion-clothing',
    subcategory: 'oversized-tees',
    price: 2799,
    discountPrice: 1899,
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Washed Charcoal', hex: '#374151' },
      { name: 'Acid Brown', hex: '#582f0e' },
    ],
    stock: 50,
    isFeatured: true,
    isActive: true,
    rating: 4.88,
    reviewCount: 95,
    highlights: [
      '280 GSM combed compact cotton',
      'Artisanal vintage stone-wash',
      'Will not crack or fade over multiple washes',
    ],
  },
  {
    id: 'prod-11',
    name: 'Nomad Modular 1000D Cordura Backpack',
    slug: 'nomad-modular-1000d-cordura-backpack',
    description: 'Indestructible 1000D ballistic Cordura fabric with YKK Aquaguard waterproof zippers. Features dedicated 16-inch suspended laptop sleeve and magnetic sternum clasp.',
    category: 'home-lifestyle',
    subcategory: 'ballistic-backpacks',
    price: 8999,
    discountPrice: 5999,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['24 Liters'],
    colors: [
      { name: 'Stealth Black', hex: '#09090b' },
      { name: 'Concrete Gray', hex: '#4b5563' },
    ],
    stock: 14,
    isFeatured: true,
    isActive: true,
    rating: 4.92,
    reviewCount: 38,
    highlights: [
      '1000D Cordura ballistic nylon',
      'YKK Aquaguard waterproof tape zippers',
      'Ergonomic EVA perforated air-mesh back panel',
    ],
  },
  {
    id: 'prod-12',
    name: 'Cipher Minimalist RFID Horween Wallet',
    slug: 'cipher-minimalist-rfid-horween-wallet',
    description: 'Ultra-compact bifold sculpted from Horween Chromexcel leather. Integrated aerospace-grade aluminum RFID shield protects up to 8 cards from wireless skimming.',
    category: 'fashion-accessories',
    subcategory: 'leather-wallets',
    price: 3299,
    discountPrice: 2199,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['Slim Cardholder (10x7cm)'],
    colors: [
      { name: 'Cognac Brown', hex: '#78350f' },
      { name: 'Obsidian Black', hex: '#0a0a0a' },
    ],
    stock: 40,
    isFeatured: false,
    isActive: true,
    rating: 4.82,
    reviewCount: 66,
    highlights: [
      'USA Horween full-grain leather',
      'Aerospace RFID blocking shield',
      'Hand-stitched with waxed polyester thread',
    ],
  },
];

// Helper to get products from localStorage if modified by the owner in admin panel
export function getProductsData(): Product[] {
  if (typeof window === 'undefined') {
    return SAMPLE_PRODUCTS;
  }
  try {
    const stored = localStorage.getItem('flexo_products_v2');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed reading products from localStorage', e);
  }
  return SAMPLE_PRODUCTS;
}

export function saveLocalProducts(products: Product[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('flexo_products_v2', JSON.stringify(products));
    window.dispatchEvent(new Event('products-updated'));
  }
}

