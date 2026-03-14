<?php
// ============================================================
// controllers/TransaccionController_jja.php
// POST /transacciones   -> crear transaccion (skeleton, DB only)
// GET  /transacciones/{id} -> ver transaccion
// ============================================================

class TransaccionController_jja extends Controller_jja
{
    private TransaccionModel_jja $modelo_jja;

    public function __construct()
    {
        $this->modelo_jja = new TransaccionModel_jja();
    }

    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        $seg0 = $segmentos_jja[0] ?? null;

        switch ($metodo_jja) {
            case 'GET':
                if ($seg0 === null || !$this->validarId_jja($seg0)) $this->responder_jja(false, null, 'ID invalido.', 400);
                $res = $this->modelo_jja->buscarPorId_jja((int)$seg0);
                $res ? $this->responder_jja(true, $res, 'Transaccion encontrada.') : $this->responder_jja(false, null, 'No encontrada.', 404);
                break;

            case 'POST':
                $payload = Middleware_jja::autenticar_jja();
                $body = $this->obtenerBody_jja();
                $falta = $this->campoFaltante_jja($body, ['id_solicitud', 'monto']);
                if ($falta) $this->responder_jja(false, null, "El campo '{$falta}' es obligatorio.", 400);

                $id_cliente = $payload->id ?? null;
                if (!$id_cliente) $this->responder_jja(false, null, 'ID de cliente no disponible en token.', 400);

                // Aquí solo registramos la intención de pago; la integración con Stripe/checkout vendrá después.
                try {
                    $res = $this->modelo_jja->crear_jja((int)$body['id_solicitud'], (int)$id_cliente, (float)$body['monto'], $body['metodo_pago'] ?? null, $body['referencia'] ?? null);
                } catch (PDOException $e) {
                    $this->responder_jja(false, null, 'Error creando transaccion: ' . $e->getMessage(), 500);
                }
                $this->responder_jja(true, $res, 'Transaccion registrada (pendiente).', 201);
                break;

            default:
                $this->responder_jja(false, null, 'Metodo HTTP no permitido.', 405);
        }
    }
}
