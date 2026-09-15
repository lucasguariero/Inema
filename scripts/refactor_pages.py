import os
import re

ROOT = r"c:\Users\lguar\projetos\Inema"
SRC = os.path.join(ROOT, "src")

COMMON_HEAD = '''    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        'inema': {
                            'green': '#0F4C3A',
                            'green-hover': '#145A45',
                            'green-dark': '#0A3528',
                            'green-light': '#E8F5E9',
                            'sage': '#E2ECE9',
                            'sage-dark': '#C8DED8',
                            'gold': '#D4A017'
                        },
                        'inema-green': '#0F4C3A',
                        'inema-green-hover': '#145A45',
                        'inema-green-dark': '#0A3528',
                        'inema-green-light': '#E8F5E9',
                        'inema-sage': '#E2ECE9',
                        'inema-sage-dark': '#C8DED8',
                        'primary': '#0F4C3A',
                        'primary-container': '#0F4C3A',
                        'secondary': '#145A45',
                        'surface': '#F8FAFC',
                        'background': '#F8FAFC',
                        'border-subtle': '#E2E8F0',
                        'sidebar-bg': '#FFFFFF',
                        'sidebar-active': '#E2ECE9',
                        'stepper-teal': '#0F4C3A',
                        'error': '#BA1A1A'
                    },
                    fontFamily: {
                        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
                    },
                    boxShadow: {
                        '2xs': '0 1px 2px rgba(15, 23, 42, 0.04)',
                        'xs': '0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
                        'card': '0 1px 3px rgba(15, 23, 42, 0.05), 0 1px 2px rgba(15, 23, 42, 0.03)',
                        'card-hover': '0 8px 20px -3px rgba(15, 23, 42, 0.08), 0 3px 8px -2px rgba(15, 23, 42, 0.04)'
                    }
                }
            }
        }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <link rel="stylesheet" href="css/design-system.css">'''

