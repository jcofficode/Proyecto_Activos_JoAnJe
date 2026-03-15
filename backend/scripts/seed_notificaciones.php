<?php
require_once __DIR__ . '/../conex.php';

try{
    $pdo_jja->beginTransaction();

    // Obtener algunos usuarios (clientes)
    $usuariosStmt = $pdo_jja->query("SELECT id_usuario_jja, nombre_jja, apellido_jja FROM usuarios_jja WHERE estado_registro_jja = 1 LIMIT 6");
    $usuarios = $usuariosStmt->fetchAll(PDO::FETCH_ASSOC);

    // Obtener algunos prestamos para relacionar (si existen)
    $prestStmt = $pdo_jja->query("SELECT id_prestamo_jja FROM prestamos_jja ORDER BY id_prestamo_jja DESC LIMIT 10");
    $prestamos = array_column($prestStmt->fetchAll(PDO::FETCH_ASSOC),'id_prestamo_jja');

    $ins = $pdo_jja->prepare("INSERT INTO notificaciones_jja (id_usuario_jja, id_prestamo_jja, tipo_notificacion_jja, titulo_jja, mensaje_jja, leida_jja, enviada_correo_jja) VALUES (:idu, :idp, :tipo, :titulo, :msg, :leida, :env)");

    $count = 0;
    foreach($usuarios as $u){
        // Vencimiento próximo
        $ins->execute([
            ':idu'=>$u['id_usuario_jja'],
            ':idp'=>$prestamos[$count % max(1,count($prestamos))] ?? null,
            ':tipo'=>'vencimiento_proximo',
            ':titulo'=>'Préstamo por vencer',
            ':msg'=>"Tu préstamo está por vencer en 24 horas. Por favor coordina la devolución.",
            ':leida'=>0,
            ':env'=>0
        ]);

        // Informativo (leído)
        $ins->execute([
            ':idu'=>$u['id_usuario_jja'],
            ':idp'=>null,
            ':tipo'=>'informativo',
            ':titulo'=>'Bienvenido al sistema',
            ':msg'=>'Notificación de bienvenida y recordatorio de políticas de préstamo.',
            ':leida'=>1,
            ':env'=>0
        ]);

        $count++;
        if($count>4) break;
    }

    // Crear notificación de devolucion confirmada para un usuario admin/client demo si existe
    if(!empty($prestamos)){
        $ins->execute([
            ':idu'=>$usuarios[0]['id_usuario_jja'] ?? 1,
            ':idp'=>$prestamos[0],
            ':tipo'=>'devolucion_confirmada',
            ':titulo'=>'Devolución confirmada',
            ':msg'=>'Se confirmó la devolución del activo. Gracias.',
            ':leida'=>0,
            ':env'=>0
        ]);
    }

    $pdo_jja->commit();
    echo "OK: notificaciones seed insertadas\n";
}catch(PDOException $e){
    $pdo_jja->rollBack();
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}

?>
