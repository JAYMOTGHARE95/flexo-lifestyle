'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  X, 
  Upload, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { SAMPLE_PRODUCTS, CATEGORIES } from '@/lib/products-data';
import { Product, CategorySlug } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'clothing' as CategorySlug,
    price: '',
    discountPrice: '',
    description: '',
    stock: '20',
    sizes: 'S, M, L, XL',
    colors: 'Pitch Black, Bone White',
    imageUrl: '',
    isFeatured: false,
    isActive: true,
  });

  const filtered = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      category: 'clothing',
      price: '',
      discountPrice: '',
      description: '',
      stock: '20',
      sizes: 'S, M, L, XL',
      colors: 'Pitch Black, Bone White',
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
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
      price: String(p.price),
      discountPrice: p.discountPrice ? String(p.discountPrice) : '',
      description: p.description,
      stock: String(p.stock),
      sizes: p.sizes.join(', '),
      colors: p.colors.map((c) => c.name).join(', '),
      imageUrl: p.images[0] || '',
      isFeatured: p.isFeatured,
      isActive: p.isActive,
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const handleToggleFeatured = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this product from the catalogue?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const priceNum = Number(formData.price) || 0;
    const discountNum = formData.discountPrice ? Number(formData.discountPrice) : undefined;
    const sizesArray = formData.sizes.split(',').map((s) => s.trim()).filter(Boolean);
    const colorsArray = formData.colors.split(',').map((c) => ({
      name: c.trim(),
      hex: '#27272a',
    })).filter((c) => c.name);

    if (editingProduct) {
      // Edit
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                category: formData.category,
                price: priceNum,
                discountPrice: discountNum,
                description: formData.description,
                stock: Number(formData.stock) || 10,
                sizes: sizesArray,
                colors: colorsArray,
                images: [formData.imageUrl, ...(p.images.slice(1))],
                isFeatured: formData.isFeatured,
                isActive: formData.isActive,
              }
            : p
        )
      );
    } else {
      // Add
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: formData.category,
        price: priceNum,
        discountPrice: discountNum,
        description: formData.description,
        stock: Number(formData.stock) || 10,
        sizes: sizesArray,
        colors: colorsArray,
        images: [formData.imageUrl || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80'],
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
        rating: 5.0,
        reviewCount: 1,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
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
            Manage your fashion pieces, pricing, variants, and gallery visuals.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 self-start sm:self-auto shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or slug..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-zinc-950 border border-zinc-800 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-gold-400"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
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
                <th className="p-4">Category</th>
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
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-12 h-14 object-cover rounded-lg border border-zinc-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate max-w-xs">{prod.name}</p>
                        <p className="text-[11px] text-zinc-500 font-mono">slug: {prod.slug}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="capitalize px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300">
                      {prod.category}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="font-mono font-bold text-white">
                      {formatPrice(prod.discountPrice || prod.price)}
                    </div>
                    {prod.discountPrice && (
                      <div className="font-mono text-[11px] text-zinc-500 line-through">
                        {formatPrice(prod.price)}
                      </div>
                    )}
                  </td>

                  <td className="p-4">
                    <span
                      className={`font-mono font-bold ${
                        prod.stock < 15 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {prod.stock} units
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleToggleFeatured(prod.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        prod.isFeatured
                          ? 'bg-gold-400/20 text-gold-400'
                          : 'text-zinc-600 hover:text-zinc-400'
                      }`}
                      title={prod.isFeatured ? 'Featured Product' : 'Mark as Featured'}
                    >
                      <Star className={`w-4 h-4 ${prod.isFeatured ? 'fill-gold-400' : ''}`} />
                    </button>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleToggleActive(prod.id)}
                      className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        prod.isActive
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-zinc-800 text-zinc-500'
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
                        className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-800"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="font-display font-bold text-lg text-white">
                {editingProduct ? 'Edit Product' : 'Add New Fashion Creation'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Heavyweight Loopback Sweatshirt"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CategorySlug })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Regular Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="4999"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Discount Price (₹) (Optional)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    placeholder="3499"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Image URL (Unsplash or Supabase Storage) *</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Available Sizes (Comma Separated)</label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="S, M, L, XL"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Available Colors (Comma Separated)</label>
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="Pitch Black, Bone White"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white"
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
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-700 text-gold-400"
                  />
                  <span className="text-zinc-300 font-semibold">Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-700 text-gold-400"
                  />
                  <span className="text-zinc-300 font-semibold">Published in Shop</span>
                </label>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-black font-bold text-xs uppercase tracking-wider"
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
