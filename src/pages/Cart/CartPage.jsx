import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';

export const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    freeShippingThreshold,
    shippingFee,
    total,
    addSamplePreviewItem
  } = useCart();

  const navigate = useNavigate();

  const freeShippingDifference = freeShippingThreshold - subtotal;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-8">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Shopping Bag' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-serif text-mauve-deep font-normal">
          Your Shopping Bag
        </h1>
        <p className="text-xs sm:text-sm text-mauve-muted">
          Review your handcrafted selections before proceeding to checkout.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-brand-200 p-8 sm:p-14 text-center space-y-6 shadow-subtle">
          <div className="w-16 h-16 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 mx-auto">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-medium text-mauve-deep">
              Your bag is currently empty
            </h2>
            <p className="text-xs sm:text-sm text-mauve-muted max-w-md mx-auto leading-relaxed">
              No handmade pieces added yet. Explore our seven craft categories or click below to preview the bag with a sample handmade piece.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-subtle"
            >
              Explore Handcrafted Categories
            </Link>

            <button
              onClick={addSamplePreviewItem}
              className="w-full sm:w-auto px-5 py-3 rounded-full bg-cream-50 hover:bg-brand-50 text-brand-800 border border-brand-200 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-brand-500" />
              Preview Bag with Sample Piece
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Free shipping bar */}
            <div className="bg-brand-50 rounded-2xl p-4 border border-brand-200/80">
              <div className="flex justify-between text-xs text-mauve-charcoal mb-2 font-medium">
                {freeShippingDifference > 0 ? (
                  <span>
                    Add <strong>₹{freeShippingDifference}</strong> more of handmade crafts to qualify for Free Shipping in India
                  </span>
                ) : (
                  <span className="text-emerald-800 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Congratulations! Your order qualifies for Free Standard Delivery in India.
                  </span>
                )}
                <span className="text-brand-700">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-brand-200/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Table of items */}
            <div className="bg-white rounded-3xl border border-brand-200 overflow-hidden shadow-subtle divide-y divide-brand-100">
              {cartItems.map((item) => (
                <div key={item.cartKey} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  <div className="w-20 h-20 rounded-2xl bg-cream-100 border border-brand-200 overflow-hidden shrink-0 flex items-center justify-center p-2">
                    <img
                      src={item.images?.[0] || '/logo.png'}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif text-lg font-medium text-mauve-deep">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.cartKey)}
                        className="text-mauve-light hover:text-rose-600 p-1 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.selectedVariant && (
                      <p className="text-xs text-mauve-muted">
                        Selection: <span className="text-mauve-charcoal">{item.selectedVariant}</span>
                      </p>
                    )}

                    {item.isDevelopmentSample && (
                      <span className="inline-block text-[10px] bg-brand-100 text-brand-800 px-2 py-0.5 rounded font-medium">
                        Preview Demo Item
                      </span>
                    )}

                    <p className="text-xs text-brand-700 font-medium pt-1">
                      ₹{item.price} each
                    </p>
                  </div>

                  {/* Quantity & Subtotal */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-0 border-brand-50">
                    <div className="flex items-center border border-brand-200 rounded-full bg-cream-50 px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                        className="p-1 hover:text-brand-700 text-mauve-charcoal"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-mauve-charcoal">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                        className="p-1 hover:text-brand-700 text-mauve-charcoal"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-serif text-lg font-semibold text-mauve-deep">
                      ₹{(Number(item.price) || 0) * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions: Continue shopping & Clear */}
            <div className="flex items-center justify-between pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-700 hover:text-brand-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Browsing Collections</span>
              </Link>

              <button
                onClick={clearCart}
                className="text-xs text-mauve-muted hover:text-rose-600 transition-colors"
              >
                Clear Entire Bag
              </button>
            </div>
          </div>

          {/* Order Summary (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-brand-200 p-6 sm:p-8 space-y-6 shadow-subtle">
            <h3 className="font-serif text-xl font-medium text-mauve-deep pb-3 border-b border-brand-100">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs text-mauve-muted">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-medium text-mauve-charcoal">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping [India]</span>
                <span className="font-medium text-mauve-charcoal">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Handmade Gift Packaging</span>
                <span className="text-emerald-700 font-semibold">Included</span>
              </div>
              <div className="pt-3 border-t border-brand-100 flex justify-between items-baseline text-sm font-serif font-semibold text-mauve-deep">
                <span>Total Amount</span>
                <span className="text-2xl text-brand-900">₹{total}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 px-6 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-subtle hover:shadow-soft transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 border-t border-brand-100 space-y-2 text-[11px] text-mauve-muted">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span>Pan-India Tracked Courier Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Safe &amp; Secure Checkout Protocol</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

