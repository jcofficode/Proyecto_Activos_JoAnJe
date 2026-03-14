<?php
// ============================================================
// conex.php — Conexión PDO (uso directo sin autoloader)
// Sistema de Gestión de Activos - JoAnJe Coders
// ============================================================

// Ruta al autoload de Composer — soportar diferentes ubicaciones (libs/vendor o vendor)
$autoloadCandidates = [
    __DIR__ . '/libs/vendor/autoload.php',
    __DIR__ . '/vendor/autoload.php',
    __DIR__ . '/../vendor/autoload.php'
];
$autoloadFound = false;
foreach ($autoloadCandidates as $candidate) {
    if (file_exists($candidate)) {
        require_once $candidate;
        $autoloadFound = true;
        break;
    }
}
if (!$autoloadFound) {
    // No autoload available — continuar sin dependencias de Composer
}

// Cargar variables de entorno desde .env solo si existe localmente
if (file_exists(__DIR__ . '/.env')) {
    $dotenv_jja = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv_jja->load();
}

// ── Parámetros de Conexión (Soporte Railway + Local) ────────
$host_jja = getenv('MYSQLHOST') ?: ($_ENV['DB_HOST'] ?? '127.0.0.1');
$port_jja = getenv('MYSQLPORT') ?: ($_ENV['DB_PORT'] ?? '3306');
$name_jja = getenv('MYSQLDATABASE') ?: ($_ENV['DB_NAME'] ?? '');
$user_jja = getenv('MYSQLUSER') ?: ($_ENV['DB_USER'] ?? 'root');
$pass_jja = getenv('MYSQLPASSWORD') ?: ($_ENV['DB_PASS'] ?? '');

define('JJA_DB_HOST', $host_jja);
define('JJA_DB_PORT', $port_jja);
define('JJA_DB_NAME', $name_jja);
define('JJA_DB_USER', $user_jja);
define('JJA_DB_PASS', $pass_jja);
define('JJA_APP_ENV', getenv('APP_ENV') ?: ($_ENV['APP_ENV'] ?? 'development'));

// ── Conexión PDO ───────────────────────────────────────────
try {
    $dsn_jja = "mysql:host=" . JJA_DB_HOST
        . ";port=" . JJA_DB_PORT
        . ";dbname=" . JJA_DB_NAME
        . ";charset=utf8mb4";

    $pdo_jja = new PDO($dsn_jja, JJA_DB_USER, JJA_DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8mb4', time_zone = '-04:00'",
    ]);

}
catch (PDOException $error_jja) {
    $msg_jja = (JJA_APP_ENV === 'development')
        ? 'ERROR PDO: ' . $error_jja->getMessage()
        : 'Error interno. Contacte al administrador.';

    http_response_code(500);
    die(json_encode(['error' => $msg_jja], JSON_UNESCAPED_UNICODE));
}
