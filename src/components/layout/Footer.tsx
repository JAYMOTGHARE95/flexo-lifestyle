import React from 'react';
import Link from 'next/link';
import { 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  CreditCard, 
  MessageCircle, 
  Instagram, 
  Twitter, 
  Facebook, 
  ArrowUpRight 
} from 'lucide-react';

export default function Footer() {
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'FLEXO LIFESTYLE';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/80 text-zinc-400">
      {/* Flipkart-style Trust Guarantee Banner */}
      <div className="border-b border-zinc-800/60 py-8 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Free Express Shipping</h4>
                <p className="text-xs text-zinc-500">On all orders above ₹999</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">WhatsApp Help</h4>
                <p className="text-xs text-zinc-500">Fast dedicated assistance</p>
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
                <h4 className="text-sm font-semibold text-white">UPI & COD Options</h4>
                <p className="text-xs text-zinc-500">Zero fees, verified orders</p>
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
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hi%20${encodeURIComponent(brandName)}%2C%20I%20would%20like%20to%20connect`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all text-xs font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Help</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-200">Collections</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop?category=fashion-clothing" className="hover:text-gold-400 transition-colors">
                  Fashion & Clothing
                </Link>
              </li>
              <li>
                <Link href="/shop?category=footwear" className="hover:text-gold-400 transition-colors">
                  Footwear & Sneakers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=watches" className="hover:text-gold-400 transition-colors">
                  Automatic Watches
                </Link>
              </li>
              <li>
                <Link href="/shop?category=electronics-gadgets" className="hover:text-gold-400 transition-colors">
                  Electronics & Gadgets
                </Link>
              </li>
              <li>
                <Link href="/shop?category=fashion-accessories" className="hover:text-gold-400 transition-colors">
                  Fashion Accessories
                </Link>
              </li>
              <li>
                <Link href="/shop?category=personal-care" className="hover:text-gold-400 transition-colors">
                  Personal Care
                </Link>
              </li>
              <li>
                <Link href="/shop?category=home-lifestyle" className="hover:text-gold-400 transition-colors">
                  Home & Lifestyle
                </Link>
              </li>
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

          {/* Legal & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-200">Legal & Brand</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-gold-400 transition-colors">
                  Our Story & Heritage
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gold-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li className="pt-2 flex items-center gap-3 text-zinc-400">
                <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
              UPI
            </span>
            <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
              GPay / PhonePe
            </span>
            <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
              Cash on Delivery
            </span>
            <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
              Cards / NetBanking
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
