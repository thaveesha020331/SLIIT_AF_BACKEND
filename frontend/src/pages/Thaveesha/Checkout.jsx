import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../../services/Thaveesha';
import PaymentForm from '../../components/Thaveesha/PaymentForm';
import { downloadReceiptHTML, downloadReceiptCSV, printReceipt } from '../../utils/receiptGenerator';
import './Checkout.css';

export default function Checkout() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrderById(orderId);
      setOrder(response.data || response);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order');
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (details) => {
    console.log('✅ Checkout: Payment successful!', details);
    setPaymentDetails(details);
    setPaymentSuccess(true);
    setError(null);

    // Redirect to order confirmation after 2 seconds
    setTimeout(() => {
      console.log('🔄 Redirecting to order details...');
      navigate(`/my-orders/${orderId}`, { 
        state: { 
          paymentSuccess: true,
          paymentDetails: details 
        } 
      });
    }, 2000);
  };

  const handlePaymentError = (errorMessage) => {
    console.log('❌ Checkout: Payment error!', errorMessage);
    setError(errorMessage);
    setPaymentSuccess(false);
  };

  const handleDownloadReceipt = () => {
    if (order && paymentDetails) {
      const success = downloadReceiptHTML(order, paymentDetails);
      if (success) {
        console.log('✅ Receipt downloaded successfully');
      } else {
        console.error('❌ Failed to download receipt');
      }
    }
  };

  const handleDownloadReceiptCSV = () => {
    if (order && paymentDetails) {
      const success = downloadReceiptCSV(order, paymentDetails);
      if (success) {
        console.log('✅ Receipt CSV downloaded successfully');
      } else {
        console.error('❌ Failed to download receipt CSV');
      }
    }
  };

  const handlePrintReceipt = () => {
    if (order && paymentDetails) {
      const success = printReceipt(order, paymentDetails);
      if (success) {
        console.log('✅ Receipt printed successfully');
      } else {
        console.error('❌ Failed to print receipt');
      }
    }
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="loading-state">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="error-state">Order not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Complete Your Payment</h1>
          <p>Order #{order._id}</p>
        </div>

        <div className="checkout-content">
          {/* Order Summary */}
          <div className="order-summary-section">
            <h2>Order Summary</h2>
            <div className="order-items">
              {order.items?.map((item) => (
                <div key={item._id || item.product._id} className="order-item">
                  <img 
                    src={item.product?.image || 'https://via.placeholder.com/80'} 
                    alt={item.product?.title}
                    className="item-image"
                  />
                  <div className="item-details">
                    <h4>{item.product?.title}</h4>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    ${(item.priceSnapshot * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary-details">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="shipping-info">
              <h3>Shipping Address</h3>
              <p>{order.shippingAddress}</p>
              <p>Phone: {order.phone}</p>
            </div>
          </div>

          {/* Payment Form */}
          <div className="payment-section">
            {paymentSuccess ? (
              <div className="payment-success-state">
                <div className="success-icon">✓</div>
                <h2>Payment Successful!</h2>
                <p className="success-message">{paymentDetails?.message}</p>
                <div className="payment-info">
                  <p><strong>Payment Method:</strong> {paymentDetails?.method === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}</p>
                  <p><strong>Transaction ID:</strong> {paymentDetails?.transactionId}</p>
                  <p><strong>Amount:</strong> LKR {order.total.toFixed(2)}</p>
                </div>
                
                <div className="receipt-actions">
                  <button 
                    className="btn-download-receipt"
                    onClick={handleDownloadReceipt}
                    title="Download receipt as HTML"
                  >
                    📥 Download Receipt
                  </button>
                  <button 
                    className="btn-download-receipt btn-download-csv"
                    onClick={handleDownloadReceiptCSV}
                    title="Download receipt as CSV"
                  >
                    📊 Download CSV
                  </button>
                  <button 
                    className="btn-download-receipt btn-print"
                    onClick={handlePrintReceipt}
                    title="Print receipt"
                  >
                    🖨️ Print Receipt
                  </button>
                </div>
                
                <p className="redirect-message">Redirecting to order details...</p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="payment-error-message">
                    <strong>Error:</strong> {error}
                  </div>
                )}
                <PaymentForm
                  orderId={orderId}
                  orderTotal={order.total}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
