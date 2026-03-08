<div align="center">

  <!-- ═══════════════════════ HEADER ═══════════════════════ -->

  <img src="https://img.shields.io/badge/PHP_8-777BB4?style=for-the-badge&logo=php&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL_8-005C84?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/REST_API-FF6C37?style=for-the-badge&logo=postman&logoColor=white" />
  <img src="https://img.shields.io/badge/Composer-885630?style=for-the-badge&logo=composer&logoColor=white" />

  <br><br>

  <h1>⚡ API RESTful — Sistema de Gestión de Activos</h1>
  <h3>Instituto Universitario de Tecnología del Estado Bolívar (IUTEB)</h3>

  <p>
    <b>Backend de alto rendimiento</b> construido en PHP Nativo sin frameworks.<br>
    Toda la lógica de negocio vive dentro de <b>MySQL</b> mediante <b>59 Stored Procedures</b> y <b>4 Triggers</b>.
  </p>

  <br>

  <img src="https://img.shields.io/badge/Tablas-11-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Stored_Procedures-39-green?style=flat-square" />
  <img src="https://img.shields.io/badge/Triggers-4-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/Índices-11-purple?style=flat-square" />
  <img src="https://img.shields.io/badge/Versión-1.0.0-red?style=flat-square" />

</div>

<br>

---

## 📑 Tabla de Contenidos

