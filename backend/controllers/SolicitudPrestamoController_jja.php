<?php
// ============================================================
// controllers/SolicitudPrestamoController_jja.php
// Admin/encargado: listar solicitudes de producto y aprobar/rechazar
// ============================================================

class SolicitudPrestamoController_jja extends Controller_jja
{
    private SolicitudPrestamoModel_jja $modelo_jja;
    private ProductoModel_jja $producto_jja;
    private NotificacionModel_jja $notificacion_jja;

    public function __construct()
    {
        $this->modelo_jja = new SolicitudPrestamoModel_jja();
        $this->producto_jja = new ProductoModel_jja();
        $this->notificacion_jja = new NotificacionModel_jja();
    }

    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        $payload = Middleware_jja::autenticar_jja();
        $id = $segmentos_jja[0] ?? null;
        $sub = $segmentos_jja[1] ?? null;

        switch ($metodo_jja) {
            case 'GET':
                // Consultas por cliente: permitir que un cliente vea SOLO sus propias solicitudes,
                // mientras que admin/encargado pueden ver las de cualquier cliente.
                if ($id === 'cliente' && isset($segmentos_jja[1])) {
                    $idCliente = $segmentos_jja[1];
                    if (!$this->validarId_jja($idCliente))
                        $this->responder_jja(false, null, 'ID invalido.', 400);

                    // Obtener solicitudes de activos y devoluciones del cliente y combinarlas
                    $actModel = new SolicitudPrestamoActivoModel_jja();
                    $actList = $actModel->listarPorCliente_jja((int)$idCliente);
                    $mappedAct = array_map(function ($a) {
                        return [
                        'id_solicitud_jja' => (int)$a['id_solicitud_activo_jja'],
                        'producto_nombre' => $a['activo_nombre'],
                        'cantidad_jja' => 1,
                        'cliente_nombre' => $a['cliente_nombre'],
                        'cliente_correo' => $a['cliente_correo'],
                        'fecha_solicitud_jja' => $a['fecha_solicitud_jja'],
                        'estado_jja' => $a['estado_jja'],
                        'tipo_jja' => 'activo',
                        'tipo_solicitud' => 'Préstamo de Activo',
                        'id_activo_jja' => (int)$a['id_activo_jja'],
                        'observaciones_jja' => $a['observaciones_jja'] ?? null
                        ];
                    }, $actList);

                    $devModel = new SolicitudDevolucionModel_jja();
                    $devList = $devModel->listarPorCliente_jja((int)$idCliente);
                    $mappedDev = array_map(function ($d) {
                        return [
                        'id_solicitud_jja' => (int)$d['id_solicitud_devolucion_jja'],
                        'producto_nombre' => $d['activo_nombre'],
                        'cantidad_jja' => 1,
                        'cliente_nombre' => '',
                        'cliente_correo' => '',
                        'fecha_solicitud_jja' => $d['creado_en_jja'],
                        'estado_jja' => $d['estado_jja'],
                        'tipo_jja' => 'devolucion',
                        'tipo_solicitud' => 'Devolución de Activo',
                        'id_activo_jja' => (int)$d['id_activo_jja'],
                        'observaciones_jja' => $d['observaciones_jja'] ?? null,
                        'fecha_respuesta_jja' => $d['fecha_respuesta_jja'] ?? null
                        ];
                    }, $devList);

                    $combined = array_merge($mappedAct, $mappedDev);

                    // Si es cliente, solo puede ver su propio id
                    if (Middleware_jja::esRolUsuario($payload->rol ?? '')) {
                        if ((int)$payload->id !== (int)$idCliente)
                            $this->responder_jja(false, null, 'No tienes permiso para ver otras solicitudes.', 403);
                        $this->responder_jja(true, $combined, 'Tus solicitudes.');
                        return;
                    }

                    // Admin/encargado pueden ver las solicitudes del cliente
                    Middleware_jja::autorizar_jja($payload, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);
                    $this->responder_jja(true, $combined, 'Solicitudes del cliente.');
                    return;
                }

                Middleware_jja::autorizar_jja($payload, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);
                if ($id !== null) {
                    if (!$this->validarId_jja($id))
                        $this->responder_jja(false, null, 'ID invalido.', 400);
                    $res = $this->modelo_jja->buscarPorId_jja((int)$id);
                    $res ? $this->responder_jja(true, $res, 'Solicitud encontrada.') : $this->responder_jja(false, null, 'No encontrada.', 404);
                }
                else {
                    // Cargar solicitudes de activos y mapear a forma común
                    $actModel = new SolicitudPrestamoActivoModel_jja();
                    $resActivos = $actModel->listarTodas_jja();
                    $mappedAct = array_map(function ($a) {
                        return [
                        'id_solicitud_jja' => (int)$a['id_solicitud_activo_jja'],
                        'producto_nombre' => $a['activo_nombre'],
                        'cantidad_jja' => 1,
                        'cliente_nombre' => $a['cliente_nombre'],
                        'cliente_correo' => $a['cliente_correo'],
                        'fecha_solicitud_jja' => $a['fecha_solicitud_jja'],
                        'estado_jja' => $a['estado_jja'],
                        'tipo_jja' => 'activo',
                        'id_activo_jja' => (int)$a['id_activo_jja'],
                        'observaciones_jja' => $a['observaciones_jja'] ?? null
                        ];
                    }, $resActivos);

                    $this->responder_jja(true, $mappedAct, 'Solicitudes de activos.');
                }
                break;

            case 'PATCH':
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
                if (!in_array($estado, ['en_proceso', 'aprobada', 'rechazada', 'cancelada'], true))
                    $this->responder_jja(false, null, 'Estado invalido.', 400);

                $tipo = strtolower(trim($body['tipo'] ?? 'activo'));
                $observaciones = trim($body['observaciones_jja'] ?? '');

                // Procesar solicitud de activo
                $actModel = new SolicitudPrestamoActivoModel_jja();
                $solAct = $actModel->buscarPorId_jja((int)$id);
                if (!$solAct) {
                    $this->responder_jja(false, null, 'Solicitud no encontrada.', 404);
                    return;
                }

                // Validar permiso de cancelación para el cliente
                if ($estado === 'cancelada' && Middleware_jja::esRolUsuario($payload->rol ?? '')) {
                    if ((int)$solAct['id_cliente_jja'] !== (int)$payload->id) {
                        $this->responder_jja(false, null, 'No puedes cancelar una solicitud que no es tuya.', 403);
                        return;
                    }
                    if (!in_array($solAct['estado_jja'], ['pendiente', 'en_proceso'], true)) {
                        $this->responder_jja(false, null, 'No se puede cancelar en el estado actual.', 400);
                        return;
                    }
                }

                // Concatenar observaciones si aplica
                $obsAnterior = $solAct['observaciones_jja'] ?? '';
                $nuevaObs = $obsAnterior;
                if ($estado === 'rechazada' && $observaciones !== '') {
                    $nuevaObs = $obsAnterior ? $obsAnterior . " | Motivo rechazo: " . $observaciones : "Motivo rechazo: " . $observaciones;
                }

                if ($estado === 'en_proceso' || $estado === 'aprobada') {
                    $mensaje = "Tu solicitud para el activo '{$solAct['activo_nombre']}' ha sido aprobada. Puedes pasar a retirarlo.";
                    $this->notificacion_jja->crear_jja((int)$solAct['id_cliente_jja'], 'informativo', $mensaje, null);
                }
                else {
                    // Rechazada o cancelada: revertir estado del activo a 'disponible'
                    $activoModel = new ActivoModel_jja();
                    $activoModel->actualizarEstado_jja((int)$solAct['id_activo_jja'], 'disponible');

                    if ($estado === 'rechazada') {
                        $mensaje = "Tu solicitud para el activo '{$solAct['activo_nombre']}' fue rechazada.";
                        if ($observaciones) $mensaje .= " Motivo: " . $observaciones;
                        $this->notificacion_jja->crear_jja((int)$solAct['id_cliente_jja'], 'informativo', $mensaje, null);
                    }
                }

                $actModel->actualizarEstadoYObs_jja((int)$id, $estado, $nuevaObs);
                $this->responder_jja(true, null, 'Estado actualizado.');
                break;

            default:
                $this->responder_jja(false, null, 'Metodo HTTP no permitido.', 405);
        }
    }
}
