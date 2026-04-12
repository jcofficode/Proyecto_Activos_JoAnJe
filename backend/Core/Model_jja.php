<?php
// ============================================================
// Core/Model_jja.php - Modelo Base - JoAnJe Coders
// REGLA: SOLO ejecuta Stored Procedures via PDO. Cero SQL inline.
// ============================================================

class Model_jja
{
    protected PDO $db_jja;

    public function __construct()
    {
        $this->db_jja = Database_jja::obtenerConexion_jja();
    }

    /**
     * Ejecuta un Stored Procedure y retorna todas las filas.
     */
    protected function ejecutarSP_jja(string $sp_jja, array $params_jja = []): array
    {
        $sql_jja = empty($params_jja)
            ? "CALL {$sp_jja}()"
            : "CALL {$sp_jja}(" . implode(', ', array_fill(0, count($params_jja), '?')) . ")";

        $stmt_jja = $this->db_jja->prepare($sql_jja);
        $stmt_jja->execute($params_jja);
        return $stmt_jja->fetchAll();
    }

    /**
     * Ejecuta un SP y retorna solo la primera fila, o null si no hay resultados.
     */
    protected function ejecutarSPUno_jja(string $sp_jja, array $params_jja = []): ?array
    {
        $filas_jja = $this->ejecutarSP_jja($sp_jja, $params_jja);
        return $filas_jja[0] ?? null;
    }

    /**
     * Decodifica un campo JSON en cada fila del array.
     * Modifica $filas_jja por referencia.
     * Si el valor es null o vacío, asigna array vacío.
     */
    protected function decodificarJsonCampo_jja(array &$filas_jja, string $campo_jja): void
    {
        foreach ($filas_jja as &$fila_jja) {
            $valor_jja = $fila_jja[$campo_jja] ?? null;
            if ($valor_jja) {
                $decoded_jja = json_decode($valor_jja, true);
                $fila_jja[$campo_jja] = is_array($decoded_jja) ? $decoded_jja : [$valor_jja];
            } else {
                $fila_jja[$campo_jja] = [];
            }
        }
    }
}
