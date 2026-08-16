import { GAMES, type GameEntry } from './games.ts';
import { PROFILE, README_TEXT } from './profile.ts';
import { buildGameBody, wireGameTabs } from './game-body.ts';
import { startMinigame, stopMinigame } from './minigames.ts';
import { EDGE_PAD, iconCell, taskbarH } from './layout.ts';
import { TX, createLangSwitcher } from './i18n.ts';
import notepadIcon from './notepad-icon.svg';
import trashIcon from './trash-icon.svg';

const desktopEl = document.getElementById('desktop')!;
const gridEl = document.getElementById('icon-grid')!;

/** 터치로 조작 중인지 — 터치는 한 번 탭, 마우스는 더블클릭으로 연다 */
function isTouchPointer(e: PointerEvent): boolean {
  return e.pointerType !== 'mouse';
}

/** 이미 놓인 포인터를 잡으려 하면 예외가 나므로 실패해도 드래그는 계속되게 한다 */
function capturePointer(el: HTMLElement, pointerId: number): void {
  try {
    el.setPointerCapture(pointerId);
  } catch {
    /* 캡처 없이도 문서 밖으로 나가지만 않으면 동작한다 */
  }
}

/* ================= 창 관리 ================= */

interface ManagedWindow {
  id: string;
  el: HTMLElement;
  taskBtn: HTMLButtonElement;
  minimized: boolean;
}

const windows = new Map<string, ManagedWindow>();
let zTop = 100;
let cascade = 0;

function topWindow(): ManagedWindow | null {
  let top: ManagedWindow | null = null;
  for (const w of windows.values()) {
    if (w.minimized) continue;
    if (!top || Number(w.el.style.zIndex) > Number(top.el.style.zIndex)) top = w;
  }
  return top;
}

function updateTaskButtons(): void {
  const top = topWindow();
  for (const w of windows.values()) {
    w.taskBtn.classList.toggle('active', w === top);
  }
}

function focusWindow(w: ManagedWindow): void {
  w.el.style.zIndex = String(++zTop);
  updateTaskButtons();
}

function minimizeWindow(w: ManagedWindow): void {
  w.minimized = true;
  w.el.style.display = 'none';
  updateTaskButtons();
}

function restoreWindow(w: ManagedWindow): void {
  w.minimized = false;
  w.el.style.display = '';
  focusWindow(w);
}

function closeWindow(w: ManagedWindow): void {
  w.el.remove();
  w.taskBtn.remove();
  windows.delete(w.id);
  updateTaskButtons();
  // 게임 속성 창 닫기 = 그 게임 미니게임의 시작/초기화 스위치
  if (w.id.startsWith('game-')) startMinigame(w.id.slice('game-'.length));
}

function createWindow(opts: {
  id: string;
  title: string;
  iconUrl: string;
  bodyHtml: string;
  extraClass?: string;
  width?: number;
}): HTMLElement {
  const existing = windows.get(opts.id);
  if (existing) {
    restoreWindow(existing);
    return existing.el;
  }

  const el = document.createElement('div');
  el.className = 'explorer-window' + (opts.extraClass ? ` ${opts.extraClass}` : '');
  el.innerHTML = `
    <div class="win-titlebar">
      <img class="win-title-icon" src="${opts.iconUrl}" alt="">
      <span class="win-title">${opts.title}</span>
      <button class="win-close" aria-label="${TX.close}">✕</button>
    </div>
    ${opts.bodyHtml}`;

  // 좁은 화면에서는 화면 폭에 맞춰 줄어들고, 넓은 화면에서도 화면을 넘지 않는다
  const width = Math.min(opts.width ?? 480, window.innerWidth - EDGE_PAD * 2);
  // 창이 작을수록 계단식 오프셋도 작게 — 좁은 화면에서 창이 밀려나지 않도록
  const step = Math.min(26, Math.max(0, (window.innerWidth - width) / 8));
  const off = (cascade++ % 7) * step;
  el.style.width = `${width}px`;
  el.style.left = `${Math.max(EDGE_PAD, (window.innerWidth - width) / 2 + off)}px`;
  desktopEl.appendChild(el);
  // 실제 창 높이를 잰 뒤 작업표시줄을 뺀 영역의 세로 중앙에 배치
  const areaH = window.innerHeight - taskbarH();
  el.style.top = `${Math.max(EDGE_PAD, (areaH - el.offsetHeight) / 2 + off)}px`;

  const taskBtn = document.createElement('button');
  taskBtn.className = 'task-win-btn';
  taskBtn.innerHTML = `<img src="${opts.iconUrl}" alt=""><span>${opts.title}</span>`;
  document.getElementById('task-windows')!.appendChild(taskBtn);

  const managed: ManagedWindow = { id: opts.id, el, taskBtn, minimized: false };
  windows.set(opts.id, managed);

  el.querySelector('.win-close')!.addEventListener('click', () => closeWindow(managed));
  el.addEventListener('pointerdown', () => focusWindow(managed));
  taskBtn.addEventListener('click', () => {
    if (managed.minimized) restoreWindow(managed);
    else if (topWindow() === managed) minimizeWindow(managed);
    else focusWindow(managed);
  });

  makeWindowDraggable(el);
  focusWindow(managed);
  return el;
}

