import React from 'react';

const Sidebar = () => {
    return (
        <aside className="bg-gray-900 text-white w-56 shadow-lg min-h-screen flex flex-col">
            <div className="p-3 flex-1">
                <div className="mb-6">
                    <div className="flex items-center space-x-2 p-2 bg-gray-800 rounded-lg">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold">A</span>
                        </div>
                        <div>
                            <p className="font-medium text-sm">Admin User</p>
                            <p className="text-xs text-gray-400">admin@example.com</p>
                        </div>
                    </div>
                </div>
                
                <nav className="flex-1">
                    <ul className="space-y-1">
                        <li>
                            <a href="#" className="flex items-center space-x-2 p-2 rounded-lg bg-indigo-600 transition-colors text-sm">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                                </svg>
                                <span>Dashboard</span>
                            </a>
                        </li>
                        
                        <li>
                            <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                                </svg>
                                <span>Kategori Password</span>
                                <span className="ml-auto bg-indigo-600 text-xs px-1.5 py-0.5 rounded-full">25</span>
                            </a>
                        </li>

                    </ul>
                </nav>
            </div>
            
            {/* System Status - Fixed at Bottom */}
            <div className="p-3">
                <div className="p-2 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-2 text-xs">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-gray-300">System Status: </span>
                        <span className="text-green-400 font-medium">Online</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;