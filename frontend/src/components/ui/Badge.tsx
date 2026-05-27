import { Order } from '../../types';

export function getStatusBadgeClass(status: Order['status']): string {
  switch (status) {
    case 'pending': return 'bg-amber-100 text-amber-800 rounded-full border border-amber-200';
    case 'preparing': return 'bg-blue-100 text-blue-800 rounded-full border border-blue-200';
    case 'ready': return 'bg-amber-50 text-orange-800 rounded-full border border-orange-200/50';
    case 'completed': return 'bg-green-100 text-green-800 rounded-full border border-green-200';
    default: return 'bg-neutral-100 text-neutral-800 rounded-full';
  }
}

export function getStatusLabel(status: Order['status']): string {
  switch (status) {
    case 'pending': return 'Pending';
    case 'preparing': return 'Brewing';
    case 'ready': return 'Ready';
    case 'completed': return 'Completed';
    default: return status;
  }
}

interface BadgeProps {
  status: Order['status'];
}

export default function StatusBadge({ status }: BadgeProps) {
  return (
    <span className={`px-2.5 py-1 text-[9px] uppercase tracking-wider font-semibold ${getStatusBadgeClass(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
}
