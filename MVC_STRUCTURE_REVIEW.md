# MVC Structure Review – SLIIT AF Backend

## Current Backend Structure (MVC-Aligned)

```
SLIIT_AF_BACKEND/
├── Server.js                 # Entry point (app, middleware, route mounting)
├── config/
│   └── db.js                  # DB connection
├── controllers/               # ✅ Controllers (request handlers, orchestration)
│   ├── Lakna/
│   │   └── productController.js
│   ├── Thaveesha/
│   │   ├── cartController.js
│   │   └── orderController.js
│   └── Tudakshana/
│       ├── adminController.js
│       └── authController.js
├── models/                    # ✅ Models (data layer)
│   ├── Lakna/
│   │   └── Product.js
│   ├── Thaveesha/
│   │   ├── Cart.js
│   │   └── Order.js
│   └── Tudakshana/
│       └── User.js
├── routes/                    # ✅ Routes (URL → controller mapping)
│   ├── Lakna/
│   │   └── productRoutes.js
│   ├── Thaveesha/
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   └── Tudakshana/
│       ├── adminRoutes.js
│       └── authRoutes.js
├── services/                  # ✅ Extra layer (business logic used by controllers)
│   └── Lakna/
│       ├── ecoImpactService.js
│       └── imageUploadService.js
├── utills/                    # ⚠️ Typo: should be "utils"; holds middleware/helpers
│   ├── Lakna/
│   │   ├── helpers.js
│   │   └── validators.js
│   └── Tudakshana/
│       └── authMiddleware.js
├── scripts/
│   └── createAdminUser.js
├── tests/
└── uploads/
```

**Flow:** `Server.js` → **routes** → (optional **middleware**) → **controllers** → **models** (and **services** where used). This is a correct MVC + Routes + Services setup.

---

## What Is Correct

| Layer      | Location        | Role |
|-----------|-----------------|------|
| **Models** | `models/<Feature>/` | Mongoose schemas; no HTTP, no routes. |
| **Controllers** | `controllers/<Feature>/` | Handle req/res, call models/services, return JSON. |
| **Routes** | `routes/<Feature>/` | Map HTTP method + path to controller functions. |
| **Services** | `services/Lakna/` | Reusable logic (eco impact, image upload) used by productController. |
| **Config** | `config/db.js` | Central DB config. |
| **Middleware** | `utills/Tudakshana/authMiddleware.js` | Auth (protect, roles) used by routes. |

- Feature-based grouping (Lakna, Thaveesha, Tudakshana) is consistent and good for a group project.
- No business logic in routes; routes only delegate to controllers.
- Controllers use models (and services where needed); no route or view logic in models.

---

## Suggestions for Improvement

### 1. Fix typo: `utills` → `utils`

- **Current:** `utills/` (used in imports).
- **Suggestion:** Rename folder to `utils/` and update all imports.
- **Impact:** Cleaner naming; "utils" is the standard spelling.

**Files that import from `utills`:**
- `routes/Thaveesha/orderRoutes.js`
- `routes/Thaveesha/cartRoutes.js`
- `routes/Tudakshana/authRoutes.js`
- `routes/Tudakshana/adminRoutes.js`
- `controllers/Lakna/productController.js`
- `tests/Lakna/validators.test.js`

### 2. Optional: Shared middleware folder

- **Current:** Auth middleware lives in `utills/Tudakshana/authMiddleware.js` (feature-specific path).
- **Suggestion:** If you rename `utills` to `utils`, you could add a dedicated place for shared middleware, e.g.:
  - `utils/middleware/authMiddleware.js` and keep Tudakshana-specific helpers in `utils/Tudakshana/` if needed, or
  - Keep `utils/Tudakshana/authMiddleware.js` but treat it as the single place for auth middleware (already used by cart, orders, auth, admin). No change required if you prefer minimal moves.

### 3. Remove or document `frontend/Server.js`

- **Current:** `frontend/Server.js` exists and is empty.
- **Suggestion:** Delete it if unused, or add a one-line comment (e.g. “Reserved for optional dev proxy”). Avoid confusion with the real backend `Server.js` at project root.

### 4. Optional: Services for Thaveesha

- **Current:** Cart/order logic lives entirely in controllers.
- **Suggestion:** If `orderController.js` or `cartController.js` grow (e.g. payment, inventory, notifications), extract reusable logic into `services/Thaveesha/` (e.g. `orderService.js`, `cartService.js`) and keep controllers thin (parse input, call service, format response). Not required while the code is small.

### 5. Optional: Central API prefix

- **Current:** Routes are mounted in `Server.js` with prefixes (`/api/auth`, `/api/products`, etc.).
- **Suggestion:** If you add more modules, consider a small `config/api.js` or constants file that exports route prefixes (e.g. `API_PREFIX = '/api'`) so the entry file stays readable. Low priority.

### 6. Tests

- **Current:** Tests under `tests/Lakna/` for product and validators.
- **Suggestion:** Add tests for Thaveesha (cart/order) and Tudakshana (auth) when you have time, following the same structure (e.g. `tests/Thaveesha/orderController.test.js`).

---

## Frontend (React) – Not Classic MVC

The frontend is a React SPA and follows a common **component + services** structure rather than MVC:

- **Pages** (`frontend/src/pages/`) ≈ views/screens.
- **Components** (`frontend/src/components/`) = reusable UI.
- **Services** (`frontend/src/services/`) = API client (auth, admin); used by pages/components.

This is appropriate for React. No structural change is required for “MVC” on the frontend; the backend is where MVC applies.

---

## Summary

| Item                         | Status / Action |
|-----------------------------|-----------------|
| MVC structure (backend)     | ✅ Correct (Models, Controllers, Routes + Services). |
| Feature-based folders       | ✅ Consistent (Lakna, Thaveesha, Tudakshana). |
| `utills` typo               | ⚠️ Recommend renaming to `utils` and updating imports. |
| `frontend/Server.js`        | ⚠️ Remove if unused or add a short comment. |
| Middleware location         | ✅ Fine as-is; optional refactor to `utils/middleware` later. |
| Services for cart/order     | Optional when logic grows. |
| Tests                       | Optional: add for Thaveesha and Tudakshana. |

Overall, the backend file structure is correct for an MVC-style API; the main concrete improvement is renaming `utills` to `utils` and cleaning up the empty `frontend/Server.js`.
