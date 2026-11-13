import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { categories } from '../../data/categories';

export const SearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, productsList } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase()) ||
    c.tagline.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProducts = productsList.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectCategory = (slug) => {
    setIsSearchOpen(false);
    navigate(`/shop/${slug}`);
  };

  const handleSelectProduct = (slug) => {
    setIsSearchOpen(false);
    navigate(`/product/${slug}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Loop & Love"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6 bg-mauve-deep/40 backdrop-blur-sm transition-opacity"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-cream-50 rounded-2xl shadow-elevated border border-brand-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-brand-200 p-4 sm:p-5 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-brand-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search keychains, amigurumi dolls, flowers, bags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-base sm:text-lg text-mauve-charcoal placeholder-mauve-light font-normal"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-mauve-light hover:text-mauve-charcoal p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs tracking-wider uppercase px-2.5 py-1 rounded bg-cream-200 hover:bg-cream-300 text-mauve-muted transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results / Suggestion Body */}
        <div className="max-h-[60vh] overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Quick Categories */}
          <div>
            <div className="flex items-center justify-between mb-3 text-xs font-semibold tracking-wider uppercase text-brand-800">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-brand-500" />
                Handmade Categories
              </span>
              <span className="text-mauve-light font-normal lowercase">({filteredCategories.length} categories)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.slug)}
                  className="flex items-center justify-between p-3 rounded-xl border border-brand-100 bg-white hover:bg-brand-50/60 hover:border-brand-200 transition-all text-left group"
                >
                  <div>
                    <p className="text-sm font-medium text-mauve-charcoal group-hover:text-brand-700">
                      {cat.name}
                    </p>
                    <p className="text-xs text-mauve-muted line-clamp-1">
                      {cat.tagline}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-300 group-hover:text-brand-600 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Match Section */}
          {query.trim() && (
            <div>
              <div className="flex items-center justify-between mb-3 text-xs font-semibold tracking-wider uppercase text-brand-800">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                  Catalogue Matches
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 text-center text-xs text-mauve-muted">
                  The collection is currently in the making. No finished pieces match &ldquo;{query}&rdquo; yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredProducts.map(prod => (
                    <button
                      key={prod.id}
                      onClick={() => handleSelectProduct(prod.slug)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-brand-50 text-left border border-brand-100 transition-colors"
                    >
                      <span className="text-sm font-medium text-mauve-charcoal">{prod.name}</span>
                      <span className="text-sm text-brand-700 font-semibold">₹{prod.price}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Popular searches preview */}
          {!query && (
            <div className="pt-2 border-t border-brand-100">
              <p className="text-xs text-mauve-muted mb-2 font-medium">Popular Handmade Inquiries:</p>
              <div className="flex flex-wrap gap-2">
                {['Custom Initial Keychains', 'Sunflower Bouquet', 'Pastel Tulip Charms', 'Amigurumi Bunny', 'Crochet Tote Bag'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs px-3 py-1 rounded-full bg-white border border-brand-200 text-mauve-charcoal hover:bg-brand-50 hover:text-brand-700 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

