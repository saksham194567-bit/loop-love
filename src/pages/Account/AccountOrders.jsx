import React, { useState, useEffect } from 'react';
import { Package, ArrowRight, Sparkles, Clock, Truck, CheckCircle2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/common/EmptyState';
import api from '../../services/api';

export const AccountOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.orders.getMyOrders();
      if (res && res.success && Array.isArray(res.orders)) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.warn('[AccountOrders] Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-brand-100 pb-4 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-medium text-mauve-deep">
            Order History
          </h2>
          <p className="text-xs text-mauve-muted">
            Your handcrafted purchases and custom commissions will appear here.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2 rounded-xl border border-brand-200 text-mauve-muted hover:text-brand-800 transition-colors"
          title="Refresh orders"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-600' : ''}`} />
        </button>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          badge="Order Archive"
          title="No Orders Placed Yet"
          subtitle="You have not placed any handmade orders with us yet. When our inaugural collection opens or when you commission a custom piece, track its progress right here."
          actionText="Browse Categories"
          actionLink="/shop"
          secondaryActionText="Track an Existing Order ID"
          secondaryActionLink="/track-order"
          showNewsletterPrompt={false}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-5 rounded-2xl border border-brand-200 bg-white shadow-subtle space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-brand-100 text-xs">
                <div>
                  <span className="font-mono font-bold text-brand-800 text-sm">
                    {ord.order_number}
                  </span>
                  <p className="text-[11px] text-mauve-muted">
                    Placed on {ord.created_at ? new Date(ord.created_at).toLocaleDateString('en-IN') : 'Recent'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-brand-100 text-brand-800">
                    {ord.order_status?.replace('_', ' ') || 'Confirmed'}
                  </span>
                  <span className="font-serif font-bold text-base text-mauve-deep">
                    ₹{Number(ord.total_amount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Items summary */}
              <div className="text-xs text-mauve-charcoal space-y-1">
                {Array.isArray(ord.items) && ord.items.map((item, idx) => (
                  item.productName && (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span>
                        {item.productName} {item.variant ? `(${item.variant})` : ''} &times; {item.quantity}
                      </span>
                      <span className="font-mono text-mauve-muted">
                        ₹{Number(item.subtotal || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  to={`/track-order?orderId=${encodeURIComponent(ord.order_number)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-900 transition-colors"
                >
                  <span>Track Artisan Progress</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
