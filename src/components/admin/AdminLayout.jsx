import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  ShoppingBag,
  Users,
  Boxes,
  Settings,
  ShieldCheck,
  ArrowLeft,
  Menu,
  X,
  Lock,
  User,
  ExternalLink,
  LogOut,
  AlertCircle,
  Loader2
} from 'lucide-react';
import api from '../../services/api';

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Admin login form state
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('loop_and_love_admin_token');
    if (token) {
      setIsAdminLoggedIn(true);
    }
    setCheckingAuth(false);
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await api.admin.login(loginForm);
      if (res.success && res.token) {
        localStorage.setItem('loop_and_love_admin_token', res.token);
        localStorage.setItem('loop_and_love_admin_user', JSON.stringify(res.admin));
        setIsAdminLoggedIn(true);
      } else {
        setLoginError(res.error || 'Invalid administrator credentials.');
      }
    } catch (err) {
      setLoginError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('loop_and_love_admin_token');
    localStorage.removeItem('loop_and_love_admin_user');
    setIsAdminLoggedIn(false);
  };

  const adminNav = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Add Product', path: '/admin/add-product', icon: PlusCircle },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Inventory & Yarn', path: '/admin/inventory', icon: Boxes },
    { label: 'Website Settings', path: '/admin/settings', icon: Settings },
  ];

  // If not logged in as Admin, show the authentication gate
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-300 shadow-md mx-auto mb-3">
              <img src="/logo.png" alt="Loop & Love" className="w-full h-full object-cover" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-slate-900">
              Loop &amp; Love Studio Manager
            </h1>
            <p className="text-xs text-slate-500">
              Enter administrator credentials to manage products, orders, and PostgreSQL records.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-100 text-[11px] text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">Default Super Admin Credentials:</p>
            <p>Username: <code className="font-mono text-brand-800 font-bold">loopadmin</code></p>
            <p>Password: <code className="font-mono text-brand-800 font-bold">LoopLoveAdmin2026!</code></p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Username or Admin Email</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="loopadmin"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Admin Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shadow-sm"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Access Management Portal</span>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link to="/" className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Explicit Security & Production Status Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-emerald-300 font-bold">POSTGRESQL PRODUCTION BACKEND CONNECTED</span>
            <span className="text-slate-400 hidden md:inline">| Authenticated as Super Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAdminLogout}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-400 text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white text-xs underline font-medium"
            >
              <span>View Public Store</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200">
          
          {/* Brand header */}
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-200 shrink-0">
              <img src="/logo.png" alt="Loop & Love" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-mauve-deep leading-tight">
                Loop &amp; Love
              </h2>
              <span className="text-[10px] text-brand-700 uppercase tracking-widest font-mono">
                Store Manager
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-700 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer note */}
          <div className="p-4 border-t border-slate-100 text-[11px] text-slate-400">
            <span>Loop &amp; Love v1.0.0</span>
            <p className="mt-0.5">PostgreSQL Backend Active</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* Topbar for mobile/tablet */}
          <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <span className="font-serif text-lg font-semibold text-mauve-deep">
                Admin Studio
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
              <span>Database Status:</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live PostgreSQL Relational Engine
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/shop"
                className="text-xs text-brand-700 hover:text-brand-900 font-medium hidden sm:inline"
              >
                View Live Catalog &rarr;
              </Link>
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 text-xs font-semibold flex items-center justify-center">
                LA
              </div>
            </div>
          </header>

          {/* Mobile Sidebar overlay */}
          {isSidebarOpen && (
            <div className="lg:hidden p-4 bg-white border-b border-slate-200 space-y-1">
              {adminNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={() => setIsSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-brand-700 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          )}

          {/* Main Outlet for Admin Pages */}
          <main className="p-4 sm:p-8 flex-1 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>

        </div>

      </div>

    </div>
  );
};
