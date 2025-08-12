import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './Pages/Dashboard';
import DashboardAdmin from './Pages/DashboardAdmin'; // ✅ Import DashboardAdmin
import KategoriPasswordIndex from './Pages/ManagementPassword/KategoriPassword/index';
import DetailPasswordIndex from './Pages/ManagementPassword/DetailPassword/index';
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

// ✅ Function untuk check hak akses dan redirect ke dashboard yang sesuai
const checkAccessAndRedirect = async () => {
    try {
        const response = await window.axios.get('/api/current-user');
        if (response.data.success && response.data.data.hak_akses) {
            const hakAksesKode = response.data.data.hak_akses.kode;
            
            // Redirect berdasarkan hak akses
            if (hakAksesKode === 'ADM') {
                // Admin -> Dashboard Admin
                ReactDOM.render(<DashboardAdmin />, document.getElementById('react-app'));
            } else if (hakAksesKode === 'PGN') {
                // Pengguna -> Dashboard Biasa
                ReactDOM.render(<Dashboard />, document.getElementById('react-app'));
            } else {
                // Hak akses tidak dikenali, redirect ke login
                console.warn('Hak akses tidak dikenali:', hakAksesKode);
                window.location.href = '/login';
            }
        } else {
            // Tidak ada hak akses, redirect ke login
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Error checking user access:', error);
        // Error, redirect ke login
        window.location.href = '/login';
    }
};

// ✅ Function untuk check admin access
const checkAdminAccess = async () => {
    try {
        const response = await window.axios.get('/api/current-user');
        if (response.data.success && response.data.data.hak_akses) {
            const hakAksesKode = response.data.data.hak_akses.kode;
            
            if (hakAksesKode !== 'ADM') {
                // Bukan admin, redirect ke dashboard biasa
                window.location.href = '/dashboard';
                return false;
            }
            return true;
        } else {
            window.location.href = '/login';
            return false;
        }
    } catch (error) {
        console.error('Error checking admin access:', error);
        window.location.href = '/login';
        return false;
    }
};

// Render React App berdasarkan halaman
if (document.getElementById('react-app')) {
    const currentPath = window.location.pathname;

    switch (currentPath) {
        case '/login':
            ReactDOM.render(<Login />, document.getElementById('react-app'));
            break;
        case '/pilih-level':
            ReactDOM.render(<PilihLevel />, document.getElementById('react-app'));
            break;
        case '/dashboard':
            // ✅ Dashboard dengan logic routing berdasarkan hak akses
            checkAccessAndRedirect();
            break;
        case '/dashboard-admin':
            // ✅ Dashboard Admin - hanya untuk admin
            checkAdminAccess().then(isAdmin => {
                if (isAdmin) {
                    ReactDOM.render(<DashboardAdmin />, document.getElementById('react-app'));
                }
            });
            break;
        case '/kategori-password':
            ReactDOM.render(<KategoriPasswordIndex />, document.getElementById('react-app'));
            break;
        case '/detail-password':
            ReactDOM.render(<DetailPasswordIndex />, document.getElementById('react-app'));
            break;
        default:
            // Redirect ke login jika halaman tidak dikenali
            window.location.href = '/login';
    }
}