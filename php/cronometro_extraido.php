

<?php
class Cronometro {

    // Esta clase es idéntica a la de cronometro.php, pero extraida a un fichero propio. Se podría usar 
    // la misma para ambos, pero el guion de la P10 pide incluir el código html en el mismo fichero, 
    // así que lo hago así para no contradecirlo.
    
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
?>