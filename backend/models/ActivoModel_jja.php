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

    /** Actualiza el array JSON de 'imagenes_jja' (agrega una ruta). */
    public function actualizarImagenes_jja(int $id_jja, string $ruta_jja): array
    {
        $sql = "SELECT imagenes_jja FROM activos_jja WHERE id_activo_jja = :id AND estado_registro_jja = 1";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([':id' => $id_jja]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $imagenes = [];
        if ($row && !empty($row['imagenes_jja'])) {
            $decoded = json_decode($row['imagenes_jja'], true);
            if (is_array($decoded)) $imagenes = $decoded;
        }
        $imagenes[] = $ruta_jja;

        $sql2 = "UPDATE activos_jja SET imagenes_jja = :imagenes, actualizado_en_jja = CURRENT_TIMESTAMP WHERE id_activo_jja = :id";
        $stmt2 = $this->db_jja->prepare($sql2);
        $stmt2->execute([':imagenes' => json_encode($imagenes, JSON_UNESCAPED_UNICODE), ':id' => $id_jja]);
        return ['filas_afectadas' => $stmt2->rowCount()];
    }
}