function makeWindowDraggable(el: HTMLElement): void {
  const bar = el.querySelector<HTMLElement>('.win-titlebar')!;
  // 포인터 이벤트로 처리해 마우스·터치·펜 모두 같은 코드로 끌 수 있게 한다
  bar.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('.win-close')) return;
    e.preventDefault();
    capturePointer(bar, e.pointerId);
    const grabX = e.clientX - el.offsetLeft;
    const grabY = e.clientY - el.offsetTop;
    const onMove = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      // 창이 완전히 밖으로 나가 되찾을 수 없게 되는 것만 막는다
      const minX = -el.offsetWidth + 120;
      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - taskbarH() - 20;
      el.style.left = `${Math.min(Math.max(ev.clientX - grabX, minX), maxX)}px`;
      el.style.top = `${Math.min(Math.max(ev.clientY - grabY, 0), maxY)}px`;
    };
    const onUp = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      bar.removeEventListener('pointermove', onMove);
      bar.removeEventListener('pointerup', onUp);
      bar.removeEventListener('pointercancel', onUp);
    };
    bar.addEventListener('pointermove', onMove);
    bar.addEventListener('pointerup', onUp);
    bar.addEventListener('pointercancel', onUp);
  });
}

/** 화면이 줄어들어 창이 밖으로 나가면 보이는 자리로 되돌린다 */
function keepWindowsInView(): void {
  const areaH = window.innerHeight - taskbarH();
  for (const w of windows.values()) {
    const el = w.el;
    // 새 화면에 들어갈 수 있으면 통째로 안으로, 아니면 최소한 제목표시줄은 잡히게
    const maxLeft = Math.max(EDGE_PAD, window.innerWidth - el.offsetWidth - EDGE_PAD);
    const minLeft = Math.min(EDGE_PAD, maxLeft);
    el.style.left = `${Math.min(Math.max(el.offsetLeft, minLeft), maxLeft)}px`;
    el.style.top = `${Math.max(0, Math.min(el.offsetTop, areaH - el.offsetHeight))}px`;
  }
}

/* ================= 창 콘텐츠 ================= */

function openGameWindow(game: GameEntry): void {
  const el = createWindow({
    id: `game-${game.id}`,
    title: TX.propsTitle(game.title),
    iconUrl: game.icon,
    width: 520,
    bodyHtml: buildGameBody(game),
  });
  wireGameTabs(el);
}

function openReadme(): void {
  createWindow({
    id: 'readme',
    title: TX.notepadTitle,
    iconUrl: notepadIcon,
    extraClass: 'notepad',
    bodyHtml: `<pre class="notepad-body">${README_TEXT}</pre>`,
  });
}

function showMessageBox(title: string, messageHtml: string): void {
  document.querySelector('.msgbox-backdrop')?.remove();
  const backdrop = document.createElement('div');
  backdrop.className = 'msgbox-backdrop';
  backdrop.innerHTML = `
    <div class="msgbox">
      <div class="win-titlebar">
        <span class="win-title">${title}</span>
        <button class="win-close" aria-label="${TX.close}">✕</button>
      </div>
      <div class="msgbox-body">${messageHtml}</div>
      <div class="msgbox-actions"><button class="btn-ok">${TX.ok}</button></div>
    </div>`;
  const close = () => backdrop.remove();
  backdrop.querySelector('.win-close')!.addEventListener('click', close);
  backdrop.querySelector('.btn-ok')!.addEventListener('click', close);
  desktopEl.appendChild(backdrop);
}

