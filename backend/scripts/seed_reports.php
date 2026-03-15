<?php
// Script de seed para poblar datos demo útiles para reportes.
require_once __DIR__ . '/../conex.php';

try{
    $pdo_jja->beginTransaction();

    // 1) Roles mínimos
    $roles = ['administrador','encargado','usuario'];
    $stmt = $pdo_jja->prepare("INSERT IGNORE INTO roles_jja (nombre_rol_jja, descripcion_jja) VALUES (:n, :d)");
    foreach($roles as $r){ $stmt->execute([':n'=>$r, ':d'=>"Rol $r"]); }

    // 2) Tipos de activos y politicas
    $tipos = ['Laptop','Proyector','Cable','Herramienta','Cámara'];
    $stmtInsTipo = $pdo_jja->prepare("INSERT IGNORE INTO tipos_activos_jja (nombre_tipo_jja, descripcion_jja) VALUES (:n,:d)");
    foreach($tipos as $t){ $stmtInsTipo->execute([':n'=>$t, ':d'=>"Tipo $t"]); }

    // politicas (one per tipo)
    $stmtTipo = $pdo_jja->query("SELECT id_tipo_jja FROM tipos_activos_jja WHERE estado_registro_jja = 1");
    $stmtInsPol = $pdo_jja->prepare("INSERT IGNORE INTO politicas_prestamo_jja (id_tipo_jja, dias_maximo_jja, max_prestamos_simultaneos_jja, requiere_mismo_dia_jja) VALUES (:tipo, :dias, :maxsim, :mismo)");
    foreach($stmtTipo->fetchAll(PDO::FETCH_ASSOC) as $row){
        $stmtInsPol->execute([':tipo'=>$row['id_tipo_jja'], ':dias'=>7, ':maxsim'=>2, ':mismo'=>0]);
    }

    // 3) Usuarios demo
    $users = [
        ['nombre'=>'Admin','apellido'=>'Demo','cedula'=>'ADM-1','correo'=>'admin@demo.local','rol'=>'administrador'],
        ['nombre'=>'Encargado','apellido'=>'Demo','cedula'=>'ENC-1','correo'=>'enc@demo.local','rol'=>'encargado'],
    ];
    for($i=1;$i<=6;$i++) $users[] = ['nombre'=>'Cliente'.$i,'apellido'=>'Demo','cedula'=>'CLI-'.$i,'correo'=>"cliente{$i}@demo.local",'rol'=>'usuario'];

    $stmtRole = $pdo_jja->prepare("SELECT id_rol_jja FROM roles_jja WHERE nombre_rol_jja = :n LIMIT 1");
    $stmtInsUser = $pdo_jja->prepare("INSERT IGNORE INTO usuarios_jja (nombre_jja, apellido_jja, cedula_jja, correo_jja, contrasena_jja, id_rol_jja) VALUES (:nom,:ape,:ced,:cor,:pass,:rol)");
    foreach($users as $u){
        $stmtRole->execute([':n'=>$u['rol']]); $r = $stmtRole->fetch(PDO::FETCH_ASSOC);
        $pass = password_hash('password123', PASSWORD_BCRYPT);
        $stmtInsUser->execute([':nom'=>$u['nombre'], ':ape'=>$u['apellido'], ':ced'=>$u['cedula'], ':cor'=>$u['correo'], ':pass'=>$pass, ':rol'=>$r['id_rol_jja']]);
    }

    // 4) Activos demo
    $stmtTipos = $pdo_jja->query("SELECT id_tipo_jja, nombre_tipo_jja FROM tipos_activos_jja WHERE estado_registro_jja=1");
    $tiposArr = $stmtTipos->fetchAll(PDO::FETCH_ASSOC);
    $stmtInsActivo = $pdo_jja->prepare("INSERT IGNORE INTO activos_jja (nombre_jja, codigo_qr_jja, id_tipo_jja, ubicacion_jja, descripcion_jja, publicado_jja, estado_jja) VALUES (:nom,:qr,:tipo,:ubi,:desc,1,'disponible')");
    $count = 1;
    foreach($tiposArr as $t){
        for($k=0;$k<3;$k++){
            $name = "{$t['nombre_tipo_jja']} #$count";
            $qr = strtoupper('QR'.bin2hex(random_bytes(3)));
            $stmtInsActivo->execute([':nom'=>$name, ':qr'=>$qr, ':tipo'=>$t['id_tipo_jja'], ':ubi'=>'Bodega', ':desc'=>'Activo demo para reportes']);
            $count++;
        }
    }

    // 5) Crear prestamos demo (varios estados y fechas)
    // Obtener algunos ids de usuario (clientes) y activos
    $clientesStmt = $pdo_jja->query("SELECT id_usuario_jja FROM usuarios_jja WHERE id_rol_jja = (SELECT id_rol_jja FROM roles_jja WHERE nombre_rol_jja='usuario') LIMIT 6");
    $clientes = array_column($clientesStmt->fetchAll(PDO::FETCH_ASSOC),'id_usuario_jja');
    $activosStmt = $pdo_jja->query("SELECT id_activo_jja FROM activos_jja WHERE estado_registro_jja=1 LIMIT 30");
    $activos = array_column($activosStmt->fetchAll(PDO::FETCH_ASSOC),'id_activo_jja');
    $encargadoId = $pdo_jja->query("SELECT id_usuario_jja FROM usuarios_jja WHERE id_rol_jja = (SELECT id_rol_jja FROM roles_jja WHERE nombre_rol_jja='encargado') LIMIT 1")->fetchColumn();

    $stmtInsPrest = $pdo_jja->prepare("INSERT INTO prestamos_jja (id_activo_jja, id_usuario_jja, id_encargado_jja, fecha_prestamo_jja, fecha_limite_jja, fecha_devolucion_jja, estado_prestamo_jja, observaciones_jja) VALUES (:activo,:usuario,:enc,:fprest,:flim,:fdev,:estado,:obs)");
    $now = new DateTimeImmutable('now');
    foreach($clientes as $idx => $cid){
        // cada cliente tendrá 3 préstamos mixtos
        for($j=0;$j<3;$j++){
            $activo = $activos[($idx*3+$j) % count($activos)];
            $daysAgo = rand(1,60);
            $fechaPrest = $now->sub(new DateInterval('P'.$daysAgo.'D'));
            $dur = rand(3,14);
            $fechaLim = $fechaPrest->add(new DateInterval('P'.$dur.'D'));
            // Decide estado
            $estado = 'activo'; $fechaDev = null;
            if(rand(0,100) < 30){ $estado = 'devuelto'; $fechaDev = $fechaLim->add(new DateInterval('P'.rand(0,3).'D')); }
            if(rand(0,100) < 15){ $estado = 'vencido'; }
            $stmtInsPrest->execute([
                ':activo'=>$activo,
                ':usuario'=>$cid,
                ':enc'=>$encargadoId ?: 1,
                ':fprest'=>$fechaPrest->format('Y-m-d H:i:s'),
                ':flim'=>$fechaLim->format('Y-m-d H:i:s'),
                ':fdev'=>$fechaDev ? $fechaDev->format('Y-m-d H:i:s') : null,
                ':estado'=>$estado,
                ':obs'=>'Seed demo'
            ]);
        }
    }

    // 6) Registrar algunos historiales
    $stmtPrestAll = $pdo_jja->query("SELECT id_prestamo_jja, id_activo_jja, id_usuario_jja, estado_prestamo_jja, fecha_prestamo_jja, fecha_devolucion_jja FROM prestamos_jja ORDER BY id_prestamo_jja DESC LIMIT 100");
    $stmtHist = $pdo_jja->prepare("INSERT INTO historial_prestamos_jja (id_prestamo_jja, id_activo_jja, id_usuario_jja, accion_jja, detalles_jja) VALUES (:idp,:ida,:idu,:accion,:det)");
    foreach($stmtPrestAll->fetchAll(PDO::FETCH_ASSOC) as $p){
        $accion = $p['estado_prestamo_jja'] === 'devuelto' ? 'checkin' : 'checkout';
        $stmtHist->execute([':idp'=>$p['id_prestamo_jja'], ':ida'=>$p['id_activo_jja'], ':idu'=>$p['id_usuario_jja'], ':accion'=>$accion, ':det'=>'Registro seed']);
    }

    $pdo_jja->commit();
    echo "OK: seed de reportes insertado\n";
}catch(PDOException $e){
    $pdo_jja->rollBack();
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}

?>
