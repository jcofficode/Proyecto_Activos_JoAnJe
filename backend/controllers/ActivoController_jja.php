<?php
// ============================================================
// controllers/ActivoController_jja.php
// GET /activos | GET /activos/{id} | GET /activos/qr/{codigo}
// GET /activos/nfc/{codigo} | POST /activos | PUT /activos/{id}
// PATCH /activos/{id}/estado | DELETE /activos/{id}
// ============================================================

class ActivoController_jja extends Controller_jja
{
    private ActivoModel_jja $modelo_jja;

    // Estados validos del activo
    private const ESTADOS_VALIDOS = ['disponible', 'en_proceso_prestamo', 'en_reparacion', 'perdido'];

    public function __construct()
    {
        $this->modelo_jja = new ActivoModel_jja();
    }

    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        $payload_jja = Middleware_jja::autenticar_jja();
        $seg0_jja    = $segmentos_jja[0] ?? null;  // 'qr' | 'nfc' | id
        $seg1_jja    = $segmentos_jja[1] ?? null;  // codigo QR/NFC | 'estado'

        switch ($metodo_jja) {
            case 'GET':
                if ($seg0_jja === 'qr') {
                    $this->buscarPorQR_jja($seg1_jja ?? '');
                } elseif ($seg0_jja === 'nfc') {
                    $this->buscarPorNFC_jja($seg1_jja ?? '');
                } elseif ($seg0_jja !== null) {
                    if (!$this->validarId_jja($seg0_jja)) $this->responder_jja(false, null, 'ID de activo invalido.', 400);
                    $this->mostrar_jja((int)$seg0_jja);
                } else {
                    $this->responder_jja(true, $this->modelo_jja->listar_jja(), 'Inventario de activos.');
                }
                break;

            case 'POST':
                // Soportar POST /activos/{id}/imagen para subir imagen del activo
                if ($seg1_jja === 'imagen' && $seg0_jja !== null) {
                    if (!$this->validarId_jja($seg0_jja)) $this->responder_jja(false, null, 'ID de activo invalido.', 400);
                    $this->subirImagen_jja((int)$seg0_jja);
                    break;
                }

                // Crear activo (solo admin/encargado)
                if ($seg1_jja === null) {
                    Middleware_jja::autorizar_jja($payload_jja, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);
                    $this->crear_jja();
                    break;
                }

                // POST /activos/{id}/solicitudes => permitir a usuarios autenticados solicitar préstamo
                if ($seg1_jja === 'solicitudes' && $seg0_jja !== null) {
                    // cualquier usuario autenticado puede solicitar
                    $this->crearSolicitudActivo_jja((int)$seg0_jja, $payload_jja);
                    break;
                }
                break;

            case 'PUT':
                Middleware_jja::autorizar_jja($payload_jja, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);
                if (!$this->validarId_jja($seg0_jja)) $this->responder_jja(false, null, 'ID de activo invalido.', 400);
                $this->actualizar_jja((int)$seg0_jja);
                break;

            case 'PATCH':
                // PATCH /activos/{id}/estado  OR  PATCH /activos/{id}/publicar
                Middleware_jja::autorizar_jja($payload_jja, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);
                if (!$this->validarId_jja($seg0_jja)) $this->responder_jja(false, null, 'ID de activo invalido.', 400);
                if ($seg1_jja === 'estado') {
                    $this->actualizarEstado_jja((int)$seg0_jja);
                } elseif ($seg1_jja === 'publicar') {
                    $this->publicar_jja((int)$seg0_jja);
                } else {
                    $this->responder_jja(false, null, 'Sub-ruta no reconocida. Usa /activos/{id}/estado o /activos/{id}/publicar', 404);
                }
                break;

            case 'DELETE':
                Middleware_jja::autorizar_jja($payload_jja, [Middleware_jja::ROL_ADMIN]);
                if (!$this->validarId_jja($seg0_jja)) $this->responder_jja(false, null, 'ID de activo invalido.', 400);
                $this->eliminar_jja((int)$seg0_jja);
                break;

            default:
                $this->responder_jja(false, null, 'Metodo HTTP no permitido.', 405);
        }
    }

    private function mostrar_jja(int $id_jja): void
    {
        $activo_jja = $this->modelo_jja->buscarPorId_jja($id_jja);
        $activo_jja
            ? $this->responder_jja(true, $activo_jja, 'Activo encontrado.')
            : $this->responder_jja(false, null, "Activo con ID {$id_jja} no encontrado.", 404);
    }

    private function buscarPorQR_jja(string $codigo_jja): void
    {
        $codigo_jja = trim($codigo_jja);
        if (empty($codigo_jja) || strlen($codigo_jja) > 100) {
            $this->responder_jja(false, null, 'Codigo QR invalido (max 100 caracteres).', 400);
        }
        $activo_jja = $this->modelo_jja->buscarPorQR_jja($codigo_jja);
        $activo_jja
            ? $this->responder_jja(true, $activo_jja, 'Activo encontrado por QR.')
            : $this->responder_jja(false, null, "No se encontro ningun activo con QR: {$codigo_jja}", 404);
    }

    private function buscarPorNFC_jja(string $codigo_jja): void
    {
        $codigo_jja = trim($codigo_jja);
        if (empty($codigo_jja) || strlen($codigo_jja) > 100) {
            $this->responder_jja(false, null, 'Codigo NFC invalido (max 100 caracteres).', 400);
        }
        $activo_jja = $this->modelo_jja->buscarPorNFC_jja($codigo_jja);
        $activo_jja
            ? $this->responder_jja(true, $activo_jja, 'Activo encontrado por NFC.')
            : $this->responder_jja(false, null, "No se encontro ningun activo con NFC: {$codigo_jja}", 404);
    }

    private function crear_jja(): void
    {
        $body_jja  = $this->obtenerBody_jja();
        $falta_jja = $this->campoFaltante_jja($body_jja, ['nombre', 'id_tipo']);
        if ($falta_jja) $this->responder_jja(false, null, "El campo '{$falta_jja}' es obligatorio.", 400);

        if (strlen(trim($body_jja['nombre'])) > 150) $this->responder_jja(false, null, 'El nombre no debe superar 150 caracteres.', 400);
        if (!is_numeric($body_jja['id_tipo']) || (int)$body_jja['id_tipo'] < 1)
            $this->responder_jja(false, null, 'El campo id_tipo debe ser un entero positivo.', 400);

        // Generar codigo QR si no fue provisto por el cliente
        $codigo_qr = isset($body_jja['codigo_qr']) && trim($body_jja['codigo_qr']) !== ''
            ? trim($body_jja['codigo_qr'])
            : $this->generarCodigoQR_jja();

        try {
            $res_jja = $this->modelo_jja->crear_jja(
                trim($body_jja['nombre']),
                $codigo_qr,
                isset($body_jja['codigo_nfc']) ? trim($body_jja['codigo_nfc']) : null,
                (int)$body_jja['id_tipo'],
                isset($body_jja['ubicacion'])   ? trim($body_jja['ubicacion'])   : null,
                isset($body_jja['descripcion'])  ? trim($body_jja['descripcion']) : null
            );
            
            // Actualizar estado 'publicado' si fue proporcionado
            if (isset($res_jja['id_activo_jja']) && isset($body_jja['publicado'])) {
                $this->modelo_jja->publicar_jja((int)$res_jja['id_activo_jja'], (int)$body_jja['publicado']);
            }
        } catch (PDOException $e_jja) {
            $msg_jja = preg_match('/SQLSTATE\[45000\][^:]*: \d+ (.+)/', $e_jja->getMessage(), $m_jja)
                ? $m_jja[1] : 'Error al registrar el activo.';
            $this->responder_jja(false, null, $msg_jja, 409);
        }

        $this->responder_jja(true, $res_jja, 'Activo registrado en el inventario.', 201);
    }

    /** Genera un código QR único para un activo (intento limitado). */
    private function generarCodigoQR_jja(): string
    {
        $intentos = 0;
        do {
            // Generar un código legible: PREFIJO + 8 chars hex
            $codigo = 'ACTV-' . strtoupper(bin2hex(random_bytes(4)));
            $intentos++;
            $existe = $this->modelo_jja->buscarPorQR_jja($codigo);
        } while ($existe && $intentos < 6);

        if ($existe) {
            // fallback: usar uniqid si no logramos encontrar uno no usado
            $codigo = 'ACTV-' . strtoupper(uniqid());
        }
        return $codigo;
    }

    private function actualizar_jja(int $id_jja): void
    {
        $body_jja  = $this->obtenerBody_jja();
        $falta_jja = $this->campoFaltante_jja($body_jja, ['nombre', 'id_tipo']);
        if ($falta_jja) $this->responder_jja(false, null, "El campo '{$falta_jja}' es obligatorio.", 400);

        $this->modelo_jja->actualizar_jja(
            $id_jja,
            trim($body_jja['nombre']),
            isset($body_jja['codigo_nfc']) ? trim($body_jja['codigo_nfc']) : null,
            (int)$body_jja['id_tipo'],
            isset($body_jja['ubicacion'])  ? trim($body_jja['ubicacion'])  : null,
            isset($body_jja['descripcion'])? trim($body_jja['descripcion']): null
        );
        
        // Actualizar estado 'publicado' si fue proporcionado
        if (isset($body_jja['publicado'])) {
            $this->modelo_jja->publicar_jja($id_jja, (int)$body_jja['publicado']);
        }
        
        $this->responder_jja(true, null, 'Activo actualizado correctamente.');
    }

    private function actualizarEstado_jja(int $id_jja): void
    {
        $body_jja = $this->obtenerBody_jja();
        if (empty($body_jja['estado'])) $this->responder_jja(false, null, "El campo 'estado' es obligatorio.", 400);

        $estado_jja = strtolower(trim($body_jja['estado']));
        if (!in_array($estado_jja, self::ESTADOS_VALIDOS, true)) {
            $this->responder_jja(false, null,
                'Estado invalido. Valores permitidos: ' . implode(', ', self::ESTADOS_VALIDOS), 400);
        }

        $this->modelo_jja->actualizarEstado_jja($id_jja, $estado_jja);
        $this->responder_jja(true, null, "Estado del activo actualizado a '{$estado_jja}'.");
    }

    // POST /activos/{id}/solicitudes (cliente solicita préstamo de un activo)
    private function crearSolicitudActivo_jja(int $id_activo_jja, object $payload_jja): void
    {
        // cualquier usuario autenticado puede crear la solicitud
        $id_cliente = $payload_jja->id ?? null;
        if (!$id_cliente) $this->responder_jja(false, null, 'Token inválido o id de usuario no disponible.', 400);

        // ── Validación 1: verificar que el activo existe y está disponible ──
        $activo = $this->modelo_jja->buscarPorId_jja($id_activo_jja);
        if (!$activo) {
            $this->responder_jja(false, null, 'El activo no existe o fue eliminado.', 404);
            return;
        }
        if (($activo['estado_jja'] ?? '') !== 'disponible') {
            $this->responder_jja(false, null, 'El activo no está disponible para préstamo (estado actual: ' . ($activo['estado_jja'] ?? 'desconocido') . ').', 409);
            return;
        }

        // ── Validación 2: verificar que el usuario no tiene sanción activa ──
        $resSancion = (new ListaNegraModel_jja())->verificarSancion_jja((int)$id_cliente);
        if ($resSancion && ((int)($resSancion['tiene_sancion_activa'] ?? 0)) > 0) {
            $this->responder_jja(false, null, 'Tienes una sanción activa y no puedes solicitar préstamos.', 403);
            return;
        }

        // ── Validación 3: verificar que no exista una solicitud pendiente duplicada ──
        $model = new SolicitudPrestamoActivoModel_jja();
        $solExistentes = $model->listarPorCliente_jja((int)$id_cliente);
        foreach ($solExistentes as $sol) {
            if ((int)$sol['id_activo_jja'] === $id_activo_jja && ($sol['estado_jja'] ?? '') === 'pendiente') {
                $this->responder_jja(false, null, 'Ya tienes una solicitud pendiente para este activo.', 409);
                return;
            }
        }

        $body = $this->obtenerBody_jja();
        $observaciones = $body['observaciones'] ?? null;

        try {
            $sol = $model->crear_jja($id_activo_jja, (int)$id_cliente, $observaciones);
        } catch (PDOException $e) {
            $this->responder_jja(false, null, 'Error al crear la solicitud: ' . $e->getMessage(), 500);
            return;
        }

        // Cambiar estado del activo a 'en_proceso_prestamo' para reservarlo
        $this->modelo_jja->actualizarEstado_jja($id_activo_jja, 'en_proceso_prestamo');

        $this->responder_jja(true, $sol, 'Solicitud de préstamo creada. El activo ha sido reservado.', 201);
    }

    /** POST /activos/{id}/imagen => subir imagen del activo */
    private function subirImagen_jja(int $id_jja): void
    {
        $payload_jja = Middleware_jja::autenticar_jja();
        Middleware_jja::autorizar_jja($payload_jja, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);

        if (!isset($_FILES['imagen'])) {
            $this->responder_jja(false, null, 'No se ha proporcionado ninguna imagen.', 400);
        }

        $archivo = $_FILES['imagen'];
        if ($archivo['error'] !== UPLOAD_ERR_OK) {
            $this->responder_jja(false, null, 'Error al subir la imagen. Codigo: ' . $archivo['error'], 400);
        }

        $extension = strtolower(pathinfo($archivo['name'], PATHINFO_EXTENSION));
        $permitidas = ['jpg', 'jpeg', 'png', 'webp'];
        if (!in_array($extension, $permitidas)) {
            $this->responder_jja(false, null, 'Formato no permitido. Solo JPG, PNG, WEBP.', 400);
        }

        if ($archivo['size'] > 4 * 1024 * 1024) {
            $this->responder_jja(false, null, 'La imagen no debe superar los 4MB.', 400);
        }

        $directorio = __DIR__ . '/../../frontend/public/uploads/activos/';
        if (!is_dir($directorio)) mkdir($directorio, 0777, true);

        $nombreArchivo = 'activo_' . $id_jja . '_' . time() . '.' . $extension;
        $rutaCompleta = $directorio . $nombreArchivo;

        if (move_uploaded_file($archivo['tmp_name'], $rutaCompleta)) {
            $rutaRelativa = '/uploads/activos/' . $nombreArchivo;
            try {
                $this->modelo_jja->actualizarImagenes_jja($id_jja, $rutaRelativa);
                $this->responder_jja(true, ['imagen' => $rutaRelativa], 'Imagen del activo subida correctamente.', 200);
            } catch (PDOException $e_jja) {
                $msg_jja = 'Error al actualizar imagen del activo.';
                $this->responder_jja(false, null, $msg_jja, 500);
            }
        } else {
            $this->responder_jja(false, null, 'No se pudo guardar la imagen en el servidor.', 500);
        }
    }

    private function eliminar_jja(int $id_jja): void
    {
        try {
            $res_jja = $this->modelo_jja->eliminar_jja($id_jja);
            ($res_jja['filas_afectadas'] ?? 0) < 1
                ? $this->responder_jja(false, null, "Activo con ID {$id_jja} no encontrado.", 404)
                : $this->responder_jja(true, null, 'Activo eliminado del inventario.');
        } catch (PDOException $e_jja) {
            $msg_jja = preg_match('/SQLSTATE\[45000\][^:]*: \d+ (.+)/', $e_jja->getMessage(), $m_jja)
                ? $m_jja[1] : 'No se puede eliminar el activo.';
            $this->responder_jja(false, null, $msg_jja, 409);
        }
    }

    /** PATCH /activos/{id}/publicar => { publicado: 0|1 } */
    private function publicar_jja(int $id_jja): void
    {
        $body_jja = $this->obtenerBody_jja();
        if (!isset($body_jja['publicado'])) $this->responder_jja(false, null, "El campo 'publicado' es obligatorio.", 400);
        $val = (int)$body_jja['publicado'] === 1 ? 1 : 0;
        try {
            $res = $this->modelo_jja->publicar_jja($id_jja, $val);
            $this->responder_jja(true, $res, $val ? 'Activo publicado.' : 'Activo despublicado.');
        } catch (PDOException $e) {
            $this->responder_jja(false, null, 'Error al cambiar publicación del activo.', 500);
        }
    }
}
