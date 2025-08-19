import React, { useState } from 'react';

const InsightsPage = () => {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('bulb');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    if (!text.trim()) {
      alert('Please enter text to analyze');
      return;
    }

    setLoading(true);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      const mockResult = {
        source: `${mode.charAt(0).toUpperCase() + mode.slice(1)} Analysis`,
        insights: generateMockInsights(text, mode)
      };

      setResult(mockResult);
      setLoading(false);
    }, 2000);
  };

  const generateMockInsights = (inputText, analysisMode) => {
    const textLength = inputText.length;
    const wordCount = inputText.split(/\s+/).length;

    switch (analysisMode) {
      case 'keypoints':
        return `Key Points Analysis:

• The provided text contains ${wordCount} words across ${textLength} characters
• Main themes identified: ${getMainThemes(inputText)}
• Complexity level: ${getComplexityLevel(wordCount)}
• Actionable items: ${getActionableItems(inputText)}
• Summary: This text discusses important concepts that would benefit from structured implementation and further research.`;

      case 'contradictions':
        return `Contradiction Analysis:

• Internal consistency: ${getConsistencyLevel(inputText)}
• Potential conflicts: ${getConflicts(inputText)}
• Logic flow: The arguments presented follow a ${getLogicFlow()} structure
• Areas for clarification: ${getClarificationNeeds(inputText)}
• Recommendation: Review highlighted sections for potential inconsistencies and strengthen logical connections.`;

      default: // 'bulb' - General Insights
        return `General Insights Analysis:

• Document structure: Well-organized content with ${wordCount} words
• Key insights: The text reveals important patterns and concepts relevant to the subject matter
• Practical applications: ${getPracticalApplications(inputText)}
• Learning opportunities: ${getLearningOpportunities(inputText)}
• Next steps: Consider implementing the suggested approaches and gathering additional data for validation.
• Overall assessment: This content provides valuable information that can be leveraged for decision-making and strategic planning.`;
    }
  };

  const getMainThemes = (text) => {
    const themes = ['data analysis', 'process optimization', 'strategic planning', 'implementation'];
    return themes.slice(0, 2).join(', ');
  };

  const getComplexityLevel = (wordCount) => {
    if (wordCount < 50) return 'Basic';
    if (wordCount < 200) return 'Intermediate';
    return 'Advanced';
  };

  const getActionableItems = (text) => {
    return 'Implementation planning, stakeholder engagement, resource allocation';
  };

  const getConsistencyLevel = (text) => {
    return 'High - arguments are well-structured and logically connected';
  };

  const getConflicts = (text) => {
    return 'None detected - concepts align well with stated objectives';
  };

  const getLogicFlow = () => {
    const flows = ['deductive', 'inductive', 'systematic'];
    return flows[Math.floor(Math.random() * flows.length)];
  };

  const getClarificationNeeds = (text) => {
    return 'Technical terminology, specific metrics, implementation timelines';
  };

  const getPracticalApplications = (text) => {
    return 'Workflow optimization, decision support systems, performance metrics';
  };

  const getLearningOpportunities = (text) => {
    return 'Best practices identification, knowledge transfer, skill development';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      generateInsights();
    }
  };

  return (
    <div className="adobe-section scroll-scale">
      <h2 className="text-gray-800 dark:text-white mb-8 text-3xl font-semibold">
        Generate Insights
      </h2>
      
      <div className="mb-8">
        <label htmlFor="insights-text" className="block mb-3 font-medium text-gray-800 dark:text-white">
          Text to Analyze:
        </label>
        <textarea
          id="insights-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Paste text here for insights generation..."
          className="adobe-input h-32 resize-y leading-relaxed"
        />
        <div className="text-sm text-gray-500 mt-2">
          Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to generate insights quickly
        </div>
      </div>
      
      <div className="mb-8">
        <label htmlFor="insights-mode" className="block mb-3 font-medium text-gray-800 dark:text-white">
          Analysis Mode:
        </label>
        <select
          id="insights-mode"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="adobe-input"
        >
          <option value="bulb">General Insights</option>
          <option value="keypoints">Key Points</option>
          <option value="contradictions">Contradictions</option>
        </select>
        <div className="text-sm text-gray-500 mt-2">
          {mode === 'bulb' && 'Comprehensive analysis with overall insights and recommendations'}
          {mode === 'keypoints' && 'Extract main points, themes, and actionable items'}
          {mode === 'contradictions' && 'Identify inconsistencies and logical conflicts'}
        </div>
      </div>
      
      <button
        className="adobe-btn"
        onClick={generateInsights}
        disabled={loading || !text.trim()}
      >
        {loading ? 'Generating Insights...' : 'Generate Insights'}
      </button>

      {loading && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 mt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-blue-600 font-medium">Generating insights...</div>
            <div className="text-sm text-gray-600 mt-2">AI is analyzing your text</div>
          </div>
        </div>
      )}

      {!loading && result && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-5 mt-8">
          <h3 className="text-green-600 mb-4 text-xl font-semibold">
            Generated Insights (Demo)
          </h3>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <div className="font-bold text-gray-800 mb-2">
              Source: {result.source}
            </div>
            <div className="text-gray-600 leading-relaxed whitespace-pre-line">
              {result.insights}
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <div className="text-sm text-blue-700">
              <strong>Note:</strong> This is a demonstration of AI-powered insights generation. 
              Connect to a real backend for actual analysis using advanced NLP models.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsPage;
