import React from 'react';

const ShowButton = ({ 
    onClick = () => {}, 
    text = "Lihat Detail", 
    icon = "eye",
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
        eye: "M10 12a2 2 0 100-4 2 2 0 000 4z M10 3C6 3 2.73 5.11 1.18 8.5a1.5 1.5 0 000 3C2.73 14.89 6 17 10 17s7.27-2.11 8.82-5.5a1.5 1.5 0 000-3C17.27 5.11 14 3 10 3z",
        view: "M10 3C6 3 2.73 5.11 1.18 8.5a1.5 1.5 0 000 3C2.73 14.89 6 17 10 17s7.27-2.11 8.82-5.5a1.5 1.5 0 000-3C17.27 5.11 14 3 10 3z"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                relative overflow-hidden group
                bg-gradient-to-r from-slate-100 via-gray-200 to-blue-100 
                hover:from-slate-200 hover:via-gray-300 hover:to-blue-200
                text-blue-700 font-semibold rounded-xl
                transition-all duration-300 transform hover:scale-105
                shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40
                border border-blue-300 hover:border-blue-400
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                ${sizeClasses[size]} ${className}
            `}
        >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-200/60 to-blue-200/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300/50 to-blue-300/50 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            
            {/* Content */}
            <div className="relative flex items-center justify-center space-x-2">
                {loading ? (
                    <svg className={`animate-spin ${iconSizes[size]} text-blue-600`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg className={`${iconSizes[size]} text-blue-600 group-hover:text-blue-700 transition-colors duration-300`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d={iconPaths[icon]} clipRule="evenodd"></path>
                    </svg>
                )}
                
                {showText && (
                    <span className="group-hover:text-blue-800 transition-colors duration-300">
                        {loading ? "Memuat..." : text}
                    </span>
                )}
            </div>

            {/* Decorative dots */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-slate-400/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse delay-150"></div>
        </button>
    );
};

export default ShowButton;