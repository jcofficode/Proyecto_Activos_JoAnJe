-- ============================================================
-- migrar_roles.sql — Migración: eliminar roles obsoletos
-- Sistema JoAnJe Coders
-- Ejecutar UNA SOLA VEZ en la base de datos existente
-- ============================================================

-- 1. Asegurar que el rol 'cliente' existe
INSERT IGNORE INTO `roles_jja` (`nombre_rol_jja`, `descripcion_jja`)
VALUES ('cliente', 'Solicita préstamos, consulta historial, accede al marketplace y recibe notificaciones.');

-- 2. Migrar usuarios con rol 'usuario_final' al rol 'cliente'
UPDATE `usuarios_jja`
SET `id_rol_jja` = (SELECT `id_rol_jja` FROM `roles_jja` WHERE `nombre_rol_jja` = 'cliente' LIMIT 1)
WHERE `id_rol_jja` = (SELECT `id_rol_jja` FROM `roles_jja` WHERE `nombre_rol_jja` = 'usuario_final' LIMIT 1);

-- 3. Migrar usuarios con rol 'empresa' al rol 'cliente' (si existen)
UPDATE `usuarios_jja`
SET `id_rol_jja` = (SELECT `id_rol_jja` FROM `roles_jja` WHERE `nombre_rol_jja` = 'cliente' LIMIT 1)
WHERE `id_rol_jja` = (SELECT `id_rol_jja` FROM `roles_jja` WHERE `nombre_rol_jja` = 'empresa' LIMIT 1);

-- 4. Soft-delete de los roles obsoletos
UPDATE `roles_jja` SET `estado_registro_jja` = 0 WHERE `nombre_rol_jja` = 'usuario_final';
UPDATE `roles_jja` SET `estado_registro_jja` = 0 WHERE `nombre_rol_jja` = 'empresa';

-- Verificación: mostrar roles activos
SELECT `id_rol_jja`, `nombre_rol_jja`, `estado_registro_jja` FROM `roles_jja`;
