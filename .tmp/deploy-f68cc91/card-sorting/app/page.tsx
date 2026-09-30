'use client';

import React, { useState, useEffect } from 'react';
import { IdentificationForm } from '@/components/IdentificationForm';
import { CardSortingBoard } from '@/components/CardSortingBoard';
import { Participant } from '@/types/card-sorting';

export default function Home() {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('inema_card_sorting_current_participant');
      if (stored) {
        setParticipant(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Erro ao ler participante do localStorage:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleStart = (newParticipant: Participant) => {
    setParticipant(newParticipant);
    try {
      localStorage.setItem('inema_card_sorting_current_participant', JSON.stringify(newParticipant));
    } catch (e) {
      console.warn('Erro ao salvar participante:', e);
    }
  };

  const handleReset = () => {
    setParticipant(null);
    try {
      localStorage.removeItem('inema_card_sorting_current_participant');
    } catch (e) {
      console.warn('Erro ao remover participante:', e);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <div className="w-2 h-2 rounded-full bg-[#0F4C3A] animate-ping" />
          <span>Carregando Card Sorting INEMA...</span>
        </div>
      </div>
    );
  }

  if (!participant) {
    return <IdentificationForm onStart={handleStart} />;
  }

  return (
    <CardSortingBoard
      participant={participant}
      onResetParticipant={handleReset}
    />
  );
}
