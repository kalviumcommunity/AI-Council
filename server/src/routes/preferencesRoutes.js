const express = require('express');
const {
  createOrUpdatePreferences,
  getPreferences,
  getPreferencesById,
  deletePreferences,
  getAllUserPreferences
} = require('../controllers/preferencesController');
const { auth } = require('../middleware/auth');
const { validatePreferences } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(auth);

// Preferences routes
router.post('/', validatePreferences, createOrUpdatePreferences);
router.get('/', getPreferences);
router.get('/all', getAllUserPreferences);
router.get('/:id', getPreferencesById);
router.delete('/', deletePreferences);

module.exports = router;
