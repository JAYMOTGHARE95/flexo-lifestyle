'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Tag, 
  Check, 
  X 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    itemCount,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    couponCode,
    applyCoupon,
    removeCoupon,
    shipping,
    total,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);
    const result = applyCoupon(inputCoupon);
    if (result.success) {
      setCouponSuccess(result.message);
      setInputCoupon('');
    } else {
      setCouponError(result.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-zinc-950 flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gold-400" />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
            Your personal selection is waiting. Explore our signature collection of luxury streetwear, automatic timepieces, and accessories.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gold-400 hover:bg-gold-300 text-black font-display font-extrabold text-xs uppercase tracking-wider transition-colors shadow-lg"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-zinc-800 gap-4">
          <div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              SHOPPING CART
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              You have {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-zinc-500 hover:text-rose-400 transition-colors self-start sm:self-auto"
          >
            Clear Entire Cart
          </button>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Items Table (7 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => {
              const unitPrice = item.product.discountPrice || item.product.price;
              const originalPrice = item.product.discountPrice ? item.product.price : null;

              return (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="p-4 sm:p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-24 object-cover rounded-xl border border-zinc-800 shrink-0"
                    />
                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-semibold">
                        {item.product.category}
                      </span>
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="block font-display font-bold text-sm sm:text-base text-white hover:text-gold-400 transition-colors truncate"
                      >
                        {item.product.name}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 pt-0.5">
                        <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                          Size: {item.selectedSize}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                          {item.selectedColor}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Pricing */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-850">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-zinc-800 rounded-xl bg-zinc-950">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        className="p-2 text-zinc-400 hover:text-white transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + 1,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        className="p-2 text-zinc-400 hover:text-white transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="font-mono font-bold text-base text-white">
                        {formatPrice(unitPrice * item.quantity)}
                      </div>
                      {originalPrice && (
                        <div className="font-mono text-xs text-zinc-500 line-through">
                          {formatPrice(originalPrice * item.quantity)}
                        </div>
                      )}
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() =>
                        removeItem(
                          item.product.id,
                          item.selectedSize,
                          item.selectedColor
                        )
                      }
                      className="text-zinc-500 hover:text-rose-400 transition-colors p-1.5"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Trust Assurances */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-850 flex items-center gap-3">
                <Truck className="w-5 h-5 text-gold-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-white block">Free Express Delivery</span>
                  <span className="text-zinc-400">On all orders above ₹999</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-850 flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-gold-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-white block">7-Day Replacement</span>
                  <span className="text-zinc-400">Hassle-free guarantee</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-850 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-gold-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-white block">100% Genuine</span>
                  <span className="text-zinc-400">Handcrafted quality</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & Coupon (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-5">
              <h2 className="font-display font-bold text-lg text-white">Order Summary</h2>

              {/* Price Details */}
              <div className="space-y-3 text-xs text-zinc-300 border-b border-zinc-800 pb-5">
                <div className="flex justify-between">
                  <span>Bag Subtotal ({itemCount} items)</span>
                  <span className="font-mono text-zinc-100">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Coupon Savings ({couponCode})</span>
                    <span className="font-mono">-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping & Delivery</span>
                  <span className="font-mono">
                    {shipping === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-zinc-800">
                  <span>Total Amount</span>
                  <span className="font-mono text-gold-400 text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Coupon Box */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                  Promo / Coupon Code
                </label>
                {couponCode ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span className="font-bold">{couponCode}</span>
                      <span>applied (-{formatPrice(discount)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-zinc-400 hover:text-white p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                      placeholder="e.g. FLEXO10"
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 uppercase font-mono focus:outline-none focus:border-gold-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-zinc-800 hover:bg-gold-400 hover:text-black text-white text-xs font-semibold rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponSuccess && (
                  <p className="text-[11px] text-emerald-400 font-medium">{couponSuccess}</p>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-400 font-medium">{couponError}</p>
                )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-4 rounded-xl bg-gold-400 hover:bg-gold-300 text-black font-display font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-gold-500/10"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <Link
                  href="/shop"
                  className="text-xs text-zinc-500 hover:text-gold-400 transition-colors"
                >
                  &larr; Continue Browsing Catalogue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
