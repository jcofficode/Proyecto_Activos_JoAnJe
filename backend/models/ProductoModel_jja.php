<?php
// ============================================================
// models/ProductoModel_jja.php - Modelo de productos marketplace
// ============================================================

class ProductoModel_jja extends Model_jja
{
    public function listar_jja(): array
    {
        $sql = "SELECT p.*, c.nombre_categoria_jja AS categoria, u.nombre_jja AS empresa_nombre, u.correo_jja AS empresa_correo
                FROM productos_jja p
                LEFT JOIN categorias_jja c ON p.id_categoria_jja = c.id_categoria_jja
                LEFT JOIN usuarios_jja u ON p.id_empresa_jja = u.id_usuario_jja
                WHERE p.estado_jja = 1";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function buscarPorId_jja(int $id_jja): ?array
    {
        $sql = "SELECT p.*, c.nombre_categoria_jja AS categoria, u.nombre_jja AS empresa_nombre, u.correo_jja AS empresa_correo
                FROM productos_jja p
                LEFT JOIN categorias_jja c ON p.id_categoria_jja = c.id_categoria_jja
                LEFT JOIN usuarios_jja u ON p.id_empresa_jja = u.id_usuario_jja
                WHERE p.id_producto_jja = :id LIMIT 1";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([':id' => $id_jja]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function crear_jja(array $data_jja): array
    {
        $sql = "INSERT INTO productos_jja (id_empresa_jja, id_categoria_jja, nombre_jja, descripcion_jja, precio_jja, stock_jja, imagenes_jja)
                VALUES (:empresa, :categoria, :nombre, :descripcion, :precio, :stock, :imagenes)";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([
            ':empresa'     => $data_jja['id_empresa_jja'],
            ':categoria'   => $data_jja['id_categoria_jja'] ?? null,
            ':nombre'      => $data_jja['nombre_jja'],
            ':descripcion' => $data_jja['descripcion_jja'] ?? null,
            ':precio'      => $data_jja['precio_jja'],
            ':stock'       => $data_jja['stock_jja'] ?? 0,
            ':imagenes'    => isset($data_jja['imagenes_jja']) ? json_encode($data_jja['imagenes_jja']) : null,
        ]);
        $id = (int)$this->db_jja->lastInsertId();
        return $this->buscarPorId_jja($id) ?? ['id_producto_jja' => $id];
    }

    public function actualizar_jja(int $id_jja, array $data_jja): ?array
    {
        $sql = "UPDATE productos_jja SET id_categoria_jja = :categoria, nombre_jja = :nombre, descripcion_jja = :descripcion,
                precio_jja = :precio, stock_jja = :stock, imagenes_jja = :imagenes, actualizado_en_jja = CURRENT_TIMESTAMP
                WHERE id_producto_jja = :id";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([
            ':categoria'   => $data_jja['id_categoria_jja'] ?? null,
            ':nombre'      => $data_jja['nombre_jja'],
            ':descripcion' => $data_jja['descripcion_jja'] ?? null,
            ':precio'      => $data_jja['precio_jja'],
            ':stock'       => $data_jja['stock_jja'] ?? 0,
            ':imagenes'    => isset($data_jja['imagenes_jja']) ? json_encode($data_jja['imagenes_jja']) : null,
            ':id'          => $id_jja,
        ]);
        return $this->buscarPorId_jja($id_jja);
    }

    public function disminuirStock_jja(int $id_jja, int $cantidad): bool
    {
        $sql = "UPDATE productos_jja SET stock_jja = GREATEST(stock_jja - :cantidad, 0) WHERE id_producto_jja = :id";
        $stmt = $this->db_jja->prepare($sql);
        return $stmt->execute([':cantidad' => $cantidad, ':id' => $id_jja]);
    }
}
