export const categories = [
  {
    id: 'keychains',
    slug: 'keychains',
    name: 'Crochet Keychains',
    shortName: 'Keychains',
    tagline: 'Miniature keepsakes made with microscopic love',
    description: 'Pocket-sized companions and heirloom charms, hand-stitched with durable cotton-blend yarn. Perfect for daily keys, bag charms, and heartfelt mini gifts.',
    stitchDetail: 'Tight single-crochet weave with reinforced brass keyring fittings',
    itemCount: 0,
    highlights: ['Pocket Friendly', 'Durable Cotton Blend', 'Tarnish-Resistant Rings']
  },
  {
    id: 'dolls',
    slug: 'dolls',
    name: 'Crochet Dolls',
    shortName: 'Dolls & Amigurumi',
    tagline: 'Lovingly crafted characters with gentle souls',
    description: 'Bespoke handmade amigurumi dolls, soft animals, and heirloom characters. Each doll takes hours of dedicated handwork, filled with hypoallergenic fiberfill.',
    stitchDetail: 'Seamless spiral stitches, safety-secured eyes & hand-embroidered facial features',
    itemCount: 0,
    highlights: ['Hypoallergenic Stuffing', 'Soft Baby-Safe Yarn', 'Heirloom Quality']
  },
  {
    id: 'floral-charms',
    slug: 'floral-charms',
    name: 'Floral Charms',
    shortName: 'Floral Charms',
    tagline: 'Delicate blossoms that never fade',
    description: 'Botanical tassels, tulip bell-charms, daisy strings, and botanical trinkets designed to adorn tote bags, car mirrors, or personal spaces.',
    stitchDetail: 'Sculpted petals with soft mercerized cotton yarn for lasting shape',
    itemCount: 0,
    highlights: ['Never Wilts', 'Subtle Pastel Palettes', 'Versatile Clasps']
  },
  {
    id: 'crochet-flowers',
    slug: 'crochet-flowers',
    name: 'Crochet Flowers',
    shortName: 'Everlasting Flowers',
    tagline: 'Stitched bouquets for moments that last forever',
    description: 'Timeless floral stems including lavender sprigs, blush roses, sunflowers, and custom anniversary bouquets. The sustainable alternative to fresh blooms.',
    stitchDetail: 'Flexible craft-wire stems hand-wrapped in yarn for natural posing',
    itemCount: 0,
    highlights: ['Zero Maintenance', 'Sustainable Gifting', 'Custom Wrap Options']
  },
  {
    id: 'bags',
    slug: 'bags',
    name: 'Crochet Bags',
    shortName: 'Bags & Totes',
    tagline: 'Slow-fashioned statement totes and shoulder bags',
    description: 'Handmade crochet shoulder bags, granny-square market totes, drawstring pouches, and clutch bags crafted for mindful everyday elegance.',
    stitchDetail: 'Reinforced macrame-cotton cord base for structural integrity and low stretch',
    itemCount: 0,
    highlights: ['Reinforced Straps', 'Textured Cable Weaves', 'Earth-Friendly Fiber']
  },
  {
    id: 'accessories',
    slug: 'accessories',
    name: 'Crochet Accessories',
    shortName: 'Accessories',
    tagline: 'Wearable warmth and delicate accents',
    description: 'Hair scrunchies, bandana headscarves, bookmark tassels, coaster sets, and ear-warmers. Subtle artisanal touches that brighten daily routines.',
    stitchDetail: 'Fine-gauge yarn with elasticized interior bands where applicable',
    itemCount: 0,
    highlights: ['Gentle On Hair', 'Washable Fibers', 'Comfort Fit']
  },
  {
    id: 'home-decor',
    slug: 'home-decor',
    name: 'Home Decor',
    shortName: 'Home Decor',
    tagline: 'Warm textures and cozy artisanal aesthetics',
    description: 'Plant hanger cozies, decorative wall hangings, table doilies, cushion covers, and nursery accents crafted to infuse warmth into modern living spaces.',
    stitchDetail: 'Artisanal texture combining waffle stitches, shell edges, and tassel fringes',
    itemCount: 0,
    highlights: ['Cozy Organic Feel', 'Artisanal Textures', 'Handcrafted Ambiance']
  }
];

export const getCategoryBySlug = (slug) => {
  return categories.find(c => c.slug === slug);
};

