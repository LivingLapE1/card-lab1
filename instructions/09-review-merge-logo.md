# Review 지침 — 공동 작업 합치기 결과와 로고 링크

> 담당: Review 서브에이전트 (Build와 다른 에이전트, opus, 추론 강도 high — 바뀐 범위가 작아 high로 충분)

## 1. 배경

1. 공동 작업자(Hyunsik-Jo20)가 커밋 `2ca3ae4`로 메인 앱을 되살리고, 메모리·보석 게임을 **게임 자리 화면 안 iframe**에 넣었다. 루트에는 보석 게임 옛 파일(`css/style.css`, `js/audio.js`, `board.js`, `game.js`, `levels.js`, `teacher.js`)이 남아 있었다.
2. 사용자는 **"게임 화면으로 바로"** 방식을 골랐다. START를 누르면 게임 페이지(`memory/?nick=…&practice=…&sfx=…`, `jewel/`)가 화면 전체로 열린다.
3. 메인 세션이 `2ca3ae4` 위에 다음을 얹었다 (아직 커밋 전):
   - `js/content/games.js`, `js/screens/select.js`, `js/screens/play.js`: 앞서 Build가 만들고 3차 Review를 통과한 "바로 이동" 버전으로 되돌림 (iframe 제거)
   - `css/screens/play.css`: iframe CSS를 빼고 `ef4acc3` 버전으로 되돌림
   - 루트의 보석 게임 옛 파일 6개 삭제 (`jewel/` 안의 같은 파일과 내용이 같음을 확인함)
   - `jewel/index.html`: 공동 작업자가 넣은 "🏠 메인으로" 링크 주소를 `../../#/select`(사이트 밖, 404) → `../#/select`로 고침. 다른 줄은 그대로
   - `jewel/README.md` 주소 두 줄, `memory/config.js` `MAIN_URL`, `CLAUDE.md` "공동 작업 구조" 절, `spec.md` 13장 25·26번째 줄, `review.md` 3차 절, `instructions/05–10`
4. 그다음 Build가 `instructions/08-build-logo-home.md`대로 **왼쪽 위 Fun English 로고를 누르면 첫 화면(`#/`)으로 가게** 했다.

## 2. 수정 범위 (꼭 지킬 것)

- 고칠 수 있는 파일: `review.md` 하나. 맨 아래에 **"## 4차 검증 — 합치기 결과와 로고 링크 (날짜)"** 절을 덧붙인다. 위 1–3차는 지우지 않는다.
- 다른 파일은 읽기만 한다. git commit·add·reset·push·stash를 하지 않는다.

## 3. 확인 방법

임시 폴더에 복사해서 띄운다 (위치는 작업 요청 메시지에 있다).

```bash
rsync -a --delete --exclude .git "<프로젝트 폴더>/" "<임시 폴더>/review-site/"
cd "<임시 폴더>" && python3 -m http.server 8702 --bind 127.0.0.1 --directory "<임시 폴더>/review-site"
```

서버는 백그라운드로, 끝나면 반드시 끈다. 캐시 주의.

## 4. 검증할 것

1. **합치기가 의도대로인가** — `git diff 2ca3ae4 --stat` (작업 폴더와 비교)에 위 1장 3·4의 파일만 보이는지. 특히:
   - 루트에 보석 게임 옛 파일 6개가 없고, 아무 파일도 그것을 부르지 않는지.
   - `jewel/`이 `2ca3ae4`의 `jewel/`과 비교해 `index.html`의 링크 한 줄, `README.md` 주소 두 줄만 다른지.
   - `memory/`가 `2ca3ae4`와 비교해 `config.js`의 `MAIN_URL` 한 줄만 다른지.
   - iframe 코드와 CSS(`play-game-frame`, `game-play-iframe`)가 남아 있지 않은지.
2. **게임 바로 이동** — 학생 로그인 → 카드 뒤집기 START → `memory/?nick=…&practice=…&sfx=…`, 이름이 게임에 들어가는지, 스위치 값 반영, "← 메인으로"로 게임 선택 복귀. 보석 START → `jewel/`, 게임이 뜨고 "🏠 메인으로"가 `…/#/select`(앱 안)로 가는지. 브라우저 뒤로 가기. 듣고 고르기·스피드 퀴즈는 자리 화면. `#/play/memory`·`#/play/jewel` 직접 접속(로그인 확인 후 게임으로).
3. **로고 링크** — 학생 로그인, 교사 로그인, 게임 선택, 게임 자리 화면, 교사 대시보드, 길을 잃었어요 6개 화면에서 로고를 누르면 `#/` 인트로로 가는지. 키보드(Tab·Enter)와 포커스 표시, 화면 낭독기용 이름, 누르는 영역 44px, 1280px에서 모양이 전과 같은지, 움직임 줄이기.
4. **회귀** — 기존 화면 전부 360 / 768 / 1280px 가로 스크롤 없음, 콘솔 오류 없음(보석 게임의 favicon.ico 404, 메모리 bgm.mp3 404는 알려진 것), `node --check`, 화면 코드가 storage를 직접 쓰지 않음(spec 3.3).

## 5. review.md에 쓸 것

4차 절에: 결과(통과 / 고칠 것 있음), 반드시 고칠 것 표, 고치면 좋은 것 표, 위 1–4 항목별 결과.

## 6. 끝나면 보고할 것 (짧게)

결과, 반드시 고칠 것 목록(한 줄씩), 확인 못 한 것.
