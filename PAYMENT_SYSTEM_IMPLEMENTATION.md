# Payment System - Quick Testing Guide

## 📋 Summary

A complete payment processing system is now integrated into the EcoMart platform. Users can choose between:
- **💳 Credit/Debit Card Payment** - Process payment immediately
- **💵 Cash on Delivery (COD)** - Pay when order arrives

---

## 🔧 SYSTEM COMPONENTS

### Backend
- **Model**: `models/Thaveesha/Payment.js` - Payment schema with full validation
- **Controller**: `controllers/Thaveesha/paymentController.js` - Payment processing logic
- **Routes**: `routes/Thaveesha/paymentRoutes.js` - Payment endpoints
- **Updated Order Model**: Added `payment` and `paymentStatus` fields

### Frontend
- **Component**: `components/Thaveesha/PaymentForm.jsx` - Payment UI form
- **CSS**: `components/Thaveesha/PaymentForm.css` - Beautiful styling
- **Service**: `services/Thaveesha/paymentService.js` - API calls
- **Page**: `pages/Thaveesha/Checkout.jsx` - Checkout page with payment
- **CSS**: `pages/Thaveesha/Checkout.css` - Checkout styling
- **Route**: Added in `App.jsx` - `/checkout/:orderId`

### Integration
- **Server**: Updated `Server.js` to register `/api/payments` routes
- **Cart**: Updated `Cart.jsx` to redirect to checkout after order creation

---

## 🚀 PAYMENT FLOW

1. User adds items to cart
2. User clicks "Place Order" on Cart
3. Order is created in database
4. User redirects to checkout page
5. **User selects payment method**:
   - **Card**: Enter card details
   - **COD**: Confirm cash on delivery
6. Payment is processed
7. Order status updates
8. User redirected to order details

---

## 📡 API ENDPOINTS

### 1. Process Card Payment
```
POST /api/payments/process-card
```
✅ Process credit/debit card payments

### 2. Process Cash on Delivery
```
POST /api/payments/process-cod
```
✅ Confirm cash on delivery payment

### 3. Get Payment Status
```
GET /api/payments/:paymentId
```
✅ Get specific payment details

### 4. Get Payment by Order ID
```
GET /api/payments/order/:orderId
```
✅ Get payment for an order

### 5. Refund Payment
```
POST /api/payments/:paymentId/refund
```
✅ Refund a completed payment

---

## 🧪 TESTING WITH POSTMAN

### Prerequisites
1. Server running: `npm run dev`
2. Postman installed
3. JWT token from login

### Step 1: Login and Get JWT Token
```
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "customer@test.com",
  "password": "customer123"
}
```

**Save the token from response** - You'll need it for all payment requests

---

### Step 2: Create an Order
```
POST http://localhost:5001/api/orders
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "items": [
    {
      "productId": "YOUR_PRODUCT_ID",
      "quantity": 2
    }
  ],
  "shippingAddress": "123 Main St, New York, NY 10001",
  "phone": "+1234567890",
  "notes": "Please deliver before 5 PM"
}
```

**Save the order ID from response** - You'll need it for payment

---

### Step 3a: Test Card Payment (SUCCESS CASE)
```
POST http://localhost:5001/api/payments/process-card
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "orderId": "YOUR_ORDER_ID",
  "cardNumber": "4532015112830366",
  "cardholderName": "John Doe",
  "expiryMonth": "12",
  "expiryYear": "2025",
  "cvv": "123"
}
```

**Expected:** ✅ 200 OK - Payment processed successfully

---

### Step 3b: Test Card Payment (FAILURE CASE)
```
POST http://localhost:5001/api/payments/process-card
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "orderId": "YOUR_ORDER_ID",
  "cardNumber": "4532015112830366",
  "cardholderName": "John Doe",
  "expiryMonth": "12",
  "expiryYear": "2020",
  "cvv": "123"
}
```

**Expected:** ❌ 400 Bad Request - Card has expired

---

### Step 3c: Test Cash on Delivery
```
POST http://localhost:5001/api/payments/process-cod
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "orderId": "YOUR_ORDER_ID"
}
```

**Expected:** ✅ 200 OK - Cash on delivery confirmed

---

### Step 4: Check Payment Status
```
GET http://localhost:5001/api/payments/order/YOUR_ORDER_ID
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected:** ✅ 200 OK - Returns payment details

---

### Step 5: Get Specific Payment
```
GET http://localhost:5001/api/payments/PAYMENT_ID
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected:** ✅ 200 OK - Returns payment information

---

