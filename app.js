const player = new Plyr('#player', { controls: ['play', 'progress', 'current-time', 'mute', 'volume'] });
let library = [];

async function init() {
    try {
        const res = await fetch('./playlist.json?t=' + new Date().getTime());
        library = await res.json();
        render('home');
    } catch (err) { console.error("Init Error:", err); }
}

function render(view, query = '') {
    const container = document.getElementById('content');
    let filtered = (view === 'home') ? library : library.filter(m => m.type === view);
    
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
        player.source = { type: 'audio', sources: [{ src: url, type: 'audio/mp3' }] };
        player.play();
    }
}

document.getElementById('search').addEventListener('input', (e) => render('home', e.target.value));
init();