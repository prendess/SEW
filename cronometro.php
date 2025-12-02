<?php

session_start();

class Cronometro {
    
    public $tiempo;
    public $inicio;

    public function __construct() {
        $this->tiempo = 0;
        $this->inicio = null;
    }

    public function arrancar() {
        if ($this->inicio === null) {
            $this->inicio = microtime(true);
        }
    }

    public function parar() {
        if ($this->inicio !== null) {
            $tiempo_parada = microtime(true);
            $tiempo_transcurrido = $tiempo_parada - $this->inicio;
            $this->tiempo += $tiempo_transcurrido;
            $this->inicio = null;
        }
    }

    public function mostrar() {
        $segundos_totales = floor($this->tiempo);
        $minutos = floor($segundos_totales / 60);
        $segundos = $segundos_totales % 60;
        $decimas = round(($this->tiempo - $segundos_totales) * 10);
        $salida = sprintf("%02d:%02d.%1d", $minutos, $segundos, $decimas);
        return $salida;
    }

    public function reiniciar() {
        $this->tiempo = 0;
        $this->inicio = null;
    }

}

if (!isset($_SESSION['cronometro'])) {
    $_SESSION['cronometro'] = new Cronometro();
}

$mi_cronometro = $_SESSION['cronometro'];
$mensaje_cronometro = "Pulsa **Arrancar** para empezar a medir el tiempo.";

if (isset($_POST['accion'])) {
    $accion = $_POST['accion'];

    switch ($accion) {
        case 'arrancar':
            $mi_cronometro->arrancar();
            $mensaje_cronometro = "Cronómetro **ARRANCADO**. El tiempo está corriendo...";
            break;
        case 'parar':
            $mi_cronometro->parar();
            $mensaje_cronometro = "Cronómetro **DETENIDO**. Pulsa **Mostrar** para ver el tiempo acumulado.";
            break;
        case 'mostrar':
            $mi_cronometro->parar();
            $mensaje_cronometro = "Tiempo transcurrido: **" . $mi_cronometro->mostrar() . "**";
            break;
        case 'reiniciar':
            $mi_cronometro->reiniciar();
            $mensaje_cronometro = "Cronómetro **REINICIADO** (00:00.0).";
            break;
    }
    
    $_SESSION['cronometro'] = $mi_cronometro;

}

?>

<!-- HTML DEL CRONÓMETRO -->

<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name ="author" content ="Hugo Prendes Menéndez" />
    <meta name ="description" content ="Documento de cronómetro para el proyecto MotoGP Desktop" />
    <meta name ="keywords" content ="MotoGP, Cronómetro, Tiempo, Carreras, PHP" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <title>MotoGP - Cronómetro</title>
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
            <a href="clasificaciones.php" title="Información de clasificaciones">Clasificaciones</a>
            <a href="juegos.html" title="Zona de juegos">Juegos</a>
            <a href="ayuda.html" title="Ayuda y soporte">Ayuda</a>
        </nav>
    </header>

    <p><a href="index.html">Inicio</a> >> <strong>Cronómetro</strong></p>

    <main>
        <article>
            <h2>⏱️ Cronómetro</h2>
            
            <section>
                <h3>Control de Tiempo</h3>
                
                <div>
                    <p><strong>Estado:</strong> <?php echo $mensaje_cronometro; ?></p>

                    <form method="POST" action="cronometro.php">
                        
                        <button type="submit" name="accion" value="arrancar" <?php if ($mi_cronometro->inicio !== null) echo 'disabled'; ?>>Arrancar</button>
                        
                        <button type="submit" name="accion" value="parar" <?php if ($mi_cronometro->inicio === null) echo 'disabled'; ?>>Parar</button>
                        
                        <button type="submit" name="accion" value="mostrar">Mostrar Tiempo</button>

                        <button type="submit" name="accion" value="reiniciar">Reiniciar</button> </form>
                        
                        </form>
                </div>
            </section>
        </article>
    </main>
</body>
</html>