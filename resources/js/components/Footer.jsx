import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="absolute bottom-4 left-6 right-6 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg max-w-5xl mx-auto">
            <div className="px-4 py-2">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-4 mb-1 md:mb-0">
                        <p className="text-gray-600 text-xs">
                            &copy; {currentYear} Password Manager. All rights reserved.
                        </p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            <span>Secure Connection</span>
                        </div>
                        
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                            </svg>
                            <span>v1.0.0</span>
                        </div>
                        
                        <a href="#" className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors">Privacy Policy</a>
                        <a href="#" className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;