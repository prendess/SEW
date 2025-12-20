class Noticias {
    #busqueda;
    #url;
    #apiKey;

    constructor() {
        this.#busqueda = "MotoGP";
        this.#url = "https://api.thenewsapi.com/v1/news/all";
        this.#apiKey = "Ez86mqAPypZU5rOA17XUdYBgPZqJpdzJFrhMTzQJ";
    }

    #buscar() {
        const urlCompleta = `${this.#url}?api_token=${this.#apiKey}&search=${this.#busqueda}&language=es`;
        return fetch(urlCompleta)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error("Error al obtener las noticias:", error);
            });
    }

    #procesarInformacion(json) {
        if (json && json.data) {
            const noticias = json.data;
            return noticias;
        } else {
            console.error("El formato del JSON no es el esperado o no hay noticias.");
        }
    }

    #crearNoticias(listaNoticias) {
        var $main = $("<main></main>");
        var $seccion = $("<section></section>");
        var $h2 = $("<h2></h2>").text("Últimas noticias de MotoGP");
        
        $seccion.append($h2);

        listaNoticias.forEach(noticia => {
            const $articulo = this.#plantillaNoticia(noticia);
            $seccion.append($articulo);
        });

        $main.append($seccion);
        $("body").append($main);
    }

    // Plantilla para cada noticia
    #plantillaNoticia(noticia) {
        const $articulo = $("<article></article>");
        
        const $titulo = $("<h3></h3>").text(noticia.title);
        const $parrafo = $("<p></p>").text(noticia.description);

        const $fuente = $("<p></p>");
        const $negrita = $("<strong></strong>").text("Fuente: ");
        $fuente.append($negrita);
        $fuente.append(document.createTextNode(noticia.source));

        const $enlace = $("<a></a>")
            .attr("href", noticia.url)
            .attr("target", "_blank")
            .text("Leer noticia completa");
        
        const $separador = $("<hr>");

        $articulo.append($titulo);
        $articulo.append($parrafo);
        $articulo.append($fuente);
        $articulo.append($enlace);
        $articulo.append($separador);

        return $articulo;
    }

    verNoticias() {
        this.#buscar()
            .then(json => {
                const datos = this.#procesarInformacion(json);
                this.#crearNoticias(datos);
            });
    }
}