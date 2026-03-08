<?php
// ============================================================
// models/TipoActivoModel_jja.php - Tipos de activos - JoAnJe Coders
// ============================================================

class TipoActivoModel_jja extends Model_jja
{
    public function listar_jja(): array
    {
        return $this->ejecutarSP_jja('SP_LEER_TIPOS_ACTIVOS_jja');
    }

    public function buscarPorId_jja(int $id_jja): ?array
    {
        return $this->ejecutarSPUno_jja('SP_LEER_TIPO_ACTIVO_ID_jja', [$id_jja]);
    }

    public function crear_jja(string $nombre_jja, ?string $descripcion_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_CREAR_TIPO_ACTIVO_jja', [$nombre_jja, $descripcion_jja]);
        return $res_jja ?? [];
    }

    public function actualizar_jja(int $id_jja, string $nombre_jja, ?string $descripcion_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_ACTUALIZAR_TIPO_ACTIVO_jja', [$id_jja, $nombre_jja, $descripcion_jja]);
        return $res_jja ?? [];
    }

    public function eliminar_jja(int $id_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_ELIMINAR_TIPO_ACTIVO_jja', [$id_jja]);
        return $res_jja ?? ['filas_afectadas' => 0];
    }
}
