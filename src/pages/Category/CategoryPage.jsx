import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, Heart, ArrowRight, ShieldCheck, Check, Feather } from 'lucide-react';
import { getCategoryBySlug, categories } from '../../data/categories';
import { useStore } from '../../context/StoreContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { EmptyState } from '../../components/common/EmptyState';

export const CategoryPage = () => {
  const { categorySlug } = useParams();
  const { productsList } = useStore();

  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl text-mauve-deep">Category Not Found</h2>
        <p className="text-mauve-muted text-sm">
          The requested craft category does not exist in our atelier.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-700 text-white text-xs uppercase tracking-wider font-medium"
        >
          View All Categories
        </Link>
      </div>
    );
  }

  const categoryProducts = productsList.filter(p => p.category === category.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 space-y-10">
      
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: 'Shop', to: '/shop' },
          { label: category.name }
        ]}
      />

      {/* Category Hero / Header */}
      <div className="rounded-3xl bg-subtle-lilac border border-brand-200/80 p-8 sm:p-12 space-y-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-brand-200 text-xs font-medium text-brand-800">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>Handmade Crochet Line</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-mauve-deep font-normal">
          {category.name}
        </h1>

        <p className="text-base sm:text-lg text-brand-700 font-serif italic max-w-xl mx-auto">
          &ldquo;{category.tagline}&rdquo;
        </p>

        <p className="text-xs sm:text-sm text-mauve-muted max-w-2xl mx-auto leading-relaxed font-light">
          {category.description}
        </p>

        {/* Stitch & Craft Spec Pill */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
          {category.highlights?.map((hl, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cream-50 text-mauve-charcoal border border-brand-200 text-xs"
            >
              <Check className="w-3 h-3 text-emerald-600" />
              <span>{hl}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Craftsmanship Note Banner */}
      <div className="p-4 rounded-2xl bg-white border border-brand-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-mauve-muted">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <Feather className="w-4 h-4 text-brand-600 shrink-0" />
          <span><strong>Stitch Specification:</strong> {category.stitchDetail}</span>
        </div>
        <Link
          to="/contact"
          className="text-brand-700 hover:text-brand-900 font-medium whitespace-nowrap"
        >
          Request Custom Colorway &rarr;
        </Link>
      </div>

      {/* Product Grid or Clean Artisanal Empty State */}
      {categoryProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-brand-200 p-8 sm:p-14 shadow-subtle">
          <EmptyState
            icon={Heart}
            badge="Made-to-Order Queue"
            title={`${category.name} are in Production`}
            subtitle={`We do not pre-fabricate fake inventories. Each ${category.shortName.toLowerCase()} item is being individually crocheted. You can pre-order or customize your design directly through our studio.`}
            actionText="Request a Custom Piece"
            actionLink="/contact"
            secondaryActionText="Explore Other Categories"
            secondaryActionLink="/shop"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-brand-200 overflow-hidden shadow-subtle hover:shadow-soft transition-all"
            >
              <Link to={`/product/${product.slug}`} className="block aspect-square bg-cream-100">
                <img
                  src={product.images?.[0] || '/logo.png'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="p-4 space-y-2">
                <Link to={`/product/${product.slug}`}>
                  <h3 className="font-serif text-base font-semibold text-mauve-deep hover:text-brand-700">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm font-semibold text-brand-800">₹{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Other Categories Carousel / Navigation */}
      <div className="pt-10 border-t border-brand-200">
        <h3 className="font-serif text-xl font-medium text-mauve-deep mb-4 text-center">
          Explore Other Loop &amp; Love Categories
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories
            .filter((c) => c.slug !== category.slug)
            .map((c) => (
              <Link
                key={c.id}
                to={`/shop/${c.slug}`}
                className="p-3 rounded-xl bg-white border border-brand-100 hover:border-brand-300 text-center group transition-colors"
              >
                <p className="text-xs font-semibold text-mauve-charcoal group-hover:text-brand-700">
                  {c.shortName}
                </p>
                <span className="text-[10px] text-brand-500 font-mono">Explore &rarr;</span>
              </Link>
            ))}
        </div>
      </div>

    </div>
  );
};

