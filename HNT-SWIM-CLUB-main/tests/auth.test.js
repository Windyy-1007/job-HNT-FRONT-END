const { expect } = require('chai');
const { createDriver } = require('./utils/driverFactory');
const LoginPage = require('./pages/LoginPage');
const RegisterPage = require('./pages/RegisterPage');
const HomePage = require('./pages/HomePage');
const config = require('./config');
const { TestDataHelper, AuthHelper } = require('./utils/testHelper');

/**
 * Test Suite: Authentication (Steps 1-7)
 * Covers: Login, Registration, and Logout functionality
 */
describe('7.1.1 Authentication - Đăng ký và đăng nhập', function() {
  let driver;
  let loginPage;
  let registerPage;
  let homePage;
  let authHelper;

  // Setup before all tests
  before(async function() {
    this.timeout(30000);
    driver = await createDriver();
    loginPage = new LoginPage(driver);
    registerPage = new RegisterPage(driver);
    homePage = new HomePage(driver);
    authHelper = new AuthHelper(driver);
  });

  // Cleanup after all tests
  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  // Clear auth before each test
  beforeEach(async function() {
    await authHelper.clearAuth();
  });

  /**
   * Step 1: Login with correct credentials
   * Expected: Login successful, redirect to home page
   */
  describe('Step 1: Login with correct account/password', function() {
    it('should login successfully and redirect to home page', async function() {
      this.timeout(20000);
      
      // Navigate to login page
      await loginPage.open();
      
      // Perform login with valid credentials
      await loginPage.login(config.USER_EMAIL, config.USER_PASSWORD);
      
      // Wait for success message
      await driver.sleep(2000);
      const isSuccess = await loginPage.isSuccessMessage();
      expect(isSuccess).to.be.true;
      
      const message = await loginPage.getMessageText();
      expect(message).to.include('thành công');
      
      // Wait for redirect
      await loginPage.waitForRedirect(3000);
      
      // Verify redirect to home page
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include('trangchu.html');
      
      // Verify user is logged in (token exists)
      const isLoggedIn = await authHelper.isLoggedIn();
      expect(isLoggedIn).to.be.true;
    });
  });

  /**
   * Step 2: Login with incorrect credentials
   * Expected: Show error message, login fails
   */
  describe('Step 2: Login with incorrect credentials', function() {
    it('should show error message and not login', async function() {
      this.timeout(15000);
      
      await loginPage.open();
      
      // Try login with wrong password
      await loginPage.login(config.USER_EMAIL, 'wrongpassword123');
      
      // Wait for error message
      await driver.sleep(2000);
      const isError = await loginPage.isErrorMessage();
      expect(isError).to.be.true;
      
      const message = await loginPage.getMessageText();
      expect(message.toLowerCase()).to.match(/thất bại|sai|không đúng|fail/);
      
      // Verify still on login page (no redirect)
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include('login.html');
      
      // Verify NOT logged in
      const isLoggedIn = await authHelper.isLoggedIn();
      expect(isLoggedIn).to.be.false;
    });
  });

  /**
   * Step 3: Login as Admin
   * Expected: Redirect to Admin management page (quản lý tuyển thủ)
   */
  describe('Step 3: Login as Admin', function() {
    it('should redirect to admin management page after admin login', async function() {
      this.timeout(20000);
      
      await loginPage.open();
      
      // Login with admin credentials
      await loginPage.login(config.ADMIN_EMAIL, config.ADMIN_PASSWORD);
      
      // Wait for success message
      await driver.sleep(2000);
      const isSuccess = await loginPage.isSuccessMessage();
      expect(isSuccess).to.be.true;
      
      // Wait for redirect
      await loginPage.waitForRedirect(3000);
      
      // Verify redirect to admin page
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.match(/admin|home\.html/);
      
      // Verify admin role
      const role = await authHelper.getUserRole();
      expect(role).to.equal('admin');
    });
  });

  /**
   * Step 4: Register new user with complete info
   * Expected: Account created, can login with new account
   */
  describe('Step 4: Register new user with complete information', function() {
    it('should create account and allow login', async function() {
      this.timeout(25000);
      
      // Generate unique user data
      const userData = TestDataHelper.generateUserData(config.GENERATE_UNIQUE_USERS);
      
      await registerPage.open();
      
      // Fill registration form
      await registerPage.register(
        userData.fullname,
        userData.email,
        userData.password,
        userData.password
      );
      
      // Wait for response
      await driver.sleep(2000);
      
      // Check for success message
      const isSuccess = await registerPage.isSuccessMessage();
      expect(isSuccess).to.be.true;
      
      const message = await registerPage.getMessageText();
      expect(message).to.include('thành công');
      
      // Wait for redirect to login page
      await driver.sleep(2000);
      const currentUrl = await driver.getCurrentUrl();
      
      // If redirected to login, try logging in
      if (currentUrl.includes('login.html')) {
        await loginPage.login(userData.email, userData.password);
        await driver.sleep(2000);
        
        // Verify login successful
        const loginSuccess = await loginPage.isSuccessMessage();
        expect(loginSuccess).to.be.true;
      }
    });
  });

  /**
   * Step 5: Register with duplicate email
   * Expected: Show error "already exists"
   */
  describe('Step 5: Register with duplicate email', function() {
    it('should show error for duplicate email', async function() {
      this.timeout(15000);
      
      await registerPage.open();
      
      // Try to register with existing user email
      await registerPage.register(
        'Duplicate User',
        config.USER_EMAIL, // Existing email
        'password123',
        'password123'
      );
      
      // Wait for error
      await driver.sleep(2000);
      const isError = await registerPage.isErrorMessage();
      expect(isError).to.be.true;
      
      const message = await registerPage.getMessageText();
      expect(message.toLowerCase()).to.match(/đã tồn tại|already exists|trùng|duplicate/);
    });
  });

  /**
   * Step 6: Register with missing required info
   * Expected: Show validation error, registration fails
   */
  describe('Step 6: Register with missing required information', function() {
    it('should show validation error for empty fields', async function() {
      this.timeout(15000);
      
      await registerPage.open();
      
      // Try to register with empty fields
      await registerPage.register('', '', '', '');
      
      // Wait briefly
      await driver.sleep(1000);
      
      // Check if still on register page (form validation prevents submission)
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include('đk.html');
      
      // Button might be disabled or form shows validation
      // In HTML5 forms, required fields prevent submission
    });

    it('should show error for mismatched passwords', async function() {
      this.timeout(15000);
      
      await registerPage.open();
      
      // Register with mismatched passwords
      await registerPage.register(
        'Test User',
        'test@example.com',
        'password123',
        'differentpassword'
      );
      
      // Wait for error
      await driver.sleep(2000);
      const isError = await registerPage.isErrorMessage();
      expect(isError).to.be.true;
      
      const message = await registerPage.getMessageText();
      expect(message.toLowerCase()).to.match(/không khớp|không trùng|not match/);
    });

    it('should show error for short password', async function() {
      this.timeout(15000);
      
      await registerPage.open();
      
      // Register with password < 6 characters
      await registerPage.register(
        'Test User',
        'test@example.com',
        '123',
        '123'
      );
      
      // Wait for error
      await driver.sleep(2000);
      const isError = await registerPage.isErrorMessage();
      expect(isError).to.be.true;
      
      const message = await registerPage.getMessageText();
      expect(message.toLowerCase()).to.match(/phải từ 6|ít nhất 6|at least 6/);
    });
  });

  /**
   * Step 7: Logout current account
   * Expected: Logout success, return to unauthenticated home page
   */
  describe('Step 7: Logout current account', function() {
    it('should logout successfully and clear authentication', async function() {
      this.timeout(20000);
      
      // First login
      await loginPage.open();
      await loginPage.login(config.USER_EMAIL, config.USER_PASSWORD);
      await driver.sleep(3000);
      
      // Verify logged in
      let isLoggedIn = await authHelper.isLoggedIn();
      expect(isLoggedIn).to.be.true;
      
      // Navigate to home and logout
      await homePage.open();
      await homePage.logout();
      
      // Verify logged out
      isLoggedIn = await authHelper.isLoggedIn();
      expect(isLoggedIn).to.be.false;
      
      // Verify on home page without auth
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include('trangchu.html');
    });
  });
});
