const fs = require('fs');
const path = require('path');

const manifest = JSON.parse(fs.readFileSync('public/galeria-manifest.json', 'utf8'));

const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Galeria de Telas & Protótipos — INEMA GLA</title>
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                        mono: ['"JetBrains Mono"', 'monospace']
                    },
                    colors: {
                        brand: {
                            blue: '#0c4353',
                            green: '#0F4C3A',
                            accent: '#78C043'
                        }
                    }
                }
            }
        }
    </script>
    <style>
        .lightbox-img {
            max-height: 88vh;
            max-width: 92vw;
            object-fit: contain;
        }
    </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen font-sans antialiased selection:bg-emerald-500 selection:text-white">

    <!-- Topo / Header Fixo -->
    <header class="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0c4353] to-[#0F4C3A] flex items-center justify-center p-2 border border-emerald-500/30 shadow-inner">
                    <img src="/logo.svg" alt="INEMA" class="w-full h-full object-contain filter brightness-200" />
                </div>
                <div>
                    <div class="flex items-center gap-2">
                        <h1 class="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                            INEMA <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold uppercase tracking-wider">GLA HML</span>
                        </h1>
                    </div>
                    <p class="text-xs text-slate-400">Galeria Visual de Telas, Módulos e Responsividade Mobile</p>
                </div>
            </div>

            <!-- Resumo e Ações Globais -->
            <div class="flex items-center gap-3 flex-wrap">
                <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 font-mono">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <strong class="text-white">${manifest.length} Telas Capturadas</strong>
                </div>
                <a href="https://inema-six.vercel.app/" target="_blank" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.02] cursor-pointer">
                    <span>Abrir Sistema Live</span>
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
            </div>
        </div>

        <!-- Barra de Filtros / Navegação Rápida -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 pb-3 pt-1 border-t border-slate-800/60 flex items-center justify-between gap-4 overflow-x-auto">
            <div class="flex items-center gap-1.5 text-xs">
                <button onclick="setFilter('all')" id="tab-all" class="filter-tab px-3 py-1.5 rounded-lg font-medium transition-all bg-emerald-500 text-white font-semibold shadow-xs">
                    Todas as Telas (${manifest.length})
                </button>
                <button onclick="setFilter('dashboard')" id="tab-dashboard" class="filter-tab px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                    Dashboard & 3 Temas (6)
                </button>
                <button onclick="setFilter('fiscalizacao-interna')" id="tab-fiscalizacao-interna" class="filter-tab px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                    Fiscalização Interna (6)
                </button>
                <button onclick="setFilter('fiscalizacao-cidadao')" id="tab-fiscalizacao-cidadao" class="filter-tab px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                    Fiscalização Cidadão (6)
                </button>
                <button onclick="setFilter('mobile')" id="tab-mobile" class="filter-tab px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                    Mobile iPhone 13 (12)
                </button>
            </div>

            <!-- Busca Rápida -->
            <div class="relative w-48 sm:w-64 shrink-0">
                <input type="text" id="searchInput" oninput="handleSearch()" placeholder="Filtrar por nome..." class="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-all font-mono">
            </div>
        </div>
    </header>

    <!-- Conteúdo Principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <!-- Grid de Prints -->
        <div id="galleryGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${manifest.map((item, idx) => `
            <div class="gallery-card group bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-2xl hover:shadow-black/60 transition-all duration-300 flex flex-col"
                 data-category="${item.category}"
                 data-title="${item.title.toLowerCase()}"
                 data-dark="${item.isDark}"
                 data-index="${idx}">
                
                <!-- Imagem do Print com Overlay Hover -->
                <div class="relative aspect-video sm:aspect-16/10 bg-slate-900 overflow-hidden cursor-pointer border-b border-slate-800/60" onclick="openLightbox(${idx})">
                    <img src="/galeria-prints/${item.fileName}"
                         alt="${item.title}"
                         loading="lazy"
                         class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out" />
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity"></div>
                    
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/40 backdrop-blur-2xs">
                        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-600/90 text-white text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                            Expandir em Alta Definição
                        </span>
                    </div>

                    <!-- Badges no topo da imagem -->
                    <div class="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                        <span class="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${item.device.includes('Mobile') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'}">
                            ${item.device.includes('Mobile') ? '📱 iPhone 13' : '🖥️ Desktop'}
                        </span>
                        <span class="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${item.isDark ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-700/60 text-slate-300 border border-slate-600'}">
                            ${item.isDark ? '🌙 Dark' : '☀️ Light'}
                        </span>
                    </div>
                </div>

                <!-- Informações e Ações -->
                <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                    <div>
                        <h2 class="text-sm sm:text-base font-bold text-white tracking-tight leading-snug group-hover:text-emerald-400 transition-colors">
                            ${item.title}
                        </h2>
                        <p class="text-xs text-slate-400 mt-1 font-mono">
                            ${item.fileName}
                        </p>
                    </div>

                    <div class="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60 mt-auto">
                        <button onclick="openLightbox(${idx})" class="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-medium transition-colors cursor-pointer">
                            <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            <span>Ver Print</span>
                        </button>
                        <a href="${item.liveUrl}" target="_blank" class="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                            <span>Testar no Sistema</span>
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </a>
                    </div>
                </div>
            </div>
            `).join('')}
        </div>
    </main>

    <!-- Modal Lightbox Fullscreen -->
    <div id="lightbox" class="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md hidden flex flex-col items-center justify-center p-4 select-none">
        <div class="absolute top-4 right-4 flex items-center gap-3">
            <a id="lightboxLiveBtn" href="#" target="_blank" class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg inline-flex items-center gap-1.5">
                <span>Abrir Rota Live</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
            <button onclick="closeLightbox()" class="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        <!-- Botões de Navegação -->
        <button onclick="prevImage()" class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-all cursor-pointer">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <button onclick="nextImage()" class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-all cursor-pointer">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>

        <!-- Imagem e Legenda -->
        <div class="flex flex-col items-center max-w-full">
            <img id="lightboxImg" src="" alt="" class="lightbox-img rounded-xl shadow-2xl border border-slate-800" />
            <div class="mt-4 text-center">
                <h3 id="lightboxTitle" class="text-base sm:text-lg font-bold text-white"></h3>
                <p id="lightboxInfo" class="text-xs text-slate-400 font-mono mt-1"></p>
            </div>
        </div>
    </div>

    <script>
        const items = ${JSON.stringify(manifest)};
        let currentIndex = 0;

        function setFilter(cat) {
            document.querySelectorAll('.filter-tab').forEach(t => {
                t.classList.remove('bg-emerald-500', 'text-white', 'font-semibold', 'shadow-xs');
                t.classList.add('text-slate-400');
            });
            const activeTab = document.getElementById('tab-' + cat);
            if (activeTab) {
                activeTab.classList.remove('text-slate-400');
                activeTab.classList.add('bg-emerald-500', 'text-white', 'font-semibold', 'shadow-xs');
            }

            const cards = document.querySelectorAll('.gallery-card');
            cards.forEach(card => {
                if (cat === 'all' || card.dataset.category === cat) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        function handleSearch() {
            const query = document.getElementById('searchInput').value.toLowerCase().trim();
            const cards = document.querySelectorAll('.gallery-card');
            cards.forEach(card => {
                const title = card.dataset.title || '';
                if (query === '' || title.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        function openLightbox(idx) {
            currentIndex = idx;
            const item = items[idx];
            document.getElementById('lightboxImg').src = '/galeria-prints/' + item.fileName;
            document.getElementById('lightboxTitle').textContent = item.title;
            document.getElementById('lightboxInfo').textContent = item.device + ' • ' + (item.isDark ? 'Dark Mode' : 'Light Mode') + ' • ' + item.fileName;
            document.getElementById('lightboxLiveBtn').href = item.liveUrl;
            document.getElementById('lightbox').classList.remove('hidden');
        }

        function closeLightbox() {
            document.getElementById('lightbox').classList.add('hidden');
        }

        function nextImage() {
            currentIndex = (currentIndex + 1) % items.length;
            openLightbox(currentIndex);
        }

        function prevImage() {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            openLightbox(currentIndex);
        }

        document.addEventListener('keydown', (e) => {
            if (document.getElementById('lightbox').classList.contains('hidden')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        });
    </script>
</body>
</html>
`;

fs.writeFileSync('public/galeria.html', htmlContent, 'utf8');
console.log('public/galeria.html gerada com sucesso com todos os ' + manifest.length + ' prints!');
