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
        $host_jja    = $_ENV['DB_HOST'] ?? 'localhost';
        $puerto_jja  = $_ENV['DB_PORT'] ?? '3306';
        $db_jja      = $_ENV['DB_NAME'] ?? 'gestion_activos_jja';
        $usuario_jja = $_ENV['DB_USER'] ?? 'root';
        $clave_jja   = $_ENV['DB_PASS'] ?? '';

        $dsn_jja = "mysql:host={$host_jja};port={$puerto_jja};dbname={$db_jja};charset=utf8mb4";

        try {
            $this->conexion_jja = new PDO($dsn_jja, $usuario_jja, $clave_jja);
            $this->conexion_jja->setAttribute(PDO::ATTR_ERRMODE,            PDO::ERRMODE_EXCEPTION);
            $this->conexion_jja->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->conexion_jja->setAttribute(PDO::ATTR_EMULATE_PREPARES,   false);
            $this->conexion_jja->exec("SET NAMES 'utf8mb4'");
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
