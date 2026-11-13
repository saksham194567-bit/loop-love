-- =====================================================================
-- LOOP & LOVE SEED DATA (7 Official Categories, Supplies & Admin)
-- =====================================================================

-- Seed 7 Official Categories
INSERT INTO categories (id, name, slug, short_name, tagline, description, stitch_detail, display_order)
VALUES
('cat_keychains', 'Crochet Keychains', 'keychains', 'Keychains', 'Miniature keepsakes made with microscopic love', 'Pocket-sized companions and heirloom charms, hand-stitched with durable cotton-blend yarn. Perfect for daily keys, bag charms, and heartfelt mini gifts.', 'Tight single-crochet weave with reinforced brass keyring fittings', 1),
('cat_dolls', 'Crochet Dolls', 'dolls', 'Dolls & Amigurumi', 'Lovingly crafted characters with gentle souls', 'Bespoke handmade amigurumi dolls, soft animals, and heirloom characters. Each doll takes hours of dedicated handwork, filled with hypoallergenic fiberfill.', 'Seamless spiral stitches, safety-secured eyes & hand-embroidered facial features', 2),
('cat_floral_charms', 'Floral Charms', 'floral-charms', 'Floral Charms', 'Delicate blossoms that never fade', 'Botanical tassels, tulip bell-charms, daisy strings, and botanical trinkets designed to adorn tote bags, car mirrors, or personal spaces.', 'Sculpted petals with soft mercerized cotton yarn for lasting shape', 3),
('cat_crochet_flowers', 'Crochet Flowers', 'crochet-flowers', 'Everlasting Flowers', 'Stitched bouquets for moments that last forever', 'Timeless floral stems including lavender sprigs, blush roses, sunflowers, and custom anniversary bouquets. The sustainable alternative to fresh blooms.', 'Flexible craft-wire stems hand-wrapped in yarn for natural posing', 4),
('cat_bags', 'Crochet Bags', 'bags', 'Bags & Totes', 'Slow-fashioned statement totes and shoulder bags', 'Handmade crochet shoulder bags, granny-square market totes, drawstring pouches, and clutch bags crafted for mindful everyday elegance.', 'Reinforced macrame-cotton cord base for structural integrity and low stretch', 5),
('cat_accessories', 'Crochet Accessories', 'accessories', 'Accessories', 'Wearable warmth and delicate accents', 'Hair scrunchies, bandana headscarves, bookmark tassels, coaster sets, and ear-warmers. Subtle artisanal touches that brighten daily routines.', 'Fine-gauge yarn with elasticized interior bands where applicable', 6),
('cat_home_decor', 'Home Decor', 'home-decor', 'Home Decor', 'Warm textures and cozy artisanal aesthetics', 'Plant hanger cozies, decorative wall hangings, table doilies, cushion covers, and nursery accents crafted to infuse warmth into modern living spaces.', 'Artisanal texture combining waffle stitches, shell edges, and tassel fringes', 7)
ON CONFLICT (slug) DO NOTHING;

-- Seed Raw Inventory / Studio Supplies
INSERT INTO inventory (id, item_name, item_type, quantity_available, unit, status)
VALUES
('inv_yarn_lilac', 'Combed Milk Cotton — Soft Lilac', 'yarn', 4.5, 'kg', 'Healthy'),
('inv_yarn_ivory', 'Combed Milk Cotton — Warm Ivory', 'yarn', 6.2, 'kg', 'Healthy'),
('inv_yarn_mauve', 'Mercerized Cotton — Deep Mauve', 'yarn', 2.8, 'kg', 'Healthy'),
('inv_fill_hypo', 'Hypoallergenic Amigurumi Fiberfill', 'stuffing', 8.0, 'kg', 'Healthy'),
('inv_ring_brass', 'Antiqued Brass Keyring Hardware', 'hardware', 120, 'units', 'Healthy')
ON CONFLICT (id) DO NOTHING;

-- Seed Super Admin User (Password: LoopLoveAdmin2026! - hashed with bcrypt)
-- Hash generated with bcrypt salt rounds = 10
INSERT INTO admin_users (id, username, email, password_hash, role)
VALUES
('admin_master', 'loopadmin', 'admin@loopandlove.in', '$2a$10$n/g2M7EdkhV23O5vXAQMQO8TDF7pwjJeITC8Tre8n7OFUolrzjYZ6', 'super_admin')
ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;
