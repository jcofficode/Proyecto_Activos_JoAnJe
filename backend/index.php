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

// ── 4. CORS ──────────────────────────────────────────────────
$corsOrigin_jja = $_ENV['CORS_ORIGIN'] ?? 'http://localhost:5174';
$originHeader_jja = $_SERVER['HTTP_ORIGIN'] ?? $corsOrigin_jja;

header("Access-Control-Allow-Origin: {$originHeader_jja}");

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
$partes_jja = array_values(array_filter(explode('/', trim($uri_jja, '/'))));

// Verificar prefijo /api/v1/
if (($partes_jja[0] ?? '') !== 'api' || ($partes_jja[1] ?? '') !== 'v1') {
    http_response_code(200);
    echo json_encode([
        'sistema' => 'API REST - Sistema de Gestion de Activos JoAnJe Coders',
        'version' => '1.0.0',
        'estado' => 'activo',
        'base_url' => '/api/v1',
        'endpoints' => [
            'auth' => '/api/v1/auth/login | /api/v1/auth/logout | /api/v1/auth/cambiar-clave',
            'usuarios' => '/api/v1/usuarios',
            'roles' => '/api/v1/roles',
            'tipos-activos' => '/api/v1/tipos-activos',
            'politicas' => '/api/v1/politicas',
            'activos' => '/api/v1/activos | /api/v1/activos/qr/{codigo} | /api/v1/activos/nfc/{codigo}',
            'prestamos' => '/api/v1/prestamos | /api/v1/prestamos/{id}/devolver',
            'notificaciones' => '/api/v1/notificaciones/usuario/{id}',
            'lista-negra' => '/api/v1/lista-negra',
            'auditoria' => '/api/v1/auditoria',
            'reportes' => '/api/v1/reportes/prestamos | activos-mas-prestados | usuarios-activos | tasa-devolucion',
        ],
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

$recurso_jja = $partes_jja[2] ?? null; // ej: 'usuarios', 'activos', 'auth'
$segmentos_jja = array_slice($partes_jja, 3); // resto para el controlador

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
    echo json_encode(['exito' => false, 'mensaje' => $msg_jja, 'datos' => null], JSON_UNESCAPED_UNICODE);
}
catch (Throwable $e_jja) {
    http_response_code(500);
    $msg_jja = ($_ENV['APP_ENV'] === 'development')
        ? 'Error inesperado: ' . $e_jja->getMessage() . ' en ' . $e_jja->getFile() . ':' . $e_jja->getLine()
        : 'Error interno del servidor.';
    echo json_encode(['exito' => false, 'mensaje' => $msg_jja, 'datos' => null], JSON_UNESCAPED_UNICODE);
}
