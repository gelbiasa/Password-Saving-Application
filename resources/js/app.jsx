import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './Components/App';

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error('Container element with id "app" not found');
}