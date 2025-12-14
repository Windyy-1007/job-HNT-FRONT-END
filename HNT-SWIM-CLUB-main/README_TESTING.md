# Testing Documentation - HNT Swim Club E2E Test Suite

## Overview

This is a comprehensive Selenium WebDriver end-to-end test suite for the HNT Swim Club e-commerce application. The tests are implemented using:

- **Language**: JavaScript (Node.js)
- **Test Framework**: Mocha + Chai
- **Automation**: Selenium WebDriver 4.x
- **Pattern**: Page Object Model (POM)
- **Browser**: Chrome (with automatic ChromeDriver management via Selenium Manager)

## Test Coverage

The test suite covers 18 manual test cases organized into 4 main categories:

### 7.1.1 Authentication (Steps 1-7)
- **Step 1**: Login with correct credentials → success → redirect to home
- **Step 2**: Login with incorrect credentials → error message → login fails
- **Step 3**: Login as Admin → redirect to admin management page
- **Step 4**: Register new user with complete info → account created → can login
- **Step 5**: Register with duplicate email → error "already exists"
- **Step 6**: Register with missing info → validation error → registration fails
- **Step 7**: Logout → success → return to unauthenticated home

### 7.1.2 Admin Player Management (Steps 8-10)
- **Step 8**: Admin adds new player → form with image upload → save succeeds
- **Step 9**: Admin edits player info → edit form shown → changes persist
- **Step 10**: Admin deletes player → confirmation shown → player removed

### 7.1.3 Shopping Flow (Steps 11-15)
- **Step 11**: User clicks product → navigates to product detail page
- **Step 12**: Click Buy → goes to cart/checkout → can confirm purchase
- **Step 13**: Click Back/Cancel → returns to product detail page
- **Step 14**: Search by keyword → results show quickly and correctly
- **Step 15**: After purchase confirmation → payment modal shows QR code

### 7.1.4 Order Management (Steps 16-18)
- **Step 16**: User opens "Đơn đã mua" → view purchased/cancelled orders
- **Step 17**: Edit recipient name/address → allowed before shipping, blocked after
- **Step 18**: Cancel order → confirmation → order appears in "Đã huỷ"

## Prerequisites

### 1. System Requirements
- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher
- **Operating System**: Windows, macOS, or Linux
- **Chrome Browser**: Latest version (automatically detected by Selenium Manager)

### 2. Backend Server
The tests require the HNT Swim Club backend API to be running:

```bash
# Ensure backend is running on http://localhost:3000
# Check API endpoints are accessible:
# - http://localhost:3000/api/auth/login
# - http://localhost:3000/api/products
# - http://localhost:3000/api/athletes
# etc.
```

### 3. Test Data Setup
Before running tests, ensure you have:

1. **Test User Account** (Regular user)
   - Email: `testuser@example.com`
   - Password: `password123`
   - Or configure your own in `.env` file

2. **Admin Account**
   - Email: `admin@hntswimclub.com`
   - Password: `admin123`
   - Or configure your own in `.env` file

## Installation

### 1. Navigate to Project Directory
```bash
cd C:\Projects\Outsources\job-HNT-FRONT-END\HNT-SWIM-CLUB-main
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- `selenium-webdriver` (v4.16.0+) - Includes automatic ChromeDriver management
- `mocha` (v10.2.0+) - Test framework
- `chai` (v4.3.10+) - Assertion library
- `mochawesome` (v7.1.3+) - HTML test reporter
- `dotenv` (v16.3.1+) - Environment variable management

### 3. Configure Environment Variables

Copy the example configuration file:
```bash
copy .env.example .env
```

Edit `.env` file with your configuration:
```env
# Application Base URL
BASE_URL=http://localhost:3000

# Test User Credentials (Regular User)
USER_EMAIL=testuser@example.com
USER_PASSWORD=password123
USER_FULLNAME=Test User

# Admin Credentials
ADMIN_EMAIL=admin@hntswimclub.com
ADMIN_PASSWORD=admin123

# Browser Configuration
HEADLESS=false

