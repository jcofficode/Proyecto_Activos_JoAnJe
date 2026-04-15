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

    public function buscarPorId_jja(int $id_jja): ?array
    {
        $sql_jja = "SELECT `id_politica_jja`, `id_tipo_jja`, `dias_maximo_jja`, `max_prestamos_simultaneos_jja`, `requiere_mismo_dia_jja` FROM `politicas_prestamo_jja` WHERE `id_politica_jja` = ? AND `estado_registro_jja` = 1";
        $stmt_jja = $this->db_jja->prepare($sql_jja);
        $stmt_jja->execute([$id_jja]);
        $res_jja = $stmt_jja->fetch();
        return $res_jja ?: null;
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
