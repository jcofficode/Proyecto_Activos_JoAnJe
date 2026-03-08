<?php
// ============================================================
// models/RolModel_jja.php - Roles del sistema - JoAnJe Coders
// ============================================================

class RolModel_jja extends Model_jja
{
    public function listar_jja(): array
    {
        return $this->ejecutarSP_jja('SP_LEER_ROLES_jja');
    }

    public function buscarPorId_jja(int $id_jja): ?array
    {
        return $this->ejecutarSPUno_jja('SP_LEER_ROL_ID_jja', [$id_jja]);
    }

    public function crear_jja(string $nombre_jja, string $descripcion_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_CREAR_ROL_jja', [$nombre_jja, $descripcion_jja]);
        return $res_jja ?? [];
    }

    public function actualizar_jja(int $id_jja, string $nombre_jja, string $descripcion_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_ACTUALIZAR_ROL_jja', [$id_jja, $nombre_jja, $descripcion_jja]);
        return $res_jja ?? [];
    }

    public function eliminar_jja(int $id_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_ELIMINAR_ROL_jja', [$id_jja]);
        return $res_jja ?? ['filas_afectadas' => 0];
    }
}
