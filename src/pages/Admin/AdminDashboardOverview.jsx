import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  PlusCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Boxes,
  RefreshCw
} from 'lucide-react';
import api from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { categories } from '../../data/categories';

export const AdminDashboardOverview = () => {
  const { productsList } = useStore();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: productsList.length,
    pendingOrders: 0,
    lowStockProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getStats();
      if (res && res.success) {
        setStats(res.stats);
        if (Array.isArray(res.recentOrders)) {
          setRecentOrders(res.recentOrders);
        }
      }
    } catch (err) {
      console.warn('[AdminDashboard] Could not fetch remote stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [productsList.length]);

  const metrics = [
    {
      title: 'Total Revenue',
      value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`,
      change: stats.totalRevenue > 0 ? 'Verified via DB' : 'Store In Prep',
      icon: TrendingUp
    },
    {
      title: 'Active Products',
      value: (stats.totalProducts ?? productsList.length).toString(),
      change: stats.totalProducts > 0 ? 'Published listings' : 'Catalogue in prep',
      icon: Package
    },
    {
      title: 'Orders Handcrafted',
      value: (stats.totalOrders || 0).toString(),
      change: stats.totalOrders > 0 ? `${stats.pendingOrders} in queue` : 'Awaiting launch',
      icon: ShoppingBag
    },
    {
      title: 'Handmade Categories',
      value: categories.length.toString(),
      change: '7 Official lines',
      icon: Boxes
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title & Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Atelier Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Loop &amp; Love administrative control center and production monitor.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchStats}
            title="Refresh metrics"
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-600' : ''}`} />
          </button>
          <Link
            to="/admin/add-product"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Crochet Piece</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium uppercase tracking-wider">{m.title}</span>
                <Icon className="w-4 h-4 text-brand-600" />
              </div>
              <p className="text-2xl font-serif font-bold text-slate-900">{m.value}</p>
              <p className="text-[11px] text-slate-500 font-medium">{m.change}</p>
            </div>
          );
        })}
      </div>

      {/* Preparation Status & Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Next Launch Tasks (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-serif text-lg font-bold text-slate-900">
              Commercial Launch Checklist
            </h2>
            <span className="text-xs text-brand-700 font-medium">PostgreSQL Connected</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Backend PostgreSQL database &amp; 16 schema tables configured</span>
              </div>
              <span className="font-mono text-[11px] font-semibold">Done</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Secure admin JWT authentication with bcrypt verification</span>
              </div>
              <span className="font-mono text-[11px] font-semibold">Done</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span>Add real handmade listings to catalogue</span>
              </div>
              <Link to="/admin/add-product" className="font-semibold underline">Add Now</Link>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>Legal policies: replace [PLACEHOLDER] business entity details</span>
              </div>
              <Link to="/policies/privacy" className="font-semibold underline">Review</Link>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>Connect Razorpay API credentials for production UPI / Card processing</span>
              </div>
              <span className="text-slate-400 font-mono">Test Mode Active</span>
            </div>
          </div>
        </div>

        {/* Quick Links / Shortcuts (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Quick Studio Actions
            </h2>

            <div className="space-y-2.5 mt-3">
              <Link
                to="/admin/products"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-medium text-slate-800"
              >
                <span>Manage Product Catalogue</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/admin/orders"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-medium text-slate-800"
              >
                <span>Fulfillment &amp; Customer Orders</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/admin/inventory"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-medium text-slate-800"
              >
                <span>Yarn &amp; Fiber Inventory</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/admin/categories"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-medium text-slate-800"
              >
                <span>View 7 Craft Categories</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/admin/settings"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-medium text-slate-800"
              >
                <span>Store Configuration (INR &amp; Shipping)</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
