<?php
// ============================================================
// models/SolicitudDevolucionProductoModel_jja.php
// ============================================================

class SolicitudDevolucionProductoModel_jja extends Model_jja
{
    public function crear_jja(int $idPrestamoProducto_jja, int $idUsuario_jja, ?string $observaciones_jja = null): array
    {
        $sql = "INSERT INTO solicitudes_devolucion_productos_jja (id_prestamo_producto_jja, id_usuario_solicitante_jja, observaciones_jja)
                VALUES (:prestamo, :usuario, :obs)";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([
            ':prestamo' => $idPrestamoProducto_jja,
            ':usuario'  => $idUsuario_jja,
            ':obs'      => $observaciones_jja,
        ]);
        $id = (int)$this->db_jja->lastInsertId();
        return $this->buscarPorId_jja($id) ?? ['id_solicitud_devolucion_producto_jja' => $id];
    }

    public function buscarPorId_jja(int $id_jja): ?array
    {
        $sql = "SELECT s.*, pp.id_cliente_jja AS prestamo_cliente, pp.id_producto_jja
                FROM solicitudes_devolucion_productos_jja s
                JOIN prestamos_productos_jja pp ON s.id_prestamo_producto_jja = pp.id_prestamo_producto_jja
                WHERE s.id_solicitud_devolucion_producto_jja = :id LIMIT 1";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([':id' => $id_jja]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function actualizarEstado_jja(int $id_jja, string $estado_jja, ?int $respondido_por_jja = null): bool
    {
        $sql = "UPDATE solicitudes_devolucion_productos_jja SET estado_jja = :estado, fecha_respuesta_jja = CURRENT_TIMESTAMP, respondido_por_jja = :resp WHERE id_solicitud_devolucion_producto_jja = :id";
        $stmt = $this->db_jja->prepare($sql);
        return $stmt->execute([':estado' => $estado_jja, ':resp' => $respondido_por_jja, ':id' => $id_jja]);
    }

    public function listarTodas_jja(): array
    {
        $sql = "SELECT s.*, pp.id_prestamo_producto_jja AS prestamo_id, p.nombre_jja AS producto_nombre, u.nombre_jja AS solicitante_nombre
                FROM solicitudes_devolucion_productos_jja s
                JOIN prestamos_productos_jja pp ON s.id_prestamo_producto_jja = pp.id_prestamo_producto_jja
                JOIN productos_jja p ON pp.id_producto_jja = p.id_producto_jja
                JOIN usuarios_jja u ON s.id_usuario_solicitante_jja = u.id_usuario_jja
                ORDER BY s.creado_en_jja DESC";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function beginTransaction_jja(): bool
    {
        return $this->db_jja->beginTransaction();
    }

    public function commit_jja(): bool
    {
        return $this->db_jja->commit();
    }

    public function rollBack_jja(): bool
    {
        return $this->db_jja->rollBack();
    }

    public function marcarPrestamoDevuelto_jja(int $idPrestamo): bool
    {
        $sql = "UPDATE prestamos_productos_jja SET estado_jja = 'devuelto', fecha_devolucion_jja = CURRENT_TIMESTAMP WHERE id_prestamo_producto_jja = :id";
        $stmt = $this->db_jja->prepare($sql);
        return $stmt->execute([':id' => $idPrestamo]);
    }
}
