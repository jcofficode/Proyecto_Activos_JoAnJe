<?php
// ============================================================
// controllers/ArchivoController_jja.php
// POST /archivos/activo/{id}  — sube imagen de activo (Admin/Encargado)
// POST /archivos/perfil/{id}  — sube imagen de perfil (Admin o mismo usuario)
// REGLA: Este controlador SOLO maneja I/O de archivos.
//        Cero lógica de negocio.
// ============================================================

class ArchivoController_jja extends Controller_jja
{
    use ValidadorArchivos_jja;

    // Límites de tamaño en bytes por tipo de imagen
    private const LIMITES_BYTES_jja = [
        'activo' => 4 * 1024 * 1024,  // 4 MB
        'perfil' => 2 * 1024 * 1024,  // 2 MB
    ];

    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        $tipo_jja = $segmentos_jja[0] ?? null;  // 'activo' | 'perfil'
        $id_jja   = $segmentos_jja[1] ?? null;

        if ($metodo_jja !== 'POST') {
            $this->responder_jja(false, null, 'Método HTTP no permitido.', 405);
        }

        if (!in_array($tipo_jja, ['activo', 'perfil'], true)) {
            $this->responder_jja(false, null, "Tipo inválido. Use 'activo' o 'perfil'.", 400);
        }

        if (!$this->validarId_jja($id_jja)) {
            $this->responder_jja(false, null, 'ID inválido.', 400);
        }

        $payload_jja = Middleware_jja::autenticar_jja();

        if ($tipo_jja === 'activo') {
            $this->subirImagenActivo_jja((int)$id_jja, $payload_jja);
        } else {
            $this->subirImagenPerfil_jja((int)$id_jja, $payload_jja);
        }
    }

    /** Sube imagen de un activo y actualiza el campo imagenes_jja en BD. */
    private function subirImagenActivo_jja(int $id_jja, object $payload_jja): void
    {
        Middleware_jja::autorizar_jja($payload_jja, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);

        $extension_jja  = $this->validarArchivoSubido_jja(
            $_FILES['imagen'] ?? [],
            self::LIMITES_BYTES_jja['activo']
        );
        $directorio_jja = $this->resolverDirectorio_jja('activos');
        $nombre_jja     = $this->generarNombreArchivo_jja('activo', $id_jja, $extension_jja);

        $this->moverArchivoSubido_jja($_FILES['imagen']['tmp_name'], $directorio_jja, $nombre_jja);

        $url_jja = '/uploads/activos/' . $nombre_jja;

        try {
            (new ActivoModel_jja())->guardarImagenes_jja($id_jja, $url_jja);
            $this->responder_jja(true, ['imagen' => $url_jja], 'Imagen del activo subida correctamente.');
        } catch (PDOException $e_jja) {
            $this->responder_jja(false, null, $this->extraerMensajeSP_jja($e_jja->getMessage()), 500);
        }
    }

    /** Sube imagen de perfil de usuario y actualiza imagen_jja en BD. */
    private function subirImagenPerfil_jja(int $id_jja, object $payload_jja): void
    {
        if ($payload_jja->rol !== Middleware_jja::ROL_ADMIN && (int)$payload_jja->id !== $id_jja) {
            $this->responder_jja(false, null, 'No tienes permisos para actualizar esta imagen.', 403);
        }

        $extension_jja  = $this->validarArchivoSubido_jja(
            $_FILES['imagen'] ?? [],
            self::LIMITES_BYTES_jja['perfil']
        );
        $directorio_jja = $this->resolverDirectorio_jja('perfiles');
        $nombre_jja     = $this->generarNombreArchivo_jja('perfil', $id_jja, $extension_jja);

        $this->moverArchivoSubido_jja($_FILES['imagen']['tmp_name'], $directorio_jja, $nombre_jja);

        $url_jja = '/uploads/perfiles/' . $nombre_jja;

        try {
            (new UsuarioModel_jja())->actualizarImagen_jja($id_jja, $url_jja);
            $this->responder_jja(true, ['imagen' => $url_jja], 'Imagen de perfil actualizada correctamente.');
        } catch (PDOException $e_jja) {
            $this->responder_jja(false, null, $this->extraerMensajeSP_jja($e_jja->getMessage()), 500);
        }
    }

    /**
     * Resuelve la ruta absoluta del directorio de uploads.
     * Lee UPLOADS_RUTA del .env; si es relativa, la resuelve desde backend/.
     */
    private function resolverDirectorio_jja(string $tipo_jja): string
    {
        $base_jja = rtrim($_ENV['UPLOADS_RUTA'] ?? '../frontend/uploads', '/\\');
        // Si no es ruta absoluta (Unix /... o Windows C:\...), resolver relativa al backend
        if (!str_starts_with($base_jja, '/') && !preg_match('/^[A-Z]:/i', $base_jja)) {
            $base_jja = __DIR__ . '/../' . $base_jja;
        }
        return $base_jja . '/' . $tipo_jja . '/';
    }
}
