/* =========================================================
   익명 건의함 — 방문자가 의견을 한 줄 남기고 가는 창.
   비공개함이라 다른 사람이 남긴 글은 아무에게도 보이지 않고,
   자기가 보낸 글만 이 브라우저에 남겨 다시 볼 수 있게 한다.

   여기 있는 제한(글자 수·연속 작성 간격)은 안내용일 뿐이다 —
   진짜 문지기는 netlify/functions/guestbook.mts 쪽이고, 그 응답을 그대로 보여준다.
   ========================================================= */

import { lang, TX } from './i18n.ts';
import suggestIcon from './suggest-icon.svg';

export { suggestIcon };

const API = '/api/guestbook';
/** 서버의 MAX_LEN과 같은 값을 쓴다 */
export const GB_MAX_LEN = 300;
const MIN_LEN = 2;
/** 카운트다운을 초 대신 "오늘은 여기까지"로 바꾸는 기준 (하루 상한에 걸린 경우) */
const LONG_WAIT_S = 300;

const MINE_KEY = 'gb-mine';
const COOLDOWN_KEY = 'gb-cooldown';
const MINE_KEEP = 10;

interface MinePost {
  text: string;
  at: number;
}

/* ================= 내가 보낸 의견 (이 브라우저에만) ================= */

function loadMine(): MinePost[] {
  try {
    const raw = JSON.parse(localStorage.getItem(MINE_KEY) ?? '[]') as MinePost[];
    return Array.isArray(raw) ? raw : [];
  } catch {
    return []; // 쿠키·저장소 차단 환경
  }
}

function rememberMine(text: string, at: number): void {
  try {
    localStorage.setItem(MINE_KEY, JSON.stringify([{ text, at }, ...loadMine()].slice(0, MINE_KEEP)));
  } catch {
    /* 저장이 막혀 있으면 보낸 기록만 안 남는다 — 전송 자체는 이미 끝났다 */
  }
}

/* ================= 다시 보낼 수 있는 시각 ================= */

