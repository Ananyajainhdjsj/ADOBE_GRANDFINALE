
import React, { useState, useEffect } from 'react';
import { personaAnalysisService } from '../services/personaAnalysisService';

const UploadPage = ({ uploadSectionRef }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAvailableFiles();
  }, []);

  const loadAvailableFiles = async () => {
    setLoading(true);
    try {
      const data = await personaAnalysisService.getDocuments();
      setFiles(data.available_documents || []);
    } catch (error) {
      setFiles([]);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setLoading(true);
      for (let i = 0; i < selectedFiles.length; i++) {
        try {
          await personaAnalysisService.uploadDocument(selectedFiles[i]);
        } catch (error) {
          alert(`Failed to upload file: ${selectedFiles[i].name}`);
        }
      }
      await loadAvailableFiles();
      setLoading(false);
    }
  };

  const deleteFile = async (docId) => {
    if (confirm('Are you sure you want to delete this file?')) {
      try {
  await fetch(`/api/files/${docId}`, { method: 'DELETE' });
        await loadAvailableFiles();
      } catch (error) {
        alert('Failed to delete file.');
      }
    }
  };

  const formatFileSize = (bytes) => {
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen">
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="space-y-16 w-full">
            {/* Upload Section */}
            <div className="apple-card w-full" ref={uploadSectionRef}>
              <div className="apple-card-content">
            <h2 className="apple-section-title">
              Upload Documents
            </h2>
            <p className="apple-section-subtitle">
              Drag and drop your PDF or JSON files here, or click to browse.
            </p>
            <div className="mb-8">
              <input
                type="file"
                id="file-input"
                accept=".pdf,.json"
                multiple
                onChange={handleFileUpload}
                className="apple-input"
                style={{ display: 'none' }}
              />
              <div
                className="border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer"
                style={{
                  borderColor: 'rgba(142, 142, 147, 0.3)',
                  backgroundColor: 'rgba(142, 142, 147, 0.05)'
                }}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">
                  Choose files to upload
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  PDF and JSON files supported • Up to 10MB each
                </p>
              </div>
            </div>
            <button className="apple-btn-primary">
              Select Files
            </button>
          </div>
        </div>

        {/* Available Documents Section */}
        <div className="apple-card">
          <div className="apple-card-content">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="apple-section-title mb-2">
                  Your Documents
                </h2>
                <p className="apple-section-subtitle">
                  {files.length} {files.length === 1 ? 'document' : 'documents'} ready for analysis
                </p>
              </div>
              <button className="apple-btn-secondary" onClick={loadAvailableFiles}>
                Refresh
              </button>
            </div>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 mb-4" style={{ borderColor: 'rgb(215, 52, 30)' }}></div>
                <p className="text-gray-600 dark:text-gray-300">Loading documents...</p>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📂</div>
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                  No documents yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Upload your first PDF or JSON file to get started with AI-powered analysis.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.doc_id}
                    className="flex items-center justify-between p-6 rounded-xl transition-all duration-200"
                    style={{ backgroundColor: 'rgba(142, 142, 147, 0.08)' }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">📄</div>
                      <div>
                        <div className="font-medium text-lg text-gray-900 dark:text-white">
                          {file.original_filename}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {file.file_type.toUpperCase()} • {formatFileSize(file.file_size_bytes)} • {formatDate(file.upload_timestamp)}
                        </div>
                      </div>
                    </div>
                    <button
                      className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-200"
                      style={{
                        backgroundColor: 'rgba(255, 59, 48, 0.1)',
                        color: '#ff3b30'
                      }}
                      onClick={() => deleteFile(file.doc_id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
      </div>
  );
};


export default UploadPage;
