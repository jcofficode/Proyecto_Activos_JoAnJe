<?php
// ============================================================
// models/ActivoModel_jja.php - Inventario de activos - JoAnJe Coders
// ============================================================

class ActivoModel_jja extends Model_jja
{
    public function listar_jja(): array
    {
        return $this->ejecutarSP_jja('SP_LEER_ACTIVOS_jja');
    }

    public function buscarPorId_jja(int $id_jja): ?array
    {
        return $this->ejecutarSPUno_jja('SP_LEER_ACTIVO_ID_jja', [$id_jja]);
    }

    /** Busqueda por codigo QR (usado al escanear desde web/movil). */
    public function buscarPorQR_jja(string $codigoQR_jja): ?array
    {
        return $this->ejecutarSPUno_jja('SP_LEER_ACTIVO_QR_jja', [$codigoQR_jja]);
    }

    /** Busqueda por codigo NFC (usado desde app movil). */
    public function buscarPorNFC_jja(string $codigoNFC_jja): ?array
    {
        return $this->ejecutarSPUno_jja('SP_LEER_ACTIVO_NFC_jja', [$codigoNFC_jja]);
    }

    /**
     * Registra un nuevo activo.
     * SP_CREAR_ACTIVO_jja(nombre, qr, nfc, id_tipo, ubicacion, descripcion)
     */
    public function crear_jja(
        string  $nombre_jja,
        string  $codigoQR_jja,
        ?string $codigoNFC_jja,
        int     $idTipo_jja,
        ?string $ubicacion_jja,
        ?string $descripcion_jja
    ): array {
        $res_jja = $this->ejecutarSPUno_jja('SP_CREAR_ACTIVO_jja', [
            $nombre_jja, $codigoQR_jja, $codigoNFC_jja,
            $idTipo_jja, $ubicacion_jja, $descripcion_jja
        ]);
        return $res_jja ?? [];
    }

    public function actualizar_jja(
        int     $id_jja,
        string  $nombre_jja,
        ?string $codigoNFC_jja,
        int     $idTipo_jja,
        ?string $ubicacion_jja,
        ?string $descripcion_jja
    ): array {
        $res_jja = $this->ejecutarSPUno_jja('SP_ACTUALIZAR_ACTIVO_jja', [
            $id_jja, $nombre_jja, $codigoNFC_jja, $idTipo_jja, $ubicacion_jja, $descripcion_jja
        ]);
        return $res_jja ?? [];
    }

    /**
     * Cambia solo el estado del activo (disponible/en_reparacion/perdido).
     * SP_ACTUALIZAR_ESTADO_ACTIVO_jja(id, nuevo_estado)
     */
    public function actualizarEstado_jja(int $id_jja, string $estado_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_ACTUALIZAR_ESTADO_ACTIVO_jja', [$id_jja, $estado_jja]);
        return $res_jja ?? [];
    }

    public function eliminar_jja(int $id_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_ELIMINAR_ACTIVO_jja', [$id_jja]);
        return $res_jja ?? ['filas_afectadas' => 0];
    }
}
