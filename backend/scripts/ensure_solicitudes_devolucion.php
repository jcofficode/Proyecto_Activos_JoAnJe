<?php
// Script de migración: asegura la existencia de la tabla `solicitudes_devolucion_jja`
require_once __DIR__ . '/../conex.php';

try {
    $sql = <<<SQL
CREATE TABLE IF NOT EXISTS `solicitudes_devolucion_jja` (
        `id_solicitud_devolucion_jja` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        `id_prestamo_jja`             INT UNSIGNED NOT NULL,
        `id_usuario_solicitante_jja`  INT UNSIGNED NOT NULL,
        `estado_jja`                  ENUM('pendiente','aprobada','rechazada') NOT NULL DEFAULT 'pendiente',
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
SQL;

    $pdo_jja->exec($sql);
    echo "OK: tabla solicitudes_devolucion_jja asegurada\n";
} catch (PDOException $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}

?>
