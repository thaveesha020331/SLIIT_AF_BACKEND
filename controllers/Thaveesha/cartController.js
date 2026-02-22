/**
 * Cart controller – Thaveesha
 * Handles GET cart, add item, update qty, remove item.
 * Depends: User (Tudakshana – req.user), Product (Lakna).
 */
import mongoose from 'mongoose';
import Cart from '../../models/Thaveesha/Cart.js';
import Product from '../../models/Lakna/Product.js';

const isValidObjectId = (id) =>
  id && mongoose.Types.ObjectId.isValid(id) && String(id).length === 24;

/**
 * Get current user's cart (populated with product details)
 * @route GET /api/cart
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'title price image',
      match: { isActive: true },
    });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    // Filter out items whose product was removed or inactive
    const validItems = (cart.items || []).filter((item) => item.product);
    if (validItems.length !== (cart.items || []).length) {
      cart.items = validItems;
      await cart.save();
    }

    const items = (cart.items || []).map((item) => ({
      _id: item._id,
      product: item.product
        ? {
            _id: item.product._id,
            title: item.product.title,
            price: item.product.price,
            image: item.product.image,
          }
        : null,
      quantity: item.quantity,
    }));

    res.status(200).json({ items });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cart',
      error: error.message,
    });
  }
};

/**
 * Add item to cart (or update quantity if already in cart)
 * @route POST /api/cart/add
 * Body: { productId, quantity }
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    if (!isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID. Please choose a product from the product list and try again.',
      });
    }

    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or inactive',
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += qty;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();

    const updated = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'title price image',
    });

    const items = (updated.items || []).map((item) => ({
      _id: item._id,
      product: item.product
        ? {
            _id: item.product._id,
            title: item.product.title,
            price: item.product.price,
            image: item.product.image,
          }
        : null,
      quantity: item.quantity,
    }));

    res.status(200).json({ success: true, items });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to cart',
      error: error.message,
    });
  }
};

/**
 * Update cart item quantity
 * @route PUT /api/cart
 * Body: { itemId, quantity }
 */
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, quantity } = req.body;

    if (!itemId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and quantity are required',
      });
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    item.quantity = qty;
    await cart.save();

    const updated = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'title price image',
    });

    const items = (updated.items || []).map((item) => ({
      _id: item._id,
      product: item.product
        ? {
            _id: item.product._id,
            title: item.product.title,
            price: item.product.price,
            image: item.product.image,
          }
        : null,
      quantity: item.quantity,
    }));

    res.status(200).json({ success: true, items });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart',
      error: error.message,
    });
  }
};

/**
 * Remove item from cart
 * @route DELETE /api/cart/item/:itemId
 */
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items.pull(itemId);
    await cart.save();

    const updated = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'title price image',
    });

    const items = (updated.items || []).map((item) => ({
      _id: item._id,
      product: item.product
        ? {
            _id: item.product._id,
            title: item.product.title,
            price: item.product.price,
            image: item.product.image,
          }
        : null,
      quantity: item.quantity,
    }));

    res.status(200).json({ success: true, items });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item',
      error: error.message,
    });
  }
};
