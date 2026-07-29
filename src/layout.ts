/* 화면 크기에 따라 달라지는 레이아웃 값들 — CSS 변수를 단일 출처로 삼는다 */

function cssPx(name: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  const v = parseFloat(raw);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

/** 작업표시줄 높이 (px) */
export function taskbarH(): number {
  return cssPx('--taskbar-h', 40);
}

/** 바탕화면 아이콘 한 칸 크기 (px) */
export function iconCell(): { w: number; h: number } {
  return { w: cssPx('--icon-cell-w', 100), h: cssPx('--icon-cell-h', 106) };
}

/** 미니게임 스프라이트·속도 배율 — 작은 화면에서도 비율이 유지되도록 */
export function uiScale(): number {
  const base = Math.min(window.innerWidth, window.innerHeight * 1.6) / 1280;
  return Math.min(Math.max(base, 0.62), 1.25);
}

/** 창·아이콘이 화면 밖으로 나갔을 때 되돌릴 여백 */
export const EDGE_PAD = 8;
