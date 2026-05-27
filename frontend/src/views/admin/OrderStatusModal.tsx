import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Order } from '../../types';
import { adminApi } from '../../lib/api';

interface Props {
  order: Order;
  onClose: () => void;
  onUpdated: () => void;
}

export default function OrderStatusModal({ order, onClose, onUpdated }: Props) {
  const [newStatus, setNewStatus] = useState<Order['status']>(order.status);
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async () => {
    setUpdating(true);
    try {
      await adminApi.updateOrderStatus(order.id, newStatus);
      onUpdated();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to update.');
    } finally {
      setUpdating(false);
    }
  };

  const statuses: { value: Order['status']; label: string; color: string }[] = [
    { value: 'pending', label: 'Pending', color: 'border-amber-300 bg-amber-50' },
    { value: 'preparing', label: 'Brewing', color: 'border-blue-300 bg-blue-50' },
    { value: 'ready', label: 'Ready', color: 'border-orange-300 bg-orange-50' },
    { value: 'completed', label: 'Completed', color: 'border-green-300 bg-green-50' },
  ];

  return (
    <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-surface p-8" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif text-[22px] font-semibold text-charcoal">Update Status</h3>
          <button onClick={onClose} className="text-charcoal/40 hover:text-charcoal cursor-pointer"><X size={18} /></button>
        </div>

        <p className="font-mono text-primary text-sm font-bold mb-6">{order.orderId}</p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {statuses.map(s => (
            <button
              key={s.value}
              onClick={() => setNewStatus(s.value)}
              className={`p-3 rounded-xl border-2 font-sans text-[11px] tracking-wider uppercase font-semibold transition-all cursor-pointer ${
                newStatus === s.value ? s.color + ' ring-2 ring-primary/20' : 'border-surface bg-white text-charcoal/60 hover:bg-surface/30'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={updating || newStatus === order.status}
          className={`w-full py-3.5 rounded-full font-sans text-[11px] tracking-wider uppercase font-semibold transition-all flex items-center justify-center gap-2 ${
            updating || newStatus === order.status
              ? 'bg-surface text-charcoal/30 cursor-not-allowed'
              : 'bg-primary text-white cursor-pointer hover:opacity-90'
          }`}
        >
          {updating ? <><Loader2 size={14} className="animate-spin" /> Updating...</> : 'Confirm Status'}
        </button>
      </div>
    </div>
  );
}
