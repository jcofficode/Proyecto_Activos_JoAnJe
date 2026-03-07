# JoAnJe Coders - Landing Page 🚀

Esta es la página de aterrizaje (Landing Page) oficial de **JoAnJe Coders**, una solución moderna y eficiente para la gestión y préstamo de activos utilizando tecnologías de vanguardia como **NFC y códigos QR**.

## 📋 Descripción del Proyecto

El sistema permite a las organizaciones tener un control total sobre sus equipos y activos, eliminando el papeleo y reduciendo las pérdidas mediante:
- **Registro rápido de activos** mediante QR/NFC.
- **Préstamos instantáneos** con un simple toque.
- **Monitoreo en tiempo real** de quién tiene cada equipo.
- **Gestión de incidencias y daños** con historial auditado.

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React.js (Vite)
- **Estilos:** Vanilla CSS (Diseño Premium & Responsive)
- **Mapas:** Leaflet
- **Entorno de Desarrollo:** Laragon / Node.js

## ⚙️ Instalación y Configuración

Para ejecutar este proyecto localmente, sigue estos pasos:

### 1. Requisitos Previos
- Tener instalado [Laragon](https://laragon.org/) (recomendado para entorno Windows).
- Tener instalado [Node.js](https://nodejs.org/) (incluye npm).

### 2. Clonar o Descargar el Proyecto
Coloca la carpeta del proyecto dentro del directorio `www` de Laragon:
`C:\laragon\www\landing_joanje`

### 3. Configuración de la Base de Datos
Para que la API funcione correctamente, debes crear la base de datos:
1. Asegúrate de que MySQL esté iniciado en Laragon.
2. Abre tu navegador y accede a la carpeta del proyecto a través del "Index of" de Laragon (generalmente `http://localhost/landing_joanje`).
3. Entra en la carpeta `backend/`.
4. Ejecuta el archivo `crear.php` haciendo clic sobre él. Esto creará automáticamente la base de datos `bd_JoAnJe_jc` y las tablas necesarias.

### 4. Instalar Dependencias
Abre una terminal (puedes usar la terminal de Laragon o VS Code) y navega a la carpeta del frontend:
```bash
cd frontend
npm install
```

### 5. Ejecutar en Desarrollo
Para iniciar el servidor de desarrollo con Vite:
```bash
npm run dev
```
Una vez ejecutado, abre la URL que se muestra en la terminal (generalmente `http://localhost:5173`).

---

## 🚀 Despliegue con Laragon

Si deseas acceder a través de un dominio local gestionado por Laragon (ej: `http://landing_joanje.test`):
1. Asegúrate de que el proyecto esté en `C:\laragon\www\landing_joanje`.
2. Reinicia los servicios de Laragon.
3. Laragon detectará la carpeta y creará automáticamente el Virtual Host (si tienes activada la opción "Auto-create virtual hosts").

---
Desarrollado con ❤️ por **JoAnJe Coders**.
