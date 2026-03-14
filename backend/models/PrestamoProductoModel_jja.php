<?php
// ============================================================
// models/PrestamoProductoModel_jja.php - Prestamos generados desde marketplace
// ============================================================

class PrestamoProductoModel_jja extends Model_jja
{
    public function crear_jja(int $idProducto_jja, int $idCliente_jja, int $idEmpresa_jja, ?string $observaciones_jja = null): array
    {
        $sql = "INSERT INTO prestamos_productos_jja (id_producto_jja, id_cliente_jja, id_empresa_jja, observaciones_jja)
                VALUES (:producto, :cliente, :empresa, :obs)";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([
            ':producto' => $idProducto_jja,
            ':cliente'  => $idCliente_jja,
            ':empresa'  => $idEmpresa_jja,
            ':obs'      => $observaciones_jja,
        ]);
        $id = (int)$this->db_jja->lastInsertId();
        return $this->buscarPorId_jja($id) ?? ['id_prestamo_producto_jja' => $id];
    }

    public function buscarPorId_jja(int $id_jja): ?array
    {
        $sql = "SELECT pp.*, p.nombre_jja AS producto_nombre, u.nombre_jja AS cliente_nombre, e.nombre_jja AS empresa_nombre
                FROM prestamos_productos_jja pp
                JOIN productos_jja p ON pp.id_producto_jja = p.id_producto_jja
                JOIN usuarios_jja u ON pp.id_cliente_jja = u.id_usuario_jja
                JOIN usuarios_jja e ON pp.id_empresa_jja = e.id_usuario_jja
                WHERE pp.id_prestamo_producto_jja = :id LIMIT 1";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([':id' => $id_jja]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function listarPorUsuario_jja(int $idCliente_jja): array
    {
        $sql = "SELECT pp.*, p.nombre_jja AS producto_nombre, e.nombre_jja AS empresa_nombre
                FROM prestamos_productos_jja pp
                JOIN productos_jja p ON pp.id_producto_jja = p.id_producto_jja
                JOIN usuarios_jja e ON pp.id_empresa_jja = e.id_usuario_jja
                WHERE pp.id_cliente_jja = :cliente ORDER BY pp.fecha_prestamo_jja DESC";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([':cliente' => $idCliente_jja]);
        return $stmt->fetchAll();
    }
}
