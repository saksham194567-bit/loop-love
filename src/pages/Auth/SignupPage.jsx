import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await register({ name, email, phone, password });
      if (res.success) {
        navigate('/account');
      } else {
        setError(res.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-brand-200 p-8 sm:p-10 shadow-subtle space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-brand-300 shadow-subtle mx-auto mb-3">
            <img src="/logo.png" alt="Loop & Love" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-serif text-3xl font-normal text-mauve-deep">
            Create an Account
          </h1>
          <p className="text-xs text-mauve-muted">
            Join the Loop &amp; Love craft family to track orders and save your favorites.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignupSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-mauve-charcoal mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-brand-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Aarohi Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500 text-mauve-charcoal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-mauve-charcoal mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-brand-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500 text-mauve-charcoal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-mauve-charcoal mb-1">
              WhatsApp / Mobile Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-brand-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500 text-mauve-charcoal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-mauve-charcoal mb-1">
              Create Password (min. 8 characters) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-brand-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500 text-mauve-charcoal"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-subtle hover:shadow-soft transition-all disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-brand-100 text-center text-xs text-mauve-muted">
          <span>Already have an account? </span>
          <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-900">
            Sign In &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
};
