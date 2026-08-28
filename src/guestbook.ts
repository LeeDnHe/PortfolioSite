/* =========================================================
   익명 건의함 — 방문자가 의견을 한 줄 남기고 가는 창.
   비공개함이라 다른 사람이 남긴 글은 아무에게도 보이지 않고,
   자기가 보낸 글만 이 브라우저에 남겨 다시 볼 수 있게 한다.

   여기 있는 제한(글자 수·연속 작성 간격)은 안내용일 뿐이다 —
   진짜 문지기는 netlify/functions/guestbook.mts 쪽이고, 그 응답을 그대로 보여준다.

   ?admin=<키> 로 들어오면 같은 창이 관리자 모드로 열려 받은 의견을 목록으로 보여준다.
   키는 서버의 GUESTBOOK_KEY 환경변수와 맞아야 하고, 틀리면 서버가 아무것도 돌려주지 않는다.
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
/** 삭제 버튼이 한 번 더 눌리기를 기다리는 시간 */
const CONFIRM_MS = 4_000;

const MINE_KEY = 'gb-mine';
const COOLDOWN_KEY = 'gb-cooldown';
const MINE_KEEP = 10;

interface MinePost {
  text: string;
  at: number;
}

interface Post {
  id: string;
  text: string;
  at: number;
}

/* ================= 관리자 모드 ================= */

function readAdminKey(): string | null {
  const url = new URL(location.href);
  const key = url.searchParams.get('admin');
  if (!key) return null;
  // 주소창·화면 공유에 키가 남지 않도록 읽자마자 지운다.
  // (새로고침하면 평범한 건의함으로 돌아오므로, 저장해 둔 주소로 다시 들어오면 된다)
  url.searchParams.delete('admin');
  history.replaceState(null, '', url.toString());
  return key;
}

const adminKey = readAdminKey();

/** ?admin= 로 들어왔는지 — 창을 자동으로 열지 결정하는 데 쓴다 */
export const GB_ADMIN = adminKey !== null;

export function guestbookTitle(): string {
  return GB_ADMIN ? TX.gbAdminTitle : TX.gbTitle;
}

/** 목록이 들어가는 관리자 창은 조금 넓게 */
export const GB_WIDTH = GB_ADMIN ? 520 : 440;

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
  return GB_ADMIN ? adminBodyHtml() : visitorBodyHtml();
}

function visitorBodyHtml(): string {
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

function adminBodyHtml(): string {
  return `
    <div class="win-body gb gb-admin">
      <div class="gb-admin-head">
        <span class="gb-admin-count">${TX.gbAdminLoading}</span>
        <button class="gb-refresh" type="button">${TX.gbRefresh}</button>
      </div>
      <p class="gb-admin-hint">${TX.gbAdminHint}</p>
      <div class="gb-admin-list"></div>
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

/** 본문에 동작을 붙인다 — 이미 붙인 창을 다시 열어도 두 번 걸리지 않는다 */
export function wireGuestbook(root: HTMLElement): void {
  const box = root.querySelector<HTMLElement>('.gb');
  if (!box || box.dataset.wired) return;
  box.dataset.wired = '1';
  if (box.classList.contains('gb-admin')) wireAdmin(box);
  else wireForm(box);
}

/* ================= 방문자 — 의견 보내기 ================= */

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

function wireForm(box: HTMLElement): void {
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

/* ================= 관리자 — 받은 의견 보기 · 지우기 ================= */

function wireAdmin(box: HTMLElement): void {
  const head = box.querySelector<HTMLElement>('.gb-admin-count')!;
  const refreshBtn = box.querySelector<HTMLButtonElement>('.gb-refresh')!;
  const list = box.querySelector<HTMLElement>('.gb-admin-list')!;

  let count = 0;

  const showStatus = (text: string, isError = false) => {
    list.replaceChildren();
    const el = document.createElement('p');
    el.className = `gb-admin-status${isError ? ' error' : ''}`;
    el.textContent = text;
    list.appendChild(el);
  };

  const setCount = (n: number) => {
    count = n;
    head.textContent = TX.gbAdminCount(n);
  };

  /** 글 한 건 — 본문 · 받은 시각 · 삭제 버튼 (삭제는 두 번 눌러야 나간다) */
  const buildRow = (post: Post): HTMLElement => {
    const row = document.createElement('article');
    row.className = 'gb-post';

    const text = document.createElement('p');
    text.className = 'gb-post-text';
    text.textContent = post.text; // 방문자가 쓴 글이므로 textContent로만 넣는다

    const foot = document.createElement('div');
    foot.className = 'gb-post-foot';
    const at = document.createElement('span');
    at.className = 'gb-post-at';
    at.textContent = fmtTime(post.at);

    const del = document.createElement('button');
    del.className = 'gb-del';
    del.type = 'button';
    del.textContent = TX.gbDelete;

    let armed = false;
    let armTimer = 0;
    const disarm = () => {
      armed = false;
      del.classList.remove('armed');
      del.textContent = TX.gbDelete;
    };

    del.addEventListener('click', async () => {
      if (!armed) {
        // 실수로 지우는 일이 없게 한 번 더 확인받는다
        armed = true;
        del.classList.add('armed');
        del.textContent = TX.gbDeleteConfirm;
        armTimer = window.setTimeout(disarm, CONFIRM_MS);
        return;
      }
      clearTimeout(armTimer);
      del.disabled = true;
      try {
        const res = await fetch(`${API}?id=${encodeURIComponent(post.id)}`, {
          method: 'DELETE',
          headers: { 'x-admin-key': adminKey! },
        });
        if (!res.ok) throw new Error(String(res.status));
        row.remove();
        setCount(Math.max(0, count - 1));
        if (count === 0) showStatus(TX.gbAdminEmpty);
      } catch {
        del.disabled = false;
        disarm();
        del.classList.add('failed');
        del.textContent = TX.gbDeleteFailed;
      }
    });

    foot.append(at, del);
    row.append(text, foot);
    return row;
  };

  const load = async () => {
    refreshBtn.disabled = true;
    head.textContent = TX.gbAdminLoading;
    try {
      const res = await fetch(API, { headers: { 'x-admin-key': adminKey! } });
      if (res.status === 401) {
        head.textContent = TX.gbAdminTitle;
        showStatus(TX.gbAdminBadKey, true);
        return;
      }
      if (res.status === 503) {
        head.textContent = TX.gbAdminTitle;
        showStatus(TX.gbAdminNoKey, true);
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { count: number; posts: Post[] };
      setCount(data.count);
      if (data.posts.length === 0) {
        showStatus(TX.gbAdminEmpty);
        return;
      }
      list.replaceChildren(...data.posts.map(buildRow)); // 서버가 최신순으로 준다
    } catch {
      head.textContent = TX.gbAdminTitle;
      showStatus(TX.gbOffline, true);
    } finally {
      refreshBtn.disabled = false;
    }
  };

  refreshBtn.addEventListener('click', () => void load());
  void load();
}
