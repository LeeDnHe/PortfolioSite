import floppyIcon from './floppy-144-icon.svg';
import { taskbarH, uiScale } from './layout.ts';

/* =========================================================
   미니게임 — 게임 속성 창을 닫으면 시작되고,
   창을 다시 열었다 닫으면 처음부터 초기화된다 (ESC = 종료)
   ========================================================= */

type Stopper = () => void;

interface MinigameApi {
  /** 처음부터 다시 시작 */
  restart: () => void;
  /** 미니게임 종료 (레이어 제거) */
  quit: () => void;
}

type MinigameFactory = (layer: HTMLElement, api: MinigameApi) => Stopper;

let active: { id: string; stop: Stopper } | null = null;

/** 해당 게임의 미니게임을 (재)시작한다. 미니게임이 없는 게임이면 false */
export function startMinigame(id: string): boolean {
  const factory = MINIGAMES[id];
  if (!factory) return false;
  stopMinigame();
  // 아이콘 버튼에 포커스가 남아 있으면 스페이스/엔터가 창을 다시 열어버린다
  (document.activeElement as HTMLElement | null)?.blur?.();
  const layer = document.createElement('div');
  layer.id = 'minigame-layer';
  document.getElementById('desktop')!.appendChild(layer);
  const api: MinigameApi = {
    restart: () => startMinigame(id),
    quit: () => stopMinigame(),
  };
  active = { id, stop: factory(layer, api) };
  return true;
}

/** 실행 중인 미니게임을 끝낸다. 실행 중이 아니었으면 false */
export function stopMinigame(): boolean {
  if (!active) return false;
  active.stop();
  active = null;
  document.getElementById('minigame-layer')?.remove();
  return true;
}

/* ================= 공통 유틸 ================= */

function fmtSec(sec: number): string {
  if (sec >= 60) {
    const m = Math.floor(sec / 60);
    return `${m}분 ${(sec - m * 60).toFixed(1)}초`;
  }
  return `${sec.toFixed(1)}초`;
}

function fmtKb(kb: number): string {
  return `${Math.round(kb).toLocaleString()}KB`;
}

