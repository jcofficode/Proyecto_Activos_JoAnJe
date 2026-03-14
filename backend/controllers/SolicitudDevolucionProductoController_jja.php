<?php
// ============================================================
// controllers/SolicitudDevolucionProductoController_jja.php
// - POST /prestamos-productos/{id}/solicitud-devolucion  (cliente)
// - GET  /solicitudes-devolucion-productos                (admin)
// - PATCH /solicitudes-devolucion-productos/{id}/estado   (admin aprueba/rechaza)
// ============================================================

class SolicitudDevolucionProductoController_jja extends Controller_jja
{
    private SolicitudDevolucionProductoModel_jja $modelo_jja;
    private PrestamoProductoModel_jja $prestProd_jja;
    private NotificacionModel_jja $notificacion_jja;

    public function __construct()
    {
        $this->modelo_jja = new SolicitudDevolucionProductoModel_jja();
        $this->prestProd_jja = new PrestamoProductoModel_jja();
        $this->notificacion_jja = new NotificacionModel_jja();
    }

    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        $payload = Middleware_jja::autenticar_jja();
        $seg0 = $segmentos_jja[0] ?? null; // can be id or null
        $seg1 = $segmentos_jja[1] ?? null; // subroute

        if ($metodo_jja === 'POST' && $seg1 === 'solicitud-devolucion') {
            // POST /prestamos-productos/{id}/solicitud-devolucion (cliente)
            if (!$this->validarId_jja($seg0)) $this->responder_jja(false, null, 'ID invalido.', 400);
            $idPrest = (int)$seg0;
            $prestamo = $this->prestProd_jja->buscarPorId_jja($idPrest);
            if (!$prestamo) $this->responder_jja(false, null, 'Préstamo no encontrado.', 404);
            if ((int)$prestamo['id_cliente_jja'] !== (int)$payload->id) $this->responder_jja(false, null, 'Solo el titular puede solicitar la devolución.', 403);
            $body = $this->obtenerBody_jja();
            $obs = $body['observaciones'] ?? null;
            $sol = $this->modelo_jja->crear_jja($idPrest, (int)$payload->id, $obs);
            // notificar a la empresa
            $mensaje = "El usuario solicita la devolución del préstamo de producto #{$idPrest}.";
            $this->notificacion_jja->crear_jja((int)$prestamo['id_empresa_jja'], 'informativo', $mensaje, $idPrest);
            $this->responder_jja(true, $sol, 'Solicitud de devolución creada.', 201);
            return;
        }

        if ($metodo_jja === 'GET') {
            Middleware_jja::autorizar_jja($payload, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);
                // listar pendientes a través del modelo
                $res = $this->modelo_jja->listarTodas_jja();
                $this->responder_jja(true, $res, 'Solicitudes de devolución de productos.');
            return;
        }

        if ($metodo_jja === 'PATCH' && $seg1 === 'estado') {
            Middleware_jja::autorizar_jja($payload, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);
            if (!$this->validarId_jja($seg0)) $this->responder_jja(false, null, 'ID invalido.', 400);
            $idSol = (int)$seg0;
            $body = $this->obtenerBody_jja();
            if (empty($body['estado'])) $this->responder_jja(false, null, "El campo 'estado' es obligatorio.", 400);
            $estado = strtolower(trim($body['estado']));
            if (!in_array($estado, ['aprobada','rechazada'], true)) $this->responder_jja(false, null, 'Estado invalido.', 400);
            $this->modelo_jja->beginTransaction_jja();
            try {
                $this->modelo_jja->actualizarEstado_jja($idSol, $estado);
                $sol = $this->modelo_jja->buscarPorId_jja($idSol);
                if ($estado === 'aprobada' && $sol) {
                    // marcar prestamo producto como devuelto
                    $this->modelo_jja->marcarPrestamoDevuelto_jja((int)$sol['id_prestamo_producto_jja']);
                    $mensaje = "Tu solicitud de devolución para el préstamo de producto #{$sol['id_prestamo_producto_jja']} fue aprobada.";
                    $this->notificacion_jja->crear_jja((int)$sol['id_usuario_solicitante_jja'], 'devolucion_confirmada', $mensaje, $sol['id_prestamo_producto_jja']);
                } else if ($estado === 'rechazada' && $sol) {
                    $mensaje = "Tu solicitud de devolución para el préstamo de producto #{$sol['id_prestamo_producto_jja']} fue rechazada.";
                    $this->notificacion_jja->crear_jja((int)$sol['id_usuario_solicitante_jja'], 'informativo', $mensaje, $sol['id_prestamo_producto_jja']);
                }
                $this->modelo_jja->commit_jja();
            } catch (Throwable $e) {
                $this->modelo_jja->rollBack_jja();
                $this->responder_jja(false, null, 'Error procesando la solicitud.', 500);
            }
            $this->responder_jja(true, null, 'Estado actualizado.');
            return;
        }

        $this->responder_jja(false, null, 'Ruta no encontrada.', 404);
    }
}
