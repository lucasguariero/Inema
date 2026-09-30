import os
import re

ROOT = r"c:\Users\lguar\projetos\Inema"
SRC = os.path.join(ROOT, "src")

def refactor_fiscalizacao():
    path = os.path.join(SRC, "fiscalizacao.html")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Injetar CSS do design system se não estiver presente
    if 'css/design-system.css' not in content:
        content = content.replace('</head>', '    <link rel="stylesheet" href="css/design-system.css">\n</head>')

    # Header height e classes
    content = re.sub(
        r'<header class="h-16 bg-\[#0F4C3A\] fixed top-0 left-0 right-0 z-50 flex items-center px-4 gap-4">',
        '<header class="h-[60px] bg-[#0F4C3A] text-white fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-6 shadow-xs">',
        content
    )

    # Container wrapper
    content = re.sub(
        r'<div class="flex min-h-screen pt-16">',
        '<div class="flex min-h-screen pt-[60px] bg-[#F8FAFC]">',
        content
    )

    # Body background
    content = re.sub(
        r'<body class="bg-white min-h-screen">',
        '<body class="bg-[#F8FAFC] text-slate-800 min-h-screen antialiased">',
        content
    )

    # Cards principais
    content = content.replace(
        '<div id="card-detalhes-registro" class="bg-white border border-gray-200 rounded-xl p-6">',
        '<div id="card-detalhes-registro" class="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">'
    )
    content = content.replace(
        '<!-- CARD 2: Ocorrência -->\n                    <div class="bg-white border border-gray-200 rounded-xl p-6">',
        '<!-- CARD 2: Ocorrência -->\n                    <div class="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">'
    )
    content = content.replace(
        '<!-- CARD 3: Localização -->\n                    <div class="bg-white border border-gray-200 rounded-xl p-6">',
        '<!-- CARD 3: Localização -->\n                    <div class="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">'
    )
    content = content.replace(
        '<!-- CARD 4: Denunciante (Com Variantes) -->\n                    <div class="bg-white border border-gray-200 rounded-xl p-6">',
        '<!-- CARD 4: Denunciante (Com Variantes) -->\n                    <div class="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">'
    )

    # Rodapé de botões
    old_buttons = '''<!-- RODAPÉ DE AÇÕES -->
                    <div class="flex justify-end gap-2 pt-4 border-t border-gray-200">
                        <button type="button" class="px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded-lg hover:bg-red-50">Excluir rascunho</button>
                        <button type="button" class="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-white">Salvar Rascunho</button>
                        <button type="submit" class="px-6 py-2 text-sm font-medium text-white bg-stepper-teal rounded-lg hover:opacity-90">Finalizar Denúncia</button>
                    </div>'''

    new_buttons = '''<!-- RODAPÉ DE AÇÕES -->
                    <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-200/80">
                        <button type="button" class="px-4 py-2.5 text-xs sm:text-sm font-semibold text-rose-600 border border-rose-200 bg-rose-50/50 rounded-xl hover:bg-rose-100/70 hover:border-rose-300 transition-all cursor-pointer">Excluir rascunho</button>
                        <button type="button" class="inema-btn-secondary cursor-pointer">Salvar Rascunho</button>
                        <button type="submit" class="inema-btn-primary shadow-xs cursor-pointer">Finalizar Denúncia</button>
                    </div>'''

    content = content.replace(old_buttons, new_buttons)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("[OK] Refactored fiscalizacao.html")

def refactor_emergencia_quimica():
    path = os.path.join(SRC, "emergencia-quimica.html")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Injetar CSS do design system se não estiver presente
    if 'css/design-system.css' not in content:
        content = content.replace('</head>', '    <link rel="stylesheet" href="css/design-system.css">\n</head>')

    # Header height
    content = re.sub(
        r'<header class="h-16 bg-inema-green fixed top-0 left-0 right-0 z-50 flex items-center px-4 gap-4 shadow-sm">',
        '<header class="h-[60px] bg-[#0F4C3A] text-white fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-6 shadow-xs">',
        content
    )

    # Container wrapper
    content = re.sub(
        r'<div class="flex pt-16 min-h-screen">',
        '<div class="flex pt-[60px] min-h-screen bg-[#F8FAFC]">',
        content
    )

    # Body
    content = re.sub(
        r'<body class="bg-surface text-slate-800 antialiased min-h-screen flex flex-col">',
        '<body class="bg-[#F8FAFC] text-slate-800 antialiased min-h-screen flex flex-col">',
        content
    )

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("[OK] Refactored emergencia-quimica.html")

