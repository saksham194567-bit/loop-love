import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/Home/HomePage';
import { ShopPage } from './pages/Shop/ShopPage';
import { CategoryPage } from './pages/Category/CategoryPage';
import { ProductDetailPage } from './pages/Product/ProductDetailPage';
import { CartPage } from './pages/Cart/CartPage';
import { CheckoutPage } from './pages/Checkout/CheckoutPage';
import { AboutPage } from './pages/About/AboutPage';
import { ContactPage } from './pages/Contact/ContactPage';
import { TrackOrderPage } from './pages/TrackOrder/TrackOrderPage';
import { LegalPolicyPage } from './pages/Legal/LegalPolicyPage';

// Auth Pages
import { LoginPage } from './pages/Auth/LoginPage';
import { SignupPage } from './pages/Auth/SignupPage';
import { ForgotPasswordPage } from './pages/Auth/ForgotPasswordPage';

// Customer Account Pages
import { AccountLayout } from './pages/Account/AccountLayout';
import { AccountOverview } from './pages/Account/AccountOverview';
import { AccountOrders } from './pages/Account/AccountOrders';
import { AccountAddresses } from './pages/Account/AccountAddresses';
import { AccountProfile } from './pages/Account/AccountProfile';

// Admin Dashboard Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardOverview } from './pages/Admin/AdminDashboardOverview';
import { AdminProductsPage } from './pages/Admin/AdminProductsPage';
import { AdminAddProductPage } from './pages/Admin/AdminAddProductPage';
import { AdminCategoriesPage } from './pages/Admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/Admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/Admin/AdminCustomersPage';
import { AdminInventoryPage } from './pages/Admin/AdminInventoryPage';
import { AdminSettingsPage } from './pages/Admin/AdminSettingsPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// 404 Not Found Page
function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 mx-auto">
        🧶
      </div>
      <h1 className="font-serif text-4xl text-mauve-deep">Page Not Found</h1>
      <p className="text-xs text-mauve-muted max-w-sm mx-auto">
        The loop you are looking for unravelled or does not exist. Let&apos;s return to our craft home.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-700 text-white text-xs font-semibold uppercase tracking-wider"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Storefront Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="shop/:categorySlug" element={<CategoryPage />} />
          <Route path="product/:slug" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="track-order" element={<TrackOrderPage />} />

          {/* Legal Pages */}
          <Route path="policies/:policyType" element={<LegalPolicyPage />} />

          {/* Authentication */}
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />

          {/* Customer Account Dashboard */}
          <Route path="account" element={<AccountLayout />}>
            <Route index element={<AccountOverview />} />
            <Route path="orders" element={<AccountOrders />} />
            <Route path="addresses" element={<AccountAddresses />} />
            <Route path="profile" element={<AccountProfile />} />
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Dedicated Admin Portal Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardOverview />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="add-product" element={<AdminAddProductPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="inventory" element={<AdminInventoryPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </>
  );
}

