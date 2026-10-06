"""Reauditoria v2: fontes committed, evidência real, PDF original e integridade."""
from pathlib import Path
import hashlib, io, json, re, struct, subprocess, zipfile
from datetime import datetime, timezone

card = Path(__file__).resolve().parent
repo = card.parents[2]
base = 'ff91135c02ed61a30145b9636d94d440dc5e1b46'
publicado = 'dc2f06e9c42ce81dd45cfeff823a4cc9e6281fda'
pdf = Path('C:/Users/lguar/Downloads/DOR011 - Módulo Fiscalização - Pauta do Gestor - Registros.pdf')
out = card / 'PACOTE-AUDITORIA-DOR011-REFINO-v2.zip'
git = lambda *args: subprocess.check_output(['git', *args], cwd=repo)
final = git('rev-parse', 'HEAD').decode().strip()
fontes = ['src', 'public', 'build', 'package.json', 'package-lock.json', 'vite.config.mts', 'tsconfig.json', 'index.html', 'tailwind.config.js', 'tailwind.config.ts', 'vercel.json', '.vercelignore']
assert not git('diff', '--name-only', publicado, final, '--', *fontes), 'Código final difere do publicado'
assert not git('diff', '--name-only', base, final, '--', 'package.json', 'package-lock.json'), 'Dependências fora do escopo'
sha = lambda b: hashlib.sha256(b).hexdigest()
jbytes = lambda obj: json.dumps(obj, ensure_ascii=False, indent=2).encode('utf-8')
entries = {}
def add(name, data):
    assert name not in entries, name
    assert not any(p in {'.git','.vercel','node_modules'} or p.startswith('.env') for p in Path(name).parts), name
    entries[name] = data

# Snapshot frontend/QA, não histórico nem diretórios de outros documentos/entregas.
roots = fontes + ['.gitignore', 'AGENTS.md', 'docs/color-system.md', 'qa/cards/dor011-pauta-gestor-refino', 'qa/cards/dor011-pauta-gestor-microrefino-v2']
snapshot = git('archive', '--format=zip', final, *roots)
with zipfile.ZipFile(io.BytesIO(snapshot)) as archive:
    assert archive.testzip() is None
    for item in archive.infolist():
        if not item.is_dir(): add('02_codigo/projeto/' + item.filename, archive.read(item))

changed = git('diff', '--name-only', base, final).decode('utf-8').splitlines()
assert '.gitignore' not in changed and 'REFACTOR.md' not in changed
add('02_codigo/arquivos-alterados.txt', ('\n'.join(changed)+'\n').encode('utf-8'))
add('02_codigo/patch-v1-para-v2.patch', git('diff','--binary',base,final))
meta = {
    'base_v1':base,'commit_final':final,'commit_codigo_publicado':publicado,
    'codigo_publicado_vs_final': [],'deployment_final':'dpl_D63zi4w3XrS3e9L8MNeLzbTFBud7',
    'url_principal':'https://inema.acto.com.br/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor',
    'url_congelada_v2':'https://inema-bhst82wyo-guariero.vercel.app/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor',
    'url_congelada_v1':'https://inema-15rbqfulv-guariero.vercel.app/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor',
    'bundle_cloud':'/assets/index-BJvPcLXY.js','css_cloud':'/assets/index-DTvrwqyO.css',
    'origem_deploy':'exportação Git limpa dc2f06e; proteção Vercel preservada',
    'gerado_utc':datetime.now(timezone.utc).isoformat()
}
add('02_codigo/commit-final.json',jbytes(meta))
add('01_requisitos/'+pdf.name,pdf.read_bytes())
matrix = (card/'MATRIZ-REQUISITOS-DOR011-v2.md').read_text(encoding='utf-8')
add('03_matriz/MATRIZ-REQUISITOS-DOR011-v2.md',matrix.encode('utf-8'))
reports = ['RELATORIO-MICROCORRECOES.md','RELATORIO-QA-FUNCIONAL.md','RELATORIO-QA-VISUAL.md',
 'RELATORIO-REGRESSAO-FILAMENTSELECT.md','RELATORIO-BUILD-TESTES.md','LIMITACOES-E-BLOQUEIOS.md',
 'INCONSISTENCIAS-DO-PDF.md','SEGURANCA-PENDENCIAS.md','DELTA-AUDITORIA-8_8.md','PUBLICACAO-E-VALIDACAO.md','comentario-card.txt']
for name in reports: add('04_relatorios/'+name,(card/name).read_bytes())
add('LEIA-ME-AUDITORIA.md',(card/'LEIA-ME-AUDITORIA.md').read_bytes())

selected = [
 ('local','Print 01 - FullHD pauta final.png'),('local','Print 08 - 4K pauta final.png'),
 ('local','Print 10 - Estreita pauta final.png'),('local','Print 04 - Duplicidades preservam selecao.png'),
 ('local','Print 25 - TL005 selecao e contexto pagina 2.png'),('local','Print 22 - TL011 anexos e fontes FullHD.png'),
 ('local','Print 27 - TL011 4K anexos.png'),('local','Print 24 - Configurador colunas condicionais.png'),
 ('local','Print 26 - Filtros e datas invalidas preservam resultado.png'),('local','Print 28 - Modal estreito e foco.png'),
 ('local','Print 14 - AC vazia no escopo exclusivo.png'),('local','Print 15 - Consulta sem resultados.png'),
 ('producao','Print 29 - Producao TL011 FullHD.png'),('producao','Print 30 - Producao TL011 390px rodape.png')
]
dims = []
for folder,name in selected:
    b=(card/('prints' if folder=='local' else 'prints-producao')/name).read_bytes()
    assert b[:8] == b'\x89PNG\r\n\x1a\n'
    w,h=struct.unpack('>II',b[16:24]);assert (w,h) in {(1920,1080),(3840,2160),(390,844)}
    target='05_evidencias/'+folder+'/'+name;add(target,b)
    dims.append({'arquivo':target,'largura':w,'altura':h,'sha256':sha(b)})
