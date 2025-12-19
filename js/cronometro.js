class Cronometro {
    constructor() {
        this.tiempo = 0;
        this.inicio = null;
        this.corriendo = null;
    }

    arrancar() {
        if (this.corriendo) return; 

        try {
            this.inicio = Temporal.Now.instant();
        } catch (error) {
            this.inicio = new Date();
        }

        this.corriendo = setInterval(this.actualizar.bind(this), 100);
    }

    actualizar() {

        let actual;
        
        try {
            actual = Temporal.Now.instant();
            this.tiempo = actual.since(this.inicio).total({ unit: 'milliseconds' });
        } catch (error) {
            actual = new Date();
            this.tiempo = actual - this.inicio;
        }

        this.mostrar();
    }

    mostrar() {
        let t = this.tiempo;
        
        let minutos = parseInt(t / 60000);
        let segundos = parseInt((t % 60000) / 1000);
        let decimas = parseInt((t % 1000) / 100);

        let texto = String(minutos).padStart(2, '0') + ":" + 
                    String(segundos).padStart(2, '0') + "." + 
                    String(decimas);

        const display = document.querySelector("main p");
        if (display) {
            display.textContent = texto;
        }
    }

    parar() {
        if (this.corriendo) {
            clearInterval(this.corriendo);
            this.corriendo = null;
        }
    }

    reiniciar() {
        this.parar();
        this.tiempo = 0;
        this.mostrar();
    }
}