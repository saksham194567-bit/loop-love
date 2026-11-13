import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import db from '../config/db.js';

export async function authenticateAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Administrator credentials required. Access denied.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.ADMIN_JWT_SECRET);

    const result = await db.query(
      'SELECT id, username, email, role, is_active FROM admin_users WHERE id = $1',
      [decoded.adminId]
    );

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized. Admin account is inactive or does not exist.',
      });
    }

    req.admin = result.rows[0];
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired administrative authorization session.',
    });
  }
}

