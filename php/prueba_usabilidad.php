<?php

require_once('cronometro_extraido.php');
session_start();

// CONEXIÓN A BASE DE DATOS
$servername = "localhost";
$username = "DBUSER2025";
$password = "DBPSWD2025";
$dbname = "UO288294_DB";

$db = new mysqli($servername, $username, $password, $dbname);
if ($db->connect_error) {
    die("Error de conexión: " . $db->connect_error);
}
$db->set_charset("utf8");

// GESTIÓN DEL CRONÓMETRO
if (!isset($_SESSION['cronometro_test'])) {
    $_SESSION['cronometro_test'] = new Cronometro();
}
$timer = $_SESSION['cronometro_test'];

// GESTIÓN DE ESTADOS
$estado = 'inicio'; // Estados: inicio, test, observador, fin
if (isset($_POST['estado'])) {
    $estado = $_POST['estado'];
}

$mensaje = "";

// LÓGICA DEL FORMULARIO

// Al entrar al test guardamos los datos del usuario
if ($estado == 'test' && isset($_POST['comenzar'])) {
    $_SESSION['datos_usuario'] = [
        'nombre' => $_POST['nombre'], 
        'profesion' => $_POST['profesion'],
        'edad' => $_POST['edad'],
        'genero' => $_POST['genero'],
        'pericia' => $_POST['pericia'],
        'dispositivo' => $_POST['dispositivo']
    ];
    
    // Arrancamos el cronómetro
    $timer->reiniciar(); // Nos aseguramos de que empiece en 0
    $timer->arrancar();
    $_SESSION['cronometro_test'] = $timer; // Guardamos estado
}

