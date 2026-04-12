<?php
// ============================================================
// controllers/ConfirmarDevolucionController_jja.php
// GET /confirmar-devolucion?id_solicitud_devolucion=X&id_prestamo=Y&id_encargado=Z
//
// Endpoint público (sin JWT) — el teléfono navega aquí al escanear el QR.
// Flujo:
//   1. Valida que solicitud de devolución y préstamo coincidan y estén en estado correcto.
//   2. Ejecuta el check-in vía SP_REGISTRAR_DEVOLUCION_jja.
//   3. Marca la solicitud como aprobada.
//   4. Emite evento Pusher {canal: prestamos_jja, evento: devolucion_confirmada_jja}.
//   5. Devuelve página HTML simple al teléfono.
//
// SOLID: Responsabilidad única — confirmación de devolución por QR.
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================

class ConfirmarDevolucionController_jja extends Controller_jja
{
    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        if ($metodo_jja !== 'GET') {
            $this->responderHtml_jja(405, false, 'Método no permitido.');
        }

        $idSolicitudDev_jja = isset($_GET['id_solicitud_devolucion']) ? (int)$_GET['id_solicitud_devolucion'] : 0;
        $idPrestamo_jja     = isset($_GET['id_prestamo'])             ? (int)$_GET['id_prestamo']             : 0;
        $idEncargado_jja    = isset($_GET['id_encargado'])            ? (int)$_GET['id_encargado']            : 0;

        if ($idSolicitudDev_jja <= 0 || $idPrestamo_jja <= 0) {
            $this->responderHtml_jja(400, false, 'Parámetros inválidos. Se requieren id_solicitud_devolucion e id_prestamo.');
        }

        $db_jja = Database_jja::obtenerConexion_jja();

        // ── 1. Verificar la solicitud de devolución ──────────────
        $stmtSol_jja = $db_jja->prepare(
            "SELECT sd.id_solicitud_devolucion_jja, sd.id_prestamo_jja, sd.id_usuario_solicitante_jja, sd.estado_jja,
                    p.id_activo_jja, p.estado_prestamo_jja,
                    a.nombre_jja AS nombre_activo_jja
             FROM solicitudes_devolucion_jja sd
             JOIN prestamos_jja p ON sd.id_prestamo_jja = p.id_prestamo_jja
             JOIN activos_jja a ON p.id_activo_jja = a.id_activo_jja
             WHERE sd.id_solicitud_devolucion_jja = ? LIMIT 1"
        );
        $stmtSol_jja->execute([$idSolicitudDev_jja]);
        $sol_jja = $stmtSol_jja->fetch(PDO::FETCH_ASSOC);

        if (!$sol_jja) {
            $this->responderHtml_jja(404, false, 'Solicitud de devolución no encontrada.');
        }

        if ((int)$sol_jja['id_prestamo_jja'] !== $idPrestamo_jja) {
            $this->responderHtml_jja(409, false, 'El préstamo no coincide con la solicitud proporcionada.');
        }

        if (!in_array($sol_jja['estado_jja'], ['en_proceso', 'aprobada'], true)) {
            if (in_array($sol_jja['estado_jja'], ['rechazada', 'cancelada'], true)) {
                $this->responderHtml_jja(409, false, 'Esta solicitud de devolución ya fue cancelada o rechazada.');
            }
            $this->responderHtml_jja(409, false, 'La solicitud de devolución aún no ha sido aprobada por el encargado.');
        }

        // ── 2. Verificar el préstamo ─────────────────────────────
        if (!in_array($sol_jja['estado_prestamo_jja'], ['activo', 'vencido'], true)) {
            if ($sol_jja['estado_prestamo_jja'] === 'devuelto') {
                $this->responderHtml_jja(409, false, 'Este préstamo ya fue devuelto anteriormente.');
            }
            $this->responderHtml_jja(409, false,
                "El préstamo no está en estado válido para devolución (estado actual: {$sol_jja['estado_prestamo_jja']})."
            );
        }

        $nombreActivo_jja = $sol_jja['nombre_activo_jja'];

        // ── 3. Ejecutar devolución (check-in) ────────────────────
        $encargadoId_jja = $idEncargado_jja > 0 ? $idEncargado_jja : (int)$sol_jja['id_usuario_solicitante_jja'];

        try {
            $prestamoModel_jja = new PrestamoModel_jja();
            $prestamoModel_jja->registrarDevolucion_jja(
                $idPrestamo_jja,
                $encargadoId_jja,
                'Devolución confirmada por escaneo QR desde teléfono'
            );
        } catch (\Throwable $e_jja) {
            $this->responderHtml_jja(500, false, 'Error al registrar la devolución: ' . $e_jja->getMessage());
        }

        // Marcar la solicitud como aprobada
        $db_jja->prepare(
            "UPDATE solicitudes_devolucion_jja SET estado_jja = 'aprobada', fecha_respuesta_jja = NOW() WHERE id_solicitud_devolucion_jja = ?"
        )->execute([$idSolicitudDev_jja]);

        // ── 4. Emitir evento Pusher ──────────────────────────────
        try {
            $pusher_jja = new PusherService_jja();
            $pusher_jja->emitir_jja('prestamos_jja', 'devolucion_confirmada_jja', [
                'id_solicitud_devolucion' => $idSolicitudDev_jja,
                'id_prestamo'             => $idPrestamo_jja,
                'id_activo'               => (int)$sol_jja['id_activo_jja'],
                'nombre_activo'           => $nombreActivo_jja,
            ]);
        } catch (\Throwable $e_jja) {
            error_log('[Pusher] Error al emitir devolucion_confirmada_jja: ' . $e_jja->getMessage());
        }

        // ── 5. Respuesta HTML al teléfono ────────────────────────
        $this->responderHtml_jja(200, true, "Devolución confirmada. El activo \"{$nombreActivo_jja}\" ha sido devuelto correctamente.");
    }

    // ── Página HTML simple para el navegador del teléfono ───────
    private function responderHtml_jja(int $codigo_jja, bool $exito_jja, string $mensaje_jja): void
    {
        http_response_code($codigo_jja);
        header('Content-Type: text/html; charset=utf-8');

        $icono_jja  = $exito_jja ? '✅' : '❌';
        $titulo_jja = $exito_jja ? 'Devolución Confirmada' : 'Error';
        $color_jja  = $exito_jja ? '#10b981' : '#ef4444';
        $msg_seg    = htmlspecialchars($mensaje_jja, ENT_QUOTES, 'UTF-8');

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
