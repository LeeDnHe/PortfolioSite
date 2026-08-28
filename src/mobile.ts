import { GAMES, type GameEntry } from './games.ts';
import { PROFILE, README_TEXT } from './profile.ts';
import { buildGameBody, wireGameTabs } from './game-body.ts';
import { startMinigame } from './minigames.ts';
import { TX, createLangSwitcher } from './i18n.ts';
import { showUpdateToast, updatesBodyHtml } from './updates.ts';
import notepadIcon from './notepad-icon.svg';

/* ================= 폰 셸 ================= */

const SIGNAL_SVG = `
  <svg viewBox="0 0 18 12" aria-hidden="true">
    <rect x="0"  y="8" width="3" height="4"  rx="1"/>
    <rect x="5"  y="5" width="3" height="7"  rx="1"/>
    <rect x="10" y="2" width="3" height="10" rx="1"/>
    <rect x="15" y="0" width="3" height="12" rx="1"/>
  </svg>`;
const WIFI_SVG = `
  <svg viewBox="0 0 16 12" aria-hidden="true">
    <path d="M8 10.6 5.8 8.2a3.3 3.3 0 0 1 4.4 0Z"/>
    <path d="M4.2 6.4a5.7 5.7 0 0 1 7.6 0l-1.5 1.6a3.5 3.5 0 0 0-4.6 0Z" opacity=".85"/>
    <path d="M1.2 3.2a10 10 0 0 1 13.6 0l-1.5 1.6a7.8 7.8 0 0 0-10.6 0Z" opacity=".65"/>
  </svg>`;
const BATTERY_SVG = `
  <svg viewBox="0 0 25 12" aria-hidden="true">
    <rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="currentColor" opacity=".5"/>
    <rect x="2" y="2" width="15" height="8" rx="1.6"/>
    <path d="M23 4v4a2.2 2.2 0 0 0 0-4Z" opacity=".5"/>
  </svg>`;
const GITHUB_SVG = `
  <svg viewBox="0 0 16 16" aria-hidden="true" fill="#ffffff">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
      0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01
      1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
      0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 4 0c1.53-1.04
      2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54
      1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/>
  </svg>`;
const MAIL_SVG = `
  <svg viewBox="0 0 20 16" aria-hidden="true" fill="none" stroke="#ffffff" stroke-width="1.6">
    <rect x="1" y="1.5" width="18" height="13" rx="2.5"/>
    <path d="m2 3.5 8 6 8-6"/>
  </svg>`;

const root = document.getElementById('desktop')!;
root.innerHTML = `
  <div class="m-statusbar">
    <span id="m-status-clock"></span>
    <div class="m-status-icons"><span id="m-lang-slot"></span>${SIGNAL_SVG}${WIFI_SVG}${BATTERY_SVG}</div>
  </div>
  <div class="m-home">
    <div class="m-widget">
      <div class="m-widget-time" id="m-widget-time"></div>
      <div class="m-widget-date" id="m-widget-date"></div>
    </div>
    <div class="m-grid" id="m-grid"></div>
  </div>
  <div class="m-dock" id="m-dock"></div>
  <div id="m-apps"></div>
  <button class="m-home-indicator" id="m-home-indicator" aria-label="${TX.mHome}"></button>`;

// 상태바 오른쪽 — 신호·와이파이 아이콘 옆의 언어 표시기
document.getElementById('m-lang-slot')!.replaceWith(createLangSwitcher());

/* ================= 앱 페이지 (전체화면) ================= */

const appsEl = document.getElementById('m-apps')!;
const openPages: HTMLElement[] = [];

function openAppPage(opts: { id: string; title: string; bodyHtml: string; onCreate?: (page: HTMLElement) => void }): void {
  let page = appsEl.querySelector<HTMLElement>(`[data-app="${opts.id}"]`);
  if (!page) {
    page = document.createElement('div');
    page.className = 'm-app';
    page.dataset.app = opts.id;
    page.innerHTML = `
      <header class="m-app-header">
        <span class="m-app-title">${opts.title}</span>
        <button class="m-close" aria-label="${TX.close}">✕</button>
      </header>
      <div class="m-app-body">${opts.bodyHtml}</div>`;
    appsEl.appendChild(page);
    page.querySelector('.m-close')!.addEventListener('click', () => closeAppPage(page!));
    attachEdgeSwipeBack(page);
    opts.onCreate?.(page);
  }
  if (openPages.includes(page)) return;
  openPages.push(page);
  document.body.classList.add('m-app-open');
  // 강제 리플로우로 닫힌 위치(translateY(100%))를 먼저 확정해야 슬라이드업 트랜지션이 걸린다
  void page.offsetHeight;
  page.classList.add('open');
}

function closeAppPage(page: HTMLElement): void {
  const idx = openPages.indexOf(page);
  if (idx >= 0) openPages.splice(idx, 1);
  if (openPages.length === 0) document.body.classList.remove('m-app-open');
  page.style.transform = '';
  page.classList.remove('open');
  // 게임 앱을 닫는 것이 미니게임의 시작/초기화 스위치 (데스크톱과 동일한 규칙)
  const appId = page.dataset.app;
  if (appId?.startsWith('game-')) startMinigame(appId.slice('game-'.length));
}

