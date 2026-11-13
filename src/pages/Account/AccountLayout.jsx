import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Settings, LogOut, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';

export const AccountLayout = () => {
  const { currentUser, logout, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Account Overview', path: '/account', icon: User, end: true },
    { label: 'Order History', path: '/account/orders', icon: Package },
    { label: 'Saved Addresses', path: '/account/addresses', icon: MapPin },
    { label: 'Profile Settings', path: '/account/profile', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-8">
      
      <Breadcrumbs items={[{ label: 'My Account' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-200 pb-5">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-brand-700 block mb-1">
            Customer Dashboard
          </span>
          <h1 className="text-3xl font-serif text-mauve-deep font-normal">
            Hello, {currentUser?.name || 'Handmade Enthusiast'}
          </h1>
          <p className="text-xs text-mauve-muted mt-0.5">
            Manage your orders, custom inquiries, and delivery addresses in India.
          </p>
        </div>

        {!isAuthenticated && (
          <button
            onClick={() => login('customer@loopandlove.in')}
            className="px-4 py-2 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 text-xs font-medium self-start sm:self-auto"
          >
            Load Sample Profile Data
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar (3 cols) */}
        <aside className="lg:col-span-3 bg-white rounded-3xl border border-brand-200 p-4 shadow-subtle space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-700 text-white shadow-subtle'
                      : 'text-mauve-charcoal hover:bg-cream-100 hover:text-brand-800'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-2 mt-2 border-t border-brand-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Content Body (9 cols) */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-brand-200 p-6 sm:p-10 shadow-subtle">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

