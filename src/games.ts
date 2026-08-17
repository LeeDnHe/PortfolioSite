import { s, sl, TX, type L, type LList } from './i18n.ts';
import folderEscapeIcon from './file-escape-icon.png';
import computerIdleIcon from './computer-idle-icon.svg';
import floppy144Icon from './floppy-144-icon.svg';

export type GamePlatform = 'pc' | 'mobile';

/* ---------- 화면에 뿌려지는 형태 (현재 언어로 이미 풀린 문자열) ---------- */

/** "이전 버전" 탭의 패치노트 한 건 */
export interface GameVersionNote {
  version: string;
  date: string;
  title: string;
  changes: string[];
  current?: boolean;
}

/** 속성 창(일반/자세히/이전 버전)에 표시할 상세 정보 */
export interface GameDetails {
  github?: string;
  /** 일반 탭 — 항목: 값 형태의 기본 정보 */
  facts: { label: string; value: string }[];
  /** 일반 탭 — 전시·수상 경력 */
  awards: string[];
  /** 자세히 탭 — 만들게 된 배경 (문단 단위) */
  background: string[];
  /** 자세히 탭 — 이 게임으로 보여주고 싶은 것 (문단 단위) */
  statement: string[];
  /** 자세히 탭 맨 끝 — 개발자 코멘트 (문단 단위) */
  devComment?: string[];
  /** 이전 버전 탭 — 최신순 패치노트 */
  versions: GameVersionNote[];
}

export interface GameEntry {
  /** 폴더명이자 URL 경로 조각 */
  id: string;
  title: string;
  tagline: string;
  description: string;
  platform: GamePlatform;
  /** 플랫폼 배지에 쓰는 현재 언어 표기 */
  platformLabel: string;
  /** 바탕화면/타이틀바에 표시할 아이콘 이미지 URL */
  icon: string;
  /** 실제 게임이 배포된 주소. 비어 있으면 "개발 중" 처리 */
  playUrl: string;
  /** 모바일 게임 설치 파일 경로(public/ 기준). 있으면 "다운로드" 버튼 표시 */
  downloadUrl?: string;
  /** 유튜브 소개·하이라이트 영상 */
  youtube?: { url: string; label: string };
  year: string;
  /** 없으면 자세히/이전 버전 탭에 준비 중 문구 표시 */
  details?: GameDetails;
}

/* ---------- 원본 데이터 (한국어·영어 한 쌍) ---------- */

interface RawVersionNote {
  version: string;
  date: L;
  title: L;
  changes: LList;
  current?: boolean;
}

interface RawDetails {
  github?: string;
  facts: { label: L; value: L }[];
  awards: LList;
  background: LList;
  statement: LList;
  devComment?: LList;
  versions: RawVersionNote[];
}

interface RawGameEntry {
  id: string;
  title: L;
  tagline: L;
  description: L;
  platform: GamePlatform;
  icon: string;
  playUrl: string;
  downloadUrl?: string;
  youtube?: { url: string; label: L };
  year: string;
  details?: RawDetails;
}

