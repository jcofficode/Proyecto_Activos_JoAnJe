<?php
// ============================================================
// controllers/EscaneoController_jja.php — Escaneo Físico
// POST /escaneo  { "id_activo": N }
// Flujo:
//   - Si activo tiene solicitud 'aprobada' → 'en_uso' + fecha salida
//   - Si activo está 'en_devolucion'       → 'disponible' + cerrar préstamo
//   - De lo contrario                       → rechazar
// Respuesta JSON universal para React y React Native.
// ============================================================

class EscaneoController_jja extends Controller_jja
{
    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        // Solo aceptar POST
        if ($metodo_jja !== 'POST') {
            $this->responderUniversal_jja('error', 'Método HTTP no permitido. Use POST.', null, 405);
        }

        // Autenticar: solo Admin o Encargado pueden escanear
        $payload_jja = Middleware_jja::autenticar_jja();
        Middleware_jja::autorizar_jja($payload_jja, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);

        $body_jja = $this->obtenerBody_jja();

        // Validar input de escaneo (puede ser ID numérico o código QR/NFC)
        $inputActivo_jja = $body_jja['id_activo'] ?? null;
        if (!$inputActivo_jja || trim((string)$inputActivo_jja) === '') {
            $this->responderUniversal_jja('error', 'Debe proporcionar un ID o código de activo válido.', null, 400);
        }
        
        $inputStr_jja = trim((string)$inputActivo_jja);
        $db_jja = Database_jja::obtenerConexion_jja();
        $idActivo_jja = null;
        
        if (ctype_digit($inputStr_jja) && (int)$inputStr_jja > 0) {
            $idActivo_jja = (int)$inputStr_jja;
        } else {
            // Asumimos que es un código QR
            $stmtAct_jja = $db_jja->prepare("SELECT id_activo_jja FROM activos_jja WHERE codigo_qr_jja = ?");
            $stmtAct_jja->execute([$inputStr_jja]);
            $rowAct_jja = $stmtAct_jja->fetch(PDO::FETCH_ASSOC);
            if (!$rowAct_jja) {
                // Quizás sea NFC
                $stmtNfc_jja = $db_jja->prepare("SELECT id_activo_jja FROM activos_jja WHERE codigo_nfc_jja = ?");
                $stmtNfc_jja->execute([$inputStr_jja]);
                $rowAct_jja = $stmtNfc_jja->fetch(PDO::FETCH_ASSOC);
            }
            if ($rowAct_jja) {
                $idActivo_jja = (int)$rowAct_jja['id_activo_jja'];
            }
        }

        if (!$idActivo_jja) {
             $this->responderUniversal_jja('error', "No se encontró ningún activo asociado al código proporcionado: {$inputStr_jja}", null, 404);
        }

        // ── 1. Verificar que el activo existe ────────────────────
        $stmtActivo_jja = $db_jja->prepare("SELECT id_activo_jja, estado_jja, nombre_jja FROM activos_jja WHERE id_activo_jja = ?");
        $stmtActivo_jja->execute([$idActivo_jja]);
        $activo_jja = $stmtActivo_jja->fetch(PDO::FETCH_ASSOC);

        if (!$activo_jja) {
            $this->responderUniversal_jja('error', "No se encontró ningún activo con ID {$idActivo_jja}.", null, 404);
        }

        $estadoActivo_jja = strtolower(trim($activo_jja['estado_jja']));
        $nombreActivo_jja = $activo_jja['nombre_jja'];

        // ── 2. CASO ENTREGA: Solicitud aprobada → En Uso ────────
        if ($estadoActivo_jja === 'en_proceso_prestamo') {
            // Buscar solicitud aprobada para este activo
            $stmtSol_jja = $db_jja->prepare(
                "SELECT id_solicitud_activo_jja, id_cliente_jja
                 FROM solicitudes_prestamo_activos_jja
                 WHERE id_activo_jja = ? AND estado_jja IN ('en_proceso', 'aprobada')
                 ORDER BY fecha_solicitud_jja DESC LIMIT 1"
            );
            $stmtSol_jja->execute([$idActivo_jja]);
            $sol_jja = $stmtSol_jja->fetch(PDO::FETCH_ASSOC);

            if (!$sol_jja) {
                $this->responderUniversal_jja('error', 'El activo está en proceso pero no tiene una solicitud aprobada.', null, 409);
            }

            try {
                // Delegar al modelo de préstamo que contiene toda la lógica de negocio (fechas límite, encargado, estados)
                $prestamoModel = new PrestamoModel_jja();
                $prestamoModel->registrar_jja(
                    $idActivo_jja, 
                    (int)$sol_jja['id_cliente_jja'], 
                    (int)$payload_jja->id, 
                    "Préstamo entregado vía escaneo físico"
                );

                // Marcar la solicitud web de préstamo como formalmente aprobada
                $stmtSolUpd_jja = $db_jja->prepare("UPDATE solicitudes_prestamo_activos_jja SET estado_jja = 'aprobada' WHERE id_solicitud_activo_jja = ?");
                $stmtSolUpd_jja->execute([$sol_jja['id_solicitud_activo_jja']]);

                $this->responderUniversal_jja('success',
                    "Entrega registrada. El activo \"{$nombreActivo_jja}\" está ahora prestado.",
                    ['action' => 'entrega', 'id_activo' => $idActivo_jja, 'estado_nuevo' => 'prestado'],
                    200
                );
            } catch (\Throwable $e_jja) {
                // Registrar arroja excepciones si las validaciones del SP fallan
                $msg_full = $e_jja->getMessage();
                $msg_jja = 'Error al registrar la entrega: ';
                if (strpos($msg_full, 'SQLSTATE[45000]') !== false) {
                    $partes = explode('1644', $msg_full);
                    if (count($partes) > 1) {
                        $msg_jja .= trim($partes[1]);
                    } else {
                        $partes_dos = explode(':', $msg_full);
                        $msg_jja .= trim(end($partes_dos));
                    }
                } else {
                    $msg_jja .= $msg_full;
                }
                $this->responderUniversal_jja('error', $msg_jja, null, 500);
            }
        }