def refactor_emergencia_quimica_externa():
    path = os.path.join(SRC, "emergencia-quimica-externa.html")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Injetar CSS do design system se não estiver presente
    if 'css/design-system.css' not in content:
        content = content.replace('</head>', '    <link rel="stylesheet" href="css/design-system.css">\n</head>')

    # Header height
    content = re.sub(
        r'<header class="h-16 bg-inema-green fixed top-0 left-0 right-0 z-50 flex items-center px-4 gap-4 shadow-sm">',
        '<header class="h-[60px] bg-[#0F4C3A] text-white fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-6 shadow-xs">',
        content
    )

    # Container wrapper
    content = re.sub(
        r'<div class="flex pt-16 min-h-screen">',
        '<div class="flex pt-[60px] min-h-screen bg-[#F8FAFC]">',
        content
    )

    # Body
    content = re.sub(
        r'<body class="bg-surface text-slate-800 antialiased min-h-screen flex flex-col">',
        '<body class="bg-[#F8FAFC] text-slate-800 antialiased min-h-screen flex flex-col">',
        content
    )

    # Saneamento de ruídos de especificação (LEG00x, RN00x, BOT00x)
    content = content.replace('LEG009 - ', '')
    content = content.replace('LEG010 - ', '')
    content = content.replace('LEG011 - ', '')
    content = content.replace('LEG001 - ', '')
    content = content.replace('LEG002 - ', '')
    content = content.replace('LEG004 - ', '')
    content = content.replace('LEG005 - ', '')
    content = content.replace(' (LEG007)', '')
    content = content.replace(' (LEG012)', '')
    content = content.replace(' (LEG013)', '')
    content = content.replace(' (LEG014)', '')
    content = content.replace('<strong>MSG005 (Orientação fixa):</strong>', '<strong>Formatos aceitos:</strong>')
    content = content.replace('RN005 - ', '')
    content = content.replace('RN028 - ', '')

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("[OK] Refactored emergencia-quimica-externa.html")

def refactor_consulta_externa():
    path = os.path.join(SRC, "consulta-externa.html")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Injetar CSS do design system se não estiver presente
    if 'css/design-system.css' not in content:
        content = content.replace('</head>', '    <link rel="stylesheet" href="css/design-system.css">\n</head>')

    # Body
    content = re.sub(
        r'<body class="bg-\[#F8FAF9\] text-slate-800 min-h-screen flex flex-col antialiased">',
        '<body class="bg-[#F8FAFC] text-slate-800 min-h-screen flex flex-col antialiased">',
        content
    )

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("[OK] Refactored consulta-externa.html")

def refactor_consulta_interna():
    path = os.path.join(SRC, "consulta-interna.html")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Injetar CSS do design system se não estiver presente
    if 'css/design-system.css' not in content:
        content = content.replace('</head>', '    <link rel="stylesheet" href="css/design-system.css">\n</head>')

    # Body
    content = re.sub(
        r'<body class="bg-\[#F8FAF9\] text-slate-800 h-full flex flex-col antialiased">',
        '<body class="bg-[#F8FAFC] text-slate-800 min-h-screen flex flex-col antialiased">',
        content
    )

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("[OK] Refactored consulta-interna.html")

def refactor_relatorios():
    path = os.path.join(SRC, "relatorios.html")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Injetar CSS do design system se não estiver presente
    if 'css/design-system.css' not in content:
        content = content.replace('</head>', '    <link rel="stylesheet" href="css/design-system.css">\n</head>')

    # Header height
    content = re.sub(
        r'<header class="h-16 bg-\[#0F4C3A\] fixed top-0 left-0 right-0 z-50 flex items-center px-4 gap-4">',
        '<header class="h-[60px] bg-[#0F4C3A] text-white fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-6 shadow-xs">',
        content
    )

    # Container wrapper
    content = re.sub(
        r'<div class="flex pt-16 min-h-screen">',
        '<div class="flex pt-[60px] min-h-screen bg-[#F8FAFC]">',
        content
    )

    # Body
    content = re.sub(
        r'<body class="bg-background text-slate-800 antialiased">',
        '<body class="bg-[#F8FAFC] text-slate-800 antialiased min-h-screen">',
        content
    )

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("[OK] Refactored relatorios.html")

def refactor_fauna():
    path = os.path.join(SRC, "fauna.html")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Injetar CSS do design system se não estiver presente
    if 'css/design-system.css' not in content:
        content = content.replace('</head>', '    <link rel="stylesheet" href="css/design-system.css">\n</head>')

    # Header height
    content = re.sub(
        r'<header class="h-16 bg-inema-green fixed top-0 left-0 right-0 z-50 flex items-center px-4 gap-4 shadow-sm no-print">',
        '<header class="h-[60px] bg-[#0F4C3A] text-white fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-6 shadow-xs no-print">',
        content
    )

    # Container wrapper
    content = re.sub(
        r'<div class="flex pt-16 min-h-screen">',
        '<div class="flex pt-[60px] min-h-screen bg-[#F8FAFC]">',
        content
    )

    # Body
    content = re.sub(
        r'<body class="bg-surface text-slate-800 antialiased min-h-screen flex flex-col">',
        '<body class="bg-[#F8FAFC] text-slate-800 antialiased min-h-screen flex flex-col">',
        content
    )

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("[OK] Refactored fauna.html")

if __name__ == "__main__":
    refactor_fiscalizacao()
    refactor_emergencia_quimica()
    refactor_emergencia_quimica_externa()
    refactor_consulta_externa()
    refactor_consulta_interna()
    refactor_relatorios()
    refactor_fauna()
