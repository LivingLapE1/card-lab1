# Build 지침 — 게임 선택에서 보석·메모리 게임 연결

> 담당: Build 서브에이전트 (opus, 추론 강도 high — 바꿀 곳이 몇 군데뿐인 작은 연결 작업이라 high로 충분)
> 사용자 승인: 2026-11-14 "보석·메모리 모두 연결"

## 1. 배경

공동 작업자 두 명이 게임을 올렸다.

- **메모리 게임** (winter0402): `memory/` 폴더. 주소 `…/card-lab1/memory/?nick=학생이름`. 선택 값 `practice=0|1`(연습 모드, 시간 제한 없음), `sfx=0|1`(효과음), `bgm=0|1`(배경음악). 자세한 것은 `memory/README.md`.
- **보석 게임 Word Jewel Quest** (Hyunsik-Jo20): `main` 루트에 바로 올라와 우리 웹 UI를 덮어썼다. 메인 세션이 이미 **`jewel/` 폴더로 옮기고**(내용은 그대로) 우리 웹 UI를 되살려 두었다. 주소 `…/card-lab1/jewel/`. 주소 값(파라미터)을 받지 않는다.

지금 게임 선택 화면의 START는 모든 게임에서 "곧 열려요" 자리 화면(`#/play/<게임>`)으로 간다. 이것을 메모리·보석은 **실제 게임으로** 보내도록 바꾼다.

## 2. 할 일

1. **게임 정보에 주소 추가** (`js/content/games.js`)
   - memory: 게임 주소 `memory/`, 넘길 값 `nick`(학생 이름), `practice`, `sfx`
   - jewel: 게임 주소 `jewel/`, 넘길 값 없음
   - listen, speed: 주소 없음 (지금처럼 자리 화면)
   - 주소는 **상대 경로**로 쓴다 (`/`로 시작 금지). 앱이 `/card-lab1/`에서 열리므로 `memory/`는 `/card-lab1/memory/`가 된다.
2. **START 동작** (`js/screens/select.js`)
   - 고른 게임에 주소가 있으면 그 게임으로 이동한다 (`location.assign` 등, 브라우저 뒤로 가기로 게임 선택에 돌아올 수 있게).
   - memory에 넘길 값: `nick` = 로그인한 학생의 이름(지금은 가짜 학생 '김하린'), `practice` = 연습 모드 스위치(켜짐 1 / 꺼짐 0), `sfx` = 효과음 스위치(1 / 0). 값은 반드시 `encodeURIComponent` 등으로 인코딩한다(한글 이름).
   - 설정 값은 지금처럼 데이터 한 겹(`js/services/index.js`의 `prefs`)에서 읽는다. 화면 코드에서 storage를 직접 쓰지 않는 규칙(spec 3.3)을 지킨다.
   - 주소가 없는 게임(listen, speed)은 지금처럼 `#/play/<게임>`.
3. **자리 화면 주소로 직접 들어온 경우** (`js/screens/play.js` 또는 라우터)
   - `#/play/memory`, `#/play/jewel`로 들어오면 자리 화면 대신 위와 같은 값으로 그 게임에 보낸다(기록을 늘리지 않게 `location.replace`). 로그인 확인은 지금 규칙 그대로 먼저 한다.
4. **메모리 게임의 "← 메인으로" 버튼** (`memory/config.js`)
   - `MAIN_URL` 값만 `"../#/select"`로 채운다. 다른 줄은 손대지 않는다. (같은 탭이면 가짜 로그인 상태가 남아 있어 게임 선택으로 돌아온다)
5. **README**
   - 루트 `README.md`: 게임별 주소 두 줄 추가 (카드 뒤집기 `…/card-lab1/memory/`, 보석 게임 `…/card-lab1/jewel/`).
   - `jewel/README.md`: "실시간 플레이" 주소 한 줄만 `https://eversunk2-tech.github.io/card-lab1/jewel/`로 고친다. 다른 내용은 그대로.

## 3. 수정 범위 (꼭 지킬 것)

- 고칠 수 있는 파일: `js/content/games.js`, `js/screens/select.js`, `js/screens/play.js`, 꼭 필요하면 `js/router.js`·`js/routes.js`, `memory/config.js`(MAIN_URL 한 줄), `README.md`, `jewel/README.md`(주소 한 줄).
- 그 밖의 `jewel/`·`memory/` 파일은 고치지 않는다 (다른 사람의 게임).
- `CLAUDE.md`, `spec.md`, `review.md`, `design/`, `instructions/`는 고치지 않는다.
- git 커밋·푸시를 하지 않는다. (`git mv`로 옮긴 상태가 이미 stage되어 있으니 `git add`/`git reset`도 하지 않는다.)

## 4. 확인 방법

바탕화면 폴더에서 띄운 서버는 파일을 못 읽으므로 임시 폴더에 복사해서 띄운다 (임시 폴더 위치는 작업 요청 메시지에 있다).

```bash
rsync -a --delete --exclude .git "<프로젝트 폴더>/" "<임시 폴더>/build-site/"
cd "<임시 폴더>" && python3 -m http.server 8701 --bind 127.0.0.1 --directory "<임시 폴더>/build-site"
```

확인할 것:
- `http://localhost:8701/` 첫 화면이 Fun English 인트로인지 (보석 게임이 아니라).
- 학생 로그인 → 게임 선택 → 카드 뒤집기 START → `memory/?nick=%EA%B9%80…&practice=0&sfx=1` 같은 주소로 가고, 메모리 게임이 그 이름을 받는지. 연습 모드·효과음 스위치를 바꾸면 값도 바뀌는지.
- 메모리 게임의 "← 메인으로"가 게임 선택으로 돌아오는지.
- 보석 게임 START → `jewel/`로 가고 보석 게임이 콘솔 오류 없이 뜨는지(CSS·JS 200).
- 브라우저 뒤로 가기로 게임 선택에 돌아오는지.
- 듣고 고르기·스피드 퀴즈 START는 그대로 자리 화면.
- `#/play/memory`, `#/play/jewel` 직접 접속 → 로그인 안 했으면 로그인 화면, 했으면 게임으로.
- `node --check`로 고친 JS 문법 확인. 360 / 768 / 1280px에서 게임 선택 화면이 깨지지 않는지.
- 끝나면 서버를 끈다.

## 5. 끝나면 보고할 것 (짧게)

고친 파일과 내용, 확인 결과, spec과 달라진 점, 알고 있는 문제.
