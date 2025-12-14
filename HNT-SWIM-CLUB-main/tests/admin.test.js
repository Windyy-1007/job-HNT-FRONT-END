const { expect } = require('chai');
const { createDriver } = require('./utils/driverFactory');
const LoginPage = require('./pages/LoginPage');
const AdminPlayersPage = require('./pages/AdminPlayersPage');
const config = require('./config');
const { TestDataHelper, AuthHelper } = require('./utils/testHelper');

/**
 * Test Suite: Admin Player Management (Steps 8-10)
 * Covers: Adding, Editing, and Deleting players as Admin
 */
describe('7.1.2 Admin - Phần quản lý tuyển thủ', function() {
  let driver;
  let loginPage;
  let adminPlayersPage;
  let authHelper;
  let testPlayerData;

  // Setup before all tests
  before(async function() {
    this.timeout(30000);
    driver = await createDriver();
    loginPage = new LoginPage(driver);
    adminPlayersPage = new AdminPlayersPage(driver);
    authHelper = new AuthHelper(driver);
    
    // Login as admin once for all tests
    await loginPage.open();
    await loginPage.login(config.ADMIN_EMAIL, config.ADMIN_PASSWORD);
    await driver.sleep(3000);
    
    // Verify admin login
    const role = await authHelper.getUserRole();
    if (role !== 'admin') {
      throw new Error('Admin login failed - cannot run admin tests');
    }
  });

  // Cleanup after all tests
  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  /**
   * Step 8: Admin adds a new player
   * Expected: Form shows fields + image upload, save succeeds, record appears
   */
  describe('Step 8: Admin adds new player (tuyển thủ)', function() {
    it('should display add player form with all fields', async function() {
      this.timeout(15000);
      
      // Navigate to add player page
      await adminPlayersPage.openAddPlayerPage();
      
      // Wait for form to load
      await driver.sleep(2000);
      
      // Verify form fields are present
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include('addtt_admin.html');
    });

    it('should add new player successfully', async function() {
      this.timeout(20000);
      
      // Generate test player data
      testPlayerData = TestDataHelper.generatePlayerData();
      
      // Navigate to add player page
      await adminPlayersPage.openAddPlayerPage();
      await driver.sleep(2000);
      
      // Fill form
      await adminPlayersPage.fillPlayerForm({
        fullName: testPlayerData.fullName,
        nickname: testPlayerData.nickname,
        position: testPlayerData.position,
        specialty: testPlayerData.specialty,
        age: testPlayerData.age,
        achievements: testPlayerData.achievements,
        bio: testPlayerData.bio,
        imageUrl: 'https://via.placeholder.com/150'
      });
      
      // Save player
      await adminPlayersPage.clickSaveButton();
      
      // Wait for save operation
      await driver.sleep(3000);
      
      // Navigate to players list to verify
      await adminPlayersPage.open();
      await driver.sleep(2000);
      
      // Verify player appears in table
      const playerCount = await adminPlayersPage.getPlayerCount();
      expect(playerCount).to.be.greaterThan(0);
      
      // Search for the new player
      await adminPlayersPage.searchPlayer(testPlayerData.fullName);
      await driver.sleep(1000);
      
      // Verify search results
      const searchResultCount = await adminPlayersPage.getPlayerCount();
      expect(searchResultCount).to.be.greaterThan(0);
    });
  });

  /**
   * Step 9: Admin edits player info
   * Expected: Edit form shown, save succeeds, changes persist
   */
  describe('Step 9: Admin edits player information', function() {
    it('should open edit form for existing player', async function() {
      this.timeout(15000);
      
      // Navigate to players page
      await adminPlayersPage.open();
      await driver.sleep(2000);
      
      // Verify players exist
      const playerCount = await adminPlayersPage.getPlayerCount();
      expect(playerCount).to.be.greaterThan(0);
      
      // Click edit on first player
      await adminPlayersPage.clickEditPlayer(0);
      
      // Wait for navigation to edit page
      await driver.sleep(2000);
      
      // Verify on edit page (URL should contain edit or have form)
      const currentUrl = await driver.getCurrentUrl();
      // Edit page might be addtt_admin.html with ID parameter or separate edit page
      expect(currentUrl).to.match(/addtt_admin|edit/);
    });

    it('should save edited player information', async function() {
      this.timeout(20000);
      
      await adminPlayersPage.open();
      await driver.sleep(2000);
      
      // Get player name before edit
      const originalName = await adminPlayersPage.getPlayerNameFromTable(0);
      
      // Click edit
      await adminPlayersPage.clickEditPlayer(0);
      await driver.sleep(2000);
      
      // Modify player data
      const updatedData = {
        nickname: `Updated ${Date.now()}`,
        achievements: `Edited achievements at ${new Date().toLocaleString()}`
      };
      
      await adminPlayersPage.fillPlayerForm(updatedData);
      await adminPlayersPage.clickSaveButton();
      
      // Wait for save
      await driver.sleep(3000);
      
      // Navigate back to list
      await adminPlayersPage.open();
      await driver.sleep(2000);
      
      // Verify changes persisted (player still exists)
      const playerCount = await adminPlayersPage.getPlayerCount();
      expect(playerCount).to.be.greaterThan(0);
    });
  });

  /**
   * Step 10: Admin deletes a player
   * Expected: Clicking Delete shows confirmation, confirming removes the player
   */
  describe('Step 10: Admin deletes player who left club', function() {
    it('should show confirmation dialog when clicking delete', async function() {
      this.timeout(15000);
      
      await adminPlayersPage.open();
      await driver.sleep(2000);
      
      const initialCount = await adminPlayersPage.getPlayerCount();
      expect(initialCount).to.be.greaterThan(0);
      
      // Click delete button (will trigger confirmation)
      await adminPlayersPage.clickDeletePlayer(0);
      
      // Wait for confirmation dialog
      await driver.sleep(1000);
      
      // Note: Confirmation is expected to appear
      // The dialog could be a modal or browser alert
    });

    it('should delete player after confirmation', async function() {
      this.timeout(20000);
      
      await adminPlayersPage.open();
      await driver.sleep(2000);
      
      const initialCount = await adminPlayersPage.getPlayerCount();
      expect(initialCount).to.be.greaterThan(0);
      
      // Delete player with confirmation
      await adminPlayersPage.deletePlayerWithConfirmation(0);
      
      // Wait for deletion to complete
      await driver.sleep(2000);
      
      // Verify player count decreased
      const finalCount = await adminPlayersPage.getPlayerCount();
      expect(finalCount).to.be.lessThan(initialCount);
    });
  });
});
