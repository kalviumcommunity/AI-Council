const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second base delay
  }

  /**
   * Send a request to Gemini API with retry logic
   */
  async callGeminiAPI(prompt, options = {}) {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const requestData = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: options.temperature || 0.7,
        topK: options.topK || 40,
        topP: options.topP || 0.95,
        maxOutputTokens: options.maxOutputTokens || 2048,
      }
    };

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await axios.post(
          `${this.baseURL}?key=${this.apiKey}`,
          requestData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 30000 // 30 second timeout
          }
        );

        if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          return response.data.candidates[0].content.parts[0].text;
        } else {
          throw new Error('Invalid response format from Gemini API');
        }
      } catch (error) {
        console.error(`Gemini API attempt ${attempt} failed:`, error.message);
        
        // Don't retry on authentication errors
        if (error.response?.status === 401 || error.response?.status === 403) {
          throw new Error('Invalid API key or insufficient permissions');
        }

        // Don't retry on client errors (except rate limiting)
        if (error.response?.status >= 400 && error.response?.status < 500 && error.response?.status !== 429) {
          throw new Error(`Client error: ${error.response?.data?.error?.message || error.message}`);
        }

        // If this is the last attempt, throw the error
        if (attempt === this.retryAttempts) {
          throw new Error(`Failed after ${this.retryAttempts} attempts: ${error.message}`);
        }

        // Wait before retrying (exponential backoff)
        await this.delay(this.retryDelay * Math.pow(2, attempt - 1));
      }
    }
  }

  /**
   * Generate chatbot response
   */
  async generateChatResponse(message, preferences = null, recommendations = null) {
    try {
      let prompt = `You are an experienced university counselor and educational advisor. You help students find the right universities and answer their questions about higher education.

Context: You are helping a student with their university search and academic planning.`;

      if (preferences) {
        prompt += `

Student's Preferences:
- Academic Interests: ${preferences.academicInterests?.join(', ') || 'Not specified'}
- Preferred Countries: ${preferences.preferredCountries?.join(', ') || 'Not specified'}
- Budget Range: $${preferences.budgetRange?.min || 0} - $${preferences.budgetRange?.max || 'No limit'}
- Study Level: ${preferences.studyLevel || 'Not specified'}
- Test Scores: ${this.formatTestScores(preferences.testScores)}`;
      }

      if (recommendations && recommendations.universities && recommendations.universities.length > 0) {
        prompt += `

Previously Recommended Universities:`;
        recommendations.universities.forEach((uni, index) => {
          prompt += `
${index + 1}. ${uni.name} (${uni.location.city}, ${uni.location.country})
   - Fit Score: ${uni.fitScore}%
   - Programs: ${uni.programs?.join(', ') || 'Various programs'}
   - Tuition: $${uni.tuitionRange?.min || 'N/A'} - $${uni.tuitionRange?.max || 'N/A'}
   - Why recommended: ${uni.reasons}`;
        });
        
        if (recommendations.aiResponse) {
          prompt += `

Previous recommendation summary: ${recommendations.aiResponse.substring(0, 500)}...`;
        }
      }

      prompt += `

Student's Question: "${message}"

Please provide a helpful, informative response. If the question relates to the recommended universities above, reference them specifically. If the student asks about specific universities from their recommendations, provide detailed information about those institutions. Keep your response conversational but professional.`;

      const response = await this.callGeminiAPI(prompt, {
        temperature: 0.8,
        maxOutputTokens: 1024
      });

      return response.trim();
    } catch (error) {
      console.error('Error generating chat response:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  /**
   * Generate university recommendations
   */
  async generateRecommendations(preferences) {
    try {
      console.log('=== AI SERVICE: GENERATING RECOMMENDATIONS ===');
      console.log('Preferences received:', preferences);
      
      const prompt = `You are a university counselor. Based on the following student preferences, provide university recommendations.

Student Preferences:
- Academic Interests: ${preferences.academicInterests?.join(', ')}
- Preferred Countries: ${preferences.preferredCountries?.join(', ')}
- Budget Range: $${preferences.budgetRange?.min} - $${preferences.budgetRange?.max}
- Study Level: ${preferences.studyLevel}
- Test Scores: ${this.formatTestScores(preferences.testScores)}
- University Size Preference: ${preferences.preferredUniversitySize}
${preferences.additionalRequirements ? `- Additional Requirements: ${preferences.additionalRequirements}` : ''}

Please provide:
1. A list of 5-8 suitable universities
2. A comprehensive explanation of your recommendations

For each university, include:
- Name
- Country and city
- Why it's a good fit (2-3 sentences)
- Approximate ranking (if known)
- Fit score (0-100)
- Estimated tuition range
- University image URL (use a real university image URL or a generic university/campus image)

IMPORTANT: For imageUrl, provide a direct link to a university campus image. You can use:
- Real university website image URLs
- Unsplash university/campus images (e.g., https://images.unsplash.com/photo-1562774053-701939374585)
- Wikipedia university images
- Generic academic building images
Make sure the URL is a direct image link that ends with .jpg, .png, or similar.

Format your response as JSON with this structure:
{
  "universities": [
    {
      "name": "University Name",
      "location": {
        "country": "Country",
        "city": "City"
      },
      "ranking": 50,
      "fitScore": 85,
      "reasons": "Detailed explanation of why this university fits the student's profile...",
      "tuitionRange": {
        "min": 25000,
        "max": 35000
      },
      "programs": ["Program 1", "Program 2"],
      "website": "https://university.edu",
      "imageUrl": "https://example.com/university-image.jpg"
    }
  ],
  "summary": "Comprehensive explanation of the recommendations and advice for the student..."
}

Ensure the JSON is valid and properly formatted.`;

      console.log('Calling Gemini API with prompt...');
      const response = await this.callGeminiAPI(prompt, {
        temperature: 0.6,
        maxOutputTokens: 2048
      });

      console.log('Gemini API response received:', response);

      // Try to parse the JSON response
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          console.log('Found JSON in response, attempting to parse...');
          const parsedResponse = JSON.parse(jsonMatch[0]);
          console.log('Parsed response:', parsedResponse);
          
          // Validate the structure
          if (parsedResponse.universities && Array.isArray(parsedResponse.universities)) {
            console.log('Valid university recommendations found:', parsedResponse.universities.length);
            const result = {
              universities: parsedResponse.universities.map(uni => ({
                name: uni.name || 'Unknown University',
                location: {
                  country: uni.location?.country || 'Unknown',
                  city: uni.location?.city || 'Unknown'
                },
                ranking: uni.ranking || null,
                fitScore: Math.min(Math.max(uni.fitScore || 70, 0), 100),
                reasons: uni.reasons || 'Good fit for your preferences',
                tuitionRange: uni.tuitionRange || { min: 0, max: 0 },
                programs: uni.programs || [],
                website: uni.website || '',
                imageUrl: uni.imageUrl || 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&crop=center'
              })),
              aiResponse: parsedResponse.summary || response
            };
            console.log('Returning formatted result:', result);
            return result;
          }
        }
      } catch (parseError) {
        console.warn('Failed to parse JSON response, using fallback:', parseError.message);
        console.log('Raw response that failed to parse:', response);
      }

      // Fallback: return raw response with empty universities array
      console.log('Using fallback response format');
      return {
        universities: [],
        aiResponse: response
      };

    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate university recommendations');
    }
  }

  /**
   * Format test scores for display
   */
  formatTestScores(testScores) {
    if (!testScores) return 'Not provided';
    
    const scores = [];
    if (testScores.sat) scores.push(`SAT: ${testScores.sat}`);
    if (testScores.toefl) scores.push(`TOEFL: ${testScores.toefl}`);
    if (testScores.ielts) scores.push(`IELTS: ${testScores.ielts}`);
    if (testScores.gre) scores.push(`GRE: ${testScores.gre}`);
    
    return scores.length > 0 ? scores.join(', ') : 'Not provided';
  }

  /**
   * Utility function for delays
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new AIService();
