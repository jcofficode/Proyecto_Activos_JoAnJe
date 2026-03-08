<?php
// ============================================================
// models/ListaNegraModel_jja.php - Sanciones de usuarios - JoAnJe Coders
// ============================================================

class ListaNegraModel_jja extends Model_jja
{
    public function listar_jja(): array
    {
        return $this->ejecutarSP_jja('SP_LEER_SANCIONES_jja');
    }

    public function listarPorUsuario_jja(int $idUsuario_jja): array
    {
        return $this->ejecutarSP_jja('SP_LEER_SANCIONES_USUARIO_jja', [$idUsuario_jja]);
    }

    public function crear_jja(int $idUsuario_jja, string $motivo_jja, ?string $fechaFin_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_CREAR_SANCION_jja', [
            $idUsuario_jja, $motivo_jja, $fechaFin_jja
        ]);
        return $res_jja ?? [];
    }

    public function levantarSancion_jja(int $id_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_LEVANTAR_SANCION_jja', [$id_jja]);
        return $res_jja ?? ['filas_afectadas' => 0];
    }

    public function verificarSancion_jja(int $idUsuario_jja): ?array
    {
        return $this->ejecutarSPUno_jja('SP_VERIFICAR_SANCION_jja', [$idUsuario_jja]);
    }
}
