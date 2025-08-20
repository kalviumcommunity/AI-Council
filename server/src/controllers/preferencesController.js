const Preference = require('../models/Preference');

/**
 * Create or update user preferences
 */
const createOrUpdatePreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const preferenceData = {
      ...req.body,
      userId
    };

    // Check if user already has preferences
    let preferences = await Preference.findOne({ userId });

    if (preferences) {
      // Update existing preferences
      preferences = await Preference.findOneAndUpdate(
        { userId },
        preferenceData,
        { new: true, runValidators: true }
      );
    } else {
      // Create new preferences
      preferences = new Preference(preferenceData);
      await preferences.save();
    }

    res.json({
      message: preferences.isNew ? 'Preferences created successfully' : 'Preferences updated successfully',
      preferences
    });
  } catch (error) {
    console.error('Create/Update preferences error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your preference data',
        details: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      error: 'Failed to save preferences',
      message: 'An error occurred while saving your preferences'
    });
  }
};

/**
 * Get user preferences
 */
const getPreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const preferences = await Preference.findOne({ userId });
    
    if (!preferences) {
      return res.status(404).json({
        error: 'Preferences not found',
        message: 'No preferences found for this user'
      });
    }

    res.json({
      preferences
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({
      error: 'Failed to get preferences',
      message: 'An error occurred while fetching preferences'
    });
  }
};

/**
 * Get preferences by ID (for generating recommendations)
 */
const getPreferencesById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const preferences = await Preference.findOne({ 
      _id: id, 
      userId 
    });

    if (!preferences) {
      return res.status(404).json({
        error: 'Preferences not found',
        message: 'Preferences not found or you do not have access to them'
      });
    }

    res.json({
      preferences
    });
  } catch (error) {
    console.error('Get preferences by ID error:', error);
    res.status(500).json({
      error: 'Failed to get preferences',
      message: 'An error occurred while fetching preferences'
    });
  }
};

/**
 * Delete user preferences
 */
const deletePreferences = async (req, res) => {
  try {
    const userId = req.user._id;

    const preferences = await Preference.findOneAndDelete({ userId });

    if (!preferences) {
      return res.status(404).json({
        error: 'Preferences not found',
        message: 'No preferences found to delete'
      });
    }

    res.json({
      message: 'Preferences deleted successfully'
    });
  } catch (error) {
    console.error('Delete preferences error:', error);
    res.status(500).json({
      error: 'Failed to delete preferences',
      message: 'An error occurred while deleting preferences'
    });
  }
};

/**
 * Get all preferences for a user (if they have multiple versions)
 */
const getAllUserPreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const preferences = await Preference.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10); // Limit to last 10 preference sets

    res.json({
      preferences,
      count: preferences.length
    });
  } catch (error) {
    console.error('Get all user preferences error:', error);
    res.status(500).json({
      error: 'Failed to get preferences',
      message: 'An error occurred while fetching preferences'
    });
  }
};

module.exports = {
  createOrUpdatePreferences,
  getPreferences,
  getPreferencesById,
  deletePreferences,
  getAllUserPreferences
};
