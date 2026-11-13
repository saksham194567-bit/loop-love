import db from '../config/db.js';

export async function getAllCategories(req, res, next) {
  try {
    const result = await db.query(`
      SELECT c.*,
        COUNT(p.id) FILTER (WHERE p.is_published = true) as "itemCount"
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      WHERE c.is_active = true
      GROUP BY c.id
      ORDER BY c.display_order ASC
    `);

    res.json({
      success: true,
      categories: result.rows,
    });
  } catch (err) {
    next(err);
  }
}

export async function getCategoryBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const result = await db.query(
      `SELECT c.*,
        COUNT(p.id) FILTER (WHERE p.is_published = true) as "itemCount"
       FROM categories c
       LEFT JOIN products p ON c.id = p.category_id
       WHERE c.slug = $1
       GROUP BY c.id`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Category not found.' });
    }

    res.json({
      success: true,
      category: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

