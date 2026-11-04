'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/lib/products-data';
import ProductCard from '@/components/product/ProductCard';

const TABS = [
  { label: 'All Picks', value: 'all' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Watches', value: 'watches' },
  { label: 'Shoes', value: 'shoes' },
  { label: 'Accessories', value: 'accessories' },
];

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredProducts = activeTab === 'all'
    ? SAMPLE_PRODUCTS.slice(0, 8)
    : SAMPLE_PRODUCTS.filter((p) => p.category === activeTab).slice(0, 8);

  return (
    <section className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-400 font-semibold mb-2">
              Signature Selection
            </p>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              FEATURED RELEASES
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all ${
                  activeTab === tab.value
                    ? 'bg-gold-400 text-black shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid - 2 cols on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs tracking-wider uppercase transition-colors"
          >
            <span>View Complete Catalogue</span>
            <ArrowUpRight className="w-4 h-4 text-gold-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}
