import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-8 mb-6 bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl border border-amber-500/20 ring-1 ring-amber-400/10 rounded-2xl shadow-2xl shadow-black/50 max-w-5xl mx-auto">
            <div className="px-4 md:px-6 py-4">
                <div className="flex flex-col lg:flex-row justify-between items-center space-y-3 lg:space-y-0">
                    {/* Copyright Section */}
                    <div className="flex items-center space-x-4">
                        <p className="text-amber-200/80 text-sm font-medium text-center lg:text-left">
                            &copy; {currentYear} Password Manager. All rights reserved.
                        </p>
                    </div>
                    
                    {/* Status and Links Section */}
                    <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6">
                        {/* Connection Status */}
                        <div className="flex items-center space-x-2 text-sm text-amber-300/80">
                            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg shadow-green-500/30 animate-pulse"></div>
                            <span className="font-medium">Secure Connection</span>
                        </div>
                        
                        {/* Version */}
                        <div className="flex items-center space-x-2 text-sm text-amber-300/80">
                            <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                            </svg>
                            <span className="font-medium">v1.0.0</span>
                        </div>
                        
                        {/* Links */}
                        <div className="flex items-center space-x-3">
                            <a href="#" className="text-sm text-amber-400 hover:text-amber-300 transition-colors duration-200 font-medium hover:underline">
                                Privacy Policy
                            </a>
                            <span className="text-amber-500/50 hidden sm:inline">|</span>
                            <a href="#" className="text-sm text-amber-400 hover:text-amber-300 transition-colors duration-200 font-medium hover:underline">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;