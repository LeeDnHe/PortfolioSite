/* =========================================================
   루트(/) 밖의 주소 처리.
   주소로 열리는 페이지는 route-data.json 에 암호화되어 있고, 열쇠는 주소 그 자체다.
   열리는 상자가 있으면 그 페이지를 띄우고, 없으면 404 화면을 보여 준다.
   (Netlify 는 없는 경로에 dist/404.html 을 돌려주는데, 빌드가 그 파일을 index.html 과 같게 만든다)

   상자는 FileEscapeGame 저장소의 src/arg/tools/build-site.mjs 가 만든다 — 여기서 손으로 고치지 않는다.
   ========================================================= */

import data from './route-data.json';
import { lang, TX } from './i18n.ts';

export interface Sealed {
  s: string;
  iv: string;
  ct: string;
}

const ITERATIONS = 150_000;

/** 입력 정규화: 앞뒤·중간 공백 제거, 대문자 (봉인할 때와 같은 규칙) */
function normalize(v: string): string {
  return v.trim().replace(/\s+/g, '').toUpperCase();
}

function fromB64(v: string): Uint8Array {
  const bin = atob(v);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** 맞는 열쇠면 평문, 아니면 null */
export async function unseal(secret: string, box: Sealed): Promise<string | null> {
  try {
    const enc = new TextEncoder();
    const base = await crypto.subtle.importKey('raw', enc.encode(normalize(secret)), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', hash: 'SHA-256', salt: fromB64(box.s) as BufferSource, iterations: ITERATIONS },
      base,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt'],
    );
    const pt = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromB64(box.iv) as BufferSource },
      key,
      fromB64(box.ct) as BufferSource,
    );
    return new TextDecoder().decode(pt);
  } catch {
    return null;
  }
}

/** 건의함 자동 응답 — 정해진 글이면 응답 줄들을, 아니면 null */
export async function autoReply(text: string): Promise<string[] | null> {
  const pt = await unseal(text, data.a);
  if (!pt) return null;
  const reply = JSON.parse(pt) as { ko: string[]; en: string[] };
  return reply[lang];
}

/** 건의함 대화형 자동 응답 — 정해진 글로 열리는 대화 상대. 열린 뒤에는 보내는 글이 서버 대신 이쪽으로 간다 */
export interface Talk {
  start(l: 'ko' | 'en'): string[];
  answer(text: string): Promise<{ lines: string[]; done: boolean }>;
}

/** 정해진 글이면 대화 상대를, 아니면 null */
export async function openTalk(text: string): Promise<Talk | null> {
  for (const box of (data as { c?: Sealed[] }).c ?? []) {
    const code = await unseal(text, box);
    if (!code) continue;
    const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
    try {
      return (await import(/* @vite-ignore */ url)) as Talk;
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  return null;
}

interface PageModule {
  mount(root: HTMLElement): void;
  setLang?(l: 'ko' | 'en'): void;
}

/** 사이트 스타일과 바탕화면을 걷어내고 빈 body 를 넘긴다 */
function clearShell(): HTMLElement {
  document.querySelectorAll('link[rel="stylesheet"], style').forEach((el) => el.remove());
  document.documentElement.className = '';
  document.body.replaceChildren();
  document.body.removeAttribute('class');
  return document.body;
}

function showNotFound(): void {
  const body = clearShell();
  document.title = TX.nfTitle;
  const style = document.createElement('style');
  style.textContent = `
    html, body { margin: 0; height: 100%; background: #0d0d1a; color: #d8d8e0; }
    body { display: flex; align-items: center; justify-content: center; font-family: system-ui, 'Segoe UI', 'Malgun Gothic', sans-serif; }
    .nf { text-align: center; padding: 16px; }
    .nf h1 { font-size: 56px; margin: 0 0 8px; font-weight: 600; }
    .nf p { margin: 0 0 20px; color: #a0a0b0; }
    .nf a { color: #8fb3ff; }`;
  document.head.appendChild(style);
  const box = document.createElement('div');
  box.className = 'nf';
  box.innerHTML = `<h1>404</h1><p></p><a href="/"></a>`;
  box.querySelector('p')!.textContent = TX.nfTitle;
  box.querySelector('a')!.textContent = TX.nfHome;
  body.appendChild(box);
}

/** @param path 앞뒤 / 를 뗀 경로 */
export async function openRoute(path: string): Promise<void> {
  for (const box of data.r as Sealed[]) {
    const code = await unseal(path, box);
    if (!code) continue;
    const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
    try {
      const mod = (await import(/* @vite-ignore */ url)) as PageModule;
      mod.setLang?.(lang);
      mod.mount(clearShell());
    } finally {
      URL.revokeObjectURL(url);
    }
    return;
  }
  showNotFound();
}
