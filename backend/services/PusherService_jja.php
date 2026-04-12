<?php
// ============================================================
// services/PusherService_jja.php — Integración Pusher
// Emite eventos en tiempo real a clientes web/móvil.
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================

class PusherService_jja
{
    private \Pusher\Pusher $pusher_jja;

    public function __construct()
    {
        $this->pusher_jja = new \Pusher\Pusher(
            $_ENV['PUSHER_APP_KEY'],
            $_ENV['PUSHER_APP_SECRET'],
            $_ENV['PUSHER_APP_ID'],
            [
                'cluster' => $_ENV['PUSHER_APP_CLUSTER'],
                'useTLS'  => true,
            ]
        );
    }

    /**
     * Emite un evento en el canal indicado.
     *
     * @param string $canal_jja  Nombre del canal Pusher
     * @param string $evento_jja Nombre del evento
     * @param array  $datos_jja  Payload serializable a JSON
     */
    public function emitir_jja(string $canal_jja, string $evento_jja, array $datos_jja): void
    {
        $this->pusher_jja->trigger($canal_jja, $evento_jja, $datos_jja);
    }
}
