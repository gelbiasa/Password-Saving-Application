import React from 'react';

const DeleteButton = ({ 
    onClick = () => {}, 
    text = "Hapus Data", 
    icon = "trash",
    size = "medium",
    disabled = false,
    loading = false,
    className = "",
    showText = true,
    confirmDelete = false 
}) => {
    const sizeClasses = {
        small: "px-3 py-2 text-xs",
        medium: "px-4 py-3 text-sm",
        large: "px-6 py-4 text-base"
    };

    const iconSizes = {
        small: "w-3 h-3",
        medium: "w-4 h-4", 
        large: "w-5 h-5"
    };

    const iconPaths = {
        trash: "M9 2a1 1 0 000 2h2a1 1 0 100-2H9z M4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM5.5 8a.5.5 0 01.5.5v6a.5.5 0 01-1 0v-6a.5.5 0 01.5-.5zm3 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0v-6a.5.5 0 01.5-.5zm3 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0v-6a.5.5 0 01.5-.5z",
        delete: "M8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
    };

    const handleClick = () => {
        if (confirmDelete) {
            if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                onClick();
            }
        } else {
            onClick();
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled || loading}
            className={`
                relative overflow-hidden group
                bg-gradient-to-r from-slate-100 via-gray-200 to-red-100 
                hover:from-slate-200 hover:via-gray-300 hover:to-red-200
                text-red-700 font-semibold rounded-xl
                transition-all duration-300 transform hover:scale-105
                shadow-lg shadow-red-500/25 hover:shadow-red-500/40
                border border-red-300 hover:border-red-400
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                hover:animate-pulse
                ${sizeClasses[size]} ${className}
            `}
        >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-200/60 to-red-200/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Danger shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300/50 to-red-300/60 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            
            {/* Content */}
            <div className="relative flex items-center justify-center space-x-2">
                {loading ? (
                    <svg className={`animate-spin ${iconSizes[size]} text-red-600`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg className={`${iconSizes[size]} text-red-600 group-hover:text-red-700 transition-colors duration-300`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d={iconPaths[icon]} clipRule="evenodd"></path>
                    </svg>
                )}
                
                {showText && (
                    <span className="group-hover:text-red-800 transition-colors duration-300">
                        {loading ? "Menghapus..." : text}
                    </span>
                )}
            </div>

            {/* Warning decorative dots */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-slate-400/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping delay-150"></div>
        </button>
    );
};

export default DeleteButton;