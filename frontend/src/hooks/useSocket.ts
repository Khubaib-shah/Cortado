import { useEffect, useRef } from 'react';
import { getSocket } from '../lib/socket';
import { Order } from '../types';

/**
 * Hook for admin dashboard — listens for real-time order events.
 */
export function useAdminSocket(callbacks: {
  onNewOrder: (order: Order) => void;
  onOrderUpdated: (order: Order) => void;
  onOrderDeleted: (data: { orderId: string }) => void;
}) {
  const cbRef = useRef(callbacks);
  cbRef.current = callbacks;

  useEffect(() => {
    const socket = getSocket();
    socket.emit('admin:join');

    const handleNew = (order: Order) => cbRef.current.onNewOrder(order);
    const handleUpdated = (order: Order) => cbRef.current.onOrderUpdated(order);
    const handleDeleted = (data: { orderId: string }) => cbRef.current.onOrderDeleted(data);

    socket.on('order:new', handleNew);
    socket.on('order:updated', handleUpdated);
    socket.on('order:deleted', handleDeleted);

    return () => {
      socket.off('order:new', handleNew);
      socket.off('order:updated', handleUpdated);
      socket.off('order:deleted', handleDeleted);
    };
  }, []);
}

/**
 * Hook for customer TrackView — subscribes to a specific order's live status updates.
 */
export function useOrderTracking(
  orderId: string | null,
  onStatusChange: (data: { orderId: string; status: Order['status']; updatedAt: string }) => void
) {
  const cbRef = useRef(onStatusChange);
  cbRef.current = onStatusChange;

  useEffect(() => {
    if (!orderId) return;

    const socket = getSocket();
    socket.emit('track:subscribe', orderId);

    const handler = (data: { orderId: string; status: Order['status']; updatedAt: string }) => {
      cbRef.current(data);
    };

    socket.on('status:changed', handler);

    return () => {
      socket.emit('track:unsubscribe', orderId);
      socket.off('status:changed', handler);
    };
  }, [orderId]);
}
