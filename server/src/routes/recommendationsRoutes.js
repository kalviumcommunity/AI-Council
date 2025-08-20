const express = require('express');
const {
  generateRecommendations,
  getUserRecommendations,
  getRecommendationById,
  deleteRecommendation,
  getRecommendationStats
} = require('../controllers/recommendationsController');
const { auth } = require('../middleware/auth');
const { validateRecommendationGeneration } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(auth);

// Recommendation routes
router.post('/generate', validateRecommendationGeneration, generateRecommendations);
router.get('/', getUserRecommendations);
router.get('/stats', getRecommendationStats);
router.get('/:id', getRecommendationById);
router.delete('/:id', deleteRecommendation);

module.exports = router;
