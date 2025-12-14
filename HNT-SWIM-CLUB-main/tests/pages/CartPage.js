const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const config = require('../config');

/**
 * Page Object for Cart/Checkout Pages
 */
class CartPage extends BasePage {
  constructor(driver) {
    super(driver);
    
    // Cart page locators
    this.cartItems = By.css('.cart-item, tbody tr');
    this.emptyCartMessage = By.css('.empty-cart, .empty-msg');
    this.checkoutButton = By.css('.btn-checkout, button[onclick*="checkout"], a[href*="thanhtoan"]');
    this.totalPrice = By.css('.total-price, #total-price');
    this.removeButtons = By.css('.btn-remove, .remove-item');
    
    // Checkout page locators
    this.fullnameInput = By.id('fullname');
    this.phoneInput = By.id('phone');
    this.addressInput = By.id('address');
    this.noteTextarea = By.id('note');
    this.paymentMethodRadios = By.css('input[name="payment"]');
    this.codRadio = By.css('input[value="cod"]');
    this.bankingRadio = By.css('input[value="banking"]');
    this.momoRadio = By.css('input[value="momo"]');
    this.placeOrderButton = By.css('button[type="submit"], .btn-order');
    this.qrSection = By.id('qr-section');
    this.qrImage = By.css('.qr-image img, #qr-section img');
  }

  /**
   * Navigate to cart page
   */
  async openCart() {
    await this.navigate(config.BASE_URL + config.PAGES.CART);
  }

  /**
   * Navigate to checkout page
   */
  async openCheckout() {
    await this.navigate(config.BASE_URL + config.PAGES.CHECKOUT);
  }

  /**
   * Get cart item count
   * @returns {Promise<number>}
   */
  async getCartItemCount() {
    try {
      const items = await this.driver.findElements(this.cartItems);
      return items.length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Check if cart is empty
   * @returns {Promise<boolean>}
   */
  async isCartEmpty() {
    try {
      await this.driver.findElement(this.emptyCartMessage);
      return true;
    } catch (error) {
      const count = await this.getCartItemCount();
      return count === 0;
    }
  }

  /**
   * Click checkout button
   */
  async clickCheckoutButton() {
    await this.wait.waitForClickable(this.checkoutButton);
    await this.wait.safeClick(this.checkoutButton);
  }

  /**
   * Get total price
   * @returns {Promise<string>}
   */
  async getTotalPrice() {
    await this.wait.waitForVisible(this.totalPrice);
    return await this.driver.findElement(this.totalPrice).getText();
  }

  /**
   * Fill checkout form
   * @param {Object} data - Checkout data
   */
  async fillCheckoutForm(data) {
    await this.wait.waitForVisible(this.fullnameInput);
    
    if (data.fullname) {
      await this.driver.findElement(this.fullnameInput).clear();
      await this.driver.findElement(this.fullnameInput).sendKeys(data.fullname);
    }
    
    if (data.phone) {
      await this.driver.findElement(this.phoneInput).clear();
      await this.driver.findElement(this.phoneInput).sendKeys(data.phone);
    }
    
    if (data.address) {
      await this.driver.findElement(this.addressInput).clear();
      await this.driver.findElement(this.addressInput).sendKeys(data.address);
    }
    
    if (data.note) {
      await this.driver.findElement(this.noteTextarea).clear();
      await this.driver.findElement(this.noteTextarea).sendKeys(data.note);
    }
  }

  /**
   * Select payment method
   * @param {string} method - 'cod', 'banking', or 'momo'
   */
  async selectPaymentMethod(method) {
    let radio;
    switch (method.toLowerCase()) {
      case 'cod':
        radio = this.codRadio;
        break;
      case 'banking':
        radio = this.bankingRadio;
        break;
      case 'momo':
        radio = this.momoRadio;
        break;
      default:
        throw new Error(`Unknown payment method: ${method}`);
    }
    
    await this.wait.waitForClickable(radio);
    await this.driver.findElement(radio).click();
  }

  /**
   * Click place order button
   */
  async clickPlaceOrderButton() {
    await this.wait.waitForClickable(this.placeOrderButton);
    await this.wait.safeClick(this.placeOrderButton);
  }

  /**
   * Check if QR code section is visible
   * @returns {Promise<boolean>}
   */
  async isQrSectionVisible() {
    try {
      const section = await this.driver.findElement(this.qrSection);
      return await section.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if QR code image is displayed
   * @returns {Promise<boolean>}
   */
  async isQrImageDisplayed() {
    try {
      const img = await this.driver.findElement(this.qrImage);
      return await img.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  /**
   * Complete checkout process
   * @param {Object} data - Checkout data
   * @param {string} paymentMethod - Payment method
   */
  async completeCheckout(data, paymentMethod = 'cod') {
    await this.fillCheckoutForm(data);
    await this.selectPaymentMethod(paymentMethod);
    await this.clickPlaceOrderButton();
  }
}

module.exports = CartPage;
