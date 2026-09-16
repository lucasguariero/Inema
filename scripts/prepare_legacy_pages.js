const fs = require('fs');
const path = require('path');

// Load Central Navigation Config (Single Source of Truth)
const navConfig = require('../src/data/navigationConfig.json');

// Generate Unified Legacy Navigation HTML from navigationConfig
function generateLegacyNavHtml(config, activeId = 'relatorios') {
  let html = `<nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">\n`;

  // 1. Links Raiz (Topo)
  for (const item of config.topDirectItems) {
    const isExternal = item.href.startsWith('http');
    html += `                <!-- ${item.label} -->\n`;
    html += `                <a href="${item.href}" id="${item.htmlId || item.id}" data-testid="${item.htmlId || item.id}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-medium transition-colors duration-150">\n`;
    html += `                    <span class="material-symbols-outlined text-xl text-slate-500">${item.materialIcon || 'arrow_forward'}</span>\n`;
    html += `                    <span class="text-sm font-medium">${item.label}</span>\n`;
    html += `                </a>\n`;
  }

  // 2. Módulos e Itens Oficiais
  for (const group of config.menuGroups) {
    if (group.isDirectItem) {
      const isActive = group.id === activeId || group.route === activeId;
      html += `\n                <!-- ${group.label} -->\n`;
      html += `                <div class="pt-1">\n`;
      html += `                    <a href="${group.href}" id="${group.htmlId || group.id}" data-testid="nav-${group.label}" class="flex items-center justify-between px-3 py-2.5 rounded-lg ${isActive ? 'text-[#0F4C3A] bg-[#E2ECE9] font-bold border border-[#CBDED8]/70 shadow-2xs' : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-medium'} transition-colors duration-150">\n`;
      html += `                        <div class="flex items-center gap-3">\n`;
      html += `                            <span class="material-symbols-outlined text-xl ${isActive ? 'text-[#0F4C3A]' : 'text-slate-500'}">${group.materialIcon || 'circle'}</span>\n`;
      html += `                            <span class="text-sm ${isActive ? 'font-bold' : 'font-medium'}">${group.label}</span>\n`;
      html += `                        </div>\n`;
      if (group.badge) {
        html += `                        <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold ${isActive ? 'bg-[#0F4C3A] text-white' : 'bg-slate-100 text-slate-600'}">${group.badge}</span>\n`;
      }
      html += `                    </a>\n`;
      html += `                </div>\n`;
      continue;
    }

    const isOpen = !!group.defaultOpen;
    const isFiscalizacao = group.id === 'fiscalizacao';
    const subId = group.htmlId || `sub_${group.id}`;
    const iconId = `icon_${group.id}`;

    html += `\n                <!-- Módulo: ${group.label} -->\n`;
    html += `                <div class="pt-1">\n`;
    html += `                    <button id="btn-${group.id}" data-testid="nav-${group.label}" onclick="toggleSubmenu('${subId}', '${iconId}')" class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-semibold transition-colors duration-150 cursor-pointer">\n`;
    html += `                        <div class="flex items-center gap-3 min-w-0">\n`;
    html += `                            <span class="material-symbols-outlined text-xl text-slate-500">${group.materialIcon || 'folder'}</span>\n`;
    html += `                            <span class="text-sm font-semibold truncate">${group.label}</span>\n`;
    html += `                        </div>\n`;
    html += `                        <span id="${iconId}" class="material-symbols-outlined text-lg text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}">expand_more</span>\n`;
    html += `                    </button>\n`;
    html += `                    <div id="${subId}" class="${isOpen ? '' : 'hidden '}mt-1 border-l-2 border-slate-200 ml-4 pl-3 space-y-${isFiscalizacao ? '3' : '1'}">\n`;

    // Items
    let currentSubgroup = null;
    let subgroupOpen = false;

    for (const sub of group.items) {
      if (sub.subgroup && sub.subgroup !== currentSubgroup) {
        if (subgroupOpen) {
          html += `                            </div>\n                        </div>\n`;
        }
        currentSubgroup = sub.subgroup;
        subgroupOpen = true;
        html += `                        <!-- Subgrupo: ${currentSubgroup} -->\n`;
        html += `                        <div>\n`;
        html += `                            <div class="text-slate-400 font-semibold text-[10px] tracking-wider uppercase px-2 py-1 select-none pointer-events-none">\n`;
        html += `                                ${currentSubgroup}\n`;
        html += `                            </div>\n`;
        html += `                            <div class="space-y-1 mt-1">\n`;
      }

      const isSubExternal = sub.href && sub.href.startsWith('http');
      const isSubActive = sub.id === activeId || sub.route === activeId;
      const indentClass = isFiscalizacao ? '' : '';

      html += `                        <a href="${sub.href || '#'}" id="${sub.htmlId || sub.id}" data-testid="${sub.htmlId || sub.id}" ${isSubExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} class="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs md:text-sm transition-colors duration-150 ${isSubActive ? 'bg-[#E2ECE9] text-[#0F4C3A] font-bold' : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-medium'}">\n`;
      html += `                            <span class="truncate">${sub.label}</span>\n`;
      if (sub.badge) {
        const badgeIdAttr = sub.id === 'fisc-painel-interno-difis' ? ' id="sidebarBadgeEmergencias"' : '';
        html += `                            <span class="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full"${badgeIdAttr}>${sub.badge}</span>\n`;
      }
      html += `                        </a>\n`;
    }

    if (subgroupOpen) {
      html += `                            </div>\n                        </div>\n`;
    }

    html += `                    </div>\n`;
    html += `                </div>\n`;
  }

  html += `            </nav>`;
  return html;
}

