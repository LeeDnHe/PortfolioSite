import './style.css';
import { GAMES, type GameEntry } from './games.ts';

const FOLDER_SVG = `
<svg viewBox="0 0 64 52" class="folder-svg" aria-hidden="true">
  <path d="M4 48 V10 q0-4 4-4 h16 l6 6 h26 q4 0 4 4 v32 z" fill="#cf9327"/>
  <path d="M1 22 h62 l-6 24 q-1 4-5 4 H12 q-4 0-5-4 z" fill="#f2b94b"/>
</svg>`;

function renderIcons(): void {
  const grid = document.getElementById('icon-grid')!;
  grid.innerHTML = '';
  for (const game of GAMES) {
    const icon = document.createElement('button');
    icon.className = 'desktop-icon';
    icon.innerHTML = `${FOLDER_SVG}<span class="icon-label">${game.title}</span>`;
    icon.addEventListener('dblclick', () => openWindow(game));
    icon.addEventListener('click', () => icon.focus());
    icon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') openWindow(game);
    });
    grid.appendChild(icon);
  }
}

function openWindow(game: GameEntry): void {
  closeWindow();
  const win = document.createElement('div');
  win.className = 'explorer-window';
  win.id = 'game-window';

  const playable = game.playUrl.length > 0;
  const playBtn = playable
    ? `<a class="btn-play" href="${game.playUrl}">플레이</a>`
    : `<span class="btn-play disabled">개발 중</span>`;

  win.innerHTML = `
    <div class="win-titlebar">
      <span class="win-icon">${FOLDER_SVG}</span>
      <span class="win-title">${game.title}</span>
      <button class="win-close" aria-label="닫기">✕</button>
    </div>
    <div class="win-body">
      <h1>${game.title}</h1>
      <p class="tagline">${game.tagline} · ${game.year}</p>
      <p class="desc">${game.description}</p>
      <div class="win-actions">${playBtn}</div>
    </div>`;

  win.querySelector('.win-close')!.addEventListener('click', closeWindow);
  document.getElementById('desktop')!.appendChild(win);
}

function closeWindow(): void {
  document.getElementById('game-window')?.remove();
}

function startClock(): void {
  const el = document.getElementById('clock')!;
  const tick = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    el.textContent = `${hh}:${mm}`;
  };
  tick();
  setInterval(tick, 10_000);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeWindow();
});

renderIcons();
startClock();
