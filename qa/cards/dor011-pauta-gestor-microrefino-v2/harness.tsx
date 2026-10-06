import React from 'react';
import { createRoot } from 'react-dom/client';
import { PautaGestorRegistrosPage } from '/src/pages/fiscalizacao/PautaGestorRegistrosPage';
import { PautaRegistroDialog } from '/src/pages/fiscalizacao/PautaRegistroDialog';
import { FilamentSelect } from '/src/components/filament/Select';
function root() {
  document.querySelector('#root').style.display = 'none';
  const el = document.createElement('div'); el.id = 'audit-root'; document.body.append(el);
  return createRoot(el);
}
export function mountSession(sessao, registrosIniciais) { root().render(<div style={{padding:24}}><PautaGestorRegistrosPage sessao={sessao} registrosIniciais={registrosIniciais}/></div>); }
export function mountDialog(registro, registros, sessao, inicial) {
  root().render(<PautaRegistroDialog registro={registro} registros={registros} sessao={sessao} inicial={inicial} onClose={()=>{}} onRestoreFocus={()=>{}} onExecutar={()=>{ throw Error('Comando não deve ser chamado neste ensaio negativo.'); }}/>);
}
export function mountSelect(disabled = false) {
  function Fixture() {
    const [value,setValue]=React.useState('Jaguaquara');
    return <div style={{padding:24,width:300}}><button>Antes</button><FilamentSelect name="municipio" ariaLabel="Select de microregressão" value={value} onChange={setValue} disabled={disabled} searchable options={['Abaíra','Jaguaquara','Xique-Xique']}/><button>Depois</button><output>{value}</output></div>;
  }
  root().render(<Fixture/>);
}

