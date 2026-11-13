import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { categories as defaultCategories } from '../data/categories';

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider = ({ children }) => {
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState(defaultCategories);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Store Configuration Settings
  const [storeSettings, setStoreSettings] = useState({
    brandName: 'Loop & Love',
    tagline: 'Little Loops. Endless Love.',
    subtitle: 'Handmade Crochet Boutique',
    currency: 'INR',
    currencySymbol: '₹',
    supportEmail: 'care@loopandlove.in',
    supportWhatsApp: '+91 98765 43210',
    instagramHandle: '@loopandlove.crafts',
    shippingRegions: 'Pan-India',
    freeShippingThreshold: 1499,
    standardShippingFee: 79,
    isStoreLive: false,
    isCheckoutActive: true,
  });

  // Fetch live products, categories & settings from PostgreSQL backend
  const refreshStoreData = async () => {
    try {
      const [prodsRes, catsRes, settingsRes] = await Promise.allSettled([
        api.products.getAll(),
        api.categories.getAll(),
        api.settings.get(),
      ]);

      if (prodsRes.status === 'fulfilled' && prodsRes.value.success) {
        setProductsList(prodsRes.value.products || []);
      }

      if (catsRes.status === 'fulfilled' && catsRes.value.success) {
        const backendCats = catsRes.value.categories.map((c) => ({
          id: c.id,
          slug: c.slug,
          name: c.name,
          shortName: c.short_name,
          tagline: c.tagline,
          description: c.description,
          stitchDetail: c.stitch_detail,
          itemCount: parseInt(c.itemCount || 0, 10),
        }));
        if (backendCats.length > 0) setCategoriesList(backendCats);
      }

      if (settingsRes.status === 'fulfilled' && settingsRes.value.success) {
        setStoreSettings((prev) => ({
          ...prev,
          ...settingsRes.value.settings,
        }));
      }
    } catch (err) {
      console.warn('[StoreContext] Could not fetch live data, using initial cache:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStoreData();
  }, []);

  const addProductToStore = async (newProduct) => {
    try {
      const res = await api.admin.createProduct(newProduct);
      if (res.success) {
        await refreshStoreData();
        return { success: true, product: res.product };
      }
      return { success: false, error: res.error };
    } catch (err) {
      // Fallback local update
      setProductsList((prev) => [newProduct, ...prev]);
      return { success: true };
    }
  };

  const updateProductInStore = async (id, updatedFields) => {
    try {
      await api.admin.updateProduct(id, updatedFields);
      await refreshStoreData();
    } catch {
      setProductsList((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)));
    }
  };

  const deleteProductFromStore = async (id) => {
    try {
      await api.admin.deleteProduct(id);
      await refreshStoreData();
    } catch {
      setProductsList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <StoreContext.Provider
      value={{
        storeSettings,
        productsList,
        categories: categoriesList,
        loading,
        isSearchOpen,
        setIsSearchOpen,
        newsletterSubscribed,
        setNewsletterSubscribed,
        refreshStoreData,
        addProductToStore,
        updateProductInStore,
        deleteProductFromStore,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
