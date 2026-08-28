/* =========================================================
   언어 — 저장된 선택 > 브라우저 언어 순으로 정하고,
   바꾸면 저장 후 새로고침한다 (셸이 이미 그려진 뒤라 다시 그리는 편이 안전)
   ========================================================= */

export type Lang = 'ko' | 'en';

const LANG_KEY = 'site-lang';

export const LANG_NAMES: Record<Lang, string> = { ko: '한국어', en: 'English' };
export const LANG_SHORT: Record<Lang, string> = { ko: 'KO', en: 'EN' };

function storedLang(): Lang | null {
  try {
    const v = localStorage.getItem(LANG_KEY);
    return v === 'ko' || v === 'en' ? v : null;
  } catch {
    return null; // 쿠키·저장소 차단 환경
  }
}

function saveLang(v: Lang): void {
  try {
    localStorage.setItem(LANG_KEY, v);
  } catch {
    /* 저장이 막혀도 이번 방문 동안은 선택한 언어로 보여준다 */
  }
}

/** ?lang= > 저장된 선택 > 브라우저 언어(한국어 계열만 ko) */
function detectLang(): Lang {
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'ko' || q === 'en') {
    saveLang(q); // 공유 링크로 들어와도 다음 방문까지 이어진다
    return q;
  }
  const saved = storedLang();
  if (saved) return saved;
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language];
  return prefs.some((l) => l?.toLowerCase().startsWith('ko')) ? 'ko' : 'en';
}

export const lang: Lang = detectLang();

export function setLang(next: Lang): void {
  if (next === lang) return;
  saveLang(next);
  const url = new URL(location.href);
  url.searchParams.set('lang', next);
  location.replace(url.toString());
}

/** 언어별 값 한 쌍에서 현재 언어 것을 고른다 */
export type L = { ko: string; en: string };
export type LList = { ko: string[]; en: string[] };
export const s = (v: L): string => v[lang];
export const sl = (v: LList): string[] => v[lang];

/* ================= UI 문구 ================= */

