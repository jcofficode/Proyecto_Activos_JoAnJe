<?php
// ============================================================
// extract_db.php — Extractor de Esquema SQL
// Extrae las sentencias crear y stored procedures de crear.php
// ============================================================

$source_file = __DIR__ . '/crear.php';
$output_file = __DIR__ . '/init_railway.sql';

if (!file_exists($source_file)) {
    die("Error: No se encontro {$source_file}\n");
}

$content = file_get_contents($source_file);

// Expresión regular para extraer las sentencias SQL dentro de la función ejecutar_jja:
// Busca: ejecutar_jja(..., " [CUALQUIER SQL] ", ...);
$pattern = '/ejecutar_jja\s*\(\s*\$pdo_jja\s*,\s*\"(.*?)\"\s*,/s';

preg_match_all($pattern, $content, $matches);

$sql_output = "-- ============================================================\n";
$sql_output .= "-- init_railway.sql — Esquema final completo\n";
$sql_output .= "-- Ejecútalo en el cliente de tu base de datos Railway.\n";
$sql_output .= "-- ============================================================\n\n";

$sql_output .= "SET NAMES 'utf8mb4';\n";
$sql_output .= "SET time_zone = '-04:00';\n\n";

foreach ($matches[1] as $sql) {
    $trimmed_sql = trim($sql);

    // Si la sentencia SQL es un Stored Procedure o Tabla, asegurar su delimitador
    if (strpos($trimmed_sql, 'CREATE PROCEDURE') !== false) {
        $sql_output .= "DELIMITER //\n{$trimmed_sql}//\nDELIMITER ;\n\n";
    }
    else {
        $sql_output .= "{$trimmed_sql};\n\n";
    }
}

// También buscamos explícitamente los índices en el array $indices_jja
$pattern_indices = '/\$indices_jja\s*=\s*\[(.*?)\];/s';
if (preg_match($pattern_indices, $content, $match_indices)) {
    $indices_content = $match_indices[1];
    $pattern_create_index = '/\"(CREATE INDEX .*?)\"/s';
    if (preg_match_all($pattern_create_index, $indices_content, $indices_matches)) {
        $sql_output .= "-- Índices\n";
        foreach ($indices_matches[1] as $index_sql) {
            $sql_output .= trim($index_sql) . ";\n\n";
        }
    }
}

// Write the output file
file_put_contents($output_file, $sql_output);

echo "¡SQL Extraído correctamente en init_railway.sql!\n";
echo "Líneas de SQL generadas: " . count(explode("\n", $sql_output)) . "\n";
