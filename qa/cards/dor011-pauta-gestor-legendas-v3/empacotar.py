"""Pacote v3 rastreável, sem credenciais/arquivos pessoais; todos os gates assertados."""
from pathlib import Path
from collections import Counter
from datetime import datetime, timezone
import hashlib, io, json, re, struct, subprocess, zipfile
card=Path(__file__).resolve().parent
repo=card.parents[2]
base='56848551c3a1e946cb8156473cfef368e55ae469'
published='1f021d14dc9ad54fcad6562274a118470b60d511'
deployment='dpl_3kJgngbxtZAtRZExNPWnRUvtknL5'
frozen='https://inema-a6vt4ei9r-guariero.vercel.app/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor'
pdf=Path('C:/Users/lguar/Downloads/DOR011 - Módulo Fiscalização - Pauta do Gestor - Registros.pdf')
git=lambda *args:subprocess.check_output(['git',*args],cwd=repo)
final=git('rev-parse','HEAD').decode().strip()
front=['src','public','build','package.json','package-lock.json','vite.config.mts','tsconfig.json','index.html','tailwind.config.js','tailwind.config.ts','vercel.json','.vercelignore']
assert not git('diff','--name-only',published,final,'--',*front),'Código final difere do publicado'
assert not git('diff','--name-only',base,final,'--','package.json','package-lock.json','src/components/filament/Select.tsx')
sha=lambda b:hashlib.sha256(b).hexdigest()
serialize=lambda obj:json.dumps(obj,ensure_ascii=False,indent=2).encode('utf-8')
data={}
def add(name,content):
    assert name not in data,name
    assert not any(p in {'.env','.git','.vercel','node_modules'} or p.startswith('.env.') for p in Path(name).parts),name
    data[name]=content
roots=front+['.gitignore','AGENTS.md','docs/color-system.md','qa/cards/dor011-pauta-gestor-refino','qa/cards/dor011-pauta-gestor-microrefino-v2','qa/cards/dor011-pauta-gestor-legendas-v3']
with zipfile.ZipFile(io.BytesIO(git('archive','--format=zip',final,*roots))) as archive:
    assert archive.testzip() is None
    for item in archive.infolist():
        if not item.is_dir():add('02_codigo/projeto/'+item.filename,archive.read(item))
changed=git('diff','--name-only',base,final).decode().splitlines()
assert '.gitignore' not in changed and 'REFACTOR.md' not in changed
add('02_codigo/arquivos-alterados.txt',('\n'.join(changed)+'\n').encode())
add('02_codigo/patch-v2-para-v3.patch',git('diff','--binary',base,final))
http=json.loads((card/'logs/http-publicado.json').read_text(encoding='utf-8'))
assert http['bundle']=='/assets/index-1z-Wjnu6.js' and http['status']==200
meta={'base_v2':base,'commit_codigo_publicado':published,'commit_final':final,'codigo_final_vs_publicado':[],
 'deployment_v3':deployment,'url_exclusiva_v3':frozen,'url_principal':http['url'],'bundle_cloud':http['bundle'],'css_cloud':http['css'],
 'url_v2_preservada':'https://inema-bhst82wyo-guariero.vercel.app/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor',
 'url_v1_preservada':'https://inema-15rbqfulv-guariero.vercel.app/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor',
 'origem_deploy':'Exportação Git limpa do frontend publicado; deploy --scope guariero; proteção Vercel mantida.',
 'gerado_utc':datetime.now(timezone.utc).isoformat()}
