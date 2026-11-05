'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  X, 
  Check, 
  Tag, 
  Layers,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { getProductsData, saveLocalProducts, getCategoriesData, SAMPLE_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/products-data';
import { Product, Category, CategorySlug } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { uploadImageFiles } from '@/lib/upload-helper';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'fashion-clothing' as CategorySlug,
    subcategory: '',
    price: '',
    discountPrice: '',
    description: '',
    stock: '20',
    sizes: 'S, M, L, XL',
    colors: 'Pitch Black, Bone White',
    images: [] as string[],
    isFeatured: false,
    isActive: true,
  });

  useEffect(() => {
    setProducts(getProductsData());
    setCategories(getCategoriesData());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const persistProducts = (updated: Product[], msg: string) => {
    setProducts(updated);
    saveLocalProducts(updated);
    showToast(msg);
  };

  // Get active subcategories based on currently selected category in form
  const activeCategoryObj = categories.find((c) => c.slug === formData.category);
  const availableSubcategories = activeCategoryObj?.subcategories || [];

  const filtered = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    const defaultCat = (categories[0]?.slug as CategorySlug) || 'fashion-clothing';
    const firstSub = categories.find((c) => c.slug === defaultCat)?.subcategories?.[0]?.slug || '';

    setFormData({
      name: '',
      slug: '',
      category: defaultCat,
      subcategory: firstSub,
      price: '',
      discountPrice: '',
      description: '',
      stock: '20',
      sizes: 'S, M, L, XL',
      colors: 'Pitch Black, Bone White',
      images: [],
      isFeatured: false,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      slug: p.slug,
      category: p.category,
      subcategory: p.subcategory || '',
      price: String(p.price),
      discountPrice: p.discountPrice ? String(p.discountPrice) : '',
      description: p.description,
      stock: String(p.stock),
      sizes: p.sizes.join(', '),
      colors: p.colors.map((c) => c.name).join(', '),
      images: p.images && p.images.length > 0 ? [...p.images] : [],
      isFeatured: p.isFeatured,
      isActive: p.isActive,
    });
    setIsModalOpen(true);
  };

  // Handle direct file uploads from user device (Phone / PC)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const newUrls = await uploadImageFiles(files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newUrls],
      }));
    } catch (err: any) {
      alert('Failed to upload image: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSetCoverImage = (indexToCover: number) => {
    setFormData((prev) => {
      const selected = prev.images[indexToCover];
      const rest = prev.images.filter((_, idx) => idx !== indexToCover);
      return {
        ...prev,
        images: [selected, ...rest],
      };
    });
  };

  const handleToggleActive = (id: string) => {
    const updated = products.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p));
    persistProducts(updated, 'Product status updated.');
  };

  const handleToggleFeatured = (id: string) => {
    const updated = products.map((p) => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p));
    persistProducts(updated, 'Featured status updated.');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const updated = products.filter((p) => p.id !== id);
      persistProducts(updated, `Product "${name}" deleted.`);
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset catalogue to original sample products?')) {
      persistProducts(SAMPLE_PRODUCTS, 'Catalog reset to defaults.');
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      alert('Please upload at least 1 product photo from your device.');
      return;
    }

    const priceNum = Number(formData.price) || 0;
    const discountNum = formData.discountPrice ? Number(formData.discountPrice) : undefined;
    const sizesArray = formData.sizes.split(',').map((s) => s.trim()).filter(Boolean);
    const colorsArray = formData.colors.split(',').map((c) => ({
      name: c.trim(),
      hex: '#27272a',
    })).filter((c) => c.name);

    const generatedSlug = (formData.slug || formData.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (editingProduct) {
      // Edit
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: formData.name,
              slug: generatedSlug,
              category: formData.category,
              subcategory: formData.subcategory,
              price: priceNum,
              discountPrice: discountNum,
              description: formData.description,
              stock: Number(formData.stock) || 10,
              sizes: sizesArray,
              colors: colorsArray,
              images: formData.images,
              isFeatured: formData.isFeatured,
              isActive: formData.isActive,
            }
          : p
      );
      persistProducts(updated, `Updated "${formData.name}". Changes are now live on website.`);
    } else {
      // Add
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: formData.name,
        slug: generatedSlug,
        category: formData.category,
        subcategory: formData.subcategory,
        price: priceNum,
        discountPrice: discountNum,
        description: formData.description,
        stock: Number(formData.stock) || 10,
        sizes: sizesArray,
        colors: colorsArray,
        images: formData.images,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
        rating: 5.0,
        reviewCount: 1,
      };
      persistProducts([newProduct, ...products], `Added "${formData.name}". Now live on website.`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-800 gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400 font-bold">
            Catalog Inventory
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            PRODUCTS MANAGEMENT
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage your fashion pieces, direct photo uploads, pricing, subcategory tags, and stock.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetToDefaults}
            className="px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Reset catalog to default items"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold animate-fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, slug or subcategory..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-zinc-950 border border-zinc-800 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-gold-400 cursor-pointer"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-zinc-500 bg-zinc-950/60 border-b border-zinc-800">
              <tr>
                <th className="p-4">Product Details</th>
                <th className="p-4">Category & Subcategory</th>
                <th className="p-4">Regular / Discount Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-zinc-850/40">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 shrink-0">
                        {prod.images?.[0] ? (
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                        {prod.images && prod.images.length > 1 && (
                          <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[9px] font-mono text-zinc-300 px-1 rounded">
                            +{prod.images.length - 1}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate max-w-xs">{prod.name}</p>
                        <p className="text-[11px] text-zinc-500 font-mono">slug: {prod.slug}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono text-[11px] capitalize">
                        {prod.category}
                      </span>
                      {prod.subcategory && (
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded-md bg-gold-400/10 text-gold-400 border border-gold-400/20 text-[10px] font-mono">
                            {prod.subcategory}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-4 font-mono">
                    <div className="text-white font-semibold">
                      {formatPrice(prod.discountPrice || prod.price)}
                    </div>
                    {prod.discountPrice && (
                      <div className="text-zinc-500 line-through text-[11px]">
                        {formatPrice(prod.price)}
                      </div>
                    )}
                  </td>

                  <td className="p-4">
                    <span
                      className={`font-mono font-bold ${
                        prod.stock <= 5 ? 'text-rose-400' : 'text-zinc-300'
                      }`}
                    >
                      {prod.stock} left
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleToggleFeatured(prod.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        prod.isFeatured
                          ? 'bg-gold-400/20 border-gold-400/50 text-gold-400'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-600 hover:text-zinc-400'
                      }`}
                      title={prod.isFeatured ? 'Featured Product' : 'Make Featured'}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleToggleActive(prod.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                        prod.isActive
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                      }`}
                    >
                      {prod.isActive ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-800 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  {editingProduct ? 'Edit Product Details' : 'Add New Product to Store'}
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Fill details and upload product photos directly from your phone or PC.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5 text-xs">
              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Heavyweight Loopback Sweatshirt"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              {/* Category and Subcategory selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const newCat = e.target.value as CategorySlug;
                      const subs = categories.find((c) => c.slug === newCat)?.subcategories || [];
                      setFormData({ 
                        ...formData, 
                        category: newCat,
                        subcategory: subs[0]?.slug || ''
                      });
                    }}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gold-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Subcategory</label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gold-400"
                  >
                    <option value="">General / None</option>
                    {availableSubcategories.map((sub) => (
                      <option key={sub.id} value={sub.slug}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Direct Multi-Image Upload (NO URL option) */}
              <div className="space-y-2 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-white flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-gold-400" />
                    <span>Upload Product Photos *</span>
                  </label>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {formData.images.length} {formData.images.length === 1 ? 'photo' : 'photos'} uploaded
                  </span>
                </div>

                <p className="text-[11px] text-zinc-400">
                  Direct file upload from your device. First photo is used as the store cover image. Multiple photos supported (front, back, model, details).
                </p>

                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Upload action button / dropzone */}
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-5 border-2 border-dashed border-zinc-700 hover:border-gold-400/80 rounded-2xl bg-zinc-950/60 hover:bg-zinc-900/80 transition-all flex flex-col items-center justify-center gap-2 text-zinc-300 group cursor-pointer"
                >
                  {isUploading ? (
                    <div className="flex items-center gap-2 text-gold-400 font-semibold">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Optimizing & uploading photos...</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-zinc-850 group-hover:bg-gold-400/20 group-hover:text-gold-400 flex items-center justify-center text-zinc-400 transition-colors">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-center">
                        <span className="font-bold text-white text-xs block group-hover:text-gold-400 transition-colors">
                          Choose Photos from Device (Phone / PC)
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          Supports JPG, PNG, WEBP. Select multiple files at once.
                        </span>
                      </div>
                    </>
                  )}
                </button>

                {/* Uploaded Gallery Grid */}
                {formData.images.length > 0 && (
                  <div className="pt-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-2">
                      Uploaded Photos Preview (Drag or click &apos;Set as Cover&apos; to reorder)
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {formData.images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative group rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950 aspect-[3/4]"
                        >
                          <img
                            src={imgUrl}
                            alt={`Product preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Cover badge */}
                          {idx === 0 ? (
                            <span className="absolute top-1.5 left-1.5 bg-gold-400 text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
                              COVER
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetCoverImage(idx)}
                              className="absolute top-1.5 left-1.5 bg-black/80 hover:bg-gold-400 hover:text-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Make this the main cover photo"
                            >
                              Set Cover
                            </button>
                          )}

                          {/* Delete photo button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1.5 right-1.5 bg-rose-600/90 hover:bg-rose-600 text-white p-1 rounded-full opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow"
                            title="Remove photo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-400 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Regular Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="4999"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    placeholder="3499"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Available Sizes (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="S, M, L, XL"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Available Colors (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="Pitch Black, Bone White, Cognac"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Editorial product description..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white resize-none focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded accent-gold-400"
                  />
                  <span className="font-medium text-zinc-300">Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded accent-gold-400"
                  />
                  <span className="font-medium text-zinc-300">Active (Visible in Store)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-black font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
