<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/PHP-8.1+-777BB4?style=for-the-badge&logo=php&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/PWA-Offline_Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" />
</p>

<h1 align="center">Sistema de Gestion de Prestamos de Activos NFC/QR</h1>

<p align="center">
  <strong>JoAnJe Coders</strong> — Plataforma full-stack para la gestion, seguimiento y prestamo de activos institucionales mediante tecnologia NFC y codigos QR.
</p>

<p align="center">
  <a href="#-inicio-rapido">Inicio Rapido</a> &bull;
  <a href="#-arquitectura">Arquitectura</a> &bull;
  <a href="#-configuracion-de-red--ip">Configuracion de Red</a> &bull;
  <a href="#-estructura-del-proyecto">Estructura</a> &bull;
  <a href="#-funcionalidades-principales">Funcionalidades</a>
</p>

---

## Descripcion General

Sistema integral que permite a organizaciones gestionar el ciclo de vida completo de sus activos fisicos:

- **Registro y catalogacion** de activos con codigos QR y etiquetas NFC
- **Prestamos instantaneos** mediante escaneo — sin papeleo
- **Monitoreo en tiempo real** de quien tiene cada equipo (WebSockets con Pusher)
- **Sistema de sanciones automatico** por perdidas o retrasos
- **Auditoria completa** con descripciones en lenguaje natural
- **Notificaciones en tiempo real** y por correo electronico
- **Reportes exportables** a Excel con graficos interactivos
- **PWA** — funciona offline y es instalable en dispositivos moviles

---

## Stack Tecnologico

| Capa | Tecnologias |
|------|-------------|
| **Frontend** | React 18, Vite 5, React Router DOM 7, Chart.js, Leaflet, QRCode.react, Pusher.js |
| **Backend** | PHP 8.1+ (nativo, sin frameworks), JWT (firebase/php-jwt), PHPMailer, Pusher PHP |
| **Base de Datos** | MySQL 8.0 — 11 tablas, 54+ Stored Procedures, triggers de auditoria automatica |
| **Infraestructura** | PWA con Workbox, CORS configurable, deploy-ready para Railway |

---

## Requisitos Previos

Antes de comenzar, asegurate de tener instalado:

