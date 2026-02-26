/**
 * Admin Order Controller - Thaveesha
 * Admin can view all orders and update order status.
 */
import Order from '../../models/Thaveesha/Order.js';
import mongoose from 'mongoose';

const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

/**
 * Get all orders (admin only)
 * @route GET /api/admin/orders
 */
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status && VALID_STATUSES.includes(status)) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .populate('items.product', 'title price image')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      orders,
    });
  } catch (error) {
    console.error('Admin get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
    });
  }
};

/**
 * Get single order by ID (admin only)
 * @route GET /api/admin/orders/:id
 */
export const getOrderByIdAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'title price image')
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Admin get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
    });
  }
};

/**
 * Update order status (admin only)
 * @route PATCH /api/admin/orders/:id/status
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const objectId = new mongoose.Types.ObjectId(req.params.id);

    // Read directly from MongoDB collection so cancelledBy is visible
    // even though it is not declared in the Mongoose schema
    const rawOrder = await Order.collection.findOne({ _id: objectId });

    if (!rawOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Cannot change a delivered order to cancelled
    if (rawOrder.status === 'delivered' && status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a delivered order',
      });
    }

    // Cannot change an order that was cancelled by the user
    if (rawOrder.status === 'cancelled' && rawOrder.cancelledBy === 'user') {
      return res.status(400).json({
        success: false,
        message: 'Cannot change an order that was cancelled by the customer',
      });
    }

    // Build update fields — track who cancelled, clear when moving away from cancelled
    const updateFields = { status };
    if (status === 'cancelled') {
      updateFields.cancelledBy = 'admin';
    } else {
      updateFields.cancelledBy = null;
    }

    // Use collection.updateOne to bypass Mongoose strict mode
    await Order.collection.updateOne(
      { _id: objectId },
      { $set: updateFields }
    );

    const populated = await Order.findById(objectId)
      .populate('user', 'name email')
      .populate('items.product', 'title price image')
      .lean();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: populated,
    });
  } catch (error) {
    console.error('Admin update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
    });
  }
};