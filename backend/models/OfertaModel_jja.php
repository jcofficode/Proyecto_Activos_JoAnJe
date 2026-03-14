<?php
// ============================================================
// models/OfertaModel_jja.php - Ofertas/contrapropuestas
// ============================================================

class OfertaModel_jja extends Model_jja
{
    public function crear_jja(int $id_solicitud_jja, int $id_empresa_jja, float $precio_oferta_jja, ?string $mensaje_jja = null): array
    {
        $sql = "INSERT INTO ofertas_jja (id_solicitud_jja, id_empresa_jja, precio_oferta_jja, mensaje_jja)
                VALUES (:solicitud, :empresa, :precio, :mensaje)";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([
            ':solicitud' => $id_solicitud_jja,
            ':empresa'   => $id_empresa_jja,
            ':precio'    => number_format($precio_oferta_jja, 2, '.', ''),
            ':mensaje'   => $mensaje_jja,
        ]);
        $id = (int)$this->db_jja->lastInsertId();
        return $this->buscarPorId_jja($id) ?? ['id_oferta_jja' => $id];
    }

    public function buscarPorId_jja(int $id_jja): ?array
    {
        $sql = "SELECT o.*, s.id_producto_jja, p.nombre_jja AS producto_nombre, u.nombre_jja AS empresa_nombre
                FROM ofertas_jja o
                LEFT JOIN solicitudes_prestamo_jja s ON o.id_solicitud_jja = s.id_solicitud_jja
                LEFT JOIN productos_jja p ON s.id_producto_jja = p.id_producto_jja
                LEFT JOIN usuarios_jja u ON o.id_empresa_jja = u.id_usuario_jja
                WHERE o.id_oferta_jja = :id LIMIT 1";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([':id' => $id_jja]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function listarPorSolicitud_jja(int $id_solicitud_jja): array
    {
        $sql = "SELECT o.*, u.nombre_jja AS empresa_nombre
                FROM ofertas_jja o
                JOIN usuarios_jja u ON o.id_empresa_jja = u.id_usuario_jja
                WHERE o.id_solicitud_jja = :solicitud ORDER BY o.creado_en_jja DESC";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([':solicitud' => $id_solicitud_jja]);
        return $stmt->fetchAll();
    }
}
