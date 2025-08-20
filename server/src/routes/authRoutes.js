const express = require('express');
const { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  logout 
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { 
  validateRegistration, 
  validateLogin,
  handleValidationErrors
} = require('../middleware/validation');
const { body } = require('express-validator');

const router = express.Router();

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', 
  auth,
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    handleValidationErrors
  ],
  updateProfile
);
router.post('/logout', auth, logout);

module.exports = router;
