<?php
// ============================================================
// models/ActivoModel_jja.php - Inventario de activos - JoAnJe Coders
// ============================================================

class ActivoModel_jja extends Model_jja
{
    public function listar_jja(): array
    {
        $filas_jja = $this->ejecutarSP_jja('SP_LEER_ACTIVOS_jja');
        if (empty($filas_jja)) return [];
        $this->decodificarJsonCampo_jja($filas_jja, 'imagenes_jja');
        return $filas_jja;
    }

    /** Publica o despublica un activo (0/1). */
    public function publicar_jja(int $id_jja, int $valor_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_PUBLICAR_ACTIVO_jja', [$id_jja, $valor_jja ? 1 : 0]);
        return $res_jja ?? ['filas_afectadas' => 0];
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
            $id_jja,
            $nombre_jja,
            $codigoNFC_jja,
            $idTipo_jja,
            $ubicacion_jja,
            $descripcion_jja
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

    /**
     * Agrega una nueva URL al array JSON de imagenes_jja del activo.
     * El SP maneja JSON_ARRAY_APPEND internamente.
     */
    public function guardarImagenes_jja(int $id_jja, string $ruta_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_GUARDAR_IMAGENES_ACTIVO_jja', [$id_jja, $ruta_jja]);
        return $res_jja ?? ['filas_afectadas' => 0];
    }
}
