class Circuito {

    #supports

    constructor() {
        this.#comprobarApiFile();

        // Manejo de eventos trasladado desde el archivo HTML
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.#inicializarEventos());
        } else {
            this.#inicializarEventos();
        }
    }

    // Manejo de eventos
    #inicializarEventos() {
        const inputArchivo = document.querySelector('input[type="file"]');
        if (inputArchivo) {
            inputArchivo.addEventListener('change', (evento) => {
                this.#leerArchivoHTML(evento.target.files);
            });
        }
    }

    #comprobarApiFile() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            this.#supports = true;
        } else {
            this.#supports = false;
            const mensajeError = document.createElement("p");
            mensajeError.textContent = "Este navegador no soporta la API File de HTML5.";
            document.querySelector("main").appendChild(mensajeError);
        }
    }

    #leerArchivoHTML(archivos) {
        const archivo = archivos[0];
        if (archivo) {
            const lector = new FileReader();
            lector.onload = (evento) => {
                const contenidoTexto = evento.target.result;

                const parser = new DOMParser();
                const docCircuito = parser.parseFromString(contenidoTexto, "text/html");

                // CORREGIMOS RUTAS DE IMÁGENES Y VÍDEOS (InfoCircuito.html está en la carpeta xml)
                const imagenes = docCircuito.querySelectorAll("img");
                const videos = docCircuito.querySelectorAll("video source");

                imagenes.forEach(img => {
                    const srcActual = img.getAttribute("src");
                    if (srcActual) {
                        img.setAttribute("src", srcActual.replace("../", ""));
                    }
                });

                videos.forEach(source => {
                    const srcActual = source.getAttribute("src");
                    if (srcActual) {
                        source.setAttribute("src", srcActual.replace("../", ""));
                    }
                });

                const datosGenerales = docCircuito.querySelector("main").innerHTML;

                const mainDestino = document.querySelector("main");
                const nuevaSeccion = document.createElement("section");
                nuevaSeccion.innerHTML = datosGenerales;
                
                mainDestino.appendChild(nuevaSeccion);
            };

            lector.readAsText(archivo);
        }
    }
}