/* ================= 바탕화면 아이콘 ================= */

interface DesktopItem {
  id: string;
  label: string;
  iconUrl: string;
  /** 휴지통에 드롭했을 때 삭제 시도 대상인지 */
  deletable: boolean;
  open: () => void;
}

const ITEMS: DesktopItem[] = [
  ...GAMES.map((g) => ({
    id: g.id,
    label: g.title,
    iconUrl: g.icon,
    deletable: true,
    open: () => openGameWindow(g),
  })),
  {
    id: 'readme',
    label: 'README.txt',
    iconUrl: notepadIcon,
    deletable: true,
    open: openReadme,
  },
  {
    id: 'trash',
    label: TX.trash,
    iconUrl: trashIcon,
    deletable: false,
    open: () => showMessageBox(TX.trash, TX.trashEmpty),
  },
];

const POS_KEY = 'desktop-icon-pos-v1';
type PosMap = Record<string, { x: number; y: number }>;

function loadPositions(): PosMap {
  try {
    return JSON.parse(localStorage.getItem(POS_KEY) ?? '{}') as PosMap;
  } catch {
    return {};
  }
}

function savePosition(id: string, x: number, y: number): void {
  const pos = loadPositions();
  pos[id] = { x, y };
  localStorage.setItem(POS_KEY, JSON.stringify(pos));
}

const GRID_PAD = 16;

/**
 * 저장된 위치가 없는 아이콘을 격자로 배치한다.
 * 칸 크기는 CSS 변수를 바닥으로 삼되, 라벨이 두 줄인 아이콘이 있으면
 * 실제로 그려진 크기를 따라가 겹치지 않게 한다.
 */
function arrangeDefault(icons: HTMLElement[]): void {
  // 바탕화면 높이를 아직 못 재는 시점(스타일·이미지가 앉기 전)에 배치하면
  // 줄 수가 1로 접혀 아이콘이 가로로 늘어선다 — 크기가 잡힐 때까지 미룬다
  if (gridEl.clientHeight === 0) return;
  const cell = iconCell();
  const w = Math.max(cell.w, ...icons.map((i) => i.offsetWidth + 8));
  const h = Math.max(cell.h, ...icons.map((i) => i.offsetHeight + 6));
  const rows = Math.max(1, Math.floor((gridEl.clientHeight - GRID_PAD * 2) / h));
  icons.forEach((icon, i) => {
    icon.style.left = `${GRID_PAD + Math.floor(i / rows) * w}px`;
    icon.style.top = `${GRID_PAD + (i % rows) * h}px`;
  });
}

/** 사용자가 직접 옮긴 적 없는 아이콘 — 화면이 바뀌면 다시 격자로 정렬한다 */
const autoPlaced: HTMLElement[] = [];

function arrangeAuto(): void {
  if (autoPlaced.length) arrangeDefault(autoPlaced);
}

function renderIcons(): void {
  const positions = loadPositions();
  ITEMS.forEach((item) => {
    const pos = positions[item.id];
    const icon = document.createElement('button');
    icon.className = 'desktop-icon';
    icon.dataset.id = item.id;
    if (pos) {
      icon.style.left = `${pos.x}px`;
      icon.style.top = `${pos.y}px`;
    } else {
      autoPlaced.push(icon);
    }
    icon.innerHTML =
      `<img src="${item.iconUrl}" class="folder-icon" alt="" aria-hidden="true" draggable="false">` +
      `<span class="icon-label">${item.label}</span>`;
    // 마우스는 바탕화면답게 더블클릭, 터치는 일반 모바일처럼 한 번 탭 (아래 포인터 처리)
    icon.addEventListener('dblclick', () => item.open());
    icon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') item.open();
    });
    makeIconDraggable(icon, item);
    gridEl.appendChild(icon);
  });
  // 실제 렌더 크기를 재야 하므로 모두 붙인 뒤에 배치한다
  arrangeAuto();
  // 첫 배치는 아이콘 이미지·폰트가 앉기 전에 재면 줄 수가 틀어진다 —
  // 크기가 확정되는 시점마다 다시 줄을 세워 첫 화면부터 격자가 맞게 한다
  requestAnimationFrame(arrangeAuto);
  window.addEventListener('load', arrangeAuto, { once: true });
  void document.fonts?.ready.then(arrangeAuto);
}

