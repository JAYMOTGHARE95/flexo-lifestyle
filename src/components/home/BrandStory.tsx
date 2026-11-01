'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Compass, Award, Gem } from 'lucide-react';

export default function BrandStory() {
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'FLEXO LIFESTYLE';

  return (
    <section className="py-24 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Imagery Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80"
                alt="Brand Atelier & Craftsmanship"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
            </div>

            {/* Overlapping Detail Card */}
            <div className="absolute -bottom-6 -right-4 sm:-right-8 bg-zinc-900/95 backdrop-blur-md border border-gold-500/30 p-5 rounded-2xl shadow-2xl max-w-xs hidden sm:block">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gold-400/20 text-gold-400 flex items-center justify-center">
                  <Gem className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Uncompromising Grade</h4>
                  <p className="text-[10px] text-zinc-400">Zero synthetic shortcuts</p>
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Every stitch, bezel tolerance, and leather burnish is inspected to exceed traditional luxury benchmarks.
              </p>
            </div>
          </motion.div>

          {/* Right Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono uppercase tracking-widest text-gold-400">
              <Compass className="w-3.5 h-3.5" />
              <span>The Philosophy</span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-[1.15]">
              CRAFTED FOR THOSE WHO COMMAND SUBSTANCE.
            </h2>

            <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">
              {brandName} was established on a radical principle: authentic luxury should not carry inflated traditional retail markups. We strip away middleman margins to pour value where it belongs — custom-milled 500 GSM loopback cotton, Japanese Miyota automatic movements, and vegetable-tanned full-grain leathers.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-900">
              <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80">
                <div className="font-display font-black text-2xl text-gold-400">500+ GSM</div>
                <div className="text-xs text-zinc-300 font-medium mt-1">Custom Milled Cotton</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">Heavyweight structured silhouettes</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80">
                <div className="font-display font-black text-2xl text-gold-400">316L Grade</div>
                <div className="text-xs text-zinc-300 font-medium mt-1">Surgical Stainless Steel</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">Sapphire crystal horology</div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-gold-400 transition-colors group"
              >
                <span>Read Our Atelier Manifesto</span>
                <ArrowUpRight className="w-4 h-4 text-gold-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
