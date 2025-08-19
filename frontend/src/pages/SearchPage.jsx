import React, { useState } from 'react';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [resultsCount, setResultsCount] = useState(5);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async () => {
    if (!query.trim()) {
      alert('Please enter a search query');
      return;
    }

    setLoading(true);
    setResults([]);
    setHasSearched(true);

    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        {
          score: 0.945,
          text_snippet: `Machine learning algorithms are computational methods that enable systems to automatically learn and improve from experience. The query "${query}" relates to fundamental concepts in supervised and unsupervised learning paradigms.`
        },
        {
          score: 0.892,
          text_snippet: `Deep learning represents a subset of machine learning that uses neural networks with multiple layers. Understanding "${query}" requires knowledge of backpropagation, gradient descent, and activation functions.`
        },
        {
          score: 0.834,
          text_snippet: `Statistical learning theory provides the mathematical foundation for understanding generalization in machine learning models. The concept of "${query}" is essential for model evaluation and selection.`
        },
        {
          score: 0.789,
          text_snippet: `Feature engineering and data preprocessing are crucial steps in the machine learning pipeline. When considering "${query}", it's important to understand data quality and feature selection techniques.`
        },
        {
          score: 0.723,
          text_snippet: `Cross-validation and model evaluation metrics help assess the performance of machine learning algorithms. The search for "${query}" should include understanding precision, recall, and F1-score metrics.`
        },
      ].slice(0, resultsCount);

      setResults(mockResults);
      setLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  return (
    <div className="adobe-section scroll-fade-up">
      <h2 className="text-gray-800 dark:text-white mb-8 text-3xl font-semibold">
        Semantic Search
      </h2>
      
      <div className="mb-8">
        <label htmlFor="search-query" className="block mb-3 font-medium text-gray-800 dark:text-white">
          Search Query:
        </label>
        <input
          type="text"
          id="search-query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your search query..."
          className="adobe-input"
        />
      </div>
      
      <div className="mb-8">
        <label htmlFor="search-results-count" className="block mb-3 font-medium text-gray-800 dark:text-white">
          Number of Results:
        </label>
        <select
          id="search-results-count"
          value={resultsCount}
          onChange={(e) => setResultsCount(parseInt(e.target.value))}
          className="adobe-input"
        >
          <option value="5">5 results</option>
          <option value="10">10 results</option>
          <option value="15">15 results</option>
        </select>
      </div>
      
      <button
        className="adobe-btn"
        onClick={performSearch}
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
      
      {loading && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 mt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-blue-600 font-medium">Searching documents...</div>
            <div className="text-sm text-gray-600 mt-2">Demo mode - simulating semantic search</div>
          </div>
        </div>
      )}

      {!loading && hasSearched && results.length === 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-5 mt-8">
          <div className="text-center text-yellow-700">
            <div className="font-semibold mb-2">No results found</div>
            <div className="text-sm">Try different keywords or check your spelling</div>
          </div>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-5 mt-8">
          <h3 className="text-green-600 mb-4 text-xl font-semibold">
            Search Results (Demo)
          </h3>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-gray-800">
                    Result {index + 1}
                  </div>
                  <div className="text-sm text-gray-600 bg-blue-100 px-2 py-1 rounded">
                    Score: {result.score.toFixed(3)}
                  </div>
                </div>
                <div className="text-gray-600 leading-relaxed">
                  {result.text_snippet}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <div className="text-sm text-blue-700">
              <strong>Note:</strong> This is a demonstration of semantic search results. 
              Connect to a real backend for actual document search functionality.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