| Herramienta | Version Minima | Descarga |
|-------------|---------------|----------|
| **PHP** | 8.1+ | [php.net](https://www.php.net/downloads) |
| **Composer** | 2.x | [getcomposer.org](https://getcomposer.org/download/) |
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) |
| **MySQL** | 8.0+ | [mysql.com](https://dev.mysql.com/downloads/) |
| **Git** | 2.x | [git-scm.com](https://git-scm.com/) |

> **Recomendado en Windows:** Usar [Laragon](https://laragon.org/) como entorno de desarrollo — incluye PHP, MySQL, Apache y gestor de virtual hosts automatico.

---

## Inicio Rapido

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/Proyecto_Activos_JoAnJe.git
cd Proyecto_Activos_JoAnJe
```

### 2. Configurar el Backend

```bash
cd backend

# Instalar dependencias PHP
composer install

# Crear archivo de entorno
cp .env.example .env
```

Edita `backend/.env` con tus credenciales:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gestion_activos_jja
DB_USER=root
DB_PASS=tu_contraseña

# JWT — cambia esto por un string seguro y unico
JWT_SECRET=tu_clave_secreta_segura_de_256_bits
JWT_EXPIRA_HORAS=2

# CORS — debe coincidir con la URL del frontend
CORS_ORIGIN=http://localhost:5173

# Correo (Gmail con App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=tu_app_password
SMTP_SECURE=ssl
MAIL_FROM=tu_correo@gmail.com
MAIL_NAME="JoAnJe Coders"

# Pusher (opcional — para notificaciones en tiempo real)
PUSHER_APP_ID=tu_app_id
PUSHER_APP_KEY=tu_app_key
PUSHER_APP_SECRET=tu_app_secret
PUSHER_APP_CLUSTER=mt1
```

### 3. Inicializar la Base de Datos

Asegurate de que MySQL este corriendo, luego ejecuta:

```bash
php crear.php
```

> Esto crea la base de datos `gestion_activos_jja`, todas las tablas, 54+ stored procedures y los triggers de auditoria. Si la base ya existe, la reconstruye desde cero.

### 4. Iniciar el servidor Backend

```bash
php -S localhost:8000
```

El API estara disponible en `http://localhost:8000/api/v1/`

### 5. Configurar el Frontend

Abre otra terminal:

```bash
cd frontend

# Instalar dependencias
npm install

# Crear archivo de entorno
cp .env.example .env
```

Edita `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api/v1

# Pusher (mismas credenciales que en backend/.env)
VITE_PUSHER_KEY=tu_app_key
VITE_PUSHER_CLUSTER=mt1
```

### 6. Iniciar el servidor Frontend

```bash
npm run dev
```

Abre tu navegador en **http://localhost:5173** — el sistema esta listo.

---

## Configuracion de Red / IP

> **Importante:** Si necesitas acceder al sistema desde otros dispositivos en tu red local (celulares, tablets, otras PCs), debes ajustar las URLs de la API para que apunten a la IP de tu maquina en lugar de `localhost`.

### Paso 1 — Obtener tu IP local

```bash
# Windows
ipconfig
# Busca "IPv4 Address" en tu adaptador de red activo (ej: 192.168.1.100)

# Linux / macOS
ip addr show   # o ifconfig
```

### Paso 2 — Actualizar el Backend

En **`backend/.env`**, cambia `CORS_ORIGIN` para permitir conexiones desde tu IP:

```env
# Antes (solo local)
CORS_ORIGIN=http://localhost:5173

# Despues (acceso en red local) — usa TU IP
CORS_ORIGIN=http://192.168.1.100:5173
```

Inicia el backend escuchando en todas las interfaces:

```bash
# En lugar de localhost, usa 0.0.0.0
php -S 0.0.0.0:8000
```

### Paso 3 — Actualizar el Frontend

En **`frontend/.env`**, apunta la API a tu IP:

```env
# Antes (solo local)
VITE_API_URL=http://localhost:8000/api/v1

# Despues (acceso en red local) — usa TU IP
VITE_API_URL=http://192.168.1.100:8000/api/v1
```

> Reinicia ambos servidores despues de cambiar los archivos `.env`.

### Paso 4 — Acceder desde otros dispositivos

Desde cualquier dispositivo conectado a la misma red Wi-Fi/LAN:

```
http://192.168.1.100:5173
```

### Resumen de archivos a modificar

| Archivo | Variable | Que cambiar |
|---------|----------|-------------|
| `backend/.env` | `CORS_ORIGIN` | URL del frontend con tu IP |
| `frontend/.env` | `VITE_API_URL` | URL del backend con tu IP |

> **Nota:** Cada vez que tu IP local cambie (al reiniciar el router, cambiar de red, etc.), deberas actualizar estos valores.

---

## Estructura del Proyecto

```
Proyecto_Activos_JoAnJe/
├── backend/
│   ├── Core/                  # Clases base (Database, Controller, Model, Middleware)
│   ├── controllers/           # Controladores REST por recurso
│   ├── models/                # Modelos — llaman Stored Procedures via PDO
│   ├── services/              # Servicios auxiliares (Pusher, Email)
│   ├── crear.php              # Script de inicializacion de BD completo
│   ├── index.php              # Punto de entrada — dispatcher de rutas REST
│   ├── composer.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes reutilizables (auth, layout, UI, sistema)
│   │   ├── context/           # React Context (Auth, Theme, Toast, Notification)
│   │   ├── pages/             # Paginas organizadas por rol (admin/, encargado/, cliente/)
│   │   ├── utils/             # Utilidades (api.js, helpers)
│   │   ├── App.jsx            # Router principal + layout selector
│   │   ├── main.jsx           # Punto de entrada React
│   │   └── estilos.css        # Estilos globales (Vanilla CSS)
│   ├── public/                # Assets estaticos y manifest PWA
│   ├── package.json
│   └── .env.example
├── docs/                      # Documentacion del proyecto
└── README.md
```

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React SPA)                     │
│  React 18 + Vite 5 + React Router 7 + PWA (Workbox)           │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌──────────────┐  │
│  │  Pages   │  │ Context  │  │Components │  │   Utils      │  │
│  │ by Role  │  │Auth/Theme│  │Layout/UI  │  │ apiRequest() │  │
│  └────┬─────┘  └────┬─────┘  └───────────┘  └──────┬───────┘  │
│       │              │                              │          │
│       └──────────────┴──────────────────────────────┘          │
│                        │ HTTP + JWT Bearer                     │
└────────────────────────┼───────────────────────────────────────┘
                         │
                   ┌─────▼─────┐
                   │   CORS    │
                   └─────┬─────┘
                         │
┌────────────────────────┼───────────────────────────────────────┐
│                  BACKEND (PHP REST API)                         │
│  ┌─────────┐   ┌──────▼──────┐   ┌────────────┐               │
│  │  index   │──▶│ Middleware  │──▶│ Controller │               │
│  │  .php    │   │JWT + RBAC  │   │  _jja.php  │               │
│  └─────────┘   └─────────────┘   └─────┬──────┘               │
│                                        │                       │
│                                  ┌─────▼──────┐               │
│                                  │   Model    │               │
│                                  │  _jja.php  │               │
│                                  └─────┬──────┘               │
│                                        │ PDO                   │
└────────────────────────────────────────┼───────────────────────┘
                                         │
┌────────────────────────────────────────┼───────────────────────┐
│                      MySQL 8.0                                  │
│  ┌──────────┐  ┌──────────────────┐  ┌──────────┐             │
│  │ 11 Tables│  │54+ Stored Procs  │  │ Triggers │             │
│  │          │  │(Business Logic)  │  │(Auditoria│             │
│  │          │  │                  │  │Automatica)│             │
│  └──────────┘  └──────────────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Funcionalidades Principales

### Roles del Sistema (RBAC de 3 niveles)

| Rol | Acceso |
|-----|--------|
| **Administrador** | Gestion completa — inventario, usuarios, reportes, auditoria, sanciones |
| **Encargado** | Escaneo QR/NFC para checkout/devolucion, reportes limitados |
| **Cliente** | Marketplace de activos, solicitudes de prestamo, historial propio |

### Endpoints de la API

```
BASE: /api/v1

POST   /auth/login                    # Iniciar sesion
POST   /auth/registro                 # Registro de usuario
POST   /auth/recuperar                # Recuperar contraseña por email

GET    /activos                       # Listar activos
GET    /activos/qr/{codigo}           # Buscar activo por QR
GET    /activos/nfc/{codigo}          # Buscar activo por NFC

GET    /prestamos                     # Listar prestamos
POST   /prestamos/checkout            # Registrar prestamo (escaneo)
POST   /prestamos/{id}/devolver       # Registrar devolucion
POST   /prestamos/{id}/perdido        # Marcar como perdido

GET    /usuarios                      # Listar usuarios
GET    /sanciones                     # Listar sanciones
GET    /notificaciones                # Listar notificaciones
GET    /reportes                      # Reportes y estadisticas
GET    /auditoria                     # Log de auditoria completo
```

### Flujo de Prestamo

```
Encargado escanea QR/NFC
        │
        ▼
   Identifica activo ──▶ Valida disponibilidad
        │                       │
        ▼                       ▼
   Identifica cliente ──▶ Valida: sin sanciones,
        │                  bajo limite de prestamos
        ▼
   POST /prestamos/checkout
        │
        ▼
   SP registra prestamo + notifica cliente
        │
        ▼
   Devolucion ──▶ POST /prestamos/{id}/devolver
   Perdida    ──▶ POST /prestamos/{id}/perdido (genera sancion)
```

---

## Scripts Disponibles

### Frontend

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo en `http://localhost:5173` |
| `npm run build` | Build de produccion en `frontend/dist/` |
| `npm run preview` | Preview del build de produccion |

### Backend

| Comando | Descripcion |
|---------|-------------|
| `composer install` | Instalar dependencias PHP |
| `php crear.php` | Inicializar / reconstruir base de datos completa |
| `php -S localhost:8000` | Servidor de desarrollo PHP |

---

## Despliegue en Produccion

El proyecto esta preparado para desplegarse en **Railway** u otros servicios cloud:

1. **Backend:** Configura las variables de entorno de Railway (`MYSQLHOST`, `MYSQLPORT`, etc.) — el sistema detecta automaticamente las variables de Railway
2. **Frontend:** Ejecuta `npm run build` y sirve la carpeta `dist/` con cualquier servidor estatico
3. **Base de datos:** Ejecuta `php crear.php` una sola vez contra la base de datos de produccion

---

## Licencia

Este proyecto es de uso academico desarrollado por **JoAnJe Coders**.

---

<p align="center">
  Desarrollado por <strong>JoAnJe Coders</strong>
</p>
