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

                    // Si es usuario/cliente, sólo permitimos su propio id
                    if (Middleware_jja::esRolUsuario($payload->rol ?? '')) {
                        if ((int)$payload->id !== (int)$idCliente) $this->responder_jja(false, null, 'No tienes permiso para ver otras solicitudes.', 403);
                        $res = $this->modelo_jja->listarPorCliente_jja((int)$idCliente);
                        $this->responder_jja(true, $res, 'Tus solicitudes.');
                        return;
                    }

                    // En otro caso (admin/encargado) validar rol y devolver las solicitudes del cliente
                    Middleware_jja::autorizar_jja($payload, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);
                    $res = $this->modelo_jja->listarPorCliente_jja((int)$idCliente);
                    $this->responder_jja(true, $res, 'Solicitudes del cliente.');
                    return;
                }

                Middleware_jja::autorizar_jja($payload, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);
                if ($id !== null) {
                    if (!$this->validarId_jja($id)) $this->responder_jja(false, null, 'ID invalido.', 400);
                    $res = $this->modelo_jja->buscarPorId_jja((int)$id);
                    $res ? $this->responder_jja(true, $res, 'Solicitud encontrada.') : $this->responder_jja(false, null, 'No encontrada.', 404);
                } else {
                        // listar todas a través del modelo
                        $res = $this->modelo_jja->listarTodas_jja();
                        $this->responder_jja(true, $res, 'Solicitudes de producto.');
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

                // Obtener la solicitud
                $sol = $this->modelo_jja->buscarPorId_jja((int)$id);
                if (!$sol) $this->responder_jja(false, null, 'Solicitud no encontrada.', 404);

                // Si se aprueba, disminuir stock y notificar
                if ($estado === 'aprobada') {
                    $this->producto_jja->disminuirStock_jja((int)$sol['id_producto_jja'], (int)$sol['cantidad_jja']);
                    // Crear registro de prestamo de producto
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
                break;

            default:
                $this->responder_jja(false, null, 'Metodo HTTP no permitido.', 405);
        }
    }
}
