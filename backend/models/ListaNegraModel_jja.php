<?php
// ============================================================
// models/ListaNegraModel_jja.php - Sanciones de usuarios - JoAnJe Coders
// ============================================================

class ListaNegraModel_jja extends Model_jja
{
    /**
     * Listar todas las sanciones (admin/encargado)
     */
    public function listar_jja(): array
    {
        return $this->ejecutarSP_jja('SP_LEER_SANCIONES_jja');
    }

    /**
     * Listar sanciones de un usuario específico
     */
    public function listarPorUsuario_jja(int $idUsuario_jja): array
    {
        return $this->ejecutarSP_jja('SP_LEER_SANCIONES_USUARIO_jja', [$idUsuario_jja]);
    }

    /**
     * Crear una sanción manualmente (admin/encargado)
     */
    public function crear_jja(int $idUsuario_jja, string $motivo_jja, ?string $fechaFin_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_CREAR_SANCION_jja', [
            $idUsuario_jja, $motivo_jja, $fechaFin_jja
        ]);
        return $res_jja ?? [];
    }

    /**
     * Levantar (desactivar) una sanción
     */
    public function levantarSancion_jja(int $id_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_LEVANTAR_SANCION_jja', [$id_jja]);
        return $res_jja ?? ['filas_afectadas' => 0];
    }

    /**
     * Verificar si un usuario tiene sanción activa (retorna conteo)
     */
    public function verificarSancion_jja(int $idUsuario_jja): ?array
    {
        return $this->ejecutarSPUno_jja('SP_VERIFICAR_SANCION_jja', [$idUsuario_jja]);
    }

    /**
     * Verificar sanción con detalle completo (motivo, fechas)
     * Usado para mostrar el modal rojo al cliente sancionado
     */
    public function verificarSancionDetalle_jja(int $idUsuario_jja): ?array
    {
        return $this->ejecutarSPUno_jja('SP_VERIFICAR_SANCION_DETALLE_jja', [$idUsuario_jja]);
    }

    /**
     * Ejecutar auto-sanción de todos los préstamos vencidos
     * Marca vencidos y crea sanciones automáticas
     */
    public function autoSancionarVencidos_jja(int $idAdmin_jja): ?array
    {
        return $this->ejecutarSPUno_jja('SP_AUTO_SANCIONAR_VENCIDOS_jja', [$idAdmin_jja]);
    }
}
