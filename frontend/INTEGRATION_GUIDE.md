# Persona Analysis Chatbot Integration Guide

This guide explains how to integrate the frontend chatbot with your backend persona analysis system and Gemini API.

## Overview

The Persona Analysis page has been transformed into a modern chatbot interface that:
1. **Integrates with your backend** for persona analysis
2. **Uses Gemini API** for enhanced AI insights
3. **Provides real-time chat** with context-aware responses
4. **Manages document analysis** workflows

## Backend API Endpoints Required

### 1. Document Management
```
GET /api/documents
- Returns list of available documents for analysis
- Response format: Array of document objects with doc_id, filename, size, etc.
```

### 2. Trigger Analysis
```
POST /api/trigger-analysis
- Initiates persona-based document analysis
- Request body: { selectedDocs, persona: { role, experienceLevel, jobTask } }
- Response: { analysisId, status, message }
```

### 3. Persona Analysis
```
POST /api/persona-analysis
- Processes user messages with persona context
- Request body: { message, persona: { role, experienceLevel, jobTask, selectedDocs } }
- Response: { analysis, insights, recommendations }
```

### 4. Gemini Insights
```
POST /api/gemini-insights
- Gets enhanced AI insights using Gemini API
- Request body: { personaAnalysis, userMessage }
- Response: { response, insights, suggestions }
```

### 5. Analysis Status
```
GET /api/analysis-status/{analysisId}
- Checks status of ongoing analysis
- Response: { status, progress, results }
```

## Integration Steps

### Step 1: Backend Setup
1. **Install Gemini API client**:
   ```bash
   pip install google-generativeai
   ```

2. **Set up Gemini API key**:
   ```python
   import google.generativeai as genai
   genai.configure(api_key='YOUR_GEMINI_API_KEY')
   ```

3. **Create analysis service**:
   ```python
   class PersonaAnalysisService:
       def __init__(self):
           self.model = genai.GenerativeModel('gemini-pro')
       
       async def analyze_documents(self, documents, persona):
           # Your existing persona analysis logic
           analysis_result = await self.run_analysis(documents, persona)
           
           # Enhance with Gemini
           prompt = f"""
           Based on this persona analysis: {analysis_result}
           Role: {persona['role']}
           Experience: {persona['experienceLevel']}
           Goal: {persona['jobTask']}
           
           Provide additional insights and recommendations.
           """
           
           gemini_response = await self.model.generate_content(prompt)
           return {
               'analysis': analysis_result,
               'gemini_insights': gemini_response.text
           }
   ```

### Step 2: Frontend Configuration
1. **Update API base URL** in `personaAnalysisService.js`:
   ```javascript
   const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080/api';
   ```

2. **Set environment variables**:
   ```bash
   # .env.local
   REACT_APP_API_BASE=http://localhost:8080/api
   ```

### Step 3: Backend Routes
```python
# FastAPI example
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel

app = FastAPI()

class PersonaRequest(BaseModel):
    role: str
    experienceLevel: str
    jobTask: str
    selectedDocs: List[str]

@app.post("/api/trigger-analysis")
async def trigger_analysis(request: PersonaRequest):
    analysis_id = await persona_service.start_analysis(request)
    return {"analysisId": analysis_id, "status": "started"}

@app.post("/api/persona-analysis")
async def process_message(request: dict):
    result = await persona_service.analyze_message(request)
    return result

@app.post("/api/gemini-insights")
async def get_gemini_insights(request: dict):
    insights = await gemini_service.get_insights(request)
    return insights
```

## Data Flow

1. **User Configuration**: User selects role, experience level, and documents
2. **Analysis Trigger**: Backend starts persona analysis on selected documents
3. **Chat Interaction**: User asks questions via chatbot
4. **Context Processing**: Backend processes message with persona context
5. **Gemini Enhancement**: Gemini API provides additional insights
6. **Response Generation**: Combined analysis + Gemini insights sent to user

## Example Backend Response

```json
{
  "analysis": {
    "persona": "Data Scientist",
    "experienceLevel": "intermediate",
    "relevantSections": 12,
    "keyInsights": ["ML algorithms", "Data preprocessing", "Model evaluation"],
    "recommendations": ["Focus on practical applications", "Review statistical foundations"]
  },
  "gemini_insights": {
    "response": "Based on your Data Scientist role, I recommend focusing on the practical implementation aspects...",
    "insights": ["Consider exploring ensemble methods", "Review cross-validation techniques"],
    "suggestions": ["Try implementing a simple ML pipeline", "Experiment with different algorithms"]
  }
}
```

## Error Handling

The frontend includes comprehensive error handling:
- Network errors
- API failures
- Invalid responses
- Timeout handling

## Testing

1. **Start backend server** with required endpoints
2. **Test document upload** and retrieval
3. **Verify persona analysis** workflow
4. **Check Gemini integration** responses
5. **Test chat functionality** with various personas

## Troubleshooting

### Common Issues:
1. **CORS errors**: Ensure backend allows frontend origin
2. **API key issues**: Verify Gemini API key is valid
3. **Document loading**: Check file paths and permissions
4. **Analysis timeouts**: Implement proper async handling

### Debug Tips:
- Check browser console for API errors
- Verify backend logs for request processing
- Test API endpoints with Postman/curl
- Monitor Gemini API usage and quotas

## Security Considerations

1. **API Key Protection**: Never expose Gemini API key in frontend
2. **Input Validation**: Validate all user inputs on backend
3. **Rate Limiting**: Implement rate limiting for API calls
4. **Authentication**: Add user authentication if required

## Performance Optimization

1. **Caching**: Cache analysis results and Gemini responses
2. **Async Processing**: Use background tasks for long analyses
3. **Pagination**: Implement pagination for large document lists
4. **Compression**: Compress API responses for better performance
