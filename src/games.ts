export interface GameEntry {
  /** 폴더명이자 URL 경로 조각 */
  id: string;
  title: string;
  tagline: string;
  description: string;
  /** 실제 게임이 배포된 주소. 비어 있으면 "개발 중" 처리 */
  playUrl: string;
  year: string;
}

export const GAMES: GameEntry[] = [
  {
    id: 'file-escape',
    title: 'File Escape',
    tagline: '파일탐색기 퍼즐 게임',
    description:
      '평범한 파일탐색기인 줄 알았던 창 안에 갇힌 스틱맨. ' +
      '폴더를 열고, 파일을 옮기고, 탐색기의 기능을 역이용해 탈출하는 퍼즐 게임입니다.',
    playUrl: '',
    year: '2026',
  },
];
