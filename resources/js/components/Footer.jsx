import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-200 border-t border-gray-300 mt-auto">
            <div className="container mx-auto px-6 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-4 mb-2 md:mb-0">
                        <p className="text-gray-600 text-sm">
                            &copy; {currentYear} Password Manager. All rights reserved.
                        </p>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            <span>Secure Connection</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                            </svg>
                            <span>v1.0.0</span>
                        </div>
                        
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">Privacy Policy</a>
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;