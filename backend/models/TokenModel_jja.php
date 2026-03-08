<?php
// ============================================================
// models/TokenModel_jja.php - Blacklist JWT - JoAnJe Coders
// ============================================================

class TokenModel_jja extends Model_jja
{
    /**
     * Invalida un token (logout). Guarda hash SHA-256 del token.
     * SP_INVALIDAR_TOKEN_jja(hash, id_usuario, fecha_expiracion)
     */
    public function invalidar_jja(string $hash_jja, int $idUsuario_jja, string $expira_jja): void
    {
        $this->ejecutarSP_jja('SP_INVALIDAR_TOKEN_jja', [$hash_jja, $idUsuario_jja, $expira_jja]);
    }

    /**
     * Verifica si un token esta en la blacklist.
     * SP_VERIFICAR_TOKEN_INVALIDO_jja(hash) -> ['esta_invalidado' => 0|1]
     */
    public function estaInvalidado_jja(string $hash_jja): bool
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_VERIFICAR_TOKEN_INVALIDO_jja', [$hash_jja]);
        return (bool)($res_jja['esta_invalidado'] ?? 0);
    }

    /**
     * Limpia tokens expirados (para cron o endpoint de mantenimiento).
     */
    public function limpiarExpirados_jja(): array
    {
        $res_jja = $this->ejecutarSPUno_jja('SP_LIMPIAR_TOKENS_jja');
        return $res_jja ?? ['tokens_eliminados' => 0];
    }
}
