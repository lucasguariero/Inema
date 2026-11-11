import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, FolderClosed, FolderOpen, FileText, LockKeyhole } from 'lucide-react';
import { InputWrapper } from './InputWrapper';
import { Search } from 'lucide-react';
import './documentExplorer.css';

export interface ProcessTreeNode { id: string; label: string; children?: ProcessTreeNode[]; restricted?: boolean }
export interface ProcessTreeProps { nodes: ProcessTreeNode[]; selectedId: string; onSelect: (id: string) => void; expandedIds: string[]; onExpandedChange: (ids: string[]) => void }
const fold = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
export function ProcessTree({ nodes, selectedId, onSelect, expandedIds, onExpandedChange }: ProcessTreeProps) {
  const [query, setQuery] = useState(''); const [focused, setFocused] = useState(''); const root = useRef<HTMLDivElement>(null);
  function filter(items: ProcessTreeNode[]): ProcessTreeNode[] {
    return items.flatMap(n => {
      if (!query.trim() || fold(n.label).includes(fold(query.trim()))) return [n];
      const children = n.children && filter(n.children); return children?.length ? [{ ...n, children }] : [];
    });
  }
  const filtered = filter(nodes), visible: { node: ProcessTreeNode; depth: number; parent?: string }[] = [];
  function flatten(items: ProcessTreeNode[], depth = 1, parent?: string) {
    items.forEach(node => { visible.push({ node, depth, parent }); if (node.children && (query.trim() || expandedIds.includes(node.id))) flatten(node.children, depth + 1, node.id); });
  }
  flatten(filtered);
  const currentFocus = visible.some(v => v.node.id === focused) ? focused : visible.some(v => v.node.id === selectedId) ? selectedId : visible[0]?.node.id;
  useEffect(() => { if (!focused) setFocused(selectedId); }, [focused, selectedId]);
  const focus = (id: string) => { setFocused(id); root.current?.querySelector<HTMLElement>(`[data-node-id="${CSS.escape(id)}"]`)?.focus(); };
  const toggle = (id: string) => onExpandedChange(expandedIds.includes(id) ? expandedIds.filter(v => v !== id) : [...expandedIds, id]);
  return <div className="fi-process-tree">
    <InputWrapper prefixIcon={Search}><input type="search" aria-label="Buscar na árvore" placeholder="Buscar processo ou documento..." value={query} onChange={e => setQuery(e.target.value)} /></InputWrapper>
    <div className="fi-tree-body" role="tree" aria-label="Processos e documentos" ref={root}>
      {visible.map(({ node, depth, parent }, index) => {
        const expanded = !!query.trim() || expandedIds.includes(node.id); const Folder = expanded ? FolderOpen : FolderClosed;
        return <div key={node.id} data-node-id={node.id} role="treeitem" aria-label={node.label} aria-level={depth} aria-selected={selectedId === node.id} aria-expanded={node.children ? expanded : undefined} tabIndex={currentFocus === node.id ? 0 : -1}
          style={{ '--tree-depth': depth } as React.CSSProperties} className="fi-tree-item" onFocus={() => setFocused(node.id)}
          onClick={() => { setFocused(node.id); onSelect(node.id); if (node.children) toggle(node.id); }}
          onKeyDown={e => {
            if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End', 'Enter', ' '].includes(e.key)) return;
            e.preventDefault();
            if (e.key === 'ArrowDown') focus(visible[Math.min(index + 1, visible.length - 1)].node.id);
            if (e.key === 'ArrowUp') focus(visible[Math.max(index - 1, 0)].node.id);
            if (e.key === 'Home') focus(visible[0].node.id);
            if (e.key === 'End') focus(visible[visible.length - 1].node.id);
            if (e.key === 'ArrowRight' && node.children) expanded ? focus(visible[index + 1]?.node.id || node.id) : toggle(node.id);
            if (e.key === 'ArrowLeft') { if (node.children && expanded && !query.trim()) toggle(node.id); else if (parent) focus(parent); }
            if (e.key === 'Enter' || e.key === ' ') { onSelect(node.id); if (node.children) toggle(node.id); }
          }}>
          {node.children ? <><ChevronRight className={expanded ? 'fi-tree-chevron is-open' : 'fi-tree-chevron'} /><Folder /></> : <><span className="fi-tree-spacer" />{node.restricted ? <LockKeyhole /> : <FileText />}</>}
          <span>{node.label}</span>
        </div>;
      })}
      {!visible.length && <div className="fi-document-empty" role="status">Nenhum documento encontrado. Altere ou limpe a busca.</div>}
    </div>
  </div>;
}
