import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/filament';
import { MENSAGENS, PARAMETROS } from '@/data/entradaUnicaUc';
import { destinoEntrada, eventoEntrada, validarOndeEntrada, validarTipoEntrada, verificarDataEntrada, type DestinoEntrada, type EntradaRecord, type EntradaProps } from '@/lib/entradaUnicaUc';
import { entradaPorId, gravarEntrada } from '@/lib/entradaUnicaUcStorage';
import { UNIDADES_CONSERVACAO_BAHIA, ATRATIVOS_MOCK } from '../AgendamentoVisitacaoPage';
import { EntradaAviso, EntradaResumo } from './EntradaUnicaPage';

export function EntradaDestino({route,onNavigate,children}:{route:DestinoEntrada;onNavigate:(route:string)=>void;children:(props:EntradaProps)=>React.ReactNode}) {
  const id=new URLSearchParams(location.search).get('triagem-id');
  const [record,setRecord]=useState<EntradaRecord>();
  const [error,setError]=useState('');
  useEffect(()=>{
    setRecord(undefined);setError('');if(!id)return;
    try {
      const r=entradaPorId(id);
      if(!r || r.status==='Cancelada' || !r.result || destinoEntrada(r)!==route || validarOndeEntrada(r,UNIDADES_CONSERVACAO_BAHIA,ATRATIVOS_MOCK) || validarTipoEntrada(r) || !verificarDataEntrada(r).valid || r.policy!==PARAMETROS.version || r.calendar!==PARAMETROS.calendarVersion)throw new Error('O contexto da triagem está ausente, inválido ou usa parâmetros antigos. Revise a triagem antes de continuar.');
      setRecord(r);
    }catch(e){setError(e instanceof Error?e.message:'Contexto indisponível.');}
  },[id,route]);
  // Confirma o recebimento depois de montar o formulário com os dados comuns.
  useEffect(()=>{
    if(!record || record.acceptedAt)return;
    try {setRecord(gravarEntrada(eventoEntrada({...record,status:'Formulário aberto',destination:route,acceptedAt:new Date().toISOString()},'Dados comuns recebidos no formulário de destino')));}catch(e){setError(e instanceof Error?e.message:'Não foi possível registrar o recebimento.');}
  },[record,route]);
  function back(){const url=new URL(location.href);url.searchParams.set('triagem-tela','resultado');history.replaceState({},'',url);onNavigate('uc-entrada-unica');}
  if(!id)return <>{children({})}</>;
  if(error)return <div className="entrada-unica"><EntradaAviso danger>{error}</EntradaAviso><Button onClick={back}>Voltar à triagem</Button></div>;
  if(!record)return <p role="status">Carregando contexto da triagem…</p>;
  return <><div className="entrada-unica eu-destino" data-entrada-recebida={record.id}><Button color="gray" outlined onClick={back}><ArrowLeft size={16}/>Voltar à triagem</Button><Section heading="Dados comuns da Entrada Única" description="Continuidade demonstrativa. Nenhum envio, protocolo ou ato oficial é realizado aqui.">{record.acceptedAt&&<div role="status" className="eu-aviso">{MENSAGENS.MSG015}</div>}<EntradaResumo record={record}/><p className="eu-muted">UC, local, requerente e data vieram da triagem. Para alterá-los, volte à Entrada Única. O prazo mínimo já foi verificado na triagem.</p></Section></div>{children({entrada:record})}</>;
}
