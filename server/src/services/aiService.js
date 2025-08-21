const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
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
  async generateChatResponse(message, preferences = null, recommendations = null, chatHistory = []) {
    try {
      let prompt = `You are an AI assistant for the AI-Council platform. Your ONLY job is to help students with university search, recommendations, and platform features. Do NOT answer general questions, DSA problems, or anything unrelated to university guidance or this website.

Context: You are helping a student with their university search and academic planning. Stay focused on:
- University recommendations
- Admission guidance
- Platform features (how to use, troubleshooting, etc)
- Student preferences and questions about universities

If the user asks for something outside this scope, politely say you can only help with university guidance and platform features.

By default, keep your responses short and to the point. Only provide a detailed explanation if the user explicitly asks for it (e.g., says "explain in detail" or "give a long answer").
`;

      // Add chat history to prompt for full conversational context
      if (Array.isArray(chatHistory) && chatHistory.length > 0) {
        prompt += `\n\n--- Chat History ---\n`;
        chatHistory.forEach(msg => {
          const who = msg.type === 'user' ? 'User' : 'AI';
          prompt += `${who}: ${msg.message}\n`;
        });
        prompt += `--- End Chat History ---\n`;
      }

      if (preferences) {
  prompt += `

Student's Preferences:
- Academic Interests: ${preferences.academicInterests?.join(', ') || 'Not specified'}
- Preferred Countries: ${preferences.preferredCountries?.join(', ') || 'Not specified'}
- Budget Range: ₹${preferences.budgetRange?.min || 0} - ₹${preferences.budgetRange?.max || 'No limit'}
- Study Level: ${preferences.studyLevel || 'Not specified'}
- Test Scores: ${this.formatTestScores(preferences.testScores)}

IMPORTANT: All monetary amounts (budget, tuition, etc.) must be shown in Indian Rupees (₹) and not dollars ($).`;
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

IMPORTANT: If the user's message changes their university preferences or constraints (such as budget, country, major, study level, etc.), reply with a JSON object at the END of your response in the following format:
{
  "update": true,
  "preferencesDescription": "A concise summary of the updated preferences or constraints."
}
If there is NO change, do NOT include the JSON object.

Example:
"Here is your answer about scholarships.\n\n{\"update\":true,\"preferencesDescription\":\"Budget updated to $30,000, country set to Canada, major: Computer Science\"}"

Remember: Only answer questions related to university guidance or platform features. Keep answers short unless a detailed explanation is requested.`;

      const response = await this.callGeminiAPI(prompt, {
        temperature: 0.7,
        maxOutputTokens: 700
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
      
      let prompt = `You are a university counselor with access to university databases and image resources. Based on the following student preferences and constraints, provide 5-10 unique university recommendations with REAL university images. Each recommendation must be for a different university (no duplicates).
Student Preferences:
- Academic Interests: ${preferences.academicInterests?.join(', ')}
- Preferred Countries: ${preferences.preferredCountries?.join(', ')}
- Budget Range: ₹${preferences.budgetRange?.min} - ₹${preferences.budgetRange?.max}
- Study Level: ${preferences.studyLevel}
- Test Scores: ${this.formatTestScores(preferences.testScores)}
- University Size Preference: ${preferences.preferredUniversitySize}
${preferences.additionalRequirements ? `- Additional Requirements: ${preferences.additionalRequirements}` : ''}

${preferences.preferencesDescription ? `Additional Constraints from chat: ${preferences.preferencesDescription}` : ''}

IMPORTANT: ONLY reply with the JSON block described below. Do NOT reply with a confirmation, summary, or any text before or after the JSON. Your response must start and end with the JSON block.

IMPORTANT: All monetary amounts (budget, tuition, etc.) must be shown in Indian Rupees (₹) and not dollars ($).

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

CRITICAL FOR IMAGE URLs: 
1. Provide actual, working image URLs for each university's campus or iconic buildings
2. Use these specific image sources:
   - Official university website images (preferred)
   - Wikipedia Commons university images
   - High-quality Unsplash photos tagged with the university name
   - Wikimedia university campus photos
3. Ensure URLs are direct image links (ending in .jpg, .png, .webp)
4. Each university should have a unique, relevant image
5. Test that the URL would work in an img tag
6. For well-known universities, use their iconic campus shots
7. Examples of good URL patterns:
   - https://upload.wikimedia.org/wikipedia/commons/[path]/[image].jpg
   - https://images.unsplash.com/photo-[id]?w=800&h=600&fit=crop&q=80
   - https://www.[university].edu/images/[campus-photo].jpg

IMPORTANT: Do NOT use placeholder or example URLs. Provide real, accessible image URLs that show the actual university campus or buildings.

REMEMBER: Each university MUST have a unique, working imageUrl that shows the actual university campus or buildings. Do not use generic stock images. Research and provide real university image URLs.

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
            
            // Log image URL information
            parsedResponse.universities.forEach((uni, index) => {
              console.log(`University ${index + 1}: ${uni.name}`);
              console.log(`  - Image URL: ${uni.imageUrl || 'NOT PROVIDED'}`);
              console.log(`  - Location: ${uni.location?.city}, ${uni.location?.country}`);
            });
            
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
                imageUrl: uni.imageUrl || `https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&crop=center&q=80`
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
