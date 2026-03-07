<?php

// ─── CORS ────
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Allow: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../model/UsuarioModelo_jc.php';
require_once __DIR__ . '/../modelos/CorreoModelo_jc.php';

class UsuarioControlador_jc {

    private $modelo_jc;
    private $correo_jc;

    public function __construct() {
        $this->modelo_jc  = new UsuarioModelo_jc();
        $this->correo_jc  = new CorreoModelo_jc();
    }

   
    public function manejarPeticion_jc(): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->responder_jc(['exito' => false, 'mensaje' => 'Sólo se permite método POST o GET.'], 405);
            return;
        }

        // Preferimos POST, si no, buscamos en GET para mantener compatibilidad si fuera necesario
        $accion_jc = trim($_POST['accion_jc'] ?? $_GET['accion_jc'] ?? '');

        switch ($accion_jc) {
            case 'registrar':
                $this->registrar_jc();
                break;
            case 'login':
                $this->login_jc();
                break;
            default:
                $this->responder_jc(['exito' => false, 'mensaje' => "Acción '$accion_jc' no reconocida."], 400);
        }
    }

    // ─── Acción: registrar ──
    private function registrar_jc(): void {
        $nombre_jc   = trim($_POST['nombre_jc']   ?? $_GET['nombre_jc']   ?? '');
        $correo_jc   = trim($_POST['correo_jc']   ?? $_GET['correo_jc']   ?? '');
        $telefono_jc = trim($_POST['telefono_jc'] ?? $_GET['telefono_jc'] ?? '');
        $empresa_jc  = trim($_POST['empresa_jc']  ?? $_GET['empresa_jc']  ?? '');

        // Validaciones
        if (empty($nombre_jc) || strlen($nombre_jc) > 120) {
            $this->responder_jc(['exito' => false, 'mensaje' => 'El nombre es obligatorio (máx. 120 caracteres).'], 400);
            return;
        }

        if (empty($correo_jc) || !filter_var($correo_jc, FILTER_VALIDATE_EMAIL)) {
            $this->responder_jc(['exito' => false, 'mensaje' => 'El correo no es válido.'], 400);
            return;
        }

        // Registrar en BD
        $resultado_jc = $this->modelo_jc->registrarUsuario_jc(
            $nombre_jc, $correo_jc, $telefono_jc, $empresa_jc
        );

        if (!$resultado_jc['exito']) {
            $this->responder_jc($resultado_jc, 409);
            return;
        }

        // Enviar correo con la clave temporal
        $envio_jc = $this->correo_jc->enviarClaveTemporal_jc(
            $correo_jc,
            $nombre_jc,
            $resultado_jc['clave']
        );

        $resultado_jc['correo_enviado'] = $envio_jc['exito'];
        $resultado_jc['correo_mensaje'] = $envio_jc['mensaje'];

        // Eliminamos la clave de la respuesta JSON por seguridad
        
        unset($resultado_jc['clave']);

        $this->responder_jc($resultado_jc, 201);
    }

    // ─── Acción: login ─────
    private function login_jc(): void {
        $correo_jc = trim($_POST['correo_jc'] ?? $_GET['correo_jc'] ?? '');
        $clave_jc  = trim($_POST['clave_jc']  ?? $_GET['clave_jc']  ?? '');

        if (empty($correo_jc) || empty($clave_jc)) {
            $this->responder_jc(['exito' => false, 'mensaje' => 'Correo y clave son obligatorios.'], 400);
            return;
        }

        $resultado_jc = $this->modelo_jc->iniciarSesion_jc($correo_jc, $clave_jc);

        $this->responder_jc($resultado_jc, $resultado_jc['exito'] ? 200 : 401);
    }

    // ─── Helper: respuesta JSON ───────
    private function responder_jc(array $datos_jc, int $codigo_jc = 200): void {
        http_response_code($codigo_jc);
        echo json_encode($datos_jc, JSON_UNESCAPED_UNICODE);
        exit;
    }
}


$controlador_jc = new UsuarioControlador_jc();
$controlador_jc->manejarPeticion_jc();
