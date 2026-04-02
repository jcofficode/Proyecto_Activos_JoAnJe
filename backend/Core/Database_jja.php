<?php
// ============================================================
// Core/Database_jja.php - Singleton PDO - JoAnJe Coders
// ============================================================

class Database_jja
{
    private static ?Database_jja $instancia_jja = null;
    private PDO $conexion_jja;

    private function __construct()
    {
        $host_jja    = $_ENV['DB_HOST']  ?? $_ENV['MYSQLHOST']     ?? getenv('DB_HOST') ?: getenv('MYSQLHOST') ?: 'localhost';
        $puerto_jja  = $_ENV['DB_PORT']  ?? $_ENV['MYSQLPORT']     ?? getenv('DB_PORT') ?: getenv('MYSQLPORT') ?: '3306';
        $db_jja      = $_ENV['DB_NAME']  ?? $_ENV['MYSQLDATABASE'] ?? getenv('DB_NAME') ?: getenv('MYSQLDATABASE') ?: 'gestion_activos_jja';
        $usuario_jja = $_ENV['DB_USER']  ?? $_ENV['MYSQLUSER']     ?? getenv('DB_USER') ?: getenv('MYSQLUSER') ?: 'root';
        $clave_jja   = $_ENV['DB_PASS']  ?? $_ENV['MYSQLPASSWORD'] ?? getenv('DB_PASS') ?: getenv('MYSQLPASSWORD') ?: '';

        $dsn_jja = "mysql:host={$host_jja};port={$puerto_jja};dbname={$db_jja};charset=utf8mb4";

        $opciones_jja = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'"
        ];

        try {
            $this->conexion_jja = new PDO($dsn_jja, $usuario_jja, $clave_jja, $opciones_jja);
            $this->conexion_jja->exec("SET time_zone = '-04:00'");
        } catch (PDOException $e_jja) {
            $env_jja = $_ENV['APP_ENV'] ?? 'production';
            $msg_jja = ($env_jja === 'development')
                ? 'Error PDO: ' . $e_jja->getMessage()
                : 'Error interno del servidor. Contacte al administrador.';
            http_response_code(500);
            die(json_encode(['exito' => false, 'mensaje' => $msg_jja, 'datos' => null],
                            JSON_UNESCAPED_UNICODE));
        }
    }

    public static function obtenerConexion_jja(): PDO
    {
        if (self::$instancia_jja === null) {
            self::$instancia_jja = new Database_jja();
        }
        return self::$instancia_jja->conexion_jja;
    }

    private function __clone() {}
    public function __wakeup(): void
    {
        throw new \Exception("No se puede deserializar un Singleton.");
    }
}
