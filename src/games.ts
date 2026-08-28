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
    title: { ko: 'Floppy-144', en: 'Floppy-144' },
    tagline: { ko: '1.44MB 공모전 출품작', en: 'A 1.44MB game jam entry' },
    description: {
      ko:
        '게임 전체를 플로피 디스크 한 장 분량인 1.44MB 안에 담아야 하는 "1.44MB 공모전" 출품작입니다. ' +
        '용량 제한이라는 극한의 조건 속에서 아이디어를 압축해 내는 게임이며, 현재 제작 중입니다.',
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
