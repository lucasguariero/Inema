# -*- coding: utf-8 -*-
import re

def clean_file(path, replacements):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    for a, b in replacements:
        if isinstance(a, str):
            text = text.replace(a, b)
        else:
            text = a.sub(b, text)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(Cleaned:, path)

# 1. CadastroPlantonistaPage.tsx
clean_file('src/pages/fiscalizacao/CadastroPlantonistaPage.tsx', [
    ('DOR006 • Módulo Fiscalização', 'Módulo Fiscalização'),
    ('Modo Edição (RN010)', 'Modo Edição'),
    ('TL001 — Dados do Técnico Plantonista', 'Dados do Técnico Plantonista'),
    ('conforme regras da RN010.', 'conforme regras de gestão.'),
    (re.compile(r'<span className=text-\[10px\] text-slate-400 font-normal>LEG\d{3}(?: / RN\d{3})?</span>'), ''),
    ('<span className=text-[10px] text-slate-400>LEG006 / RN005</span>', ''),
    ('(RN001)', ''),
    ('(RN001, RN007)', ''),
    ('<p className=text-[10px] text-slate-400>Informe o telefone institucional do técnico.</p>', ''),
    ('<p className=text-[10px] text-slate-400>Telefone pessoal importado do cadastro básico.</p>', ''),
    ('<p className=text-[10px] text-slate-400>E-mail institucional importado.</p>', ''),
    ('Salvar (BOT001)', 'Salvar'),
    ('Recuperar (BOT002)', 'Recuperar'),
    ('Excluir (BOT003)', 'Excluir'),
    ('<Save className=w-3.5 h-3.5 mr-1 />', ''),
    ('<RotateCcw className=w-3.5 h-3.5 mr-1 />', ''),
    ('<Trash2 className=w-3.5 h-3.5 mr-1 />', ''),
    ('<Info className=w-4 h-4 text-teal-600 />', ''),
    ('Diretrizes Funcionais (DOR006)', 'Diretrizes Funcionais'),
    ('<strong>RN001:</strong>', '•'),
    ('<strong>RN002 / RN004 / RN005:</strong>', '•'),
    ('<strong>RN003:</strong>', '•'),
    ('<strong>RN008 / RN009:</strong>', '•'),
    ('<strong>RN010:</strong>', '•'),
])

# 2. CadastroEscalaPage.tsx
clean_file('src/pages/fiscalizacao/CadastroEscalaPage.tsx', [
    ('DOR007 • Módulo Fiscalização', 'Módulo Fiscalização'),
    (re.compile(r'Edição de Escala \([^)]+\)'), 'Edição de Escala'),
    ('TL001 — Dados Gerais da Escala', 'Dados Gerais da Escala'),
    ('(RN012)', ''),
    ('(RN001)', ''),
    ('(RN006)', ''),
    ('(RN007)', ''),
    ('(RN008)', ''),
    (re.compile(r'<span className=text-\[10px\] text-slate-400 font-normal>LEG\d{3}(?: / RN\d{3})?</span>'), ''),
    ('<span className=text-[10px] text-slate-400>LEG005, LEG006, LEG007 / RN003</span>', ''),
    ('<span className=text-[10px] text-slate-400 font-normal>LEG008</span>', ''),
    ('<span className=text-[10px] text-slate-400 font-normal>LEG009</span>', ''),
    ('<Users className=w-3.5 h-3.5 text-teal-600 />', ''),
    ('<Car className=w-3.5 h-3.5 text-slate-500 />', ''),
    (re.compile(r'<Badge variant=outline className=text-\[10px\] text-slate-400 font-normal>\s*RN006, RN007, RN008\s*</Badge>'), ''),
    ('Informações Operacionais e Transporte (Opcionais)', 'Informações Operacionais e Transporte'),
    ('Salvar (BOT001)', 'Salvar Escala'),
    ('Recuperar (BOT002)', 'Recuperar Escala'),
    ('Excluir (BOT003)', 'Excluir Escala'),
    ('<Save className=w-3.5 h-3.5 mr-1 />', ''),
    ('<RotateCcw className=w-3.5 h-3.5 mr-1 />', ''),
    ('<Trash2 className=w-3.5 h-3.5 mr-1 />', ''),
    ('Diretrizes Normativas (DOR007)', 'Diretrizes Normativas'),
    ('• <strong>RN001 / RN002</strong>: Período e Unidade Regional obrigatórios para validação.', '• Período e Unidade Regional são campos obrigatórios para validação.'),
    ('• <strong>RN003 / RN004</strong>: Múltiplos plantonistas na mesma escala; ao menos um obrigatório.', '• É permitido adicionar múltiplos plantonistas na mesma escala (mínimo de um).'),
    ('• <strong>RN005</strong>: Telefones integrados do cadastro de plantonista, protegidos contra edição.', '• Telefones são integrados do cadastro básico e protegidos contra edição direta.'),
    ('• <strong>RN010 / RN014</strong>: Impede duplicidade de período + UR + plantonista e bloqueia sobreposição em datas conflitantes.', '• Impede duplicidade de período e Unidade Regional, bloqueando sobreposição em datas conflitantes.'),
    ('• <strong>RN013</strong>: Confirmação prévia (MSG004) antes da exclusão definitiva.', '• Exclusão de escala exige confirmação formal prévia.')
])

