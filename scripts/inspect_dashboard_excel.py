import zipfile
import xml.etree.ElementTree as ET

zf = zipfile.ZipFile(r"C:\Users\lguar\Downloads\CPDIRRE_VER_3.0 - Copiar.xlsx")

print("=== SLICER CACHES (FILTROS) ===")
for name in zf.namelist():
    if name.startswith("xl/slicerCaches/"):
        tree = ET.fromstring(zf.read(name))
        s_name = tree.get("name")
        source_name = tree.get("sourceName")
        items = [item.get("n") or item.get("name") or "" for item in tree.findall(".//{http://schemas.microsoft.com/office/spreadsheetml/2009/9/main}item")]
        print(f"Slicer: {s_name} (Field: {source_name}) -> {len(items)} items: {items[:8]}")

print("\n=== CHARTS (TITULOS E TIPOS) ===")
for name in sorted(zf.namelist()):
    if name.startswith("xl/charts/chart") and name.endswith(".xml"):
        tree = ET.fromstring(zf.read(name))
        # Look for title
        title_elem = tree.find(".//{http://schemas.openxmlformats.org/drawingml/2006/chart}title")
        title_text = ""
        if title_elem is not None:
            texts = [t.text for t in title_elem.findall(".//{http://schemas.openxmlformats.org/drawingml/2006/main}t") if t.text]
            title_text = "".join(texts)
            if not title_text:
                v = title_elem.find(".//{http://schemas.openxmlformats.org/drawingml/2006/chart}v")
                if v is not None and v.text: title_text = v.text
        
        # Look for chart type
        plot_area = tree.find(".//{http://schemas.openxmlformats.org/drawingml/2006/chart}plotArea")
        chart_types = []
        if plot_area is not None:
            for child in plot_area:
                tag = child.tag.split("}")[-1]
                if "Chart" in tag:
                    chart_types.append(tag)
        print(f"{name}: Title='{title_text}', Types={chart_types}")

print("\n=== DRAWING 1 (TEXTBOXES / SHAPES in MONITORAMENTO GERAL) ===")
tree1 = ET.fromstring(zf.read("xl/drawings/drawing1.xml"))
for sp in tree1.findall(".//{http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing}sp"):
    texts = [t.text for t in sp.findall(".//{http://schemas.openxmlformats.org/drawingml/2006/main}t") if t.text]
    if texts:
        print("Shape text:", " ".join(texts))

print("\n=== DRAWING 2 (TEXTBOXES / SHAPES in MONITORAMENTO_POR_TECNICO) ===")
tree2 = ET.fromstring(zf.read("xl/drawings/drawing2.xml"))
for sp in tree2.findall(".//{http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing}sp"):
    texts = [t.text for t in sp.findall(".//{http://schemas.openxmlformats.org/drawingml/2006/main}t") if t.text]
    if texts:
        print("Shape text:", " ".join(texts))
