<?php
// ============================================================
// controllers/NotificacionController_jja.php
// GET  /notificaciones/usuario/{id}
// PATCH /notificaciones/{id}/leer
// PATCH /notificaciones/usuario/{id}/leer-todas
// DELETE /notificaciones/{id}
// ============================================================

class NotificacionController_jja extends Controller_jja
{
    private NotificacionModel_jja $modelo_jja;

    public function __construct()
    {
        $this->modelo_jja = new NotificacionModel_jja();
    }

    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        $payload_jja = Middleware_jja::autenticar_jja();
        $seg0_jja    = $segmentos_jja[0] ?? null;   // 'usuario' | id
        $seg1_jja    = $segmentos_jja[1] ?? null;   // id | 'leer' | 'leer-todas'

        switch ($metodo_jja) {
            case 'GET':
                // GET /notificaciones
                if ($seg0_jja === null) {
                    $this->responder_jja(true, $this->modelo_jja->listarPorUsuario_jja((int)$payload_jja->id), 'Tus notificaciones.');
                } 
                // GET /notificaciones/usuario/{id}
                elseif ($seg0_jja === 'usuario' && $this->validarId_jja($seg1_jja)) {
                    $idUsu_jja = (int)$seg1_jja;
                    // Un usuario solo puede ver sus propias notificaciones
                    if ($payload_jja->rol === Middleware_jja::ROL_USUARIO && $payload_jja->id !== $idUsu_jja) {
                        $this->responder_jja(false, null, 'No tienes permiso para ver estas notificaciones.', 403);
                    }
                    $this->responder_jja(true, $this->modelo_jja->listarPorUsuario_jja($idUsu_jja), 'Notificaciones del usuario.');
                } else {
                    $this->responder_jja(false, null, 'Ruta invalida. Usa /notificaciones o /notificaciones/usuario/{id}', 400);
                }
                break;

            case 'PATCH':
                if ($seg0_jja === 'usuario' && $seg1_jja !== null && $segmentos_jja[2] ?? '' === 'leer-todas') {
                    // PATCH /notificaciones/usuario/{id}/leer-todas
                    if (!$this->validarId_jja($seg1_jja)) $this->responder_jja(false, null, 'ID invalido.', 400);
                    $this->modelo_jja->marcarTodasLeidas_jja((int)$seg1_jja);
                    $this->responder_jja(true, null, 'Todas las notificaciones marcadas como leidas.');
                } elseif ($this->validarId_jja($seg0_jja) && $seg1_jja === 'leer') {
                    // PATCH /notificaciones/{id}/leer
                    $this->modelo_jja->marcarLeida_jja((int)$seg0_jja);
                    $this->responder_jja(true, null, 'Notificacion marcada como leida.');
                } else {
                    $this->responder_jja(false, null, 'Ruta PATCH no reconocida.', 404);
                }
                break;

            case 'DELETE':
                Middleware_jja::autorizar_jja($payload_jja, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);
                if (!$this->validarId_jja($seg0_jja)) $this->responder_jja(false, null, 'ID invalido.', 400);
                $res_jja = $this->modelo_jja->eliminar_jja((int)$seg0_jja);
                ($res_jja['filas_afectadas'] ?? 0) < 1
                    ? $this->responder_jja(false, null, 'Notificacion no encontrada.', 404)
                    : $this->responder_jja(true, null, 'Notificacion eliminada.');
                break;

            default:
                $this->responder_jja(false, null, 'Metodo HTTP no permitido.', 405);
        }
    }
}
