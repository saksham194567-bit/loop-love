import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('loop_and_love_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync to localStorage whenever cartItems change
  useEffect(() => {
    try {
      localStorage.setItem('loop_and_love_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cartItems]);

  // Load server-side cart on mount
  const syncWithServer = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.cart.get();
      if (res && res.success && Array.isArray(res.items)) {
        // If server has items, take server items.
        // If server is empty but we have local items, keep local preview items if any
        if (res.items.length > 0) {
          setCartItems(res.items);
        }
      }
    } catch (err) {
      console.log('[CartContext] Offline or backend unreachable, using local cart fallback.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncWithServer();
  }, [syncWithServer]);

  const addToCart = async (product, quantity = 1, variant = null) => {
    const itemKey = variant ? `${product.id}-${variant}` : product.id;

    // Try backend sync first if not a preview sample
    if (!product.isDevelopmentSample && product.id) {
      try {
        const res = await api.cart.add(product.id, quantity, variant);
        if (res && res.success && Array.isArray(res.items)) {
          setCartItems(res.items);
          setIsCartOpen(true);
          return;
        }
      } catch (err) {
        console.warn('[CartContext] Backend add failed, falling back to local cart state:', err);
      }
    }

    // Local state fallback
    setCartItems(prev => {
      const existing = prev.find(item => item.cartKey === itemKey || item.id === product.id);

      if (existing) {
        return prev.map(item =>
          item.cartKey === itemKey || item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            ...product,
            cartKey: itemKey,
            selectedVariant: variant,
            quantity: quantity,
          }
        ];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = async (cartKey) => {
    const targetItem = cartItems.find(item => item.cartKey === cartKey || item.id === cartKey);
    const backendItemId = targetItem?.cartKey?.startsWith('ci_') ? targetItem.cartKey : null;

    if (backendItemId) {
      try {
        const res = await api.cart.removeItem(backendItemId);
        if (res && res.success && Array.isArray(res.items)) {
          setCartItems(res.items);
          return;
        }
      } catch (err) {
        console.warn('[CartContext] Backend remove failed, using local update:', err);
      }
    }

    setCartItems(prev => prev.filter(item => item.cartKey !== cartKey && item.id !== cartKey));
  };

  const updateQuantity = async (cartKey, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartKey);
      return;
    }

    const targetItem = cartItems.find(item => item.cartKey === cartKey || item.id === cartKey);
    const backendItemId = targetItem?.cartKey?.startsWith('ci_') ? targetItem.cartKey : null;

    if (backendItemId) {
      try {
        const res = await api.cart.updateItem(backendItemId, newQuantity);
        if (res && res.success && Array.isArray(res.items)) {
          setCartItems(res.items);
          return;
        }
      } catch (err) {
        console.warn('[CartContext] Backend update failed, using local update:', err);
      }
    }

    setCartItems(prev =>
      prev.map(item =>
        item.cartKey === cartKey || item.id === cartKey ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = async () => {
    try {
      await api.cart.clear();
    } catch (err) {
      console.warn('[CartContext] Backend clear cart failed:', err);
    }
    setCartItems([]);
  };

  // Development helper: allows previewing the cart layout with a sample handmade crochet item
  const addSamplePreviewItem = () => {
    const previewSample = {
      id: 'LL-SAMPLE-01',
      cartKey: 'LL-SAMPLE-01-Lilac',
      name: 'Petal Bloom Crochet Charm [Preview Sample]',
      slug: 'petal-bloom-crochet-charm',
      category: 'floral-charms',
      price: 549,
      quantity: 1,
      selectedVariant: 'Lilac & Soft Cream',
      images: ['/logo.png'],
      yarnMaterial: '100% Combed Milk Cotton',
      isDevelopmentSample: true
    };
    setCartItems(prev => {
      const exists = prev.find(i => i.id === previewSample.id);
      if (exists) return prev;
      return [...prev, previewSample];
    });
    setIsCartOpen(true);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
    0
  );

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Free shipping threshold ₹1,499
  const freeShippingThreshold = 1499;
  const standardShippingFee = 79;
  const shippingFee = subtotal === 0 ? 0 : subtotal >= freeShippingThreshold ? 0 : standardShippingFee;
  const total = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addSamplePreviewItem,
        subtotal,
        shippingFee,
        freeShippingThreshold,
        total,
        itemCount,
        isCartOpen,
        setIsCartOpen,
        loading,
        syncWithServer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
