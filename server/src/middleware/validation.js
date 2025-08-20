const { body, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Please check your input data',
      details: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

/**
 * User registration validation
 */
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters'),
    
  handleValidationErrors
];

/**
 * User login validation
 */
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
    
  handleValidationErrors
];

/**
 * Preferences validation
 */
const validatePreferences = [
  body('academicInterests')
    .isArray({ min: 1 })
    .withMessage('At least one academic interest is required'),
    
  body('academicInterests.*')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Each academic interest must be between 1 and 100 characters'),
    
  body('preferredCountries')
    .isArray({ min: 1 })
    .withMessage('At least one preferred country is required'),
    
  body('preferredCountries.*')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Each country name must be between 1 and 100 characters'),
    
  body('budgetRange.min')
    .isNumeric({ min: 0 })
    .withMessage('Minimum budget must be a positive number'),
    
  body('budgetRange.max')
    .isNumeric({ min: 0 })
    .withMessage('Maximum budget must be a positive number')
    .custom((value, { req }) => {
      if (value < req.body.budgetRange.min) {
        throw new Error('Maximum budget must be greater than or equal to minimum budget');
      }
      return true;
    }),
    
  body('studyLevel')
    .isIn(['undergraduate', 'graduate', 'doctorate', 'certificate'])
    .withMessage('Study level must be one of: undergraduate, graduate, doctorate, certificate'),
    
  body('preferredUniversitySize')
    .optional()
    .isIn(['small', 'medium', 'large', 'any'])
    .withMessage('University size must be one of: small, medium, large, any'),
    
  body('testScores.sat')
    .optional()
    .isInt({ min: 400, max: 1600 })
    .withMessage('SAT score must be between 400 and 1600'),
    
  body('testScores.toefl')
    .optional()
    .isInt({ min: 0, max: 120 })
    .withMessage('TOEFL score must be between 0 and 120'),
    
  body('testScores.ielts')
    .optional()
    .isFloat({ min: 0, max: 9 })
    .withMessage('IELTS score must be between 0 and 9'),
    
  body('testScores.gre')
    .optional()
    .isInt({ min: 260, max: 340 })
    .withMessage('GRE score must be between 260 and 340'),
    
  body('additionalRequirements')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Additional requirements cannot exceed 500 characters'),
    
  handleValidationErrors
];

/**
 * Chat message validation
 */
const validateChatMessage = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
    
  body('preferencesId')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Allow null, undefined, or empty string
      }
      // If value is provided, it must be a valid MongoDB ObjectId
      if (!/^[0-9a-fA-F]{24}$/.test(value)) {
        throw new Error('Invalid preferences ID format');
      }
      return true;
    }),
    
  handleValidationErrors
];

/**
 * Recommendation generation validation
 */
const validateRecommendationGeneration = [
  body('preferencesId')
    .isMongoId()
    .withMessage('Valid preferences ID is required'),
    
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validatePreferences,
  validateChatMessage,
  validateRecommendationGeneration,
  handleValidationErrors
};
