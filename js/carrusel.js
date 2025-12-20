class Carrusel {
    #busqueda;
    #actual;
    #maximo;
    #fotos;

    constructor(busqueda) {
        this.#busqueda = busqueda;
        this.#actual = 0;
        this.#maximo = 4;
        this.#fotos = [];
    }

    getFotografias() {
        var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
        
        $.getJSON(flickrAPI, {
            tags: this.#busqueda,
            tagmode: "any",
            format: "json"
        })
        .done((data) => {
            this.procesarJSONFotografias(data);
        });
    }

    procesarJSONFotografias(data) {
        this.#fotos = [];
        for (let i = 0; i <= this.#maximo; i++) {
            if (i < data.items.length) {
                let item = data.items[i];
                let url640 = item.media.m.replace("_m", "_z");
                this.#fotos.push({
                    url: url640,
                    title: item.title
                });
            }
        }
        if (this.#fotos.length > 0) {
            this.mostrarFotografias();
        }
    }

    mostrarFotografias() {
        let foto = this.#fotos[this.#actual];

        var articulo = $("<article></article>");
        var h2 = $("<h2></h2>").text("Imágenes del circuito de " + this.#busqueda); // Se oculta con CSS para presentación
        var img = $("<img>").attr("src", foto.url).attr("alt", foto.title);

        articulo.append(h2);
        articulo.append(img);
        $("body").append(articulo);

        setInterval(this.cambiarFotografia.bind(this), 3000);
    }

    cambiarFotografia() {
        this.#actual++;

        if (this.#actual > this.#maximo) {
            this.#actual = 0;
        }

        let siguienteFoto = this.#fotos[this.#actual];
        $("article img")
            .attr("src", siguienteFoto.url)
            .attr("alt", siguienteFoto.title);
    }
}