<?php
// ============================================================
// controllers/PrestamoProductoController_jja.php
// Rutas: GET /prestamos-productos/usuario/{id}
// ============================================================

class PrestamoProductoController_jja extends Controller_jja
{
    private PrestamoProductoModel_jja $modelo_jja;

    public function __construct()
    {
        $this->modelo_jja = new PrestamoProductoModel_jja();
    }

    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        $payload = Middleware_jja::autenticar_jja();
        $seg0 = $segmentos_jja[0] ?? null; // 'usuario'
        $seg1 = $segmentos_jja[1] ?? null; // id

        if ($metodo_jja === 'GET' && $seg0 === 'usuario' && $seg1) {
            if (!$this->validarId_jja($seg1)) $this->responder_jja(false, null, 'ID invalido.', 400);
            // Si es usuario final (cliente), solo puede ver su propio id
            if (Middleware_jja::esRolUsuario($payload->rol) && (int)$payload->id !== (int)$seg1) {
                $this->responder_jja(false, null, 'No tienes permisos para ver estos préstamos.', 403);
            }
            $res = $this->modelo_jja->listarPorUsuario_jja((int)$seg1);
            $this->responder_jja(true, $res, 'Prestamos de productos del usuario.');
            return;
        }

        // POST /prestamos-productos/{id}/solicitud-devolucion
        if ($metodo_jja === 'POST' && $seg1 === 'solicitud-devolucion') {
            if (!$this->validarId_jja($seg0)) $this->responder_jja(false, null, 'ID invalido.', 400);
            $idPrest = (int)$seg0;
            $pp = $this->modelo_jja->buscarPorId_jja($idPrest);
            if (!$pp) $this->responder_jja(false, null, 'Préstamo no encontrado.', 404);
            if ((int)$pp['id_cliente_jja'] !== (int)$payload->id) $this->responder_jja(false, null, 'Solo el titular puede solicitar la devolución.', 403);
            $body = $this->obtenerBody_jja();
            $obs = $body['observaciones'] ?? null;
            $solModel = new SolicitudDevolucionProductoModel_jja();
            $sol = $solModel->crear_jja($idPrest, (int)$payload->id, $obs);
            // Notificar a la empresa
            $notModel = new NotificacionModel_jja();
            $mensaje = "El usuario solicita la devolución del préstamo de producto #{$idPrest}.";
            $notModel->crear_jja((int)$pp['id_empresa_jja'], 'informativo', $mensaje, $idPrest);
            $this->responder_jja(true, $sol, 'Solicitud de devolución creada.', 201);
            return;
        }

        $this->responder_jja(false, null, 'Ruta no encontrada.', 404);
    }
}
