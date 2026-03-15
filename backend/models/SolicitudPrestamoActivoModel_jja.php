<?php
// ============================================================
// models/SolicitudPrestamoActivoModel_jja.php
// Solicitudes de préstamo para activos (clientes)
// ============================================================

class SolicitudPrestamoActivoModel_jja extends Model_jja
{
    public function crear_jja(int $id_activo_jja, int $id_cliente_jja, ?string $observaciones_jja = null): array
    {
        $sql = "INSERT INTO solicitudes_prestamo_activos_jja (id_activo_jja, id_cliente_jja, observaciones_jja)
                VALUES (:activo, :cliente, :obs)";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([
            ':activo' => $id_activo_jja,
            ':cliente' => $id_cliente_jja,
            ':obs' => $observaciones_jja
        ]);
        $id = (int)$this->db_jja->lastInsertId();
        return $this->buscarPorId_jja($id) ?? ['id_solicitud_activo_jja' => $id];
    }

    public function buscarPorId_jja(int $id_jja): ?array
    {
        $sql = "SELECT s.*, a.nombre_jja AS activo_nombre, u.nombre_jja AS cliente_nombre, u.correo_jja AS cliente_correo
                FROM solicitudes_prestamo_activos_jja s
                JOIN activos_jja a ON s.id_activo_jja = a.id_activo_jja
                JOIN usuarios_jja u ON s.id_cliente_jja = u.id_usuario_jja
                WHERE s.id_solicitud_activo_jja = :id LIMIT 1";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([':id' => $id_jja]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public function listarTodas_jja(): array
    {
        $sql = "SELECT s.*, a.nombre_jja AS activo_nombre, u.nombre_jja AS cliente_nombre, u.correo_jja AS cliente_correo
                FROM solicitudes_prestamo_activos_jja s
                JOIN activos_jja a ON s.id_activo_jja = a.id_activo_jja
                JOIN usuarios_jja u ON s.id_cliente_jja = u.id_usuario_jja
                ORDER BY s.fecha_solicitud_jja DESC";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function listarPorCliente_jja(int $id_cliente_jja): array
    {
        $sql = "SELECT s.*, a.nombre_jja AS activo_nombre, u.nombre_jja AS cliente_nombre, u.correo_jja AS cliente_correo
                FROM solicitudes_prestamo_activos_jja s
                JOIN activos_jja a ON s.id_activo_jja = a.id_activo_jja
                JOIN usuarios_jja u ON s.id_cliente_jja = u.id_usuario_jja
                WHERE s.id_cliente_jja = :cliente ORDER BY s.fecha_solicitud_jja DESC";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([':cliente' => $id_cliente_jja]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function actualizarEstado_jja(int $id_jja, string $estado_jja): array
    {
        $sql = "UPDATE solicitudes_prestamo_activos_jja SET estado_jja = :estado WHERE id_solicitud_activo_jja = :id";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([':estado' => $estado_jja, ':id' => $id_jja]);
        return ['filas_afectadas' => $stmt->rowCount()];
    }
}
