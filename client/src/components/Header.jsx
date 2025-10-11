import React from 'react';
import { Eye } from 'lucide-react';

const Header = () => {
    return (
        <header className="text-center py-6 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex justify-center mb-1">
                <div className="flex items-center gap-3 text-primary text-2xl font-bold drop-shadow-md">
                    <img src="/rekognizer-logo.png" alt="Rekognizer Logo" className="w-10 h-10 object-contain" />
                    <h1>Rekognizer</h1>
                </div>
            </div>
            <p className="text-gray-300 text-xs drop-shadow-md">
                Simple AI Image Analyzer
            </p>
        </header>
    );
};

export default Header;
