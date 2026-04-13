# ACTUALIZACIÓN UI/UX Y LÓGICA DE NEGOCIO (ANATOGO)

Claude, necesito implementar 6 mejoras clave en nuestro sistema de gestión de activos. Recuerda que el stack es **React (Frontend)** y **PHP Nativo (Backend)**. Es fundamental respetar la arquitectura de mi API nativa y asegurar que el código generado sea limpio, profesional y modular.

Por favor, aborda los siguientes puntos:

## 1. Corrección y Estilización Profesional de Imágenes
- **Contexto:** Cambiamos la lógica y ahora las imágenes de los activos y usuarios se guardan en el frontend. Actualmente hay problemas de rutas y las imágenes renderizadas son muy pequeñas y algunas no se ven.
- **Acción:** 1. Corrige la lógica de las rutas (paths) para que las imágenes carguen correctamente en TODAS las vistas: Dashboard, Inventario, Usuarios, Solicitudes, Lista Negra y Préstamos.
  2. Rediseña los contenedores de las imágenes. Aplica clases  para que se vean uniformes, nítidas y con un acabado premium en las tablas y tarjetas. Añade un "placeholder" o imagen por defecto si la ruta falla.

## 2. Sincronización de Paleta de Colores
- **Acción:** Modifica los archivos de estilos (Tailwind config o CSS global) para que los colores primarios, secundarios, botones, headers y hovers del dashboard coincidan exactamente con la identidad visual de nuestra Landing Page. Todo el sistema debe sentirse como un solo producto. La paleta de colores que usa la landing page son estos: : #0056b3, #00bcd4, #9c27b0, #ff9800, #f8f9fa

## 3. Identificador Visual de Roles (Header)
- **Acción:** En el componente `Header` superior, implementa un renderizado condicional. Debes mostrar un icono profesional (ej. Lucide o Heroicons) acompañado de un *badge* elegante que indique claramente qué rol tiene el usuario activo (Administrador, Encargado o Cliente).

## 4. Bloqueo de Acciones según Estado del Activo
- **Acción:** En la tabla de Inventario, evalúa la propiedad `estado` de cada activo. Si el estado es `en_proceso_prestamo` o `prestado`, los botones de "Editar" y "Eliminar" deben deshabilitarse (`disabled`).
- **UI:** Aplica una clase visual de bloqueo (tonalidad gris, opacidad al 50%, cursor `not-allowed`) para que sea intuitivo que el activo está bloqueado por un flujo activo. Y esto hazlo tambien para los usuarios, si un usuario tiene un prestamo activo, no se puede editar ni eliminar.

## 5. Validación: Motivo de Préstamo Obligatorio
- **Acción:** En el flujo donde el *Cliente* solicita un préstamo de un activo (Marketplace), el campo "Motivo" debe ser estrictamente obligatorio.
  - Añade la validación en el formulario de React mostrando un mensaje de error si se intenta enviar vacío.
  - Asegúrate de indicar qué validación debo agregar en el controlador de PHP Nativo para rechazar peticiones POST sin este campo.

## 6. Filtros y Ordenamiento Dinámico (DataTables Avanzadas)
- **Contexto:** Las vistas de Inventario, Usuarios, Solicitudes y Lista Negra necesitan interactividad profesional.
- **Acción:** Implementa lógica de filtrado y ordenamiento en las tablas para todos los roles:
  - **Sorting (Ordenamiento):** Haz que los encabezados de las columnas sean clickeables. Al hacer clic, debe ordenar los datos alfabéticamente (A-Z, Z-A) o por categoría (ej. agrupar por Estado o Rol). Muestra iconos de flechas (↑↓) en el header activo.
  - **Filtros Avanzados:** Añade selects/dropdowns junto a la barra de búsqueda general para filtrar por categorías específicas (ej. mostrar solo "Disponibles" o solo "Clientes").