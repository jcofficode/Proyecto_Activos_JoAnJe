<?php
// ============================================================
// models/SolicitudPrestamoModel_jja.php - Solicitudes marketplace
// ============================================================

class SolicitudPrestamoModel_jja extends Model_jja
{
    public function crear_jja(int $id_producto_jja, int $id_cliente_jja, int $cantidad_jja, ?string $observaciones_jja = null): array
    {
        $sql = "INSERT INTO solicitudes_prestamo_jja (id_producto_jja, id_cliente_jja, cantidad_jja, observaciones_jja)
                VALUES (:producto, :cliente, :cantidad, :obs)";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([
            ':producto' => $id_producto_jja,
            ':cliente' => $id_cliente_jja,
            ':cantidad' => $cantidad_jja,
            ':obs' => $observaciones_jja,
        ]);
        $id = (int)$this->db_jja->lastInsertId();
        return $this->buscarPorId_jja($id) ?? ['id_solicitud_jja' => $id];
    }

    public function buscarPorId_jja(int $id_jja): ?array
    {
        $sql = "SELECT s.*, p.nombre_jja AS producto_nombre, u.nombre_jja AS cliente_nombre, u.correo_jja AS cliente_correo
                FROM solicitudes_prestamo_jja s
                JOIN productos_jja p ON s.id_producto_jja = p.id_producto_jja
                JOIN usuarios_jja u ON s.id_cliente_jja = u.id_usuario_jja
                WHERE s.id_solicitud_jja = :id LIMIT 1";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([':id' => $id_jja]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function listarPorProducto_jja(int $id_producto_jja): array
    {
        $sql = "SELECT s.*, u.nombre_jja AS cliente_nombre, u.correo_jja AS cliente_correo
                FROM solicitudes_prestamo_jja s
                JOIN usuarios_jja u ON s.id_cliente_jja = u.id_usuario_jja
                WHERE s.id_producto_jja = :producto ORDER BY s.fecha_solicitud_jja DESC";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([':producto' => $id_producto_jja]);
        return $stmt->fetchAll();
    }

    public function listarPorCliente_jja(int $id_cliente_jja): array
    {
        $sql = "SELECT s.*, p.nombre_jja AS producto_nombre
                FROM solicitudes_prestamo_jja s
                JOIN productos_jja p ON s.id_producto_jja = p.id_producto_jja
                WHERE s.id_cliente_jja = :cliente ORDER BY s.fecha_solicitud_jja DESC";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([':cliente' => $id_cliente_jja]);
        return $stmt->fetchAll();
    }

    public function listarTodas_jja(): array
    {
        $sql = "SELECT s.*, p.nombre_jja AS producto_nombre, u.nombre_jja AS cliente_nombre, u.correo_jja AS cliente_correo
                FROM solicitudes_prestamo_jja s
                JOIN productos_jja p ON s.id_producto_jja = p.id_producto_jja
                JOIN usuarios_jja u ON s.id_cliente_jja = u.id_usuario_jja
                ORDER BY s.fecha_solicitud_jja DESC";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function actualizarEstado_jja(int $id_jja, string $estado_jja): bool
    {
        $sql = "UPDATE solicitudes_prestamo_jja SET estado_jja = :estado, fecha_respuesta_jja = CURRENT_TIMESTAMP WHERE id_solicitud_jja = :id";
        $stmt = $this->db_jja->prepare($sql);
        return $stmt->execute([':estado' => $estado_jja, ':id' => $id_jja]);
    }
}
