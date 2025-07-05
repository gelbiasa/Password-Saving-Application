<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Password Manager')</title>
    <script src="https://cdn.tailwindcss.com"></script>
    @stack('styles')
</head>
<body class="bg-gray-100">
    <div class="min-h-screen flex flex-col">
        @include('Components.Layouts.Header')
        
        <div class="flex flex-1">
            @include('Components.Layouts.Sidebar')
            
            <main class="flex-1 p-6">
                @yield('content')
            </main>
        </div>
        
        @include('Components.Layouts.Footer')
    </div>
    
    @stack('scripts')
</body>
</html>