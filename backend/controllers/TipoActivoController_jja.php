<?php
// ============================================================
// controllers/TipoActivoController_jja.php
// GET /tipos-activos (todos autenticados) | CRUD solo ADMIN
// ============================================================

class TipoActivoController_jja extends Controller_jja
{
    private TipoActivoModel_jja $modelo_jja;

    public function __construct()
    {
        $this->modelo_jja = new TipoActivoModel_jja();
    }

    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        $payload_jja = Middleware_jja::autenticar_jja();
        $id_jja      = $segmentos_jja[0] ?? null;

        // Lectura permitida a todos los roles autenticados
        if ($metodo_jja !== 'GET') {
            Middleware_jja::autorizar_jja($payload_jja, [Middleware_jja::ROL_ADMIN]);
        }

        switch ($metodo_jja) {
            case 'GET':
                if ($id_jja) {
                    if (!$this->validarId_jja($id_jja)) $this->responder_jja(false, null, 'ID invalido.', 400);
                    $tipo_jja = $this->modelo_jja->buscarPorId_jja((int)$id_jja);
                    $tipo_jja
                        ? $this->responder_jja(true, $tipo_jja, 'Tipo de activo encontrado.')
                        : $this->responder_jja(false, null, 'Tipo de activo no encontrado.', 404);
                } else {
                    $this->responder_jja(true, $this->modelo_jja->listar_jja(), 'Tipos de activos.');
                }
                break;

            case 'POST':
                $body_jja  = $this->obtenerBody_jja();
                $falta_jja = $this->campoFaltante_jja($body_jja, ['nombre_tipo']);
                if ($falta_jja) $this->responder_jja(false, null, "El campo '{$falta_jja}' es obligatorio.", 400);
                if (strlen($body_jja['nombre_tipo']) > 80)
                    $this->responder_jja(false, null, 'El nombre no debe superar 80 caracteres.', 400);
                $res_jja = $this->modelo_jja->crear_jja(trim($body_jja['nombre_tipo']), $body_jja['descripcion'] ?? null);
                $this->responder_jja(true, $res_jja, 'Tipo de activo creado.', 201);
                break;

            case 'PUT':
                if (!$this->validarId_jja($id_jja)) $this->responder_jja(false, null, 'ID invalido.', 400);
                $body_jja  = $this->obtenerBody_jja();
                $falta_jja = $this->campoFaltante_jja($body_jja, ['nombre_tipo']);
                if ($falta_jja) $this->responder_jja(false, null, "El campo '{$falta_jja}' es obligatorio.", 400);
                $this->modelo_jja->actualizar_jja((int)$id_jja, trim($body_jja['nombre_tipo']), $body_jja['descripcion'] ?? null);
                $this->responder_jja(true, null, 'Tipo de activo actualizado.');
                break;

            case 'DELETE':
                if (!$this->validarId_jja($id_jja)) $this->responder_jja(false, null, 'ID invalido.', 400);
                $res_jja = $this->modelo_jja->eliminar_jja((int)$id_jja);
                ($res_jja['filas_afectadas'] ?? 0) < 1
                    ? $this->responder_jja(false, null, 'Tipo de activo no encontrado.', 404)
                    : $this->responder_jja(true, null, 'Tipo de activo eliminado.');
                break;

            default:
                $this->responder_jja(false, null, 'Metodo HTTP no permitido.', 405);
        }
    }
}
