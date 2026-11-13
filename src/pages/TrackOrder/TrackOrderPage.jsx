import React, { useState } from 'react';
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Heart,
  Sparkles,
  Info,
  Calendar,
  MapPin
} from 'lucide-react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import api from '../../services/api';

export const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState('');
  const [contactInput, setContactInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const sampleTrackingData = {
    id: 'LL-DEMO-101',
    customerName: 'Aarohi S.',
    orderDate: '10 Nov 2026',
    estimatedDelivery: '17 Nov 2026',
    item: 'Pastel Lilac Bell Charm & Amigurumi Bunny',
    destination: 'Mumbai, Maharashtra',
    carrier: 'Delhivery Tracked Air [Demo]',
    awbNumber: 'DLHV89472910IN',
    currentStage: 3, // 1 to 5
    timeline: [
      {
        stage: 1,
        title: 'Order Confirmed & Yarn Allocated',
        description: 'Selected 100% combed milk cotton skeins in Lavender & Cream tones.',
        date: '10 Nov 2026, 11:30 AM',
        completed: true
      },
      {
        stage: 2,
        title: 'Handcrafting by Artisan',
        description: 'Single-crochet loops stitched with micro-hook. Safety eyes fastened securely.',
        date: '11 Nov 2026, 03:45 PM',
        completed: true
      },
      {
        stage: 3,
        title: 'Artisanal Quality & Finishing Inspection',
        description: 'Tension checked, thread tails woven and steamed for lasting durability.',
        date: '12 Nov 2026, 02:15 PM',
        completed: true
      },
      {
        stage: 4,
        title: 'Packed With Love & Handed to Courier',
        description: 'Placed into cotton dust bag with personalized handwritten care card.',
        date: 'In Progress (Expected 13 Nov)',
        completed: false
      },
      {
        stage: 5,
        title: 'Delivered to Doorstep',
        description: 'Package delivered safely to destination address in Mumbai.',
        date: 'Estimated 16–17 Nov 2026',
        completed: false
      }
    ]
  };

  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!orderId.trim()) {
      setErrorMsg('Please enter your Loop & Love Order ID');
      return;
    }

    setLoading(true);
    try {
      const res = await api.orders.track(orderId.trim());
      if (res.success && res.order) {
        setSearchedOrder(res.order);
      } else {
        setErrorMsg(res.error || 'No tracking history found for this Order ID.');
      }
    } catch (err) {
      // If order not found in database, check fallback simulation for LL-DEMO-101
      if (orderId.trim().toUpperCase() === 'LL-DEMO-101') {
        setSearchedOrder({
          ...sampleTrackingData,
          id: orderId.trim().toUpperCase(),
        });
      } else {
        setErrorMsg(err.message || 'No tracking record found for this Order ID in our atelier.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-10">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Track Your Order' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-semibold tracking-widest uppercase text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Real-Time Craft Journey
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-mauve-deep font-normal">
          Track Your Handmade Parcel
        </h1>
        <p className="text-xs sm:text-sm text-mauve-muted font-light leading-relaxed">
          Follow the journey of your piece, from the first twist of the yarn hook to final delivery at your doorstep.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-brand-200 p-6 sm:p-10 shadow-subtle space-y-6">
        <div className="p-3.5 rounded-2xl bg-cream-50 border border-brand-100 flex items-start gap-2.5 text-xs text-mauve-charcoal">
          <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <span>
            <strong>Testing Note:</strong> Enter any Order ID (or try <strong>LL-DEMO-101</strong>) to inspect the handcrafted milestone timeline.
          </span>
        </div>

        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-mauve-charcoal mb-1">
                Order ID *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. LL-DEMO-101"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500 uppercase font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-mauve-charcoal mb-1">
                Phone Number or Email
              </label>
              <input
                type="text"
                placeholder="Linked mobile number / email"
                value={contactInput}
                onChange={(e) => setContactInput(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-subtle hover:shadow-soft transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Track Order Progress</span>
          </button>
        </form>
      </div>

      {/* Tracking Results Card */}
      {searchedOrder && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-brand-200 p-6 sm:p-10 shadow-subtle space-y-8 animate-in fade-in">
          
          {/* Header Overview */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-100 pb-5">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
                Order ID: {searchedOrder.id}
              </span>
              <h2 className="font-serif text-2xl font-medium text-mauve-deep mt-0.5">
                {searchedOrder.item}
              </h2>
              <p className="text-xs text-mauve-muted mt-1">
                Ordered on {searchedOrder.orderDate} &bull; Delivery to {searchedOrder.destination}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Stage 3: Quality Inspected
              </span>
              <p className="text-xs text-mauve-muted mt-1.5">
                Est. Delivery: <strong className="text-mauve-charcoal">{searchedOrder.estimatedDelivery}</strong>
              </p>
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="space-y-6 relative pl-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-brand-200">
            {searchedOrder.timeline.map((step) => (
              <div key={step.stage} className="relative flex items-start gap-4">
                <div
                  className={`absolute -left-6 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${
                    step.completed
                      ? 'bg-brand-700 border-brand-700 text-white'
                      : 'bg-white border-brand-300 text-brand-300'
                  }`}
                >
                  {step.completed ? '✓' : step.stage}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <h3 className={`text-sm font-semibold ${step.completed ? 'text-mauve-deep' : 'text-mauve-muted'}`}>
                      {step.title}
                    </h3>
                    <span className="text-[11px] text-mauve-light font-mono">
                      {step.date}
                    </span>
                  </div>
                  <p className="text-xs text-mauve-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Courier Details */}
          <div className="pt-4 border-t border-brand-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-mauve-muted">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Courier: <strong>{searchedOrder.carrier}</strong> | AWB: <code className="font-mono text-mauve-charcoal">{searchedOrder.awbNumber}</code></span>
            </div>

            <span className="text-[11px] text-brand-700 italic">
              Tracking data updates every 6 hours
            </span>
          </div>

        </div>
      )}

    </div>
  );
};

