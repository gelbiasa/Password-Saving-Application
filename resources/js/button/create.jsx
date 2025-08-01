import React from 'react';

const CreateButton = ({ 
    onClick = () => {}, 
    text = "Tambah Data", 
    icon = "plus",
    size = "medium",
    disabled = false,
    loading = false,
    className = "",
    showText = true 
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
        plus: "M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z",
        add: "M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                relative overflow-hidden group
                bg-gradient-to-r from-gray-900 via-black to-green-900 
                hover:from-gray-800 hover:via-gray-900 hover:to-green-800
                text-green-100 font-semibold rounded-xl
                transition-all duration-300 transform hover:scale-105
                shadow-lg shadow-green-500/25 hover:shadow-green-500/40
                border border-green-500/30 hover:border-green-400/50
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                ${sizeClasses[size]} ${className}
            `}
        >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            
            {/* Content */}
            <div className="relative flex items-center justify-center space-x-2">
                {loading ? (
                    <svg className={`animate-spin ${iconSizes[size]} text-green-400`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg className={`${iconSizes[size]} text-green-400 group-hover:text-green-300 transition-colors duration-300`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d={iconPaths[icon]} clipRule="evenodd"></path>
                    </svg>
                )}
                
                {showText && (
                    <span className="group-hover:text-green-200 transition-colors duration-300">
                        {loading ? "Memproses..." : text}
                    </span>
                )}
            </div>

            {/* Decorative dots */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-green-500/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse delay-150"></div>
        </button>
    );
};

export default CreateButton;