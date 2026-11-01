'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/lib/products-data';
import ProductCard from '@/components/product/ProductCard';

export default function DealsSection() {
  // Live countdown timer for Flipkart-style urgency
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 34, seconds: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter top discounted products
  const dealProducts = SAMPLE_PRODUCTS.filter(
    (p) => p.discountPrice && p.price - p.discountPrice >= 1000
  ).slice(0, 4);

  return (
    <section id="deals" className="py-20 bg-zinc-900/40 border-y border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Deal Banner Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-8 mb-10 border-b border-zinc-800 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-rose-500">
                  ⚡ FLASH DROP
                </span>
                <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">
                  Flipkart Special Deals
                </span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mt-0.5">
                DEALS OF THE DAY
              </h2>
            </div>
          </div>

          {/* Flipkart-style Live Countdown Pill */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-2xl shadow-inner">
              <Clock className="w-4 h-4 text-gold-400" />
              <span className="text-xs text-zinc-400 font-medium mr-1">Ends in:</span>
              <div className="flex items-center gap-1 font-mono font-bold text-sm text-white">
                <span className="bg-zinc-800 px-2 py-1 rounded">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="bg-zinc-800 px-2 py-1 rounded">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="bg-zinc-800 px-2 py-1 rounded text-gold-400">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-400 hover:text-gold-300 transition-colors"
            >
              <span>See All Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Flipkart-style Promo Notice */}
        <div className="mt-10 p-4 rounded-2xl bg-zinc-950/70 border border-gold-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-300">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-gold-400 shrink-0" />
            <span>
              <strong>Bank & UPI Offer:</strong> Extra 10% instant discount on UPI QR payment + Free Express Shipping across India.
            </span>
          </div>
          <Link
            href="/shop"
            className="text-gold-400 font-semibold hover:underline shrink-0 text-xs"
          >
            Explore all eligible items &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
