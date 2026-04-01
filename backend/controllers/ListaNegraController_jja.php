<?php
// ============================================================
// controllers/ListaNegraController_jja.php
// Gestión de sanciones (Lista Negra) — JoAnJe Coders
//
// GET    /lista-negra                  <- admin/encargado: listar todas
// GET    /lista-negra/usuario/{id}     <- admin/encargado: sanciones de un usuario
// GET    /lista-negra/verificar        <- cualquier autenticado: verificar mi sanción
// POST   /lista-negra                  <- admin/encargado: crear sanción manual
// POST   /lista-negra/auto-sancionar   <- admin/encargado: ejecutar auto-sanción
// PATCH  /lista-negra/{id}/levantar    <- admin/encargado: levantar sanción
// ============================================================

class ListaNegraController_jja extends Controller_jja
{
    private ListaNegraModel_jja $modelo_jja;
    private NotificacionModel_jja $notificacionModelo_jja;

    public function __construct()
    {
        $this->modelo_jja = new ListaNegraModel_jja();
        $this->notificacionModelo_jja = new NotificacionModel_jja();
    }

    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        $payload_jja = Middleware_jja::autenticar_jja();
        $seg0_jja = $segmentos_jja[0] ?? null;
        $seg1_jja = $segmentos_jja[1] ?? null;

        switch ($metodo_jja) {
            case 'GET':
                // ── Verificar sanción propia (cualquier usuario autenticado) ──
                if ($seg0_jja === 'verificar') {
                    $idUsuario_jja = (int) $payload_jja->id;
                    $detalle_jja = $this->modelo_jja->verificarSancionDetalle_jja($idUsuario_jja);
                    $conteo_jja = $this->modelo_jja->verificarSancion_jja($idUsuario_jja);
                    $tieneSancion_jja = ($conteo_jja['tiene_sancion_activa'] ?? 0) > 0;
                    $this->responder_jja(true, [
                        'tiene_sancion_activa' => $tieneSancion_jja ? 1 : 0,
                        'motivo' => $detalle_jja['motivo_jja'] ?? null,
                        'fecha_inicio' => $detalle_jja['fecha_inicio_sancion_jja'] ?? null,
                        'fecha_fin' => $detalle_jja['fecha_fin_sancion_jja'] ?? null,
                    ], $tieneSancion_jja ? 'Usuario sancionado.' : 'Sin sanción activa.');
                    break;
                }

                // ── Listar sanciones (solo admin/encargado) ──
                Middleware_jja::autorizar_jja($payload_jja, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);
                if ($seg0_jja === 'usuario' && $this->validarId_jja($seg1_jja)) {
                    $this->responder_jja(true, $this->modelo_jja->listarPorUsuario_jja((int) $seg1_jja), 'Sanciones del usuario.');
                } else {
                    $this->responder_jja(true, $this->modelo_jja->listar_jja(), 'Lista negra completa.');
                }
                break;

            case 'POST':
                Middleware_jja::autorizar_jja($payload_jja, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);

                // ── Auto-sancionar préstamos vencidos ──
                if ($seg0_jja === 'auto-sancionar') {
                    $idAdmin_jja = (int) $payload_jja->id;
                    $res_jja = $this->modelo_jja->autoSancionarVencidos_jja($idAdmin_jja);
                    $cantidad_jja = $res_jja['sanciones_creadas_jja'] ?? 0;
                    $this->responder_jja(
                        true,
                        $res_jja,
                        $cantidad_jja > 0
                        ? "Se crearon {$cantidad_jja} sanción(es) automática(s)."
                        : 'No hay préstamos vencidos sin sanción.'
                    );
                    break;
                }

                // ── Crear sanción manual ──
                $body_jja = $this->obtenerBody_jja();
                $falta_jja = $this->campoFaltante_jja($body_jja, ['id_usuario', 'motivo']);
                if ($falta_jja)
                    $this->responder_jja(false, null, "El campo '{$falta_jja}' es obligatorio.", 400);
                if (strlen($body_jja['motivo']) > 255)
                    $this->responder_jja(false, null, 'El motivo no debe superar 255 caracteres.', 400);

                $idAdmin_jja = (int) $payload_jja->id;
                $diasSancion_jja = isset($body_jja['dias_sancion']) ? (int) $body_jja['dias_sancion'] : 0;

                $res_jja = $this->modelo_jja->crear_jja(
                    (int) $body_jja['id_usuario'],
                    trim($body_jja['motivo']),
                    $idAdmin_jja,
                    $diasSancion_jja
                );
                $this->responder_jja(true, $res_jja, 'Sanción registrada.', 201);
                break;

            case 'PATCH':
                Middleware_jja::autorizar_jja($payload_jja, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);
                if (!$this->validarId_jja($seg0_jja))
                    $this->responder_jja(false, null, 'ID inválido.', 400);
                if ($seg1_jja !== 'levantar')
                    $this->responder_jja(false, null, 'Sub-ruta no reconocida.', 404);

                // Obtener motivo de levantamiento opcional
                $body_jja = $this->obtenerBody_jja();
                $motivoLevantar_jja = isset($body_jja['motivo']) ? trim($body_jja['motivo']) : null;

                $res_levantar_jja = $this->modelo_jja->levantarSancion_jja((int) $seg0_jja, $motivoLevantar_jja);
                if (isset($res_levantar_jja['filas_afectadas']) && $res_levantar_jja['filas_afectadas'] == 0) {
                    $this->responder_jja(false, null, "La sanción con ID {$seg0_jja} no existe o ya se encuentra levantada.", 404);
                }

                // Notificar al usuario que su sanción fue levantada
                $idUsuarioNotif_jja = $res_levantar_jja['id_usuario_jja'] ?? null;
                if ($idUsuarioNotif_jja) {
                    $mensajeNotif_jja = '¡Buenas noticias! Su sanción ha sido levantada. Ya puede volver a solicitar préstamos de activos normalmente.';
                    if ($motivoLevantar_jja) {
                        $mensajeNotif_jja .= ' Motivo: ' . $motivoLevantar_jja;
                    }
                    $this->notificacionModelo_jja->crear_jja(
                        $idUsuarioNotif_jja,
                        'informativo',
                        $mensajeNotif_jja,
                        null,
                        'Sanción Levantada'
                    );
                }

                $this->responder_jja(true, null, 'Sanción levantada correctamente.');
                break;

            default:
                $this->responder_jja(false, null, 'Método HTTP no permitido.', 405);
        }
    }
}
