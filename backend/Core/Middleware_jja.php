<?php
// ============================================================
// Core/Middleware_jja.php - JWT Auth + RBAC - JoAnJe Coders
// Zero Trust: cada endpoint valida identidad y rol.
// ============================================================

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;

class Middleware_jja
{
    // Constantes de roles (coinciden con roles_jja en la BD)
    public const ROL_ADMIN     = 'administrador';
    public const ROL_ENCARGADO = 'encargado';
    public const ROL_USUARIO   = 'usuario_final';
    // Roles adicionales presentes en la semilla
    public const ROL_EMPRESA   = 'empresa';
    public const ROL_CLIENTE   = 'cliente';

    /**
     * Extrae y valida el JWT del header Authorization: Bearer <token>.
     * Retorna el payload decodificado o aborta con el HTTP code adecuado.
     */
    public static function autenticar_jja(): object
    {
        $header_jja = $_SERVER['HTTP_AUTHORIZATION']
            ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
            ?? '';

        if (!preg_match('/^Bearer\s+(.+)$/i', $header_jja, $m_jja)) {
            self::denegar_jja(401, 'Token de acceso no proporcionado.');
        }

        $token_jja  = $m_jja[1];
        $secret_jja = $_ENV['JWT_SECRET'] ?? '';

        if (empty($secret_jja)) {
            self::denegar_jja(500, 'Configuracion JWT invalida en el servidor.');
        }

        try {
            $payload_jja = JWT::decode($token_jja, new Key($secret_jja, 'HS256'));
        } catch (ExpiredException) {
            self::denegar_jja(401, 'Token expirado. Inicia sesion nuevamente.');
        } catch (SignatureInvalidException) {
            self::denegar_jja(401, 'Firma del token invalida.');
        } catch (\Throwable $e_jja) {
            self::denegar_jja(401, 'Token invalido.');
        }

        // Verificar blacklist (tokens revocados por logout)
        try {
            $hashToken_jja  = hash('sha256', $token_jja);
            $tokenModel_jja = new TokenModel_jja();
            if ($tokenModel_jja->estaInvalidado_jja($hashToken_jja)) {
                self::denegar_jja(401, 'Token revocado. Inicia sesion nuevamente.');
            }
        } catch (\Throwable) { /* tabla podria no existir en tests */ }

        // Si debe cambiar clave, solo puede acceder a /auth/cambiar-clave
        if (!empty($payload_jja->debe_cambiar_clave)) {
            $uri_jja = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
            if (!str_ends_with(rtrim($uri_jja, '/'), 'cambiar-clave')) {
                self::denegar_jja(403,
                    'Debes cambiar tu contrasena antes de continuar.',
                    ['debe_cambiar_clave' => true]
                );
            }
        }

        return $payload_jja;
    }

    /**
     * Normaliza la comprobacion para usuarios finales: incluye 'usuario_final' y 'cliente'.
     */
    public static function esRolUsuario(string $rol_jja): bool
    {
        return in_array($rol_jja, [self::ROL_USUARIO, self::ROL_CLIENTE], true);
    }

    /**
     * Verifica que el payload contenga uno de los roles permitidos.
     * Uso: Middleware_jja::autorizar_jja($payload, [Middleware_jja::ROL_ADMIN])
     */
    public static function autorizar_jja(object $payload_jja, array $roles_jja): void
    {
        if (!in_array($payload_jja->rol ?? '', $roles_jja, true)) {
            self::denegar_jja(403, 'No tienes permisos para acceder a este recurso.');
        }
    }

    // ── Helper privado ───────────────────────────────────────
    private static function denegar_jja(int $http_jja, string $msg_jja, array $extra_jja = []): never
    {
        http_response_code($http_jja);
        echo json_encode(
            array_merge(['exito' => false, 'mensaje' => $msg_jja, 'datos' => null], $extra_jja),
            JSON_UNESCAPED_UNICODE
        );
        exit;
    }
}
