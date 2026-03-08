<?php
// ============================================================
// controllers/ReporteController_jja.php - Solo ADMIN
// GET /reportes/prestamos?fecha_inicio=&fecha_fin=&id_tipo=&id_usuario=
// GET /reportes/activos-mas-prestados
// GET /reportes/usuarios-activos
// GET /reportes/tasa-devolucion
// ============================================================

class ReporteController_jja extends Controller_jja
{
    private ReporteModel_jja $modelo_jja;

    public function __construct()
    {
        $this->modelo_jja = new ReporteModel_jja();
    }

    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        $payload_jja = Middleware_jja::autenticar_jja();
        Middleware_jja::autorizar_jja($payload_jja, [Middleware_jja::ROL_ADMIN]);

        if ($metodo_jja !== 'GET') {
            $this->responder_jja(false, null, 'Metodo HTTP no permitido.', 405);
        }

        $tipo_jja = $segmentos_jja[0] ?? '';

        switch ($tipo_jja) {
            case 'prestamos':
                $fi_jja  = $_GET['fecha_inicio'] ?? null;
                $ff_jja  = $_GET['fecha_fin']    ?? null;
                $idt_jja = isset($_GET['id_tipo'])    && ctype_digit($_GET['id_tipo'])    ? (int)$_GET['id_tipo']    : null;
                $idu_jja = isset($_GET['id_usuario']) && ctype_digit($_GET['id_usuario']) ? (int)$_GET['id_usuario'] : null;

                // Validar formato de fecha si se provee
                if ($fi_jja && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fi_jja))
                    $this->responder_jja(false, null, 'fecha_inicio debe tener formato YYYY-MM-DD.', 400);
                if ($ff_jja && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $ff_jja))
                    $this->responder_jja(false, null, 'fecha_fin debe tener formato YYYY-MM-DD.', 400);

                $data_jja = $this->modelo_jja->reportePrestamos_jja($fi_jja, $ff_jja, $idt_jja, $idu_jja);
                $this->responder_jja(true, $data_jja, 'Reporte de prestamos generado.');
                break;

            case 'activos-mas-prestados':
                $this->responder_jja(true, $this->modelo_jja->activosMasPrestados_jja(), 'Top 10 activos mas prestados.');
                break;

            case 'usuarios-activos':
                $this->responder_jja(true, $this->modelo_jja->usuariosActivos_jja(), 'Top 10 usuarios mas activos.');
                break;

            case 'tasa-devolucion':
                $this->responder_jja(true, $this->modelo_jja->tasaDevolucion_jja(), 'Tasa de devolucion oportuna.');
                break;

            default:
                $this->responder_jja(false, null,
                    "Reporte '{$tipo_jja}' no reconocido. Usa: prestamos | activos-mas-prestados | usuarios-activos | tasa-devolucion",
                    404);
        }
    }
}
