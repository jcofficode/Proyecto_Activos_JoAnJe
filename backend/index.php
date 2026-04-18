<?php
// ============================================================
// index.php — Router Principal API REST — JoAnJe Coders
// Estructura calca el backend del amigo (vc) pero para REST.
// ============================================================

// ── 1. Cargar dependencias via Composer ──────────────────────
require_once __DIR__ . '/vendor/autoload.php';

// ── 2. Variables de entorno (.env via phpdotenv) ─────────────
$dotenv_jja = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv_jja->load();

// ── 3. Autoloader de clases propias (Core/Controllers/Models/Services) ──
require_once __DIR__ . '/Core/Autoloader_jja.php';

// ── 4. CORS (Versión Dinámica para Datos Móviles y WiFi) ────────
$originHeader_jja = $_SERVER['HTTP_ORIGIN'] ?? '';

// En desarrollo, permitimos el origen que venga para evitar bloqueos por IP
if ($_ENV['APP_ENV'] === 'development') {
    header("Access-Control-Allow-Origin: $originHeader_jja");
} else {
    // Lógica original de producción: Validar contra lista blanca
    $corsOrigin_jja = $_ENV['CORS_ORIGIN'] ?? 'http://localhost:5173';
    $origenesPerm_jja = array_map('trim', explode(',', $corsOrigin_jja));
    
    if (in_array($originHeader_jja, $origenesPerm_jja, true)) {
        header("Access-Control-Allow-Origin: $originHeader_jja");
    } else {
        header("Access-Control-Allow-Origin: {$origenesPerm_jja[0]}");
    }
}

header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");

// Responder preflight OPTIONS inmediatamente
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ── 5. Parsear URI: /api/v1/{recurso}/{seg0}/{seg1?} ──────────
$uri_jja = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$metodo_jja = $_SERVER['REQUEST_METHOD'];

// Eliminar prefijos de sub-carpeta (Laragon: /Proyecto_Activos_JoAnJe/backend)
// y también el prefijo /api/v1 si viene del frontend
$uri_limpia_jja = $uri_jja;
foreach (['/Proyecto_Activos_JoAnJe/backend', '/api/v1'] as $prefijo_jja) {
    if (str_starts_with($uri_limpia_jja, $prefijo_jja)) {
        $uri_limpia_jja = substr($uri_limpia_jja, strlen($prefijo_jja));
        break;
    }
}

$partes_jja = array_values(array_filter(explode('/', trim($uri_limpia_jja, '/'))));

// Si aún queda el prefijo api/v1 (doble prefijo), quitarlo
if (($partes_jja[0] ?? '') === 'api' && ($partes_jja[1] ?? '') === 'v1') {
    $partes_jja = array_slice($partes_jja, 2);
}

$recurso_jja   = $partes_jja[0] ?? null;
$segmentos_jja = array_slice($partes_jja, 1);

if (!$recurso_jja) {
    http_response_code(400);
    echo json_encode(['exito' => false, 'mensaje' => 'Recurso no especificado.', 'datos' => null]);
    exit;
}

// ── 6. Mapa recurso -> controlador ───────────────────────────
$mapa_jja = [
    'auth' => 'AuthController_jja',
    'usuarios' => 'UsuarioController_jja',
    'roles' => 'RolController_jja',
    'tipos-activos' => 'TipoActivoController_jja',
    'politicas' => 'PoliticaController_jja',
    'activos' => 'ActivoController_jja',
    'prestamos' => 'PrestamoController_jja',
    'notificaciones' => 'NotificacionController_jja',
    'lista-negra' => 'ListaNegraController_jja',
    'sanciones' => 'ListaNegraController_jja',
    'auditoria' => 'AuditoriaController_jja',
    'reportes' => 'ReporteController_jja',
    'solicitudes-prestamo' => 'SolicitudPrestamoController_jja',
    'solicitudes-devolucion' => 'SolicitudDevolucionController_jja',
    'escaneo'           => 'EscaneoController_jja',
    'archivos'          => 'ArchivoController_jja',
    'confirmar-entrega'    => 'ConfirmarEntregaController_jja',
    'confirmar-devolucion' => 'ConfirmarDevolucionController_jja',
];

$clase_jja = $mapa_jja[$recurso_jja] ?? null;

if (!$clase_jja) {
    http_response_code(404);
    echo json_encode([
        'exito' => false,
        'mensaje' => "Recurso '{$recurso_jja}' no existe en la API.",
        'datos' => null,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// ── 7. Despachar al controlador ───────────────────────────────
try {
    $controlador_jja = new $clase_jja();
    $controlador_jja->manejar_jja($metodo_jja, $segmentos_jja);
}
catch (PDOException $e_jja) {
    http_response_code(500);
    $msg_jja = ($_ENV['APP_ENV'] === 'development')
        ? 'Error de base de datos: ' . $e_jja->getMessage()
        : 'Error interno del servidor.';
    $out = json_encode(['exito' => false, 'mensaje' => $msg_jja, 'datos' => null], JSON_UNESCAPED_UNICODE);
    file_put_contents(__DIR__ . '/test_log.txt', "[500] $uri_limpia_jja -> $out\n", FILE_APPEND);
    echo $out;
}
catch (Throwable $e_jja) {
    http_response_code(500);
    $msg_jja = ($_ENV['APP_ENV'] === 'development')
        ? 'Error inesperado: ' . $e_jja->getMessage() . ' en ' . $e_jja->getFile() . ':' . $e_jja->getLine()
        : 'Error interno del servidor.';
    $out = json_encode(['exito' => false, 'mensaje' => $msg_jja, 'datos' => null], JSON_UNESCAPED_UNICODE);
    file_put_contents(__DIR__ . '/test_log.txt', "[500] $uri_limpia_jja -> $out\n", FILE_APPEND);
    echo $out;
}