        // ── 3. CASO DEVOLUCIÓN: En devolución → Disponible ──────
        if ($estadoActivo_jja === 'prestado') {
            // Verificar si hay solicitud de devolución pendiente
            $stmtDev_jja = $db_jja->prepare(
                "SELECT sd.id_solicitud_devolucion_jja, sd.id_prestamo_jja
                 FROM solicitudes_devolucion_jja sd
                 INNER JOIN prestamos_jja p ON p.id_prestamo_jja = sd.id_prestamo_jja
                 WHERE p.id_activo_jja = ? AND sd.estado_jja IN ('pendiente', 'en_proceso', 'aprobada')
                 ORDER BY sd.creado_en_jja DESC LIMIT 1"
            );
            $stmtDev_jja->execute([$idActivo_jja]);
            $dev_jja = $stmtDev_jja->fetch(PDO::FETCH_ASSOC);

            if (!$dev_jja) {
                $this->responderUniversal_jja('error',
                    'El activo está prestado pero no tiene una solicitud de devolución activa. El cliente debe iniciar la devolución primero.',
                    null, 409
                );
            }

            try {
                // Delegar al modelo de préstamo para realizar el check-in seguro
                $prestamoModel = new PrestamoModel_jja();
                $prestamoModel->registrarDevolucion_jja(
                    (int)$dev_jja['id_prestamo_jja'],
                    (int)$payload_jja->id,
                    "Devolución registrada vía escaneo físico"
                );

                // Asegurar que la solicitud web pase o permanezca en estado aprobada
                $stmtDevUpd_jja = $db_jja->prepare(
                    "UPDATE solicitudes_devolucion_jja SET estado_jja = 'aprobada' WHERE id_solicitud_devolucion_jja = ?"
                );
                $stmtDevUpd_jja->execute([$dev_jja['id_solicitud_devolucion_jja']]);

                $this->responderUniversal_jja('success',
                    "Devolución completada. El activo \"{$nombreActivo_jja}\" está disponible nuevamente.",
                    ['action' => 'devolucion', 'id_activo' => $idActivo_jja, 'estado_nuevo' => 'disponible'],
                    200
                );
            } catch (\Throwable $e_jja) {
                // Registrar arroja excepciones si las validaciones del SP fallan
                $msg_full = $e_jja->getMessage();
                $msg_jja = 'Error al registrar la devolución: ';
                if (strpos($msg_full, 'SQLSTATE[45000]') !== false) {
                    $partes = explode('1644', $msg_full);
                    if (count($partes) > 1) {
                        $msg_jja .= trim($partes[1]);
                    } else {
                        $partes_dos = explode(':', $msg_full);
                        $msg_jja .= trim(end($partes_dos));
                    }
                } else {
                    $msg_jja .= $msg_full;
                }
                $this->responderUniversal_jja('error', $msg_jja, null, 500);
            }
        }

        // ── 4. Estado no compatible ──────────────────────────────
        $this->responderUniversal_jja('error',
            "El activo \"{$nombreActivo_jja}\" tiene estado \"{$estadoActivo_jja}\" y no es compatible con escaneo. Estados válidos: en_proceso_prestamo (para entrega) o prestado (para devolución con solicitud activa).",
            null, 409
        );
    }

    /**
     * Respuesta JSON universal compatible con React y React Native.
     * Formato: { "status": "success/error", "message": "...", "action": "...", "exito": bool, "datos": mixed }
     */
    private function responderUniversal_jja(string $status_jja, string $message_jja, ?array $data_jja = null, int $http_jja = 200): void
    {
        http_response_code($http_jja);
        $respuesta_jja = [
            'status'  => $status_jja,
            'message' => $message_jja,
            'exito'   => $status_jja === 'success',
            'mensaje' => $message_jja,
            'datos'   => $data_jja,
        ];
        echo json_encode($respuesta_jja, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
}
