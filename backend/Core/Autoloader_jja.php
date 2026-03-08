<?php
// ============================================================
// Core/Autoloader_jja.php - JoAnJe Coders
// Cargador automatico de clases sin PSR-4, estilo del amigo vc
// ============================================================

spl_autoload_register(function (string $clase_jja) {
    $rutas_jja = [
        __DIR__,                        // Core/
        __DIR__ . '/../controllers',
        __DIR__ . '/../models',
        __DIR__ . '/../services',
    ];
    foreach ($rutas_jja as $ruta_jja) {
        $archivo_jja = "{$ruta_jja}/{$clase_jja}.php";
        if (file_exists($archivo_jja)) {
            require_once $archivo_jja;
            return;
        }
    }
});