function makeIconDraggable(icon: HTMLElement, item: DesktopItem): void {
  icon.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    // 브라우저 기본 이미지 드래그·텍스트 선택이 시작되면 이동 이벤트를 가로채
    // 빠르게 드래그할 때 아이콘이 따라오지 않으므로 차단한다
    e.preventDefault();
    const touch = isTouchPointer(e);
    clearSelection();
    icon.classList.add('selected');
    capturePointer(icon, e.pointerId);
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = icon.offsetLeft;
    const origY = icon.offsetTop;
    // 터치는 손가락이 미세하게 흔들리므로 드래그로 판정하는 문턱을 더 크게 둔다
    const slop = touch ? 10 : 5;
    let moved = false;
    const onMove = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (!moved && Math.abs(dx) + Math.abs(dy) < slop) return;
      moved = true;
      icon.classList.add('dragging');
      icon.style.left = `${Math.min(Math.max(origX + dx, 0), gridEl.clientWidth - icon.offsetWidth)}px`;
      icon.style.top = `${Math.min(Math.max(origY + dy, 0), gridEl.clientHeight - icon.offsetHeight)}px`;
    };
    const onUp = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      icon.removeEventListener('pointermove', onMove);
      icon.removeEventListener('pointerup', onUp);
      icon.removeEventListener('pointercancel', onUp);
      icon.classList.remove('dragging');
      if (!moved) {
        // 터치는 탭 한 번으로 실행 (모바일 기본 동작)
        if (touch && ev.type === 'pointerup') item.open();
        return;
      }
      if (item.deletable && isOverTrash(icon)) {
        icon.style.left = `${origX}px`;
        icon.style.top = `${origY}px`;
        showMessageBox(TX.deleteFailTitle, TX.deleteFailBody(item.label));
        return;
      }
      savePosition(item.id, icon.offsetLeft, icon.offsetTop);
      // 직접 옮긴 아이콘은 화면이 바뀌어도 그 자리를 지킨다
      const auto = autoPlaced.indexOf(icon);
      if (auto >= 0) autoPlaced.splice(auto, 1);
    };
    icon.addEventListener('pointermove', onMove);
    icon.addEventListener('pointerup', onUp);
    icon.addEventListener('pointercancel', onUp);
  });
}

/** 화면이 줄어들면 아이콘을 바탕화면 안쪽으로 되돌린다 */
function keepIconsInView(): void {
  gridEl.querySelectorAll<HTMLElement>('.desktop-icon').forEach((icon) => {
    const maxX = Math.max(0, gridEl.clientWidth - icon.offsetWidth);
    const maxY = Math.max(0, gridEl.clientHeight - icon.offsetHeight);
    if (icon.offsetLeft > maxX) icon.style.left = `${maxX}px`;
    if (icon.offsetTop > maxY) icon.style.top = `${maxY}px`;
  });
}

function isOverTrash(icon: HTMLElement): boolean {
  const trash = gridEl.querySelector<HTMLElement>('[data-id="trash"]');
  if (!trash) return false;
  const a = icon.getBoundingClientRect();
  const b = trash.getBoundingClientRect();
  const cx = a.left + a.width / 2;
  const cy = a.top + a.height / 2;
  return cx >= b.left && cx <= b.right && cy >= b.top && cy <= b.bottom;
}

function clearSelection(): void {
  gridEl.querySelectorAll('.desktop-icon.selected').forEach((el) => el.classList.remove('selected'));
}

/* ================= 러버밴드 선택 ================= */

