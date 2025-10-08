import React, { useState } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import AnalysisResults from './components/AnalysisResults';
import { analyzeImage } from './services/api';
//import { Sparkles } from 'lucide-react';

function App() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageSelect = async (base64Data) => {
    if (!base64Data) {
      setResults(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Extract base64 content (remove data:image/jpeg;base64, prefix)
      const base64Content = base64Data.split(',')[1];
      const data = await analyzeImage(base64Content);
      setResults(data);
    } catch (err) {
      setError(err.message || "Failed to analyze image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-black text-gray-100 overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
        <Header />
      </div>

      <main className="h-full w-full">
        <ImageUpload onImageSelect={handleImageSelect} isAnalyzing={isLoading} />

        {/* Results Overlay */}
        {(results || isLoading || error) && (
          <div className="absolute bottom-0 left-0 right-0 z-40 max-h-[80vh] overflow-y-auto bg-black/90 border-t border-primary/30 backdrop-blur-sm rounded-t-3xl p-6 transition-transform duration-300 ease-in-out">
            <AnalysisResults
              results={results}
              isLoading={isLoading}
              error={error}
            />
            <button
              onClick={() => {
                setResults(null);
                setError(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
