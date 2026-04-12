<?php
// ============================================================
// traits/ValidadorArchivos_jja.php
// Validación y manipulación física de archivos subidos.
// Usar en controladores que manejen uploads multipart.
// ============================================================

trait ValidadorArchivos_jja
{
    /**
     * Valida un archivo subido: existencia, error PHP, extensión y tamaño.
     * Retorna la extensión limpia en minúsculas, o termina con responder_jja() si hay error.
     *
     * @param array $archivo_jja  Elemento de $_FILES
     * @param int   $maxBytes_jja Tamaño máximo en bytes
     *
     * Nota: no usar const en traits para máxima compatibilidad con PHP 8.0/8.1.
     */
    protected function validarArchivoSubido_jja(array $archivo_jja, int $maxBytes_jja): string
    {
        if (empty($archivo_jja) || !isset($archivo_jja['tmp_name'])) {
            $this->responder_jja(false, null, 'No se proporcionó ninguna imagen.', 400);
        }

        if ($archivo_jja['error'] !== UPLOAD_ERR_OK) {
            $this->responder_jja(false, null, 'Error al recibir el archivo. Código: ' . $archivo_jja['error'], 400);
        }

        $extensiones_permitidas_jja = ['jpg', 'jpeg', 'png', 'webp'];
        $extension_jja = strtolower(pathinfo($archivo_jja['name'], PATHINFO_EXTENSION));
        if (!in_array($extension_jja, $extensiones_permitidas_jja, true)) {
            $this->responder_jja(false, null, 'Formato no permitido. Solo JPG, PNG, WEBP.', 400);
        }

        if ($archivo_jja['size'] > $maxBytes_jja) {
            $mb_jja = round($maxBytes_jja / (1024 * 1024));
            $this->responder_jja(false, null, "La imagen no debe superar los {$mb_jja}MB.", 400);
        }

        return $extension_jja;
    }

    /**
     * Genera un nombre de archivo único.
     * Patrón: {prefijo}_{id}_{timestamp}.{ext}
     */
    protected function generarNombreArchivo_jja(string $prefijo_jja, int $id_jja, string $ext_jja): string
    {
        return "{$prefijo_jja}_{$id_jja}_" . time() . ".{$ext_jja}";
    }

    /**
     * Crea el directorio si no existe y mueve el archivo temporal al destino.
     * Termina con responder_jja() si move_uploaded_file() falla.
     */
    protected function moverArchivoSubido_jja(
        string $tmpName_jja,
        string $directorio_jja,
        string $nombre_jja
    ): void {
        if (!is_dir($directorio_jja)) {
            mkdir($directorio_jja, 0777, true);
        }
        if (!move_uploaded_file($tmpName_jja, $directorio_jja . $nombre_jja)) {
            $this->responder_jja(false, null, 'No se pudo guardar el archivo en el servidor.', 500);
        }
    }
}
