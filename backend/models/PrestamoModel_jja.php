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
        return $this->ejecutarSP_jja('SP_LEER_PRESTAMOS_jja');
    }

    public function buscarPorId_jja(int $id_jja): ?array
    {
        return $this->ejecutarSPUno_jja('SP_LEER_PRESTAMO_ID_jja', [$id_jja]);
    }

    public function listarPorUsuario_jja(int $idUsuario_jja): array
    {
        return $this->ejecutarSP_jja('SP_LEER_PRESTAMOS_USUARIO_jja', [$idUsuario_jja]);
    }

    public function listarPorActivo_jja(int $idActivo_jja): array
    {
        // El SP original no soporta busqueda por ID de activo, asi que buscaremos historial de prestamos 
        // a traves de la tabla. Si hay un SP especifico en el futuro, se usara. 
        // Pero el que se llama SP_LEER_PRESTAMOS_ACTIVOS_jja no recibe parametros.
        return []; // placeholder
    }

    public function listarActivos_jja(): array
    {
        return $this->ejecutarSP_jja('SP_LEER_PRESTAMOS_ACTIVOS_jja');
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
}
