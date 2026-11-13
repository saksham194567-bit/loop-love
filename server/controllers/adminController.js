import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';
import { config } from '../config/env.js';

export async function adminLogin(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Administrator username/email and password are required.',
      });
    }

    const query = username.includes('@')
      ? 'SELECT * FROM admin_users WHERE email = $1'
      : 'SELECT * FROM admin_users WHERE username = $1';

    const result = await db.query(query, [username.trim()]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid administrator credentials.',
      });
    }

    const admin = result.rows[0];

    if (!admin.is_active) {
      return res.status(403).json({
        success: false,
        error: 'Administrator account has been deactivated.',
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid administrator credentials.',
      });
    }

    const token = jwt.sign(
      { adminId: admin.id, role: admin.role, username: admin.username },
      config.ADMIN_JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Admin authentication granted.',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getDashboardStats(req, res, next) {
  try {
    const [ordersCountRes, revenueRes, customersCountRes, productsCountRes, pendingOrdersRes, lowStockRes] =
      await Promise.all([
        db.query('SELECT COUNT(*) as count FROM orders'),
        db.query(
          "SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status = 'completed'"
        ),
        db.query("SELECT COUNT(*) as count FROM users WHERE role = 'customer'"),
        db.query('SELECT COUNT(*) as count FROM products'),
        db.query("SELECT COUNT(*) as count FROM orders WHERE order_status IN ('pending', 'confirmed')"),
        db.query('SELECT COUNT(*) as count FROM products WHERE stock_quantity <= 2'),
      ]);

    const recentOrdersRes = await db.query(
      `SELECT id, order_number, customer_email, total_amount, order_status, payment_status, created_at
       FROM orders ORDER BY created_at DESC LIMIT 5`
    );

    res.json({
      success: true,
      stats: {
        totalOrders: parseInt(ordersCountRes.rows[0].count, 10),
        totalRevenue: parseFloat(revenueRes.rows[0].total),
        totalCustomers: parseInt(customersCountRes.rows[0].count, 10),
        totalProducts: parseInt(productsCountRes.rows[0].count, 10),
        pendingOrders: parseInt(pendingOrdersRes.rows[0].count, 10),
        lowStockProducts: parseInt(lowStockRes.rows[0].count, 10),
      },
      recentOrders: recentOrdersRes.rows,
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdminOrders(req, res, next) {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    let sql = `
      SELECT o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'productId', oi.product_id,
            'productName', oi.product_name,
            'variant', oi.variant_selection,
            'unitPrice', oi.unit_price,
            'quantity', oi.quantity,
            'subtotal', oi.subtotal
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `;
    const params = [];

    if (status && status !== 'all') {
      sql += ` WHERE o.order_status = $1`;
      params.push(status);
    }

    sql += ` GROUP BY o.id ORDER BY o.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const result = await db.query(sql, params);

    res.json({
      success: true,
      orders: result.rows,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { orderStatus, trackingNumber, courierName, notes } = req.body;
    const now = new Date();

    const result = await db.query(
      `UPDATE orders
       SET order_status = COALESCE($1, order_status),
           tracking_number = COALESCE($2, tracking_number),
           courier_name = COALESCE($3, courier_name),
           notes = COALESCE($4, notes),
           updated_at = $5
       WHERE id = $6
       RETURNING *`,
      [orderStatus, trackingNumber, courierName, notes, now, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully.',
      order: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdminCustomers(req, res, next) {
  try {
    const result = await db.query(`
      SELECT u.id, u.name, u.email, u.phone, u.created_at,
             COUNT(o.id) as order_count,
             COALESCE(SUM(o.total_amount), 0) as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id AND o.payment_status = 'completed'
      WHERE u.role = 'customer'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    res.json({ success: true, customers: result.rows });
  } catch (err) {
    next(err);
  }
}

export async function getAdminInventory(req, res, next) {
  try {
    const result = await db.query('SELECT * FROM inventory ORDER BY item_type, item_name');
    res.json({ success: true, inventory: result.rows });
  } catch (err) {
    next(err);
  }
}

export async function updateInventoryItem(req, res, next) {
  try {
    const { id } = req.params;
    const { quantityAvailable, status } = req.body;
    const now = new Date();

    const result = await db.query(
      `UPDATE inventory
       SET quantity_available = COALESCE($1, quantity_available),
           status = COALESCE($2, status),
           updated_at = $3
       WHERE id = $4
       RETURNING *`,
      [quantityAvailable, status, now, id]
    );

    res.json({ success: true, item: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function getAdminContactMessages(req, res, next) {
  try {
    const result = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json({ success: true, messages: result.rows });
  } catch (err) {
    next(err);
  }
}

export async function markContactMessageRead(req, res, next) {
  try {
    const { id } = req.params;
    await db.query('UPDATE contact_messages SET is_read = true WHERE id = $1', [id]);
    res.json({ success: true, message: 'Marked as read.' });
  } catch (err) {
    next(err);
  }
}

export async function getAdminNewsletterSubscribers(req, res, next) {
  try {
    const result = await db.query('SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC');
    res.json({ success: true, subscribers: result.rows });
  } catch (err) {
    next(err);
  }
}

