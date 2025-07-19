{{-- filepath: c:\xampp\htdocs\Password-Saving-Application\resources\views\Authentication\login.blade.php --}}
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Login - Password Manager</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 min-h-screen">
    <div id="react-app"></div>
    
    <script src="{{ mix('js/app.js') }}"></script>
</body>
</html>