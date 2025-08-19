
import React, { useState, useEffect, useRef } from 'react';
import { personaAnalysisService } from '../services/personaAnalysisService';
import { fetchRelevantSnippets } from '../services/personaService';

const PersonaAnalysisPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [personaData, setPersonaData] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [jobTask, setJobTask] = useState('');
  const [availableDocs, setAvailableDocs] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  // For snippet integration
  const [selectedText, setSelectedText] = useState('');
  const [snippets, setSnippets] = useState([]);
  // Fetch snippets when selection changes
  useEffect(() => {
    if (selectedText && selectedDocs.length > 0) {
      fetchRelevantSnippets({
        pdfId: selectedDocs[0], // Only first doc for now
        selection: selectedText,
        context: selectedRole,
        topK: 5,
      })
        .then(setSnippets)
        .catch(() => setSnippets([]));
    } else {
      setSnippets([]);
    }
  }, [selectedText, selectedDocs, selectedRole]);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadAvailableDocuments();
    // Add welcome message
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: 'Hello! I\'m your AI Persona Analysis Assistant. I can help you analyze documents based on your role and objectives. Let\'s start by understanding your persona and what you want to accomplish.',
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadAvailableDocuments = async () => {
    try {
      const data = await personaAnalysisService.getDocuments();
      setAvailableDocs(data.available_documents || []);
    } catch (error) {
      setAvailableDocs([]);
    }
  };

  // Remove Gemini and chat message sending logic for now
  // Only keep document selection, persona setup, and snippet integration

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setIsLoading(true);
      for (let i = 0; i < files.length; i++) {
        try {
          await personaAnalysisService.uploadDocument(files[i]);
        } catch (error) {
          alert(`Failed to upload file: ${files[i].name}`);
        }
      }
      await loadAvailableDocuments();
      setIsLoading(false);
    }
  };

  const startPersonaAnalysis = async () => {
    if (selectedDocs.length === 0) {
      const warningMessage = {
        id: Date.now(),
        type: 'bot',
        content: 'Please select at least one document to analyze before we begin.',
        timestamp: new Date(),
        isWarning: true
      };
      setMessages(prev => [...prev, warningMessage]);
      return;
    }

    const analysisMessage = {
      id: Date.now(),
      type: 'user',
      content: `I want to analyze ${selectedDocs.length} document(s) as a ${selectedRole}. My goal is: ${jobTask}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, analysisMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Use personaAnalysisService to trigger analysis (local logic)
      const result = await personaAnalysisService.triggerAnalysis({
        doc_ids: selectedDocs,
        persona: { role: selectedRole },
        job_to_be_done: { task: jobTask },
        job_description: jobTask
      });

      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: `Great! I've started analyzing your documents with a focus on your ${selectedRole} persona. Here are your insights:`,
        timestamp: new Date(),
        analysisData: result.persona_analysis
      };

      setMessages(prev => [...prev, botResponse]);
      setPersonaData(result.persona_analysis);
    } catch (error) {
      console.error('Error starting analysis:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'I encountered an error starting the analysis. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  // Stub for PDF jump logic
  const jumpToPdfPage = (pageNumber) => {
    alert(`Jump to PDF page: ${pageNumber + 1}`);
  };

  // Handler for text selection (should be attached to PDF/text area)
  const handleTextSelection = () => {
    const selection = window.getSelection().toString();
    setSelectedText(selection);
  };

  return (
    <div>
      <div className="w-full px-6">
        {/* Header */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Chat Interface */}
          <div className="xl:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 h-[700px] flex flex-col">
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Chat with AI Assistant
          </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ask questions and get insights based on your persona
                </p>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4" onMouseUp={handleTextSelection}>
                {/* Snippet display */}
                {snippets.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Relevant PDF Snippets</h4>
                    {snippets.map(snippet => (
                      <div
                        key={snippet.section_id}
                        className="mb-3 cursor-pointer hover:bg-blue-100 p-2 rounded"
                        onClick={() => jumpToPdfPage(snippet.page_number)}
                      >
                        <div className="font-bold">{snippet.section_heading}</div>
                        <div className="text-sm">{snippet.snippet}</div>
                        <div className="text-xs text-gray-500">Page: {snippet.page_number + 1}</div>
                      </div>
                    ))}
                  </div>
                )}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : message.isError
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : message.isWarning
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      {message.analysisData && (
                        <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded-lg text-xs">
                          <div className="font-semibold mb-2">Analysis Summary:</div>
                          <div className="space-y-1">
                            <div>Role: {message.analysisData.persona?.role}</div>
                            <div>Documents: {message.analysisData.documents?.length || 0}</div>
                          </div>
                        </div>
                      )}
                      <div className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area removed for now */}
            </div>
          </div>

          {/* Persona Configuration Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Persona Setup */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Configure Your Persona
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Role
                  </label>
                  <input
                    type="text"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    placeholder="e.g., Data Scientist, Teacher, Marketing Manager"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What do you want to accomplish?
            </label>
            <input
              type="text"
              value={jobTask}
              onChange={(e) => setJobTask(e.target.value)}
              placeholder="e.g., understand machine learning algorithms"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

                <button
                  onClick={startPersonaAnalysis}
                  disabled={selectedDocs.length === 0 || !jobTask.trim()}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Start Analysis
                </button>
              </div>
          </div>

            {/* Document Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Select Documents
              </h3>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {availableDocs.map((doc) => (
                  <div key={doc.doc_id} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={`doc_${doc.doc_id}`}
                        checked={selectedDocs.includes(doc.doc_id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDocs([...selectedDocs, doc.doc_id]);
                        } else {
                          setSelectedDocs(selectedDocs.filter(id => id !== doc.doc_id));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`doc_${doc.doc_id}`} className="flex-1 cursor-pointer">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {doc.original_filename}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(doc.file_size_bytes)}
                      </div>
                    </label>
                    </div>
                ))}
          </div>

          <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full mt-4 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
          >
                + Upload New Document
          </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {/* Analysis Status */}
            {personaData && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Analysis Status
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span className="text-green-600 font-medium">Complete</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Documents:</span>
                    <span className="font-medium">{personaData.documents?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Role:</span>
                    <span className="font-medium">{personaData.persona?.role}</span>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default PersonaAnalysisPage;
