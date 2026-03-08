<?php
// ============================================================
// controllers/UsuarioController_jja.php
// GET /usuarios | POST /usuarios | GET /usuarios/{id}
// PUT /usuarios/{id} | DELETE /usuarios/{id}
// Solo ADMIN puede crear, actualizar y eliminar.
// ============================================================

class UsuarioController_jja extends Controller_jja
{
    private UsuarioModel_jja $modelo_jja;
    private CorreoService_jja $correo_jja;

    public function __construct()
    {
        $this->modelo_jja = new UsuarioModel_jja();
        $this->correo_jja = new CorreoService_jja();
    }

    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        $payload_jja = Middleware_jja::autenticar_jja();
        $id_jja = $segmentos_jja[0] ?? null;

        switch ($metodo_jja) {
            case 'GET':
                if ($id_jja !== null) {
                    if (!$this->validarId_jja($id_jja)) {
                        $this->responder_jja(false, null, 'ID de usuario invalido.', 400);
                    }
                    $this->mostrar_jja((int)$id_jja, $payload_jja);
                }
                else {
                    $this->listar_jja($payload_jja);
                }
                break;

            case 'POST':
                if ($id_jja !== null && isset($segmentos_jja[1]) && $segmentos_jja[1] === 'imagen') {
                    if (!$this->validarId_jja($id_jja)) {
                        $this->responder_jja(false, null, 'ID de usuario invalido.', 400);
                    }
                    $this->actualizarImagen_jja((int)$id_jja, $payload_jja);
                }
                else {
                    Middleware_jja::autorizar_jja($payload_jja, [Middleware_jja::ROL_ADMIN]);
                    $this->crear_jja();
                }
                break;

            case 'PUT':
                Middleware_jja::autorizar_jja($payload_jja, [Middleware_jja::ROL_ADMIN]);
                if (!$this->validarId_jja($id_jja)) {
                    $this->responder_jja(false, null, 'ID de usuario invalido.', 400);
                }
                $this->actualizar_jja((int)$id_jja);
                break;

            case 'DELETE':
                Middleware_jja::autorizar_jja($payload_jja, [Middleware_jja::ROL_ADMIN]);
                if (!$this->validarId_jja($id_jja)) {
                    $this->responder_jja(false, null, 'ID de usuario invalido.', 400);
                }
                $this->eliminar_jja((int)$id_jja);
                break;

            default:
                $this->responder_jja(false, null, 'Metodo HTTP no permitido.', 405);
        }
    }

    private function listar_jja(object $payload_jja): void
    {
        // Encargado y usuario_final solo ven su propio perfil
        if ($payload_jja->rol === Middleware_jja::ROL_USUARIO) {
            $usuario_jja = $this->modelo_jja->buscarPorId_jja((int)$payload_jja->id);
            $this->responder_jja(true, $usuario_jja, 'Perfil de usuario.');
        }
        $usuarios_jja = $this->modelo_jja->listar_jja();
        $this->responder_jja(true, $usuarios_jja, 'Lista de usuarios.');
    }

    private function mostrar_jja(int $id_jja, object $payload_jja): void
    {
        // Usuario final solo puede ver su propio perfil
        if ($payload_jja->rol === Middleware_jja::ROL_USUARIO && $payload_jja->id !== $id_jja) {
            $this->responder_jja(false, null, 'No tienes permisos para ver este perfil.', 403);
        }
        $usuario_jja = $this->modelo_jja->buscarPorId_jja($id_jja);
        if (!$usuario_jja) {
            $this->responder_jja(false, null, "Usuario con ID {$id_jja} no encontrado.", 404);
        }
        $this->responder_jja(true, $usuario_jja, 'Usuario encontrado.');
    }

    private function crear_jja(): void
    {
        $body_jja = $this->obtenerBody_jja();

        $falta_jja = $this->campoFaltante_jja($body_jja, ['nombre', 'apellido', 'cedula', 'correo', 'id_rol']);
        if ($falta_jja) {
            $this->responder_jja(false, null, "El campo '{$falta_jja}' es obligatorio.", 400);
        }

        // Validaciones estrictas
        if (strlen(trim($body_jja['nombre'])) > 80)
            $this->responder_jja(false, null, 'El nombre no debe superar 80 caracteres.', 400);
        if (strlen(trim($body_jja['apellido'])) > 80)
            $this->responder_jja(false, null, 'El apellido no debe superar 80 caracteres.', 400);
        if (!ctype_digit($body_jja['cedula']) || strlen($body_jja['cedula']) < 6 || strlen($body_jja['cedula']) > 10)
            $this->responder_jja(false, null, 'La cedula debe tener entre 6 y 10 digitos.', 400);
        if (!filter_var($body_jja['correo'], FILTER_VALIDATE_EMAIL))
            $this->responder_jja(false, null, 'El correo no tiene un formato valido.', 400);
        if (!is_numeric($body_jja['id_rol']) || (int)$body_jja['id_rol'] < 1)
            $this->responder_jja(false, null, 'El campo id_rol debe ser un numero entero positivo.', 400);

        // Generar codigo temporal alfanumerico (8 chars)
        $chars_jja = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        $codigo_jja = '';
        for ($i = 0; $i < 8; $i++) {
            $codigo_jja .= $chars_jja[random_int(0, strlen($chars_jja) - 1)];
        }
        $hash_jja = password_hash($codigo_jja, PASSWORD_BCRYPT, ['cost' => 12]);

        try {
            $res_jja = $this->modelo_jja->crear_jja(
                trim($body_jja['nombre']),
                trim($body_jja['apellido']),
                trim($body_jja['cedula']),
                trim($body_jja['correo']),
                isset($body_jja['telefono']) ? trim($body_jja['telefono']) : null,
                $hash_jja,
                null,
                (int)$body_jja['id_rol']
            );
        }
        catch (PDOException $e_jja) {
            $msg_jja = $this->extraerMensajeSP_jja($e_jja->getMessage());
            $this->responder_jja(false, null, $msg_jja, 409);
        }

        // Enviar correo con la clave temporal
        $envio_jja = $this->correo_jja->enviarClaveTemporal_jja(
            trim($body_jja['correo']),
            trim($body_jja['nombre']),
            $codigo_jja
        );

        $this->responder_jja(true, [
            'id_usuario' => $res_jja['id_usuario_jja'] ?? null,
            'correo_enviado' => $envio_jja['exito'],
            'correo_mensaje' => $envio_jja['mensaje'],
        ], 'Usuario creado. Se envio la clave temporal al correo.', 201);
    }

    private function actualizarImagen_jja(int $id_jja, object $payload_jja): void
    {
        if ($payload_jja->rol !== Middleware_jja::ROL_ADMIN && (int)$payload_jja->id !== $id_jja) {
            $this->responder_jja(false, null, 'No tienes permisos para actualizar esta imagen.', 403);
        }

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

        if ($archivo['size'] > 2 * 1024 * 1024) {
            $this->responder_jja(false, null, 'La imagen no debe superar los 2MB.', 400);
        }

        $directorio = __DIR__ . '/../../frontend/public/uploads/perfiles/';
        if (!is_dir($directorio)) {
            mkdir($directorio, 0777, true);
        }

        $nombreArchivo = 'perfil_' . $id_jja . '_' . time() . '.' . $extension;
        $rutaCompleta = $directorio . $nombreArchivo;

        if (move_uploaded_file($archivo['tmp_name'], $rutaCompleta)) {
            $rutaRelativa = '/uploads/perfiles/' . $nombreArchivo;
            try {
                $this->modelo_jja->actualizarImagen_jja($id_jja, $rutaRelativa);
                $this->responder_jja(true, ['imagen' => $rutaRelativa], 'Imagen de perfil actualizada correctamente.', 200);
            }
            catch (PDOException $e_jja) {
                $msg_jja = $this->extraerMensajeSP_jja($e_jja->getMessage());
                $this->responder_jja(false, null, $msg_jja, 409);
            }
        }
        else {
            $this->responder_jja(false, null, 'No se pudo guardar la imagen en el servidor.', 500);
        }
    }

    private function actualizar_jja(int $id_jja): void
    {
        $body_jja = $this->obtenerBody_jja();

        $falta_jja = $this->campoFaltante_jja($body_jja, ['nombre', 'apellido', 'correo', 'id_rol']);
        if ($falta_jja) {
            $this->responder_jja(false, null, "El campo '{$falta_jja}' es obligatorio.", 400);
        }

        if (!filter_var($body_jja['correo'], FILTER_VALIDATE_EMAIL))
            $this->responder_jja(false, null, 'El correo no tiene un formato valido.', 400);

        try {
            $this->modelo_jja->actualizar_jja(
                $id_jja,
                trim($body_jja['nombre']),
                trim($body_jja['apellido']),
                trim($body_jja['correo']),
                isset($body_jja['telefono']) ? trim($body_jja['telefono']) : null,
                (int)$body_jja['id_rol']
            );
        }
        catch (PDOException $e_jja) {
            $msg_jja = $this->extraerMensajeSP_jja($e_jja->getMessage());
            $this->responder_jja(false, null, $msg_jja, 409);
        }

        $this->responder_jja(true, null, 'Usuario actualizado correctamente.', 200);
    }

    private function eliminar_jja(int $id_jja): void
    {
        $res_jja = $this->modelo_jja->eliminar_jja($id_jja);
        if (($res_jja['filas_afectadas'] ?? 0) < 1) {
            $this->responder_jja(false, null, "Usuario con ID {$id_jja} no encontrado.", 404);
        }
        $this->responder_jja(true, null, 'Usuario eliminado correctamente.', 200);
    }

    /** Extrae el mensaje de SIGNAL de MySQL del mensaje de excepcion PDO. */
    private function extraerMensajeSP_jja(string $errorMsg_jja): string
    {
        if (preg_match('/SQLSTATE\[45000\]: <<Unknown error>>: \d+ (.+)/', $errorMsg_jja, $m_jja)) {
            return $m_jja[1];
        }
        return 'Error al procesar la solicitud.';
    }
}
