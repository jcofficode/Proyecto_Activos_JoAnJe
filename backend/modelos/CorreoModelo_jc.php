<?php


require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class CorreoModelo_jc {

    private $mailer_jc;

    public function __construct() {
        if (file_exists(__DIR__ . '/../config/configuracion.php')) {
            require_once __DIR__ . '/../config/configuracion.php';
        }

        $this->mailer_jc = new PHPMailer(true);
        $this->configurarMailer_jc();
    }

    private function configurarMailer_jc(): void {
        try {
            $this->mailer_jc->isSMTP();
            $this->mailer_jc->SMTPDebug  = SMTP::DEBUG_OFF;
            $this->mailer_jc->Host       = defined('SMTP_HOST')   ? SMTP_HOST   : 'smtp.gmail.com';
            $this->mailer_jc->SMTPAuth   = true;
            $this->mailer_jc->Username   = defined('SMTP_USER')   ? SMTP_USER   : '';
            $this->mailer_jc->Password   = defined('SMTP_PASS')   ? SMTP_PASS   : '';
            $this->mailer_jc->SMTPSecure = defined('SMTP_SECURE') ? SMTP_SECURE : PHPMailer::ENCRYPTION_SMTPS;
            $this->mailer_jc->Port       = defined('SMTP_PORT')   ? SMTP_PORT   : 465;
            $this->mailer_jc->CharSet    = 'UTF-8';
            $this->mailer_jc->isHTML(true);

            $remitente_jc = defined('MAIL_FROM') ? MAIL_FROM : $this->mailer_jc->Username;
            $nombre_jc    = defined('MAIL_NAME') ? MAIL_NAME : 'JoAnJe Coders';
            $this->mailer_jc->setFrom($remitente_jc, $nombre_jc);
            $this->mailer_jc->addReplyTo($remitente_jc, $nombre_jc);
        } catch (Exception $e_jc) {
            // Silenciar error de configuración inicial
        }
    }

    /**
     * Envía la clave temporal al usuario recién registrado.
     *
     * NOTA: Se acepta CUALQUIER dominio de correo válido (Gmail, Outlook, Yahoo,
     * correos corporativos, universitarios, etc.). La única validación es que el
     * correo tenga formato RFC válido (usuario@dominio.tld).
     * No existe restricción de dominio — filter_var valida el formato, no el dominio.
     */
    public function enviarClaveTemporal_jc(
        string $destinatario_jc,
        string $nombre_jc,
        string $clave_jc
    ): array {

        $destinatario_jc = filter_var(trim($destinatario_jc), FILTER_SANITIZE_EMAIL);

        if (!filter_var($destinatario_jc, FILTER_VALIDATE_EMAIL)) {
            return ['exito' => false, 'mensaje' => 'Correo no válido.'];
        }

        $asunto_jc    = '🔑 Tu clave de acceso al Demo — JoAnJe Coders';
        $contenido_jc = $this->plantillaClave_jc($nombre_jc, $clave_jc);

        try {
            $this->mailer_jc->clearAddresses();
            $this->mailer_jc->addAddress($destinatario_jc);
            $this->mailer_jc->Subject = $asunto_jc;
            $this->mailer_jc->Body    = $contenido_jc;
            $this->mailer_jc->AltBody = "Hola $nombre_jc, tu clave temporal de acceso es: $clave_jc";
            $this->mailer_jc->send();

            return ['exito' => true, 'mensaje' => "Correo enviado a $destinatario_jc"];
        } catch (Exception $e_jc) {
            return ['exito' => false, 'mensaje' => $this->mailer_jc->ErrorInfo ?: $e_jc->getMessage()];
        }
    }

    // Plantilla HTML del correo de bienvenida con la clave — paleta naranja/morado
    private function plantillaClave_jc(string $nombre_jc, string $clave_jc): string {
        return "
        <div style='font-family:Inter,Arial,sans-serif;background:#f4f6fb;padding:32px;'>
          <div style='max-width:520px;margin:0 auto;background:#fff;border-radius:12px;
                      border-top:5px solid #ff6b35;box-shadow:0 6px 24px rgba(30,10,74,.09);padding:32px;'>

            <div style='text-align:center;margin-bottom:20px;'><span style='font-size:40px;'>💻</span></div>
            <h2 style='color:#1e1e2e;margin-top:0;text-align:center;'>¡Bienvenido al Demo, {$nombre_jc}! 🎉</h2>

            <p style='color:#374151;line-height:1.6;'>
              Tu solicitud fue recibida. Hemos generado una <strong>clave temporal</strong>
              para que puedas acceder al demo de nuestro Sistema de Gestión de Activos.
            </p>

            <div style='background:linear-gradient(135deg,rgba(255,107,53,.08),rgba(123,47,255,.08));
                        border:2px dashed #ff6b35;border-radius:10px;
                        padding:20px;text-align:center;margin:24px 0;'>
              <p style='margin:0 0 6px;color:#555;font-size:13px;text-transform:uppercase;letter-spacing:.08em;'>
                Tu clave de acceso
              </p>
              <span style='font-size:32px;font-weight:900;font-family:monospace;letter-spacing:.2em;
                           background:linear-gradient(135deg,#ff6b35,#7b2fff);
                           -webkit-background-clip:text;-webkit-text-fill-color:transparent;'>
                {$clave_jc}
              </span>
            </div>

            <p style='color:#6b7280;font-size:13px;'>
              Ingresa con tu correo y esta clave en la pantalla de acceso.<br>
              Esta clave es de uso único para el demo.
            </p>

            <hr style='border:none;border-top:1px solid #e5e7eb;margin:24px 0;'>
            <p style='color:#9ca3af;font-size:12px;text-align:right;margin:0;'>
              © JoAnJe Coders — Universidad Nueva Esparta
            </p>
          </div>
        </div>";
    }
}
