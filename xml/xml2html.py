import xml.etree.ElementTree as ET
import re

class Html:
    def __init__(self, xml_file, html_file):
        
        # Carga del árbol XML y nombre del archivo de salida

        self.tree = ET.parse(xml_file)
        self.root = self.tree.getroot()
        self.outfile = html_file
        # Namespace
        self.ns = {'ns': 'http://www.uniovi.es'}

    def generar_html(self):

        # Obtenemos el nombre del circuito para el título
        nombre_circuito = self.root.find('ns:nombre', self.ns).text

        with open(self.outfile, 'w', encoding='utf-8') as f:
            # --- 1. Estructura base y HEAD (copiado de index.html y adaptado) ---
            f.write('<!DOCTYPE HTML>\n')
            f.write('<html lang="es">\n')
            f.write('<head>\n')
            f.write('\t\n')
            f.write('\t<meta charset="UTF-8" />\n')
            f.write('\t<meta name ="author" content ="Hugo Prendes Menéndez" />\n')
            f.write('\t<meta name ="description" content ="Información del circuito generada automáticamente" />\n')
            f.write('\t<meta name ="keywords" content ="MotoGP, Circuito, , Silverstone, XML, Python, Datos, Zarco" />\n')
            f.write('\t<meta name ="viewport" content ="width=device-width, initial-scale=1.0" />\n')
            f.write(f'\t<title>MotoGP - {nombre_circuito}</title>\n')

            # Rutas teniendo en cuenta la ubicación del archivo HTML generado
            f.write('\t<link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />\n')
            f.write('\t<link rel="stylesheet" type="text/css" href="../estilo/layout.css" />\n')
            f.write('\t<link rel="icon" href="../multimedia/favicon_johann_zarco.ico" type="image/x-icon" />\n')
            f.write('</head>\n')

            # Acaba el head y empieza el body

            f.write('<body>\n')

            # HEADER y NAV (con rutas corregidas)
            f.write('\t<header>\n')
            f.write('\t\t<h1><a href="../index.html" title="Volver a la página principal">MotoGP Desktop</a></h1>\n')
            f.write('\t\t<nav>\n')
            f.write('\t\t\t<a href="../index.html" title="Página de inicio">Inicio</a>\n')
            f.write('\t\t\t<a href="../piloto.html" title="Información del piloto">Piloto</a>\n')
            f.write('\t\t\t<a href="../circuito.html" title="Información del circuito">Circuito</a>\n')
            f.write('\t\t\t<a href="../meteorologia.html" title="Previsión meteorológica">Meteorología</a>\n')
            f.write('\t\t\t<a href="../clasificaciones.php" title="Información de clasificaciones">Clasificaciones</a>\n')
            f.write('\t\t\t<a href="../juegos.html" title="Zona de juegos">Juegos</a>\n')
            f.write('\t\t\t<a href="../ayuda.html" title="Ayuda y soporte">Ayuda</a>\n')
            f.write('\t\t</nav>\n')
            f.write('\t</header>\n')

            # CONTENIDO PRINCIPAL
            f.write('\t<main>\n')
            
            # Título específico de la página
            f.write(f'\t\t<h2>{nombre_circuito}</h2>\n')

            # Sección: Datos Generales (en una lista no ordenada)
            f.write('\t\t<section>\n')
            f.write('\t\t\t<h3>Datos Generales</h3>\n')
            f.write('\t\t\t<ul>\n')
            
            # Extracción XPath
            longitud = self.root.find('ns:longitud', self.ns)
            anchura = self.root.find('ns:anchura', self.ns)
            fecha = self.root.find('ns:fecha', self.ns).text
            hora = self.root.find('ns:hora', self.ns).text
            vueltas = self.root.find('ns:vueltas', self.ns).text
            localidad = self.root.find('ns:localidad', self.ns).text
            pais = self.root.find('ns:pais', self.ns).text
            patrocinador = self.root.find('ns:patrocinador', self.ns).text

            f.write(f'\t\t\t\t<li>Longitud: {longitud.text} {longitud.get("unidad")}</li>\n')
            f.write(f'\t\t\t\t<li>Anchura media: {anchura.text} {anchura.get("unidad")}</li>\n')
            f.write(f'\t\t\t\t<li>Fecha del último GP: {fecha}</li>\n')
            f.write(f'\t\t\t\t<li>Hora del último GP: {hora}</li>\n')
            f.write(f'\t\t\t\t<li>Vueltas: {vueltas}</li>\n')
            f.write(f'\t\t\t\t<li>Ubicación: {localidad}, {pais}</li>\n')
            f.write(f'\t\t\t\t<li>Patrocinador del GP: {patrocinador}</li>\n')
            f.write('\t\t\t</ul>\n')
            f.write('\t\t</section>\n')

            # Sección: Referencias
            f.write('\t\t<section>\n')
            f.write('\t\t\t<h3>Referencias</h3>\n')
            f.write('\t\t\t<ul>\n')
            referencias = self.root.findall('ns:referencias/ns:referencia', self.ns)
            for ref in referencias:
                f.write(f'\t\t\t\t<li><a href="{ref.text}" target="_blank">{ref.text}</a></li>\n')
            f.write('\t\t\t</ul>\n')
            f.write('\t\t</section>\n')

            # Sección: Galería de Fotos
            f.write('\t\t<section>\n')
            f.write('\t\t\t<h3>Galería de Imágenes</h3>\n')
            fotos = self.root.findall('ns:fotografias/ns:fotografia', self.ns)
            i = 0
            for foto in fotos:
                i += 1
                ruta_raw = foto.find('ns:ruta', self.ns).text
                ruta_img = f"../{ruta_raw}" 
                desc = foto.find('ns:descripcion', self.ns).text
                
                f.write('\t\t\t<article>\n')
                f.write('\t\t\t\t<h4>Imagen ' + str(i) + '</h4>\n')
                f.write('\t\t\t\t<figure>\n')
                f.write(f'\t\t\t\t\t<img src="{ruta_img}" alt="{desc}" style="max-width: 100%;" />\n')
                f.write(f'\t\t\t\t\t<figcaption>{desc}</figcaption>\n')
                f.write('\t\t\t\t</figure>\n')
                f.write('\t\t\t</article>\n')
            f.write('\t\t</section>\n')

            # Sección: Videos
            f.write('\t\t<section>\n')
            f.write('\t\t\t<h3>Videos</h3>\n')
            videos = self.root.findall('ns:videos/ns:video', self.ns)
            for video in videos:
                ruta_raw = video.find('ns:ruta', self.ns).text
                ruta_vid = f"../{ruta_raw}"
                desc = video.find('ns:descripcion', self.ns).text
                
                f.write('\t\t\t<article>\n')
                f.write(f'\t\t\t\t<h4>{desc}</h4>\n')
                f.write('\t\t\t\t<video controls style="max-width: 100%;">\n')
                f.write(f'\t\t\t\t\t<source src="{ruta_vid}" type="video/mp4" />\n')
                f.write('\t\t\t\t\tTu navegador no soporta la etiqueta de video.\n')
                f.write('\t\t\t\t</video>\n')
                f.write('\t\t\t</article>\n')
            f.write('\t\t</section>\n')

            # Sección: Resultados
            f.write('\t\t<section>\n')
            f.write('\t\t\t<h3>Resultados del Gran Premio</h3>\n')
            
            vencedor_nombre = self.root.find('ns:vencedor/ns:nombre', self.ns).text
            vencedor_tiempo_raw = self.root.find('ns:vencedor/ns:tiempo', self.ns).text
            
            # Pasamos el duration a formato mm:ss
            match = re.search(r'PT(\d+)M([\d.]+)S', vencedor_tiempo_raw)
            if match:
                minutos = match.group(1)
                segundos = match.group(2)
                vencedor_tiempo = f"{minutos}:{segundos}"
            else:
                # Si falla, mostramos el original
                vencedor_tiempo = vencedor_tiempo_raw

            f.write(f'\t\t\t<p><strong>Vencedor:</strong> {vencedor_nombre} ({vencedor_tiempo})</p>\n')

            f.write('\t\t\t<table>\n')
            f.write('\t\t\t\t<caption>Clasificación Mundial de Pilotos</caption>\n')
            f.write('\t\t\t\t<thead>\n')
            f.write('\t\t\t\t\t<tr>\n')
            f.write('\t\t\t\t\t\t<th>Pos</th>\n')
            f.write('\t\t\t\t\t\t<th>Piloto</th>\n')
            f.write('\t\t\t\t\t\t<th>Puntos</th>\n')
            f.write('\t\t\t\t\t</tr>\n')
            f.write('\t\t\t\t</thead>\n')
            f.write('\t\t\t\t<tbody>\n')
            
            clasif = self.root.findall('ns:clasificacion/ns:posicion', self.ns)
            for pos in clasif:
                puesto = pos.find('ns:puesto', self.ns).text
                piloto = pos.find('ns:nombre', self.ns).text
                puntos = pos.find('ns:puntosMundial', self.ns).text
                
                f.write('\t\t\t\t\t<tr>\n')
                f.write(f'\t\t\t\t\t\t<td>{puesto}</td>\n')
                f.write(f'\t\t\t\t\t\t<td>{piloto}</td>\n')
                f.write(f'\t\t\t\t\t\t<td>{puntos}</td>\n')
                f.write('\t\t\t\t\t</tr>\n')
            f.write('\t\t\t\t</tbody>\n')
            f.write('\t\t\t</table>\n')
            f.write('\t\t</section>\n')

            f.write('\t</main>\n')
            f.write('</body>\n')
            f.write('</html>\n')

def main():
    
    archivo_xml = "circuitoEsquema.xml"
    archivo_html = "InfoCircuito.html"
    
    try:
        conversor = Html(archivo_xml, archivo_html)
        conversor.generar_html()
        print(f"Archivo generado: {archivo_html}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()