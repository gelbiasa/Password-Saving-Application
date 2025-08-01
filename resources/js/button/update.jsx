import React from 'react';

const UpdateButton = ({ 
    onClick = () => {}, 
    text = "Edit Data", 
    icon = "edit",
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
        edit: "M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z",
        pencil: "M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                relative overflow-hidden group
                bg-gradient-to-r from-slate-100 via-gray-200 to-orange-100 
                hover:from-slate-200 hover:via-gray-300 hover:to-orange-200
                text-orange-700 font-semibold rounded-xl
                transition-all duration-300 transform hover:scale-105
                shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40
                border border-orange-300 hover:border-orange-400
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                ${sizeClasses[size]} ${className}
            `}
        >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-200/60 to-orange-200/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300/50 to-orange-300/50 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            
            {/* Content */}
            <div className="relative flex items-center justify-center space-x-2">
                {loading ? (
                    <svg className={`animate-spin ${iconSizes[size]} text-orange-600`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg className={`${iconSizes[size]} text-orange-600 group-hover:text-orange-700 transition-colors duration-300`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d={iconPaths[icon]} clipRule="evenodd"></path>
                    </svg>
                )}
                
                {showText && (
                    <span className="group-hover:text-orange-800 transition-colors duration-300">
                        {loading ? "Memproses..." : text}
                    </span>
                )}
            </div>

            {/* Decorative dots */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-slate-400/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse delay-150"></div>
        </button>
    );
};

export default UpdateButton;