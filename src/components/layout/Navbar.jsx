import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { categories } from '../../data/categories';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopHovered, setIsShopHovered] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();
  const { setIsSearchOpen } = useStore();
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop', hasDropdown: true },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-cream-50/95 backdrop-blur-md border-b border-brand-200/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-mauve-charcoal hover:bg-cream-200 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Brand Logo & Title */}
          <div className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-brand-300 shadow-subtle group-hover:shadow-soft transition-transform group-hover:scale-105 duration-200">
                <img
                  src="/logo.png"
                  alt="Loop & Love Emblem"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl sm:text-2xl font-semibold tracking-wide text-mauve-deep group-hover:text-brand-700 transition-colors">
                  Loop &amp; Love
                </span>
                <span className="text-[10px] sm:text-[11px] tracking-widest text-mauve-muted uppercase font-medium">
                  Handmade Crochet
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.path}
                    className="relative"
                    onMouseEnter={() => setIsShopHovered(true)}
                    onMouseLeave={() => setIsShopHovered(false)}
                  >
                    <NavLink
                      to={link.path}
                      className={({ isActive: navActive }) =>
                        `inline-flex items-center gap-1 text-sm font-medium transition-colors py-2 ${
                          isActive
                            ? 'text-brand-800 font-semibold'
                            : 'text-mauve-charcoal hover:text-brand-700'
                        }`
                      }
                    >
                      <span>{link.label}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isShopHovered ? 'rotate-180' : ''}`} />
                    </NavLink>

                    {/* Shop Categories Mega Dropdown */}
                    {isShopHovered && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-[520px] bg-cream-50 rounded-2xl shadow-elevated border border-brand-200 p-5 grid grid-cols-2 gap-2 animate-in fade-in zoom-in-95 duration-150">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            to={`/shop/${cat.slug}`}
                            onClick={() => setIsShopHovered(false)}
                            className="p-2.5 rounded-xl hover:bg-white border border-transparent hover:border-brand-200 transition-all text-left group"
                          >
                            <p className="text-xs font-semibold text-mauve-deep group-hover:text-brand-700">
                              {cat.name}
                            </p>
                            <p className="text-[11px] text-mauve-muted line-clamp-1 mt-0.5">
                              {cat.tagline}
                            </p>
                          </Link>
                        ))}
                        <div className="col-span-2 pt-2 border-t border-brand-100 flex items-center justify-between text-xs">
                          <Link
                            to="/shop"
                            onClick={() => setIsShopHovered(false)}
                            className="font-medium text-brand-700 hover:text-brand-800 flex items-center gap-1"
                          >
                            <span>View All Handcrafted Categories</span>
                            <span>&rarr;</span>
                          </Link>
                          <span className="text-[11px] text-mauve-light">
                            100% Handcrafted
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive: navActive }) =>
                    `text-sm font-medium transition-colors py-2 relative ${
                      isActive
                        ? 'text-brand-800 font-semibold'
                        : 'text-mauve-charcoal hover:text-brand-700'
                    }`
                  }
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-600 rounded-full" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Actions: Search, Account, Bag, Admin */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full text-mauve-charcoal hover:text-brand-700 hover:bg-brand-50 transition-colors"
              aria-label="Search Collection"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account Icon */}
            <Link
              to="/account"
              className="p-2 rounded-full text-mauve-charcoal hover:text-brand-700 hover:bg-brand-50 transition-colors"
              aria-label="Customer Account"
              title="Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-full text-mauve-charcoal hover:text-brand-700 hover:bg-brand-50 transition-colors relative"
              aria-label="Shopping Bag"
              title="View Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-700 text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in-75">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Admin Dashboard subtle link */}
            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-mauve-muted hover:text-brand-800 border border-brand-200/60 rounded-full hover:bg-white transition-colors"
              title="Admin Portal (Development Preview)"
            >
              <ShieldCheck className="w-3 h-3 text-brand-600" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-200 bg-cream-50 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={handleMobileNavClick}
              className="px-3 py-2 rounded-lg text-sm font-medium text-mauve-charcoal hover:bg-brand-50"
            >
              Home
            </Link>
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-brand-800 mt-2">
              Handmade Categories
            </div>
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/shop/${c.slug}`}
                onClick={handleMobileNavClick}
                className="pl-6 pr-3 py-1.5 rounded-lg text-xs font-medium text-mauve-muted hover:text-brand-800 hover:bg-brand-50/60 flex items-center justify-between"
              >
                <span>{c.name}</span>
                <span className="text-[10px] text-brand-400">Handmade</span>
              </Link>
            ))}
            <Link
              to="/shop"
              onClick={handleMobileNavClick}
              className="px-3 py-2 rounded-lg text-sm font-medium text-brand-700 hover:bg-brand-50 font-semibold"
            >
              All Categories &rarr;
            </Link>
            <Link
              to="/about"
              onClick={handleMobileNavClick}
              className="px-3 py-2 rounded-lg text-sm font-medium text-mauve-charcoal hover:bg-brand-50"
            >
              Our Story &amp; Philosophy
            </Link>
            <Link
              to="/contact"
              onClick={handleMobileNavClick}
              className="px-3 py-2 rounded-lg text-sm font-medium text-mauve-charcoal hover:bg-brand-50"
            >
              Contact &amp; Custom Orders
            </Link>
            <Link
              to="/track-order"
              onClick={handleMobileNavClick}
              className="px-3 py-2 rounded-lg text-sm font-medium text-mauve-charcoal hover:bg-brand-50"
            >
              Track Your Order
            </Link>
            <Link
              to="/admin"
              onClick={handleMobileNavClick}
              className="px-3 py-2 rounded-lg text-sm font-medium text-brand-800 bg-brand-100/50 hover:bg-brand-100 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Management Dashboard</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

