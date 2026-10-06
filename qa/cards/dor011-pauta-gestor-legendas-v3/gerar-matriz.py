"""Atualização mecânica da matriz v2; somente 23 status LEG mudam."""
from pathlib import Path
import difflib, re, subprocess
from collections import Counter
from pypdf import PdfReader
card = Path(__file__).resolve().parent
repo = card.parents[2]
base = '56848551c3a1e946cb8156473cfef368e55ae469'
pdf = Path('C:/Users/lguar/Downloads/DOR011 - Módulo Fiscalização - Pauta do Gestor - Registros.pdf')
original = (card.parent/'dor011-pauta-gestor-microrefino-v2/MATRIZ-REQUISITOS-DOR011-v2.md').read_text(encoding='utf-8')
texts = dict((int(n), t) for n,t in re.findall(r"(\d+):'([^']+)'",(card/'legendas.spec.cjs').read_text(encoding='utf-8').split('const groups=')[0]))
assert len(texts)==24
raw = ' '.join(PdfReader(pdf).pages[p].extract_text() for p in [11,12])
normalized = re.sub(r'\s+', ' ', raw).replace('recolha -o','recolha-o').replace('utilizá -los','utilizá-los')
for n,t in texts.items():
    assert t in normalized, (n,t)
print('24 textos comparados com extração do PDF; hífens LEG022 conferidos no render 12–13.')
conditions = {
1:'Dados do registro aberto; Todos/RD/RE/RC.',
2:'Não renderizar. RN009 permite Órgão sem Origem; LEG002 limita a Ofício (PDF p40).',
3:'Dados do registro aberto; Todos/RD e origem com setor. F003/RT permanece bloqueado, sem criar Origem em RT.',
4:'Localização aberta; guias com filtros (Todos/RD/RE/RC/RT/OF).',
5:'Período e situação aberto; um helper sob Data inicial, descrevendo as duas datas; ambos os inputs o referenciam.',
6:'Dados do registro aberto; guias com filtros.',7:'Dados do registro aberto; guias com filtros.',
8:'Dados do registro aberto; Todos/RD/RE/RC/RT e verDemandante=true; acompanha Denunciante/Comunicante/Técnico/Demandante.',
9:'Localização aberta; campo Coordenada disponível; GD/GMS/UTM preservados.',
10:'Período e situação aberto; campo Status disponível, sem resolver PE001.',
11:'Classificação aberta; Todos/RD/RC/RT; também no campo Eixo Temático da ação Alterar eixo autorizada. Sem duplicar sob Subitem.',
12:'Localização aberta; Todos/RD/RE/RT. RA continua vazia sem filtros.',
13:'Período e situação aberto; campo Dias em Aberto.',
14:'Classificação aberta; RE ou Todos (visão agregada que inclui RE). Ausente em RD/RC/RT/OF/RA/AC.',
15:'Localização aberta; Todos/RD/RE/RT, sem campos em guias vazias.',
16:'TL005, lista de possíveis duplicidades visível; ausente na subvisão do candidato e na confirmação.',
17:'Modal Arquivar autorizado, edição do Motivo do arquivamento; ausente na confirmação.',
18:'Modal Arquivar autorizado e motivo=Outros; ausente em outro motivo/confirmar.',
19:'Modal Arquivar ou Desanexar autorizado; campo Justificativa; ausente na confirmação.',
20:'Modal Adicionar comentário autorizado, campo Comentário.',
21:'TL010 configurador aberto com colunas disponíveis; RA/AC sem botão nem helper.',
22:'Pauta autorizada com grupos de filtros; uma ocorrência acima dos quatro grupos, inclusive recolhidos; RA/AC sem helper.',
23:'Modal Adicionar arquivo autorizado, junto ao seletor; não no acervo de leitura/metadata.',
24:'TL011 aberto com referência espacial disponível; junto à indicação separada de integração pendente. Ausente no MSG033 e na subvisão do documento.'
}
screens = {**{n:'Print 02/03 FullHD; Print 09 4K; Print 13/14 390px' for n in range(1,16)},16:'Print 17 FullHD TL005',17:'Print 04/11/15 Arquivar',18:'Print 04/11/15 Arquivar',19:'Print 04/11/15 Arquivar',20:'Print 18 FullHD comentário',21:'Print 19 FullHD configurador',22:'Print 01/08/12 grupos recolhidos',23:'Print 20 FullHD arquivos',24:'Print 05/12/16 TL011 disabled'}
lines = original.replace('microrefino v2','legendas e compliance v3').splitlines()
matrix=[]; legend_rows=[]
for line in lines:
    if line.startswith('C001–C093 foram'):
        line='C001–C093: classificação preservada nesta rodada (49 A / 37 P / 3 NA / 4 B / 0 NV); não foi declarada nova execução remota. As 23 LEG não conflitantes foram reproduzidas literalmente com testes DOM e aplicabilidade. LEG002 continua BLOQUEADA. O status da legenda não resolve a regra/integração associada.'
    if line.startswith('Fontes de execução desta versão:'):
        line='Evidências atuais: logs/verificacoes-48-final.log, regressao-43-final.log, micro-testes-final-24.log, legendas-final.log e legendas-complementar.log. Testes DOM: 23 LEG individuais, oito guias e condições negativas. Prints selecionados e registros de produção no pacote v3. Os C mantêm as descrições completas e critérios da v2, com regressões reexecutadas e referências de linha remapeadas ao código v3.'
    match=re.match(r'^\| LEG(\d{3}) — ([^|]+) \|',line)
    if match:
        n=int(match[1]);field=match[2].strip();parts=line.split(' | ')
        status='BLOQUEADO' if n==2 else 'ATENDIDO'
        parts[2]=status;parts[3]='Texto do PDF p12–13; matriz de legendas v3'
        parts[5]='Aplicabilidade negativa LEG002/RN009' if n==2 else f'legendas.spec.cjs: LEG{n:03} + condições por guia/ação'
        parts[6]=conditions[n]+' |'
        line=' | '.join(parts)
        screen='Filtros da pauta' if n<=15 or n==22 else 'TL010' if n==21 else 'TL011' if n==24 else 'Modal de ação / TL005' if n==16 else 'Modal de ação'
        component='InputWrapper.hint' if n<=15 or n in [17,18,19,20,23] else 'DialogDescription' if n==21 else 'Helper inline text-xs/token neutro'
        legend_rows.append(f'| LEG{n:03} | {texts[n]} | {screen} | {field} — {component} | {conditions[n]} | {status} | '+('Teste de ausência nas oito guias; sem print da regra conflitante.' if n==2 else f'Teste DOM individual LEG{n:03}, condições negativas; {screens[n]}.')+' |')
    line=line.replace('Logs v2 + inspeção','Logs v3 (regressão) + inspeção')
    line=line.replace('- ATENDIDO: 103','- ATENDIDO: 126').replace('- NÃO ATENDIDO: 35','- NÃO ATENDIDO: 12')
    matrix.append(line)