// 1. Update src/relatorios.html with synced nav
let relatoriosSrc = fs.readFileSync('src/relatorios.html', 'utf8');
const generatedNav = generateLegacyNavHtml(navConfig, 'relatorios');

// Replace nav inside sidebar
relatoriosSrc = relatoriosSrc.replace(/<nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">[\s\S]*?<\/nav>/i, generatedNav);

// Ensure assistente button has id and data-testid, and eliminate yellow icon
relatoriosSrc = relatoriosSrc.replace(/<button onclick="alert\('Assistente IA INEMA/g, `<button id="btn-assistente-inema" data-testid="btn-assistente-inema" onclick="alert('Assistente IA INEMA`);
relatoriosSrc = relatoriosSrc.replace(/text-amber-300/g, 'text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]');

// Also ensure toggleSubmenu handles generic submenus if not present
if (!relatoriosSrc.includes('function toggleSubmenu')) {
  const toggleScript = `
    function toggleSubmenu(menuId, iconId) {
        const menu = document.getElementById(menuId);
        const icon = document.getElementById(iconId);
        if (menu) {
            menu.classList.toggle('hidden');
            if (icon) icon.classList.toggle('rotate-180');
        }
    }
  `;
  relatoriosSrc = relatoriosSrc.replace('</head>', `<script>${toggleScript}</script>\n</head>`);
}

fs.writeFileSync('src/relatorios.html', relatoriosSrc, 'utf8');
console.log('src/relatorios.html updated with synchronized navigation.');

// 2. Copy src/css to public/css and public/src/css
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync('src/css')) {
  copyDir('src/css', 'public/css');
  copyDir('src/css', 'public/src/css');
  console.log('CSS copied to public/css and public/src/css');
}

// 3. Copy all src/*.html to public/src/ and public/
const srcFiles = fs.readdirSync('src');
for (const file of srcFiles) {
  if (file.endsWith('.html')) {
    const destDir = 'public/src';
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(path.join('src', file), path.join(destDir, file));
    // Also copy to public/ root for direct access
    fs.copyFileSync(path.join('src', file), path.join('public', file));
  }
}
console.log('HTML files copied to public/src/ and public/');

// 4. Prepare public/relatorios-antigo.html (pure legacy without banner)
let relatoriosHtml = fs.readFileSync('src/relatorios.html', 'utf8');

// Adjust relative asset paths if needed
relatoriosHtml = relatoriosHtml.replaceAll('href="css/design-system.css"', 'href="/css/design-system.css"');
relatoriosHtml = relatoriosHtml.replaceAll('src="logo.svg"', 'src="/logo.svg"');

fs.writeFileSync('public/relatorios-antigo.html', relatoriosHtml, 'utf8');
console.log('public/relatorios-antigo.html created successfully (clean synced legacy).');
