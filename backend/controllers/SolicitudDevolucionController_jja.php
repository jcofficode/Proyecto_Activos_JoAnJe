<?php
// ============================================================
// controllers/SolicitudDevolucionController_jja.php
// Rutas: GET /solicitudes-devolucion | GET /solicitudes-devolucion/{id}
// PATCH /solicitudes-devolucion/{id}/estado  (aprobar/rechazar) — admin/encargado
// ============================================================

class SolicitudDevolucionController_jja extends Controller_jja
{
    private SolicitudDevolucionModel_jja $modelo_jja;
    private PrestamoModel_jja $prestamo_jja;
    private NotificacionModel_jja $notificacion_jja;

    public function __construct()
    {
        $this->modelo_jja = new SolicitudDevolucionModel_jja();
        $this->prestamo_jja = new PrestamoModel_jja();
        $this->notificacion_jja = new NotificacionModel_jja();
    }

    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        $payload = Middleware_jja::autenticar_jja();
        $id = $segmentos_jja[0] ?? null;
        $sub = $segmentos_jja[1] ?? null;

        switch ($metodo_jja) {
            case 'GET':
                Middleware_jja::autorizar_jja($payload, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);
                if ($id !== null) {
                    if (!$this->validarId_jja($id)) $this->responder_jja(false, null, 'ID invalido.', 400);
                    $res = $this->modelo_jja->buscarPorId_jja((int)$id);
                    $res ? $this->responder_jja(true, $res, 'Solicitud encontrada.') : $this->responder_jja(false, null, 'No encontrada.', 404);
                } else {
                    $res = $this->modelo_jja->listarTodas_jja();
                    $this->responder_jja(true, $res, 'Todas las solicitudes de devolución.');
                }
                break;

            case 'PATCH':
                // /solicitudes-devolucion/{id}/estado
                Middleware_jja::autorizar_jja($payload, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);
                if (!$this->validarId_jja($id)) $this->responder_jja(false, null, 'ID invalido.', 400);
                if ($sub !== 'estado') $this->responder_jja(false, null, 'Subruta no reconocida.', 404);

                $body = $this->obtenerBody_jja();
                if (empty($body['estado'])) $this->responder_jja(false, null, "El campo 'estado' es obligatorio.", 400);
                $estado = strtolower(trim($body['estado']));
                if (!in_array($estado, ['en_proceso','aprobada','rechazada'], true)) $this->responder_jja(false, null, 'Estado invalido.', 400);

                // Actualizar solicitud
                $this->modelo_jja->actualizarEstado_jja((int)$id, $estado, (int)$payload->id);

                // Si fue aprobada, registrar devolucion (check-in) del prestamo
                $sol = $this->modelo_jja->buscarPorId_jja((int)$id);
                if (($estado === 'en_proceso' || $estado === 'aprobada') && $sol) {
                    $idPrestamo = (int)$sol['id_prestamo_jja'];
                    $mensaje = "Tu solicitud de devolución para el préstamo #{$idPrestamo} fue aprobada. Por favor, realiza la entrega física del activo.";
                    $this->notificacion_jja->crear_jja((int)$sol['id_usuario_solicitante_jja'], 'devolucion_confirmada', $mensaje, $idPrestamo);
                } else if ($estado === 'rechazada' && $sol) {
                    $mensaje = "Tu solicitud de devolución para el préstamo #{$sol['id_prestamo_jja']} fue rechazada.";
                    $this->notificacion_jja->crear_jja((int)$sol['id_usuario_solicitante_jja'], 'informativo', $mensaje, (int)$sol['id_prestamo_jja']);
                }

                $this->responder_jja(true, null, 'Estado de solicitud actualizado.');
                break;

            default:
                $this->responder_jja(false, null, 'Metodo HTTP no permitido.', 405);
        }
    }
}
