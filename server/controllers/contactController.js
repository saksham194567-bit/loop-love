import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';

export async function submitContactMessage(req, res, next) {
  try {
    const { name, email, phone, categoryInterest, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message content are required.',
      });
    }

    const messageId = `msg_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
    const now = new Date();

    await db.query(
      `INSERT INTO contact_messages (id, name, email, phone, category_interest, message, is_read, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, false, $7)`,
      [messageId, name.trim(), email.toLowerCase().trim(), phone ? phone.trim() : null, categoryInterest || 'general', message.trim(), now]
    );

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to Loop & Love! Your message has been received by our studio team.',
    });
  } catch (err) {
    next(err);
  }
}

