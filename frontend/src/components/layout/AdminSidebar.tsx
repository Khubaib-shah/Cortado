import {
  LayoutDashboard, ShoppingBag, Edit3, Home, LogOut, X,
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: 'dashboard' | 'orders' | 'menu';
  pendingCount: number;
  sidebarOpen: boolean;
  onTabChange: (tab: 'dashboard' | 'orders' | 'menu') => void;
  onSidebarClose: () => void;
  onNavigateHome: () => void;
  onLogout: () => void;
}

export default function AdminSidebar({
  activeTab, pendingCount, sidebarOpen,
  onTabChange, onSidebarClose, onNavigateHome, onLogout,
}: AdminSidebarProps) {
  const navItems: { tab: 'dashboard' | 'orders' | 'menu'; label: string; icon: any; badge?: number }[] = [
    { tab: 'dashboard', label: 'Metrics', icon: LayoutDashboard },
    { tab: 'orders', label: 'Orders Queue', icon: ShoppingBag, badge: pendingCount },
    { tab: 'menu', label: 'Manage Offerings', icon: Edit3 },
  ];

  return (
    <>
      <aside
        className={`fixed top-0 left-0 bottom-0 w-60 bg-charcoal text-white/70 flex flex-col justify-between z-40 transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
            <span className="font-serif text-[18px] tracking-[4px] uppercase text-white font-medium">
              CORTADO
            </span>
            <button className="md:hidden text-white/50 hover:text-white" onClick={onSidebarClose}>
              <X size={18} />
            </button>
          </div>

          <nav className="p-4 mt-6 flex flex-col gap-1.5 font-sans text-[12px] tracking-[2px] uppercase">
            {navItems.map(({ tab, label, icon: Icon, badge }) => (
              <button
                key={tab}
                onClick={() => { onTabChange(tab); onSidebarClose(); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left cursor-pointer ${
                  activeTab === tab
                    ? 'bg-primary/20 text-primary border-l-2 border-primary font-semibold'
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={14} />
                <span className="flex-1">{label}</span>
                {badge !== undefined && badge > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse">
                    {badge}
                  </span>
                )}
              </button>
            ))}

            <button
              onClick={onNavigateHome}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 hover:text-white transition-all text-left cursor-pointer text-white/50"
            >
              <Home size={14} />
              <span>View Front Store</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 font-sans text-[11px] tracking-[1.5px] uppercase">
          <div className="px-4 py-2 font-light text-white/30 truncate select-none">Admin Profile</div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all text-left cursor-pointer font-medium"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div onClick={onSidebarClose} className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-30 md:hidden" />
      )}
    </>
  );
}
