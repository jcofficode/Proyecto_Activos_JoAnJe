<?php
// ============================================================
// models/ReporteModel_jja.php - Reportes y estadisticas - JoAnJe Coders
// ============================================================

class ReporteModel_jja extends Model_jja
{
    /**
     * Reporte general de prestamos con filtros opcionales.
     * SP_REPORTE_PRESTAMOS_jja(fecha_inicio, fecha_fin, id_tipo, id_usuario)
     */
    public function reportePrestamos_jja(
        ?string $fechaInicio_jja,
        ?string $fechaFin_jja,
        ?int    $idTipo_jja,
        ?int    $idUsuario_jja
    ): array {
        return $this->ejecutarSP_jja('SP_REPORTE_PRESTAMOS_jja', [
            $fechaInicio_jja, $fechaFin_jja, $idTipo_jja, $idUsuario_jja
        ]);
    }

    /** Top 10 activos mas prestados. */
    public function activosMasPrestados_jja(): array
    {
        return $this->ejecutarSP_jja('SP_REPORTE_ACTIVOS_MAS_PRESTADOS_jja');
    }

    /** Top 10 usuarios mas activos. */
    public function usuariosActivos_jja(): array
    {
        return $this->ejecutarSP_jja('SP_REPORTE_USUARIOS_ACTIVOS_jja');
    }

    /** Tasa de devolucion oportuna (dashboard %). */
    public function tasaDevolucion_jja(): ?array
    {
        return $this->ejecutarSPUno_jja('SP_REPORTE_TASA_DEVOLUCION_jja');
    }
}
