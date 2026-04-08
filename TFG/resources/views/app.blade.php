<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>App</title>
    <link rel="preload" as="image" href="/logo.webp" />


    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>

<body>
    <div id="app"></div>
</body>

</html>
