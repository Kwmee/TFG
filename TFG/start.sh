#!/bin/sh

# Limpiar caché de Laravel
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Forzar lectura del .env y cachear config
php artisan config:cache
php artisan route:cache

# Ejecutar migraciones en producción (opcional)
php artisan migrate --force

# Iniciar PHP-FPM (Laravel servirá las requests)
php-fpm