'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  MessageCircle, 
  ArrowUpRight 
} from 'lucide-react';
import { getCategoriesData } from '@/lib/products-data';
import { getSiteSettings } from '@/lib/site-settings';
import { Category, SiteSettings } from '@/lib/types';

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(getSiteSettings());

  useEffect(() => {
    setCategories(getCategoriesData());
    setSettings(getSiteSettings());

    const handleCatUpdate = () => setCategories(getCategoriesData());
    const handleSetUpdate = () => setSettings(getSiteSettings());

    window.addEventListener('categories-updated', handleCatUpdate);
    window.addEventListener('site-settings-changed', handleSetUpdate);
    return () => {
      window.removeEventListener('categories-updated', handleCatUpdate);
      window.removeEventListener('site-settings-changed', handleSetUpdate);
    };
  }, []);

  const brandName = settings.brandName || 'FLEXO LIFESTYLE';
  const whatsappNumber = settings.whatsappNumber || '919876543210';

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/80 text-zinc-400">
      {/* Trust Guarantee Banner */}
      <div className="border-b border-zinc-800/60 py-8 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Free Express Shipping</h4>
                <p className="text-xs text-zinc-500">On all prepaid & verified orders</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">WhatsApp Help</h4>
                <p className="text-xs text-zinc-500">Instant dedicated assistance</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">100% Authentic</h4>
                <p className="text-xs text-zinc-500">Curated luxury standards</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">UPI & Fast Checkout</h4>
                <p className="text-xs text-zinc-500">Zero extra fees, verified dispatch</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block font-display font-black text-2xl tracking-tighter text-white">
              {brandName}
              <span className="text-gold-400">.</span>
            </Link>
            <p className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold">
              Wear it. Flaunt it. Flex it.
            </p>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Elevating daily living through precision craftsmanship, contemporary streetwear tailoring, and timeless horology. Designed for those who value understated luxury.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              {settings.whatsappGroupLink && (
                <a
                  href={settings.whatsappGroupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all text-xs font-semibold"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Join WhatsApp Community</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hi%20${encodeURIComponent(brandName)}%2C%20I%20would%20like%20to%20connect`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-all text-xs font-semibold"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Help</span>
              </a>
            </div>
          </div>

          {/* Dynamic Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-200">Collections</h4>
            <ul className="space-y-2 text-sm">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/shop?category=${c.slug}`} className="hover:text-gold-400 transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-200">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/track-order" className="hover:text-gold-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-gold-400 transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-400 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-200">Flexo Club</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Stay plugged in with our exclusive community for drops, secret links, and private capsule sales.
            </p>
            {settings.whatsappGroupLink && (
              <a
                href={settings.whatsappGroupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 hover:underline"
              >
                Join WhatsApp Group &rarr;
              </a>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-10 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <p>© {new Date().getFullYear()} {brandName}. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-zinc-200 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-zinc-200 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
