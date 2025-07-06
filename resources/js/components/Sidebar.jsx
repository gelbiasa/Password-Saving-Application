import React from 'react';

const Sidebar = () => {
    return (
        <aside className="bg-gray-800 text-white w-64 shadow-lg">
            <div className="p-4">
                <div className="mb-8">
                    <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold">A</span>
                        </div>
                        <div>
                            <p className="font-semibold">Admin User</p>
                            <p className="text-xs text-gray-400">admin@example.com</p>
                        </div>
                    </div>
                </div>
                
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg bg-blue-600 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                                </svg>
                                <span>Dashboard</span>
                            </a>
                        </li>
                        
                        <li>
                            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                                </svg>
                                <span>Passwords</span>
                                <span className="ml-auto bg-blue-600 text-xs px-2 py-1 rounded-full">25</span>
                            </a>
                        </li>
                        
                        <li>
                            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                <span>Import/Export</span>
                            </a>
                        </li>
                        
                        <li>
                            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
                                </svg>
                                <span>Settings</span>
                            </a>
                        </li>
                        
                        <li>
                            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                                </svg>
                                <span>Help & Support</span>
                            </a>
                        </li>
                    </ul>
                </nav>
                
                <div className="mt-8 p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-gray-300">System Status: </span>
                        <span className="text-green-400 font-semibold">Online</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;