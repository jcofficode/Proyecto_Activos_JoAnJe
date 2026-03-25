<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>🚀 Inicializar BD — Sistema JoAnJe Coders</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Arial,sans-serif;background:#0f172a;color:#e2e8f0;padding:30px}
    .contenedor{max-width:900px;margin:30px auto;background:#1e293b;padding:28px 32px;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.4)}
    h1{color:#38bdf8;font-size:1.7rem;margin-bottom:4px}
    .subtitulo{color:#94a3b8;font-size:.9rem;margin-bottom:20px}
    hr{border:none;border-top:1px solid #334155;margin:18px 0}
    .bloque{margin-bottom:6px}
    .ok  {background:#052e16;color:#86efac;padding:7px 12px;border-radius:6px;border-left:4px solid #22c55e;font-size:.88rem}
    .err {background:#450a0a;color:#fca5a5;padding:7px 12px;border-radius:6px;border-left:4px solid #ef4444;font-size:.88rem}
    .info{background:#0c1a2e;color:#93c5fd;padding:7px 12px;border-radius:6px;border-left:4px solid #3b82f6;font-size:.88rem}
    .seccion{color:#fbbf24;font-weight:700;font-size:1rem;margin:18px 0 8px}
    .btn-volver{display:inline-block;margin-top:22px;padding:10px 20px;background:#0ea5e9;color:#fff;border-radius:8px;text-decoration:none;font-weight:600}
    .resumen{background:#1a2744;border:1px solid #334155;border-radius:8px;padding:14px 18px;margin-top:20px;font-size:.87rem;color:#cbd5e1}
    .resumen span{color:#38bdf8;font-weight:700}
  </style>
</head>
<body>
<div class="contenedor">
  <h1>🚀 Inicializando Base de Datos — JoAnJe Coders</h1>
  <p class="subtitulo">Sistema de Gestión de Préstamos de Activos con NFC/QR · API REST PHP + React</p>
  <hr>
<?php
// ============================================================
// crear.php — Construcción Completa de la Base de Datos
// Sistema JoAnJe Coders — Sufijo estricto: _jja
// ============================================================
require __DIR__ . '/vendor/autoload.php';

$dotenv_jja = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv_jja->load();

// ── Contadores de resumen ────────────────────────────────────
$cnt_tablas_jja = 0;
$cnt_sp_jja = 0;
$cnt_triggers_jja = 0;
$cnt_indices_jja = 0;
$errores_jja = 0;

// ── Helper: imprime un mensaje con clase CSS ─────────────────
function mostrar_jja(string $clase, string $icono, string $texto): void
{
    echo "<div class='bloque'><div class='{$clase}'>{$icono} {$texto}</div></div>\n";
}

// ── Helper: ejecuta SQL y reporta resultado ──────────────────
function ejecutar_jja(PDO $pdo, string $sql, string $descripcion, string&$contador_ref, int&$errores_ref): void
{
    try {
        $pdo->exec($sql);
        mostrar_jja('ok', '✅', $descripcion);
        $contador_ref++;
    }
    catch (PDOException $e) {
        mostrar_jja('err', '❌', "ERROR — {$descripcion}: " . $e->getMessage());
        $errores_ref++;
    }
}

// ══════════════════════════════════════════════════════════════
// 1. CONEXIÓN AL SERVIDOR Y CREACIÓN DE LA BASE DE DATOS
// ══════════════════════════════════════════════════════════════
echo "<p class='seccion'>① CONEXIÓN Y CREACIÓN DE LA BASE DE DATOS</p>";

$host_jja = $_ENV['DB_HOST'];
$port_jja = $_ENV['DB_PORT'];
$user_jja = $_ENV['DB_USER'];
$pass_jja = $_ENV['DB_PASS'];
$db_jja = $_ENV['DB_NAME'];

try {
    $pdo_jja = new PDO("mysql:host={$host_jja};port={$port_jja}", $user_jja, $pass_jja);
    $pdo_jja->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    mostrar_jja('ok', '✅', "Conexión al servidor MySQL establecida correctamente.");
}
catch (PDOException $e) {
    mostrar_jja('err', '❌', "No se pudo conectar al servidor MySQL: " . $e->getMessage());
    die();
}

try {
    $pdo_jja->exec("CREATE DATABASE IF NOT EXISTS `{$db_jja}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    mostrar_jja('ok', '✅', "Base de datos <strong>{$db_jja}</strong> creada o ya existe.");
    $pdo_jja->exec("USE `{$db_jja}`");
    $pdo_jja->exec("SET time_zone = '-04:00'");
}
catch (PDOException $e) {
    mostrar_jja('err', '❌', "Error al crear/usar la BD: " . $e->getMessage());
    die();
}

$pdo_jja->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
$pdo_jja->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

// ══════════════════════════════════════════════════════════════
// 2. CREACIÓN DE TABLAS (orden por dependencia FK)
// ══════════════════════════════════════════════════════════════
echo "<p class='seccion'>② CREACIÓN DE TABLAS (3FN · InnoDB · utf8mb4)</p>";

// ── 2.1 roles_jja ────────────────────────────────────────────
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
  COMMENT='Roles del sistema: administrador, encargado, usuario_final';
", "Tabla <strong>roles_jja</strong>", $cnt_tablas_jja, $errores_jja);

// ── 2.2 usuarios_jja ─────────────────────────────────────────
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

// ── 2.3 tipos_activos_jja ────────────────────────────────────
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

// ── 2.4 politicas_prestamo_jja ───────────────────────────────
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

// ── 2.5 activos_jja ──────────────────────────────────────────
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

// ── 2.6 prestamos_jja ────────────────────────────────────────
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

// ── 2.7 historial_prestamos_jja ──────────────────────────────
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
" , "Tabla <strong>historial_prestamos_jja</strong>", $cnt_tablas_jja, $errores_jja);

// solicitudes_prestamo_activos_jja
ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `solicitudes_prestamo_activos_jja` (
                `id_solicitud_activo_jja` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                `id_activo_jja`          INT UNSIGNED NOT NULL,
                `id_cliente_jja`         INT UNSIGNED NOT NULL,
                `fecha_solicitud_jja`    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                `estado_jja`             ENUM('pendiente','en_proceso','aprobada','rechazada','cancelada') NOT NULL DEFAULT 'pendiente',
                `observaciones_jja`      TEXT          DEFAULT NULL,
                PRIMARY KEY (`id_solicitud_activo_jja`),
                CONSTRAINT `fk_solicitud_activo_activo_jja` FOREIGN KEY (`id_activo_jja`) REFERENCES `activos_jja` (`id_activo_jja`) ON DELETE RESTRICT ON UPDATE CASCADE,
                CONSTRAINT `fk_solicitud_activo_cliente_jja` FOREIGN KEY (`id_cliente_jja`) REFERENCES `usuarios_jja` (`id_usuario_jja`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        COMMENT='Solicitudes de préstamo para activos (clientes)';;
", "Tabla <strong>solicitudes_prestamo_activos_jja</strong>", $cnt_tablas_jja, $errores_jja);

// ── 2.8 notificaciones_jja ───────────────────────────────────
ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `notificaciones_jja` (
    `id_notificacion_jja`       INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `id_usuario_jja`            INT UNSIGNED    NOT NULL,
    `id_prestamo_jja`           INT UNSIGNED    DEFAULT NULL,
    `tipo_notificacion_jja`     ENUM('vencimiento_proximo','vencido','devolucion_confirmada','sancion','informativo')
                                                NOT NULL,
    `titulo_jja`                VARCHAR(200)    NOT NULL,
    `mensaje_jja`               TEXT            NOT NULL,
    `leida_jja`                 TINYINT(1)      NOT NULL DEFAULT 0,
    `enviada_correo_jja`        TINYINT(1)      NOT NULL DEFAULT 0,
    `creado_en_jja`             TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_notificacion_jja`),
    CONSTRAINT `fk_notif_usuario_jja`   FOREIGN KEY (`id_usuario_jja`)
        REFERENCES `usuarios_jja`  (`id_usuario_jja`)  ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT `fk_notif_prestamo_jja`  FOREIGN KEY (`id_prestamo_jja`)
        REFERENCES `prestamos_jja` (`id_prestamo_jja`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Centro de notificaciones del sistema';
", "Tabla <strong>notificaciones_jja</strong>", $cnt_tablas_jja, $errores_jja);

// ── 2.9 lista_negra_jja ──────────────────────────────────────
ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `lista_negra_jja` (
    `id_sancion_jja`            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `id_usuario_jja`            INT UNSIGNED    NOT NULL,
    `id_prestamo_jja`           INT UNSIGNED    DEFAULT NULL,
    `motivo_jja`                TEXT            NOT NULL,
    `fecha_inicio_sancion_jja`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_fin_sancion_jja`     DATETIME       DEFAULT NULL COMMENT 'NULL = sanción indefinida',
    `activa_jja`                TINYINT(1)      NOT NULL DEFAULT 1,
    `creado_por_jja`            INT UNSIGNED    NOT NULL COMMENT 'ID del admin que aplicó la sanción',
    `estado_registro_jja`       TINYINT(1)      NOT NULL DEFAULT 1,
    `creado_en_jja`             TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_sancion_jja`),
    CONSTRAINT `fk_lista_negra_usuario_jja`  FOREIGN KEY (`id_usuario_jja`)
        REFERENCES `usuarios_jja`  (`id_usuario_jja`)  ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT `fk_lista_negra_prestamo_jja` FOREIGN KEY (`id_prestamo_jja`)
        REFERENCES `prestamos_jja` (`id_prestamo_jja`) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT `fk_lista_negra_admin_jja`    FOREIGN KEY (`creado_por_jja`)
        REFERENCES `usuarios_jja`  (`id_usuario_jja`)  ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Sanciones y bloqueos por incumplimiento de devoluciones';
", "Tabla <strong>lista_negra_jja</strong>", $cnt_tablas_jja, $errores_jja);

// ── 2.10 auditoria_jja ───────────────────────────────────────
ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `auditoria_jja` (
    `id_auditoria_jja`              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `tabla_afectada_jja`            VARCHAR(100)    NOT NULL,
    `id_registro_afectado_jja`      INT UNSIGNED    NOT NULL,
    `accion_jja`                    ENUM('INSERT','UPDATE','DELETE') NOT NULL,
    `campo_modificado_jja`          VARCHAR(100)    DEFAULT NULL,
    `valor_anterior_jja`            TEXT            DEFAULT NULL,
    `valor_nuevo_jja`               TEXT            DEFAULT NULL,
    `id_usuario_responsable_jja`    INT UNSIGNED    DEFAULT NULL COMMENT 'NULL si es trigger automático',
    `fecha_accion_jja`              TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `ip_origen_jja`                 VARCHAR(45)     DEFAULT NULL,
    `descripcion_jja`               TEXT            DEFAULT NULL,
    PRIMARY KEY (`id_auditoria_jja`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Log de auditoría inmutable — NO tiene FK para preservar registros históricos';
", "Tabla <strong>auditoria_jja</strong>", $cnt_tablas_jja, $errores_jja);

// ── 2.11 tokens_invalidos_jja (JWT Blacklist) ─────────────────
ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `tokens_invalidos_jja` (
    `id_token_jja`      INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `token_hash_jja`    VARCHAR(64)     NOT NULL COMMENT 'SHA-256 del token para búsqueda rápida',
    `id_usuario_jja`    INT UNSIGNED    NOT NULL,
    `invalidado_en_jja` TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `expira_en_jja`     TIMESTAMP       NOT NULL,
    PRIMARY KEY (`id_token_jja`),
    UNIQUE KEY `uq_token_hash_jja` (`token_hash_jja`),
    CONSTRAINT `fk_token_usuario_jja` FOREIGN KEY (`id_usuario_jja`)
        REFERENCES `usuarios_jja` (`id_usuario_jja`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Lista negra de JWT invalidados (logout/revocación)';
", "Tabla <strong>tokens_invalidos_jja</strong>", $cnt_tablas_jja, $errores_jja);

// ══════════════════════════════════════════════════════════════
// 3. ÍNDICES DE RENDIMIENTO
// ══════════════════════════════════════════════════════════════
echo "<p class='seccion'>③ ÍNDICES DE RENDIMIENTO (búsquedas frecuentes)</p>";

// ═════════════════════════════════════════════════════════════=
// TABLAS MARKETPLACE (productos, categorías, solicitudes, ofertas, transacciones)
// ═════════════════════════════════════════════════════════════=
echo "<p class='seccion'>②.b TABLAS MARKETPLACE</p>";

// categorias_jja
ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `categorias_jja` (
        `id_categoria_jja`     INT UNSIGNED    NOT NULL AUTO_INCREMENT,
        `nombre_categoria_jja` VARCHAR(120)    NOT NULL,
        `descripcion_jja`      VARCHAR(255)    DEFAULT NULL,
        `estado_registro_jja`  TINYINT(1)      NOT NULL DEFAULT 1,
        `creado_en_jja`        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id_categoria_jja`),
        UNIQUE KEY `uq_nombre_categoria_jja` (`nombre_categoria_jja`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    COMMENT='Categorías para productos del marketplace';
", "Tabla <strong>categorias_jja</strong>", $cnt_tablas_jja, $errores_jja);

// productos_jja
ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `productos_jja` (
        `id_producto_jja`     INT UNSIGNED    NOT NULL AUTO_INCREMENT,
        `id_empresa_jja`      INT UNSIGNED    NOT NULL COMMENT 'Usuario tipo empresa',
        `id_categoria_jja`    INT UNSIGNED    DEFAULT NULL,
        `nombre_jja`          VARCHAR(200)    NOT NULL,
        `descripcion_jja`     TEXT            DEFAULT NULL,
        `precio_jja`          DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
        `stock_jja`           INT UNSIGNED    NOT NULL DEFAULT 0,
        `imagenes_jja`        JSON            DEFAULT NULL,
        `estado_jja`          TINYINT(1)      NOT NULL DEFAULT 1,
        `creado_en_jja`       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `actualizado_en_jja`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id_producto_jja`),
        CONSTRAINT `fk_producto_empresa_jja` FOREIGN KEY (`id_empresa_jja`) REFERENCES `usuarios_jja` (`id_usuario_jja`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT `fk_producto_categoria_jja` FOREIGN KEY (`id_categoria_jja`) REFERENCES `categorias_jja` (`id_categoria_jja`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    COMMENT='Productos publicados por empresas en el marketplace';
", "Tabla <strong>productos_jja</strong>", $cnt_tablas_jja, $errores_jja);

// solicitudes_prestamo_jja (requests from clients)
ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `solicitudes_prestamo_jja` (
        `id_solicitud_jja`    INT UNSIGNED    NOT NULL AUTO_INCREMENT,
        `id_producto_jja`     INT UNSIGNED    NOT NULL,
        `id_cliente_jja`      INT UNSIGNED    NOT NULL,
        `cantidad_jja`        INT UNSIGNED    NOT NULL DEFAULT 1,
        `fecha_solicitud_jja` TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `estado_jja`          ENUM('pendiente','aprobada','rechazada','cancelada') NOT NULL DEFAULT 'pendiente',
        `fecha_respuesta_jja` DATETIME        DEFAULT NULL,
        `observaciones_jja`   TEXT            DEFAULT NULL,
        PRIMARY KEY (`id_solicitud_jja`),
        CONSTRAINT `fk_solicitud_producto_jja` FOREIGN KEY (`id_producto_jja`) REFERENCES `productos_jja` (`id_producto_jja`) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT `fk_solicitud_cliente_jja` FOREIGN KEY (`id_cliente_jja`) REFERENCES `usuarios_jja` (`id_usuario_jja`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    COMMENT='Solicitudes de préstamo/uso de producto por parte de clientes';
", "Tabla <strong>solicitudes_prestamo_jja</strong>", $cnt_tablas_jja, $errores_jja);

// ofertas_jja (empresa responde con oferta/contrapropuesta)
ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `ofertas_jja` (
        `id_oferta_jja`       INT UNSIGNED    NOT NULL AUTO_INCREMENT,
        `id_solicitud_jja`    INT UNSIGNED    NOT NULL,
        `id_empresa_jja`      INT UNSIGNED    NOT NULL,
        `precio_oferta_jja`   DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
        `mensaje_jja`         TEXT            DEFAULT NULL,
        `estado_jja`          ENUM('pendiente','aceptada','rechazada') NOT NULL DEFAULT 'pendiente',
        `creado_en_jja`       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id_oferta_jja`),
        CONSTRAINT `fk_oferta_solicitud_jja` FOREIGN KEY (`id_solicitud_jja`) REFERENCES `solicitudes_prestamo_jja` (`id_solicitud_jja`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT `fk_oferta_empresa_jja` FOREIGN KEY (`id_empresa_jja`) REFERENCES `usuarios_jja` (`id_usuario_jja`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    COMMENT='Ofertas/contrapropuestas hechas por la empresa para una solicitud';
", "Tabla <strong>ofertas_jja</strong>", $cnt_tablas_jja, $errores_jja);

// transacciones_jja (pagos asociados a solicitudes/ofertas)
ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `transacciones_jja` (
        `id_transaccion_jja`  INT UNSIGNED    NOT NULL AUTO_INCREMENT,
        `id_solicitud_jja`    INT UNSIGNED    NOT NULL,
        `id_cliente_jja`      INT UNSIGNED    NOT NULL,
        `monto_jja`           DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
        `metodo_pago_jja`     VARCHAR(100)    DEFAULT NULL,
        `referencia_jja`      VARCHAR(255)    DEFAULT NULL,
        `estado_jja`          ENUM('pendiente','completado','fallido','reembolsado') NOT NULL DEFAULT 'pendiente',
        `creado_en_jja`       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id_transaccion_jja`),
        CONSTRAINT `fk_transaccion_solicitud_jja` FOREIGN KEY (`id_solicitud_jja`) REFERENCES `solicitudes_prestamo_jja` (`id_solicitud_jja`) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT `fk_transaccion_cliente_jja` FOREIGN KEY (`id_cliente_jja`) REFERENCES `usuarios_jja` (`id_usuario_jja`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    COMMENT='Transacciones monetarias relacionadas a solicitudes/ofertas';
", "Tabla <strong>transacciones_jja</strong>", $cnt_tablas_jja, $errores_jja);

// prestamos_productos_jja (préstamos generados desde marketplace)
ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `prestamos_productos_jja` (
    `id_prestamo_producto_jja` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_producto_jja`         INT UNSIGNED NOT NULL,
    `id_cliente_jja`          INT UNSIGNED NOT NULL,
    `id_empresa_jja`          INT UNSIGNED NOT NULL,
    `fecha_prestamo_jja`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_devolucion_jja`    DATETIME DEFAULT NULL,
    `estado_jja`              ENUM('activo','devuelto','vencido') NOT NULL DEFAULT 'activo',
    `observaciones_jja`       TEXT DEFAULT NULL,
    PRIMARY KEY (`id_prestamo_producto_jja`),
    CONSTRAINT `fk_prestprod_producto_jja` FOREIGN KEY (`id_producto_jja`)
        REFERENCES `productos_jja` (`id_producto_jja`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_prestprod_cliente_jja` FOREIGN KEY (`id_cliente_jja`)
        REFERENCES `usuarios_jja` (`id_usuario_jja`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_prestprod_empresa_jja` FOREIGN KEY (`id_empresa_jja`)
        REFERENCES `usuarios_jja` (`id_usuario_jja`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    COMMENT='Registros de préstamos generados a partir de solicitudes de productos (marketplace)';
", "Tabla <strong>prestamos_productos_jja</strong>", $cnt_tablas_jja, $errores_jja);

// solicitudes_devolucion_jja (solicitudes de devolución de préstamos de activos)
ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `solicitudes_devolucion_jja` (
        `id_solicitud_devolucion_jja` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        `id_prestamo_jja`             INT UNSIGNED NOT NULL,
        `id_usuario_solicitante_jja`  INT UNSIGNED NOT NULL,
        `estado_jja`                  ENUM('pendiente','en_proceso','aprobada','rechazada') NOT NULL DEFAULT 'pendiente',
        `observaciones_jja`           TEXT DEFAULT NULL,
        `creado_en_jja`               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `fecha_respuesta_jja`         TIMESTAMP NULL DEFAULT NULL,
        `respondido_por_jja`          INT UNSIGNED DEFAULT NULL,
        PRIMARY KEY (`id_solicitud_devolucion_jja`),
        CONSTRAINT `fk_soldev_prestamo_jja` FOREIGN KEY (`id_prestamo_jja`)
                REFERENCES `prestamos_jja` (`id_prestamo_jja`) ON DELETE RESTRICT ON UPDATE RESTRICT,
        CONSTRAINT `fk_soldev_usuario_jja` FOREIGN KEY (`id_usuario_solicitante_jja`)
                REFERENCES `usuarios_jja` (`id_usuario_jja`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    COMMENT='Solicitudes generadas por clientes para solicitar la devolución de un préstamo';
", "Tabla <strong>solicitudes_devolucion_jja</strong>", $cnt_tablas_jja, $errores_jja);

// solicitudes_devolucion_productos_jja (devoluciones de préstamos marketplace)
ejecutar_jja($pdo_jja, "
CREATE TABLE IF NOT EXISTS `solicitudes_devolucion_productos_jja` (
        `id_solicitud_devolucion_producto_jja` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        `id_prestamo_producto_jja`             INT UNSIGNED NOT NULL,
        `id_usuario_solicitante_jja`           INT UNSIGNED NOT NULL,
        `estado_jja`                           ENUM('pendiente','aprobada','rechazada') NOT NULL DEFAULT 'pendiente',
        `observaciones_jja`                    TEXT DEFAULT NULL,
        `creado_en_jja`                        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `fecha_respuesta_jja`                  DATETIME DEFAULT NULL,
        `respondido_por_jja`                   INT UNSIGNED DEFAULT NULL,
        PRIMARY KEY (`id_solicitud_devolucion_producto_jja`),
        CONSTRAINT `fk_soldevprod_prestamo_jja` FOREIGN KEY (`id_prestamo_producto_jja`)
                REFERENCES `prestamos_productos_jja` (`id_prestamo_producto_jja`) ON DELETE RESTRICT ON UPDATE RESTRICT,
        CONSTRAINT `fk_soldevprod_usuario_jja` FOREIGN KEY (`id_usuario_solicitante_jja`)
                REFERENCES `usuarios_jja` (`id_usuario_jja`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    COMMENT='Solicitudes de devolución para préstamos generados desde marketplace';
", "Tabla <strong>solicitudes_devolucion_productos_jja</strong>", $cnt_tablas_jja, $errores_jja);


$indices_jja = [
    ["CREATE INDEX `idx_activo_estado_jja`         ON `activos_jja`   (`estado_jja`)", "Índice: activos_jja · estado_jja"],
    ["CREATE INDEX `idx_prestamo_estado_jja`       ON `prestamos_jja` (`estado_prestamo_jja`)", "Índice: prestamos_jja · estado_prestamo_jja"],
    ["CREATE INDEX `idx_prestamo_fecha_limite_jja` ON `prestamos_jja` (`fecha_limite_jja`)", "Índice: prestamos_jja · fecha_limite_jja"],
    ["CREATE INDEX `idx_prestamo_usuario_jja`      ON `prestamos_jja` (`id_usuario_jja`)", "Índice: prestamos_jja · id_usuario_jja"],
    ["CREATE INDEX `idx_prestamo_activo_jja`       ON `prestamos_jja` (`id_activo_jja`)", "Índice: prestamos_jja · id_activo_jja"],
    ["CREATE INDEX `idx_historial_prestamo_jja`    ON `historial_prestamos_jja` (`id_prestamo_jja`)", "Índice: historial_prestamos_jja · id_prestamo_jja"],
    ["CREATE INDEX `idx_notif_usuario_leida_jja`   ON `notificaciones_jja` (`id_usuario_jja`, `leida_jja`)", "Índice compuesto: notificaciones_jja · usuario + leida"],
    ["CREATE INDEX `idx_lista_negra_usuario_jja`   ON `lista_negra_jja` (`id_usuario_jja`, `activa_jja`)", "Índice compuesto: lista_negra_jja · usuario + activa"],
    ["CREATE INDEX `idx_auditoria_tabla_jja`       ON `auditoria_jja` (`tabla_afectada_jja`)", "Índice: auditoria_jja · tabla_afectada_jja"],
    ["CREATE INDEX `idx_auditoria_fecha_jja`       ON `auditoria_jja` (`fecha_accion_jja`)", "Índice: auditoria_jja · fecha_accion_jja"],
    ["CREATE INDEX `idx_prestamo_usuario_estado_jja` ON `prestamos_jja` (`id_usuario_jja`, `estado_prestamo_jja`)", "Índice compuesto: prestamos_jja · usuario + estado"],
];

foreach ($indices_jja as $idx_jja) {
    try {
        $pdo_jja->exec($idx_jja[0]);
        mostrar_jja('ok', '✅', $idx_jja[1]);
        $cnt_indices_jja++;
    }
    catch (PDOException $e) {
        if ($e->getCode() == '42000' || strpos($e->getMessage(), '1061') !== false) {
            mostrar_jja('ok', '✅', $idx_jja[1] . " (Ya existía)");
            $cnt_indices_jja++;
        }
        else {
            mostrar_jja('err', '❌', "ERROR — {$idx_jja[1]}: " . $e->getMessage());
            $errores_jja++;
        }
    }
}

// ══════════════════════════════════════════════════════════════
// 4. STORED PROCEDURES — CRUD COMPLETO POR TABLA
// ══════════════════════════════════════════════════════════════
echo "<p class='seccion'>④ STORED PROCEDURES (CRUD · Transacciones · Lógica de Negocio)</p>";
mostrar_jja('info', 'ℹ️', "Eliminando SPs existentes para garantizar idempotencia...");

// ── DROP de todos los SPs ────────────────────────────────────
$sps_a_eliminar_jja = [
    // Roles
    'SP_CREAR_ROL_jja', 'SP_LEER_ROLES_jja', 'SP_LEER_ROL_ID_jja', 'SP_ACTUALIZAR_ROL_jja', 'SP_ELIMINAR_ROL_jja',
    // Usuarios
    'SP_CREAR_USUARIO_jja', 'SP_LEER_USUARIOS_jja', 'SP_LEER_USUARIO_ID_jja', 'SP_LEER_USUARIO_CEDULA_jja',
    'SP_ACTUALIZAR_USUARIO_jja', 'SP_ELIMINAR_USUARIO_jja', 'SP_CAMBIAR_CONTRASENA_jja', 'SP_ACTUALIZAR_IMAGEN_USUARIO_jja',
    // Tipos activos
    'SP_CREAR_TIPO_ACTIVO_jja', 'SP_LEER_TIPOS_ACTIVOS_jja', 'SP_LEER_TIPO_ACTIVO_ID_jja',
    'SP_ACTUALIZAR_TIPO_ACTIVO_jja', 'SP_ELIMINAR_TIPO_ACTIVO_jja',
    // Políticas
    'SP_CREAR_POLITICA_jja', 'SP_LEER_POLITICAS_jja', 'SP_LEER_POLITICA_TIPO_jja',
    'SP_ACTUALIZAR_POLITICA_jja', 'SP_ELIMINAR_POLITICA_jja',
    // Activos
    'SP_CREAR_ACTIVO_jja', 'SP_LEER_ACTIVOS_jja', 'SP_LEER_ACTIVO_ID_jja',
    'SP_LEER_ACTIVO_QR_jja', 'SP_LEER_ACTIVO_NFC_jja', 'SP_ACTUALIZAR_ACTIVO_jja',
    'SP_ACTUALIZAR_ESTADO_ACTIVO_jja', 'SP_ELIMINAR_ACTIVO_jja',
    // Préstamos
    'SP_REGISTRAR_PRESTAMO_jja', 'SP_REGISTRAR_DEVOLUCION_jja', 'SP_LEER_PRESTAMOS_jja',
    'SP_LEER_PRESTAMO_ID_jja', 'SP_LEER_PRESTAMOS_USUARIO_jja', 'SP_LEER_PRESTAMOS_ACTIVOS_jja',
    'SP_LEER_PRESTAMOS_POR_ACTIVO_jja', 'SP_LEER_PRESTAMOS_VENCIDOS_jja', 'SP_MARCAR_PRESTAMO_PERDIDO_jja', 'SP_ACTUALIZAR_VENCIDOS_jja',
    // Notificaciones
    'SP_CREAR_NOTIFICACION_jja', 'SP_LEER_NOTIFICACIONES_USUARIO_jja',
    'SP_MARCAR_NOTIFICACION_LEIDA_jja', 'SP_MARCAR_TODAS_LEIDAS_jja', 'SP_ELIMINAR_NOTIFICACION_jja',
    // Lista negra
    'SP_CREAR_SANCION_jja', 'SP_LEER_SANCIONES_jja', 'SP_LEER_SANCIONES_USUARIO_jja',
    'SP_LEVANTAR_SANCION_jja', 'SP_VERIFICAR_SANCION_jja',
    // Auditoría
    'SP_LEER_AUDITORIA_jja', 'SP_LEER_AUDITORIA_TABLA_jja', 'SP_LEER_AUDITORIA_USUARIO_jja',
    'SP_REGISTRAR_AUDITORIA_jja',
    // Tokens
    'SP_INVALIDAR_TOKEN_jja', 'SP_VERIFICAR_TOKEN_INVALIDO_jja', 'SP_LIMPIAR_TOKENS_jja',
    // Reportes
    'SP_REPORTE_PRESTAMOS_jja', 'SP_REPORTE_ACTIVOS_MAS_PRESTADOS_jja',
    'SP_REPORTE_USUARIOS_ACTIVOS_jja', 'SP_REPORTE_TASA_DEVOLUCION_jja',
];

foreach ($sps_a_eliminar_jja as $sp_jja) {
    try {
        $pdo_jja->exec("DROP PROCEDURE IF EXISTS `{$sp_jja}`");
    }
    catch (PDOException $e) {
    }
}
mostrar_jja('ok', '✅', "SPs existentes eliminados correctamente.");

// ═══════════════════════
// STORED PROCEDURES ROLES
// ═══════════════════════
ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_CREAR_ROL_jja`(
    IN p_nombre_jja       VARCHAR(50),
    IN p_descripcion_jja  VARCHAR(255)
)
BEGIN
    INSERT INTO `roles_jja` (`nombre_rol_jja`, `descripcion_jja`)
    VALUES (p_nombre_jja, p_descripcion_jja);
    SELECT LAST_INSERT_ID() AS `id_rol_jja`;
END
", "SP: SP_CREAR_ROL_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_ROLES_jja`()
BEGIN
    SELECT `id_rol_jja`, `nombre_rol_jja`, `descripcion_jja`, `estado_registro_jja`, `creado_en_jja`
    FROM `roles_jja`
    WHERE `estado_registro_jja` = 1
    ORDER BY `id_rol_jja`;
END
", "SP: SP_LEER_ROLES_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_ROL_ID_jja`(IN p_id_jja INT UNSIGNED)
BEGIN
    SELECT `id_rol_jja`, `nombre_rol_jja`, `descripcion_jja`, `estado_registro_jja`, `creado_en_jja`
    FROM `roles_jja`
    WHERE `id_rol_jja` = p_id_jja AND `estado_registro_jja` = 1;
END
", "SP: SP_LEER_ROL_ID_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_ACTUALIZAR_ROL_jja`(
    IN p_id_jja          INT UNSIGNED,
    IN p_nombre_jja      VARCHAR(50),
    IN p_descripcion_jja VARCHAR(255)
)
BEGIN
    UPDATE `roles_jja`
    SET `nombre_rol_jja` = p_nombre_jja, `descripcion_jja` = p_descripcion_jja
    WHERE `id_rol_jja` = p_id_jja;
    SELECT ROW_COUNT() AS `filas_afectadas`;
END
", "SP: SP_ACTUALIZAR_ROL_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_ELIMINAR_ROL_jja`(IN p_id_jja INT UNSIGNED)
BEGIN
    UPDATE `roles_jja` SET `estado_registro_jja` = 0 WHERE `id_rol_jja` = p_id_jja;
    SELECT ROW_COUNT() AS `filas_afectadas`;
END
", "SP: SP_ELIMINAR_ROL_jja (soft delete)", $cnt_sp_jja, $errores_jja);

// ═══════════════════════
// STORED PROCEDURES USUARIOS
// ═══════════════════════
ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_CREAR_USUARIO_jja`(
    IN p_nombre_jja      VARCHAR(100),
    IN p_apellido_jja    VARCHAR(100),
    IN p_cedula_jja      VARCHAR(20),
    IN p_correo_jja      VARCHAR(150),
    IN p_telefono_jja    VARCHAR(20),
    IN p_contrasena_jja  VARCHAR(255),
    IN p_imagen_jja      VARCHAR(255),
    IN p_id_rol_jja      INT UNSIGNED,
    IN p_debe_cambiar_jja TINYINT(1)
)
BEGIN
    DECLARE v_existe_cedula INT DEFAULT 0;
    DECLARE v_existe_correo INT DEFAULT 0;
    SELECT COUNT(*) INTO v_existe_cedula FROM `usuarios_jja` WHERE `cedula_jja` = p_cedula_jja AND `estado_registro_jja` = 1;
    SELECT COUNT(*) INTO v_existe_correo FROM `usuarios_jja` WHERE `correo_jja`  = p_correo_jja  AND `estado_registro_jja` = 1;
    IF v_existe_cedula > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La cédula ya está registrada en el sistema.';
    ELSEIF v_existe_correo > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El correo ya está registrado en el sistema.';
    ELSE
        INSERT INTO `usuarios_jja` (`nombre_jja`, `apellido_jja`, `cedula_jja`, `correo_jja`, `telefono_jja`, `contrasena_jja`, `imagen_jja`, `id_rol_jja`, `debe_cambiar_clave_jja`)
        VALUES (p_nombre_jja, p_apellido_jja, p_cedula_jja, p_correo_jja, p_telefono_jja, p_contrasena_jja, p_imagen_jja, p_id_rol_jja, p_debe_cambiar_jja);
        SELECT LAST_INSERT_ID() AS `id_usuario_jja`;
    END IF;
END
", "SP: SP_CREAR_USUARIO_jja (con validación de duplicados)", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_USUARIOS_jja`()
BEGIN
    SELECT usu.`id_usuario_jja`, usu.`nombre_jja`, usu.`apellido_jja`, usu.`cedula_jja`,
           usu.`correo_jja`, usu.`telefono_jja`, usu.`imagen_jja`, usu.`id_rol_jja`,
           rol.`nombre_rol_jja`, usu.`estado_registro_jja`, usu.`creado_en_jja`, usu.`debe_cambiar_clave_jja`
    FROM `usuarios_jja` usu
    INNER JOIN `roles_jja` rol ON usu.`id_rol_jja` = rol.`id_rol_jja`
    WHERE usu.`estado_registro_jja` = 1
    ORDER BY usu.`apellido_jja`, usu.`nombre_jja`;
END
", "SP: SP_LEER_USUARIOS_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_USUARIO_ID_jja`(IN p_id_jja INT UNSIGNED)
BEGIN
    SELECT usu.`id_usuario_jja`, usu.`nombre_jja`, usu.`apellido_jja`, usu.`cedula_jja`,
           usu.`correo_jja`, usu.`telefono_jja`, usu.`imagen_jja`, usu.`id_rol_jja`, rol.`nombre_rol_jja`,
           usu.`estado_registro_jja`, usu.`creado_en_jja`, usu.`debe_cambiar_clave_jja`
    FROM `usuarios_jja` usu
    INNER JOIN `roles_jja` rol ON usu.`id_rol_jja` = rol.`id_rol_jja`
    WHERE usu.`id_usuario_jja` = p_id_jja AND usu.`estado_registro_jja` = 1;
END
", "SP: SP_LEER_USUARIO_ID_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_USUARIO_CEDULA_jja`(IN p_cedula_jja VARCHAR(20))
BEGIN
    SELECT usu.`id_usuario_jja`, usu.`nombre_jja`, usu.`apellido_jja`, usu.`cedula_jja`,
           usu.`correo_jja`, usu.`telefono_jja`, usu.`contrasena_jja`, usu.`imagen_jja`,
           usu.`id_rol_jja`, rol.`nombre_rol_jja`, usu.`estado_registro_jja`, usu.`debe_cambiar_clave_jja`
    FROM `usuarios_jja` usu
    INNER JOIN `roles_jja` rol ON usu.`id_rol_jja` = rol.`id_rol_jja`
    WHERE usu.`cedula_jja` = p_cedula_jja AND usu.`estado_registro_jja` = 1;
END
", "SP: SP_LEER_USUARIO_CEDULA_jja (login)", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_USUARIO_CORREO_jja`(IN p_correo_jja VARCHAR(150))
BEGIN
    SELECT usu.`id_usuario_jja`, usu.`nombre_jja`, usu.`apellido_jja`, usu.`cedula_jja`,
           usu.`correo_jja`, usu.`telefono_jja`, usu.`contrasena_jja`, usu.`imagen_jja`,
           usu.`id_rol_jja`, rol.`nombre_rol_jja`, usu.`estado_registro_jja`, usu.`debe_cambiar_clave_jja`
    FROM `usuarios_jja` usu
    INNER JOIN `roles_jja` rol ON usu.`id_rol_jja` = rol.`id_rol_jja`
    WHERE usu.`correo_jja` = p_correo_jja AND usu.`estado_registro_jja` = 1;
END
", "SP: SP_LEER_USUARIO_CORREO_jja (login por correo)", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_ACTUALIZAR_USUARIO_jja`(
    IN p_id_jja       INT UNSIGNED,
    IN p_nombre_jja   VARCHAR(100),
    IN p_apellido_jja VARCHAR(100),
    IN p_correo_jja   VARCHAR(150),
    IN p_telefono_jja VARCHAR(20),
    IN p_id_rol_jja   INT UNSIGNED
)
BEGIN
    DECLARE v_correo_dup INT DEFAULT 0;
    SELECT COUNT(*) INTO v_correo_dup
    FROM `usuarios_jja`
    WHERE `correo_jja` = p_correo_jja
      AND `id_usuario_jja` <> p_id_jja
      AND `estado_registro_jja` = 1;

    IF v_correo_dup > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El correo ya está en uso por otro usuario.';
    ELSE
        UPDATE `usuarios_jja`
        SET `nombre_jja`   = p_nombre_jja,
            `apellido_jja` = p_apellido_jja,
            `correo_jja`   = p_correo_jja,
            `telefono_jja` = p_telefono_jja,
            `id_rol_jja`   = p_id_rol_jja
        WHERE `id_usuario_jja` = p_id_jja AND `estado_registro_jja` = 1;
        SELECT ROW_COUNT() AS `filas_afectadas`;
    END IF;
END
", "SP: SP_ACTUALIZAR_USUARIO_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_ELIMINAR_USUARIO_jja`(IN p_id_jja INT UNSIGNED)
BEGIN
    UPDATE `usuarios_jja` SET `estado_registro_jja` = 0 WHERE `id_usuario_jja` = p_id_jja;
    SELECT ROW_COUNT() AS `filas_afectadas`;
END
", "SP: SP_ELIMINAR_USUARIO_jja (soft delete)", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_CAMBIAR_CONTRASENA_jja`(
    IN p_id_jja          INT UNSIGNED,
    IN p_nueva_hash_jja  VARCHAR(255)
)
BEGIN
    UPDATE `usuarios_jja` SET `contrasena_jja` = p_nueva_hash_jja, `debe_cambiar_clave_jja` = 0
    WHERE `id_usuario_jja` = p_id_jja AND `estado_registro_jja` = 1;
    SELECT ROW_COUNT() AS `filas_afectadas`;
END
", "SP: SP_CAMBIAR_CONTRASENA_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_ACTUALIZAR_IMAGEN_USUARIO_jja`(
    IN p_id_jja          INT UNSIGNED,
    IN p_imagen_jja      VARCHAR(255)
)
BEGIN
    UPDATE `usuarios_jja` SET `imagen_jja` = p_imagen_jja
    WHERE `id_usuario_jja` = p_id_jja AND `estado_registro_jja` = 1;
    SELECT ROW_COUNT() AS `filas_afectadas`;
END
", "SP: SP_ACTUALIZAR_IMAGEN_USUARIO_jja", $cnt_sp_jja, $errores_jja);

// ═══════════════════════
// STORED PROCEDURES TIPOS ACTIVOS
// ═══════════════════════
ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_CREAR_TIPO_ACTIVO_jja`(
    IN p_nombre_jja      VARCHAR(100),
    IN p_descripcion_jja VARCHAR(255)
)
BEGIN
    INSERT INTO `tipos_activos_jja` (`nombre_tipo_jja`, `descripcion_jja`)
    VALUES (p_nombre_jja, p_descripcion_jja);
    SELECT LAST_INSERT_ID() AS `id_tipo_jja`;
END
", "SP: SP_CREAR_TIPO_ACTIVO_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_TIPOS_ACTIVOS_jja`()
BEGIN
    SELECT `id_tipo_jja`, `nombre_tipo_jja`, `descripcion_jja`, `estado_registro_jja`, `creado_en_jja`
    FROM `tipos_activos_jja`
    WHERE `estado_registro_jja` = 1
    ORDER BY `nombre_tipo_jja`;
END
", "SP: SP_LEER_TIPOS_ACTIVOS_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_TIPO_ACTIVO_ID_jja`(IN p_id_jja INT UNSIGNED)
BEGIN
    SELECT `id_tipo_jja`, `nombre_tipo_jja`, `descripcion_jja`, `estado_registro_jja`, `creado_en_jja`
    FROM `tipos_activos_jja`
    WHERE `id_tipo_jja` = p_id_jja AND `estado_registro_jja` = 1;
END
", "SP: SP_LEER_TIPO_ACTIVO_ID_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_ACTUALIZAR_TIPO_ACTIVO_jja`(
    IN p_id_jja          INT UNSIGNED,
    IN p_nombre_jja      VARCHAR(100),
    IN p_descripcion_jja VARCHAR(255)
)
BEGIN
    UPDATE `tipos_activos_jja`
    SET `nombre_tipo_jja` = p_nombre_jja, `descripcion_jja` = p_descripcion_jja
    WHERE `id_tipo_jja` = p_id_jja;
    SELECT ROW_COUNT() AS `filas_afectadas`;
END
", "SP: SP_ACTUALIZAR_TIPO_ACTIVO_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_ELIMINAR_TIPO_ACTIVO_jja`(IN p_id_jja INT UNSIGNED)
BEGIN
    UPDATE `tipos_activos_jja` SET `estado_registro_jja` = 0 WHERE `id_tipo_jja` = p_id_jja;
    SELECT ROW_COUNT() AS `filas_afectadas`;
END
", "SP: SP_ELIMINAR_TIPO_ACTIVO_jja (soft delete)", $cnt_sp_jja, $errores_jja);

// ═══════════════════════
// STORED PROCEDURES POLÍTICAS
// ═══════════════════════
ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_CREAR_POLITICA_jja`(
    IN p_id_tipo_jja              INT UNSIGNED,
    IN p_dias_maximo_jja          TINYINT UNSIGNED,
    IN p_max_simultaneos_jja      TINYINT UNSIGNED,
    IN p_requiere_mismo_dia_jja   TINYINT(1)
)
BEGIN
    INSERT INTO `politicas_prestamo_jja`
        (`id_tipo_jja`, `dias_maximo_jja`, `max_prestamos_simultaneos_jja`, `requiere_mismo_dia_jja`)
    VALUES (p_id_tipo_jja, p_dias_maximo_jja, p_max_simultaneos_jja, p_requiere_mismo_dia_jja);
    SELECT LAST_INSERT_ID() AS `id_politica_jja`;
END
", "SP: SP_CREAR_POLITICA_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_POLITICAS_jja`()
BEGIN
    SELECT pol.`id_politica_jja`, pol.`id_tipo_jja`, tip.`nombre_tipo_jja`,
           pol.`dias_maximo_jja`, pol.`max_prestamos_simultaneos_jja`, pol.`requiere_mismo_dia_jja`
    FROM `politicas_prestamo_jja` pol
    INNER JOIN `tipos_activos_jja` tip ON pol.`id_tipo_jja` = tip.`id_tipo_jja`
    WHERE pol.`estado_registro_jja` = 1;
END
", "SP: SP_LEER_POLITICAS_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_POLITICA_TIPO_jja`(IN p_id_tipo_jja INT UNSIGNED)
BEGIN
    SELECT `id_politica_jja`, `id_tipo_jja`, `dias_maximo_jja`,
           `max_prestamos_simultaneos_jja`, `requiere_mismo_dia_jja`
    FROM `politicas_prestamo_jja`
    WHERE `id_tipo_jja` = p_id_tipo_jja AND `estado_registro_jja` = 1;
END
", "SP: SP_LEER_POLITICA_TIPO_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_ACTUALIZAR_POLITICA_jja`(
    IN p_id_jja              INT UNSIGNED,
    IN p_dias_maximo_jja     TINYINT UNSIGNED,
    IN p_max_simult_jja      TINYINT UNSIGNED,
    IN p_mismo_dia_jja       TINYINT(1)
)
BEGIN
    UPDATE `politicas_prestamo_jja`
    SET `dias_maximo_jja`               = p_dias_maximo_jja,
        `max_prestamos_simultaneos_jja` = p_max_simult_jja,
        `requiere_mismo_dia_jja`        = p_mismo_dia_jja
    WHERE `id_politica_jja` = p_id_jja;
    SELECT ROW_COUNT() AS `filas_afectadas`;
END
", "SP: SP_ACTUALIZAR_POLITICA_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_ELIMINAR_POLITICA_jja`(IN p_id_jja INT UNSIGNED)
BEGIN
    UPDATE `politicas_prestamo_jja` SET `estado_registro_jja` = 0 WHERE `id_politica_jja` = p_id_jja;
    SELECT ROW_COUNT() AS `filas_afectadas`;
END
", "SP: SP_ELIMINAR_POLITICA_jja (soft delete)", $cnt_sp_jja, $errores_jja);

// ═══════════════════════
// STORED PROCEDURES ACTIVOS
// ═══════════════════════
ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_CREAR_ACTIVO_jja`(
    IN p_nombre_jja       VARCHAR(200),
    IN p_codigo_qr_jja    VARCHAR(50),
    IN p_codigo_nfc_jja   VARCHAR(50),
    IN p_id_tipo_jja      INT UNSIGNED,
    IN p_ubicacion_jja    VARCHAR(150),
    IN p_descripcion_jja  TEXT
)
BEGIN
    DECLARE v_existe_qr INT DEFAULT 0;
    SELECT COUNT(*) INTO v_existe_qr FROM `activos_jja` WHERE `codigo_qr_jja` = p_codigo_qr_jja AND `estado_registro_jja` = 1;
    IF v_existe_qr > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El código QR ya está asignado a otro activo.';
    ELSE
        INSERT INTO `activos_jja` (`nombre_jja`, `codigo_qr_jja`, `codigo_nfc_jja`, `id_tipo_jja`, `ubicacion_jja`, `descripcion_jja`)
        VALUES (p_nombre_jja, p_codigo_qr_jja, p_codigo_nfc_jja, p_id_tipo_jja, p_ubicacion_jja, p_descripcion_jja);
        SELECT LAST_INSERT_ID() AS `id_activo_jja`;
    END IF;
END
", "SP: SP_CREAR_ACTIVO_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_ACTIVOS_jja`()
BEGIN
    SELECT actv.`id_activo_jja`, actv.`nombre_jja`, actv.`codigo_qr_jja`, actv.`codigo_nfc_jja`,
           actv.`id_tipo_jja`, tipo.`nombre_tipo_jja`, actv.`ubicacion_jja`,
           actv.`descripcion_jja`, actv.`estado_jja`, actv.`estado_registro_jja`, actv.`creado_en_jja`
    FROM `activos_jja` actv
    INNER JOIN `tipos_activos_jja` tipo ON actv.`id_tipo_jja` = tipo.`id_tipo_jja`
    WHERE actv.`estado_registro_jja` = 1
    ORDER BY actv.`nombre_jja`;
END
", "SP: SP_LEER_ACTIVOS_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_ACTIVO_ID_jja`(IN p_id_jja INT UNSIGNED)
BEGIN
    SELECT actv.`id_activo_jja`, actv.`nombre_jja`, actv.`codigo_qr_jja`, actv.`codigo_nfc_jja`,
           actv.`id_tipo_jja`, tipo.`nombre_tipo_jja`, actv.`ubicacion_jja`,
           actv.`descripcion_jja`, actv.`estado_jja`, actv.`creado_en_jja`
    FROM `activos_jja` actv
    INNER JOIN `tipos_activos_jja` tipo ON actv.`id_tipo_jja` = tipo.`id_tipo_jja`
    WHERE actv.`id_activo_jja` = p_id_jja AND actv.`estado_registro_jja` = 1;
END
", "SP: SP_LEER_ACTIVO_ID_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_ACTIVO_QR_jja`(IN p_qr_jja VARCHAR(50))
BEGIN
    SELECT actv.`id_activo_jja`, actv.`nombre_jja`, actv.`codigo_qr_jja`, actv.`codigo_nfc_jja`,
           actv.`id_tipo_jja`, tipo.`nombre_tipo_jja`, actv.`ubicacion_jja`,
           actv.`descripcion_jja`, actv.`estado_jja`
    FROM `activos_jja` actv
    INNER JOIN `tipos_activos_jja` tipo ON actv.`id_tipo_jja` = tipo.`id_tipo_jja`
    WHERE actv.`codigo_qr_jja` = p_qr_jja AND actv.`estado_registro_jja` = 1;
END
", "SP: SP_LEER_ACTIVO_QR_jja (escaneo QR)", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_ACTIVO_NFC_jja`(IN p_nfc_jja VARCHAR(50))
BEGIN
    SELECT actv.`id_activo_jja`, actv.`nombre_jja`, actv.`codigo_qr_jja`, actv.`codigo_nfc_jja`,
           actv.`id_tipo_jja`, tipo.`nombre_tipo_jja`, actv.`ubicacion_jja`,
           actv.`descripcion_jja`, actv.`estado_jja`
    FROM `activos_jja` actv
    INNER JOIN `tipos_activos_jja` tipo ON actv.`id_tipo_jja` = tipo.`id_tipo_jja`
    WHERE actv.`codigo_nfc_jja` = p_nfc_jja AND actv.`estado_registro_jja` = 1;
END
", "SP: SP_LEER_ACTIVO_NFC_jja (lectura NFC)", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_ACTUALIZAR_ACTIVO_jja`(
    IN p_id_jja          INT UNSIGNED,
    IN p_nombre_jja      VARCHAR(200),
    IN p_id_tipo_jja     INT UNSIGNED,
    IN p_ubicacion_jja   VARCHAR(150),
    IN p_descripcion_jja TEXT
)
BEGIN
    UPDATE `activos_jja`
    SET `nombre_jja`      = p_nombre_jja,
        `id_tipo_jja`     = p_id_tipo_jja,
        `ubicacion_jja`   = p_ubicacion_jja,
        `descripcion_jja` = p_descripcion_jja
    WHERE `id_activo_jja` = p_id_jja AND `estado_registro_jja` = 1;
    SELECT ROW_COUNT() AS `filas_afectadas`;
END
", "SP: SP_ACTUALIZAR_ACTIVO_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_ACTUALIZAR_ESTADO_ACTIVO_jja`(
    IN p_id_jja     INT UNSIGNED,
    IN p_estado_jja ENUM('disponible','prestado','en_proceso_prestamo','mantenimiento','dañado','perdido')
)
BEGIN
    UPDATE `activos_jja`
    SET `estado_jja` = p_estado_jja
    WHERE `id_activo_jja` = p_id_jja AND `estado_registro_jja` = 1;
    SELECT ROW_COUNT() AS `filas_afectadas`;
END
", "SP: SP_ACTUALIZAR_ESTADO_ACTIVO_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_ELIMINAR_ACTIVO_jja`(IN p_id_jja INT UNSIGNED)
BEGIN
    DECLARE v_prestado INT DEFAULT 0;
    SELECT COUNT(*) INTO v_prestado
    FROM `prestamos_jja`
    WHERE `id_activo_jja` = p_id_jja AND `estado_prestamo_jja` = 'activo';
    IF v_prestado > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede eliminar un activo con un préstamo activo.';
    ELSE
        UPDATE `activos_jja` SET `estado_registro_jja` = 0 WHERE `id_activo_jja` = p_id_jja;
        SELECT ROW_COUNT() AS `filas_afectadas`;
    END IF;
END
", "SP: SP_ELIMINAR_ACTIVO_jja (soft delete · valida préstamo activo)", $cnt_sp_jja, $errores_jja);

// ═══════════════════════
// STORED PROCEDURES PRÉSTAMOS (CON TRANSACCIONES)
// ═══════════════════════
ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_REGISTRAR_PRESTAMO_jja`(
    IN p_id_activo_jja      INT UNSIGNED,
    IN p_id_usuario_jja     INT UNSIGNED,
    IN p_id_encargado_jja   INT UNSIGNED,
    IN p_observaciones_jja  TEXT
)
BEGIN
    DECLARE v_estado_activo     VARCHAR(20)  DEFAULT '';
    DECLARE v_id_tipo           INT UNSIGNED DEFAULT 0;
    DECLARE v_dias_max          TINYINT      DEFAULT 7;
    DECLARE v_sancion_activa    INT          DEFAULT 0;
    DECLARE v_prestamos_activos INT          DEFAULT 0;
    DECLARE v_max_simult        TINYINT      DEFAULT 1;
    DECLARE v_id_prestamo_nuevo INT UNSIGNED DEFAULT 0;
    DECLARE v_mismo_dia         TINYINT      DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Verificar estado del activo
    SELECT `estado_jja`, `id_tipo_jja`
    INTO v_estado_activo, v_id_tipo
    FROM `activos_jja`
    WHERE `id_activo_jja` = p_id_activo_jja AND `estado_registro_jja` = 1
    FOR UPDATE;

    IF v_estado_activo IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El activo no existe o fue eliminado.';
    END IF;
    IF v_estado_activo NOT IN ('disponible', 'en_proceso_prestamo') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El activo no está disponible para préstamo.';
    END IF;

    -- Verificar si el usuario está en lista negra
    SELECT COUNT(*) INTO v_sancion_activa
    FROM `lista_negra_jja`
    WHERE `id_usuario_jja` = p_id_usuario_jja
      AND `activa_jja` = 1
      AND (`fecha_fin_sancion_jja` IS NULL OR `fecha_fin_sancion_jja` > NOW());
    IF v_sancion_activa > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El usuario tiene una sanción activa y no puede recibir préstamos.';
    END IF;

    -- Obtener política de préstamo
    
    SELECT `dias_maximo_jja`, `max_prestamos_simultaneos_jja`, `requiere_mismo_dia_jja`
    INTO v_dias_max, v_max_simult, v_mismo_dia
    FROM `politicas_prestamo_jja`
    WHERE `id_tipo_jja` = v_id_tipo AND `estado_registro_jja` = 1;

    -- Validar si requiere devolución el mismo día
    IF v_mismo_dia = 1 THEN
        SET v_dias_max = 0;
    END IF;

    -- Verificar límite de préstamos simultáneos del usuario
    SELECT COUNT(*) INTO v_prestamos_activos
    FROM `prestamos_jja` prest
    INNER JOIN `activos_jja` actv ON prest.`id_activo_jja` = actv.`id_activo_jja`
    WHERE prest.`id_usuario_jja` = p_id_usuario_jja
      AND prest.`estado_prestamo_jja` = 'activo'
      AND actv.`id_tipo_jja` = v_id_tipo;
    IF v_prestamos_activos >= v_max_simult THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El usuario superó el límite de préstamos simultáneos para este tipo de activo.';
    END IF;

    -- Registrar el préstamo
    INSERT INTO `prestamos_jja` (`id_activo_jja`, `id_usuario_jja`, `id_encargado_jja`, `fecha_limite_jja`, `observaciones_jja`)
    VALUES (p_id_activo_jja, p_id_usuario_jja, p_id_encargado_jja,
            DATE_ADD(NOW(), INTERVAL v_dias_max DAY), p_observaciones_jja);
    SET v_id_prestamo_nuevo = LAST_INSERT_ID();

    -- Cambiar estado del activo a 'prestado'
    UPDATE `activos_jja` SET `estado_jja` = 'prestado' WHERE `id_activo_jja` = p_id_activo_jja;

    -- Registrar en historial
    INSERT INTO `historial_prestamos_jja` (`id_prestamo_jja`, `id_activo_jja`, `id_usuario_jja`, `accion_jja`, `detalles_jja`)
    VALUES (v_id_prestamo_nuevo, p_id_activo_jja, p_id_usuario_jja, 'checkout', 'Préstamo registrado correctamente.');

    COMMIT;
    SELECT v_id_prestamo_nuevo AS `id_prestamo_jja`, v_dias_max AS `dias_prestamo_jja`;
END
", "SP: SP_REGISTRAR_PRESTAMO_jja (transacción completa · valida sanción · límite simultáneos)", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_REGISTRAR_DEVOLUCION_jja`(
    IN p_id_prestamo_jja    INT UNSIGNED,
    IN p_id_encargado_jja   INT UNSIGNED,
    IN p_observaciones_jja  TEXT
)
BEGIN
    DECLARE v_id_activo     INT UNSIGNED DEFAULT 0;
    DECLARE v_id_usuario    INT UNSIGNED DEFAULT 0;
    DECLARE v_estado_prest  VARCHAR(20)  DEFAULT '';

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT `id_activo_jja`, `id_usuario_jja`, `estado_prestamo_jja`
    INTO v_id_activo, v_id_usuario, v_estado_prest
    FROM `prestamos_jja`
    WHERE `id_prestamo_jja` = p_id_prestamo_jja AND `estado_registro_jja` = 1
    FOR UPDATE;

    IF v_estado_prest IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El préstamo no existe.';
    END IF;
    IF v_estado_prest NOT IN ('activo', 'vencido') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El préstamo ya fue cerrado o no está en estado válido para devolución.';
    END IF;

    -- Cerrar el préstamo
    UPDATE `prestamos_jja`
    SET `estado_prestamo_jja`  = 'devuelto',
        `fecha_devolucion_jja` = NOW(),
        `observaciones_jja`    = COALESCE(p_observaciones_jja, `observaciones_jja`)
    WHERE `id_prestamo_jja` = p_id_prestamo_jja;

    -- Liberar el activo
    UPDATE `activos_jja` SET `estado_jja` = 'disponible' WHERE `id_activo_jja` = v_id_activo;

    -- Registrar en historial
    INSERT INTO `historial_prestamos_jja` (`id_prestamo_jja`, `id_activo_jja`, `id_usuario_jja`, `accion_jja`, `detalles_jja`)
    VALUES (p_id_prestamo_jja, v_id_activo, v_id_usuario, 'checkin', 'Devolución registrada correctamente.');

    -- Notificar confirmación
    INSERT INTO `notificaciones_jja` (`id_usuario_jja`, `id_prestamo_jja`, `tipo_notificacion_jja`, `titulo_jja`, `mensaje_jja`)
    VALUES (v_id_usuario, p_id_prestamo_jja, 'devolucion_confirmada',
            'Devolución confirmada',
            CONCAT('El activo ha sido devuelto correctamente. Fecha: ', DATE_FORMAT(NOW(), '%d/%m/%Y %H:%i')));

    COMMIT;
    SELECT 'Devolución registrada exitosamente.' AS `mensaje_jja`;
END
", "SP: SP_REGISTRAR_DEVOLUCION_jja (transacción completa · notificación automática)", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_PRESTAMOS_jja`()
BEGIN
    SELECT prest.`id_prestamo_jja`, prest.`id_activo_jja`, actv.`nombre_jja` AS `activo_nombre_jja`,
           actv.`codigo_qr_jja`, prest.`id_usuario_jja`,
           CONCAT(usu.`nombre_jja`, ' ', usu.`apellido_jja`) AS `usuario_nombre_completo_jja`,
           usu.`cedula_jja`,
           CONCAT(enc.`nombre_jja`, ' ', enc.`apellido_jja`) AS `encargado_nombre_jja`,
           prest.`fecha_prestamo_jja`, prest.`fecha_limite_jja`,
           prest.`fecha_devolucion_jja`, prest.`estado_prestamo_jja`, prest.`observaciones_jja`
    FROM `prestamos_jja` prest
    INNER JOIN `activos_jja`  actv ON prest.`id_activo_jja`   = actv.`id_activo_jja`
    INNER JOIN `usuarios_jja` usu  ON prest.`id_usuario_jja`  = usu.`id_usuario_jja`
    INNER JOIN `usuarios_jja` enc  ON prest.`id_encargado_jja`= enc.`id_usuario_jja`
    WHERE prest.`estado_registro_jja` = 1
    ORDER BY prest.`fecha_prestamo_jja` DESC;
END
", "SP: SP_LEER_PRESTAMOS_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_PRESTAMO_ID_jja`(IN p_id_jja INT UNSIGNED)
BEGIN
        SELECT prest.`id_prestamo_jja`, prest.`id_usuario_jja`, actv.`nombre_jja` AS `activo_nombre_jja`,
            actv.`codigo_qr_jja`, actv.`codigo_nfc_jja`,
            CONCAT(usu.`nombre_jja`, ' ', usu.`apellido_jja`) AS `usuario_nombre_jja`,
            usu.`cedula_jja`, usu.`correo_jja`,
           prest.`fecha_prestamo_jja`, prest.`fecha_limite_jja`,
           prest.`fecha_devolucion_jja`, prest.`estado_prestamo_jja`, prest.`observaciones_jja`
    FROM `prestamos_jja` prest
    INNER JOIN `activos_jja`  actv ON prest.`id_activo_jja`  = actv.`id_activo_jja`
    INNER JOIN `usuarios_jja` usu  ON prest.`id_usuario_jja` = usu.`id_usuario_jja`
    WHERE prest.`id_prestamo_jja` = p_id_jja AND prest.`estado_registro_jja` = 1;
END
", "SP: SP_LEER_PRESTAMO_ID_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_PRESTAMOS_USUARIO_jja`(IN p_id_usuario_jja INT UNSIGNED)
BEGIN
        SELECT prest.`id_prestamo_jja`, prest.`id_activo_jja`, actv.`nombre_jja` AS `activo_nombre_jja`,
            tipo.`nombre_tipo_jja`, actv.`codigo_qr_jja`,
            prest.`fecha_prestamo_jja`, prest.`fecha_limite_jja`,
            prest.`fecha_devolucion_jja`, prest.`estado_prestamo_jja`
    FROM `prestamos_jja` prest
    INNER JOIN `activos_jja`      actv ON prest.`id_activo_jja` = actv.`id_activo_jja`
    INNER JOIN `tipos_activos_jja` tipo ON actv.`id_tipo_jja`   = tipo.`id_tipo_jja`
    WHERE prest.`id_usuario_jja` = p_id_usuario_jja AND prest.`estado_registro_jja` = 1
    ORDER BY prest.`fecha_prestamo_jja` DESC;
END
", "SP: SP_LEER_PRESTAMOS_USUARIO_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_PRESTAMOS_ACTIVOS_jja`()
BEGIN
    SELECT prest.`id_prestamo_jja`, actv.`nombre_jja` AS `activo_nombre_jja`,
           actv.`codigo_qr_jja`,
           CONCAT(usu.`nombre_jja`, ' ', usu.`apellido_jja`) AS `usuario_nombre_jja`,
           usu.`cedula_jja`, usu.`correo_jja`, usu.`telefono_jja`,
           prest.`fecha_prestamo_jja`, prest.`fecha_limite_jja`,
           DATEDIFF(prest.`fecha_limite_jja`, NOW()) AS `dias_restantes_jja`
    FROM `prestamos_jja` prest
    INNER JOIN `activos_jja`  actv ON prest.`id_activo_jja`  = actv.`id_activo_jja`
    INNER JOIN `usuarios_jja` usu  ON prest.`id_usuario_jja` = usu.`id_usuario_jja`
    WHERE prest.`estado_prestamo_jja` = 'activo' AND prest.`estado_registro_jja` = 1
    ORDER BY prest.`fecha_limite_jja` ASC;
END
", "SP: SP_LEER_PRESTAMOS_ACTIVOS_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_PRESTAMOS_POR_ACTIVO_jja`(IN p_id_activo_jja INT UNSIGNED)
BEGIN
    SELECT prest.`id_prestamo_jja`, prest.`id_activo_jja`, actv.`nombre_jja` AS `activo_nombre_jja`,
           actv.`codigo_qr_jja`,
           CONCAT(usu.`nombre_jja`, ' ', usu.`apellido_jja`) AS `usuario_nombre_jja`,
           usu.`cedula_jja`, usu.`correo_jja`,
           CONCAT(enc.`nombre_jja`, ' ', enc.`apellido_jja`) AS `encargado_nombre_jja`,
           prest.`fecha_prestamo_jja`, prest.`fecha_limite_jja`,
           prest.`fecha_devolucion_jja`, prest.`estado_prestamo_jja`, prest.`observaciones_jja`
    FROM `prestamos_jja` prest
    INNER JOIN `activos_jja`  actv ON prest.`id_activo_jja`    = actv.`id_activo_jja`
    INNER JOIN `usuarios_jja` usu  ON prest.`id_usuario_jja`   = usu.`id_usuario_jja`
    INNER JOIN `usuarios_jja` enc  ON prest.`id_encargado_jja`  = enc.`id_usuario_jja`
    WHERE prest.`id_activo_jja` = p_id_activo_jja AND prest.`estado_registro_jja` = 1
    ORDER BY prest.`fecha_prestamo_jja` DESC;
END
", "SP: SP_LEER_PRESTAMOS_POR_ACTIVO_jja (historial de préstamos por activo)", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_PRESTAMOS_VENCIDOS_jja`()
BEGIN
    SELECT prest.`id_prestamo_jja`, actv.`nombre_jja` AS `activo_nombre_jja`,
           actv.`codigo_qr_jja`,
           CONCAT(usu.`nombre_jja`, ' ', usu.`apellido_jja`) AS `usuario_nombre_jja`,
           usu.`cedula_jja`, usu.`correo_jja`, usu.`telefono_jja`,
           prest.`fecha_prestamo_jja`, prest.`fecha_limite_jja`,
           DATEDIFF(NOW(), prest.`fecha_limite_jja`) AS `dias_vencido_jja`
    FROM `prestamos_jja` prest
    INNER JOIN `activos_jja`  actv ON prest.`id_activo_jja`  = actv.`id_activo_jja`
    INNER JOIN `usuarios_jja` usu  ON prest.`id_usuario_jja` = usu.`id_usuario_jja`
    WHERE (prest.`estado_prestamo_jja` = 'vencido'
           OR (prest.`estado_prestamo_jja` = 'activo' AND prest.`fecha_limite_jja` < NOW()))
      AND prest.`estado_registro_jja` = 1
    ORDER BY prest.`fecha_limite_jja` ASC;
END
", "SP: SP_LEER_PRESTAMOS_VENCIDOS_jja (panel de alertas)", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_ACTUALIZAR_VENCIDOS_jja`()
BEGIN
    UPDATE `prestamos_jja`
    SET `estado_prestamo_jja` = 'vencido'
    WHERE `estado_prestamo_jja` = 'activo' AND `fecha_limite_jja` < NOW();
    SELECT ROW_COUNT() AS `prestamos_marcados_vencidos`;
END
", "SP: SP_ACTUALIZAR_VENCIDOS_jja (cron: marcar vencidos en batch)", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_MARCAR_PRESTAMO_PERDIDO_jja`(
    IN p_id_prestamo_jja    INT UNSIGNED,
    IN p_id_admin_jja       INT UNSIGNED,
    IN p_motivo_jja         TEXT
)
BEGIN
    DECLARE v_id_activo  INT UNSIGNED DEFAULT 0;
    DECLARE v_id_usuario INT UNSIGNED DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN ROLLBACK; RESIGNAL; END;

    START TRANSACTION;

    SELECT `id_activo_jja`, `id_usuario_jja`
    INTO v_id_activo, v_id_usuario
    FROM `prestamos_jja`
    WHERE `id_prestamo_jja` = p_id_prestamo_jja
    FOR UPDATE;

    UPDATE `prestamos_jja`
    SET `estado_prestamo_jja` = 'perdido'
    WHERE `id_prestamo_jja` = p_id_prestamo_jja;

    UPDATE `activos_jja`
    SET `estado_jja` = 'perdido'
    WHERE `id_activo_jja` = v_id_activo;

    INSERT INTO `lista_negra_jja` (`id_usuario_jja`, `id_prestamo_jja`, `motivo_jja`, `creado_por_jja`)
    VALUES (v_id_usuario, p_id_prestamo_jja, p_motivo_jja, p_id_admin_jja);

    INSERT INTO `historial_prestamos_jja` (`id_prestamo_jja`, `id_activo_jja`, `id_usuario_jja`, `accion_jja`, `detalles_jja`)
    VALUES (p_id_prestamo_jja, v_id_activo, v_id_usuario, 'perdida', p_motivo_jja);

    COMMIT;
    SELECT 'Activo marcado como perdido y usuario sancionado.' AS `mensaje_jja`;
END
", "SP: SP_MARCAR_PRESTAMO_PERDIDO_jja (transacción · sanciona usuario)", $cnt_sp_jja, $errores_jja);

// ═══════════════════════
// STORED PROCEDURES NOTIFICACIONES
// ═══════════════════════
ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_CREAR_NOTIFICACION_jja`(
    IN p_id_usuario_jja  INT UNSIGNED,
    IN p_id_prestamo_jja INT UNSIGNED,
    IN p_tipo_jja        ENUM('vencimiento_proximo','vencido','devolucion_confirmada','sancion','informativo'),
    IN p_titulo_jja      VARCHAR(200),
    IN p_mensaje_jja     TEXT
)
BEGIN
    INSERT INTO `notificaciones_jja` (`id_usuario_jja`, `id_prestamo_jja`, `tipo_notificacion_jja`, `titulo_jja`, `mensaje_jja`)
    VALUES (p_id_usuario_jja, p_id_prestamo_jja, p_tipo_jja, p_titulo_jja, p_mensaje_jja);
    SELECT LAST_INSERT_ID() AS `id_notificacion_jja`;
END
", "SP: SP_CREAR_NOTIFICACION_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_NOTIFICACIONES_USUARIO_jja`(IN p_id_usuario_jja INT UNSIGNED)
BEGIN
    SELECT `id_notificacion_jja`, `id_prestamo_jja`, `tipo_notificacion_jja`,
           `titulo_jja`, `mensaje_jja`, `leida_jja`, `enviada_correo_jja`, `creado_en_jja`
    FROM `notificaciones_jja`
    WHERE `id_usuario_jja` = p_id_usuario_jja
    ORDER BY `creado_en_jja` DESC;
END
", "SP: SP_LEER_NOTIFICACIONES_USUARIO_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_MARCAR_NOTIFICACION_LEIDA_jja`(IN p_id_jja INT UNSIGNED)
BEGIN
    UPDATE `notificaciones_jja` SET `leida_jja` = 1 WHERE `id_notificacion_jja` = p_id_jja;
    SELECT ROW_COUNT() AS `filas_afectadas`;
END
", "SP: SP_MARCAR_NOTIFICACION_LEIDA_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_MARCAR_TODAS_LEIDAS_jja`(IN p_id_usuario_jja INT UNSIGNED)
BEGIN
    UPDATE `notificaciones_jja`
    SET `leida_jja` = 1
    WHERE `id_usuario_jja` = p_id_usuario_jja AND `leida_jja` = 0;
    SELECT ROW_COUNT() AS `filas_afectadas`;
END
", "SP: SP_MARCAR_TODAS_LEIDAS_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_ELIMINAR_NOTIFICACION_jja`(IN p_id_jja INT UNSIGNED)
BEGIN
    DELETE FROM `notificaciones_jja` WHERE `id_notificacion_jja` = p_id_jja;
    SELECT ROW_COUNT() AS `filas_afectadas`;
END
", "SP: SP_ELIMINAR_NOTIFICACION_jja", $cnt_sp_jja, $errores_jja);

// ═══════════════════════
// STORED PROCEDURES LISTA NEGRA
// ═══════════════════════
ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_CREAR_SANCION_jja`(
    IN p_id_usuario_jja  INT UNSIGNED,
    IN p_id_prestamo_jja INT UNSIGNED,
    IN p_motivo_jja      TEXT,
    IN p_dias_sancion_jja INT,
    IN p_admin_jja       INT UNSIGNED
)
BEGIN
    DECLARE v_fecha_fin TIMESTAMP DEFAULT NULL;
    IF p_dias_sancion_jja > 0 THEN
        SET v_fecha_fin = DATE_ADD(NOW(), INTERVAL p_dias_sancion_jja DAY);
    END IF;
    INSERT INTO `lista_negra_jja` (`id_usuario_jja`, `id_prestamo_jja`, `motivo_jja`, `fecha_fin_sancion_jja`, `creado_por_jja`)
    VALUES (p_id_usuario_jja, p_id_prestamo_jja, p_motivo_jja, v_fecha_fin, p_admin_jja);
    SELECT LAST_INSERT_ID() AS `id_sancion_jja`;
END
", "SP: SP_CREAR_SANCION_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_SANCIONES_jja`()
BEGIN
    SELECT sanc.`id_sancion_jja`, CONCAT(usu.`nombre_jja`,' ',usu.`apellido_jja`) AS `usuario_jja`,
           usu.`cedula_jja`, sanc.`motivo_jja`,
           sanc.`fecha_inicio_sancion_jja`, sanc.`fecha_fin_sancion_jja`, sanc.`activa_jja`
    FROM `lista_negra_jja` sanc
    INNER JOIN `usuarios_jja` usu ON sanc.`id_usuario_jja` = usu.`id_usuario_jja`
    WHERE sanc.`estado_registro_jja` = 1
    ORDER BY sanc.`fecha_inicio_sancion_jja` DESC;
END
", "SP: SP_LEER_SANCIONES_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_SANCIONES_USUARIO_jja`(IN p_id_usuario_jja INT UNSIGNED)
BEGIN
    SELECT `id_sancion_jja`, `motivo_jja`, `fecha_inicio_sancion_jja`, `fecha_fin_sancion_jja`, `activa_jja`
    FROM `lista_negra_jja`
    WHERE `id_usuario_jja` = p_id_usuario_jja AND `estado_registro_jja` = 1
    ORDER BY `fecha_inicio_sancion_jja` DESC;
END
", "SP: SP_LEER_SANCIONES_USUARIO_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEVANTAR_SANCION_jja`(IN p_id_jja INT UNSIGNED)
BEGIN
    UPDATE `lista_negra_jja`
    SET `activa_jja` = 0, `fecha_fin_sancion_jja` = NOW()
    WHERE `id_sancion_jja` = p_id_jja;
    SELECT ROW_COUNT() AS `filas_afectadas`;
END
", "SP: SP_LEVANTAR_SANCION_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_VERIFICAR_SANCION_jja`(IN p_id_usuario_jja INT UNSIGNED)
BEGIN
    SELECT COUNT(*) AS `tiene_sancion_activa`
    FROM `lista_negra_jja`
    WHERE `id_usuario_jja` = p_id_usuario_jja
      AND `activa_jja` = 1
      AND (`fecha_fin_sancion_jja` IS NULL OR `fecha_fin_sancion_jja` > NOW());
END
", "SP: SP_VERIFICAR_SANCION_jja (consulta rápida para el API)", $cnt_sp_jja, $errores_jja);

// ═══════════════════════
// STORED PROCEDURES AUDITORÍA
// ═══════════════════════
ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_REGISTRAR_AUDITORIA_jja`(
    IN p_tabla_jja        VARCHAR(100),
    IN p_id_registro_jja  INT UNSIGNED,
    IN p_accion_jja       ENUM('INSERT','UPDATE','DELETE'),
    IN p_campo_jja        VARCHAR(100),
    IN p_valor_ant_jja    TEXT,
    IN p_valor_nuevo_jja  TEXT,
    IN p_id_usuario_jja   INT UNSIGNED,
    IN p_ip_jja           VARCHAR(45),
    IN p_descripcion_jja  TEXT
)
BEGIN
    INSERT INTO `auditoria_jja`
        (`tabla_afectada_jja`, `id_registro_afectado_jja`, `accion_jja`,
         `campo_modificado_jja`, `valor_anterior_jja`, `valor_nuevo_jja`,
         `id_usuario_responsable_jja`, `ip_origen_jja`, `descripcion_jja`)
    VALUES
        (p_tabla_jja, p_id_registro_jja, p_accion_jja,
         p_campo_jja, p_valor_ant_jja, p_valor_nuevo_jja,
         p_id_usuario_jja, p_ip_jja, p_descripcion_jja);
END
", "SP: SP_REGISTRAR_AUDITORIA_jja (invocado por triggers y API)", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_AUDITORIA_jja`()
BEGIN
    SELECT `id_auditoria_jja`, `tabla_afectada_jja`, `id_registro_afectado_jja`,
           `accion_jja`, `campo_modificado_jja`, `valor_anterior_jja`, `valor_nuevo_jja`,
           `id_usuario_responsable_jja`, `fecha_accion_jja`, `ip_origen_jja`, `descripcion_jja`
    FROM `auditoria_jja`
    ORDER BY `fecha_accion_jja` DESC
    LIMIT 1000;
END
", "SP: SP_LEER_AUDITORIA_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_AUDITORIA_TABLA_jja`(IN p_tabla_jja VARCHAR(100))
BEGIN
    SELECT `id_auditoria_jja`, `id_registro_afectado_jja`, `accion_jja`,
           `campo_modificado_jja`, `valor_anterior_jja`, `valor_nuevo_jja`,
           `id_usuario_responsable_jja`, `fecha_accion_jja`, `descripcion_jja`
    FROM `auditoria_jja`
    WHERE `tabla_afectada_jja` = p_tabla_jja
    ORDER BY `fecha_accion_jja` DESC;
END
", "SP: SP_LEER_AUDITORIA_TABLA_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LEER_AUDITORIA_USUARIO_jja`(IN p_id_usuario_jja INT UNSIGNED)
BEGIN
    SELECT `id_auditoria_jja`, `tabla_afectada_jja`, `id_registro_afectado_jja`,
           `accion_jja`, `campo_modificado_jja`, `valor_anterior_jja`, `valor_nuevo_jja`,
           `fecha_accion_jja`, `descripcion_jja`
    FROM `auditoria_jja`
    WHERE `id_usuario_responsable_jja` = p_id_usuario_jja
    ORDER BY `fecha_accion_jja` DESC;
END
", "SP: SP_LEER_AUDITORIA_USUARIO_jja", $cnt_sp_jja, $errores_jja);

// ═══════════════════════
// STORED PROCEDURES TOKENS JWT
// ═══════════════════════
ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_INVALIDAR_TOKEN_jja`(
    IN p_token_hash_jja  VARCHAR(64),
    IN p_id_usuario_jja  INT UNSIGNED,
    IN p_expira_en_jja   TIMESTAMP
)
BEGIN
    INSERT IGNORE INTO `tokens_invalidos_jja` (`token_hash_jja`, `id_usuario_jja`, `expira_en_jja`)
    VALUES (p_token_hash_jja, p_id_usuario_jja, p_expira_en_jja);
END
", "SP: SP_INVALIDAR_TOKEN_jja (logout / revocación)", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_VERIFICAR_TOKEN_INVALIDO_jja`(IN p_token_hash_jja VARCHAR(64))
BEGIN
    SELECT COUNT(*) AS `esta_invalidado`
    FROM `tokens_invalidos_jja`
    WHERE `token_hash_jja` = p_token_hash_jja AND `expira_en_jja` > NOW();
END
", "SP: SP_VERIFICAR_TOKEN_INVALIDO_jja", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_LIMPIAR_TOKENS_jja`()
BEGIN
    DELETE FROM `tokens_invalidos_jja` WHERE `expira_en_jja` <= NOW();
    SELECT ROW_COUNT() AS `tokens_eliminados`;
END
", "SP: SP_LIMPIAR_TOKENS_jja (limpieza de tokens expirados)", $cnt_sp_jja, $errores_jja);

// ═══════════════════════
// STORED PROCEDURES REPORTES Y ESTADÍSTICAS
// ═══════════════════════
ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_REPORTE_PRESTAMOS_jja`(
    IN p_fecha_inicio_jja  DATE,
    IN p_fecha_fin_jja     DATE,
    IN p_id_tipo_jja       INT UNSIGNED,
    IN p_id_usuario_jja    INT UNSIGNED
)
BEGIN
    SELECT prest.`id_prestamo_jja`,
           actv.`nombre_jja`  AS `activo_jja`,
           tipo.`nombre_tipo_jja`,
           CONCAT(usu.`nombre_jja`,' ',usu.`apellido_jja`) AS `usuario_jja`,
           usu.`cedula_jja`,
           prest.`fecha_prestamo_jja`, prest.`fecha_limite_jja`,
           prest.`fecha_devolucion_jja`, prest.`estado_prestamo_jja`
    FROM `prestamos_jja` prest
    INNER JOIN `activos_jja`       actv ON prest.`id_activo_jja`  = actv.`id_activo_jja`
    INNER JOIN `tipos_activos_jja` tipo ON actv.`id_tipo_jja`     = tipo.`id_tipo_jja`
    INNER JOIN `usuarios_jja`      usu  ON prest.`id_usuario_jja` = usu.`id_usuario_jja`
    WHERE (p_fecha_inicio_jja IS NULL OR DATE(prest.`fecha_prestamo_jja`) >= p_fecha_inicio_jja)
      AND (p_fecha_fin_jja    IS NULL OR DATE(prest.`fecha_prestamo_jja`) <= p_fecha_fin_jja)
      AND (p_id_tipo_jja      IS NULL OR actv.`id_tipo_jja`     = p_id_tipo_jja)
      AND (p_id_usuario_jja   IS NULL OR prest.`id_usuario_jja` = p_id_usuario_jja)
      AND prest.`estado_registro_jja` = 1
    ORDER BY prest.`fecha_prestamo_jja` DESC;
END
", "SP: SP_REPORTE_PRESTAMOS_jja (filtros por fecha, tipo y usuario)", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_REPORTE_ACTIVOS_MAS_PRESTADOS_jja`()
BEGIN
    SELECT actv.`nombre_jja`, tipo.`nombre_tipo_jja`,
           COUNT(prest.`id_prestamo_jja`) AS `total_prestamos_jja`
    FROM `prestamos_jja` prest
    INNER JOIN `activos_jja`       actv ON prest.`id_activo_jja` = actv.`id_activo_jja`
    INNER JOIN `tipos_activos_jja` tipo ON actv.`id_tipo_jja`    = tipo.`id_tipo_jja`
    GROUP BY actv.`id_activo_jja`, actv.`nombre_jja`, tipo.`nombre_tipo_jja`
    ORDER BY `total_prestamos_jja` DESC
    LIMIT 10;
END
", "SP: SP_REPORTE_ACTIVOS_MAS_PRESTADOS_jja (Top 10)", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_REPORTE_USUARIOS_ACTIVOS_jja`()
BEGIN
    SELECT CONCAT(usu.`nombre_jja`,' ',usu.`apellido_jja`) AS `usuario_jja`,
           usu.`cedula_jja`,
           COUNT(prest.`id_prestamo_jja`) AS `total_prestamos_jja`
    FROM `prestamos_jja` prest
    INNER JOIN `usuarios_jja` usu ON prest.`id_usuario_jja` = usu.`id_usuario_jja`
    GROUP BY usu.`id_usuario_jja`
    ORDER BY `total_prestamos_jja` DESC
    LIMIT 10;
END
", "SP: SP_REPORTE_USUARIOS_ACTIVOS_jja (Top 10)", $cnt_sp_jja, $errores_jja);

ejecutar_jja($pdo_jja, "
CREATE PROCEDURE `SP_REPORTE_TASA_DEVOLUCION_jja`()
BEGIN
    SELECT
        COUNT(*)                                                            AS `total_prestamos_jja`,
        SUM(CASE WHEN `estado_prestamo_jja` = 'devuelto' THEN 1 ELSE 0 END) AS `devueltos_jja`,
        SUM(CASE WHEN `estado_prestamo_jja` = 'vencido'  THEN 1 ELSE 0 END) AS `vencidos_jja`,
        SUM(CASE WHEN `estado_prestamo_jja` = 'perdido'  THEN 1 ELSE 0 END) AS `perdidos_jja`,
        SUM(CASE WHEN `estado_prestamo_jja` = 'activo'   THEN 1 ELSE 0 END) AS `activos_jja`,
        ROUND(
            SUM(CASE WHEN `estado_prestamo_jja` = 'devuelto' THEN 1 ELSE 0 END)
            / COUNT(*) * 100, 2
        ) AS `tasa_devolucion_pct_jja`
    FROM `prestamos_jja`
    WHERE `estado_registro_jja` = 1;
END
", "SP: SP_REPORTE_TASA_DEVOLUCION_jja (estadística dashboard)", $cnt_sp_jja, $errores_jja);

// ══════════════════════════════════════════════════════════════
// 5. TRIGGERS DE AUDITORÍA Y TRAZABILIDAD
// ══════════════════════════════════════════════════════════════
echo "<p class='seccion'>⑤ TRIGGERS (Auditoría automática · Trazabilidad en tiempo real)</p>";
mostrar_jja('info', 'ℹ️', "Eliminando triggers existentes...");

$triggers_drop_jja = [
    'TR_AUDITORIA_ACTIVO_UPDATE_jja',
    'TR_AUDITORIA_PRESTAMO_UPDATE_jja',
    'TR_AUDITORIA_USUARIO_UPDATE_jja',
    'TR_HISTORIAL_PRESTAMO_DEVOLUCION_jja',
];
foreach ($triggers_drop_jja as $trig_jja) {
    try {
        $pdo_jja->exec("DROP TRIGGER IF EXISTS `{$trig_jja}`");
    }
    catch (PDOException $ex_jja) {
    }
}
mostrar_jja('ok', '✅', "Triggers existentes eliminados.");

// Trigger 1: Auditoría de cambio de estado en activos
ejecutar_jja($pdo_jja, "
CREATE TRIGGER `TR_AUDITORIA_ACTIVO_UPDATE_jja`
AFTER UPDATE ON `activos_jja`
FOR EACH ROW
BEGIN
    IF OLD.`estado_jja` <> NEW.`estado_jja` THEN
        INSERT INTO `auditoria_jja`
            (`tabla_afectada_jja`, `id_registro_afectado_jja`, `accion_jja`,
             `campo_modificado_jja`, `valor_anterior_jja`, `valor_nuevo_jja`, `descripcion_jja`)
        VALUES
            ('activos_jja', NEW.`id_activo_jja`, 'UPDATE',
             'estado_jja', OLD.`estado_jja`, NEW.`estado_jja`,
             CONCAT('Cambio automático de estado en activo: ', NEW.`nombre_jja`));
    END IF;
    IF OLD.`estado_registro_jja` <> NEW.`estado_registro_jja` THEN
        INSERT INTO `auditoria_jja`
            (`tabla_afectada_jja`, `id_registro_afectado_jja`, `accion_jja`,
             `campo_modificado_jja`, `valor_anterior_jja`, `valor_nuevo_jja`, `descripcion_jja`)
        VALUES
            ('activos_jja', NEW.`id_activo_jja`, 'DELETE',
             'estado_registro_jja', OLD.`estado_registro_jja`, NEW.`estado_registro_jja`,
             CONCAT('Soft-delete aplicado al activo: ', NEW.`nombre_jja`));
    END IF;
END
", "Trigger: TR_AUDITORIA_ACTIVO_UPDATE_jja", $cnt_triggers_jja, $errores_jja);

// Trigger 2: Auditoría de cambios en préstamos
ejecutar_jja($pdo_jja, "
CREATE TRIGGER `TR_AUDITORIA_PRESTAMO_UPDATE_jja`
AFTER UPDATE ON `prestamos_jja`
FOR EACH ROW
BEGIN
    IF OLD.`estado_prestamo_jja` <> NEW.`estado_prestamo_jja` THEN
        INSERT INTO `auditoria_jja`
            (`tabla_afectada_jja`, `id_registro_afectado_jja`, `accion_jja`,
             `campo_modificado_jja`, `valor_anterior_jja`, `valor_nuevo_jja`, `descripcion_jja`)
        VALUES
            ('prestamos_jja', NEW.`id_prestamo_jja`, 'UPDATE',
             'estado_prestamo_jja', OLD.`estado_prestamo_jja`, NEW.`estado_prestamo_jja`,
             CONCAT('Cambio de estado del préstamo ID: ', NEW.`id_prestamo_jja`));
    END IF;
END
", "Trigger: TR_AUDITORIA_PRESTAMO_UPDATE_jja", $cnt_triggers_jja, $errores_jja);

// Trigger 3: Auditoría de soft-delete en usuarios
ejecutar_jja($pdo_jja, "
CREATE TRIGGER `TR_AUDITORIA_USUARIO_UPDATE_jja`
AFTER UPDATE ON `usuarios_jja`
FOR EACH ROW
BEGIN
    IF OLD.`estado_registro_jja` <> NEW.`estado_registro_jja` THEN
        INSERT INTO `auditoria_jja`
            (`tabla_afectada_jja`, `id_registro_afectado_jja`, `accion_jja`,
             `campo_modificado_jja`, `valor_anterior_jja`, `valor_nuevo_jja`, `descripcion_jja`)
        VALUES
            ('usuarios_jja', NEW.`id_usuario_jja`, 'DELETE',
             'estado_registro_jja', OLD.`estado_registro_jja`, NEW.`estado_registro_jja`,
             CONCAT('Soft-delete aplicado al usuario: ', NEW.`cedula_jja`));
    END IF;
END
", "Trigger: TR_AUDITORIA_USUARIO_UPDATE_jja", $cnt_triggers_jja, $errores_jja);

// Trigger 4: Registro automático en historial al cerrar un préstamo
ejecutar_jja($pdo_jja, "
CREATE TRIGGER `TR_HISTORIAL_PRESTAMO_DEVOLUCION_jja`
AFTER UPDATE ON `prestamos_jja`
FOR EACH ROW
BEGIN
    IF OLD.`estado_prestamo_jja` = 'activo' AND NEW.`estado_prestamo_jja` = 'vencido' THEN
        INSERT INTO `historial_prestamos_jja`
            (`id_prestamo_jja`, `id_activo_jja`, `id_usuario_jja`, `accion_jja`, `detalles_jja`)
        VALUES
            (NEW.`id_prestamo_jja`, NEW.`id_activo_jja`, NEW.`id_usuario_jja`, 'vencimiento',
             CONCAT('Préstamo marcado como vencido automáticamente. Límite: ', NEW.`fecha_limite_jja`));
    END IF;
END
", "Trigger: TR_HISTORIAL_PRESTAMO_DEVOLUCION_jja (registro automático de vencimiento)", $cnt_triggers_jja, $errores_jja);

// ══════════════════════════════════════════════════════════════
// 6. DATOS SEMILLA (SEED DATA)
// ══════════════════════════════════════════════════════════════
echo "<p class='seccion'>⑥ DATOS SEMILLA (Roles · Tipos · Políticas · Admin inicial)</p>";

// Roles
try {
    $pdo_jja->exec("
        INSERT IGNORE INTO `roles_jja` (`nombre_rol_jja`, `descripcion_jja`) VALUES
        ('administrador', 'Acceso total: gestión de usuarios, inventario, auditorías y reportes.'),
        ('encargado',     'Procesa préstamos, devoluciones y consulta el inventario.'),
        ('usuario_final', 'Solicita préstamos, consulta historial y recibe notificaciones.')
    ");
    mostrar_jja('ok', '✅', "Roles insertados: <strong>administrador, encargado, usuario_final</strong>.");
}
catch (PDOException $ex_jja) {
    mostrar_jja('err', '❌', 'Error al insertar roles: ' . $ex_jja->getMessage());
}

// Añadir roles marketplace (empresa/cliente) si aún no existen
try {
    $pdo_jja->exec("INSERT IGNORE INTO `roles_jja` (`nombre_rol_jja`, `descripcion_jja`) VALUES
        ('empresa', 'Cuenta tipo empresa vendedora en el marketplace.'),
        ('cliente', 'Cuenta tipo cliente que solicita préstamos o arrendamientos.')
    ");
    mostrar_jja('ok', '✅', "Roles marketplace insertados (empresa, cliente) si no existían.");
}
catch (PDOException $ex_jja) {
    mostrar_jja('err', '❌', 'Error al insertar roles marketplace: ' . $ex_jja->getMessage());
}

// Tipos de activos
try {
    $pdo_jja->exec("
        INSERT IGNORE INTO `tipos_activos_jja` (`nombre_tipo_jja`, `descripcion_jja`) VALUES
        ('Libro',            'Material bibliográfico físico de la institución'),
        ('CD de Tesis',      'Disco compacto con trabajos de grado digitalizados'),
        ('Laptop',           'Computador portátil de la institución'),
        ('Computadora',      'Equipo de escritorio en salas de cómputo'),
        ('Tablet',           'Dispositivo tablet de la institución'),
        ('Pendrive',         'Dispositivo de almacenamiento USB'),
        ('Videobeam',        'Proyector/videobeam para presentaciones'),
        ('Proyector',        'Proyector multimedia para aulas'),
        ('Cámara',           'Equipo fotográfico o de video'),
        ('Otro',             'Activo que no encaja en las categorías anteriores')
    ");
    mostrar_jja('ok', '✅', "Tipos de activos insertados (10 tipos).");
}
catch (PDOException $ex_jja) {
    mostrar_jja('err', '❌', 'Error al insertar tipos: ' . $ex_jja->getMessage());
}

// Políticas de préstamo por tipo
try {
    $pdo_jja->exec("
        INSERT IGNORE INTO `politicas_prestamo_jja` (`id_tipo_jja`, `dias_maximo_jja`, `max_prestamos_simultaneos_jja`, `requiere_mismo_dia_jja`)
        SELECT tip.`id_tipo_jja`, pol.dias, pol.max_simult, pol.mismo_dia
        FROM `tipos_activos_jja` tip
        JOIN (
            SELECT 'Libro'       AS tipo, 7  AS dias, 3 AS max_simult, 0 AS mismo_dia UNION ALL
            SELECT 'CD de Tesis',                    7,              2,             0 UNION ALL
            SELECT 'Laptop',                         1,              1,             1 UNION ALL
            SELECT 'Computadora',                    1,              1,             1 UNION ALL
            SELECT 'Tablet',                         3,              1,             0 UNION ALL
            SELECT 'Pendrive',                       3,              2,             0 UNION ALL
            SELECT 'Videobeam',                      1,              1,             1 UNION ALL
            SELECT 'Proyector',                      1,              1,             1 UNION ALL
            SELECT 'Cámara',                         3,              1,             0 UNION ALL
            SELECT 'Otro',                           7,              1,             0
        ) pol ON tip.`nombre_tipo_jja` = pol.tipo
        WHERE NOT EXISTS (
            SELECT 1 FROM `politicas_prestamo_jja` pol2 WHERE pol2.`id_tipo_jja` = tip.`id_tipo_jja`
        )
    ");
    mostrar_jja('ok', '✅', "Políticas de préstamo configuradas por tipo de activo.");
}
catch (PDOException $ex_jja) {
    mostrar_jja('err', '❌', 'Error políticas: ' . $ex_jja->getMessage());
}

// Usuario administrador inicial
try {
    $hash_admin_jja = password_hash('JoAnJe2026!', PASSWORD_BCRYPT, ['cost' => 12]);
    $stmt_admin_jja = $pdo_jja->prepare("
        INSERT IGNORE INTO `usuarios_jja`
            (`nombre_jja`, `apellido_jja`, `cedula_jja`, `correo_jja`, `telefono_jja`, `contrasena_jja`, `id_rol_jja`)
        SELECT 'Jean Marco', 'Coffi Izarra', '29518292', 'admin@activoscontroljoanje.com',
               '+58-412-0000000', :hash,
               (SELECT `id_rol_jja` FROM `roles_jja` WHERE `nombre_rol_jja` = 'administrador' LIMIT 1)
        WHERE NOT EXISTS (SELECT 1 FROM `usuarios_jja` WHERE `cedula_jja` = '29518292')
    ");
    $stmt_admin_jja->execute([':hash' => $hash_admin_jja]);
    mostrar_jja('ok', '✅', "Usuario <strong>administrador</strong> creado. Cédula: <code>29518292</code> | Contraseña: <code>JoAnJe2026!</code> — <em>¡Cambia la contraseña en producción!</em>");
}
catch (PDOException $ex_jja) {
    mostrar_jja('err', '❌', 'Error al crear admin: ' . $ex_jja->getMessage());
}

// Usuarios de prueba: empresa, cliente, encargado
try {
    $hash_empresa = password_hash('Empresa2026!', PASSWORD_BCRYPT, ['cost' => 12]);
    $stmt_e = $pdo_jja->prepare("INSERT IGNORE INTO `usuarios_jja`
        (`nombre_jja`, `apellido_jja`, `cedula_jja`, `correo_jja`, `telefono_jja`, `contrasena_jja`, `id_rol_jja`)
        SELECT :nombre, :apellido, :cedula, :correo, :telefono, :hash, (SELECT `id_rol_jja` FROM `roles_jja` WHERE `nombre_rol_jja` = 'empresa' LIMIT 1)
        WHERE NOT EXISTS (SELECT 1 FROM `usuarios_jja` WHERE `correo_jja` = :correo2)");
    $stmt_e->execute([
        ':nombre' => 'Empresa', ':apellido' => 'Demo', ':cedula' => '90000001', ':correo' => 'empresa@demo.com', ':correo2' => 'empresa@demo.com', ':telefono' => '+58-412-1111111', ':hash' => $hash_empresa
    ]);
    mostrar_jja('ok', '✅', "Usuario <strong>empresa</strong> creado (empresa@demo.com / Empresa2026!).");

    $hash_cliente = password_hash('Cliente2026!', PASSWORD_BCRYPT, ['cost' => 12]);
    $stmt_c = $pdo_jja->prepare("INSERT IGNORE INTO `usuarios_jja`
        (`nombre_jja`, `apellido_jja`, `cedula_jja`, `correo_jja`, `telefono_jja`, `contrasena_jja`, `id_rol_jja`)
        SELECT :nombre, :apellido, :cedula, :correo, :telefono, :hash, (SELECT `id_rol_jja` FROM `roles_jja` WHERE `nombre_rol_jja` = 'cliente' LIMIT 1)
        WHERE NOT EXISTS (SELECT 1 FROM `usuarios_jja` WHERE `correo_jja` = :correo2)");
    $stmt_c->execute([
        ':nombre' => 'Cliente', ':apellido' => 'Demo', ':cedula' => '80000001', ':correo' => 'cliente@demo.com', ':correo2' => 'cliente@demo.com', ':telefono' => '+58-412-2222222', ':hash' => $hash_cliente
    ]);
    mostrar_jja('ok', '✅', "Usuario <strong>cliente</strong> creado (cliente@demo.com / Cliente2026!).");

    $hash_encargado = password_hash('Encargado2026!', PASSWORD_BCRYPT, ['cost' => 12]);
    $stmt_enc = $pdo_jja->prepare("INSERT IGNORE INTO `usuarios_jja`
        (`nombre_jja`, `apellido_jja`, `cedula_jja`, `correo_jja`, `telefono_jja`, `contrasena_jja`, `id_rol_jja`)
        SELECT :nombre, :apellido, :cedula, :correo, :telefono, :hash, (SELECT `id_rol_jja` FROM `roles_jja` WHERE `nombre_rol_jja` = 'encargado' LIMIT 1)
        WHERE NOT EXISTS (SELECT 1 FROM `usuarios_jja` WHERE `correo_jja` = :correo2)");
    $stmt_enc->execute([
        ':nombre' => 'Encargado', ':apellido' => 'Demo', ':cedula' => '70000001', ':correo' => 'encargado@demo.com', ':correo2' => 'encargado@demo.com', ':telefono' => '+58-412-3333333', ':hash' => $hash_encargado
    ]);
    mostrar_jja('ok', '✅', "Usuario <strong>encargado</strong> creado (encargado@demo.com / Encargado2026!).");
}
catch (PDOException $ex_jja) {
    mostrar_jja('err', '❌', 'Error al crear users demo: ' . $ex_jja->getMessage());
}

// ══════════════════════════════════════════════════════════════
// RESUMEN FINAL
// ══════════════════════════════════════════════════════════════
echo "<hr>";
$estado_final_jja = ($errores_jja === 0) ? 'ok' : 'err';
$icono_final_jja = ($errores_jja === 0) ? '🎉' : '⚠️';

echo "<div class='resumen'>
    <p>{$icono_final_jja} <strong>Inicialización completada</strong></p>
    <p>Tablas creadas: <span>{$cnt_tablas_jja}</span> &nbsp;|&nbsp;
       Índices: <span>{$cnt_indices_jja}</span> &nbsp;|&nbsp;
       Stored Procedures: <span>{$cnt_sp_jja}</span> &nbsp;|&nbsp;
       Triggers: <span>{$cnt_triggers_jja}</span> &nbsp;|&nbsp;
       Errores: <span style='color:" . ($errores_jja > 0 ? '#f87171' : '#86efac') . "'>{$errores_jja}</span>
    </p>
    <p style='margin-top:8px;color:#94a3b8;font-size:.82rem'>
      Base de datos: <code>gestion_activos_jja</code> — JoAnJe 
    </p>
</div>";
?>