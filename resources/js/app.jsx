import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './Pages/Dashboard';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<Dashboard />);