add('02_codigo/commit-final.json',serialize(meta));add('01_requisitos/'+pdf.name,pdf.read_bytes())
matrix=(card/'MATRIZ-REQUISITOS-DOR011-v3.md').read_text(encoding='utf-8')
for name in ['MATRIZ-REQUISITOS-DOR011-v3.md','MATRIZ-LEGENDAS-DOR011.md']:add('03_matriz/'+name,(card/name).read_bytes())
for name in ['RELATORIO-MICROCORRECOES-v3.md','RELATORIO-QA-FUNCIONAL-v3.md','RELATORIO-QA-VISUAL-v3.md','RELATORIO-BUILD-TESTES-v3.md','DELTA-AUDITORIA-8_8-v3.md','LIMITACOES-E-BLOQUEIOS-v3.md','INCONSISTENCIAS-DO-PDF-v3.md','SEGURANCA-PENDENCIAS-v3.md','PUBLICACAO-E-VALIDACAO-v3.md','comentario-card.txt']:add('04_relatorios/'+name,(card/name).read_bytes())
add('LEIA-ME-AUDITORIA.md',(card/'LEIA-ME-AUDITORIA.md').read_bytes())
selected=[
 'Print 01 - FullHD filtros recolhidos LEG022.png','Print 02 - FullHD LEG001 a LEG015 filtros.png','Print 03 - FullHD periodo e classificacao.png',
 'Print 04 - FullHD LEG017 LEG018 LEG019 arquivar.png','Print 05 - FullHD TL011 LEG024 disabled.png',
 'Print 09 - 4K LEG001 a LEG015 filtros.png','Print 12 - 4K TL011 LEG024 disabled.png',
 'Print 13 - 390px LEG001 a LEG015 filtros.png','Print 14 - 390px periodo e classificacao.png','Print 15 - 390px LEG017 LEG018 LEG019 arquivar.png','Print 16 - 390px TL011 LEG024 disabled.png',
 'Print 17 - FullHD TL005 LEG016.png','Print 18 - FullHD comentario LEG020.png','Print 19 - FullHD configuracao LEG021.png','Print 20 - FullHD arquivos LEG023.png']
evidence=[]
for folder,names in [('prints',selected),('prints-producao',['Print 29 - Producao TL011 FullHD.png','Print 30 - Producao TL011 390px rodape.png'])]:
    for name in names:
        b=(card/folder/name).read_bytes();assert b[:8]==b'\x89PNG\r\n\x1a\n'
        w,h=struct.unpack('>II',b[16:24]);assert (w,h) in {(1920,1080),(3840,2160),(390,844)}
        target='05_evidencias/'+folder+'/'+name;add(target,b);evidence.append({'arquivo':target,'largura':w,'altura':h,'sha256':sha(b)})
for item in (card/'pdf-reference').glob('*.png'):add('05_evidencias/referencia-pdf/'+item.name,item.read_bytes())
for item in sorted((card/'logs').iterdir()):
    if item.suffix in {'.json','.log','.html'}:add('06_logs/'+item.name,item.read_bytes())
for name in ['resultado-qa.json','resultado-producao.json']:add('06_logs/'+name,(card/name).read_bytes())
for name,count in [('resultado-qa.json',48),('resultado-producao.json',12)]:
    result=json.loads((card/name).read_text(encoding='utf-8'));assert len(result['resultados'])==count and not result['errors'] and all(r['status']=='PASS' for r in result['resultados'])
for name,count in [('playwright-resultados.json',43),('micro-playwright-resultados.json',24),('legendas-resultados.json',39),('legendas-complementar-resultados.json',5),('producao-playwright-resultados.json',3),('legendas-producao-resultados.json',26)]:
    stats=json.loads((card/'logs'/name).read_text(encoding='utf-8'))['stats'];assert stats['expected']==count and stats['unexpected']==stats['skipped']==stats['flaky']==0,(name,stats)
for name in ['tsc-final','build-final','verificacoes-48-final','regressao-43-final','micro-testes-final-24','legendas-final','legendas-complementar','helpers-computed','matriz-268','deploy-scope','publicado-http','publicado-exclusivo','producao-final','producao-delta','legendas-producao','alias-final','push-fechamento']:
    assert json.loads((card/'logs'/(name+'.json')).read_text(encoding='utf-8'))['exitCode']==0,name
