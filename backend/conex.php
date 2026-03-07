<?php
// backend/conex.php

define('DB_HOST', 'localhost');
define('DB_NAME', 'bd_JoAnJe_jc');
define('DB_USER', 'root');
define('DB_PASS', '');

try {
    $pdo_jc = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8",
        DB_USER,
        DB_PASS
    );
    $pdo_jc->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo_jc->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo_jc->exec("SET NAMES 'utf8'");
} catch (PDOException $e_jc) {
    http_response_code(500);
    die(json_encode(['error' => 'Error de conexión: ' . $e_jc->getMessage()]));
}
