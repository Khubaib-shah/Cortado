import { Edit3, Trash2 } from 'lucide-react';
import StatusBadge from '../../components/ui/Badge';
import { Order } from '../../types';

interface Props {
  orders: Order[];
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
}

export default function OrdersTab({ orders, onEditOrder, onDeleteOrder }: Props) {
  return (
    <div className="space-y-6 bg-white rounded-2xl p-6 shadow-card border border-surface">
      <div className="flex justify-between items-center border-b border-surface pb-4">
        <h3 className="font-serif text-[18px] font-semibold text-charcoal uppercase tracking-wide">
          Live Orders Queue ({orders.length})
        </h3>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left font-sans text-xs">
          <thead>
            <tr className="text-charcoal/40 font-semibold uppercase tracking-wider border-b border-surface/70 text-[11px]">
              <th className="pb-3">ID</th>
              <th className="pb-3">Date / Area</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Items</th>
              <th className="pb-3 text-right">Total</th>
              <th className="pb-3 text-center">Status</th>
              <th className="pb-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface/60 font-light">
            {orders.map(ord => (
              <tr key={ord.id} className="text-charcoal/80 hover:bg-cream/20">
                <td className="py-4 font-mono text-primary font-semibold text-[12px]">{ord.orderId}</td>
                <td className="py-4 font-light text-[11px]">
                  <div>{new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div className="text-charcoal/40 text-[10px] uppercase font-semibold mt-1 truncate max-w-[100px]">{ord.customer.city}</div>
                </td>
                <td className="py-4">
                  <div className="font-medium text-charcoal">{ord.customer.name}</div>
                  <div className="text-charcoal/40 text-[11px] font-light leading-none mt-1">{ord.customer.phone}</div>
                </td>
                <td className="py-4 font-serif text-[13px] leading-relaxed text-charcoal/70">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <span className="font-bold text-charcoal/50 text-[11px]">{it.quantity}x</span>
                      <span>{it.name}</span>
                    </div>
                  ))}
                </td>
                <td className="py-4 text-right font-serif text-[14px] font-semibold text-charcoal/80">PKR {ord.total}</td>
                <td className="py-4 text-center"><StatusBadge status={ord.status} /></td>
                <td className="py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => onEditOrder(ord)} className="p-1.5 text-charcoal/50 hover:text-primary hover:bg-surface rounded-full transition-colors cursor-pointer"><Edit3 size={12} /></button>
                    <button onClick={() => onDeleteOrder(ord.id)} className="p-1.5 text-charcoal/50 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
