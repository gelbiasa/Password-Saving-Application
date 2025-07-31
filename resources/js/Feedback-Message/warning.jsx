import React, { useState, useEffect } from 'react';

const WarningMessage = ({ 
    message = "Apakah Anda yakin ingin melanjutkan?", 
    title = "Peringatan!", 
    isVisible = false, 
    onClose = () => {},
    onConfirm = null,
    confirmText = "Ya, Lanjutkan",
    cancelText = "Batal",
    autoClose = false,
    duration = 8000 
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

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        handleClose();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={handleClose}
            ></div>
            
            {/* Warning Card */}
            <div className="relative bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-yellow-500/20 border border-yellow-500/30 ring-1 ring-yellow-400/20 p-6 max-w-md w-full transform transition-all duration-500 animate-bounce-in">
                
                {/* Progress bar */}
                {autoClose && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 rounded-t-2xl overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 transition-all duration-100 ease-linear"
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
                    {/* Warning Icon */}
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30 animate-pulse">
                            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent mb-1">
                            {title}
                        </h3>
                        <p className="text-sm text-yellow-100/90 leading-relaxed">
                            {message}
                        </p>
                        
                        {/* Action buttons */}
                        <div className="mt-4 flex space-x-2">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-semibold rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-gray-500/25"
                            >
                                {cancelText}
                            </button>
                            {onConfirm && (
                                <button
                                    onClick={handleConfirm}
                                    className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-xs font-semibold rounded-lg hover:from-yellow-600 hover:to-amber-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-yellow-500/25"
                                >
                                    {confirmText}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400/30 rounded-full blur-sm"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-500/20 rounded-full blur-sm"></div>
            </div>
        </div>
    );
};

export default WarningMessage;