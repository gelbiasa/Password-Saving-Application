import React from 'react';

const Sidebar = () => {
    return (
        <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
            <nav>
                <ul className="space-y-2">
                    <li>
                        <a href="#" className="block p-2 rounded hover:bg-gray-700">
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="#" className="block p-2 rounded hover:bg-gray-700">
                            Passwords
                        </a>
                    </li>
                    <li>
                        <a href="#" className="block p-2 rounded hover:bg-gray-700">
                            Settings
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;