const KO = {
  htmlDesc: '게임 포트폴리오 — 폴더를 열어 게임을 플레이하세요',
  langLabel: '언어 / Language',

  ok: '확인',
  close: '닫기',
  start: '시작',

  propsTitle: (title: string) => `${title} 속성`,
  notepadTitle: 'README.txt - 메모장',
  trash: '휴지통',
  trashEmpty: '휴지통이 비어 있습니다.',
  deleteFailTitle: '삭제할 수 없음',
  deleteFailBody: (label: string) =>
    `'${label}'을(를) 삭제할 수 없습니다.<br>포트폴리오가 이 항목을 사용 중입니다.`,

  /* --- 업데이트 알림 --- */
  updApp: '업데이트 알림',
  updTitle: '업데이트 소식',
  updDetails: '전체 보기',
  updNew: 'NEW',
  updMore: (n: number) => `이전 소식 ${n}건`,
  updMoreItems: (n: number) => `그 외 ${n}가지`,

  /* --- 건의함 --- */
  gbTitle: '건의함',
  gbLead:
    '이 사이트와 게임에 대한 의견을 자유롭게 남겨 주세요.<br>글은 개발자에게만 전달되고, 다른 방문자에게는 보이지 않아요.',
  gbPlaceholder: '좋았던 점, 아쉬운 점, 바라는 점 무엇이든 좋아요',
  gbSend: '보내기',
  gbSending: '보내는 중…',
  gbWait: (sec: number) => `${sec}초 뒤`,
  gbWaitLong: '오늘은 여기까지',
  gbRules: ['글만 보낼 수 있어요', '한 번에 최대 300자', '1분에 한 번 · 하루 5번까지'],
  gbThanks: '보냈어요. 잘 읽어볼게요, 고마워요!',
  gbErrEmpty: '내용을 조금만 더 적어 주세요',
  gbErrTooLong: (max: number) => `${max}자까지 보낼 수 있어요`,
  gbErrLink: '링크는 보낼 수 없어요. 주소 없이 내용만 적어 주세요',
  gbErrDuplicate: '방금 보낸 것과 같은 내용이에요',
  gbErrCooldown: (sec: number) => `잠시만요 — ${sec}초 뒤에 다시 보낼 수 있어요`,
  gbErrDaily: '오늘 보낼 수 있는 만큼 다 보냈어요. 내일 다시 들러 주세요',
  gbErrFailed: '보내지 못했어요. 잠시 후 다시 시도해 주세요',
  gbOffline: '건의함 서버에 연결할 수 없어요 (로컬 실행 중이거나 오프라인)',
  gbMineTitle: '내가 보낸 의견',
  gbMineHint: '이 브라우저에만 남는 기록이에요',

  /* --- 건의함 (관리자) --- */
  gbAdminTitle: '건의함 (관리자)',
  gbAdminCount: (n: number) => `받은 의견 ${n}건`,
  gbAdminLoading: '불러오는 중…',
  gbAdminEmpty: '아직 받은 의견이 없어요',
  gbAdminHint: '주소창에서 키는 지웠어요 — 다시 보려면 저장해 둔 주소로 들어오세요',
  gbAdminBadKey: '관리자 키가 맞지 않아요',
  gbAdminNoKey: 'Netlify에 GUESTBOOK_KEY 환경변수를 먼저 설정해 주세요',
  gbRefresh: '새로고침',
  gbDelete: '삭제',
  gbDeleteConfirm: '정말 삭제?',
  gbDeleteFailed: '삭제 실패',

  menuGames: '게임',
  menuReadme: '소개 (README.txt)',
  menuUpdates: '업데이트 소식',
  menuGuestbook: '건의함',
  menuEmail: '이메일 보내기',

  mHome: '홈으로',
  mAbout: '소개',
  mMail: '메일',
  mDate: (d: Date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}요일`;
  },

  platformPc: 'PC',
  platformMobile: '모바일',

  tabGeneral: '일반',
  tabDetail: '자세히',
  tabVersions: '이전 버전',
  btnPlay: '플레이',
  btnDownload: '다운로드 (APK)',
  btnWip: '개발 중',
  secAwards: '전시 · 수상',
  secBackground: '만들게 된 배경',
  secStatement: '이 게임으로 보여주고 싶은 것',
  secDevComment: '개발자 코멘트',
  tabEmptyDetail: '아직 작성 중입니다.',
  tabEmptyVersions: '기록된 이전 버전이 없습니다.',
  verCurrent: '현재 버전',

  /* --- 미니게임 --- */
  dur: (sec: number) => {
    if (sec >= 60) {
      const m = Math.floor(sec / 60);
      return `${m}분 ${(sec - m * 60).toFixed(1)}초`;
    }
    return `${sec.toFixed(1)}초`;
  },
  mgQuit: '✕ 미니게임 종료',
  mgQuitEsc: '✕ 미니게임 종료 (ESC)',
  mgRestart: '다시 시작',
  mgQuitBtn: '종료',
  mgNewBest: '🏆 신기록!',
  mgOverHint: '아이콘을 다시 열었다가 닫아도 처음부터 다시 시작됩니다',
  mgBest: (v: string) => `최고 기록 ${v}`,
  mgBestShort: (v: string) => `최고 ${v}`,

  lbTitle: '🏆 전체 랭킹 TOP 10',
  lbTabPc: 'PC 순위',
  lbTabMobile: '모바일 순위',
  lbLoading: '불러오는 중…',
  lbEmpty: '아직 기록이 없어요. 1위의 주인공이 되어 보세요!',
  lbOffline: '랭킹 서버에 연결할 수 없어요 (로컬 실행 중이거나 오프라인)',
  lbNick: '닉네임 (최대 12자)',
  lbSubmit: '기록 등록',
  lbSubmitting: '등록 중…',
  lbAlready: (name: string, rank: number | null) =>
    `이미 "${name}" 이름으로 더 좋은 기록이 ${rank}위에 올라 있어요`,
  lbRanked: (rank: number) => `${rank}위에 등록됐어요!`,
  lbClose: (rank: number) => `아깝다! ${rank}위라서 TOP 10에 조금 못 미쳤어요`,
  lbOutOfRank: '등록했지만 순위권 밖이에요. 다음 판에 다시 도전해 보세요!',
  lbFailed: '등록에 실패했어요. 잠시 후 다시 시도해 주세요',

  feToast: (mobile: boolean) =>
    `${mobile ? '◀ ▶ 버튼으로' : '← → 키로'} 이동하면서 쏟아지는 아이콘을 피하세요!`,
  feOverTitle: '💥 아이콘 더미에 깔렸다!',
  feSurvived: (v: string) => `생존 시간 <b>${v}</b>`,

  ciTempLabel: 'CPU 온도',
  ciFanHint: '클릭하거나 스페이스를 연타해서 식히세요!',
  ciHud: (v: string) => `⏱ 가동 ${v}`,
  ciBsodMsg: 'PC가 과열되어 다시 시작해야 합니다. 쿨링 팬이 한계를 넘었습니다.',
  ciBsodUptime: (v: string) => `가동 시간 <b>${v}</b>`,
  ciBsodStop: '중지 코드: THERMAL_SHUTDOWN',

  flToast: '2분 안에 파일을 최대한 많이 담으세요 · 디스크가 꽉 차면 ZIP을 받아 압축하세요!',
  flOverTitle: '⏰ 시간 종료!',
  flTotal: (v: string) => `담은 전체 용량 <b>${v}</b>`,
  flCounts: (saved: number, zips: number) => `저장 ${saved}개 · 압축 ${zips}회`,
  flHudStored: (v: string) => `담은 용량 ${v}`,
  flCompressed: (v: string) => `압축! -${v}`,
  flEmptyDisk: '디스크가 비었어요!',
  flFull: '디스크가 꽉 찼어요!',
};

const EN: typeof KO = {
  htmlDesc: 'Game portfolio — open a folder and play',
  langLabel: '언어 / Language',

  ok: 'OK',
  close: 'Close',
  start: 'Start',

  propsTitle: (title: string) => `${title} Properties`,
  notepadTitle: 'README.txt - Notepad',
  trash: 'Recycle Bin',
  trashEmpty: 'The Recycle Bin is empty.',
  deleteFailTitle: "Can't delete",
  deleteFailBody: (label: string) =>
    `'${label}' can't be deleted.<br>This portfolio is currently using the item.`,

  /* --- Update notification --- */
  updApp: 'Site update',
  updTitle: "What's new",
  updDetails: 'See all',
  updNew: 'NEW',
  updMore: (n: number) => `${n} earlier ${n === 1 ? 'post' : 'posts'}`,
  updMoreItems: (n: number) => `${n} more`,

  /* --- Suggestion box --- */
  gbTitle: 'Suggestion box',
  gbLead:
    'Tell me anything about this site and the games.<br>Only I get to read it — nothing you send is shown to other visitors.',
  gbPlaceholder: 'What you liked, what fell flat, what you wish existed',
  gbSend: 'Send',
  gbSending: 'Sending…',
  gbWait: (sec: number) => `in ${sec}s`,
  gbWaitLong: 'That’s it for today',
  gbRules: ['Text only', 'Up to 300 characters', 'One a minute · 5 a day'],
  gbThanks: 'Sent. Thanks — I’ll read it!',
  gbErrEmpty: 'Please write a little more',
  gbErrTooLong: (max: number) => `Up to ${max} characters`,
  gbErrLink: 'Links can’t be sent. Please write the message without a URL',
  gbErrDuplicate: 'That’s the same as what you just sent',
  gbErrCooldown: (sec: number) => `Hold on — you can send again in ${sec}s`,
  gbErrDaily: 'That’s all for today. Come back tomorrow!',
  gbErrFailed: 'Couldn’t send it. Please try again in a moment',
  gbOffline: "Can't reach the suggestion box server (running locally, or you're offline)",
  gbMineTitle: 'What you’ve sent',
  gbMineHint: 'Kept in this browser only',

  /* --- Suggestion box (admin) --- */
  gbAdminTitle: 'Suggestion box (admin)',
  gbAdminCount: (n: number) => `${n} received`,
  gbAdminLoading: 'Loading…',
  gbAdminEmpty: 'Nothing has come in yet',
  gbAdminHint: 'The key is cleared from the address bar — reopen with your saved link',
  gbAdminBadKey: 'That admin key doesn’t match',
  gbAdminNoKey: 'Set the GUESTBOOK_KEY environment variable on Netlify first',
  gbRefresh: 'Refresh',
  gbDelete: 'Delete',
  gbDeleteConfirm: 'Really delete?',
  gbDeleteFailed: 'Delete failed',

  menuGames: 'Games',
  menuReadme: 'About (README.txt)',
  menuUpdates: "What's new",
  menuGuestbook: 'Suggestion box',
  menuEmail: 'Send email',

  mHome: 'Home',
  mAbout: 'About',
  mMail: 'Mail',
  mDate: (d: Date) =>
    d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),

  platformPc: 'PC',
  platformMobile: 'Mobile',

  tabGeneral: 'General',
  tabDetail: 'Details',
  tabVersions: 'Previous versions',
  btnPlay: 'Play',
  btnDownload: 'Download (APK)',
  btnWip: 'In development',
  secAwards: 'Exhibitions · Awards',
  secBackground: 'Why I made it',
  secStatement: 'What I want to show with it',
  secDevComment: "Developer's note",
  tabEmptyDetail: 'Still being written.',
  tabEmptyVersions: 'No previous versions recorded.',
  verCurrent: 'Current',

  /* --- Minigames --- */
  dur: (sec: number) => {
    if (sec >= 60) {
      const m = Math.floor(sec / 60);
      return `${m}m ${(sec - m * 60).toFixed(1)}s`;
    }
    return `${sec.toFixed(1)}s`;
  },
  mgQuit: '✕ Quit minigame',
  mgQuitEsc: '✕ Quit minigame (ESC)',
  mgRestart: 'Restart',
  mgQuitBtn: 'Quit',
  mgNewBest: '🏆 New record!',
  mgOverHint: 'Opening the icon and closing it again restarts from the beginning',
  mgBest: (v: string) => `Best ${v}`,
  mgBestShort: (v: string) => `best ${v}`,

  lbTitle: '🏆 Global TOP 10',
  lbTabPc: 'PC ranking',
  lbTabMobile: 'Mobile ranking',
  lbLoading: 'Loading…',
  lbEmpty: 'No records yet. Be the first to take #1!',
  lbOffline: "Can't reach the ranking server (running locally, or you're offline)",
  lbNick: 'Nickname (12 chars max)',
  lbSubmit: 'Submit score',
  lbSubmitting: 'Submitting…',
  lbAlready: (name: string, rank: number | null) =>
    `"${name}" already has a better score at #${rank}`,
  lbRanked: (rank: number) => `You made #${rank}!`,
  lbClose: (rank: number) => `So close! #${rank} — just short of the TOP 10`,
  lbOutOfRank: 'Submitted, but outside the ranking. Try again next round!',
  lbFailed: 'Submission failed. Please try again in a moment',

  feToast: (mobile: boolean) =>
    `Move with ${mobile ? 'the ◀ ▶ buttons' : '← →'} · dodge the falling icons!`,
  feOverTitle: '💥 Buried under a pile of icons!',
  feSurvived: (v: string) => `Survived <b>${v}</b>`,

  ciTempLabel: 'CPU temp',
  ciFanHint: 'Click or mash Space to cool it down!',
  ciHud: (v: string) => `⏱ Uptime ${v}`,
  ciBsodMsg: 'Your PC overheated and needs to restart. The cooling fan went past its limit.',
  ciBsodUptime: (v: string) => `Uptime <b>${v}</b>`,
  ciBsodStop: 'Stop code: THERMAL_SHUTDOWN',

  flToast: 'Store as many files as you can in 2 minutes · grab a ZIP when the disk fills up!',
  flOverTitle: "⏰ Time's up!",
  flTotal: (v: string) => `Total stored <b>${v}</b>`,
  flCounts: (saved: number, zips: number) => `${saved} files · ${zips} compressions`,
  flHudStored: (v: string) => `stored ${v}`,
  flCompressed: (v: string) => `Compressed! -${v}`,
  flEmptyDisk: 'Disk is empty!',
  flFull: 'Disk full!',
};

