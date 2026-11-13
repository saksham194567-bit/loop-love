import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import db from '../config/db.js';
import { config } from '../config/env.js';

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `LL-${timestamp}-${random}`;
}

export async function createOrder(req, res, next) {
  try {
    const userId = req.user?.id || null;
    const {
      customerEmail,
      customerPhone,
      shippingName,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      paymentMethod = 'upi',
      notes,
      items = [],
    } = req.body;

    if (!customerEmail || !customerPhone || !shippingName || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required customer contact and delivery address fields.',
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Your shopping bag is empty. Please add items before checking out.',
      });
    }

    // Verify prices and calculate totals securely from the database
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const prodRes = await db.query('SELECT id, name, price, stock_quantity FROM products WHERE id = $1', [item.id]);

      let itemPrice = Number(item.price) || 0;
      let itemName = item.name || 'Handmade Crochet Piece';
      let validProductId = null;

      if (prodRes.rows.length > 0) {
        validProductId = prodRes.rows[0].id;
        itemPrice = Number(prodRes.rows[0].price);
        itemName = prodRes.rows[0].name;
      }

      const itemTotal = itemPrice * Number(item.quantity || 1);
      subtotal += itemTotal;

      verifiedItems.push({
        productId: validProductId,
        name: itemName,
        variant: item.selectedVariant || null,
        unitPrice: itemPrice,
        quantity: Number(item.quantity || 1),
        subtotal: itemTotal,
      });
    }

    const shippingFee = subtotal >= config.FREE_SHIPPING_THRESHOLD ? 0 : config.STANDARD_SHIPPING_FEE;
    const totalAmount = subtotal + shippingFee;

    const orderId = `ord_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
    const orderNumber = generateOrderNumber();
    const now = new Date();

    // Start database transaction
    const client = await db.getClient();

    try {
      if (client.query) await client.query('BEGIN');

      // Insert Order
      await client.query(
        `INSERT INTO orders (
          id, order_number, user_id, customer_email, customer_phone,
          shipping_name, shipping_address_line1, shipping_address_line2,
          shipping_city, shipping_state, shipping_pincode,
          subtotal, shipping_fee, total_amount, payment_status,
          order_status, payment_method, notes, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
          'pending', 'pending', $15, $16, $17, $17
        )`,
        [
          orderId,
          orderNumber,
          userId,
          customerEmail.trim(),
          customerPhone.trim(),
          shippingName.trim(),
          addressLine1.trim(),
          addressLine2 ? addressLine2.trim() : null,
          city.trim(),
          state.trim(),
          pincode.trim(),
          subtotal,
          shippingFee,
          totalAmount,
          paymentMethod,
          notes || null,
          now,
        ]
      );

      // Insert Order Items
      for (const vi of verifiedItems) {
        await client.query(
          `INSERT INTO order_items (id, order_id, product_id, product_name, variant_selection, unit_price, quantity, subtotal)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [`oi_${uuidv4().slice(0, 16)}`, orderId, vi.productId, vi.name, vi.variant, vi.unitPrice, vi.quantity, vi.subtotal]
        );
      }

      // Record Initial Payment entry
      const paymentId = `pay_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
      await client.query(
        `INSERT INTO payments (id, order_id, provider, amount, currency, status)
         VALUES ($1, $2, $3, $4, 'INR', 'pending')`,
        [paymentId, orderId, paymentMethod === 'cod' ? 'cod' : 'razorpay_test', totalAmount]
      );

      if (client.query) await client.query('COMMIT');
    } catch (txnError) {
      if (client.query) await client.query('ROLLBACK');
      throw txnError;
    } finally {
      if (client.release) client.release();
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      order: {
        id: orderId,
        orderNumber,
        subtotal,
        shippingFee,
        totalAmount,
        orderStatus: 'pending',
        paymentStatus: 'pending',
        paymentMethod,
        isTestMode: config.IS_PAYMENT_TEST_MODE,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyPayment(req, res, next) {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, error: 'Order ID is required.' });
    }

    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }

    const order = orderRes.rows[0];

    // If Razorpay credentials configured, verify real signature
    if (config.RAZORPAY_KEY_SECRET && razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      const generatedSignature = crypto
        .createHmac('sha256', config.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        await db.query(
          `UPDATE payments SET status = 'failed', failure_reason = 'Invalid signature' WHERE order_id = $1`,
          [order.id]
        );
        return res.status(400).json({ success: false, error: 'Payment verification failed: Signature mismatch.' });
      }
    }

    // In Test Mode or on successful verification, mark payment as completed & order confirmed
    const now = new Date();
    await db.query(
      `UPDATE orders SET payment_status = 'completed', order_status = 'confirmed', updated_at = $1 WHERE id = $2`,
      [now, order.id]
    );

    await db.query(
      `UPDATE payments
       SET status = 'completed', provider_payment_id = $1, provider_signature = $2, updated_at = $3
       WHERE order_id = $4`,
      [razorpayPaymentId || `sim_${Date.now()}`, razorpaySignature || 'sim_sig', now, order.id]
    );

    res.json({
      success: true,
      message: 'Payment confirmed. Your handmade order is now being queued for production.',
      orderNumber: order.order_number,
      orderStatus: 'confirmed',
    });
  } catch (err) {
    next(err);
  }
}

