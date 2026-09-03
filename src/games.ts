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
    tagline: { ko: '파일 탐색기 퍼즐 게임', en: 'A file explorer puzzle game' },
    description: {
      ko:
        '평범한 파일 탐색기인 줄 알았던 창 안에 스틱맨이 갇혔습니다. ' +
        '폴더를 열고 파일을 옮기고 탐색기의 기능을 거꾸로 이용해 탈출하는 퍼즐 게임입니다.',
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
          value: { ko: '1인 개발 · 2026.03부터 개발 중', en: 'Solo · Mar 2026 – in development' },
        },
        {
          label: { ko: '분량', en: 'Length' },
          value: {
            ko: '튜토리얼 + 본편 25개 스테이지 (60~80분)',
            en: 'Tutorial + 25 main stages (60–80 min)',
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
          'BIC Festival 2026 루키 부문 출품 (2026.06) · 온라인 전시와 현장 전시 (2026.08)',
        ],
        en: [
          'BIC Festival 2026, Rookie Division — Excellence in Experimental, WINNER (Aug 2026)',
          'BIC Festival 2026, Rookie Division — Excellence in Casual, FINALIST (Aug 2026)',
          'Submitted to BIC Festival 2026, Rookie Division (Jun 2026) · online and on-site exhibition (Aug 2026)',
        ],
      },
      background: {
        ko: [
          '남들이 해 보지 않은 색다른 아이디어로 인디 게임을 만들고 싶었습니다. ' +
            '잘 다듬어진 익숙한 장르도 좋지만, "이런 걸 게임으로?" 싶은 낯선 지점에서 출발하고 싶다는 마음이 컸습니다.',
          '그러던 어느 날, 켜 두고 쓰던 파일 탐색기를 무심코 바라보다 문득 "어, 기능이 꽤 많은데?" 하는 생각이 들었습니다. ' +
            '이름 바꾸기, 확장자 변경, 보기 방식 전환, 숨긴 항목 표시, 검색처럼 ' +
            '매일 쓰면서도 재미라는 관점에서는 한 번도 바라본 적 없던 기능들이 거기에 있었습니다.',
          '이 기능들을 퍼즐의 도구로 쓰면 탐색기 그 자체를 방탈출로 만들 수 있지 않을까? ' +
            '그렇게 시작한 작은 아이디어에 중력, 음악, 시간, 전력 같은 콘셉트를 하나씩 엮어 나가면서 지금의 게임이 만들어졌습니다.',
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
          '"익숙한데 낯설다"가 이 게임의 정체성입니다. 판타지 세계관도, 새로 만들어 낸 조작 체계도 없이, ' +
            '누구나 아는 파일 탐색기가 그대로 퍼즐의 무대가 됩니다. 설명하지 않아도 직관이 먼저 작동하고, ' +
            '곧이어 "이게 퍼즐이 된다고?" 하는 반전이 찾아오는 경험을 만들고 싶었습니다.',
          '새 규칙을 외우게 하는 대신, F2로 이름 바꾸기, 확장자 변경, 보기 방식 전환처럼 이미 손에 익은 동작이 ' +
            '그대로 퍼즐의 해법이 되도록 만들었습니다. 같은 파일이라도 아이콘 뷰와 목록 뷰에서 물리 법칙이 다르게 작동하는, ' +
            '"보는 방식이 세계를 바꾼다"는 이 게임만의 메카닉을 보여주고 싶습니다.',
          '그리고 혼자만의 답에 갇히지 않으려 합니다. 첫 데모에서 "참신한데 막상 해 보면 불편하다"는 피드백을 받은 뒤로, ' +
            '새 스테이지를 완성할 때마다 다른 분들께 테스트를 부탁해 낯섦이 불편함으로 변질되는 지점을 찾아 다듬고 있습니다. ' +
            '정체성은 지키되, 플레이어와 합의점을 찾아 가며 개발하려고 합니다.',
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
            '고민이 생겼습니다. 실제로 기본 로직을 더 많이 활용했으면 좋겠다는 피드백도 있었습니다.',
          '그래서 기본 로직을 발전시킨 버전도 많이 만들어 봤지만, 게임을 기본 로직으로만 채우니 ' +
            '자가 복제라는 느낌을 피할 수가 없었고, 이 게임의 정체성을 어디에 두어야 하는지 오래 고민했습니다.',
          '결국 고민만 이어 가는 대신, 기존 규칙을 크게 깨지 않는 선에서 떠오르는 아이디어들을 ' +
            '하나의 실험실처럼 구현해 보기로 했고, 그렇게 지금의 모습이 되었습니다.',
          '대신 "새로운 로직이 도입만 되고 다시 안 쓰인다"는 피드백에는 새로운 구조로 답했습니다. 스테이지를 ' +
            '「도입 4개 + 종합 1개」의 5단위 블록으로 끊고, 다섯 번째 자리에는 신규 로직이 없는 ' +
            '압축 파일(.zip) 스테이지를 둡니다. 앞의 네 스테이지에서 배운 로직만으로 구성한 ' +
            '복습 관문이라, 익힌 내용을 한 번 더 쓰게 됩니다.',
          '이 게임이 하나의 실험실인 만큼, 저 혼자만의 생각으로 만들어 가기보다는 테스트를 진행해 주시는 ' +
            '여러분 한 분 한 분이 연구원이 되어 주셨으면 합니다. 보내 주시는 피드백으로 ' +
            '이 게임을 함께 만들어 가고 싶습니다.',
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
          version: 'v0.8',
          date: { ko: '2026.08', en: 'Aug 2026' },
          title: { ko: '스테이지 25개로 확장', en: 'Expanded to 25 stages' },
          current: true,
          changes: {
            ko: [
              '스테이지를 두 개 추가해서 전체 25개 스테이지로 확장',
              '신규 종합 스테이지 「FamilyAlbum.zip」(Stage 15): 앞선 네 스테이지를 하나로 합친 zip 스테이지로 완성',
              '신규 스테이지 「MultiWindow」(Stage 25): 바로가기가 다른 창으로 통하는 포털이 되는 다중 창 퍼즐',
              '2단계 힌트를 토큰 방식으로 변경: 처음에 한 번 주어지고, zip 스테이지를 클리어할 때마다 한 번씩 충전',
              '메모장(.txt)으로 파라미터를 편집할 때 저장 단계를 거치도록 바꿔서, 수정한 값이 언제 적용되는지 분명하게 표시',
              '남아 있던 이모지 아이콘을 모두 SVG로 교체하고, 도전과제 전용 배지 세트를 추가',
              '캐릭터가 이동하는 동안 들어온 명령은 무시하도록 수정',
              '게임 안에 나오는 한국어 문구를 전반적으로 다시 정리',
            ],
            en: [
              'Two more stages, bringing the game to 25 stages in total',
              'New synthesis stage "FamilyAlbum.zip" (Stage 15): a zip stage that folds the previous four stages into one',
              'New stage "MultiWindow" (Stage 25): a multi-window puzzle where shortcuts become portals into other windows',
              'Second-tier hints now run on tokens: one to start with, and one more every time you clear a zip stage',
              'Editing parameters in Notepad (.txt) now goes through an explicit save step, so it is clear when a value takes effect',
              'Every remaining emoji icon replaced with SVG, plus a dedicated badge set for achievements',
              'Commands issued while the character is moving are now ignored',
              'A full pass over the Korean player-facing copy',
            ],
          },
        },
        {
          version: 'v0.7',
          date: { ko: '2026.08', en: 'Aug 2026' },
          title: { ko: 'BIC 현장 전시 & 피드백 반영', en: 'BIC on-site build & feedback pass' },
          changes: {
            ko: [
              '부스 회전율을 고려해 스테이지 10개짜리 현장 데모 빌드로 전시했고, 전시가 끝난 뒤에는 본편(전체 스테이지, 도전과제 23종)으로 복귀',
              '모든 스테이지에서 이름 바꾸기가 대소문자를 구분하지 않도록 통일: 현장에서 관람객이 가장 많이 막히던 부분',
              '튜토리얼에 스포트라이트 인트로를 추가하고, 진행이 막히는 소프트락 경로를 차단',
              '되돌리기의 기준 위치를 파일 id에 고정하고, 기차가 탈선하면 되돌리기를 종료하도록 수정',
              '오르골 창을 8×8 체스판으로 개편하고, 잠긴 출구를 이름으로 여는 열쇠 스테이지를 정비',
              '보기(View) 메뉴를 개방하고, 붙여넣을 수 있는 자리를 끊긴 다리 아이콘으로 표시',
              'Tauri 기반 데스크톱 빌드를 추가',
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
              '스테이지를 「도입 4 + 종합 1」의 5단위 블록으로 재편: 앞에서 배운 조작을 반드시 다시 쓰게 되는 구조',
              '신규 종합 스테이지 「Junction.zip」과 「Roundhouse.zip」 추가: 새로운 조작 없이 앞선 네 스테이지를 통합한 중간 보스 성격의 퍼즐',
              '신규 스테이지 「Defrag」 추가: 디스크 조각 모음을 소재로 삼은 퍼즐',
              '도전과제 22종과 블루스크린 연출을 추가',
              '모든 스테이지에 2단계 힌트를 추가하고, 튜토리얼에서 힌트 시스템을 안내',
              '편집 메뉴에서 복사와 붙여넣기를 개방하고(잘라내기는 폐기), 되돌리기가 적용되는 범위를 확대',
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
              '반복 재생되는 BGM 시스템을 추가하고, 볼륨 설정을 저장하도록 변경',
              '한국어와 영어를 지원하는 언어 시스템을 추가',
              '음계탑 스테이지를 "멜로디를 따라 걷는" 방식으로 개편',
              'Ctrl·Shift 다중 선택과 일괄 이름 바꾸기를 지원',
              '신규 스테이지 「메신저」 추가: 유품 상자에 담긴 단서를 교차 참조하는 암호 퍼즐',
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
              '시작 화면과 진행도 저장(이어하기) 시스템을 추가',
              '신규 스테이지: 검색 길 찾기 · 숨김 발판 · 전력 회로 · 고양이 추격',
              '전력 회로를 회전 파이프 방식으로 개편',
              '데모의 최종 스테이지를 클리어하면 재생되는 엔딩을 추가',
              'BIC Festival 2026 루키 부문에 출품',
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
              '튜토리얼을 직접 조작해 보며 익히는 방식으로 개편하고, WASD 이동을 지원',
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
              '전체 구조를 서비스 레이어 방식으로 리팩토링',
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
        '1980년대 IBM PC에서 시작해 부품을 갈아 끼우며 시대를 넘어가는 방치형 게임입니다. ' +
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
          value: { ko: '1인 개발 · 2026.04부터 개발 중', en: 'Solo · Apr 2026 – in development' },
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
          '두 번째 게임으로는 브라우저 퍼즐이 아니라, 매일 주머니에 넣고 다니는 모바일 게임을 만들어 보고 싶었습니다. ' +
            '마침 방치형 키우기 장르가 매출 상위권을 휩쓸던 시기였는데, 성공작들을 뜯어볼수록 하나의 공식이 보였습니다. ' +
            '유료 가챠, 판타지 세계관, 그리고 숫자에 0만 붙는 환생이었습니다. ' +
            '검증된 재미는 가져오되 이 공식만 정반대로 뒤집어 보면 어떨까 하는 생각이 출발점이었습니다.',
          '"그래서 무엇을 키울 것인가"에 대한 답은 의외로 가까이 있었습니다. Folder Escape가 "Windows UI = 게임판"이라는 ' +
            '실험이었다면, 이번에는 "컴퓨터 = 캐릭터"입니다. 플레이어는 1980년대 IBM PC에서 시작해 부품을 갈아 끼우며 ' +
            '양자컴퓨터까지 40년의 시간을 건너가고, 수익 활동도 타이핑 알바 → 워드 작업 → 영상 편집 → 코인 채굴 → AI 모델 판매로 ' +
            'PC의 실제 역사를 그대로 따라갑니다. 컴퓨터로 컴퓨터를 키우는 메타 감각을 끝까지 잃지 않는 것이 목표였습니다.',
          '그리고 가장 뒤집고 싶었던 것은 "운"이었습니다. 이 게임에 유료 가챠는 없습니다. 부품 등급은 뽑기가 아니라 ' +
            '환생 횟수에 따라 확정적으로 해금되고, 15회차까지 매 회차 새로운 부품이 열리도록 매트릭스를 설계했습니다. ' +
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
          '가벼운 겉모습 아래에 깊이를 숨겨 두려 했습니다. 부품 6종은 각자 하나의 역할만 맡습니다(RAM은 작업 슬롯, ' +
            'CPU는 속도, GPU는 전용 슬롯…). 여기에 티어가 맞지 않으면 장착이 막히거나 효율이 깎이고, 완벽하게 호환되면 ' +
            '효율이 130%까지 오르는 호환성 퍼즐이 더해져 부품을 조합하는 재미가 생깁니다. 수익 활동은 안정형·변동형·로또형 ' +
            '세 갈래로 나뉘고, 리더보드도 자산·효율·잔고 세 갈래로 나뉘어 있어서 플레이 스타일마다 1위가 따로 정해집니다.',
          '그리고 "만드는 것"만큼 "다듬는 것"을 보여주고 싶습니다. 세대별 클리어 시간을 부품 풀세트 + 활동 2개 기준으로 ' +
            '재정렬한 페이싱 리밸런싱, 뽑기부터 시대 진행까지 확률을 전면 공개한 안내 모달 6종, 강제 인터스티셜을 ' +
            '0건으로 맞춘 보상형 광고 설계까지 손을 봤습니다. 방치형은 설계한 숫자가 곧 유저의 경험이 되는 장르이기 때문에, ' +
            '밸런스 시트와 씨름한 흔적이 게임 곳곳에 남아 있습니다.',
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
          '후반 성장에 걸어 둔 속도 상한도 그랬습니다. 안전장치로 넣어 둔 상한이 오히려 "효율을 올렸는데 수익은 그대로"라는 ' +
            '불쾌감을 주고 있었고, 결국 상한을 폐기하고 최소 작업 시간 하나만 안전망으로 남겼습니다. ' +
            '방치형에서는 상수 하나가 유저의 하루를 좌우한다는 것을 이 게임을 만들면서 배웠습니다.',
          '기획서 첫 장을 쓴 지 한 달이 채 안 되어 Flick × KRAFTON 공모전 출품 빌드를 마감했습니다. 짧은 기간에 ' +
            '완성도를 끌어올릴 수 있었던 것은 수익 공식과 작성 규칙을 단일 문서로 관리하면서 AI 페어 프로그래밍으로 ' +
            '개발한 덕분이었고, 이 작업 방식 자체도 이 프로젝트에서 얻은 큰 수확이라고 생각합니다.',
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
              '작업 속도 상한을 폐기해서, 후반 부품의 효율 성장이 분당 수익에 끝까지 반영되도록 변경',
              '합성한 부품을 자동으로 장착하도록 변경: 구매할 때와 동일한 효율 비교 규칙을 적용',
              '모바일에서 황금판 카드에 남던 스크롤 잔상을 수정하고, 부품 카드의 수익 표기 색상을 통일',
              '보상형 인시던트(디스크 최적화 등)를 확장하는 방향으로 설계하는 중',
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
            ko: '캐시샵과 배틀패스, 페이싱 정비',
            en: 'Cash shop · battle pass + pacing pass',
          },
          current: true,
          changes: {
            ko: [
              '시즌1 배틀패스(30레벨)와 캐시샵을 추가: 가챠 없이 가속과 부스트만 판매하는 수익화 구조',
              '쿨링 보상 미니게임을 추가: 30초 동안 팬을 돌려 클리어하면 한 시간 동안 골드 획득량이 20% 증가',
              '확률 안내 모달 6종을 추가해서 뽑기·복각·합성·코드 타이퍼·활동·시대의 확률을 전면 공개',
              '코드 타이퍼에 잭팟(탭당 0.1%, 보상 50배)을 추가하고, 라인 보상을 전면 재산정',
              '2~6세대 부품 가격과 시대 졸업 기준을 리밸런싱: 부품 풀세트와 활동 2개를 기준으로 페이싱을 정렬',
              '손해를 입히는 인시던트(블루스크린·DDoS)를 잠정 중단: 보상형으로 전환하는 첫 단계',
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
              'Flick × KRAFTON Casual Game Challenge SEASON 01에 출품',
              '일일 퀘스트 6종과 주간 퀘스트 3종, 보상 인벤토리, 시간제 버프 시스템을 추가',
              '도전과제 11종을 추가하고, 보상은 모두 환생 화폐인 TP로 지급',
              '한국어와 영어 로컬라이제이션을 적용하고, Android 릴리스 서명 빌드를 준비',
              '오프라인 수익을 50%로 지급하는 모델과 백그라운드 알림(Doze 지연 우회)을 구현',
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
              '기획서를 작성하면서 7세대 시대 구조, 부품 호환성 매트릭스, 환생 TP 경제를 설계',
              'Unity 대신 웹 스택(React + Capacitor)을 채택: Folder Escape에서 쌓은 웹 개발 경험을 재사용',
              '환생, 테크 트리, 부품 등급과 황금판, 도감, 박물관, 3분할 리더보드 등 코어 시스템을 구현',
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
    title: { ko: '플로피 (FLOPPY)', en: 'FLOPPY' },
    tagline: { ko: '1.44MB 공모전 출품작', en: 'A 1.44MB game jam entry' },
    description: {
      ko:
        '"1.44MB 공모전 출품작"으로서 공모전 자체에 영감을 받아, 플레이어의 몸이 곧 인벤토리이며 ' +
        '능력과 화물을 싣고 총 14건의 배달을 진행합니다. 자리에서 움직이지 못하는 기계들의 사연과 편지를 ' +
        '서로 전달해 주는 역할을 하는 탑다운 배달 서사 게임입니다. ' +
        '게임 안에서 들고 다닐 수 있는 용량과 게임 자체의 용량 모두 1.44MB로 제한됩니다.',
      en:
        'An entry for the "1.44MB" contest, inspired by the contest itself: your body is your inventory, ' +
        'you load abilities and cargo, and you make 14 deliveries in all. A top-down narrative delivery game ' +
        'about carrying the stories and letters of machines that can never leave their spot. ' +
        'Both what you can carry in the game and the game itself are capped at 1.44MB.',
    },
    platform: 'pc',
    icon: floppy144Icon,
    playUrl: '',
    downloadUrl: '/floppy-144.zip',
    year: '2026',
    details: {
      facts: [
        {
          label: { ko: '장르', en: 'Genre' },
          value: {
            ko: '탑다운 실시간 액션 · 유한 캠페인 (배달 14건, 20~30분)',
            en: 'Top-down real-time action · finite campaign (14 deliveries, 20–30 min)',
          },
        },
        {
          label: { ko: '플랫폼', en: 'Platform' },
          value: {
            ko: 'PC — Windows 10/11 (64비트) 단독 실행 파일, 설치·런타임 불필요',
            en: 'PC — Windows 10/11 (64-bit) standalone executable, no installer or runtime',
          },
        },
        {
          label: { ko: '개발', en: 'Development' },
          value: {
            ko: '1인 개발 · 2026.07.15 – 2026.09.04 (7주)',
            en: 'Solo · Jul 15 – Sep 4, 2026 (7 weeks)',
          },
        },
        {
          label: { ko: '용량', en: 'Size' },
          value: {
            ko: '1.28MB — 그래픽·글꼴·음악·효과음 전부 포함 (한도 1.44MB)',
            en: '1.28MB — graphics, font, music and SFX included (limit 1.44MB)',
          },
        },
        {
          label: { ko: '기술', en: 'Tech' },
          value: {
            ko: 'C · Win32 API · 자작 소프트웨어 렌더러 · waveOut 믹서 · 384×216 ×3',
            en: 'C · Win32 API · hand-written software renderer · waveOut mixer · 384×216 ×3',
          },
        },
        {
          label: { ko: '지원 언어', en: 'Languages' },
          value: { ko: '한국어', en: 'Korean' },
        },
      ],
      awards: {
        ko: ['2P GAME ARCADE "1.44MB GAME_DEV CONTEST" 출품 (2026.09)'],
        en: ['Submitted to the 2P GAME ARCADE "1.44MB GAME_DEV CONTEST" (Sep 2026)'],
      },
      background: {
        ko: [
          '"압축 해제 후 1.44MB 이하. 실행 파일과 런타임 전부 포함." 공모전 규정을 처음 읽었을 때, ' +
            '용량 제한이 제약이 아니라 소재로 보였습니다. 게임 자체가 플로피 한 장에 들어가야 한다면 ' +
            '주인공도 플로피 한 장이어야 하지 않을까. 그리고 그 플로피를 플레이어로 사용한다면, ' +
            '용량을 단순한 숫자가 아니라 게임의 핵심 로직으로 사용할 수 있지 않을까?',
          '"주인공은 플로피"라는 발상은 이 공모전에서 누구나 떠올릴 법한 컨셉이라는 것도 알고 있었습니다. ' +
            '그래서 차별점을 컨셉이 아니라 시스템에 두기로 했습니다. 배달 화물과 능력 파일이 같은 1440KB를 나눠 쓰고, ' +
            '세 번 피격되면 최대 용량이 영구히 줄어듭니다. 잃는 것은 점수가 아니라 용량 그 자체입니다.',
          '1.44MB라는 작은 용량으로 게임을 만드는 게 생소했으나 재밌는 도전으로 느껴져 C로 시도해 보았고, ' +
            '첫 주에 Win32 렌더러로 구현해 보니 104KB라는 작은 값이 나왔습니다. "이거 가능하겠다"라는 생각과 함께 ' +
            '7주짜리 작은 도전이 시작됐습니다.',
        ],
        en: [
          '"1.44MB or less after extraction, executable and runtime included." When I first read the contest rules, ' +
            'the size limit looked less like a constraint and more like a premise. If the whole game has to fit on one floppy, ' +
            'shouldn’t the protagonist be a floppy too? And if that floppy is the player, couldn’t capacity be the core ' +
            'logic of the game rather than just a number?',
          'I also knew that "the hero is a floppy" is the concept everyone in this contest would think of. So I put the ' +
            'difference in the systems instead: delivery cargo and ability files share the same 1440KB, and three hits ' +
            'permanently shrink your maximum capacity. What you lose is not a score — it is capacity itself.',
          'Making a game in just 1.44MB was unfamiliar, but it felt like a fun challenge, so I tried it in C. In the first ' +
            'week a Win32 renderer came out at only 104KB, and with the thought "this could actually work," a small ' +
            'seven-week challenge began.',
        ],
      },
      statement: {
        ko: [
          '"용량이 곧 핵심 로직이고, 능력이고, 점수다"라는 통합이 이 게임의 뼈대입니다. 대시·도약·펄스·보호막 같은 ' +
            '아이템들이 각각 96KB, 128KB, 220KB, 340KB짜리 파일이라 전부 들게 되면 폐품을 주울 수 없거나 너무 무거워져서 ' +
            '기동성이 떨어지고, 이 때문에 다음 의뢰서에 적힌 화물 크기를 보고 무엇을 싣고 무엇을 버릴지 미리 정해야 합니다. ' +
            '길에서 주운 회수품은 팔면 돈이 되지만 들고 있는 동안은 짐일 뿐이라, 욕심을 부릴수록 위험해지는 구조를 ' +
            '용량 하나로 만들고 싶었습니다.',
          '기억도 같은 규칙 위에 얹었습니다. 배달을 마친 의뢰서는 자동으로 지워지지만, 이야기의 전환점 이후에는 1KB를 내고 ' +
            '기록으로 남길 수 있습니다. 남긴 기억은 정해진 위험 하나를 구간마다 한 번 막아 주고, 마지막 화면에는 그 기억들이 ' +
            'DIR A:\\ 목록으로 그대로 찍혀 나옵니다. 배드섹터로 잃은 자리는 ?????.??? [BAD]라는 빈칸으로 남습니다. ' +
            '"내가 나른 것들이, 곧 내가 된다"는 문장을 시스템으로 보여주고 싶었습니다.',
        ],
        en: [
          '"Capacity is the core logic, the abilities and the score" — that unity is the backbone of this game. Items like ' +
            'dash, jump, pulse and shield are files of 96KB, 128KB, 220KB and 340KB, so carrying them all means you cannot ' +
            'pick up salvage, or you get so heavy that you lose mobility. That is why you have to read the cargo size on the ' +
            'next request and decide in advance what to load and what to drop. Salvage picked up on the road sells for money ' +
            'but is just baggage while you carry it — I wanted greed to turn into danger through capacity alone.',
          'Memory sits on the same rule. A finished request is deleted automatically, but after the turning point you can pay 1KB ' +
            'to keep it as a record. A kept memory blocks one specific hazard once per leg, and the final screen is a DIR A:\\ ' +
            'listing where those memories are printed exactly as they are. Slots lost to bad sectors show up as ?????.??? [BAD] — ' +
            'holes in the list. I wanted the line "what I carried became who I am" to be a system, not just a sentence.',
        ],
      },
      devComment: {
        ko: [
          '세계관은 "기계들의 세상, 사람은 없다"로 잡았습니다. 기계는 평생 한 자리에 설치되어 있고 저장 매체만 움직일 수 있어서, ' +
            '플로피가 이 세상의 우편배달부가 됩니다. 옆방인데 한 번도 만난 적 없는 사이, 전원이 꺼지면 사라지는 기억, ' +
            '폐기 전에 남기는 백업 같은 기계의 특성을 사람의 이야기로 옮기되, "기계를 사람으로 바꿔 읽어도 성립하면 통과"라는 ' +
            '기준으로 각각 이야기의 짧은 대본을 세웠습니다.',
          '플로피가 의뢰들을 수행하며 감정을 배워 나가는 과정을 통해 "스쳐 지나가는 모든 것들이 나를 만든다"는 ' +
            '저의 생각을 전달하고 싶었습니다. 다만 허용된 용량이 적어 많은 이야기를 적어 두지 못한 점이 아쉬워, ' +
            '언젠가는 서사가 위주가 되어 더 많은 메시지를 전달하는 내러티브 게임을 만들고 싶습니다.',
        ],
        en: [
          'The setting is "a world of machines, with no people." Machines are installed in one spot for life and only storage ' +
            'media can move, which makes a floppy the postal worker of this world. Neighbours who have never met, memory that ' +
            'vanishes when the power goes out, a backup left before disposal — I translated machine traits into human stories, ' +
            'and built each short script on one test: it passes only if it still works when you swap the machine for a person.',
          'Through a floppy that learns emotions while carrying out its requests, I wanted to convey my own belief that ' +
            '"everything that passes through me makes me who I am." My one regret is that the tiny size budget left little room ' +
            'for story, so someday I want to make a narrative-driven game that carries far more of its message.',
        ],
      },
      versions: [
        {
          version: 'v1.0',
          date: { ko: '2026.09', en: 'Sep 2026' },
          title: { ko: '공모전 제출 빌드', en: 'Contest submission build' },
          current: true,
          changes: {
            ko: [
              '도착지 9곳과 카운터, 밤거리 배경 그림 11장을 추가하고, 도착하면 대화에 앞서 무대를 잠시 보여주는 연출을 추가',
              '자석을 추적형으로 변경: 일정 범위 안에 들어오면 쫓아오고, 펄스(ZAP)에 맞으면 5초 동안 멈춘다',
              '대시(DASH)와 도약(JUMP)을 각각 10회·5회 횟수제로 변경하고, 기억의 위험 상쇄가 실제로 맞는 순간에만 발동하도록 수정',
              '10구간을 전광판을 경유하는 구조로 재편: 전반은 빈 몸으로 달리고, 전광판 도트를 만난 뒤에야 화물이 실린다',
              '회수품 36종에 이름과 한 줄 설명을 붙이고, 조작법 안내와 의뢰 단위 저장 기능을 추가',
              '마지막 배달 곡을 종소리가 울리는 송년 곡으로 교체하고, 실행 파일에 플로피디스크 아이콘을 적용',
              '최종 용량 1.28MB로 제출 (한도 1.44MB)',
            ],
            en: [
              'Eleven painted backdrops (9 destinations, the counter, the night street) + a one-beat "arrival" shot before each dialogue',
              'Magnets now chase: enter their radius and they follow; a ZAP pulse switches them off for 5 seconds',
              'DASH and JUMP switched to limited uses (10 and 5) + memory counters now fire only at the moment a hazard would hit',
              'Leg 10 rebuilt around a mid-route pickup: you run empty to the billboard and only take on cargo after meeting Dot',
              'Names and one-line descriptions for all 36 salvage files + a controls manual + per-request saving',
              'The final delivery track replaced with a New Year’s bell tune + a floppy-disk icon on the executable',
              'Submitted at 1.28MB (limit 1.44MB)',
            ],
          },
        },
        {
          version: 'v0.5',
          date: { ko: '2026.08', en: 'Aug 2026' },
          title: { ko: '소리 — 믹서와 트래커 음악', en: 'Sound — mixer & tracker music' },
          changes: {
            ko: [
              '소리가 한 번에 하나만 나서 새 소리가 앞의 소리를 끊던 문제를 매 프레임 직접 섞는 자체 믹서로 해결 (효과음 8채널 + 음악 6채널 + 환경음 2겹)',
              '샘플 기반 트래커 음악 도입: 악기 13종을 8비트 22050Hz 샘플로 담고, 카운터·동네·도시·외곽·최종·엔딩·타이틀 7곡을 작곡',
              '환경음 4종(비·바람·기계음·팬)을 서로 다른 길이로 겹쳐 반복이 눈에 띄지 않게 구성',
              '실패 화면의 버튼을 "재도전"으로, 메뉴의 "단축키"를 "조작법"으로 바꾸고 등록 카드 문구를 정리',
              '대사가 다음 줄로 넘어갈 때 타자 효과가 다시 시작하도록 수정하고, 구간 대사와 의뢰문을 다듬음',
            ],
            en: [
              'PlaySound only allowed one sound per process and cut off whatever was playing — replaced with a per-frame mixer on a single waveOut voice (8 SFX + 6 music + 2 ambient channels)',
              'Sample-based tracker music: 13 instruments baked at 8-bit 22050Hz + 7 tracks (counter, town, city, outskirts, final, ending, title)',
              'Four ambient loops (rain, wind, hum, fan) at deliberately mismatched lengths so the repeat never lines up',
              'Failure button relabelled "Retry", shortcuts renamed "Controls", registration card reworded',
              'Typing effect restarts when the line changes + a polish pass over leg dialogue and request texts',
            ],
          },
        },
        {
          version: 'v0.4',
          date: { ko: '2026.08', en: 'Aug 2026' },
          title: { ko: '이야기 완성 — 인트로부터 READ-ONLY까지', en: 'The story, start to READ-ONLY' },
          changes: {
            ko: [
              '인트로(마더의 인사 → 등록증)와 타이틀 메뉴, 엔딩의 DIR A:\\ 아카이브 화면과 READ-ONLY 마지막 장면 구현',
              '기억 보관과 위험 상쇄 5쌍 추가: 남겨 둔 의뢰서 기억이 물·먼지·열·자석·프레스를 구간마다 한 번씩 막아 준다',
              '맵을 62px 방 격자로 재설계: 모든 방을 하나로 잇고, 생성한 뒤 실제로 걸어 보게 해서 반드시 깰 수 있음을 보증',
              '카운터에 돌아가지 않고 현장에서 바로 다음 의뢰를 받는 역방향 구간(7·9·11) 추가',
              '한글이 10px 이하에서 뭉개져서 화면을 320×180에서 384×216으로 키우고 레이아웃을 재배치',
              '효과음 전면 재작업과 소리 크기 설정(톱니 버튼), 실행 파일 옆에 생기는 12바이트 세이브 파일',
              '엔딩에서 통신이 개통된 뒤 채팅이 흐르는 연출 확장, 비트맵 폰트 485자 → 565자',
            ],
            en: [
              'Intro (Mother’s greeting → registration card), title menu, the DIR A:\\ ending archive and the READ-ONLY final cut',
              'Kept memories + 5 counter pairs: a saved request blocks water, dust, heat, magnets or the press once per leg',
              'Map redesigned as a 62px room grid: linked by a spanning tree, then walked at body size after generation to guarantee it can be cleared',
              'Direct-pickup / reversed legs (7, 9, 11) that skip the counter',
              'Korean glyphs smeared below 10px, so the screen grew from 320×180 to 384×216 with a relaid layout',
              'Full SFX rework + a volume setting (gear icon) + a 12-byte save file next to the exe',
              'Post-launch chat traffic sequence extended, subset font 485 → 565 glyphs',
            ],
          },
        },
        {
          version: 'v0.3',
          date: { ko: '2026.08', en: 'Aug 2026' },
          title: { ko: '캠페인 14구간과 대화', en: '14-leg campaign & dialogue' },
          changes: {
            ko: [
              '캠페인 14구간의 뼈대 구현: 구간별 고정 의뢰, 물·프레스 위험, 폭이 다른 맵, 세로 스크롤 구간',
              '카메라 추종과 가로 4화면 너비의 맵, 목적지에 가까워질수록 색이 물드는 경로 연출',
              '대화 UI와 한글 비트맵 폰트: 글자가 뭉개지던 문제를 GDI 비트맵에서 글자를 직접 추출하는 방식으로 해결',
              '수신 기계 14종의 개별 픽셀아트와 장소 배경, 동료 배달부 마빈이 대화 장면에 나란히 등장',
              '대사 타자 효과와 기계마다 다른 말소리, 방향키·마우스로 고르는 상점 메뉴',
              '대사 상자의 순서·줄 수·폭을 한눈에 확인하는 검사 도구 추가',
            ],
            en: [
              '14-leg campaign skeleton: fixed requests, water/press hazards, variable-width maps, a vertical-scroll leg',
              'Camera follow + 4-screen-wide maps + a route gradient that tints the palette as you near the destination',
              'Dialogue UI + a Korean subset bitmap font, switched to extracting glyphs from GDI bitmap strikes',
              'Individual pixel art for all 14 receiving machines + location backdrops, Marvin appears side by side in dialogue',
              'Typing effect with per-machine voices + a cursor-driven shop menu (arrow keys or mouse)',
              'dlgmap tool that dumps dialogue box order, line counts and widths',
            ],
          },
        },
        {
          version: 'v0.2',
          date: { ko: '2026.08', en: 'Aug 2026' },
          title: { ko: '수직 슬라이스', en: 'Vertical slice' },
          changes: {
            ko: [
              '편도 1구간의 전체 흐름 구현: 의뢰 수주 → 주행 → 도착 정산',
              '장르를 실시간 탑다운 액션으로 최종 확정하고, 대안으로 두었던 턴제 격자 방식을 폐기',
            ],
            en: [
              'One full one-way leg: take a request → run the leg → settle on arrival',
              'Genre locked to real-time top-down action; the turn-based grid fallback (plan B) dropped',
            ],
          },
        },
        {
          version: 'v0.1',
          date: { ko: '2026.07', en: 'Jul 2026' },
          title: { ko: '기획과 스택 실측', en: 'Design & stack measurement' },
          changes: {
            ko: [
              '기획서와 스토리·세계관 문서 작성: 인벤토리가 곧 몸, 돌아오지 않는 편도 여정, 3타격 배드섹터',
              '직접 만든 Win32 렌더러와 raylib로 같은 프로토타입을 만들어 크기 실측 (104KB 대 785KB) → Win32 확정',
              '실측용 프로토타입을 본편 뼈대(창·루프·프레임버퍼·입력·사운드)로 발전',
            ],
            en: [
              'Design doc + story/worldbuilding doc: inventory = body, one-way chain, three-hit bad sectors',
              'Same probe written on a hand-rolled Win32 renderer and on raylib, measured 104KB vs 785KB → Win32 chosen',
              'Probe promoted to the game skeleton (window, loop, framebuffer, input, sound)',
            ],
          },
        },
      ],
    },
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
