class Memoria {

    constructor() {
        this.primera_carta = null;
        this.segunda_carta = null;
        this.barajarCartas();
        this.tablero_bloqueado = false;
        this.cronometro = new Cronometro();
        this.cronometro.arrancar();
    }

    voltearCarta(carta) {
        if (this.tablero_bloqueado) return;
        if (carta.getAttribute('data-estado') === 'revelada') return;
        if (carta.getAttribute('data-estado') === 'volteada') return;

        carta.setAttribute('data-estado', 'volteada');

        if (this.primera_carta === null) {
            this.primera_carta = carta;
        } else {
            this.segunda_carta = carta;
            this.comprobarPareja();
        }
    }

    barajarCartas() {
        var tablero = document.querySelector('main');
        var cartas = document.querySelectorAll('article');
        for (var i = 0; i < cartas.length; i++) {   
            var posicionAleatoria = Math.floor(Math.random() * cartas.length);
            tablero.appendChild(cartas[posicionAleatoria]);
        }   
    }

    reiniciarAtributos() {
        this.tablero_bloqueado = false;
        this.primera_carta = null;
        this.segunda_carta = null;
    }

    deshabilitarCartas() {
        this.primera_carta.setAttribute('data-estado', 'revelada');
        this.segunda_carta.setAttribute('data-estado', 'revelada');
        this.comprobarJuego();
        this.reiniciarAtributos();
    }

    comprobarJuego() {
        var cartas = document.querySelectorAll('article');
        var todasReveladas = true;
        for (var i = 0; i < cartas.length; i++) {
            if (cartas[i].getAttribute('data-estado') !== 'revelada') {
                todasReveladas = false;
                break;
            }
        }

        if (todasReveladas) {
            this.cronometro.parar();
            // Para que no salga antes de girar la última tarjeta
            setTimeout(() => {
                alert("¡Enhorabuena! ¡Has ganado!");
            }, 500);
        }
    }

    cubrirCartas() {
        this.tablero_bloqueado = true;
        // Delay para que el jugador pueda ver las cartas antes de darles la vuelta de nuevo
        setTimeout(() => {
            this.primera_carta.removeAttribute('data-estado');
            this.segunda_carta.removeAttribute('data-estado');
            this.reiniciarAtributos();
        }, 1500);
    }

    comprobarPareja() {
        // La imagen está en el segundo hijo del artículo (el primero es un h3)
        let valor1 = this.primera_carta.children[1].getAttribute("src");
        let valor2 = this.segunda_carta.children[1].getAttribute("src");
        (valor1 === valor2) ? this.deshabilitarCartas() : this.cubrirCartas();
    }

}