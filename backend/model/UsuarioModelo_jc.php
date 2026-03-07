<?php


require_once __DIR__ . '/../conex.php';

class UsuarioModelo_jc {

    private $conexion_jc;

    public function __construct() {
        global $pdo_jc;
        $this->conexion_jc = $pdo_jc;
    }

    // Verifica si ya existe un usuario con ese correo
    public function existeCorreo_jc(string $correo_jc): bool {
        $sql_jc = "SELECT id_jc FROM td_usuarios_jc WHERE correo_jc = :correo_jc LIMIT 1";
        $stmt_jc = $this->conexion_jc->prepare($sql_jc);
        $stmt_jc->execute([':correo_jc' => $correo_jc]);
        return $stmt_jc->fetch() !== false;
    }

    // Registra un nuevo usuario y devuelve la clave temporal generada
    public function registrarUsuario_jc(
        string $nombre_jc,
        string $correo_jc,
        string $telefono_jc = '',
        string $empresa_jc  = ''
    ): array {

        if ($this->existeCorreo_jc($correo_jc)) {
            return ['exito' => false, 'mensaje' => 'Ya existe una cuenta con ese correo.'];
        }

        // Generar clave temporal de 8 caracteres
        $clave_temporal_jc = $this->generarClave_jc();

        $sql_jc = "INSERT INTO td_usuarios_jc
                    (nombre_jc, correo_jc, clave_jc, telefono_jc, empresa_jc)
                   VALUES
                    (:nombre_jc, :correo_jc, :clave_jc, :telefono_jc, :empresa_jc)";

        $stmt_jc = $this->conexion_jc->prepare($sql_jc);
        $stmt_jc->execute([
            ':nombre_jc'   => trim($nombre_jc),
            ':correo_jc'   => trim($correo_jc),
            ':clave_jc'    => $clave_temporal_jc,   
            ':telefono_jc' => trim($telefono_jc),
            ':empresa_jc'  => trim($empresa_jc),
        ]);

        return [
            'exito'   => true,
            'mensaje' => 'Usuario registrado correctamente.',
            'clave'   => $clave_temporal_jc,
            'nombre'  => trim($nombre_jc),
            'correo'  => trim($correo_jc),
        ];
    }

    // Valida credenciales para login
    public function iniciarSesion_jc(string $correo_jc, string $clave_jc): array {
        $sql_jc = "SELECT id_jc, nombre_jc, correo_jc, clave_jc
                   FROM td_usuarios_jc
                   WHERE correo_jc = :correo_jc
                   LIMIT 1";

        $stmt_jc = $this->conexion_jc->prepare($sql_jc);
        $stmt_jc->execute([':correo_jc' => trim($correo_jc)]);
        $usuario_jc = $stmt_jc->fetch();

        if (!$usuario_jc) {
            return ['exito' => false, 'mensaje' => 'Correo no encontrado.'];
        }

        if ($usuario_jc['clave_jc'] !== trim($clave_jc)) {
            return ['exito' => false, 'mensaje' => 'Clave incorrecta.'];
        }

        return [
            'exito'   => true,
            'mensaje' => 'Sesión iniciada correctamente.',
            'nombre'  => $usuario_jc['nombre_jc'],
            'correo'  => $usuario_jc['correo_jc'],
        ];
    }

    // Genera una clave temporal aleatoria
    private function generarClave_jc(int $longitud_jc = 8): string {
        $caracteres_jc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        $clave_jc = '';
        for ($i = 0; $i < $longitud_jc; $i++) {
            $clave_jc .= $caracteres_jc[random_int(0, strlen($caracteres_jc) - 1)];
        }
        return $clave_jc;
    }
}
