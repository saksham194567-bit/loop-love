import db from '../config/db.js';

export async function trackOrderByNumber(req, res, next) {
  try {
    const { orderNumber } = req.params;

    const result = await db.query(
      `SELECT o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'productName', oi.product_name,
            'variant', oi.variant_selection,
            'quantity', oi.quantity,
            'unitPrice', oi.unit_price,
            'subtotal', oi.subtotal
          )
        ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE LOWER(o.order_number) = $1
       GROUP BY o.id`,
      [orderNumber.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No order found with tracking number "${orderNumber}". Please verify your Order ID.`,
      });
    }

    const order = result.rows[0];

    // Build realistic artisan milestone timeline based on database order_status
    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIdx = statusOrder.indexOf(order.order_status);

    const timeline = [
      {
        stage: 1,
        title: 'Order Confirmed & Yarn Allocated',
        description: 'Cotton skeins allocated in our studio craft queue.',
        date: order.created_at,
        completed: currentIdx >= 1,
      },
      {
        stage: 2,
        title: 'Handcrafting by Studio Artisan',
        description: 'Single-crochet loops stitched with micro-hook and tight tension.',
        date: currentIdx >= 2 ? order.updated_at : 'In Craft Queue',
        completed: currentIdx >= 2,
      },
      {
        stage: 3,
        title: 'Artisanal Finishing & Inspection',
        description: 'Thread ends woven, tension inspected, and hypoallergenic stuffing secured.',
        date: currentIdx >= 2 ? 'Completed' : 'Pending Finishing',
        completed: currentIdx >= 2,
      },
      {
        stage: 4,
        title: 'Packed With Love & Handed to Courier',
        description: 'Nested in protective wrap with a handwritten care card.',
        date: currentIdx >= 3 ? order.updated_at : 'Pending Dispatch',
        completed: currentIdx >= 3,
      },
      {
        stage: 5,
        title: 'Delivered to Doorstep',
        description: `Delivered safely to ${order.shipping_city}, ${order.shipping_state}.`,
        date: currentIdx >= 4 ? order.updated_at : 'Estimated within 5-9 days',
        completed: currentIdx >= 4,
      },
    ];

    res.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        createdAt: order.created_at,
        orderStatus: order.order_status,
        paymentStatus: order.payment_status,
        shippingName: order.shipping_name,
        destination: `${order.shipping_city}, ${order.shipping_state}`,
        carrier: order.courier_name || 'Delhivery Tracked Air [Express]',
        awbNumber: order.tracking_number || 'Pending Dispatch',
        items: order.items,
        totalAmount: order.total_amount,
        timeline,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getMyOrders(req, res, next) {
  try {
    const result = await db.query(
      `SELECT o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'productName', oi.product_name,
            'variant', oi.variant_selection,
            'quantity', oi.quantity,
            'unitPrice', oi.unit_price,
            'subtotal', oi.subtotal
          )
        ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      orders: result.rows,
    });
  } catch (err) {
    next(err);
  }
}

