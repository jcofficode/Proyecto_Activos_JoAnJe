<?php
// ============================================================
// controllers/AuthController_jja.php - Autenticacion JWT
// Rutas: POST /auth/login | POST /auth/logout | POST /auth/cambiar-clave
// ============================================================

class AuthController_jja extends Controller_jja
{
    private AuthModel_jja    $authModel_jja;
    private TokenModel_jja   $tokenModel_jja;
    private JwtService_jja   $jwt_jja;
    private CorreoService_jja $correo_jja;

    public function __construct()
    {
        $this->authModel_jja  = new AuthModel_jja();
        $this->tokenModel_jja = new TokenModel_jja();
        $this->jwt_jja        = new JwtService_jja();
        $this->correo_jja     = new CorreoService_jja();
    }

    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        $accion_jja = $segmentos_jja[0] ?? '';

        match (true) {
            $metodo_jja === 'POST' && $accion_jja === 'login'        => $this->login_jja(),
            $metodo_jja === 'GET'  && $accion_jja === 'me'           => $this->me_jja(),
            $metodo_jja === 'POST' && $accion_jja === 'logout'       => $this->logout_jja(),
            $metodo_jja === 'POST' && $accion_jja === 'cambiar-clave'=> $this->cambiarClave_jja(),
            default => $this->responder_jja(false, null, 'Ruta de autenticacion no encontrada.', 404),
        };
    }

    // ── POST /api/v1/auth/login ─────────────────────────────
    private function login_jja(): void
    {
        $body_jja = $this->obtenerBody_jja();

        $falta_jja = $this->campoFaltante_jja($body_jja, ['cedula', 'contrasena']);
        if ($falta_jja) {
            $this->responder_jja(false, null, "El campo '{$falta_jja}' es obligatorio.", 400);
        }

        $cedula_jja     = trim($body_jja['cedula']);
        $contrasena_jja = $body_jja['contrasena'];

        // Validacion estricta: cedula solo digitos, 6-10 caracteres
        if (!ctype_digit($cedula_jja) || strlen($cedula_jja) < 6 || strlen($cedula_jja) > 10) {
            $this->responder_jja(false, null, 'La cedula debe tener entre 6 y 10 digitos numericos.', 400);
        }

        $usuario_jja = $this->authModel_jja->buscarPorCedula_jja($cedula_jja);

        if (!$usuario_jja) {
            $this->responder_jja(false, null, 'Credenciales incorrectas.', 401);
        }

        if (!password_verify($contrasena_jja, $usuario_jja['contrasena_jja'])) {
            $this->responder_jja(false, null, 'Credenciales incorrectas.', 401);
        }

        $debeCambiar_jja = (bool)($usuario_jja['debe_cambiar_clave_jja'] ?? false);
        $nombreCompleto_jja = trim($usuario_jja['nombre_jja'] . ' ' . $usuario_jja['apellido_jja']);

        $token_jja = $this->jwt_jja->generar_jja(
            (int)$usuario_jja['id_usuario_jja'],
            $cedula_jja,
            $usuario_jja['correo_jja'],
            $nombreCompleto_jja,
            $usuario_jja['nombre_rol_jja'] ?? '',
            $debeCambiar_jja
        );

        $datos_jja = [
            'token'               => $token_jja,
            'debe_cambiar_clave'  => $debeCambiar_jja,
            'usuario'             => [
                'id'     => $usuario_jja['id_usuario_jja'],
                'nombre' => $nombreCompleto_jja,
                'correo' => $usuario_jja['correo_jja'],
                'rol'    => $usuario_jja['nombre_rol_jja'] ?? '',
            ],
        ];

        $msg_jja = $debeCambiar_jja
            ? 'Inicio de sesion exitoso. Debes cambiar tu contrasena.'
            : 'Inicio de sesion exitoso.';

        $this->responder_jja(true, $datos_jja, $msg_jja, 200);
    }

    // ── GET /api/v1/auth/me ─────────────────────────────────
    private function me_jja(): void
    {
        $payload_jja = Middleware_jja::autenticar_jja();
        
        $usuario_jja = $this->authModel_jja->buscarPorCedula_jja($payload_jja->cedula);
        if (!$usuario_jja) {
            $this->responder_jja(false, null, 'Usuario no encontrado.', 404);
        }

        // Remover campos sensibles
        unset($usuario_jja['contrasena_jja']);

        $this->responder_jja(true, $usuario_jja, 'Perfil de usuario obtenido correctamente.', 200);
    }

    // ── POST /api/v1/auth/logout ────────────────────────────
    private function logout_jja(): void
    {
        $payload_jja = Middleware_jja::autenticar_jja();

        $header_jja  = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        preg_match('/^Bearer\s+(.+)$/i', $header_jja, $m_jja);
        $token_jja   = $m_jja[1] ?? '';

        $hashToken_jja = hash('sha256', $token_jja);
        $expira_jja    = date('Y-m-d H:i:s', $payload_jja->exp);

        $this->tokenModel_jja->invalidar_jja($hashToken_jja, (int)$payload_jja->id, $expira_jja);

        $this->responder_jja(true, null, 'Sesion cerrada correctamente.', 200);
    }

    // ── POST /api/v1/auth/cambiar-clave ─────────────────────
    private function cambiarClave_jja(): void
    {
        $payload_jja = Middleware_jja::autenticar_jja();
        $body_jja    = $this->obtenerBody_jja();

        $falta_jja = $this->campoFaltante_jja($body_jja, ['nueva_contrasena', 'confirmar_contrasena']);
        if ($falta_jja) {
            $this->responder_jja(false, null, "El campo '{$falta_jja}' es obligatorio.", 400);
        }

        $nueva_jja     = $body_jja['nueva_contrasena'];
        $confirmar_jja = $body_jja['confirmar_contrasena'];

        // Validacion de fortaleza: min 8 chars, al menos 1 mayuscula, 1 numero
        if (strlen($nueva_jja) < 8) {
            $this->responder_jja(false, null, 'La contrasena debe tener al menos 8 caracteres.', 400);
        }
        if (!preg_match('/[A-Z]/', $nueva_jja)) {
            $this->responder_jja(false, null, 'La contrasena debe contener al menos una letra mayuscula.', 400);
        }
        if (!preg_match('/[0-9]/', $nueva_jja)) {
            $this->responder_jja(false, null, 'La contrasena debe contener al menos un numero.', 400);
        }
        if ($nueva_jja !== $confirmar_jja) {
            $this->responder_jja(false, null, 'Las contrasenas no coinciden.', 400);
        }

        $nuevoHash_jja = password_hash($nueva_jja, PASSWORD_BCRYPT, ['cost' => 12]);
        $this->authModel_jja->cambiarContrasena_jja((int)$payload_jja->id, $nuevoHash_jja);

        // Generar nuevo token sin el flag debe_cambiar_clave
        $usuario_jja   = $this->authModel_jja->buscarPorCedula_jja($payload_jja->cedula);
        $nombre_jja    = trim(($usuario_jja['nombre_jja'] ?? '') . ' ' . ($usuario_jja['apellido_jja'] ?? ''));
        $nuevoToken_jja = $this->jwt_jja->generar_jja(
            (int)$payload_jja->id,
            $payload_jja->cedula,
            $payload_jja->correo,
            $nombre_jja,
            $payload_jja->rol,
            false
        );

        $this->responder_jja(true, ['token' => $nuevoToken_jja], 'Contrasena actualizada correctamente.', 200);
    }
}
