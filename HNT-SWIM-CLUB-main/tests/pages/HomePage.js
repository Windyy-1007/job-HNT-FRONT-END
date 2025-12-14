const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const config = require('../config');

/**
 * Page Object for Home Page (Trang Chủ)
 */
class HomePage extends BasePage {
  constructor(driver) {
    super(driver);
    
    // Locators
    this.logo = By.css('.logo');
    this.loginLink = By.css('a[href*="login.html"]');
    this.profileLink = By.css('a[href*="nguoidung.html"]');
    this.cartLink = By.css('a[href*="giohang"], a[href*="ghtt.html"]');
    this.productsLink = By.css('a[href*="danhmuc_sp.html"]');
    this.playersLink = By.css('a[href*="tuyenthu"]');
    this.eventsLink = By.css('a[href*="sukien"]');
    this.productCards = By.css('.product-card, .product-item');
    this.addToCartButtons = By.css('.add-btn, .btn-add-cart');
    this.searchInput = By.css('input[type="search"], .search-input');
  }

  /**
   * Navigate to home page
   */
  async open() {
    await this.navigate(config.BASE_URL + config.PAGES.HOME);
  }

  /**
   * Check if user is logged in (by checking profile link visibility)
   * @returns {Promise<boolean>}
   */
  async isLoggedIn() {
    try {
      await this.driver.findElement(this.profileLink);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Click login link
   */
  async clickLoginLink() {
    await this.wait.safeClick(this.loginLink);
  }

  /**
   * Click profile link
   */
  async clickProfileLink() {
    await this.wait.safeClick(this.profileLink);
  }

  /**
   * Click cart link
   */
  async clickCartLink() {
    await this.wait.safeClick(this.cartLink);
  }

  /**
   * Click products link
   */
  async clickProductsLink() {
    await this.wait.safeClick(this.productsLink);
  }

  /**
   * Click players link
   */
  async clickPlayersLink() {
    await this.wait.safeClick(this.playersLink);
  }

  /**
   * Get count of product cards displayed
   * @returns {Promise<number>}
   */
  async getProductCount() {
    try {
      const products = await this.driver.findElements(this.productCards);
      return products.length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Click first product card
   */
  async clickFirstProduct() {
    await this.wait.waitForVisible(this.productCards);
    const products = await this.driver.findElements(this.productCards);
    if (products.length > 0) {
      await products[0].click();
    } else {
      throw new Error('No products found on home page');
    }
  }

  /**
   * Search for keyword
   * @param {string} keyword - Search keyword
   */
  async search(keyword) {
    try {
      await this.wait.waitForVisible(this.searchInput);
      const searchBox = await this.driver.findElement(this.searchInput);
      await searchBox.clear();
      await searchBox.sendKeys(keyword);
      await searchBox.submit();
    } catch (error) {
      console.log('Search functionality not available on this page');
    }
  }

  /**
   * Logout user
   */
  async logout() {
    await this.executeScript('localStorage.clear();');
    await this.refresh();
  }
}

module.exports = HomePage;
