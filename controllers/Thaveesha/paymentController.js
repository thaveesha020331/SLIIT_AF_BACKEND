import Payment from '../../models/Thaveesha/Payment.js';
import Order from '../../models/Thaveesha/Order.js';

// Generate transaction ID
const generateTransactionId = () => {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// @desc    Process card payment
// @route   POST /api/payments/process-card
// @access  Protected
export const processCardPayment = async (req, res) => {
  try {
    const { orderId, cardNumber, expiryMonth, expiryYear, cvv, cardholderName } = req.body;
    const userId = req.user.id;

    // Validation
    if (!orderId || !cardNumber || !expiryMonth || !expiryYear || !cvv || !cardholderName) {
      return res.status(400).json({
        success: false,
        message: 'All card details are required',
      });
    }

    // Validate card number length (basic check)
    if (cardNumber.replace(/\s/g, '').length < 13 || cardNumber.replace(/\s/g, '').length > 19) {
      return res.status(400).json({
        success: false,
        message: 'Invalid card number',
      });
    }

    // Validate expiry
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
      return res.status(400).json({
        success: false,
        message: 'Card has expired',
      });
    }

    // Validate CVV
    if (cvv.length < 3 || cvv.length > 4 || isNaN(cvv)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid CVV',
      });
    }

    // Check if order exists
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if payment already exists for this order
    const existingPayment = await Payment.findOne({ order: orderId });
    if (existingPayment && existingPayment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed for this order',
      });
    }

    // Extract last 4 digits
    const last4 = cardNumber.replace(/\s/g, '').slice(-4);
    const cardBrand = detectCardBrand(cardNumber);

    // Generate transaction ID
    const transactionId = generateTransactionId();

    // Simulate card processing (In production, integrate with Stripe/PayPal)
    // For demo: randomly succeed or fail (90% success rate)
    const isPaymentSuccessful = Math.random() < 0.9;

    let payment;
    if (isPaymentSuccessful) {
      // Create or update payment record
      if (existingPayment) {
        payment = await Payment.findByIdAndUpdate(
          existingPayment._id,
          {
            amount: order.total,
            paymentMethod: 'card',
            status: 'completed',
            transactionId,
            cardDetails: {
              last4Digits: last4,
              cardBrand,
              expiryMonth: parseInt(expiryMonth),
              expiryYear: parseInt(expiryYear),
            },
            paymentDate: new Date(),
          },
          { new: true }
        );
      } else {
        payment = await Payment.create({
          order: orderId,
          user: userId,
          amount: order.total,
          paymentMethod: 'card',
          status: 'completed',
          transactionId,
          cardDetails: {
            last4Digits: last4,
            cardBrand,
            expiryMonth: parseInt(expiryMonth),
            expiryYear: parseInt(expiryYear),
          },
          paymentDate: new Date(),
        });
      }

      // Update order payment status
      await Order.findByIdAndUpdate(orderId, {
        payment: payment._id,
        paymentStatus: 'completed',
      });

      res.status(200).json({
        success: true,
        message: 'Payment processed successfully',
        payment: {
          _id: payment._id,
          transactionId: payment.transactionId,
          amount: payment.amount,
          status: payment.status,
          cardBrand: payment.cardDetails.cardBrand,
          last4Digits: payment.cardDetails.last4Digits,
        },
      });
    } else {
      // Payment failed
      const failureReasons = [
        'Insufficient funds',
        'Card declined',
        'Invalid card details',
        'Transaction declined by bank',
      ];
      const failureReason = failureReasons[Math.floor(Math.random() * failureReasons.length)];

      if (existingPayment) {
        await Payment.findByIdAndUpdate(
          existingPayment._id,
          {
            status: 'failed',
            failureReason,
          }
        );
      } else {
        await Payment.create({
          order: orderId,
          user: userId,
          amount: order.total,
          paymentMethod: 'card',
          status: 'failed',
          failureReason,
        });
      }

      // Update order payment status
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'failed',
      });

      return res.status(400).json({
        success: false,
        message: `Payment failed: ${failureReason}`,
      });
    }
  } catch (error) {
    console.error('Card payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment',
      error: error.message,
    });
  }
};

