# Embed 지침 — 메인 복구와 보석·메모리 게임 연결

> 담당: Embed 서브에이전트 (sonnet, 추론 강도 high — git 커밋·푸시와 배포 확인만 하는 단순 작업)
> 앞 단계: 메인 세션의 복구(보석 게임 → `jewel/`, 웹 UI 되살림) → Build(게임 연결) → Review(review.md 3차 통과)

## 1. 목표

복구와 게임 연결을 한 커밋으로 묶어 `main`에 푸시하고, GitHub Pages에서 첫 주소가 Fun English 메인 화면으로 돌아왔는지, 두 게임 주소가 열리는지 확인한다.

## 2. 수정 범위 (꼭 지킬 것)

- 파일 내용을 고치지 않는다. git 명령과 확인용 `curl`·`gh api`만 쓴다.
- 강제 푸시, amend, rebase, reset, 브랜치 삭제, 저장소·Pages 설정 변경 금지. 문제가 생기면 멈추고 보고한다.

## 3. 순서

1. `git fetch origin` 후 `git status -sb`. 로컬 `main`이 `origin/main`보다 **뒤에 있으면**(그사이 누가 또 올림) 멈추고 보고한다. 같거나 앞서 있어야 한다.
2. `git status --short`로 바뀐 파일을 본다. 아래 경로 밖의 변경(예: `.DS_Store`, 임시 파일)이 있으면 담지 말고 보고한다.
   - 웹 UI: `index.html`, `README.md`, `CLAUDE.md`, `spec.md`, `review.md`, `design/`, `instructions/`, `css/`, `js/`, `assets/`
   - 게임: `jewel/`, `memory/config.js`
   - `git mv`로 옮긴 것(루트 `css/style.css`, `js/*.js` → `jewel/…`)은 이미 stage되어 있다.
3. 위 경로를 하나씩 `git add` 한다 (`git add -A`, `git add .` 금지). 루트의 옮겨진 파일이 지워진 것으로 남지 않았는지 `git status`로 다시 본다.
4. 커밋 메시지:

   ```
   Restore Fun English main app and link memory/jewel games

   보석 게임(Word Jewel Quest)이 main 루트에 올라와 메인 웹 앱을 덮어쓴 것을
   바로잡았다. 보석 게임은 내용 그대로 jewel/로 옮기고, 메인 웹 앱은 ef4acc3에서
   되살렸다. 게임 선택의 START를 memory/(이름·연습 모드·효과음 전달)와 jewel/에
   연결하고, CLAUDE.md에 게임별 폴더와 PR 규칙을 적었다.

   Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
   ```

5. `git push origin main`. 거부되면 강제로 밀지 말고 멈춰서 보고한다.
6. Pages 빌드: `gh api repos/eversunk2-tech/card-lab1/pages/builds/latest --jq '{status, commit: .commit[0:7], error: .error.message}'`가 방금 커밋으로 `built`가 될 때까지 30초 간격(최대 10분). `errored`면 멈추고 보고.
7. 주소 확인 (모두 200):
   - `https://eversunk2-tech.github.io/card-lab1/` — HTML에 `js/app.js`를 부르는 `<script type="module"`이 있어야 한다 (보석 게임이 아니라 메인 앱)
   - `https://eversunk2-tech.github.io/card-lab1/jewel/`, `…/jewel/css/style.css`, `…/jewel/js/game.js`
   - `https://eversunk2-tech.github.io/card-lab1/memory/`, `…/memory/config.js`
   - `https://eversunk2-tech.github.io/card-lab1/design/mockup.html`

## 4. 끝나면 보고할 것 (짧게)

커밋 해시, 커밋한 파일 수(추가/수정/이름 바꿈), 푸시 결과, Pages 빌드 상태, 주소별 결과, 담지 않은 파일.
