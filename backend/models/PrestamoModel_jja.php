<?php
// ============================================================
// models/PrestamoModel_jja.php - Prestamos y devoluciones - JoAnJe Coders
// ============================================================

class PrestamoModel_jja extends Model_jja
{
    /**
     * Registra un nuevo prestamo (check-out).
     * SP_REGISTRAR_PRESTAMO_jja(id_activo, id_usuario, id_encargado, observaciones)
     * Retorna ['id_prestamo_jja', 'fecha_limite_jja', 'dias_prestamo_jja']
     */
    public function registrar_jja(
        int     $idActivo_jja,
        int     $idUsuario_jja,
        int     $idEncargado_jja,
        ?string $observaciones_jja
    ): array {
        $res_jja = $this->ejecutarSPUno_jja('SP_REGISTRAR_PRESTAMO_jja', [
            $idActivo_jja, $idUsuario_jja, $idEncargado_jja, $observaciones_jja
        ]);
        return $res_jja ?? [];
    }

    /**
     * Registra devolucion (check-in).
     * SP_REGISTRAR_DEVOLUCION_jja(id_prestamo, id_encargado, observaciones)
     */
    public function registrarDevolucion_jja(
        int     $idPrestamo_jja,
        int     $idEncargado_jja,
        ?string $observaciones_jja
    ): array {
        $res_jja = $this->ejecutarSPUno_jja('SP_REGISTRAR_DEVOLUCION_jja', [
            $idPrestamo_jja, $idEncargado_jja, $observaciones_jja
        ]);
        return $res_jja ?? [];
    }

    /** Lista todos los prestamos. */
    public function listar_jja(): array
    {
        $rows = $this->ejecutarSP_jja('SP_LEER_PRESTAMOS_jja');
        return $this->enriquecerConImagenes_jja($rows);
    }

    public function buscarPorId_jja(int $id_jja): ?array
    {
        return $this->ejecutarSPUno_jja('SP_LEER_PRESTAMO_ID_jja', [$id_jja]);
    }

    public function listarPorUsuario_jja(int $idUsuario_jja): array
    {
        $rows = $this->ejecutarSP_jja('SP_LEER_PRESTAMOS_USUARIO_jja', [$idUsuario_jja]);
        return $this->enriquecerConImagenes_jja($rows);
    }

    public function listarPorActivo_jja(int $idActivo_jja): array
    {
        return $this->ejecutarSP_jja('SP_LEER_PRESTAMOS_POR_ACTIVO_jja', [$idActivo_jja]);
    }

    public function listarActivos_jja(): array
    {
        $rows = $this->ejecutarSP_jja('SP_LEER_PRESTAMOS_ACTIVOS_jja');
        return $this->enriquecerConImagenes_jja($rows);
    }

    public function listarVencidos_jja(): array
    {
        return $this->ejecutarSP_jja('SP_LEER_PRESTAMOS_VENCIDOS_jja');
    }

    /**
     * Marca activo como perdido y sanciona al usuario.
     * SP_MARCAR_PRESTAMO_PERDIDO_jja(id_prestamo, id_encargado, motivo)
     */
    public function marcarPerdido_jja(int $idPrestamo_jja, int $idEncargado_jja, ?string $motivo_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_MARCAR_PRESTAMO_PERDIDO_jja', [
            $idPrestamo_jja, $idEncargado_jja, $motivo_jja
        ]);
        return $res_jja ?? [];
    }

    /** Actualiza en batch los prestamos vencidos (para cron). */
    public function actualizarVencidos_jja(): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_ACTUALIZAR_VENCIDOS_jja');
        return $res_jja ?? ['prestamos_actualizados' => 0];
    }

    /**
     * Enriquece prestamos con imagenes del activo y del usuario.
     * Lee imagenes_jja de activos_jja e imagen_jja de usuarios_jja.
     */
    private function enriquecerConImagenes_jja(array $rows): array
    {
        if (empty($rows)) return $rows;

        $stmtActivo = $this->db_jja->prepare(
            "SELECT imagenes_jja FROM activos_jja WHERE id_activo_jja = :id AND estado_registro_jja = 1"
        );
        $stmtUsuario = $this->db_jja->prepare(
            "SELECT imagen_jja FROM usuarios_jja WHERE id_usuario_jja = :id AND estado_registro_jja = 1"
        );

        foreach ($rows as &$r) {
            // Imagenes del activo
            try {
                $idActivo = $r['id_activo_jja'] ?? null;
                if ($idActivo) {
                    $stmtActivo->execute([':id' => $idActivo]);
                    $rowA = $stmtActivo->fetch(\PDO::FETCH_ASSOC);
                    if ($rowA && !empty($rowA['imagenes_jja'])) {
                        $decoded = json_decode($rowA['imagenes_jja'], true);
                        $r['imagenes_jja'] = is_array($decoded) ? $decoded : [$rowA['imagenes_jja']];
                    } else {
                        $r['imagenes_jja'] = [];
                    }
                } else {
                    $r['imagenes_jja'] = [];
                }
            } catch (\Throwable) {
                $r['imagenes_jja'] = [];
            }

            // Imagen del usuario
            try {
                $idUsuario = $r['id_usuario_jja'] ?? null;
                if ($idUsuario) {
                    $stmtUsuario->execute([':id' => $idUsuario]);
                    $rowU = $stmtUsuario->fetch(\PDO::FETCH_ASSOC);
                    $r['usuario_imagen'] = ($rowU && !empty($rowU['imagen_jja'])) ? $rowU['imagen_jja'] : null;
                } else {
                    $r['usuario_imagen'] = null;
                }
            } catch (\Throwable) {
                $r['usuario_imagen'] = null;
            }
        }

        return $rows;
    }
}