def refactor_index():
    path = os.path.join(SRC, "index.html")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Atualizar header height para h-[60px]
    content = re.sub(r'<header class="[^"]*"', '<header class="h-[60px] bg-[#0F4C3A] text-white fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-6 shadow-xs"', content, count=1)

    # Atualizar wrapper após header
    content = re.sub(r'<div class="flex min-h-screen pt-header-height">', '<div class="flex flex-1 pt-[60px] min-h-screen bg-[#F8FAFC]">', content)

    # Injetar design-system.css se não existir
    if 'css/design-system.css' not in content:
        content = content.replace('</head>', '    <link rel="stylesheet" href="css/design-system.css">\n</head>')

    # Atualizar cartões principais e hero
    old_main_pattern = re.compile(r'<main class="p-8">.*?</main>', re.DOTALL)
    new_main = '''<main class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
                <!-- Hero Banner Institucional -->
                <div class="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
                    <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div class="space-y-2">
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0F4C3A] border border-emerald-200/70 text-xs font-semibold">
                                <span class="w-2 h-2 rounded-full bg-[#0F4C3A]"></span>
                                <span>Portal Unificado de Fiscalização Ambiental</span>
                            </div>
                            <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Bem-vindo, Lucas</h1>
                            <p class="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                                Plataforma integrada para recepção, triagem técnica, tramitação e despacho de denúncias ambientais e emergências químicas do Estado da Bahia.
                            </p>
                        </div>
                        <div class="flex items-center gap-3 shrink-0 flex-wrap">
                            <div class="px-4 py-3 bg-slate-50/80 rounded-xl border border-slate-200/80 text-left">
                                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Status Operacional</span>
                                <span class="text-xs font-bold text-emerald-700 flex items-center gap-1.5 mt-0.5">
                                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Sistemas Operando Normalmente
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Seção: Acesso Rápido -->
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-lg font-bold text-slate-900 tracking-tight">Módulos de Acesso Rápido</h2>
                            <p class="text-xs text-slate-500">Selecione o canal ou ferramenta correspondente ao seu perfil</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <!-- Card 1: Fiscalização Atendente -->
                        <a href="fiscalizacao.html" onclick="closeSidebar()" class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-700/40 transition-all duration-200 group flex flex-col justify-between cursor-pointer">
                            <div>
                                <div class="flex items-start justify-between gap-4 mb-4">
                                    <div class="w-12 h-12 rounded-xl bg-emerald-50 text-[#0F4C3A] border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <span class="material-symbols-outlined text-2xl">fact_check</span>
                                    </div>
                                    <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                                        Triagem Interna
                                    </span>
                                </div>
                                <h3 class="font-bold text-slate-900 group-hover:text-[#0F4C3A] transition-colors text-base">
                                    Fiscalização - Atendente
                                </h3>
                                <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                    Recepção presencial, telefônica, ofícios e manifestações de denúncias ambientais no sistema interno.
                                </p>
                            </div>
                            <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0F4C3A]">
                                <span>Acessar Atendimento</span>
                                <span class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </div>
                        </a>

                        <!-- Card 2: Fiscalização Cidadão -->
                        <a href="fiscalizacao.html?fluxo=externo" class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-700/40 transition-all duration-200 group flex flex-col justify-between cursor-pointer">
                            <div>
                                <div class="flex items-start justify-between gap-4 mb-4">
                                    <div class="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <span class="material-symbols-outlined text-2xl">person</span>
                                    </div>
                                    <span class="px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-[11px] font-semibold border border-teal-100">
                                        Canal Cidadão
                                    </span>
                                </div>
                                <h3 class="font-bold text-slate-900 group-hover:text-teal-700 transition-colors text-base">
                                    Denúncia - Cidadão
                                </h3>
                                <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                    Portal externo de autoatendimento para registro público de denúncias ambientais (identificadas ou anônimas).
                                </p>
                            </div>
                            <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
                                <span>Acessar Formulário</span>
                                <span class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </div>
                        </a>

                        <!-- Card 3: Emergência Química -->
                        <a href="emergencia-quimica.html" class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-700/40 transition-all duration-200 group flex flex-col justify-between cursor-pointer">
                            <div>
                                <div class="flex items-start justify-between gap-4 mb-4">
                                    <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/70 flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <span class="material-symbols-outlined text-2xl">warning</span>
                                    </div>
                                    <span class="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200/80">
                                        Plantão 24h
                                    </span>
                                </div>
                                <h3 class="font-bold text-slate-900 group-hover:text-amber-800 transition-colors text-base">
                                    Emergência Química
                                </h3>
                                <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                    Ocorrências críticas com produtos perigosos, acidentes de transporte, vazamentos e acionamento de plantonistas.
                                </p>
                            </div>
                            <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-800">
                                <span>Cadastrar Emergência</span>
                                <span class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </div>
                        </a>

                        <!-- Card 4: Consulta Interna DIFIS -->
                        <a href="consulta-interna.html" class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#0F4C3A]/50 transition-all duration-200 group flex flex-col justify-between cursor-pointer">
                            <div>
                                <div class="flex items-start justify-between gap-4 mb-4">
                                    <div class="w-12 h-12 rounded-xl bg-[#E2ECE9] text-[#0F4C3A] border border-[#CBDED8] flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <span class="material-symbols-outlined text-2xl">manage_search</span>
                                    </div>
                                    <span class="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-200">
                                        3 Emergências Ativas
                                    </span>
                                </div>
                                <h3 class="font-bold text-slate-900 group-hover:text-[#0F4C3A] transition-colors text-base">
                                    Consulta Interna DIFIS
                                </h3>
                                <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                    Painel operacional centralizado com filtros avançados, exportação, histórico de auditoria e tramitação.
                                </p>
                            </div>
                            <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0F4C3A]">
                                <span>Abrir Painel DIFIS</span>
                                <span class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </div>
                        </a>

                        <!-- Card 5: Consulta Cidadão -->
                        <a href="consulta-externa.html" class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-600/40 transition-all duration-200 group flex flex-col justify-between cursor-pointer">
                            <div>
                                <div class="flex items-start justify-between gap-4 mb-4">
                                    <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <span class="material-symbols-outlined text-2xl">search</span>
                                    </div>
                                    <span class="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-100">
                                        Transparência
                                    </span>
                                </div>
                                <h3 class="font-bold text-slate-900 group-hover:text-blue-700 transition-colors text-base">
                                    Consulta Cidadão
                                </h3>
                                <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                    Acompanhamento público de denúncias e emergências com upload e download de relatórios regulatórios.
                                </p>
                            </div>
                            <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
                                <span>Acessar Consulta</span>
                                <span class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </div>
                        </a>

                        <!-- Card 6: Relatórios Gerenciais -->
                        <a href="relatorios.html" class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-400 transition-all duration-200 group flex flex-col justify-between cursor-pointer">
                            <div>
                                <div class="flex items-start justify-between gap-4 mb-4">
                                    <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <span class="material-symbols-outlined text-2xl">assessment</span>
                                    </div>
                                    <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                                        BI & Gráficos
                                    </span>
                                </div>
                                <h3 class="font-bold text-slate-900 group-hover:text-slate-700 transition-colors text-base">
                                    Relatórios Gerenciais
                                </h3>
                                <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                    Indicadores quantitativos, distribuição geográfica por polo regional e métricas de desempenho institucional.
                                </p>
                            </div>
                            <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
                                <span>Ver Relatórios</span>
                                <span class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </div>
                        </a>
                    </div>
                </div>
            </main>'''
    
    if old_main_pattern.search(content):
        content = old_main_pattern.sub(new_main, content)
        print("[OK] Updated main content in index.html")

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("[OK] Refactored index.html successfully")

refactor_index()