# 3. AtividadesDidaticasPage.tsx
clean_file('src/pages/uc/AtividadesDidaticasPage.tsx', [
    ('DOR003 • Módulo Gestão de Unidades de Conservação', 'Módulo Gestão de Unidades de Conservação'),
    ('(sem coleta - RN009) e Tipo 2 (com coleta/captura - RN010).', '(sem coleta) e Tipo 2 (com coleta e captura de espécimes).'),
    ('Processos AAD (TL007)', 'Processos AAD'),
    ('Solicitar AAD (Novo)', 'Nova Solicitação'),
    ('Análise e Decisão (TL005/006)', 'Análise e Decisão'),
    ('TL007 — Painel de Atividades Didáticas em UCs Estaduais', 'Painel de Atividades Didáticas em UCs Estaduais'),
    ('AAD Tipo 1 — Sem Coleta de Material (RN009)', 'AAD Tipo 1 — Sem Coleta de Material'),
    ('AAD Tipo 2 — Com Coleta / Captura (RN010)', 'AAD Tipo 2 — Com Coleta e Captura de Espécimes'),
    ('<Layers className=w-3.5 h-3.5 inline mr-1 />', ''),
    ('<GraduationCap className=w-3.5 h-3.5 inline mr-1 />', ''),
    ('<FileCheck2 className=w-3.5 h-3.5 inline mr-1 />', ''),
    ('<BookOpen className=w-4 h-4 text-teal-600 />', ''),
    ('<FlaskConical className=w-4 h-4 text-purple-600 />', ''),
    ('(RN002, RN003)', ''),
    ('(RN009)', ''),
    ('(RN010)', '')
])

