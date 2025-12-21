class Ciudad {

    #nombre;
    #pais;
    #gentilicio;
    #poblacion;
    #coordenadas;

    constructor(nombre, pais, gentilicio) {
        this.#nombre = nombre;
        this.#pais = pais;
        this.#gentilicio = gentilicio;
        this.#poblacion = 0;
        this.#coordenadas = {};
    }

    rellenarAtributos(poblacion, coordenadas) {
        this.#poblacion = poblacion;
        this.#coordenadas = coordenadas;
    }

    getNombre() {
        return this.#nombre;
    }

    getPais() {
        return this.#pais;
    }

    #getInfoSecundaria() {
        return `
            <ul>
                <li>Gentilicio: ${this.#gentilicio}</li>
                <li>Población: ${this.#poblacion} habitantes</li>
            </ul>
        `;
    }

    mostrarEnHTML() {
        var contenedor = document.querySelector("main section");

        var h4Localidad = document.createElement("h4");
        h4Localidad.textContent = "Localidad:";
        contenedor.appendChild(h4Localidad);

        var pLocalidad = document.createElement("p");
        pLocalidad.textContent = this.#nombre + " (" + this.#pais + ")";
        contenedor.appendChild(pLocalidad);

        var articleInfo = document.createElement("article");
        articleInfo.innerHTML = "<h4>Información adicional:</h4>" + this.#getInfoSecundaria()
        contenedor.appendChild(articleInfo);

        var h4Coords = document.createElement("h4");
        h4Coords.textContent = "Coordenadas:";
        contenedor.appendChild(h4Coords);
        
        // Llamamos a escribirCoordenadas pasándole el contenedor
        this.#escribirCoordenadas(contenedor);
    }

    // Parámetro 'padre' añadido al refactorizar en P8
    #escribirCoordenadas(padre) {
        const pLatitud = document.createElement('p');
        pLatitud.innerHTML = "<strong>Latitud:</strong> " + this.#coordenadas.latitud;
        padre.appendChild(pLatitud);

        const pLongitud = document.createElement('p');
        pLongitud.innerHTML = "<strong>Longitud:</strong> " + this.#coordenadas.longitud;
        padre.appendChild(pLongitud);

        const pAltitud = document.createElement('p');
        pAltitud.innerHTML = "<strong>Altitud:</strong> " + this.#coordenadas.altitud + " metros";
        padre.appendChild(pAltitud);
    }

    #getMeteorologiaCarrera(fechaCarrera) {
        const baseUrl = "https://archive-api.open-meteo.com/v1/archive";
        const params = new URLSearchParams({
            latitude: this.#coordenadas.latitud,
            longitude: this.#coordenadas.longitud,
            hourly: "temperature_2m,apparent_temperature,rain,relative_humidity_2m,wind_speed_10m,wind_direction_10m",
            daily: "sunrise,sunset",
            timezone: "auto",
            start_date: fechaCarrera,
            end_date: fechaCarrera
        });

        const urlCompleta = `${baseUrl}?${params.toString()}`;

        return $.ajax({
            url: urlCompleta,
            method: "GET",
            dataType: "json"
        });
    }

    #procesarJSONCarrera(datos) {
        var infoProcesada = {
            diaria: {},
            horaria: []
        };

        if (datos.daily) {
            infoProcesada.diaria = {
                amanecer: datos.daily.sunrise[0],
                anochecer: datos.daily.sunset[0]
            };
        }

        if (datos.hourly) {
            const numHoras = datos.hourly.time.length; 
            for (let i = 0; i < numHoras; i++) {
                let registroHora = {
                    hora: datos.hourly.time[i],
                    temperatura: datos.hourly.temperature_2m[i],
                    sensacion: datos.hourly.apparent_temperature[i],
                    lluvia: datos.hourly.rain[i],
                    humedad: datos.hourly.relative_humidity_2m[i],
                    velocidadViento: datos.hourly.wind_speed_10m[i],
                    direccionViento: datos.hourly.wind_direction_10m[i]
                };
                infoProcesada.horaria.push(registroHora);
            }
        }
        return infoProcesada;
    }

    #mostrarMeteorologia(datos, fecha) {
        var contenedorMeteo = $("main section:nth-of-type(2)");

        // Por si se ha llamado antes
        contenedorMeteo.empty();
        contenedorMeteo.append("<h3>Meteorología el día de la carrera</h3>");

        // Datos Diarios
        var divDiario = $("<div></div>");
        var horaAmanecer = datos.diaria.amanecer.split("T")[1];
        var horaAnochecer = datos.diaria.anochecer.split("T")[1];

        divDiario.append("<p><strong>Amanecer:</strong> " + horaAmanecer + "</p>");
        divDiario.append("<p><strong>Puesta de Sol:</strong> " + horaAnochecer + "</p>");
        contenedorMeteo.append(divDiario);

        // Datos Horarios
        var tabla = $("<table></table>");
        var caption = $("<caption>Pronóstico " + fecha + "</caption>");
        tabla.append(caption);

        var thead = $("<thead><tr>" +
            "<th id='hora' scope='col'>Hora</th>" +
            "<th id='temp' scope='col'>Temp. (°C)</th>" +
            "<th id='sens' scope='col'>Sensación (°C)</th>" +
            "<th id='lluvia' scope='col'>Lluvia (mm)</th>" +
            "<th id='humedad' scope='col'>Humedad (%)</th>" +
            "<th id='viento' scope='col'>Viento (km/h)</th>" +
            "<th id='direc' scope='col'>Dirección</th>" +
            "</tr></thead>");
        tabla.append(thead);

        var tbody = $("<tbody></tbody>");

        $.each(datos.horaria, function(index, item) {
            var fila = $("<tr></tr>");
            var horaSimple = item.hora.split("T")[1];

            fila.append("<td headers='hora'>" + horaSimple + "</td>");
            fila.append("<td headers='temp'>" + item.temperatura + "</td>");
            fila.append("<td headers='sens'>" + item.sensacion + "</td>");
            fila.append("<td headers='lluvia'>" + item.lluvia + "</td>");
            fila.append("<td headers='humedad'>" + item.humedad + "</td>");
            fila.append("<td headers='viento'>" + item.velocidadViento + "</td>");
            fila.append("<td headers='direc'>" + item.direccionViento + "°</td>");

            tbody.append(fila);
        });

        tabla.append(tbody);
        contenedorMeteo.append(tabla);
    }

    verPrevision(fechaCarrera) {
        var m = this;

        this.#getMeteorologiaCarrera(fechaCarrera)
            .done(function(data) {
                var datosProcesados = m.#procesarJSONCarrera(data);
                m.#mostrarMeteorologia(datosProcesados, fechaCarrera);
            })
            .fail(function(jqXHR, textStatus) {
                $("main section:nth-of-type(2)").append("<p>Error al cargar meteorología: " + textStatus + "</p>");
            });
    }

    #getMeteorologiaEntrenos(fechaCarrera) {
        var fecha = new Date(fechaCarrera);
        
        // PRIMER DÍA DE ENTRENAMIENTOS
        fecha.setDate(fecha.getDate() - 1);
        var endDate = fecha.toISOString().split('T')[0];
        
        // SEGUNDO DÍA DE ENTRENAMIENTOS
        fecha.setDate(fecha.getDate() - 2);
        var startDate = fecha.toISOString().split('T')[0];

        const baseUrl = "https://archive-api.open-meteo.com/v1/archive";
        const params = new URLSearchParams({
            latitude: this.#coordenadas.latitud,
            longitude: this.#coordenadas.longitud,
            hourly: "temperature_2m,rain,wind_speed_10m,relative_humidity_2m",
            timezone: "auto",
            start_date: startDate,
            end_date: endDate
        });

        return $.ajax({
            url: `${baseUrl}?${params.toString()}`,
            method: "GET",
            dataType: "json"
        });
    }

    #procesarJSONEntrenos(datos) {
        var dias = {};

        if (datos.hourly) {
            const numHoras = datos.hourly.time.length;

            for (let i = 0; i < numHoras; i++) {
                // Obtenemos la fecha
                let fecha = datos.hourly.time[i].split("T")[0];

                // Inicializamos sus contadores
                if (!dias[fecha]) {
                    dias[fecha] = {
                        tempSum: 0,
                        lluviaSum: 0,
                        vientoSum: 0,
                        humedadSum: 0,
                        count: 0
                    };
                }

                // Acumulamos los valores
                dias[fecha].tempSum += datos.hourly.temperature_2m[i];
                dias[fecha].lluviaSum += datos.hourly.rain[i];
                dias[fecha].vientoSum += datos.hourly.wind_speed_10m[i];
                dias[fecha].humedadSum += datos.hourly.relative_humidity_2m[i];
                dias[fecha].count++;
            }
        }

        var resultados = [];
        for (var fecha in dias) {
            let diaData = dias[fecha];
            let objMedia = {
                dia: fecha,
                tempMedia: (diaData.tempSum / diaData.count).toFixed(2),
                lluviaMedia: (diaData.lluviaSum / diaData.count).toFixed(2),
                vientoMedia: (diaData.vientoSum / diaData.count).toFixed(2),
                humedadMedia: (diaData.humedadSum / diaData.count).toFixed(2)
            };
            resultados.push(objMedia);
        }
        return resultados;
    }

    #mostrarMeteorologiaEntrenos(datos) {
        // Seleccionamos la tercera sección del main (la de los entrenamientos)
        var contenedorEntrenos = $("main section:nth-of-type(3)");
        contenedorEntrenos.find("table, p").remove();

        var tabla = $("<table></table>");
        var caption = $("<caption>Medias diarias de los 3 días de entrenamiento</caption>");
        tabla.append(caption);

        var thead = $("<thead><tr>" +
            "<th id='dia' scope='col'>Día</th>" +
            "<th id='tempm' scope='col'>Temp. Media (°C)</th>" +
            "<th id='lluviam' scope='col'>Lluvia Media (mm)</th>" +
            "<th id='vientom' scope='col'>Viento Medio (km/h)</th>" +
            "<th id='humedadm' scope='col'>Humedad Media (%)</th>" +
            "</tr></thead>");
        tabla.append(thead);

        var tbody = $("<tbody></tbody>");
        $.each(datos, function(index, item) {
            var fila = $("<tr></tr>");
            fila.append("<td headers='dia'>" + item.dia + "</td>");
            fila.append("<td headers='tempm'>" + item.tempMedia + "</td>");
            fila.append("<td headers='lluviam'>" + item.lluviaMedia + "</td>");
            fila.append("<td headers='vientom'>" + item.vientoMedia + "</td>");
            fila.append("<td headers='humedadm'>" + item.humedadMedia + "</td>");
            tbody.append(fila);
        });
        tabla.append(tbody);

        contenedorEntrenos.append(tabla);
    }

    verEntrenamientos(fechaCarrera) {
        var me = this;
        this.#getMeteorologiaEntrenos(fechaCarrera)
            .done(function(data) {
                var datosProcesados = me.#procesarJSONEntrenos(data);
                me.#mostrarMeteorologiaEntrenos(datosProcesados);
            })
            .fail(function(jqXHR, textStatus) {
                $("main section:nth-of-type(3)").append("<p>Error al cargar entrenamientos: " + textStatus + "</p>");
            });
    }

}