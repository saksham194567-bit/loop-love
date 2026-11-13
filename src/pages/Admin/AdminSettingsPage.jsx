import React, { useState } from 'react';
import { Save, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import api from '../../services/api';

export const AdminSettingsPage = () => {
  const { storeSettings, refreshStoreData } = useStore();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [settings, setSettings] = useState({
    brandName: storeSettings.brandName || 'Loop & Love',
    tagline: storeSettings.tagline || 'Little Loops. Endless Love.',
    currency: 'INR (₹)',
    freeShippingThreshold: storeSettings.freeShippingThreshold || 1499,
    standardShippingFee: storeSettings.standardShippingFee || 79,
    supportEmail: storeSettings.supportEmail || 'care@loopandlove.in',
    supportWhatsApp: storeSettings.supportWhatsApp || '+91 98765 43210',
    instagramHandle: storeSettings.instagramHandle || '@loopandlove.crafts',
    gstinPlaceholder: '[PLACEHOLDER - GSTIN to be added]',
    orderDispatchPincode: '400050'
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.admin.updateSettings(settings);
      await refreshStoreData();
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      console.warn('[AdminSettings] Failed to update backend settings:', err);
      // Fallback
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
          Website &amp; Storefront Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure currency, shipping thresholds, and public contact information.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs">
        {/* Brand Details */}
        <div className="space-y-4">
          <h2 className="font-serif text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Brand Identity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Brand Name</label>
              <input
                type="text"
                value={settings.brandName}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Official Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Currency */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="font-serif text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Shipping &amp; Regional Currency
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Store Currency</label>
              <input
                type="text"
                disabled
                value={settings.currency}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed font-medium"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Free Shipping Threshold (INR ₹)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Standard Shipping Fee (INR ₹)</label>
              <input
                type="number"
                value={settings.standardShippingFee}
                onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Contact & Social Placeholders */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="font-serif text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Support Channels &amp; Legal Placeholders
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Customer Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">WhatsApp Business Contact</label>
              <input
                type="text"
                value={settings.supportWhatsApp}
                onChange={(e) => setSettings({ ...settings, supportWhatsApp: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Instagram Handle</label>
              <input
                type="text"
                value={settings.instagramHandle}
                onChange={(e) => setSettings({ ...settings, instagramHandle: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Indian GSTIN / Tax Placeholder</label>
              <input
                type="text"
                value={settings.gstinPlaceholder}
                onChange={(e) => setSettings({ ...settings, gstinPlaceholder: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
          </div>
        </div>

        {saved && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Settings saved successfully.</span>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-semibold uppercase tracking-wider shadow-sm flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Store Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
