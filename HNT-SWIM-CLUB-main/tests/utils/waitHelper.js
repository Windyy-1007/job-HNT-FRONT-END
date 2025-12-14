const { By, until } = require('selenium-webdriver');
const config = require('../config');

/**
 * Wait utilities for Selenium tests
 */
class WaitHelper {
  constructor(driver) {
    this.driver = driver;
    this.timeout = config.EXPLICIT_WAIT * 1000;
  }

  /**
   * Wait for element to be visible
   * @param {By} locator - Element locator
   * @param {number} timeout - Optional custom timeout
   * @returns {Promise<WebElement>}
   */
  async waitForVisible(locator, timeout = this.timeout) {
    return await this.driver.wait(
      until.elementLocated(locator),
      timeout,
      `Element ${locator} not found within ${timeout}ms`
    ).then(element => 
      this.driver.wait(
        until.elementIsVisible(element),
        timeout,
        `Element ${locator} not visible within ${timeout}ms`
      )
    );
  }

  /**
   * Wait for element to be clickable
   * @param {By} locator - Element locator
   * @param {number} timeout - Optional custom timeout
   * @returns {Promise<WebElement>}
   */
  async waitForClickable(locator, timeout = this.timeout) {
    const element = await this.waitForVisible(locator, timeout);
    return await this.driver.wait(
      until.elementIsEnabled(element),
      timeout,
      `Element ${locator} not clickable within ${timeout}ms`
    );
  }

  /**
   * Wait for element to contain text
   * @param {By} locator - Element locator
   * @param {string} text - Expected text
   * @param {number} timeout - Optional custom timeout
   */
  async waitForTextContains(locator, text, timeout = this.timeout) {
    await this.driver.wait(async () => {
      const element = await this.driver.findElement(locator);
      const elementText = await element.getText();
      return elementText.includes(text);
    }, timeout, `Element ${locator} does not contain text "${text}" within ${timeout}ms`);
  }

  /**
   * Wait for URL to contain substring
   * @param {string} urlSubstring - Expected URL substring
   * @param {number} timeout - Optional custom timeout
   */
  async waitForUrlContains(urlSubstring, timeout = this.timeout) {
    await this.driver.wait(
      until.urlContains(urlSubstring),
      timeout,
      `URL does not contain "${urlSubstring}" within ${timeout}ms`
    );
  }

  /**
   * Wait for element to be invisible or not present
   * @param {By} locator - Element locator
   * @param {number} timeout - Optional custom timeout
   */
  async waitForInvisible(locator, timeout = this.timeout) {
    try {
      const element = await this.driver.findElement(locator);
      await this.driver.wait(
        until.stalenessOf(element),
        timeout
      );
    } catch (error) {
      // Element not found is acceptable
      if (!error.name || error.name !== 'NoSuchElementError') {
        throw error;
      }
    }
  }

  /**
   * Wait for element to be present in DOM (may not be visible)
   * @param {By} locator - Element locator
   * @param {number} timeout - Optional custom timeout
   */
  async waitForPresent(locator, timeout = this.timeout) {
    return await this.driver.wait(
      until.elementLocated(locator),
      timeout,
      `Element ${locator} not present within ${timeout}ms`
    );
  }

  /**
   * Wait for alert to be present
   * @param {number} timeout - Optional custom timeout
   */
  async waitForAlert(timeout = this.timeout) {
    return await this.driver.wait(
      until.alertIsPresent(),
      timeout,
      `Alert not present within ${timeout}ms`
    );
  }

  /**
   * Custom wait with condition function
   * @param {Function} conditionFn - Function that returns boolean
   * @param {string} message - Error message
   * @param {number} timeout - Optional custom timeout
   */
  async waitForCondition(conditionFn, message, timeout = this.timeout) {
    await this.driver.wait(conditionFn, timeout, message);
  }

  /**
   * Safe click with retry logic
   * @param {By} locator - Element locator
   * @param {number} retries - Number of retry attempts
   */
  async safeClick(locator, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const element = await this.waitForClickable(locator);
        await element.click();
        return;
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.driver.sleep(500);
      }
    }
  }

  /**
   * Scroll element into view
   * @param {WebElement} element - Element to scroll to
   */
  async scrollIntoView(element) {
    await this.driver.executeScript('arguments[0].scrollIntoView({behavior: "smooth", block: "center"});', element);
    await this.driver.sleep(300); // Allow smooth scroll to complete
  }
}

module.exports = WaitHelper;
