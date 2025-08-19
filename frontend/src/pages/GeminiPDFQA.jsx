
import React, { useState, useRef, useEffect } from 'react';

const GeminiPDFQA = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [relevantSections, setRelevantSections] = useState([]);
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [answer, error]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    // Prevent duplicates by name
    setFiles((prev) => {
      const names = new Set(prev.map(f => f.name));
      return [...prev, ...newFiles.filter(f => !names.has(f.name))];
    });
    setAnswer('');
    setError('');
    // Reset input value so same file can be re-added if deleted
    e.target.value = '';
  };

  const handleUpload = async () => {
    if (!files.length) {
      setError('Please select at least one PDF file.');
      return;
    }
    setUploading(true);
  setError('');
  setAnswer('');
  setRelevantSections([]);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    try {
  const res = await fetch('/api/gemini/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      setAnswer('PDFs uploaded and indexed! You can now ask questions.');
    } catch (err) {
      setError('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }
  setError('');
  setAnswer('');
  setAudioUrl(null);
    try {
  const res = await fetch('/api/gemini/summarise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error('Failed to get answer');
  const data = await res.json();
  setAnswer(data.summary);
  setRelevantSections(Array.isArray(data.relevant_sections) ? data.relevant_sections : []);
  setAudioUrl(null);
    } catch (err) {
      setError('Failed to get answer.');
    }
  };

  // Only allow asking questions after successful upload
  const canAsk = answer === 'PDFs uploaded and indexed! You can now ask questions.';

  function SpeakerIcon({ onClick, isPlaying, loading, disabled }) {
    return (
      <button
        onClick={onClick}
        className={`ml-2 p-1 rounded-full transition-all duration-200 ${
          disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        title={disabled ? 'Audio available after answer' : 'Listen to audio overview'}
        disabled={disabled || loading}
      >
        <svg
          className={`w-6 h-6 ${isPlaying ? 'text-blue-500 filter drop-shadow-glow animate-pulse' : 'text-gray-500'}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 9v6h4l5 5V4L7 9H3z"/>
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z"/>
        </svg>
        {loading && <span className="ml-1 text-xs text-gray-500">Loading...</span>}
      </button>
    );
  }

  // Handle audio fetch and playback
  const handlePlayAudio = async () => {
    if (!answer) return;
    setAudioLoading(true);
    setAudioUrl(null);
    try {
  const res = await fetch('/api/audio/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: answer, speed: playbackRate })
      });
      if (!res.ok) throw new Error('Failed to generate audio');
      const data = await res.json();
  setAudioUrl(data.audio_url);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.playbackRate = playbackRate;
          audioRef.current.play();
        }
      }, 300);
    } catch (e) {
      setError('Audio generation failed.');
    } finally {
      setAudioLoading(false);
    }
  };

  // Handle audio events
  const handleAudioPlay = () => setIsPlaying(true);
  const handleAudioPause = () => setIsPlaying(false);
  const handleAudioEnded = () => setIsPlaying(false);

  return (
    <div className="min-h-screen  dark:from-gray-900 dark:to-gray-800">


      {/* Main Content Area */}
      <div className="flex h-screen">
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
                    accept="application/pdf"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <button
                  onClick={handleUpload}
                  disabled={uploading || !files.length}
                  className={`px-4 py-3 rounded-lg transition-colors w-full ${
                    uploading || !files.length
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {uploading ? "Uploading..." : "Upload & Process"}
                </button>
              </div>
            </div>
            
            {/* File List */}
            {files.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Selected Files:
                </h3>
                <ul className="space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto">
                  {files.map((file, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg"
                    >
                      <span className="text-gray-700 dark:text-gray-200 text-sm truncate mr-2">{file.name}</span>
                      <button
                        onClick={() => setFiles(files.filter((_, i) => i !== idx))}
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
        <div className="flex-1 flex flex-col h-screen">
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 p-4 rounded-lg animate-fade-in mb-4">
                {error}
              </div>
            )}
            {answer && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 animate-fade-in">
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="prose dark:prose-invert max-w-none">
                      {answer}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <SpeakerIcon
                        onClick={handlePlayAudio}
                        isPlaying={isPlaying}
                        loading={audioLoading}
                        disabled={!answer || audioLoading}
                      />
                      <select
                        value={playbackRate}
                        onChange={e => setPlaybackRate(Number(e.target.value))}
                        className="text-xs border border-gray-200 dark:border-gray-700 rounded px-2 py-1"
                        disabled={!answer}
                      >
                        <option value={0.75}>0.75x</option>
                        <option value={1}>1x</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Relevant Sections */}
            {answer && relevantSections.length > 0 && (
              <div className="space-y-2 animate-fade-in">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Relevant PDF Snippets:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relevantSections.map((section, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {section.length > 200 ? section.slice(0, 200) + '...' : section}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Sticky at bottom */}
          <div className="sticky bottom-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 mt-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && canAsk) {
                      e.preventDefault();
                      handleAsk();
                    }
                  }}
                  placeholder={canAsk ? "Ask a question about your PDFs..." : "Upload PDFs first..."}
                  className={`w-full px-4 py-2 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none
                    ${!canAsk && 'opacity-50 cursor-not-allowed'}`}
                  disabled={!canAsk}
                />
              </div>
              <button
                onClick={handleAsk}
                disabled={!canAsk}
                className={`px-4 py-2 rounded-lg transition-all transform hover:scale-105 ${
                  !canAsk
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95'
                }`}
              >
                Ask
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        className="hidden"
        onPlay={handleAudioPlay}
        onPause={handleAudioPause}
        onEnded={handleAudioEnded}
      />
    </div>
  );
};

export default GeminiPDFQA;
