import React from 'react';
import { Eye } from 'lucide-react';

const Header = () => {
    return (
        <header className="text-center mb-8 py-4">
            <div className="flex justify-center mb-2">
                <div className="flex items-center gap-2 text-primary text-3xl font-bold">
                    {/* <Eye size={36} /> */}
                    <h1>Rekognizer</h1>
                </div>
            </div>
            <p className="text-gray-400 text-sm sm:text-base">
                Simple AI Image Analyzer
            </p>
        </header>
    );
};

export default Header;
