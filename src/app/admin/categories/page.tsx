'use client';

import React, { useState, useEffect } from 'react';
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
  RotateCcw
} from 'lucide-react';
import { getCategoriesData, INITIAL_CATEGORIES } from '@/lib/products-data';
import { saveLocalCategories } from '@/lib/supabase';
import { Category, Subcategory } from '@/lib/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
      image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80',
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

    const parsedSubs: Subcategory[] = formData.initialSubcategories
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name, i) => ({
        id: `sub-${Date.now()}-${i}`,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      }));

    if (editingCategory) {
      const updated = categories.map((c) =>
        c.id === editingCategory.id
          ? {
              ...c,
              name: formData.name,
              slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              description: formData.description,
              image: formData.image,
              subcategories: parsedSubs.length > 0 ? parsedSubs : c.subcategories || [],
            }
          : c
      );
      persistCategories(updated, `Updated "${formData.name}" category.`);
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: formData.description,
        image: formData.image,
        itemCount: 0,
        subcategories: parsedSubs,
      };
      persistCategories([...categories, newCat], `Created "${formData.name}" category.`);
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
            <span>Add New Category</span>
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

      {/* Categories Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const subCount = cat.subcategories?.length || 0;
          const currentInput = newSubcategoryInputs[cat.id] || '';

          return (
            <div
              key={cat.id}
              className="rounded-3xl bg-zinc-900/60 border border-zinc-800 overflow-hidden shadow-xl flex flex-col justify-between"
            >
              {/* Cover Image & Category Title Bar */}
              <div className="relative aspect-[21/9] sm:aspect-[16/6] overflow-hidden bg-zinc-950">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest font-bold">
                      slug: {cat.slug}
                    </span>
                    <h3 className="font-display font-black text-xl text-white">
                      {cat.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 backdrop-blur-md transition-colors"
                      title="Edit Category Details"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-2 rounded-xl bg-zinc-900/80 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-700 backdrop-blur-md transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {cat.description || 'No description provided.'}
                </p>

                {/* Subcategories Management Section */}
                <div className="pt-3 border-t border-zinc-800/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-gold-400" />
                      <span>Subcategories ({subCount})</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Click × to remove
                    </span>
                  </div>

                  {/* Subcategory Pills */}
                  <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                    {subCount > 0 ? (
                      cat.subcategories?.map((sub) => (
                        <span
                          key={sub.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 group hover:border-gold-400/50 transition-colors"
                        >
                          <span className="font-medium">{sub.name}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubcategory(cat.id, sub.id, sub.name)}
                            className="text-zinc-500 hover:text-rose-400 p-0.5 rounded transition-colors"
                            title={`Remove ${sub.name}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-zinc-500 italic">No subcategories yet. Add one below:</span>
                    )}
                  </div>

                  {/* Quick Add Subcategory Form */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) =>
                        setNewSubcategoryInputs({
                          ...newSubcategoryInputs,
                          [cat.id]: e.target.value,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubcategory(cat.id);
                        }
                      }}
                      placeholder="New subcategory (e.g. Leather Wallets)..."
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSubcategory(cat.id)}
                      className="px-3 py-1.5 rounded-xl bg-gold-400/15 hover:bg-gold-400/25 border border-gold-400/30 text-gold-400 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl">
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
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                  placeholder="e.g. footwear"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Cover Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white font-mono text-[11px] focus:outline-none focus:border-gold-400"
                />
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
                  className="px-6 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-black font-bold uppercase tracking-wider transition-colors"
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
