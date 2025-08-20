const Recommendation = require('../models/Recommendation');
const Preference = require('../models/Preference');
const aiService = require('../services/aiService');

/**
 * Generate new university recommendations
 */
const generateRecommendations = async (req, res) => {
  try {
    console.log('=== RECOMMENDATION GENERATION STARTED ===');
    console.log('Request body:', req.body);
    console.log('User ID:', req.user._id);
    
    const { preferencesId } = req.body;
    const userId = req.user._id;

    // Get user preferences
    console.log('Fetching preferences for ID:', preferencesId, 'User:', userId);
    const preferences = await Preference.findOne({ 
      _id: preferencesId, 
      userId 
    });

    if (!preferences) {
      console.log('Preferences not found for ID:', preferencesId, 'User:', userId);
      return res.status(404).json({
        error: 'Preferences not found',
        message: 'The specified preferences could not be found'
      });
    }

    console.log('Found preferences:', preferences);

    // Remove old recommendations for this user before creating new ones
    console.log('Removing old recommendations for user:', userId);
    const deleteResult = await Recommendation.deleteMany({ userId });
    console.log('Deleted', deleteResult.deletedCount, 'old recommendations');

    // Create initial recommendation record
    let recommendation = new Recommendation({
      userId,
      preferencesId,
      universities: [],
      aiResponse: '',
      status: 'generating'
    });

    await recommendation.save();
    console.log('Created new recommendation record:', recommendation._id);

    try {
      // Generate recommendations using AI service
      console.log('Calling AI service to generate recommendations...');
      const startTime = Date.now();
      const aiResult = await aiService.generateRecommendations(preferences);
      const processingTime = Date.now() - startTime;
      
      console.log('AI service returned:', aiResult);
      console.log('Processing time:', processingTime, 'ms');

      // Update recommendation with results
      recommendation.universities = aiResult.universities;
      recommendation.aiResponse = aiResult.aiResponse;
      recommendation.status = 'completed';
      recommendation.metadata = {
        processingTime,
        apiCallsUsed: 1,
        version: '1.0'
      };

      await recommendation.save();
      console.log('Updated recommendation with results');

      res.json({
        message: 'Recommendations generated successfully',
        recommendation: {
          id: recommendation._id,
          universities: recommendation.universities,
          aiResponse: recommendation.aiResponse,
          status: recommendation.status,
          createdAt: recommendation.createdAt,
          metadata: recommendation.metadata
        }
      });

    } catch (aiError) {
      console.error('AI service error:', aiError);
      // Update recommendation status to failed
      recommendation.status = 'failed';
      recommendation.aiResponse = 'Failed to generate recommendations due to AI service error';
      await recommendation.save();

      throw aiError;
    }

  } catch (error) {
    console.error('Generate recommendations error:', error);
    
    if (error.message.includes('API key')) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'AI service is currently unavailable. Please try again later.'
      });
    }

    res.status(500).json({
      error: 'Failed to generate recommendations',
      message: 'An error occurred while generating university recommendations'
    });
  }
};

/**
 * Get all recommendations for a user
 */
const getUserRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const recommendations = await Recommendation.find({ userId })
      .populate('preferencesId', 'academicInterests preferredCountries studyLevel')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Recommendation.countDocuments({ userId });

    res.json({
      recommendations: recommendations.map(rec => ({
        id: rec._id,
        universities: rec.universities,
        aiResponse: rec.aiResponse,
        status: rec.status,
        createdAt: rec.createdAt,
        metadata: rec.metadata,
        preferences: rec.preferencesId
      })),
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get user recommendations error:', error);
    res.status(500).json({
      error: 'Failed to get recommendations',
      message: 'An error occurred while fetching recommendations'
    });
  }
};

/**
 * Get a specific recommendation by ID
 */
const getRecommendationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const recommendation = await Recommendation.findOne({ 
      _id: id, 
      userId 
    }).populate('preferencesId');

    if (!recommendation) {
      return res.status(404).json({
        error: 'Recommendation not found',
        message: 'The specified recommendation could not be found'
      });
    }

    res.json({
      recommendation: {
        id: recommendation._id,
        universities: recommendation.universities,
        aiResponse: recommendation.aiResponse,
        status: recommendation.status,
        createdAt: recommendation.createdAt,
        metadata: recommendation.metadata,
        preferences: recommendation.preferencesId
      }
    });
  } catch (error) {
    console.error('Get recommendation by ID error:', error);
    res.status(500).json({
      error: 'Failed to get recommendation',
      message: 'An error occurred while fetching the recommendation'
    });
  }
};

/**
 * Delete a recommendation
 */
const deleteRecommendation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const recommendation = await Recommendation.findOneAndDelete({ 
      _id: id, 
      userId 
    });

    if (!recommendation) {
      return res.status(404).json({
        error: 'Recommendation not found',
        message: 'The specified recommendation could not be found'
      });
    }

    res.json({
      message: 'Recommendation deleted successfully'
    });
  } catch (error) {
    console.error('Delete recommendation error:', error);
    res.status(500).json({
      error: 'Failed to delete recommendation',
      message: 'An error occurred while deleting the recommendation'
    });
  }
};

/**
 * Get recommendation statistics for a user
 */
const getRecommendationStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Recommendation.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          failed: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
          },
          generating: {
            $sum: { $cond: [{ $eq: ['$status', 'generating'] }, 1, 0] }
          },
          totalUniversities: { $sum: { $size: '$universities' } },
          avgProcessingTime: { $avg: '$metadata.processingTime' }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      completed: 0,
      failed: 0,
      generating: 0,
      totalUniversities: 0,
      avgProcessingTime: 0
    };

    res.json({
      stats: result
    });
  } catch (error) {
    console.error('Get recommendation stats error:', error);
    res.status(500).json({
      error: 'Failed to get statistics',
      message: 'An error occurred while fetching recommendation statistics'
    });
  }
};

module.exports = {
  generateRecommendations,
  getUserRecommendations,
  getRecommendationById,
  deleteRecommendation,
  getRecommendationStats
};
