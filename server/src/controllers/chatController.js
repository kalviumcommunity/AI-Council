const aiService = require('../services/aiService');
const Preference = require('../models/Preference');
const Recommendation = require('../models/Recommendation');

/**
 * Send a message to the AI chatbot
 */
const sendMessage = async (req, res) => {
  try {
    const { message, preferencesId } = req.body;
    const userId = req.user._id;

    console.log('=== CHAT CONTROLLER: Processing message ===');
    console.log('User ID:', userId);
    console.log('Message:', message);
    console.log('Preferences ID:', preferencesId);

    // Get user preferences if provided
    let preferences = null;
    if (preferencesId) {
      preferences = await Preference.findOne({ 
        _id: preferencesId, 
        userId 
      });
      
      if (!preferences) {
        console.log('Preferences not found for ID:', preferencesId);
        return res.status(404).json({
          error: 'Preferences not found',
          message: 'The specified preferences could not be found'
        });
      }
      
      console.log('Found preferences:', {
        academicInterests: preferences.academicInterests,
        preferredCountries: preferences.preferredCountries,
        budgetRange: preferences.budgetRange,
        studyLevel: preferences.studyLevel
      });
    } else {
      console.log('No preferences provided - sending message without user context');
    }

    // Get user's latest recommendations if they exist
    let recommendations = null;
    try {
      recommendations = await Recommendation.findOne({ 
        userId,
        status: 'completed'
      })
      .sort({ createdAt: -1 })
      .select('universities aiResponse');
      
      if (recommendations) {
        console.log('Found recommendations:', {
          universitiesCount: recommendations.universities.length,
          hasAiResponse: !!recommendations.aiResponse
        });
      } else {
        console.log('No completed recommendations found for user');
      }
    } catch (recError) {
      console.log('Error fetching recommendations:', recError.message);
    }

    // Generate AI response with preferences and recommendations context
    const startTime = Date.now();
    const aiResponse = await aiService.generateChatResponse(message, preferences, recommendations);
    const processingTime = Date.now() - startTime;

    console.log('Chat response generated successfully in', processingTime, 'ms');
    console.log('Response length:', aiResponse.length, 'characters');

    res.json({
      message: 'Response generated successfully',
      response: aiResponse,
      metadata: {
        processingTime,
        hasPreferences: !!preferences,
        hasRecommendations: !!recommendations,
        recommendationsCount: recommendations?.universities?.length || 0,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Chat message error:', error);
    
    if (error.message.includes('API key')) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'AI service is currently unavailable. Please try again later.'
      });
    }

    res.status(500).json({
      error: 'Failed to generate response',
      message: 'An error occurred while generating the AI response'
    });
  }
};

/**
 * Get chat history (if implementing chat storage in the future)
 */
const getChatHistory = async (req, res) => {
  try {
    // For now, return empty history as we're not storing chat messages
    // This can be implemented later if needed
    res.json({
      messages: [],
      count: 0,
      message: 'Chat history feature coming soon'
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      error: 'Failed to get chat history',
      message: 'An error occurred while fetching chat history'
    });
  }
};

/**
 * Clear chat history (placeholder for future implementation)
 */
const clearChatHistory = async (req, res) => {
  try {
    res.json({
      message: 'Chat history cleared successfully'
    });
  } catch (error) {
    console.error('Clear chat history error:', error);
    res.status(500).json({
      error: 'Failed to clear chat history',
      message: 'An error occurred while clearing chat history'
    });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  clearChatHistory
};