// @desc    Process cash on delivery
// @route   POST /api/payments/process-cod
// @access  Protected
export const processCashOnDelivery = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    // Check if order exists
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ order: orderId });
    if (existingPayment && existingPayment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed for this order',
      });
    }

    const transactionId = generateTransactionId();

    let payment;
    if (existingPayment) {
      payment = await Payment.findByIdAndUpdate(
        existingPayment._id,
        {
          amount: order.total,
          paymentMethod: 'cash_on_delivery',
          status: 'completed',
          transactionId,
          paymentDate: new Date(),
        },
        { new: true }
      );
    } else {
      payment = await Payment.create({
        order: orderId,
        user: userId,
        amount: order.total,
        paymentMethod: 'cash_on_delivery',
        status: 'completed',
        transactionId,
        paymentDate: new Date(),
      });
    }

    // Update order payment status
    await Order.findByIdAndUpdate(orderId, {
      payment: payment._id,
      paymentStatus: 'completed',
    });

    res.status(200).json({
      success: true,
      message: 'Cash on delivery confirmed',
      payment: {
        _id: payment._id,
        transactionId: payment.transactionId,
        amount: payment.amount,
        status: payment.status,
        paymentMethod: 'cash_on_delivery',
      },
    });
  } catch (error) {
    console.error('COD payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming cash on delivery',
      error: error.message,
    });
  }
};

// @desc    Get payment status
// @route   GET /api/payments/:paymentId
// @access  Protected
export const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;

    const payment = await Payment.findOne({ _id: paymentId, user: userId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    res.status(200).json({
      success: true,
      payment: {
        _id: payment._id,
        order: payment.order,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        transactionId: payment.transactionId,
        paymentDate: payment.paymentDate,
        failureReason: payment.failureReason || null,
        cardDetails: payment.cardDetails || null,
      },
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment status',
      error: error.message,
    });
  }
};

// @desc    Get payment by order ID
// @route   GET /api/payments/order/:orderId
// @access  Protected
export const getPaymentByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    // Verify order belongs to user
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const payment = await Payment.findOne({ order: orderId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'No payment found for this order',
      });
    }

    res.status(200).json({
      success: true,
      payment: {
        _id: payment._id,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        transactionId: payment.transactionId,
        paymentDate: payment.paymentDate,
        failureReason: payment.failureReason || null,
        cardDetails: payment.cardDetails || null,
      },
    });
  } catch (error) {
    console.error('Get payment by order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment',
      error: error.message,
    });
  }
};

// @desc    Refund payment
// @route   POST /api/payments/:paymentId/refund
// @access  Protected
export const refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;

    const payment = await Payment.findOne({ _id: paymentId, user: userId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Only completed payments can be refunded',
      });
    }

    // Update payment status
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { status: 'cancelled' },
      { new: true }
    );

    // Update order payment status
    await Order.findByIdAndUpdate(payment.order, {
      paymentStatus: 'failed',
    });

    res.status(200).json({
      success: true,
      message: 'Payment refunded successfully',
      payment: {
        _id: updatedPayment._id,
        status: updatedPayment.status,
      },
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error refunding payment',
      error: error.message,
    });
  }
};

// Helper function to detect card brand
const detectCardBrand = (cardNumber) => {
  const number = cardNumber.replace(/\s/g, '');
  if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(number)) return 'Visa';
  if (/^5[1-5][0-9]{14}$/.test(number)) return 'Mastercard';
  if (/^3[47][0-9]{13}$/.test(number)) return 'American Express';
  if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(number)) return 'Discover';
  return 'Unknown';
};
