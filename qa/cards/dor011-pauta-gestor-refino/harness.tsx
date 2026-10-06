import React from 'react';
import { createRoot } from 'react-dom/client';
import { PautaGestorRegistrosPage } from '/src/pages/fiscalizacao/PautaGestorRegistrosPage';
import { FilamentSelect } from '/src/components/filament/Select';
export function mountSession(sessao, registrosIniciais) {
  document.querySelector('#root').style.display = 'none';
  const el = document.createElement('div'); el.id = 'audit-root'; el.style.padding = '24px'; document.body.append(el);
  createRoot(el).render(<PautaGestorRegistrosPage sessao={sessao} registrosIniciais={registrosIniciais} />);
}
export function mountSelect(searchable) {
  document.querySelector('#root').style.display = 'none';
  const el = document.createElement('div'); el.id = 'audit-root'; document.body.append(el);
  function Fixture() {
    const [value, setValue] = React.useState('');
    return <div style={{ padding: 24, width: 300 }}><button>Antes</button><FilamentSelect ariaLabel="Select de regressão" value={value} onChange={setValue} searchable={searchable} options={['Abaíra', 'Jaguaquara', 'Xique-Xique']} /><button>Depois</button><output>{value}</output></div>;
  }
  createRoot(el).render(<Fixture />);
}
