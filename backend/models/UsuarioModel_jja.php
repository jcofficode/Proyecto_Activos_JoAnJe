<?php
// ============================================================
// models/UsuarioModel_jja.php - Gestion de Usuarios - JoAnJe Coders
// ============================================================

class UsuarioModel_jja extends Model_jja
{
    /**
     * Crea usuario. El hash de la clave temporal se pasa como contrasena.
     * SP_CREAR_USUARIO_jja(nombre, apellido, cedula, correo, telefono, hash, id_rol)
     * Retorna ['id_usuario_jja' => int]
     */
    public function crear_jja(
        string $nombre_jja,
        string $apellido_jja,
        string $cedula_jja,
        string $correo_jja,
        ?string $telefono_jja,
        string $hashContrasena_jja,
        ?string $imagen_jja,
        int $idRol_jja,
        int $debeCambiar_jja = 0
        ): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_CREAR_USUARIO_jja', [
            $nombre_jja, $apellido_jja, $cedula_jja, $correo_jja,
            $telefono_jja, $hashContrasena_jja, $imagen_jja, $idRol_jja, $debeCambiar_jja
        ]);
        return $res_jja ?? [];
    }

    /** Lista todos los usuarios activos. */
    public function listar_jja(): array
    {
        return $this->ejecutarSP_jja('SP_LEER_USUARIOS_jja');
    }

    /** Busca usuario por ID. */
    public function buscarPorId_jja(int $id_jja): ?array
    {
        return $this->ejecutarSPUno_jja('SP_LEER_USUARIO_ID_jja', [$id_jja]);
    }

    /**
     * Actualiza datos del usuario.
     * SP_ACTUALIZAR_USUARIO_jja(id, nombre, apellido, correo, telefono, id_rol)
     */
    public function actualizar_jja(
        int $id_jja,
        string $nombre_jja,
        string $apellido_jja,
        string $correo_jja,
        ?string $telefono_jja,
        int $idRol_jja
        ): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_ACTUALIZAR_USUARIO_jja', [
            $id_jja, $nombre_jja, $apellido_jja, $correo_jja, $telefono_jja, $idRol_jja
        ]);
        return $res_jja ?? [];
    }

    /**
     * Soft-delete del usuario.
     * SP_ELIMINAR_USUARIO_jja(id) -> ['filas_afectadas' => int]
     */
    public function eliminar_jja(int $id_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_ELIMINAR_USUARIO_jja', [$id_jja]);
        return $res_jja ?? ['filas_afectadas' => 0];
    }

    /**
     * Actualiza la imagen de perfil del usuario.
     * SP_ACTUALIZAR_IMAGEN_USUARIO_jja(id, imagen) -> ['filas_afectadas' => int]
     */
    public function actualizarImagen_jja(int $id_jja, ?string $imagen_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_ACTUALIZAR_IMAGEN_USUARIO_jja', [$id_jja, $imagen_jja]);
        return $res_jja ?? ['filas_afectadas' => 0];
    }
}
