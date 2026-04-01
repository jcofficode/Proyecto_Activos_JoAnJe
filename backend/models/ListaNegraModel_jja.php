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
     * SP_CREAR_SANCION_jja(p_id_usuario, p_id_prestamo, p_motivo, p_dias_sancion, p_admin)
     */
    public function crear_jja(int $idUsuario_jja, string $motivo_jja, int $idAdmin_jja, ?int $diasSancion_jja = 0): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_CREAR_SANCION_jja', [
            $idUsuario_jja,
            null,              // sin préstamo asociado (sanción manual)
            $motivo_jja,
            $diasSancion_jja,  // 0 = indefinida
            $idAdmin_jja
        ]);
        return $res_jja ?? [];
    }

    /**
     * Levantar (desactivar) una sanción, con motivo opcional
     */
    public function levantarSancion_jja(int $id_jja, ?string $motivo_jja = null): array
    {
        // Obtener id_usuario_jja antes de actualizar para poder notificar
        $sqlUsuario_jja = "SELECT `id_usuario_jja` FROM `lista_negra_jja` WHERE `id_sancion_jja` = ? AND `activa_jja` = 1 LIMIT 1";
        $stmtUsr_jja = $this->db_jja->prepare($sqlUsuario_jja);
        $stmtUsr_jja->execute([$id_jja]);
        $rowUsr_jja = $stmtUsr_jja->fetch();
        $idUsuarioSancionado_jja = $rowUsr_jja ? (int)$rowUsr_jja['id_usuario_jja'] : null;

        // Actualizar sanción: desactivar y registrar fecha fin
        $sql_jja = "UPDATE `lista_negra_jja` SET `activa_jja` = 0, `fecha_fin_sancion_jja` = NOW()";
        $params_jja = [];

        if ($motivo_jja) {
            // Append motivo levantamiento al motivo original
            $sql_jja .= ", `motivo_jja` = CONCAT(`motivo_jja`, ' | Levantada: ', ?)";
            $params_jja[] = $motivo_jja;
        }

        $sql_jja .= " WHERE `id_sancion_jja` = ? AND `activa_jja` = 1";
        $params_jja[] = $id_jja;

        $stmt_jja = $this->db_jja->prepare($sql_jja);
        $stmt_jja->execute($params_jja);
        $filas_jja = $stmt_jja->rowCount();

        return [
            'filas_afectadas' => $filas_jja,
            'id_usuario_jja' => $idUsuarioSancionado_jja
        ];
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
