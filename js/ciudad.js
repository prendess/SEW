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
        document.write("<p><strong>Latitud:</strong> " + this.coordenadas.latitud + "</p>");
        document.write("<p><strong>Longitud:</strong> " + this.coordenadas.longitud + "</p>");
        document.write("<p><strong>Altitud:</strong> " + this.coordenadas.altitud + " metros</p>");
    }

}