/** 게임별 점수 표기 — 플로피는 용량(KB), 나머지는 시간 */
function fmtScore(game: string, v: number): string {
  return game === 'floppy-144' ? fmtKb(v) : fmtSec(v);
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

function loadBest(id: string): number {
  const v = Number(localStorage.getItem(`mg-best-${id}`));
  return Number.isFinite(v) && v > 0 ? v : 0;
}

/** 최고 기록 갱신 시 저장. 갱신 여부와 최종 최고 기록을 반환 */
function submitBest(id: string, sec: number): { best: number; isNew: boolean } {
  const prev = loadBest(id);
  if (sec > prev) {
    localStorage.setItem(`mg-best-${id}`, String(Math.round(sec * 10) / 10));
    return { best: sec, isNew: true };
  }
  return { best: prev, isNew: false };
}

function runLoop(update: (dt: number) => void, signal: AbortSignal): void {
  let raf = 0;
  let last = performance.now();
  const frame = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    update(dt);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  signal.addEventListener('abort', () => cancelAnimationFrame(raf));
}

/** 닉네임 입력 중에는 게임 키 입력을 가로채지 않는다 */
function isTyping(e: Event): boolean {
  return (e.target as HTMLElement | null)?.matches?.('input, textarea') ?? false;
}

/** 폰 셸(모바일 UI)에서 실행 중인가 */
function isMobileUi(): boolean {
  return document.documentElement.classList.contains('is-mobile');
}

/** 터치 조작이 필요한 환경인가 — 판정은 main.ts가 붙인 클래스를 단일 기준으로 삼는다 */
function isTouchUi(): boolean {
  return isMobileUi() || document.documentElement.classList.contains('is-touch');
}

/** 게임 바닥 y — 데스크톱은 작업표시줄 위, 모바일은 홈 인디케이터 위 */
function groundY(): number {
  return window.innerHeight - (isMobileUi() ? 30 : taskbarH());
}

/** 바탕화면/홈 화면에서 해당 게임 아이콘의 위치 (미니게임 등장 연출용) */
function gameIconRect(id: string): DOMRect | undefined {
  return document
    .querySelector(`.desktop-icon[data-id="${id}"], .m-app-btn[data-id="${id}"]`)
    ?.getBoundingClientRect();
}

/** ←→(A/D) 키보드 + 터치 환경이면 화면 좌우 ◀▶ 버튼. dir(): -1 | 0 | 1 */
function trackHorizontal(layer: HTMLElement, signal: AbortSignal): { dir: () => number } {
  const held = new Set<string>();
  const norm = (key: string): string =>
    key === 'ArrowLeft' || key === 'a' || key === 'A'
      ? 'L'
      : key === 'ArrowRight' || key === 'd' || key === 'D'
        ? 'R'
        : '';
  document.addEventListener(
    'keydown',
    (e) => {
      if (isTyping(e)) return;
      const n = norm(e.key);
      if (n) {
        held.add(n);
        e.preventDefault();
      }
    },
    { signal },
  );
  document.addEventListener(
    'keyup',
    (e) => {
      const n = norm(e.key);
      if (n) held.delete(n);
    },
    { signal },
  );
  window.addEventListener('blur', () => held.clear(), { signal });

  let touchDir = 0;
  if (isTouchUi()) {
    const pad = document.createElement('div');
    pad.className = 'mg-touch';
    const makeBtn = (label: string, d: number) => {
      const b = document.createElement('button');
      b.className = 'mg-touch-btn';
      b.textContent = label;
      b.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        touchDir = d;
      });
      const release = () => {
        if (touchDir === d) touchDir = 0;
      };
      b.addEventListener('pointerup', release);
      b.addEventListener('pointercancel', release);
      b.addEventListener('contextmenu', (e) => e.preventDefault());
      return b;
    };
    pad.append(makeBtn('◀', -1), makeBtn('▶', 1));
    layer.appendChild(pad);
  }

  return { dir: () => touchDir || (held.has('R') ? 1 : 0) - (held.has('L') ? 1 : 0) };
}

function buildHud(layer: HTMLElement, quit: () => void): { stats: HTMLElement; hud: HTMLElement } {
  const hud = document.createElement('div');
  hud.className = 'mg-hud';
  hud.innerHTML = `<div class="mg-stats"></div>`;
  layer.appendChild(hud);

  const quitBtn = document.createElement('button');
  quitBtn.className = 'mg-quit';
  quitBtn.textContent = isTouchUi() ? '✕ 미니게임 종료' : '✕ 미니게임 종료 (ESC)';
  quitBtn.addEventListener('click', quit);
  layer.appendChild(quitBtn);

  return { stats: hud.querySelector<HTMLElement>('.mg-stats')!, hud };
}

function showToast(layer: HTMLElement, text: string): void {
  const el = document.createElement('div');
  el.className = 'mg-toast';
  el.textContent = text;
  layer.appendChild(el);
}

function popText(layer: HTMLElement, x: number, y: number, text: string, cls = ''): void {
  const el = document.createElement('div');
  el.className = `mg-pop${cls ? ` ${cls}` : ''}`;
  el.textContent = text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.addEventListener('animationend', () => el.remove());
  layer.appendChild(el);
}

function showOverPanel(
  layer: HTMLElement,
  api: MinigameApi,
  opts: { title: string; lines: string[]; newBest: boolean; game: string; score: number },
): void {
  const panel = document.createElement('div');
  panel.className = 'mg-over';
  panel.innerHTML = `
    <div class="mg-over-title">${opts.title}</div>
    ${opts.lines.map((l) => `<div class="mg-over-line">${l}</div>`).join('')}
    ${opts.newBest ? '<div class="mg-over-line new-best">🏆 신기록!</div>' : ''}
    <div class="mg-over-actions">
      <button class="mg-btn primary">다시 시작</button>
      <button class="mg-btn quit">종료</button>
    </div>
    <div class="mg-over-hint">아이콘을 다시 열었다 닫아도 처음부터 시작됩니다</div>`;
  panel.querySelector('.primary')!.addEventListener('click', api.restart);
  panel.querySelector('.quit')!.addEventListener('click', api.quit);
  panel.insertBefore(
    buildLeaderboardBlock(opts.game, opts.score),
    panel.querySelector('.mg-over-actions'),
  );
  layer.appendChild(panel);
}

