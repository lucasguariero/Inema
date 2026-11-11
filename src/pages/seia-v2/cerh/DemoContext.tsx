import { cerhStorageIssue } from './state';
import { FilamentSelect } from '@/components/filament/Select';
import { useAdministration, administrationStorageIssue } from './administration';
export function DemoContext() {
  const issue=cerhStorageIssue || administrationStorageIssue;
  const data = useAdministration(), params = new URLSearchParams(location.search);
  const select = (profile: string) => { const url = new URL(location.href); url.searchParams.set('cerh-perfil', profile); location.assign(url.toString()); };
  return <><p role={issue ? 'alert' : undefined} className="cerh-error">{issue}</p><details className="cerh-demo-context"><summary>Ambiente demonstrativo · dados fictícios e ações locais</summary><div className="cerh-field-grid mt-3"><div className="cerh-field"><span className="cerh-label">Perfil de demonstração</span><FilamentSelect ariaLabel="Perfil de demonstração" value={params.get('cerh-perfil') || 'diram'} onChange={select} options={[...data.users.map(u => ({ value: u.id, label: u.name })), { value: 'sem-vinculo', label: 'Sem vínculo — demonstração' }]} inlinePopup /></div><p className="cerh-helper">Sem autenticação, envio de e-mail ou integração com sistemas institucionais. A data dos cenários pode ser fixada pelo parâmetro cerh-data (AAAA-MM-DD).</p></div></details></>;
}
