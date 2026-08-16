import './style.css';
import { applyDocumentLang } from './i18n.ts';

// <html lang>·meta 설명을 선택(또는 자동 감지)된 언어에 맞춘다
applyDocumentLang();

// 터치 기기 + 폰 크기 화면(또는 폰 UA)이면 폰 UI, 그 외에는 바탕화면 UI
// ?ui=mobile / ?ui=desktop 으로 강제 전환 가능 (미리보기·디버그용)
const forced = new URLSearchParams(location.search).get('ui');
// 마우스가 주 입력인 터치 노트북은 coarse/hover 판정에서 걸러진다
// (maxTouchPoints만 보면 터치 노트북까지 폰 UI가 되어버린다)
const coarse = window.matchMedia('(pointer: coarse)').matches;
const noHover = window.matchMedia('(hover: none)').matches;
const touchFirst = coarse || noHover;
const shortSide = Math.min(window.innerWidth, window.innerHeight);
const phoneUA = /Android|iPhone|iPod/i.test(navigator.userAgent);
const isMobile = forced ? forced === 'mobile' : touchFirst && (phoneUA || shortSide < 820);

document.documentElement.classList.add(isMobile ? 'is-mobile' : 'is-desktop');
// 태블릿·터치 모니터처럼 바탕화면 UI를 쓰는 터치 기기 → 탭 한 번으로 열기 + 큰 터치 영역
if (touchFirst || navigator.maxTouchPoints > 0) {
  document.documentElement.classList.add('is-touch');
}

if (isMobile) {
  void import('./mobile.ts');
} else {
  void import('./desktop.ts');
}
