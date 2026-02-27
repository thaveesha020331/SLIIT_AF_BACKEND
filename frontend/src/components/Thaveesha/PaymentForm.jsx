import React, { useState } from 'react';
import './PaymentForm.css';
import paymentAPI from '../../services/Thaveesha/paymentService';

export default function PaymentForm({ orderId, orderTotal, onPaymentSuccess, onPaymentError }) {
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});

  const validateCardDetails = () => {
    const newErrors = {};

    if (!cardDetails.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardDetails.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Invalid card number';
    }

    if (!cardDetails.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    if (!cardDetails.expiryMonth) {
      newErrors.expiryMonth = 'Expiry month is required';
    }

    if (!cardDetails.expiryYear) {
      newErrors.expiryYear = 'Expiry year is required';
    }

    if (!cardDetails.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (cardDetails.cvv.length < 3 || cardDetails.cvv.length > 4) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces every 4 digits
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      setCardDetails({
        ...cardDetails,
        [name]: formatted,
      });
    } else if (name === 'cvv') {
      // Only allow numbers for CVV
      setCardDetails({
        ...cardDetails,
        [name]: value.replace(/\D/g, '').slice(0, 4),
      });
    } else {
      setCardDetails({
        ...cardDetails,
        [name]: value,
      });
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleCardPayment = async (e) => {
    e.preventDefault();

    if (!validateCardDetails()) {
      return;
    }

    setLoading(true);
    console.log('🔵 Card payment handler started with orderId:', orderId);
    console.log('Card details:', { ...cardDetails, cardNumber: cardDetails.cardNumber.slice(-4).padStart(cardDetails.cardNumber.length, '*') });
    
    try {
      console.log('📡 Calling processCardPayment...');
      const response = await paymentAPI.processCardPayment(orderId, cardDetails);
      console.log('✅ Card payment API Response:', response);
      
      if (response.success) {
        console.log('✅ Payment successful!');
        onPaymentSuccess({
          paymentId: response.payment._id,
          transactionId: response.payment.transactionId,
          status: response.payment.status,
          method: 'card',
          message: response.message,
        });
      } else {
        console.log('❌ Payment not successful:', response.message);
        onPaymentError(response.message);
      }
    } catch (error) {
      console.error('❌ Card payment API Error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Payment failed';
      console.log('Error message to show:', errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCashOnDelivery = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('🔵 COD handler started with orderId:', orderId);

    try {
      console.log('📡 Calling processCashOnDelivery...');
      const response = await paymentAPI.processCashOnDelivery(orderId);
      console.log('✅ COD API Response:', response);

      if (response.success) {
        console.log('✅ Payment successful!');
        onPaymentSuccess({
          paymentId: response.payment._id,
          transactionId: response.payment.transactionId,
          status: response.payment.status,
          method: 'cash_on_delivery',
          message: response.message,
        });
      } else {
        console.log('❌ Payment not successful:', response.message);
        onPaymentError(response.message);
      }
    } catch (error) {
      console.error('❌ COD API Error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'COD confirmation failed';
      console.log('Error message to show:', errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <div className="payment-form-container">
      <div className="payment-header">
        <h2>Select Payment Method</h2>
        <p className="order-total">Order Total: <strong>${orderTotal.toFixed(2)}</strong></p>
      </div>

      <div className="payment-methods">
        {/* Cash on Delivery */}
        <div 
          className={`payment-method-card ${paymentMethod === 'cash_on_delivery' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('cash_on_delivery')}
        >
          <input
            type="radio"
            id="cod"
            name="paymentMethod"
            value="cash_on_delivery"
            checked={paymentMethod === 'cash_on_delivery'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label htmlFor="cod">
            <div className="payment-icon">💵</div>
            <div className="payment-info">
              <h3>Cash on Delivery</h3>
              <p>Pay when your order arrives</p>
            </div>
          </label>
        </div>

        {/* Card Payment */}
        <div 
          className={`payment-method-card ${paymentMethod === 'card' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('card')}
        >
          <input
            type="radio"
            id="card"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label htmlFor="card">
            <div className="payment-icon">💳</div>
            <div className="payment-info">
              <h3>Credit/Debit Card</h3>
              <p>Visa, Mastercard, Amex</p>
            </div>
          </label>
        </div>
      </div>

      {/* Card Details Form */}
      {paymentMethod === 'card' && (
        <form className="card-details-form" onSubmit={handleCardPayment}>
          <div className="form-section">
            <h3>Enter Card Details</h3>

            <div className="form-group">
              <label>Cardholder Name *</label>
              <input
                type="text"
                name="cardholderName"
                value={cardDetails.cardholderName}
                onChange={handleCardInputChange}
                placeholder="John Doe"
                className={errors.cardholderName ? 'input-error' : ''}
              />
              {errors.cardholderName && <span className="error-message">{errors.cardholderName}</span>}
            </div>

            <div className="form-group">
              <label>Card Number *</label>
              <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleCardInputChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                className={errors.cardNumber ? 'input-error' : ''}
              />
              {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Month *</label>
                <select
                  name="expiryMonth"
                  value={cardDetails.expiryMonth}
                  onChange={handleCardInputChange}
                  className={errors.expiryMonth ? 'input-error' : ''}
                >
                  <option value="">Select Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      {String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
                {errors.expiryMonth && <span className="error-message">{errors.expiryMonth}</span>}
              </div>

              <div className="form-group">
                <label>Expiry Year *</label>
                <select
                  name="expiryYear"
                  value={cardDetails.expiryYear}
                  onChange={handleCardInputChange}
                  className={errors.expiryYear ? 'input-error' : ''}
                >
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={String(year)}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.expiryYear && <span className="error-message">{errors.expiryYear}</span>}
              </div>

              <div className="form-group">
                <label>CVV *</label>
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardInputChange}
                  placeholder="123"
                  maxLength="4"
                  className={errors.cvv ? 'input-error' : ''}
                />
                {errors.cvv && <span className="error-message">{errors.cvv}</span>}
              </div>
            </div>

            <p className="security-note">🔒 Your card details are secure and encrypted</p>

            <button
              type="submit"
              className="btn-pay"
              disabled={loading}
            >
              {loading ? 'Processing...' : `Pay $${orderTotal.toFixed(2)}`}
            </button>
          </div>
        </form>
      )}

      {/* Cash on Delivery Confirmation */}
      {paymentMethod === 'cash_on_delivery' && (
        <form className="cod-form" onSubmit={handleCashOnDelivery}>
          <div className="cod-info">
            <h3>Cash on Delivery</h3>
            <p>You will pay <strong>${orderTotal.toFixed(2)}</strong> when your order is delivered.</p>
            <ul className="cod-benefits">
              <li>✓ No upfront payment required</li>
              <li>✓ Inspect items before payment</li>
              <li>✓ Pay to the delivery agent</li>
            </ul>
          </div>

          <button
            type="submit"
            className="btn-confirm-cod"
            disabled={loading}
          >
            {loading ? 'Confirming...' : 'Confirm Cash on Delivery'}
          </button>
        </form>
      )}
    </div>
  );
}
