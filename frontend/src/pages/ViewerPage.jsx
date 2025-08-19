import React, { useState, useEffect, useRef } from 'react';
import { ADOBE_CONFIG } from '../constants';
import LocalPDFViewer from '../components/LocalPDFViewer';
// ...existing code...
import { personaAnalysisService } from '../services/personaAnalysisService';

const ViewerPage = ({ onNavigateToUpload }) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adobeLoaded, setAdobeLoaded] = useState(false);
  const [useLocalViewer, setUseLocalViewer] = useState(false);
// ...existing code...
  const viewerRef = useRef(null);
// ...existing code...
  // Check if we're on localhost
  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('.local');

  useEffect(() => {
    loadAvailableFiles();
    loadAdobeAPI();
  }, []);

  useEffect(() => {
    if (selectedFile && adobeLoaded && window.AdobeDC) {
      renderPDF();
    }
  }, [selectedFile, adobeLoaded]);

  const loadAvailableFiles = async () => {
    setLoading(true);
    try {
      const data = await personaAnalysisService.getDocuments();
      const docs = (data && data.available_documents) ? data.available_documents : [];
      // Keep your original local dev URL to avoid wiring changes
      const filesWithUrl = docs
        .filter(f => f.file_type.toLowerCase() === 'pdf')
        .map(f => ({
          ...f,
          pdf_url: `/api/pdf/${f.doc_id}/file`
        }));
      setFiles(filesWithUrl);
      if (filesWithUrl.length > 0 && !selectedFile) {
        setSelectedFile(filesWithUrl[0]);
      }
    } catch (error) {
      setFiles([]);
    }
    setLoading(false);
  };

  const loadAdobeAPI = () => {
    // Check if Adobe DC View SDK is already loaded
    if (window.AdobeDC) {
      setAdobeLoaded(true);
      return;
    }

    // Load Adobe DC View SDK
    const script = document.createElement('script');
    script.src = ADOBE_CONFIG.VIEW_SDK_URL;
    script.onload = () => setAdobeLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Adobe DC View SDK');
    };
    document.head.appendChild(script);
  };

  const renderPDF = () => {
    if (!selectedFile || !window.AdobeDC || !viewerRef.current) return;

    // Clear previous viewer content
    viewerRef.current.innerHTML = '';

    // Initialize Adobe DC View
    const adobeDCView = new window.AdobeDC.View({
      clientId: ADOBE_CONFIG.CLIENT_ID,
      divId: 'adobe-dc-view'
    });

    // Render the PDF inside a sized container (prevents nested page scrollbars)
    adobeDCView.previewFile(
      {
        content: {
          location: { url: selectedFile.pdf_url }
        },
        metaData: {
          fileName: selectedFile.original_filename
        }
      },
      {
        embedMode: 'SIZED_CONTAINER',
        showLeftHandPanel: true,
        showDownloadPDF: true,
        showPrintPDF: true,
        showAnnotationTools: true
        
      }
    );
  };

  const formatFileSize = (bytes) => (bytes / 1024 / 1024).toFixed(1) + ' MB';

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

// ...existing code...

  return (
    <div className="flex h-[calc(100vh-200px)] space-x-6 overflow-hidden">
      {/* Left Sidebar - PDF List (1/4 width) */}
      <div className="w-1/4 apple-card overflow-y-auto">
        <div className="apple-card-content">
          <h3 className="apple-section-title text-xl mb-4">Documents</h3>
          <button
            className="apple-btn-secondary w-full mb-6"
            onClick={onNavigateToUpload}
          >
            Upload More
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading PDFs...
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-4">📄</div>
            <p className="text-sm">
              No PDFs uploaded yet.<br />
              Upload some PDFs to view them here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.doc_id}
                onClick={() => setSelectedFile(file)}
                className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedFile?.doc_id === file.doc_id
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="font-medium text-gray-800 dark:text-gray-200 text-sm mb-1 truncate">
                  {file.original_filename}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(file.file_size_bytes)} • {formatDate(file.upload_timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Content - PDF Viewer (3/4 width) */}
      <div className="w-3/4 apple-card flex flex-col overflow-hidden">
        {/* Header */}
        <div className="apple-card-content flex-shrink-0">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="apple-section-title text-xl mb-1">
                {selectedFile ? selectedFile.original_filename : 'PDF Viewer'}
              </h3>
              {selectedFile && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {formatFileSize(selectedFile.file_size_bytes)} • {selectedFile.file_type}
                </p>
              )}
            </div>
            {isLocalhost && selectedFile && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Viewer:
                </span>
                <button
                  onClick={() => setUseLocalViewer(!useLocalViewer)}
                  className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                    useLocalViewer ? 'apple-btn-primary' : 'apple-btn-secondary'
                  }`}
                >
                  {useLocalViewer ? 'Local' : 'Adobe'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main PDF Display Area */}
        <div className="flex-1 min-h-0">
          {!selectedFile ? (
            <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <div className="text-6xl mb-4">📄</div>
                <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  Select a PDF to View
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a PDF from the sidebar to view it here using Adobe PDF Embed API.
                </p>
              </div>
            </div>
          ) : useLocalViewer || (isLocalhost && !adobeLoaded) ? (
            <LocalPDFViewer
              pdfUrl={selectedFile.pdf_url}
              filename={selectedFile.original_filename}
              fileSize={formatFileSize(selectedFile.file_size_bytes)}
            />
          ) : !adobeLoaded ? (
            <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Loading Adobe PDF Viewer...</p>
                <button
                  onClick={() => setUseLocalViewer(true)}
                  className="bg-blue-500 text-white px-4 py-2 text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  Use Local Viewer Instead
                </button>
              </div>
            </div>
          ) : (
            // IMPORTANT: This container is the only scrolling context Adobe needs.
            // No extra wrappers with overflow; height is inherited from flex-1 area above.
            <div
              id="adobe-dc-view"
              ref={viewerRef}
              className="w-full h-full rounded-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewerPage;
