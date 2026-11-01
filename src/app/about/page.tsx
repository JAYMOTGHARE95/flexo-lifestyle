import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Award, Gem, Compass } from 'lucide-react';

export default function AboutPage() {
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'FLEXO LIFESTYLE';

  return (
    <div className="bg-zinc-950 min-h-screen py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold">
            The Atelier & Legacy
          </span>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight">
            BUILT ON RESTRAINT. <br />
            REFINED BY CRAFT.
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {brandName} is a contemporary luxury fashion & lifestyle label dedicated to heavyweight streetwear tailoring, precision mechanical horology, and architectural essentials.
          </p>
        </div>

        {/* Hero Image */}
        <div className="aspect-[16/9] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80"
            alt="Atelier and Design Studio"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold-400/10 text-gold-400 flex items-center justify-center">
              <Gem className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Pure Materiality</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We commission custom 500 GSM loopback terry cotton, surgical-grade 316L stainless steel, and vegetable-tanned full grain calfskin leather. Zero poly blends.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold-400/10 text-gold-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Direct-to-Patron</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              By removing intermediaries, departmental overhead, and retail distributor markup, we provide true bespoke luxury quality at transparent direct prices.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold-400/10 text-gold-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Timeless Form</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We design in small-batch limited editions instead of churning disposable seasonal trends. Every piece is engineered to age gracefully.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900/80 border border-zinc-800 text-center space-y-4">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
            EXPERIENCE THE COLLECTION
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Explore our ready-to-dispatch drops with Cash on Delivery and verified Instant UPI checkout.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gold-400 hover:bg-gold-300 text-black font-display font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <span>Browse All Products</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
