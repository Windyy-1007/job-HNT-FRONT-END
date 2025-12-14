# ✅ Test Execution Checklist

Use this checklist before running the E2E test suite.

## Pre-Execution Checklist

### 1. Backend Server ✓
- [ ] Backend server is running on `http://localhost:3000`
- [ ] API endpoints are accessible:
  ```bash
  curl http://localhost:3000/api/products
  curl http://localhost:3000/api/athletes
  ```
- [ ] Database is seeded with test data

### 2. Test User Accounts ✓
- [ ] Test user account exists:
  - Email: `testuser@example.com` (or as configured in `.env`)
  - Password: `password123` (or as configured in `.env`)
  - Can login successfully via browser

- [ ] Admin account exists:
  - Email: `admin@hntswimclub.com` (or as configured in `.env`)
  - Password: `admin123` (or as configured in `.env`)
  - Has admin role in database
  - Can access admin pages

### 3. Dependencies ✓
- [ ] Node.js installed (v16+)
  ```bash
  node --version
  ```
- [ ] NPM installed (v8+)
  ```bash
  npm --version
  ```
- [ ] Test dependencies installed
  ```bash
  cd HNT-SWIM-CLUB-main
  npm install
  ```

### 4. Configuration ✓
- [ ] `.env` file exists
- [ ] `.env` contains correct BASE_URL
- [ ] `.env` contains valid USER_EMAIL and USER_PASSWORD
- [ ] `.env` contains valid ADMIN_EMAIL and ADMIN_PASSWORD

### 5. Browser ✓
- [ ] Chrome browser installed (latest version)
- [ ] Chrome can be launched
- [ ] No existing Chrome instances running tests

## Execution Options

### Option 1: Run All Tests (Headed)
```bash
npm test
```
**Expected**: Browser windows open, tests run visibly
**Duration**: ~5-10 minutes

### Option 2: Run All Tests (Headless)
```bash
npm run test:headless
```
**Expected**: No browser windows, tests run in background
**Duration**: ~4-8 minutes (faster)

### Option 3: Run Specific Test Suite
```bash
# Authentication tests (Steps 1-7)
npm run test:auth

# Admin management tests (Steps 8-10)
npm run test:admin

# Shopping flow tests (Steps 11-15)
npm run test:shopping

# Order management tests (Steps 16-18)
npm run test:orders
```

### Option 4: Generate HTML Report
```bash
npm run test:report
```
**Output**: `test-reports/report.html`

## Post-Execution Checklist

### 1. Review Results ✓
- [ ] Check console output for pass/fail status
- [ ] Review any failed tests
- [ ] Check error messages and stack traces

### 2. Test Artifacts ✓
- [ ] Screenshots captured (if enabled)
- [ ] Log files created
- [ ] HTML report generated (if using `test:report`)

### 3. Cleanup (Optional) ✓
- [ ] Remove test orders from database
- [ ] Remove test players created by admin tests
- [ ] Clear test user shopping cart

## Troubleshooting

### All Tests Fail Immediately
**Check:**
1. Is backend server running?
2. Is BASE_URL correct in `.env`?
3. Are test users created in database?

**Fix:**
```bash
# Check backend
curl http://localhost:3000/api/products

# Verify .env
cat .env | grep BASE_URL

# Verify test user can login via browser
# Open: http://localhost:3000/HNT-SWIM-CLUB-main/đn/login.html
```

### Timeout Errors
**Check:**
1. Is network slow?
2. Is backend responding slowly?

**Fix:**
```env
# Edit .env - increase timeout
EXPLICIT_WAIT=20
```

### Element Not Found
**Check:**
1. Has UI changed?
2. Are elements loaded?

**Fix:**
1. Verify elements exist in browser DevTools
2. Update selectors in Page Objects if needed

### Login Tests Fail
**Check:**
1. Do test users exist?
2. Are credentials correct?

**Fix:**
```bash
# Verify credentials in .env
cat .env | grep USER_EMAIL
cat .env | grep USER_PASSWORD

# Try logging in manually via browser
```

### Admin Tests Fail
**Check:**
1. Does admin user have admin role?
2. Can admin access admin pages?

**Fix:**
```sql
-- Update user role in database
UPDATE users SET role = 'admin' WHERE email = 'admin@hntswimclub.com';
```

## Quick Test Command Reference

| Command | Purpose | Duration |
|---------|---------|----------|
| `npm test` | All tests (headed) | ~5-10 min |
| `npm run test:headless` | All tests (headless) | ~4-8 min |
| `npm run test:auth` | Auth tests only | ~2 min |
| `npm run test:admin` | Admin tests only | ~2 min |
| `npm run test:shopping` | Shopping tests only | ~2-3 min |
| `npm run test:orders` | Order tests only | ~2 min |
| `npm run test:report` | With HTML report | ~5-10 min |
| `npm run test:single tests/auth.test.js` | Single file | ~2 min |

## Expected Test Results

### Passing Tests ✅
```
7.1.1 Authentication - Đăng ký và đăng nhập
  Step 1: Login with correct account/password
    ✓ should login successfully and redirect to home page (3456ms)
  Step 2: Login with incorrect credentials
    ✓ should show error message and not login (2345ms)
  ...

32 passing (8m 45s)
```

### Failed Tests ❌
```
1) Step 4: Register new user
   Error: Element not found: [data-testid="register-submit"]
   at waitForVisible (waitHelper.js:23)
```

**Action**: Review error message, check application state, update test if needed

## Success Criteria

- ✅ All 32 tests pass
- ✅ No timeout errors
- ✅ No element not found errors
- ✅ Execution completes in reasonable time
- ✅ HTML report generated successfully

## Failed Test Analysis

If tests fail:

1. **Check error message**: What went wrong?
2. **Check screenshot** (if available): What did the page look like?
3. **Check console logs**: Any JavaScript errors?
4. **Check backend logs**: Any API errors?
5. **Try manually**: Can you reproduce the issue manually?

## Next Steps After Successful Run

1. ✅ Review HTML report for detailed results
2. ✅ Document any test failures
3. ✅ Update tests if application changed
4. ✅ Integrate into CI/CD pipeline
5. ✅ Schedule regular test runs

## Support

For help:
1. Check [README_TESTING.md](README_TESTING.md)
2. Check [QUICKSTART_TESTING.md](QUICKSTART_TESTING.md)
3. Review error messages carefully
4. Check backend API logs
5. Verify browser console for errors

---

**Last Updated**: December 2025  
**Version**: 1.0.0
