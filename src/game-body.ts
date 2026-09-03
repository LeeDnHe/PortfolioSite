import type { GameEntry } from './games.ts';
import { TX } from './i18n.ts';

/** 게임 속성(일반/자세히/이전 버전) 마크업 — 데스크톱 창과 모바일 앱 페이지에서 공용 */
export function buildGameBody(game: GameEntry): string {
  const d = game.details;
  let mainBtn: string;
  if (game.playUrl) {
    mainBtn = `<a class="btn-play" href="${game.playUrl}" target="_blank" rel="noreferrer">${TX.btnPlay}</a>`;
  } else if (game.downloadUrl) {
    // 설치 파일 종류에 맞는 라벨 — 모바일은 APK, PC는 Windows 압축 파일
    const label = game.platform === 'mobile' ? TX.btnDownload : TX.btnDownloadWin;
    mainBtn = `<a class="btn-play" href="${game.downloadUrl}" download>${label}</a>`;
  } else {
    mainBtn = `<span class="btn-play disabled">${TX.btnWip}</span>`;
  }
  const youtubeBtn = game.youtube
    ? `<a class="btn-link youtube" href="${game.youtube.url}" target="_blank" rel="noreferrer"><span class="yt-glyph">▶</span> ${game.youtube.label} ↗</a>`
    : '';
  const githubBtn = d?.github
    ? `<a class="btn-link" href="${d.github}" target="_blank" rel="noreferrer">GitHub ↗</a>`
    : '';

  const factRows = (d?.facts ?? [])
    .map(
      (f) =>
        `<div class="props-row"><span class="props-k">${f.label}</span><span class="props-v">${f.value}</span></div>`,
    )
    .join('');
  const awards = d?.awards.length
    ? `<div class="props-section-title">${TX.secAwards}</div>
       <ul class="award-list">${d.awards.map((a) => `<li>${a}</li>`).join('')}</ul>`
    : '';

  const generalPanel = `
    <section class="tab-panel" data-tab="general">
      <div class="props-head">
        <img src="${game.icon}" alt="">
        <div>
          <div class="props-name">${game.title} <span class="platform-badge">${game.platformLabel}</span></div>
          <div class="props-sub">${game.tagline} · ${game.year}</div>
        </div>
      </div>
      <p class="desc">${game.description}</p>
      ${factRows ? `<div class="props-rows">${factRows}</div>` : ''}
      <div class="win-actions">${mainBtn}${youtubeBtn}${githubBtn}</div>
      ${awards}
    </section>`;

  const detailPanel = d
    ? `<section class="tab-panel" data-tab="detail" hidden>
        <div class="props-section-title">${TX.secBackground}</div>
        ${d.background.map((p) => `<p class="detail-p">${p}</p>`).join('')}
        <div class="props-section-title">${TX.secStatement}</div>
        ${d.statement.map((p) => `<p class="detail-p">${p}</p>`).join('')}
        ${
          d.devComment?.length
            ? `<div class="props-section-title">${TX.secDevComment}</div>
               <div class="dev-comment">${d.devComment.map((p) => `<p class="detail-p">${p}</p>`).join('')}</div>`
            : ''
        }
      </section>`
    : `<section class="tab-panel" data-tab="detail" hidden>
        <p class="tab-empty">${TX.tabEmptyDetail}</p>
      </section>`;

  const versionsPanel = d?.versions.length
    ? `<section class="tab-panel" data-tab="versions" hidden>
        ${d.versions
          .map(
            (v) => `
          <article class="ver-entry">
            <header class="ver-head">
              <span class="ver-badge">${v.version}</span>
              <span class="ver-title">${v.title}</span>
              ${v.current ? `<span class="ver-current">${TX.verCurrent}</span>` : ''}
              <span class="ver-date">${v.date}</span>
            </header>
            <ul class="ver-changes">${v.changes.map((c) => `<li>${c}</li>`).join('')}</ul>
          </article>`,
          )
          .join('')}
      </section>`
    : `<section class="tab-panel" data-tab="versions" hidden>
        <p class="tab-empty">${TX.tabEmptyVersions}</p>
      </section>`;

  return `
    <div class="props-tabs" role="tablist">
      <button class="props-tab active" data-tab="general" role="tab">${TX.tabGeneral}</button>
      <button class="props-tab" data-tab="detail" role="tab">${TX.tabDetail}</button>
      <button class="props-tab" data-tab="versions" role="tab">${TX.tabVersions}</button>
    </div>
    <div class="win-body props-body">
      ${generalPanel}
      ${detailPanel}
      ${versionsPanel}
    </div>`;
}

/** 탭 클릭 전환 — root는 탭과 패널을 모두 포함하는 요소 */
export function wireGameTabs(root: HTMLElement): void {
  if (root.dataset.tabsWired) return;
  root.dataset.tabsWired = '1';
  root.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('.props-tab');
    if (!btn) return;
    root.querySelectorAll<HTMLElement>('.props-tab').forEach((t) =>
      t.classList.toggle('active', t === btn),
    );
    root.querySelectorAll<HTMLElement>('.tab-panel').forEach((p) => {
      p.hidden = p.dataset.tab !== btn.dataset.tab;
    });
    root.querySelector<HTMLElement>('.props-body')?.scrollTo(0, 0);
    root.querySelector<HTMLElement>('.m-app-body')?.scrollTo(0, 0);
  });
}
