import React, { useState, useEffect } from 'react';
import { Boxes, Sparkles, Feather, AlertTriangle, RefreshCw, Save, Check } from 'lucide-react';
import api from '../../services/api';

export const AdminInventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getInventory();
      if (res && res.success && Array.isArray(res.inventory)) {
        setInventory(res.inventory);
      }
    } catch (err) {
      console.warn('[AdminInventory] Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditQty(item.quantity_available || '');
  };

  const handleSaveEdit = async (itemId) => {
    try {
      setSaving(true);
      const qtyNum = parseFloat(editQty);
      const res = await api.admin.updateInventory(itemId, {
        quantityAvailable: isNaN(qtyNum) ? editQty : qtyNum,
      });
      if (res && res.success) {
        setInventory(prev =>
          prev.map(item => (item.id === itemId ? { ...item, quantity_available: editQty } : item))
        );
        setEditingId(null);
      }
    } catch (err) {
      alert('Could not update inventory item.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Raw Materials &amp; Fiber Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor studio yarn skeins, hypoallergenic stuffing, and keychain hardware allocations in PostgreSQL.
          </p>
        </div>

        <button
          onClick={fetchInventory}
          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm self-start sm:self-auto"
          title="Refresh inventory"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-600' : ''}`} />
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-serif text-base font-bold text-slate-900">
            Studio Fiber &amp; Skein Stock
          </h2>
          <span className="text-xs text-brand-700 font-semibold">PostgreSQL Managed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Material / Component</th>
                <th className="p-4">Category</th>
                <th className="p-4">Available In Studio</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-900 flex items-center gap-2">
                    <Feather className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span>{item.item_name}</span>
                  </td>
                  <td className="p-4 text-slate-500 capitalize">{item.item_type || 'Fiber'}</td>
                  <td className="p-4 font-mono text-slate-700">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editQty}
                        onChange={(e) => setEditQty(e.target.value)}
                        className="w-24 px-2 py-1 rounded border border-brand-500 bg-white text-xs font-mono"
                        autoFocus
                      />
                    ) : (
                      <span>{item.quantity_available} {item.unit || ''}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold bg-emerald-100 text-emerald-800">
                      {item.status || 'Healthy'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {editingId === item.id ? (
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        disabled={saving}
                        className="px-3 py-1 rounded-lg bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="text-brand-700 hover:text-brand-900 font-medium underline text-xs"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
