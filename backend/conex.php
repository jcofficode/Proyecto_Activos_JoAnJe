<?php
// ============================================================
// conex.php — Conexión PDO (uso directo sin autoloader)
// Sistema de Gestión de Activos - JoAnJe Coders
// ============================================================

// Ruta al autoload de Composer
require_once __DIR__ . '/libs/vendor/autoload.php';

// Cargar variables de entorno desde .env
$dotenv_jja = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv_jja->load();

// ── Parámetros desde .env ──────────────────────────────────
define('JJA_DB_HOST', $_ENV['DB_HOST']);
define('JJA_DB_PORT', $_ENV['DB_PORT']);
define('JJA_DB_NAME', $_ENV['DB_NAME']);
define('JJA_DB_USER', $_ENV['DB_USER']);
define('JJA_DB_PASS', $_ENV['DB_PASS']);
define('JJA_APP_ENV', $_ENV['APP_ENV'] ?? 'development');

// ── Conexión PDO ───────────────────────────────────────────
try {
    $dsn_jja = "mysql:host=" . JJA_DB_HOST
             . ";port="     . JJA_DB_PORT
             . ";dbname="   . JJA_DB_NAME
             . ";charset=utf8mb4";

    $pdo_jja = new PDO($dsn_jja, JJA_DB_USER, JJA_DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8mb4', time_zone = '-04:00'",
    ]);

} catch (PDOException $error_jja) {
    $msg_jja = (JJA_APP_ENV === 'development')
        ? 'ERROR PDO: ' . $error_jja->getMessage()
        : 'Error interno. Contacte al administrador.';

    http_response_code(500);
    die(json_encode(['error' => $msg_jja], JSON_UNESCAPED_UNICODE));
}
