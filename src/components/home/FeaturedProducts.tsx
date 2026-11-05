'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getProductsData, getCategoriesData } from '@/lib/products-data';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/product/ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const refreshData = () => {
      setProducts(getProductsData());
      setCategories(getCategoriesData());
    };

    refreshData();

    window.addEventListener('products-updated', refreshData);
    window.addEventListener('categories-updated', refreshData);
    return () => {
      window.removeEventListener('products-updated', refreshData);
      window.removeEventListener('categories-updated', refreshData);
    };
  }, []);

  // Filter tabs: "All" + each active category
  const tabs = [
    { label: 'All Picks', value: 'all' },
    ...categories.map((c) => ({
      label: c.name.split('&')[0].trim(), // shorter label for tab pills
      value: c.slug,
    })),
  ];

  const activeProducts = products.filter((p) => p.isActive);

  // If activeTab is 'all', show featured products first, or all up to 8
  const filteredProducts = (
    activeTab === 'all'
      ? activeProducts.filter((p) => p.isFeatured).length > 0
        ? activeProducts.filter((p) => p.isFeatured)
        : activeProducts
      : activeProducts.filter((p) => p.category === activeTab)
  ).slice(0, 8);

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
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
            {tabs.map((tab) => (
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
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-zinc-900/30 rounded-3xl border border-zinc-800/60 p-8">
            <p className="text-zinc-400 text-sm">No items found in this category.</p>
            <Link
              href="/shop"
              className="mt-4 inline-block text-gold-400 text-xs font-bold uppercase tracking-wider underline"
            >
              Explore Full Catalog
            </Link>
          </div>
        )}

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
