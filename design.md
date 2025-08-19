# **Low Level Design (LLD) – NextStep AI**

## **1. Introduction**

The system integrates Google’s **Gemini API** with a Node.js/Express.js backend to provide:

- **Chatbot Conversations**: AI-driven responses to student queries.
- **University Recommendations**: Personalized recommendations based on preferences.

    The backend acts as a **secure proxy** between the frontend and Gemini API, while MongoDB ensures persistence of preferences and recommendations.


---

## **2. Components**

### **2.1 AI Service (Backend)**

- **File**: `src/services/aiService.js`
- **Responsibilities**:
    - Format user preferences and messages into Gemini prompts.
    - Send requests to Gemini API (HTTPS, POST).
    - Parse and return conversational or structured responses.
    - Handle errors (rate limits, invalid responses) with retry logic.
- **Security**:
    - API key stored in `.env`.
    - Input sanitized with `express-validator`.
    - HTTPS enforced.

---

### **2.2 API Endpoints**

### **2.2.1 Chatbot Endpoint**

- **Route**: `POST /api/chat/message` (Protected)
- **Input**:

    ```json
    {
      "message": "Find universities in Europe for engineering",
      "preferencesId": "ObjectId"
    }

    ```

- **Process**:
    - Fetch preferences from MongoDB.
    - Construct prompt with preferences + message.
    - Send to Gemini API via AI Service.
    - Return conversational response.
- **Output**:

    ```json
    {
      "response": "Here are some universities in Europe..."
    }

    ```


### **2.2.2 Recommendation Endpoint**

- **Route**: `POST /api/recommendations/generate` (Protected)
- **Input**:

    ```json
    {
      "preferencesId": "ObjectId"
    }

    ```

- **Process**:
    - Fetch preferences.
    - Construct structured prompt for Gemini.
    - Parse AI response into `{universities: [], aiResponse: ""}`.
    - Save to `Recommendation` collection.
- **Output**:

    ```json
    {
      "universities": [
        {
          "name": "MIT",
          "location": "USA",
          "ranking": 1,
          "fitScore": 95,
          "reasons": "Strong in Computer Science..."
        }
      ],
      "aiResponse": "Based on your preferences, here are top universities..."
    }

    ```


---

### **2.3 Database (MongoDB)**

### **2.3.1 Preference Schema**

```jsx
{
  userId: ObjectId,
  academicInterests: [String],
  location: [String],
  budget: Number,
  testScores: { sat: Number, toefl: Number },
  createdAt: Date
}

```

### **2.3.2 Recommendation Schema**

```jsx
{
  userId: ObjectId,
  preferencesId: ObjectId,
  universities: [
    {
      name: String,
      location: String,
      ranking: Number,
      fitScore: Number,
      reasons: String
    }
  ],
  aiResponse: String,
  createdAt: Date
}

```

---

### **2.4 Frontend (React)**

### **2.4.1 Chatbot Interface**

- Component: `ChatbotInterface`
- Features:
    - Chat UI (user messages right, AI left).
    - Axios call → `/api/chat/message`.
    - Renders text or university cards if present.

### **2.4.2 Recommendation Display**

- Component: `RecommendationList`
- Features:
    - Fetch from `/api/recommendations/:userId`.
    - Show structured recommendations in card/list view.
    - Sort by `fitScore`, link to official websites.

### **2.4.3 Preferences**

- Component: `PreferenceForm` → saves to `/api/preferences`.
- Preferences cached in React Context / localStorage.

---

## **3. Integration Flow**

1. **User Submits Preferences** → Saved in MongoDB.
2. **Chatbot Message Sent** → Backend formats prompt with preferences.
3. **AI Service Constructs Prompt** → Example:

    ```
    You are a university counselor. Preferences: {JSON}, Question: [User Message].

    ```

4. **Gemini API Call** → POST with prompt + API key.
5. **Response Processing**:
    - Chatbot → returns raw text.
    - Recommendations → parsed JSON, stored in DB.
6. **Frontend Display** → Chat bubbles or recommendation cards.
7. **Persistence** → Recommendations saved for history & future access.

---

## **4. Risks & Mitigations**

| **Risk** | **Mitigation** |
| --- | --- |
| Gemini API downtime/rate limits | Retry with exponential backoff; cache responses in MongoDB. |
| Inconsistent responses | Validate/parse JSON; fallback to raw text. |
| High API costs | Monitor usage, enforce user quotas. |
| Data privacy | Encrypt sensitive data; comply with GDPR. |

---

## **5. Security**

- JWT-based authentication for all protected routes.
- API keys hidden in environment variables.
- HTTPS enforced for external/internal calls.
- Input validation to prevent injection.

---