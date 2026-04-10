#Estos son los comandos necesarios para desplegar el proyecto
#Hay que reconfigurar el env otra vez.

#npm i
#npm i bootstrap

#composer install
#php artisan migrate

#cp .env.example .env
#php artisan key:generate
#php artisan config:clear
------------------------------------------------------------------------------------

 Hellborn Fest

  Aplicación web para la gestión y visualización de conciertos, merchandising, tickets y usuarios del proyecto Hellborn Fest.

  El proyecto está dividido en dos partes:

  - `TFG/`: frontend en React servido desde Laravel
  - `hellborn_backend/`: API REST en Spring Boot para usuarios, merchandising y tickets

  ## Arquitectura

  ### Laravel + React (`TFG/`)

  Se encarga de:

  - servir la aplicación React
  - gestionar rutas web como `/filtro`
  - actuar como capa frontend principal
  - consumir la API de Spring Boot mediante variables de entorno

  Stack principal:

  - Laravel 12
  - PHP 8.4
  - React 19
  - Vite
  - React Router

  ### Spring Boot (`hellborn_backend/`)

  Se encarga de:

  - autenticación y registro de usuarios
  - gestión de roles de administrador
  - endpoints de merchandising
  - endpoints de tickets
  - acceso a base de datos MySQL

  Stack principal:

  - Java 21
  - Spring Boot 3.4
  - Spring Web
  - Spring Data JPA
  - MySQL
  - ModelMapper

  ## Estructura del proyecto

  ```text
  TFG/
  ├── README.md
  ├── package-lock.json
  ├── .vscode/
  │   └── settings.json
  ├── hellborn_backend/
  │   ├── pom.xml
  │   ├── mvnw
  │   ├── mvnw.cmd
  │   ├── .mvn/
  │   │   └── wrapper/
  │   │       └── maven-wrapper.properties
  │   └── src/
  │       ├── main/
  │       │   ├── java/com/example/hellborn_backend/
  │       │   │   ├── HellbornBackendApplication.java
  │       │   │   ├── config/
  │       │   │   │   └── CorsConfig.java
  │       │   │   ├── controller/
  │       │   │   │   ├── MerchandisingController.java
  │       │   │   │   ├── TipoEntradaController.java
  │       │   │   │   └── UsuarioController.java
  │       │   │   ├── DTO/
  │       │   │   ├── entity/
  │       │   │   ├── mapper/
  │       │   │   ├── repository/
  │       │   │   └── service/
  │       │   │       └── Impl/
  │       │   └── resources/
  │       │       └── application.properties
  │       └── test/
  │           └── java/com/example/hellborn_backend/
  │               └── HellbornBackendApplicationTests.java
  └── TFG/
      ├── artisan
      ├── composer.json
      ├── package.json
      ├── vite.config.js
      ├── api/
      │   └── index.php
      ├── app/
      │   ├── Http/Controllers/
      │   ├── Models/
      │   └── Providers/
      ├── config/
      ├── database/
      │   ├── factories/
      │   ├── migrations/
      │   └── seeders/
      ├── public/
      ├── resources/
      │   ├── css/
      │   ├── js/
      │   │   ├── app.jsx
      │   │   └── src/
      │   │       ├── App.jsx
      │   │       ├── Components/
      │   │       ├── Providers/
      │   │       ├── config/
      │   │       ├── INDEX/
      │   │       ├── ROUTE/
      │   │       ├── TIENDA/
      │   │       ├── TICKETS/
      │   │       ├── LOGIN/
      │   │       ├── ADMIN/
      │   │       └── USUARIO/
      │   └── views/
      │       └── app.blade.php
      ├── routes/
      ├── storage/
      └── tests/
          ├── Feature/
          └── Unit/
  ```

  ## Funcionalidades principales

  - listado y filtrado de conciertos
  - login y registro de usuarios
  - gestión de usuarios por administradores
  - catálogo de merchandising
  - gestión administrativa de merchandising
  - listado de tipos de entrada
  - consumo de APIs separadas para Laravel y Spring Boot

  ## Requisitos

  ### Para TFG/

  - PHP 8.4
  - Composer
  - Node.js
  - npm

  ### Para hellborn_backend/

  - Java 21
  - Maven o mvnw
  - MySQL

  ## Configuración local

  ## 1. Levantar Laravel + React

  Entrar en TFG/ y ejecutar:

  composer install
  npm install
  cp .env.example .env
  php artisan key:generate
  php artisan config:clear
  npm run build

  Si quieres entorno de desarrollo con Vite:

  composer run dev

  O por separado:

  php artisan serve
  npm run dev

  ## 2. Variables de entorno del frontend

  El frontend lee las URLs desde Vite.

  Archivo relevante:

  - resources/js/src/config/api.js

  Variables necesarias en TFG/.env:

  VITE_API_BASE_URL=http://127.0.0.1:8080
  VITE_ROUTE_API_BASE_URL=http://127.0.0.1:8000

  También funciona con localhost, pero conviene no mezclar localhost y 127.0.0.1 entre frontend y backend para evitar problemas de origen.

  ## 3. Levantar Spring Boot

  Entrar en hellborn_backend/ y configurar src/main/resources/application.properties.

  Ejemplo local:

  spring.application.name=hellborn_backend
  spring.datasource.url=jdbc:mysql://localhost:3306/hellborn
  spring.datasource.username=root
  spring.datasource.password=
  spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
  spring.jpa.hibernate.ddl-auto=update

  Arranque:

  bash mvnw spring-boot:run

  Tests:

  bash mvnw test

  ## Endpoints principales

  ### Laravel

  - GET /filtro

  ### Spring Boot

  Usuarios:

  - POST /usuario/login
  - POST /usuario/register
  - GET /usuario?idAdmin={id}
  - POST /usuario/admin
  - POST /usuario/admin/quitar

  Merchandising:

  - GET /merchandising/all
  - GET /merchandising/{tipo}
  - GET /merchandising/admin?idAdmin={id}
  - POST /merchandising/admin?idAdmin={id}
  - DELETE /merchandising/admin/{idMerch}?idAdmin={id}

  Tickets:

  - GET /ticket/tickets

  ## Producción

  Variables de entorno usadas por el frontend en producción:

  VITE_API_BASE_URL=https://lovely-creation-production-a868.up.railway.app
  VITE_ROUTE_API_BASE_URL=https://tfg-production-5282.up.railway.app

  Importante:

  - VITE_API_BASE_URL apunta al backend Spring Boot
  - VITE_ROUTE_API_BASE_URL apunta al servicio Laravel
  - si cambias variables VITE_, Laravel debe hacer redeploy para reconstruir el frontend
  - si cambias CORS del backend Spring, hay que redeployar hellborn_backend

  ## CORS

  La configuración actual está preparada para funcionar en:

  - http://127.0.0.1:8000
  - http://localhost:8000
  - http://127.0.0.1:5173
  - http://localhost:5173
  - https://tfg-production-5282.up.railway.app

  Esto permite que local y producción consuman correctamente la API sin bloquear peticiones por origen.

  ## Scripts útiles

  ### En TFG/

  composer run dev
  composer test
  npm run dev
  npm run build

  ### En hellborn_backend/

  bash mvnw spring-boot:run
  bash mvnw test

  ## Notas

  - Laravel sirve el frontend React y la ruta /filtro
  - Spring Boot centraliza usuarios, merchandising y tickets
  - si un endpoint funciona en navegador pero falla en fetch, revisa CORS del backend y el origen exacto de la petición
  - en local conviene usar siempre el mismo host, 127.0.0.1 o localhost, pero no ir alternando

  ## Estado actual

  Configurado para funcionar tanto en local como en producción con despliegue separado de:

  - TFG
  - hellborn_backend
