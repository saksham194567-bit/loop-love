import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    freeShippingThreshold,
    shippingFee,
    total,
    addSamplePreviewItem
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingDifference = freeShippingThreshold - subtotal;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag Drawer"
      className="fixed inset-0 z-50 overflow-hidden bg-mauve-deep/40 backdrop-blur-sm transition-opacity"
      onClick={() => setIsCartOpen(false)}
    >
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-md bg-cream-50 shadow-elevated flex flex-col border-l border-brand-200 animate-in slide-in-from-right duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-brand-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-mauve-deep">
                  Your Shopping Bag
                </h3>
                <p className="text-[11px] text-mauve-muted">
                  {cartItems.length} {cartItems.length === 1 ? 'creation' : 'creations'} selected
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-cream-200 text-mauve-muted hover:text-mauve-charcoal transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cartItems.length > 0 && (
            <div className="bg-brand-50/70 p-3.5 border-b border-brand-100">
              <div className="flex justify-between text-xs text-mauve-charcoal mb-1.5 font-medium">
                {freeShippingDifference > 0 ? (
                  <span>Add <strong>₹{freeShippingDifference}</strong> more for Free Shipping across India</span>
                ) : (
                  <span className="text-emerald-800 font-semibold flex items-center gap-1">
                    ✨ You have qualified for Free Shipping across India!
                  </span>
                )}
                <span className="text-brand-700">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-brand-200/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Body / Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-brand-100/60 border border-brand-200 flex items-center justify-center text-brand-500 mb-4">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h4 className="font-serif text-xl text-mauve-deep mb-2">
                  Your bag is empty
                </h4>
                <p className="text-xs text-mauve-muted max-w-xs mb-6 leading-relaxed">
                  Every loop is made by hand with thoughtful care. Explore our categories to discover our upcoming handmade crochet pieces.
                </p>
                <div className="space-y-2.5 w-full max-w-xs">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/shop');
                    }}
                    className="w-full py-2.5 px-4 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-medium tracking-wide uppercase transition-colors"
                  >
                    Explore Handcrafted Categories
                  </button>
                  <button
                    onClick={addSamplePreviewItem}
                    className="w-full py-2 px-4 rounded-full bg-white hover:bg-brand-50 text-brand-700 border border-brand-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Preview Bag with Sample Piece
                  </button>
                </div>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.cartKey}
                  className="flex gap-4 p-3.5 bg-white rounded-xl border border-brand-100 shadow-sm transition-all"
                >
                  <div className="w-20 h-20 rounded-lg bg-cream-100 border border-brand-100 overflow-hidden shrink-0 flex items-center justify-center p-1">
                    <img
                      src={item.images?.[0] || '/logo.png'}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium text-mauve-charcoal leading-tight line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartKey)}
                          className="text-mauve-light hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.selectedVariant && (
                        <p className="text-[11px] text-mauve-muted mt-0.5">
                          Variant: {item.selectedVariant}
                        </p>
                      )}

                      {item.isDevelopmentSample && (
                        <span className="inline-block text-[10px] bg-brand-100 text-brand-800 px-1.5 py-0.5 rounded mt-1 font-medium">
                          Preview Sample
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-brand-50">
                      <div className="flex items-center border border-brand-200 rounded-lg bg-cream-50 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                          className="p-1 hover:bg-brand-100 text-mauve-charcoal transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-mauve-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                          className="p-1 hover:bg-brand-100 text-mauve-charcoal transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-brand-800">
                        ₹{(Number(item.price) || 0) * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-brand-200 bg-white space-y-3.5">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-mauve-muted">
                  <span>Subtotal</span>
                  <span className="text-mauve-charcoal font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-mauve-muted">
                  <span>Estimated Shipping [India]</span>
                  <span className="text-mauve-charcoal font-medium">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-semibold">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-serif font-semibold text-mauve-deep pt-2 border-t border-brand-100">
                  <span>Total</span>
                  <span className="text-base text-brand-800">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-3 px-4 rounded-full bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-subtle hover:shadow-soft transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-mauve-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pan-India Delivery • Handcrafted with love</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

