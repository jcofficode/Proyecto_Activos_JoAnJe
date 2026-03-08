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
     * Cambia la contrasena del usuario y desactiva el flag debe_cambiar_clave.
     * SP_CAMBIAR_CONTRASENA_jja(id, nuevo_hash)
     */
    public function cambiarContrasena_jja(int $id_jja, string $nuevoHash_jja): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_CAMBIAR_CONTRASENA_jja', [$id_jja, $nuevoHash_jja]);
        return $res_jja ?? ['filas_afectadas' => 0];
    }
}
