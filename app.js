const player = new Plyr('#player', { controls: ['play', 'progress', 'current-time', 'mute', 'volume'] });
let library = [];
let currentView = 'home'; 

async function init() {
    try {
        const res = await fetch('./playlist.json?t=' + new Date().getTime());
        library = await res.json();
        render('home');
    } catch (err) { console.error("Init Error:", err); }
}

function switchTab(view) {
    currentView = view;
    document.getElementById('search').value = ''; 
    render(view);
}

function render(view, query = '') {
    const container = document.getElementById('content');
    const cleanQuery = query.trim().toLowerCase();
    
    let filtered = library;

    /* AI GENERATED / BUG FIXED START */
    if (cleanQuery.startsWith('pub:') || cleanQuery.startsWith('art:') || cleanQuery.startsWith('tit:')) {
        if (cleanQuery.startsWith('pub:')) {
            const searchVal = cleanQuery.replace('pub:', '').trim();
            filtered = filtered.filter(m => m.artist.toLowerCase().includes(searchVal));
        } 
        else if (cleanQuery.startsWith('art:')) {
            const searchVal = cleanQuery.replace('art:', '').trim();
            filtered = filtered.filter(m => m.artist.toLowerCase().includes(searchVal));
        } 
        else if (cleanQuery.startsWith('tit:')) {
            const searchVal = cleanQuery.replace('tit:', '').trim();
            filtered = filtered.filter(m => m.title.toLowerCase().includes(searchVal));
        }
    } 
    else {
        filtered = (view === 'home') ? library : library.filter(m => m.type === view);
        
        if (cleanQuery !== '') {
            filtered = filtered.filter(m => 
                m.title.toLowerCase().includes(cleanQuery) || 
                m.artist.toLowerCase().includes(cleanQuery)
            );
        }
    }
    /* AI GENERATED / BUG FIXED END */
    
    if (filtered.length === 0) {
        container.innerHTML = `<div class="col-span-full text-zinc-500 text-sm text-center py-8">No results found.</div>`;
        return;
    }

    container.innerHTML = filtered.map(m => `
        <div class="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition-all cursor-pointer flex flex-col gap-2 h-48" 
             onclick="handlePlay('${m.url}', '${m.type}')">
            <div class="w-full h-24 bg-[#282828] rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                ${m.icon ? `<img src="${m.icon}" class="w-full h-full object-cover">` : `<span class="text-xs text-zinc-500">${m.type.toUpperCase()}</span>`}
            </div>
            <div class="truncate">
                <h3 class="font-semibold text-sm truncate">${m.title}</h3>
                <p class="text-xs text-zinc-400 truncate">${m.artist}</p>
            </div>
        </div>
    `).join('');
}

function handlePlay(url, type) {
    if (type === 'video') {
        window.location.href = window.location.origin + '/video/index.html?url=' + encodeURIComponent(url);
    } else {
        let mimeType = 'audio/mp3';
        if (url.endsWith('.wav')) mimeType = 'audio/wav';
        if (url.endsWith('.flac')) mimeType = 'audio/flac';
        if (url.endsWith('.ogg')) mimeType = 'audio/ogg';

        player.source = { type: 'audio', sources: [{ src: url, type: mimeType }] };
        player.play();
    }
}

document.getElementById('search').addEventListener('input', (e) => {
    render(currentView, e.target.value);
});

init();
