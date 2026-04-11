# Testing Instruction Report

**Classification:** Public-SLIIT  

**Project:** SLIIT AF Backend (Jest + Supertest)

---

## 1. Overview

Automated tests live under the repository `tests/` directory. The test runner is **Jest** with **Node** as the environment. API integration tests use **Supertest** against the exported Express `app` (server is not started when `NODE_ENV=test`).

---

## 2. How to run unit tests

### 2.1 Prerequisites

- Node.js (LTS recommended, aligned with `package.json` engines if specified).
- Install dependencies from the **repository root**:

```bash
npm install
```

### 2.2 Run all tests

From the **backend project root** (`SLIIT_AF_BACKEND`):

```bash
npm test
```

This runs Jest with `jest.config.cjs` and matches `tests/**/*.test.js`.

### 2.3 Run tests by area

```bash
# Thaveesha (cart, orders, admin orders)
npm run test:thaveesha

# Senara (reviews)
npm run test:senara
```

### 2.4 Run a single file

```bash
node --experimental-vm-modules node_modules/jest/bin/jest.js tests/Lakna/productModel.test.js --forceExit
```

### 2.5 What counts as “unit” in this repo

- **Model / helper / validator** tests (e.g. `productModel.test.js`, `validators.test.js`, `helpers.test.js`).
- **Service-level** tests where external I/O is mocked or isolated (e.g. `ecoImpactService.test.js`, `imageUploadService.test.js`).

---

## 3. Integration testing — setup and execution

### 3.1 Purpose

Integration tests verify HTTP routes and controller behaviour using **Supertest** (`request(app)`), typically with an in-memory or test MongoDB URI.

### 3.2 Environment configuration

- Tests set `process.env.NODE_ENV = 'test'` where required so `Server.js` does **not** call `listen()`.
- Set `MONGODB_URI` or `MONGODB_URI` (see `config/db.js`) to a **dedicated test database** when running integration tests that hit the database — **never** use production data.

Example (PowerShell):

```powershell
$env:NODE_ENV="test"
$env:MONGODB_URI="mongodb://127.0.0.1:27017/sliit_af_test"
npm test
```

Example (bash):

```bash
export NODE_ENV=test
export MONGODB_URI=mongodb://127.0.0.1:27017/sliit_af_test
npm test
```

### 3.3 Representative integration test files

| File | Focus |
|------|--------|
| `tests/Lakna/productRoutes.test.js` | Product HTTP API |
| `tests/Thaveesha/cartOrder.test.js` | Cart / order flows |
| `tests/Thaveesha/adminOrder.test.js` | Admin order API |
| `tests/Senara/review.test.js` | Review API |

### 3.4 Execution

Same as section 2: `npm test` runs integration suites together with unit suites.

---

## 4. Performance testing — setup and execution

This repository does **not** ship a dedicated performance test suite (e.g. k6, Artillery, JMeter). For coursework or production validation, you may add performance checks as follows.

### 4.1 Suggested approach

1. **Tooling (choose one):**
   - [k6](https://k6.io/) — scriptable load tests.
   - [Artillery](https://www.artillery.io/) — YAML/JSON scenarios.
   - Apache JMeter — GUI / CLI load tests.

2. **Targets:**
   - `GET /health` — baseline latency.
   - `GET /api/products` — read-heavy public endpoint.
   - Authenticated endpoints — use a test JWT from `/api/auth/login`.

3. **Environment:**
   - Run against **staging** or a dedicated test deployment, not production during heavy load.

4. **Record results:**
   - Throughput (requests/sec), p95/p99 latency, error rate.
   - Attach graphs or CLI output to your submission if required.

### 4.2 Example k6 sketch (illustrative only)

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
export const options = { vus: 10, duration: '30s' };
export default function () {
  const res = http.get('https://your-api.example.com/health');
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}
```

---

## 5. Testing environment configuration summary

| Variable | Purpose in tests |
|----------|------------------|
| `NODE_ENV` | Set to `test` to avoid binding HTTP server in `Server.js`. |
| `MONGODB_URI` | Test database connection string (local or Atlas test cluster). |
| `JWT_SECRET` | Must match app expectations if tests issue or verify JWTs. |

**Security:** Do not commit real Atlas passwords or production secrets. Use `.env` locally and CI secrets in pipelines.

---

## 6. Linting (frontend)

From `frontend/`:

```bash
npm run lint
```

---

## 7. Test report output

Jest is configured with a custom summary reporter at `tests/jest-summary-reporter.cjs`. After `npm test`, review the console output for pass/fail counts and fix failing suites before release or deployment.
