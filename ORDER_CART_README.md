# Order & Cart – Thaveesha (Backend + Frontend)

Full backend and frontend for **Cart** and **Orders**, integrated with other members' modules.

---

## Integration with other members

| Member      | Module   | How Order/Cart uses it |
|------------|----------|-------------------------|
| **Tudakshana** | User, Auth | `Order.user` and `Cart.user` reference **User** model. All cart/order routes use **protect** middleware (JWT). |
| **Lakna**      | Product  | `Cart.items[].product` and `Order.items[].product` reference **Product**. Order stores **priceSnapshot** and decrements **Product.stock** on place; restores stock on cancel. |

---

## Backend structure (MVC)

```
models/Thaveesha/
  Cart.js    – user (ref User), items[{ product (ref Product), quantity }]
  Order.js   – user (ref User), items[{ product, quantity, priceSnapshot }], total, status, shippingAddress, phone, notes

controllers/Thaveesha/
  cartController.js   – getCart, addToCart, updateCartItem, removeCartItem
  orderController.js  – createOrder, getMyOrders, getOrderById, cancelOrder

routes/Thaveesha/
  cartRoutes.js   – GET /api/cart, POST /api/cart/add, PUT /api/cart, DELETE /api/cart/item/:itemId
  orderRoutes.js  – POST /api/orders, GET /api/orders/my-orders, GET /api/orders/:id, PATCH /api/orders/:id/cancel
```

All routes are **protected** (require login via Tudakshana auth).

---

## API summary

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/cart | Get current user's cart (items with product populated) |
| POST | /api/cart/add | Add product to cart `{ productId, quantity }` |
| PUT | /api/cart | Update item qty `{ itemId, quantity }` |
| DELETE | /api/cart/item/:itemId | Remove item |
| POST | /api/orders | Create order `{ items, shippingAddress, phone, notes }` – clears cart, decrements stock |
| GET | /api/orders/my-orders | List current user's orders |
| GET | /api/orders/:id | Get one order (owner only) |
| PATCH | /api/orders/:id/cancel | Cancel order (pending/processing) – restores stock |

---

## Frontend services (Thaveesha)

Use these instead of calling the API directly:

- **`frontend/src/services/Thaveesha/cartService.js`** – `cartAPI.getCart()`, `cartAPI.addToCart()`, `cartAPI.updateItem()`, `cartAPI.removeItem()`
- **`frontend/src/services/Thaveesha/orderService.js`** – `orderAPI.createOrder()`, `orderAPI.getMyOrders()`, `orderAPI.getOrderById()`, `orderAPI.cancelOrder()`
- **`frontend/src/services/Thaveesha/index.js`** – re-exports `cartAPI`, `orderAPI`

All use the same axios instance as **authService** (token sent automatically).

---

## Pages using these services

- **Cart.jsx** – cartAPI + orderAPI (checkout)
- **MyOrders.jsx** – orderAPI
- **OrderDetail.jsx** – orderAPI
- **UserProducts.jsx** (Lakna) – cartAPI.addToCart when “Add to cart” is clicked
- **Navbar.jsx** – cartAPI.getCart() for cart badge count
