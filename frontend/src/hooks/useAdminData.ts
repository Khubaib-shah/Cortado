import { useState, useCallback } from 'react';
import { adminApi, productsApi } from '../lib/api';
import { Order } from '../types';

interface AdminStats {
  totalOrders: number;
  pending: number;
  preparing: number;
  ready: number;
  completed: number;
  revenue: number;
}

const defaultStats: AdminStats = {
  totalOrders: 0, pending: 0, preparing: 0, ready: 0, completed: 0, revenue: 0,
};

export function useAdminData() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<AdminStats>(defaultStats);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchAdminData = useCallback(async () => {
    setRefreshing(true);
    setLoading(true);
    setErrorMsg(null);

    try {
      const [ordersData, statsData, productsRes] = await Promise.all([
        adminApi.getOrders(),
        adminApi.getStats(),
        productsApi.getAll(),
      ]);

      setOrders(ordersData);
      setStats(statsData);
      setProducts(productsRes);
    } catch (err: any) {
      setErrorMsg(err.message || 'Permissions denied.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Socket-driven real-time updates (called from the component using useAdminSocket)
  const handleNewOrder = useCallback((order: Order) => {
    setOrders(prev => [order, ...prev]);
    setStats(prev => ({
      ...prev,
      totalOrders: prev.totalOrders + 1,
      pending: prev.pending + 1,
    }));
  }, []);

  const handleOrderUpdated = useCallback((updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    // Re-fetch stats on status change for accuracy
    adminApi.getStats().then(setStats).catch(() => {});
  }, []);

  const handleOrderDeleted = useCallback(({ orderId }: { orderId: string }) => {
    setOrders(prev => prev.filter(o => o.id !== orderId && o.orderId !== orderId));
    adminApi.getStats().then(setStats).catch(() => {});
  }, []);

  return {
    orders, stats, products, loading, refreshing, errorMsg,
    fetchAdminData,
    handleNewOrder, handleOrderUpdated, handleOrderDeleted,
    setOrders, setProducts,
  };
}
