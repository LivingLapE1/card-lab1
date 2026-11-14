# Embed 지침 — 좁은 화면 로고 보이기

> 담당: Embed 서브에이전트 (sonnet, 추론 강도 high — git 커밋·푸시와 배포 확인만 하는 단순 작업)
> 앞 단계: Build(지침 11) → (사용자 요청으로 이번에는 Review를 건너뜀, 2026-11-14 "리뷰 제외하고 빌드하면 바로 푸시")

## 1. 목표

좁은 화면 로고 수정을 커밋해 `main`에 푸시하고 GitHub Pages 반영을 확인한다.

## 2. 수정 범위 (꼭 지킬 것)

- 파일 내용을 고치지 않는다. git 명령과 확인용 `curl`·`gh api`만 쓴다.
- 강제 푸시, amend, rebase, reset, stash 조작, 브랜치 삭제, 저장소·Pages 설정 변경 금지. 문제가 생기면 멈추고 보고한다.

## 3. 순서

1. `git fetch origin` 후 `git status -sb`. 로컬 `main`이 `origin/main`보다 **뒤에 있으면** 아무것도 커밋하지 말고 멈춰서 보고한다.
2. `git status --short`로 변경을 본다. 담을 경로: `css/`, `js/`(바뀐 경우), `spec.md`(바뀐 경우), `instructions/11-build-logo-small.md`, `instructions/13-embed-logo-small.md`. 이 밖의 변경은 담지 말고 보고한다.
3. 위 경로를 하나씩 `git add` 한다 (`git add -A`, `git add .` 금지).
4. 커밋 메시지:

   ```
   Show Fun English logo link on narrow screens

   게임 선택(900px 이하), 게임 자리 화면(480px 이하), 교사 대시보드(640px 이하)에서
   숨겨지거나 잘리던 Fun English 로고를 모든 폭에서 보이고 눌리게 했다.
   사용자 요청으로 이번 변경은 Review 단계를 건너뛰었다.

   Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
   ```

5. `git push origin main`. 거부되면 강제로 밀지 말고 멈춰서 보고한다.
6. Pages 빌드: `gh api repos/eversunk2-tech/card-lab1/pages/builds/latest --jq '{status, commit: .commit[0:7], error: .error.message}'`가 방금 커밋으로 `built`가 될 때까지 30초 간격(최대 10분).
7. 주소 확인 (200): `https://eversunk2-tech.github.io/card-lab1/`, `…/css/bars.css`, `…/css/screens/play.css`. 배포된 `bars.css`에 900px 이하 `.hud .logo{display:none}` 규칙이 더는 없는지 `curl`로 본다.

## 4. 끝나면 보고할 것 (짧게)

커밋 해시, 커밋한 파일 수, 푸시 결과, Pages 빌드 상태, 주소별 결과, 담지 않은 파일.
