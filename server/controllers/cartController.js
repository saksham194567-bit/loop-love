import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';

async function getOrCreateCart(userId, sessionId) {
  let cart = null;

  if (userId) {
    const res = await db.query('SELECT * FROM carts WHERE user_id = $1 LIMIT 1', [userId]);
    if (res.rows.length > 0) cart = res.rows[0];
  } else if (sessionId) {
    const res = await db.query('SELECT * FROM carts WHERE session_id = $1 LIMIT 1', [sessionId]);
    if (res.rows.length > 0) cart = res.rows[0];
  }

  if (!cart) {
    const cartId = `cart_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
    const finalSessionId = sessionId || uuidv4();
    const insertRes = await db.query(
      `INSERT INTO carts (id, user_id, session_id) VALUES ($1, $2, $3) RETURNING *`,
      [cartId, userId || null, finalSessionId]
    );
    cart = insertRes.rows[0];
  }

  return cart;
}

export async function getCart(req, res, next) {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || req.query.sessionId || null;

    const cart = await getOrCreateCart(userId, sessionId);

    const itemsRes = await db.query(
      `SELECT ci.id as "itemId", ci.quantity, ci.variant_selection as "variant",
              p.id as "productId", p.name, p.slug, p.price, p.stock_quantity as "stockQuantity",
              (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY display_order ASC LIMIT 1) as image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1
       ORDER BY ci.created_at ASC`,
      [cart.id]
    );

    const items = itemsRes.rows.map((row) => ({
      cartKey: row.itemId,
      id: row.productId,
      name: row.name,
      slug: row.slug,
      price: Number(row.price),
      quantity: row.quantity,
      selectedVariant: row.variant,
      images: [row.image || '/logo.png'],
    }));

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({
      success: true,
      cartId: cart.id,
      sessionId: cart.session_id,
      items,
      subtotal,
    });
  } catch (err) {
    next(err);
  }
}

export async function addToCart(req, res, next) {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || req.body.sessionId || null;
    const { productId, quantity = 1, variantSelection = null } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, error: 'Product ID is required.' });
    }

    const cart = await getOrCreateCart(userId, sessionId);

    // Check if item with same variant already exists
    const existing = await db.query(
      `SELECT id, quantity FROM cart_items
       WHERE cart_id = $1 AND product_id = $2 AND (variant_selection = $3 OR (variant_selection IS NULL AND $3 IS NULL))`,
      [cart.id, productId, variantSelection]
    );

    if (existing.rows.length > 0) {
      const newQty = existing.rows[0].quantity + Number(quantity);
      await db.query(
        `UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
        [newQty, existing.rows[0].id]
      );
    } else {
      const itemId = `ci_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
      await db.query(
        `INSERT INTO cart_items (id, cart_id, product_id, variant_selection, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [itemId, cart.id, productId, variantSelection, Number(quantity)]
      );
    }

    return getCart(req, res, next);
  } catch (err) {
    next(err);
  }
}

export async function updateCartItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (Number(quantity) <= 0) {
      await db.query('DELETE FROM cart_items WHERE id = $1', [itemId]);
    } else {
      await db.query('UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [
        Number(quantity),
        itemId,
      ]);
    }

    return getCart(req, res, next);
  } catch (err) {
    next(err);
  }
}

export async function removeCartItem(req, res, next) {
  try {
    const { itemId } = req.params;
    await db.query('DELETE FROM cart_items WHERE id = $1', [itemId]);
    return getCart(req, res, next);
  } catch (err) {
    next(err);
  }
}

export async function clearCart(req, res, next) {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || req.query.sessionId || null;
    const cart = await getOrCreateCart(userId, sessionId);

    await db.query('DELETE FROM cart_items WHERE cart_id = $1', [cart.id]);

    res.json({
      success: true,
      message: 'Cart cleared.',
      items: [],
      subtotal: 0,
    });
  } catch (err) {
    next(err);
  }
}

