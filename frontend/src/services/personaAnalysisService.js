 
 // Service for handling persona analysis API calls and Gemini integration

const API_BASE = '/api';

export const personaAnalysisService = {
  // Get available documents
  async getDocuments() {
    try {
      const response = await fetch(`${API_BASE}/persona-analyze/available-docs`);
      if (!response.ok) throw new Error('Failed to fetch documents');
      return await response.json();
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  // Trigger persona analysis
  async triggerAnalysis(analysisData) {
    try {
      const response = await fetch(`${API_BASE}/persona-analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisData)
      });
      if (!response.ok) throw new Error('Failed to trigger analysis');
      return await response.json();
    } catch (error) {
      console.error('Error triggering analysis:', error);
      throw error;
    }
  },

  // Send message for persona analysis
  // This endpoint does not exist in backend; recommend using triggerAnalysis for persona analysis
  async sendMessage(messageData) {
    // Not implemented: No matching backend endpoint
    throw new Error('sendMessage is not implemented. Use triggerAnalysis instead.');
  },

  // Get Gemini insights
  // This endpoint does not exist in backend; not implemented
  async getGeminiInsights(insightData) {
    throw new Error('getGeminiInsights is not implemented.');
  },

  // Upload document
  async uploadDocument(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${API_BASE}/files/upload`, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Failed to upload document');
      return await response.json();
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  // Get analysis status
  // No matching backend endpoint for analysis status
  async getAnalysisStatus(analysisId) {
    throw new Error('getAnalysisStatus is not implemented.');
  }
};

export default personaAnalysisService;
