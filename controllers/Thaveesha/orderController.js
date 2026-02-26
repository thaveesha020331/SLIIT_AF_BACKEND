/**
 * Order controller – Thaveesha
 * Create order, list my orders, get by id, cancel. Uses User, Cart, Product (Lakna stock).
 */
import Order from '../../models/Thaveesha/Order.js';
import Cart from '../../models/Thaveesha/Cart.js';
import Product from '../../models/Lakna/Product.js';

/**
 * Create order from cart (or from body). Clears cart on success.
 * @route POST /api/orders
 * Body: { items: [{ productId, quantity }], shippingAddress, phone, notes }
 */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, shippingAddress, phone, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }
    if (!shippingAddress || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address and phone are required',
      });
    }

    const orderItems = [];
    let total = 0;

    for (const line of items) {
      const productId = line.productId || line.product;
      const quantity = Math.max(1, parseInt(line.quantity, 10) || 1);
      const product = await Product.findById(productId).select('price title stock');
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${productId}`,
        });
      }
      if (product.stock !== undefined && product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}. Available: ${product.stock}`,
        });
      }
      const priceSnapshot = product.price;
      orderItems.push({
        product: productId,
        quantity,
        priceSnapshot,
      });
      total += priceSnapshot * quantity;
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      total,
      status: 'pending',
      shippingAddress: shippingAddress.trim(),
      phone: String(phone).trim(),
      notes: (notes && String(notes).trim()) || '',
    });

    // Decrement stock (optional – align with Lakna Product schema)
    for (const line of orderItems) {
      await Product.findByIdAndUpdate(line.product, {
        $inc: { stock: -line.quantity },
      });
    }

    // Clear user's cart
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    const populated = await Order.findById(order._id)
      .populate('items.product', 'title price image')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: populated,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

/**
 * Get current user's orders
 * @route GET /api/orders/my-orders
 */
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId })
      .populate('items.product', 'title price image')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

/**
 * Get single order by ID (must belong to current user)
 * @route GET /api/orders/:id
 */
export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await Order.findOne({ _id: req.params.id, user: userId })
      .populate('items.product', 'title price image')
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message,
    });
  }
};

/**
 * Cancel order (set status to cancelled). Only pending/processing can be cancelled.
 * @route PATCH /api/orders/:id/cancel
 */
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await Order.findOne({ _id: req.params.id, user: userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled (current status: ${order.status})`,
      });
    }

    await Order.collection.updateOne(
      { _id: order._id },
      { $set: { status: 'cancelled', cancelledBy: 'user' } }
    );

    // Restore stock for cancelled order
    for (const line of order.items) {
      await Product.findByIdAndUpdate(line.product, {
        $inc: { stock: line.quantity },
      });
    }

    const populated = await Order.findById(order._id)
      .populate('items.product', 'title price image')
      .lean();

    res.status(200).json({
      success: true,
      message: 'Order cancelled',
      order: populated,
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message,
    });
  }
};
