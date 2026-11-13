import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';

export async function subscribeNewsletter(req, res, next) {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await db.query('SELECT id FROM newsletter_subscribers WHERE email = $1', [cleanEmail]);

    if (existing.rows.length === 0) {
      await db.query(
        `INSERT INTO newsletter_subscribers (id, email, is_active, subscribed_at)
         VALUES ($1, $2, true, CURRENT_TIMESTAMP)`,
        [`sub_${uuidv4().slice(0, 16)}`, cleanEmail]
      );
    }

    res.json({
      success: true,
      message: "You've been added to our VIP Stitch Circle! You will be notified when small-batch pieces are ready.",
    });
  } catch (err) {
    next(err);
  }
}

