<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>🚀 Inicializar BD — Sistema JoAnJe Coders</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --blue-deep:    #1a3560;
            --blue-mid:     #1e4fa5;
            --blue-light:   #e8f0fd;
            --orange:       #f97316;
            --pink:         #ec4899;
            --purple:       #7c3aed;
            --purple-light: #f3eeff;
            --grad:         linear-gradient(135deg, #f97316 0%, #ec4899 50%, #7c3aed 100%);
            --grad-blue:    linear-gradient(135deg, #1a3560 0%, #1e4fa5 100%);
            --bg-page:      #eef1f8;
            --bg-card:      #ffffff;
            --bg-section:   #f7f8fc;
            --text-main:    #1a2340;
            --text-muted:   #64748b;
            --border:       #dde3f0;
            --ok-bg:        #f0fdf4;
            --ok-border:    #22c55e;
            --ok-text:      #166534;
            --err-bg:       #fff1f2;
            --err-border:   #f43f5e;
            --err-text:     #9f1239;
            --info-bg:      #eff6ff;
            --info-border:  #3b82f6;
            --info-text:    #1e40af;
            --radius-sm:    6px;
            --radius-md:    10px;
            --radius-lg:    16px;
            --shadow-card:  0 4px 24px rgba(26,53,96,.08), 0 1px 4px rgba(26,53,96,.05);
            --shadow-badge: 0 2px 8px rgba(124,58,237,.25);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: var(--bg-page);
            min-height: 100vh;
            color: var(--text-main);
            padding: 0;
        }

        /* ── TOP HEADER BAR ─────────────────────────────── */
        .topbar {
            background: var(--grad-blue);
            padding: 0 2rem;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .topbar-brand {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .topbar-logo {
            width: 38px;
            height: 38px;
            background: var(--bg-card);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: 800;
            background: var(--grad);
            color: #fff;
            letter-spacing: -.5px;
        }
        .topbar-title {
            font-size: .92rem;
            font-weight: 600;
            color: rgba(255,255,255,.85);
            letter-spacing: .02em;
        }
        .topbar-subtitle {
            font-size: .75rem;
            color: rgba(255,255,255,.5);
        }
        .topbar-badge {
            font-size: .72rem;
            font-weight: 700;
            background: var(--grad);
            color: #fff;
            padding: 4px 12px;
            border-radius: 20px;
            letter-spacing: .04em;
            text-transform: uppercase;
        }

        /* ── PAGE WRAPPER ───────────────────────────────── */
        .page-wrapper {
            max-width: 920px;
            margin: 0 auto;
            padding: 2rem 1.5rem 4rem;
        }

        /* ── HERO BLOCK ─────────────────────────────────── */
        .hero {
            background: var(--bg-card);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-card);
            padding: 2rem 2.5rem;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1.5rem;
            border: 1px solid var(--border);
        }
        .hero-icon {
            flex-shrink: 0;
            width: 60px;
            height: 60px;
            border-radius: 14px;
            background: var(--grad);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            box-shadow: var(--shadow-badge);
        }
        .hero h1 {
            font-size: 1.45rem;
            font-weight: 800;
            color: var(--blue-deep);
            line-height: 1.2;
            margin-bottom: 4px;
        }
        .hero h1 span {
            background: var(--grad);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .hero p {
            font-size: .82rem;
            color: var(--text-muted);
            font-weight: 500;
            line-height: 1.5;
        }

        /* ── MAIN CARD ──────────────────────────────────── */
        .main-card {
            background: var(--bg-card);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-card);
            border: 1px solid var(--border);
            overflow: hidden;
        }

        /* ── SECTION HEADER ─────────────────────────────── */
        .seccion {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 1rem 1.5rem .6rem;
            background: var(--bg-section);
            border-top: 1px solid var(--border);
            font-size: .78rem;
            font-weight: 700;
            color: var(--blue-deep);
            letter-spacing: .08em;
            text-transform: uppercase;
            position: sticky;
            top: 64px;
            z-index: 10;
        }
        .seccion:first-child {
            border-top: none;
        }
        .seccion-num {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: var(--grad);
            color: #fff;
            font-size: .65rem;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .seccion-line {
            flex: 1;
            height: 1px;
            background: var(--border);
        }

        /* ── LOG CONTAINER ──────────────────────────────── */
        .log-container {
            padding: .75rem 1.25rem;
        }

        /* ── MENSAJES ───────────────────────────────────── */
        .bloque { margin-bottom: 4px; }

        .ok, .err, .info {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            padding: 7px 12px;
            border-radius: var(--radius-sm);
            font-size: .8rem;
            font-weight: 500;
            line-height: 1.5;
        }

        .ok {
            background: var(--ok-bg);
            color: var(--ok-text);
            border-left: 3px solid var(--ok-border);
        }
        .ok::before {
            content: '✓';
            flex-shrink: 0;
            font-size: .75rem;
            font-weight: 800;
            color: var(--ok-border);
            margin-top: 1px;
        }

        .err {
            background: var(--err-bg);
            color: var(--err-text);
            border-left: 3px solid var(--err-border);
        }
        .err::before {
            content: '✕';
            flex-shrink: 0;
            font-size: .75rem;
            font-weight: 800;
            color: var(--err-border);
            margin-top: 1px;
        }

        .info {
            background: var(--info-bg);
            color: var(--info-text);
            border-left: 3px solid var(--info-border);
        }
        .info::before {
            content: 'i';
            flex-shrink: 0;
            font-size: .7rem;
            font-weight: 900;
            font-style: italic;
            color: var(--info-border);
            margin-top: 1px;
        }

        /* Remove the old icon from PHP output */
        .ok .icono, .err .icono, .info .icono { display: none; }

        /* ── DIVIDER ────────────────────────────────────── */
        .divider {
            height: 1px;
            background: var(--border);
            margin: 0 1.25rem;
        }

        /* ── RESUMEN FINAL ──────────────────────────────── */
        .resumen-wrapper {
            padding: 1.25rem 1.5rem 1.5rem;
            background: var(--bg-section);
            border-top: 1px solid var(--border);
        }
        .resumen-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 1rem;
        }
        .resumen-header-icon {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            background: var(--grad);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            box-shadow: var(--shadow-badge);
        }
        .resumen-header-text {
            font-size: 1rem;
            font-weight: 800;
            color: var(--blue-deep);
        }
        .resumen-header-text small {
            display: block;
            font-size: .75rem;
            font-weight: 500;
            color: var(--text-muted);
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: .75rem;
            margin-bottom: 1rem;
        }
        .stat-card {
            background: var(--bg-card);
            border-radius: var(--radius-md);
            border: 1px solid var(--border);
            padding: .85rem 1rem;
            text-align: center;
        }
        .stat-card .stat-val {
            font-size: 1.6rem;
            font-weight: 800;
            background: var(--grad);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.1;
        }
        .stat-card .stat-val.error-val {
            background: none;
            -webkit-text-fill-color: var(--err-text);
        }
        .stat-card .stat-lbl {
            font-size: .7rem;
            font-weight: 600;
            color: var(--text-muted);
            letter-spacing: .05em;
            text-transform: uppercase;
            margin-top: 4px;
        }
        .resumen-db {
            font-size: .78rem;
            color: var(--text-muted);
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .resumen-db code {
            background: var(--blue-light);
            color: var(--blue-deep);
            padding: 2px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: .77rem;
            font-weight: 700;
        }

        /* ── BOTÓN VOLVER ───────────────────────────────── */
        .btn-volver {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-top: 1rem;
            padding: 10px 22px;
            background: var(--grad-blue);
            color: #fff;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 700;
            font-size: .85rem;
            letter-spacing: .02em;
            transition: opacity .15s;
            box-shadow: 0 4px 12px rgba(26,53,96,.25);
        }
        .btn-volver:hover { opacity: .88; }

        /* ── PROGRESS BAR ───────────────────────────────── */
        .progress-bar-wrap {
            height: 4px;
            background: var(--border);
        }
        .progress-bar {
            height: 4px;
            background: var(--grad);
            width: 0;
            animation: progress 2.5s ease-out forwards;
        }
        @keyframes progress {
            0%   { width: 0; }
            100% { width: 100%; }
        }

        /* ── INLINE CODE / STRONG ───────────────────────── */
        strong { font-weight: 700; color: var(--blue-deep); }
        code {
            background: var(--blue-light);
            color: var(--blue-deep);
            padding: 1px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: .85em;
            font-weight: 700;
        }
        em {
            color: var(--text-muted);
            font-size: .9em;
        }
    </style>
</head>

<body>

<!-- ── TOP BAR ─────────────────────────────────────── -->
<header class="topbar">
    <div class="topbar-brand">
        <div class="topbar-logo">JJ</div>
        <div>
            <div class="topbar-title">JoAnJe Coders</div>
            <div class="topbar-subtitle">Sistema de Gestión de Activos · NFC / QR</div>
        </div>
    </div>
    <span class="topbar-badge">Configuración de BD</span>
</header>

<!-- ── PROGRESS BAR ────────────────────────────────── -->
<div class="progress-bar-wrap">
    <div class="progress-bar"></div>
</div>

<!-- ── CONTENIDO ───────────────────────────────────── -->
<div class="page-wrapper">

    <!-- HERO -->
    <div class="hero">
        <div class="hero-icon">🚀</div>
        <div>
            <h1>Inicializando <span>Base de Datos</span></h1>
            <p>API REST PHP + React · Gestión de Préstamos con NFC / QR · Motor InnoDB · utf8mb4</p>
        </div>
    </div>

    <!-- TARJETA PRINCIPAL DE LOG -->
    <div class="main-card">
        <?php
        // ============================================================
        // crear.php — Construcción Completa de la Base de Datos
        // Sistema JoAnJe Coders — Sufijo estricto: _jja
        // ============================================================
        require __DIR__ . '/vendor/autoload.php';

        $dotenv_jja = Dotenv\Dotenv::createImmutable(__DIR__);
        $dotenv_jja->safeload();

        $cnt_tablas_jja   = 0;
        $cnt_sp_jja       = 0;
        $cnt_triggers_jja = 0;
        $cnt_indices_jja  = 0;
        $errores_jja      = 0;

        function mostrar_jja(string $clase, string $icono, string $texto): void
        {
            echo "<div class='bloque'><div class='{$clase}'>{$texto}</div></div>\n";
        }

        function ejecutar_jja(PDO $pdo, string $sql, string $descripcion, string &$contador_ref, int &$errores_ref): void
        {
            try {
                $pdo->exec($sql);
                mostrar_jja('ok', '✅', $descripcion);
                $contador_ref++;
            } catch (PDOException $e) {
                mostrar_jja('err', '❌', "ERROR — {$descripcion}: " . $e->getMessage());
                $errores_ref++;
            }
        }

        // Función para abrir una sección
        function seccion_jja(string $num, string $titulo): void
        {
            echo "<div class='seccion'><span class='seccion-num'>{$num}</span>{$titulo}<span class='seccion-line'></span></div>";
            echo "<div class='log-container'>";
        }
        function cierre_seccion_jja(): void
        {
            echo "</div>";
        }

        // ══════════════════════════════════════════════════════
        // 1. CONEXIÓN Y CREACIÓN DE LA BASE DE DATOS
        // ══════════════════════════════════════════════════════
        seccion_jja('1', 'Conexión y Creación de la Base de Datos');

        $host_jja = $_ENV['DB_HOST'];
        $port_jja = $_ENV['DB_PORT'];
        $user_jja = $_ENV['DB_USER'];
        $pass_jja = $_ENV['DB_PASS'];
        $db_jja   = $_ENV['DB_NAME'];

        try {
            $pdo_jja = new PDO("mysql:host={$host_jja};port={$port_jja}", $user_jja, $pass_jja);
            $pdo_jja->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            mostrar_jja('ok', '✅', "Conexión al servidor MySQL establecida correctamente.");
        } catch (PDOException $e) {
            mostrar_jja('err', '❌', "No se pudo conectar al servidor MySQL: " . $e->getMessage());
            cierre_seccion_jja();
            die();
        }

        try {
            $pdo_jja->exec("CREATE DATABASE IF NOT EXISTS `{$db_jja}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            mostrar_jja('ok', '✅', "Base de datos <strong>{$db_jja}</strong> creada o ya existe.");
            $pdo_jja->exec("USE `{$db_jja}`");
            $pdo_jja->exec("SET time_zone = '-04:00'");
        } catch (PDOException $e) {
            mostrar_jja('err', '❌', "Error al crear/usar la BD: " . $e->getMessage());
            cierre_seccion_jja();
            die();
        }

        $pdo_jja->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $pdo_jja->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        cierre_seccion_jja();

        // ══════════════════════════════════════════════════════
        // 2. CREACIÓN DE TABLAS
        // ══════════════════════════════════════════════════════
        seccion_jja('2', 'Creación de Tablas &mdash; 3FN · InnoDB · utf8mb4');

        ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `roles_jja` (
    `id_rol_jja`            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `nombre_rol_jja`        VARCHAR(50)     NOT NULL,
    `descripcion_jja`       VARCHAR(255)    DEFAULT NULL,
    `estado_registro_jja`   TINYINT(1)      NOT NULL DEFAULT 1,
    `creado_en_jja`         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `actualizado_en_jja`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_rol_jja`),
    UNIQUE KEY `uq_nombre_rol_jja` (`nombre_rol_jja`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Roles del sistema: administrador, encargado, cliente';
", "Tabla <strong>roles_jja</strong>", $cnt_tablas_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `usuarios_jja` (
    `id_usuario_jja`        INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `nombre_jja`            VARCHAR(100)    NOT NULL,
    `apellido_jja`          VARCHAR(100)    NOT NULL,
    `cedula_jja`            VARCHAR(20)     NOT NULL,
    `correo_jja`            VARCHAR(150)    NOT NULL,
    `telefono_jja`          VARCHAR(20)     DEFAULT NULL,
    `contrasena_jja`        VARCHAR(255)    NOT NULL   COMMENT 'Hash bcrypt',
    `imagen_jja`            VARCHAR(255)    DEFAULT NULL COMMENT 'Ruta de la imagen de perfil',
    `id_rol_jja`            INT UNSIGNED    NOT NULL,
    `debe_cambiar_clave_jja` TINYINT(1)     NOT NULL DEFAULT 0,
    `estado_registro_jja`   TINYINT(1)      NOT NULL DEFAULT 1 COMMENT 'Soft delete: 1=activo, 0=eliminado',
    `creado_en_jja`         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `actualizado_en_jja`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_usuario_jja`),
    UNIQUE KEY `uq_cedula_jja`  (`cedula_jja`),
    UNIQUE KEY `uq_correo_jja`  (`correo_jja`),
    CONSTRAINT `fk_usuario_rol_jja` FOREIGN KEY (`id_rol_jja`)
        REFERENCES `roles_jja` (`id_rol_jja`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Usuarios del sistema con soft-delete';
", "Tabla <strong>usuarios_jja</strong>", $cnt_tablas_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `tipos_activos_jja` (
    `id_tipo_jja`           INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `nombre_tipo_jja`       VARCHAR(100)    NOT NULL,
    `descripcion_jja`       VARCHAR(255)    DEFAULT NULL,
    `estado_registro_jja`   TINYINT(1)      NOT NULL DEFAULT 1,
    `creado_en_jja`         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_tipo_jja`),
    UNIQUE KEY `uq_nombre_tipo_jja` (`nombre_tipo_jja`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Tipos de activos: libro, laptop, videobeam, pendrive, etc.';
", "Tabla <strong>tipos_activos_jja</strong>", $cnt_tablas_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `politicas_prestamo_jja` (
    `id_politica_jja`               INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `id_tipo_jja`                   INT UNSIGNED    NOT NULL,
    `dias_maximo_jja`               TINYINT UNSIGNED NOT NULL DEFAULT 7,
    `max_prestamos_simultaneos_jja` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `requiere_mismo_dia_jja`        TINYINT(1)      NOT NULL DEFAULT 0,
    `estado_registro_jja`           TINYINT(1)      NOT NULL DEFAULT 1,
    `creado_en_jja`                 TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `actualizado_en_jja`            TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_politica_jja`),
    UNIQUE KEY `uq_politica_tipo_jja` (`id_tipo_jja`),
    CONSTRAINT `fk_politica_tipo_jja` FOREIGN KEY (`id_tipo_jja`)
        REFERENCES `tipos_activos_jja` (`id_tipo_jja`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Políticas de préstamo configuradas por tipo de activo';
", "Tabla <strong>politicas_prestamo_jja</strong>", $cnt_tablas_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `activos_jja` (
    `id_activo_jja`         INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `nombre_jja`            VARCHAR(200)    NOT NULL,
    `codigo_qr_jja`         VARCHAR(50)     NOT NULL  COMMENT 'Código QR único generado por el sistema',
    `codigo_nfc_jja`        VARCHAR(50)     DEFAULT NULL COMMENT 'ID de etiqueta NFC (opcional)',
    `id_tipo_jja`           INT UNSIGNED    NOT NULL,
    `ubicacion_jja`         VARCHAR(150)    DEFAULT NULL,
    `descripcion_jja`       TEXT            DEFAULT NULL,
    `imagenes_jja`          JSON            DEFAULT NULL,
    `publicado_jja`         TINYINT(1)      NOT NULL DEFAULT 0 COMMENT 'Publicado en marketplace: 1=si, 0=no',
    `estado_jja`            ENUM('disponible','prestado','en_proceso_prestamo','mantenimiento','dañado','perdido')
                                            NOT NULL DEFAULT 'disponible',
    `estado_registro_jja`   TINYINT(1)      NOT NULL DEFAULT 1,
    `creado_en_jja`         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `actualizado_en_jja`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_activo_jja`),
    UNIQUE KEY `uq_qr_jja`  (`codigo_qr_jja`),
    UNIQUE KEY `uq_nfc_jja` (`codigo_nfc_jja`),
    CONSTRAINT `fk_activo_tipo_jja` FOREIGN KEY (`id_tipo_jja`)
        REFERENCES `tipos_activos_jja` (`id_tipo_jja`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Inventario de activos físicos de la institución';
", "Tabla <strong>activos_jja</strong>", $cnt_tablas_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `prestamos_jja` (
    `id_prestamo_jja`       INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `id_activo_jja`         INT UNSIGNED    NOT NULL,
    `id_usuario_jja`        INT UNSIGNED    NOT NULL COMMENT 'Quien toma prestado',
    `id_encargado_jja`      INT UNSIGNED    NOT NULL COMMENT 'Quien procesó el préstamo',
    `fecha_prestamo_jja`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_limite_jja`      TIMESTAMP       NOT NULL,
    `fecha_devolucion_jja`  DATETIME       DEFAULT NULL,
    `estado_prestamo_jja`   ENUM('activo','devuelto','vencido','perdido')
                                            NOT NULL DEFAULT 'activo',
    `observaciones_jja`     TEXT            DEFAULT NULL,
    `estado_registro_jja`   TINYINT(1)      NOT NULL DEFAULT 1,
    `creado_en_jja`         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `actualizado_en_jja`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_prestamo_jja`),
    CONSTRAINT `fk_prestamo_activo_jja`    FOREIGN KEY (`id_activo_jja`)
        REFERENCES `activos_jja`   (`id_activo_jja`)   ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT `fk_prestamo_usuario_jja`   FOREIGN KEY (`id_usuario_jja`)
        REFERENCES `usuarios_jja`  (`id_usuario_jja`)  ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT `fk_prestamo_encargado_jja` FOREIGN KEY (`id_encargado_jja`)
        REFERENCES `usuarios_jja`  (`id_usuario_jja`)  ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Registro transaccional de préstamos y devoluciones';
", "Tabla <strong>prestamos_jja</strong>", $cnt_tablas_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `historial_prestamos_jja` (
    `id_historial_jja`      INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `id_prestamo_jja`       INT UNSIGNED    NOT NULL,
    `id_activo_jja`         INT UNSIGNED    NOT NULL,
    `id_usuario_jja`        INT UNSIGNED    NOT NULL,
    `accion_jja`            ENUM('checkout','checkin','vencimiento','perdida','cancelacion')
                                            NOT NULL,
    `fecha_accion_jja`      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `detalles_jja`          TEXT            DEFAULT NULL,
    PRIMARY KEY (`id_historial_jja`),
    CONSTRAINT `fk_historial_prestamo_jja` FOREIGN KEY (`id_prestamo_jja`)
        REFERENCES `prestamos_jja` (`id_prestamo_jja`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Log inmutable de movimientos de activos';
", "Tabla <strong>historial_prestamos_jja</strong>", $cnt_tablas_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `solicitudes_prestamo_activos_jja` (
    `id_solicitud_activo_jja` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_activo_jja`           INT UNSIGNED NOT NULL,
    `id_cliente_jja`          INT UNSIGNED NOT NULL,
    `fecha_solicitud_jja`     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `estado_jja`              ENUM('pendiente','en_proceso','aprobada','rechazada','cancelada') NOT NULL DEFAULT 'pendiente',
    `observaciones_jja`       TEXT         DEFAULT NULL,
    PRIMARY KEY (`id_solicitud_activo_jja`),
    CONSTRAINT `fk_solicitud_activo_activo_jja`  FOREIGN KEY (`id_activo_jja`)  REFERENCES `activos_jja`  (`id_activo_jja`)  ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_solicitud_activo_cliente_jja` FOREIGN KEY (`id_cliente_jja`) REFERENCES `usuarios_jja` (`id_usuario_jja`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Solicitudes de préstamo para activos (clientes)';
", "Tabla <strong>solicitudes_prestamo_activos_jja</strong>", $cnt_tablas_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `notificaciones_jja` (
    `id_notificacion_jja`   INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `id_usuario_jja`        INT UNSIGNED    NOT NULL,
    `id_prestamo_jja`       INT UNSIGNED    DEFAULT NULL,
    `tipo_notificacion_jja` ENUM('vencimiento_proximo','vencido','devolucion_confirmada','sancion','informativo') NOT NULL,
    `titulo_jja`            VARCHAR(200)    NOT NULL,
    `mensaje_jja`           TEXT            NOT NULL,
    `leida_jja`             TINYINT(1)      NOT NULL DEFAULT 0,
    `enviada_correo_jja`    TINYINT(1)      NOT NULL DEFAULT 0,
    `creado_en_jja`         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_notificacion_jja`),
    CONSTRAINT `fk_notif_usuario_jja`  FOREIGN KEY (`id_usuario_jja`)  REFERENCES `usuarios_jja`  (`id_usuario_jja`)  ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT `fk_notif_prestamo_jja` FOREIGN KEY (`id_prestamo_jja`) REFERENCES `prestamos_jja` (`id_prestamo_jja`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Centro de notificaciones del sistema';
", "Tabla <strong>notificaciones_jja</strong>", $cnt_tablas_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `lista_negra_jja` (
    `id_sancion_jja`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_usuario_jja`            INT UNSIGNED NOT NULL,
    `id_prestamo_jja`           INT UNSIGNED DEFAULT NULL,
    `motivo_jja`                TEXT         NOT NULL,
    `fecha_inicio_sancion_jja`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_fin_sancion_jja`     DATETIME     DEFAULT NULL COMMENT 'NULL = sanción indefinida',
    `activa_jja`                TINYINT(1)   NOT NULL DEFAULT 1,
    `creado_por_jja`            INT UNSIGNED NOT NULL COMMENT 'ID del admin que aplicó la sanción',
    `estado_registro_jja`       TINYINT(1)   NOT NULL DEFAULT 1,
    `creado_en_jja`             TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_sancion_jja`),
    CONSTRAINT `fk_lista_negra_usuario_jja`  FOREIGN KEY (`id_usuario_jja`)  REFERENCES `usuarios_jja`  (`id_usuario_jja`)  ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT `fk_lista_negra_prestamo_jja` FOREIGN KEY (`id_prestamo_jja`) REFERENCES `prestamos_jja` (`id_prestamo_jja`) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT `fk_lista_negra_admin_jja`    FOREIGN KEY (`creado_por_jja`)  REFERENCES `usuarios_jja`  (`id_usuario_jja`)  ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Sanciones y bloqueos por incumplimiento de devoluciones';
", "Tabla <strong>lista_negra_jja</strong>", $cnt_tablas_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `auditoria_jja` (
    `id_auditoria_jja`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `tabla_afectada_jja`         VARCHAR(100) NOT NULL,
    `id_registro_afectado_jja`   INT UNSIGNED NOT NULL,
    `accion_jja`                 ENUM('INSERT','UPDATE','DELETE') NOT NULL,
    `campo_modificado_jja`       VARCHAR(100) DEFAULT NULL,
    `valor_anterior_jja`         TEXT         DEFAULT NULL,
    `valor_nuevo_jja`            TEXT         DEFAULT NULL,
    `id_usuario_responsable_jja` INT UNSIGNED DEFAULT NULL COMMENT 'NULL si es trigger automático',
    `fecha_accion_jja`           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `ip_origen_jja`              VARCHAR(45)  DEFAULT NULL,
    `descripcion_jja`            TEXT         DEFAULT NULL,
    PRIMARY KEY (`id_auditoria_jja`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Log de auditoría inmutable — NO tiene FK para preservar registros históricos';
", "Tabla <strong>auditoria_jja</strong>", $cnt_tablas_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `tokens_invalidos_jja` (
    `id_token_jja`      INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `token_hash_jja`    VARCHAR(64)  NOT NULL COMMENT 'SHA-256 del token para búsqueda rápida',
    `id_usuario_jja`    INT UNSIGNED NOT NULL,
    `invalidado_en_jja` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `expira_en_jja`     TIMESTAMP    NOT NULL,
    PRIMARY KEY (`id_token_jja`),
    UNIQUE KEY `uq_token_hash_jja` (`token_hash_jja`),
    CONSTRAINT `fk_token_usuario_jja` FOREIGN KEY (`id_usuario_jja`)
        REFERENCES `usuarios_jja` (`id_usuario_jja`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Lista negra de JWT invalidados (logout/revocación)';
", "Tabla <strong>tokens_invalidos_jja</strong>", $cnt_tablas_jja, $errores_jja);

        cierre_seccion_jja();

        // ══════════════════════════════════════════════════════
        // 2b. TABLAS MARKETPLACE
        // ══════════════════════════════════════════════════════
        seccion_jja('2b', 'Tablas Marketplace');

        ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `categorias_jja` (
    `id_categoria_jja`     INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre_categoria_jja` VARCHAR(120) NOT NULL,
    `descripcion_jja`      VARCHAR(255) DEFAULT NULL,
    `estado_registro_jja`  TINYINT(1)   NOT NULL DEFAULT 1,
    `creado_en_jja`        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_categoria_jja`),
    UNIQUE KEY `uq_nombre_categoria_jja` (`nombre_categoria_jja`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Categorías para productos del marketplace';
", "Tabla <strong>categorias_jja</strong>", $cnt_tablas_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `productos_jja` (
    `id_producto_jja`    INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    `id_empresa_jja`     INT UNSIGNED  NOT NULL COMMENT 'Usuario tipo empresa',
    `id_categoria_jja`   INT UNSIGNED  DEFAULT NULL,
    `nombre_jja`         VARCHAR(200)  NOT NULL,
    `descripcion_jja`    TEXT          DEFAULT NULL,
    `precio_jja`         DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `stock_jja`          INT UNSIGNED  NOT NULL DEFAULT 0,
    `imagenes_jja`       JSON          DEFAULT NULL,
    `estado_jja`         TINYINT(1)    NOT NULL DEFAULT 1,
    `creado_en_jja`      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `actualizado_en_jja` TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_producto_jja`),
    CONSTRAINT `fk_producto_empresa_jja`   FOREIGN KEY (`id_empresa_jja`)   REFERENCES `usuarios_jja`  (`id_usuario_jja`)  ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_producto_categoria_jja` FOREIGN KEY (`id_categoria_jja`) REFERENCES `categorias_jja` (`id_categoria_jja`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Productos publicados por empresas en el marketplace';
", "Tabla <strong>productos_jja</strong>", $cnt_tablas_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `solicitudes_prestamo_jja` (
    `id_solicitud_jja`    INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_producto_jja`     INT UNSIGNED NOT NULL,
    `id_cliente_jja`      INT UNSIGNED NOT NULL,
    `cantidad_jja`        INT UNSIGNED NOT NULL DEFAULT 1,
    `fecha_solicitud_jja` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `estado_jja`          ENUM('pendiente','aprobada','rechazada','cancelada') NOT NULL DEFAULT 'pendiente',
    `fecha_respuesta_jja` DATETIME     DEFAULT NULL,
    `observaciones_jja`   TEXT         DEFAULT NULL,
    PRIMARY KEY (`id_solicitud_jja`),
    CONSTRAINT `fk_solicitud_producto_jja` FOREIGN KEY (`id_producto_jja`) REFERENCES `productos_jja`  (`id_producto_jja`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_solicitud_cliente_jja`  FOREIGN KEY (`id_cliente_jja`)  REFERENCES `usuarios_jja`  (`id_usuario_jja`)  ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Solicitudes de préstamo/uso de producto por parte de clientes';
", "Tabla <strong>solicitudes_prestamo_jja</strong>", $cnt_tablas_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `ofertas_jja` (
    `id_oferta_jja`     INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    `id_solicitud_jja`  INT UNSIGNED  NOT NULL,
    `id_empresa_jja`    INT UNSIGNED  NOT NULL,
    `precio_oferta_jja` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `mensaje_jja`       TEXT          DEFAULT NULL,
    `estado_jja`        ENUM('pendiente','aceptada','rechazada') NOT NULL DEFAULT 'pendiente',
    `creado_en_jja`     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_oferta_jja`),
    CONSTRAINT `fk_oferta_solicitud_jja` FOREIGN KEY (`id_solicitud_jja`) REFERENCES `solicitudes_prestamo_jja` (`id_solicitud_jja`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_oferta_empresa_jja`   FOREIGN KEY (`id_empresa_jja`)   REFERENCES `usuarios_jja`             (`id_usuario_jja`)  ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Ofertas/contrapropuestas hechas por la empresa para una solicitud';
", "Tabla <strong>ofertas_jja</strong>", $cnt_tablas_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `transacciones_jja` (
    `id_transaccion_jja` INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    `id_solicitud_jja`   INT UNSIGNED  NOT NULL,
    `id_cliente_jja`     INT UNSIGNED  NOT NULL,
    `monto_jja`          DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `metodo_pago_jja`    VARCHAR(100)  DEFAULT NULL,
    `referencia_jja`     VARCHAR(255)  DEFAULT NULL,
    `estado_jja`         ENUM('pendiente','completado','fallido','reembolsado') NOT NULL DEFAULT 'pendiente',
    `creado_en_jja`      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_transaccion_jja`),
    CONSTRAINT `fk_transaccion_solicitud_jja` FOREIGN KEY (`id_solicitud_jja`) REFERENCES `solicitudes_prestamo_jja` (`id_solicitud_jja`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_transaccion_cliente_jja`   FOREIGN KEY (`id_cliente_jja`)   REFERENCES `usuarios_jja`             (`id_usuario_jja`)  ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Transacciones monetarias relacionadas a solicitudes/ofertas';
", "Tabla <strong>transacciones_jja</strong>", $cnt_tablas_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `prestamos_productos_jja` (
    `id_prestamo_producto_jja` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_producto_jja`          INT UNSIGNED NOT NULL,
    `id_cliente_jja`           INT UNSIGNED NOT NULL,
    `id_empresa_jja`           INT UNSIGNED NOT NULL,
    `fecha_prestamo_jja`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_devolucion_jja`     DATETIME     DEFAULT NULL,
    `estado_jja`               ENUM('activo','devuelto','vencido') NOT NULL DEFAULT 'activo',
    `observaciones_jja`        TEXT         DEFAULT NULL,
    PRIMARY KEY (`id_prestamo_producto_jja`),
    CONSTRAINT `fk_prestprod_producto_jja` FOREIGN KEY (`id_producto_jja`) REFERENCES `productos_jja`  (`id_producto_jja`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_prestprod_cliente_jja`  FOREIGN KEY (`id_cliente_jja`)  REFERENCES `usuarios_jja`  (`id_usuario_jja`)  ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_prestprod_empresa_jja`  FOREIGN KEY (`id_empresa_jja`)  REFERENCES `usuarios_jja`  (`id_usuario_jja`)  ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Registros de préstamos generados a partir de solicitudes de productos (marketplace)';
", "Tabla <strong>prestamos_productos_jja</strong>", $cnt_tablas_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `solicitudes_devolucion_jja` (
    `id_solicitud_devolucion_jja` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_prestamo_jja`             INT UNSIGNED NOT NULL,
    `id_usuario_solicitante_jja`  INT UNSIGNED NOT NULL,
    `estado_jja`                  ENUM('pendiente','en_proceso','aprobada','rechazada','cancelada') NOT NULL DEFAULT 'pendiente',
    `observaciones_jja`           TEXT         DEFAULT NULL,
    `creado_en_jja`               TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_respuesta_jja`         TIMESTAMP    NULL DEFAULT NULL,
    `respondido_por_jja`          INT UNSIGNED DEFAULT NULL,
    PRIMARY KEY (`id_solicitud_devolucion_jja`),
    CONSTRAINT `fk_soldev_prestamo_jja` FOREIGN KEY (`id_prestamo_jja`)            REFERENCES `prestamos_jja` (`id_prestamo_jja`) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT `fk_soldev_usuario_jja`  FOREIGN KEY (`id_usuario_solicitante_jja`) REFERENCES `usuarios_jja`  (`id_usuario_jja`)  ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Solicitudes generadas por clientes para solicitar la devolución de un préstamo';
", "Tabla <strong>solicitudes_devolucion_jja</strong>", $cnt_tablas_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `solicitudes_devolucion_productos_jja` (
    `id_solicitud_devolucion_producto_jja` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_prestamo_producto_jja`             INT UNSIGNED NOT NULL,
    `id_usuario_solicitante_jja`           INT UNSIGNED NOT NULL,
    `estado_jja`                           ENUM('pendiente','aprobada','rechazada','cancelada') NOT NULL DEFAULT 'pendiente',
    `observaciones_jja`                    TEXT         DEFAULT NULL,
    `creado_en_jja`                        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_respuesta_jja`                  DATETIME     DEFAULT NULL,
    `respondido_por_jja`                   INT UNSIGNED DEFAULT NULL,
    PRIMARY KEY (`id_solicitud_devolucion_producto_jja`),
    CONSTRAINT `fk_soldevprod_prestamo_jja` FOREIGN KEY (`id_prestamo_producto_jja`)    REFERENCES `prestamos_productos_jja` (`id_prestamo_producto_jja`) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT `fk_soldevprod_usuario_jja`  FOREIGN KEY (`id_usuario_solicitante_jja`) REFERENCES `usuarios_jja`            (`id_usuario_jja`)           ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Solicitudes de devolución para préstamos generados desde marketplace';
", "Tabla <strong>solicitudes_devolucion_productos_jja</strong>", $cnt_tablas_jja, $errores_jja);

        cierre_seccion_jja();

        // ══════════════════════════════════════════════════════
        // 3. ÍNDICES
        // ══════════════════════════════════════════════════════
        seccion_jja('3', 'Índices de Rendimiento');

        $indices_jja = [
            ["CREATE INDEX `idx_activo_estado_jja`           ON `activos_jja`             (`estado_jja`)",                               "Índice: activos_jja · estado_jja"],
            ["CREATE INDEX `idx_prestamo_estado_jja`         ON `prestamos_jja`           (`estado_prestamo_jja`)",                       "Índice: prestamos_jja · estado_prestamo_jja"],
            ["CREATE INDEX `idx_prestamo_fecha_limite_jja`   ON `prestamos_jja`           (`fecha_limite_jja`)",                          "Índice: prestamos_jja · fecha_limite_jja"],
            ["CREATE INDEX `idx_prestamo_usuario_jja`        ON `prestamos_jja`           (`id_usuario_jja`)",                            "Índice: prestamos_jja · id_usuario_jja"],
            ["CREATE INDEX `idx_prestamo_activo_jja`         ON `prestamos_jja`           (`id_activo_jja`)",                             "Índice: prestamos_jja · id_activo_jja"],
            ["CREATE INDEX `idx_historial_prestamo_jja`      ON `historial_prestamos_jja` (`id_prestamo_jja`)",                           "Índice: historial_prestamos_jja · id_prestamo_jja"],
            ["CREATE INDEX `idx_notif_usuario_leida_jja`     ON `notificaciones_jja`      (`id_usuario_jja`, `leida_jja`)",               "Índice compuesto: notificaciones_jja · usuario + leida"],
            ["CREATE INDEX `idx_lista_negra_usuario_jja`     ON `lista_negra_jja`         (`id_usuario_jja`, `activa_jja`)",              "Índice compuesto: lista_negra_jja · usuario + activa"],
            ["CREATE INDEX `idx_auditoria_tabla_jja`         ON `auditoria_jja`           (`tabla_afectada_jja`)",                        "Índice: auditoria_jja · tabla_afectada_jja"],
            ["CREATE INDEX `idx_auditoria_fecha_jja`         ON `auditoria_jja`           (`fecha_accion_jja`)",                          "Índice: auditoria_jja · fecha_accion_jja"],
            ["CREATE INDEX `idx_prestamo_usuario_estado_jja` ON `prestamos_jja`           (`id_usuario_jja`, `estado_prestamo_jja`)",     "Índice compuesto: prestamos_jja · usuario + estado"],
        ];

        foreach ($indices_jja as $idx_jja) {
            try {
                $pdo_jja->exec($idx_jja[0]);
                mostrar_jja('ok', '✅', $idx_jja[1]);
                $cnt_indices_jja++;
            } catch (PDOException $e) {
                if ($e->getCode() == '42000' || strpos($e->getMessage(), '1061') !== false) {
                    mostrar_jja('ok', '✅', $idx_jja[1] . " <em>(ya existía)</em>");
                    $cnt_indices_jja++;
                } else {
                    mostrar_jja('err', '❌', "ERROR — {$idx_jja[1]}: " . $e->getMessage());
                    $errores_jja++;
                }
            }
        }

        cierre_seccion_jja();

        // ══════════════════════════════════════════════════════
        // 4. STORED PROCEDURES
        // ══════════════════════════════════════════════════════
        seccion_jja('4', 'Stored Procedures &mdash; CRUD · Transacciones · Lógica de Negocio');

        mostrar_jja('info', 'ℹ️', "Eliminando SPs existentes para garantizar idempotencia…");

        $sps_a_eliminar_jja = [
            'SP_CREAR_ROL_jja','SP_LEER_ROLES_jja','SP_LEER_ROL_ID_jja','SP_ACTUALIZAR_ROL_jja','SP_ELIMINAR_ROL_jja',
            'SP_CREAR_USUARIO_jja','SP_LEER_USUARIOS_jja','SP_LEER_USUARIO_ID_jja','SP_LEER_USUARIO_CEDULA_jja',
            'SP_ACTUALIZAR_USUARIO_jja','SP_ELIMINAR_USUARIO_jja','SP_CAMBIAR_CONTRASENA_jja','SP_ACTUALIZAR_IMAGEN_USUARIO_jja',
            'SP_CREAR_TIPO_ACTIVO_jja','SP_LEER_TIPOS_ACTIVOS_jja','SP_LEER_TIPO_ACTIVO_ID_jja','SP_ACTUALIZAR_TIPO_ACTIVO_jja','SP_ELIMINAR_TIPO_ACTIVO_jja',
            'SP_CREAR_POLITICA_jja','SP_LEER_POLITICAS_jja','SP_LEER_POLITICA_TIPO_jja','SP_ACTUALIZAR_POLITICA_jja','SP_ELIMINAR_POLITICA_jja',
            'SP_CREAR_ACTIVO_jja','SP_LEER_ACTIVOS_jja','SP_LEER_ACTIVO_ID_jja','SP_LEER_ACTIVO_QR_jja','SP_LEER_ACTIVO_NFC_jja',
            'SP_ACTUALIZAR_ACTIVO_jja','SP_ACTUALIZAR_ESTADO_ACTIVO_jja','SP_ELIMINAR_ACTIVO_jja',
            'SP_REGISTRAR_PRESTAMO_jja','SP_REGISTRAR_DEVOLUCION_jja','SP_LEER_PRESTAMOS_jja','SP_LEER_PRESTAMO_ID_jja',
            'SP_LEER_PRESTAMOS_USUARIO_jja','SP_LEER_PRESTAMOS_ACTIVOS_jja','SP_LEER_PRESTAMOS_POR_ACTIVO_jja',
            'SP_LEER_PRESTAMOS_VENCIDOS_jja','SP_MARCAR_PRESTAMO_PERDIDO_jja','SP_ACTUALIZAR_VENCIDOS_jja',
            'SP_CREAR_NOTIFICACION_jja','SP_LEER_NOTIFICACIONES_USUARIO_jja','SP_MARCAR_NOTIFICACION_LEIDA_jja',
            'SP_MARCAR_TODAS_LEIDAS_jja','SP_ELIMINAR_NOTIFICACION_jja',
            'SP_CREAR_SANCION_jja','SP_LEER_SANCIONES_jja','SP_LEER_SANCIONES_USUARIO_jja','SP_LEVANTAR_SANCION_jja',
            'SP_VERIFICAR_SANCION_jja','SP_VERIFICAR_SANCION_DETALLE_jja','SP_AUTO_SANCIONAR_VENCIDOS_jja',
            'SP_LEER_AUDITORIA_jja','SP_LEER_AUDITORIA_TABLA_jja','SP_LEER_AUDITORIA_USUARIO_jja','SP_REGISTRAR_AUDITORIA_jja',
            'SP_INVALIDAR_TOKEN_jja','SP_VERIFICAR_TOKEN_INVALIDO_jja','SP_LIMPIAR_TOKENS_jja',
            'SP_REPORTE_PRESTAMOS_jja','SP_REPORTE_ACTIVOS_MAS_PRESTADOS_jja','SP_REPORTE_USUARIOS_ACTIVOS_jja','SP_REPORTE_TASA_DEVOLUCION_jja',
            'SP_LEER_USUARIO_CORREO_jja',
        ];
        foreach ($sps_a_eliminar_jja as $sp_jja) {
            try { $pdo_jja->exec("DROP PROCEDURE IF EXISTS `{$sp_jja}`"); } catch (PDOException $e) {}
        }
        mostrar_jja('ok', '✅', "SPs existentes eliminados correctamente.");

        // ROLES
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_CREAR_ROL_jja`(IN p_nombre_jja VARCHAR(50), IN p_descripcion_jja VARCHAR(255)) BEGIN INSERT INTO `roles_jja` (`nombre_rol_jja`, `descripcion_jja`) VALUES (p_nombre_jja, p_descripcion_jja); SELECT LAST_INSERT_ID() AS `id_rol_jja`; END", "SP: SP_CREAR_ROL_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_ROLES_jja`() BEGIN SELECT `id_rol_jja`, `nombre_rol_jja`, `descripcion_jja`, `estado_registro_jja`, `creado_en_jja` FROM `roles_jja` WHERE `estado_registro_jja` = 1 ORDER BY `id_rol_jja`; END", "SP: SP_LEER_ROLES_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_ROL_ID_jja`(IN p_id_jja INT UNSIGNED) BEGIN SELECT `id_rol_jja`, `nombre_rol_jja`, `descripcion_jja`, `estado_registro_jja`, `creado_en_jja` FROM `roles_jja` WHERE `id_rol_jja` = p_id_jja AND `estado_registro_jja` = 1; END", "SP: SP_LEER_ROL_ID_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_ACTUALIZAR_ROL_jja`(IN p_id_jja INT UNSIGNED, IN p_nombre_jja VARCHAR(50), IN p_descripcion_jja VARCHAR(255)) BEGIN UPDATE `roles_jja` SET `nombre_rol_jja` = p_nombre_jja, `descripcion_jja` = p_descripcion_jja WHERE `id_rol_jja` = p_id_jja; SELECT ROW_COUNT() AS `filas_afectadas`; END", "SP: SP_ACTUALIZAR_ROL_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_ELIMINAR_ROL_jja`(IN p_id_jja INT UNSIGNED) BEGIN UPDATE `roles_jja` SET `estado_registro_jja` = 0 WHERE `id_rol_jja` = p_id_jja; SELECT ROW_COUNT() AS `filas_afectadas`; END", "SP: SP_ELIMINAR_ROL_jja (soft delete)", $cnt_sp_jja, $errores_jja);

        // USUARIOS
        ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_CREAR_USUARIO_jja`(IN p_nombre_jja VARCHAR(100), IN p_apellido_jja VARCHAR(100), IN p_cedula_jja VARCHAR(20), IN p_correo_jja VARCHAR(150), IN p_telefono_jja VARCHAR(20), IN p_contrasena_jja VARCHAR(255), IN p_imagen_jja VARCHAR(255), IN p_id_rol_jja INT UNSIGNED, IN p_debe_cambiar_jja TINYINT(1))
BEGIN
    DECLARE v_existe_cedula INT DEFAULT 0;
    DECLARE v_existe_correo INT DEFAULT 0;
    SELECT COUNT(*) INTO v_existe_cedula FROM `usuarios_jja` WHERE `cedula_jja` = p_cedula_jja AND `estado_registro_jja` = 1;
    SELECT COUNT(*) INTO v_existe_correo FROM `usuarios_jja` WHERE `correo_jja`  = p_correo_jja  AND `estado_registro_jja` = 1;
    IF v_existe_cedula > 0 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La cédula ya está registrada en el sistema.';
    ELSEIF v_existe_correo > 0 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El correo ya está registrado en el sistema.';
    ELSE
        INSERT INTO `usuarios_jja` (`nombre_jja`,`apellido_jja`,`cedula_jja`,`correo_jja`,`telefono_jja`,`contrasena_jja`,`imagen_jja`,`id_rol_jja`,`debe_cambiar_clave_jja`) VALUES (p_nombre_jja,p_apellido_jja,p_cedula_jja,p_correo_jja,p_telefono_jja,p_contrasena_jja,p_imagen_jja,p_id_rol_jja,p_debe_cambiar_jja);
        SELECT LAST_INSERT_ID() AS `id_usuario_jja`;
    END IF;
END", "SP: SP_CREAR_USUARIO_jja (validación de duplicados)", $cnt_sp_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_USUARIOS_jja`() BEGIN SELECT usu.`id_usuario_jja`,usu.`nombre_jja`,usu.`apellido_jja`,usu.`cedula_jja`,usu.`correo_jja`,usu.`telefono_jja`,usu.`imagen_jja`,usu.`id_rol_jja`,rol.`nombre_rol_jja`,usu.`estado_registro_jja`,usu.`creado_en_jja`,usu.`debe_cambiar_clave_jja` FROM `usuarios_jja` usu INNER JOIN `roles_jja` rol ON usu.`id_rol_jja`=rol.`id_rol_jja` WHERE usu.`estado_registro_jja`=1 ORDER BY usu.`apellido_jja`,usu.`nombre_jja`; END", "SP: SP_LEER_USUARIOS_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_USUARIO_ID_jja`(IN p_id_jja INT UNSIGNED) BEGIN SELECT usu.`id_usuario_jja`,usu.`nombre_jja`,usu.`apellido_jja`,usu.`cedula_jja`,usu.`correo_jja`,usu.`telefono_jja`,usu.`imagen_jja`,usu.`id_rol_jja`,rol.`nombre_rol_jja`,usu.`estado_registro_jja`,usu.`creado_en_jja`,usu.`debe_cambiar_clave_jja` FROM `usuarios_jja` usu INNER JOIN `roles_jja` rol ON usu.`id_rol_jja`=rol.`id_rol_jja` WHERE usu.`id_usuario_jja`=p_id_jja AND usu.`estado_registro_jja`=1; END", "SP: SP_LEER_USUARIO_ID_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_USUARIO_CEDULA_jja`(IN p_cedula_jja VARCHAR(20)) BEGIN SELECT usu.`id_usuario_jja`,usu.`nombre_jja`,usu.`apellido_jja`,usu.`cedula_jja`,usu.`correo_jja`,usu.`telefono_jja`,usu.`contrasena_jja`,usu.`imagen_jja`,usu.`id_rol_jja`,rol.`nombre_rol_jja`,usu.`estado_registro_jja`,usu.`debe_cambiar_clave_jja` FROM `usuarios_jja` usu INNER JOIN `roles_jja` rol ON usu.`id_rol_jja`=rol.`id_rol_jja` WHERE usu.`cedula_jja`=p_cedula_jja AND usu.`estado_registro_jja`=1; END", "SP: SP_LEER_USUARIO_CEDULA_jja (login)", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_USUARIO_CORREO_jja`(IN p_correo_jja VARCHAR(150)) BEGIN SELECT usu.`id_usuario_jja`,usu.`nombre_jja`,usu.`apellido_jja`,usu.`cedula_jja`,usu.`correo_jja`,usu.`telefono_jja`,usu.`contrasena_jja`,usu.`imagen_jja`,usu.`id_rol_jja`,rol.`nombre_rol_jja`,usu.`estado_registro_jja`,usu.`debe_cambiar_clave_jja` FROM `usuarios_jja` usu INNER JOIN `roles_jja` rol ON usu.`id_rol_jja`=rol.`id_rol_jja` WHERE usu.`correo_jja`=p_correo_jja AND usu.`estado_registro_jja`=1; END", "SP: SP_LEER_USUARIO_CORREO_jja (login por correo)", $cnt_sp_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_ACTUALIZAR_USUARIO_jja`(IN p_id_jja INT UNSIGNED, IN p_nombre_jja VARCHAR(100), IN p_apellido_jja VARCHAR(100), IN p_cedula_jja VARCHAR(20), IN p_correo_jja VARCHAR(150), IN p_telefono_jja VARCHAR(20), IN p_id_rol_jja INT UNSIGNED)
BEGIN
    DECLARE v_correo_dup INT DEFAULT 0; DECLARE v_cedula_dup INT DEFAULT 0;
    SELECT COUNT(*) INTO v_correo_dup FROM `usuarios_jja` WHERE `correo_jja`=p_correo_jja AND `id_usuario_jja`<>p_id_jja AND `estado_registro_jja`=1;
    SELECT COUNT(*) INTO v_cedula_dup FROM `usuarios_jja` WHERE `cedula_jja`=p_cedula_jja AND `id_usuario_jja`<>p_id_jja AND `estado_registro_jja`=1;
    IF v_correo_dup > 0 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El correo ya está en uso por otro usuario.';
    ELSEIF v_cedula_dup > 0 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La cédula ya está en uso por otro usuario.';
    ELSE UPDATE `usuarios_jja` SET `nombre_jja`=p_nombre_jja,`apellido_jja`=p_apellido_jja,`cedula_jja`=p_cedula_jja,`correo_jja`=p_correo_jja,`telefono_jja`=p_telefono_jja,`id_rol_jja`=p_id_rol_jja WHERE `id_usuario_jja`=p_id_jja AND `estado_registro_jja`=1; SELECT ROW_COUNT() AS `filas_afectadas`; END IF;
END", "SP: SP_ACTUALIZAR_USUARIO_jja", $cnt_sp_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_ELIMINAR_USUARIO_jja`(IN p_id_jja INT UNSIGNED) BEGIN UPDATE `usuarios_jja` SET `estado_registro_jja`=0 WHERE `id_usuario_jja`=p_id_jja; SELECT ROW_COUNT() AS `filas_afectadas`; END", "SP: SP_ELIMINAR_USUARIO_jja (soft delete)", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_CAMBIAR_CONTRASENA_jja`(IN p_id_jja INT UNSIGNED, IN p_nueva_hash_jja VARCHAR(255)) BEGIN UPDATE `usuarios_jja` SET `contrasena_jja`=p_nueva_hash_jja,`debe_cambiar_clave_jja`=0 WHERE `id_usuario_jja`=p_id_jja AND `estado_registro_jja`=1; SELECT ROW_COUNT() AS `filas_afectadas`; END", "SP: SP_CAMBIAR_CONTRASENA_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_ACTUALIZAR_IMAGEN_USUARIO_jja`(IN p_id_jja INT UNSIGNED, IN p_imagen_jja VARCHAR(255)) BEGIN UPDATE `usuarios_jja` SET `imagen_jja`=p_imagen_jja WHERE `id_usuario_jja`=p_id_jja AND `estado_registro_jja`=1; SELECT ROW_COUNT() AS `filas_afectadas`; END", "SP: SP_ACTUALIZAR_IMAGEN_USUARIO_jja", $cnt_sp_jja, $errores_jja);

        // TIPOS ACTIVOS
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_CREAR_TIPO_ACTIVO_jja`(IN p_nombre_jja VARCHAR(100), IN p_descripcion_jja VARCHAR(255)) BEGIN INSERT INTO `tipos_activos_jja` (`nombre_tipo_jja`,`descripcion_jja`) VALUES (p_nombre_jja,p_descripcion_jja); SELECT LAST_INSERT_ID() AS `id_tipo_jja`; END", "SP: SP_CREAR_TIPO_ACTIVO_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_TIPOS_ACTIVOS_jja`() BEGIN SELECT `id_tipo_jja`,`nombre_tipo_jja`,`descripcion_jja`,`estado_registro_jja`,`creado_en_jja` FROM `tipos_activos_jja` WHERE `estado_registro_jja`=1 ORDER BY `nombre_tipo_jja`; END", "SP: SP_LEER_TIPOS_ACTIVOS_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_TIPO_ACTIVO_ID_jja`(IN p_id_jja INT UNSIGNED) BEGIN SELECT `id_tipo_jja`,`nombre_tipo_jja`,`descripcion_jja`,`estado_registro_jja`,`creado_en_jja` FROM `tipos_activos_jja` WHERE `id_tipo_jja`=p_id_jja AND `estado_registro_jja`=1; END", "SP: SP_LEER_TIPO_ACTIVO_ID_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_ACTUALIZAR_TIPO_ACTIVO_jja`(IN p_id_jja INT UNSIGNED, IN p_nombre_jja VARCHAR(100), IN p_descripcion_jja VARCHAR(255)) BEGIN UPDATE `tipos_activos_jja` SET `nombre_tipo_jja`=p_nombre_jja,`descripcion_jja`=p_descripcion_jja WHERE `id_tipo_jja`=p_id_jja; SELECT ROW_COUNT() AS `filas_afectadas`; END", "SP: SP_ACTUALIZAR_TIPO_ACTIVO_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_ELIMINAR_TIPO_ACTIVO_jja`(IN p_id_jja INT UNSIGNED) BEGIN UPDATE `tipos_activos_jja` SET `estado_registro_jja`=0 WHERE `id_tipo_jja`=p_id_jja; SELECT ROW_COUNT() AS `filas_afectadas`; END", "SP: SP_ELIMINAR_TIPO_ACTIVO_jja (soft delete)", $cnt_sp_jja, $errores_jja);

        // POLÍTICAS
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_CREAR_POLITICA_jja`(IN p_id_tipo_jja INT UNSIGNED, IN p_dias_maximo_jja TINYINT UNSIGNED, IN p_max_simultaneos_jja TINYINT UNSIGNED, IN p_requiere_mismo_dia_jja TINYINT(1)) BEGIN INSERT INTO `politicas_prestamo_jja` (`id_tipo_jja`,`dias_maximo_jja`,`max_prestamos_simultaneos_jja`,`requiere_mismo_dia_jja`) VALUES (p_id_tipo_jja,p_dias_maximo_jja,p_max_simultaneos_jja,p_requiere_mismo_dia_jja); SELECT LAST_INSERT_ID() AS `id_politica_jja`; END", "SP: SP_CREAR_POLITICA_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_POLITICAS_jja`() BEGIN SELECT pol.`id_politica_jja`,pol.`id_tipo_jja`,tip.`nombre_tipo_jja`,pol.`dias_maximo_jja`,pol.`max_prestamos_simultaneos_jja`,pol.`requiere_mismo_dia_jja` FROM `politicas_prestamo_jja` pol INNER JOIN `tipos_activos_jja` tip ON pol.`id_tipo_jja`=tip.`id_tipo_jja` WHERE pol.`estado_registro_jja`=1; END", "SP: SP_LEER_POLITICAS_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_POLITICA_TIPO_jja`(IN p_id_tipo_jja INT UNSIGNED) BEGIN SELECT `id_politica_jja`,`id_tipo_jja`,`dias_maximo_jja`,`max_prestamos_simultaneos_jja`,`requiere_mismo_dia_jja` FROM `politicas_prestamo_jja` WHERE `id_tipo_jja`=p_id_tipo_jja AND `estado_registro_jja`=1; END", "SP: SP_LEER_POLITICA_TIPO_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_ACTUALIZAR_POLITICA_jja`(IN p_id_jja INT UNSIGNED, IN p_dias_maximo_jja TINYINT UNSIGNED, IN p_max_simult_jja TINYINT UNSIGNED, IN p_mismo_dia_jja TINYINT(1)) BEGIN UPDATE `politicas_prestamo_jja` SET `dias_maximo_jja`=p_dias_maximo_jja,`max_prestamos_simultaneos_jja`=p_max_simult_jja,`requiere_mismo_dia_jja`=p_mismo_dia_jja WHERE `id_politica_jja`=p_id_jja; SELECT ROW_COUNT() AS `filas_afectadas`; END", "SP: SP_ACTUALIZAR_POLITICA_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_ELIMINAR_POLITICA_jja`(IN p_id_jja INT UNSIGNED) BEGIN UPDATE `politicas_prestamo_jja` SET `estado_registro_jja`=0 WHERE `id_politica_jja`=p_id_jja; SELECT ROW_COUNT() AS `filas_afectadas`; END", "SP: SP_ELIMINAR_POLITICA_jja (soft delete)", $cnt_sp_jja, $errores_jja);

        // ACTIVOS
        ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_CREAR_ACTIVO_jja`(IN p_nombre_jja VARCHAR(200), IN p_codigo_qr_jja VARCHAR(50), IN p_codigo_nfc_jja VARCHAR(50), IN p_id_tipo_jja INT UNSIGNED, IN p_ubicacion_jja VARCHAR(150), IN p_descripcion_jja TEXT)
BEGIN
    DECLARE v_existe_qr INT DEFAULT 0;
    SELECT COUNT(*) INTO v_existe_qr FROM `activos_jja` WHERE `codigo_qr_jja`=p_codigo_qr_jja AND `estado_registro_jja`=1;
    IF v_existe_qr > 0 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El código QR ya está asignado a otro activo.';
    ELSE INSERT INTO `activos_jja` (`nombre_jja`,`codigo_qr_jja`,`codigo_nfc_jja`,`id_tipo_jja`,`ubicacion_jja`,`descripcion_jja`) VALUES (p_nombre_jja,p_codigo_qr_jja,p_codigo_nfc_jja,p_id_tipo_jja,p_ubicacion_jja,p_descripcion_jja); SELECT LAST_INSERT_ID() AS `id_activo_jja`; END IF;
END", "SP: SP_CREAR_ACTIVO_jja", $cnt_sp_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_ACTIVOS_jja`() BEGIN SELECT actv.`id_activo_jja`,actv.`nombre_jja`,actv.`codigo_qr_jja`,actv.`codigo_nfc_jja`,actv.`id_tipo_jja`,tipo.`nombre_tipo_jja`,actv.`ubicacion_jja`,actv.`descripcion_jja`,actv.`estado_jja`,actv.`estado_registro_jja`,actv.`creado_en_jja` FROM `activos_jja` actv INNER JOIN `tipos_activos_jja` tipo ON actv.`id_tipo_jja`=tipo.`id_tipo_jja` WHERE actv.`estado_registro_jja`=1 ORDER BY actv.`nombre_jja`; END", "SP: SP_LEER_ACTIVOS_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_ACTIVO_ID_jja`(IN p_id_jja INT UNSIGNED) BEGIN SELECT actv.`id_activo_jja`,actv.`nombre_jja`,actv.`codigo_qr_jja`,actv.`codigo_nfc_jja`,actv.`id_tipo_jja`,tipo.`nombre_tipo_jja`,actv.`ubicacion_jja`,actv.`descripcion_jja`,actv.`estado_jja`,actv.`creado_en_jja` FROM `activos_jja` actv INNER JOIN `tipos_activos_jja` tipo ON actv.`id_tipo_jja`=tipo.`id_tipo_jja` WHERE actv.`id_activo_jja`=p_id_jja AND actv.`estado_registro_jja`=1; END", "SP: SP_LEER_ACTIVO_ID_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_ACTIVO_QR_jja`(IN p_qr_jja VARCHAR(50)) BEGIN SELECT actv.`id_activo_jja`,actv.`nombre_jja`,actv.`codigo_qr_jja`,actv.`codigo_nfc_jja`,actv.`id_tipo_jja`,tipo.`nombre_tipo_jja`,actv.`ubicacion_jja`,actv.`descripcion_jja`,actv.`estado_jja` FROM `activos_jja` actv INNER JOIN `tipos_activos_jja` tipo ON actv.`id_tipo_jja`=tipo.`id_tipo_jja` WHERE actv.`codigo_qr_jja`=p_qr_jja AND actv.`estado_registro_jja`=1; END", "SP: SP_LEER_ACTIVO_QR_jja (escaneo QR)", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_ACTIVO_NFC_jja`(IN p_nfc_jja VARCHAR(50)) BEGIN SELECT actv.`id_activo_jja`,actv.`nombre_jja`,actv.`codigo_qr_jja`,actv.`codigo_nfc_jja`,actv.`id_tipo_jja`,tipo.`nombre_tipo_jja`,actv.`ubicacion_jja`,actv.`descripcion_jja`,actv.`estado_jja` FROM `activos_jja` actv INNER JOIN `tipos_activos_jja` tipo ON actv.`id_tipo_jja`=tipo.`id_tipo_jja` WHERE actv.`codigo_nfc_jja`=p_nfc_jja AND actv.`estado_registro_jja`=1; END", "SP: SP_LEER_ACTIVO_NFC_jja (lectura NFC)", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_ACTUALIZAR_ACTIVO_jja`(IN p_id_jja INT UNSIGNED, IN p_nombre_jja VARCHAR(200), IN p_id_tipo_jja INT UNSIGNED, IN p_ubicacion_jja VARCHAR(150), IN p_descripcion_jja TEXT) BEGIN UPDATE `activos_jja` SET `nombre_jja`=p_nombre_jja,`id_tipo_jja`=p_id_tipo_jja,`ubicacion_jja`=p_ubicacion_jja,`descripcion_jja`=p_descripcion_jja WHERE `id_activo_jja`=p_id_jja AND `estado_registro_jja`=1; SELECT ROW_COUNT() AS `filas_afectadas`; END", "SP: SP_ACTUALIZAR_ACTIVO_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_ACTUALIZAR_ESTADO_ACTIVO_jja`(IN p_id_jja INT UNSIGNED, IN p_estado_jja ENUM('disponible','prestado','en_proceso_prestamo','mantenimiento','dañado','perdido')) BEGIN UPDATE `activos_jja` SET `estado_jja`=p_estado_jja WHERE `id_activo_jja`=p_id_jja AND `estado_registro_jja`=1; SELECT ROW_COUNT() AS `filas_afectadas`; END", "SP: SP_ACTUALIZAR_ESTADO_ACTIVO_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_ELIMINAR_ACTIVO_jja`(IN p_id_jja INT UNSIGNED)
BEGIN
    DECLARE v_prestado INT DEFAULT 0;
    SELECT COUNT(*) INTO v_prestado FROM `prestamos_jja` WHERE `id_activo_jja`=p_id_jja AND `estado_prestamo_jja`='activo';
    IF v_prestado > 0 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede eliminar un activo con un préstamo activo.';
    ELSE UPDATE `activos_jja` SET `estado_registro_jja`=0 WHERE `id_activo_jja`=p_id_jja; SELECT ROW_COUNT() AS `filas_afectadas`; END IF;
END", "SP: SP_ELIMINAR_ACTIVO_jja (soft delete · valida préstamo activo)", $cnt_sp_jja, $errores_jja);

        // PRÉSTAMOS (completos con transacciones)
        ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_REGISTRAR_PRESTAMO_jja`(IN p_id_activo_jja INT UNSIGNED, IN p_id_usuario_jja INT UNSIGNED, IN p_id_encargado_jja INT UNSIGNED, IN p_observaciones_jja TEXT)
BEGIN
    DECLARE v_estado_activo VARCHAR(20) DEFAULT ''; DECLARE v_id_tipo INT UNSIGNED DEFAULT 0;
    DECLARE v_dias_max TINYINT DEFAULT 7; DECLARE v_sancion_activa INT DEFAULT 0;
    DECLARE v_prestamos_activos INT DEFAULT 0; DECLARE v_max_simult TINYINT DEFAULT 1;
    DECLARE v_id_prestamo_nuevo INT UNSIGNED DEFAULT 0; DECLARE v_mismo_dia TINYINT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK; RESIGNAL; END;
    START TRANSACTION;
    SELECT `estado_jja`,`id_tipo_jja` INTO v_estado_activo,v_id_tipo FROM `activos_jja` WHERE `id_activo_jja`=p_id_activo_jja AND `estado_registro_jja`=1 FOR UPDATE;
    IF v_estado_activo IS NULL THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='El activo no existe o fue eliminado.'; END IF;
    IF v_estado_activo NOT IN ('disponible','en_proceso_prestamo') THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='El activo no está disponible para préstamo.'; END IF;
    SELECT COUNT(*) INTO v_sancion_activa FROM `lista_negra_jja` WHERE `id_usuario_jja`=p_id_usuario_jja AND `activa_jja`=1 AND (`fecha_fin_sancion_jja` IS NULL OR `fecha_fin_sancion_jja`>NOW());
    IF v_sancion_activa > 0 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='El usuario tiene una sanción activa y no puede recibir préstamos.'; END IF;
    SELECT `dias_maximo_jja`,`max_prestamos_simultaneos_jja`,`requiere_mismo_dia_jja` INTO v_dias_max,v_max_simult,v_mismo_dia FROM `politicas_prestamo_jja` WHERE `id_tipo_jja`=v_id_tipo AND `estado_registro_jja`=1;
    IF v_mismo_dia=1 THEN SET v_dias_max=0; END IF;
    SELECT COUNT(*) INTO v_prestamos_activos FROM `prestamos_jja` prest INNER JOIN `activos_jja` actv ON prest.`id_activo_jja`=actv.`id_activo_jja` WHERE prest.`id_usuario_jja`=p_id_usuario_jja AND prest.`estado_prestamo_jja`='activo' AND actv.`id_tipo_jja`=v_id_tipo;
    IF v_prestamos_activos>=v_max_simult THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='El usuario superó el límite de préstamos simultáneos para este tipo de activo.'; END IF;
    INSERT INTO `prestamos_jja` (`id_activo_jja`,`id_usuario_jja`,`id_encargado_jja`,`fecha_limite_jja`,`observaciones_jja`) VALUES (p_id_activo_jja,p_id_usuario_jja,p_id_encargado_jja,DATE_ADD(NOW(),INTERVAL v_dias_max DAY),p_observaciones_jja);
    SET v_id_prestamo_nuevo=LAST_INSERT_ID();
    UPDATE `activos_jja` SET `estado_jja`='prestado' WHERE `id_activo_jja`=p_id_activo_jja;
    INSERT INTO `historial_prestamos_jja` (`id_prestamo_jja`,`id_activo_jja`,`id_usuario_jja`,`accion_jja`,`detalles_jja`) VALUES (v_id_prestamo_nuevo,p_id_activo_jja,p_id_usuario_jja,'checkout','Préstamo registrado correctamente.');
    COMMIT;
    SELECT v_id_prestamo_nuevo AS `id_prestamo_jja`, v_dias_max AS `dias_prestamo_jja`;
END", "SP: SP_REGISTRAR_PRESTAMO_jja (transacción · valida sanción · límite simultáneos)", $cnt_sp_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_REGISTRAR_DEVOLUCION_jja`(IN p_id_prestamo_jja INT UNSIGNED, IN p_id_encargado_jja INT UNSIGNED, IN p_observaciones_jja TEXT)
BEGIN
    DECLARE v_id_activo INT UNSIGNED DEFAULT 0; DECLARE v_id_usuario INT UNSIGNED DEFAULT 0; DECLARE v_estado_prest VARCHAR(20) DEFAULT '';
    DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK; RESIGNAL; END;
    START TRANSACTION;
    SELECT `id_activo_jja`,`id_usuario_jja`,`estado_prestamo_jja` INTO v_id_activo,v_id_usuario,v_estado_prest FROM `prestamos_jja` WHERE `id_prestamo_jja`=p_id_prestamo_jja AND `estado_registro_jja`=1 FOR UPDATE;
    IF v_estado_prest IS NULL THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='El préstamo no existe.'; END IF;
    IF v_estado_prest NOT IN ('activo','vencido') THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='El préstamo ya fue cerrado o no está en estado válido para devolución.'; END IF;
    UPDATE `prestamos_jja` SET `estado_prestamo_jja`='devuelto',`fecha_devolucion_jja`=NOW(),`observaciones_jja`=COALESCE(p_observaciones_jja,`observaciones_jja`) WHERE `id_prestamo_jja`=p_id_prestamo_jja;
    UPDATE `activos_jja` SET `estado_jja`='disponible' WHERE `id_activo_jja`=v_id_activo;
    INSERT INTO `historial_prestamos_jja` (`id_prestamo_jja`,`id_activo_jja`,`id_usuario_jja`,`accion_jja`,`detalles_jja`) VALUES (p_id_prestamo_jja,v_id_activo,v_id_usuario,'checkin','Devolución registrada correctamente.');
    INSERT INTO `notificaciones_jja` (`id_usuario_jja`,`id_prestamo_jja`,`tipo_notificacion_jja`,`titulo_jja`,`mensaje_jja`) VALUES (v_id_usuario,p_id_prestamo_jja,'devolucion_confirmada','Devolución confirmada',CONCAT('El activo ha sido devuelto correctamente. Fecha: ',DATE_FORMAT(NOW(),'%d/%m/%Y %H:%i')));
    COMMIT;
    SELECT 'Devolución registrada exitosamente.' AS `mensaje_jja`;
END", "SP: SP_REGISTRAR_DEVOLUCION_jja (transacción · notificación automática)", $cnt_sp_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_PRESTAMOS_jja`() BEGIN SELECT prest.`id_prestamo_jja`,prest.`id_activo_jja`,actv.`nombre_jja` AS `activo_nombre_jja`,actv.`codigo_qr_jja`,prest.`id_usuario_jja`,CONCAT(usu.`nombre_jja`,' ',usu.`apellido_jja`) AS `usuario_nombre_completo_jja`,usu.`cedula_jja`,CONCAT(enc.`nombre_jja`,' ',enc.`apellido_jja`) AS `encargado_nombre_jja`,prest.`fecha_prestamo_jja`,prest.`fecha_limite_jja`,prest.`fecha_devolucion_jja`,prest.`estado_prestamo_jja`,prest.`observaciones_jja` FROM `prestamos_jja` prest INNER JOIN `activos_jja` actv ON prest.`id_activo_jja`=actv.`id_activo_jja` INNER JOIN `usuarios_jja` usu ON prest.`id_usuario_jja`=usu.`id_usuario_jja` INNER JOIN `usuarios_jja` enc ON prest.`id_encargado_jja`=enc.`id_usuario_jja` WHERE prest.`estado_registro_jja`=1 ORDER BY prest.`fecha_prestamo_jja` DESC; END", "SP: SP_LEER_PRESTAMOS_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_PRESTAMO_ID_jja`(IN p_id_jja INT UNSIGNED) BEGIN SELECT prest.`id_prestamo_jja`,prest.`id_usuario_jja`,actv.`nombre_jja` AS `activo_nombre_jja`,actv.`codigo_qr_jja`,actv.`codigo_nfc_jja`,CONCAT(usu.`nombre_jja`,' ',usu.`apellido_jja`) AS `usuario_nombre_jja`,usu.`cedula_jja`,usu.`correo_jja`,prest.`fecha_prestamo_jja`,prest.`fecha_limite_jja`,prest.`fecha_devolucion_jja`,prest.`estado_prestamo_jja`,prest.`observaciones_jja` FROM `prestamos_jja` prest INNER JOIN `activos_jja` actv ON prest.`id_activo_jja`=actv.`id_activo_jja` INNER JOIN `usuarios_jja` usu ON prest.`id_usuario_jja`=usu.`id_usuario_jja` WHERE prest.`id_prestamo_jja`=p_id_jja AND prest.`estado_registro_jja`=1; END", "SP: SP_LEER_PRESTAMO_ID_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_PRESTAMOS_USUARIO_jja`(IN p_id_usuario_jja INT UNSIGNED) BEGIN SELECT prest.`id_prestamo_jja`,prest.`id_activo_jja`,actv.`nombre_jja` AS `activo_nombre_jja`,tipo.`nombre_tipo_jja`,actv.`codigo_qr_jja`,prest.`fecha_prestamo_jja`,prest.`fecha_limite_jja`,prest.`fecha_devolucion_jja`,prest.`estado_prestamo_jja` FROM `prestamos_jja` prest INNER JOIN `activos_jja` actv ON prest.`id_activo_jja`=actv.`id_activo_jja` INNER JOIN `tipos_activos_jja` tipo ON actv.`id_tipo_jja`=tipo.`id_tipo_jja` WHERE prest.`id_usuario_jja`=p_id_usuario_jja AND prest.`estado_registro_jja`=1 ORDER BY prest.`fecha_prestamo_jja` DESC; END", "SP: SP_LEER_PRESTAMOS_USUARIO_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_PRESTAMOS_ACTIVOS_jja`() BEGIN SELECT prest.`id_prestamo_jja`,actv.`nombre_jja` AS `activo_nombre_jja`,actv.`codigo_qr_jja`,CONCAT(usu.`nombre_jja`,' ',usu.`apellido_jja`) AS `usuario_nombre_jja`,usu.`cedula_jja`,usu.`correo_jja`,usu.`telefono_jja`,prest.`fecha_prestamo_jja`,prest.`fecha_limite_jja`,DATEDIFF(prest.`fecha_limite_jja`,NOW()) AS `dias_restantes_jja` FROM `prestamos_jja` prest INNER JOIN `activos_jja` actv ON prest.`id_activo_jja`=actv.`id_activo_jja` INNER JOIN `usuarios_jja` usu ON prest.`id_usuario_jja`=usu.`id_usuario_jja` WHERE prest.`estado_prestamo_jja`='activo' AND prest.`estado_registro_jja`=1 ORDER BY prest.`fecha_limite_jja` ASC; END", "SP: SP_LEER_PRESTAMOS_ACTIVOS_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_PRESTAMOS_POR_ACTIVO_jja`(IN p_id_activo_jja INT UNSIGNED) BEGIN SELECT prest.`id_prestamo_jja`,prest.`id_activo_jja`,actv.`nombre_jja` AS `activo_nombre_jja`,actv.`codigo_qr_jja`,CONCAT(usu.`nombre_jja`,' ',usu.`apellido_jja`) AS `usuario_nombre_jja`,usu.`cedula_jja`,usu.`correo_jja`,CONCAT(enc.`nombre_jja`,' ',enc.`apellido_jja`) AS `encargado_nombre_jja`,prest.`fecha_prestamo_jja`,prest.`fecha_limite_jja`,prest.`fecha_devolucion_jja`,prest.`estado_prestamo_jja`,prest.`observaciones_jja` FROM `prestamos_jja` prest INNER JOIN `activos_jja` actv ON prest.`id_activo_jja`=actv.`id_activo_jja` INNER JOIN `usuarios_jja` usu ON prest.`id_usuario_jja`=usu.`id_usuario_jja` INNER JOIN `usuarios_jja` enc ON prest.`id_encargado_jja`=enc.`id_usuario_jja` WHERE prest.`id_activo_jja`=p_id_activo_jja AND prest.`estado_registro_jja`=1 ORDER BY prest.`fecha_prestamo_jja` DESC; END", "SP: SP_LEER_PRESTAMOS_POR_ACTIVO_jja", $cnt_sp_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_PRESTAMOS_VENCIDOS_jja`()
BEGIN
    SELECT prest.`id_prestamo_jja`,prest.`id_activo_jja`,actv.`nombre_jja` AS `activo_nombre_jja`,actv.`codigo_qr_jja`,actv.`imagenes_jja` AS `activo_imagenes_jja`,prest.`id_usuario_jja`,CONCAT(usu.`nombre_jja`,' ',usu.`apellido_jja`) AS `usuario_nombre_jja`,usu.`nombre_jja` AS `usuario_nombre_solo_jja`,usu.`apellido_jja` AS `usuario_apellido_jja`,usu.`cedula_jja`,usu.`correo_jja`,usu.`telefono_jja`,usu.`imagen_jja` AS `usuario_imagen_jja`,prest.`fecha_prestamo_jja`,prest.`fecha_limite_jja`,prest.`estado_prestamo_jja`,DATEDIFF(CURDATE(),DATE(prest.`fecha_limite_jja`)) AS `dias_vencido_jja`
    FROM `prestamos_jja` prest INNER JOIN `activos_jja` actv ON prest.`id_activo_jja`=actv.`id_activo_jja` INNER JOIN `usuarios_jja` usu ON prest.`id_usuario_jja`=usu.`id_usuario_jja`
    WHERE (prest.`estado_prestamo_jja`='vencido' OR (prest.`estado_prestamo_jja`='activo' AND DATE(prest.`fecha_limite_jja`)<CURDATE())) AND prest.`estado_registro_jja`=1 ORDER BY prest.`fecha_limite_jja` ASC;
END", "SP: SP_LEER_PRESTAMOS_VENCIDOS_jja (panel de alertas)", $cnt_sp_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_ACTUALIZAR_VENCIDOS_jja`() BEGIN UPDATE `prestamos_jja` SET `estado_prestamo_jja`='vencido' WHERE `estado_prestamo_jja`='activo' AND DATE(`fecha_limite_jja`)<CURDATE(); SELECT ROW_COUNT() AS `prestamos_marcados_vencidos`; END", "SP: SP_ACTUALIZAR_VENCIDOS_jja (cron batch)", $cnt_sp_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_MARCAR_PRESTAMO_PERDIDO_jja`(IN p_id_prestamo_jja INT UNSIGNED, IN p_id_admin_jja INT UNSIGNED, IN p_motivo_jja TEXT)
BEGIN
    DECLARE v_id_activo INT UNSIGNED DEFAULT 0; DECLARE v_id_usuario INT UNSIGNED DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK; RESIGNAL; END;
    START TRANSACTION;
    SELECT `id_activo_jja`,`id_usuario_jja` INTO v_id_activo,v_id_usuario FROM `prestamos_jja` WHERE `id_prestamo_jja`=p_id_prestamo_jja FOR UPDATE;
    UPDATE `prestamos_jja` SET `estado_prestamo_jja`='perdido' WHERE `id_prestamo_jja`=p_id_prestamo_jja;
    UPDATE `activos_jja` SET `estado_jja`='perdido' WHERE `id_activo_jja`=v_id_activo;
    INSERT INTO `lista_negra_jja` (`id_usuario_jja`,`id_prestamo_jja`,`motivo_jja`,`creado_por_jja`) VALUES (v_id_usuario,p_id_prestamo_jja,p_motivo_jja,p_id_admin_jja);
    INSERT INTO `historial_prestamos_jja` (`id_prestamo_jja`,`id_activo_jja`,`id_usuario_jja`,`accion_jja`,`detalles_jja`) VALUES (p_id_prestamo_jja,v_id_activo,v_id_usuario,'perdida',p_motivo_jja);
    COMMIT;
    SELECT 'Activo marcado como perdido y usuario sancionado.' AS `mensaje_jja`;
END", "SP: SP_MARCAR_PRESTAMO_PERDIDO_jja (transacción · sanciona usuario)", $cnt_sp_jja, $errores_jja);

        // NOTIFICACIONES
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_CREAR_NOTIFICACION_jja`(IN p_id_usuario_jja INT UNSIGNED, IN p_id_prestamo_jja INT UNSIGNED, IN p_tipo_jja ENUM('vencimiento_proximo','vencido','devolucion_confirmada','sancion','informativo'), IN p_titulo_jja VARCHAR(200), IN p_mensaje_jja TEXT) BEGIN INSERT INTO `notificaciones_jja` (`id_usuario_jja`,`id_prestamo_jja`,`tipo_notificacion_jja`,`titulo_jja`,`mensaje_jja`) VALUES (p_id_usuario_jja,p_id_prestamo_jja,p_tipo_jja,p_titulo_jja,p_mensaje_jja); SELECT LAST_INSERT_ID() AS `id_notificacion_jja`; END", "SP: SP_CREAR_NOTIFICACION_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_NOTIFICACIONES_USUARIO_jja`(IN p_id_usuario_jja INT UNSIGNED) BEGIN SELECT `id_notificacion_jja`,`id_prestamo_jja`,`tipo_notificacion_jja`,`titulo_jja`,`mensaje_jja`,`leida_jja`,`enviada_correo_jja`,`creado_en_jja` FROM `notificaciones_jja` WHERE `id_usuario_jja`=p_id_usuario_jja ORDER BY `creado_en_jja` DESC; END", "SP: SP_LEER_NOTIFICACIONES_USUARIO_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_MARCAR_NOTIFICACION_LEIDA_jja`(IN p_id_jja INT UNSIGNED) BEGIN UPDATE `notificaciones_jja` SET `leida_jja`=1 WHERE `id_notificacion_jja`=p_id_jja; SELECT ROW_COUNT() AS `filas_afectadas`; END", "SP: SP_MARCAR_NOTIFICACION_LEIDA_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_MARCAR_TODAS_LEIDAS_jja`(IN p_id_usuario_jja INT UNSIGNED) BEGIN UPDATE `notificaciones_jja` SET `leida_jja`=1 WHERE `id_usuario_jja`=p_id_usuario_jja AND `leida_jja`=0; SELECT ROW_COUNT() AS `filas_afectadas`; END", "SP: SP_MARCAR_TODAS_LEIDAS_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_ELIMINAR_NOTIFICACION_jja`(IN p_id_jja INT UNSIGNED) BEGIN DELETE FROM `notificaciones_jja` WHERE `id_notificacion_jja`=p_id_jja; SELECT ROW_COUNT() AS `filas_afectadas`; END", "SP: SP_ELIMINAR_NOTIFICACION_jja", $cnt_sp_jja, $errores_jja);

        // LISTA NEGRA
        ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_CREAR_SANCION_jja`(IN p_id_usuario_jja INT UNSIGNED, IN p_id_prestamo_jja INT UNSIGNED, IN p_motivo_jja TEXT, IN p_dias_sancion_jja INT, IN p_admin_jja INT UNSIGNED)
BEGIN
    DECLARE v_fecha_fin TIMESTAMP DEFAULT NULL;
    IF p_dias_sancion_jja > 0 THEN SET v_fecha_fin=DATE_ADD(NOW(),INTERVAL p_dias_sancion_jja DAY); END IF;
    INSERT INTO `lista_negra_jja` (`id_usuario_jja`,`id_prestamo_jja`,`motivo_jja`,`fecha_fin_sancion_jja`,`creado_por_jja`) VALUES (p_id_usuario_jja,p_id_prestamo_jja,p_motivo_jja,v_fecha_fin,p_admin_jja);
    SELECT LAST_INSERT_ID() AS `id_sancion_jja`;
END", "SP: SP_CREAR_SANCION_jja", $cnt_sp_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_SANCIONES_jja`() BEGIN SELECT sanc.`id_sancion_jja`,sanc.`id_usuario_jja`,CONCAT(usu.`nombre_jja`,' ',usu.`apellido_jja`) AS `usuario_jja`,usu.`cedula_jja`,usu.`imagen_jja` AS `imagen_usuario_jja`,sanc.`motivo_jja`,sanc.`fecha_inicio_sancion_jja`,sanc.`fecha_fin_sancion_jja`,sanc.`activa_jja` FROM `lista_negra_jja` sanc INNER JOIN `usuarios_jja` usu ON sanc.`id_usuario_jja`=usu.`id_usuario_jja` WHERE sanc.`estado_registro_jja`=1 ORDER BY sanc.`fecha_inicio_sancion_jja` DESC; END", "SP: SP_LEER_SANCIONES_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_SANCIONES_USUARIO_jja`(IN p_id_usuario_jja INT UNSIGNED) BEGIN SELECT `id_sancion_jja`,`motivo_jja`,`fecha_inicio_sancion_jja`,`fecha_fin_sancion_jja`,`activa_jja` FROM `lista_negra_jja` WHERE `id_usuario_jja`=p_id_usuario_jja AND `estado_registro_jja`=1 ORDER BY `fecha_inicio_sancion_jja` DESC; END", "SP: SP_LEER_SANCIONES_USUARIO_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEVANTAR_SANCION_jja`(IN p_id_jja INT UNSIGNED) BEGIN UPDATE `lista_negra_jja` SET `activa_jja`=0,`fecha_fin_sancion_jja`=NOW() WHERE `id_sancion_jja`=p_id_jja; SELECT ROW_COUNT() AS `filas_afectadas`; END", "SP: SP_LEVANTAR_SANCION_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_VERIFICAR_SANCION_jja`(IN p_id_usuario_jja INT UNSIGNED) BEGIN SELECT COUNT(*) AS `tiene_sancion_activa` FROM `lista_negra_jja` WHERE `id_usuario_jja`=p_id_usuario_jja AND `activa_jja`=1 AND (`fecha_fin_sancion_jja` IS NULL OR `fecha_fin_sancion_jja`>NOW()); END", "SP: SP_VERIFICAR_SANCION_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_VERIFICAR_SANCION_DETALLE_jja`(IN p_id_usuario_jja INT UNSIGNED) BEGIN SELECT sanc.`id_sancion_jja`,sanc.`motivo_jja`,sanc.`fecha_inicio_sancion_jja`,sanc.`fecha_fin_sancion_jja`,sanc.`activa_jja` FROM `lista_negra_jja` sanc WHERE sanc.`id_usuario_jja`=p_id_usuario_jja AND sanc.`activa_jja`=1 AND (`fecha_fin_sancion_jja` IS NULL OR `fecha_fin_sancion_jja`>NOW()) ORDER BY sanc.`fecha_inicio_sancion_jja` DESC LIMIT 1; END", "SP: SP_VERIFICAR_SANCION_DETALLE_jja", $cnt_sp_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_AUTO_SANCIONAR_VENCIDOS_jja`(IN p_admin_jja INT UNSIGNED)
BEGIN
    DECLARE v_contador INT DEFAULT 0;
    UPDATE `prestamos_jja` SET `estado_prestamo_jja`='vencido' WHERE `estado_prestamo_jja`='activo' AND DATE(`fecha_limite_jja`)<CURDATE();
    INSERT INTO `lista_negra_jja` (`id_usuario_jja`,`id_prestamo_jja`,`motivo_jja`,`creado_por_jja`)
    SELECT DISTINCT prest.`id_usuario_jja`,prest.`id_prestamo_jja`,CONCAT('Sanción automática: préstamo #',prest.`id_prestamo_jja`,' del activo \"',actv.`nombre_jja`,'\" venció el ',DATE_FORMAT(prest.`fecha_limite_jja`,'%d/%m/%Y'),' y no fue devuelto a tiempo.'),p_admin_jja
    FROM `prestamos_jja` prest INNER JOIN `activos_jja` actv ON prest.`id_activo_jja`=actv.`id_activo_jja`
    WHERE prest.`estado_prestamo_jja`='vencido' AND prest.`estado_registro_jja`=1
      AND NOT EXISTS (SELECT 1 FROM `lista_negra_jja` ln WHERE ln.`id_prestamo_jja`=prest.`id_prestamo_jja` AND ln.`id_usuario_jja`=prest.`id_usuario_jja` AND ln.`activa_jja`=1);
    SET v_contador=ROW_COUNT();
    SELECT v_contador AS `sanciones_creadas_jja`;
END", "SP: SP_AUTO_SANCIONAR_VENCIDOS_jja (sancionar automáticamente)", $cnt_sp_jja, $errores_jja);

        // AUDITORÍA
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_REGISTRAR_AUDITORIA_jja`(IN p_tabla_jja VARCHAR(100), IN p_id_registro_jja INT UNSIGNED, IN p_accion_jja ENUM('INSERT','UPDATE','DELETE'), IN p_campo_jja VARCHAR(100), IN p_valor_ant_jja TEXT, IN p_valor_nuevo_jja TEXT, IN p_id_usuario_jja INT UNSIGNED, IN p_ip_jja VARCHAR(45), IN p_descripcion_jja TEXT) BEGIN INSERT INTO `auditoria_jja` (`tabla_afectada_jja`,`id_registro_afectado_jja`,`accion_jja`,`campo_modificado_jja`,`valor_anterior_jja`,`valor_nuevo_jja`,`id_usuario_responsable_jja`,`ip_origen_jja`,`descripcion_jja`) VALUES (p_tabla_jja,p_id_registro_jja,p_accion_jja,p_campo_jja,p_valor_ant_jja,p_valor_nuevo_jja,p_id_usuario_jja,p_ip_jja,p_descripcion_jja); END", "SP: SP_REGISTRAR_AUDITORIA_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_AUDITORIA_jja`() BEGIN SELECT a.`id_auditoria_jja`,a.`tabla_afectada_jja`,a.`id_registro_afectado_jja`,a.`accion_jja`,a.`campo_modificado_jja`,a.`valor_anterior_jja`,a.`valor_nuevo_jja`,a.`id_usuario_responsable_jja`,a.`fecha_accion_jja`,a.`ip_origen_jja`,a.`descripcion_jja`,COALESCE(CONCAT(u.`nombre_jja`,' ',u.`apellido_jja`),'Sistema') AS `nombre_usuario_jja`,COALESCE(r.`nombre_rol_jja`,'Sistema') AS `rol_usuario_jja`,u.`imagen_jja` AS `imagen_usuario_jja` FROM `auditoria_jja` a LEFT JOIN `usuarios_jja` u ON a.`id_usuario_responsable_jja`=u.`id_usuario_jja` LEFT JOIN `roles_jja` r ON u.`id_rol_jja`=r.`id_rol_jja` ORDER BY a.`fecha_accion_jja` DESC LIMIT 1000; END", "SP: SP_LEER_AUDITORIA_jja (con JOIN usuarios y roles)", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_AUDITORIA_TABLA_jja`(IN p_tabla_jja VARCHAR(100)) BEGIN SELECT `id_auditoria_jja`,`id_registro_afectado_jja`,`accion_jja`,`campo_modificado_jja`,`valor_anterior_jja`,`valor_nuevo_jja`,`id_usuario_responsable_jja`,`fecha_accion_jja`,`descripcion_jja` FROM `auditoria_jja` WHERE `tabla_afectada_jja`=p_tabla_jja ORDER BY `fecha_accion_jja` DESC; END", "SP: SP_LEER_AUDITORIA_TABLA_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LEER_AUDITORIA_USUARIO_jja`(IN p_id_usuario_jja INT UNSIGNED) BEGIN SELECT `id_auditoria_jja`,`tabla_afectada_jja`,`id_registro_afectado_jja`,`accion_jja`,`campo_modificado_jja`,`valor_anterior_jja`,`valor_nuevo_jja`,`fecha_accion_jja`,`descripcion_jja` FROM `auditoria_jja` WHERE `id_usuario_responsable_jja`=p_id_usuario_jja ORDER BY `fecha_accion_jja` DESC; END", "SP: SP_LEER_AUDITORIA_USUARIO_jja", $cnt_sp_jja, $errores_jja);

        // TOKENS
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_INVALIDAR_TOKEN_jja`(IN p_token_hash_jja VARCHAR(64), IN p_id_usuario_jja INT UNSIGNED, IN p_expira_en_jja TIMESTAMP) BEGIN INSERT IGNORE INTO `tokens_invalidos_jja` (`token_hash_jja`,`id_usuario_jja`,`expira_en_jja`) VALUES (p_token_hash_jja,p_id_usuario_jja,p_expira_en_jja); END", "SP: SP_INVALIDAR_TOKEN_jja (logout / revocación)", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_VERIFICAR_TOKEN_INVALIDO_jja`(IN p_token_hash_jja VARCHAR(64)) BEGIN SELECT COUNT(*) AS `esta_invalidado` FROM `tokens_invalidos_jja` WHERE `token_hash_jja`=p_token_hash_jja AND `expira_en_jja`>NOW(); END", "SP: SP_VERIFICAR_TOKEN_INVALIDO_jja", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_LIMPIAR_TOKENS_jja`() BEGIN DELETE FROM `tokens_invalidos_jja` WHERE `expira_en_jja`<=NOW(); SELECT ROW_COUNT() AS `tokens_eliminados`; END", "SP: SP_LIMPIAR_TOKENS_jja", $cnt_sp_jja, $errores_jja);

        // REPORTES
        ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_REPORTE_PRESTAMOS_jja`(IN p_fecha_inicio_jja DATE, IN p_fecha_fin_jja DATE, IN p_id_tipo_jja INT UNSIGNED, IN p_id_usuario_jja INT UNSIGNED)
BEGIN
    SELECT prest.`id_prestamo_jja`,actv.`nombre_jja` AS `activo_jja`,tipo.`nombre_tipo_jja`,CONCAT(usu.`nombre_jja`,' ',usu.`apellido_jja`) AS `usuario_jja`,usu.`cedula_jja`,prest.`fecha_prestamo_jja`,prest.`fecha_limite_jja`,prest.`fecha_devolucion_jja`,prest.`estado_prestamo_jja`
    FROM `prestamos_jja` prest INNER JOIN `activos_jja` actv ON prest.`id_activo_jja`=actv.`id_activo_jja` INNER JOIN `tipos_activos_jja` tipo ON actv.`id_tipo_jja`=tipo.`id_tipo_jja` INNER JOIN `usuarios_jja` usu ON prest.`id_usuario_jja`=usu.`id_usuario_jja`
    WHERE (p_fecha_inicio_jja IS NULL OR DATE(prest.`fecha_prestamo_jja`)>=p_fecha_inicio_jja) AND (p_fecha_fin_jja IS NULL OR DATE(prest.`fecha_prestamo_jja`)<=p_fecha_fin_jja) AND (p_id_tipo_jja IS NULL OR actv.`id_tipo_jja`=p_id_tipo_jja) AND (p_id_usuario_jja IS NULL OR prest.`id_usuario_jja`=p_id_usuario_jja) AND prest.`estado_registro_jja`=1
    ORDER BY prest.`fecha_prestamo_jja` DESC;
END", "SP: SP_REPORTE_PRESTAMOS_jja (filtros por fecha, tipo y usuario)", $cnt_sp_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_REPORTE_ACTIVOS_MAS_PRESTADOS_jja`() BEGIN SELECT actv.`nombre_jja`,tipo.`nombre_tipo_jja`,COUNT(prest.`id_prestamo_jja`) AS `total_prestamos_jja` FROM `prestamos_jja` prest INNER JOIN `activos_jja` actv ON prest.`id_activo_jja`=actv.`id_activo_jja` INNER JOIN `tipos_activos_jja` tipo ON actv.`id_tipo_jja`=tipo.`id_tipo_jja` GROUP BY actv.`id_activo_jja`,actv.`nombre_jja`,tipo.`nombre_tipo_jja` ORDER BY `total_prestamos_jja` DESC LIMIT 10; END", "SP: SP_REPORTE_ACTIVOS_MAS_PRESTADOS_jja (Top 10)", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_REPORTE_USUARIOS_ACTIVOS_jja`() BEGIN SELECT CONCAT(usu.`nombre_jja`,' ',usu.`apellido_jja`) AS `usuario_jja`,usu.`cedula_jja`,COUNT(prest.`id_prestamo_jja`) AS `total_prestamos_jja` FROM `prestamos_jja` prest INNER JOIN `usuarios_jja` usu ON prest.`id_usuario_jja`=usu.`id_usuario_jja` GROUP BY usu.`id_usuario_jja` ORDER BY `total_prestamos_jja` DESC LIMIT 10; END", "SP: SP_REPORTE_USUARIOS_ACTIVOS_jja (Top 10)", $cnt_sp_jja, $errores_jja);
        ejecutar_jja($pdo_jja, "CREATE PROCEDURE `SP_REPORTE_TASA_DEVOLUCION_jja`() BEGIN SELECT COUNT(*) AS `total_prestamos_jja`,SUM(CASE WHEN `estado_prestamo_jja`='devuelto' THEN 1 ELSE 0 END) AS `devueltos_jja`,SUM(CASE WHEN `estado_prestamo_jja`='vencido' THEN 1 ELSE 0 END) AS `vencidos_jja`,SUM(CASE WHEN `estado_prestamo_jja`='perdido' THEN 1 ELSE 0 END) AS `perdidos_jja`,SUM(CASE WHEN `estado_prestamo_jja`='activo' THEN 1 ELSE 0 END) AS `activos_jja`,ROUND(SUM(CASE WHEN `estado_prestamo_jja`='devuelto' THEN 1 ELSE 0 END)/COUNT(*)*100,2) AS `tasa_devolucion_pct_jja` FROM `prestamos_jja` WHERE `estado_registro_jja`=1; END", "SP: SP_REPORTE_TASA_DEVOLUCION_jja (estadística dashboard)", $cnt_sp_jja, $errores_jja);

        cierre_seccion_jja();

        // ══════════════════════════════════════════════════════
        // 5. TRIGGERS
        // ══════════════════════════════════════════════════════
        seccion_jja('5', 'Triggers de Auditoría y Trazabilidad');

        mostrar_jja('info', 'ℹ️', "Eliminando triggers existentes…");
        $triggers_drop_jja = ['TR_AUDITORIA_ACTIVO_UPDATE_jja','TR_AUDITORIA_ACTIVO_INSERT_jja','TR_AUDITORIA_PRESTAMO_UPDATE_jja','TR_AUDITORIA_PRESTAMO_INSERT_jja','TR_AUDITORIA_USUARIO_UPDATE_jja','TR_AUDITORIA_USUARIO_INSERT_jja','TR_AUDITORIA_SANCION_INSERT_jja','TR_AUDITORIA_SANCION_UPDATE_jja','TR_AUDITORIA_SOLICITUD_INSERT_jja','TR_HISTORIAL_PRESTAMO_DEVOLUCION_jja'];
        foreach ($triggers_drop_jja as $trig_jja) {
            try { $pdo_jja->exec("DROP TRIGGER IF EXISTS `{$trig_jja}`"); } catch (PDOException $ex_jja) {}
        }
        mostrar_jja('ok', '✅', "Triggers existentes eliminados.");

        ejecutar_jja($pdo_jja, "
CREATE TRIGGER `TR_AUDITORIA_ACTIVO_UPDATE_jja` AFTER UPDATE ON `activos_jja` FOR EACH ROW
BEGIN
    IF OLD.`estado_jja`<>NEW.`estado_jja` THEN INSERT INTO `auditoria_jja` (`tabla_afectada_jja`,`id_registro_afectado_jja`,`accion_jja`,`campo_modificado_jja`,`valor_anterior_jja`,`valor_nuevo_jja`,`descripcion_jja`) VALUES ('activos_jja',NEW.`id_activo_jja`,'UPDATE','estado_jja',OLD.`estado_jja`,NEW.`estado_jja`,CONCAT('Cambio automático de estado en activo: ',NEW.`nombre_jja`)); END IF;
    IF OLD.`estado_registro_jja`<>NEW.`estado_registro_jja` THEN INSERT INTO `auditoria_jja` (`tabla_afectada_jja`,`id_registro_afectado_jja`,`accion_jja`,`campo_modificado_jja`,`valor_anterior_jja`,`valor_nuevo_jja`,`descripcion_jja`) VALUES ('activos_jja',NEW.`id_activo_jja`,'DELETE','estado_registro_jja',OLD.`estado_registro_jja`,NEW.`estado_registro_jja`,CONCAT('Soft-delete aplicado al activo: ',NEW.`nombre_jja`)); END IF;
END", "Trigger: TR_AUDITORIA_ACTIVO_UPDATE_jja", $cnt_triggers_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TRIGGER `TR_AUDITORIA_PRESTAMO_UPDATE_jja` AFTER UPDATE ON `prestamos_jja` FOR EACH ROW
BEGIN
    IF OLD.`estado_prestamo_jja`<>NEW.`estado_prestamo_jja` THEN INSERT INTO `auditoria_jja` (`tabla_afectada_jja`,`id_registro_afectado_jja`,`accion_jja`,`campo_modificado_jja`,`valor_anterior_jja`,`valor_nuevo_jja`,`descripcion_jja`) VALUES ('prestamos_jja',NEW.`id_prestamo_jja`,'UPDATE','estado_prestamo_jja',OLD.`estado_prestamo_jja`,NEW.`estado_prestamo_jja`,CONCAT('Cambio de estado del préstamo ID: ',NEW.`id_prestamo_jja`)); END IF;
END", "Trigger: TR_AUDITORIA_PRESTAMO_UPDATE_jja", $cnt_triggers_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TRIGGER `TR_AUDITORIA_USUARIO_UPDATE_jja` AFTER UPDATE ON `usuarios_jja` FOR EACH ROW
BEGIN
    IF OLD.`estado_registro_jja`<>NEW.`estado_registro_jja` THEN INSERT INTO `auditoria_jja` (`tabla_afectada_jja`,`id_registro_afectado_jja`,`accion_jja`,`campo_modificado_jja`,`valor_anterior_jja`,`valor_nuevo_jja`,`descripcion_jja`) VALUES ('usuarios_jja',NEW.`id_usuario_jja`,'DELETE','estado_registro_jja',OLD.`estado_registro_jja`,NEW.`estado_registro_jja`,CONCAT('Soft-delete aplicado al usuario: ',NEW.`cedula_jja`)); END IF;
END", "Trigger: TR_AUDITORIA_USUARIO_UPDATE_jja", $cnt_triggers_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TRIGGER `TR_AUDITORIA_USUARIO_INSERT_jja` AFTER INSERT ON `usuarios_jja` FOR EACH ROW
BEGIN
    INSERT INTO `auditoria_jja` (`tabla_afectada_jja`,`id_registro_afectado_jja`,`accion_jja`,`descripcion_jja`) VALUES ('usuarios_jja',NEW.`id_usuario_jja`,'INSERT',CONCAT('Nuevo usuario registrado: ',NEW.`nombre_jja`,' ',NEW.`apellido_jja`,' (C.I.: ',NEW.`cedula_jja`,')'));
END", "Trigger: TR_AUDITORIA_USUARIO_INSERT_jja", $cnt_triggers_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TRIGGER `TR_AUDITORIA_PRESTAMO_INSERT_jja` AFTER INSERT ON `prestamos_jja` FOR EACH ROW
BEGIN
    INSERT INTO `auditoria_jja` (`tabla_afectada_jja`,`id_registro_afectado_jja`,`accion_jja`,`id_usuario_responsable_jja`,`descripcion_jja`) VALUES ('prestamos_jja',NEW.`id_prestamo_jja`,'INSERT',NEW.`id_encargado_jja`,CONCAT('Nuevo préstamo registrado (ID activo: ',NEW.`id_activo_jja`,', Usuario: ',NEW.`id_usuario_jja`,')'));
END", "Trigger: TR_AUDITORIA_PRESTAMO_INSERT_jja", $cnt_triggers_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TRIGGER `TR_AUDITORIA_SANCION_INSERT_jja` AFTER INSERT ON `lista_negra_jja` FOR EACH ROW
BEGIN
    INSERT INTO `auditoria_jja` (`tabla_afectada_jja`,`id_registro_afectado_jja`,`accion_jja`,`id_usuario_responsable_jja`,`descripcion_jja`) VALUES ('lista_negra_jja',NEW.`id_sancion_jja`,'INSERT',NEW.`creado_por_jja`,CONCAT('Nueva sanción aplicada al usuario ID: ',NEW.`id_usuario_jja`,'. Motivo: ',LEFT(NEW.`motivo_jja`,100)));
END", "Trigger: TR_AUDITORIA_SANCION_INSERT_jja", $cnt_triggers_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TRIGGER `TR_AUDITORIA_SANCION_UPDATE_jja` AFTER UPDATE ON `lista_negra_jja` FOR EACH ROW
BEGIN
    IF OLD.`activa_jja`<>NEW.`activa_jja` THEN INSERT INTO `auditoria_jja` (`tabla_afectada_jja`,`id_registro_afectado_jja`,`accion_jja`,`campo_modificado_jja`,`valor_anterior_jja`,`valor_nuevo_jja`,`descripcion_jja`) VALUES ('lista_negra_jja',NEW.`id_sancion_jja`,'UPDATE','activa_jja',OLD.`activa_jja`,NEW.`activa_jja`,CONCAT(IF(NEW.`activa_jja`=0,'Sanción levantada','Sanción reactivada'),' para el usuario ID: ',NEW.`id_usuario_jja`)); END IF;
END", "Trigger: TR_AUDITORIA_SANCION_UPDATE_jja", $cnt_triggers_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TRIGGER `TR_AUDITORIA_SOLICITUD_INSERT_jja` AFTER INSERT ON `solicitudes_prestamo_activos_jja` FOR EACH ROW
BEGIN
    INSERT INTO `auditoria_jja` (`tabla_afectada_jja`,`id_registro_afectado_jja`,`accion_jja`,`id_usuario_responsable_jja`,`descripcion_jja`) VALUES ('solicitudes_prestamo_activos_jja',NEW.`id_solicitud_activo_jja`,'INSERT',NEW.`id_cliente_jja`,CONCAT('Nueva solicitud de préstamo para el activo ID: ',NEW.`id_activo_jja`));
END", "Trigger: TR_AUDITORIA_SOLICITUD_INSERT_jja", $cnt_triggers_jja, $errores_jja);

        ejecutar_jja($pdo_jja, "
CREATE TRIGGER `TR_HISTORIAL_PRESTAMO_DEVOLUCION_jja` AFTER UPDATE ON `prestamos_jja` FOR EACH ROW
BEGIN
    IF OLD.`estado_prestamo_jja`='activo' AND NEW.`estado_prestamo_jja`='vencido' THEN INSERT INTO `historial_prestamos_jja` (`id_prestamo_jja`,`id_activo_jja`,`id_usuario_jja`,`accion_jja`,`detalles_jja`) VALUES (NEW.`id_prestamo_jja`,NEW.`id_activo_jja`,NEW.`id_usuario_jja`,'vencimiento',CONCAT('Préstamo marcado como vencido automáticamente. Límite: ',NEW.`fecha_limite_jja`)); END IF;
END", "Trigger: TR_HISTORIAL_PRESTAMO_DEVOLUCION_jja (registro automático)", $cnt_triggers_jja, $errores_jja);

        cierre_seccion_jja();

        // ══════════════════════════════════════════════════════
        // 6. DATOS SEMILLA
        // ══════════════════════════════════════════════════════
        seccion_jja('6', 'Datos Semilla &mdash; Roles · Tipos · Políticas · Admin Inicial');

        try {
            $pdo_jja->exec("INSERT IGNORE INTO `roles_jja` (`nombre_rol_jja`, `descripcion_jja`) VALUES ('administrador','Acceso total: gestión de usuarios, inventario, auditorías y reportes.'),('encargado','Procesa préstamos, devoluciones y consulta el inventario.'),('cliente','Solicita préstamos, consulta historial, accede al marketplace y recibe notificaciones.')");
            mostrar_jja('ok', '✅', "Roles insertados: <strong>administrador</strong>, <strong>encargado</strong>, <strong>cliente</strong>.");
        } catch (PDOException $ex_jja) { mostrar_jja('err', '❌', 'Error al insertar roles: ' . $ex_jja->getMessage()); }

        try {
            $pdo_jja->exec("INSERT IGNORE INTO `tipos_activos_jja` (`nombre_tipo_jja`,`descripcion_jja`) VALUES ('Libro','Material bibliográfico físico de la institución'),('CD de Tesis','Disco compacto con trabajos de grado digitalizados'),('Laptop','Computador portátil de la institución'),('Computadora','Equipo de escritorio en salas de cómputo'),('Tablet','Dispositivo tablet de la institución'),('Pendrive','Dispositivo de almacenamiento USB'),('Videobeam','Proyector/videobeam para presentaciones'),('Proyector','Proyector multimedia para aulas'),('Cámara','Equipo fotográfico o de video'),('Otro','Activo que no encaja en las categorías anteriores')");
            mostrar_jja('ok', '✅', "Tipos de activos insertados — 10 categorías.");
        } catch (PDOException $ex_jja) { mostrar_jja('err', '❌', 'Error al insertar tipos: ' . $ex_jja->getMessage()); }

        try {
            $pdo_jja->exec("INSERT IGNORE INTO `politicas_prestamo_jja` (`id_tipo_jja`,`dias_maximo_jja`,`max_prestamos_simultaneos_jja`,`requiere_mismo_dia_jja`) SELECT tip.`id_tipo_jja`,pol.dias,pol.max_simult,pol.mismo_dia FROM `tipos_activos_jja` tip JOIN (SELECT 'Libro' AS tipo,7 AS dias,3 AS max_simult,0 AS mismo_dia UNION ALL SELECT 'CD de Tesis',7,2,0 UNION ALL SELECT 'Laptop',1,1,1 UNION ALL SELECT 'Computadora',1,1,1 UNION ALL SELECT 'Tablet',3,1,0 UNION ALL SELECT 'Pendrive',3,2,0 UNION ALL SELECT 'Videobeam',1,1,1 UNION ALL SELECT 'Proyector',1,1,1 UNION ALL SELECT 'Cámara',3,1,0 UNION ALL SELECT 'Otro',7,1,0) pol ON tip.`nombre_tipo_jja`=pol.tipo WHERE NOT EXISTS (SELECT 1 FROM `politicas_prestamo_jja` pol2 WHERE pol2.`id_tipo_jja`=tip.`id_tipo_jja`)");
            mostrar_jja('ok', '✅', "Políticas de préstamo configuradas por tipo de activo.");
        } catch (PDOException $ex_jja) { mostrar_jja('err', '❌', 'Error en políticas: ' . $ex_jja->getMessage()); }

        try {
            $hash_admin_jja = password_hash('JoAnJe2026!', PASSWORD_BCRYPT, ['cost' => 12]);
            $stmt_admin_jja = $pdo_jja->prepare("INSERT IGNORE INTO `usuarios_jja` (`nombre_jja`,`apellido_jja`,`cedula_jja`,`correo_jja`,`telefono_jja`,`contrasena_jja`,`id_rol_jja`) SELECT 'Jean Marco','Coffi Izarra','29518292','admin@activoscontroljoanje.com','+58-412-0000000',:hash,(SELECT `id_rol_jja` FROM `roles_jja` WHERE `nombre_rol_jja`='administrador' LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM `usuarios_jja` WHERE `cedula_jja`='29518292')");
            $stmt_admin_jja->execute([':hash' => $hash_admin_jja]);
            mostrar_jja('ok', '✅', "Administrador creado — cédula: <code>29518292</code> · contraseña: <code>JoAnJe2026!</code> &mdash; <em>Cambia la contraseña en producción.</em>");
        } catch (PDOException $ex_jja) { mostrar_jja('err', '❌', 'Error al crear admin: ' . $ex_jja->getMessage()); }

        try {
            $hash_cliente = password_hash('Cliente2026!', PASSWORD_BCRYPT, ['cost' => 12]);
            $stmt_c = $pdo_jja->prepare("INSERT IGNORE INTO `usuarios_jja` (`nombre_jja`,`apellido_jja`,`cedula_jja`,`correo_jja`,`telefono_jja`,`contrasena_jja`,`id_rol_jja`) SELECT :nombre,:apellido,:cedula,:correo,:telefono,:hash,(SELECT `id_rol_jja` FROM `roles_jja` WHERE `nombre_rol_jja`='cliente' LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM `usuarios_jja` WHERE `correo_jja`=:correo2)");
            $stmt_c->execute([':nombre'=>'Cliente',':apellido'=>'Demo',':cedula'=>'80000001',':correo'=>'cliente@demo.com',':correo2'=>'cliente@demo.com',':telefono'=>'+58-412-2222222',':hash'=>$hash_cliente]);
            mostrar_jja('ok', '✅', "Cliente demo creado — <code>cliente@demo.com</code> · <code>Cliente2026!</code>");

            $hash_encargado = password_hash('Encargado2026!', PASSWORD_BCRYPT, ['cost' => 12]);
            $stmt_enc = $pdo_jja->prepare("INSERT IGNORE INTO `usuarios_jja` (`nombre_jja`,`apellido_jja`,`cedula_jja`,`correo_jja`,`telefono_jja`,`contrasena_jja`,`id_rol_jja`) SELECT :nombre,:apellido,:cedula,:correo,:telefono,:hash,(SELECT `id_rol_jja` FROM `roles_jja` WHERE `nombre_rol_jja`='encargado' LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM `usuarios_jja` WHERE `correo_jja`=:correo2)");
            $stmt_enc->execute([':nombre'=>'Encargado',':apellido'=>'Demo',':cedula'=>'70000001',':correo'=>'encargado@demo.com',':correo2'=>'encargado@demo.com',':telefono'=>'+58-412-3333333',':hash'=>$hash_encargado]);
            mostrar_jja('ok', '✅', "Encargado demo creado — <code>encargado@demo.com</code> · <code>Encargado2026!</code>");
        } catch (PDOException $ex_jja) { mostrar_jja('err', '❌', 'Error al crear usuarios demo: ' . $ex_jja->getMessage()); }

        cierre_seccion_jja();

        // ══════════════════════════════════════════════════════
        // RESUMEN FINAL
        // ══════════════════════════════════════════════════════
        $icono_final = ($errores_jja === 0) ? '🎉' : '⚠️';
        ?>

        <!-- RESUMEN ESTADÍSTICO -->
        <div class="resumen-wrapper">
            <div class="resumen-header">
                <div class="resumen-header-icon"><?= $icono_final ?></div>
                <div>
                    <div class="resumen-header-text">
                        <?= ($errores_jja === 0) ? 'Inicialización completada sin errores' : 'Inicialización completada con errores' ?>
                        <small>Base de datos: <code>gestion_activos_jja</code> · JoAnJe Coders &copy; <?= date('Y') ?></small>
                    </div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-val"><?= $cnt_tablas_jja ?></div>
                    <div class="stat-lbl">Tablas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-val"><?= $cnt_indices_jja ?></div>
                    <div class="stat-lbl">Índices</div>
                </div>
                <div class="stat-card">
                    <div class="stat-val"><?= $cnt_sp_jja ?></div>
                    <div class="stat-lbl">Stored Procs</div>
                </div>
                <div class="stat-card">
                    <div class="stat-val"><?= $cnt_triggers_jja ?></div>
                    <div class="stat-lbl">Triggers</div>
                </div>
                <div class="stat-card">
                    <div class="stat-val <?= $errores_jja > 0 ? 'error-val' : '' ?>"><?= $errores_jja ?></div>
                    <div class="stat-lbl">Errores</div>
                </div>
            </div>

            <div class="resumen-db">
                Motor: <code>InnoDB</code> &nbsp;·&nbsp; Charset: <code>utf8mb4_unicode_ci</code> &nbsp;·&nbsp; Zona horaria: <code>-04:00</code>
            </div>

            <a href="/" class="btn-volver">← Volver al sistema</a>
        </div>

    </div><!-- /.main-card -->
</div><!-- /.page-wrapper -->

</body>
</html>