maps={}
def anchor(match):
    rel,number=match.groups();old=int(number)-1
    if rel not in maps:
        before=subprocess.check_output(['git','show',f'{base}:{rel}'],cwd=repo).decode('utf-8').splitlines()
        after=(repo/rel).read_text(encoding='utf-8').splitlines()
        mapping={}
        for tag,a,b,c,d in difflib.SequenceMatcher(a=before,b=after,autojunk=False).get_opcodes():
            for i in range(a,b):mapping[i]=c+(i-a if tag=='equal' else 0)
        maps[rel]=(mapping,len(after))
    mapping,length=maps[rel]
    return f'{rel}:{min(mapping.get(old,old)+1,length)}'
updated=re.sub(r'(src/[^| :]+\.tsx?):(\d+)',anchor,'\n'.join(matrix)+'\n')
rows=re.findall(r'^\| ((?:RN|TL|F|BOT|G|MSG|LEG|C)\d{3})[^\n]*?\| (ATENDIDO|PARCIAL|NÃO ATENDIDO|BLOQUEADO|NÃO VERIFICADO) \|',updated,re.M)
assert len(rows)==268 and len(set(n for n,s in rows))==268
assert Counter(s for n,s in rows)==Counter({'ATENDIDO':126,'PARCIAL':111,'NÃO ATENDIDO':12,'BLOQUEADO':19})
oldrows=dict(re.findall(r'^\| ((?:RN|TL|F|BOT|G|MSG|LEG|C)\d{3})[^\n]*?\| (ATENDIDO|PARCIAL|NÃO ATENDIDO|BLOQUEADO|NÃO VERIFICADO) \|',original,re.M))
assert [n for n,s in rows if oldrows[n]!=s]==[f'LEG{n:03}' for n in range(1,25) if n!=2]
(card/'MATRIZ-REQUISITOS-DOR011-v3.md').write_text(updated,encoding='utf-8')
(card/'MATRIZ-LEGENDAS-DOR011.md').write_text('# Rastreabilidade LEG001–LEG024 — DOR011 v3\n\nFonte: PDF original, páginas físicas 12–13; visualização dos renders para conferir hífen de LEG022. Textos exatos, sem abreviação; apenas normalização de espaços/quebras de linha. LEG002 não renderizada. Helpers herdaram text-xs e token neutro; InputWrapper.hint e DialogDescription reutilizados.\n\nATENDIDO aqui significa texto/aplicabilidade demonstrados no protótipo, não integração corporativa homologada. LEG003 acompanha F003 em RD; o conflito RT não foi arbitrado. RA/AC continuam sem dados/filtros.\n\n| LEG | Texto oficial | Tela | Campo/Componente | Condição de exibição | Status | Evidência |\n|---|---|---|---|---|---|---|\n'+'\n'.join(legend_rows)+'\n',encoding='utf-8')
print('268 IDs únicos; apenas 23 LEG mudaram de NÃO ATENDIDO para ATENDIDO. C093 preservados.')
