<?php
// ============================================================
// models/AuthModel_jja.php - Autenticacion - JoAnJe Coders
// ============================================================

class AuthModel_jja extends Model_jja
{
    /**
     * Busca usuario por cedula para login.
     * Retorna la fila del usuario (con contrasena_jja) o null.
     */
    public function buscarPorCedula_jja(string $cedula_jja): ?array
    {
        return $this->ejecutarSPUno_jja('SP_LEER_USUARIO_CEDULA_jja', [$cedula_jja]);
    }

    /**
     * Busca el hash de la contraseña por ID de usuario.
     */
    public function buscarHashPorId_jja(int $id_jja): ?string
    {
        $sql = "SELECT contrasena_jja FROM usuarios_jja WHERE id_usuario_jja = ?";
        $stmt = $this->db_jja->prepare($sql);
        $stmt->execute([$id_jja]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        return $res ? $res['contrasena_jja'] : null;
    }

    /**
     * Busca usuario por correo para login/registro de demo.
     */
    public function buscarPorCorreo_jja(string $correo_jja): ?array
    {
        return $this->ejecutarSPUno_jja('SP_LEER_USUARIO_CORREO_jja', [$correo_jja]);
    }

    /**
     * Cambia la contrasena del usuario y desactiva el flag debe_cambiar_clave.
     * SP_CAMBIAR_CONTRASENA_jja(id, nuevo_hash)
     */
    public function cambiarContrasena_jja(int $id_jja, string $nuevoHash_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_CAMBIAR_CONTRASENA_jja', [$id_jja, $nuevoHash_jja]);
        return $res_jja ?? ['filas_afectadas' => 0];
    }

    /**
     * Fuerza el cambio de clave actualizando directamente el campo.
     */
    public function forzarCambioClave_jja(int $id_jja, string $nuevoHash_jja): array
    {
        $sql_jja = "UPDATE `usuarios_jja` SET `contrasena_jja` = ?, `debe_cambiar_clave_jja` = 1 WHERE `id_usuario_jja` = ?";
        // Como este modelo extiende Model_jja que expone db_jja, lo usaremos.
        $stmt_jja = $this->db_jja->prepare($sql_jja);
        $stmt_jja->execute([$nuevoHash_jja, $id_jja]);
        return ['filas_afectadas' => $stmt_jja->rowCount()];
    }
}
