import React, { useState } from 'react';
import { SignableDocument, Signer, SimulatedUser } from '@/types/signature';
import { SIMULATED_USERS } from '@/data/signatureMock';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserPlus, AlertCircle } from 'lucide-react';
import { FilamentSelect } from '@/components/filament/Select';

interface AddSignerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: SignableDocument | null;
  onAddSigner: (documentId: string, newSigner: Omit<Signer, 'id'>) => void;
}

export const AddSignerModal: React.FC<AddSignerModalProps> = ({
  open,
  onOpenChange,
  document,
  onAddSigner,
}) => {
  const [selectedUserId, setSelectedUserId] = useState('carlos-analista');
  const [ordem, setOrdem] = useState<number>(2);

  if (!document) return null;

  const existingMatriculas = new Set(document.signatarios.map((s) => s.matricula));

  const availableUsers = SIMULATED_USERS.filter((u) => !existingMatriculas.has(u.matricula));

  const selectedUser = SIMULATED_USERS.find((u) => u.id === selectedUserId) || availableUsers[0];

  const handleAdd = () => {
    if (!selectedUser) return;

    const isTerceirizado = selectedUser.tipoVinculo === 'terceirizado' || selectedUser.papel === 'terceirizado';
    if (isTerceirizado) {
      alert('Colaboradores terceirizados não podem ser cadastrados como signatários oficiais (Regra MSG021).');
      return;
    }

    onAddSigner(document.id, {
      nome: selectedUser.nome,
      cargo: selectedUser.cargo,
      matricula: selectedUser.matricula,
      tipoVinculo: selectedUser.tipoVinculo,
      papel: selectedUser.papel,
      status: 'pendente',
      ordem: Number(ordem),
      ehSuplente: selectedUser.ehSuplente,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <DialogHeader className="bg-slate-50/90 dark:bg-slate-850 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0F4C3A]/10 text-[#0F4C3A] dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                Adicionar Signatário
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                Designação de servidor habilitado para assinar o documento
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4 text-xs">
          {availableUsers.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 text-slate-600 text-center">
              Todos os servidores demonstrativos já estão associados a este documento.
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Selecionar Servidor Habilitado *
                </label>
                <FilamentSelect
                  value={selectedUserId}
                  onChange={setSelectedUserId}
                  ariaLabel="Selecionar Servidor"
                  options={availableUsers.map((u) => ({
                    value: u.id,
                    label: `${u.nome} (${u.cargo})`,
                    description: `Matrícula: ${u.matricula} • ${u.tipoVinculo === 'terceirizado' ? 'Terceirizado (Bloqueado)' : 'Servidor Efetivo/Comissionado'}`,
                  }))}
                />
              </div>

              {selectedUser?.tipoVinculo === 'terceirizado' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[11px]">
                    Atenção (MSG021): Colaborador terceirizado não pode assinar documentos oficiais.
                  </span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Ordem na Assinatura Sequencial
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setOrdem(num)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        ordem === num
                          ? 'bg-[#0F4C3A] text-white border-[#0F4C3A]'
                          : 'bg-white dark:bg-slate-900 border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Ordem {num}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 pt-1">
                  * Na ordem sequencial, signatários de ordem superior só podem assinar após a conclusão dos precedentes.
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="bg-slate-50/90 dark:bg-slate-850 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-8"
          >
            Cancelar
          </Button>

          <Button
            size="sm"
            onClick={handleAdd}
            disabled={availableUsers.length === 0 || selectedUser?.tipoVinculo === 'terceirizado'}
            className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-8 font-semibold shadow-xs"
          >
            Adicionar à Lista
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
