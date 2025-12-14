const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const config = require('../config');

/**
 * Page Object for User Orders Page (Người dùng - Đơn hàng)
 */
class OrdersPage extends BasePage {
  constructor(driver) {
    super(driver);
    
    // Locators
    this.ordersTab = By.css('a[href="#orders"], .tab-orders, button[onclick*="orders"]');
    this.orderItems = By.css('.order-item, .order-card');
    this.orderStatuses = By.css('.order-status');
    this.viewDetailButtons = By.css('.view-detail-btn, .btn-detail');
    this.editButtons = By.css('.edit-btn, button[onclick*="edit"]');
    this.cancelButtons = By.css('.cancel-btn, button[onclick*="cancel"]');
    this.confirmCancelModal = By.css('.modal, .confirm-dialog');
    this.confirmCancelButton = By.css('.confirm-yes, .btn-confirm, button[onclick*="confirmCancel"]');
    this.cancelTabLink = By.css('a[href="#cancelled"], .tab-cancelled');
    this.editNameInput = By.css('input[name="recipient_name"], #edit-name');
    this.editAddressInput = By.css('input[name="recipient_address"], textarea[name="address"], #edit-address');
    this.saveEditButton = By.css('.save-btn, button[onclick*="save"]');
    this.successMessage = By.css('.success-msg, .alert-success, #message.success');
    this.errorMessage = By.css('.error-msg, .alert-error, #message.error');
  }

  /**
   * Navigate to orders page
   */
  async open() {
    await this.navigate(config.BASE_URL + config.PAGES.USER_PROFILE);
    try {
      await this.wait.waitForClickable(this.ordersTab, 3000);
      await this.wait.safeClick(this.ordersTab);
    } catch (error) {
      console.log('Orders tab not found or already on orders section');
    }
  }

  /**
   * Get order count
   * @returns {Promise<number>}
   */
  async getOrderCount() {
    try {
      await this.wait.waitForVisible(this.orderItems, 3000);
      const orders = await this.driver.findElements(this.orderItems);
      return orders.length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get order status by index
   * @param {number} index - Order index
   * @returns {Promise<string>}
   */
  async getOrderStatus(index = 0) {
    await this.wait.waitForVisible(this.orderStatuses);
    const statuses = await this.driver.findElements(this.orderStatuses);
    if (statuses.length > index) {
      return await statuses[index].getText();
    }
    return '';
  }

  /**
   * Click view detail button for order
   * @param {number} index - Order index
   */
  async clickViewDetail(index = 0) {
    await this.wait.waitForVisible(this.viewDetailButtons);
    const buttons = await this.driver.findElements(this.viewDetailButtons);
    if (buttons.length > index) {
      await buttons[index].click();
    }
  }

  /**
   * Click edit button for order
   * @param {number} index - Order index
   */
  async clickEditOrder(index = 0) {
    await this.wait.waitForVisible(this.editButtons);
    const buttons = await this.driver.findElements(this.editButtons);
    if (buttons.length > index) {
      await buttons[index].click();
    }
  }

  /**
   * Edit order recipient info
   * @param {string} name - New recipient name
   * @param {string} address - New recipient address
   */
  async editRecipientInfo(name, address) {
    try {
      if (name) {
        await this.wait.waitForVisible(this.editNameInput);
        const nameInput = await this.driver.findElement(this.editNameInput);
        await nameInput.clear();
        await nameInput.sendKeys(name);
      }
      
      if (address) {
        await this.wait.waitForVisible(this.editAddressInput);
        const addressInput = await this.driver.findElement(this.editAddressInput);
        await addressInput.clear();
        await addressInput.sendKeys(address);
      }
      
      await this.wait.safeClick(this.saveEditButton);
    } catch (error) {
      throw new Error('Unable to edit recipient info: ' + error.message);
    }
  }

  /**
   * Click cancel button for order
   * @param {number} index - Order index
   */
  async clickCancelOrder(index = 0) {
    await this.wait.waitForVisible(this.cancelButtons);
    const buttons = await this.driver.findElements(this.cancelButtons);
    if (buttons.length > index) {
      await buttons[index].click();
    }
  }

  /**
   * Confirm order cancellation
   */
  async confirmCancellation() {
    try {
      await this.wait.waitForVisible(this.confirmCancelModal);
      await this.wait.safeClick(this.confirmCancelButton);
    } catch (error) {
      // Try alternative confirmation (alert)
      try {
        const alert = await this.wait.waitForAlert();
        await alert.accept();
      } catch (alertError) {
        throw new Error('Unable to confirm cancellation: ' + error.message);
      }
    }
  }

  /**
   * Cancel order with confirmation
   * @param {number} index - Order index
   */
  async cancelOrderWithConfirmation(index = 0) {
    await this.clickCancelOrder(index);
    await this.confirmCancellation();
  }

  /**
   * Click cancelled orders tab
   */
  async clickCancelledTab() {
    try {
      await this.wait.safeClick(this.cancelTabLink);
    } catch (error) {
      console.log('Cancelled tab not found');
    }
  }

  /**
   * Get success message
   * @returns {Promise<string>}
   */
  async getSuccessMessage() {
    try {
      await this.wait.waitForVisible(this.successMessage, 5000);
      return await this.driver.findElement(this.successMessage).getText();
    } catch (error) {
      return '';
    }
  }

  /**
   * Get error message
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    try {
      await this.wait.waitForVisible(this.errorMessage, 5000);
      return await this.driver.findElement(this.errorMessage).getText();
    } catch (error) {
      return '';
    }
  }

  /**
   * Check if order can be edited
   * @param {number} index - Order index
   * @returns {Promise<boolean>}
   */
  async canEditOrder(index = 0) {
    try {
      const buttons = await this.driver.findElements(this.editButtons);
      if (buttons.length > index) {
        return await buttons[index].isEnabled();
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}

module.exports = OrdersPage;
