<?php
// ============================================================
// controllers/OfertaController_jja.php
// POST /ofertas           -> crear oferta (empresa)
// GET  /ofertas          -> listar ofertas (admin)
// GET  /ofertas/{id}     -> ver oferta
// ============================================================

class OfertaController_jja extends Controller_jja
{
    private OfertaModel_jja $modelo_jja;

    public function __construct()
    {
        $this->modelo_jja = new OfertaModel_jja();
    }

    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        $seg0 = $segmentos_jja[0] ?? null;

        switch ($metodo_jja) {
            case 'GET':
                if ($seg0 !== null) {
                    if (!$this->validarId_jja($seg0)) $this->responder_jja(false, null, 'ID invalido.', 400);
                    $this->responder_jja(true, $this->modelo_jja->buscarPorId_jja((int)$seg0), 'Oferta.');
                } else {
                    // listar: requerir admin
                    $payload = Middleware_jja::autenticar_jja();
                    Middleware_jja::autorizar_jja($payload, [Middleware_jja::ROL_ADMIN]);
                    $this->responder_jja(true, [], 'Listado de ofertas (placeholder).');
                }
                break;

            case 'POST':
                $payload = Middleware_jja::autenticar_jja();
                // empresa crea oferta para una solicitud
                $body = $this->obtenerBody_jja();
                $falta = $this->campoFaltante_jja($body, ['id_solicitud', 'precio']);
                if ($falta) $this->responder_jja(false, null, "El campo '{$falta}' es obligatorio.", 400);
                $id_empresa = $payload->id ?? null;
                if (!$id_empresa) $this->responder_jja(false, null, 'ID de empresa no disponible en token.', 400);

                try {
                    $res = $this->modelo_jja->crear_jja((int)$body['id_solicitud'], (int)$id_empresa, (float)$body['precio'], $body['mensaje'] ?? null);
                } catch (PDOException $e) {
                    $this->responder_jja(false, null, 'Error creando oferta: ' . $e->getMessage(), 500);
                }
                $this->responder_jja(true, $res, 'Oferta creada.', 201);
                break;

            default:
                $this->responder_jja(false, null, 'Metodo HTTP no permitido.', 405);
        }
    }
}
