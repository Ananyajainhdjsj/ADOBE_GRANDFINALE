import React, { useState } from 'react';

const LocalPDFViewer = ({ pdfUrl, filename, fileSize }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load PDF');
  };

  return (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-lg relative">
      {/* PDF Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 p-3 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-red-500 text-lg">📄</div>
            <div>
              <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                {filename}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {fileSize} • PDF Document
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.open(pdfUrl, '_blank')}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Download
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Print
            </button>
          </div>
        </div>
      </div>

      {/* PDF Content Area */}
      <div className="relative h-[calc(100%-60px)]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading PDF...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">❌</div>
              <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                PDF Loading Error
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <button
                onClick={() => window.open(pdfUrl, '_blank')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Open in New Tab
              </button>
            </div>
          </div>
        )}

        {/* PDF iframe with fallback for browsers that don't support inline PDF */}
        {!error && (
        <iframe
  src={pdfUrl}
  type="application/pdf"
  allow="autoplay; encrypted-media"
  className="w-full h-full rounded-b-lg"
  style={{ border: 'none', width: '100%', height: '100%' }}
  onLoad={handleLoad}
  onError={handleError}
  title={filename}
>
  This browser does not support PDFs. Please download the PDF to view it: <a href={pdfUrl}>Download PDF</a>.
</iframe>
        )}
      </div>

      {/* Localhost Notice */}
      <div className="absolute bottom-4 right-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">
        📍 Localhost PDF Viewer
      </div>
    </div>
  );
};

export default LocalPDFViewer;
