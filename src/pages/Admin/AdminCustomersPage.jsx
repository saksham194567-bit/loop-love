import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin, RefreshCw, ShoppingBag } from 'lucide-react';
import api from '../../services/api';

export const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getCustomers();
      if (res && res.success && Array.isArray(res.customers)) {
        setCustomers(res.customers);
      }
    } catch (err) {
      console.warn('[AdminCustomers] Could not fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Customer Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered handmade enthusiasts, VIP club subscribers, and custom order clients.
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm self-start sm:self-auto"
          title="Refresh customers"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-600' : ''}`} />
        </button>
      </div>

      {customers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold text-slate-800">
            No Registered Customers Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Customer accounts and profiles will be populated as customers register and order during the launch stage.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Phone / WhatsApp</th>
                  <th className="p-4">Orders Placed</th>
                  <th className="p-4">Total Spent (INR)</th>
                  <th className="p-4">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-4 font-semibold text-slate-900">{c.name || 'Artisan Collector'}</td>
                    <td className="p-4 text-slate-600">{c.email}</td>
                    <td className="p-4 font-mono text-slate-500">{c.phone || '—'}</td>
                    <td className="p-4 text-slate-700 font-medium">{c.order_count || 0}</td>
                    <td className="p-4 font-semibold text-slate-900">
                      ₹{Number(c.total_spent || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-slate-400">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN') : 'Recent'}
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
