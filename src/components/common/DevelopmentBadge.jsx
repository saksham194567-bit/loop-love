import React, { useState } from 'react';
import { Info, Sparkles, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const DevelopmentBadge = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { cartItems, addSamplePreviewItem } = useCart();

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Store Development Mode Notice"
      className="bg-brand-900 text-cream-100 text-xs py-2 px-4 border-b border-brand-800 transition-all duration-300 relative z-40"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-700 text-brand-200 text-[10px] font-semibold tracking-wider uppercase">
            DEV
          </span>
          <span className="font-light text-brand-200">
            <strong className="font-medium text-white">Store Construction Stage:</strong> Catalog structure, routes & layouts are active. Orders, payments & real inventory remain inactive until brand launch.
          </span>
        </div>

        <div className="flex items-center gap-3">
          {cartItems.length === 0 && (
            <button
              onClick={addSamplePreviewItem}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-800 hover:bg-brand-700 text-brand-100 transition-colors text-[11px] font-medium"
              title="Add a sample handmade piece to inspect cart & checkout flow"
            >
              <Sparkles className="w-3 h-3 text-brand-300" />
              Preview Cart Flow
            </button>
          )}

          <button
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss development notice"
            className="text-brand-300 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

