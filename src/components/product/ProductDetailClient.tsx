'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Star, 
  ShoppingBag, 
  Zap, 
  MessageCircle, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Check, 
  Tag,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import ProductGallery from '@/components/product/ProductGallery';
import PincodeChecker from '@/components/product/PincodeChecker';
import ProductCard from '@/components/product/ProductCard';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/types';
import { getProductsData } from '@/lib/products-data';
import { 
  formatPrice, 
  calculateDiscountPercentage, 
  getWhatsAppProductUrl 
} from '@/lib/utils';

interface ProductDetailClientProps {
  slug: string;
  initialProduct?: Product | null;
  initialRelatedProducts?: Product[];
}

export default function ProductDetailClient({
  slug,
  initialProduct,
  initialRelatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>(initialRelatedProducts || []);
  const [loading, setLoading] = useState(!initialProduct);

  const [selectedSize, setSelectedSize] = useState(initialProduct?.sizes?.[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState(initialProduct?.colors?.[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  useEffect(() => {
    const all = getProductsData();
    const found = all.find((p) => p.slug === slug);
    if (found) {
      setProduct(found);
      if (found.sizes?.length) setSelectedSize(found.sizes[0]);
      if (found.colors?.length) setSelectedColor(found.colors[0]?.name);

      const rel = all.filter((p) => p.category === found.category && p.id !== found.id).slice(0, 4);
      setRelatedProducts(rel);
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-zinc-950 min-h-screen py-24 flex flex-col items-center justify-center text-zinc-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
        <span className="text-xs uppercase tracking-widest font-mono">Loading product details...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-zinc-950 min-h-screen py-24 px-4 flex flex-col items-center justify-center text-center">
        <h2 className="font-display font-black text-2xl sm:text-3xl text-white mb-2">
          PRODUCT NOT FOUND
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mb-8">
          The requested product may have been moved or removed from our catalog inventory.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-gold-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Products</span>
        </Link>
      </div>
    );
  }

  const discountPercent = calculateDiscountPercentage(product.price, product.discountPrice);
  const currentPrice = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const savings = originalPrice ? originalPrice - currentPrice : 0;
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedSize, selectedColor);
    router.push('/checkout');
  };

  const handleWhatsAppOrder = () => {
    const productUrl = typeof window !== 'undefined'
      ? window.location.href
      : `/product/${product.slug}`;
    const url = getWhatsAppProductUrl(product.name, productUrl, whatsappNumber);
    window.open(url, '_blank');
  };

  return (
    <div className="bg-zinc-950 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-8 font-mono uppercase tracking-wider overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-gold-400">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-gold-400">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-gold-400 capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-zinc-300 truncate">{product.name}</span>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: Gallery (7 Cols on desktop) */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right: Purchasing Details (5 Cols on desktop) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-widest font-mono text-gold-400 font-bold">
                  {product.category}
                </span>
                <div className="flex items-center gap-1.5 text-xs bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full text-zinc-300">
                  <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                  <span className="font-bold text-white">{product.rating}</span>
                  <span className="text-zinc-500">({product.reviewCount} Reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Stock Status Badge */}
              <div className="mt-2.5 flex items-center gap-2 text-xs">
                {product.stock > 0 ? (
                  product.stock < 15 ? (
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      Hurry, only {product.stock} units left in stock!
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      In Stock • Ready to Dispatch
                    </span>
                  )
                ) : (
                  <span className="text-rose-400 font-semibold">Currently Sold Out</span>
                )}
              </div>
            </div>

            {/* Flipkart-Style Price Card */}
            <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="font-mono font-black text-3xl sm:text-4xl text-white">
                  {formatPrice(currentPrice)}
                </span>
                {originalPrice && (
                  <span className="font-mono text-sm sm:text-base text-zinc-500 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-mono text-xs font-bold uppercase tracking-wider">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {savings > 0 && (
                <p className="text-xs font-semibold text-emerald-400">
                  You save {formatPrice(savings)} on this purchase. (Inclusive of all taxes)
                </p>
              )}

              {/* Flipkart Offers Pill */}
              <div className="pt-2 border-t border-zinc-800 space-y-1.5 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>
                    <strong>Special Offer:</strong> Use coupon <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-gold-400 font-bold">FLEXO10</code> for flat 10% OFF at checkout.
                  </span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Tag className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>
                    <strong>UPI Bonus:</strong> Zero payment fees & instant priority dispatch on UPI verification.
                  </span>
                </div>
              </div>
            </div>

            {/* Color Selector */}
            {product.colors.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold uppercase tracking-wider text-zinc-400">
                    Color: <strong className="text-white">{selectedColor}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all p-0.5 ${
                        selectedColor === c.name
                          ? 'border-gold-400 ring-2 ring-gold-400/30 scale-110'
                          : 'border-zinc-700 hover:border-zinc-500'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {selectedColor === c.name && (
                        <Check className="w-3.5 h-3.5 text-white mx-auto drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold uppercase tracking-wider text-zinc-400">
                    Select Size: <strong className="text-white">{selectedSize}</strong>
                  </span>
                  <span className="text-zinc-500 underline cursor-pointer hover:text-white">
                    Size Guide
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[48px] px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        selectedSize === s
                          ? 'bg-gold-400 text-black border-gold-400 font-bold shadow-md'
                          : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Flipkart Pincode Checker */}
            <PincodeChecker />

            {/* Main Purchasing Buttons */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full py-4 rounded-2xl font-display font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl ${
                    isAdded
                      ? 'bg-emerald-500 text-white'
                      : 'bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-gold-400" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="w-full py-4 rounded-2xl bg-gold-400 hover:bg-gold-300 text-black font-display font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-gold-500/10 active:scale-[0.98]"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>Buy Now (Instant)</span>
                </button>
              </div>

              {/* WhatsApp Direct Order / Inquiry Button */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-3.5 rounded-2xl bg-emerald-600/15 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2 group"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:text-white transition-colors" />
                <span>WhatsApp Help & Quick Order</span>
              </button>
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-800 text-center text-zinc-400 text-[11px]">
              <div className="p-2.5 rounded-xl bg-zinc-900/40 border border-zinc-855">
                <Truck className="w-4 h-4 text-gold-400 mx-auto mb-1" />
                <span>Free Express Shipping</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/40 border border-zinc-855">
                <MessageCircle className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span>WhatsApp Help</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/40 border border-zinc-855">
                <ShieldCheck className="w-4 h-4 text-gold-400 mx-auto mb-1" />
                <span>100% Genuine Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs (Description, Specs, Reviews) */}
        <div className="mt-20 border-t border-zinc-800 pt-12">
          {/* Tab Selector */}
          <div className="flex items-center gap-8 border-b border-zinc-800 mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === 'description' ? 'text-gold-400' : 'text-zinc-500 hover:text-white'
              }`}
            >
              Description & Highlights
              {activeTab === 'description' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === 'specs' ? 'text-gold-400' : 'text-zinc-500 hover:text-white'
              }`}
            >
              Specifications & Material
              {activeTab === 'specs' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === 'reviews' ? 'text-gold-400' : 'text-zinc-500 hover:text-white'
              }`}
            >
              Customer Reviews ({product.reviewCount})
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400" />
              )}
            </button>
          </div>

          {/* Tab Contents */}
          <div className="max-w-4xl">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                  {product.description}
                </p>

                {product.highlights && product.highlights.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-3">
                      Key Distinctions
                    </h4>
                    <ul className="space-y-2">
                      {product.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                          <Check className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="rounded-2xl border border-zinc-800 divide-y divide-zinc-800 overflow-hidden bg-zinc-900/40">
                {product.specs && Object.keys(product.specs).length > 0 ? (
                  Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 p-4 text-xs sm:text-sm">
                      <span className="font-bold text-zinc-400 uppercase tracking-wider">{key}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-sm text-zinc-400">
                    Standard high-grade artisanal craftsmanship. 100% genuine components.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  <div className="text-3xl font-display font-black text-white">{product.rating}</div>
                  <div>
                    <div className="flex items-center text-gold-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">Based on {product.reviewCount} verified buyer reviews</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">Rohit Malhotra</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">Verified Purchase</span>
                    </div>
                    <div className="flex text-gold-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-300">
                      Exceeded expectations in terms of fabric weight and silhouette. The packaging is pure luxury.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">Shreya Roy</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">Verified Purchase</span>
                    </div>
                    <div className="flex text-gold-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-300">
                      Placed order with UPI QR and verified quickly. Received delivery in Mumbai within 48 hours!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-zinc-800 pt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold">
                  Curated Pairings
                </p>
                <h3 className="font-display font-black text-2xl text-white tracking-tight mt-1">
                  YOU MAY ALSO APPRECIATE
                </h3>
              </div>
              <Link
                href="/shop"
                className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-gold-400 transition-colors"
              >
                View Collection &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