// Al añadir observaciones del facilitador finaliza el test y guardamos todo
elseif ($estado == 'observador' && isset($_POST['terminar'])) {
    // Llegado al apartado de observaciones, paramos el cronómetro
    $timer->parar(); 
    $tiempo_total = $timer->tiempo;
    $_SESSION['cronometro_test'] = $timer;
    
    // Recuperamos datos de usuario
    $u = $_SESSION['datos_usuario'];
    
    // Insertar USUARIO
    $stmt_user = $db->prepare("INSERT INTO USUARIO (profesion, edad, genero, pericia_informatica) VALUES (?, ?, ?, ?)");
    $stmt_user->bind_param("sisi", $u['profesion'], $u['edad'], $u['genero'], $u['pericia']);
    $stmt_user->execute();
    $id_usuario = $db->insert_id;
    $stmt_user->close();
    
    // Dispositivo
    $id_dispositivo = 1; // Por defecto Ordenador
    if ($u['dispositivo'] == 'Tableta') $id_dispositivo = 2;
    if ($u['dispositivo'] == 'Telefono') $id_dispositivo = 3;

    // Procesar respuestas (se concatenan)
    $respuestas_texto = "Respuestas: ";
    for($i=1; $i<=10; $i++) {
        if(isset($_POST["p$i"])) {
            $respuestas_texto .= "[P$i: " . $_POST["p$i"] . "] ";
        }
    }
    $comentarios_finales = $respuestas_texto . "\n|| Opinión: " . $_POST['comentarios'];

    // Insertar Resultado en TEST_USABILIDAD
    $completado = 1; 
    $valoracion = $_POST['valoracion'];
    $propuestas = $_POST['propuestas'];
    $tiempo_int = (int)$tiempo_total;
    
    $stmt_test = $db->prepare("INSERT INTO TEST_USABILIDAD (id_usuario, id_dispositivo, tiempo_completado, completado, comentarios_usuario, propuestas_mejora, valoracion) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt_test->bind_param("iiiissi", $id_usuario, $id_dispositivo, $tiempo_int, $completado, $comentarios_finales, $propuestas, $valoracion);
    
    if($stmt_test->execute()){
        $id_test = $db->insert_id;
        $_SESSION['id_test_creado'] = $id_test; 
        $mensaje = "Prueba guardada";
    } else {
        $mensaje = "Error al guardar: " . $db->error;
    }
    $stmt_test->close();
}
elseif ($estado == 'fin' && isset($_POST['guardar_observacion'])) {
    // Guardar observación del facilitador
    $id_test = $_SESSION['id_test_creado'];
    $comentario_fac = $_POST['observacion_facilitador'];
    
    $stmt_obs = $db->prepare("INSERT INTO OBSERVACION_FACILITADOR (id_test, comentarios_facilitador) VALUES (?, ?)");
    $stmt_obs->bind_param("is", $id_test, $comentario_fac);
    $stmt_obs->execute();
    $stmt_obs->close();
    
    $mensaje = "Proceso finalizado correctamente.";
}
?>
<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="author" content="Hugo Prendes Menéndez" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MotoGP - Prueba de Usabilidad</title>
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link rel="icon" href="../multimedia/favicon_johann_zarco.ico" type="image/x-icon" />
</head>

<body>
    <header>
        <h1><a href="../index.html">MotoGP Desktop</a></h1>
        <nav>
            <a href="../index.html">Inicio</a>
            <a href="../piloto.html">Piloto</a>
            <a href="../circuito.html">Circuito</a>
            <a href="../meteorologia.html">Meteorología</a>
            <a href="../clasificaciones.php">Clasificaciones</a>
            <a href="../juegos.html">Juegos</a>
            <a href="../ayuda.html">Ayuda</a>
        </nav>
    </header>

    <p><a href="../index.html">Inicio</a> >> <a href="../juegos.html">Juegos</a> >> <strong>Prueba Usabilidad</strong></p>

    <main>
        <h2>Prueba de Usabilidad</h2>

        <?php if ($mensaje != ""): ?>
            <p><strong><?php echo $mensaje; ?></strong></p>
        <?php endif; ?>

        <?php if ($estado == 'inicio'): ?>
            <section>
                <h3>Paso 1: Datos del Participante</h3>
                <form action="#" method="post">
                    <input type="hidden" name="estado" value="test" />
                    <fieldset>
                        <legend>Información Demográfica</legend>
                        <p><label>Identificador: <input type="text" name="nombre" required /></label></p>
                        <p><label>Profesión: <input type="text" name="profesion" required /></label></p>
                        <p><label>Edad: <input type="number" name="edad" min="18" max="120" required /></label></p>
                        <p><label>Género: 
                                <select name="genero">
                                    <option value="Hombre">Hombre</option>
                                    <option value="Mujer">Mujer</option>
                                    <option value="Otro">Otro</option>
                                </select>
                        </label></p>
                        <p><label>Pericia Informática (0-10): <input type="number" name="pericia" min="0" max="10" required /></label></p>
                        <p><label>Dispositivo: 
                                <select name="dispositivo">
                                    <option value="Ordenador">Ordenador</option>
                                    <option value="Tableta">Tableta</option>
                                    <option value="Telefono">Teléfono</option>
                                </select>
                        </label></p>
                    </fieldset>
                    <p><button type="submit" name="comenzar">Iniciar Prueba</button></p>
                </form>
            </section>

        <?php elseif ($estado == 'test'): ?>
            <section>
                <h3>Paso 2: Cuestionario</h3>
                <p>Responde a las preguntas buscando la información en la web.</p>
                <form action="#" method="post">
                    <input type="hidden" name="estado" value="observador" />
                    <fieldset>
                        <legend>Preguntas</legend>
                        <p><label>1. Puntos de Johann Zarco en 2024: <input type="number" name="p1" required /></label></p>
                        <p><label>2. Primer equipo de Zarco en MotoGP: <input type="text" name="p2" required /></label></p>
                        <p><label>3. Equipo actual: <input type="text" name="p3" required /></label></p>
                        <p><label>4. ¿Tiene Instagram? <select name="p4"><option value="Si">Sí</option><option value="No">No</option></select></label></p>
                        <p><label>5. Hora de amanecer en el GP de Silverstone 2025: <input type="time" name="p5" required /></label></p>
                        <p><label>6. Habitantes de Towcester (localidad de Silverstone): <input type="number" name="p6" required /></label></p>
                        <p><label>7. ¿Llovió en algún momento el día del GP de Silverstone 2025 de MotoGP? <select name="p7"><option value="Si">Sí</option><option value="No">No</option></select></label></p>
                        <p><label>8. Ganador del GP de Silverstone 2025 de MotoGP: <input type="text" name="p8" required /></label></p>
                        <p><label>9. Tercero en el mundial de MotoGP tras la carrera de Silverstone 2025: <input type="text" name="p9" required /></label></p>
                        <p><label>10. ¿Hay una tarjeta de RedBull en el juego de memoria? <select name="p10"><option value="Si">Sí</option><option value="No">No</option></select></label></p>
                    </fieldset>
                    <fieldset>
                        <legend>Valoración</legend>
                        <p><label>Puntúa la aplicación (0-10): <input type="number" name="valoracion" min="0" max="10" required /></label></p>
                        <p><label>Comentarios adicionales:<br/> <textarea name="comentarios" rows="3" cols="50"></textarea></label></p>
                        <p><label>Propuestas de mejora:<br/> <textarea name="propuestas" rows="3" cols="50"></textarea></label></p>
                    </fieldset>
                    <p><button type="submit" name="terminar">Terminar Prueba</button></p>
                </form>
            </section>

        <?php elseif ($estado == 'observador'): ?>
            <section>
                <h3>Paso 3: Facilitador</h3>
                <form action="#" method="post">
                    <input type="hidden" name="estado" value="fin" />
                    <p><label>Observaciones del facilitador:<br/>
                        <textarea name="observacion_facilitador" rows="5" cols="60" required></textarea>
                    </label></p>
                    <p><button type="submit" name="guardar_observacion">Finalizar</button></p>
                </form>
            </section>

        <?php elseif ($estado == 'fin'): ?>
            <section>
                <h3>¡Prueba completada!</h3>
                <p>Datos guardados.</p>
                <p><a href="prueba_usabilidad.php">Nueva prueba</a></p>
            </section>
        <?php endif; ?>
    </main>
</body>
</html>