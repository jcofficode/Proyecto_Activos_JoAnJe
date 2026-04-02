<?php
// ============================================================
// services/CorreoService_jja.php - PHPMailer SMTP - JoAnJe Coders
// Basado en el CorreoModelo_jc del proyecto GitHub
// ============================================================

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class CorreoService_jja
{
    private PHPMailer $mailer_jja;

    public function __construct()
    {
        $this->mailer_jja = new PHPMailer(true);
        $this->configurar_jja();
    }

    private function configurar_jja(): void
    {
        $this->mailer_jja->isSMTP();
        $this->mailer_jja->SMTPDebug  = SMTP::DEBUG_OFF;
        $this->mailer_jja->Timeout    = 10; // Evita que se quede infinitamente cargando en Railway
        $hostOriginal = $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com';
        // Volvemos a usar el dominio original, pero obligaremos al socket a usar IPv4
        $this->mailer_jja->Host       = $hostOriginal;
        $this->mailer_jja->SMTPAuth   = true;
        $this->mailer_jja->Username   = $_ENV['SMTP_USER']   ?? '';
        $this->mailer_jja->Password   = $_ENV['SMTP_PASS']   ?? '';
        
        // Forzando puerto 587 y TLS
        $this->mailer_jja->Port       = 587;
        $this->mailer_jja->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        
        // El truco definitivo: Forzar el origen a IPv4 (0.0.0.0) para que evada los huecos de IPv6
        $this->mailer_jja->SMTPOptions = array(
            'socket' => array(
                'bindto' => '0.0.0.0:0'
            ),
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );
        $this->mailer_jja->CharSet    = 'UTF-8';
        $this->mailer_jja->isHTML(true);

        $from_jja = $_ENV['MAIL_FROM'] ?? $this->mailer_jja->Username;
        $name_jja = $_ENV['MAIL_NAME'] ?? 'JoAnJe Coders';
        $this->mailer_jja->setFrom($from_jja, $name_jja);
        $this->mailer_jja->addReplyTo($from_jja, $name_jja);
    }

    /**
     * Envia la clave temporal al nuevo usuario.
     * Retorna ['exito' => bool, 'mensaje' => string]
     */
    public function enviarClaveTemporal_jja(
        string $destinatario_jja,
        string $nombre_jja,
        string $codigoTemporal_jja
    ): array {
        $destinatario_jja = filter_var(trim($destinatario_jja), FILTER_SANITIZE_EMAIL);
        if (!filter_var($destinatario_jja, FILTER_VALIDATE_EMAIL)) {
            return ['exito' => false, 'mensaje' => 'Correo de destino no valido.'];
        }

        try {
            $this->mailer_jja->clearAddresses();
            $this->mailer_jja->addAddress($destinatario_jja);
            $this->mailer_jja->Subject = '🔑 Tu clave de acceso — Sistema JoAnJe Coders';
            $this->mailer_jja->Body    = $this->plantillaClaveTemporal_jja($nombre_jja, $codigoTemporal_jja);
            $this->mailer_jja->AltBody = "Hola {$nombre_jja}, tu clave temporal es: {$codigoTemporal_jja}. Deberas cambiarla al iniciar sesion.";
            $this->mailer_jja->send();
            return ['exito' => true, 'mensaje' => "Correo enviado a {$destinatario_jja}"];
        } catch (Exception $e_jja) {
            return ['exito' => false, 'mensaje' => $this->mailer_jja->ErrorInfo ?: $e_jja->getMessage()];
        }
    }

    /**
     * Envia alerta de prestamo proximo a vencer.
     */
    public function enviarAlertaVencimiento_jja(
        string $destinatario_jja,
        string $nombre_jja,
        string $activo_jja,
        string $fechaLimite_jja
    ): array {
        try {
            $this->mailer_jja->clearAddresses();
            $this->mailer_jja->addAddress($destinatario_jja);
            $this->mailer_jja->Subject = '⚠️ Prestamo por vencer — ' . $activo_jja;
            $this->mailer_jja->Body    = $this->plantillaAlertaVencimiento_jja($nombre_jja, $activo_jja, $fechaLimite_jja);
            $this->mailer_jja->AltBody = "Hola {$nombre_jja}, el prestamo de '{$activo_jja}' vence el {$fechaLimite_jja}.";
            $this->mailer_jja->send();
            return ['exito' => true, 'mensaje' => 'Alerta enviada.'];
        } catch (Exception $e_jja) {
            return ['exito' => false, 'mensaje' => $e_jja->getMessage()];
        }
    }

    // ── Plantillas HTML ─────────────────────────────────────
    private function plantillaClaveTemporal_jja(string $nombre_jja, string $codigo_jja): string
    {
        return "
        <div style='font-family:Inter,Arial,sans-serif;background:#f4f6fb;padding:32px;'>
          <div style='max-width:520px;margin:0 auto;background:#fff;border-radius:12px;
                      border-top:5px solid #ff9800;box-shadow:0 6px 24px rgba(30,10,74,.09);padding:32px;'>
            <div style='text-align:center;margin-bottom:20px;'><span style='font-size:40px;'>🔐</span></div>
            <h2 style='color:#1e1e2e;margin-top:0;text-align:center;'>Bienvenido al Sistema, {$nombre_jja}</h2>
            <p style='color:#374151;line-height:1.6;'>
              Tu cuenta ha sido creada. Usa la siguiente <strong>clave temporal</strong> para ingresar.
              El sistema te pedira que establezcas una nueva contrasena al iniciar sesion.
            </p>
            <div style='background:linear-gradient(135deg,rgba(255,152,0,.1),rgba(156,39,176,.1));
                        border:2px dashed #ff9800;border-radius:10px;
                        padding:20px;text-align:center;margin:24px 0;'>
              <p style='margin:0 0 6px;color:#555;font-size:13px;text-transform:uppercase;letter-spacing:.08em;'>
                Clave temporal de un solo uso
              </p>
              <span style='font-size:34px;font-weight:900;font-family:monospace;letter-spacing:.25em;
                           background:linear-gradient(135deg,#ff9800,#9c27b0);
                           -webkit-background-clip:text;-webkit-text-fill-color:transparent;'>
                {$codigo_jja}
              </span>
            </div>
            <p style='color:#6b7280;font-size:13px;'>
              Ingresa con tu <strong>cedula</strong> y esta clave. Luego estableceras tu contrasena definitiva.<br>
              Esta clave es de <strong>uso unico</strong>.
            </p>
            <hr style='border:none;border-top:1px solid #e5e7eb;margin:24px 0;'>
            <p style='color:#9ca3af;font-size:12px;text-align:right;margin:0;'>
              Sistema de Gestion de Activos — JoAnJe Coders · Universidad Nueva Esparta
            </p>
          </div>
        </div>";
    }

    private function plantillaAlertaVencimiento_jja(string $nombre_jja, string $activo_jja, string $fecha_jja): string
    {
        return "
        <div style='font-family:Inter,Arial,sans-serif;background:#f4f6fb;padding:32px;'>
          <div style='max-width:520px;margin:0 auto;background:#fff;border-radius:12px;
                      border-top:5px solid #ef4444;box-shadow:0 6px 24px rgba(30,10,74,.09);padding:32px;'>
            <div style='text-align:center;margin-bottom:20px;'><span style='font-size:40px;'>⏰</span></div>
            <h2 style='color:#1e1e2e;margin-top:0;text-align:center;'>Recordatorio de Devolucion</h2>
            <p style='color:#374151;line-height:1.6;'>
              Hola <strong>{$nombre_jja}</strong>, tienes un prestamo proximo a vencer:
            </p>
            <div style='background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:16px 0;'>
              <p style='margin:0;color:#991b1b;font-size:15px;'>
                <strong>Activo:</strong> {$activo_jja}<br>
                <strong>Fecha limite:</strong> {$fecha_jja}
              </p>
            </div>
            <p style='color:#6b7280;font-size:13px;'>
              Por favor devuelve el activo antes de la fecha indicada para evitar sanciones.
            </p>
            <hr style='border:none;border-top:1px solid #e5e7eb;margin:24px 0;'>
            <p style='color:#9ca3af;font-size:12px;text-align:right;'>
              Sistema de Gestion de Activos — JoAnJe Coders
            </p>
          </div>
        </div>";
    }
}