- [Arquitectura](#-arquitectura)
- [Instalación Rápida](#-instalación-rápida)
- [Autenticación JWT](#-autenticación-jwt)
- [Roles y Permisos](#-roles-y-permisos)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Políticas de Préstamo](#-políticas-de-préstamo-por-tipo-de-activo)
- [Stored Procedures](#-inventario-completo-de-stored-procedures-39)
- [Triggers](#-triggers-de-auditoría-4)
- [Reglas de Negocio](#-reglas-de-negocio-blindaje-mysql)
- [Códigos de Respuesta](#-códigos-de-respuesta-http)
- [Estructura de Carpetas](#-estructura-de-carpetas)

---

## 🏛️ Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENTE (React / Thunder)                    │
│                   Authorization: Bearer <JWT>                   │
└────────────────────────────┬────────────────────────────────────┘
                             │  HTTP JSON
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     ROUTER  (index.php)                         │
│            CORS ─► Parseo URI ─► Despacho al Controller         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       CONTROLLERS                               │
│     Middleware JWT ─► Validación de body ─► Llama al Model      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MODELS                                  │
│        Invoca Stored Procedures ─► Retorna resultado            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MySQL (InnoDB)                                │
│  ┌───────────┐ ┌─────────────────┐ ┌──────────┐ ┌───────────┐  │
│  │  TABLES   │ │ STORED PROCS    │ │ TRIGGERS │ │  INDEXES  │  │
│  │   (11)    │ │     (39)        │ │   (4)    │ │   (11)    │  │
│  └───────────┘ └─────────────────┘ └──────────┘ └───────────┘  │
│        Transacciones ACID ─ SIGNAL SQLSTATE '45000'             │
└─────────────────────────────────────────────────────────────────┘
```

> **Filosofía:** El 90% de la lógica reside en la base de datos. PHP solo actúa como proxy de seguridad (JWT) y validación de entrada. Esto garantiza **transacciones atómicas** e **integridad referencial** imposibles de corromper desde el Frontend.

---

## 🚀 Instalación Rápida

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd backend

# 2. Instalar dependencias PHP
composer install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de MySQL

# 4. Inicializar la base de datos (crea 11 tablas + 39 SPs + 4 Triggers + datos semilla)
php crear.php

# 5. Levantar el servidor de desarrollo
php -S localhost:8000
```

> **⚠️ Importante:** La URL base para todas las peticiones es `http://localhost:8000/api/v1`

---

## 🔐 Autenticación JWT

Toda petición privada requiere un **Token Bearer** en el header HTTP:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

<table>
<tr>
<td>

**¿Cómo obtenerlo?**

</td>
<td>

```json
POST /api/v1/auth/login
{
  "cedula": "29518292",
  "contrasena": "JoAnJe2026!"
}
```

</td>
<td>

**Respuesta:**
```json
{
  "exito": true,
  "datos": {
    "token": "eyJhbGci...",
    "usuario": {
      "id": 1,
      "nombre": "Admin JoAnJe",
      "rol": "administrador"
    }
  }
}
```

</td>
</tr>
</table>

### 💡 Tip para React
```javascript
// Guardar token después del login
localStorage.setItem('token', response.data.datos.token);

// Interceptor de Axios (inyecta el token en cada petición)
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

## 👥 Roles y Permisos

| # | Rol | Puede hacer | No puede hacer |
|:---:|:---|:---|:---|
| **1** | 🔴 **Administrador** | Todo: CRUD usuarios, inventario, sanciones, reportes, auditoría | *Sin restricciones* |
| **2** | 🟡 **Encargado** | Check-out, check-in, escaneo QR/NFC, ver inventario, consultar sanciones | Crear usuarios, modificar políticas, levantar sanciones |
| **3** | 🟢 **Usuario Final** | Ver catálogo, ver SUS préstamos, leer SUS notificaciones | Prestar, devolver, ver datos de otros usuarios |

---

## 📡 Endpoints de la API

> **URL Base:** `http://localhost:8000/api/v1`

<details open>
<summary><h3>🔑 Autenticación</h3></summary>

| Método | Endpoint | Body (JSON) | Rol | Descripción |
|:---:|:---|:---|:---:|:---|
| `POST` | `/auth/login` | `cedula`, `contrasena` | 🌐 | Inicia sesión y retorna el Token JWT |
| `GET` | `/auth/me` | — | 🔒 | Retorna el perfil del usuario autenticado |
| `POST` | `/auth/logout` | — | 🔒 | Invalida el token actual (cierra sesión) |
| `POST` | `/auth/cambiar-clave` | `nueva_contrasena`, `confirmar_contrasena` | 🔒 | Cambia la contraseña del usuario logueado |

</details>

<details open>
<summary><h3>👤 Usuarios</h3></summary>

| Método | Endpoint | Body (JSON) | Rol | Descripción |
|:---:|:---|:---|:---:|:---|
| `GET` | `/usuarios` | — | 🔴🟡 | Lista todos los usuarios del sistema |
| `POST` | `/usuarios` | `nombre`, `apellido`, `cedula`, `correo`, `telefono`, `contrasena`, `id_rol` | 🔴 | Crea un nuevo usuario |
| `PUT` | `/usuarios/{id}` | `nombre`, `apellido`, `correo`, `telefono`, `id_rol` | 🔴 | Actualiza los datos de un usuario |

</details>

<details open>
<summary><h3>📦 Inventario y Activos</h3></summary>

| Método | Endpoint | Body (JSON) | Rol | Descripción |
|:---:|:---|:---|:---:|:---|
| `GET` | `/activos` | — | 🌐 | Lista todos los activos (disponibles y ocupados) |
| `POST` | `/activos` | `nombre`, `codigo_qr`, `codigo_nfc`, `id_tipo`, `ubicacion`, `descripcion` | 🔴 | Registra un equipo nuevo en el sistema |
| `GET` | `/activos/qr/{codigo}` | — | 🔴🟡 | 📷 Busca un activo por su código QR |
| `GET` | `/activos/nfc/{codigo}` | — | 🔴🟡 | 📱 Busca un activo por su serial NFC |
| `GET` | `/tipos-activos` | — | 🌐 | Lista las categorías de activos |

</details>

<details open>
<summary><h3>🤝 Préstamos y Devoluciones</h3></summary>

| Método | Endpoint | Body (JSON) | Rol | Descripción |
|:---:|:---|:---|:---:|:---|
| `POST` | `/prestamos/checkout` | `id_activo`, `id_usuario`, `observaciones` | 🔴🟡 | ✅ Registra la entrega de un equipo (check-out) |
| `GET` | `/prestamos` | — | 🔴🟡 | Lista todos los préstamos (histórico completo) |
| `GET` | `/prestamos/activos` | — | 🔴🟡 | Lista solo los préstamos que no han sido devueltos |
| `GET` | `/prestamos/vencidos` | — | 🔴🟡 | Lista préstamos que superaron su fecha límite |
| `GET` | `/prestamos/usuario/{id}` | — | 🔴🟡 | Historial de préstamos de un usuario específico |
| `POST` | `/prestamos/{id}/devolver` | `observaciones` | 🔴🟡 | 🔄 Registra la devolución del equipo (check-in) |
| `POST` | `/prestamos/{id}/perdido` | `motivo` | 🔴🟡 | 🚨 Marca como perdido y **sanciona al usuario** |

</details>

<details open>
<summary><h3>🚨 Sanciones (Lista Negra)</h3></summary>

| Método | Endpoint | Body (JSON) | Rol | Descripción |
|:---:|:---|:---|:---:|:---|
| `GET` | `/sanciones` | — | 🔴🟡 | Lista todas las sanciones activas e históricas |
| `GET` | `/sanciones/usuario/{id}` | — | 🔴🟡 | Sanciones de un usuario específico |
| `PATCH` | `/sanciones/{id}/levantar` | — | 🔴 | ✅ Levanta la sanción (rehabilita al usuario) |

</details>

<details open>
<summary><h3>🔔 Notificaciones</h3></summary>

| Método | Endpoint | Body (JSON) | Rol | Descripción |
|:---:|:---|:---|:---:|:---|
| `GET` | `/notificaciones` | — | 🔒 | Bandeja de notificaciones del usuario logueado |
| `GET` | `/notificaciones/usuario/{id}` | — | 🔴🟡 | Notificaciones de un usuario específico |
| `PATCH` | `/notificaciones/{id}/leer` | — | 🔒 | Marca una notificación como leída |
| `PATCH` | `/notificaciones/usuario/{id}/leer-todas` | — | 🔒 | Marca todas las notificaciones como leídas |

</details>

<details open>
<summary><h3>📊 Reportes y Estadísticas</h3></summary>

| Método | Endpoint | Parámetros | Rol | Descripción |
|:---:|:---|:---|:---:|:---|
| `GET` | `/reportes/prestamos` | `?fecha_inicio=&fecha_fin=` | 🔴 | Reporte detallado de préstamos con filtros |
| `GET` | `/reportes/activos-mas-prestados` | — | 🔴 | Top 10 equipos más solicitados |
| `GET` | `/reportes/usuarios-activos` | — | 🔴 | Top 10 usuarios con más préstamos |
| `GET` | `/reportes/tasa-devolucion` | — | 🔴 | Porcentaje de efectividad de devoluciones |

</details>

<details open>
<summary><h3>📜 Auditoría</h3></summary>

| Método | Endpoint | Rol | Descripción |
|:---:|:---|:---:|:---|
| `GET` | `/auditoria` | 🔴 | Log completo de todas las acciones del sistema |

</details>

> **Leyenda de roles:** 🌐 Público (con token) · 🔒 Usuario autenticado (cualquier rol) · 🔴 Admin · 🟡 Encargado · 🟢 Usuario Final

---

## 📋 Políticas de Préstamo por Tipo de Activo

Cada categoría de equipo tiene restricciones **automáticas e inquebrantables** guardadas en la tabla `politicas_prestamo_jja`:

| Tipo de Activo | Días Máximo | Préstamos Simultáneos | Mismo Día | Comportamiento |
|:---|:---:|:---:|:---:|:---|
| 📚 **Libro** | 7 días | 3 | No | El alumno puede tener hasta 3 libros por 1 semana |
| 💿 **CD de Tesis** | 7 días | 2 | No | Hasta 2 CDs por 1 semana |
| 💻 **Laptop** | 1 día | 1 | ✅ Sí | Solo 1, devolución obligatoria el mismo día |
| 🖥️ **Computadora** | 1 día | 1 | ✅ Sí | Solo 1, devolución obligatoria el mismo día |
| 📱 **Tablet** | 3 días | 1 | No | Solo 1 tablet por 3 días |
| 🔌 **Pendrive** | 3 días | 2 | No | Hasta 2 pendrives por 3 días |
| 📽️ **Videobeam** | 1 día | 1 | ✅ Sí | Solo 1, devolución obligatoria el mismo día |
| 📽️ **Proyector** | 1 día | 1 | ✅ Sí | Solo 1, devolución obligatoria el mismo día |
| 📷 **Cámara** | 3 días | 1 | No | Solo 1 cámara por 3 días |
| 📦 **Otro** | 7 días | 1 | No | Categoría genérica: 1 activo por 1 semana |

> **⚠️** Estas políticas son evaluadas **dentro de MySQL** por el SP `SP_REGISTRAR_PRESTAMO_jja`. No pueden ser violadas desde el Frontend ni con peticiones manuales.

---

## 🗄️ Inventario Completo de Stored Procedures (39)

<details>
<summary><b>🔑 Autenticación y Usuarios (10)</b></summary>

| # | Procedimiento | Operación |
|:---:|:---|:---|
| 1 | `SP_BUSCAR_USUARIO_CEDULA_jja` | Busca un usuario por su cédula (login) |
| 2 | `SP_CAMBIAR_CONTRASENA_jja` | Actualiza el hash bcrypt de la contraseña |
| 3 | `SP_CREAR_ROL_jja` | Inserta un nuevo rol |
| 4 | `SP_LEER_ROLES_jja` | Lista todos los roles disponibles |
| 5 | `SP_CREAR_USUARIO_jja` | Registra un nuevo usuario con su rol |
| 6 | `SP_LEER_USUARIOS_jja` | Lista todos los usuarios activos |
| 7 | `SP_LEER_USUARIO_ID_jja` | Busca un usuario por su ID |
| 8 | `SP_ACTUALIZAR_USUARIO_jja` | Modifica datos de un usuario existente |
| 9 | `SP_ELIMINAR_USUARIO_jja` | Soft-delete de un usuario |
| 10 | `SP_BUSCAR_USUARIO_CORREO_jja` | Busca un usuario por correo electrónico |

</details>

<details>
<summary><b>📦 Tipos de Activos y Políticas (10)</b></summary>

| # | Procedimiento | Operación |
|:---:|:---|:---|
| 11 | `SP_CREAR_TIPO_ACTIVO_jja` | Crea una nueva categoría de activos |
| 12 | `SP_LEER_TIPOS_ACTIVOS_jja` | Lista todas las categorías |
| 13 | `SP_LEER_TIPO_ACTIVO_ID_jja` | Detalle de una categoría por ID |
| 14 | `SP_ACTUALIZAR_TIPO_ACTIVO_jja` | Modifica una categoría |
| 15 | `SP_ELIMINAR_TIPO_ACTIVO_jja` | Elimina una categoría |
| 16 | `SP_CREAR_POLITICA_jja` | Crea política de préstamo para un tipo |
| 17 | `SP_LEER_POLITICAS_jja` | Lista todas las políticas vigentes |
| 18 | `SP_LEER_POLITICA_TIPO_jja` | Obtiene la política de un tipo específico |
| 19 | `SP_ACTUALIZAR_POLITICA_jja` | Modifica días/límites de una política |
| 20 | `SP_ELIMINAR_POLITICA_jja` | Elimina una política de préstamo |

</details>

<details>
<summary><b>🖥️ Gestión de Activos (8)</b></summary>

| # | Procedimiento | Operación |
|:---:|:---|:---|
| 21 | `SP_CREAR_ACTIVO_jja` | Registra un equipo nuevo en inventario |
| 22 | `SP_LEER_ACTIVOS_jja` | Lista todos los activos con su estado |
| 23 | `SP_LEER_ACTIVO_ID_jja` | Detalle completo de un activo por ID |
| 24 | `SP_LEER_ACTIVO_QR_jja` | 📷 Busca activo por código QR |
| 25 | `SP_LEER_ACTIVO_NFC_jja` | 📱 Busca activo por serial NFC |
| 26 | `SP_ACTUALIZAR_ACTIVO_jja` | Modifica datos de un activo |
| 27 | `SP_ACTUALIZAR_ESTADO_ACTIVO_jja` | Cambia el estado (disponible/mantenimiento/etc) |
| 28 | `SP_ELIMINAR_ACTIVO_jja` | Soft-delete de un activo |

</details>

<details>
<summary><b>🤝 Préstamos y Devoluciones (9) — ⭐ CORE</b></summary>

| # | Procedimiento | Operación |
|:---:|:---|:---|
| 29 | `SP_REGISTRAR_PRESTAMO_jja` | ⭐ **CHECK-OUT** — 5 validaciones + transacción atómica |
| 30 | `SP_REGISTRAR_DEVOLUCION_jja` | ⭐ **CHECK-IN** — Libera activo + registra historial |
| 31 | `SP_LEER_PRESTAMOS_jja` | Lista todos los préstamos |
| 32 | `SP_LEER_PRESTAMO_ID_jja` | Detalle de un préstamo por ID |
| 33 | `SP_LEER_PRESTAMOS_USUARIO_jja` | Préstamos de un usuario específico |
| 34 | `SP_LEER_PRESTAMOS_ACTIVOS_jja` | Solo préstamos con estado `activo` |
| 35 | `SP_LEER_PRESTAMOS_VENCIDOS_jja` | Préstamos que pasaron su fecha límite |
| 36 | `SP_MARCAR_PRESTAMO_PERDIDO_jja` | 🚨 Marca como perdido + sanciona al usuario |
| 37 | `SP_ACTUALIZAR_VENCIDOS_jja` | 🕐 Batch: marca como vencidos (para cron job) |

</details>

<details>
<summary><b>🔔 Notificaciones (5)</b></summary>

| # | Procedimiento | Operación |
|:---:|:---|:---|
| 38 | `SP_CREAR_NOTIFICACION_jja` | Inserta alerta en la bandeja del usuario |
| 39 | `SP_LEER_NOTIFICACIONES_USUARIO_jja` | Lista notificaciones de un usuario |
| 40 | `SP_MARCAR_NOTIFICACION_LEIDA_jja` | Marca una notificación como leída |
| 41 | `SP_MARCAR_TODAS_LEIDAS_jja` | Marca toda la bandeja como leída |
| 42 | `SP_ELIMINAR_NOTIFICACION_jja` | Elimina una notificación |

</details>

<details>
<summary><b>🚨 Lista Negra / Sanciones (5)</b></summary>

| # | Procedimiento | Operación |
|:---:|:---|:---|
| 43 | `SP_CREAR_SANCION_jja` | Registra una sanción a un usuario |
| 44 | `SP_LEER_SANCIONES_jja` | Lista todas las sanciones |
| 45 | `SP_LEER_SANCIONES_USUARIO_jja` | Sanciones de un usuario específico |
| 46 | `SP_LEVANTAR_SANCION_jja` | Desactiva una sanción (rehabilita al alumno) |
| 47 | `SP_VERIFICAR_SANCION_jja` | Consulta rápida: ¿tiene sanción activa? |

</details>

<details>
<summary><b>📜 Auditoría y Tokens (6)</b></summary>

| # | Procedimiento | Operación |
|:---:|:---|:---|
| 48 | `SP_REGISTRAR_AUDITORIA_jja` | Inserta un registro en el log de auditoría |
| 49 | `SP_LEER_AUDITORIA_jja` | Lista las últimas 1000 acciones |
| 50 | `SP_LEER_AUDITORIA_TABLA_jja` | Filtra auditoría por tabla afectada |
| 51 | `SP_LEER_AUDITORIA_USUARIO_jja` | Filtra auditoría por usuario responsable |
| 52 | `SP_INVALIDAR_TOKEN_jja` | Añade un JWT a la blacklist (logout) |
| 53 | `SP_VERIFICAR_TOKEN_INVALIDO_jja` | Verifica si un JWT fue revocado |
| 54 | `SP_LIMPIAR_TOKENS_jja` | Purga tokens expirados (mantenimiento) |

</details>

<details>
<summary><b>📊 Reportes y Estadísticas (4)</b></summary>

| # | Procedimiento | Operación |
|:---:|:---|:---|
| 55 | `SP_REPORTE_PRESTAMOS_jja` | Reporte filtrado por fecha, tipo y usuario |
| 56 | `SP_REPORTE_ACTIVOS_MAS_PRESTADOS_jja` | Top 10 equipos más solicitados |
| 57 | `SP_REPORTE_USUARIOS_ACTIVOS_jja` | Top 10 usuarios con más préstamos |
| 58 | `SP_REPORTE_TASA_DEVOLUCION_jja` | Estadística: % devueltos vs perdidos vs vencidos |

</details>

---

## ⚡ Triggers de Auditoría (4)

Los Triggers son **centinelas automáticos** que MySQL ejecuta sin intervención de PHP:

| # | Trigger | Tabla Vigilada | Evento | Acción Automática |
|:---:|:---|:---|:---:|:---|
| 1 | `TR_AUDITORIA_ACTIVO_UPDATE_jja` | `activos_jja` | `AFTER UPDATE` | Registra cualquier cambio de estado o soft-delete en un activo |
| 2 | `TR_AUDITORIA_PRESTAMO_UPDATE_jja` | `prestamos_jja` | `AFTER UPDATE` | Registra cambios de estado en préstamos (activo → devuelto/vencido) |
| 3 | `TR_AUDITORIA_USUARIO_UPDATE_jja` | `usuarios_jja` | `AFTER UPDATE` | Registra soft-deletes de usuarios en la auditoría |
| 4 | `TR_HISTORIAL_PRESTAMO_DEVOLUCION_jja` | `prestamos_jja` | `AFTER UPDATE` | Clona al historial cuando un préstamo pasa de `activo` a `vencido` |

> **📌 Nota:** Todos los Triggers escriben en la tabla `auditoria_jja`, creando un registro **inmutable** que no puede ser borrado ni alterado desde la aplicación.

---

## 🛡️ Reglas de Negocio (Blindaje MySQL)

El procedimiento `SP_REGISTRAR_PRESTAMO_jja` ejecuta **5 validaciones secuenciales** antes de autorizar la entrega de un equipo:

```
PASO 1  ──►  ¿El activo existe?                          ── Si no ── ERROR 409
PASO 2  ──►  ¿El activo está "disponible"?                ── Si no ── ERROR 409
PASO 3  ──►  ¿El usuario tiene sanción activa?            ── Si sí ── ERROR 409
PASO 4  ──►  ¿Superó el límite de préstamos simultáneos? ── Si sí ── ERROR 409
PASO 5  ──►  ✅ Todo OK → INSERT préstamo → UPDATE activo a "prestado"
```

**Errores que MySQL lanza automáticamente (SIGNAL SQLSTATE '45000'):**

| Situación | Mensaje de Error |
|:---|:---|
| Activo ya prestado a otro | `El activo no está disponible para préstamo.` |
| Usuario en lista negra | `El usuario tiene una sanción activa y no puede recibir préstamos.` |
| Excedió límite simultáneo | `El usuario superó el límite de préstamos simultáneos para este tipo de activo.` |
| Sanción inexistente al levantar | `La sanción con ID X no existe o ya se encuentra levantada.` |

---

## 🚦 Códigos de Respuesta HTTP

Todas las respuestas siguen el formato estándar:

```json
{
  "exito": true | false,
  "mensaje": "Descripción legible",
  "datos": { ... } | [ ... ] | null
}
```

| Código | Significado | Acción en React |
|:---:|:---|:---|
| `200` | ✅ Operación de lectura exitosa | Mostrar datos al usuario |
| `201` | ✅ Recurso creado exitosamente | Mostrar confirmación + redirigir |
| `400` | ⚠️ Faltan campos obligatorios en el JSON | Resaltar campos vacíos en el formulario |
| `401` | 🔒 Token inválido o expirado | **Redirigir a `/login`** |
| `403` | 🚫 Rol insuficiente para esta acción | Mostrar "No tienes permiso" |
| `404` | 🔍 Recurso no encontrado | Mostrar "No existe" |
| `405` | ❌ Método HTTP no permitido | Error de desarrollo |
| `409` | 💥 **Regla de negocio bloqueada por MySQL** | Mostrar el mensaje exacto de la API |

---

## 📂 Estructura de Carpetas

```
backend/
├── 📄 index.php                  # Router principal (punto de entrada único)
├── 📄 crear.php                  # Script de inicialización de BD
├── 📄 .env                       # Variables de entorno (NO subir a Git)
├── 📄 composer.json              # Dependencias PHP
│
├── 📁 Core/
│   ├── Autoloader_jja.php        # Cargador automático de clases
│   ├── Controller_jja.php        # Clase base de controladores
│   ├── Database_jja.php          # Singleton PDO (conexión a MySQL)
│   ├── Middleware_jja.php        # Verificación JWT + autorización por rol
│   └── Model_jja.php            # Clase base para ejecutar SPs
│
├── 📁 controllers/               # Un controlador por recurso
│   ├── AuthController_jja.php
│   ├── UsuarioController_jja.php
│   ├── ActivoController_jja.php
│   ├── PrestamoController_jja.php
│   ├── ListaNegraController_jja.php
│   ├── NotificacionController_jja.php
│   ├── AuditoriaController_jja.php
│   └── ReporteController_jja.php
│
├── 📁 models/                    # Un modelo por recurso
│   ├── AuthModel_jja.php
│   ├── UsuarioModel_jja.php
│   ├── ActivoModel_jja.php
│   ├── PrestamoModel_jja.php
│   ├── ListaNegraModel_jja.php
│   ├── NotificacionModel_jja.php
│   └── ReporteModel_jja.php
│
├── 📁 services/                  # Servicios auxiliares
│   ├── JwtService_jja.php       # Generación y verificación de tokens
│   └── CorreoService_jja.php    # Envío de emails (SMTP)
│
└── 📁 vendor/                    # Dependencias de Composer (auto-generado)
```

---

<div align="center">

  <br>

  <img src="https://img.shields.io/badge/Estado-Producción_Local-brightgreen?style=for-the-badge" />

  <br><br>

  **🛠️ Proyecto Final — Ingeniería en Informática 2026**

  *Desarrollado con ❤️ por el equipo* ***JoAnJe Coders***

  <br>

  <sub>📌 Base de Datos: <b>gestion_activos_jja</b> · Motor: <b>InnoDB</b> · Charset: <b>utf8mb4_unicode_ci</b></sub>

</div>
