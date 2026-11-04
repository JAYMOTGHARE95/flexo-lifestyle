'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, ShieldCheck, Flame } from 'lucide-react';

export default function Hero() {
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'FLEXO LIFESTYLE';

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Background Gradient & Mesh Accents */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-gold-500/10 rounded-full blur-[100px] sm:blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[250px] sm:w-[450px] h-[250px] sm:h-[450px] bg-amber-600/10 rounded-full blur-[100px] sm:blur-[150px]" />
        <div 
          className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" 
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-28 text-center flex flex-col items-center">
        {/* Subtle Pre-header Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-zinc-900/90 border border-gold-500/30 text-gold-400 text-[10px] sm:text-xs font-medium tracking-widest uppercase mb-4 sm:mb-6 shadow-lg backdrop-blur-md"
        >
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-400" />
          <span>FLEXO LIFESTYLE • AUTUMN DROP 2026</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
        </motion.div>

        {/* Animated Staggered Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white max-w-5xl leading-[1.08] mb-4 sm:mb-6"
        >
          WEAR IT. FLAUNT IT. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-gold-200 to-gold-400">
            FLEX IT.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="text-xs sm:text-base md:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-8 sm:mb-10 font-sans px-2"
        >
          Architectural streetwear, automatic skeleton timepieces, handcrafted leather boots, and modern lifestyle essentials. Engineered for those who command distinction.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
        >
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-gold-400 hover:bg-gold-300 text-black font-display font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-xl hover:shadow-gold-500/20 flex items-center justify-center gap-2 group"
          >
            <span>Explore Collection</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <Link
            href="/about"
            className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 hover:border-zinc-700 font-display font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 group"
          >
            <span>Our Atelier Story</span>
            <ArrowUpRight className="w-4 h-4 text-gold-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Trust micro-bar below CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-8 sm:mt-14 pt-6 sm:pt-8 border-t border-zinc-900/80 flex flex-wrap items-center justify-center gap-4 sm:gap-10 text-[11px] sm:text-xs text-zinc-400"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-400" />
            <span>100% Genuine</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Cash on Delivery</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
            <span>Instant UPI with QR</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
