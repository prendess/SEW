class Ciudad {

    constructor(nombre, pais, gentilicio) {
        this.nombre = nombre;
        this.pais = pais;
        this.gentilicio = gentilicio;
        this.poblacion = 0;
        this.coordenadas = {};
    }

    rellenarAtributos(poblacion, coordenadas) {
        this.poblacion = poblacion;
        this.coordenadas = coordenadas;
    }

    getNombre() {
        return this.nombre;
    }

    getPais() {
        return this.pais;
    }

    getInfoSecundaria() {
        return `
            <ul>
                <li>Gentilicio: ${this.gentilicio}</li>
                <li>Población: ${this.poblacion} habitantes</li>
            </ul>
        `;
    }

    mostrarEnHTML() {
        var contenedor = document.querySelector("main section");

        var h4Localidad = document.createElement("h4");
        h4Localidad.textContent = "Localidad:";
        contenedor.appendChild(h4Localidad);

        var pLocalidad = document.createElement("p");
        pLocalidad.textContent = this.nombre + " (" + this.pais + ")";
        contenedor.appendChild(pLocalidad);

        var h4Info = document.createElement("h4");
        h4Info.textContent = "Información adicional:";
        contenedor.appendChild(h4Info);
        
        var articleInfo = document.createElement("article");
        articleInfo.innerHTML = this.getInfoSecundaria();
        contenedor.appendChild(articleInfo);

        var h4Coords = document.createElement("h4");
        h4Coords.textContent = "Coordenadas:";
        contenedor.appendChild(h4Coords);
        
        // Llamamos a escribirCoordenadas pasándole el contenedor
        this.escribirCoordenadas(contenedor);
    }

    // Parámetro 'padre' añadido al refactorizar en P8
    escribirCoordenadas(padre) {
        const pLatitud = document.createElement('p');
        pLatitud.innerHTML = "<strong>Latitud:</strong> " + this.coordenadas.latitud;
        padre.appendChild(pLatitud);

        const pLongitud = document.createElement('p');
        pLongitud.innerHTML = "<strong>Longitud:</strong> " + this.coordenadas.longitud;
        padre.appendChild(pLongitud);

        const pAltitud = document.createElement('p');
        pAltitud.innerHTML = "<strong>Altitud:</strong> " + this.coordenadas.altitud + " metros";
        padre.appendChild(pAltitud);
    }

}