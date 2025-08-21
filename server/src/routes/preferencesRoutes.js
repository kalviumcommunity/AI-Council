const express = require('express');
const {
  createOrUpdatePreferences,
  getPreferences,
  getPreferencesById,
  deletePreferences,
  getAllUserPreferences,
  updatePreferencesDescription
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

// Update preferencesDescription
router.patch('/:id/description', updatePreferencesDescription);
router.delete('/', deletePreferences);

module.exports = router;
