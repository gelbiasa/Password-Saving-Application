// filepath: c:\xampp\htdocs\Password-Saving-Application\resources\js\app.js
import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard';

// Setup CSRF token untuk Axios
window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

let token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}

// Render React App
if (document.getElementById('react-app')) {
    ReactDOM.render(<Dashboard />, document.getElementById('react-app'));
}