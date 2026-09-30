import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { DEPARTMENTS } from '@/data/initial-modules';
import { Participant } from '@/types/card-sorting';
import { Layers, ArrowRight, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

interface IdentificationFormProps {
  onStart: (participant: Participant) => void;
}

export const IdentificationForm: React.FC<IdentificationFormProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe seu nome completo.');
      return;
    }
    if (!department) {
      setError('Por favor, selecione seu cargo ou departamento.');
      return;
    }

    setError('');
    onStart({
      name: name.trim(),
      department,
      startedAt: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      {/* Header Institucional com Identidade INEMA */}
      <div className="w-full max-w-lg mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#0F4C3A] text-xs font-semibold uppercase tracking-wider mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Arquitetura de Informação • Novo INEMA</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Dinâmica de Card Sorting Digital
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
          Sua perspectiva é essencial para organizarmos os módulos e fluxos do novo sistema ambiental do Estado da Bahia.
        </p>
      </div>

      <Card className="w-full max-w-lg shadow-sm border-slate-200 bg-white">
        <form onSubmit={handleSubmit}>
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#0F4C3A]" />
              Identificação do Participante
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Preencha suas informações para iniciarmos a dinâmica de organização dos menus do sistema.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-5">
            {error && (
              <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-semibold text-slate-700">
                Seu Nome Completo *
              </label>
              <Input
                id="name"
                placeholder="Ex: Maria Clara Santos"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="department" className="text-xs font-semibold text-slate-700">
                Diretoria / Coordenação / Departamento *
              </label>
              <Select
                id="department"
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  if (error) setError('');
                }}
              >
                <option value="">Selecione sua diretoria ou área...</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Caixa de Instruções Rápidas */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 mt-2">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#0F4C3A]" />
                Como funciona a dinâmica:
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed">
                <li>Você verá os <strong>20 cartões</strong> representando os módulos reais mapeados para a nova plataforma SEIA.</li>
                <li>Crie os <strong>Grupos / Menus</strong> com os nomes que fizerem mais sentido para o seu dia a dia e fluxo de trabalho.</li>
                <li>Arraste e solte os cartões dentro dos grupos que você criou.</li>
                <li>Finalize clicando em <strong>Salvar Estrutura</strong> para registrar sua proposta.</li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="border-t border-slate-100 pt-4 flex justify-end">
            <Button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0F4C3A] hover:bg-[#0b382b] text-white cursor-pointer"
            >
              <span>Iniciar Card Sorting</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-8 flex items-center gap-2 text-[11px] text-slate-400 font-sans">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Pesquisa de Arquitetura de Informação • INEMA</span>
      </div>
    </div>
  );
};
