<?php
// ============================================================
// controllers/RolController_jja.php - Solo ADMIN
// GET /roles | POST /roles | GET /roles/{id} | PUT /roles/{id} | DELETE /roles/{id}
// ============================================================

class RolController_jja extends Controller_jja
{
    private RolModel_jja $modelo_jja;

    public function __construct()
    {
        $this->modelo_jja = new RolModel_jja();
    }

    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        $payload_jja = Middleware_jja::autenticar_jja();
        Middleware_jja::autorizar_jja($payload_jja, [Middleware_jja::ROL_ADMIN]);
        $id_jja = $segmentos_jja[0] ?? null;

        switch ($metodo_jja) {
            case 'GET':
                if ($id_jja) {
                    if (!$this->validarId_jja($id_jja)) $this->responder_jja(false, null, 'ID invalido.', 400);
                    $rol_jja = $this->modelo_jja->buscarPorId_jja((int)$id_jja);
                    $rol_jja
                        ? $this->responder_jja(true, $rol_jja, 'Rol encontrado.')
                        : $this->responder_jja(false, null, "Rol con ID {$id_jja} no encontrado.", 404);
                } else {
                    $this->responder_jja(true, $this->modelo_jja->listar_jja(), 'Lista de roles.');
                }
                break;

            case 'POST':
                $body_jja = $this->obtenerBody_jja();
                $falta_jja = $this->campoFaltante_jja($body_jja, ['nombre_rol']);
                if ($falta_jja) $this->responder_jja(false, null, "El campo '{$falta_jja}' es obligatorio.", 400);
                if (strlen($body_jja['nombre_rol']) > 50)
                    $this->responder_jja(false, null, 'El nombre del rol no debe superar 50 caracteres.', 400);
                $res_jja = $this->modelo_jja->crear_jja(trim($body_jja['nombre_rol']), trim($body_jja['descripcion'] ?? ''));
                $this->responder_jja(true, $res_jja, 'Rol creado.', 201);
                break;

            case 'PUT':
                if (!$this->validarId_jja($id_jja)) $this->responder_jja(false, null, 'ID invalido.', 400);
                $body_jja  = $this->obtenerBody_jja();
                $falta_jja = $this->campoFaltante_jja($body_jja, ['nombre_rol']);
                if ($falta_jja) $this->responder_jja(false, null, "El campo '{$falta_jja}' es obligatorio.", 400);
                $this->modelo_jja->actualizar_jja((int)$id_jja, trim($body_jja['nombre_rol']), trim($body_jja['descripcion'] ?? ''));
                $this->responder_jja(true, null, 'Rol actualizado.');
                break;

            case 'DELETE':
                if (!$this->validarId_jja($id_jja)) $this->responder_jja(false, null, 'ID invalido.', 400);
                $res_jja = $this->modelo_jja->eliminar_jja((int)$id_jja);
                ($res_jja['filas_afectadas'] ?? 0) < 1
                    ? $this->responder_jja(false, null, "Rol con ID {$id_jja} no encontrado.", 404)
                    : $this->responder_jja(true, null, 'Rol eliminado.');
                break;

            default:
                $this->responder_jja(false, null, 'Metodo HTTP no permitido.', 405);
        }
    }
}
