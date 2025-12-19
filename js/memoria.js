class Memoria {

    constructor() {
        this.tablero_bloqueado = false;
        this.primera_carta = null;
        this.segunda_carta = null;
    }

    voltearCarta(carta) {
        carta.setAttribute('data-estado', 'volteada');
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
            alert("¡Enhorabuena! ¡Has ganado!");
        }
    }

}