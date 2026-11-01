'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Sparkles 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    itemCount,
    removeItem,
    updateQuantity,
    subtotal,
    discount,
    shipping,
    total,
    isDrawerOpen,
    setIsDrawerOpen,
  } = useCart();

  const freeShippingThreshold = 999;
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleCheckoutClick = () => {
    setIsDrawerOpen(false);
    router.push('/checkout');
  };

  const handleViewCartClick = () => {
    setIsDrawerOpen(false);
    router.push('/cart');
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl z-50 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gold-400" />
                <h3 className="font-display font-bold text-lg text-white">Your Cart</h3>
                <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full font-mono">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress bar */}
            <div className="px-5 py-3 bg-zinc-900/60 border-b border-zinc-800 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Truck className="w-3.5 h-3.5 text-gold-400" />
                  {amountNeeded > 0 ? (
                    <span>
                      Add <strong className="text-gold-400">{formatPrice(amountNeeded)}</strong> more for <strong>FREE Shipping</strong>!
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Congratulations! You unlocked FREE Express Shipping
                    </span>
                  )}
                </span>
                <span className="font-mono text-zinc-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-gold-500 to-amber-300 rounded-full"
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-5 divide-y divide-zinc-800/80">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-semibold text-lg text-white mb-1">
                    Your cart is empty
                  </h4>
                  <p className="text-sm text-zinc-400 max-w-xs mb-6">
                    Looks like you haven&apos;t added any luxury pieces to your cart yet.
                  </p>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      router.push('/shop');
                    }}
                    className="px-6 py-2.5 rounded-full bg-gold-400 hover:bg-gold-300 text-black font-semibold text-sm transition-colors"
                  >
                    Explore Shop
                  </button>
                </div>
              ) : (
                items.map((item, index) => {
                  const unitPrice = item.product.discountPrice || item.product.price;
                  return (
                    <motion.div
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`flex gap-4 ${index > 0 ? 'pt-4' : ''} pb-4`}
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-24 object-cover rounded-xl border border-zinc-800 shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/product/${item.product.slug}`}
                              onClick={() => setIsDrawerOpen(false)}
                              className="text-sm font-semibold text-white hover:text-gold-400 line-clamp-1 transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            <button
                              onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                              className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                            <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                              Size: {item.selectedSize}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                              {item.selectedColor}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-zinc-800 rounded-lg bg-zinc-900/80">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                              className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-mono font-medium text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                              className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-mono font-semibold text-sm text-gold-400">
                            {formatPrice(unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer / Checkout Actions */}
            {items.length > 0 && (
              <div className="p-5 border-t border-zinc-800 bg-zinc-950 space-y-3">
                <div className="space-y-1.5 text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-zinc-200 font-mono">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount</span>
                      <span className="font-mono">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-zinc-200 font-mono">
                      {shipping === 0 ? <span className="text-emerald-400 font-semibold">FREE</span> : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-white pt-2 border-t border-zinc-800">
                    <span>Estimated Total</span>
                    <span className="text-gold-400 font-mono text-base">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={handleViewCartClick}
                    className="w-full py-3 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-medium text-xs tracking-wider uppercase transition-colors"
                  >
                    View Cart
                  </button>
                  <button
                    onClick={handleCheckoutClick}
                    className="w-full py-3 rounded-xl bg-gold-400 hover:bg-gold-300 text-black font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-1.5 group"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
