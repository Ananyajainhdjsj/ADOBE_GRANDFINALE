import React from 'react';

export default function SearchResultsDialog({ results, onClose }) {
  if (!results) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4">Relevant PDF Snippets</h2>
        {results.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400">No relevant snippets found.</div>
        ) : (
          <ul className="space-y-4 max-h-96 overflow-y-auto">
            {results.map((item, idx) => (
              <li key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <div className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                  {item.doc_id ? `Document: ${item.doc_id}` : ''} {item.page_num !== undefined ? `Page: ${item.page_num}` : ''}
                </div>
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {item.text}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
