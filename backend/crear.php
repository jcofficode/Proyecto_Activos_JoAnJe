<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Crear Base de Datos - bd_JoAnJe_jc</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; background: #f6f8fb; color: #222; padding: 30px; }
    .contenedor { max-width: 820px; margin: 40px auto; background: #fff; padding: 28px; border-radius: 10px; box-shadow: 0 6px 18px rgba(0,0,0,.08); }
    h1 { margin-top: 0; color: #071227; }
    .mensaje { padding: 10px 14px; border-radius: 6px; margin: 8px 0; font-size: 15px; }
    .ok  { background: #e6ffed; color: #065a2c; border-left: 4px solid #22c55e; }
    .err { background: #fff0f0; color: #7a1616; border-left: 4px solid #ef4444; }
    .btn-volver { display: inline-block; margin-top: 20px; padding: 10px 18px; background: #a4ce0c; color: #061021; border-radius: 6px; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <div class="contenedor">
    <h1>🛠 Crear Base de Datos y Tabla</h1>

    <?php
    // 1. Conexión sin base de datos para poder crearla
    $conex_jc = @mysqli_connect("localhost", "root", "");
    if (!$conex_jc) {
        echo "<div class='mensaje err'>Error de conexión MySQL: " . mysqli_connect_error() . "</div>";
        exit;
    }

    // 2. Crear base de datos
    $db_jc = "bd_JoAnJe_jc";
    $crearDb_jc = "CREATE DATABASE IF NOT EXISTS `$db_jc`
                   CHARACTER SET utf8 COLLATE utf8_spanish2_ci";

    if (mysqli_query($conex_jc, $crearDb_jc)) {
        echo "<div class='mensaje ok'>✅ Base de datos <strong>$db_jc</strong> creada o ya existe.</div>";
    } else {
        echo "<div class='mensaje err'>❌ No se pudo crear la base de datos: " . mysqli_error($conex_jc) . "</div>";
        exit;
    }

    // 3. Seleccionar la BD
    if (!mysqli_select_db($conex_jc, $db_jc)) {
        echo "<div class='mensaje err'>❌ Error al seleccionar la BD $db_jc</div>";
        exit;
    }

    // 4. Crear tabla td_usuarios_jc
    $crearTabla_jc = "
    CREATE TABLE IF NOT EXISTS td_usuarios_jc (
        id_jc          INT PRIMARY KEY AUTO_INCREMENT,
        nombre_jc      VARCHAR(120)  NOT NULL,
        correo_jc      VARCHAR(180)  NOT NULL UNIQUE,
        clave_jc       VARCHAR(255)  NOT NULL,
        telefono_jc    VARCHAR(30)   DEFAULT NULL,
        empresa_jc     VARCHAR(150)  DEFAULT NULL,
        fecha_jc       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci
    ";

    if (mysqli_query($conex_jc, $crearTabla_jc)) {
        echo "<div class='mensaje ok'>✅ Tabla <strong>td_usuarios_jc</strong> creada o ya existe.</div>";
    } else {
        echo "<div class='mensaje err'>❌ Error al crear la tabla: " . mysqli_error($conex_jc) . "</div>";
    }

    mysqli_close($conex_jc);
    ?>

    <p style="margin-top:16px;color:#555;">
      Ejecuta este archivo <strong>una sola vez</strong> desde tu servidor local antes de usar la aplicación.
    </p>
    <a class="btn-volver" href="../index.html">← Volver a la Landing</a>
  </div>
</body>
</html>
