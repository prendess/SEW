<?php
    require_once('Configuracion.php');
    $config = new Configuracion();

    // Lógica de los botones
    if (isset($_POST['reiniciar'])) {
        $config->reiniciarDatos();
    }
    if (isset($_POST['borrar_bd'])) {
        $config->borrarBaseDatos();
    }
    if (isset($_POST['exportar'])) {
        $config->exportarCSV();
    }
?>
<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="author" content="Hugo Prendes Menéndez" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MotoGP - Configuración BD</title>
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link rel="icon" href="../multimedia/favicon_johann_zarco.ico" type="image/x-icon">
</head>

<body>
    <header>
        <h1><a href="../index.html" title="Volver a la página principal">MotoGP Desktop</a></h1>
        <nav>
            <a href="../index.html" title="Página de inicio">Inicio</a>
            <a href="../piloto.html" title="Información del piloto">Piloto</a>
            <a href="../circuito.html" title="Información del circuito">Circuito</a>
            <a href="../meteorologia.html" title="Previsión meteorológica">Meteorología</a>
            <a href="../clasificaciones.php" title="Información de clasificaciones">Clasificaciones</a>
            <a href="../juegos.html" title="Zona de juegos" class="active">Juegos</a>
            <a href="../ayuda.html" title="Ayuda y soporte">Ayuda</a>
        </nav>
    </header>

    <p><a href="index.html">Inicio</a> >> <a href="juegos.html">Juegos</a> >> <strong>Configuración BD para pruebas</strong></p>

    <main>
        <h2>Configuración de la Base de Datos</h2>
        
        <section>
            <h3>Gestión de Datos</h3>
            <p>Selecciona una operación para realizar sobre la base de datos de pruebas de usabilidad.</p>
            
            <form action="#" method="post">
                <p>
                    <label>Borrar datos de pruebas (mantiene tablas):</label>
                    <button type="submit" name="reiniciar">Reiniciar Base de Datos</button>
                </p>
                
                <p>
                    <label>Exportar datos actuales a CSV:</label>
                    <button type="submit" name="exportar">Exportar Datos (.csv)</button>
                </p>

                <p>
                    <label>¡PELIGRO!</label> 
                    <label>Borrar base de datos completa:</label>
                    <button type="submit" name="borrar_bd">Eliminar Base de Datos</button>
                </p>
            </form>
        </section>
    </main>
</body>
</html>