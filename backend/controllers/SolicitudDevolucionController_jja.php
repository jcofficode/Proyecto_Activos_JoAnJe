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
                    if (!$this->validarId_jja($id))
                        $this->responder_jja(false, null, 'ID invalido.', 400);
                    $res = $this->modelo_jja->buscarPorId_jja((int)$id);
                    $res ? $this->responder_jja(true, $res, 'Solicitud encontrada.') : $this->responder_jja(false, null, 'No encontrada.', 404);
                }
                else {
                    $res = $this->modelo_jja->listarTodas_jja();
                    $this->responder_jja(true, $res, 'Todas las solicitudes de devolución.');
                }
                break;

            case 'PATCH':
                // /solicitudes-devolucion/{id}/estado
                $body = $this->obtenerBody_jja();
                $estado = !empty($body['estado']) ? strtolower(trim($body['estado'])) : '';

                if ($estado !== 'cancelada') {
                    Middleware_jja::autorizar_jja($payload, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);
                }

                if (!$this->validarId_jja($id))
                    $this->responder_jja(false, null, 'ID invalido.', 400);
                if ($sub !== 'estado')
                    $this->responder_jja(false, null, 'Subruta no reconocida.', 404);

                if (empty($estado))
                    $this->responder_jja(false, null, "El campo 'estado' es obligatorio.", 400);
                if (!in_array($estado, ['pendiente', 'en_proceso', 'aprobada', 'rechazada', 'cancelada'], true))
                    $this->responder_jja(false, null, 'Estado invalido.', 400);

                $observaciones = trim($body['observaciones_jja'] ?? '');

                $sol = $this->modelo_jja->buscarPorId_jja((int)$id);
                if (!$sol) {
                    $this->responder_jja(false, null, 'Solicitud no encontrada.', 404);
                    return;
                }

                // Validar permiso de cancelación para el cliente
                if ($estado === 'cancelada' && Middleware_jja::esRolUsuario($payload->rol ?? '')) {
                    if ((int)$sol['id_usuario_solicitante_jja'] !== (int)$payload->id) {
                        $this->responder_jja(false, null, 'No puedes cancelar una solicitud que no es tuya.', 403);
                        return;
                    }
                    if (!in_array($sol['estado_jja'], ['pendiente', 'en_proceso'], true)) {
                        $this->responder_jja(false, null, 'No se puede cancelar en el estado actual.', 400);
                        return;
                    }
                }

                // Concatenar observaciones si aplica
                $obsAnterior = $sol['observaciones_jja'] ?? '';
                $nuevaObs = $obsAnterior;
                if ($estado === 'rechazada' && $observaciones !== '') {
                    $nuevaObs = $obsAnterior ? $obsAnterior . " | Motivo rechazo: " . $observaciones : "Motivo rechazo: " . $observaciones;
                }

                // Actualizar solicitud
                $respondidoPor = $estado === 'cancelada' ? null : (int)$payload->id;
                $this->modelo_jja->actualizarEstadoYObs_jja((int)$id, $estado, $nuevaObs, $respondidoPor);

                // Si fue aprobada, registrar devolucion (check-in) del prestamo
                if (($estado === 'en_proceso' || $estado === 'aprobada')) {
                    $idPrestamo = (int)$sol['id_prestamo_jja'];
                    $mensaje = "Tu solicitud de devolución para el préstamo #{$idPrestamo} fue aprobada. Por favor, realiza la entrega física del activo.";
                    $this->notificacion_jja->crear_jja((int)$sol['id_usuario_solicitante_jja'], 'devolucion_confirmada', $mensaje, $idPrestamo);
                }
                else if ($estado === 'rechazada') {
                    $mensaje = "Tu solicitud de devolución para el préstamo #{$sol['id_prestamo_jja']} fue rechazada.";
                    if ($observaciones) $mensaje .= " Motivo: " . $observaciones;
                    $this->notificacion_jja->crear_jja((int)$sol['id_usuario_solicitante_jja'], 'informativo', $mensaje, (int)$sol['id_prestamo_jja']);
                }

                $this->responder_jja(true, null, 'Estado de solicitud actualizado.');
                break;

            default:
                $this->responder_jja(false, null, 'Metodo HTTP no permitido.', 405);
        }
    }
}
