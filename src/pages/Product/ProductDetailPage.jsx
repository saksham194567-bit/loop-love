import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronDown,
  Info,
  Clock,
  ArrowRight,
  Share2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { getProductBySlug } from '../../data/products';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { EmptyState } from '../../components/common/EmptyState';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const { productsList } = useStore();
  const { addToCart } = useCart();

  // Look for product in store list or initialProducts
  const product = productsList.find(p => p.slug === slug);

  // Fallback demo product for interactive previewing when user navigates directly or tests the page
  const previewProduct = product || {
    id: 'LL-PREVIEW-001',
    name: 'Lilac Bloom Everlasting Crochet Charm',
    slug: slug || 'lilac-bloom-crochet-charm',
    category: 'floral-charms',
    price: 549,
    compareAtPrice: 699,
    availability: 'made_to_order',
    leadTimeDays: 4,
    description: 'A delicate bell-shaped floral charm handcrafted with soft combed cotton. Designed to gently adorn your handbag, car rear-view mirror, or study corner. Each petal is individually shaped and fastened to prevent fraying over years of daily companionship.',
    shortDescription: 'Delicate everlasting floral charm with reinforced gold-plated clip.',
    images: ['/logo.png'],
    yarnMaterial: '100% Combed Milk Cotton (Zero Pilling)',
    dimensions: 'Flower: 6.5 cm diameter | Drop length: 14 cm',
    variants: [
      { name: 'Colorway', options: ['Lilac & Cream', 'Blush Mauve', 'Pastel Lavender', 'Sage & Vanilla'] },
      { name: 'Hardware Clasp', options: ['Antique Brass', 'Polished Silver', 'Rose Gold'] }
    ],
    careInstructions: [
      'Gently spot clean with cool water and mild organic wool soap',
      'Do not machine wash, tumble dry or wring',
      'Reshape the petals gently while damp and air-dry flat in shade',
      'Store away from intense direct afternoon sunlight to maintain dye luster'
    ],
    isDevelopmentSample: !product
  };

  const [selectedVariant, setSelectedVariant] = useState(
    previewProduct.variants?.[0]?.options?.[0] || 'Default'
  );
  const [selectedHardware, setSelectedHardware] = useState(
    previewProduct.variants?.[1]?.options?.[0] || 'Default'
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [addedNotice, setAddedNotice] = useState(false);

  const handleAddToCart = () => {
    addToCart(
      previewProduct,
      quantity,
      `${selectedVariant} / ${selectedHardware}`
    );
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-12">
      
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Shop', to: '/shop' },
          { label: previewProduct.category, to: `/shop/${previewProduct.category}` },
          { label: previewProduct.name }
        ]}
      />

      {/* Dev Mode Notification if this is a sample preview */}
      {previewProduct.isDevelopmentSample && (
        <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-mauve-charcoal">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
            <span>
              <strong>Development Stage Preview:</strong> You are viewing the Product Detail layout architecture. Actual bespoke photographs and specifications will be activated at brand launch.
            </span>
          </div>
          <Link
            to="/admin/products"
            className="text-brand-800 hover:text-brand-900 font-semibold underline shrink-0"
          >
            Manage in Admin &rarr;
          </Link>
        </div>
      )}

      {/* Product Detail Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Image Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square bg-cream-50 rounded-3xl border border-brand-200 overflow-hidden shadow-subtle p-8 flex items-center justify-center relative">
            <img
              src={previewProduct.images?.[0] || '/logo.png'}
              alt={previewProduct.name}
              className="max-h-full max-w-full object-contain filter drop-shadow-md"
            />
            <span className="absolute top-4 left-4 text-xs font-semibold uppercase tracking-wider bg-white/90 px-3 py-1 rounded-full text-brand-800 border border-brand-200 shadow-sm">
              100% Handmade
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className={`aspect-square rounded-xl bg-white border ${
                  idx === 1 ? 'border-brand-600 ring-2 ring-brand-200' : 'border-brand-200'
                } p-2 flex items-center justify-center cursor-pointer hover:border-brand-400 transition-all`}
              >
                <img
                  src="/logo.png"
                  alt={`Angle ${idx}`}
                  className="w-full h-full object-contain opacity-80"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Product Info & Actions (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-brand-700 font-semibold">
              Category: {previewProduct.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-mauve-deep font-normal leading-tight">
              {previewProduct.name}
            </h1>
            <p className="text-sm text-mauve-muted leading-relaxed font-light">
              {previewProduct.shortDescription}
            </p>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pt-2 border-t border-brand-100">
            <span className="font-serif text-3xl font-semibold text-mauve-deep">
              ₹{previewProduct.price}
            </span>
            {previewProduct.compareAtPrice && (
              <span className="text-sm text-mauve-light line-through">
                ₹{previewProduct.compareAtPrice}
              </span>
            )}
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium">
              Made to order with love
            </span>
          </div>

          {/* Variant Selectors */}
          {previewProduct.variants?.map((variantGroup, idx) => (
            <div key={idx} className="space-y-2">
              <label className="text-xs font-semibold text-mauve-charcoal tracking-wide uppercase">
                {variantGroup.name}: <span className="text-brand-700 font-normal">{idx === 0 ? selectedVariant : selectedHardware}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {variantGroup.options.map((opt) => {
                  const isSelected = (idx === 0 ? selectedVariant : selectedHardware) === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => (idx === 0 ? setSelectedVariant(opt) : setSelectedHardware(opt))}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-brand-700 text-white shadow-subtle'
                          : 'bg-white text-mauve-charcoal hover:bg-brand-50 border border-brand-200'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quantity & Add to Cart */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-brand-200 rounded-full bg-white px-3 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 text-mauve-charcoal hover:text-brand-700 font-bold"
                >
                  &minus;
                </button>
                <span className="px-3 text-sm font-semibold text-mauve-deep min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 text-mauve-charcoal hover:text-brand-700 font-bold"
                >
                  &#43;
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-subtle hover:shadow-soft transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag &bull; ₹{previewProduct.price * quantity}</span>
              </button>
            </div>

            {addedNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Added to bag! Check your drawer on the right.</span>
              </div>
            )}
          </div>

          {/* Handcrafting Timeline & Assurances */}
          <div className="p-4 rounded-2xl bg-cream-50 border border-brand-200 space-y-2.5 text-xs text-mauve-muted">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600 shrink-0" />
              <span><strong>Crafting Time:</strong> Ready to dispatch in {previewProduct.leadTimeDays || 4} business days.</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-600 shrink-0" />
              <span><strong>Pan-India Shipping:</strong> Tracked courier dispatch across India.</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-brand-600 shrink-0" />
              <span><strong>Gift Ready:</strong> Arrives nestled in eco-friendly cotton wrap.</span>
            </div>
          </div>

          {/* Accordion Tabs */}
          <div className="pt-4 border-t border-brand-200 space-y-3">
            <div className="flex border-b border-brand-200 text-xs font-medium">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 px-3 border-b-2 transition-colors ${
                  activeTab === 'details'
                    ? 'border-brand-700 text-brand-900 font-semibold'
                    : 'border-transparent text-mauve-muted hover:text-mauve-charcoal'
                }`}
              >
                Story &amp; Description
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`pb-2.5 px-3 border-b-2 transition-colors ${
                  activeTab === 'care'
                    ? 'border-brand-700 text-brand-900 font-semibold'
                    : 'border-transparent text-mauve-muted hover:text-mauve-charcoal'
                }`}
              >
                Care Instructions
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2.5 px-3 border-b-2 transition-colors ${
                  activeTab === 'specs'
                    ? 'border-brand-700 text-brand-900 font-semibold'
                    : 'border-transparent text-mauve-muted hover:text-mauve-charcoal'
                }`}
              >
                Yarn &amp; Dimensions
              </button>
            </div>

            <div className="text-xs text-mauve-muted leading-relaxed pt-2">
              {activeTab === 'details' && (
                <p>{previewProduct.description}</p>
              )}

              {activeTab === 'care' && (
                <ul className="space-y-1.5 list-disc pl-4">
                  {previewProduct.careInstructions?.map((ci, i) => (
                    <li key={i}>{ci}</li>
                  ))}
                </ul>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-1">
                  <p><strong>Yarn Composition:</strong> {previewProduct.yarnMaterial}</p>
                  <p><strong>Approximate Dimensions:</strong> {previewProduct.dimensions}</p>
                  <p><strong>Country of Origin:</strong> Handcrafted in India</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Back to Shop & Inquiry */}
      <div className="p-8 rounded-3xl bg-white border border-brand-200 text-center space-y-3">
        <h3 className="font-serif text-xl font-medium text-mauve-deep">
          Looking for a custom version of this piece?
        </h3>
        <p className="text-xs text-mauve-muted max-w-md mx-auto">
          We can customize colors, initial tags, and flower types. Connect with us on WhatsApp to discuss your special design.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          <span>Ask Us on WhatsApp</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};

