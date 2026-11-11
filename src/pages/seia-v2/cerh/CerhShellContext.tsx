import { useState,useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription,DialogFooter } from '@/components/ui/dialog';
import { getSession,useCerhData,markNotificationRead } from './state';
import { useAdministration,sweepInstrumentExpiry,civilToday } from './administration';
import './cerh.css';
export function CerhShellContext() {
 useAdministration();const session=getSession(),data=useCerhData(),messages=(data.notifications||[]).filter(n=>n.recipient===session.name),[open,setOpen]=useState(false);
 const today=civilToday();useEffect(()=>{try{sweepInstrumentExpiry(today);}catch{/* Storage errors remain visible in the local context; access still evaluates civil validity. */}},[today]);
 return <><button onClick={()=>setOpen(true)} className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center relative" aria-label={'Notificações CERH ('+messages.filter(n=>!n.read).length+' não lidas)'}><Bell className="w-4 h-4"/>{messages.some(n=>!n.read)&&<span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"/>}</button><div className="flex items-center gap-2 pl-2 border-l border-white/20"><div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-xs font-bold">{session.name.slice(0,2).toUpperCase()}</div><span className="text-xs font-medium hidden md:inline text-white/90">{session.name}</span></div><Dialog open={open} onOpenChange={setOpen}><DialogContent className="cerh-dialog max-w-lg"><DialogHeader><DialogTitle>Notificações CERH</DialogTitle><DialogDescription>Comunicações locais para {session.name}.</DialogDescription></DialogHeader><div className="cerh-dialog-body">{!messages.length&&<p className="text-xs">Nenhuma notificação para este usuário.</p>}{[...messages].reverse().map(n=><div className="border-b py-3 text-xs space-y-2" key={n.id}><strong>{n.number} — Edição {n.decision.toLowerCase()}</strong><p>{n.reason}</p><time>{new Date(n.date).toLocaleString('pt-BR')}</time>{!n.read&&<Button size="sm" color="gray" onClick={()=>markNotificationRead(n.id,session)}>Marcar como lida</Button>}</div>)}</div><DialogFooter><Button size="sm" color="gray" onClick={()=>setOpen(false)}>Fechar</Button></DialogFooter></DialogContent></Dialog></>;
}
