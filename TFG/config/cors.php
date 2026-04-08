<?php

return [
    'paths' => [
        'filtro',
        'admin/*',
        'api/*',
        'sanctum/csrf-cookie',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:8000',
        'http://127.0.0.1:8000',
        'http://[::1]:8000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://[::1]:5173',
        'https://tfg-production-5282.up.railway.app',
    ],

    'allowed_origins_patterns' => [
        '#^http://(\[::1\]|localhost|127\.0\.0\.1):8000$#',
        '#^http://(\[::1\]|localhost|127\.0\.0\.1):5173$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];
