import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';
import { config } from '../config/env.js';

function generateToken(userId, role = 'customer') {
  return jwt.sign({ userId, role }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required.',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long.',
      });
    }

    // Check if user already exists
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email address already exists. Please sign in.',
      });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userId = `usr_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
    const now = new Date();

    const insertResult = await db.query(
      `INSERT INTO users (id, name, email, password_hash, phone, role, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'customer', true, $6, $6)
       RETURNING id, name, email, phone, role`,
      [userId, name.trim(), email.toLowerCase().trim(), passwordHash, phone || null, now]
    );

    const user = insertResult.rows[0];
    const token = generateToken(user.id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Welcome to Loop & Love!',
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.',
      });
    }

    const result = await db.query(
      `SELECT id, name, email, password_hash, phone, role, is_active
       FROM users WHERE email = $1`,
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        error: 'Your account has been deactivated. Please contact customer care.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    const token = generateToken(user.id, user.role);

    // Fetch primary address if exists
    const addressRes = await db.query(
      `SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC LIMIT 1`,
      [user.id]
    );

    res.json({
      success: true,
      message: 'Signed in successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        defaultAddress: addressRes.rows[0] || null,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const addressRes = await db.query(
      `SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      user: {
        ...req.user,
        addresses: addressRes.rows,
        defaultAddress: addressRes.rows.find((a) => a.is_default) || addressRes.rows[0] || null,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { name, phone } = req.body;
    const now = new Date();

    const result = await db.query(
      `UPDATE users
       SET name = COALESCE($1, name), phone = COALESCE($2, phone), updated_at = $3
       WHERE id = $4
       RETURNING id, name, email, phone, role`,
      [name?.trim(), phone?.trim(), now, req.user.id]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

export async function getAddresses(req, res, next) {
  try {
    const result = await db.query(
      `SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, addresses: result.rows });
  } catch (err) {
    next(err);
  }
}

export async function addAddress(req, res, next) {
  try {
    const { fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = req.body;

    if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        error: 'Please complete all required delivery address fields.',
      });
    }

    const addrId = `addr_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
    const now = new Date();

    if (isDefault) {
      await db.query(`UPDATE addresses SET is_default = false WHERE user_id = $1`, [req.user.id]);
    }

    const result = await db.query(
      `INSERT INTO addresses (id, user_id, full_name, phone, address_line1, address_line2, city, state, pincode, is_default, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11)
       RETURNING *`,
      [
        addrId,
        req.user.id,
        fullName.trim(),
        phone.trim(),
        addressLine1.trim(),
        addressLine2 ? addressLine2.trim() : null,
        city.trim(),
        state.trim(),
        pincode.trim(),
        !!isDefault,
        now,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Delivery address saved successfully.',
      address: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteAddress(req, res, next) {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM addresses WHERE id = $1 AND user_id = $2`, [id, req.user.id]);
    res.json({ success: true, message: 'Address removed successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required.' });
    }

    const userRes = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (userRes.rows.length > 0) {
      const user = userRes.rows[0];
      const token = uuidv4();
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour
      await db.query(
        `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at, is_used)
         VALUES ($1, $2, $3, $4, false)`,
        [`tok_${uuidv4().slice(0, 16)}`, user.id, token, expiresAt]
      );
    }

    res.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been dispatched.',
    });
  } catch (err) {
    next(err);
  }
}

