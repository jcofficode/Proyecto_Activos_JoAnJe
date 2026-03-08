<?php
// ============================================================
// controllers/AuditoriaController_jja.php - Solo ADMIN
// GET /auditoria | GET /auditoria/tabla/{nombre} | GET /auditoria/usuario/{id}
// ============================================================

class AuditoriaController_jja extends Controller_jja
{
    private AuditoriaModel_jja $modelo_jja;

    public function __construct()
    {
        $this->modelo_jja = new AuditoriaModel_jja();
    }

    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        $payload_jja = Middleware_jja::autenticar_jja();
        Middleware_jja::autorizar_jja($payload_jja, [Middleware_jja::ROL_ADMIN]);

        if ($metodo_jja !== 'GET') {
            $this->responder_jja(false, null, 'Metodo HTTP no permitido.', 405);
        }

        $seg0_jja = $segmentos_jja[0] ?? null;
        $seg1_jja = $segmentos_jja[1] ?? null;

        if ($seg0_jja === 'tabla' && $seg1_jja) {
            $this->responder_jja(true, $this->modelo_jja->listarPorTabla_jja(urldecode($seg1_jja)), "Auditoria de tabla: {$seg1_jja}");
        } elseif ($seg0_jja === 'usuario' && $this->validarId_jja($seg1_jja)) {
            $this->responder_jja(true, $this->modelo_jja->listarPorUsuario_jja((int)$seg1_jja), 'Auditoria del usuario.');
        } else {
            $this->responder_jja(true, $this->modelo_jja->listar_jja(), 'Log de auditoria completo.');
        }
    }
}
