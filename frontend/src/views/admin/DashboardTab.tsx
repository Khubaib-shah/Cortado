import { Hammer, Clock, CheckCircle2, CircleDollarSign, Edit3, Trash2 } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/Badge';
import { Order } from '../../types';

interface Props {
  stats: { totalOrders: number; pending: number; preparing: number; ready: number; completed: number; revenue: number };
  orders: Order[];
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
}

export default function DashboardTab({ stats, orders, onEditOrder, onDeleteOrder }: Props) {
  const kpis = [
    { value: stats.totalOrders, label: 'Total Orders', desc: 'Received in queue', accent: 'bg-primary/10 text-primary', icon: <Hammer size={20} /> },
    { value: stats.pending, label: 'Pending', desc: 'Awaiting prep', accent: 'bg-amber-100 text-amber-800', icon: <Clock size={20} /> },
    { value: stats.completed, label: 'Completed', desc: 'Delivered', accent: 'bg-green-100 text-green-700', icon: <CheckCircle2 size={20} /> },
    { value: `PKR ${stats.revenue}`, label: 'Revenue', desc: 'Active orders', accent: 'bg-orange-50 text-indigo-800', icon: <CircleDollarSign size={20} /> },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((k, i) => (
          <StatCard key={i} value={k.value} label={k.label} description={k.desc} accentClass={k.accent} icon={k.icon} />
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-card border border-surface">
        <h3 className="font-serif text-[18px] font-semibold text-charcoal mb-6 uppercase tracking-wide">Recent Orders</h3>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="text-charcoal/40 font-semibold uppercase tracking-wider border-b border-surface/70 text-[11px]">
                <th className="pb-3">ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Items</th>
                <th className="pb-3 text-right">Value</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface/50 font-light">
              {orders.slice(0, 5).map(ord => (
                <tr key={ord.id} className="text-charcoal/80 hover:bg-cream/15">
                  <td className="py-3.5 font-mono text-primary font-bold text-[12px]">{ord.orderId}</td>
                  <td className="py-3.5 text-xs">
                    <div className="font-medium text-charcoal">{ord.customer.name}</div>
                    <div className="text-charcoal/40 text-[10px] font-light truncate max-w-[120px]">{ord.customer.email}</div>
                  </td>
                  <td className="py-3.5 text-charcoal/60 truncate max-w-[200px] font-serif text-[13px]">
                    {ord.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                  </td>
                  <td className="py-3.5 text-right font-serif text-[13px] font-medium text-charcoal">PKR {ord.total}</td>
                  <td className="py-3.5 text-center"><StatusBadge status={ord.status} /></td>
                  <td className="py-3.5 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => onEditOrder(ord)} className="p-1.5 text-charcoal/50 hover:text-primary hover:bg-surface rounded-full transition-colors cursor-pointer"><Edit3 size={13} /></button>
                      <button onClick={() => onDeleteOrder(ord.id)} className="p-1.5 text-charcoal/50 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
