<!DOCTYPE html>
<html lang="es">
<head>
    <title>Creación DB Usabilidad</title>
    <meta charset="utf-8"/>
    <meta name="author" content="Hugo Prendes Menéndez" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
</head>   
<body>
    <h1>Creación de la Base de Datos con MySQLi</h1>  
    <section>
        <h2>Resultado interpretado</h2>
        <p>Se crea la base de datos "UO288294_DB" utilizando ordenación en español</p> 
        <p>PRECONDICIÓN: debe existir el usuario en la base de datos MySQL creado en XAMPP</p>       
        <?php
            $servername = "localhost";
            $username = "DBUSER2025";
            $password = "DBPSWD2025";

            // Conexión al SGBD local con XAMPP con el usuario creado 
            $db = new mysqli($servername,$username,$password);

            //comprobamos conexión
            if($db->connect_error) {
                exit ("<p>ERROR de conexión:".$db->connect_error."</p>");  
            } else {echo "<p>Conexión establecida con " . $db->host_info . "</p>";}

            // Se crea la base de datos de trabajo "agenda" utilizando ordenación en español
            $cadenaSQL = "CREATE DATABASE IF NOT EXISTS UO288294_DB COLLATE utf8_spanish_ci";
            if($db->query($cadenaSQL) === TRUE){
                echo "<p>Base de datos 'UO288294_DB' creada con éxito</p>";
            } else { 
                echo "<p>ERROR en la creación de la Base de Datos 'UO288294_DB'. Error: " . $db->error . "</p>";
                exit();
            }   
        //cerrar la conexión
        $db->close();    
        ?> 
    </section>
</body>
</html>