function goHome(): void {
  [...openPages].forEach(closeAppPage);
}

/** iOS식 왼쪽 가장자리 스와이프로 뒤로가기 */
function attachEdgeSwipeBack(page: HTMLElement): void {
  let startX = 0;
  let tracking = false;
  page.addEventListener(
    'touchstart',
    (e) => {
      const t = e.touches[0];
      if (t.clientX > 32) return;
      tracking = true;
      startX = t.clientX;
      page.style.transition = 'none';
    },
    { passive: true },
  );
  page.addEventListener(
    'touchmove',
    (e) => {
      if (!tracking) return;
      const dx = Math.max(0, e.touches[0].clientX - startX);
      page.style.transform = `translateX(${dx}px)`;
    },
    { passive: true },
  );
  page.addEventListener('touchend', (e) => {
    if (!tracking) return;
    tracking = false;
    const dx = e.changedTouches[0].clientX - startX;
    page.style.transition = '';
    if (dx > 80) closeAppPage(page);
    else page.style.transform = '';
  });
}

/* ================= 앱 정의 ================= */

function openGameApp(game: GameEntry): void {
  openAppPage({
    id: `game-${game.id}`,
    title: game.title,
    bodyHtml: buildGameBody(game),
    onCreate: wireGameTabs,
  });
}

function openReadmeApp(): void {
  openAppPage({
    id: 'readme',
    title: 'README.txt',
    bodyHtml: `<pre class="notepad-body">${README_TEXT}</pre>`,
  });
}

/** 업데이트 소식 페이지 — 알림을 눌렀을 때 열린다 */
function openUpdatesApp(newIds: string[] = []): void {
  openAppPage({
    id: 'updates',
    title: TX.updTitle,
    bodyHtml: updatesBodyHtml(newIds),
  });
}

interface MobileApp {
  id: string;
  label: string;
  tileHtml: string;
  open: () => void;
}

// README는 하단 독에 있으므로 홈 그리드에는 게임만 둔다
const GRID_APPS: MobileApp[] = GAMES.map((g) => ({
  id: g.id,
  label: g.title,
  tileHtml: `<span class="m-tile"><img src="${g.icon}" alt=""></span>`,
  open: () => openGameApp(g),
}));

const DOCK_APPS: MobileApp[] = [
  {
    id: 'dock-readme',
    label: TX.mAbout,
    tileHtml: `<span class="m-tile"><img src="${notepadIcon}" alt=""></span>`,
    open: openReadmeApp,
  },
  {
    id: 'github',
    label: 'GitHub',
    tileHtml: `<span class="m-tile m-tile-github">${GITHUB_SVG}</span>`,
    open: () => window.open(PROFILE.github, '_blank', 'noreferrer'),
  },
  {
    id: 'mail',
    label: TX.mMail,
    tileHtml: `<span class="m-tile m-tile-mail">${MAIL_SVG}</span>`,
    open: () => {
      location.href = `mailto:${PROFILE.email}`;
    },
  },
];

function renderApps(container: HTMLElement, apps: MobileApp[], withLabel: boolean): void {
  apps.forEach((app) => {
    const btn = document.createElement('button');
    btn.className = 'm-app-btn';
    btn.dataset.id = app.id;
    btn.innerHTML = app.tileHtml + (withLabel ? `<span class="m-app-label">${app.label}</span>` : '');
    btn.addEventListener('click', app.open);
    container.appendChild(btn);
  });
}

renderApps(document.getElementById('m-grid')!, GRID_APPS, true);
renderApps(document.getElementById('m-dock')!, DOCK_APPS, false);

/* ================= 홈 인디케이터 · 시계 ================= */

const indicator = document.getElementById('m-home-indicator')!;
indicator.addEventListener('click', goHome);
// 위로 스와이프해도 홈으로
indicator.addEventListener(
  'touchstart',
  (e) => {
    const startY = e.touches[0].clientY;
    const onEnd = (ev: TouchEvent) => {
      indicator.removeEventListener('touchend', onEnd);
      if (startY - ev.changedTouches[0].clientY > 24) goHome();
    };
    indicator.addEventListener('touchend', onEnd);
  },
  { passive: true },
);

function startClock(): void {
  const statusClock = document.getElementById('m-status-clock')!;
  const widgetTime = document.getElementById('m-widget-time')!;
  const widgetDate = document.getElementById('m-widget-date')!;
  const tick = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    statusClock.textContent = `${hh}:${mm}`;
    widgetTime.textContent = `${hh}:${mm}`;
    widgetDate.textContent = TX.mDate(now);
  };
  tick();
  setInterval(tick, 10_000);
}

startClock();

// 홈 화면이 다 그려진 뒤, 아직 못 본 소식이 있으면 상태바 아래로 알림이 내려온다
showUpdateToast({ onDetails: openUpdatesApp });
