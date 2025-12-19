import xml.etree.ElementTree as ET

class Kml(object):
    """Genera archivo KML con puntos y líneas"""
    def __init__(self):
        self.raiz = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
        self.doc = ET.SubElement(self.raiz, 'Document')

    def addLineString(self, nombre, listaCoordenadas):
        pm = ET.SubElement(self.doc, 'Placemark')
        ET.SubElement(pm, 'name').text = nombre
        ls = ET.SubElement(pm, 'LineString')
        ET.SubElement(ls, 'extrude').text = '1'
        ET.SubElement(ls, 'tessellation').text = '1'
        ET.SubElement(ls, 'coordinates').text = listaCoordenadas
        ET.SubElement(ls, 'altitudeMode').text = 'relativeToGround'

    def escribir(self, nombreArchivoKML):
        arbol = ET.ElementTree(self.raiz)
        ET.indent(arbol)
        arbol.write(nombreArchivoKML, encoding='utf-8', xml_declaration=True)

def main():
    try:
        # 1. Cargar el XML
        arbol = ET.parse('circuitoEsquema.xml')
        raiz = arbol.getroot()
        
        # Definir el namespace para XPath (el mismo que en circuitoEsquema.xml)
        ns = {'ns': 'http://www.uniovi.es'}

        # 2. Extraer coordenadas usando XPath
        
        # Origen
        lon_orig = raiz.find('.//ns:origen/ns:longitudGeo', ns).text
        lat_orig = raiz.find('.//ns:origen/ns:latitudGeo', ns).text
        alt_orig = raiz.find('.//ns:origen/ns:altitudGeo', ns).text
        
        coordenadas = f"{lon_orig},{lat_orig},{alt_orig}\n"

        # Puntos del circuito
        puntos = raiz.findall('.//ns:puntos/ns:punto/ns:puntoFinal', ns)
        for p in puntos:
            lon = p.find('ns:longitudGeo', ns).text
            lat = p.find('ns:latitudGeo', ns).text
            alt = p.find('ns:altitudGeo', ns).text
            coordenadas += f"{lon},{lat},{alt}\n"

        # 3. Crear el KML
        nuevoKml = Kml()
        nombre_circuito = raiz.find('.//ns:nombre', ns).text
        nuevoKml.addLineString(f"Planimetría de {nombre_circuito}", coordenadas)
        
        # 4. Escribir resultado
        nuevoKml.escribir('circuito.kml')
        print("Archivo 'circuito.kml' generado con éxito.")

    except Exception as e:
        print(f"Error: {e}")

main()