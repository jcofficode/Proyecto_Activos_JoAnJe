<?php
// seed_real_data.php — Inserta activos y productos de ejemplo 'reales' en la BD
require_once __DIR__ . '/conex.php';

echo "Iniciando seed de datos reales...\n";

$pdo = $pdo_jja;

// Encontrar una empresa para asignar productos (fallback al primer usuario)
$stmt = $pdo->prepare("SELECT u.id_usuario_jja FROM usuarios_jja u JOIN roles_jja r ON u.id_rol_jja = r.id_rol_jja WHERE r.nombre_rol_jja = 'empresa' LIMIT 1");
$stmt->execute();
$empresaId = $stmt->fetchColumn();
if (!$empresaId) {
    $stmt = $pdo->query("SELECT id_usuario_jja FROM usuarios_jja LIMIT 1");
    $empresaId = $stmt->fetchColumn();
}

// Obtener tipos disponibles
$tipos = $pdo->query("SELECT id_tipo_jja FROM tipos_activos_jja WHERE estado_registro_jja = 1")->fetchAll(PDO::FETCH_COLUMN);
if (empty($tipos)) {
    echo "No hay tipos de activos. Ejecuta crear.php primero para poblar roles/tipos.\n";
    exit(1);
}

function genQR() {
    try { return 'ACTV-' . strtoupper(bin2hex(random_bytes(4))); }
    catch (Exception $e) { return 'ACTV-' . strtoupper(uniqid()); }
}

$activos = [
    ['Laptop Dell Inspiron 15', 'Laboratorio de Computación', 'Portátil para uso en clases y pruebas.'],
    ['Proyector Epson X200', 'Aula 3', 'Videobeam para presentaciones.'],
    ['Impresora HP LaserJet', 'Oficina Central', 'Impresora de alto volumen.'],
    ['Cámara Canon EOS', 'Departamento Multimedia', 'Cámara para proyectos audiovisuales.'],
    ['Kit de Herramientas', 'Bodega', 'Incluye destornilladores y multímetro.'],
    ['Monitor LG 24"', 'Sala de Diseño', 'Monitor Full HD para estaciones de trabajo.'],
    ['Teclado Mecánico', 'Taller', 'Teclado para pruebas y reposiciones.'],
    ['Router Cisco', 'Sala de Redes', 'Equipo de red para laboratorio.']
];

$insert = $pdo->prepare("INSERT INTO activos_jja (nombre_jja, codigo_qr_jja, codigo_nfc_jja, id_tipo_jja, ubicacion_jja, descripcion_jja) VALUES (:nombre, :qr, :nfc, :tipo, :ubicacion, :descripcion)");
$countAct = 0;
foreach ($activos as $a) {
    $nombre = $a[0];
    $ubic = $a[1];
    $desc = $a[2];
    $qr = genQR();
    $nfc = null;
    $tipo = $tipos[array_rand($tipos)];
    try {
        $insert->execute([':nombre'=>$nombre, ':qr'=>$qr, ':nfc'=>$nfc, ':tipo'=>$tipo, ':ubicacion'=>$ubic, ':descripcion'=>$desc]);
        $id = $pdo->lastInsertId();
        echo "Activo insertado: ID={$id} {$nombre} (QR={$qr})\n";
        $countAct++;
    } catch (PDOException $e) {
        echo "Error al insertar activo '{$nombre}': " . $e->getMessage() . "\n";
    }
}

// Insertar productos marketplace simples
$productos = [
    ['Bolsa de cuadernos', 'Paquete de 10 cuadernos A4', 12.50, 20],
    ['Pendrive 32GB', 'USB para almacenamiento', 8.99, 50],
    ['Proyector portátil', 'Proyector ALTA BRILLO', 45.00, 5],
    ['Micrófono USB', 'Micrófono para grabaciones', 22.00, 10],
    ['Kit de limpieza', 'Kit para mantenimiento de hardware', 5.00, 30]
];

$insProd = $pdo->prepare("INSERT INTO productos_jja (id_empresa_jja, id_categoria_jja, nombre_jja, descripcion_jja, precio_jja, stock_jja, imagenes_jja) VALUES (:empresa, :categoria, :nombre, :descripcion, :precio, :stock, :imagenes)");
$countProd = 0;
foreach ($productos as $p) {
    try {
        $insProd->execute([
            ':empresa' => $empresaId,
            ':categoria' => null,
            ':nombre' => $p[0],
            ':descripcion' => $p[1],
            ':precio' => number_format($p[2],2,'.',''),
            ':stock' => (int)$p[3],
            ':imagenes' => null
        ]);
        echo "Producto insertado: " . $p[0] . "\n";
        $countProd++;
    } catch (PDOException $e) {
        echo "Error al insertar producto '{$p[0]}': " . $e->getMessage() . "\n";
    }
}

echo "\nSeed completado: Activos insertados={$countAct}, Productos insertados={$countProd}\n";
echo "Puedes revisar /api/v1/activos y /api/v1/productos en el navegador o via curl.\n";

return 0;
