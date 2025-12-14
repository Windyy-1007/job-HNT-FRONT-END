# HNT Swim Club - E2E Test Suite Quick Start

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
cd HNT-SWIM-CLUB-main
npm install
```

### 2. Configure Test Credentials
Edit `.env` file with your test user credentials:
```env
USER_EMAIL=testuser@example.com
USER_PASSWORD=password123
ADMIN_EMAIL=admin@hntswimclub.com
ADMIN_PASSWORD=admin123
```

### 3. Start Backend Server
Ensure backend is running on `http://localhost:3000`

### 4. Run Tests
```bash
# Run all tests (with browser visible)
npm test

# Run tests in headless mode (faster)
npm run test:headless

# Run specific test suite
npm run test:auth        # Authentication tests
npm run test:admin       # Admin management tests
npm run test:shopping    # Shopping flow tests
npm run test:orders      # Order management tests

# Generate HTML report
npm run test:report
```

## 📋 Test Coverage Summary

| Step | Test Case | File |
|------|-----------|------|
| 1-7 | Authentication (Login, Register, Logout) | `tests/auth.test.js` |
| 8-10 | Admin Player Management | `tests/admin.test.js` |
| 11-15 | Shopping Flow (Products, Cart, Checkout) | `tests/shopping.test.js` |
| 16-18 | Order Management (View, Edit, Cancel) | `tests/orders.test.js` |

## 🏗️ Project Structure

```
tests/
├── pages/              # Page Object Model classes
│   ├── LoginPage.js
│   ├── RegisterPage.js
│   ├── HomePage.js
│   ├── ProductDetailPage.js
│   ├── CartPage.js
│   ├── OrdersPage.js
│   └── AdminPlayersPage.js
├── utils/              # Helper utilities
│   ├── driverFactory.js
│   ├── waitHelper.js
│   └── testHelper.js
├── auth.test.js        # Steps 1-7
├── admin.test.js       # Steps 8-10
├── shopping.test.js    # Steps 11-15
├── orders.test.js      # Steps 16-18
└── config.js           # Configuration
```

## 🔧 Common Commands

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in headless mode
HEADLESS=true npm test
# or on Windows PowerShell:
$env:HEADLESS="true"; npm test

# Run single test file
npm run test:single tests/auth.test.js

# View HTML report
npm run test:report
# Then open: test-reports/report.html
```

## 📝 Example Test Execution

```bash
$ npm run test:auth

> hnt-swim-club-e2e-tests@1.0.0 test:auth
> mocha tests/auth.test.js --timeout 60000 --exit

  7.1.1 Authentication - Đăng ký và đăng nhập
    Step 1: Login with correct account/password
      ✓ should login successfully and redirect to home page (3456ms)
    Step 2: Login with incorrect credentials
      ✓ should show error message and not login (2345ms)
    Step 3: Login as Admin
      ✓ should redirect to admin management page after admin login (3123ms)
    ...

  7 passing (25.4s)
```

## ⚙️ Configuration

Edit `.env` file to customize:

```env
# Run tests faster without browser UI
HEADLESS=true

# Increase timeouts for slow networks
EXPLICIT_WAIT=20

# Use different base URL
BASE_URL=http://192.168.1.100:3000

# Generate unique users for each test run
GENERATE_UNIQUE_USERS=true
```

## 🐛 Troubleshooting

**Tests fail immediately:**
- ✅ Check backend server is running (`http://localhost:3000`)
- ✅ Verify test user accounts exist in database
- ✅ Check credentials in `.env` file

**Timeout errors:**
- ✅ Increase `EXPLICIT_WAIT` in `.env`
- ✅ Check network connectivity
- ✅ Verify backend API responds quickly

**Element not found:**
- ✅ UI may have changed - update Page Objects
- ✅ Check if page loaded completely
- ✅ Verify selectors in browser DevTools

## 📚 Full Documentation

See [README_TESTING.md](README_TESTING.md) for comprehensive documentation including:
- Detailed test coverage
- Page Object Model architecture
- CI/CD integration
- Selector stability guidelines
- Advanced configuration

## 🎯 Next Steps

1. ✅ Run `npm test` to verify setup
2. ✅ Review test results
3. ✅ Check `README_TESTING.md` for advanced usage
4. ✅ Integrate into CI/CD pipeline
5. ✅ Add custom test cases as needed

---

**Tech Stack**: Node.js + Mocha + Chai + Selenium WebDriver 4  
**Pattern**: Page Object Model  
**Browser**: Chrome (auto-managed by Selenium Manager)
