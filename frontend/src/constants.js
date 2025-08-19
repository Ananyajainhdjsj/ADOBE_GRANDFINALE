// Constants and configuration for the PDF Insights application

export const API_BASE = '/api';

// Adobe PDF Embed API Configuration
export const ADOBE_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_ADOBE_CLIENT_ID || '415d3d80cdc74823bd877e17add7346b',
  VIEW_SDK_URL: 'https://documentservices.adobe.com/view-sdk/viewer.js'
};

export const NAV_ITEMS = [
  {id:'home', label: 'Home'},
  { id: 'upload', label: 'Upload PDF' },
  { id: 'viewer', label: 'Viewer' },

  { id: 'gemini', label: 'Gemini Q&A' },
  { id: 'rag', label: 'RAG Insights' },
];

export const PERSONA_ROLES = [
  'Data Scientist',
  'Software Engineer', 
  'Product Manager',
  'Student',
  'Researcher',
  'Business Analyst'
];

export const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
];

export const INSIGHTS_MODES = [
  { value: 'bulb', label: 'General Insights' },
  { value: 'keypoints', label: 'Key Points' },
  { value: 'contradictions', label: 'Contradictions' }
];

export const DEFAULT_INSIGHTS = [
  {
    title: 'AI-Powered Analysis',
    description: 'Get personalized insights based on your role and objectives. The AI analyzes documents through your specific lens.',
    type: 'info'
  },
  {
    title: 'Role-Based Filtering',
    description: 'Content is filtered and prioritized based on your selected persona - Data Scientist, Engineer, Manager, etc.',
    type: 'info'
  },
  {
    title: 'Key Takeaways',
    description: 'Automatically extracted key points, summaries, and actionable items relevant to your goals.',
    type: 'success'
  },
  {
    title: 'Smart Recommendations',
    description: 'Contextual suggestions and next steps based on the analyzed content and your persona.',
    type: 'info'
  },
];