/* ================= 전체 랭킹 (Netlify Function + Blobs) ================= */

const LB_API = '/api/leaderboard';
const NICK_KEY = 'mg-nick';
const MEDALS = ['🥇', '🥈', '🥉'];

interface LbEntry {
  name: string;
  score: number;
  at: number;
}

interface LbSubmitResult {
  rank: number | null;
  improved: boolean;
  top: LbEntry[];
}

async function fetchTop(game: string): Promise<LbEntry[]> {
  const res = await fetch(`${LB_API}?game=${encodeURIComponent(game)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return ((await res.json()) as { top: LbEntry[] }).top;
}

async function submitScore(game: string, name: string, score: number): Promise<LbSubmitResult> {
  const res = await fetch(LB_API, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ game, name, score }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as LbSubmitResult;
}

/** 게임 오버 화면에 붙는 TOP 10 랭킹 보드 + 닉네임 등록 폼 */
function buildLeaderboardBlock(game: string, score: number): HTMLElement {
  const box = document.createElement('div');
  box.className = 'mg-lb';
  box.innerHTML = `
    <div class="mg-lb-title">🏆 전체 랭킹 TOP 10</div>
    <div class="mg-lb-body"><span class="mg-lb-status">불러오는 중…</span></div>`;
  const body = box.querySelector<HTMLElement>('.mg-lb-body')!;

  const renderList = (top: LbEntry[], mine?: string) => {
    body.replaceChildren();
    if (top.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'mg-lb-empty';
      empty.textContent = '아직 기록이 없어요. 1위의 주인공이 되어 보세요!';
      body.appendChild(empty);
      return;
    }
    const ol = document.createElement('div');
    ol.className = 'mg-lb-list';
    top.forEach((e, i) => {
      const row = document.createElement('div');
      row.className = 'mg-lb-row';
      if (mine && e.name.toLowerCase() === mine.toLowerCase()) row.classList.add('me');
      const r = document.createElement('span');
      r.className = 'r';
      r.textContent = MEDALS[i] ?? `${i + 1}.`;
      const n = document.createElement('span');
      n.className = 'n';
      n.textContent = e.name; // 사용자 입력이므로 textContent로만 넣는다
      const s = document.createElement('span');
      s.className = 's';
      s.textContent = fmtScore(game, e.score);
      row.append(r, n, s);
      ol.appendChild(row);
    });
    body.appendChild(ol);
  };

  const showMsg = (text: string) => {
    box.querySelector('.mg-lb-msg')?.remove();
    const msg = document.createElement('div');
    msg.className = 'mg-lb-msg';
    msg.textContent = text;
    box.appendChild(msg);
  };

  const showForm = () => {
    const form = document.createElement('div');
    form.className = 'mg-lb-form';
    const input = document.createElement('input');
    input.maxLength = 12;
    input.placeholder = '닉네임 (최대 12자)';
    input.value = localStorage.getItem(NICK_KEY) ?? '';
    const btn = document.createElement('button');
    btn.className = 'mg-btn';
    btn.textContent = '기록 등록';
    form.append(input, btn);
    box.appendChild(form);

    const submit = async () => {
      const name = input.value.trim().slice(0, 12);
      if (!name) {
        input.focus();
        return;
      }
      btn.disabled = true;
      btn.textContent = '등록 중…';
      try {
        localStorage.setItem(NICK_KEY, name);
        const result = await submitScore(game, name, score);
        renderList(result.top, name);
        form.remove();
        if (!result.improved) showMsg(`"${name}"의 더 좋은 기록이 이미 ${result.rank}위에 있어요`);
        else if (result.rank && result.rank <= 10) showMsg(`${result.rank}위에 등록됐어요!`);
        else if (result.rank) showMsg(`아깝다! ${result.rank}위 — TOP 10까지 조금 남았어요`);
        else showMsg('등록했지만 순위권 밖이에요. 다음 판에 다시 도전!');
      } catch {
        btn.disabled = false;
        btn.textContent = '기록 등록';
        showMsg('등록에 실패했어요. 잠시 후 다시 시도해 주세요');
      }
    };
    btn.addEventListener('click', submit);
    input.addEventListener('keydown', (e) => {
      e.stopPropagation(); // ESC 종료·게임 키 입력과 충돌 방지
      if (e.key === 'Enter') void submit();
    });
  };

  fetchTop(game)
    .then((top) => {
      renderList(top);
      showForm();
    })
    .catch(() => {
      body.innerHTML = '<span class="mg-lb-status">랭킹 서버에 연결할 수 없어요 (로컬 실행 중이거나 오프라인)</span>';
    });

  return box;
}

/* =========================================================
   1. Folder Escape — 아이콘 소나기 피하기
   원작처럼 스틱맨이 폴더(바탕화면 아이콘)에서 내려와,
   원작에 등장하는 아이콘들을 무한히 피한다. 기록 = 생존 시간
   ========================================================= */

const STICKMAN_SVG = `
  <svg viewBox="0 0 20 34" xmlns="http://www.w3.org/2000/svg">
    <circle class="sm-head" cx="10" cy="5" r="4"/>
    <line class="sm-body" x1="10" y1="9" x2="10" y2="20"/>
    <line class="sm-arm-l" x1="10" y1="11" x2="1" y2="13"/>
    <line class="sm-arm-r" x1="10" y1="11" x2="19" y2="13"/>
    <line class="sm-leg-l" x1="10" y1="20" x2="5" y2="33"/>
    <line class="sm-leg-r" x1="10" y1="20" x2="15" y2="33"/>
  </svg>`;

/** 원작 Folder Escape 스테이지에 등장하는 파일 아이콘들 */
const FE_ICONS = ['📁', '📄', '🧱', '🔒', '🔑', '💣', '♟', '🐾', '🔌', '🌉'];

interface FallingIcon {
  el: HTMLElement;
  x: number;
  y: number;
  vy: number;
  rot: number;
  vr: number;
  s: number;
}

const folderEscapeGame: MinigameFactory = (layer, api) => {
  const ac = new AbortController();
  const sig = ac.signal;
  const { stats } = buildHud(layer, api.quit);
  const best0 = loadBest('folder-escape');
  const keys = trackHorizontal(layer, sig);

  const S = uiScale();
  const PW = Math.round(30 * S);
  const PH = Math.round(51 * S);
  const player = document.createElement('div');
  player.className = 'mg-stickman dropping';
  player.innerHTML = STICKMAN_SVG;
  player.style.width = `${PW}px`;
  player.style.height = `${PH}px`;
  layer.appendChild(player);

  // 자기 게임 아이콘 속에서 떨어져 나온다
  const iconRect = gameIconRect('folder-escape');
  let px = iconRect ? iconRect.left + iconRect.width / 2 - PW / 2 : window.innerWidth / 2;
  let py = iconRect ? iconRect.top + 6 : -PH;
  let vy = 0;

  let phase: 'drop' | 'play' | 'over' = 'drop';
  let t = 0;
  let spawnAcc = 0;
  const icons: FallingIcon[] = [];

  showToast(
    layer,
    `${isTouchUi() ? '◀ ▶ 버튼으로' : '← → 로'} 이동 · 쏟아지는 아이콘을 피하세요!`,
  );

  const spawn = () => {
    if (icons.length > 110) return;
    const s = (26 + Math.random() * 18) * S;
    const el = document.createElement('div');
    el.className = 'mg-fall';
    el.textContent = FE_ICONS[(Math.random() * FE_ICONS.length) | 0];
    el.style.fontSize = `${s}px`;
    layer.appendChild(el);
    icons.push({
      el,
      x: Math.random() * (window.innerWidth - s),
      y: -s - 10,
      vy: (170 + Math.random() * 110 + t * 6) * S,
      rot: 0,
      vr: (Math.random() - 0.5) * 260,
      s,
    });
  };

  const die = () => {
    phase = 'over';
    player.classList.remove('moving');
    player.classList.add('dead');
    const { best, isNew } = submitBest('folder-escape', t);
    showOverPanel(layer, api, {
      title: '💥 아이콘 더미에 깔렸다!',
      lines: [`생존 시간 <b>${fmtSec(t)}</b>`, `최고 기록 ${fmtSec(best)}`],
      newBest: isNew,
      game: 'folder-escape',
      score: t,
    });
  };

  runLoop((dt) => {
    const W = window.innerWidth;
    const ground = groundY();

    if (phase === 'drop') {
      vy += 2200 * dt;
      py += vy * dt;
      if (py >= ground - PH) {
        py = ground - PH;
        phase = 'play';
        player.classList.remove('dropping');
      }
    } else if (phase === 'play') {
      t += dt;
      const d = keys.dir();
      if (d !== 0) {
        px += d * (370 + t * 3) * S * dt;
        player.classList.add('moving');
        player.classList.toggle('face-left', d < 0);
      } else {
        player.classList.remove('moving');
      }
      px = clamp(px, 2, W - PW - 2);
      py = ground - PH;

      const every = Math.max(0.11, 0.55 * Math.exp(-t / 22));
      spawnAcc += dt;
      while (spawnAcc >= every) {
        spawnAcc -= every;
        spawn();
      }
      stats.textContent = `⏱ ${fmtSec(t)}${best0 ? ` · 최고 ${fmtSec(best0)}` : ''}`;
    }

    // 아이콘 낙하 (게임 오버 후에도 여운으로 계속 떨어진다)
    for (let i = icons.length - 1; i >= 0; i--) {
      const ic = icons[i];
      ic.y += ic.vy * dt;
      ic.rot += ic.vr * dt;
      if (ic.y + ic.s >= ground) {
        ic.el.remove();
        icons.splice(i, 1);
        continue;
      }
      ic.el.style.transform = `translate(${ic.x}px, ${ic.y}px) rotate(${ic.rot}deg)`;

      if (phase === 'play') {
        const bx = ic.x + ic.s * 0.18;
        const bw = ic.s * 0.64;
        const by = ic.y + ic.s * 0.18;
        const bh = ic.s * 0.64;
        const mx = PW * 0.23; // 몸통 기준 판정 (팔다리 끝은 봐준다)
        if (px + mx < bx + bw && px + PW - mx > bx && py + PH * 0.08 < by + bh && py + PH > by) {
          die();
        }
      }
    }

    player.style.transform = `translate(${px}px, ${py}px)`;
  }, sig);

  return () => ac.abort();
};

/* =========================================================
   2. 컴퓨터 키우기 — 과열 방지
   CPU 온도가 점점 빠르게 오른다. 클릭/스페이스 연타로 쿨링 팬을
   돌려 버티고, 100°C가 되면 블루스크린. 기록 = 가동 시간
   ========================================================= */

const FAN_SVG = `
  <svg class="mg-fan" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <g class="mg-fan-rotor">
      <path d="M20 20 C13 6, 27 6, 20 20" fill="#9fd0ff"/>
      <path d="M20 20 C34 13, 34 27, 20 20" fill="#9fd0ff"/>
      <path d="M20 20 C27 34, 13 34, 20 20" fill="#9fd0ff"/>
      <path d="M20 20 C6 27, 6 13, 20 20" fill="#9fd0ff"/>
      <circle cx="20" cy="20" r="3.4" fill="#e3f2fd"/>
    </g>
  </svg>`;

const computerIdleGame: MinigameFactory = (layer, api) => {
  const ac = new AbortController();
  const sig = ac.signal;
  const { stats } = buildHud(layer, api.quit);
  const best0 = loadBest('computer-idle');

  const pc = document.createElement('div');
  pc.className = 'mg-pc';
  pc.innerHTML = `
    <div class="mg-monitor">
      <div class="mg-screen">
        <span class="mg-temp">51°C</span>
        <span class="mg-temp-label">CPU 온도</span>
      </div>
      <div class="mg-monitor-foot"></div>
    </div>
    <div class="mg-heatbar"><div class="mg-heatbar-fill"></div></div>
    <div class="mg-fanbox">${FAN_SVG}<span>클릭 · 스페이스 연타로 냉각!</span></div>`;
  layer.appendChild(pc);

  const screen = pc.querySelector<HTMLElement>('.mg-screen')!;
  const tempEl = pc.querySelector<HTMLElement>('.mg-temp')!;
  const fill = pc.querySelector<HTMLElement>('.mg-heatbar-fill')!;
  const rotor = pc.querySelector<SVGGElement>('.mg-fan-rotor')!;

  let heat = 30;
  let t = 0;
  let fanVel = 0;
  let fanRot = 0;
  let over = false;

  const cool = () => {
    if (over) return;
    heat = Math.max(0, heat - 3.6);
    fanVel = Math.min(fanVel + 7, 46);
  };
  pc.addEventListener(
    'pointerdown',
    (e) => {
      e.preventDefault();
      cool();
    },
    { signal: sig },
  );
  document.addEventListener(
    'keydown',
    (e) => {
      if (isTyping(e)) return;
      if (e.code === 'Space') {
        e.preventDefault(); // 스페이스가 포커스된 버튼을 눌러버리는 것 방지
        if (!e.repeat) cool();
      }
    },
    { signal: sig },
  );

  const showBsod = () => {
    const { best, isNew } = submitBest('computer-idle', t);
    const el = document.createElement('div');
    el.className = 'mg-bsod';
    el.innerHTML = `
      <div class="mg-bsod-inner">
        <div class="mg-bsod-sad">:(</div>
        <p>PC가 과열되어 다시 시작해야 합니다. 쿨링 팬이 한계를 넘었습니다.</p>
        <p>가동 시간 <b>${fmtSec(t)}</b> · 최고 기록 ${fmtSec(best)}${
          isNew ? ' <span class="new-best">🏆 신기록!</span>' : ''
        }</p>
        <p class="mg-bsod-small">중지 코드: THERMAL_SHUTDOWN</p>
        <p class="mg-bsod-small">아이콘을 다시 열었다 닫아도 처음부터 시작됩니다</p>
        <div class="mg-over-actions">
          <button class="mg-btn primary">다시 시작</button>
          <button class="mg-btn quit">종료</button>
        </div>
      </div>`;
    el.querySelector('.primary')!.addEventListener('click', api.restart);
    el.querySelector('.quit')!.addEventListener('click', api.quit);
    el.querySelector('.mg-bsod-inner')!.insertBefore(
      buildLeaderboardBlock('computer-idle', t),
      el.querySelector('.mg-over-actions'),
    );
    document.getElementById('desktop')!.appendChild(el);
    sig.addEventListener('abort', () => el.remove());
  };

  runLoop((dt) => {
    if (over) return;
    t += dt;
    heat += (4.5 + t * 0.55) * dt;
    fanVel *= Math.exp(-2.2 * dt);
    fanRot += fanVel * dt * 40;
    rotor.style.transform = `rotate(${fanRot}deg)`;
    rotor.style.transformOrigin = '20px 20px';

    const temp = Math.min(100, Math.round(30 + heat * 0.7));
    tempEl.textContent = `${temp}°C`;
    fill.style.width = `${clamp(heat, 0, 100)}%`;
    screen.classList.toggle('warn', heat > 50 && heat <= 78);
    screen.classList.toggle('danger', heat > 78);
    pc.classList.toggle('shake', heat > 86);
    stats.textContent = `⏱ 가동 ${fmtSec(t)}${best0 ? ` · 최고 ${fmtSec(best0)}` : ''}`;

    if (heat >= 100) {
      over = true;
      pc.classList.remove('shake');
      showBsod();
    }
  }, sig);

  return () => ac.abort();
};

/* =========================================================
   3. Floppy-144 — 2분 안에 1.44MB 꽉꽉 담기
   제한시간 2분 동안 떨어지는 파일을 최대한 많이 담는다.
   디스크가 꽉 차면 더 못 담으니 ZIP을 받아 압축해 자리를 만든다.
   단, 압축할수록 효율이 떨어진다. 놓친 파일은 그냥 사라질 뿐.
   기록 = 압축 해제 기준 담은 전체 용량(KB)
   ========================================================= */

const FLOPPY_CAP = 1440;
const FLOPPY_TIME = 120; // 제한시간 (초)
const FILE_ICONS = ['📄', '🖼️', '🎵', '📊', '🎞️'];

interface FallingFile {
  el: HTMLElement;
  x: number;
  y: number;
  vy: number;
  w: number;
  h: number;
  kb: number;
  zip: boolean;
}

const floppyGame: MinigameFactory = (layer, api) => {
  const ac = new AbortController();
  const sig = ac.signal;
  const { stats, hud } = buildHud(layer, api.quit);
  const best0 = loadBest('floppy-144');
  const keys = trackHorizontal(layer, sig);

  const capbar = document.createElement('div');
  capbar.className = 'mg-capbar';
  capbar.innerHTML = `<div class="mg-capbar-fill"></div>`;
  hud.appendChild(capbar);
  const capFill = capbar.querySelector<HTMLElement>('.mg-capbar-fill')!;

  const S = uiScale();
  const FW = Math.round(56 * S);
  const player = document.createElement('div');
  player.className = 'mg-floppy';
  player.innerHTML = `<img src="${floppyIcon}" alt="" style="width:${FW}px;height:${FW}px">`;
  layer.appendChild(player);

  const iconRect = gameIconRect('floppy-144');
  let px = iconRect
    ? clamp(iconRect.left + iconRect.width / 2 - FW / 2, 2, window.innerWidth - FW - 2)
    : window.innerWidth / 2 - FW / 2;

  let phase: 'play' | 'over' = 'play';
  let t = 0;
  let used = 0; // 디스크에 실제로 차지하는 (압축 후) 용량
  let total = 0; // 담은 파일들의 압축 해제 기준 전체 용량 = 점수
  let saved = 0;
  let zipCount = 0;
  let spawnAcc = 0;
  let zipAcc = 0;
  const files: FallingFile[] = [];

  showToast(layer, '2분 안에 파일을 최대한 많이 담으세요 · 꽉 차면 ZIP으로 압축!');

  const fmtClock = (sec: number): string => {
    const s = Math.max(0, Math.ceil(sec));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  const spawnFile = (zip: boolean) => {
    const el = document.createElement('div');
    el.className = `mg-fall mg-file${zip ? ' zip' : ''}`;
    const kb = zip ? 0 : Math.round((40 + Math.random() * 170 + t * 5) / 4) * 4;
    el.innerHTML = zip
      ? `<span class="mg-file-icon" style="font-size:${30 * S}px">🗜️</span><span class="mg-kb">ZIP</span>`
      : `<span class="mg-file-icon" style="font-size:${30 * S}px">${FILE_ICONS[(Math.random() * FILE_ICONS.length) | 0]}</span><span class="mg-kb">${kb}KB</span>`;
    layer.appendChild(el);
    files.push({
      el,
      x: 6 + Math.random() * (window.innerWidth - FW - 12),
      y: -60,
      vy: (130 + Math.random() * 70 + t * 4) * S,
      w: Math.round(40 * S),
      h: Math.round(48 * S),
      kb,
      zip,
    });
  };

  const gameOver = () => {
    phase = 'over';
    const { best, isNew } = submitBest('floppy-144', total);
    showOverPanel(layer, api, {
      title: '⏰ 시간 종료!',
      lines: [
        `담은 전체 용량 <b>${fmtKb(total)}</b>`,
        `저장 ${saved}개 · 압축 ${zipCount}회`,
        `최고 기록 ${fmtKb(best)}`,
      ],
      newBest: isNew,
      game: 'floppy-144',
      score: total,
    });
  };

  const renderStats = () => {
    stats.textContent = `⏰ ${fmtClock(FLOPPY_TIME - t)} · 💾 ${fmtKb(used)}/${fmtKb(FLOPPY_CAP)} · 담은 용량 ${fmtKb(total)}${
      best0 ? ` · 최고 ${fmtKb(best0)}` : ''
    }`;
    capFill.style.width = `${clamp((used / FLOPPY_CAP) * 100, 0, 100)}%`;
  };
  renderStats();

  runLoop((dt) => {
    const W = window.innerWidth;
    const ground = groundY();
    const fy = ground - FW - 2; // 플로피 상단

    if (phase === 'play') {
      t += dt;
      if (t >= FLOPPY_TIME) {
        renderStats();
        gameOver();
        return;
      }
      px = clamp(px + keys.dir() * (400 + t * 2) * S * dt, 2, W - FW - 2);

      spawnAcc += dt;
      const every = Math.max(0.45, 1.2 * Math.exp(-t / 40));
      while (spawnAcc >= every) {
        spawnAcc -= every;
        spawnFile(false);
      }
      zipAcc += dt;
      if (zipAcc >= 8) {
        zipAcc = 0;
        spawnFile(true);
      }
      renderStats();
    }

    for (let i = files.length - 1; i >= 0; i--) {
      const f = files[i];
      f.y += f.vy * dt;
      f.el.style.transform = `translate(${f.x}px, ${f.y}px)`;

      if (phase === 'play') {
        const bottom = f.y + f.h;
        const overlap = Math.abs(f.x + f.w / 2 - (px + FW / 2)) < FW * 0.75;
        if (bottom >= fy + FW * 0.25 && bottom <= fy + FW * 0.8 && overlap) {
          // 받았다!
          if (f.zip) {
            if (used > 0) {
              // 압축할수록 효율이 떨어진다: 50% → 56% → 62% … 최대 90%
              const ratio = Math.min(0.9, 0.5 + zipCount * 0.06);
              const freed = used - Math.round(used * ratio);
              used -= freed;
              zipCount++;
              popText(layer, f.x, fy - 14, `압축! -${fmtKb(freed)}`, 'gold');
            } else {
              popText(layer, f.x, fy - 14, '빈 디스크!', 'gold');
            }
          } else if (used + f.kb > FLOPPY_CAP) {
            // 자리가 없으면 담기지 않고 튕겨 나간다 — ZIP으로 자리를 만들 것
            popText(layer, f.x, fy - 14, '꽉 참!', 'bad');
          } else {
            used += f.kb;
            total += f.kb;
            saved++;
            popText(layer, f.x, fy - 14, `+${f.kb}KB`);
          }
          f.el.remove();
          files.splice(i, 1);
          continue;
        }
        if (f.y + f.h >= ground) {
          // 놓친 파일은 그냥 사라진다 — 담을 기회만 날아갈 뿐
          f.el.remove();
          files.splice(i, 1);
          continue;
        }
      } else if (f.y > window.innerHeight) {
        f.el.remove();
        files.splice(i, 1);
      }
    }

    player.style.transform = `translate(${px}px, ${fy}px)`;
  }, sig);

  return () => ac.abort();
};

/* ================= 게임 등록 ================= */

const MINIGAMES: Record<string, MinigameFactory> = {
  'folder-escape': folderEscapeGame,
  'computer-idle': computerIdleGame,
  'floppy-144': floppyGame,
};
