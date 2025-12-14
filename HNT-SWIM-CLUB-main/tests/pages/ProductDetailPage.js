const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const config = require('../config');

/**
 * Page Object for Product Detail Page
 */
class ProductDetailPage extends BasePage {
  constructor(driver) {
    super(driver);
    
    // Locators
    this.productName = By.css('.product-name, h1, .detail-title');
    this.productPrice = By.css('.product-price, .price');
    this.productImage = By.css('.product-image img, .detail-image img');
    this.buyButton = By.css('.btn-buy, .add-to-cart, button[onclick*="addToCart"]');
    this.backButton = By.css('.btn-back, button[onclick*="back"], a[href*="trangchu"]');
    this.quantityInput = By.css('input[type="number"], .quantity-input');
    this.sizeSelect = By.css('select[name="size"], .size-select');
  }

  /**
   * Navigate to product detail page
   * @param {number} productId - Product ID
   */
  async open(productId) {
    await this.navigate(config.BASE_URL + config.PAGES.PRODUCT_DETAIL + `?id=${productId}`);
  }

  /**
   * Get product name
   * @returns {Promise<string>}
   */
  async getProductName() {
    await this.wait.waitForVisible(this.productName);
    return await this.driver.findElement(this.productName).getText();
  }

  /**
   * Get product price
   * @returns {Promise<string>}
   */
  async getProductPrice() {
    await this.wait.waitForVisible(this.productPrice);
    return await this.driver.findElement(this.productPrice).getText();
  }

  /**
   * Click buy button
   */
  async clickBuyButton() {
    await this.wait.waitForClickable(this.buyButton);
    await this.wait.safeClick(this.buyButton);
  }

  /**
   * Click back button
   */
  async clickBackButton() {
    try {
      await this.wait.safeClick(this.backButton);
    } catch (error) {
      // Fallback to browser back
      await this.driver.navigate().back();
    }
  }

  /**
   * Set quantity
   * @param {number} quantity - Quantity to set
   */
  async setQuantity(quantity) {
    try {
      await this.wait.waitForVisible(this.quantityInput);
      const input = await this.driver.findElement(this.quantityInput);
      await input.clear();
      await input.sendKeys(quantity.toString());
    } catch (error) {
      console.log('Quantity input not available');
    }
  }

  /**
   * Select size
   * @param {string} size - Size to select
   */
  async selectSize(size) {
    try {
      await this.wait.waitForVisible(this.sizeSelect);
      const select = await this.driver.findElement(this.sizeSelect);
      await select.sendKeys(size);
    } catch (error) {
      console.log('Size selector not available');
    }
  }

  /**
   * Check if product image is displayed
   * @returns {Promise<boolean>}
   */
  async isProductImageDisplayed() {
    try {
      const img = await this.driver.findElement(this.productImage);
      return await img.isDisplayed();
    } catch (error) {
      return false;
    }
  }
}

module.exports = ProductDetailPage;
