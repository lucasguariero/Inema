import zipfile
import xml.etree.ElementTree as ET

xlsx_path = r"C:\Users\lguar\Downloads\CPDIRRE_VER_3.0 - Copiar.xlsx"
zf = zipfile.ZipFile(xlsx_path)

shared_strings = []
if "xl/sharedStrings.xml" in zf.namelist():
    tree = ET.fromstring(zf.read("xl/sharedStrings.xml"))
    for si in tree.findall("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si"):
        texts = [t.text for t in si.findall(".//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t") if t.text]
        shared_strings.append("".join(texts))

def dump_sheet(sheet_xml, name):
    tree = ET.fromstring(zf.read(sheet_xml))
    print(f"\n==========================================")
    print(f"DUMPING {name} ({sheet_xml})")
    print(f"==========================================")
    rows = tree.findall(".//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row")
    for r in rows:
        row_idx = r.get("r")
        row_data = []
        for c in r.findall("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c"):
            ref = c.get("r")
            t = c.get("t")
            v = c.find("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v")
            f = c.find("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}f")
            val = ""
            if v is not None and v.text:
                if t == "s":
                    idx = int(v.text)
                    val = shared_strings[idx] if idx < len(shared_strings) else v.text
                else:
                    val = v.text
            formula = f.text if f is not None and f.text else ""
            if val or formula:
                row_data.append(f"{ref}: {val}" + (f" [={formula}]" if formula else ""))
        if row_data:
            print(f"R{row_idx}: " + " | ".join(row_data))

dump_sheet("xl/worksheets/sheet2.xml", "MONITORAMENTO GERAL")
dump_sheet("xl/worksheets/sheet3.xml", "MONITORAMENTO_POR_TECNICO")
