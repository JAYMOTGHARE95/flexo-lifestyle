'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  FolderTree, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Check, 
  Tag, 
  Layers, 
  AlertCircle,
  Save,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { getCategoriesData, INITIAL_CATEGORIES } from '@/lib/products-data';
import { saveLocalCategories } from '@/lib/supabase';
import { Category, Subcategory } from '@/lib/types';
import { uploadSingleImage } from '@/lib/upload-helper';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Quick subcategory adder states: { [categoryId]: string }
  const [newSubcategoryInputs, setNewSubcategoryInputs] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    initialSubcategories: '',
  });

  useEffect(() => {
    setCategories(getCategoriesData());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const persistCategories = (updated: Category[], msg: string) => {
    setCategories(updated);
    saveLocalCategories(updated);
    showToast(msg);
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      initialSubcategories: 'Oversized Tees, Heavyweight Hoodies, Cargoes',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setFormData({
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      initialSubcategories: (c.subcategories || []).map((s) => s.name).join(', '),
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadSingleImage(file);
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (err: any) {
      alert('Failed to upload image: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}" and all its subcategories?`)) {
      const updated = categories.filter((c) => c.id !== id);
      persistCategories(updated, `Category "${name}" deleted.`);
    }
  };

  const handleAddSubcategory = (categoryId: string) => {
    const inputVal = (newSubcategoryInputs[categoryId] || '').trim();
    if (!inputVal) return;

    const subSlug = inputVal.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newSub: Subcategory = {
      id: `sub-${Date.now()}`,
      name: inputVal,
      slug: subSlug,
    };

    const updated = categories.map((cat) => {
      if (cat.id === categoryId) {
        const existing = cat.subcategories || [];
        if (existing.some((s) => s.slug === subSlug)) {
          alert('Subcategory already exists in this category.');
          return cat;
        }
        return {
          ...cat,
          subcategories: [...existing, newSub],
        };
      }
      return cat;
    });

    setNewSubcategoryInputs((prev) => ({ ...prev, [categoryId]: '' }));
    persistCategories(updated, `Added "${inputVal}" subcategory.`);
  };

  const handleDeleteSubcategory = (categoryId: string, subId: string, subName: string) => {
    if (confirm(`Remove subcategory "${subName}"?`)) {
      const updated = categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: (cat.subcategories || []).filter((s) => s.id !== subId),
          };
        }
        return cat;
      });
      persistCategories(updated, `Removed "${subName}" subcategory.`);
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset all categories and subcategories to initial brand defaults?')) {
      persistCategories(INITIAL_CATEGORIES, 'Reset to default 7 brand categories.');
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      alert('Please upload a cover image for this category.');
      return;
    }

    const parsedSubs: Subcategory[] = formData.initialSubcategories
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name, i) => ({
        id: `sub-${Date.now()}-${i}`,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      }));

    const cleanSlug = (formData.slug || formData.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (editingCategory) {
      const updated = categories.map((c) =>
        c.id === editingCategory.id
          ? {
              ...c,
              name: formData.name,
              slug: cleanSlug,
              description: formData.description,
              image: formData.image,
              subcategories: parsedSubs.length > 0 ? parsedSubs : c.subcategories || [],
            }
          : c
      );
      persistCategories(updated, `Updated "${formData.name}" category. Live on site.`);
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: formData.name,
        slug: cleanSlug,
        description: formData.description,
        image: formData.image,
        itemCount: 0,
        subcategories: parsedSubs,
      };
      persistCategories([...categories, newCat], `Created "${formData.name}" category. Live on site.`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-800 gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400 font-bold">
            Taxonomy & Subcategories
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            CATEGORIES & SUBCATEGORIES MANAGEMENT
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage your store collections: Footwear, Fashion & Clothing, Watches, Gadgets, Accessories, Personal Care, Lifestyle.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetToDefaults}
            className="px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Reset to brand default categories"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Category</span>
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

      {/* Categories Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 flex flex-col justify-between space-y-5 hover:border-zinc-700 transition-colors shadow-lg"
          >
            {/* Top row: Info + Image */}
            <div className="flex items-start gap-4">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border border-zinc-700 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-bold text-lg text-white truncate">
                    {cat.name}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                      title="Edit Category Details"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-800 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] font-mono text-gold-400 mt-0.5">
                  slug: /{cat.slug}
                </p>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </div>

            {/* Subcategories Section */}
            <div className="pt-4 border-t border-zinc-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-gold-400" />
                  <span>Subcategories ({cat.subcategories?.length || 0})</span>
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Used for filters & menu tags
                </span>
              </div>

              {/* Subcategories Badges */}
              <div className="flex flex-wrap gap-2">
                {cat.subcategories && cat.subcategories.length > 0 ? (
                  cat.subcategories.map((sub) => (
                    <span
                      key={sub.id}
                      className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 hover:border-zinc-700"
                    >
                      <span>{sub.name}</span>
                      <button
                        onClick={() => handleDeleteSubcategory(cat.id, sub.id, sub.name)}
                        className="text-zinc-600 group-hover:text-rose-400 p-0.5 hover:bg-zinc-800 rounded transition-colors"
                        title={`Remove "${sub.name}"`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-zinc-600 italic">No subcategories yet. Add one below.</span>
                )}
              </div>

              {/* Add New Subcategory Input Form */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add subcategory (e.g. Leather Wallets)..."
                  value={newSubcategoryInputs[cat.id] || ''}
                  onChange={(e) =>
                    setNewSubcategoryInputs((prev) => ({
                      ...prev,
                      [cat.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubcategory(cat.id);
                    }
                  }}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                />
                <button
                  type="button"
                  onClick={() => handleAddSubcategory(cat.id)}
                  className="px-3 py-2 bg-zinc-800 hover:bg-gold-400 hover:text-black text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="font-display font-bold text-lg text-white">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Footwear & Sneakers"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Slug (URL friendly) *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                  placeholder="e.g. footwear (auto-generated if left blank)"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-gold-400"
                />
              </div>

              {/* Direct Image Upload (NO URL option) */}
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <label className="font-bold text-white flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-gold-400" />
                  <span>Category Cover Photo *</span>
                </label>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {formData.image ? (
                  <div className="relative rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-950 aspect-[16/9] max-h-48 group">
                    <img
                      src={formData.image}
                      alt="Category preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-gold-400 text-black font-bold text-xs"
                      >
                        Change Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-6 border-2 border-dashed border-zinc-700 hover:border-gold-400 rounded-2xl bg-zinc-950/60 hover:bg-zinc-900 flex flex-col items-center justify-center gap-2 text-zinc-300 transition-all cursor-pointer"
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-2 text-gold-400 font-semibold">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Uploading photo...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-white text-xs">
                          Choose Cover Photo from Device (Phone / PC)
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          Select JPG, PNG or WEBP from your storage
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description for this collection..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white resize-none focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">
                  Subcategories (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.initialSubcategories}
                  onChange={(e) => setFormData({ ...formData, initialSubcategories: e.target.value })}
                  placeholder="e.g. Chunky Sneakers, Chelsea Boots, Dress Loafers"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-400"
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  You can also add or remove subcategories individually at any time directly on the category card.
                </p>
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
