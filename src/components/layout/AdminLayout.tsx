import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ShoppingBag, Package, Users, TrendingUp,
  CreditCard, Settings, ChevronRight, Menu, X, LogOut, Video
} from "lucide-react";
import { adminLogout, getAdminSession } from "@/lib/adminAuth";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: ShoppingBag, label: "Orders", path: "/admin/orders" },
  { icon: Package, label: "Products", path: "/admin/products" },
  { icon: Users, label: "Customers", path: "/admin/customers" },
  { icon: CreditCard, label: "Payments", path: "/admin/payments" },
  { icon: Video, label: "Content", path: "/admin/content" },
  { icon: TrendingUp, label: "Analytics", path: "/admin/analytics" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const session = getAdminSession();

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-60 bg-[hsl(var(--sidebar-background))] z-50 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="flex items-center justify-between p-5 border-b border-[hsl(var(--sidebar-border))]">
          <Link to="/admin" className="brand-name text-xl text-white tracking-[0.2em]">
            LINE<sup className="text-[0.55em] align-super">°</sup>
            <span className="text-xs font-body text-[hsl(var(--sidebar-foreground))]/50 ml-2 tracking-normal normal-case">Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/50 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all min-h-[44px] ${
                  active
                    ? "bg-[hsl(var(--sidebar-accent))] text-white border-l-2 border-[hsl(var(--sidebar-primary))]"
                    : "text-[hsl(var(--sidebar-foreground))]/70 hover:bg-[hsl(var(--sidebar-accent))] hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
                {active && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[hsl(var(--sidebar-border))] space-y-2">
          {session && (
            <p className="text-xs text-[hsl(var(--sidebar-foreground))]/40 truncate px-1">{session.email}</p>
          )}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-xs text-[hsl(var(--sidebar-foreground))]/50 hover:text-white transition-colors">
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              View Store
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-[hsl(var(--sidebar-foreground))]/50 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-border px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-muted rounded-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Open menu"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
            <h1 className="font-medium text-sm lg:text-base">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">LINE° Admin</span>
            <Link to="/shop" target="_blank" className="text-xs border border-border px-3 py-1.5 hover:border-[hsl(var(--brand-charcoal))] transition-colors">
              View Store ↗
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
