import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  Search,
  Sparkles,
  Heart,
  ArrowRight,
  ShoppingBag,
  Grid,
  Check
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { categories } from '../../data/categories';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { EmptyState } from '../../components/common/EmptyState';

export const ShopPage = () => {
  const { productsList } = useStore();
  const { addToCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return productsList
      .filter((product) => {
        const matchesCategory =
          selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch =
          !searchQuery.trim() ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (selectedSort === 'price-low') return a.price - b.price;
        if (selectedSort === 'price-high') return b.price - a.price;
        if (selectedSort === 'newest') return (b.id > a.id ? 1 : -1);
        return 0; // featured
      });
  }, [productsList, selectedCategory, searchQuery, selectedSort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 space-y-8">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Shop Collection' }]} />

      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pt-2">
        <span className="text-xs font-semibold tracking-widest uppercase text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          The Full Atelier
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-mauve-deep font-normal">
          Handmade Crochet Collection
        </h1>
        <p className="text-sm sm:text-base text-mauve-muted font-light leading-relaxed">
          From pocket charms to amigurumi keepsakes and everlasting florals, explore our thoughtfully handcrafted pieces made with milk cotton yarn.
        </p>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-brand-700 text-white shadow-subtle'
              : 'bg-white text-mauve-charcoal hover:bg-brand-50 border border-brand-200'
          }`}
        >
          All Categories ({productsList.length})
        </button>

        {categories.map((cat) => {
          const count = productsList.filter((p) => p.category === cat.slug).length;
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-brand-700 text-white shadow-subtle'
                  : 'bg-white text-mauve-charcoal hover:bg-brand-50 border border-brand-200'
              }`}
            >
              {cat.shortName} ({count})
            </button>
          );
        })}
      </div>

      {/* Filter & Sorting Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-brand-200/80 shadow-subtle">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-brand-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search this collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-cream-50 border border-brand-200 rounded-full focus:outline-none focus:border-brand-500 text-mauve-charcoal placeholder-mauve-light"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-mauve-muted shrink-0">Sort By:</span>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="text-xs bg-cream-50 border border-brand-200 rounded-full px-3 py-1.5 text-mauve-charcoal focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="featured">Featured Curations</option>
            <option value="newest">Latest Stitching</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main Grid or Empty Catalogue State */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-brand-200 p-8 sm:p-14 shadow-subtle">
          <EmptyState
            icon={Sparkles}
            badge="Artisanal Preparation"
            title="The Collection is Being Handcrafted"
            subtitle={
              selectedCategory !== 'all'
                ? `Our artisans are currently crocheting the pieces for ${categories.find(c => c.slug === selectedCategory)?.name || 'this category'}. Every loop takes time and care.`
                : 'In accordance with our authentic launch approach, no fabricated products are displayed. Real products will appear here once our first official batch is ready.'
            }
            actionText="Browse Category Guides"
            actionLink="/"
            secondaryActionText="Request a Custom Creation"
            secondaryActionLink="/contact"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-brand-200 overflow-hidden shadow-subtle hover:shadow-soft transition-all flex flex-col"
            >
              <Link to={`/product/${product.slug}`} className="block relative aspect-square bg-cream-100 overflow-hidden">
                <img
                  src={product.images?.[0] || '/logo.png'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-brand-800 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border border-brand-200">
                  {product.category}
                </span>
              </Link>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <Link to={`/product/${product.slug}`}>
                    <h3 className="font-serif text-base font-semibold text-mauve-deep group-hover:text-brand-700 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-mauve-muted line-clamp-2 mt-1">
                    {product.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-brand-100 flex items-center justify-between">
                  <span className="font-serif text-lg font-semibold text-mauve-deep">
                    ₹{product.price}
                  </span>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="p-2 rounded-full bg-brand-50 hover:bg-brand-700 text-brand-700 hover:text-white transition-colors"
                    title="Add to Shopping Bag"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Directory Card Grid for Easy Navigation */}
      <div className="pt-12 border-t border-brand-200">
        <h3 className="font-serif text-2xl font-medium text-mauve-deep mb-6 text-center">
          Explore by Individual Craft Line
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop/${cat.slug}`}
              className="p-4 rounded-xl bg-white border border-brand-100 hover:border-brand-300 hover:shadow-subtle transition-all text-left group"
            >
              <h4 className="font-serif text-base font-semibold text-mauve-deep group-hover:text-brand-700">
                {cat.name}
              </h4>
              <p className="text-xs text-mauve-muted line-clamp-2 mt-1">
                {cat.tagline}
              </p>
              <span className="text-[11px] font-medium text-brand-600 inline-flex items-center gap-1 mt-3">
                <span>View Category Details</span>
                <span>&rarr;</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

