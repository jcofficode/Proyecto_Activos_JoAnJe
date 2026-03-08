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
}
