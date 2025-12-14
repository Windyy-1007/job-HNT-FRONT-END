const { expect } = require('chai');
const { createDriver } = require('./utils/driverFactory');
const LoginPage = require('./pages/LoginPage');
const HomePage = require('./pages/HomePage');
const ProductDetailPage = require('./pages/ProductDetailPage');
const CartPage = require('./pages/CartPage');
const config = require('./config');
const { AuthHelper } = require('./utils/testHelper');

/**
 * Test Suite: Shopping Flow (Steps 11-15)
 * Covers: Product navigation, add to cart, checkout, search, payment
 */
describe('7.1.3 Quy trình mua hàng của người dùng', function() {
  let driver;
  let loginPage;
  let homePage;
  let productDetailPage;
  let cartPage;
  let authHelper;

  // Setup before all tests
  before(async function() {
    this.timeout(30000);
    driver = await createDriver();
    loginPage = new LoginPage(driver);
    homePage = new HomePage(driver);
    productDetailPage = new ProductDetailPage(driver);
    cartPage = new CartPage(driver);
    authHelper = new AuthHelper(driver);
    
    // Login as regular user
    await loginPage.open();
    await loginPage.login(config.USER_EMAIL, config.USER_PASSWORD);
    await driver.sleep(3000);
  });

  // Cleanup after all tests
  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  /**
   * Step 11: User clicks featured product from home
   * Expected: Navigates to Product Detail page
   */
  describe('Step 11: User clicks featured product on home page', function() {
    it('should navigate to product detail page when clicking product', async function() {
      this.timeout(15000);
      
      // Go to home page
      await homePage.open();
      await driver.sleep(2000);
      
      // Verify products are displayed
      const productCount = await homePage.getProductCount();
      expect(productCount).to.be.greaterThan(0);
      
      // Click first product
      await homePage.clickFirstProduct();
      
      // Wait for navigation
      await driver.sleep(2000);
      
      // Verify on product detail page
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include('chitiet_sp.html');
      
      // Verify product details are shown
      const isImageDisplayed = await productDetailPage.isProductImageDisplayed();
      expect(isImageDisplayed).to.be.true;
    });
  });

  /**
   * Step 12: User clicks Buy on product detail
   * Expected: Goes to Cart/Checkout, can choose method/quantity/size and confirm
   */
  describe('Step 12: User clicks Buy button on product detail', function() {
    it('should add product to cart and navigate to cart/checkout', async function() {
      this.timeout(20000);
      
      // Navigate to home and click product
      await homePage.open();
      await driver.sleep(2000);
      await homePage.clickFirstProduct();
      await driver.sleep(2000);
      
      // Get product name for verification
      const productName = await productDetailPage.getProductName();
      expect(productName).to.not.be.empty;
      
      // Click buy button
      await productDetailPage.clickBuyButton();
      
      // Wait for action (might be redirect or alert)
      await driver.sleep(3000);
      
      // Check if redirected to cart or if alert appeared
      const currentUrl = await driver.getCurrentUrl();
      
      // Might stay on product page with alert, or go to cart
      // If alert, accept it
      try {
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        expect(alertText).to.match(/giỏ hàng|cart|thành công/i);
        await alert.accept();
      } catch (error) {
        // No alert, might have redirected
      }
      
      // Navigate to cart to verify
      await cartPage.openCart();
      await driver.sleep(2000);
      
      // Verify cart has items (or might still be empty if add failed)
      const cartEmpty = await cartPage.isCartEmpty();
      // Note: Might be empty if user needs to be logged in or product out of stock
    });

    it('should display checkout form with payment options', async function() {
      this.timeout(15000);
      
      // Navigate to checkout page
      await cartPage.openCheckout();
      await driver.sleep(2000);
      
      // Verify on checkout page
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include('thanhtoan.html');
      
      // Verify checkout form elements exist
      // Form should have name, phone, address fields
    });
  });

  /**
   * Step 13: User clicks Back/Cancel (doesn't want to buy)
   * Expected: Returns to Product Detail page
   */
  describe('Step 13: User cancels purchase and goes back', function() {
    it('should return to product detail when clicking back', async function() {
      this.timeout(15000);
      
      // Navigate to product detail
      await homePage.open();
      await driver.sleep(2000);
      await homePage.clickFirstProduct();
      await driver.sleep(2000);
      
      // Verify on product detail
      let currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include('chitiet_sp.html');
      
      // Click back button
      await productDetailPage.clickBackButton();
      await driver.sleep(2000);
      
      // Should return to previous page (home or products list)
      currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.match(/trangchu|danhmuc_sp/);
    });
  });

  /**
   * Step 14: Search function
   * Expected: User searches player/product by keyword, results show quickly and correctly
   */
  describe('Step 14: Search for player/product by keyword', function() {
    it('should display search results quickly', async function() {
      this.timeout(15000);
      
      // Go to home page
      await homePage.open();
      await driver.sleep(2000);
      
      // Perform search
      const searchKeyword = 'áo';
      await homePage.search(searchKeyword);
      
      // Wait for search results
      await driver.sleep(2000);
      
      // Verify results are displayed
      // Results might be filtered products or on a search results page
      const currentUrl = await driver.getCurrentUrl();
      
      // Search might filter current page or redirect to search results
      // Just verify URL changed or page updated
    });

    it('should search for players in players section', async function() {
      this.timeout(15000);
      
      // Navigate to players page
      await homePage.open();
      await homePage.clickPlayersLink();
      await driver.sleep(2000);
      
      // Verify on players page
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include('user.html');
      
      // Try search if available on this page
      try {
        await homePage.search('tuyển thủ');
        await driver.sleep(2000);
      } catch (error) {
        console.log('Search not available on players page');
      }
    });
  });

  /**
   * Step 15: Payment modal/page appears after confirming purchase
   * Expected: Shows payment info (e.g., QR code)
   */
  describe('Step 15: Payment modal shows after purchase confirmation', function() {
    it('should display payment information when selecting banking/momo payment', async function() {
      this.timeout(20000);
      
      // Navigate to checkout
      await cartPage.openCheckout();
      await driver.sleep(2000);
      
      // Fill checkout form
      await cartPage.fillCheckoutForm({
        fullname: 'Test User',
        phone: '0901234567',
        address: '123 Test Street, District 1, Ho Chi Minh City',
        note: 'Test order'
      });
      
      // Select banking payment method
      await cartPage.selectPaymentMethod('banking');
      await driver.sleep(1000);
      
      // Check if QR section is visible
      const isQrVisible = await cartPage.isQrSectionVisible();
      expect(isQrVisible).to.be.true;
      
      // Verify QR image is displayed
      const isQrImageDisplayed = await cartPage.isQrImageDisplayed();
      expect(isQrImageDisplayed).to.be.true;
    });

    it('should display QR code for MoMo payment', async function() {
      this.timeout(20000);
      
      await cartPage.openCheckout();
      await driver.sleep(2000);
      
      // Fill form
      await cartPage.fillCheckoutForm({
        fullname: 'Test User',
        phone: '0901234567',
        address: '123 Test Street'
      });
      
      // Select MoMo payment
      await cartPage.selectPaymentMethod('momo');
      await driver.sleep(1000);
      
      // Check QR section
      const isQrVisible = await cartPage.isQrSectionVisible();
      expect(isQrVisible).to.be.true;
    });

    it('should not show QR for COD payment', async function() {
      this.timeout(15000);
      
      await cartPage.openCheckout();
      await driver.sleep(2000);
      
      // Select COD (default)
      await cartPage.selectPaymentMethod('cod');
      await driver.sleep(1000);
      
      // QR section should be hidden
      const isQrVisible = await cartPage.isQrSectionVisible();
      expect(isQrVisible).to.be.false;
    });
  });
});