### Step 6: Refund Payment
```
POST http://localhost:5001/api/payments/PAYMENT_ID/refund
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Expected:** ✅ 200 OK - Payment refunded successfully

---

## 💳 TEST CARD NUMBERS

| Brand | Number | Expiry | CVV |
|-------|--------|--------|-----|
| Visa | 4532015112830366 | 12/2025 | 123 |
| Mastercard | 5425233010103010 | 12/2025 | 123 |
| Amex | 374245455400126 | 12/2025 | 1234 |
| Discover | 6011111111111117 | 12/2025 | 123 |

---

## ✔️ VALIDATION TESTS

### Test Invalid Card Number
```
{
  "cardNumber": "1234"  // Too short
}
```
❌ Expected: "Invalid card number"

### Test Expired Card
```
{
  "expiryMonth": "12",
  "expiryYear": "2020"  // Past year
}
```
❌ Expected: "Card has expired"

### Test Invalid CVV
```
{
  "cvv": "12"  // Too short
}
```
❌ Expected: "Invalid CVV"

### Test Missing Required Field
```
{
  "orderId": "...",
  "cardNumber": "...",
  // missing other fields
}
```
❌ Expected: "All card details are required"

### Test Non-existent Order
```
{
  "orderId": "123456789012345678901234"  // Random ID
}
```
❌ Expected: "Order not found"

---

## 📊 RESPONSE FORMATS

### ✅ Successful Card Payment
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "payment": {
    "_id": "65a3b8c2d4e5f6g7h8i9j0k1",
    "transactionId": "TXN-1708940654321-ABC12DEF34",
    "amount": 150.50,
    "status": "completed",
    "cardBrand": "Visa",
    "last4Digits": "0366"
  }
}
```

### ✅ Successful COD Payment
```json
{
  "success": true,
  "message": "Cash on delivery confirmed",
  "payment": {
    "_id": "65a3b8c2d4e5f6g7h8i9j0k2",
    "transactionId": "TXN-1708940654322-XYZ98UVW12",
    "amount": 150.50,
    "status": "completed",
    "paymentMethod": "cash_on_delivery"
  }
}
```

### ❌ Failed Payment
```json
{
  "success": false,
  "message": "Payment failed: Insufficient funds"
}
```

---

## 🔒 SECURITY FEATURES

- ✅ JWT authentication required for all endpoints
- ✅ User verification - payments only for their own orders
- ✅ Card details masked - only last 4 digits stored
- ✅ Input validation for all card fields
- ✅ CVV not stored in database
- ✅ Unique transaction IDs generated
- ✅ Payment and order linked via references

---

## 🎯 TESTING CHECKLIST

### Card Payment Tests
- [ ] Valid Visa card → Success
- [ ] Valid Mastercard → Success
- [ ] Expired card → Failure
- [ ] Invalid card number → Failure
- [ ] Invalid CVV → Failure
- [ ] Missing cardholder name → Failure

### COD Tests
- [ ] COD confirmation → Always Success
- [ ] COD for non-existent order → Failure

### Status Checks
- [ ] Get payment by ID → Returns correct payment
- [ ] Get payment by order ID → Returns correct payment
- [ ] Payment status shows in order → Verified

### Error Cases
- [ ] No JWT token → 401 Unauthorized
- [ ] Invalid JWT token → 401 Unauthorized
- [ ] Non-existent order → 404 Not Found
- [ ] Duplicate payment → 400 Bad Request

### Refunds
- [ ] Refund completed payment → Success
- [ ] Refund failed payment → Failure message
- [ ] Check refunded payment status → Shows "cancelled"

---

## 🐛 DEMO NOTES

### Payment Success Rate
- **Card Payments**: 90% success rate (for realistic testing)
- **COD Payments**: 100% success rate (always confirmed)

### Failure Reasons (Randomly selected)
- "Insufficient funds"
- "Card declined"
- "Invalid card details"
- "Transaction declined by bank"

---

## 📝 NEXT STEPS FOR PRODUCTION

1. **Integrate Real Payment Gateway**
   - Stripe API for card payments
   - PayPal for alternative payment
   - Replace the demo random success logic with real API calls

2. **Enhanced Security**
   - PCI compliance for card data
   - SSL certificate
   - Rate limiting on payment endpoints

3. **Payment Webhook**
   - Handle payment gateway webhooks
   - Update payment status automatically
   - Send confirmations

4. **Admin Dashboard**
   - View all payments
   - Payment reconciliation
   - Transaction reports

5. **Email Notifications**
   - Payment confirmation email
   - Refund confirmation email
   - Failure notifications

---

## 🆘 TROUBLESHOOTING

### Issue: "Not authorized" error
**Solution**: Make sure JWT token is included in Authorization header

### Issue: "Order not found"
**Solution**: Verify order ID is correct and belongs to authenticated user

### Issue: "Payment already completed"
**Solution**: Each order can only have one completed payment. Create a new order to test again.

### Issue: CORS error
**Solution**: Ensure frontend is running on `http://localhost:5173` (registered in CORS config)

### Issue: Payment endpoint not found
**Solution**: Restart the server after adding payment routes

---

## ✨ KEY FEATURES IMPLEMENTED

✅ **Dual Payment Methods**
- Credit/Debit Card (Visa, Mastercard, Amex, Discover)
- Cash on Delivery (COD)

✅ **Complete Validation**
- Card number (13-19 digits)
- Expiry date (not expired)
- CVV (3-4 digits)
- Cardholder name

✅ **Payment Processing**
- Transaction ID generation
- Status tracking
- Automatic order linking

✅ **Frontend Integration**
- Beautiful payment form UI
- Real-time validation
- Loading states
- Error handling
- Success confirmation

✅ **Database Integration**
- Payment schema with MongoDB
- Relationships with Orders and Users
- Indexes for performance
- Transaction tracking

✅ **Security**
- JWT authentication
- Input sanitization
- Card details masking
- User ownership verification

---

**Last Updated:** 27 February 2026  
**Component:** Thaveesha - Payment System  
**Status:** ✅ Ready for Testing & Evaluation
