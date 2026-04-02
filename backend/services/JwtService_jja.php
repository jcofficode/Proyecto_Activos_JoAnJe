<?php
// ============================================================
// services/JwtService_jja.php - Generacion de JWT - JoAnJe Coders
// ============================================================

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtService_jja
{
    private string $secret_jja;
    private int    $horas_jja;

    public function __construct()
    {
        $this->secret_jja = $_ENV['JWT_SECRET']      ?? '';
        $this->horas_jja  = (int)($_ENV['JWT_EXPIRA_HORAS'] ?? 2);
    }

    /**
     * Genera un JWT firmado con los datos del usuario autenticado.
     */
    public function generar_jja(
        int    $id_jja,
        string $cedula_jja,
        string $correo_jja,
        string $nombreCompleto_jja,
        string $rol_jja,
        bool   $debeCambiarClave_jja = false
    ): string {
        $ahora_jja = (int) time();
        $horas = (int) $this->horas_jja;
        $exp_jja = $ahora_jja + ($horas * 3600);
        
        return JWT::encode([
            'iss'               => 'JoAnJe-Coders-API',
            'iat'               => $ahora_jja,
            'exp'               => $exp_jja,
            'id'                => $id_jja,
            'cedula'            => $cedula_jja,
            'correo'            => $correo_jja,
            'nombre'            => $nombreCompleto_jja,
            'rol'               => $rol_jja,
            'debe_cambiar_clave'=> $debeCambiarClave_jja,
        ], $this->secret_jja, 'HS256');
    }

    /**
     * Decodifica un JWT sin validar expiracion (solo para leer el exp en logout).
     */
    public function decodificar_jja(string $token_jja): object
    {
        return JWT::decode($token_jja, new Key($this->secret_jja, 'HS256'));
    }
}
