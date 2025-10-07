import React, { useState } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import AnalysisResults from './components/AnalysisResults';
import { analyzeImage } from './services/api';
import { Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-black text-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Header />

        <main className="space-y-8">
          <ImageUpload onImageSelect={handleImageSelect} isAnalyzing={isLoading} />

          <AnalysisResults
            results={results}
            isLoading={isLoading}
            error={error}
          />
        </main>

        <footer className="mt-16 text-center text-gray-600 text-sm border-t border-gray-900 pt-8">
          <p>Simple AI Image Analyzer</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
