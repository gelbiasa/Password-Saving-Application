import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './Pages/Dashboard';
import KategoriPasswordIndex from './Pages/ManagementPassword/KategoriPassword/index';
import Login from './Authentication/login';
import PilihLevel from './Authentication/pilih-level';

// Setup global React dan ReactDOM
window.React = React;
window.ReactDOM = ReactDOM;

// Setup CSRF token untuk Axios
window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

let token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('Token CSRF tidak ditemukan: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// Render React App berdasarkan halaman
if (document.getElementById('react-app')) {
    const currentPath = window.location.pathname;
    
    switch(currentPath) {
        case '/login':
            ReactDOM.render(<Login />, document.getElementById('react-app'));
            break;
        case '/pilih-level':
            ReactDOM.render(<PilihLevel />, document.getElementById('react-app'));
            break;
        case '/dashboard':
            ReactDOM.render(<Dashboard />, document.getElementById('react-app'));
            break;
        case '/kategori-password':
            ReactDOM.render(<KategoriPasswordIndex />, document.getElementById('react-app'));
            break;
        default:
            // Redirect ke login jika halaman tidak dikenali
            window.location.href = '/login';
    }
}