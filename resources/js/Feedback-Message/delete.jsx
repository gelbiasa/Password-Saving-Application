import React, { useState, useEffect } from 'react';

const DeleteMessage = ({ 
    message = "Data yang dihapus tidak dapat dikembalikan!", 
    title = "Konfirmasi Hapus", 
    itemName = "item ini",
    isVisible = false, 
    onClose = () => {},
    onConfirm = null,
    autoClose = false,
    duration = 10000 
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
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            ></div>
            
            {/* Delete Card */}
            <div className="relative bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-red-500/30 border border-red-500/40 ring-1 ring-red-400/30 p-6 max-w-md w-full transform transition-all duration-500 animate-shake">
                
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
                    {/* Delete Icon */}
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-lg shadow-red-500/40 animate-pulse">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"></path>
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent mb-1">
                            {title}
                        </h3>
                        <p className="text-sm text-red-100/90 leading-relaxed mb-3">
                            Apakah Anda yakin ingin menghapus <span className="font-semibold text-red-200">"{itemName}"</span>?
                        </p>
                        
                        {/* Warning box */}
                        <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg p-3 border border-red-500/30 mb-4">
                            <div className="flex items-start space-x-2">
                                <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                </svg>
                                <p className="text-xs text-red-200/90 leading-relaxed">
                                    <span className="font-semibold">Peringatan:</span> {message}
                                </p>
                            </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex space-x-2">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-semibold rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-gray-500/25 flex-1"
                            >
                                Batal
                            </button>
                            {onConfirm && (
                                <button
                                    onClick={handleConfirm}
                                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/30 flex-1"
                                >
                                    Ya, Hapus
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-400/40 rounded-full blur-sm"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500/30 rounded-full blur-sm"></div>
            </div>
        </div>
    );
};

export default DeleteMessage;