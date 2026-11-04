'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Heart, Check, MessageCircle } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice, calculateDiscountPercentage, getWhatsAppProductUrl } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discountPercent = calculateDiscountPercentage(product.price, product.discountPrice);
  const displayPrice = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/product/${product.slug}`
      : `/product/${product.slug}`;
    const url = getWhatsAppProductUrl(product.name, productUrl, whatsappNumber);
    window.open(url, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-zinc-700/80 transition-all duration-300 shadow-md hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Hover Swap */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-zinc-900 block">
        {/* Main Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
            isHovered && product.images[1] ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
        />

        {/* Alternate Image on Hover */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
        )}

        {/* Badges Overlay */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-rose-600 text-white font-mono text-[9px] sm:text-[11px] font-bold uppercase tracking-wider shadow">
              {discountPercent}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-gold-400 text-black font-mono text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider shadow">
              Exclusive
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isWishlisted
              ? 'bg-rose-500 text-white'
              : 'bg-black/50 text-zinc-300 hover:text-white'
          }`}
          aria-label="Save to wishlist"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick WhatsApp Inquiry - visible always on touch mobile, hover on desktop */}
        <button
          onClick={handleWhatsAppInquiry}
          className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 p-1.5 sm:p-2 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10 shadow-lg active:scale-90"
          title="Inquire / Order on WhatsApp"
          aria-label="Order on WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Flipkart-style Quick Add Button on Hover (Desktop) */}
        <div className="absolute bottom-3 right-3 left-14 z-10 hidden sm:block opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-xl ${
              isAdded
                ? 'bg-emerald-500 text-white'
                : product.stock === 0
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-gold-400 hover:bg-gold-300 text-black'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : product.stock === 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2 sm:gap-3">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="uppercase tracking-widest text-[9px] sm:text-[10px] text-gold-400/90 font-medium truncate">
              {product.category}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] font-semibold text-zinc-300 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 shrink-0">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold-400 fill-gold-400" />
              <span>{product.rating}</span>
              <span className="text-zinc-500 hidden sm:inline">({product.reviewCount})</span>
            </div>
          </div>

          <Link href={`/product/${product.slug}`} className="block group/title">
            <h3 className="font-display font-medium text-xs sm:text-sm text-zinc-100 line-clamp-2 sm:line-clamp-1 group-hover/title:text-gold-400 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing + Mobile Add Button */}
        <div className="flex items-center justify-between pt-1 border-t border-zinc-900">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
            <span className="font-mono font-bold text-sm sm:text-base text-white">
              {formatPrice(displayPrice)}
            </span>
            {originalPrice && (
              <span className="font-mono text-[10px] sm:text-xs text-zinc-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Mobile direct add icon */}
          <button
            onClick={handleQuickAdd}
            className="sm:hidden p-2 rounded-xl bg-gold-400 text-black active:scale-95 transition-transform shrink-0"
            aria-label="Add to cart"
          >
            {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
