import React from 'react';
import './coticRefinement.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export function CoticDrawer({ open, onClose, title, children, footer, restoreFocus = false }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode; restoreFocus?: boolean;
}) {
  const opener = React.useRef<HTMLElement | null>(null);
  return <Dialog open={open} onOpenChange={value => { if (!value) onClose(); }}>
    <DialogContent className="cotic-drawer left-auto right-0 top-0 translate-x-0 translate-y-0 w-full max-w-none md:w-1/2 md:max-w-2xl h-dvh max-h-dvh rounded-none flex flex-col gap-0 p-0"
      onOpenAutoFocus={() => { if (restoreFocus) opener.current = document.activeElement as HTMLElement; }}
      onCloseAutoFocus={e => { if (restoreFocus && opener.current?.isConnected) { e.preventDefault(); opener.current.focus(); } }}
      onInteractOutside={e => e.preventDefault()}>
      <DialogHeader className="p-5 border-b border-slate-200 dark:border-slate-800 shrink-0 pr-12">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>Protótipo demonstrativo — sem envio ou validação institucional.</DialogDescription>
      </DialogHeader>
      <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4 text-sm">{children}</div>
      {footer && <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-end gap-2 shrink-0">{footer}</div>}
    </DialogContent>
  </Dialog>;
}
