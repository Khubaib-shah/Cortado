import { useState } from 'react';
import { Plus, Edit3, Trash2, Star, Tag } from 'lucide-react';
import { adminApi } from '../../lib/api';

interface Props {
  products: any[];
  onOpenProductModal: (product?: any) => void;
  onRefresh: () => void;
}

export default function MenuTab({ products, onOpenProductModal, onRefresh }: Props) {
  const [filter, setFilter] = useState('all');
  const categories = ['all', 'coffee', 'espresso', 'cold-brew', 'pastries', 'seasonal'];

  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  const handleToggleStock = async (product: any) => {
    try {
      await adminApi.updateProduct(product.id, { inStock: !product.inStock });
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle stock.');
    }
  };

  const handleToggleFeatured = async (product: any) => {
    try {
      await adminApi.updateProduct(product.id, { featured: !product.featured });
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle featured.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this offering permanently?')) return;
    try {
      await adminApi.deleteProduct(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full font-sans text-[10px] tracking-wider uppercase font-semibold transition-all cursor-pointer ${
                filter === cat ? 'bg-primary text-white' : 'bg-white border border-surface text-charcoal/60 hover:border-primary/30'
              }`}>
              {cat === 'cold-brew' ? 'Cold Brew' : cat}
            </button>
          ))}
        </div>
        <button onClick={() => onOpenProductModal()}
          className="bg-primary text-white px-5 py-2.5 rounded-full font-sans text-[10px] tracking-wider uppercase font-semibold flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer shadow-md">
          <Plus size={14} /> Add Offering
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product: any) => (
          <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-card border border-surface group">
            <div className="relative h-44 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {!product.inStock && (
                <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center">
                  <span className="font-sans text-[10px] tracking-wider uppercase text-white font-bold bg-red-500 px-3 py-1 rounded-full">Out of Stock</span>
                </div>
              )}
              {product.featured && (
                <div className="absolute top-3 left-3">
                  <Star size={16} className="text-amber-400 fill-amber-400 drop-shadow" />
                </div>
              )}
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-serif text-[16px] font-semibold text-charcoal leading-tight">{product.name}</h4>
                  <span className="font-sans text-[10px] tracking-wider uppercase text-charcoal/40 font-semibold">{product.category}</span>
                </div>
                <span className="font-serif text-primary font-bold text-[16px]">PKR {product.price}</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => handleToggleStock(product)}
                  className={`text-[9px] tracking-wider uppercase font-bold px-2.5 py-1 rounded-full border cursor-pointer transition-all ${
                    product.inStock ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'
                  }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </button>
                <button onClick={() => handleToggleFeatured(product)}
                  className={`text-[9px] tracking-wider uppercase font-bold px-2.5 py-1 rounded-full border cursor-pointer transition-all ${
                    product.featured ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-surface bg-surface/30 text-charcoal/40'
                  }`}>
                  <Star size={10} className="inline mr-1" />{product.featured ? 'Featured' : 'Not Featured'}
                </button>
              </div>

              <div className="flex gap-2 pt-2 border-t border-surface">
                <button onClick={() => onOpenProductModal(product)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-surface/50 hover:bg-primary/10 text-charcoal/60 hover:text-primary text-[10px] tracking-wider uppercase font-semibold transition-all cursor-pointer">
                  <Edit3 size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(product.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-surface/50 hover:bg-red-50 text-charcoal/60 hover:text-red-500 text-[10px] tracking-wider uppercase font-semibold transition-all cursor-pointer">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