function initRubberBand(): void {
  gridEl.addEventListener('pointerdown', (e) => {
    if (e.target !== gridEl || e.button !== 0) return;
    clearSelection();
    closeStartMenu();
    // 드래그 선택은 마우스 전용 — 터치에서는 화면을 문지르는 동작이 선택으로 오인된다
    if (isTouchPointer(e)) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const box = document.createElement('div');
    box.className = 'select-box';
    gridEl.appendChild(box);
    const onMove = (ev: MouseEvent) => {
      const x = Math.min(startX, ev.clientX);
      const y = Math.min(startY, ev.clientY);
      const w = Math.abs(ev.clientX - startX);
      const h = Math.abs(ev.clientY - startY);
      Object.assign(box.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` });
      const boxRect = box.getBoundingClientRect();
      gridEl.querySelectorAll<HTMLElement>('.desktop-icon').forEach((icon) => {
        const r = icon.getBoundingClientRect();
        const hit =
          r.left < boxRect.right && r.right > boxRect.left && r.top < boxRect.bottom && r.bottom > boxRect.top;
        icon.classList.toggle('selected', hit);
      });
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      box.remove();
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

/* ================= 시작 메뉴 ================= */

function buildStartMenu(): void {
  const menu = document.getElementById('start-menu')!;
  const gameItems = GAMES.map(
    (g) => `
      <button class="menu-item" data-game="${g.id}">
        <img src="${g.icon}" alt=""><span>${g.title}</span><span class="menu-sub">${g.platformLabel}</span>
      </button>`,
  ).join('');
  menu.innerHTML = `
    <div class="menu-section">${TX.menuGames}</div>
    ${gameItems}
    <hr class="menu-sep">
    <button class="menu-item" data-action="readme">
      <img src="${notepadIcon}" alt=""><span>${TX.menuReadme}</span>
    </button>
    <a class="menu-item" href="${PROFILE.github}" target="_blank" rel="noreferrer">
      <span class="menu-glyph">↗</span><span>GitHub</span>
    </a>
    <a class="menu-item" href="mailto:${PROFILE.email}">
      <span class="menu-glyph">✉</span><span>${TX.menuEmail}</span>
    </a>`;

  menu.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('.menu-item');
    if (!btn) return;
    const gameId = btn.dataset.game;
    if (gameId) openGameWindow(GAMES.find((g) => g.id === gameId)!);
    if (btn.dataset.action === 'readme') openReadme();
    closeStartMenu();
  });

  document.getElementById('start-btn')!.addEventListener('click', () => {
    menu.hidden = !menu.hidden;
  });
  document.addEventListener('pointerdown', (e) => {
    if (!menu.hidden && !(e.target as HTMLElement).closest('#start-menu, #start-btn')) {
      closeStartMenu();
    }
  });
}

function closeStartMenu(): void {
  document.getElementById('start-menu')!.hidden = true;
}

/* ================= 작업표시줄 오른쪽 (언어 · 시계) ================= */

/** 시계 왼쪽에 언어 표시기를 둔다 — 윈도우 입력기 표시기가 있던 자리 */
function initTaskbarRight(): void {
  const startBtn = document.getElementById('start-btn')!;
  startBtn.setAttribute('aria-label', TX.start);
  startBtn.setAttribute('title', TX.start);

  const clock = document.getElementById('clock')!;
  const right = document.createElement('div');
  right.className = 'task-right';
  clock.replaceWith(right);
  right.append(createLangSwitcher({ dropUp: true }), clock);
}

/* ================= 시계 · 단축키 ================= */

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
  if (e.key !== 'Escape') return;
  const menu = document.getElementById('start-menu')!;
  if (!menu.hidden) {
    closeStartMenu();
    return;
  }
  const backdrop = document.querySelector('.msgbox-backdrop');
  if (backdrop) {
    backdrop.remove();
    return;
  }
  if (stopMinigame()) return;
  const top = topWindow();
  if (top) closeWindow(top);
});

/* ================= 화면 크기 변화 대응 ================= */

function initResponsiveLayout(): void {
  let timer = 0;
  const onResize = () => {
    clearTimeout(timer);
    // 주소창이 접히거나 화면을 돌릴 때 연속으로 들어오는 resize를 한 번으로 모은다
    timer = window.setTimeout(() => {
      // 자동 배치된 아이콘은 새 화면 비율에 맞춰 다시 줄을 세운다
      arrangeAuto();
      keepIconsInView();
      keepWindowsInView();
    }, 120);
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  // resize 이벤트 없이 바탕화면 크기가 잡히는 경우(첫 렌더·주소창 접힘)도 잡는다
  if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(gridEl);
}

renderIcons();
initRubberBand();
buildStartMenu();
initTaskbarRight();
startClock();
initResponsiveLayout();
