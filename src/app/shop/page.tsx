'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SlidersHorizontal, 
  X, 
  Search, 
  RotateCcw, 
  Check, 
  ChevronDown,
  LayoutGrid,
  Grid3X3
} from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { SAMPLE_PRODUCTS, CATEGORIES, getProductsData, getCategoriesData } from '@/lib/products-data';
import { Product, Category } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSubcategory = searchParams.get('subcategory') || 'all';
  const initialSearch = searchParams.get('search') || '';

  // Data states
  const [productsList, setProductsList] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [categoriesList, setCategoriesList] = useState<Category[]>(CATEGORIES);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<number>(20000);
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [gridColumns, setGridColumns] = useState<'normal' | 'dense'>('normal');

  useEffect(() => {
    setProductsList(getProductsData());
    setCategoriesList(getCategoriesData());

    const handleUpdate = () => {
      setProductsList(getProductsData());
      setCategoriesList(getCategoriesData());
    };

    window.addEventListener('categories-updated', handleUpdate);
    window.addEventListener('products-updated', handleUpdate);
    return () => {
      window.removeEventListener('categories-updated', handleUpdate);
      window.removeEventListener('products-updated', handleUpdate);
    };
  }, []);

  // Sync category or search from URL if changed
  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category') || 'all');
    }
    if (searchParams.get('subcategory')) {
      setSelectedSubcategory(searchParams.get('subcategory') || 'all');
    }
    if (searchParams.get('search') !== null) {
      setSearchQuery(searchParams.get('search') || '');
    }
  }, [searchParams]);

  // When selectedCategory changes, reset subcategory if it belongs to different category
  const activeCategoryObj = categoriesList.find((c) => c.slug === selectedCategory);
  const currentSubcategories = activeCategoryObj?.subcategories || [];

  // Available Sizes across all products
  const allSizes = useMemo(() => {
    const set = new Set<string>();
    productsList.forEach((p) => {
      p.sizes.forEach((s) => set.add(s));
    });
    return Array.from(set);
  }, [productsList]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Subcategory filter
      if (selectedSubcategory !== 'all' && product.subcategory !== selectedSubcategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        const matchesSub = product.subcategory?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat && !matchesSub) return false;
      }

      // Price filter
      const effectivePrice = product.discountPrice || product.price;
      if (effectivePrice > priceRange) {
        return false;
      }

      // Size filter
      if (selectedSize !== 'all' && !product.sizes.includes(selectedSize)) {
        return false;
      }

      // Stock filter
      if (inStockOnly && product.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') {
        const discA = a.discountPrice ? a.price - a.discountPrice : 0;
        const discB = b.discountPrice ? b.price - b.discountPrice : 0;
        return discB - discA;
      }
      // default: featured
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [productsList, selectedCategory, selectedSubcategory, searchQuery, sortBy, priceRange, selectedSize, inStockOnly]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setPriceRange(20000);
    setSelectedSize('all');
    setInStockOnly(false);
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSubcategory !== 'all' ||
    searchQuery !== '' ||
    priceRange < 20000 ||
    selectedSize !== 'all' ||
    inStockOnly;

  return (
    <div className="bg-zinc-950 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2 font-mono uppercase tracking-widest">
            <span>Home</span>
            <span>/</span>
            <span className="text-gold-400">Catalogue</span>
            {selectedCategory !== 'all' && (
              <>
                <span>/</span>
                <span className="text-white capitalize">{selectedCategory}</span>
              </>
            )}
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            ALL COLLECTIONS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl">
            Explore our curated universe of heavyweight streetwear, automatic horology, handcrafted footwear, and modern lifestyle pieces.
          </p>
        </div>

        {/* Top Control Bar: Search + Filter button + Sort + Grid toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 mb-8">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, item, style..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-gold-400" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-gold-400" />
              )}
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-gold-400 cursor-pointer"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated (★ 4+)</option>
                <option value="discount">Biggest Savings</option>
              </select>
            </div>

            {/* Desktop Grid density toggle */}
            <div className="hidden sm:flex items-center border border-zinc-800 rounded-xl bg-zinc-950 p-0.5">
              <button
                onClick={() => setGridColumns('normal')}
                className={`p-1.5 rounded-lg transition-colors ${
                  gridColumns === 'normal' ? 'bg-zinc-800 text-gold-400' : 'text-zinc-500 hover:text-white'
                }`}
                title="Normal 4-Column Grid"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridColumns('dense')}
                className={`p-1.5 rounded-lg transition-colors ${
                  gridColumns === 'dense' ? 'bg-zinc-800 text-gold-400' : 'text-zinc-500 hover:text-white'
                }`}
                title="Compact Grid"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout (Sidebar + Product Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 h-fit sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <span className="font-display font-bold text-sm uppercase tracking-wider text-white">
                Filters
              </span>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Category
              </label>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSubcategory('all');
                }}
                className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-gold-400 text-black font-bold'
                    : 'text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                <span>All Collections</span>
                <span className="font-mono text-[10px]">{productsList.length}</span>
              </button>
              {categoriesList.map((cat) => {
                const isCatActive = selectedCategory === cat.slug;
                const catCount = productsList.filter((p) => p.category === cat.slug).length;
                return (
                  <div key={cat.id} className="space-y-1">
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setSelectedSubcategory('all');
                      }}
                      className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                        isCatActive
                          ? 'bg-gold-400 text-black font-bold'
                          : 'text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="font-mono text-[10px]">{catCount}</span>
                    </button>

                    {/* Subcategories under active category */}
                    {isCatActive && cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="pl-3 py-1 space-y-1 border-l-2 border-gold-400/30 ml-2">
                        <button
                          onClick={() => setSelectedSubcategory('all')}
                          className={`w-full text-left text-[11px] px-2 py-1 rounded-lg transition-colors flex items-center justify-between ${
                            selectedSubcategory === 'all'
                              ? 'text-gold-400 font-bold bg-zinc-800/80'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          <span>All {cat.name}</span>
                        </button>
                        {cat.subcategories.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => setSelectedSubcategory(sub.slug)}
                            className={`w-full text-left text-[11px] px-2 py-1 rounded-lg transition-colors flex items-center justify-between ${
                              selectedSubcategory === sub.slug
                                ? 'text-gold-400 font-bold bg-zinc-800/80'
                                : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            <span>{sub.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Price Range Slider */}
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wider text-zinc-400">Max Price</span>
                <span className="font-mono font-bold text-gold-400">{formatPrice(priceRange)}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={20000}
                step={500}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-gold-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>₹1,000</span>
                <span>₹20,000</span>
              </div>
            </div>

            {/* Size Filter */}
            <div className="space-y-2 pt-4 border-t border-zinc-800">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Size / Variant
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedSize('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    selectedSize === 'all'
                      ? 'border-gold-400 bg-gold-400 text-black font-bold'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  All
                </button>
                {allSizes.slice(0, 8).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      selectedSize === size
                        ? 'border-gold-400 bg-gold-400 text-black font-bold'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* In-Stock Toggle */}
            <div className="pt-4 border-t border-zinc-800">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-zinc-800 bg-zinc-950 text-gold-400 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-xs text-zinc-300 font-medium">In-Stock Items Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Horizontal Subcategory Pill Bar */}
            {currentSubcategories.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedSubcategory('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedSubcategory === 'all'
                      ? 'bg-gold-400 text-black shadow-md'
                      : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  All {activeCategoryObj?.name || 'Items'}
                </button>
                {currentSubcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubcategory(sub.slug)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedSubcategory === sub.slug
                        ? 'bg-gold-400 text-black shadow-md'
                        : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}

            {/* Results Count & Active Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
              <span>
                Showing <strong className="text-white">{displayedProducts.length}</strong> of{' '}
                <strong className="text-white">{filteredProducts.length}</strong> creations
              </span>

              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 text-[11px]">
                      Category: {selectedCategory}
                      <button onClick={() => { setSelectedCategory('all'); setSelectedSubcategory('all'); }}>
                        <X className="w-3 h-3 hover:text-white" />
                      </button>
                    </span>
                  )}
                  {selectedSubcategory !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold-400/20 border border-gold-400/40 text-gold-300 text-[11px]">
                      Subcategory: {selectedSubcategory}
                      <button onClick={() => setSelectedSubcategory('all')}>
                        <X className="w-3 h-3 hover:text-white" />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 text-[11px]">
                      &quot;{searchQuery}&quot;
                      <button onClick={() => setSearchQuery('')}>
                        <X className="w-3 h-3 hover:text-white" />
                      </button>
                    </span>
                  )}
                  {priceRange < 20000 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 text-[11px]">
                      Under {formatPrice(priceRange)}
                      <button onClick={() => setPriceRange(20000)}>
                        <X className="w-3 h-3 hover:text-white" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Zero State */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center rounded-3xl bg-zinc-900/40 border border-zinc-800/80 p-8">
                <p className="text-lg font-display font-bold text-white mb-2">No creations matched your criteria</p>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6">
                  Try broadening your price limit, searching with fewer keywords, or clearing your active filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-full bg-gold-400 text-black font-semibold text-xs tracking-wider uppercase transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-3 sm:gap-6 ${
                  gridColumns === 'dense'
                    ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                    : 'grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Load More Button for unlimited scalability */}
            {hasMore && (
              <div className="pt-8 text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-8 py-3.5 rounded-full border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs tracking-widest uppercase transition-colors"
                >
                  Load More Creations ({filteredProducts.length - displayedProducts.length} Remaining)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Slide-out Modal */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-zinc-950 border-t border-zinc-800 rounded-t-3xl p-6 z-50 overflow-y-auto space-y-6 lg:hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <span className="font-display font-bold text-base text-white">Filter Products</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedSubcategory('all');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold text-left ${
                      selectedCategory === 'all'
                        ? 'bg-gold-400 text-black'
                        : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                    }`}
                  >
                    All Collections
                  </button>
                  {categoriesList.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCategory(c.slug);
                        setSelectedSubcategory('all');
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold text-left ${
                        selectedCategory === c.slug
                          ? 'bg-gold-400 text-black'
                          : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                {/* Mobile Subcategories if selected */}
                {currentSubcategories.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-zinc-800/80">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-gold-400 block mb-2">
                      Subcategories
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => setSelectedSubcategory('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                          selectedSubcategory === 'all'
                            ? 'bg-gold-400 text-black font-bold'
                            : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                        }`}
                      >
                        All
                      </button>
                      {currentSubcategories.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => setSelectedSubcategory(sub.slug)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                            selectedSubcategory === sub.slug
                              ? 'bg-gold-400 text-black font-bold'
                              : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                          }`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Price */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-bold uppercase tracking-wider text-zinc-400">Max Price</span>
                  <span className="font-mono font-bold text-gold-400">{formatPrice(priceRange)}</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={20000}
                  step={500}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-gold-400"
                />
              </div>

              {/* Mobile Apply */}
              <div className="pt-4 border-t border-zinc-800 flex gap-3">
                <button
                  onClick={handleResetFilters}
                  className="w-1/3 py-3 rounded-xl border border-zinc-700 bg-zinc-900 text-xs font-semibold text-zinc-300"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-2/3 py-3 rounded-xl bg-gold-400 text-black font-bold text-xs tracking-wider uppercase"
                >
                  Apply Filters ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Loading Collections...</div>}>
      <ShopContent />
    </Suspense>
  );
}
