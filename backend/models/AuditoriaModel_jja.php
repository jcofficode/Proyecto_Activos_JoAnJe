<?php
// ============================================================
// models/AuditoriaModel_jja.php - Log de auditoria - JoAnJe Coders
// ============================================================

class AuditoriaModel_jja extends Model_jja
{
    public function listar_jja(): array
    {
        return $this->ejecutarSP_jja('SP_LEER_AUDITORIA_jja');
    }

    public function listarPorTabla_jja(string $tabla_jja): array
    {
        return $this->ejecutarSP_jja('SP_LEER_AUDITORIA_TABLA_jja', [$tabla_jja]);
    }

    public function listarPorUsuario_jja(int $idUsuario_jja): array
    {
        return $this->ejecutarSP_jja('SP_LEER_AUDITORIA_USUARIO_jja', [$idUsuario_jja]);
    }

    /**
     * Registra una entrada de auditoría desde el controlador (con usuario real del JWT).
     */
    public function registrar_jja(
        string $tabla_jja,
        int    $idRegistro_jja,
        string $accion_jja,
        ?string $campo_jja = null,
        ?string $valorAnterior_jja = null,
        ?string $valorNuevo_jja = null,
        ?int    $idUsuario_jja = null,
        ?string $ip_jja = null,
        ?string $descripcion_jja = null
    ): void {
        $this->ejecutarSP_jja('SP_REGISTRAR_AUDITORIA_jja', [
            $tabla_jja,
            $idRegistro_jja,
            $accion_jja,
            $campo_jja,
            $valorAnterior_jja,
            $valorNuevo_jja,
            $idUsuario_jja,
            $ip_jja ?? ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'),
            $descripcion_jja,
        ]);
    }
}
