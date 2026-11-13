import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const AccountProfile = () => {
  const { currentUser, refreshProfile } = useAuth();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await api.auth.updateProfile({ name, phone });
      if (res && res.success) {
        await refreshProfile();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      setError(err.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-brand-100 pb-4">
        <h2 className="font-serif text-2xl font-medium text-mauve-deep">
          Profile &amp; Account Settings
        </h2>
        <p className="text-xs text-mauve-muted">
          Update your contact details and notification preferences.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-xs font-medium text-mauve-charcoal mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-brand-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-mauve-charcoal mb-1">
            Email Address (Primary Account)
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-brand-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              disabled
              value={email}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-stone-100 border border-brand-200 text-stone-500 cursor-not-allowed"
            />
          </div>
          <span className="text-[10px] text-mauve-muted mt-0.5 block">
            Email address is tied to your account identity.
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium text-mauve-charcoal mb-1">
            Phone / WhatsApp Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-brand-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {saved && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile settings updated successfully!</span>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-subtle"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </form>
    </div>
  );
};
