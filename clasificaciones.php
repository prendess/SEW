<?php

class Clasificacion {

    private $documento;
    private $xml;

    public function __construct() {
        $this->documento = 'xml/circuitoEsquema.xml';
    }

    public function consultar() {
        if (file_exists($this->documento)) {
            $this->xml = simplexml_load_file($this->documento);
        } else {
            echo "<p>Error: No se encuentra el archivo XML.</p>";
        }
    }

    public function obtenerGanador() {
        if ($this->xml) {
            $nombre = $this->xml->vencedor->nombre;
            $tiempo = (string)$this->xml->vencedor->tiempo; // A string para manipularlo mejor

            // 1. DateInterval (usado para mostrar la duración con formato mm:ss) falla al procesar milisegundos, 
            // así que los extraemos y los tratamos por separado.

            $milisegundos = '000'; // Valor por defecto
            // Buscamos dígitos (\d+), seguidos de un punto (\.), seguidos de más dígitos capturados (\d+) y una S.
            if (preg_match('/\d+\.(\d+)S/', $tiempo, $coincidencias)) {
                $milisegundos = $coincidencias[1]; // Donde se almacena la parte que coincide con el patrón (lo que hay entre paréntesis)
            }

            $tiempoLimpio = preg_replace('/\.\d+/', '', $tiempo); // De la misma forma, cogemos los milisegundos y los eliminamos del string original.

            try {
                $duracion = new DateInterval($tiempoLimpio);
                $tiempoFormateado = $duracion->format('%i:%S') . '.' . $milisegundos;

                echo "<section>";
                echo "<h3>Ganador de la carrera</h3>";
                echo "<p><strong>Piloto:</strong> " . $nombre . "</p>";
                echo "<p><strong>Tiempo:</strong> " . $tiempoFormateado . "</p>";
                echo "</section>";
            } catch (Exception $e) {
                echo "<p>Error al procesar el tiempo.</p>";
            }
        }
    }

    public function obtenerClasificacion() {
        if ($this->xml) {
            echo "<section>";
            echo "<h3>Clasificación del Mundial</h3>";
            echo "<table>";
            echo "<caption>Tabla de puntuaciones tras el GP de Silverstone</caption>";
            echo "<thead>";
            echo "<tr>";
            echo "<th scope='col'>Posición</th>";
            echo "<th scope='col'>Piloto</th>";
            echo "<th scope='col'>Puntos</th>";
            echo "</tr>";
            echo "</thead>";
            echo "<tbody>";

            // Iteración sobre los elementos del XML
            foreach ($this->xml->clasificacion->posicion as $posicion) {
                echo "<tr>";
                echo "<td>" . $posicion->puesto . "</td>";
                echo "<td>" . $posicion->nombre . "</td>";
                echo "<td>" . $posicion->puntosMundial . "</td>";
                echo "</tr>";
            }

            echo "</tbody>";
            echo "</table>";
            echo "</section>";
        }
    }

}

$clasificacion = new Clasificacion();
$clasificacion->consultar();

?>


<!DOCTYPE HTML>
<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <meta name ="author" content ="Hugo Prendes Menéndez" />
    <meta name ="description" content ="Documento de clasificaciones proyecto MotoGP Desktop" />
    <meta name ="keywords" content ="MotoGP, Motor, Moto, Carreras, Circuito, Piloto, Deporte, Ciclomotor, Competición, Temporada, Velocidad, Ayuda, Clasificaciones, Juegos, Meteorología" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <title>MotoGP - Clasificaciones</title>
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="icon" href="multimedia/favicon_johann_zarco.ico" type="image/x-icon">
</head>

<body>
    <header>
        <h1><a href="index.html" title="Volver a la página principal">MotoGP Desktop</a></h1>
        <nav>
            <a href="index.html" title="Página de inicio">Inicio</a>
            <a href="piloto.html" title="Información del piloto">Piloto</a>
            <a href="circuito.html" title="Información del circuito">Circuito</a>
            <a href="meteorologia.html" title="Previsión meteorológica">Meteorología</a>
            <a href="clasificaciones.php" title="Información de clasificaciones" class="active">Clasificaciones</a>
            <a href="juegos.html" title="Zona de juegos">Juegos</a>
            <a href="ayuda.html" title="Ayuda y soporte">Ayuda</a>
        </nav>
    </header>

    <p><a href="index.html">Inicio</a> >> <strong>Clasificaciones</strong></p>
    
    <main>        
        <h2>Clasificaciones de MotoGP-Desktop</h2>
        
        <?php
            $clasificacion->obtenerGanador();
            $clasificacion->obtenerClasificacion();
        ?>
    </main>
</body>
</html>