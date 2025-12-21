-- Script sql para crear la BD. Se pega en phpMyAdmin.

CREATE DATABASE IF NOT EXISTS UO288294_DB;
USE UO288294_DB;

-- USUARIO
CREATE TABLE IF NOT EXISTS USUARIO (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Código de identificación del usuario',
    profesion VARCHAR(100) NOT NULL COMMENT 'Profesión',
    edad INT NOT NULL COMMENT 'Edad',
    genero VARCHAR(20) NOT NULL COMMENT 'Género',
    pericia_informatica INT NOT NULL COMMENT 'Nivel de pericia informática'
) ENGINE=InnoDB;

-- DISPOSITIVO
CREATE TABLE IF NOT EXISTS DISPOSITIVO (
    id_dispositivo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_dispositivo VARCHAR(50) NOT NULL COMMENT 'Ordenador, tableta o teléfono'
) ENGINE=InnoDB;

-- Insertamos los dispositivos por defecto 
INSERT INTO DISPOSITIVO (nombre_dispositivo) VALUES ('Ordenador'), ('Tableta'), ('Teléfono');

-- TEST_USABILIDAD
CREATE TABLE IF NOT EXISTS TEST_USABILIDAD (
    id_test INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_dispositivo INT NOT NULL,
    tiempo_completado INT NOT NULL COMMENT 'Tiempo en segundos',
    completado BOOLEAN NOT NULL COMMENT 'True/False',
    comentarios_usuario TEXT COMMENT 'Comentarios del usuario',
    propuestas_mejora TEXT COMMENT 'Propuestas de mejora',
    valoracion INT NOT NULL COMMENT 'Valoración 0-10',
    
    CONSTRAINT fk_test_usuario FOREIGN KEY (id_usuario) 
        REFERENCES USUARIO(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_test_dispositivo FOREIGN KEY (id_dispositivo) 
        REFERENCES DISPOSITIVO(id_dispositivo) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- OBSERVACION_FACILITADOR
CREATE TABLE IF NOT EXISTS OBSERVACION_FACILITADOR (
    id_observacion INT AUTO_INCREMENT PRIMARY KEY,
    id_test INT NOT NULL,
    comentarios_facilitador TEXT NOT NULL,
    
    CONSTRAINT fk_observacion_test FOREIGN KEY (id_test) 
        REFERENCES TEST_USABILIDAD(id_test) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;