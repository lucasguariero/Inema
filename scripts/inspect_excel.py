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

print(f"Total shared strings: {len(shared_strings)}")

wb_tree = ET.fromstring(zf.read("xl/workbook.xml"))
rels_tree = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
rel_map = {rel.get("Id"): rel.get("Target") for rel in rels_tree.findall("{http://schemas.openxmlformats.org/package/2006/relationships}Relationship")}

sheets = []
for s in wb_tree.findall(".//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheet"):
    sheets.append((s.get("name"), rel_map.get(s.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"))))

for sheet_name, sheet_path in sheets:
    sheet_xml = "xl/" + sheet_path
    if sheet_xml not in zf.namelist():
        continue
    tree = ET.fromstring(zf.read(sheet_xml))
    rows = tree.findall(".//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row")
    print(f"\n=======================================================")
    print(f"SHEET: {sheet_name} ({sheet_xml}) - Total rows: {len(rows)}")
    print(f"=======================================================")
    
    shown = 0
    for r in rows:
        non_empty = []
        for c in r.findall("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c"):
            v = c.find("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v")
            f = c.find("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}f")
            t = c.get("t")
            val = ""
            if v is not None and v.text:
                if t == "s":
                    idx = int(v.text)
                    val = shared_strings[idx] if idx < len(shared_strings) else v.text
                else:
                    val = v.text
            formula = f.text if f is not None and f.text else ""
            if val or formula:
                ref = c.get("r")
                non_empty.append(f"{ref}: '{val}'" + (f" [={formula}]" if formula else ""))
        if non_empty:
            shown += 1
            if shown <= 30:
                print(f"Row {r.get('r')}:", " | ".join(non_empty[:8]))
            elif shown == 31:
                print("... (more rows exist)")
