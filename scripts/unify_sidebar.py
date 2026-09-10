import os
import re

ROOT = r"c:\Users\lguar\projetos\Inema"
SRC = os.path.join(ROOT, "src")

PAGES = {
    "index.html": "inicio",
    "fiscalizacao.html": "atendente",
    "emergencia-quimica.html": "emergencia-interna",
    "emergencia-quimica-externa.html": "emergencia-externa",
    "consulta-externa.html": "consulta-externa",
    "consulta-interna.html": "consulta-interna",
    "relatorios.html": "relatorios",
    "fauna.html": "none"
}

def generate_sidebar_html(active_item):
    inicio_active = (active_item == 'inicio')
    relat_active = (active_item == 'relatorios')
    fisc_active = active_item in ['atendente', 'cidadao', 'emergencia-externa', 'emergencia-interna', 'consulta-externa', 'consulta-interna']

    inicio_cls = "text-[#0F4C3A] bg-[#E2ECE9] font-semibold" if inicio_active else "text-slate-600 hover:bg-slate-100 font-medium"
    inicio_icon_cls = "text-[#0F4C3A]" if inicio_active else "text-slate-500"

    fisc_btn_cls = "text-[#0F4C3A] bg-[#E2ECE9] font-semibold" if fisc_active else "text-slate-600 hover:bg-slate-100 font-semibold"
    fisc_icon_cls = "text-[#0F4C3A]" if fisc_active else "text-slate-500"
    fisc_rotate = "rotate-180"

    def item_classes(key):
        if active_item == key:
            return ("bg-[#E2ECE9] text-[#0F4C3A] font-semibold rounded-xl", "bg-[#0F4C3A]")
        return ("text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium rounded-xl", "bg-slate-300")

    atendente_cls, atendente_dot = item_classes('atendente')
    cidadao_cls, cidadao_dot = item_classes('cidadao')
    emerg_int_cls, emerg_int_dot = item_classes('emergencia-interna')
    emerg_ext_cls, emerg_ext_dot = item_classes('emergencia-externa')
    cons_ext_cls, cons_ext_dot = item_classes('consulta-externa')
    cons_int_cls, cons_int_dot = item_classes('consulta-interna')

    relat_cls = "text-[#0F4C3A] bg-[#E2ECE9] font-semibold" if relat_active else "text-slate-600 hover:bg-slate-100 font-medium"
    relat_icon_cls = "text-[#0F4C3A]" if relat_active else "text-slate-500"

    return f'''        <!-- Overlay Mobile -->
        <div id="sidebarOverlay" onclick="toggleSidebar()" class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 hidden lg:hidden" style="top: 60px;"></div>

        <!-- Sidebar Lateral Padronizada (280px) -->
        <aside id="sidebar" class="w-[280px] bg-white border-r border-[#E5E7EB] flex flex-col fixed top-[60px] bottom-0 left-0 z-40 transition-transform duration-200 -translate-x-full lg:translate-x-0">
            <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                <!-- 1. Item Principal: Início -->
                <a href="index.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl {inicio_cls} transition-colors">
                    <span class="material-symbols-outlined text-xl {inicio_icon_cls}">home</span>
                    <span class="text-sm">Início</span>
                </a>

                <!-- 2. Módulo Principal (Expansível / Accordion Ativo): Fiscalização -->
                <div class="pt-1">
                    <button onclick="toggleSubmenu('subFiscalizacao', 'iconFiscalizacao')" class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl {fisc_btn_cls} transition-colors">
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-xl {fisc_icon_cls}">fact_check</span>
                            <span class="text-sm font-semibold">Fiscalização</span>
                        </div>
                        <span id="iconFiscalizacao" class="material-symbols-outlined text-lg {fisc_icon_cls} transition-transform duration-200 {fisc_rotate}">expand_more</span>
                    </button>
                    
                    <div id="subFiscalizacao" class="mt-1 pl-3 space-y-2 border-l border-slate-200 ml-3">
                        <!-- Subgrupo: DENÚNCIAS AMBIENTAIS (RD) -->
                        <div class="space-y-0.5">
                            <div class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 pt-2 pb-1">
                                Denúncias Ambientais (RD)
                            </div>
                            <ul class="space-y-0.5">
                                <li>
                                    <a href="fiscalizacao.html" id="menu-atendente" class="flex items-center gap-2.5 px-3 py-2 text-xs {atendente_cls} transition-colors">
                                        <span class="w-1.5 h-1.5 rounded-full {atendente_dot}"></span>
                                        <span>Atendente</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="fiscalizacao.html?fluxo=externo" id="menu-cidadao" class="flex items-center gap-2.5 px-3 py-2 text-xs {cidadao_cls} transition-colors">
                                        <span class="w-1.5 h-1.5 rounded-full {cidadao_dot}"></span>
                                        <span>Formulário Cidadão</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <!-- Subgrupo: EMERGÊNCIAS QUÍMICAS (RE) -->
                        <div class="space-y-0.5 pt-1 border-t border-slate-100">
                            <div class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 pt-2 pb-1">
                                Emergências Químicas (RE)
                            </div>
                            <ul class="space-y-0.5">
                                <li>
                                    <a href="emergencia-quimica.html?fluxo=interna" id="menu-emerg-interna" class="flex items-center gap-2.5 px-3 py-2 text-xs {emerg_int_cls} transition-colors">
                                        <span class="w-1.5 h-1.5 rounded-full {emerg_int_dot}"></span>
                                        <span>Cadastro Interno</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="emergencia-quimica-externa.html" id="menu-emerg-externa" class="flex items-center gap-2.5 px-3 py-2 text-xs {emerg_ext_cls} transition-colors">
                                        <span class="w-1.5 h-1.5 rounded-full {emerg_ext_dot}"></span>
                                        <span>Registro Externo</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <!-- Subgrupo: CONSULTAS E ACOMPANHAMENTO -->
                        <div class="space-y-0.5 pt-1 border-t border-slate-100">
                            <div class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 pt-2 pb-1">
                                Consultas e Acompanhamento
                            </div>
                            <ul class="space-y-0.5">
                                <li>
                                    <a href="consulta-externa.html" id="menu-consulta-externa" class="flex items-center gap-2.5 px-3 py-2 text-xs {cons_ext_cls} transition-colors">
                                        <span class="w-1.5 h-1.5 rounded-full {cons_ext_dot}"></span>
                                        <span>Consulta Externa</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="consulta-interna.html" id="menu-consulta-interna" class="flex items-center justify-between px-3 py-2 text-xs {cons_int_cls} transition-colors">
                                        <div class="flex items-center gap-2.5">
                                            <span class="w-1.5 h-1.5 rounded-full {cons_int_dot}"></span>
                                            <span>Painel Interno DIFIS</span>
                                        </div>
                                        <span class="text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded-full font-bold animate-pulse" id="sidebarBadgeEmergencias">3</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- 3. Módulo: Relatórios Gerenciais -->
                <div class="pt-1">
                    <a href="relatorios.html" id="menu-relatorios" class="flex items-center gap-3 px-3 py-2.5 rounded-xl {relat_cls} transition-colors">
                        <span class="material-symbols-outlined text-xl {relat_icon_cls}">bar_chart</span>
                        <span class="text-sm font-medium">Relatórios Gerenciais</span>
                    </a>
                </div>

                <!-- 4. Módulos Corporativos Complementares (Links institucionais / Inativos) -->
                <div class="pt-2">
                    <div class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 pt-2 pb-1">
                        Corporativo
                    </div>
                    <div class="space-y-0.5">
                        <a href="#" onclick="alert('Módulo de Licenciamento Ambiental em integração com o SEIA.'); return false;" class="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors group">
                            <div class="flex items-center gap-2.5">
                                <span class="material-symbols-outlined text-lg text-slate-400 group-hover:text-slate-600">description</span>
                                <span>Licenciamento</span>
                            </div>
                            <span class="text-[9px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Em breve</span>
                        </a>
                        <a href="#" onclick="alert('Módulo de Monitoramento Ambiental em integração.'); return false;" class="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors group">
                            <div class="flex items-center gap-2.5">
                                <span class="material-symbols-outlined text-lg text-slate-400 group-hover:text-slate-600">radar</span>
                                <span>Monitoramento</span>
                            </div>
                            <span class="text-[9px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Em breve</span>
                        </a>
                        <a href="#" onclick="alert('Módulo de Geoprocessamento e Informações Espaciais.'); return false;" class="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors group">
                            <div class="flex items-center gap-2.5">
                                <span class="material-symbols-outlined text-lg text-slate-400 group-hover:text-slate-600">map</span>
                                <span>Geoprocessamento</span>
                            </div>
                            <span class="text-[9px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Em breve</span>
                        </a>
                        <a href="#" onclick="alert('Módulo de Gestão Laboratorial e Análises Químicas.'); return false;" class="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors group">
                            <div class="flex items-center gap-2.5">
                                <span class="material-symbols-outlined text-lg text-slate-400 group-hover:text-slate-600">science</span>
                                <span>Laboratório</span>
                            </div>
                            <span class="text-[9px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Em breve</span>
                        </a>
                    </div>
                </div>
            </nav>

            <!-- 5. Rodapé Fixo da Sidebar: Assistente INEMA -->
            <div class="p-3 border-t border-slate-200 bg-white">
                <button onclick="alert('Assistente IA INEMA ativado. Em que posso auxiliá-lo com as demandas de Fiscalização e SEIA?')" class="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#0F4C3A] text-white text-xs font-semibold rounded-xl hover:bg-[#155d47] transition-all shadow-xs group">
                    <span class="material-symbols-outlined text-base text-amber-300 group-hover:rotate-12 transition-transform">auto_awesome</span>
                    <span>✦ Assistente INEMA</span>
                </button>
            </div>
        </aside>'''

