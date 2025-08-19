import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_BASE = "/api/rag";

const RAGInsightsPage = () => {
  const [pdfs, setPdfs] = useState([]);
  const [highlight, setHighlight] = useState("");
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [inDepthResults, setInDepthResults] = useState(null);
  const [inDepthLoading, setInDepthLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [insights, inDepthResults]);
  // In-depth search handler
  const handleInDepth = async () => {
    setInDepthLoading(true);
    setInDepthResults(null);
    try {
      const res = await axios.post(`${API_BASE}/search_snippets`, { highlight });
      setInDepthResults(res.data.results);
    } catch (err) {
      setInDepthResults([]);
    }
    setInDepthLoading(false);
  };

  const handleUpload = async () => {
    setLoading(true);
    setUploadMsg("");
    try {
      const formData = new FormData();
      for (let f of pdfs) formData.append("files", f);
      const res = await axios.post(`${API_BASE}/ingest_pdfs`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadMsg(res.data.message);
    } catch (err) {
      setUploadMsg("Upload failed");
    }
    setLoading(false);
  };

  const handleInsights = async () => {
    setLoading(true);
    setInsights(null);
    try {
      const res = await axios.post(`${API_BASE}/insights`, { highlight });
      setInsights(res.data);
    } catch (err) {
      setInsights({ error: "Failed to fetch insights" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
    
      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Side - File Upload Section */}
        <div className="w-96 border-r border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Upload PDFs</h2>
              <div className="flex flex-col gap-4">
                <label className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Choose PDFs
                  <input
                    type="file"
                    multiple
                    accept="application/pdf"
                    onChange={e => setPdfs(Array.from(e.target.files))}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleUpload}
                  disabled={loading || !pdfs.length}
                  className={`px-4 py-3 rounded-lg transition-colors w-full ${
                    loading || !pdfs.length
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {loading ? "Uploading..." : "Upload & Process"}
                </button>
              </div>
            </div>
            
            {uploadMsg && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-200 rounded-lg animate-fade-in">
                {uploadMsg}
              </div>
            )}

            {/* File List */}
            {pdfs.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Selected Files:
                </h3>
                <ul className="space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto">
                  {pdfs.map((file, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg"
                    >
                      <span className="text-gray-700 dark:text-gray-200 text-sm truncate mr-2">{file.name}</span>
                      <button
                        onClick={() => setPdfs(pdfs.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1 flex-shrink-0"
                        title="Remove file"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Chat Interface */}
        <div className="flex-1 flex flex-col">
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Prompt Section */}
            <div className="px-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Ask for Insights
              </h2>
              <div className="relative">
                <textarea
                  rows="4"
                  placeholder="Paste or highlight text to analyze..."
                  value={highlight}
                  onChange={e => setHighlight(e.target.value)}
                  className="w-full p-4 pr-32 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none text-gray-700 dark:text-gray-200"
                  spellCheck={true}
                />
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button
                    onClick={handleInsights}
                    disabled={loading || !highlight}
                    className={`px-4 py-2 rounded-lg transition-all transform hover:scale-105 ${
                      loading || !highlight
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                    }`}
                  >
                    Get Insights
                  </button>
                  <button
                    onClick={handleInDepth}
                    disabled={inDepthLoading || !highlight}
                    className={`px-4 py-2 rounded-lg transition-all transform hover:scale-105 ${
                      inDepthLoading || !highlight
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg"
                    }`}
                  >
                    {inDepthLoading ? 'Loading...' : 'In-depth'}
                  </button>
                </div>
              </div>
            </div>

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-center items-center py-8 animate-fade-in">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Analyzing...</span>
              </div>
            )}

            {/* Insights Messages */}
            {insights && !insights.error && (
              <div className="space-y-6 animate-fade-in px-4">
                <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
                  <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      AI Insights
                    </h3>
                  </div>
                  <div className="p-4 space-y-4">
                    {Object.entries(insights).map(([key, vals]) => (
                      <div key={key} className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                          {key}
                        </h4>
                        <ul className="space-y-2">
                          {Array.isArray(vals) &&
                            vals.map((v, i) => (
                              <li
                                key={i}
                                className="text-gray-600 dark:text-gray-400 ml-4 before:content-['•'] before:mr-2"
                              >
                                {v}
                              </li>
                            ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* In-depth Results */}
            {inDepthResults && (
              <div className="space-y-6 animate-fade-in px-4">
                <div className="bg-gray-50/50 dark:bg-gray-900/50 rounded-xl overflow-hidden">
                  <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      In-depth Analysis
                    </h3>
                  </div>
                  <div className="p-4">
                    {inDepthResults.length === 0 ? (
                      <p className="text-gray-600 dark:text-gray-400">No relevant snippets found.</p>
                    ) : (
                      <div className="space-y-4">
                        {inDepthResults.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm font-medium">
                                Score: {item.score.toFixed(3)}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                              {item.text}
                            </p>
                            {item.metadata && item.metadata.doc && (
                              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Source: {item.metadata.doc}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {insights && insights.error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-xl animate-fade-in">
                {insights.error}
              </div>
            )}

            {/* Auto-scroll Anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RAGInsightsPage;
