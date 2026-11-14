# Review 지침 — 메인 복구와 보석·메모리 게임 연결

> 담당: Review 서브에이전트 (Build와 다른 에이전트, opus, 추론 강도 high — 바뀐 범위가 작아 high로 충분)

## 1. 배경

- 공동 작업자가 보석 게임(Word Jewel Quest)을 `main` 루트에 올려 우리 웹 UI를 덮어썼다. 메인 세션이 보석 게임을 `jewel/`로 옮기고(내용 그대로) 웹 UI를 커밋 `ef4acc3`에서 되살렸다.
- 메모리 게임은 다른 공동 작업자가 `memory/`에 올렸다.
- Build가 `instructions/05-build-game-links.md`대로 게임 선택 START를 메모리·보석 실제 게임에 연결했다.

## 2. 수정 범위 (꼭 지킬 것)

- 고칠 수 있는 파일: 프로젝트 루트의 `review.md` 하나. 기존 내용 아래에 **"## 3차 검증 — 메인 복구와 게임 연결 (날짜)"** 절을 덧붙인다. 위의 1·2차 내용은 지우지 않는다.
- 앱 코드, `jewel/`, `memory/`는 읽기만 한다. git 커밋·푸시·add·reset을 하지 않는다.

## 3. 확인 방법

임시 폴더에 복사해서 띄운다 (바탕화면 폴더에서 띄운 서버는 파일을 못 읽는다. 임시 폴더 위치는 작업 요청 메시지에 있다).

```bash
rsync -a --delete --exclude .git "<프로젝트 폴더>/" "<임시 폴더>/review-site/"
cd "<임시 폴더>" && python3 -m http.server 8702 --bind 127.0.0.1 --directory "<임시 폴더>/review-site"
```

서버는 백그라운드로, 끝나면 반드시 끈다. 캐시 주의(강력 새로고침).

## 4. 검증할 것

1. **복구가 온전한가**
   - `git diff ef4acc3 --stat -- . ':(exclude)jewel' ':(exclude)memory'` (작업 폴더와 비교) 결과가 Build가 고친 파일(지침 05의 범위)과 아래 두 곳만 보이는지. 그 밖의 웹 UI 파일은 `ef4acc3`과 같아야 한다.
     - `CLAUDE.md`: 메인 세션이 "공동 작업 구조" 절을 덧붙였다 (정상).
     - `instructions/05-build-game-links.md`, `instructions/06-review-game-links.md`: 새 지침 파일 (정상).
   - `jewel/`의 파일이 커밋 `13d3de8`의 루트 파일(index.html, README.md, css/style.css, js/audio.js, board.js, game.js, levels.js, teacher.js)과 같은지. 다른 곳은 `jewel/README.md`의 주소 한 줄뿐이어야 한다.
   - `memory/`가 `13d3de8`과 같은지. 다른 곳은 `memory/config.js`의 `MAIN_URL` 한 줄뿐이어야 한다.
2. **첫 화면**: `http://localhost:8702/`가 Fun English 인트로인지. 콘솔 오류 없는지.
3. **연결**: 지침 05의 4장 확인 목록을 모두 직접 해 본다 (메모리 START 주소와 값, 이름이 게임에 들어가는지, 스위치 값 반영, ← 메인으로, 보석 START, 뒤로 가기, 듣고 고르기·스피드 퀴즈는 자리 화면, `#/play/memory`·`#/play/jewel` 직접 접속과 로그인 확인).
4. **보석 게임**: `jewel/`에서 CSS·JS가 모두 200이고 게임 화면이 뜨는지, 콘솔 오류가 없는지. 보석 게임 안에 루트(`/`)로 시작하는 경로나 옛 주소(`/card-lab1/` 루트를 가정한 것)가 없는지.
5. **코드 규칙**: 화면 코드가 storage를 직접 쓰지 않는지(spec 3.3), 넣는 값 인코딩, 상대 경로, `node --check`.
6. **회귀**: 고친 뒤 기존 화면(인트로, 로그인, 게임 선택, 대시보드, 자리 화면)이 깨지지 않았는지. 360 / 768 / 1280px 가로 스크롤 없음.
7. **같은 사이트 저장소 충돌**: 우리 앱, 메모리, 보석 게임이 같은 주소(`eversunk2-tech.github.io`)의 localStorage를 함께 쓴다. 키 이름이 겹치는 곳이 없는지.

## 5. review.md에 쓸 것

3차 절에: 결과(통과 / 고칠 것 있음), 반드시 고칠 것 표, 고치면 좋은 것 표, 위 1–7 항목별 통과/실패/확인 못 함.

## 6. 끝나면 보고할 것 (짧게)

결과, 반드시 고칠 것 목록(한 줄씩), 확인 못 한 것.
