import { s, type L } from './i18n.ts';

export const PROFILE = {
  name: 'LeeDnHe',
  github: 'https://github.com/LeeDnHe',
  email: 'dlgotn1005@gmail.com',
};

const README: L = {
  ko: `게임 개발자 이동희입니다.

이미 나와 있는 게임의 스타일을 따라가기보다는,
익숙한 것을 비틀어 게임의 로직으로 만드는 일을 좋아합니다.

지금 만들고 있는 것
  · Folder Escape — 파일 탐색기 퍼즐 게임 (PC)
  · 컴퓨터 키우기 — 방치형 키우기 게임 (모바일)
  · Floppy-144 — 1.44MB 용량 제한 액션 로그라이트 (PC - 개발 중)
  · Folder Memory — 메타 반전 내러티브 게임 (PC - 기획 중)

연락처
  · GitHub  github.com/LeeDnHe
  · Email   ${PROFILE.email}

이 사이트도 하나의 작은 게임처럼 즐겨주세요 :)`,

  en: `I'm Donghee Lee, a game developer.

Rather than following the style of games that already exist,
I like twisting the familiar until it becomes game logic.

What I'm working on
  · Folder Escape — a file explorer puzzle game (PC)
  · Boot Tycoon — an idle tycoon game (Mobile)
  · Floppy-144 — a 1.44MB size-limited action roguelite (PC - in development)
  · Folder Memory — a meta-twist narrative game (PC - in design)

Contact
  · GitHub  github.com/LeeDnHe
  · Email   ${PROFILE.email}

Please enjoy this site as a small game of its own :)`,
};

export const README_TEXT = s(README);
