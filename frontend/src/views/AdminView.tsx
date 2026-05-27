import { useState, useEffect } from 'react';
import { Loader2, RefreshCw, Hammer } from 'lucide-react';
import AdminSidebar from '../components/layout/AdminSidebar';
import DashboardTab from './admin/DashboardTab';
import OrdersTab from './admin/OrdersTab';
import MenuTab from './admin/MenuTab';
import OrderStatusModal from './admin/OrderStatusModal';
import ProductModal from './admin/ProductModal';
import { useAdminData } from '../hooks/useAdminData';
import { useAdminSocket } from '../hooks/useSocket';
import { Order } from '../types';
import { adminApi } from '../lib/api';

interface AdminViewProps {
  currentUser: any;
  onLogout: () => void;
  onNavigate: (view: string, params?: any) => void;
}

export default function AdminView({ currentUser, onLogout, onNavigate }: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'menu'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const {
    orders, stats, products, loading, refreshing, errorMsg,
    fetchAdminData, handleNewOrder, handleOrderUpdated, handleOrderDeleted,
  } = useAdminData();

  // Socket.IO real-time updates
  useAdminSocket({
    onNewOrder: handleNewOrder,
    onOrderUpdated: handleOrderUpdated,
    onOrderDeleted: handleOrderDeleted,
  });

  useEffect(() => { fetchAdminData(); }, []);

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('Delete this order permanently?')) return;
    try {
      await adminApi.deleteOrder(orderId);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Delete failed.');
    }
  };

  const currentDateTime = new Date().toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 pt-24">
        <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center border border-surface shadow-card">
          <Hammer size={40} className="text-red-500 mx-auto mb-4" />
          <h2 className="font-serif text-[28px] text-charcoal mb-2">Restricted Access</h2>
          <p className="font-sans text-[13px] leading-relaxed text-charcoal/60 mb-8 font-light">{errorMsg}</p>
          <div className="space-y-3">
            <button onClick={() => onNavigate('auth')} className="w-full bg-primary text-white py-3 rounded-full font-sans text-[11px] tracking-wider uppercase font-semibold hover:opacity-90 transition-all cursor-pointer">Log in as admin</button>
            <button onClick={() => onNavigate('home')} className="w-full border border-charcoal/30 text-charcoal py-3 rounded-full font-sans text-[11px] tracking-wider uppercase font-light hover:bg-surface transition-all cursor-pointer">Return Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex relative">
      <AdminSidebar
        activeTab={activeTab}
        pendingCount={stats.pending}
        sidebarOpen={sidebarOpen}
        onTabChange={setActiveTab}
        onSidebarClose={() => setSidebarOpen(false)}
        onNavigateHome={() => onNavigate('home')}
        onLogout={() => { onLogout(); onNavigate('home'); }}
      />

      <main className="flex-1 ml-0 md:ml-60 min-h-screen flex flex-col p-6 md:p-10 pt-20 md:pt-10">
        {/* Mobile header */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-surface px-6 flex items-center justify-between z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 text-charcoal hover:bg-surface rounded-lg"><Hammer size={18} /></button>
          <span className="font-serif text-[18px] uppercase tracking-wider text-charcoal">Admin</span>
          <button onClick={fetchAdminData} className="p-1.5 text-charcoal hover:bg-surface rounded-lg"><RefreshCw size={15} /></button>
        </div>

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <span className="font-sans text-[10px] md:text-[11px] tracking-[4px] uppercase text-primary font-bold block mb-1">CORTADO OPERATIONS</span>
            <h1 className="font-serif text-[38px] md:text-[44px] tracking-tight leading-none text-charcoal font-normal">
              Welcome, {currentUser?.name || 'Admin'}
            </h1>
            <p className="font-sans text-xs text-charcoal/40 font-light mt-1.5">{currentDateTime}</p>
          </div>
          <button onClick={fetchAdminData} disabled={refreshing}
            className="font-sans text-[10px] tracking-[1px] uppercase border border-charcoal/20 hover:bg-charcoal hover:text-white px-4.5 py-2.5 rounded-full flex items-center gap-1.5 transition-all outline-none font-semibold shadow-sm text-charcoal cursor-pointer">
            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </header>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20">
            <Loader2 size={36} className="text-primary animate-spin mb-4" />
            <span className="font-serif text-charcoal/60 italic">Loading dashboard...</span>
          </div>
        ) : (
          <div className="space-y-10 flex-1">
            {activeTab === 'dashboard' && (
              <DashboardTab stats={stats} orders={orders} onEditOrder={setSelectedOrder} onDeleteOrder={handleDeleteOrder} />
            )}
            {activeTab === 'orders' && (
              <OrdersTab orders={orders} onEditOrder={setSelectedOrder} onDeleteOrder={handleDeleteOrder} />
            )}
            {activeTab === 'menu' && (
              <MenuTab products={products} onOpenProductModal={p => setSelectedProduct(p || 'new')} onRefresh={fetchAdminData} />
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedOrder && (
        <OrderStatusModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdated={fetchAdminData} />
      )}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onSaved={fetchAdminData} />
      )}
    </div>
  );
}
