<?php
class Configuracion {
    private $servername = "localhost";
    private $username = "DBUSER2025";
    private $password = "DBPSWD2025";
    private $dbname = "UO288294_DB";
    private $db;

    public function __construct() {
        $this->conectar();
    }

    private function conectar() {
        $this->db = new mysqli($this->servername, $this->username, $this->password, $this->dbname);
        $this->db->select_db($this->dbname);
        $this->db->set_charset("utf8");
    }

    // Reinicia la BD
    public function reiniciarDatos() {
        // Desactivamos chequeo de claves foráneas para evitar errores al truncar
        $this->db->query("SET FOREIGN_KEY_CHECKS = 0");   

        // Truncamos todas las tablas
        $this->db->query("TRUNCATE TABLE OBSERVACION_FACILITADOR");
        $this->db->query("TRUNCATE TABLE TEST_USABILIDAD");
        $this->db->query("TRUNCATE TABLE USUARIO");
        $this->db->query("TRUNCATE TABLE DISPOSITIVO");

        // Reactivamos chequeo
        $this->db->query("SET FOREIGN_KEY_CHECKS = 1");

        // Añadimos de nuevo los dispositivos por defecto
        $sql = "INSERT INTO DISPOSITIVO (nombre_dispositivo) VALUES ('Ordenador'), ('Tableta'), ('Teléfono')";
        $this->db->query($sql);
    }

    // Borrar la BD completamente
    public function borrarBaseDatos() {
        $sql = "DROP DATABASE " . $this->dbname;
        if ($this->db->query($sql) === TRUE) {
            
        } else {
            
        }
    }

    // Exportar datos a CSV
    public function exportarCSV() {
        $sql = "SELECT u.id_usuario, u.profesion, u.edad, u.genero, u.pericia_informatica, 
                       d.nombre_dispositivo, t.tiempo_completado, t.completado, t.valoracion, 
                       t.comentarios_usuario, o.comentarios_facilitador
                FROM USUARIO u
                LEFT JOIN TEST_USABILIDAD t ON u.id_usuario = t.id_usuario
                LEFT JOIN DISPOSITIVO d ON t.id_dispositivo = d.id_dispositivo
                LEFT JOIN OBSERVACION_FACILITADOR o ON t.id_test = o.id_test";

        $resultado = $this->db->query($sql);

        if ($resultado->num_rows > 0) {
            // Cabeceras para forzar la descarga del archivo
            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename=datos_usabilidad.csv');

            $output = fopen('php://output', 'w');

            // Encabezados de las columnas
            fputcsv($output, array('ID', 'Profesion', 'Edad', 'Genero', 'Pericia', 'Dispositivo', 'Tiempo(s)', 'Completado', 'Valoracion', 'Comentarios User', 'Observaciones Facilitador'));

            // Datos
            while ($row = $resultado->fetch_assoc()) {
                fputcsv($output, $row);
            }
            fclose($output);
            exit();
        } else {
            
        }
    }
}
?>