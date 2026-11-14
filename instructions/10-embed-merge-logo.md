# Embed 지침 — 공동 작업 합치기 + 게임 바로 이동 + 로고 링크

> 담당: Embed 서브에이전트 (sonnet, 추론 강도 high — git 커밋·푸시와 배포 확인만 하는 단순 작업)
> 앞 단계: 메인 세션의 합치기(2ca3ae4 위) → Build(로고 링크) → Review(review.md 4차 통과)

## 1. 목표

작업 폴더의 변경을 한 커밋으로 묶어 `main`에 푸시하고, GitHub Pages에서 첫 화면·게임 이동·로고 링크가 실제 주소에서 되는지 확인한다.

## 2. 수정 범위 (꼭 지킬 것)

- 파일 내용을 고치지 않는다. git 명령과 확인용 `curl`·`gh api`만 쓴다.
- 강제 푸시, amend, rebase, reset, stash 조작, 브랜치 삭제, 저장소·Pages 설정 변경 금지. 문제가 생기면 멈추고 보고한다.

## 3. 순서

1. `git fetch origin` 후 `git status -sb`. 로컬 `main`이 `origin/main`보다 **뒤에 있으면**(그사이 공동 작업자가 또 올림) 아무것도 커밋하지 말고 멈춰서 보고한다.
2. `git status --short`로 변경을 본다. 담을 경로:
   - `CLAUDE.md`, `README.md`(바뀐 경우), `spec.md`, `review.md`, `instructions/`
   - `css/`(루트 `css/style.css` 삭제 포함), `js/`(루트 `js/audio.js`·`board.js`·`game.js`·`levels.js`·`teacher.js` 삭제 포함)
   - `jewel/index.html`, `jewel/README.md`, `memory/config.js`
   이 밖의 변경(예: `.DS_Store`, 임시 파일)이 있으면 담지 말고 보고한다.
3. 위 경로를 하나씩 `git add` 한다 (`git add -A`, `git add .` 금지). 삭제된 파일이 stage되었는지 `git status`로 다시 본다.
4. 커밋 메시지:

   ```
   Open memory/jewel games directly, link logo to main screen

   공동 작업자 커밋(2ca3ae4) 위에서, 사용자 결정에 따라 게임 START가 iframe 대신
   게임 페이지(memory/?nick=…, jewel/)로 바로 가게 바꿨다. 루트에 남은 보석 게임
   옛 파일 6개를 지우고, 보석 게임 "메인으로" 링크 주소(../../ → ../)를 고쳤다.
   각 화면 왼쪽 위 Fun English 로고를 누르면 첫 화면으로 간다. CLAUDE.md에
   게임별 폴더와 PR 규칙을 적었다.

   Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
   ```

5. `git push origin main`. 거부되면 강제로 밀지 말고 멈춰서 보고한다.
6. Pages 빌드: `gh api repos/eversunk2-tech/card-lab1/pages/builds/latest --jq '{status, commit: .commit[0:7], error: .error.message}'`가 방금 커밋으로 `built`가 될 때까지 30초 간격(최대 10분). `errored`면 멈추고 보고.
7. 주소 확인:
   - 200이어야 함: `https://eversunk2-tech.github.io/card-lab1/` (HTML에 `js/app.js`를 부르는 `<script type="module"`), `…/js/ui/parts.js`, `…/jewel/`, `…/jewel/js/game.js`, `…/memory/`, `…/memory/config.js`, `…/design/mockup.html`
   - 404여야 함 (지운 옛 파일): `…/css/style.css`, `…/js/game.js`
   - `…/js/ui/parts.js` 안에 `href="#/"`(로고 링크)가 들어 있는지, `…/jewel/` HTML에 `href="../#/select"`가 있는지.

## 4. 끝나면 보고할 것 (짧게)

커밋 해시, 커밋한 파일 수(추가/수정/삭제), 푸시 결과, Pages 빌드 상태, 주소별 결과, 담지 않은 파일.
