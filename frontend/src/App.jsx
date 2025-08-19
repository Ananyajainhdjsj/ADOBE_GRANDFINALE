
import React, { useState, useRef } from 'react';

import Navbar from './components/Navbar';
import UploadPage from './pages/UploadPage';
import ViewerPage from './pages/ViewerPage';
import PersonaAnalysisPage from './pages/PersonaAnalysisPage';
import GeminiPDFQA from './pages/GeminiPDFQA';
import RAGInsightsPage from './pages/RAGInsightsPage';
import Home from './pages/Home';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const uploadSectionRef = useRef(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleNavigateToUpload = () => {
    setActiveTab('upload');
  };

  // Handles logic for Upload PDF button in navbar
  const handleUploadButton = () => {
    if (activeTab !== 'upload') {
      setActiveTab('upload');
      // Wait for tab switch and then scroll
      setTimeout(() => {
        uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'upload':
        return <UploadPage uploadSectionRef={uploadSectionRef} />;
      case 'viewer':
        return <ViewerPage onNavigateToUpload={handleNavigateToUpload} />;
      case 'persona':
        return <PersonaAnalysisPage />;
      case 'gemini':
        return <GeminiPDFQA />;
      case 'rag':
        return <RAGInsightsPage />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-black text-gray-900 dark:text-white">
      <div className="min-h-screen">
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onUploadScroll={handleUploadButton}
        />
        {/* Main Content */}
        <main className={activeTab === 'upload' ? 'w-full' : (activeTab === 'persona' ? 'w-full px-6 py-5' : ' mx-auto px-6 py-5')}>
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

export default App;
