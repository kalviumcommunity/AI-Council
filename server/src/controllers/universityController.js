const aiService = require('../services/aiService');

/**
 * Fetch and summarize comprehensive university info using AI
 * @route POST /api/university/details
 * @body { universityName: string }
 */
const getUniversityDetails = async (req, res) => {
  try {
    const { universityName } = req.body;
    if (!universityName) {
      return res.status(400).json({ error: 'University name is required.' });
    }

  // Compose prompt for Gemini
  const prompt = `Provide ONLY the following information about ${universityName} for prospective students, formatted in markdown (no introduction, no extra text, no conversational prefix):

* Tuition fees (latest available)
* Student reviews (summarized)
* Pros and cons
* Placement statistics
* Notable programs
* Campus life highlights
* Anything else relevant for decision-making

Respond with just the markdown data, no greeting, no explanation, no prefix. If data is unavailable, mention it in the relevant section.`;

    // Use Gemini to summarize and format
    const summary = await aiService.callGeminiAPI(prompt, {
      temperature: 0.7,
      maxOutputTokens: 1024
    });

    res.json({ university: universityName, details: summary });
  } catch (error) {
    console.error('Error fetching university details:', error);
    res.status(500).json({ error: 'Failed to fetch university details.' });
  }
};

module.exports = { getUniversityDetails };
