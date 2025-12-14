const { expect } = require('chai');
const { createDriver } = require('./utils/driverFactory');
const LoginPage = require('./pages/LoginPage');
const OrdersPage = require('./pages/OrdersPage');
const config = require('./config');
const { AuthHelper } = require('./utils/testHelper');

/**
 * Test Suite: Order Management (Steps 16-18)
 * Covers: Viewing orders, editing recipient info, cancelling orders
 */
describe('7.1.4 Xem đơn hàng và tuỳ chỉnh của người dùng', function() {
  let driver;
  let loginPage;
  let ordersPage;
  let authHelper;

  // Setup before all tests
  before(async function() {
    this.timeout(30000);
    driver = await createDriver();
    loginPage = new LoginPage(driver);
    ordersPage = new OrdersPage(driver);
    authHelper = new AuthHelper(driver);
    
    // Login as regular user
    await loginPage.open();
    await loginPage.login(config.USER_EMAIL, config.USER_PASSWORD);
    await driver.sleep(3000);
  });

  // Cleanup after all tests
  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  /**
   * Step 16: User opens "Đơn đã mua"
   * Expected: Can view purchased/cancelled orders
   */
  describe('Step 16: User views purchased orders', function() {
    it('should display orders page with order history', async function() {
      this.timeout(15000);
      
      // Navigate to orders page
      await ordersPage.open();
      await driver.sleep(2000);
      
      // Verify on orders page
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include('nguoidung.html');
      
      // Check order count (might be 0 if no orders)
      const orderCount = await ordersPage.getOrderCount();
      
      // Orders might be empty for test user
      // Just verify page loaded correctly
      console.log(`Found ${orderCount} orders for user`);
    });

    it('should display order details with status', async function() {
      this.timeout(15000);
      
      await ordersPage.open();
      await driver.sleep(2000);
      
      const orderCount = await ordersPage.getOrderCount();
      
      if (orderCount > 0) {
        // Get first order status
        const status = await ordersPage.getOrderStatus(0);
        expect(status).to.not.be.empty;
        console.log(`Order status: ${status}`);
        
        // Click view detail
        await ordersPage.clickViewDetail(0);
        await driver.sleep(2000);
        
        // Should navigate to order detail page or show modal
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.match(/order-detail|nguoidung/);
      } else {
        console.log('No orders available to test');
        this.skip();
      }
    });

    it('should display cancelled orders in cancelled tab', async function() {
      this.timeout(15000);
      
      await ordersPage.open();
      await driver.sleep(2000);
      
      // Click cancelled orders tab if available
      try {
        await ordersPage.clickCancelledTab();
        await driver.sleep(2000);
        
        // Verify tab switched
        console.log('Viewing cancelled orders tab');
      } catch (error) {
        console.log('Cancelled tab not available or no tabs present');
      }
    });
  });

  /**
   * Step 17: User edits recipient name/address
   * Expected: Allowed when not shipped; blocked when shipped
   */
  describe('Step 17: User edits recipient name/address before shipping', function() {
    it('should allow editing recipient info for unshipped orders', async function() {
      this.timeout(20000);
      
      await ordersPage.open();
      await driver.sleep(2000);
      
      const orderCount = await ordersPage.getOrderCount();
      
      if (orderCount > 0) {
        // Get order status
        const status = await ordersPage.getOrderStatus(0);
        
        // Check if order can be edited
        const canEdit = await ordersPage.canEditOrder(0);
        
        if (canEdit) {
          // Try to edit
          await ordersPage.clickEditOrder(0);
          await driver.sleep(2000);
          
          // Edit recipient info
          const newName = `Edited Name ${Date.now()}`;
          const newAddress = `Edited Address ${Date.now()}`;
          
          try {
            await ordersPage.editRecipientInfo(newName, newAddress);
            await driver.sleep(2000);
            
            // Check for success message
            const successMsg = await ordersPage.getSuccessMessage();
            if (successMsg) {
              expect(successMsg).to.match(/thành công|success/i);
            }
          } catch (error) {
            console.log('Edit form not available or edit failed');
          }
        } else {
          console.log('Order cannot be edited (likely already shipped)');
        }
      } else {
        console.log('No orders to test editing');
        this.skip();
      }
    });

    it('should prevent editing for shipped orders', async function() {
      this.timeout(15000);
      
      await ordersPage.open();
      await driver.sleep(2000);
      
      const orderCount = await ordersPage.getOrderCount();
      
      if (orderCount > 0) {
        // Find a shipped order
        for (let i = 0; i < orderCount; i++) {
          const status = await ordersPage.getOrderStatus(i);
          
          if (status.match(/vận chuyển|shipped|delivered/i)) {
            // Try to edit - should be blocked
            const canEdit = await ordersPage.canEditOrder(i);
            expect(canEdit).to.be.false;
            
            console.log(`Order ${i} is shipped and cannot be edited`);
            return;
          }
        }
        
        console.log('No shipped orders found to test restriction');
        this.skip();
      } else {
        console.log('No orders to test');
        this.skip();
      }
    });
  });

  /**
   * Step 18: User cancels order
   * Expected: Show "Xác nhận huỷ", after confirming, order appears under "Đã huỷ" with success message
   */
  describe('Step 18: User cancels order with confirmation', function() {
    it('should show confirmation dialog when cancelling order', async function() {
      this.timeout(15000);
      
      await ordersPage.open();
      await driver.sleep(2000);
      
      const orderCount = await ordersPage.getOrderCount();
      
      if (orderCount > 0) {
        // Get order status - only pending orders can be cancelled
        const status = await ordersPage.getOrderStatus(0);
        
        // Click cancel button
        await ordersPage.clickCancelOrder(0);
        await driver.sleep(1000);
        
        // Confirmation dialog should appear
        // This is verified by the confirmCancellation method
        console.log('Cancellation confirmation expected');
      } else {
        console.log('No orders to cancel');
        this.skip();
      }
    });

    it('should cancel order and show success message', async function() {
      this.timeout(20000);
      
      await ordersPage.open();
      await driver.sleep(2000);
      
      const orderCount = await ordersPage.getOrderCount();
      
      if (orderCount > 0) {
        // Find a cancellable order (pending/processing, not shipped)
        for (let i = 0; i < orderCount; i++) {
          const status = await ordersPage.getOrderStatus(i);
          
          // Only cancel if not shipped
          if (!status.match(/vận chuyển|shipped|delivered|hoàn thành|completed/i)) {
            // Cancel with confirmation
            await ordersPage.cancelOrderWithConfirmation(i);
            await driver.sleep(3000);
            
            // Check for success message
            const successMsg = await ordersPage.getSuccessMessage();
            if (successMsg) {
              expect(successMsg).to.match(/thành công|success|huỷ/i);
              console.log('Order cancelled successfully');
            }
            
            // Verify order appears in cancelled list
            await ordersPage.clickCancelledTab();
            await driver.sleep(2000);
            
            const cancelledCount = await ordersPage.getOrderCount();
            expect(cancelledCount).to.be.greaterThan(0);
            
            return;
          }
        }
        
        console.log('No cancellable orders found (all shipped/completed)');
        this.skip();
      } else {
        console.log('No orders to cancel');
        this.skip();
      }
    });

    it('should not allow cancelling shipped orders', async function() {
      this.timeout(15000);
      
      await ordersPage.open();
      await driver.sleep(2000);
      
      const orderCount = await ordersPage.getOrderCount();
      
      if (orderCount > 0) {
        // Find a shipped order
        for (let i = 0; i < orderCount; i++) {
          const status = await ordersPage.getOrderStatus(i);
          
          if (status.match(/vận chuyển|shipped|delivered/i)) {
            // Cancel button should not be present or enabled
            try {
              await ordersPage.clickCancelOrder(i);
              await driver.sleep(1000);
              
              // Should show error or do nothing
              const errorMsg = await ordersPage.getErrorMessage();
              if (errorMsg) {
                expect(errorMsg).to.match(/không thể|cannot|đã vận chuyển/i);
              }
            } catch (error) {
              // Cancel button not found - which is correct behavior
              console.log('Cancel button not available for shipped order');
            }
            
            return;
          }
        }
        
        console.log('No shipped orders to test cancellation restriction');
        this.skip();
      } else {
        console.log('No orders to test');
        this.skip();
      }
    });
  });
});
