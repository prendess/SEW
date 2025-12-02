<!DOCTYPE html>
<html lang="es">
<head>
    <title>Creación Tablas DB Usabilidad</title>
    <meta charset="utf-8"/>  
    <meta name="author" content="Hugo Prendes Menéndez" /> 
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
</head>   
<body>
    <h1>Crear Tablas con MySQLi</h1>  
    <section>
        <h2>Resultado interpretado</h2>
        <p>Crea las tablas necesarias para las pruebas de usabilidad en la Base de Datos "UO288294_DB" </p> 
        <ul>
            <li>Tabla USUARIO (id_usuario, profesion, edad, genero, pericia_informatica)</li>
            <li>Tabla DISPOSITIVO (id_dispositivo, nombre_dispositivo)</li>
            <li>Tabla TEST_USABILIDAD (id_test, id_usuario, id_dispositivo, tiempo_completado, completado, comentarios_usuario, propuestas_mejora, valoracion)</li>
            <li>Tabla OBSERVACION_FACILITADOR (id_observacion, id_test, comentarios_facilitador)</li>
        </ul>
        <?php

            $servername = "localhost";
            $username = "DBUSER2025";
            $password = "DBPSWD2025";
            $database = "UO288294_DB";

            // Conexión al SGBD local con XAMPP con el usuario creado 
            $db = new mysqli($servername,$username,$password);

            //selecciono la base de datos UO288294_DB para utilizarla
            $db->select_db($database);

            /* =============================
            TABLA USUARIO
            ============================= */

            $crearTabla = "CREATE TABLE IF NOT EXISTS USUARIO (
                            id_usuario INT NOT NULL,
                            profesion TEXT NOT NULL, 
                            edad INT NOT NULL,
                            genero TEXT NOT NULL,
                            pericia_informatica INT NOT NULL,  
                            PRIMARY KEY (id_usuario)
                            )";

            if($db->query($crearTabla) === TRUE){
                echo "<p>Tabla 'USUARIO' creada con éxito </p>";
            } else { 
                echo "<p>ERROR en la creación de la tabla 'USUARIO'. Error: ". $db->error . "</p>";
                exit();
            }


            /* =============================
            TABLA DISPOSITIVO
            ============================= */

            $crearTabla = "CREATE TABLE IF NOT EXISTS DISPOSITIVO (
                            id_dispositivo INT NOT NULL,
                            nombre_dispositivo TEXT NOT NULL,
                            PRIMARY KEY (id_dispositivo)
                            )";

            if($db->query($crearTabla) === TRUE){
                echo "<p>Tabla 'DISPOSITIVO' creada con éxito </p>";
            } else { 
                echo "<p>ERROR en la creación de la tabla 'DISPOSITIVO'. Error: ". $db->error . "</p>";
                exit();
            }


            /* =============================
            TABLA TEST_USABILIDAD
            ============================= */

            $crearTabla = "CREATE TABLE IF NOT EXISTS TEST_USABILIDAD (
                            id_test INT NOT NULL,
                            id_usuario INT NOT NULL,
                            id_dispositivo INT NOT NULL,
                            tiempo_completado INT NOT NULL,
                            completado BOOLEAN NOT NULL,
                            comentarios_usuario TEXT,
                            propuestas_mejora TEXT,
                            valoracion INT NOT NULL,
                            PRIMARY KEY (id_test),
                            FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
                            FOREIGN KEY (id_dispositivo) REFERENCES DISPOSITIVO(id_dispositivo)
                            )";

            if($db->query($crearTabla) === TRUE){
                echo "<p>Tabla 'TEST_USABILIDAD' creada con éxito </p>";
            } else { 
                echo "<p>ERROR en la creación de la tabla 'TEST_USABILIDAD'. Error: ". $db->error . "</p>";
                exit();
            }


            /* =============================
            TABLA OBSERVACION_FACILITADOR
            ============================= */

            $crearTabla = "CREATE TABLE IF NOT EXISTS OBSERVACION_FACILITADOR (
                            id_observacion INT NOT NULL,
                            id_test INT NOT NULL,
                            comentarios_facilitador TEXT,
                            PRIMARY KEY (id_observacion),
                            FOREIGN KEY (id_test) REFERENCES TEST_USABILIDAD(id_test)
                            )";

            if($db->query($crearTabla) === TRUE){
                echo "<p>Tabla 'OBSERVACION_FACILITADOR' creada con éxito </p>";
            } else { 
                echo "<p>ERROR en la creación de la tabla 'OBSERVACION_FACILITADOR'. Error: ". $db->error . "</p>";
                exit();
            }  

            //cerrar la conexión
            $db->close();    

        ?> 
    </section>

</body>
</html>