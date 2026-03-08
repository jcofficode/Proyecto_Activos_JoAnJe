<?php
// ============================================================
// controllers/PrestamoController_jja.php
// POST /prestamos             <- registrar prestamo (check-out)
// GET  /prestamos             <- listar todos (admin/encargado)
// GET  /prestamos/vencidos    <- prestamos vencidos
// GET  /prestamos/{id}        <- detalle
// GET  /prestamos/usuario/{id}
// GET  /prestamos/activo/{id}
// POST /prestamos/{id}/devolver  <- check-in
// POST /prestamos/{id}/perdido   <- marcar perdido
// POST /prestamos/actualizar-vencidos <- batch cron
// ============================================================

class PrestamoController_jja extends Controller_jja
{
    private PrestamoModel_jja $modelo_jja;

    public function __construct()
    {
        $this->modelo_jja = new PrestamoModel_jja();
    }

    public function manejar_jja(string $metodo_jja, array $segmentos_jja): void
    {
        $payload_jja = Middleware_jja::autenticar_jja();
        $seg0_jja    = $segmentos_jja[0] ?? null;   // id | 'vencidos' | 'usuario' | 'activo' | 'actualizar-vencidos'
        $seg1_jja    = $segmentos_jja[1] ?? null;   // id | 'devolver' | 'perdido'

        if ($metodo_jja === 'GET') {
            $this->manejarGet_jja($payload_jja, $seg0_jja, $seg1_jja);
        } elseif ($metodo_jja === 'POST') {
            $this->manejarPost_jja($payload_jja, $seg0_jja, $seg1_jja);
        } else {
            $this->responder_jja(false, null, 'Metodo HTTP no permitido.', 405);
        }
    }

    private function manejarGet_jja(object $p_jja, ?string $seg0_jja, ?string $seg1_jja): void
    {
        Middleware_jja::autorizar_jja($p_jja, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);

        if ($seg0_jja === 'activos') {
            $this->responder_jja(true, $this->modelo_jja->listarActivos_jja(), 'Prestamos activos actuales.');
        } elseif ($seg0_jja === 'vencidos') {
            $this->responder_jja(true, $this->modelo_jja->listarVencidos_jja(), 'Prestamos vencidos.');
        } elseif ($seg0_jja === 'usuario' && $seg1_jja) {
            if (!$this->validarId_jja($seg1_jja)) $this->responder_jja(false, null, 'ID de usuario invalido.', 400);
            $this->responder_jja(true, $this->modelo_jja->listarPorUsuario_jja((int)$seg1_jja), 'Prestamos del usuario.');
        } elseif ($seg0_jja === 'activo' && $seg1_jja) {
            if (!$this->validarId_jja($seg1_jja)) $this->responder_jja(false, null, 'ID de activo invalido.', 400);
            $this->responder_jja(true, $this->modelo_jja->listarPorActivo_jja((int)$seg1_jja), 'Historial del activo.');
        } elseif ($seg0_jja !== null) {
            if (!$this->validarId_jja($seg0_jja)) $this->responder_jja(false, null, 'ID de prestamo invalido.', 400);
            $prestamo_jja = $this->modelo_jja->buscarPorId_jja((int)$seg0_jja);
            $prestamo_jja
                ? $this->responder_jja(true, $prestamo_jja, 'Prestamo encontrado.')
                : $this->responder_jja(false, null, "Prestamo con ID {$seg0_jja} no encontrado.", 404);
        } else {
            $this->responder_jja(true, $this->modelo_jja->listar_jja(), 'Lista de prestamos.');
        }
    }

