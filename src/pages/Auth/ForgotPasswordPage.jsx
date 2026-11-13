import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-brand-200 p-8 sm:p-10 shadow-subtle space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl font-normal text-mauve-deep">
            Reset Password
          </h1>
          <p className="text-xs text-mauve-muted">
            Enter the email associated with your account and we will send a password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs text-mauve-charcoal leading-relaxed">
              If an account matches <strong>{email}</strong>, a reset link has been dispatched [Preview Simulation].
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-brand-700 hover:text-brand-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-mauve-charcoal mb-1">
                Account Email
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

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-subtle hover:shadow-soft transition-all"
            >
              <span>Send Reset Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-mauve-muted hover:text-brand-700"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

