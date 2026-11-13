import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { categories } from '../../data/categories';

export const AdminAddProductPage = () => {
  const { addProductToStore } = useStore();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    id: `LL-${Date.now().toString().slice(-4)}`,
    name: '',
    slug: '',
    category: 'keychains',
    price: '',
    compareAtPrice: '',
    description: '',
    shortDescription: '',
    leadTimeDays: 4,
    dimensions: 'Approx. 8cm x 5cm',
    yarnMaterial: '100% Combed Milk Cotton',
    stockQuantity: 5,
    availability: 'made_to_order',
    isFeatured: false,
    images: ['/logo.png']
  });

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setForm(prev => ({ ...prev, name, slug }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;

    setSubmitting(true);
    setError('');

    const newProd = {
      ...form,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      stockQuantity: Number(form.stockQuantity),
      createdAt: new Date().toISOString()
    };

    try {
      const res = await addProductToStore(newProd);
      if (res && res.error) {
        setError(res.error);
        setSubmitting(false);
        return;
      }
      navigate('/admin/products');
    } catch (err) {
      console.error('[AdminAddProduct] Error:', err);
      navigate('/admin/products');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">
              Add New Handmade Crochet Piece
            </h1>
            <p className="text-xs text-slate-500">
              Create a new listing in your store catalogue.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm text-xs">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="font-serif text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            1. Basic Listing Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lavender Daisy Keychain"
                value={form.name}
                onChange={handleNameChange}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                URL Slug (Auto-generated) *
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Craft Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Product SKU / Identifier
              </label>
              <input
                type="text"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="font-serif text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            2. Pricing &amp; Craft Timeline
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Selling Price (INR ₹) *
              </label>
              <input
                type="number"
                required
                placeholder="499"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Compare-at Price (Optional)
              </label>
              <input
                type="number"
                placeholder="649"
                value={form.compareAtPrice}
                onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Handcrafting Days (Lead Time)
              </label>
              <input
                type="number"
                value={form.leadTimeDays}
                onChange={(e) => setForm({ ...form, leadTimeDays: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Description & Specs */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="font-serif text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            3. Story, Fiber &amp; Dimensions
          </h2>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Short Description (Card summary)
            </label>
            <input
              type="text"
              placeholder="e.g. Delicate daisy charm hand-stitched with reinforced brass clasp."
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Full Craft Story &amp; Details
            </label>
            <textarea
              rows={4}
              placeholder="Detail the hours of work, soft feel, and inspiration behind this piece..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Yarn Material
              </label>
              <input
                type="text"
                value={form.yarnMaterial}
                onChange={(e) => setForm({ ...form, yarnMaterial: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Dimensions
              </label>
              <input
                type="text"
                value={form.dimensions}
                onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-semibold uppercase tracking-wider shadow-sm flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Publishing...' : 'Publish to Storefront'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
