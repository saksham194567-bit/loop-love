import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, Clock, CheckCircle2, Truck, RefreshCw, AlertCircle, ChevronDown } from 'lucide-react';
import api from '../../services/api';

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'payment_processing', label: 'Payment Processing' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing (Crocheting)' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' }
];

export const AdminOrdersPage = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = filterStatus !== 'all' ? { status: filterStatus } : {};
      const res = await api.admin.getOrders(params);
      if (res && res.success && Array.isArray(res.orders)) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.warn('[AdminOrders] Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await api.admin.updateOrderStatus(orderId, { orderStatus: newStatus });
      if (res && res.success) {
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, order_status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error('[AdminOrders] Could not update order status:', err);
      alert('Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      (o.order_number && o.order_number.toLowerCase().includes(term)) ||
      (o.shipping_name && o.shipping_name.toLowerCase().includes(term)) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(term)) ||
      (o.customer_email && o.customer_email.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Order Fulfillment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor handcrafted queue, packaging milestones, and courier dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
            title="Refresh orders"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-600' : ''}`} />
          </button>
          <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
            {['all', 'confirmed', 'processing', 'shipped', 'delivered'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                  filterStatus === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
        <input
          type="text"
          placeholder="Search by order number (e.g. LL-), customer name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* Orders List / Empty State */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold text-slate-800">
            {orders.length === 0 ? 'No Orders Placed Yet' : 'No Orders Match Your Filter'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {orders.length === 0
              ? 'Real customer orders placed on the storefront will appear here live with customer details, order timeline status, and items.'
              : 'Try clearing your search query or selecting "all" filter.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Order ID &amp; Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items Handcrafted</th>
                  <th className="p-4">Total (INR)</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status &amp; Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <span className="font-mono font-bold text-brand-800 block">{ord.order_number}</span>
                      <span className="text-[11px] text-slate-400">
                        {ord.created_at ? new Date(ord.created_at).toLocaleDateString('en-IN') : 'Recent'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-900 block">{ord.shipping_name || ord.customer_name || 'Artisan Client'}</span>
                      <span className="text-[11px] text-slate-500">{ord.customer_email}</span>
                      {ord.customer_phone && (
                        <span className="text-[10px] text-slate-400 block">{ord.customer_phone}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-slate-700 font-medium">
                        {Array.isArray(ord.items) && ord.items[0]?.id ? ord.items.length : 1} item(s)
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-900">
                      ₹{Number(ord.total_amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold ${
                          ord.payment_status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.payment_status || 'test'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={ord.order_status || 'confirmed'}
                          disabled={updatingId === ord.id}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-500"
                        >
                          {ORDER_STATUSES.map(st => (
                            <option key={st.value} value={st.value}>{st.label}</option>
                          ))}
                        </select>
                        {updatingId === ord.id && (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-600" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
