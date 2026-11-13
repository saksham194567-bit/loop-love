import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';

export async function getAllProducts(req, res, next) {
  try {
    const { category, search, sort, isPublishedOnly = 'true' } = req.query;

    let sql = `
      SELECT p.*,
        c.name as category_name,
        c.slug as category_slug,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pi.id,
              'imageUrl', pi.image_url,
              'altText', pi.alt_text,
              'isPrimary', pi.is_primary
            ) ORDER BY pi.display_order ASC
          ) FILTER (WHERE pi.id IS NOT NULL), '[]'
        ) as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
    `;

    const whereClauses = [];
    const params = [];

    if (isPublishedOnly === 'true') {
      whereClauses.push('p.is_published = true');
    }

    if (category && category !== 'all') {
      params.push(category);
      whereClauses.push(`c.slug = $${params.length}`);
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      whereClauses.push(`(LOWER(p.name) LIKE $${params.length} OR LOWER(p.description) LIKE $${params.length})`);
    }

    if (whereClauses.length > 0) {
      sql += ` WHERE ` + whereClauses.join(' AND ');
    }

    sql += ` GROUP BY p.id, c.name, c.slug`;

    if (sort === 'price-low') {
      sql += ` ORDER BY p.price ASC`;
    } else if (sort === 'price-high') {
      sql += ` ORDER BY p.price DESC`;
    } else if (sort === 'newest') {
      sql += ` ORDER BY p.created_at DESC`;
    } else {
      sql += ` ORDER BY p.is_featured DESC, p.created_at DESC`;
    }

    const result = await db.query(sql, params);

    res.json({
      success: true,
      count: result.rows.length,
      products: result.rows,
    });
  } catch (err) {
    next(err);
  }
}

export async function getProductBySlug(req, res, next) {
  try {
    const { slug } = req.params;

    const prodRes = await db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1`,
      [slug]
    );

    if (prodRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Handmade crochet product not found.',
      });
    }

    const product = prodRes.rows[0];

    // Fetch images and variants
    const [imagesRes, variantsRes] = await Promise.all([
      db.query(
        `SELECT id, image_url as "imageUrl", alt_text as "altText", is_primary as "isPrimary"
         FROM product_images WHERE product_id = $1 ORDER BY display_order ASC`,
        [product.id]
      ),
      db.query(
        `SELECT id, variant_type as "variantType", variant_value as "variantValue", additional_price as "additionalPrice"
         FROM product_variants WHERE product_id = $1 ORDER BY variant_type, id`,
        [product.id]
      ),
    ]);

    product.images = imagesRes.rows;
    product.variants = variantsRes.rows;

    res.json({
      success: true,
      product,
    });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const {
      name,
      slug,
      categoryId,
      price,
      compareAtPrice,
      shortDescription,
      description,
      yarnMaterial,
      dimensions,
      leadTimeDays = 4,
      availability = 'made_to_order',
      isFeatured = false,
      isPublished = true,
      stockQuantity = 5,
      images = [],
      variants = [],
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Product name and price are required.',
      });
    }

    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const productId = `prod_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
    const now = new Date();

    // Check unique slug
    const slugCheck = await db.query('SELECT id FROM products WHERE slug = $1', [finalSlug]);
    if (slugCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'A product with this URL slug already exists. Please customize the slug.',
      });
    }

    // Resolve category id if slug was passed
    let resolvedCategoryId = categoryId;
    if (categoryId && !categoryId.startsWith('cat_')) {
      const catCheck = await db.query('SELECT id FROM categories WHERE slug = $1', [categoryId]);
      if (catCheck.rows.length > 0) resolvedCategoryId = catCheck.rows[0].id;
    }

    const result = await db.query(
      `INSERT INTO products (
        id, name, slug, category_id, price, compare_at_price,
        short_description, description, yarn_material, dimensions,
        lead_time_days, availability, is_featured, is_published,
        stock_quantity, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $16
      ) RETURNING *`,
      [
        productId,
        name.trim(),
        finalSlug,
        resolvedCategoryId || null,
        Number(price),
        compareAtPrice ? Number(compareAtPrice) : null,
        shortDescription || null,
        description || null,
        yarnMaterial || '100% Combed Milk Cotton',
        dimensions || 'Approx. 8cm x 5cm',
        Number(leadTimeDays) || 4,
        availability,
        !!isFeatured,
        !!isPublished,
        Number(stockQuantity) || 0,
        now,
      ]
    );

    const product = result.rows[0];

    // Insert image URLs
    const imageList = Array.isArray(images) && images.length > 0 ? images : ['/logo.png'];
    for (let i = 0; i < imageList.length; i++) {
      const imgUrl = typeof imageList[i] === 'string' ? imageList[i] : imageList[i].imageUrl;
      await db.query(
        `INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [`img_${uuidv4().slice(0, 16)}`, productId, imgUrl, name, i, i === 0]
      );
    }

    // Insert variants
    if (Array.isArray(variants)) {
      for (const v of variants) {
        await db.query(
          `INSERT INTO product_variants (id, product_id, variant_type, variant_value, additional_price, stock_quantity)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [`var_${uuidv4().slice(0, 16)}`, productId, v.type || 'Colorway', v.value, Number(v.additionalPrice) || 0, 10]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Product listing published successfully.',
      product,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      compareAtPrice,
      shortDescription,
      description,
      yarnMaterial,
      dimensions,
      leadTimeDays,
      availability,
      isFeatured,
      isPublished,
      stockQuantity,
    } = req.body;
    const now = new Date();

    const result = await db.query(
      `UPDATE products
       SET name = COALESCE($1, name),
           price = COALESCE($2, price),
           compare_at_price = COALESCE($3, compare_at_price),
           short_description = COALESCE($4, short_description),
           description = COALESCE($5, description),
           yarn_material = COALESCE($6, yarn_material),
           dimensions = COALESCE($7, dimensions),
           lead_time_days = COALESCE($8, lead_time_days),
           availability = COALESCE($9, availability),
           is_featured = COALESCE($10, is_featured),
           is_published = COALESCE($11, is_published),
           stock_quantity = COALESCE($12, stock_quantity),
           updated_at = $13
       WHERE id = $14
       RETURNING *`,
      [
        name,
        price !== undefined ? Number(price) : null,
        compareAtPrice !== undefined ? Number(compareAtPrice) : null,
        shortDescription,
        description,
        yarnMaterial,
        dimensions,
        leadTimeDays !== undefined ? Number(leadTimeDays) : null,
        availability,
        isFeatured,
        isPublished,
        stockQuantity !== undefined ? Number(stockQuantity) : null,
        now,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully.',
      product: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