function storedCooldown(): number {
  try {
    return Number(localStorage.getItem(COOLDOWN_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveCooldown(until: number): void {
  try {
    localStorage.setItem(COOLDOWN_KEY, String(until));
  } catch {
    /* 저장이 막혀도 서버가 같은 간격으로 막아 준다 */
  }
}

/* ================= 본문 ================= */

/** 데스크톱 창 · 모바일 앱 페이지 공용 본문 */
export function guestbookBodyHtml(): string {
  return `
    <div class="win-body gb">
      <p class="gb-lead">${TX.gbLead}</p>
      <div class="gb-form">
        <textarea class="gb-input" rows="5" placeholder="${TX.gbPlaceholder}"></textarea>
        <div class="gb-row">
          <span class="gb-count">0 / ${GB_MAX_LEN}</span>
          <button class="gb-send" type="button" disabled>${TX.gbSend}</button>
        </div>
        <p class="gb-msg" role="status"></p>
      </div>
      <div class="gb-rules">${TX.gbRules.map((r) => `<span>${r}</span>`).join('')}</div>
      <section class="gb-mine" hidden>
        <h2 class="gb-mine-title">${TX.gbMineTitle}</h2>
        <p class="gb-mine-hint">${TX.gbMineHint}</p>
        <div class="gb-mine-list"></div>
      </section>
    </div>`;
}

function fmtTime(at: number): string {
  return new Date(at).toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** 서버가 돌려준 코드를 사람이 읽는 문구로 */
function errorText(code: string, retryAfter: number): string {
  switch (code) {
    case 'cooldown':
      return TX.gbErrCooldown(retryAfter);
    case 'daily':
      return TX.gbErrDaily;
    case 'link':
      return TX.gbErrLink;
    case 'duplicate':
      return TX.gbErrDuplicate;
    case 'too_long':
      return TX.gbErrTooLong(GB_MAX_LEN);
    case 'empty':
      return TX.gbErrEmpty;
    default:
      return TX.gbErrFailed;
  }
}

/** 본문에 동작을 붙인다 — 이미 붙인 창을 다시 열어도 두 번 걸리지 않는다 */
export function wireGuestbook(root: HTMLElement): void {
  const box = root.querySelector<HTMLElement>('.gb');
  if (!box || box.dataset.wired) return;
  box.dataset.wired = '1';

  const input = box.querySelector<HTMLTextAreaElement>('.gb-input')!;
  const count = box.querySelector<HTMLElement>('.gb-count')!;
  const send = box.querySelector<HTMLButtonElement>('.gb-send')!;
  const msg = box.querySelector<HTMLElement>('.gb-msg')!;
  const mineBox = box.querySelector<HTMLElement>('.gb-mine')!;
  const mineList = box.querySelector<HTMLElement>('.gb-mine-list')!;

  let cooldownUntil = storedCooldown();
  let sending = false;
  let ticker = 0;

  const showMsg = (text: string, kind: 'ok' | 'error') => {
    msg.textContent = text;
    msg.classList.toggle('error', kind === 'error');
  };

  /** 글자 수 · 보내기 버튼 상태를 지금 상황에 맞춘다 */
  const refresh = () => {
    // 이모지도 한 글자로 세고(서버와 같은 기준), 넘치면 그 자리에서 자른다
    const chars = [...input.value];
    if (chars.length > GB_MAX_LEN) {
      input.value = chars.slice(0, GB_MAX_LEN).join('');
      showMsg(TX.gbErrTooLong(GB_MAX_LEN), 'error');
    }
    const n = [...input.value].length;
    count.textContent = `${n} / ${GB_MAX_LEN}`;
    count.classList.toggle('full', n >= GB_MAX_LEN);

    if (sending) {
      send.disabled = true;
      send.textContent = TX.gbSending;
      return;
    }
    const left = Math.ceil((cooldownUntil - Date.now()) / 1000);
    if (left > 0) {
      send.disabled = true;
      send.textContent = left > LONG_WAIT_S ? TX.gbWaitLong : TX.gbWait(left);
      return;
    }
    send.textContent = TX.gbSend;
    send.disabled = input.value.trim().length < MIN_LEN;
  };

  /** 다시 보낼 수 있을 때까지 버튼에 남은 시간을 보여준다 */
  const startTicker = () => {
    clearInterval(ticker);
    ticker = window.setInterval(() => {
      // 창을 닫으면(데스크톱) 요소가 사라지므로 타이머도 같이 끝난다
      if (!box.isConnected || Date.now() >= cooldownUntil) clearInterval(ticker);
      refresh();
    }, 1000);
  };

  const setCooldown = (seconds: number) => {
    cooldownUntil = Date.now() + seconds * 1000;
    saveCooldown(cooldownUntil);
    startTicker();
  };

  const renderMine = () => {
    const mine = loadMine();
    mineBox.hidden = mine.length === 0;
    mineList.replaceChildren();
    mine.forEach((m) => {
      const item = document.createElement('div');
      item.className = 'gb-mine-item';
      const text = document.createElement('span');
      text.className = 'gb-mine-text';
      text.textContent = m.text; // 사용자가 쓴 글이므로 textContent로만 넣는다
      const at = document.createElement('span');
      at.className = 'gb-mine-at';
      at.textContent = fmtTime(m.at);
      item.append(text, at);
      mineList.appendChild(item);
    });
  };

  const submit = async () => {
    const text = input.value.trim();
    if (sending || text.length < MIN_LEN || Date.now() < cooldownUntil) return;
    sending = true;
    showMsg('', 'ok');
    refresh();
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        retryAfter?: number;
        cooldown?: number;
        at?: number;
      };
      sending = false;
      if (res.ok) {
        rememberMine(text, data.at ?? Date.now());
        input.value = '';
        renderMine();
        showMsg(TX.gbThanks, 'ok');
        setCooldown(data.cooldown ?? 60);
      } else {
        // 서버가 "잠시 뒤에" 라고 하면 버튼도 그때까지 잠근다
        if (data.error === 'cooldown' || data.error === 'daily') setCooldown(data.retryAfter ?? 60);
        showMsg(errorText(data.error ?? '', data.retryAfter ?? 0), 'error');
      }
    } catch {
      sending = false;
      showMsg(TX.gbOffline, 'error');
    }
    refresh();
  };

  input.addEventListener('input', refresh);
  // 창 뒤에서 미니게임이 돌고 있을 수 있다 — 타이핑이 게임 조작·ESC 닫기로 새지 않게 한다
  input.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) void submit();
  });
  send.addEventListener('click', () => void submit());

  renderMine();
  refresh();
  if (cooldownUntil > Date.now()) startTicker();
}
