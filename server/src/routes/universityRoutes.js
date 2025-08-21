const express = require('express');
const router = express.Router();
const { getUniversityDetails } = require('../controllers/universityController');

// POST /api/university/details
router.post('/details', getUniversityDetails);

module.exports = router;