# 4. PesquisaCientificaPage.tsx
clean_file('src/pages/uc/PesquisaCientificaPage.tsx', [
    (re.compile(r'<span>/</span>\s*<span>DOR004</span>\s*<span>/</span>'), '<span>/</span>'),
    ('Painel (TL001)', 'Painel'),
    ('Novo Projeto (TL002)', 'Novo Projeto'),
    ('Ato e Relatórios (TL006)', 'Ato e Relatórios'),
    ('<ShieldCheck className=w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0 />', ''),
    ('bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-lg p-4 flex items-start gap-3', 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex items-start gap-3'),
    ('text-teal-900 dark:text-teal-200', 'text-slate-800 dark:text-slate-200'),
    ('text-teal-800 dark:text-teal-300', 'text-slate-600 dark:text-slate-400'),
    ('(RN010)', ''),
    ('(RN011, RN012)', ''),
    ('(RN011)', ''),
    ('(RN012)', ''),
    ('text-3xl font-bold text-teal-600 dark:text-teal-400', 'text-3xl font-bold text-slate-800 dark:text-slate-100'),
    ('text-3xl font-bold text-amber-500 dark:text-amber-400', 'text-3xl font-bold text-slate-800 dark:text-slate-100'),
    ('text-3xl font-bold text-rose-600 dark:text-rose-400', 'text-3xl font-bold text-slate-800 dark:text-slate-100'),
    ('text-3xl font-bold text-indigo-600 dark:text-indigo-400', 'text-3xl font-bold text-slate-800 dark:text-slate-100'),
    ('(TL001)', ''),
    ('(TL002)', ''),
    ('(TL006)', ''),
    ('(TL007)', '')
])

# 5. AutorizacaoVisitacaoPage.tsx
clean_file('src/pages/uc/AutorizacaoVisitacaoPage.tsx', [
    ('DOR002 • Módulo Gestão de Unidades de Conservação', 'Módulo Gestão de Unidades de Conservação'),
    ('Processo AAV / APV (SEI-BA)', 'Autorização de Eventos (AAV)'),
    ('(F-DUC-066)', ''),
    ('(F-DUC-070)', ''),
    ('(F-DUC-072)', ''),
    ('Painel de Processos AAV (TL007)', 'Painel de Processos'),
    ('Análise e Portaria (TL005 / TL006)', 'Análise e Portaria'),
    ('<FileSpreadsheet className=w-3.5 h-3.5 inline mr-1 />', ''),
    ('<FileCheck2 className=w-3.5 h-3.5 inline mr-1 />', ''),
    ('(RN010)', ''),
    ('(RN007)', ''),
    ('(RN004)', ''),
    ('(RN008, RN017)', ''),
    (re.compile(r'<div className=w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600>\s*<Clock className=w-4 h-4 />\s*</div>'), ''),
    (re.compile(r'<div className=w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600>\s*<CheckCircle2 className=w-4 h-4 />\s*</div>'), ''),
    (re.compile(r'<div className=w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600>\s*<AlertCircle className=w-4 h-4 />\s*</div>'), ''),
    (re.compile(r'<div className=w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600>\s*<ShieldCheck className=w-4 h-4 />\s*</div>'), ''),
    ('text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5', 'text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5'),
    ('text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5', 'text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5'),
    ('text-amber-600 dark:text-amber-400 font-semibold', 'text-slate-700 dark:text-slate-300 font-medium')
])

# 6. AgendamentoVisitacaoPage.tsx
clean_file('src/pages/uc/AgendamentoVisitacaoPage.tsx', [
    ('DOR001 • Módulo Gestão de Unidades de Conservação', 'Módulo Gestão de Unidades de Conservação'),
    ('Formulário F-DUC-069-00', 'Formulário de Agendamento'),
    ('Solicitar Agendamento', 'Solicitar Agendamento'),
    ('Pauta do Gestor (TL009)', 'Pauta do Gestor'),
    ('Calendário UC (TL010)', 'Calendário da UC'),
    ('<FileEdit className=w-3.5 h-3.5 inline mr-1 />', ''),
    ('<Layers className=w-3.5 h-3.5 inline mr-1 />', ''),
    ('<Calendar className=w-3.5 h-3.5 inline mr-1 />', ''),
    ('<AlertTriangle className=w-4 h-4 text-amber-600 shrink-0 mt-0.5 />', ''),
    ('(RN001 / MSG001)', ''),
    ('(TL002)', ''),
    ('(TL003)', ''),
    ('(TL004)', ''),
    ('(TL005)', ''),
    ('(TL006)', ''),
    ('(TL007)', ''),
    ('(TL008)', ''),
    ('(TL009)', ''),
    ('(TL010)', ''),
    ('(TL012)', ''),
    ('TL002 — Seleção da Unidade de Conservação Estadual', 'Seleção da Unidade de Conservação Estadual'),
    ('(RN002, RN003)', ''),
    ('(RN003)', ''),
    ('(RN025)', ''),
    ('(RN001)', ''),
    ('(RN022)', ''),
    ('(RN023)', ''),
    ('(RN024)', ''),
    ('(RN005/RN024)', ''),
    ('text-slate-400 hover:text-slate-600', 'text-slate-600 hover:text-slate-900 font-medium')
])

print(All 6 prototypes sanitized successfully!)
