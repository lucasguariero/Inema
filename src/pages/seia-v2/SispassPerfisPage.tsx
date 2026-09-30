import React, { useState } from 'react';
import {
  Bird,
  Plus,
  ArrowLeft,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  FileCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilamentTabs, FilamentTabItem } from '@/components/filament/Tabs';
import { Section } from '@/components/filament/Section';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';

interface SispassPerfisPageProps {
  onNavigate?: (route: string) => void;
}

export const SispassPerfisPage: React.FC<SispassPerfisPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('perfis');

  const tabs: FilamentTabItem[] = [
    { id: 'perfis', label: 'Criadores Cadastrados', badge: '8.420', badgeVariant: 'primary' },
    { id: 'validacao', label: 'Validação de Documentos', badge: '28', badgeVariant: 'warning' },
    { id: 'anilhas', label: 'Gestão de Anilhas Oficiais', badge: 'Ativo', badgeVariant: 'gray' },
  ];

  const criadoresMock = [
    {
      id: 'SISPASS-BA-09124',
      criador: 'Roberto Fonseca de Oliveira',
      cpf: '342.891.005-22',
      categoria: 'Criador Amador de Passeriformes (CAP)',
      plantel: '14 aves registradas',
      municipio: 'Salvador/BA',
      situacao: 'Regular e Licenciado',
      statusColor: 'success',
      dataRecadastro: '12/05/2026',
    },
    {
      id: 'SISPASS-BA-08819',
      criador: 'Danilo Silva Santana',
      cpf: '551.209.418-90',
      categoria: 'Criador Amador de Passeriformes (CAP)',
      plantel: '08 aves registradas',
      municipio: 'Vitória da Conquista/BA',
      situacao: 'Pendente Declaração Anual',
      statusColor: 'warning',
      dataRecadastro: 'Atrasado',
    },
  ];

  return (
    <div className="space-y-6">
      <SeiaV2Breadcrumb
        items={[
          { label: 'Início', route: 'inicio' },
          { label: 'Biodiversidade & Fauna', route: 'sispass' },
          { label: 'SISPASS — Manejo de Fauna' },
        ]}
        onNavigate={onNavigate}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Sistema de Gestão de Passeriformes Silvestres (SISPASS)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cadastro oficial de criadores amadores, anilhamento, declarações anuais de reprodução e transferências.
          </p>
        </div>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-800">
        <FilamentTabs items={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              <th className="py-3 px-4">Registro SISPASS</th>
              <th className="py-3 px-4">Criador / CPF</th>
              <th className="py-3 px-4">Categoria</th>
              <th className="py-3 px-4">Plantel Registrado</th>
              <th className="py-3 px-4">Município</th>
              <th className="py-3 px-4">Situação</th>
              <th className="py-3 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {criadoresMock.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">{row.id}</td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{row.criador}</div>
                  <div className="text-[11px] font-mono text-slate-500">{row.cpf}</div>
                </td>
                <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{row.categoria}</td>
                <td className="py-3.5 px-4 font-mono text-slate-800 dark:text-slate-200">{row.plantel}</td>
                <td className="py-3.5 px-4 text-slate-600">{row.municipio}</td>
                <td className="py-3.5 px-4">
                  <Badge variant={row.statusColor as any} hasDot className="text-[10px]">
                    {row.situacao}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Button variant="ghost" size="xs" className="text-[#0F4C3A]">
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    <span>Plantel</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