const RAW_GAMES: RawGameEntry[] = [
  {
    id: 'folder-escape',
    title: { ko: 'Folder Escape', en: 'Folder Escape' },
    tagline: { ko: '파일탐색기 퍼즐 게임', en: 'A file explorer puzzle game' },
    description: {
      ko:
        '평범한 파일탐색기인 줄 알았던 창 안에 갇힌 스틱맨. ' +
        '폴더를 열고, 파일을 옮기고, 탐색기의 기능을 역이용해 탈출하는 퍼즐 게임입니다.',
      en:
        'A stickman trapped inside a window that looked like an ordinary file explorer. ' +
        'Open folders, move files, and turn the explorer’s own features against it to escape.',
    },
    platform: 'pc',
    icon: folderEscapeIcon,
    playUrl: 'https://folder-escape.netlify.app/',
    youtube: {
      url: 'https://www.youtube.com/watch?v=lt40Mul_brk',
      label: { ko: '하이라이트 영상', en: 'Highlight video' },
    },
    year: '2026',
    details: {
      github: 'https://github.com/LeeDnHe/Folder-escape',
      facts: [
        {
          label: { ko: '장르', en: 'Genre' },
          value: { ko: 'OS 메타 퍼즐 · 방탈출', en: 'OS meta puzzle · escape room' },
        },
        {
          label: { ko: '플랫폼', en: 'Platform' },
          value: {
            ko: 'PC — WebGL (브라우저) / 실행 파일',
            en: 'PC — WebGL (browser) / standalone build',
          },
        },
        {
          label: { ko: '개발', en: 'Development' },
          value: { ko: '1인 개발 · 2026.03 ~ 개발 중', en: 'Solo · Mar 2026 – in development' },
        },
        {
          label: { ko: '분량', en: 'Length' },
          value: {
            ko: '튜토리얼 포함 24개 스테이지 (90~120분)',
            en: '24 stages including the tutorial (90–120 min)',
          },
        },
        {
          label: { ko: '기술', en: 'Tech' },
          value: {
            ko: 'TypeScript · Vite · GSAP · Web Audio API',
            en: 'TypeScript · Vite · GSAP · Web Audio API',
          },
        },
        {
          label: { ko: '지원 언어', en: 'Languages' },
          value: { ko: '한국어 · 영어', en: 'Korean · English' },
        },
      ],
      awards: {
        ko: [
          'BIC Festival 2026 루키 부문 — Excellence in Experimental 수상 (2026.08)',
          'BIC Festival 2026 루키 부문 — Excellence in Casual 파이널리스트 (2026.08)',
          'BIC Festival 2026 루키 부문 출품 (2026.06) · 온라인 · 현장 전시 (2026.08)',
        ],
        en: [
          'BIC Festival 2026, Rookie Division — Excellence in Experimental, WINNER (Aug 2026)',
          'BIC Festival 2026, Rookie Division — Excellence in Casual, FINALIST (Aug 2026)',
          'Submitted to BIC Festival 2026, Rookie Division (Jun 2026) · online and on-site exhibition (Aug 2026)',
        ],
      },
      background: {
        ko: [
          '남들이 안 해본 색다른 아이디어로 인디 게임을 만들고 싶었습니다. ' +
            '잘 다듬어진 익숙한 장르도 좋지만, "이런 걸 게임으로?" 싶은 낯선 출발점에서 시작하고 싶다는 마음이 컸습니다.',
          '그러던 어느 날, 켜 두고 쓰던 파일 탐색기를 무심코 바라보다 문득 "어, 기능이 꽤 많은데?" 하는 생각이 들었습니다. ' +
            '이름 바꾸기, 확장자 변경, 보기 방식 전환, 숨긴 항목 표시, 검색 — ' +
            '매일 쓰면서도 한 번도 재미의 관점으로 본 적 없던 기능들이 거기 있었습니다.',
          '이 기능들을 퍼즐의 도구로 쓰면 탐색기 그 자체를 방탈출로 만들 수 있지 않을까? ' +
            '그렇게 시작한 작은 아이디어에 중력·음악·시간·전력 같은 컨셉을 하나씩 엮어 나가며 지금의 모습이 되었습니다.',
        ],
        en: [
          'I wanted to make an indie game from an idea nobody had tried yet. Polished, familiar genres are ' +
            'great, but I really wanted to start from an odd premise that makes people ask, "you turned *that* into a game?"',
          'Then one day I was idly staring at the file explorer I always keep open, and it hit me: "wait, this thing has ' +
            'a lot of features." Renaming, changing extensions, switching view modes, showing hidden items, searching — ' +
            'features I used every single day and had never once looked at as a source of fun.',
          'What if I used them as puzzle tools and turned the explorer itself into an escape room? That small idea grew as ' +
            'I wove in concepts like gravity, music, time and electricity, one at a time, into what the game is today.',
        ],
      },
      statement: {
        ko: [
          '"익숙하지만 낯섦"이 이 게임의 정체성입니다. 판타지 세계관도 가상의 조작계도 없이, ' +
            '누구나 아는 파일 탐색기가 그대로 퍼즐의 무대가 됩니다. 설명하지 않아도 직관이 먼저 작동하고, ' +
            '곧이어 "이게 퍼즐이 된다고?" 하는 반전이 찾아오는 경험을 만들고 싶었습니다.',
          '새 규칙을 외우게 하는 대신, 이미 손에 익은 동작 — F2 이름 바꾸기, 확장자 변경, 보기 방식 전환 — 이 ' +
            '그대로 퍼즐의 해법이 되게 했습니다. 같은 파일이라도 아이콘 뷰와 목록 뷰에서 물리 법칙이 다르게 작동하는, ' +
            '"보는 방식이 세계를 바꾼다"는 이 게임만의 메카닉을 보여주고 싶습니다.',
          '그리고 혼자만의 답에 갇히지 않으려 합니다. 첫 데모에서 "참신한데 막상 해 보면 불편하다"는 피드백을 받은 뒤로, ' +
            '새 스테이지가 완성될 때마다 테스트를 부탁해 낯섦이 불편함으로 변질되는 지점을 깎아 내고 있습니다. ' +
            '정체성은 지키되, 플레이어와의 합의점을 찾아가는 개발을 지향합니다.',
        ],
        en: [
          '"Familiar, yet strange" is this game’s identity. There is no fantasy setting and no invented control scheme — ' +
            'the file explorer everyone already knows *is* the puzzle stage. I wanted an experience where intuition works ' +
            'before any explanation, immediately followed by the twist of "wait, this is a puzzle?"',
          'Instead of asking players to memorise new rules, the actions already in their fingers — F2 to rename, changing an ' +
            'extension, switching the view mode — are the solutions themselves. The same file obeys different physics in icon ' +
            'view and list view: I want to show off that signature mechanic, "how you look at the world changes it."',
          'And I try not to get stuck inside my own answers. After the first demo drew the feedback "novel, but awkward to ' +
            'actually play," I have had every new stage tested and shaved down the points where strangeness turns into ' +
            'friction. Keep the identity, but keep negotiating it with the players.',
        ],
      },
      devComment: {
        ko: [
          '타임라인, 메신저, 일기예보 같은 실행 파일이 늘어날수록 "탐색기"라는 본질에서 벗어나는 것은 아닐까 하는 ' +
            '고민이 생겼습니다. 실제로 기본 로직들을 좀 더 주로 사용했으면 좋겠다는 피드백들도 있었고요.',
          '그래서 기본 로직들을 디벨롭한 버전들도 많이 뽑아내 봤지만, 게임을 기본 로직들로만 채우니 ' +
            '자가복제라는 느낌을 피할 수가 없었고, 이 게임의 정체성을 어디에 두어야 하는가에 대해 고민을 많이 했습니다.',
          '결국 그렇게 고민할 시간에, 기존의 규칙들을 너무 깨지 않는 선에서 떠오르는 아이디어들을 ' +
            '하나의 실험실처럼 구현해 보자 — 그렇게 지금의 모습이 되었습니다.',
          '대신 "새로운 로직이 도입만 되고 다시 안 쓰인다"는 피드백은 새로운 구조로 답했습니다. 스테이지를 ' +
            '「도입 4개 + 종합 1개」의 5단위 블록으로 끊고, 다섯 번째 자리에는 신규 로직이 없는 ' +
            '압축파일(.zip) 스테이지를 둡니다. 앞의 네 스테이지에서 배운 로직만으로 통합된 스테이지를 만드는 ' +
            '복습 관문이라, 배운 것을 다시 한 번 더 쓰게 됩니다.',
          '이 게임이 하나의 실험실인 만큼, 저 혼자만의 생각으로 만들어가기보다는 테스트를 진행해 주시는 ' +
            '여러분 모두가 한 명 한 명의 연구원이 되어 주셨으면 합니다. 전달해 주시는 피드백들로 ' +
            '이 게임을 같이 만들어가고 싶습니다.',
        ],
        en: [
          'As executables like the timeline, the messenger and the weather app piled up, I started worrying that the game was ' +
            'drifting away from the essence of "an explorer." I did get feedback asking for more use of the basic mechanics, too.',
          'So I prototyped plenty of versions that developed those basics further — but filling the whole game with them alone ' +
            'felt like self-plagiarism, and I spent a long time asking where this game’s identity should really sit.',
          'In the end I decided that instead of agonising over it, I would implement the ideas that came to me like a laboratory, ' +
            'as long as they did not break the established rules too hard. That is how the game ended up as it is now.',
          'The feedback that "new mechanics get introduced and then never come back" I answered with structure instead. Stages are ' +
            'now cut into blocks of five — four introductions plus one synthesis — and the fifth slot is a compressed (.zip) stage ' +
            'that introduces no new logic at all. It is a review gate built purely from the mechanics of the previous four, so ' +
            'everything you learned gets used at least one more time.',
          'Since this game is a laboratory, I would rather not build it out of my own head alone — I hope everyone who playtests it ' +
            'becomes one of its researchers. I want to keep building this game together with the feedback you send.',
        ],
      },
      versions: [
        {
          version: 'v0.7',
          date: { ko: '2026.08', en: 'Aug 2026' },
          title: { ko: 'BIC 현장 전시 & 피드백 반영', en: 'BIC on-site build & feedback pass' },
          current: true,
          changes: {
            ko: [
              '부스 회전율을 고려한 10 스테이지 현장 데모 빌드로 전시 — 전시 종료 후 본편(전체 스테이지 · 도전과제 23종)으로 복귀',
              '전 스테이지 이름 바꾸기를 대소문자 무시 매칭으로 통일 — 현장에서 관람객이 가장 많이 막히던 지점',
              '튜토리얼에 스포트라이트 인트로 추가 + 소프트락 경로 차단',
              '되돌리기 위치를 파일 id에 앵커링 + 기차 탈선 시 되돌리기 종료',
              '오르골 창을 8×8 체스판으로 개편 + 잠긴 출구를 이름으로 여는 열쇠 스테이지 정비',
              '보기(View) 메뉴 개방 + 붙여넣기 대상을 끊긴 다리 아이콘으로 표시',
              'Tauri 데스크톱 빌드 추가',
            ],
            en: [
              'Exhibited with a 10-stage on-site demo build sized for booth turnover — restored to the full game (all stages, 23 achievements) after the show',
              'Renaming now matches case-insensitively in every stage — the single biggest place visitors got stuck on the floor',
              'Spotlight intros in the tutorial + softlock paths blocked',
              'Undo positions anchored to file ids + undo ends when the train derails',
              'The music-box window reworked into an 8×8 chessboard + a pass over the key stages, where locked exits open by name',
              'View menu opened up + paste targets marked with a broken-bridge icon',
              'Added a Tauri desktop build',
            ],
          },
        },
        {
          version: 'v0.6',
          date: { ko: '2026.08', en: 'Aug 2026' },
          title: { ko: 'BIC 온라인 전시 빌드', en: 'BIC online exhibition build' },
          changes: {
            ko: [
              '스테이지를 「도입 4 + 종합 1」 5단위 블록으로 재편 — 배운 로직이 반드시 다시 쓰이는 구조',
              '신규 종합 스테이지 「Junction.zip」·「Roundhouse.zip」 — 신규 로직 0개로 앞 4스테이지가 통합된 중간보스 스타일의 퍼즐',
              '신규 스테이지 「Defrag」 — 디스크 조각 모음 퍼즐',
              '도전과제 22종 + 블루스크린 연출 추가',
              '모든 스테이지에 2단계 힌트 추가 + 튜토리얼에서 힌트 시스템 안내',
              '편집 메뉴 복사/붙여넣기 개방(잘라내기 폐기) + 되돌리기 적용 범위 확대',
            ],
            en: [
              'Stages restructured into blocks of five (4 introductions + 1 synthesis) — every mechanic you learn is guaranteed to come back',
              'New synthesis stages "Junction.zip" and "Roundhouse.zip" — mid-boss style puzzles that combine the previous four stages with zero new mechanics',
              'New stage "Defrag" — a disk defragmentation puzzle',
              '22 achievements + a blue-screen sequence',
              'Two-step hints on every stage + a hint-system walkthrough in the tutorial',
              'Copy/paste opened up in the edit menu (cut removed) + wider undo coverage',
            ],
          },
        },
        {
          version: 'v0.5',
          date: { ko: '2026.07', en: 'Jul 2026' },
          title: { ko: '사운드 & 언어', en: 'Sound & languages' },
          changes: {
            ko: [
              '루프 BGM 시스템 추가 + 볼륨 설정 저장',
              '한국어/영어 언어 시스템 추가',
              '음계탑 스테이지를 "멜로디를 따라 걷는" 방식으로 개편',
              'Ctrl/Shift 다중 선택 + 일괄 이름 바꾸기 지원',
              '신규 스테이지 「메신저」 — 유품 상자 속 단서를 교차 참조하는 암호 퍼즐',
            ],
            en: [
              'Looping BGM system + saved volume settings',
              'Korean/English language system',
              'The scale tower stage reworked into "walk along the melody"',
              'Ctrl/Shift multi-select + batch renaming',
              'New stage "Messenger" — a cipher puzzle cross-referencing clues inside a box of keepsakes',
            ],
          },
        },
        {
          version: 'v0.4',
          date: { ko: '2026.06', en: 'Jun 2026' },
          title: { ko: '데모 완성', en: 'Demo complete' },
          changes: {
            ko: [
              '시작 화면 + 진행도 저장(이어하기) 시스템 추가',
              '신규 스테이지: 검색 길 찾기 · 숨김 발판 · 전력 회로 · 고양이 추격',
              '전력 회로를 회전 파이프 방식으로 개편',
              '데모 최종 스테이지 클리어 엔딩 추가',
              'BIC Festival 2026 루키 부문 출품',
            ],
            en: [
              'Title screen + progress saving (continue) system',
              'New stages: search pathfinding · hidden platforms · power circuits · cat chase',
              'Power circuits reworked into rotating pipes',
              'Ending sequence for clearing the final demo stage',
              'Submitted to BIC Festival 2026, Rookie division',
            ],
          },
        },
        {
          version: 'v0.3',
          date: { ko: '2026.05', en: 'May 2026' },
          title: { ko: '시스템 통합', en: 'System unification' },
          changes: {
            ko: [
              '신규 스테이지: 마트료시카(중첩 폴더) · 기상청(날씨 조작) · 중력 실험실(창 회전·블랙홀)',
              '방향 중력을 지원하는 통합 중력 시스템으로 재설계',
              '튜토리얼을 능동 학습형으로 개편 + WASD 이동 지원',
            ],
            en: [
              'New stages: Matryoshka (nested folders) · Weather Bureau (weather manipulation) · Gravity Lab (window rotation, black holes)',
              'Redesigned around a unified gravity system with directional gravity',
              'Tutorial reworked into active learning + WASD movement',
            ],
          },
        },
        {
          version: 'v0.2',
          date: { ko: '2026.04', en: 'Apr 2026' },
          title: { ko: '스테이지 확장', en: 'Stage expansion' },
          changes: {
            ko: [
              '신규 스테이지: 음계탑 · 체스판 · 기차역 · 정렬 공장 · 해체 공사장 · 타임라인',
              '서비스 레이어 구조로 전면 리팩토링',
              '천문대 스테이지를 시간을 오가는 타임라인 스테이지로 교체',
            ],
            en: [
              'New stages: scale tower · chessboard · train station · sorting factory · demolition site · timeline',
              'Full refactor into a service-layer architecture',
              'The observatory stage replaced by a timeline stage that travels through time',
            ],
          },
        },
        {
          version: 'v0.1',
          date: { ko: '2026.03', en: 'Mar 2026' },
          title: { ko: '프로토타입', en: 'Prototype' },
          changes: {
            ko: [
              'Windows 탐색기 UI를 HTML/CSS로 재현한 첫 빌드',
              '스테이지 1~4 구현: 이름 바꾸기 · 숨긴 항목 표시 · 확장자 변경(폭탄) · 뷰 전환 중력',
            ],
            en: [
              'First build recreating the Windows explorer UI in HTML/CSS',
              'Stages 1–4: renaming · showing hidden items · changing extensions (bombs) · view-switch gravity',
            ],
          },
        },
      ],
    },
  },
  {
    id: 'computer-idle',
    title: { ko: '컴퓨터 키우기', en: 'Boot Tycoon' },
    tagline: { ko: '방치형 키우기 게임', en: 'An idle tycoon game' },
    description: {
      ko:
        '1980년대 IBM PC에서 시작해 부품을 갈아끼우며 시대를 넘어가는 방치형 게임. ' +
        '부품 호환성 퍼즐을 풀고, 타이핑 알바부터 AI 모델 판매까지 수익 활동을 해금하세요.',
      en:
        'An idle game that starts on a 1980s IBM PC and crosses the eras as you swap in new parts. ' +
        'Solve part-compatibility puzzles and unlock income activities from typing gigs to selling AI models.',
    },
    platform: 'mobile',
    icon: computerIdleIcon,
    playUrl: '',
    downloadUrl: '/boot-tycoon.apk',
    youtube: {
      url: 'https://www.youtube.com/watch?v=CVhu-5VEBz0',
      label: { ko: '소개 영상', en: 'Trailer' },
    },
    year: '2026',
    details: {
      github: 'https://github.com/LeeDnHe/computer-idle-game',
      facts: [
        {
          label: { ko: '장르', en: 'Genre' },
          value: {
            ko: '방치형 키우기 · 하이브리드 캐주얼',
            en: 'Idle tycoon · hybrid casual',
          },
        },
        {
          label: { ko: '플랫폼', en: 'Platform' },
          value: { ko: '모바일 — Android (APK)', en: 'Mobile — Android (APK)' },
        },
        {
          label: { ko: '개발', en: 'Development' },
          value: { ko: '1인 개발 · 2026.04 ~ 개발 중', en: 'Solo · Apr 2026 – in development' },
        },
        {
          label: { ko: '분량', en: 'Length' },
          value: {
            ko: '7세대 시대 · 부품 도감 200칸 · 첫 환생까지 약 2일',
            en: '7 generations · a 200-slot part codex · ~2 days to the first rebirth',
          },
        },
        {
          label: { ko: '기술', en: 'Tech' },
          value: {
            ko: 'React · TypeScript · Zustand · GSAP · Capacitor',
            en: 'React · TypeScript · Zustand · GSAP · Capacitor',
          },
        },
        {
          label: { ko: '지원 언어', en: 'Languages' },
          value: { ko: '한국어 · 영어', en: 'Korean · English' },
        },
        {
          label: { ko: '영문명', en: 'Full title' },
          value: { ko: 'Boot Tycoon: Idle PC Era', en: 'Boot Tycoon: Idle PC Era' },
        },
      ],
      awards: {
        ko: ['Flick × KRAFTON Casual Game Challenge SEASON 01 출품 (2026.05)'],
        en: ['Entered the Flick × KRAFTON Casual Game Challenge SEASON 01 (May 2026)'],
      },
      background: {
        ko: [
          '두 번째 게임은 브라우저 퍼즐이 아니라, 매일 주머니에 넣고 다니는 모바일 게임을 만들어 보고 싶었습니다. ' +
            '마침 방치형 키우기 장르가 매출 상위권을 휩쓸던 시기였는데, 성공작들을 뜯어볼수록 하나의 공식이 보였습니다 — ' +
            '유료 가챠, 판타지 세계관, 숫자에 0만 붙는 환생. 검증된 재미는 가져오되 이 공식을 정반대로 뒤집으면 어떨까, 가 출발점이었습니다.',
          '"그래서 무엇을 키울 것인가"에 대한 답은 의외로 가까이 있었습니다. Folder Escape가 "Windows UI = 게임판"이라는 ' +
            '실험이었다면, 이번에는 "컴퓨터 = 캐릭터"입니다. 1980년대 IBM PC에서 시작해 부품을 갈아끼우며 양자컴퓨터까지 ' +
            '40년의 시대를 넘고, 수익 활동도 타이핑 알바 → 워드 작업 → 영상 편집 → 코인 채굴 → AI 모델 판매로 ' +
            'PC의 실제 역사를 그대로 따라갑니다. 컴퓨터로 컴퓨터를 키우는 메타 감각을 끝까지 잃지 않는 것이 목표였습니다.',
          '그리고 가장 뒤집고 싶었던 것은 "운"이었습니다. 이 게임에 유료 가챠는 없습니다. 부품 등급은 뽑기가 아니라 ' +
            '환생 횟수로 확정 해금되고, 15회차까지 매 회차 새로운 부품이 열리도록 매트릭스를 설계했습니다. ' +
            '운이 아니라 성취가 쌓이는 키우기를 만들고 싶었습니다.',
        ],
        en: [
          'For my second game I wanted to make something that lives in your pocket, not another browser puzzle. Idle tycoon games ' +
            'were dominating the revenue charts at the time, and the more I pulled the successful ones apart, the clearer one formula ' +
            'became: paid gacha, a fantasy setting, and rebirths that just add zeroes. Keep the proven fun, but flip that formula — that was the starting point.',
          'The answer to "so what do you raise, then?" turned out to be right in front of me. If Folder Escape was the experiment ' +
            '"Windows UI = the game board," this one is "the computer = the character." You start on a 1980s IBM PC and swap parts ' +
            'across 40 years of eras all the way to quantum computers, while income activities follow real PC history: typing gigs → ' +
            'word processing → video editing → coin mining → selling AI models. The goal was to never lose that meta feeling of raising a computer on a computer.',
          'The thing I most wanted to overturn was luck. There is no paid gacha here. Part tiers are not drawn — they unlock ' +
            'deterministically by rebirth count, and I designed the matrix so that every run up to the 15th opens something new. ' +
            'I wanted progression built on achievement, not on chance.',
        ],
      },
      statement: {
        ko: [
          '모든 시스템이 "컴퓨터"라는 단 하나의 메타포로 묶여 있다는 점을 보여주고 싶습니다. 가챠 대신 부품 카드, ' +
            '보스 대신 블루스크린, 미니게임도 코드 타이핑과 쿨러 팬 돌리기입니다. 화면 자체가 모니터이고, ' +
            '세대가 바뀌면 DOS → Win95 → XP → 홀로그램으로 OS와 폰트, 사운드까지 통째로 진화합니다.',
          '가벼운 겉모습 아래에 깊이를 숨겨 두려 했습니다. 6종 부품은 각자 딱 하나의 역할만 갖고(RAM은 작업 슬롯, ' +
            'CPU는 속도, GPU는 전용 슬롯…), 티어가 안 맞으면 차단되거나 효율이 깎이고 완벽 호환이면 130%가 되는 ' +
            '호환성 퍼즐이 조합의 재미를 만듭니다. 수익 활동은 안정형·변동형·로또형 3축으로 나뉘고, 리더보드도 ' +
            '자산·효율·잔고 3분할이라 플레이스타일마다 1위가 따로 있습니다.',
          '그리고 "만드는 것"만큼 "다듬는 것"을 보여주고 싶습니다. 세대별 클리어 시간을 부품 풀세트 + 활동 2개 기준으로 ' +
            '재정렬한 페이싱 리밸런싱, 뽑기부터 시대 진행까지 확률 전면 공개(안내 모달 6종), 강제 인터스티셜 0건의 ' +
            '보상형 광고 설계까지 — 방치형은 설계한 숫자가 곧 유저의 경험이 되는 장르라, 밸런스 시트와 씨름한 흔적이 ' +
            '게임 곳곳에 남아 있습니다.',
        ],
        en: [
          'I want to show that every system hangs off a single metaphor: the computer. Part cards instead of gacha, blue screens ' +
            'instead of bosses, and minigames that are code typing and spinning a cooler fan. The screen itself is a monitor, and ' +
            'when a generation turns over, the OS, fonts and sounds all evolve together: DOS → Win95 → XP → holograms.',
          'Under the light exterior I tried to hide real depth. Each of the six part types has exactly one role (RAM is work slots, ' +
            'the CPU is speed, the GPU is a dedicated slot…), and mismatched tiers get blocked or lose efficiency while a perfect ' +
            'match reaches 130% — a compatibility puzzle that makes the combinations fun. Income activities split into stable, ' +
            'volatile and lottery types, and the leaderboard is split three ways (assets, efficiency, balance), so each playstyle has its own #1.',
          'And I want to show the polishing as much as the building: pacing rebalanced so each generation’s clear time assumes a full ' +
            'part set plus two activities, every probability disclosed from draws to era progression (six explainer modals), and a ' +
            'rewarded-ad design with zero forced interstitials. In idle games the numbers you design *are* the player’s experience, so ' +
            'the traces of wrestling with balance sheets are everywhere.',
        ],
      },
      devComment: {
        ko: [
          '이 게임에서 가장 어려웠던 결정들은 기능을 더하는 쪽이 아니라 빼는 쪽이었습니다. 블루스크린과 DDoS 인시던트는 ' +
            'PC 정서를 살리는 장치라 애착이 컸지만, 방치형의 페이스를 끊고 손해를 주는 이벤트는 결국 이탈로 이어진다고 ' +
            '판단해 잠정 중단했습니다. 대신 클리어하면 버프를 주는 보상형 쿨링 미니게임으로 방향을 틀었고, ' +
            '기존 인프라는 코드에 보존해 두었습니다. 언젠가 더 나은 형태로 복원할 생각입니다.',
          '후반 성장에 걸어 둔 속도 상한도 그랬습니다. 안전장치로 넣어 둔 상한이 오히려 "효율을 올렸는데 수익이 그대로"라는 ' +
            '불쾌함을 만들고 있었고, 결국 상한을 폐기하고 최소 작업 시간 하나만 안전망으로 남겼습니다. ' +
            '방치형에서는 상수 하나가 곧 유저의 하루라는 것을 이 게임을 만들며 배웠습니다.',
          '기획서 첫 장을 쓴 지 한 달이 채 안 되어 Flick × KRAFTON 공모전 출품 빌드를 마감했습니다. 짧은 기간에 ' +
            '완성도를 끌어올릴 수 있었던 건 수익 공식과 컨벤션을 단일 문서로 관리하며 AI 페어 프로그래밍으로 개발한 ' +
            '덕분이었고, 이 작업 방식 자체도 이 프로젝트의 큰 수확이라고 생각합니다.',
        ],
        en: [
          'The hardest decisions in this game were about removing features, not adding them. I was attached to the blue-screen and ' +
            'DDoS incidents because they sold the PC atmosphere, but I judged that events which break an idle game’s pace and take ' +
            'things away from the player end in churn, so I suspended them. I pivoted to a rewarded cooling minigame that grants a ' +
            'buff on clear, and kept the old infrastructure in the code. I intend to bring it back in a better form some day.',
          'The speed cap on late-game growth was the same story. A cap I had added as a safety net was creating the unpleasant feeling ' +
            'of "I raised my efficiency and my income did not move," so I scrapped it and left only a minimum work time as the safety ' +
            'net. Making this game taught me that in an idle game a single constant *is* a day of the player’s life.',
          'I shipped the Flick × KRAFTON contest build less than a month after writing the first page of the design doc. What made that ' +
            'possible was keeping the income formulas and conventions in a single document and developing through AI pair programming — ' +
            'and I consider that workflow itself one of the big takeaways from this project.',
        ],
      },
      versions: [
        {
          version: 'v0.3',
          date: { ko: '개발 중', en: 'In development' },
          title: { ko: '후반 성장 개편', en: 'Late-game growth rework' },
          changes: {
            ko: [
              '작업 속도 상한 폐기 — 후반 부품 효율 성장이 분당 수익에 끝까지 반영',
              '합성 결과물 자동 장착 — 구매와 동일한 효율 비교 룰 적용',
              '황금판 카드 모바일 스크롤 잔상 수정 + 부품 카드 수익 표기 색상 통일',
              '보상형 인시던트 확장(디스크 최적화 등) 설계 중',
            ],
            en: [
              'Work-speed cap removed — late-game part efficiency now feeds income per minute all the way up',
              'Crafted parts auto-equip, using the same efficiency comparison rule as purchases',
              'Fixed scroll ghosting on golden cards on mobile + unified income colours on part cards',
              'Designing an expansion of rewarded incidents (disk optimisation and more)',
            ],
          },
        },
        {
          version: 'v0.2',
          date: { ko: '2026.05', en: 'May 2026' },
          title: {
            ko: '캐시샵 · 배틀패스 + 페이싱 정비',
            en: 'Cash shop · battle pass + pacing pass',
          },
          current: true,
          changes: {
            ko: [
              '시즌1 배틀패스(30레벨) + 캐시샵 — 가챠 없이 가속·부스트만 판매하는 수익화 골격',
              '쿨링 보상 미니게임 — 30초 팬 회전 클리어 시 1시간 골드 +20% 버프',
              '확률 안내 모달 6종 — 뽑기·복각·합성·코드 타이퍼·활동·시대 확률 전면 공개',
              '코드 타이퍼 잭팟(탭당 0.1%, ×50) 추가 + 라인 보상 전면 재산정',
              '2~6세대 부품 가격·시대 졸업 기준 리밸런싱 — 풀세트 + 활동 2개 기준 페이싱 정렬',
              '손해형 인시던트(블루스크린·DDoS) 잠정 중단 — 보상형 전환의 시작',
            ],
            en: [
              'Season 1 battle pass (30 levels) + cash shop — a monetisation frame selling only speed-ups and boosts, no gacha',
              'Cooling reward minigame — clear 30 seconds of fan spinning for a 1-hour +20% gold buff',
              'Six probability modals — full disclosure for draws, reruns, crafting, code typer, activities and eras',
              'Code typer jackpot (0.1% per tap, ×50) + line rewards fully recalculated',
              'Rebalanced gen 2–6 part prices and era graduation thresholds — pacing aligned to a full part set plus two activities',
              'Punishing incidents (blue screen, DDoS) suspended — the start of the shift to rewarded events',
            ],
          },
        },
        {
          version: 'v0.1',
          date: { ko: '2026.05', en: 'May 2026' },
          title: { ko: 'Flick 출품 빌드', en: 'Flick contest build' },
          changes: {
            ko: [
              'Flick × KRAFTON Casual Game Challenge SEASON 01 출품',
              '일일 6종 / 주간 3종 퀘스트 + 보상 인벤토리 + 시간제 버프 시스템',
              '도전과제 11종 — 보상은 전부 환생 화폐 TP로 지급',
              '한국어/영어 로컬라이제이션 + Android 릴리스 서명 빌드',
              '오프라인 수익 50% 모델 + 백그라운드 알림(Doze 지연 우회)',
            ],
            en: [
              'Entered the Flick × KRAFTON Casual Game Challenge SEASON 01',
              '6 daily / 3 weekly quests + reward inventory + timed buff system',
              '11 achievements — all rewards paid in TP, the rebirth currency',
              'Korean/English localisation + a signed Android release build',
              '50% offline income model + background notifications (working around Doze delays)',
            ],
          },
        },
        {
          version: 'v0.0',
          date: { ko: '2026.04', en: 'Apr 2026' },
          title: { ko: '컨셉 & 코어 루프', en: 'Concept & core loop' },
          changes: {
            ko: [
              '기획서 작성 — 7세대 시대 구조 · 부품 호환성 매트릭스 · 환생 TP 경제 설계',
              'Unity 대신 웹 스택(React + Capacitor) 채택 — Folder Escape의 웹 노하우 재사용',
              '환생 + Tech Tree + 부품 등급/황금판 + 도감 + 박물관 + 3분할 리더보드 코어 구현',
            ],
            en: [
              'Wrote the design doc — 7-generation era structure · part compatibility matrix · rebirth TP economy',
              'Chose a web stack (React + Capacitor) over Unity — reusing the web know-how from Folder Escape',
              'Core implementation: rebirth + tech tree + part tiers/golden cards + codex + museum + three-way leaderboard',
            ],
          },
        },
      ],
    },
  },
  {
    id: 'floppy-144',
    title: { ko: 'Floppy-144', en: 'Floppy-144' },
    tagline: { ko: '1.44MB 공모전 출품작', en: 'A 1.44MB game jam entry' },
    description: {
      ko:
        '게임 전체를 플로피 디스크 한 장 용량, 단 1.44MB 안에 담아야 하는 "1.44MB 공모전" 출품작입니다. ' +
        '용량 제한이라는 극한의 제약 속에서 아이디어를 압축해 내는 게임으로, 현재 제작 중입니다.',
      en:
        'An entry for the "1.44MB" jam, where the entire game has to fit inside a single floppy disk — just 1.44MB. ' +
        'A game about compressing ideas under an extreme size constraint. Currently in production.',
    },
    platform: 'pc',
    icon: floppy144Icon,
    playUrl: '',
    year: '2026',
  },
];

/* ---------- 현재 언어로 풀어서 내보내기 ---------- */

function platformLabel(p: GamePlatform): string {
  return p === 'pc' ? TX.platformPc : TX.platformMobile;
}

function localizeDetails(d: RawDetails): GameDetails {
  return {
    github: d.github,
    facts: d.facts.map((f) => ({ label: s(f.label), value: s(f.value) })),
    awards: sl(d.awards),
    background: sl(d.background),
    statement: sl(d.statement),
    devComment: d.devComment && sl(d.devComment),
    versions: d.versions.map((v) => ({
      version: v.version,
      date: s(v.date),
      title: s(v.title),
      changes: sl(v.changes),
      current: v.current,
    })),
  };
}

export const GAMES: GameEntry[] = RAW_GAMES.map((g) => ({
  id: g.id,
  title: s(g.title),
  tagline: s(g.tagline),
  description: s(g.description),
  platform: g.platform,
  platformLabel: platformLabel(g.platform),
  icon: g.icon,
  playUrl: g.playUrl,
  downloadUrl: g.downloadUrl,
  youtube: g.youtube && { url: g.youtube.url, label: s(g.youtube.label) },
  year: g.year,
  details: g.details && localizeDetails(g.details),
}));
