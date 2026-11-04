'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/products-data';

export default function CategoryTiles() {
  return (
    <section className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-400 font-semibold mb-2">
              Curated Universes
            </p>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              DISCOVER BY CATEGORY
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-gold-400 transition-colors group"
          >
            <span>View All Collections</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid - 2 cols on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {CATEGORIES.map((category, index) => {
            const isLarge = index === 0;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-800/80 bg-zinc-900 ${
                  isLarge ? 'col-span-2 aspect-[16/9] sm:aspect-[2/1]' : 'aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5]'
                }`}
              >
                <Link href={`/shop?category=${category.slug}`} className="block w-full h-full relative">
                  {/* Background Image with Zoom */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />

                  {/* Category Details */}
                  <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-end">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-gold-400 font-semibold">
                          {category.itemCount || 'Curated'} Pieces
                        </span>
                        <h3 className="font-display font-black text-lg sm:text-3xl text-white tracking-tight mt-0.5 group-hover:text-gold-300 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-zinc-400 max-w-sm mt-1 line-clamp-2 hidden sm:block">
                          {category.description}
                        </p>
                      </div>

                      <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-gold-400 group-hover:text-black group-hover:scale-110 transition-all shrink-0">
                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
