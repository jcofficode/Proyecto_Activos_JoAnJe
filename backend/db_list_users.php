<?php
// db_list_users.php — lista usuarios y roles para ver credenciales seed
require_once __DIR__ . '/conex.php';
$pdo = $pdo_jja;
$stmt = $pdo->query("SELECT u.id_usuario_jja, u.nombre_jja, u.apellido_jja, u.correo_jja, u.id_rol_jja, r.nombre_rol_jja, u.debe_cambiar_clave_jja FROM usuarios_jja u LEFT JOIN roles_jja r ON u.id_rol_jja = r.id_rol_jja ORDER BY u.id_usuario_jja");
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
if (!$rows) {
    echo "No se encontraron usuarios en la BD.\n";
    exit(0);
}
foreach ($rows as $r) {
    echo sprintf("ID=%d | %s %s | %s | rol_id=%d (%s) | debe_cambiar=%d\n", $r['id_usuario_jja'], $r['nombre_jja'], $r['apellido_jja'], $r['correo_jja'], $r['id_rol_jja'], $r['nombre_rol_jja'] ?? 'N/A', $r['debe_cambiar_clave_jja']);
}
return 0;
