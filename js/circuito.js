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

                // Seleccionamos la primera sección (HTML)
                const seccionInfo = document.querySelectorAll("main > section")[0];
    
                // Limpieza: eliminamos cualquier article previo antes de añadir el nuevo
                const previo = seccionInfo.querySelector("article");
                if (previo) seccionInfo.removeChild(previo);

                const contenedorDatos = document.createElement("article");
                contenedorDatos.innerHTML = datosGenerales;
                seccionInfo.appendChild(contenedorDatos);
            };

            lector.readAsText(archivo);
        }
    }
}

class CargadorSVG {

    #supports

    constructor() {
        this.#comprobarApiFile();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.#inicializarEventos());
        } else {
            this.#inicializarEventos();
        }
    }

    #inicializarEventos() {
        const inputs = document.querySelectorAll('input[type="file"]');
        const inputSVG = Array.from(inputs).find(input => input.accept === ".svg");
        if (inputSVG) {
            inputSVG.addEventListener('change', (evento) => {
                this.#leerArchivoSVG(evento.target.files);
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

    #leerArchivoSVG(archivos) {
        if (this.#supports) {
            const archivo = archivos[0];
            if (archivo && archivo.name.endsWith(".svg")) {
                const lector = new FileReader();
                lector.onload = (e) => {
                    this.#insertarSVG(e.target.result);
                };
                lector.readAsText(archivo);
            } else {
                alert("Por favor, seleccione un archivo .svg válido.");
            }
        }
    }

    #insertarSVG(contenidoSVG) {
        const section = document.querySelectorAll("section")[1];
        
        const svgPrevio = section.querySelector("svg");
        if (svgPrevio) {
            section.removeChild(svgPrevio);
        }

        const contenedor = document.createElement("article");
        contenedor.innerHTML = contenidoSVG;

        const svgElement = contenedor.querySelector("svg");
        if (svgElement) {
            section.appendChild(svgElement);
        }
    }
}

class CargadorKML {

    #supports;
    #mapa;

    constructor() {
        this.#comprobarApiFile();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.#inicializarEventos());
        } else {
            this.#inicializarEventos();
        }
    }

    #inicializarEventos() {
        const inputs = document.querySelectorAll('input[type="file"]');
        const inputKML = Array.from(inputs).find(input => input.accept === ".kml");
        if (inputKML) {
            inputKML.addEventListener('change', (evento) => {
                this.#leerArchivoKML(evento.target.files);
            });
        }
    }

    #comprobarApiFile() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            this.#supports = true;
        } else {
            this.#supports = false;
        }
    }

    #leerArchivoKML(archivos) {
        if (this.#supports) {
            const archivo = archivos[0];
            if (archivo && archivo.name.endsWith(".kml")) {
                const lector = new FileReader();
                lector.onload = (e) => {
                    const contenidoKML = e.target.result;
                    const parser = new DOMParser();
                    const kmlDoc = parser.parseFromString(contenidoKML, "application/xml");
                    
                    const namespace = "http://www.opengis.net/kml/2.2";
                    const coordsNode = kmlDoc.getElementsByTagNameNS(namespace, "coordinates")[0];
                    
                    if (coordsNode) {
                        const textoCoordenadas = coordsNode.textContent.trim();
                        const puntos = textoCoordenadas.split(/\s+/).map(p => {
                            const [longitud, latitud] = p.split(",").map(Number);
                            return { lat: latitud, lng: longitud };
                        });
                        
                        this.#insertarCapaKML(puntos);
                    }
                };
                lector.readAsText(archivo);
            }
        }
    }

    #insertarCapaKML(coordenadas) {
        const main = document.querySelector("main");
        
        // Eliminamos mapa previo si existe
        const mapaPrevio = document.querySelector("main > div");
        if (mapaPrevio) {
            main.removeChild(mapaPrevio);
        }

        // Crear el contenedor div único permitido
        const contenedorMapa = document.createElement("div");
        main.appendChild(contenedorMapa);

        const opciones = {
            center: coordenadas[0],
            zoom: 13,
            mapTypeId: 'terrain'
        };

        this.#mapa = new google.maps.Map(contenedorMapa, opciones);

        // Marcar el punto de inicio del circuito
        new google.maps.Marker({
            position: coordenadas[0],
            map: this.#mapa,
            title: "Punto de Inicio"
        });

        // Dibujar la polilínea del circuito
        const rutaCircuito = new google.maps.Polyline({
            path: coordenadas,
            geodesic: true,
            strokeColor: "#ff0000",
            strokeOpacity: 0.7,
            strokeWeight: 5
        });
        rutaCircuito.setMap(this.#mapa);
    }
}