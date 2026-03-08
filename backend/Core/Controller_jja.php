<?php
// ============================================================
// Core/Controller_jja.php - Controlador Base - JoAnJe Coders
// ============================================================

class Controller_jja
{
    /**
     * Envia respuesta JSON estandarizada y termina la ejecucion.
     * Formato fijo: { "exito": bool, "mensaje": string, "datos": mixed }
     */
    protected function responder_jja(
        bool   $exito_jja,
        mixed  $datos_jja   = null,
        string $mensaje_jja = '',
        int    $http_jja    = 200
    ): void {
        http_response_code($http_jja);
        echo json_encode([
            'exito'   => $exito_jja,
            'mensaje' => $mensaje_jja,
            'datos'   => $datos_jja,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    /**
     * Lee y decodifica el body JSON de la peticion entrante.
     */
    protected function obtenerBody_jja(): array
    {
        $raw_jja = file_get_contents('php://input');
        return json_decode($raw_jja, true) ?? [];
    }

    /**
     * Retorna el nombre del primer campo requerido faltante, o null si todo OK.
     */
    protected function campoFaltante_jja(array $datos_jja, array $requeridos_jja): ?string
    {
        foreach ($requeridos_jja as $campo_jja) {
            if (!isset($datos_jja[$campo_jja]) || trim((string)$datos_jja[$campo_jja]) === '') {
                return $campo_jja;
            }
        }
        return null;
    }

    /**
     * Valida que un ID de segmento URI sea entero positivo.
     */
    protected function validarId_jja(mixed $id_jja): bool
    {
        return isset($id_jja) && ctype_digit((string)$id_jja) && (int)$id_jja > 0;
    }
}
