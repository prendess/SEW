import xml.etree.ElementTree as ET

# ------------------- Clase Svg -------------------
class Svg(object):
    """
    Genera archivos SVG con rectángulos, círculos, líneas, polilíneas y texto
    """
    def __init__(self):
        self.raiz = ET.Element('svg', xmlns="http://www.w3.org/2000/svg")

    def addRect(self, x, y, width, height, fill, strokeWidth, stroke):
        ET.SubElement(self.raiz, 'rect',
        x=str(x), y=str(y), width=str(width), height=str(height),
        fill=fill, stroke=stroke,
        **{'stroke-width': str(strokeWidth)})

    def addCircle(self, cx, cy, r, fill):
        ET.SubElement(self.raiz, 'circle',
        cx=str(cx), cy=str(cy), r=str(r), fill=fill)

    def addLine(self, x1, y1, x2, y2, stroke, strokeWidth):
        ET.SubElement(self.raiz, 'line',
        x1=str(x1), y1=str(y1), x2=str(x2), y2=str(y2),
        stroke=stroke,
        **{'stroke-width': str(strokeWidth)})

    def addPolyline(self, points, stroke, strokeWidth, fill):
        ET.SubElement(self.raiz, 'polyline',
        points=points,
        stroke=stroke, fill=fill,
        **{'stroke-width': str(strokeWidth)})

    def addText(self, texto, x, y, fontFamily, fontSize, style):
        elemento = ET.SubElement(self.raiz, 'text',
        x=str(x), y=str(y),
        style=style,
        **{'font-family': fontFamily, 'font-size': str(fontSize)})
        elemento.text = texto

    def escribir(self, nombreArchivoSVG):
        arbol = ET.ElementTree(self.raiz)
        ET.indent(arbol)
        arbol.write(nombreArchivoSVG,
        encoding='utf-8',
        xml_declaration=True)

    def ver(self):
        print("\nElemento raiz = ", self.raiz.tag)
        if self.raiz.text is not None:
            print("Contenido = ", self.raiz.text.strip('\n'))
        else:
            print("Contenido = ", self.raiz.text)
        print("Atributos = ", self.raiz.attrib)
        for hijo in self.raiz.findall('.//'):
            print("\nElemento = ", hijo.tag)
            if hijo.text is not None:
                print("Contenido = ", hijo.text.strip('\n'))
            else:
                print("Contenido = ", hijo.text)
            print("Atributos = ", hijo.attrib)

# ------------------- Generar altimetría -------------------
def generar_altimetria(xml_file="circuitoEsquema.xml", svg_file="altimetria.svg"):
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Prefijo del namespace
    ns = {'ns': 'http://www.uniovi.es'}

    # Nombre del circuito
    nombre = root.find('ns:nombre', ns).text

    # Altitud del origen
    origen_alt = float(root.find('ns:origen/ns:altitudGeo', ns).text)

    # Listas para distancia y altitud
    dist_acum = 0.0
    distancias = [0.0]
    altitudes = [origen_alt]

    # Recorrer puntos y calcular distancias y altitudes
    for punto in root.findall('ns:puntos/ns:punto', ns):
        distancia = float(punto.find('ns:distancia', ns).text)
        dist_acum += distancia
        alt = float(punto.find('ns:puntoFinal/ns:altitudGeo', ns).text)
        distancias.append(dist_acum)
        altitudes.append(alt)

    # Parámetros del gráfico (para darle escala)
    total_dist = dist_acum
    min_alt = min(altitudes) - 5
    max_alt = max(altitudes) + 5
    rango_alt = max_alt - min_alt if max_alt > min_alt else 1

    # Dimensiones SVG y gráfico
    margin = 70
    width = 1100
    height = 500
    graph_width = width - 2 * margin
    graph_height = height - 2 * margin

    svg = Svg()
    svg.raiz.set('width', str(width))
    svg.raiz.set('height', str(height))

    # Fondo
    svg.addRect('0', '0', str(width), str(height), 'white', '0', 'none')

    # Título
    svg.addText(f"Altimetría del circuito de {nombre}", str(margin), '40', 'Arial', '22', 'font-weight:bold')

    # Ejes
    svg.addLine(str(margin), str(height - margin), str(width - margin), str(height - margin), 'black', '2')
    svg.addLine(str(margin), str(margin), str(margin), str(height - margin), 'black', '2')

    # Etiquetas de ejes
    svg.addText('Distancia (m)', str(width // 2), str(height - 10), 'Arial', '16', 'text-anchor:middle')
    svg.addText('Altitud (m)', '15', str(height // 2), 'Arial', '16', "writing-mode: tb; glyph-orientation-vertical: 0;")

    # Marcas eje X (cada 1000 m)
    for d in range(0, int(total_dist) + 1000, 1000):
        if d <= total_dist:
            x = margin + (d / total_dist) * graph_width
            svg.addLine(str(x), str(height - margin), str(x), str(height - margin + 10), 'black', '2')
            svg.addText(str(d), str(x), str(height - margin + 25), 'Arial', '12', 'text-anchor:middle')

    # Marcas eje Y (cada 1 m)
    for a in range(int(min_alt), int(max_alt) + 1, 1):
        y = height - margin - ((a - min_alt) / rango_alt) * graph_height
        svg.addLine(str(margin - 10), str(y), str(margin), str(y), 'black', '2')
        svg.addText(f"{a:.0f}", str(margin - 15), str(y + 5), 'Arial', '12', 'text-anchor:end')

    # Polilínea del perfil
    points_list = []
    for i in range(len(distancias)):
        x = margin + (distancias[i] / total_dist) * graph_width
        y = height - margin - ((altitudes[i] - min_alt) / rango_alt) * graph_height
        points_list.append(f"{x:.1f},{y:.1f}")

    points_str = " ".join(points_list)
    svg.addPolyline(points_str, 'red', '4', 'none')

    # Guardar
    svg.escribir(svg_file)
    print(f"Archivo SVG generado: {svg_file}")

if __name__ == "__main__":
    generar_altimetria()