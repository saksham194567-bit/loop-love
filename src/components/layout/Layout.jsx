import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { DevelopmentBadge } from '../common/DevelopmentBadge';
import { SearchModal } from '../common/SearchModal';
import { CartDrawer } from '../common/CartDrawer';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-mauve-charcoal selection:bg-brand-200 selection:text-brand-900">
      <DevelopmentBadge />
      <AnnouncementBar />
      <Navbar />
      
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <SearchModal />
      <CartDrawer />
    </div>
  );
};