def process_file(filename, active_item):
    path = os.path.join(SRC, filename)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = re.compile(
        r'(<!--\s*Overlay Mobile.*?-->\s*)?'
        r'(<div[^>]*id=["\']sidebarOverlay["\'][^>]*>.*?</div>\s*)?'
        r'(<!--\s*Sidebar.*?-->\s*)?'
        r'<aside[^>]*id=["\']sidebar["\'][^>]*>.*?</aside>',
        re.DOTALL
    )

    new_sidebar = generate_sidebar_html(active_item)

    if pattern.search(content):
        content = pattern.sub(new_sidebar, content, count=1)
        print(f"[OK] Replaced sidebar in {filename}")
    else:
        print(f"[WARN] Could not find sidebar in {filename}")
        return

    # In fiscalizacao.html, dynamic check for ?fluxo=externo
    if filename == "fiscalizacao.html":
        # Ensure correct active class change on ?fluxo=externo
        old_hook = re.compile(r'// Ajustar active state do menu caso seja \?fluxo=externo.*?\}\);', re.DOTALL)
        new_hook = '''// Ajustar active state do menu caso seja ?fluxo=externo
        document.addEventListener('DOMContentLoaded', () => {
            if (window.location.search.includes('fluxo=externo')) {
                const linkAtendente = document.getElementById('menu-atendente');
                const linkCidadao = document.getElementById('menu-cidadao');
                if (linkAtendente && linkCidadao) {
                    linkAtendente.className = 'flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium rounded-xl transition-colors';
                    const dotA = linkAtendente.querySelector('span');
                    if (dotA) dotA.className = 'w-1.5 h-1.5 rounded-full bg-slate-300';

                    linkCidadao.className = 'flex items-center gap-2.5 px-3 py-2 text-xs bg-[#E2ECE9] text-[#0F4C3A] font-semibold rounded-xl transition-colors';
                    const dotC = linkCidadao.querySelector('span');
                    if (dotC) dotC.className = 'w-1.5 h-1.5 rounded-full bg-[#0F4C3A]';
                }
            }
        });'''
        if old_hook.search(content):
            content = old_hook.sub(new_hook, content)
        elif "Ajustar active state do menu caso seja ?fluxo=externo" not in content:
            content = content.replace("</body>", f"<script>\n{new_hook}\n</script>\n</body>")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

for fn, act in PAGES.items():
    process_file(fn, act)

print("All sidebars processed successfully with new Grouped Information Architecture.")
