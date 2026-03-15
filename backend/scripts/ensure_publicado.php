<?php
// Script de migración simple: añade la columna publicado_jja si no existe
require __DIR__ . '/../vendor/autoload.php';

$dotenv_jja = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
if (file_exists(__DIR__ . '/../../.env')) {
    try { Dotenv\Dotenv::createImmutable(__DIR__ . '/../../')->load(); } catch (Exception $e) { /* ignore */ }
}

$host = $_ENV['DB_HOST'] ?? '127.0.0.1';
$port = $_ENV['DB_PORT'] ?? '3306';
$user = $_ENV['DB_USER'] ?? 'root';
$pass = $_ENV['DB_PASS'] ?? '';
$db   = $_ENV['DB_NAME'] ?? 'gestion_activos_jja';

try {
    $pdo = new PDO("mysql:host={$host};port={$port};dbname={$db}", $user, $pass, [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
    // MySQL >=8.0.16 supports ADD COLUMN IF NOT EXISTS
    $sql = "ALTER TABLE `activos_jja` ADD COLUMN IF NOT EXISTS `publicado_jja` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Publicado en marketplace: 1=si, 0=no'";
    $pdo->exec($sql);
    echo "OK: columna publicado_jja asegurada\n";
} catch (PDOException $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}

?>
