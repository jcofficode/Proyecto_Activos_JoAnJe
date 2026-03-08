<?php
// ============================================================
// models/PoliticaModel_jja.php - Politicas de prestamo - JoAnJe Coders
// ============================================================

class PoliticaModel_jja extends Model_jja
{
    public function listar_jja(): array
    {
        return $this->ejecutarSP_jja('SP_LEER_POLITICAS_jja');
    }

    public function buscarPorTipo_jja(int $idTipo_jja): ?array
    {
        return $this->ejecutarSPUno_jja('SP_LEER_POLITICA_TIPO_jja', [$idTipo_jja]);
    }

    public function crear_jja(int $idTipo_jja, int $diasMaximo_jja, int $maxSimultaneos_jja, bool $requiereMismoDia_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_CREAR_POLITICA_jja', [
            $idTipo_jja, $diasMaximo_jja, $maxSimultaneos_jja, (int)$requiereMismoDia_jja
        ]);
        return $res_jja ?? [];
    }

    public function actualizar_jja(int $id_jja, int $diasMaximo_jja, int $maxSimultaneos_jja, bool $requiereMismoDia_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_ACTUALIZAR_POLITICA_jja', [
            $id_jja, $diasMaximo_jja, $maxSimultaneos_jja, (int)$requiereMismoDia_jja
        ]);
        return $res_jja ?? [];
    }

    public function eliminar_jja(int $id_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_ELIMINAR_POLITICA_jja', [$id_jja]);
        return $res_jja ?? ['filas_afectadas' => 0];
    }
}
