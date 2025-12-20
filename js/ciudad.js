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

    escribirCoordenadas() {
        const pLatitud = document.createElement('p');
        pLatitud.innerHTML = "<strong>Latitud:</strong> " + this.coordenadas.latitud;
        document.body.appendChild(pLatitud);

        const pLongitud = document.createElement('p');
        pLongitud.innerHTML = "<strong>Longitud:</strong> " + this.coordenadas.longitud;
        document.body.appendChild(pLongitud);

        const pAltitud = document.createElement('p');
        pAltitud.innerHTML = "<strong>Altitud:</strong> " + this.coordenadas.altitud + " metros";
        document.body.appendChild(pAltitud);
    }

}