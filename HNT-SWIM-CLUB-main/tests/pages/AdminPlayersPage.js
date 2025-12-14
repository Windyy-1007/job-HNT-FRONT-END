const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const config = require('../config');

/**
 * Page Object for Admin Players Management Page (Quản lý Tuyển thủ)
 */
class AdminPlayersPage extends BasePage {
  constructor(driver) {
    super(driver);
    
    // Locators
    this.searchInput = By.css('.search-input, input[type="text"]');
    this.addNewButton = By.css('.btn-add-new, button[onclick*="addtt_admin"]');
    this.dataTable = By.css('.data-table');
    this.tableRows = By.css('.data-table tbody tr');
    this.editButtons = By.css('.btn-edit-admin, button[onclick*="editItem"]');
    this.deleteButtons = By.css('.btn-delete-admin, button[onclick*="deleteItem"]');
    this.confirmDeleteModal = By.css('.modal, .confirm-dialog');
    this.confirmDeleteButton = By.css('.confirm-yes, .btn-confirm');
    
    // Add/Edit form locators
    this.fullnameInput = By.id('full_name');
    this.nicknameInput = By.id('nickname');
    this.positionInput = By.id('position');
    this.specialtyInput = By.id('specialty');
    this.ageInput = By.id('age');
    this.achievementsTextarea = By.id('achievements');
    this.bioTextarea = By.id('bio');
    this.imageInput = By.id('image_url');
    this.imageFileInput = By.css('input[type="file"]');
    this.saveButton = By.css('.btn-save, button[type="submit"]');
    this.cancelButton = By.css('.btn-cancel, button[onclick*="back"]');
    this.successMessage = By.css('.success-msg, .alert-success');
  }

  /**
   * Navigate to admin players page
   */
  async open() {
    await this.navigate(config.BASE_URL + config.PAGES.ADMIN_PLAYERS);
  }

  /**
   * Navigate to add player page
   */
  async openAddPlayerPage() {
    await this.navigate(config.BASE_URL + config.PAGES.ADMIN_ADD_PLAYER);
  }

  /**
   * Click add new button
   */
  async clickAddNewButton() {
    await this.wait.waitForClickable(this.addNewButton);
    await this.wait.safeClick(this.addNewButton);
  }

