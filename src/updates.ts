/* =========================================================
   업데이트 알림 — 사이트에 새 소식이 올라오면 윈도우 알림처럼 띄운다.
   마지막으로 본 업데이트 id를 저장해 두고, 그보다 새로운 항목이 있을 때만 보여주므로
   같은 사람에게 두 번 뜨지 않는다. 저장된 기록이 없는(= 그전에 들어온 적 없는) 방문자는
   가장 최근 소식을 한 번 받는다.

   새 소식을 알리려면 UPDATES 맨 앞에 항목을 하나 추가하기만 하면 된다.
   id는 읽음 표시의 기준이라 한 번 정한 뒤에는 바꾸지 않는다.
   ========================================================= */

import { lang, s, sl, TX, type L, type LList } from './i18n.ts';
import updateIcon from './update-icon.svg';

export { updateIcon };

interface RawUpdate {
  id: string;
  /** YYYY-MM-DD — 표시할 때 언어에 맞춰 풀어 쓴다 */
  date: string;
  title: L;
  items: LList;
}

/** 최신순 */
const RAW_UPDATES: RawUpdate[] = [
  {
    id: '2026-10-06-folder-escape-v014-discord',
    date: '2026-10-06',
    title: { ko: '폴더 탈출 새 화면 구성 & 디스코드 오픈', en: 'Folder Escape’s new layout & Discord server' },
    items: {
      ko: [
        '폴더 탈출이 진짜 PC 바탕 화면처럼 바뀌었어요 — 작업 표시줄과 시작 메뉴, 바탕 화면 아이콘, 여러 창을 띄워 둔 채 플레이하기',
        '「화면」 창에서 배율과 다크 테마를 고를 수 있어요 — 데모도 새 화면 구성으로 갱신했어요 (v0.14, "이전 버전" 탭)',
        '폴더 탈출 디스코드 채널이 열렸어요 — 새 소식, 버그 제보, 피드백은 폴더 탈출 창의 디스코드 버튼으로 들어와 주세요',
      ],
      en: [
        'Folder Escape now looks like a real PC desktop — a taskbar and start menu, desktop icons, and several windows open while you play',
        'Pick a scale and a dark theme in the new "Display" window — the demo has the new layout too (v0.14, “Previous versions” tab)',
        'Folder Escape has a Discord server — news, bug reports and feedback all go there; use the Discord button in the Folder Escape window',
      ],
    },
  },
  {
    id: '2026-09-18-folder-escape-v013',
    date: '2026-09-18',
    title: { ko: '폴더 탈출 v0.12 · v0.13 패치노트', en: 'Folder Escape v0.12 & v0.13 patch notes' },
    items: {
      ko: [
        'v0.12 — 도움말 창에서 새 요소를 직접 보여 주는 시연이 재생되고, 설정에서 조작 키를 바꿀 수 있어요 (펑션키 없는 키보드용 프리셋 포함)',
        'v0.13 — 부팅·엔딩 크레딧·관리자 권한 연출과 사용자 계정이 생겼어요',
        '데모도 최신 패치 기준으로 새로 올렸어요 — 자세한 내용은 "이전 버전" 탭에 있어요',
      ],
      en: [
        'v0.12 — the help popup now plays a demo of each new element, and you can remap the controls in settings (with a preset for keyboards without function keys)',
        'v0.13 — boot, ending-credit and administrator cutscenes, plus user accounts',
        'The demo has been rebuilt on the latest patch — details are in the “Previous versions” tab',
      ],
    },
  },
  {
    id: '2026-09-15-folder-escape-steam-page',
    date: '2026-09-15',
    title: { ko: '폴더 탈출 Steam 페이지 오픈', en: 'Folder Escape is now on Steam' },
    items: {
      ko: [
        '폴더 탈출의 Steam 스토어 페이지가 열렸어요 — 지금 찜하기를 해 두면 출시 알림을 받을 수 있어요',
        '폴더 탈출 창에 Steam 페이지 버튼을 추가했어요',
      ],
      en: [
        'Folder Escape’s Steam store page is live — add it to your wishlist to get notified at launch',
        'The Folder Escape window now has a Steam page button',
      ],
    },
  },
  {
    id: '2026-09-13-folder-escape-boost-lab',
    date: '2026-09-13',
    title: { ko: '폴더 탈출, 스토브 인디 부스트랩 진행 & 데모 플레이', en: 'Folder Escape at STOVE Indie Boost Lab & a playable demo' },
    items: {
      ko: [
        '9월 14일부터 27일까지 스토브 인디 부스트랩에 참여해요 — 기간 중 스토브 스토어에서 최신 패치 기준 본편 30스테이지를 모두 플레이할 수 있어요 (폴더 탈출 창의 스토브 스토어 버튼)',
        '플레이 버튼이 "데모 플레이"로 바뀌었어요 — 튜토리얼 + 10스테이지 체험판, 1회차 10~20분이에요',
        '본편은 6블록 30스테이지로 완성됐어요 — v0.10·v0.11 패치노트를 "이전 버전" 탭에 적어 두었어요',
      ],
      en: [
        'Folder Escape is in STOVE Indie Boost Lab from September 14 to 27 — all 30 stages on the latest patch are playable on the STOVE Store for the duration (see the STOVE Store button in the Folder Escape window)',
        'The play button now says "Play demo" — the tutorial plus a 10-stage trial, 10–20 min for a first run',
        'The full game reached 30 stages in 6 blocks — the v0.10 and v0.11 patch notes are in the “Previous versions” tab',
      ],
    },
  },
  {
    id: '2026-09-06-folder-escape-v09',
    date: '2026-09-06',
    title: { ko: '폴더 탈출 v0.9 패치노트', en: 'Folder Escape v0.9 patch notes' },
    items: {
      ko: [
        '블록5 「쥐덫」이 완성됐어요: 커서가 쥐가 되는 Mouse와 종합 스테이지 Mousetrap.zip',
        '클리어 등급(일반/퍼펙트/엑스트라)과 정리된 도전과제 20종을 "이전 버전" 탭에 적어 두었어요',
      ],
      en: [
        'Block 5 "Mousetrap" is complete: Mouse, where the cursor becomes a rat, and the Mousetrap.zip synthesis stage',
        'Clear ranks (normal / perfect / extra) and the trimmed set of 20 achievements are in the “Previous versions” tab',
      ],
    },
  },
  {
    id: '2026-09-04-floppy',
    date: '2026-09-04',
    title: { ko: '플로피 (FLOPPY) 공개 · 1.44MB 공모전 출품', en: 'FLOPPY is out · 1.44MB contest entry' },
    items: {
      ko: [
        '주인공이 1.44MB 플로피디스크인 탑다운 배달 액션 게임 "플로피"를 공모전에 제출했어요',
        '바탕화면의 플로피 아이콘에서 Windows용 실행 파일(1.3MB)을 내려받을 수 있어요',
        '만들게 된 배경과 7주 개발 기록을 "자세히" · "이전 버전" 탭에 정리했어요',
      ],
      en: [
        '"FLOPPY", a top-down delivery action game where you play a 1.44MB floppy disk, has been submitted to the contest',
        'Grab the Windows build (1.3MB) from the floppy icon on the desktop',
        'Why I made it and the 7-week dev log are in the "Details" and "Previous versions" tabs',
      ],
    },
  },
  {
    id: '2026-08-29-guestbook',
    date: '2026-08-29',
    title: { ko: '건의함이 생겼어요', en: 'There’s a suggestion box now' },
    items: {
      ko: [
        '바탕화면(폰에서는 아래 독)의 "건의함"에서 익명으로 의견을 보낼 수 있어요',
        '글은 개발자에게만 전달되고, 다른 방문자에게는 보이지 않아요',
      ],
      en: [
        'Send anonymous feedback from the “Suggestion box” on the desktop — in the dock on phones',
        'Only I read it; nothing you send is shown to other visitors',
      ],
    },
  },
  {
    id: '2026-08-29-notify',
    date: '2026-08-29',
    title: { ko: '업데이트 알림이 생겼어요', en: 'Update notifications' },
    items: {
      ko: [
        '새 소식이 올라오면 사이트에 들어올 때 알림으로 알려드려요',
        'PC에서는 시작 메뉴 → "업데이트 소식"에서 지난 소식을 다시 볼 수 있어요',
      ],
      en: [
        'New posts now greet you with a notification when you visit',
        'On PC, Start menu → "What’s new" keeps the full history',
      ],
    },
  },
  {
    id: '2026-08-29-folder-escape-v08',
    date: '2026-08-29',
    title: { ko: '폴더 탈출 v0.8 패치노트', en: 'Folder Escape v0.8 patch notes' },
    items: {
      ko: ['폴더 탈출 v0.8 변경 사항을 "이전 버전" 탭에 정리했어요', '한국어 소개 문구를 다듬었어요'],
      en: [
        'Folder Escape v0.8 changes are listed in the “Previous versions” tab',
        'Polished the Korean copy across the site',
      ],
    },
  },
  {
    id: '2026-08-17-bic-lang',
    date: '2026-08-17',
    title: { ko: 'BIC 2026 수상 결과 · 한국어/English', en: 'BIC 2026 results · Korean/English' },
    items: {
      ko: [
        'BIC 2026 수상 결과와 현장 빌드(v0.7) 기록을 추가했어요',
        '작업표시줄에서 한국어 ↔ English를 바로 바꿀 수 있어요',
      ],
      en: [
        'Added the BIC 2026 award results and the on-site build (v0.7) notes',
        'Switch between Korean and English right from the taskbar',
      ],
    },
  },
  {
    id: '2026-07-29-minigames',
    date: '2026-07-29',
    title: { ko: '미니게임과 전체 랭킹', en: 'Minigames and the global leaderboard' },
    items: {
      ko: ['바탕화면 아이콘마다 미니게임이 숨어 있어요', '랭킹을 PC · 모바일로 나눠서 보여줘요'],
      en: ['Every desktop icon hides its own minigame', 'The leaderboard is split into PC and mobile'],
    },
  },
];

