const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const config = require('../config');

/**
 * Page Object for Login Page
 */
class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    
    // Locators
    this.usernameInput = By.id('username');
    this.passwordInput = By.id('password');
    this.loginButton = By.id('loginBtn');
    this.messageDiv = By.id('message');
    this.registerLink = By.css('a[href*="đk.html"]');
    this.forgotPasswordLink = By.css('a[href*="qmk.html"]');
  }

  /**
   * Navigate to login page
   */
  async open() {
    await this.navigate(config.BASE_URL + config.PAGES.LOGIN);
  }

  /**
   * Perform login
   * @param {string} email - User email
   * @param {string} password - User password
   */
  async login(email, password) {
    await this.wait.waitForVisible(this.usernameInput);
    await this.driver.findElement(this.usernameInput).clear();
    await this.driver.findElement(this.usernameInput).sendKeys(email);
    
    await this.driver.findElement(this.passwordInput).clear();
    await this.driver.findElement(this.passwordInput).sendKeys(password);
    
    await this.wait.safeClick(this.loginButton);
  }

  /**
   * Get message text
   * @returns {Promise<string>}
   */
  async getMessageText() {
    await this.wait.waitForVisible(this.messageDiv);
    return await this.driver.findElement(this.messageDiv).getText();
  }

  /**
   * Get message class (success/error)
   * @returns {Promise<string>}
   */
  async getMessageClass() {
    await this.wait.waitForVisible(this.messageDiv);
    return await this.driver.findElement(this.messageDiv).getAttribute('class');
  }

  /**
   * Check if message is success
   * @returns {Promise<boolean>}
   */
  async isSuccessMessage() {
    const className = await this.getMessageClass();
    return className.includes('success');
  }

  /**
   * Check if message is error
   * @returns {Promise<boolean>}
   */
  async isErrorMessage() {
    const className = await this.getMessageClass();
    return className.includes('error');
  }

  /**
   * Click register link
   */
  async clickRegisterLink() {
    await this.wait.safeClick(this.registerLink);
  }

  /**
   * Wait for redirect after login
   * @param {number} timeout - Wait timeout
   */
  async waitForRedirect(timeout = 5000) {
    await this.driver.sleep(timeout);
  }
}

module.exports = LoginPage;
