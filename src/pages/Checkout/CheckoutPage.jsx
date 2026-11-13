import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Building,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import api from '../../services/api';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi NCR', 'Jammu & Kashmir', 'Chandigarh', 'Ladakh', 'Puducherry'
];

export const CheckoutPage = () => {
  const { cartItems, subtotal, shippingFee, total } = useCart();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    specialInstructions: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrderClick = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (cartItems.length === 0) {
      setErrorMsg('Your shopping bag is empty. Please select a handcrafted piece first.');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingName: `${formData.firstName} ${formData.lastName}`.trim(),
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        paymentMethod: paymentMethod,
        notes: formData.specialInstructions,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedVariant: item.selectedVariant || null
        }))
      };

      const res = await api.checkout.createOrder(orderPayload);
      if (res.success && res.order) {
        setConfirmedOrder(res.order);
        setShowOrderModal(true);
      } else {
        setErrorMsg(res.error || 'Unable to place order. Please check your details.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error communicating with checkout server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-8">
      
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Bag', to: '/cart' },
          { label: 'Checkout' }
        ]}
      />

      {/* Development Notice Banner */}
      <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
        <div className="text-xs text-mauve-charcoal leading-relaxed">
          <strong className="text-brand-900">Checkout Interface Preview:</strong> This checkout flow demonstrates our future pan-India delivery input, address forms, and payment method selector. Payment processing and real order submission remain completely inactive until the official business launch.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Form Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          <form onSubmit={handlePlaceOrderClick} className="space-y-8">
            
            {/* 1. Contact Information */}
            <div className="bg-white rounded-3xl border border-brand-200 p-6 sm:p-8 space-y-4 shadow-subtle">
              <div className="flex items-center justify-between border-b border-brand-100 pb-3">
                <h2 className="font-serif text-xl font-medium text-mauve-deep flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 text-xs flex items-center justify-center font-sans font-bold">1</span>
                  <span>Contact Information</span>
                </h2>
                <span className="text-[11px] text-mauve-muted">For order confirmation &amp; tracking updates</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-mauve-charcoal mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="yourname@domain.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-mauve-charcoal mb-1">
                    WhatsApp / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address in India */}
            <div className="bg-white rounded-3xl border border-brand-200 p-6 sm:p-8 space-y-4 shadow-subtle">
              <div className="flex items-center justify-between border-b border-brand-100 pb-3">
                <h2 className="font-serif text-xl font-medium text-mauve-deep flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 text-xs flex items-center justify-center font-sans font-bold">2</span>
                  <span>Pan-India Delivery Address</span>
                </h2>
                <span className="text-[11px] text-emerald-700 font-medium">Safe Courier Transit</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-mauve-charcoal mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="e.g. Priya"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-mauve-charcoal mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    placeholder="e.g. Sharma"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-mauve-charcoal mb-1">
                    Street Address, Flat / House No. *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    required
                    placeholder="House/Apartment number, street name, area"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-mauve-charcoal mb-1">
                    Landmark / Apartment Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    placeholder="Near prominent landmark or society gate"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-mauve-charcoal mb-1">
                    City / District *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. Mumbai, Bengaluru, Jaipur"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-mauve-charcoal mb-1">
                    State / Union Territory *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-mauve-charcoal mb-1">
                    PIN Code (6 digits) *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    placeholder="e.g. 400050"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-mauve-charcoal mb-1">
                    Delivery Note (Optional)
                  </label>
                  <input
                    type="text"
                    name="specialInstructions"
                    placeholder="Gift note, bell instruction, etc."
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method Selection Interface */}
            <div className="bg-white rounded-3xl border border-brand-200 p-6 sm:p-8 space-y-4 shadow-subtle">
              <div className="flex items-center justify-between border-b border-brand-100 pb-3">
                <h2 className="font-serif text-xl font-medium text-mauve-deep flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 text-xs flex items-center justify-center font-sans font-bold">3</span>
                  <span>Payment Method Interface</span>
                </h2>
                <span className="text-[11px] text-mauve-muted">Integration Pending Launch</span>
              </div>

              <div className="space-y-3">
                {/* UPI Option */}
                <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-brand-600 bg-brand-50/50 ring-1 ring-brand-300'
                    : 'border-brand-200 bg-white hover:bg-cream-50'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="mt-1 text-brand-700 focus:ring-brand-500"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-mauve-charcoal">Instant UPI (GPay / PhonePe / Paytm / BHIM)</span>
                      <QrCode className="w-4 h-4 text-brand-600" />
                    </div>
                    <p className="text-mauve-muted mt-0.5">
                      Zero-fee instant payment via your favorite UPI app.
                    </p>
                  </div>
                </label>

                {/* Cards Option */}
                <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-brand-600 bg-brand-50/50 ring-1 ring-brand-300'
                    : 'border-brand-200 bg-white hover:bg-cream-50'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-1 text-brand-700 focus:ring-brand-500"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-mauve-charcoal">Credit / Debit Cards (Visa, Mastercard, RuPay)</span>
                      <CreditCard className="w-4 h-4 text-brand-600" />
                    </div>
                    <p className="text-mauve-muted mt-0.5">
                      Processed securely via 256-bit encrypted Indian payment gateway.
                    </p>
                  </div>
                </label>

                {/* Netbanking Option */}
                <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'border-brand-600 bg-brand-50/50 ring-1 ring-brand-300'
                    : 'border-brand-200 bg-white hover:bg-cream-50'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="netbanking"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                    className="mt-1 text-brand-700 focus:ring-brand-500"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-mauve-charcoal">Net Banking (50+ Indian Banks)</span>
                      <Building className="w-4 h-4 text-brand-600" />
                    </div>
                    <p className="text-mauve-muted mt-0.5">
                      HDFC, ICICI, SBI, Axis, Kotak and all major banks supported.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <div className="pt-2 space-y-3">
              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-subtle hover:shadow-soft transition-all disabled:opacity-60"
              >
                <Lock className="w-4 h-4" />
                <span>{submitting ? 'Creating Order in Atelier...' : `Place Order • ₹${total}`}</span>
              </button>
              <p className="text-center text-[11px] text-mauve-muted">
                Handcrafted in India &bull; Razorpay &amp; UPI Test Mode Active
              </p>
            </div>

          </form>

        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-brand-200 p-6 sm:p-8 space-y-6 shadow-subtle sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-brand-100">
            <h3 className="font-serif text-xl font-medium text-mauve-deep">
              Order Summary
            </h3>
            <span className="text-xs text-brand-700 font-semibold">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Cart Items list in summary */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {cartItems.length === 0 ? (
              <p className="text-xs text-mauve-muted italic">No items currently in bag.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.cartKey} className="flex gap-3 text-xs items-center">
                  <div className="w-12 h-12 rounded-xl bg-cream-100 border border-brand-100 p-1 shrink-0 flex items-center justify-center">
                    <img src={item.images?.[0] || '/logo.png'} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-mauve-charcoal truncate">{item.name}</p>
                    <p className="text-[11px] text-mauve-muted">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-mauve-deep">
                    ₹{(Number(item.price) || 0) * item.quantity}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="space-y-2 text-xs text-mauve-muted pt-3 border-t border-brand-100">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-medium text-mauve-charcoal">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Pan-India Delivery</span>
              <span className="font-medium text-mauve-charcoal">
                {shippingFee === 0 ? <span className="text-emerald-700 font-semibold">FREE</span> : `₹${shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Artisan Packaging &amp; Care Note</span>
              <span className="text-emerald-700 font-semibold">Complimentary</span>
            </div>
            <div className="pt-3 border-t border-brand-100 flex justify-between items-baseline text-sm font-serif font-semibold text-mauve-deep">
              <span>Total Payable</span>
              <span className="text-2xl text-brand-900">₹{total}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-brand-100 space-y-2 text-[11px] text-mauve-muted">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span>Standard delivery within 5–9 days across India</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Safe packaging guarantee against transit damage</span>
            </div>
          </div>
        </div>

      </div>

      {/* Order Confirmation Modal */}
      {showOrderModal && confirmedOrder && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-mauve-deep/40 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowOrderModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-brand-200 shadow-elevated text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-700">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-2xl font-medium text-mauve-deep">
              Order Confirmed &bull; Test Mode
            </h3>

            <p className="text-xs sm:text-sm text-mauve-muted leading-relaxed">
              Thank you! Your handmade order has been logged into our PostgreSQL database with Order ID:
            </p>

            <div className="p-3.5 rounded-2xl bg-cream-50 border border-brand-200 text-sm font-mono font-bold text-brand-900">
              {confirmedOrder.orderNumber}
            </div>

            <p className="text-[11px] text-mauve-muted leading-relaxed">
              Payment mode: <strong className="uppercase">{confirmedOrder.paymentMethod}</strong> (Test Mode). No financial charges were deducted. You can monitor its craft timeline anytime using our Order Tracking tool.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                to={`/track-order`}
                className="w-full py-3 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors inline-block"
              >
                Track This Order
              </Link>
              <button
                onClick={() => setShowOrderModal(false)}
                className="w-full py-2.5 rounded-full border border-brand-200 text-mauve-charcoal text-xs font-medium hover:bg-cream-50"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

