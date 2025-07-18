{{-- filepath: c:\xampp\htdocs\Password-Saving-Application\resources\views\Pages\ManagementPassword\KategoriPassword\index.blade.php --}}
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Kategori Password - Pengelola Password</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div id="react-app"></div>
    
    <script src="{{ mix('js/app.js') }}"></script>
</body>
</html>