'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  Truck, 
  MessageCircle, 
  ShieldCheck,
  User
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SAMPLE_PRODUCTS } from '@/lib/products-data';
import { getSiteSettings } from '@/lib/site-settings';
import { SiteSettings } from '@/lib/types';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, setIsDrawerOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<SiteSettings>(getSiteSettings());

  useEffect(() => {
    const handleUpdate = () => setSettings(getSiteSettings());
    window.addEventListener('site-settings-changed', handleUpdate);
    return () => window.removeEventListener('site-settings-changed', handleUpdate);
  }, []);

  const brandName = settings.brandName || 'FLEXO LIFESTYLE';
  const whatsappNumber = settings.whatsappNumber || '919876543210';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  }, [pathname]);

  const searchResults = searchQuery.trim().length > 1
    ? SAMPLE_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop All', href: '/shop' },
    { name: 'Clothing', href: '/shop?category=fashion-clothing' },
    { name: 'Footwear', href: '/shop?category=footwear' },
    { name: 'Watches', href: '/shop?category=watches' },
    { name: 'Gadgets', href: '/shop?category=electronics-gadgets' },
    { name: 'Accessories', href: '/shop?category=fashion-accessories' },
    { name: 'Lifestyle', href: '/shop?category=home-lifestyle' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-zinc-950 border-b border-zinc-800 text-[11px] sm:text-xs text-zinc-300 py-1.5 px-4 tracking-wider uppercase">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-zinc-200">
              {settings.announcementText} <strong className="text-gold-400">{settings.announcementCoupon}</strong>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/track-order" className="hover:text-gold-400 flex items-center gap-1 transition-colors">
              <Truck className="w-3.5 h-3.5 text-gold-400" />
              <span>Track Order</span>
            </Link>
            {settings.whatsappGroupLink && (
              <a 
                href={settings.whatsappGroupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 flex items-center gap-1 transition-colors text-[11px] font-semibold text-emerald-400/90"
              >
                <span>Join WhatsApp Community</span>
              </a>
            )}
            <a 
              href={`https://wa.me/${whatsappNumber}?text=Hi%20${encodeURIComponent(brandName)}%2C%20I%20have%20a%20question`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Help</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 shadow-2xl py-3.5'
            : 'bg-zinc-950/70 backdrop-blur-sm border-b border-zinc-900 py-4.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 text-zinc-300 hover:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-400"
                aria-label="Open mobile navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-display font-black text-xl sm:text-2xl md:text-3xl tracking-tighter text-white group-hover:text-gold-400 transition-colors">
                {brandName}
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-400" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium tracking-wide">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative py-1 transition-colors duration-200 uppercase text-xs tracking-widest ${
                      isActive ? 'text-gold-400 font-semibold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-400"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons: Search + Cart */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-zinc-300 hover:text-gold-400 rounded-full transition-colors relative"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="relative flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-zinc-900 border border-zinc-800 hover:border-gold-500/50 hover:bg-zinc-850 text-white transition-all group"
                aria-label="Open Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline text-xs font-semibold tracking-wider uppercase text-zinc-200">
                  Cart
                </span>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center min-w-[20px] h-5 px-1 text-[11px] font-bold text-black bg-gold-400 rounded-full"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>
            </div>
          </div>

          {/* Quick Expandable Search Bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden pt-3 pb-2 border-t border-zinc-800/60 mt-3"
              >
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search clothing, watches, sneakers, accessories..."
                    className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-full pl-10 pr-10 py-2.5 text-base sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
                    >
                      Clear
                    </button>
                  )}

                  {/* Dropdown Instant Results */}
                  {searchResults.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 divide-y divide-zinc-800">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug}`}
                          className="flex items-center gap-3 p-2.5 hover:bg-zinc-800/80 rounded-xl transition-colors group"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate group-hover:text-gold-400">
                              {product.name}
                            </p>
                            <p className="text-xs text-zinc-400 capitalize">
                              {product.category} • ₹{product.discountPrice || product.price}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-gold-400" />
                        </Link>
                      ))}
                      <div className="p-2 text-center">
                        <Link
                          href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                          className="text-xs font-semibold text-gold-400 hover:underline"
                        >
                          View all results for &quot;{searchQuery}&quot; &rarr;
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-zinc-950 border-r border-zinc-800 p-6 z-50 overflow-y-auto flex flex-col justify-between lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
                  <Link href="/" className="font-display font-black text-2xl tracking-tighter text-white">
                    {brandName}
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-zinc-400 hover:text-white rounded-lg"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="py-6 space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block text-lg font-medium text-zinc-300 hover:text-gold-400 py-1 transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-zinc-800 space-y-3">
                    <Link
                      href="/track-order"
                      className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
                    >
                      <Truck className="w-4 h-4 text-gold-400" />
                      <span>Track Your Order</span>
                    </Link>
                    {settings.whatsappGroupLink && (
                      <a
                        href={settings.whatsappGroupLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-400" />
                        <span>Join WhatsApp Community</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-800">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=Hi%20Flexo%20Lifestyle%2C%20I%20want%20to%20order`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order on WhatsApp</span>
                </a>
                <p className="text-[11px] text-zinc-500 text-center mt-3">
                  100% Free Tier E-Commerce Stack • Powered by Next.js & Supabase
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
