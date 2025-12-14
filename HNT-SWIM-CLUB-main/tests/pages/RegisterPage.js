const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const config = require('../config');

/**
 * Page Object for Register Page
 */
class RegisterPage extends BasePage {
  constructor(driver) {
    super(driver);
    
    // Locators
    this.fullnameInput = By.id('reg_fullname');
    this.emailInput = By.id('reg_email');
    this.passwordInput = By.id('reg_password');
    this.confirmPasswordInput = By.id('reg_confirm_password');
    this.registerButton = By.id('registerBtn');
    this.messageDiv = By.id('message');
    this.loginLink = By.css('a[href*="login.html"]');
  }

  /**
   * Navigate to register page
   */
  async open() {
    await this.navigate(config.BASE_URL + config.PAGES.REGISTER);
  }

  /**
   * Perform registration
   * @param {string} fullname - Full name
   * @param {string} email - Email address
   * @param {string} password - Password
   * @param {string} confirmPassword - Confirm password
   */
  async register(fullname, email, password, confirmPassword = null) {
    await this.wait.waitForVisible(this.fullnameInput);
    
    await this.driver.findElement(this.fullnameInput).clear();
    await this.driver.findElement(this.fullnameInput).sendKeys(fullname);
    
    await this.driver.findElement(this.emailInput).clear();
    await this.driver.findElement(this.emailInput).sendKeys(email);
    
    await this.driver.findElement(this.passwordInput).clear();
    await this.driver.findElement(this.passwordInput).sendKeys(password);
    
    await this.driver.findElement(this.confirmPasswordInput).clear();
    await this.driver.findElement(this.confirmPasswordInput).sendKeys(confirmPassword || password);
    
    await this.wait.safeClick(this.registerButton);
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
   * Get message class
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
   * Click login link
   */
  async clickLoginLink() {
    await this.wait.safeClick(this.loginLink);
  }

  /**
   * Check if button is disabled
   * @returns {Promise<boolean>}
   */
  async isRegisterButtonDisabled() {
    const element = await this.driver.findElement(this.registerButton);
    const disabled = await element.getAttribute('disabled');
    return disabled === 'true' || disabled === 'disabled';
  }
}

module.exports = RegisterPage;
