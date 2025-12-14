require('dotenv').config();

module.exports = {
  // Base URLs
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  API_URL: process.env.API_URL || 'http://localhost:3000/api',
  
  // Test credentials
  USER_EMAIL: process.env.USER_EMAIL || 'testuser@example.com',
  USER_PASSWORD: process.env.USER_PASSWORD || 'password123',
  USER_FULLNAME: process.env.USER_FULLNAME || 'Test User',
  
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@hntswimclub.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  
  // Browser settings
  HEADLESS: process.env.HEADLESS === 'true',
  
  // Timeouts
  IMPLICIT_WAIT: parseInt(process.env.IMPLICIT_WAIT || '5000'),
  EXPLICIT_WAIT: parseInt(process.env.EXPLICIT_WAIT || '10'),
  
  // Test data
  GENERATE_UNIQUE_USERS: process.env.GENERATE_UNIQUE_USERS === 'true',
  
  // Page paths (relative to BASE_URL)
  PAGES: {
    LOGIN: '/HNT-SWIM-CLUB-main/đn/login.html',
    REGISTER: '/HNT-SWIM-CLUB-main/đk/đk.html',
    HOME: '/HNT-SWIM-CLUB-main/sp_home/trangchu.html',
    PRODUCTS: '/HNT-SWIM-CLUB-main/sp_home/danhmuc_sp.html',
    PRODUCT_DETAIL: '/HNT-SWIM-CLUB-main/sp_home/chitiet_sp.html',
    CART: '/HNT-SWIM-CLUB-main/giohang/ghtt.html',
    CHECKOUT: '/HNT-SWIM-CLUB-main/giohang/thanhtoan.html',
    USER_PROFILE: '/HNT-SWIM-CLUB-main/nguoidung/nguoidung.html',
    ADMIN_HOME: '/HNT-SWIM-CLUB-main/admin/home.html',
    ADMIN_PLAYERS: '/HNT-SWIM-CLUB-main/admin/admin.html',
    ADMIN_ADD_PLAYER: '/HNT-SWIM-CLUB-main/admin/addtt_admin.html',
    PLAYERS: '/HNT-SWIM-CLUB-main/tuyenthu/user.html'
  }
};