export interface SiteUpdate {
  id: string;
  date: string;
  title: string;
  items: string[];
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export const UPDATES: SiteUpdate[] = RAW_UPDATES.map((u) => ({
  id: u.id,
  date: formatDate(u.date),
  title: s(u.title),
  items: sl(u.items),
}));

/* ================= 읽음 표시 ================= */

const SEEN_KEY = 'seen-update';
/** 알림이 저절로 사라지기까지 (읽는 동안 마우스를 올려두면 멈춘다) */
const VISIBLE_MS = 12_000;

function storedSeen(): string | null {
  try {
    return localStorage.getItem(SEEN_KEY);
  } catch {
    return null; // 쿠키·저장소 차단 환경
  }
}

/** 아직 본 적 없는 소식 (최신순). 저장 기록이 없으면 전부 = 처음 온 방문자 */
export function pendingUpdates(): SiteUpdate[] {
  const seen = storedSeen();
  if (!seen) return UPDATES;
  const idx = UPDATES.findIndex((u) => u.id === seen);
  // 저장된 id가 목록에 없으면(오래된 기록) 최신 소식만 새것으로 본다
  return idx < 0 ? UPDATES.slice(0, 1) : UPDATES.slice(0, idx);
}

export function markUpdatesSeen(): void {
  const latest = UPDATES[0];
  if (!latest) return;
  try {
    localStorage.setItem(SEEN_KEY, latest.id);
  } catch {
    /* 저장이 막혀도 이번 방문 동안은 다시 뜨지 않는다 (한 번만 그리므로) */
  }
}

/* ================= 전체 소식 목록 ================= */

/** 데스크톱 창 · 모바일 앱 페이지 공용 본문. newIds에 든 항목에는 NEW 배지를 붙인다 */
export function updatesBodyHtml(newIds: string[] = []): string {
  const entries = UPDATES.map(
    (u) => `
      <article class="ver-entry">
        <header class="ver-head">
          <span class="ver-title">${u.title}</span>
          ${newIds.includes(u.id) ? `<span class="ver-current">${TX.updNew}</span>` : ''}
          <span class="ver-date">${u.date}</span>
        </header>
        <ul class="ver-changes">${u.items.map((i) => `<li>${i}</li>`).join('')}</ul>
      </article>`,
  ).join('');
  return `<div class="win-body upd-log">${entries}</div>`;
}

/* ================= 알림 ================= */

/**
 * 오른쪽 아래(폰에서는 상태바 아래)에서 올라오는 업데이트 알림.
 * 볼 소식이 없으면 아무것도 하지 않는다.
 */
export function showUpdateToast(opts: {
  onDetails: (newIds: string[]) => void;
  /** 화면이 다 그려진 뒤 떠야 알림처럼 보인다 */
  delay?: number;
}): void {
  const pending = pendingUpdates();
  if (!pending.length) return;

  const latest = pending[0];
  const newIds = pending.map((u) => u.id);
  const shown = latest.items.slice(0, 4);
  const hints = [
    latest.items.length - shown.length > 0 ? TX.updMoreItems(latest.items.length - shown.length) : '',
    pending.length - 1 > 0 ? TX.updMore(pending.length - 1) : '',
  ].filter(Boolean);

  const el = document.createElement('div');
  el.className = 'upd-toast';
  el.setAttribute('role', 'status');
  el.innerHTML = `
    <div class="upd-head">
      <span class="upd-app"><img src="${updateIcon}" alt="">${TX.updApp}</span>
      <button class="win-close upd-close" aria-label="${TX.close}">✕</button>
    </div>
    <div class="upd-body">
      <div class="upd-title">${latest.title}</div>
      <ul class="upd-items">${shown.map((i) => `<li>${i}</li>`).join('')}</ul>
      ${hints.length ? `<div class="upd-more">${hints.join(' · ')}</div>` : ''}
      <div class="upd-actions">
        <button class="upd-detail">${TX.updDetails}</button>
        <span class="upd-date">${latest.date}</span>
      </div>
    </div>`;

  let hideTimer = 0;
  let gone = false;
  const dismiss = () => {
    if (gone) return;
    gone = true;
    clearTimeout(hideTimer);
    markUpdatesSeen(); // 닫는 순간 읽은 것으로 — 다음 방문에는 뜨지 않는다
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  };
  const hold = () => clearTimeout(hideTimer);
  const countdown = () => {
    hold();
    hideTimer = window.setTimeout(dismiss, VISIBLE_MS);
  };

  // 윈도우 알림처럼 알림 어디를 눌러도 자세한 내용이 열린다 (닫기 버튼만 예외)
  el.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('.upd-close')) {
      dismiss();
      return;
    }
    dismiss();
    opts.onDetails(newIds);
  });
  // 읽는 중에는 사라지지 않게
  el.addEventListener('pointerenter', hold);
  el.addEventListener('pointerleave', countdown);
  el.addEventListener('focusin', hold);

  window.setTimeout(() => {
    document.body.appendChild(el);
    // 붙인 직후의 위치(화면 밖)를 한 번 확정해야 슬라이드 트랜지션이 걸린다
    void el.offsetHeight;
    el.classList.add('show');
    countdown();
  }, opts.delay ?? 900);
}
