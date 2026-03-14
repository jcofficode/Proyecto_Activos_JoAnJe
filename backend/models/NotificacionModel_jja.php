<?php
// ============================================================
// models/NotificacionModel_jja.php - Notificaciones - JoAnJe Coders
// ============================================================

class NotificacionModel_jja extends Model_jja
{
    public function listarPorUsuario_jja(int $idUsuario_jja): array
    {
        return $this->ejecutarSP_jja('SP_LEER_NOTIFICACIONES_USUARIO_jja', [$idUsuario_jja]);
    }

    public function crear_jja(int $idUsuario_jja, string $tipo_jja, string $mensaje_jja, ?int $idPrestamo_jja = null, ?string $titulo_jja = null): array
    {
        // El SP espera: (p_id_usuario_jja, p_id_prestamo_jja, p_tipo_jja, p_titulo_jja, p_mensaje_jja)
        $titulo_jja = $titulo_jja ?? ucfirst(str_replace('_', ' ', $tipo_jja));
        $res_jja = $this->ejecutarSPUno_jja('SP_CREAR_NOTIFICACION_jja', [
            $idUsuario_jja,
            $idPrestamo_jja,
            $tipo_jja,
            $titulo_jja,
            $mensaje_jja
        ]);
        return $res_jja ?? [];
    }

    public function marcarLeida_jja(int $id_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_MARCAR_NOTIFICACION_LEIDA_jja', [$id_jja]);
        return $res_jja ?? [];
    }

    public function marcarTodasLeidas_jja(int $idUsuario_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_MARCAR_TODAS_LEIDAS_jja', [$idUsuario_jja]);
        return $res_jja ?? [];
    }

    public function eliminar_jja(int $id_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_ELIMINAR_NOTIFICACION_jja', [$id_jja]);
        return $res_jja ?? ['filas_afectadas' => 0];
    }
}
