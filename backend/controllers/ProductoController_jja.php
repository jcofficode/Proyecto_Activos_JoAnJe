<?php
// ============================================================
// controllers/ProductoController_jja.php
// Rutas soportadas:
// GET /productos
// GET /productos/{id}
// POST /productos                (crear producto) [admin/encargado]
// POST /productos/{id}/solicitudes (crear solicitud por cliente)
// ============================================================

class ProductoController_jja extends Controller_jja
{
    private ProductoModel_jja $modelo_jja;
    private SolicitudPrestamoModel_jja $solModel_jja;

    public function __construct()
    {
        $this->modelo_jja = new ProductoModel_jja();
        $this->solModel_jja = new SolicitudPrestamoModel_jja();
    }

    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        $seg0 = $segmentos_jja[0] ?? null; // id or null
        $seg1 = $segmentos_jja[1] ?? null; // 'solicitudes'

        switch ($metodo_jja) {
            case 'GET':
                if ($seg0 !== null) {
                    if (!$this->validarId_jja($seg0)) $this->responder_jja(false, null, 'ID invalido.', 400);
                    $this->mostrar_jja((int)$seg0);
                } else {
                    $this->responder_jja(true, $this->modelo_jja->listar_jja(), 'Listado de productos.');
                }
                break;

            case 'POST':
                $payload = Middleware_jja::autenticar_jja();
                // Crear producto
                if ($seg0 === null) {
                    Middleware_jja::autorizar_jja($payload, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);
                    $this->crear_jja($payload);
                    return;
                }

                // POST /productos/{id}/solicitudes
                if ($seg1 === 'solicitudes') {
                    // cualquier usuario autenticado puede solicitar (incluye admin en dev)
                    $this->crearSolicitud_jja((int)$seg0, $payload);
                    return;
                }

                $this->responder_jja(false, null, 'Ruta no encontrada.', 404);
                break;

            default:
                $this->responder_jja(false, null, 'Metodo HTTP no permitido.', 405);
        }
    }

    private function mostrar_jja(int $id_jja): void
    {
        $prod = $this->modelo_jja->buscarPorId_jja($id_jja);
        $prod ? $this->responder_jja(true, $prod, 'Producto encontrado.')
              : $this->responder_jja(false, null, 'Producto no encontrado.', 404);
    }

    private function crear_jja(object $payload_jja): void
    {
        $body = $this->obtenerBody_jja();
        $falta = $this->campoFaltante_jja($body, ['nombre', 'precio']);
        if ($falta) $this->responder_jja(false, null, "El campo '{$falta}' es obligatorio.", 400);

        // empresa por defecto: el usuario autenticado (payload)
        $id_empresa = $payload_jja->id ?? null;
        if (!$id_empresa) $this->responder_jja(false, null, 'Id de empresa no disponible en token.', 400);

        $data = [
            'id_empresa_jja'   => $id_empresa,
            'id_categoria_jja' => isset($body['id_categoria']) ? (int)$body['id_categoria'] : null,
            'nombre_jja'       => trim($body['nombre']),
            'descripcion_jja'  => $body['descripcion'] ?? null,
            'precio_jja'       => number_format((float)$body['precio'], 2, '.', ''),
            'stock_jja'        => isset($body['stock']) ? (int)$body['stock'] : 0,
            'imagenes_jja'     => $body['imagenes'] ?? null,
        ];

        try {
            $res = $this->modelo_jja->crear_jja($data);
        } catch (PDOException $e) {
            $this->responder_jja(false, null, 'Error al crear el producto: ' . $e->getMessage(), 500);
        }

        $this->responder_jja(true, $res, 'Producto creado.', 201);
    }

    private function crearSolicitud_jja(int $id_producto_jja, object $payload_jja): void
    {
        $body = $this->obtenerBody_jja();
        $cantidad = isset($body['cantidad']) ? (int)$body['cantidad'] : 1;
        if ($cantidad < 1) $this->responder_jja(false, null, 'La cantidad debe ser mayor o igual a 1.', 400);

        $id_cliente = $payload_jja->id ?? null;
        if (!$id_cliente) $this->responder_jja(false, null, 'Id de cliente no disponible en token.', 400);

        // Verificar producto existe
        $producto = $this->modelo_jja->buscarPorId_jja($id_producto_jja);
        if (!$producto) $this->responder_jja(false, null, 'Producto no encontrado.', 404);

        try {
            $sol = $this->solModel_jja->crear_jja($id_producto_jja, $id_cliente, $cantidad, $body['observaciones'] ?? null);
        } catch (PDOException $e) {
            $this->responder_jja(false, null, 'Error al crear la solicitud: ' . $e->getMessage(), 500);
        }

        $this->responder_jja(true, $sol, 'Solicitud creada.', 201);
    }
}
