# Portfolio Site

게임 포트폴리오 허브 사이트. 바탕화면 컨셉으로 게임별 폴더를 배치하고,
폴더를 열면 게임 소개와 플레이 링크가 나온다.

- Vite + TypeScript 정적 사이트, Netlify 배포 (`netlify.toml`)
- 게임 추가: `src/games.ts`의 `GAMES` 배열에 항목 추가
- Windows에서 `npm install`은 `--force` 필요 (rollup 리눅스 dep 워크어라운드)

## 명령어

```bash
npm install --force
npm run dev
npm run build
```
