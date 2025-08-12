{{-- filepath: c:\xampp\htdocs\Password-Saving-Application\resources\views\Pages\dashboardAdmin.blade.php --}}
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Dashboard Admin - Password Manager</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * {
            font-family: 'Inter', sans-serif;
        }
    </style>
</head>
<body class="bg-gradient-to-br from-slate-100 via-blue-100 to-gray-100">
    <div id="react-app" class="min-h-screen">
        <!-- React Component akan di-render di sini -->
        <div class="flex items-center justify-center min-h-screen">
            <div class="text-center">
                <div class="mb-4">
                    <div class="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-spin mx-auto flex items-center justify-center">
                        <div class="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                </div>
                <h2 class="text-lg font-semibold text-gray-700">Memuat Dashboard Admin...</h2>
                <p class="text-gray-500 text-sm mt-1">Mohon tunggu sebentar</p>
            </div>
        </div>
    </div>

    <!-- Load React dan komponen JavaScript -->
    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>