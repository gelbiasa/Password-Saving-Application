{{-- filepath: c:\xampp\htdocs\Password-Saving-Application\resources\views\Pages\ManagementPassword\KategoriPassword\index.blade.php --}}
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Kategori Password - Password Manager</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div id="react-app"></div>
    
    <script src="{{ mix('js/app.js') }}"></script>
    <script>
        // Mount React component for Kategori Password
        if (document.getElementById('react-app')) {
            const { createElement } = React;
            const { render } = ReactDOM;
            
            // Import dan render komponen KategoriPassword
            import('./resources/js/Pages/ManagementPassword/KategoriPassword/index.jsx')
                .then(module => {
                    render(createElement(module.default), document.getElementById('react-app'));
                });
        }
    </script>
</body>
</html>