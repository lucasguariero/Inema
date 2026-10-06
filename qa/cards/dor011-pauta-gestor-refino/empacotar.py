"""Pacote auditável: Git committed + PDF original + evidências e logs reais."""
from pathlib import Path
import hashlib
import io
import json
import re
import struct
import subprocess
import zipfile
from datetime import datetime, timezone

card = Path(__file__).resolve().parent
repo = card.parents[2]
base = 'ef2665d40f8ac7301b603d554a2d9649b4cac08d'
publicado = '362e6f1993b1f88ac6fde61b7adef623944aafbb'
pdf = Path('C:/Users/lguar/Downloads/DOR011 - Módulo Fiscalização - Pauta do Gestor - Registros.pdf')
out = card / 'PACOTE-AUDITORIA-DOR011-REFINO-v1.zip'
git = lambda *args: subprocess.check_output(['git', *args], cwd=repo)
final = git('rev-parse', 'HEAD').decode().strip()
assert git('diff', '--name-only', publicado, final, '--', 'src', 'public', 'build', 'package.json', 'package-lock.json', 'vite.config.mts', 'tsconfig.json', 'index.html') == b''
sha = lambda data: hashlib.sha256(data).hexdigest()
jbytes = lambda data: json.dumps(data, ensure_ascii=False, indent=2).encode('utf-8')
entries = {}
def add(name, data):
    assert name not in entries, name
    assert not any(part in {'.git', '.vercel', 'node_modules'} or part.startswith('.env') for part in Path(name).parts), name
    entries[name] = data

roots = ['src', 'public', 'build', 'package.json', 'package-lock.json', 'index.html', 'vite.config.mts', 'tsconfig.json', 'tailwind.config.js', 'tailwind.config.ts', 'vercel.json', '.vercelignore', 'docs/color-system.md', 'qa/cards/dor011-pauta-gestor-refino']
snapshot = git('archive', '--format=zip', final, *roots)
with zipfile.ZipFile(io.BytesIO(snapshot)) as archive:
    assert archive.testzip() is None
    for entry in archive.infolist():
        if not entry.is_dir(): add('02_codigo/projeto/' + entry.filename, archive.read(entry))

changed = git('diff', '--name-only', base, final).decode('utf-8').splitlines()
add('02_codigo/arquivos-alterados.txt', ('\n'.join(changed) + '\n').encode())
add('02_codigo/refino-desta-rodada.patch', git('diff', '--binary', base, final))
meta = {'base': base, 'commit_final': final, 'commit_codigo_publicado': publicado, 'diferenca_codigo_publicado_final': [], 'deployment': 'dpl_FAj1AMY2nzYXzMbGkXhQmM951FV4', 'url_principal': 'https://inema.acto.com.br/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor', 'url_congelada_protegida': 'https://inema-15rbqfulv-guariero.vercel.app/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor', 'bundle': '/assets/index-BQaBDNaP.js', 'gerado_utc': datetime.now(timezone.utc).isoformat()}
add('02_codigo/commit-final.json', jbytes(meta))
add('01_requisitos/' + pdf.name, pdf.read_bytes())

reports = ['MATRIZ-REQUISITOS-DOR011.md', 'RELATORIO-CORRECOES.md', 'RELATORIO-QA-FUNCIONAL.md', 'RELATORIO-QA-VISUAL.md', 'RELATORIO-BUILD-TESTES.md', 'LIMITACOES-E-BLOQUEIOS.md', 'REGRESSOES-COMPONENTES-COMPARTILHADOS.md', 'PUBLICACAO-E-VALIDACAO.md', 'consumidores-select.txt', 'comentario-card.txt']
for name in reports: add('03_relatorios/' + name, (card / name).read_bytes())
add('LEIA-ME-AUDITORIA.md', (card / 'LEIA-ME-AUDITORIA.md').read_bytes())

dims = []
for folder, label in [('prints', 'local'), ('prints-producao', 'producao')]:
    for file in sorted((card / folder).glob('*.png')):
        data = file.read_bytes()
        assert data[:8] == b'\x89PNG\r\n\x1a\n', file
        width, height = struct.unpack('>II', data[16:24])
        assert (width, height) in {(1920, 1080), (3840, 2160), (390, 844)}, file
        name = '04_evidencias/' + label + '/' + file.name
        add(name, data)
        dims.append({'arquivo': name, 'largura': width, 'altura': height, 'sha256': sha(data)})
assert len([d for d in dims if '/local/' in d['arquivo']]) == 19
assert len([d for d in dims if '/producao/' in d['arquivo']]) == 10

