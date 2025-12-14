const { By } = require('selenium-webdriver');
const WaitHelper = require('../utils/waitHelper');

/**
 * Base Page Object with common functionality
 */
class BasePage {
  constructor(driver) {
    this.driver = driver;
    this.wait = new WaitHelper(driver);
  }

  /**
   * Navigate to a URL
   * @param {string} url - Full URL to navigate to
   */
  async navigate(url) {
    await this.driver.get(url);
  }

  /**
   * Get current URL
   * @returns {Promise<string>}
   */
  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  /**
   * Get page title
   * @returns {Promise<string>}
   */
  async getPageTitle() {
    return await this.driver.getTitle();
  }

  /**
   * Execute JavaScript
   * @param {string} script - JavaScript code to execute
   * @param  {...any} args - Arguments to pass to script
   * @returns {Promise<any>}
   */
  async executeScript(script, ...args) {
    return await this.driver.executeScript(script, ...args);
  }

  /**
   * Take screenshot
   * @returns {Promise<string>} Base64 encoded screenshot
   */
  async takeScreenshot() {
    return await this.driver.takeScreenshot();
  }

  /**
   * Refresh page
   */
  async refresh() {
    await this.driver.navigate().refresh();
  }

  /**
   * Clear localStorage
   */
  async clearLocalStorage() {
    await this.executeScript('localStorage.clear();');
  }

  /**
   * Clear sessionStorage
   */
  async clearSessionStorage() {
    await this.executeScript('sessionStorage.clear();');
  }
}

module.exports = BasePage;
