<?php
// ============================================================
// models/TransaccionModel_jja.php - Transacciones (skeleton)
// ============================================================

class TransaccionModel_jja extends Model_jja
{
    public function crear_jja(int $id_solicitud_jja, int $id_cliente_jja, float $monto_jja, string $metodo_pago_jja = null, string $referencia_jja = null): array
    {
        $sql = "INSERT INTO transacciones_jja (id_solicitud_jja, id_cliente_jja, monto_jja, metodo_pago_jja, referencia_jja)
                VALUES (:solicitud, :cliente, :monto, :metodo, :ref)";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([
            ':solicitud' => $id_solicitud_jja,
            ':cliente'   => $id_cliente_jja,
            ':monto'     => number_format($monto_jja, 2, '.', ''),
            ':metodo'    => $metodo_pago_jja,
            ':ref'       => $referencia_jja,
        ]);
        $id = (int)$this->db_jja->lastInsertId();
        return $this->buscarPorId_jja($id) ?? ['id_transaccion_jja' => $id];
    }

    public function buscarPorId_jja(int $id_jja): ?array
    {
        $sql = "SELECT t.*, s.id_producto_jja, p.nombre_jja AS producto_nombre
                FROM transacciones_jja t
                LEFT JOIN solicitudes_prestamo_jja s ON t.id_solicitud_jja = s.id_solicitud_jja
                LEFT JOIN productos_jja p ON s.id_producto_jja = p.id_producto_jja
                WHERE t.id_transaccion_jja = :id LIMIT 1";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([':id' => $id_jja]);
        $row = $stmt->fetch();
        return $row ?: null;
    }
}
