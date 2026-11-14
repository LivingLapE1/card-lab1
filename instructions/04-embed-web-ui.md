# Embed 지침 — Fun English 웹 UI 골격

> 담당: Embed 서브에이전트 (sonnet, 추론 강도 high — git 커밋·푸시와 배포 확인만 하는 단순 작업이라 high로 충분)
> 앞 단계: Plan(spec.md) → Build → Review(review.md 통과)

## 1. 목표

검증을 통과한 웹 UI 골격을 커밋하고 GitHub(`eversunk2-tech/card-lab1`, `main`)에 푸시한 뒤, GitHub Pages에 제대로 올라갔는지 확인한다.

## 2. 수정 범위 (꼭 지킬 것)

- 파일 내용을 고치지 않는다. git 명령과 확인용 `curl`·`gh api`만 쓴다.
- 강제 푸시(`--force`), 브랜치 삭제, 기록 다시 쓰기(rebase, amend, reset)를 하지 않는다.
- GitHub Pages 설정이나 저장소 설정을 바꾸지 않는다.
- 문제가 생기면 고치려 하지 말고 멈춰서 보고한다.

## 3. 커밋할 파일

이번 단계에서 생긴 것만 담는다:

- 앱: `index.html`, `.nojekyll`, `.gitignore`, `assets/`, `css/`, `js/`
- 문서: `README.md`(덧붙인 3줄), `spec.md`, `review.md`, `instructions/`

그 밖의 파일(예: `.DS_Store`, 임시 파일)이 보이면 담지 말고 보고에 적는다. `git add -A`나 `git add .`은 쓰지 말고 위 경로를 하나씩 지정한다.

## 4. 순서

1. `git status`로 바뀐 파일을 확인한다. 3장 목록 밖의 변경이 있으면 멈추고 보고한다.
2. 위 파일을 `git add` 한다.
3. 커밋한다. 메시지 형식:

   ```
   Add Fun English web UI skeleton

   승인된 spec.md대로 인트로, 학생·교사 로그인, 게임 선택, 게임 자리 화면 4종,
   교사 대시보드, 길을 잃었어요 화면을 빌드 없는 HTML/CSS/JS로 만들었다.
   가짜 데이터는 js/services 한 겹 뒤에 두었다. Review 결과는 review.md.

   Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
   ```

4. `git push origin main`. 거부되면(원격이 앞서 있음 등) 강제로 밀지 말고 멈춰서 보고한다.
5. Pages 빌드 확인: `gh api repos/eversunk2-tech/card-lab1/pages/builds/latest --jq '{status, commit: .commit[0:7], error: .error.message}'`가 방금 커밋으로 `built`가 될 때까지 30초 간격으로 확인한다(최대 10분). `errored`면 멈추고 보고한다.
6. 실제 주소 확인 (`curl -s -o /dev/null -w "%{http_code}"`로 모두 200이어야 함):
   - `https://eversunk2-tech.github.io/card-lab1/`
   - `https://eversunk2-tech.github.io/card-lab1/js/app.js`
   - `https://eversunk2-tech.github.io/card-lab1/css/tokens.css`
   - `https://eversunk2-tech.github.io/card-lab1/assets/favicon.svg`
   - `https://eversunk2-tech.github.io/card-lab1/design/mockup.html`
   - 첫 주소 HTML에 `js/app.js`를 부르는 `<script type="module"`이 들어 있는지도 본다 (README가 아니라 앱이 나오는지).

## 5. 끝나면 보고할 것 (짧게)

커밋 해시와 메시지 첫 줄, 커밋한 파일 수, 푸시 결과, Pages 빌드 상태, 주소별 HTTP 결과, 담지 않은 파일(있으면).
