import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { adminApi } from '../../lib/api';

interface Props {
  product: any | 'new';
  onClose: () => void;
  onSaved: () => void;
}

export default function ProductModal({ product, onClose, onSaved }: Props) {
  const isEditing = product && product !== 'new';
  const [form, setForm] = useState({
    name: isEditing ? product.name : '',
    description: isEditing ? product.description || '' : '',
    price: isEditing ? product.price.toString() : '',
    category: isEditing ? product.category : 'coffee',
    image: isEditing ? product.image : 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
    ingredients: isEditing && Array.isArray(product.ingredients) ? product.ingredients.join(', ') : '100% Arabica Beans, Filtered Water',
    tastingNotes: isEditing && Array.isArray(product.tastingNotes) ? product.tastingNotes.join(', ') : 'Chocolaty, Nutty, Sweet',
    featured: isEditing ? !!product.featured : false,
    inStock: isEditing ? !!product.inStock : true,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price.trim() || !form.image.trim()) {
      alert('Name, price, and image are required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        image: form.image.trim(),
        ingredients: form.ingredients.split(',').map(i => i.trim()).filter(Boolean),
        tastingNotes: form.tastingNotes.split(',').map(n => n.trim()).filter(Boolean),
        featured: form.featured,
        inStock: form.inStock,
      };

      if (isEditing) {
        await adminApi.updateProduct(product.id, payload);
      } else {
        await adminApi.createProduct(payload);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const categories = [
    { value: 'coffee', label: 'Coffee' },
    { value: 'espresso', label: 'Espresso' },
    { value: 'cold-brew', label: 'Cold Brew' },
    { value: 'pastries', label: 'Pastries' },
    { value: 'seasonal', label: 'Seasonal' },
  ];

  return (
    <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl border border-surface p-8 my-8" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif text-[22px] font-semibold text-charcoal">
            {isEditing ? 'Edit Offering' : 'Add New Offering'}
          </h3>
          <button onClick={onClose} className="text-charcoal/40 hover:text-charcoal cursor-pointer"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-sans text-[10px] tracking-[2px] uppercase text-charcoal/50 font-semibold mb-1.5">Name *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="border border-surface rounded-xl px-4 py-3 text-xs font-sans focus:border-primary focus:outline-none" />
            </div>
            <div className="flex flex-col">
              <label className="font-sans text-[10px] tracking-[2px] uppercase text-charcoal/50 font-semibold mb-1.5">Price (PKR) *</label>
              <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                className="border border-surface rounded-xl px-4 py-3 text-xs font-sans focus:border-primary focus:outline-none" />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-sans text-[10px] tracking-[2px] uppercase text-charcoal/50 font-semibold mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2}
              className="border border-surface rounded-xl px-4 py-3 text-xs font-sans focus:border-primary focus:outline-none resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-sans text-[10px] tracking-[2px] uppercase text-charcoal/50 font-semibold mb-1.5">Category *</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="border border-surface rounded-xl px-4 py-3 text-xs font-sans focus:border-primary focus:outline-none cursor-pointer">
                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-sans text-[10px] tracking-[2px] uppercase text-charcoal/50 font-semibold mb-1.5">Image URL *</label>
              <input value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))}
                className="border border-surface rounded-xl px-4 py-3 text-xs font-sans focus:border-primary focus:outline-none" />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-sans text-[10px] tracking-[2px] uppercase text-charcoal/50 font-semibold mb-1.5">Ingredients (comma-separated)</label>
            <input value={form.ingredients} onChange={e => setForm(p => ({ ...p, ingredients: e.target.value }))}
              className="border border-surface rounded-xl px-4 py-3 text-xs font-sans focus:border-primary focus:outline-none" />
          </div>

          <div className="flex flex-col">
            <label className="font-sans text-[10px] tracking-[2px] uppercase text-charcoal/50 font-semibold mb-1.5">Tasting Notes (comma-separated)</label>
            <input value={form.tastingNotes} onChange={e => setForm(p => ({ ...p, tastingNotes: e.target.value }))}
              className="border border-surface rounded-xl px-4 py-3 text-xs font-sans focus:border-primary focus:outline-none" />
          </div>

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
                className="accent-primary" />
              <span className="font-sans text-[11px] text-charcoal/70">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.inStock} onChange={e => setForm(p => ({ ...p, inStock: e.target.checked }))}
                className="accent-primary" />
              <span className="font-sans text-[11px] text-charcoal/70">In Stock</span>
            </label>
          </div>

          <button type="submit" disabled={saving}
            className={`w-full py-3.5 rounded-full font-sans text-[11px] tracking-wider uppercase font-semibold transition-all flex items-center justify-center gap-2 mt-4 ${
              saving ? 'bg-surface text-charcoal/30 cursor-not-allowed' : 'bg-primary text-white cursor-pointer hover:opacity-90'
            }`}>
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : isEditing ? 'Update Offering' : 'Create Offering'}
          </button>
        </form>
      </div>
    </div>
  );
}
