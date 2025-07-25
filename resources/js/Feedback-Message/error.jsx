import React, { useState, useEffect } from 'react';

const ErrorMessage = ({ 
    message = "Terjadi kesalahan!", 
    title = "Error!", 
    isVisible = false, 
    onClose = () => {},
    onRetry = null,
    autoClose = false,
    duration = 6000 
}) => {
    const [show, setShow] = useState(isVisible);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        setShow(isVisible);
        if (isVisible && autoClose) {
            setProgress(100);
            
            // Progress bar animation
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev <= 0) {
                        clearInterval(progressInterval);
                        return 0;
                    }
                    return prev - (100 / (duration / 100));
                });
            }, 100);

            // Auto close
            const closeTimer = setTimeout(() => {
                setShow(false);
                onClose();
            }, duration);

            return () => {
                clearInterval(progressInterval);
                clearTimeout(closeTimer);
            };
        }
    }, [isVisible, autoClose, duration, onClose]);

    const handleClose = () => {
        setShow(false);
        onClose();
    };

    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        }
        handleClose();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                onClick={handleClose}
            ></div>
            
            {/* Error Card */}
            <div className="relative bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-red-500/20 border border-red-500/30 ring-1 ring-red-400/20 p-6 max-w-md w-full transform transition-all duration-500 animate-shake">
                
                {/* Progress bar */}
                {autoClose && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 rounded-t-2xl overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-red-400 via-red-500 to-red-600 transition-all duration-100 ease-linear"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}

                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-1 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-200 group"
                >
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                </button>

                <div className="flex items-start space-x-4">
                    {/* Error Icon */}
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent mb-1">
                            {title}
                        </h3>
                        <p className="text-sm text-red-100/90 leading-relaxed">
                            {message}
                        </p>
                        
                        {/* Action buttons */}
                        <div className="mt-4 flex space-x-2">
                            {onRetry && (
                                <button
                                    onClick={handleRetry}
                                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-xs font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-amber-500/25"
                                >
                                    Coba Lagi
                                </button>
                            )}
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/25"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-400/30 rounded-full blur-sm"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500/20 rounded-full blur-sm"></div>
            </div>
        </div>
    );
};

export default ErrorMessage;