/** 현재 언어의 UI 문구 (minigames.ts의 지역 변수 t·S와 겹치지 않게 TX로 쓴다) */
export const TX = lang === 'ko' ? KO : EN;

/* ================= 언어 전환 UI ================= */

const GLOBE_SVG = `
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <ellipse cx="8" cy="8" rx="2.9" ry="6.6" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M1.7 5.9h12.6M1.7 10.1h12.6" fill="none" stroke="currentColor" stroke-width="1.3"/>
  </svg>`;

/**
 * 현재 언어를 보여주고 눌러서 바꾸는 버튼 + 목록.
 * dropUp: 목록을 위쪽으로 펼친다 (작업표시줄처럼 화면 아래에 있을 때)
 */
export function createLangSwitcher(opts: { dropUp?: boolean } = {}): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = `lang-switch${opts.dropUp ? ' drop-up' : ''}`;
  wrap.innerHTML = `
    <button class="lang-btn" aria-haspopup="true" aria-expanded="false"
            aria-label="${TX.langLabel}" title="${TX.langLabel}">
      ${GLOBE_SVG}<span>${LANG_SHORT[lang]}</span>
    </button>
    <div class="lang-menu" role="menu" hidden>
      ${(['ko', 'en'] as Lang[])
        .map(
          (l) =>
            `<button class="lang-opt${l === lang ? ' active' : ''}" role="menuitemradio"
                     aria-checked="${l === lang}" data-lang="${l}">
               <span class="lang-check">✓</span>${LANG_NAMES[l]}
             </button>`,
        )
        .join('')}
    </div>`;

  const btn = wrap.querySelector<HTMLButtonElement>('.lang-btn')!;
  const menu = wrap.querySelector<HTMLElement>('.lang-menu')!;
  const setOpen = (open: boolean) => {
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
  };

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(menu.hidden);
  });
  menu.addEventListener('click', (e) => {
    const opt = (e.target as HTMLElement).closest<HTMLElement>('.lang-opt');
    if (!opt) return;
    setOpen(false);
    setLang(opt.dataset.lang as Lang);
  });
  // 바깥을 누르거나 ESC를 누르면 닫는다
  document.addEventListener('pointerdown', (e) => {
    if (!menu.hidden && !wrap.contains(e.target as Node)) setOpen(false);
  });
  // ESC는 캡처 단계에서 먼저 받아 창 닫기·미니게임 종료로 새어 나가지 않게 한다
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape' && !menu.hidden) {
        setOpen(false);
        e.stopPropagation();
      }
    },
    { capture: true },
  );

  return wrap;
}

/** <html lang> · meta 설명처럼 문서 단위 표시도 현재 언어에 맞춘다 */
export function applyDocumentLang(): void {
  document.documentElement.lang = lang;
  document.querySelector('meta[name="description"]')?.setAttribute('content', TX.htmlDesc);
}
