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

    inicio_cls = "text-[#0F4C3A] bg-[#E2ECE9] font-semibold" if inicio_active else "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-medium"
    inicio_icon_cls = "text-[#0F4C3A]" if inicio_active else "text-slate-500"

    fisc_btn_cls = "text-[#0F4C3A] bg-[#E2ECE9] font-semibold" if fisc_active else "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-semibold"
    fisc_icon_cls = "text-[#0F4C3A]" if fisc_active else "text-slate-500"
    fisc_rotate = "rotate-180"

    def item_classes(key):
        if active_item == key:
            return "bg-[#E2ECE9] text-[#0F4C3A] font-semibold rounded-lg"
        return "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-medium rounded-lg"

    atendente_cls = item_classes('atendente')
    cidadao_cls = item_classes('cidadao')
    emerg_int_cls = item_classes('emergencia-interna')
    emerg_ext_cls = item_classes('emergencia-externa')
    cons_ext_cls = item_classes('consulta-externa')
    cons_int_cls = item_classes('consulta-interna')

    relat_cls = "text-[#0F4C3A] bg-[#E2ECE9] font-semibold" if relat_active else "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-medium"
    relat_icon_cls = "text-[#0F4C3A]" if relat_active else "text-slate-500"

    return f'''        <!-- Overlay Mobile -->
        <div id="sidebarOverlay" onclick="toggleSidebar()" class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 hidden lg:hidden" style="top: 60px;"></div>

        <!-- Sidebar Lateral Padronizada (280px) -->
        <aside id="sidebar" class="w-[280px] bg-white border-r border-[#E5E7EB] flex flex-col fixed top-[60px] bottom-0 left-0 z-40 transition-transform duration-200 -translate-x-full lg:translate-x-0">
            <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                <!-- 1. Item Principal: Início -->
                <a href="index.html" class="flex items-center gap-3 px-3 py-2.5 rounded-lg {inicio_cls} transition-colors duration-150">
                    <span class="material-symbols-outlined text-xl {inicio_icon_cls}">home</span>
                    <span class="text-sm font-medium">Início</span>
                </a>

                <!-- 2. Módulo Principal (Expansível / Accordion Ativo): Fiscalização -->
                <div class="pt-1">
                    <button onclick="toggleSubmenu('subFiscalizacao', 'iconFiscalizacao')" class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg {fisc_btn_cls} transition-colors duration-150">
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-xl {fisc_icon_cls}">fact_check</span>
                            <span class="text-sm font-semibold">Fiscalização</span>
                        </div>
                        <span id="iconFiscalizacao" class="material-symbols-outlined text-lg {fisc_icon_cls} transition-transform duration-200 {fisc_rotate}">expand_more</span>
                    </button>
                    
                    <div id="subFiscalizacao" class="mt-1 border-l-2 border-slate-200 ml-4 pl-3 space-y-1">
                        <!-- Subgrupo: DENÚNCIAS -->
                        <div class="space-y-1">
                            <div class="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-2 pb-1.5 flex items-center gap-2">
                                Denúncias
                            </div>
                            <div class="space-y-1">
                                <a href="fiscalizacao.html" id="menu-atendente" class="flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm transition-colors duration-150 {atendente_cls}">
                                    <span>Atendente</span>
                                </a>
                                <a href="fiscalizacao.html?fluxo=externo" id="menu-cidadao" class="flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm transition-colors duration-150 {cidadao_cls}">
                                    <span>Formulário Cidadão</span>
                                </a>
                            </div>
                        </div>

                        <!-- Subgrupo: EMERGÊNCIAS QUÍMICAS -->
                        <div class="space-y-1 border-t border-slate-100 mt-2 pt-2">
                            <div class="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-1.5 pb-1.5 flex items-center gap-2">
                                Emergências Químicas
                            </div>
                            <div class="space-y-1">
                                <a href="emergencia-quimica.html?fluxo=interna" id="menu-emerg-interna" class="flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm transition-colors duration-150 {emerg_int_cls}">
                                    <span>Cadastro Interno</span>
                                </a>
                                <a href="emergencia-quimica-externa.html" id="menu-emerg-externa" class="flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm transition-colors duration-150 {emerg_ext_cls}">
                                    <span>Registro Externo</span>
                                </a>
                            </div>
                        </div>

                        <!-- Subgrupo: CONSULTAS -->
                        <div class="space-y-1 border-t border-slate-100 mt-2 pt-2">
                            <div class="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-1.5 pb-1.5 flex items-center gap-2">
                                Consultas
                            </div>
                            <div class="space-y-1">
                                <a href="consulta-externa.html" id="menu-consulta-externa" class="flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm transition-colors duration-150 {cons_ext_cls}">
                                    <span>Consulta Cidadão</span>
                                </a>
                                <a href="consulta-interna.html" id="menu-consulta-interna" class="flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm transition-colors duration-150 {cons_int_cls}">
                                    <span>Painel Interno DIFIS</span>
                                    <span class="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full" id="sidebarBadgeEmergencias">3</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 3. Módulo: Relatórios Gerenciais -->
                <div class="pt-1">
                    <a href="relatorios.html" id="menu-relatorios" class="flex items-center gap-3 px-3 py-2.5 rounded-lg {relat_cls} transition-colors duration-150">
                        <span class="material-symbols-outlined text-xl {relat_icon_cls}">bar_chart</span>
                        <span class="text-sm font-medium">Relatórios Gerenciais</span>
                    </a>
                </div>
            </nav>

            <!-- Rodapé Fixo da Sidebar: Assistente INEMA -->
            <div class="p-3 border-t border-slate-200 bg-white">
                <button onclick="alert('Assistente IA INEMA ativado. Em que posso auxiliá-lo com as demandas de Fiscalização e SEIA?')" class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0F4C3A] text-white font-medium text-xs hover:bg-[#0c3d2e] transition-colors shadow-xs group">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                        <path d="M5 3v4"/>
                        <path d="M19 17v4"/>
                        <path d="M3 5h4"/>
                        <path d="M17 19h4"/>
                    </svg>
                    <span>Assistente INEMA</span>
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
        old_hook = re.compile(r'// Ajustar active state do menu caso seja \?fluxo=externo.*?\}\);', re.DOTALL)
        new_hook = '''// Ajustar active state do menu caso seja ?fluxo=externo
        document.addEventListener('DOMContentLoaded', () => {
            if (window.location.search.includes('fluxo=externo')) {
                const linkAtendente = document.getElementById('menu-atendente');
                const linkCidadao = document.getElementById('menu-cidadao');
                if (linkAtendente && linkCidadao) {
                    linkAtendente.className = 'flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm font-medium text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition-colors duration-150';
                    linkCidadao.className = 'flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm bg-[#E2ECE9] text-[#0F4C3A] font-semibold transition-colors duration-150';
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