deploy=json.loads((card/'logs/deploy-scope.json').read_text(encoding='utf-8'))['stdout'];assert deployment in deploy and '"readyState": "READY"' in deploy
for name in ['html-producao-final.html','deploy-exclusivo.html']:assert http['bundle'] in (card/'logs'/name).read_text(encoding='utf-8')
assert json.loads((card/'logs/npm-audit.json').read_text(encoding='utf-8'))['exitCode']==1
rows=re.findall(r'^\| ((?:RN|TL|F|BOT|G|MSG|LEG|C)\d{3})[^\n]*?\| (ATENDIDO|PARCIAL|NÃO ATENDIDO|BLOQUEADO|NÃO VERIFICADO) \|',matrix,re.M)
assert len(rows)==268 and len(set(n for n,s in rows))==268
counts=Counter(s for n,s in rows);assert counts==Counter({'ATENDIDO':126,'PARCIAL':111,'NÃO ATENDIDO':12,'BLOQUEADO':19})
c=Counter(s for n,s in rows if n.startswith('C'));assert c==Counter({'ATENDIDO':49,'PARCIAL':37,'NÃO ATENDIDO':3,'BLOQUEADO':4})
for rel,line in re.findall(r'(src/[^| :]+\.tsx?):(\d+)',matrix):assert 1<=int(line)<=len(data['02_codigo/projeto/'+rel].decode('utf-8').splitlines())
add('MANIFESTO-SHA256.json',serialize({n:sha(b) for n,b in sorted(data.items())}))
validation={'gerado_utc':meta['gerado_utc'],'commit_final':final,'codigo_publicado':published,'crc':'OK','manifesto':'OK','pdf_original_identico':True,'pdf_sha256':sha(pdf.read_bytes()),
 'requisitos':268,'status_requisitos':dict(counts),'C093':dict(c),'legendas':{'implementadas':23,'bloqueadas':['LEG002'],'parciais':[]},
 'testes':{'anteriores':48,'regressao':43,'micro':24,'legendas_principal':39,'complementar':5,'casos_leg_unicos':40,'producao_ui':12,'producao_delta':3,'legendas_producao':26},
 'lint':'NÃO VERIFICADO: script inexistente','seguranca':'1 HIGH source-map-js 1.2.1 preexistente','screenshots':evidence,'manifesto_observacao':'Sem hashes próprios do manifesto/validação para evitar circularidade.'}
add('VALIDACAO-PACOTE.json',serialize(validation))
out=card/'PACOTE-AUDITORIA-DOR011-REFINO-v3.zip'
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as archive:
    for n,b in data.items():archive.writestr(n,b)
with zipfile.ZipFile(out) as archive:
    assert archive.testzip() is None
    assert archive.read('01_requisitos/'+pdf.name)==pdf.read_bytes()
    manifest=json.loads(archive.read('MANIFESTO-SHA256.json'));assert all(sha(archive.read(n))==digest for n,digest in manifest.items())
(card/'VALIDACAO-PACOTE.json').write_bytes(serialize({**validation,'zip_sha256':sha(out.read_bytes()),'zip_bytes':out.stat().st_size}))
six=[selected[i] for i in [1,2,3,4,11,13]]
for zipname in ['anexos.zip','anexos-1080p-auditoria-gpt.zip']:
    with zipfile.ZipFile(card/zipname,'w',zipfile.ZIP_DEFLATED) as archive:
        for name in six:archive.writestr(name,data['05_evidencias/prints/'+name])
print(json.dumps({'zip':str(out),'sha256':sha(out.read_bytes()),'bytes':out.stat().st_size,'entradas':len(data),'prints':len(evidence),'crc':'OK','pdf':'original idêntico','matrix':dict(counts),'C093':dict(c),'commit':final},ensure_ascii=False,indent=2))