    private function manejarPost_jja(object $p_jja, ?string $seg0_jja, ?string $seg1_jja): void
    {
        // POST /prestamos/actualizar-vencidos (solo admin)
        if ($seg0_jja === 'actualizar-vencidos') {
            Middleware_jja::autorizar_jja($p_jja, [Middleware_jja::ROL_ADMIN]);
            $res_jja = $this->modelo_jja->actualizarVencidos_jja();
            $this->responder_jja(true, $res_jja, 'Prestamos vencidos actualizados.');
        }

        // POST /prestamos/{id}/devolver
        if ($seg1_jja === 'devolver') {
            Middleware_jja::autorizar_jja($p_jja, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);
            if (!$this->validarId_jja($seg0_jja)) $this->responder_jja(false, null, 'ID de prestamo invalido.', 400);
            $this->registrarDevolucion_jja((int)$seg0_jja, (int)$p_jja->id);
        }

        // POST /prestamos/{id}/perdido
        if ($seg1_jja === 'perdido') {
            Middleware_jja::autorizar_jja($p_jja, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);
            if (!$this->validarId_jja($seg0_jja)) $this->responder_jja(false, null, 'ID de prestamo invalido.', 400);
            $this->marcarPerdido_jja((int)$seg0_jja, (int)$p_jja->id);
        }

        // POST /prestamos (nuevo prestamo)
        Middleware_jja::autorizar_jja($p_jja, [Middleware_jja::ROL_ADMIN, Middleware_jja::ROL_ENCARGADO]);
        $this->registrarPrestamo_jja((int)$p_jja->id);
    }

    private function registrarPrestamo_jja(int $idEncargado_jja): void
    {
        $body_jja  = $this->obtenerBody_jja();
        $falta_jja = $this->campoFaltante_jja($body_jja, ['id_activo', 'id_usuario']);
        if ($falta_jja) $this->responder_jja(false, null, "El campo '{$falta_jja}' es obligatorio.", 400);

        if (!is_numeric($body_jja['id_activo']) || (int)$body_jja['id_activo'] < 1)
            $this->responder_jja(false, null, 'id_activo debe ser un entero positivo.', 400);
        if (!is_numeric($body_jja['id_usuario']) || (int)$body_jja['id_usuario'] < 1)
            $this->responder_jja(false, null, 'id_usuario debe ser un entero positivo.', 400);

        try {
            $res_jja = $this->modelo_jja->registrar_jja(
                (int)$body_jja['id_activo'],
                (int)$body_jja['id_usuario'],
                $idEncargado_jja,
                $body_jja['observaciones'] ?? null
            );
        } catch (PDOException $e_jja) {
            $msg_full = $e_jja->getMessage();
            $msg_jja = 'No se pudo registrar el prestamo.';
            if (strpos($msg_full, 'SQLSTATE[45000]') !== false) {
                $partes = explode('1644', $msg_full);
                if (count($partes) > 1) {
                    $msg_jja = trim($partes[1]);
                } else {
                    $partes_dos = explode(':', $msg_full);
                    $msg_jja = trim(end($partes_dos));
                }
            } else {
                $msg_jja .= ' ' . $msg_full; // debug fallback
            }
            $this->responder_jja(false, null, $msg_jja, 409);
        }

        $this->responder_jja(true, $res_jja, 'Prestamo registrado correctamente (check-out).', 201);
    }

    private function registrarDevolucion_jja(int $idPrestamo_jja, int $idEncargado_jja): void
    {
        $body_jja = $this->obtenerBody_jja();
        try {
            $res_jja = $this->modelo_jja->registrarDevolucion_jja(
                $idPrestamo_jja,
                $idEncargado_jja,
                $body_jja['observaciones'] ?? null
            );
        } catch (PDOException $e_jja) {
            $msg_full = $e_jja->getMessage();
            $msg_jja = 'No se pudo registrar la devolucion.';
            if (strpos($msg_full, 'SQLSTATE[45000]') !== false) {
                $partes = explode('1644', $msg_full);
                if (count($partes) > 1) {
                    $msg_jja = trim($partes[1]);
                } else {
                    $partes_dos = explode(':', $msg_full);
                    $msg_jja = trim(end($partes_dos));
                }
            } else {
                $msg_jja .= ' ' . $msg_full; // debug fallback
            }
            $this->responder_jja(false, null, $msg_jja, 409);
        }
        $this->responder_jja(true, $res_jja, 'Devolucion registrada correctamente (check-in).');
    }

    private function marcarPerdido_jja(int $idPrestamo_jja, int $idEncargado_jja): void
    {
        $body_jja = $this->obtenerBody_jja();
        $res_jja  = $this->modelo_jja->marcarPerdido_jja(
            $idPrestamo_jja,
            $idEncargado_jja,
            $body_jja['motivo'] ?? 'Activo reportado como perdido.'
        );
        $this->responder_jja(true, $res_jja, 'Activo marcado como perdido. Se genero sancion al usuario.');
    }
}