assert len(dims)==14
for item in sorted((card/'logs').iterdir()):
    if item.is_file() and item.suffix in {'.json','.log','.html'}: add('06_logs/'+item.name,item.read_bytes())
for name in ['resultado-qa.json','resultado-producao.json']:
    add('06_logs/'+name,(card/name).read_bytes())
for item in sorted((card/'diagnosticos').rglob('*')):
    if item.is_file():add('06_logs/diagnosticos/'+item.relative_to(card/'diagnosticos').as_posix(),item.read_bytes())

legacy=json.loads((card/'resultado-qa.json').read_text(encoding='utf-8'))
prod=json.loads((card/'resultado-producao.json').read_text(encoding='utf-8'))
assert len(legacy['resultados'])==48 and all(r['status']=='PASS' for r in legacy['resultados']) and not legacy['errors']
assert len(prod['resultados'])==12 and all(r['status']=='PASS' for r in prod['resultados']) and not prod['errors']
for file,count in [('playwright-resultados.json',43),('micro-playwright-resultados.json',24),('producao-playwright-resultados.json',3)]:
    s=json.loads((card/'logs'/file).read_text(encoding='utf-8'))['stats']
    assert s['expected']==count and s['unexpected']==0 and s['skipped']==0 and s['flaky']==0,(file,s)
for name in ['tsc-final','build-final','verificacoes-48-final-v2','regressao-43-final','micro-testes-final-24','producao-final','producao-delta','deploy-reprodutivel','publicado-http','push-codigo','push-paginacao','push-fechamento']:
    assert json.loads((card/'logs'/(name+'.json')).read_text(encoding='utf-8'))['exitCode']==0,name
assert json.loads((card/'logs/npm-audit.json').read_text(encoding='utf-8'))['exitCode']==1
for html in ['deploy-exclusivo.html','html-producao-final.html']:
    assert meta['bundle_cloud'] in (card/'logs'/html).read_text(encoding='utf-8')
rows=re.findall(r'^\| ((?:RN|TL|F|BOT|G|MSG|LEG|C)\d{3})[^\n]*?\| (ATENDIDO|PARCIAL|NÃO ATENDIDO|BLOQUEADO|NÃO VERIFICADO) \|',matrix,re.M)
assert len(rows)==268 and len({r[0] for r in rows})==268
counts={s:sum(r[1]==s for r in rows) for s in ['ATENDIDO','PARCIAL','NÃO ATENDIDO','BLOQUEADO','NÃO VERIFICADO']}
assert counts=={'ATENDIDO':103,'PARCIAL':111,'NÃO ATENDIDO':35,'BLOQUEADO':19,'NÃO VERIFICADO':0}
assert len([r for r in rows if r[0].startswith('C')])==93
# Toda referência de arquivo/linha da matriz deve resolver no snapshot.
for rel,line in re.findall(r'(src/[^| :]+\.tsx?):(\d+)',matrix):
    data=entries['02_codigo/projeto/'+rel].decode('utf-8')
    assert 1<=int(line)<=len(data.splitlines()),(rel,line)

add('MANIFESTO-SHA256.json',jbytes({n:sha(b) for n,b in sorted(entries.items())}))
with zipfile.ZipFile(out,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as archive:
    for n,b in entries.items():archive.writestr(n,b)
with zipfile.ZipFile(out) as archive:
    assert archive.testzip() is None
    manifest=json.loads(archive.read('MANIFESTO-SHA256.json'))
    assert all(sha(archive.read(n))==digest for n,digest in manifest.items())
    assert archive.read('01_requisitos/'+pdf.name)==pdf.read_bytes()
validation={'data_utc':datetime.now(timezone.utc).isoformat(),'commit_final':final,'commit_codigo_publicado':publicado,
 'crc_zip':'OK','hashes_entradas':'OK','pdf_original_identico':True,'pdf_sha256':sha(pdf.read_bytes()),
 'requisitos':268,'componentes_C':93,'status_requisitos':counts,'testes':{'anteriores':48,'regressao':43,'micro':24,'producao_ui':12,'producao_delta':3},
 'lint':'NÃO VERIFICADO: script inexistente','seguranca':'1 HIGH source-map-js preexistente','screenshots':dims,
 'observacao_manifesto':'VALIDACAO-PACOTE e manifesto não incluem seus próprios hashes para evitar circularidade'}
with zipfile.ZipFile(out,'a',compression=zipfile.ZIP_DEFLATED) as archive:archive.writestr('VALIDACAO-PACOTE.json',jbytes(validation))
with zipfile.ZipFile(out) as archive:assert archive.testzip() is None
(card/'VALIDACAO-PACOTE.json').write_bytes(jbytes({**validation,'zip_sha256':sha(out.read_bytes()),'zip_bytes':out.stat().st_size}))
six=[1,4,24,26,14,29]
with zipfile.ZipFile(card/'anexos-1080p-auditoria-gpt.zip','w',compression=zipfile.ZIP_DEFLATED) as archive:
    for d in dims:
        if int(Path(d['arquivo']).name.split(' ')[1]) in six:
            assert (d['largura'],d['altura'])==(1920,1080)
            archive.writestr(d['arquivo'],entries[d['arquivo']])
print(json.dumps({'zip':str(out),'bytes':out.stat().st_size,'sha256':sha(out.read_bytes()),'entradas':len(entries)+1,
 'prints':len(dims),'crc':'OK','manifesto':'OK','pdf':'original idêntico','requisitos':counts,'commit':final},ensure_ascii=False,indent=2))

