<?php
// ============================================================
// controllers/ConfirmarEntregaController_jja.php
// GET /confirmar-entrega?id_solicitud=X&id_activo=Y&id_encargado=Z
//
// Endpoint público (sin JWT) — el teléfono navega aquí al escanear el QR.
// Flujo:
//   1. Valida que solicitud y activo coincidan y estén en estado correcto.
//   2. Ejecuta el checkout vía SP_REGISTRAR_PRESTAMO_jja.
//   3. Emite evento Pusher {canal: prestamos_jja, evento: entrega_confirmada_jja}.
//   4. Devuelve página HTML simple al teléfono.
//
// SOLID: Responsabilidad única — confirmación de entrega por QR.
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================

class ConfirmarEntregaController_jja extends Controller_jja
{
    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        // Solo GET: el móvil navega a la URL desde el QR
        if ($metodo_jja !== 'GET') {
            $this->responderHtml_jja(405, false, 'Método no permitido.');
        }

        $idSolicitud_jja = isset($_GET['id_solicitud']) ? (int) $_GET['id_solicitud'] : 0;
        $idActivo_jja = isset($_GET['id_activo']) ? (int) $_GET['id_activo'] : 0;
        $idEncargado_jja = isset($_GET['id_encargado']) ? (int) $_GET['id_encargado'] : 0;

        if ($idSolicitud_jja <= 0 || $idActivo_jja <= 0) {
            $this->responderHtml_jja(400, false, 'Parámetros inválidos. Se requieren id_solicitud e id_activo.');
        }

        $db_jja = Database_jja::obtenerConexion_jja();

        // ── 1. Verificar la solicitud ────────────────────────────
        $stmtSol_jja = $db_jja->prepare(
            "SELECT id_solicitud_activo_jja, id_activo_jja, id_cliente_jja, estado_jja
             FROM solicitudes_prestamo_activos_jja
             WHERE id_solicitud_activo_jja = ? LIMIT 1"
        );
        $stmtSol_jja->execute([$idSolicitud_jja]);
        $sol_jja = $stmtSol_jja->fetch(PDO::FETCH_ASSOC);

        if (!$sol_jja) {
            $this->responderHtml_jja(404, false, 'Solicitud no encontrada.');
        }

        if ((int) $sol_jja['id_activo_jja'] !== $idActivo_jja) {
            $this->responderHtml_jja(409, false, 'El activo no coincide con la solicitud proporcionada.');
        }

        if (!in_array($sol_jja['estado_jja'], ['en_proceso', 'aprobada'], true)) {
            if (in_array($sol_jja['estado_jja'], ['rechazada', 'cancelada'], true)) {
                $this->responderHtml_jja(409, false, 'Esta solicitud ya fue cancelada o rechazada.');
            }
            $this->responderHtml_jja(409, false, 'La solicitud aún no ha sido aprobada por el encargado.');
        }

        // ── 2. Verificar el activo ───────────────────────────────
        $stmtAct_jja = $db_jja->prepare(
            "SELECT id_activo_jja, nombre_jja, estado_jja
             FROM activos_jja WHERE id_activo_jja = ? LIMIT 1"
        );
        $stmtAct_jja->execute([$idActivo_jja]);
        $activo_jja = $stmtAct_jja->fetch(PDO::FETCH_ASSOC);

        if (!$activo_jja) {
            $this->responderHtml_jja(404, false, 'Activo no encontrado.');
        }

        if ($activo_jja['estado_jja'] === 'prestado') {
            $this->responderHtml_jja(409, false, 'Este activo ya fue entregado anteriormente.');
        }

        if ($activo_jja['estado_jja'] !== 'en_proceso_prestamo') {
            $this->responderHtml_jja(
                409,
                false,
                "El activo no está disponible para entrega (estado actual: {$activo_jja['estado_jja']})."
            );
        }

        $nombreActivo_jja = $activo_jja['nombre_jja'];

        // ── 3. Ejecutar checkout ─────────────────────────────────
        // Si no se recibe id_encargado válido, usar el id del cliente como fallback
        $encargadoId_jja = $idEncargado_jja > 0 ? $idEncargado_jja : (int) $sol_jja['id_cliente_jja'];

        try {
            $prestamoModel_jja = new PrestamoModel_jja();
            $prestamoModel_jja->registrar_jja(
                $idActivo_jja,
                (int) $sol_jja['id_cliente_jja'],
                $encargadoId_jja,
                'Entrega confirmada por escaneo QR desde teléfono'
            );
        } catch (\Throwable $e_jja) {
            $msg_jja = $e_jja->getMessage();
            if (preg_match('/SQLSTATE\[45000\][^:]*: \d+ (.+)/', $msg_jja, $m_jja)) {
                $msg_jja = trim($m_jja[1]);
            } else {
                $msg_jja = 'No se pudo registrar la entrega. El usuario superó el límite de préstamos simultáneos para este tipo de activo.';
            }
            $this->responderHtml_jja(409, false, $msg_jja);
        }

        // Marcar la solicitud como aprobada
        $db_jja->prepare(
            "UPDATE solicitudes_prestamo_activos_jja SET estado_jja = 'aprobada' WHERE id_solicitud_activo_jja = ?"
        )->execute([$idSolicitud_jja]);

        // ── 4. Emitir evento Pusher ──────────────────────────────
        try {
            $pusher_jja = new PusherService_jja();
            $pusher_jja->emitir_jja('prestamos_jja', 'entrega_confirmada_jja', [
                'id_solicitud' => $idSolicitud_jja,
                'id_activo' => $idActivo_jja,
                'nombre_activo' => $nombreActivo_jja,
            ]);
        } catch (\Throwable $e_jja) {
            // Pusher es opcional: el préstamo ya fue registrado correctamente
            error_log('[Pusher] Error al emitir entrega_confirmada_jja: ' . $e_jja->getMessage());
        }

        // ── 5. Respuesta HTML al teléfono ────────────────────────
        $this->responderHtml_jja(200, true, "El activo \"{$nombreActivo_jja}\" ha sido entregado exitosamente.");
    }

    // ── Página HTML simple para el navegador del teléfono ───────
    private function responderHtml_jja(int $codigo_jja, bool $exito_jja, string $mensaje_jja): void
    {
        http_response_code($codigo_jja);
        header('Content-Type: text/html; charset=utf-8');

        $icono_jja = $exito_jja ? '✅' : '❌';
        $titulo_jja = $exito_jja ? 'Entrega Confirmada' : 'Error';
        $color_jja = $exito_jja ? '#10b981' : '#ef4444';
        $msg_seg = htmlspecialchars($mensaje_jja, ENT_QUOTES, 'UTF-8');

        echo <<<HTML
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JoAnJe — {$titulo_jja}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f1f5f9;min-height:100vh;display:flex;justify-content:center;align-items:center}
    .card{background:#fff;border-radius:20px;padding:2.5rem 2rem;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,.12);max-width:360px;width:90%}
    .icono{font-size:4rem;margin-bottom:1rem}
    h1{color:{$color_jja};font-size:1.5rem;margin-bottom:.75rem;font-weight:700}
    p{color:#475569;font-size:.95rem;line-height:1.6}
    .marca{margin-top:2rem;font-size:.7rem;color:#94a3b8;letter-spacing:.05em;text-transform:uppercase}
  </style>
</head>
<body>
  <div class="card">
    <div class="icono">{$icono_jja}</div>
    <h1>{$titulo_jja}</h1>
    <p>{$msg_seg}</p>
    <div class="marca">JoAnJe Coders · Sistema de Activos</div>
  </div>
</body>
</html>
HTML;
        exit;
    }
}
