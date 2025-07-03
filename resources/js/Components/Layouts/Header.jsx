import React from 'react';

const Header = () => {
    return (
        <header className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Password Manager</h1>
                <nav>
                    <button className="bg-blue-700 px-4 py-2 rounded">Logout</button>
                </nav>
            </div>
        </header>
    );
};

export default Header;