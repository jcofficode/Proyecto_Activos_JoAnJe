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
                    if (!$this->validarId_jja($idCliente)) $this->responder_jja(false, null, 'ID invalido.', 400);

                    // Obtener solicitudes de productos y de activos del cliente y combinarlas
                    $prodList = $this->modelo_jja->listarPorCliente_jja((int)$idCliente);
                    $actModel = new SolicitudPrestamoActivoModel_jja();
                    $actList = $actModel->listarPorCliente_jja((int)$idCliente);
                    $mappedAct = array_map(function($a){
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
                    }, $actList);

                    $combined = array_merge(is_array($prodList) ? $prodList : [], $mappedAct);

                    // Si es cliente, solo puede ver su propio id
                    if (Middleware_jja::esRolUsuario($payload->rol ?? '')) {
                        if ((int)$payload->id !== (int)$idCliente) $this->responder_jja(false, null, 'No tienes permiso para ver otras solicitudes.', 403);
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
                    if (!$this->validarId_jja($id)) $this->responder_jja(false, null, 'ID invalido.', 400);
                    $res = $this->modelo_jja->buscarPorId_jja((int)$id);
                    $res ? $this->responder_jja(true, $res, 'Solicitud encontrada.') : $this->responder_jja(false, null, 'No encontrada.', 404);
                } else {
                        // listar todas a través del modelo (productos) y también incluir solicitudes de activos
                        $resProductos = $this->modelo_jja->listarTodas_jja();
                        // cargar solicitudes de activos y mapear a forma común
                        $actModel = new SolicitudPrestamoActivoModel_jja();
                        $resActivos = $actModel->listarTodas_jja();
                        $mappedAct = array_map(function($a){
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

                        $combined = array_merge(is_array($resProductos) ? $resProductos : [], $mappedAct);
                        $this->responder_jja(true, $combined, 'Solicitudes de producto y activos.');
                }
                break;

            case 'PATCH':
                Middleware_jja::autorizar_jja($payload, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);
                if (!$this->validarId_jja($id)) $this->responder_jja(false, null, 'ID invalido.', 400);
                if ($sub !== 'estado') $this->responder_jja(false, null, 'Subruta no reconocida.', 404);
                $body = $this->obtenerBody_jja();
                if (empty($body['estado'])) $this->responder_jja(false, null, "El campo 'estado' es obligatorio.", 400);
                $estado = strtolower(trim($body['estado']));
                if (!in_array($estado, ['aprobada','rechazada','cancelada'], true)) $this->responder_jja(false, null, 'Estado invalido.', 400);

                // Obtener la solicitud (primero producto)
                $sol = $this->modelo_jja->buscarPorId_jja((int)$id);
                if ($sol) {
                    // manejo existente para producto
                    if ($estado === 'aprobada') {
                        $this->producto_jja->disminuirStock_jja((int)$sol['id_producto_jja'], (int)$sol['cantidad_jja']);
                        $ppModel = new PrestamoProductoModel_jja();
                        $prestamoProd = $ppModel->crear_jja((int)$sol['id_producto_jja'], (int)$sol['id_cliente_jja'], (int)$payload->id, $body['observaciones'] ?? null);
                        $mensaje = "Tu solicitud para el producto '{$sol['producto_nombre']}' ha sido aprobada.";
                        $this->notificacion_jja->crear_jja((int)$sol['id_cliente_jja'], 'informativo', $mensaje, null);
                    } else {
                        $mensaje = "Tu solicitud para el producto '{$sol['producto_nombre']}' fue {$estado}.";
                        $this->notificacion_jja->crear_jja((int)$sol['id_cliente_jja'], 'informativo', $mensaje, null);
                    }
                    $this->modelo_jja->actualizarEstado_jja((int)$id, $estado);
                    $this->responder_jja(true, null, 'Estado actualizado.');
                    return;
                }

                // Si no es producto, intentar solicitud de activo
                $actModel = new SolicitudPrestamoActivoModel_jja();
                $solAct = $actModel->buscarPorId_jja((int)$id);
                if (!$solAct) {
                    $this->responder_jja(false, null, 'Solicitud no encontrada.', 404);
                    return;
                }

                // Procesar solicitud de activo
                if ($estado === 'aprobada') {
                    // Registrar prestamo de activo
                    $prestamoModel = new PrestamoModel_jja();
                    $prestamo = $prestamoModel->registrar_jja((int)$solAct['id_activo_jja'], (int)$solAct['id_cliente_jja'], (int)$payload->id, $body['observaciones'] ?? null);
                    $mensaje = "Tu solicitud para el activo '{$solAct['activo_nombre']}' ha sido aprobada.";
                    $this->notificacion_jja->crear_jja((int)$solAct['id_cliente_jja'], 'informativo', $mensaje, null);
                } else {
                    // Rechazada o cancelada: revertir estado del activo a 'disponible'
                    $activoModel = new ActivoModel_jja();
                    $activoModel->actualizarEstado_jja((int)$solAct['id_activo_jja'], 'disponible');

                    $mensaje = "Tu solicitud para el activo '{$solAct['activo_nombre']}' fue {$estado}.";
                    $this->notificacion_jja->crear_jja((int)$solAct['id_cliente_jja'], 'informativo', $mensaje, null);
                }

                $actModel->actualizarEstado_jja((int)$id, $estado);
                $this->responder_jja(true, null, 'Estado actualizado.');
                break;

            default:
                $this->responder_jja(false, null, 'Metodo HTTP no permitido.', 405);
        }
    }
}