for file in sorted((card / 'logs').iterdir()):
    if file.is_file(): add('05_logs/' + file.name, file.read_bytes())
for name in ['resultado-qa.json', 'resultado-producao.json']:
    add('05_logs/' + name, (card / name).read_bytes())
for file in sorted((card / 'diagnosticos-primeira-rodada').rglob('*')):
    if file.is_file(): add('05_logs/diagnosticos-primeira-rodada/' + file.relative_to(card / 'diagnosticos-primeira-rodada').as_posix(), file.read_bytes())

legacy = json.loads((card / 'resultado-qa.json').read_text(encoding='utf-8'))
prod = json.loads((card / 'resultado-producao.json').read_text(encoding='utf-8'))
pw = json.loads((card / 'logs/playwright-resultados.json').read_text(encoding='utf-8'))['stats']
assert len(legacy['resultados']) == 48 and all(r['status'] == 'PASS' for r in legacy['resultados']) and not legacy['errors']
assert len(prod['resultados']) == 12 and all(r['status'] == 'PASS' for r in prod['resultados']) and not prod['errors']
assert pw['expected'] == 43 and not pw['unexpected'] and not pw['skipped'] and not pw['flaky']
for name in ['npm-ci-retry', 'tsc-final', 'build-final', 'legado-final', 'playwright-final', 'producao', 'deploy', 'push', 'push-fechamento', 'exclusivo-http']:
    assert json.loads((card / f'logs/{name}.json').read_text(encoding='utf-8'))['exitCode'] == 0, name
assert json.loads((card / 'logs/lint.json').read_text(encoding='utf-8'))['exitCode'] == 1
assert '/assets/index-BQaBDNaP.js' in (card / 'logs/deploy-exclusivo.html').read_text(encoding='utf-8')
matrix = (card / reports[0]).read_text(encoding='utf-8')
reqs = re.findall(r'^\| (?:RN|TL|F|BOT|G|MSG|LEG|C)\d{3}\b', matrix, flags=re.M)
assert len(reqs) == 268, len(reqs)

add('MANIFESTO-SHA256.json', jbytes({name: sha(data) for name, data in sorted(entries.items())}))
with zipfile.ZipFile(out, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
    for name, data in entries.items(): archive.writestr(name, data)
with zipfile.ZipFile(out) as archive:
    assert archive.testzip() is None
    manifest = json.loads(archive.read('MANIFESTO-SHA256.json'))
    assert all(sha(archive.read(name)) == digest for name, digest in manifest.items())
    assert archive.read('01_requisitos/' + pdf.name) == pdf.read_bytes()

validation = {'data_utc': datetime.now(timezone.utc).isoformat(), 'commit_final': final, 'commit_codigo_publicado': publicado, 'crc_zip': 'OK', 'hashes_entradas': 'OK', 'pdf_original_identico': True, 'pdf_sha256': sha(pdf.read_bytes()), 'requisitos_indexados': len(reqs), 'testes_anteriores': 48, 'novos_testes': 43, 'fluxos_producao': 12, 'lint': 'script ausente, exit 1, NÃO VERIFICADO', 'screenshots': dims, 'quantidade_entradas_sem_validacao': len(entries)}
with zipfile.ZipFile(out, 'a', compression=zipfile.ZIP_DEFLATED) as archive:
    archive.writestr('VALIDACAO-PACOTE.json', jbytes(validation))
with zipfile.ZipFile(out) as archive: assert archive.testzip() is None
(card / 'VALIDACAO-PACOTE.json').write_bytes(jbytes({**validation, 'zip_sha256': sha(out.read_bytes()), 'zip_bytes': out.stat().st_size}))

selected = [('local', 'Print 01 - FullHD pauta final.png'), ('local', 'Print 03 - Candidato autorizado aberto.png'), ('local', 'Print 05 - TL011 contexto documental.png'), ('local', 'Print 06 - Colunas no contexto RT.png'), ('local', 'Print 07 - Upload multiplo nome longo e remocao.png'), ('producao', 'Print 22 - Producao FullHD refino.png')]
with zipfile.ZipFile(card / 'anexos-1080p-auditoria-gpt.zip', 'w', compression=zipfile.ZIP_DEFLATED) as archive:
    for folder, name in selected: archive.writestr(folder + '/' + name, entries['04_evidencias/' + folder + '/' + name])
print(json.dumps({'zip': str(out), 'bytes': out.stat().st_size, 'sha256': sha(out.read_bytes()), 'entradas': len(entries) + 1, 'prints': len(dims), 'crc': 'OK', 'manifesto': 'OK', 'pdf_original': 'idêntico', 'commit': final}, ensure_ascii=False, indent=2))
