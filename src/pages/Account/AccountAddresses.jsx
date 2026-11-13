import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Check, Trash2, Edit2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const AccountAddresses = () => {
  const { currentUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: true,
  });

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.auth.getAddresses();
      if (res && res.success && Array.isArray(res.addresses)) {
        setAddresses(res.addresses);
      }
    } catch (err) {
      console.warn('[AccountAddresses] Could not load addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.addressLine1 || !form.city || !form.state || !form.pincode) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const res = await api.auth.addAddress(form);
      if (res && res.success) {
        setShowAddForm(false);
        setForm({
          fullName: '',
          phone: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          pincode: '',
          isDefault: false,
        });
        await fetchAddresses();
      }
    } catch (err) {
      setError(err.message || 'Could not save address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.auth.deleteAddress(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert('Could not delete address.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-brand-100 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-medium text-mauve-deep">
            Saved Delivery Addresses
          </h2>
          <p className="text-xs text-mauve-muted">
            Manage your delivery destinations for handcrafted parcels across India.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Close' : 'Add Address'}</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSaveAddress} className="p-6 rounded-2xl bg-cream-50 border border-brand-200 space-y-4 animate-in fade-in">
          <h3 className="font-serif text-lg font-medium text-mauve-deep">
            New Delivery Address (India)
          </h3>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <input
              type="text"
              required
              placeholder="Full Recipient Name *"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="p-2.5 rounded-xl border border-brand-200 bg-white"
            />
            <input
              type="tel"
              required
              placeholder="Mobile Number (+91) *"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="p-2.5 rounded-xl border border-brand-200 bg-white"
            />
            <input
              type="text"
              required
              placeholder="House/Flat No., Building, Street *"
              value={form.addressLine1}
              onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
              className="p-2.5 rounded-xl border border-brand-200 bg-white sm:col-span-2"
            />
            <input
              type="text"
              placeholder="Landmark / Locality (Optional)"
              value={form.addressLine2}
              onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
              className="p-2.5 rounded-xl border border-brand-200 bg-white sm:col-span-2"
            />
            <input
              type="text"
              required
              placeholder="City *"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="p-2.5 rounded-xl border border-brand-200 bg-white"
            />
            <input
              type="text"
              required
              placeholder="State *"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="p-2.5 rounded-xl border border-brand-200 bg-white"
            />
            <input
              type="text"
              required
              placeholder="PIN Code *"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              className="p-2.5 rounded-xl border border-brand-200 bg-white"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-full border border-brand-200 text-xs font-medium text-mauve-muted hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              {saving ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </form>
      )}

      {/* Address Cards */}
      {addresses.length === 0 ? (
        <div className="p-8 text-center bg-cream-50/50 rounded-2xl border border-brand-200 space-y-2">
          <MapPin className="w-8 h-8 text-brand-400 mx-auto" />
          <h3 className="font-serif text-lg font-medium text-mauve-deep">
            No Addresses Saved
          </h3>
          <p className="text-xs text-mauve-muted max-w-sm mx-auto">
            You haven&apos;t added any delivery addresses yet. Add one to expedite your future handcrafted checkouts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="p-5 rounded-2xl border border-brand-200 bg-white relative space-y-2 shadow-subtle flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-brand-100">
                  <div className="flex items-center gap-2">
                    {addr.is_default && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-100 text-brand-800">
                        Default
                      </span>
                    )}
                    <span className="text-xs text-mauve-muted font-medium">Delivery Destination</span>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-mauve-light hover:text-rose-600 p-1 transition-colors"
                    title="Delete address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-xs text-mauve-charcoal leading-relaxed pt-2">
                  <p className="font-semibold text-sm text-mauve-deep">{addr.full_name}</p>
                  <p>{addr.address_line1}</p>
                  {addr.address_line2 && <p>{addr.address_line2}</p>}
                  <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-mauve-muted mt-1 font-mono">Mobile: {addr.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
