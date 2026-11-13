import React from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AccountOverview = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-medium text-mauve-deep mb-1">
          Welcome to Your Loop &amp; Love Studio Space
        </h2>
        <p className="text-xs text-mauve-muted leading-relaxed">
          From here you can review your handcrafted orders, track live parcels across India, and update your delivery details.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-cream-50 border border-brand-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-mauve-muted uppercase tracking-wider">Total Orders</span>
            <Package className="w-4 h-4 text-brand-600" />
          </div>
          <p className="font-serif text-2xl font-semibold text-mauve-deep">0</p>
          <Link to="/account/orders" className="text-[11px] font-medium text-brand-700 hover:text-brand-900 block">
            View Order History &rarr;
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-cream-50 border border-brand-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-mauve-muted uppercase tracking-wider">Saved Addresses</span>
            <MapPin className="w-4 h-4 text-brand-600" />
          </div>
          <p className="font-serif text-2xl font-semibold text-mauve-deep">1</p>
          <Link to="/account/addresses" className="text-[11px] font-medium text-brand-700 hover:text-brand-900 block">
            Manage Address &rarr;
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-cream-50 border border-brand-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-mauve-muted uppercase tracking-wider">Custom Requests</span>
            <Sparkles className="w-4 h-4 text-brand-600" />
          </div>
          <p className="font-serif text-2xl font-semibold text-mauve-deep">0</p>
          <Link to="/contact" className="text-[11px] font-medium text-brand-700 hover:text-brand-900 block">
            Commission a Piece &rarr;
          </Link>
        </div>
      </div>

      {/* Default Address Preview */}
      <div className="p-5 rounded-2xl border border-brand-200 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-medium text-mauve-deep">
            Primary Delivery Address
          </h3>
          <Link to="/account/addresses" className="text-xs text-brand-700 hover:text-brand-900 font-medium">
            Edit
          </Link>
        </div>

        <div className="text-xs text-mauve-charcoal leading-relaxed">
          <p className="font-semibold">{currentUser?.defaultAddress?.fullName || 'Aarohi Sharma'}</p>
          <p>{currentUser?.defaultAddress?.addressLine1 || 'Flat 402, Lavender Blossom Residences'}</p>
          <p>{currentUser?.defaultAddress?.addressLine2 || 'Bandra West'}</p>
          <p>{currentUser?.defaultAddress?.city || 'Mumbai'}, {currentUser?.defaultAddress?.state || 'Maharashtra'} - {currentUser?.defaultAddress?.pincode || '400050'}</p>
          <p className="text-mauve-muted mt-1">Phone: {currentUser?.phone || '+91 98765 43210'}</p>
        </div>
      </div>

      {/* Quick link to track order */}
      <div className="p-5 rounded-2xl bg-brand-50/60 border border-brand-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-serif text-base font-semibold text-mauve-deep">
            Have an active order number?
          </h4>
          <p className="text-xs text-mauve-muted">
            Track real-time craft stages from yarn allocation to courier dispatch.
          </p>
        </div>
        <Link
          to="/track-order"
          className="px-5 py-2.5 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors"
        >
          Track My Order
        </Link>
      </div>

    </div>
  );
};

