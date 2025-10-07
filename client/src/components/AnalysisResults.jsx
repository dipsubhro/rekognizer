import React from 'react';
import { Bot, Tag, Loader2 } from 'lucide-react';

const AnalysisResults = ({ results, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="w-full max-w-xl mx-auto text-center py-8">
                <Loader2 className="animate-spin text-primary mx-auto mb-4" size={48} />
                <p className="text-gray-400">Analyzing image...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-xl mx-auto p-4 bg-primary/10 border border-primary/50 rounded-lg text-primary text-center">
                <p>{error}</p>
            </div>
        );
    }

    if (!results) return null;

    return (
        <div className="w-full max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-surface border border-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4 text-primary">
                    <Bot size={24} />
                    <h2 className="text-xl font-semibold">AI Description</h2>
                </div>
                <div className="bg-black/50 border-l-4 border-primary p-4 rounded-r">
                    <p className="text-gray-300 leading-relaxed">
                        {results.description || "No description available."}
                    </p>
                </div>
            </div>

            <div className="bg-surface border border-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4 text-primary">
                    <Tag size={24} />
                    <h2 className="text-xl font-semibold">Detected Objects</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                    {results.labels && results.labels.map((label, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm"
                        >
                            {label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalysisResults;
