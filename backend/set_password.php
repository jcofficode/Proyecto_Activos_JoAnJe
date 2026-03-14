<?php
// set_password.php — cambia la contraseña de un usuario por correo (uso local/dev)
if ($argc < 3) {
    echo "Uso: php set_password.php correo@ejemplo.com NuevaContrasena\n";
    exit(1);
}
require_once __DIR__ . '/conex.php';
$email = $argv[1];
$new = $argv[2];
$hash = password_hash($new, PASSWORD_BCRYPT, ['cost' => 12]);
$pdo = $pdo_jja;
$stmt = $pdo->prepare("UPDATE usuarios_jja SET contrasena_jja = :hash, debe_cambiar_clave_jja = 0 WHERE correo_jja = :email AND estado_registro_jja = 1");
$stmt->execute([':hash' => $hash, ':email' => $email]);
$cnt = $stmt->rowCount();
if ($cnt > 0) echo "Contraseña actualizada para {$email}\n";
else echo "Usuario no encontrado o no actualizado: {$email}\n";
return 0;
