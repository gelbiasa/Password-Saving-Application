import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './Pages/Dashboard';

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <Dashboard/>
        </React.StrictMode>
    );
} else {
    console.error('Container element with id "app" not found');
}