const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('../config');

/**
 * Creates and configures a WebDriver instance
 * @returns {Promise<WebDriver>} Configured WebDriver instance
 */
async function createDriver() {
  const options = new chrome.Options();
  
  if (config.HEADLESS) {
    options.addArguments('--headless=new');
  }
  
  // Standard Chrome options for stability
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-gpu');
  options.addArguments('--window-size=1920,1080');
  options.addArguments('--disable-blink-features=AutomationControlled');
  options.addArguments('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  
  // Set implicit wait
  await driver.manage().setTimeouts({ implicit: config.IMPLICIT_WAIT });
  
  return driver;
}

module.exports = { createDriver };
