<?php
// ============================================================
// models/SolicitudDevolucionModel_jja.php - Solicitudes de devolución
// ============================================================

class SolicitudDevolucionModel_jja extends Model_jja
{
    public function crear_jja(int $idPrestamo_jja, int $idUsuario_jja, ?string $observaciones_jja = null): array
    {
        $sql = "INSERT INTO solicitudes_devolucion_jja (id_prestamo_jja, id_usuario_solicitante_jja, observaciones_jja)
                VALUES (:prestamo, :usuario, :obs)";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([
            ':prestamo' => $idPrestamo_jja,
            ':usuario' => $idUsuario_jja,
            ':obs' => $observaciones_jja,
        ]);
        $id = (int)$this->db_jja->lastInsertId();
        return $this->buscarPorId_jja($id) ?? ['id_solicitud_devolucion_jja' => $id];
    }

    public function buscarPorId_jja(int $id_jja): ?array
    {
        $sql = "SELECT s.*, p.id_usuario_jja AS prestamo_usuario, p.id_encargado_jja AS prestamo_encargado,
                       a.nombre_jja AS activo_nombre, a.imagenes_jja AS activo_imagenes, p.id_activo_jja
                FROM solicitudes_devolucion_jja s
                JOIN prestamos_jja p ON s.id_prestamo_jja = p.id_prestamo_jja
                JOIN activos_jja a ON p.id_activo_jja = a.id_activo_jja
                WHERE s.id_solicitud_devolucion_jja = :id LIMIT 1";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([':id' => $id_jja]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function listarPendientes_jja(): array
    {
        $sql = "SELECT s.*, u.nombre_jja AS solicitante_nombre, p.id_usuario_jja AS prestamo_usuario,
                       a.nombre_jja AS activo_nombre, a.imagenes_jja AS activo_imagenes,
                       a.imagenes_jja,
                       u.imagen_jja AS solicitante_imagen, u.apellido_jja AS solicitante_apellido,
                       p.id_activo_jja
                FROM solicitudes_devolucion_jja s
                JOIN usuarios_jja u ON s.id_usuario_solicitante_jja = u.id_usuario_jja
                JOIN prestamos_jja p ON s.id_prestamo_jja = p.id_prestamo_jja
                JOIN activos_jja a ON p.id_activo_jja = a.id_activo_jja
                WHERE s.estado_jja = 'pendiente' ORDER BY s.creado_en_jja DESC";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function listarTodas_jja(): array
    {
        $sql = "SELECT s.*, u.nombre_jja AS solicitante_nombre, p.id_usuario_jja AS prestamo_usuario,
                       a.nombre_jja AS activo_nombre, a.imagenes_jja AS activo_imagenes,
                       a.imagenes_jja,
                       u.imagen_jja AS solicitante_imagen, u.apellido_jja AS solicitante_apellido,
                       p.id_activo_jja
                FROM solicitudes_devolucion_jja s
                JOIN usuarios_jja u ON s.id_usuario_solicitante_jja = u.id_usuario_jja
                JOIN prestamos_jja p ON s.id_prestamo_jja = p.id_prestamo_jja
                JOIN activos_jja a ON p.id_activo_jja = a.id_activo_jja
                ORDER BY s.creado_en_jja DESC";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function listarPorCliente_jja(int $idCliente_jja): array
    {
        $sql = "SELECT s.*, a.nombre_jja AS activo_nombre, a.imagenes_jja AS activo_imagenes, p.id_activo_jja
                FROM solicitudes_devolucion_jja s
                JOIN prestamos_jja p ON s.id_prestamo_jja = p.id_prestamo_jja
                JOIN activos_jja a ON p.id_activo_jja = a.id_activo_jja
                WHERE s.id_usuario_solicitante_jja = :id ORDER BY s.creado_en_jja DESC";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([':id' => $idCliente_jja]);
        return $stmt->fetchAll();
    }

    public function actualizarEstado_jja(int $id_jja, string $estado_jja, ?int $respondido_por_jja = null): bool
    {
        $sql = "UPDATE solicitudes_devolucion_jja SET estado_jja = :estado, fecha_respuesta_jja = CURRENT_TIMESTAMP, respondido_por_jja = :resp WHERE id_solicitud_devolucion_jja = :id";
        $stmt = $this->db_jja->prepare($sql);
        return $stmt->execute([':estado' => $estado_jja, ':resp' => $respondido_por_jja, ':id' => $id_jja]);
    }

    public function actualizarEstadoYObs_jja(int $id_jja, string $estado_jja, string $observaciones_jja, ?int $respondido_por_jja = null): bool
    {
        $sql = "UPDATE solicitudes_devolucion_jja SET estado_jja = :estado, observaciones_jja = :obs, fecha_respuesta_jja = CURRENT_TIMESTAMP, respondido_por_jja = :resp WHERE id_solicitud_devolucion_jja = :id";
        $stmt = $this->db_jja->prepare($sql);
        return $stmt->execute([':estado' => $estado_jja, ':obs' => $observaciones_jja, ':resp' => $respondido_por_jja, ':id' => $id_jja]);
    }
}
