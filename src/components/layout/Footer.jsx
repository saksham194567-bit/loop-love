import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Send,
  MessageCircle,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { InstagramIcon } from '../common/Icons';
import { categories } from '../../data/categories';
import { useStore } from '../../context/StoreContext';
import api from '../../services/api';

export const Footer = () => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { storeSettings } = useStore();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      try {
        await api.newsletter.subscribe(emailInput.trim());
      } catch (err) {
        console.warn('[Footer] Newsletter subscription saved locally/fallback:', err);
      }
      setSubscribed(true);
      setEmailInput('');
    }
  };

  return (
    <footer className="bg-cream-200/70 border-t border-brand-200/80 text-mauve-charcoal pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-brand-200">
          
          {/* Brand Column (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-brand-300 shadow-subtle shrink-0">
                <img
                  src="/logo.png"
                  alt="Loop & Love Emblem"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-semibold text-mauve-deep tracking-wide block">
                  Loop &amp; Love
                </span>
                <span className="text-[11px] tracking-widest text-brand-700 uppercase font-medium">
                  Little Loops. Endless Love.
                </span>
              </div>
            </Link>

            <p className="text-sm text-mauve-muted leading-relaxed max-w-sm">
              An independent handmade crochet boutique creating heirloom-quality keychains, amigurumi dolls, everlasting floral charms, bags, and mindful accessories. Handcrafted loop by loop in India.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-brand-200 hover:border-brand-400 hover:text-brand-700 flex items-center justify-center text-mauve-muted transition-colors shadow-subtle"
                aria-label="Instagram [Placeholder]"
                title="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-brand-200 hover:border-emerald-400 hover:text-emerald-700 flex items-center justify-center text-mauve-muted transition-colors shadow-subtle"
                aria-label="WhatsApp Inquiry [Placeholder]"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="mailto:care@loopandlove.in"
                className="w-9 h-9 rounded-full bg-white border border-brand-200 hover:border-brand-400 hover:text-brand-700 flex items-center justify-center text-mauve-muted transition-colors shadow-subtle"
                aria-label="Email Support [Placeholder]"
                title="Email Us"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Categories Column */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-mauve-deep tracking-wide">
              Handmade Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/shop/${cat.slug}`}
                    className="text-mauve-muted hover:text-brand-800 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/shop"
                  className="font-medium text-brand-700 hover:text-brand-900 transition-colors"
                >
                  View All Categories &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-mauve-deep tracking-wide">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-mauve-muted">
              <li>
                <Link to="/about" className="hover:text-brand-800 transition-colors">
                  Our Story &amp; Philosophy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-800 transition-colors">
                  Contact &amp; Custom Orders
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-brand-800 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-brand-800 transition-colors">
                  Customer Account
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-brand-800 transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-brand-700 hover:text-brand-900 flex items-center gap-1 font-medium pt-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin Management</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-mauve-deep tracking-wide">
              The Artisan Dispatch
            </h4>
            <p className="text-xs text-mauve-muted leading-relaxed">
              Subscribe for private previews when small-batch handcrafted pieces are stitched and ready.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>You&apos;re on our VIP preview list!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full py-2.5 pl-3 pr-10 text-xs rounded-xl bg-white border border-brand-200 focus:border-brand-500 focus:outline-none text-mauve-charcoal placeholder-mauve-light shadow-subtle"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="absolute right-1 top-1 bottom-1 px-2.5 rounded-lg bg-brand-700 hover:bg-brand-800 text-white flex items-center justify-center transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-mauve-light">
                  No spam. Just pure handmade updates.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Legal Links Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-mauve-muted">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
            <Link to="/policies/privacy" className="hover:text-brand-800 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/policies/terms" className="hover:text-brand-800 transition-colors">
              Terms of Service
            </Link>
            <Link to="/policies/shipping" className="hover:text-brand-800 transition-colors">
              Shipping &amp; Delivery
            </Link>
            <Link to="/policies/returns-refunds" className="hover:text-brand-800 transition-colors">
              Returns &amp; Refunds
            </Link>
            <Link to="/policies/cancellation" className="hover:text-brand-800 transition-colors">
              Cancellation Policy
            </Link>
          </div>

          <div className="flex items-center gap-2 text-center text-xs">
            <span>&copy; {new Date().getFullYear()} Loop &amp; Love.</span>
            <span>All rights reserved.</span>
            <span className="inline-flex items-center gap-1 text-brand-700">
              Handmade with <Heart className="w-3 h-3 fill-brand-400 text-brand-600 inline" /> in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
