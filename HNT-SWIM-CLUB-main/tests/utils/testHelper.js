const { By } = require('selenium-webdriver');

/**
 * Test data utilities
 */
class TestDataHelper {
  /**
   * Generate unique email for testing
   * @param {string} prefix - Email prefix
   * @returns {string} Unique email
   */
  static generateUniqueEmail(prefix = 'test') {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}_${timestamp}_${random}@test.com`;
  }

  /**
   * Generate unique username
   * @param {string} prefix - Username prefix
   * @returns {string} Unique username
   */
  static generateUniqueUsername(prefix = 'user') {
    const timestamp = Date.now();
    return `${prefix}_${timestamp}`;
  }

  /**
   * Generate test user data
   * @param {boolean} unique - Whether to generate unique data
   * @returns {Object} User data object
   */
  static generateUserData(unique = false) {
    if (unique) {
      return {
        fullname: `Test User ${Date.now()}`,
        email: this.generateUniqueEmail('testuser'),
        password: 'Test@123456'
      };
    }
    
    return {
      fullname: 'Test User',
      email: 'testuser@example.com',
      password: 'password123'
    };
  }

  /**
   * Generate test player data
   * @returns {Object} Player data object
   */
  static generatePlayerData() {
    const timestamp = Date.now();
    return {
      fullName: `Tuyển thủ Test ${timestamp}`,
      nickname: `Nickname ${timestamp}`,
      position: 'Bơi ngửa',
      specialty: '100m Ngửa',
      age: '20',
      achievements: 'Vô địch giải Quốc gia 2024',
      bio: 'Đây là tuyển thủ test được tạo tự động'
    };
  }
}

/**
 * Authentication helper for managing login state
 */
class AuthHelper {
  constructor(driver) {
    this.driver = driver;
  }

  /**
   * Set authentication token in localStorage
   * @param {string} token - JWT token
   * @param {Object} userData - Additional user data
   */
  async setAuthToken(token, userData = {}) {
    await this.driver.executeScript(`
      localStorage.setItem('token', '${token}');
      ${userData.userId ? `localStorage.setItem('userId', '${userData.userId}');` : ''}
      ${userData.role ? `localStorage.setItem('role', '${userData.role}');` : ''}
      ${userData.email ? `localStorage.setItem('userEmail', '${userData.email}');` : ''}
    `);
  }

  /**
   * Get authentication token from localStorage
   * @returns {Promise<string|null>} Token or null
   */
  async getAuthToken() {
    return await this.driver.executeScript(`
      return localStorage.getItem('token');
    `);
  }

  /**
   * Clear all authentication data
   */
  async clearAuth() {
    await this.driver.executeScript(`
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      localStorage.removeItem('userEmail');
    `);
  }

  /**
   * Check if user is logged in
   * @returns {Promise<boolean>}
   */
  async isLoggedIn() {
    const token = await this.getAuthToken();
    return token !== null && token !== '';
  }

  /**
   * Get user role from localStorage
   * @returns {Promise<string|null>}
   */
  async getUserRole() {
    return await this.driver.executeScript(`
      return localStorage.getItem('role');
    `);
  }
}

/**
 * Utility for element interaction helpers
 */
class ElementHelper {
  constructor(driver) {
    this.driver = driver;
  }

  /**
   * Check if element exists
   * @param {By} locator - Element locator
   * @returns {Promise<boolean>}
   */
  async isElementPresent(locator) {
    try {
      await this.driver.findElement(locator);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if element is visible
   * @param {By} locator - Element locator
   * @returns {Promise<boolean>}
   */
  async isElementVisible(locator) {
    try {
      const element = await this.driver.findElement(locator);
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  /**
   * Get element text safely
   * @param {By} locator - Element locator
   * @returns {Promise<string>}
   */
  async getTextSafe(locator) {
    try {
      const element = await this.driver.findElement(locator);
      return await element.getText();
    } catch (error) {
      return '';
    }
  }

  /**
   * Get element attribute safely
   * @param {By} locator - Element locator
   * @param {string} attribute - Attribute name
   * @returns {Promise<string>}
   */
  async getAttributeSafe(locator, attribute) {
    try {
      const element = await this.driver.findElement(locator);
      return await element.getAttribute(attribute);
    } catch (error) {
      return '';
    }
  }

  /**
   * Count elements matching locator
   * @param {By} locator - Element locator
   * @returns {Promise<number>}
   */
  async countElements(locator) {
    try {
      const elements = await this.driver.findElements(locator);
      return elements.length;
    } catch (error) {
      return 0;
    }
  }
}

module.exports = {
  TestDataHelper,
  AuthHelper,
  ElementHelper
};
