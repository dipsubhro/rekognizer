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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2 text-primary">
                    <Bot size={20} />
                    <h2 className="text-lg font-semibold">AI Description</h2>
                </div>
                <div className="pl-2 border-l-2 border-primary/50">
                    <p className="text-gray-200 leading-relaxed text-sm">
                        {results.description || "No description available."}
                    </p>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2 text-primary">
                    <Tag size={20} />
                    <h2 className="text-lg font-semibold">Detected Objects</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                    {results.labels && results.labels.map((label, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs"
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