# Timeouts
IMPLICIT_WAIT=5000
EXPLICIT_WAIT=10
```

## Running Tests

### Run All Tests (Headed Mode)
```bash
npm test
```

This runs all test suites with visible browser windows.

### Run All Tests (Headless Mode)
```bash
npm run test:headless
```

Runs tests in headless mode (no browser UI) - faster and suitable for CI/CD.

### Run Specific Test Suite

**Authentication Tests Only:**
```bash
npm run test:auth
```

**Admin Player Management Tests:**
```bash
npm run test:admin
```

**Shopping Flow Tests:**
```bash
npm run test:shopping
```

**Order Management Tests:**
```bash
npm run test:orders
```

### Run Single Test File
```bash
npm run test:single tests/auth.test.js
```

### Run with HTML Report
```bash
npm run test:report
```

This generates an HTML report in `test-reports/report.html`.

## Test Structure

```
HNT-SWIM-CLUB-main/
├── tests/
│   ├── pages/                  # Page Object Model classes
│   │   ├── BasePage.js        # Base page with common methods
│   │   ├── LoginPage.js       # Login page object
│   │   ├── RegisterPage.js    # Register page object
│   │   ├── HomePage.js        # Home page object
│   │   ├── ProductDetailPage.js
│   │   ├── CartPage.js        # Cart & Checkout pages
│   │   ├── OrdersPage.js      # User orders page
│   │   └── AdminPlayersPage.js # Admin player management
│   │
│   ├── utils/                  # Utility functions
│   │   ├── driverFactory.js   # WebDriver creation & config
│   │   ├── waitHelper.js      # Explicit wait utilities
│   │   └── testHelper.js      # Test data, auth helpers
│   │
│   ├── auth.test.js           # Steps 1-7: Authentication
│   ├── admin.test.js          # Steps 8-10: Admin management
│   ├── shopping.test.js       # Steps 11-15: Shopping flow
│   ├── orders.test.js         # Steps 16-18: Order management
│   └── config.js              # Test configuration
│
├── package.json
├── .env                        # Environment variables (create from .env.example)
├── .env.example               # Example configuration
└── README_TESTING.md          # This file
```

## Key Features

### 1. Page Object Model (POM)
All pages are represented as classes with methods for interactions:

```javascript
// Example: LoginPage usage
const loginPage = new LoginPage(driver);
await loginPage.open();
await loginPage.login(email, password);
const message = await loginPage.getMessageText();
```

### 2. Explicit Waits
All interactions use explicit waits (no `sleep()` unless absolutely necessary):

```javascript
// WaitHelper methods
await wait.waitForVisible(locator);
await wait.waitForClickable(locator);
await wait.waitForUrlContains('trangchu');
await wait.safeClick(locator); // With retry logic
```

### 3. Test Data Generation
Dynamic test data generation to avoid collisions:

```javascript
const userData = TestDataHelper.generateUserData(true);
// Returns: { fullname, email, password } with unique values
```

### 4. Authentication Management
Easy authentication control:

```javascript
await authHelper.setAuthToken(token, userData);
await authHelper.clearAuth();
const isLoggedIn = await authHelper.isLoggedIn();
```

## Troubleshooting

### Issue: ChromeDriver not found
**Solution**: Selenium Manager (built into Selenium 4.x) automatically downloads and manages ChromeDriver. Ensure you have Selenium WebDriver 4.6+.

### Issue: Tests fail with timeout errors
**Solutions**:
1. Increase timeouts in `.env`:
   ```env
   EXPLICIT_WAIT=20
   ```
2. Check if backend server is running
3. Verify network connectivity

### Issue: Element not found errors
**Solutions**:
1. Check if application UI has changed
2. Update selectors in Page Objects if needed
3. Ensure proper wait conditions are used

### Issue: Login tests fail
**Solutions**:
1. Verify test user exists in database
2. Check credentials in `.env` file
3. Ensure backend authentication endpoints are working

### Issue: Admin tests fail
**Solutions**:
1. Verify admin account has correct role in database
2. Check admin credentials in `.env`
3. Ensure admin routes are accessible

### Issue: Headless mode fails but headed mode works
**Solution**: Some elements may render differently in headless mode. Add this to Chrome options:
```javascript
options.addArguments('--window-size=1920,1080');
```

## Selector Stability

### Current Selector Strategy
Tests use a resilient selector strategy:
1. **IDs** (preferred): `By.id('username')`
2. **CSS classes**: `By.css('.btn-primary')`
3. **CSS combinators**: `By.css('button[onclick*="addToCart"]')`
4. **XPath** (fallback): For complex selections

### Recommendations for Application Code
To improve test stability, consider adding `data-testid` attributes:

```html
<!-- Login form -->
<input id="username" data-testid="login-email" />
<input id="password" data-testid="login-password" />
<button id="loginBtn" data-testid="login-submit">Đăng nhập</button>

<!-- Product cards -->
<div class="product-card" data-testid="product-card">
  <button class="add-btn" data-testid="add-to-cart-btn">Thêm vào giỏ</button>
</div>
```

Then update locators:
```javascript
this.loginButton = By.css('[data-testid="login-submit"]');
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd HNT-SWIM-CLUB-main
          npm install
      
      - name: Start backend server
        run: |
          # Start your backend here
          npm run start:backend &
          sleep 10
      
      - name: Run E2E tests
        run: |
          cd HNT-SWIM-CLUB-main
          npm run test:headless
        env:
          HEADLESS: true
          BASE_URL: http://localhost:3000
      
      - name: Upload test reports
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-reports
          path: HNT-SWIM-CLUB-main/test-reports/
```

## Test Maintenance

### When Application Changes

1. **New Features**: Add new Page Objects and test cases
2. **UI Changes**: Update selectors in affected Page Objects
3. **API Changes**: Update configuration and test data
4. **New Pages**: Create new Page Object extending `BasePage`

### Best Practices

1. **Keep tests independent**: Each test should be able to run standalone
2. **Use Page Objects**: Never put selectors directly in test files
3. **Explicit waits**: Always use `WaitHelper` methods
4. **Meaningful assertions**: Test actual user-visible behavior
5. **Clean test data**: Reset state between test runs when needed

## Reporting

### Console Output
Default Mocha reporter shows test results in terminal:
```
7.1.1 Authentication - Đăng ký và đăng nhập
  Step 1: Login with correct account/password
    ✓ should login successfully and redirect to home page (3456ms)
  Step 2: Login with incorrect credentials
    ✓ should show error message and not login (2345ms)
```

### HTML Report (Mochawesome)
```bash
npm run test:report
```

Open `test-reports/report.html` in browser for detailed HTML report with:
- Test pass/fail statistics
- Execution time per test
- Error messages and stack traces
- Screenshots (if configured)

## Support

For issues or questions:
1. Check this documentation
2. Review test code comments
3. Check backend API logs
4. Verify browser console for JavaScript errors

## Notes

- **Test execution time**: Full suite takes ~5-10 minutes depending on network and backend performance
- **Parallel execution**: Not configured by default to avoid race conditions
- **Data cleanup**: Tests don't automatically clean up created data (players, orders). Manual cleanup may be needed.
- **CAPTCHA/Email verification**: Tests assume these are disabled or bypassed in test environment

---

**Last Updated**: December 2025  
**Version**: 1.0.0