  /**
   * Get player count in table
   * @returns {Promise<number>}
   */
  async getPlayerCount() {
    try {
      await this.wait.waitForVisible(this.tableRows, 3000);
      const rows = await this.driver.findElements(this.tableRows);
      // Filter out empty rows or "no data" rows
      let count = 0;
      for (const row of rows) {
        const text = await row.getText();
        if (text && !text.includes('Chưa có') && !text.includes('không')) {
          count++;
        }
      }
      return count;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Search for player
   * @param {string} keyword - Search keyword
   */
  async searchPlayer(keyword) {
    await this.wait.waitForVisible(this.searchInput);
    const input = await this.driver.findElement(this.searchInput);
    await input.clear();
    await input.sendKeys(keyword);
    await this.driver.sleep(1000); // Wait for search results
  }

  /**
   * Fill add/edit player form
   * @param {Object} data - Player data
   */
  async fillPlayerForm(data) {
    await this.wait.waitForVisible(this.fullnameInput);
    
    if (data.fullName) {
      await this.driver.findElement(this.fullnameInput).clear();
      await this.driver.findElement(this.fullnameInput).sendKeys(data.fullName);
    }
    
    if (data.nickname) {
      await this.driver.findElement(this.nicknameInput).clear();
      await this.driver.findElement(this.nicknameInput).sendKeys(data.nickname);
    }
    
    if (data.position) {
      await this.driver.findElement(this.positionInput).clear();
      await this.driver.findElement(this.positionInput).sendKeys(data.position);
    }
    
    if (data.specialty) {
      await this.driver.findElement(this.specialtyInput).clear();
      await this.driver.findElement(this.specialtyInput).sendKeys(data.specialty);
    }
    
    if (data.age) {
      await this.driver.findElement(this.ageInput).clear();
      await this.driver.findElement(this.ageInput).sendKeys(data.age);
    }
    
    if (data.achievements) {
      await this.driver.findElement(this.achievementsTextarea).clear();
      await this.driver.findElement(this.achievementsTextarea).sendKeys(data.achievements);
    }
    
    if (data.bio) {
      try {
        await this.driver.findElement(this.bioTextarea).clear();
        await this.driver.findElement(this.bioTextarea).sendKeys(data.bio);
      } catch (error) {
        console.log('Bio field not available');
      }
    }
    
    if (data.imageUrl) {
      try {
        await this.driver.findElement(this.imageInput).clear();
        await this.driver.findElement(this.imageInput).sendKeys(data.imageUrl);
      } catch (error) {
        console.log('Image URL field not available');
      }
    }
  }

  /**
   * Upload player image file
   * @param {string} filePath - Absolute file path
   */
  async uploadImage(filePath) {
    try {
      await this.wait.waitForPresent(this.imageFileInput);
      const fileInput = await this.driver.findElement(this.imageFileInput);
      await fileInput.sendKeys(filePath);
    } catch (error) {
      console.log('File upload not available');
    }
  }

  /**
   * Click save button
   */
  async clickSaveButton() {
    await this.wait.waitForClickable(this.saveButton);
    await this.wait.safeClick(this.saveButton);
  }

  /**
   * Add new player
   * @param {Object} data - Player data
   */
  async addPlayer(data) {
    await this.fillPlayerForm(data);
    await this.clickSaveButton();
  }

  /**
   * Click edit button for player
   * @param {number} index - Player row index (0-based)
   */
  async clickEditPlayer(index = 0) {
    await this.wait.waitForVisible(this.editButtons);
    const buttons = await this.driver.findElements(this.editButtons);
    if (buttons.length > index) {
      await buttons[index].click();
    } else {
      throw new Error(`Edit button at index ${index} not found`);
    }
  }

  /**
   * Click delete button for player
   * @param {number} index - Player row index (0-based)
   */
  async clickDeletePlayer(index = 0) {
    await this.wait.waitForVisible(this.deleteButtons);
    const buttons = await this.driver.findElements(this.deleteButtons);
    if (buttons.length > index) {
      await buttons[index].click();
    } else {
      throw new Error(`Delete button at index ${index} not found`);
    }
  }

  /**
   * Confirm deletion
   */
  async confirmDeletion() {
    try {
      // Try modal confirmation first
      await this.wait.waitForVisible(this.confirmDeleteModal, 2000);
      await this.wait.safeClick(this.confirmDeleteButton);
    } catch (error) {
      // Try alert confirmation
      try {
        const alert = await this.wait.waitForAlert(2000);
        await alert.accept();
      } catch (alertError) {
        console.log('No confirmation dialog found, assuming direct deletion');
      }
    }
  }

  /**
   * Delete player with confirmation
   * @param {number} index - Player row index
   */
  async deletePlayerWithConfirmation(index = 0) {
    const initialCount = await this.getPlayerCount();
    await this.clickDeletePlayer(index);
    await this.confirmDeletion();
    
    // Wait for player to be removed
    await this.driver.sleep(1000);
    await this.refresh();
    
    return initialCount;
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
   * Get player name from table row
   * @param {number} index - Row index
   * @returns {Promise<string>}
   */
  async getPlayerNameFromTable(index = 0) {
    await this.wait.waitForVisible(this.tableRows);
    const rows = await this.driver.findElements(this.tableRows);
    if (rows.length > index) {
      const cells = await rows[index].findElements(By.css('td'));
      // Typically name is in 3rd column (index 2)
      if (cells.length > 2) {
        return await cells[2].getText();
      }
    }
    return '';
  }
}

module.exports = AdminPlayersPage;
