<?php
// ============================================================
// controllers/PoliticaController_jja.php - Solo ADMIN
// GET /politicas | GET /politicas/tipo/{id} | POST | PUT | DELETE
// ============================================================

class PoliticaController_jja extends Controller_jja
{
    private PoliticaModel_jja $modelo_jja;

    public function __construct()
    {
        $this->modelo_jja = new PoliticaModel_jja();
    }

    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        $payload_jja = Middleware_jja::autenticar_jja();
        Middleware_jja::autorizar_jja($payload_jja, [Middleware_jja::ROL_ADMIN]);

        $seg0_jja = $segmentos_jja[0] ?? null;  // 'tipo' | id
        $seg1_jja = $segmentos_jja[1] ?? null;  // id cuando seg0='tipo'

        switch ($metodo_jja) {
            case 'GET':
                if ($seg0_jja === 'tipo' && $seg1_jja) {
                    if (!$this->validarId_jja($seg1_jja)) $this->responder_jja(false, null, 'ID invalido.', 400);
                    $pol_jja = $this->modelo_jja->buscarPorTipo_jja((int)$seg1_jja);
                    $pol_jja
                        ? $this->responder_jja(true, $pol_jja, 'Politica encontrada.')
                        : $this->responder_jja(false, null, 'Politica para ese tipo no encontrada.', 404);
                } else {
                    $this->responder_jja(true, $this->modelo_jja->listar_jja(), 'Politicas de prestamo.');
                }
                break;

            case 'POST':
                $body_jja  = $this->obtenerBody_jja();
                $falta_jja = $this->campoFaltante_jja($body_jja, ['id_tipo', 'dias_maximo', 'max_prestamos_simultaneos']);
                if ($falta_jja) $this->responder_jja(false, null, "El campo '{$falta_jja}' es obligatorio.", 400);
                if ((int)$body_jja['dias_maximo'] < 0 || (int)$body_jja['dias_maximo'] > 365)
                    $this->responder_jja(false, null, 'dias_maximo debe estar entre 0 y 365.', 400);
                $res_jja = $this->modelo_jja->crear_jja(
                    (int)$body_jja['id_tipo'],
                    (int)$body_jja['dias_maximo'],
                    (int)$body_jja['max_prestamos_simultaneos'],
                    (bool)($body_jja['requiere_mismo_dia'] ?? false)
                );
                $this->responder_jja(true, $res_jja, 'Politica creada.', 201);
                break;

            case 'PUT':
                if (!$this->validarId_jja($seg0_jja)) $this->responder_jja(false, null, 'ID invalido.', 400);
                $body_jja  = $this->obtenerBody_jja();
                $falta_jja = $this->campoFaltante_jja($body_jja, ['dias_maximo', 'max_prestamos_simultaneos']);
                if ($falta_jja) $this->responder_jja(false, null, "El campo '{$falta_jja}' es obligatorio.", 400);
                $this->modelo_jja->actualizar_jja(
                    (int)$seg0_jja,
                    (int)$body_jja['dias_maximo'],
                    (int)$body_jja['max_prestamos_simultaneos'],
                    (bool)($body_jja['requiere_mismo_dia'] ?? false)
                );
                $this->responder_jja(true, null, 'Politica actualizada.');
                break;

            case 'DELETE':
                if (!$this->validarId_jja($seg0_jja)) $this->responder_jja(false, null, 'ID invalido.', 400);
                $res_jja = $this->modelo_jja->eliminar_jja((int)$seg0_jja);
                ($res_jja['filas_afectadas'] ?? 0) < 1
                    ? $this->responder_jja(false, null, 'Politica no encontrada.', 404)
                    : $this->responder_jja(true, null, 'Politica eliminada.');
                break;

            default:
                $this->responder_jja(false, null, 'Metodo HTTP no permitido.', 405);
        }
    }
}
