/**
 * Loop & Love — Product Data Architecture
 * 
 * In accordance with Phase 1 Development specifications:
 * - Product catalogue is initially EMPTY.
 * - No fabricated prices, no fabricated reviews, no fabricated photography.
 * - When real products are added via the Admin Dashboard or directly to this file,
 *   all components, grids, filters, and product detail pages are pre-wired to render seamlessly.
 */

export const productSchema = {
  id: '',                     // Unique identifier e.g. 'LL-KEY-001'
  name: '',                   // Product display title
  slug: '',                   // URL-friendly slug e.g. 'lavender-daisy-keychain'
  category: '',               // One of: 'keychains', 'dolls', 'floral-charms', 'crochet-flowers', 'bags', 'accessories', 'home-decor'
  price: 0,                   // Price in INR (₹)
  compareAtPrice: null,       // Optional strikethrough price
  description: '',            // Rich story & craftsmanship details
  shortDescription: '',       // Brief summary for cards & previews
  images: [],                 // Array of image URLs / paths (e.g. ['/products/tulip-1.jpg'])
  availability: 'in_stock',   // 'in_stock' | 'made_to_order' | 'out_of_stock' | 'preorder'
  leadTimeDays: 4,            // Handcrafting timeframe in business days
  variants: [
    // { name: 'Color', options: ['Lilac Pastel', 'Cream Ivory', 'Blush Mauve'] },
    // { name: 'Hardware', options: ['Gold Clip', 'Silver Ring', 'Rose Gold'] }
  ],
  customisationOptions: {
    allowsCustomInitial: false,
    allowsCustomColorway: false,
    prompt: ''
  },
  dimensions: '',             // e.g. 'Approx. 8cm x 5cm'
  yarnMaterial: '',           // e.g. '100% Combed Milk Cotton'
  careInstructions: [
    'Gentle hand-wash in cool water with mild wool detergent',
    'Do not wring or twist; press gently between dry towels',
    'Reshape while damp and lay flat to dry in shade',
    'Keep away from sharp objects and pet claws'
  ],
  stockQuantity: 0,
  isFeatured: false,
  isNewArrival: false,
  createdAt: ''
};

// Initial catalogue is intentionally empty as per project mandate
export const initialProducts = [];

// Helper functions for catalogue queries
export const getProducts = () => initialProducts;

export const getProductBySlug = (slug) => {
  return initialProducts.find(p => p.slug === slug) || null;
};

export const getProductsByCategory = (categorySlug) => {
  return initialProducts.filter(p => p.category === categorySlug);
};

export const getFeaturedProducts = () => {
  return initialProducts.filter(p => p.isFeatured);
};

