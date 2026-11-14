# spec.md — Fun English 웹 UI 골격

> **상태: 승인됨 (2026-11-14).** 사용자가 12장 질문 1–8을 **모두 추천안대로** 승인했다.
> 승인 때 바뀐 점: `.claude/launch.json`은 만들지 않는다. 이 컴퓨터에서는 바탕화면 폴더에서 띄운 로컬 서버가 macOS 개인정보 보호 때문에 파일을 읽지 못하므로, 확인은 Build·Review 지침에 적힌 대로 임시 폴더에 복사해서 띄운다.
> 작성: Plan 서브에이전트 · 2026-11-14
> 근거: `CLAUDE.md`, `design/DESIGN.md`, `design/mockup.html`, 스타일 스킬 `ui-design-foundation`·`ui-style-bold-retro`
> 읽는 순서: 사용자는 1·2·3·12·13장, Build는 전체, Review는 5·7·9·11장을 중심으로 본다.

쉬운 말 풀이 (이 문서에 자주 나오는 말)

- **해시 주소**: 주소 끝에 `#/select`처럼 `#` 뒤에 화면 이름을 붙이는 방식. `#` 뒤는 서버로 가지 않아서 GitHub Pages에서도 새로고침이 안전하다.
- **가짜 데이터**: 학생 이름, 점수처럼 화면을 채우기 위해 지어낸 값. 모두 한 파일에 모아 두고, 나중에 진짜 데이터로 바꾼다.
- **데이터 한 겹(services)**: 화면이 데이터·로그인을 직접 만지지 않고 반드시 거치는 중간 창구. 나중에 백엔드를 붙일 때 이 창구 안쪽만 바꾸면 화면은 그대로 둔다.

---

## 1. 한 줄 요약

승인된 Fun English 시안(화면 5개)을 **GitHub Pages 첫 주소(https://eversunk2-tech.github.io/card-lab1/)에서 바로 열리는 진짜 웹 앱의 뼈대**로 옮기고, 게임 4종의 "곧 열려요" 자리 화면, 한곳에 모은 가짜 데이터, 나중에 어떤 백엔드든 끼울 수 있는 "데이터 한 겹"을 함께 만든다.

---

## 2. 이번 단계 범위

### 2.1 넣을 것

1. 시안 화면 5개를 앱으로 옮기기 — 인트로, 학생 로그인, 교사 로그인, 게임 선택, 교사 대시보드. 모양·토큰·흐름은 시안 그대로.
2. **게임 자리 화면 4종** — 게임 선택에서 START를 누르면 들어가는 화면. 게임 판은 없고 "곧 열려요"와 돌아가기만 둔다. (7.6절, 질문 3)
3. **길을 잃었어요 화면** — 없는 주소로 들어왔을 때 보여 주는 작은 화면. 데이터를 못 불러왔을 때의 오류 화면도 같은 틀로 쓴다. (7.8절)
4. 화면 이동 — 주소마다 화면 하나, 뒤로·앞으로 가기, 새로고침해도 같은 화면, 링크로 바로 열기.
5. 가짜 데이터를 한 파일(`js/services/mock/fixtures.js`)에 모으고, 화면은 데이터 한 겹(`js/services/`)만 거친다.
6. 가짜 로그인 — 진짜 확인은 하지 않는다. 학생은 예시 학생 "김하린", 교사는 예시 선생님 "박지수"로 들어간다. 로그인 상태는 탭을 닫을 때까지만 기억한다. (질문 4)
7. 시안의 화면 상태 전부 — 기본, 올림, 누름, 포커스, 오류(빈 칸 로그인), 로딩(구글 버튼), 빈 상태(기록 없음).
8. 연습 모드·효과음 스위치를 브라우저에 기억 (새로고침해도 유지).
9. 발음 듣기 — 브라우저 음성 합성(`speechSynthesis`, en-US).
10. 반응형(360 / 768 / 1280px), 접근성, 움직임 줄이기.
11. GitHub Pages 배포 준비 — `.nojekyll`, 상대 경로, 탭 아이콘.

### 2.2 뺄 것 (다음 단계)

- 진짜 구글 로그인, 아이디·비밀번호 확인, 진짜 세션 유지
- 데이터베이스·백엔드 선택과 연결, 학습 기록 저장, 교사 대시보드의 진짜 집계
- 게임 4종의 실제 게임 판과 규칙
- 학생 아이디 만들기·관리 화면 (버튼만 두고 "다음 단계에서 만들어요" 안내를 띄운다)
- 단어 그림 카드, 효과음, 배경 음악 같은 에셋 (DESIGN.md대로 `ui-assets-with-gemini` 순서로 목록을 먼저 승인받는다)
- 별, 연속 학습, 오늘의 미션, "첫 도전 별 +5"의 실제 규칙 (지금은 시안의 가짜 숫자만 보여 준다)

### 2.3 다음 단계로 미루는 결정 (지금 묻지 않음)

| 결정 | 언제 |
|---|---|
| 데이터베이스·백엔드 서비스와 구조 | 백엔드 단계 (CLAUDE.md 규칙: 반드시 사용자에게 묻는다) |
| 교사 로그인 방식 (시안의 구글 + 이메일은 임시) | 백엔드 단계 |
| 학생 아이디 형식 (시안의 `hanbit4-07`은 예시) | 학생 아이디 관리 단계 |
| 별·연속 학습·오늘의 미션 규칙, 오늘의 단어 고르는 규칙 | 게임 단계 |
| 게임별 세부 규칙 (판 크기, 문제 수, 제한 시간) | 게임 단계 |
| 인트로의 `CLASS BEST` 표시 여부 (로그인 전이라 어느 반인지 알 수 없음) | 백엔드 단계 |
| 단어 그림 카드·효과음 에셋 목록 | 게임 단계 (`ui-assets-with-gemini`) |

---

## 3. 기술 방식

### 3.1 프런트엔드 방식 — **사용자 승인 필요 (질문 1)**

**추천: 빌드 없는 HTML / CSS / 자바스크립트(ES 모듈)**

- `index.html` 하나 + CSS 파일 몇 개 + 자바스크립트 모듈 파일들. 설치하는 도구(node, npm)도, 빌드 단계도 없다.
- 외부 라이브러리 0개. 글꼴만 Google Fonts에서 불러온다.

이유

1. GitHub Pages가 저장소 파일을 그대로 내보낸다. 지금 설정(main 브랜치 루트)을 바꾸지 않고, 푸시하면 1분 안팎에 반영된다.
2. 승인된 시안이 이미 HTML/CSS/JS라서 모양을 거의 그대로 옮길 수 있다. 시안과 달라질 위험이 가장 적다.
3. 고치는 사람이 파일을 열어 바로 고치고 바로 확인한다. 유지보수할 도구가 없다.
4. 화면 7개, 라이브러리 0개 규모라 빌드 도구의 장점(파일 묶기, 압축)이 작다.
5. 나중에 붙을 백엔드: 화면은 데이터 한 겹(3.3절)만 거치므로 어떤 백엔드든 그 안쪽만 바꾸면 된다. 대부분의 백엔드 서비스는 브라우저에서 바로 불러 쓰는 모듈을 제공한다. 정말 빌드 도구가 필요해지면 ES 모듈 코드를 거의 그대로 Vite로 옮길 수 있다.

단점과 대처

- 파일을 더블클릭해서 열면 동작하지 않는다(ES 모듈 보안 규칙). → 3.7절의 간단한 로컬 서버로 연다.
- 배포 직후 10분쯤 예전 파일이 보일 수 있다(GitHub Pages 캐시). → 강력 새로고침으로 해결. 지금 단계에서는 따로 처리하지 않는다.

대안

| 대안 | 장점 | 단점 |
|---|---|---|
| B. Vite 같은 빌드 도구 + GitHub Actions 자동 배포 | 파일 묶기·압축, 캐시 문제 자동 처리, npm 패키지(백엔드 SDK 등)를 쓰기 쉬움 | node 설치와 `package.json` 관리, Pages 소스를 "GitHub Actions"로 바꿔야 함(지금 설정 변경), 시안(`design/`)도 빌드 결과에 복사해야 함, 고칠 때마다 빌드 |
| C. React·Vue 같은 프레임워크 + Vite | 화면이 아주 많아질 때 정리하기 좋음 | 지금 규모에는 너무 큼. 배울 것·고칠 것이 많아짐 |

### 3.2 라우팅(화면 주소) 방식 — **사용자 승인 필요 (질문 2)**

**추천: 해시 주소** — 예: `https://eversunk2-tech.github.io/card-lab1/#/select`

이유

1. GitHub Pages에는 "없는 경로를 `index.html`로 돌려주는" 설정이 없다. 일반 주소(`/card-lab1/select`)는 새로고침하면 404가 난다.
2. `#` 뒤는 서버로 가지 않으므로 어떤 화면에서 새로고침·즐겨찾기·링크 공유를 해도 항상 `index.html`이 열리고, 앱이 주소를 보고 화면을 고른다.
3. 시안에서 같은 방식이 실제 Pages 주소에서 잘 동작하는 것을 이미 확인했다.
4. 단점은 주소에 `#`이 보이는 것뿐이다. 검색 노출용 사이트가 아니므로 문제 없다.

대안

| 대안 | 장점 | 단점 |
|---|---|---|
| B. 화면마다 HTML 파일 (`select.html`, `dashboard.html` …) | 새로고침 안전, 주소에 `#` 없음 | 머리 부분·그림 모음을 파일마다 반복, 화면 이동마다 전체를 다시 불러와 글꼴이 깜빡임, 게임 자리 화면이 파일 4개 |
| C. 일반 주소 + `404.html` 우회 | 주소가 깔끔함 | 첫 접속이 404를 거치는 꼼수라 불안정. 비추천 |

### 3.3 데이터·로그인은 "한 겹"을 거친다 (설계 원칙, 확정)

```
화면 (js/screens, js/ui)
   │  import는 js/services/index.js 한 곳에서만
   ▼
js/services/index.js  ──→  mock/      (지금: 가짜 데이터·가짜 로그인)
                      └─→  <백엔드>/  (나중: 같은 함수 이름, 같은 입력·출력 모양)
```

규칙

1. 화면 코드는 `js/services/index.js`에서 `auth`, `data`, `prefs` 세 가지만 가져온다. `mock/` 폴더를 직접 가져오지 않는다.
2. 화면 코드는 `localStorage`, `sessionStorage`, `fetch`를 직접 쓰지 않는다. 저장·통신은 모두 services 안에서만.
3. `auth`와 `data`의 모든 함수는 **Promise를 돌려준다**(가짜도). 나중에 네트워크로 바뀌어도 화면 코드는 그대로다.
4. 돌려주는 값은 "날것"이다: 숫자, ISO 시각 문자열, id. `"1분 42초"`, `"오늘 09:12"` 같은 글자 모양은 화면 쪽 `js/lib/format.js`가 만든다.
5. 돌려줄 때는 깊은 복사(`structuredClone`)를 해서, 화면이 값을 고쳐도 가짜 데이터 원본은 바뀌지 않게 한다.
6. 로그인 결과는 `{ ok: true, user, notice? }` 또는 `{ ok: false, code }` 모양이다. `notice`는 가짜 로그인만 채우는 안내 문장이다(예: "체험 화면이라 예시 학생 ‘김하린’으로 들어가요."). 진짜 백엔드는 비워 둔다.
7. 백엔드를 붙일 때는 `js/services/<백엔드이름>/`을 만들어 같은 함수를 구현하고, `js/services/index.js`의 내보내기 한 줄만 바꾼다.

### 3.4 비밀값 (공개 저장소)

이번 단계에는 비밀값을 넣을 자리를 만들지 않는다. 나중에도 **브라우저로 보내는 코드는 누구나 볼 수 있으므로 프런트엔드에는 "공개돼도 되는 값"(공개용 클라이언트 ID 등)만 두고, 진짜 비밀값은 백엔드 서비스 콘솔·서버 환경 변수·GitHub Secrets에만 둔다. 내 컴퓨터용 설정 파일(`.env*`, `*.local.*`)은 `.gitignore`로 저장소에서 뺀다.**

또, 공개 저장소이므로 가짜 데이터에는 **실제 학생·교사 이름을 절대 넣지 않는다.**

### 3.5 배포 (GitHub Pages)

- 저장소 `eversunk2-tech/card-lab1`, `main` 브랜치 루트를 그대로 내보낸다. 설정 변경 없음.
- 루트에 `index.html`이 생기면 첫 주소(`/card-lab1/`)에 README 대신 앱이 열린다.
- 빈 파일 `.nojekyll`을 둔다 → Jekyll 변환 없이 파일을 그대로 내보낸다(배포가 빠르고 예측 가능). 시안 `/card-lab1/design/mockup.html`은 그대로 열린다.
- 모든 경로는 **상대 경로**(`css/…`, `js/…`, `assets/…`)로 쓴다. `/`로 시작하는 경로는 `/card-lab1/` 아래에서 깨지므로 쓰지 않는다.

### 3.6 지원 브라우저

교실에서 쓰는 기기를 기준으로 한다: 크롬북·윈도 PC의 Chrome / Edge / 웨일, 아이패드 Safari(iPadOS 16 이상), 안드로이드 태블릿 삼성 인터넷·Chrome. 각 최신 2개 버전.

### 3.7 내 컴퓨터에서 보기

프로젝트 폴더에서 `python3 -m http.server 8000` 실행 → 브라우저에서 `http://localhost:8000/` 열기. (이 컴퓨터에서는 바탕화면 폴더 제한 때문에 임시 폴더에 복사한 뒤 띄운다. `.claude/launch.json`은 만들지 않는다.)

---

## 4. 파일 구조

`★` = 이번에 새로 만드는 것. 나머지는 손대지 않는다.

```
/  (저장소 루트 = https://eversunk2-tech.github.io/card-lab1/)
├── index.html                ★ 앱의 유일한 HTML. 글꼴·CSS 연결, SVG 그림 모음(인라인), 건너뛰기 링크, #app, 토스트 자리, js/app.js
├── .nojekyll                 ★ 빈 파일. Pages가 Jekyll 변환 없이 파일을 그대로 내보내게 함
├── .gitignore                ★ .env, .env.*, *.local.*, .DS_Store 를 저장소에서 뺌
├── README.md                   (3줄 추가) 앱 주소, 시안 주소, 내 컴퓨터에서 보는 법
├── assets/
│   └── favicon.svg           ★ 탭 아이콘. 노란 네모 + 3px 검정 테두리 + 오른쪽 아래 하드 섀도 + 검정 "F"(굵은 고딕)
├── css/
│   ├── tokens.css            ★ DESIGN.md 토큰 → CSS 변수 (색, 글꼴, 그림자, 모서리, 간격, 글자 크기, 움직임)
│   ├── base.css              ★ 초기화, 본문 글자, 포커스, sr-only, 건너뛰기 링크, .screen 틀, 움직임 줄이기
│   ├── components.css        ★ 공통 부품: 아이콘, 망점, 창, 버튼, 스티커, 입력 칸, 알림, 스위치, 칩, 아바타, 막대, 단계 목록, 게임 색 테마, 토스트
│   ├── bars.css              ★ 상단 바 3종(topbar, subbar, hud)과 로고·모드 태그·플레이어 표시
│   └── screens/
│       ├── intro.css         ★ 인트로 (검은 띠, 포스터, 미리보기 창, 오늘의 단어 띠)
│       ├── login.css         ★ 학생·교사 로그인 공통 (마스코트, 말풍선, 폼, 메모 카드)
│       ├── select.css        ★ 게임 선택 (카트리지, READY.EXE)
│       ├── play.css          ★ 게임 자리 화면
│       ├── dashboard.css     ★ 교사 대시보드
│       └── lost.css          ★ 길을 잃었어요 / 오류 화면
├── js/
│   ├── app.js                ★ 시작점. 라우터 시작, 토스트·발음 듣기 공통 연결, iOS 누름 표시 보정
│   ├── router.js             ★ 해시 주소 해석, 화면 바꾸기, 로그인 확인, 제목·스크롤·포커스 처리
│   ├── routes.js             ★ 주소 목록 (주소 ↔ 화면 모듈 ↔ 필요한 로그인)
│   ├── content/
│   │   └── games.js          ★ 게임 4종 고정 정보 (번호, 라벨, 이름, 색, 그림, 설명, 놀이 방법, 기록 종류)
│   ├── services/             ★ 데이터 한 겹. 화면은 index.js만 부른다
│   │   ├── index.js          ★ 입구. 지금은 mock을 내보냄 (백엔드 붙일 때 이 파일만 바꿈)
│   │   ├── prefs.js          ★ 연습 모드·효과음 설정 (localStorage, 실패해도 동작)
│   │   └── mock/
│   │       ├── fixtures.js   ★ 가짜 데이터 전부 (반, 교사, 학생 24명, 주간 기록, 게임 기록, 단어 20개, 자주 틀린 단어)
│   │       ├── auth.js       ★ 가짜 로그인 (sessionStorage에 역할과 id만)
│   │       └── data.js       ★ 가짜 데이터 읽기 함수 (fixtures → 화면이 받을 모양, 집계 계산)
│   ├── screens/
│   │   ├── intro.js          ★ 인트로
│   │   ├── student-login.js  ★ 학생 로그인
│   │   ├── teacher-login.js  ★ 교사 로그인
│   │   ├── select.js         ★ 게임 선택
│   │   ├── play.js           ★ 게임 자리 화면 (4종 공통, 주소의 게임 이름으로 구분)
│   │   ├── dashboard.js      ★ 교사 대시보드
│   │   └── lost.js           ★ 길을 잃었어요 / 오류 화면
│   ├── ui/
│   │   ├── parts.js          ★ 여러 화면이 같이 쓰는 마크업 조각 (아이콘, 게임 그림, 창 제목줄, 로고, 플레이어, 아바타, 뒤로 버튼)
│   │   ├── login-form.js     ★ 로그인 폼 공통 동작 (빈 칸 검사, 흔들림, 보기/숨기기, 구글 버튼 로딩, 제출 중 표시)
│   │   ├── toast.js          ★ 토스트
│   │   └── speech.js         ★ 발음 듣기
│   └── lib/
│       ├── html.js           ★ 안전한 html`` 템플릿 (넣는 값을 자동으로 이스케이프)
│       └── format.js         ★ 날짜·시간·숫자·기록 글자 만들기 (Asia/Seoul 기준)
├── design/                     (그대로 둠) DESIGN.md, mockup.html — 참고 자료
├── instructions/               (그대로 둠) 서브에이전트 지침
├── CLAUDE.md                   (그대로 둠)
└── spec.md                     (이 문서)
```

**Build 수정 범위**: 위 `★` 파일 생성 + `README.md` 3줄 추가. `design/`, `instructions/`, `CLAUDE.md`, `spec.md`는 고치지 않는다.

---

## 5. 라우팅

### 5.1 주소 목록

| 주소 | 화면 | 로그인 필요 (질문 4 추천안 기준) | 화면 모듈 |
|---|---|---|---|
| `#/` (또는 `#` 없음, `#`만) | 인트로 | — | `intro.js` |
| `#/login/student` | 학생 로그인 | — | `student-login.js` |
| `#/login/teacher` | 교사 로그인 | — | `teacher-login.js` |
| `#/select` | 게임 선택 (기본 게임 선택됨) | 학생 | `select.js` |
| `#/select/:game` | 게임 선택 (그 게임 선택됨) | 학생 | `select.js` |
| `#/play/:game` | 게임 자리 화면 | 학생 | `play.js` |
| `#/dashboard` | 교사 대시보드 | 교사 | `dashboard.js` |
| 그 밖의 모든 주소 | 길을 잃었어요 | — | `lost.js` |

`:game`은 `memory` | `jewel` | `listen` | `speed` 중 하나.

### 5.2 주소 해석 규칙

1. `location.hash`에서 `#`를 떼고, `?` 뒤는 버리고, 소문자로 바꾸고, 끝의 `/`를 지운다(`/`만 남으면 그대로). 빈 값은 `/`.
2. `/`로 시작하지 않는 해시(시안 주소 `#intro` 등)는 "없는 주소"로 본다.
3. 경로 조각을 `routes.js`의 패턴과 차례로 맞춘다. `:game`은 위 4개 중 하나여야 맞는다.
4. `#/select/abc`처럼 게임 이름이 틀리면 게임 선택 화면을 기본 선택으로 그리고, 주소를 `#/select`로 조용히 바꾼다(`history.replaceState`).
5. `#/play/abc`, `#/play`처럼 게임이 틀리거나 없으면 길을 잃었어요 화면.

### 5.3 라우터 동작 (`js/router.js`)

공개 함수

| 함수 | 하는 일 |
|---|---|
| `start(routes)` | `hashchange`를 듣고 첫 화면을 그린다 |
| `navigate(path, { replace = false } = {})` | `#` 없는 경로(`'/select'`)를 받아 이동. `replace`면 `location.replace('#' + path)`로 지금 기록을 바꾼다. 지금 주소와 같으면 `hashchange`가 안 생기므로 직접 다시 그린다 |
| `setPathQuietly(path)` | `history.replaceState`로 주소만 바꾸고 **화면은 다시 그리지 않는다**(기록도 늘지 않음). 카트리지를 고를 때 쓴다 |
| `reload()` | 지금 화면을 다시 그린다(오류 화면의 "다시 시도") |

그리는 순서 (주소가 바뀔 때마다)

1. 주소 해석 → 맞는 경로와 `params` 찾기.
2. 로그인 확인: 경로에 필요한 역할이 있고 `await auth.getCurrentUser()`의 `role`이 다르면 → 학생 경로는 `navigate('/login/student', { replace: true })`, 교사 경로는 `navigate('/login/teacher', { replace: true })` 하고 토스트 "먼저 로그인해 주세요." 후 멈춘다(바뀐 주소가 다시 그리기를 부른다).
3. 이번 그리기에 번호를 붙인다. `await mod.load(ctx)` 동안 다른 주소로 바뀌면 이 결과는 버린다(빠르게 눌러도 화면이 뒤섞이지 않게).
4. `load`가 실패하면 오류 화면(7.8절)을 그린다. 주소는 그대로.
5. 이전 화면의 정리 함수 실행 → `#app`에 새 화면 마크업 넣기 → `document.title` 바꾸기 → 맨 위로 스크롤 → (첫 화면이 아닐 때만) 새 화면의 `h1`에 포커스(`tabindex="-1"`) → `mod.mount()` 실행, 돌려받은 정리 함수 보관.

화면 모듈 규칙 (모든 `js/screens/*.js`)

```js
export const title = (data, ctx) => '게임 고르기';          // document.title 앞부분. 뒤에 " · Fun English"를 라우터가 붙인다
export async function load(ctx) { /* services만 사용 */ return data; }
export function view(data, ctx) { return html`...`; }      // 마크업만. 이벤트 없음
export function mount(root, data, ctx) { /* 이벤트 연결 */ return () => { /* 떠날 때 정리 */ }; }
// ctx = { params, user, services, navigate, setPathQuietly, toast, speak, reduceMotion }
```

### 5.4 화면 사이 이동

| 어디서 | 무엇을 | 어디로 | 기록 |
|---|---|---|---|
| 인트로 | 학생 로그인 | `#/login/student` | 추가 |
| 인트로 | 교사 로그인 | `#/login/teacher` | 추가 |
| 학생 로그인 | 처음으로 | `#/` | 추가 |
| 학생 로그인 | 교사 로그인 | `#/login/teacher` | 추가 |
| 학생 로그인 | 구글 계정으로 로그인 (0.9초 로딩) / 시작하기! | `#/select` + 안내 토스트 | **바꿈**(뒤로 가기로 로그인 폼에 돌아오지 않게) |
| 교사 로그인 | 처음으로 | `#/` | 추가 |
| 교사 로그인 | 구글 계정으로 로그인 / 대시보드로 가기 | `#/dashboard` + 안내 토스트 | 바꿈 |
| 게임 선택 | 카트리지 고르기 | `#/select/<게임>` | **조용히 바꿈**(화면 다시 안 그림) |
| 게임 선택 | START | `#/play/<게임>` | 추가 |
| 게임 선택 | 로그아웃 | `#/` + 토스트 "로그아웃했어요." | 바꿈 |
| 게임 자리 | 게임 고르기 (위 바, 오른쪽 창 두 곳) | `#/select/<게임>` | 추가 |
| 대시보드 | 로그아웃 | `#/` + 토스트 "로그아웃했어요." | 바꿈 |
| 길을 잃었어요 | 처음으로 | `#/` | 추가 |

- 학생으로 로그인한 뒤에는 원래 가려던 주소와 상관없이 `#/select`로 간다. 교사는 `#/dashboard`.
- 로그인 화면에서 로딩 중에 다른 화면으로 떠나면, 로딩이 끝나도 이동하지 않는다(정리 함수가 `alive = false`로 막는다).

### 5.5 없는 주소 처리

| 들어온 주소 | 결과 |
|---|---|
| `…/card-lab1/`, `#`, `#/` | 인트로 |
| `#/select/` (끝 슬래시), `#/SELECT` | `#/select`와 같음 |
| `#/select/abc` | 게임 선택(기본 선택), 주소를 `#/select`로 조용히 바꿈 |
| `#/play`, `#/play/abc` | 길을 잃었어요 |
| `#/아무거나`, `#intro`(시안 방식) | 길을 잃었어요 |
| 로그인 없이 `#/select`, `#/play/…` | 학생 로그인 + "먼저 로그인해 주세요." |
| 로그인 없이(또는 학생으로) `#/dashboard` | 교사 로그인 + "먼저 로그인해 주세요." |

---

## 6. 공통 요소

**원칙**: CSS·SVG·마크업은 `design/mockup.html`에서 **그대로 옮긴다**(클래스 이름 유지). 시안 값(간격·글자 크기)을 바꾸지 않는다. 새로 만드는 부분(게임 자리, 길을 잃었어요)만 6.1절의 간격·크기 토큰을 쓴다.

### 6.1 토큰 (`css/tokens.css`)

시안 11–27줄의 `:root`를 그대로 옮기고, 아래를 더한다.

| 토큰 | 값 | DESIGN.md 연결 / 쓰는 곳 |
|---|---|---|
| `--paper` `--paper-2` `--paper-3` `--ink` `--ink-2` | 시안 그대로 | 색 표 |
| `--red` `--cobalt` `--yellow` `--night` `--green` | 시안 그대로 | 색 표 |
| `--line` (3px solid ink) | 시안 그대로 | 간격과 모양 — 테두리 3px |
| `--hs-1` `--hs-2` `--hs-3` (4/6/10px) | 시안 그대로 | 빛과 층 — 하드 섀도 3단계 |
| `--r-1` (6px) | 시안 그대로 | 버튼·입력 모서리 |
| `--f-title` `--f-dot` `--f-body` | 시안 그대로 | 글꼴 표 |
| `--t-fast` `--t-mid` `--t-slow` (120/240/400ms), `--pop` | 시안 그대로 | 움직임 |
| `--gut` (48 / 24 / 16px) | 시안 그대로 | 화면 좌우 여백 |
| **새로** `--r-win: 4px` | 창 모서리 | 간격과 모양 |
| **새로** `--r-cart: 14px 14px 6px 6px` | 카트리지 모서리 (시안 값. DESIGN.md의 12px과 다름 → 13장) | 간격과 모양 |
| **새로** `--red-tint: #ffe1d6` | 오류 알림 바탕 (시안 `.alert`에 흩어져 있던 값) | 위험·오류 |
| **새로** `--red-tint-2: #fff4ef` | 잘못 적은 입력 칸 바탕 | 위험·오류 |
| **새로** `--paper-dim: #faf5ea` | 기록 없는 학생 줄 바탕 | 빈 상태 |
| **새로** `--ink-3: #6b6253` | 입력 칸 예시 글자 (paper-2 위 5.9:1) | 보조 글자 |
| **새로** `--night-ink: #0d0b14` | 밤색 창 안 카드 테두리·그림자 | 그림 체계 |
| **새로** `--sp-1`…`--sp-8` | 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64px | 간격 4px 단위 |
| **새로** `--fs-12`…`--fs-96` | 12 · 14 · 16 · 20 · 28 · 40 · 64 · 96px | 글자 크기 단계 |

색 hex 값은 `tokens.css`와 SVG 그림 모음(index.html) 밖에 쓰지 않는다. 광택·주사선용 반투명 흰색(`rgba(255,255,255,…)`, `rgba(255,253,247,…)`)과 스위치 안쪽 그림자(`rgba(20,20,20,.18)`)는 시안 그대로 허용.

### 6.2 시안 CSS를 어디로 옮기나

| 시안 CSS 구역 (`mockup.html`) | 줄 | 옮길 곳 |
|---|---|---|
| 토큰 | 11–27 | `tokens.css` |
| 기본 (`*`, `html`, `body`, `button,input`, 제목 초기화, `:focus-visible`, `.sr-only`, `.num`, `.dot`) | 29–41 | `base.css` |
| 아이콘 `.i` `.i--lg` `.i--star` `.i--flame` | 42–45 | `components.css` |
| `.screen` | 47–48 | `base.css` — `display:flex`로 고정 (숨김·보임 토글은 없앰. 한 번에 한 화면만 그린다) |
| 망점 원 `.halftone` | 50–53 | `components.css` |
| 창 `.win*`, `.scan` | 55–64 | `components.css` |
| 버튼 `.btn*`, `.spin`, `.gloss`, `.sheen`, `.linkbtn` | 66–86 | `components.css` |
| 스티커 `.sticker*`, `@keyframes pop` | 88–93 | `components.css` |
| `.subbar`, `.logo`, `.mode`, `.player` | 95–103 | `bars.css` |
| `.avatar*`, `.chip` | 104–109 | `components.css` |
| `.ribbon`, `.today*` | 112–117, 145–150 | `screens/intro.css` |
| `.topbar`, `.tag` | 118–120 | `bars.css` |
| 인트로 나머지 (`.intro`, `.poster`, `.lead`, `.cta-row`, `.hint`, `.mm*`, `.mcard*`) | 121–144 | `screens/intro.css` |
| `.field`, `.input`, `.pw*`, `.g-mark`, `.or`, `.alert`, `@keyframes shake` | 164–179 | `components.css` |
| 로그인 나머지 (`.login*`, `.mascot`, `.bit`, `.bubble`, `.form`, `.help`, `.tl`, `.notes`, `.note`) | 152–188 | `screens/login.css` |
| `.hud` | 191–192 | `bars.css` |
| `.t-memory` `.t-jewel` `.t-listen` `.t-speed` (+ 222줄) | 218–222 | `components.css` (게임 자리·대시보드도 씀) |
| `.mini-h`, `.steps` | 229–232 | `components.css` (게임 자리도 씀) |
| `.switch-row`, `.sw`, `.switch` | 240–247 | `components.css` |
| 게임 선택 나머지 | 193–239 | `screens/select.css` |
| `.bar` | 294–295 | `components.css` |
| 대시보드 나머지 | 250–308 | `screens/dashboard.css` |
| `.proto` (시안 탐색 도구) | 311–319 | **버림** |
| `.toast` | 320–321 | `components.css` (`bottom: 24px`로 → 13장) |
| 반응형 | 323–385 | 각 파일에서 해당 부품 바로 아래로 나눠 옮김 (같은 너비 기준값 유지) |
| 움직임 줄이기 | 386–389 | `base.css` (새 애니메이션 포함, 9장) |

CSS를 고쳐야 하는 곳

- 올림(`:hover`) 효과는 모두 `@media (hover: hover) { … }` 안으로 옮긴다(터치 기기에서 눌렀다 뗀 뒤 떠 있는 채로 남지 않게). 대상: `.btn:hover`, `.btn--xl:hover`, `.cart:hover`, `.side button:hover`, `.sheen:hover::after`.
- 제목 태그가 바뀌므로(9.1절) 태그 선택자를 클래스로 바꾼다: `.form h2` → `.form__title`, `.ready__hero h3` → `.ready__name`, `.notes h3` → `.notes__title`, `.kpi__label`은 그대로(h3 → h2여도 클래스로 잡힘).
- 밤색 창 안 포커스: `.win--night :focus-visible { outline-color: var(--yellow) }` (코발트는 밤색 위에서 잘 안 보임).
- `body`에 `-webkit-tap-highlight-color: transparent` (누름 효과를 우리가 직접 그리므로).
- `.today__right`의 `margin-right:180px` 삭제(시안 탐색 도구 자리였음).

### 6.3 창 `.win`

| 클래스 | 모양 | 쓰는 곳 |
|---|---|---|
| `.win` | paper-2 바탕, 3px 테두리, 모서리 4px, `--hs-2` | 모든 창 |
| `.win__bar` > `.win__box` · `.win__title` · `.win__box` | 40px 줄무늬 제목줄, 가운데 창 이름(Silkscreen 14px) | 모든 창 |
| `.win__body` | 안쪽 여백 32px (640px 이하 22px) | |
| `.win--cobalt` | 창 이름 바탕 코발트 + 흰 글자 | 교사 로그인 `TEACHER.EXE` |
| `.win--night` + `.scan` | 몸통 밤색 + 아주 얕은 주사선 | 인트로 미리보기 `FUNENG.EXE`, 게임 자리 `<GAME>.EXE` |

창 이름 목록: `FUNENG.EXE`(인트로), `LOGIN.EXE`(학생 로그인), `TEACHER.EXE`(교사 로그인), `READY.EXE`(게임 선택), `MEMORY.EXE`·`JEWEL.EXE`·`LISTEN.EXE`·`SPEED.EXE`·`GUIDE.EXE`(게임 자리), `STUDENTS.EXE`·`WORDS.EXE`(대시보드), `LOST.EXE`·`ERROR.EXE`(길을 잃었어요·오류).

마크업 조각: `parts.winBar(title)` → `<div class="win__bar"><i class="win__box"></i><span class="win__title">${title}</span><i class="win__box"></i></div>`

### 6.4 버튼 `.btn`

| 변형 | 모양 | 쓰는 곳 |
|---|---|---|
| `.btn` | paper-2, 3px 테두리, `--hs-1`, 높이 48px | 기본 |
| `.btn--primary` | 빨강(주색) | 학생 로그인, 시작하기!, START, 학생 아이디 만들기, 게임 고르기로(게임 자리), 처음으로(길을 잃었어요) |
| `.btn--cobalt` | 코발트 + 흰 글자 | 대시보드로 가기 |
| `.btn--xl` | 높이 72px(640px 이하 64px), 글자 24px, `--hs-2` | 큰 주 버튼 |
| `.btn--sm` | 높이 44px, 글자 15px | 상단 바 버튼 |
| `.btn--icon` | 44×44 | 자주 틀린 단어의 스피커 |
| `.btn--block` | 너비 100% | 폼, 오른쪽 창 |
| `.gloss` | 윗부분 흰 타원 하이라이트(광택 코팅) | 주 버튼 |
| `.sheen` | 올렸을 때 빛 한 번 | **학생 로그인, 시작하기!, START에만** (DESIGN.md) |
| `.linkbtn` | 밑줄 글자 버튼 | 비밀번호를 잊었어요 |

상태: 기본 / 올림(2px 떠오르고 그림자 6px, `hover: hover` 기기만) / 누름(그림자 위치까지 내려앉음, 120ms) / 포커스(4px 코발트 외곽선, 4px 띄움) / 로딩(`aria-busy="true"`: paper-3 바탕, `.spin` 보임, 클릭 막기).

### 6.5 스티커 `.sticker`

노랑 바탕(기본), 3px 테두리, `--hs-1`, Gasoek One, 기울기 `--rot`, 윗부분 광택, 튀어나오기(240ms, `--pop`). 둥근 스티커 `.sticker--round`(`--size`). 쓰는 곳: 인트로 "NEW! 보석 게임"(빨강 둥근)·"게임 4가지", 게임 선택 "오늘의 미션 ★×2"(빨강), 게임 자리 "준비 중"(노랑 둥근). 스티커는 모두 `aria-hidden="true"`이고 필요한 뜻은 `sr-only` 글로 따로 준다.

### 6.6 입력 칸과 알림

- `.field` > `label` + `.input`. 높이 54px, 안쪽 그림자 `inset 3px 3px 0 var(--paper-3)`(파인 칸).
- 비밀번호: `.pw` 안에 `.input` + `.pw__toggle`(보기/숨기기, `aria-pressed`, `aria-controls`).
- 오류: `.input[aria-invalid="true"]` → 빨간 테두리 + `--red-tint-2` 바탕. 알림 `.alert`는 `--red-tint` 바탕 + 노란 느낌표 아이콘 + 문장, 보일 때 좌우로 흔들림(320ms).
- **알림 동작 (시안과 다름 → 13장)**: `.alert`는 처음부터 `role="alert"`로 비어 있게 두고, 오류가 생길 때 문장을 넣으며 `.is-on`을 붙인다(문장이 새로 들어가야 화면 낭독기가 읽는다). 잘못된 칸에는 `aria-describedby="<알림 id>"`를 붙인다.

### 6.7 스위치 `.switch`

`button[role="switch"][aria-checked]`, 64×36, 켜지면 초록 바탕 + 동그라미 오른쪽. 옆에 "켜짐/꺼짐" 글자를 같이 보여 준다(`.switch-state`, 색만으로 알리지 않음). 이름은 `aria-labelledby`로 왼쪽 설명과 연결.

### 6.8 토스트 `#toast`

`index.html`에 하나만 있고(`role="status"`, `aria-live="polite"`) 화면이 바뀌어도 남는다. 노랑 바탕, `--hs-3`, 화면 아래 가운데(`bottom: 24px`), 2.8초 뒤 사라짐. `ui/toast.js`의 `toast(message)`.

토스트 문장 모음 (Review가 확인)

| 언제 | 문장 | 어디서 만드나 |
|---|---|---|
| 구글 로그인 (학생·교사) | 체험 화면이라 바로 넘어가요. 진짜 구글 로그인은 백엔드를 정한 뒤 연결해요. | mock auth의 `notice` |
| 아이디 로그인 (학생) | 체험 화면이라 예시 학생 ‘김하린’으로 들어가요. | mock auth의 `notice` |
| 이메일 로그인 (교사) | 체험 화면이라 예시 선생님 ‘박지수’로 들어가요. | mock auth의 `notice` |
| 비밀번호를 잊었어요 | 비밀번호 찾기는 로그인 방식을 정한 뒤 연결해요. | 화면 |
| 학생 아이디 관리 / 만들기 | 학생 아이디 관리는 다음 단계에서 만들어요. | 화면 |
| 로그인 없이 보호된 주소 | 먼저 로그인해 주세요. | 라우터 |
| 로그아웃 | 로그아웃했어요. | 화면 |
| 발음 듣기를 못 쓰는 브라우저 | 이 브라우저에서는 발음 듣기를 쓸 수 없어요. | `ui/speech.js` |

공통 연결: `app.js`가 문서 전체에서 `[data-toast]` 클릭 → `toast(그 값)`, `[data-speak]` 클릭 → `speak(그 값)`을 한 번에 처리한다(화면을 새로 그려도 다시 연결할 필요 없음).

### 6.9 SVG 그림 모음

시안 395–504줄의 `<svg width="0" height="0" …><defs>…</defs></svg>`를 **그대로** `index.html`의 `<body>` 바로 아래에 넣는다. 화면은 `<use href="#…">`로 쓴다.

| id | 그림 | 쓰는 곳 |
|---|---|---|
| `i-arrow` `i-back` `i-speaker` `i-star` `i-flame` `i-key` `i-door` `i-check` `i-alert` `i-plus` | 선 아이콘 24×24 | 버튼, 칩, 알림 |
| `apple` | 사과 (단어 그림 카드 예시) | 인트로 미리보기, `art-memory` 안 |
| `art-memory` `art-jewel` `art-listen` `art-speed` | 게임 그림 120×96 | 카트리지, READY, 게임 자리, 대시보드 KPI |
| `bit` | 마스코트 비트 160×170 | 학생 로그인에만 (질문 5) |

마크업 조각: `parts.icon(id, extraClass)` → `<svg class="i …" aria-hidden="true"><use href="#id"/></svg>`, `parts.art(gameId, className)` → `<svg class="…" viewBox="0 0 120 96" aria-hidden="true"><use href="#art-<gameId>"/></svg>`.

그림 체계(DESIGN.md): 3px 검정 외곽선, 팔레트 단색, 그라데이션 없음, 윗면 하이라이트 하나, 오른쪽 아래 하드 섀도. 새 그림을 그리면 이 규칙을 따른다(이번에는 `favicon.svg`만 새로 그린다).

### 6.10 상단 바들 (`css/bars.css`)

| 바 | 구성 | 화면 |
|---|---|---|
| `.ribbon` (검은 띠, 흐르는 글자) | `SEASON 1 ★ 4 GAMES ★ WORD PACK … ★ TODAY'S WORD … ★ CLASS BEST …` 두 번 반복, `aria-hidden` | 인트로 (intro.css) |
| `.topbar` | 왼쪽 `.tag`(검은 `.mode` "SEASON 1" + "초등 영어 단어 게임"), 오른쪽 "교사 로그인" `.btn--sm` | 인트로 |
| `.subbar` | 뒤로 버튼(`i-back` + 글자, 480px 이하는 아이콘만 + `aria-label`) · `.logo` · (선택) `.mode` 태그 · 오른쪽 요소 | 학생·교사 로그인, 게임 자리, 대시보드, 길을 잃었어요 |
| `.hud` | `.logo` · `.player` · 별 칩 · 연속 칩 · 로그아웃 | 게임 선택 |

공통 조각 (`ui/parts.js`)

- `logo({ teacher = false, hideEnglishOnSmall = false })` → `<p class="logo" lang="en">Fun <span class="outline">English</span>[ <span class="mode">TEACHER</span>]</p>`
- `avatar({ label, color, size })` → `<span class="avatar avatar--<color>[ avatar--sm]" aria-hidden="true">label</span>` (`color`: yellow는 클래스 없음, cobalt / red / paper)
- `player({ avatar, name, sub })` → `.player` (아바타 + `<b>이름</b><small>설명</small>`)
- `backButton({ href, text })` → `<a class="btn btn--sm" href="…" aria-label="text">아이콘 <span class="back-text">text</span></a>`

### 6.11 안전한 마크업 (`js/lib/html.js`)

```js
html`<b>${name}</b>`   // → SafeHtml. ${} 값은 자동 이스케이프(& < > " ')
raw(trustedString)     // 우리가 직접 쓴 마크업만 그대로 넣을 때
// 값 규칙: SafeHtml → 그대로 / 배열 → 각 항목에 같은 규칙 후 이어 붙임 / null·undefined·false → 빈 글자 / 그 밖 → String() 후 이스케이프
```

- 화면 마크업은 모두 `html`` `로 만든다. 나중에 DB에서 오는 학생 이름 등에 꺾쇠가 섞여도 안전하게.
- 속성 값은 항상 따옴표로 감싼다. 인라인 이벤트(`onclick=`)는 쓰지 않는다.
- `innerHTML`은 라우터가 화면을 넣을 때와 목록을 다시 그릴 때만, 항상 `String(html`…`)`으로 쓴다.

### 6.12 그 밖의 공통

- 망점 원 `.halftone`: `--c`로 점 색 지정. 인트로·학생 로그인·길을 잃었어요 = 빨강, 교사 로그인 = 코발트, 게임 자리 = 그 게임 색.
- 게임 색 테마 `.t-memory`(노랑/검정 글자) `.t-jewel`(밤색/흰 글자, 라벨 노랑) `.t-listen`(코발트/흰 글자) `.t-speed`(빨강/검정 글자): `--bg`, `--fg`를 정한다.
- 칩 `.chip`, 아바타 `.avatar`, 막대 `.bar` — 시안 그대로.
- 건너뛰기 링크 `.skip` (새로): "본문으로 건너뛰기". 평소엔 화면 밖, 포커스를 받으면 왼쪽 위(16px)에 노란 버튼 모양으로 나타난다. 클릭하면 `preventDefault()` 후 지금 화면의 `#main`에 포커스(주소의 해시를 바꾸지 않기 위해). 모든 화면의 `<main>`에 `id="main" tabindex="-1"`.

---

## 7. 화면별 명세

공통: 화면 하나 = `<div class="screen" data-screen="이름">` 안에 위 바(header) + `<main id="main" tabindex="-1">` (+ 인트로만 footer). 마크업은 시안의 해당 줄을 옮기고, 가짜 값이 박혀 있던 자리를 services에서 받은 값으로 바꾼다.

### 7.1 인트로 — `#/`

- 시안: 509–563줄. 제목: `Fun English · 초등 영어 단어 게임` (이 화면만 " · Fun English"를 붙이지 않는다)
- 데이터: `data.getIntro()`, 게임 수는 `GAMES.length`
- 구성 (위 → 아래)
  1. 검은 띠: `★ SEASON {season} ★ {GAMES.length} GAMES ★ WORD PACK: {pack.code} · {pack.wordCount} ★ TODAY'S WORD: {todayWord.en 대문자} {todayWord.ko} ★ CLASS BEST: {classBestScore 쉼표} PTS` (두 번 반복, 48초에 한 바퀴. 노랑 강조·한글 글꼴은 시안 512줄 그대로)
  2. topbar: SEASON 1 태그 / 교사 로그인(`#/login/teacher`)
  3. 왼쪽: `h1.poster` "Fun / English"(`lang="en"`), 소개 문장, 학생 로그인 `btn--primary btn--xl gloss sheen`(`#/login/student`) + 안내 "구글 계정이나 선생님이 만들어 준 아이디로 들어가요"
  4. 오른쪽: `FUNENG.EXE` 미리보기 창(카드 8장, PAIRS 3/8 · TIME 0:48 · ★12, COMBO x3 +300) + 스티커 2개. **꾸밈이므로 데이터가 아니라 `intro.js`에 고정**. `role="img"` + `aria-label="카드 뒤집기 게임 미리보기"`, 안쪽은 `aria-hidden`
  5. 빨간 띠 footer: `TODAY'S WORD` / `rabbit`(`lang="en"`) / `토끼` / 듣기 버튼(`data-speak="rabbit"`, `aria-label="rabbit 발음 듣기"`) / "이번 주 단어 **20**개 · 게임 **4**가지"
- 상태: 버튼 기본·올림·누름·포커스. 스티커 튀어나오기, 띠 흐름(움직임 줄이기면 멈춤)
- 반응형: 1280 두 칸 / 900px 이하 한 칸(미리보기가 아래, 최대 560px) / 480px 이하 태그 글자 숨김, 미리보기 HUD 12px / 360 포스터 56px, 소개 18px, 큰 버튼 64px

### 7.2 학생 로그인 — `#/login/student`

- 시안: 568–613줄. 제목: `학생 로그인`
- 데이터: 없음(문구 고정). 로그인은 `auth.signInStudentWithGoogle()`, `auth.signInStudentWithId({ loginId, password })`
- 구성
  1. subbar: 처음으로(`#/`) · 로고 · 교사 로그인(`#/login/teacher`, 640px 이하 "교사"만)
  2. 왼쪽: 말풍선 "Hello! 오늘도 같이 놀자!" + 마스코트 비트(`role="img"`, `aria-label="마스코트 비트"`)
  3. 오른쪽 `LOGIN.EXE` 창 안 폼(`novalidate`): `h1.form__title` "학생 로그인", "어떻게 들어갈까요? 둘 중 하나를 골라요.", 구글 버튼, "또는 선생님이 만든 아이디로", 알림 자리, 아이디(`autocomplete="username"`, `autocapitalize="none"`, `spellcheck="false"`, 예시 "예: hanbit4-07"), 비밀번호 + 보기, 시작하기!(`btn--primary btn--xl btn--block gloss sheen`, 안에 `.spin` 추가), "아이디가 생각나지 않으면 선생님께 물어보세요."
- 상태
  - **오류(빈 칸)**: 시작하기!를 눌렀는데 빈 칸이 있으면 → 알림에 "아이디와 비밀번호를 모두 적어 주세요." + 흔들림, 빈 칸마다 `aria-invalid="true"`, 첫 빈 칸에 포커스. 그 칸에 글자를 넣으면 `aria-invalid="false"`
  - **로딩(구글)**: 누르면 `aria-busy="true"`, G 표시 숨김, 스피너, 글자 "구글에 연결하는 중…" → 0.9초 뒤 원래대로 + `notice` 토스트 + `#/select`(바꿈)
  - **제출 중(새로)**: 시작하기! 누르고 빈 칸이 없으면 0.4초 동안 `aria-busy="true"` + 글자 "들어가는 중…" → `notice` 토스트 + `#/select`(바꿈)
  - 서비스가 `{ ok: false, code }`를 주면(가짜는 주지 않음, 다음 단계용 자리) 알림에 코드별 문장: `WRONG_CREDENTIALS` "아이디나 비밀번호가 맞지 않아요. 선생님께 물어보세요." / `NETWORK` "인터넷 연결을 확인하고 다시 해 봐요." / 그 밖 "지금은 들어갈 수 없어요. 잠시 뒤에 다시 해 봐요."
- 공통 동작은 `ui/login-form.js`: `bindLoginForm(form, { emptyMessage, onSubmit })`, `bindGoogleButton(button, { onClick })`. 둘 다 진행 중 두 번 누르기를 막는다.
- 반응형: 1280 마스코트(200px) | 창(520px) / 900px 이하 위아래로, 마스코트는 가로 줄(말풍선 오른쪽, 꼬리 왼쪽), 비트 110px / 480px 이하 뒤로 버튼 아이콘만 / 400px 이하 비트 88px, 말풍선 14px

### 7.3 교사 로그인 — `#/login/teacher`

- 시안: 618–665줄. 제목: `선생님 로그인`
- 데이터: 없음. 로그인은 `auth.signInTeacherWithGoogle()`, `auth.signInTeacherWithEmail({ email, password })`
- 구성
  1. subbar: 처음으로(`#/`) · 로고 + `TEACHER` 태그
  2. `TEACHER.EXE`(`.win--cobalt`): 왼쪽 폼 — `h1.form__title` "선생님 로그인", "학생들의 학습 기록을 보고, 학생 아이디를 만들어요.", 구글 버튼, "또는 이메일로", 알림 자리, 이메일(`type="email"`, 예시 `teacher@school.example`), 비밀번호 + 보기, 대시보드로 가기(`btn--cobalt btn--xl btn--block gloss`, `.sheen` 없음), 비밀번호를 잊었어요(`.linkbtn`, 토스트). 오른쪽 메모 카드 — "대시보드에서 할 수 있어요" / 01 학생별 학습 기록과 정답률, 자주 틀린 단어를 봐요. / 02 학생 아이디를 만들고 비밀번호를 다시 정해 줘요.
- 상태: 학생 로그인과 같음. 빈 칸 문장은 "이메일과 비밀번호를 모두 입력해 주세요." 성공하면 `#/dashboard`(바꿈). 이메일 형식 검사는 하지 않는다(다음 단계).
- 반응형: 1280 폼 | 메모(230px) / 900px 이하 메모가 아래 2칸 / 640px 이하 1칸

### 7.4 게임 선택 — `#/select`, `#/select/:game`

- 시안: 670–746줄. 제목: `게임 고르기`
- 데이터: `data.getStudentHome(user.id)`, 게임 정보는 `content/games.js`, 설정은 `prefs.getPrefs()`
- 구성
  1. hud: 로고 · 플레이어(아바타 "하"/노랑, **김하린**, "4학년 2반 · hanbit4-07" — 구글 로그인 학생이면 "4학년 2반 · 구글 계정") · 별 칩(`i-star` + **128** + sr "개의 별") · 연속 칩(`i-flame` + "5일 연속", 0이면 숨김) · 로그아웃(`<button>`, `i-door`)
  2. 왼쪽 머리: `h1.h-xl` "오늘은 어떤 게임?" + 단어 묶음 스티커(`ANIMALS` + "이번 주 단어 20개")
  3. 카트리지 4개 `.carts`(`role="group"`, `aria-label="게임 고르기"`): 게임마다 `button.cart.t-<id>[aria-pressed]` — 홈 줄무늬 / 라벨(번호 영문, 한글 이름, 그림) / 아래(학습 영역 칩, 최고 기록) / 선택 체크. 오늘의 미션 게임에는 빨간 스티커 "오늘의 미션 ★×{배수}" + sr "오늘의 미션, 별 {배수}배"
  4. 오른쪽 `READY.EXE`(`aside.win.ready.t-<id>`): 머리(영문 라벨, `h2.ready__name`, 그림, `aria-live="polite"`) / 설명 / "이렇게 놀아요" 3단계 / 첫 도전 띠 / 기록 3칸(최고 기록 · 해 본 횟수 · 마지막) / 연습 모드 스위치("시간 제한 없이 천천히") / 효과음 스위치 / START(`btn--primary btn--xl btn--block gloss sheen`, `START`는 Silkscreen)
- 기본 선택: 주소의 게임 → 없으면 오늘의 미션 게임(가짜 데이터에서 `listen`) → 없으면 `memory`
- 카트리지 기록 글자 (`format.js`)

  | 게임 | 기록 종류 | 카트리지 | READY 최고 기록 | 가짜 값 (김하린) |
  |---|---|---|---|---|
  | memory | time (짧을수록 좋음) | 최고 1분 42초 | 1분 42초 | 102000ms, 12번, 어제 |
  | jewel | score | 최고 2,340점 | 2,340점 | 2340, 7번, 3일 전 |
  | listen | correct | 최고 18/20 정답 | 18 / 20 | 18/20, 9번, 오늘 |
  | speed | score | 아직 기록 없음(`.rec--empty`) | — | 없음, 0번, 아직 없음 |

- 상태
  - 카트리지 기본·올림·누름·포커스·선택(`aria-pressed="true"`: 4px 더 떠오르고 `--hs-3`, 초록 체크 튀어나옴, 라벨에 8초마다 빛 한 번)
  - 카트리지를 고르면: 모든 카트리지 `aria-pressed` 갱신, READY의 테마 클래스·영문 라벨·이름·그림(`use`의 `href`)·설명·단계·기록을 **그 자리에서 글자만 바꾼다**(시안 방식. `aria-live` 영역을 지우고 다시 만들지 않는다), `setPathQuietly('/select/<id>')`, 1100px 이하면 READY로 스크롤(움직임 줄이기면 즉시)
  - **빈 상태**: 해 본 횟수 0 → 카트리지 "아직 기록 없음", READY에 첫 도전 띠 "첫 도전이에요! 끝까지 하면 별 +5"(`.ready.is-new`), 기록 칸 "—" · "0번" · "아직 없음"
  - 스위치: 누르면 `aria-checked`와 "켜짐/꺼짐" 글자가 바뀌고 `prefs.setPrefs()`로 저장 → 새로고침해도 유지
  - START → `navigate('/play/<id>')`
  - 로그아웃 → `auth.signOut()` → `navigate('/', { replace: true })` → 토스트 "로그아웃했어요."
- 반응형: 1280 카트리지 2×2 | READY 380px(위에 붙어 따라옴) / 1100px 이하 READY가 아래(최대 640px, 따라오지 않음) / 900px 이하 hud 로고 숨김 / 640px 이하 카트리지 1줄, 기록 칸 세로, 플레이어 설명 숨김 / 400px 이하 카트리지 그림 92×74, 이름 28px

### 7.5 게임 진행 흐름 메모

게임 선택 → START → 게임 자리 → "게임 고르기" → 같은 게임이 선택된 게임 선택 화면. 브라우저 뒤로 가기도 같은 결과다(카트리지를 고를 때 주소를 조용히 바꿔 두었기 때문).

### 7.6 게임 자리 화면 4종 — `#/play/:game` — **사용자 승인 필요 (질문 3)**

**추천 A안: "게임기 화면 + 곧 열려요"** — 게임 4종이 같은 틀을 쓰고, 색·라벨·그림·문구만 바뀐다. 다음 단계에서 왼쪽 창 안을 진짜 게임 판으로 바꾸면 된다.

```
┌ subbar ───────────────────────────────────────────────────────────┐
│ [← 게임 고르기]  Fun English  [01 MEMORY]               (하) 김하린 │
└───────────────────────────────────────────────────────────────────┘
      ( 망점 원: 게임 색 )
 ┌ [MEMORY.EXE] ─────────────────────────────┐  ┌ GUIDE.EXE ───────────┐
 │ 밤색 + 주사선                               │  │ 이렇게 놀 거예요       │
 │  ┌───────────┐   01 MEMORY                 │  │ 01 …                  │
 │  │ 게임 그림  │   카드 뒤집기          (h1)  │  │ 02 …                  │
 │  │ 220×176   │   COMING SOON_              │  │ 03 …                  │
 │  │   (준비 중)│   설명 한 줄                 │  │ 고른 설정              │
 │  └───────────┘   ○○ 판을 만들고 있어요.     │  │ [연습 모드 꺼짐]       │
 │                  곧 열려요!                 │  │ [효과음 켜짐]          │
 └─────────────────────────────────────────────┘  │ [← 게임 고르기로] 빨강  │
                                                  └───────────────────────┘
```

- 제목: `{게임 이름} 준비 중`. 데이터: `data.getStudentHome(user.id)`(플레이어 표시), `prefs.getPrefs()`, `content/games.js`
- 구성
  1. subbar: 뒤로 "게임 고르기"(`#/select/<id>`) · 로고 · `.mode` 태그 "01 MEMORY" · 플레이어(오른쪽). 좁은 화면에서 한 줄에 들어가도록 640px 이하는 플레이어 이름·설명을 숨기고 아바타만(이름은 sr-only), 480px 이하는 뒤로 버튼 아이콘만 + 로고 숨김
  2. 망점 원: `--c`를 게임 색으로(memory 노랑, jewel 밤색, listen 코발트, speed 빨강)
  3. 왼쪽 큰 창 `section.win.win--night.t-<id>.soon`: 창 이름 칸 바탕을 게임 색(`--bg`/`--fg`)으로. 몸통 `.scan`. 안에 2칸 — 왼쪽 게임 그림(220×176) + 노랑 둥근 스티커 "준비 중"(`--size:96px`, `--rot:10deg`, 그림 오른쪽 위에 겹침), 오른쪽 글: 영문 라벨(Silkscreen, 노랑) / `h1` 게임 이름(Gasoek One, `clamp(36px, 5vw, 56px)`, paper-2) / `COMING SOON` + 깜빡이는 `_`(Silkscreen 28px 노랑, 1초에 한 번, `aria-hidden`; 대신 sr-only "곧 열려요") / 설명(`games.desc`) / 준비 문장
  4. 오른쪽 창 `aside.win` `GUIDE.EXE`: `.mini-h` "이렇게 놀 거예요" + `.steps`(게임의 3단계) / `.mini-h` "고른 설정" + 칩 두 개 "연습 모드 켜짐|꺼짐", "효과음 켜짐|꺼짐" / "게임 고르기로" `btn--primary btn--xl btn--block gloss`(왼쪽에 `i-back`, `.sheen` 없음) → `#/select/<id>`
- 게임별 글

  | 게임 | 창 이름 | 라벨 | h1 | 준비 문장 |
  |---|---|---|---|---|
  | memory | MEMORY.EXE | 01 MEMORY | 카드 뒤집기 | 카드 판을 만들고 있어요. 곧 열려요! |
  | jewel | JEWEL.EXE | 02 JEWEL | 보석 게임 | 보석 판을 만들고 있어요. 곧 열려요! |
  | listen | LISTEN.EXE | 03 LISTEN | 듣고 고르기 | 듣기 판을 만들고 있어요. 곧 열려요! |
  | speed | SPEED.EXE | 04 SPEED | 스피드 퀴즈 | 퀴즈 판을 만들고 있어요. 곧 열려요! |

- 상태: 버튼 기본·올림·누름·포커스. 스티커 튀어나오기, 커서 깜빡임(움직임 줄이기면 멈춤). 왼쪽 창 안에는 누를 것이 없다.
- 반응형 (`play.css`, 새 CSS는 간격 토큰 사용): 1280 두 칸(`minmax(0,1fr) 340px`, 간격 `--sp-7`, 최대 너비 1200px) / 900px 이하 한 칸(GUIDE가 아래, 최대 640px), 창 안도 한 칸(그림 위, 글 아래, 가운데 정렬 아님·왼쪽 정렬) / 640px 이하 그림 160×128, 창 안 여백 22px / 360 가로 스크롤 없음

대안

- **B안**: A안 + 창 안 아래쪽에 "판 자리" 흐린 미리보기(메모리는 카드 뒷면 8장, 보석은 보석 격자, 듣기는 스피커와 그림 카드 4칸, 스피드는 시간 막대와 보기 4칸). 더 게임 같지만 그림 작업이 늘고, 아직 정하지 않은 판 크기를 미리 보여 주게 된다.
- **C안**: 자리 화면 없이 시안처럼 START를 누르면 토스트만. 가장 간단하지만 "START → 게임 화면" 흐름을 미리 만들어 둘 수 없다.

### 7.7 교사 대시보드 — `#/dashboard`

- 시안: 751–835줄. 제목: `학습 기록`
- 데이터: `data.getTeacherHome(user.id)`, `data.getClassWeekReport(classId)` (classId = 첫 번째 반)
- 구성
  1. subbar: 로고(640px 이하 "English" 숨김) + `TEACHER` · 플레이어(아바타 "박"/코발트, **박지수 선생님**, "한빛초 4학년 2반") · 로그아웃(`<button>`, 640px 이하 아이콘만 + sr "로그아웃")
  2. 왼쪽 메뉴 `nav.side`(`aria-label="대시보드 메뉴"`): "학습 기록"(`<a href="#/dashboard" aria-current="page">`) / "학생 아이디 관리" + 학생 수 **24**(`<button data-toast>`)
  3. 머리: `h1.h-lg` "{반 이름} 학습 기록" + "이번 주 · 11월 9일(월) – 11월 13일(금)" + 학생 아이디 만들기(`btn--primary gloss`, `i-plus`, 토스트)
  4. 요약 3칸 `.kpis` (각 `section`, 제목 `h2.kpi__label`)
     - 이번 주 참여(노랑): **21** / 24명, 칸 24개 중 21개 채움(`.pix`), "3명은 이번 주 기록이 없어요"(0명이면 "모두 참여했어요!")
     - 평균 정답률: **82**%, "▲ 지난주보다 4%p"(초록). 내려가면 "▼ 지난주보다 N%p"(paper-3 바탕), 같으면 "지난주와 같아요", 지난주 값이 없으면 숨김. 참여 0명이면 "—"
     - 가장 많이 한 게임: 그림 + **카드 뒤집기** **46**판. 없으면 "아직 없어요"
  5. `STUDENTS.EXE` 표: 거르기 칩 5개(`role="group"`, `aria-label="많이 한 게임으로 보기"`: 전체 / 카드 뒤집기 / 보석 게임 / 듣고 고르기 / 스피드 퀴즈) → 표(`.table-wrap`, `tabindex="0"`, `role="region"`, `aria-label="학생별 학습 기록 표, 옆으로 넘겨 볼 수 있어요"`) → 아래 "24명 중 **N**명 표시"(`aria-live="polite"`)
     - 열: 학생(아바타 + 이름) / 로그인(`ID` 노랑 태그 + 아이디, 또는 `GOOGLE` 태그 + "구글 계정") / 마지막 학습 / 이번 주(N판) / 정답률(막대 + %, 60% 미만이면 빨간 "도움 필요" 깃발) / 많이 한 게임
     - 줄 순서: 마지막 학습이 최근인 순 → 기록 없는 학생은 맨 아래(번호 순)
     - 기록 없는 학생 줄(`.is-idle`, `--paper-dim`): 마지막 "—", "0판", 점선 태그 "이번 주 기록 없음", 많이 한 게임 "—"
  6. `WORDS.EXE` 자주 틀린 단어(제목 `h2.hard-h`, "반 전체 정답률이 낮은 순서"): 4개, 줄마다 스피커 버튼(`aria-label="giraffe 발음 듣기"`) / 영어(`lang="en"`) + 뜻 / % / 빨간 막대. 비었으면 "아직 틀린 단어 기록이 없어요."
- 상태
  - 거르기: 누른 칩만 `aria-pressed="true"`, 해당 게임을 가장 많이 한 학생만 표시(기록 없는 학생은 "전체"에서만), 아래 숫자 갱신. 결과가 0명이면 표 안에 한 줄 "이 게임을 가장 많이 한 학생이 없어요." (거르기 상태는 새로고침하면 "전체"로 돌아간다)
  - 기대 숫자: 전체 24 / 카드 뒤집기 8 / 보석 게임 5 / 듣고 고르기 4 / 스피드 퀴즈 4
  - 학생 아이디 관리·만들기 → 토스트 "학생 아이디 관리는 다음 단계에서 만들어요."
- 반응형: 1380px 이하 표 아래로 자주 틀린 단어(2칸) / 1280 메뉴 210px | 본문 / 900px 이하 메뉴가 가로 줄(넘치면 옆으로 넘김), 요약 2칸(참여 칸은 한 줄 전체) / 700px 이하 자주 틀린 단어 1칸 / 640px 이하 요약 1칸, 만들기 버튼 아래로 / 360 표는 자기 영역 안에서만 옆으로 넘기고 화면 전체에는 가로 스크롤 없음

### 7.8 길을 잃었어요 / 오류 — 그 밖의 주소

- 제목: `길을 잃었어요` (오류일 때 `화면을 불러오지 못했어요`)
- 구성: subbar(처음으로 `#/` · 로고) / 빨간 망점 원 / 가운데 `.win` 최대 560px
  - 없는 주소: 창 이름 `LOST.EXE`, 라벨 `ERROR 404`(Silkscreen), `h1` "길을 잃었어요"(Gasoek One 40px), "이 주소에는 화면이 없어요. 처음 화면에서 다시 시작해요.", 처음으로(`btn--primary btn--xl gloss`)
  - 데이터 오류: 창 이름 `ERROR.EXE`, 라벨 `ERROR`, `h1` "화면을 불러오지 못했어요", "잠시 뒤에 다시 해 봐요. 계속 안 되면 선생님께 알려 주세요.", 다시 시도(`btn--primary`, `router.reload()`) + 처음으로(`btn`)
  - 큰 느낌표 아이콘(`i-alert`, 48px) 하나. 마스코트는 넣지 않는다(DESIGN.md: 로그인 화면에만).
- 반응형: 가운데 정렬 창, 좌우 여백 `--gut`.

---

## 8. 데이터 모양

### 8.1 원칙 (나중에 DB로 옮기기 쉽게)

- 배열 하나 = 나중의 테이블(컬렉션) 하나. 모든 항목에 문자열 `id`.
- 서로는 id로 잇는다(`studentId`, `classId`, `gameId`, `wordId`).
- 시각은 ISO 8601 + 한국 시간대(`2026-11-13T09:12:00+09:00`), 날짜는 `YYYY-MM-DD`.
- 비율은 0–1 숫자(`0.88`), 시간은 밀리초(`102000`), 점수는 정수. **글자로 꾸민 값("1분 42초")은 저장하지 않는다.**
- 비밀번호는 어디에도 두지 않는다(다음 단계의 인증 서비스가 맡는다).
- 가짜 데이터의 "지금"은 `MOCK_NOW = '2026-11-13T15:30:00+09:00'`(금요일 오후)로 고정. 데이터 함수는 `asOf`로 이 값을 돌려주고, 화면은 "오늘/어제"를 `asOf` 기준으로 계산한다. 그래서 날짜가 지나도 가짜 화면이 시안과 똑같이 보인다. 진짜 백엔드는 실제 현재 시각을 `asOf`로 준다.
- `games`(게임 4종)는 데이터가 아니라 **앱 내용**이라 `js/content/games.js`에 둔다.

### 8.2 게임 정보 (`js/content/games.js`)

```js
export const GAMES = [
  { id: 'memory', no: '01', label: '01 MEMORY', name: '카드 뒤집기', skill: '읽기', color: 'yellow', exe: 'MEMORY.EXE',
    record: 'time', soon: '카드 판을 만들고 있어요. 곧 열려요!',
    desc: '뒤집힌 카드를 두 장씩 열어 영어 단어와 그림의 짝을 찾아요.',
    steps: ['카드 두 장을 차례로 눌러 뒤집어요.', '단어와 그림의 뜻이 같으면 짝 성공!', '모든 짝을 찾으면 끝. 빠를수록 별이 많아요.'] },
  { id: 'jewel', no: '02', label: '02 JEWEL', name: '보석 게임', skill: '단어', color: 'night', exe: 'JEWEL.EXE',
    record: 'score', soon: '보석 판을 만들고 있어요. 곧 열려요!',
    desc: '같은 보석을 3개 이상 이어 터뜨리고, 보석 속 영어 단어를 모아요.',            // 질문 6에 따라 바뀔 수 있음
    steps: ['이웃한 보석 두 개를 바꿔 3개 이상 맞춰요.', '단어 보석이 터지면 발음과 뜻이 나와요.', '목표 단어를 모두 모으면 스테이지 클리어!'] },
  { id: 'listen', no: '03', label: '03 LISTEN', name: '듣고 고르기', skill: '듣기', color: 'cobalt', exe: 'LISTEN.EXE',
    record: 'correct', soon: '듣기 판을 만들고 있어요. 곧 열려요!',
    desc: '영어 발음을 듣고 알맞은 그림 카드를 골라요.',
    steps: ['스피커를 눌러 단어를 들어요.', '그림 카드 4장 중 하나를 골라요.', '틀려도 괜찮아요. 다시 들을 수 있어요.'] },
  { id: 'speed', no: '04', label: '04 SPEED', name: '스피드 퀴즈', skill: '순발력', color: 'red', exe: 'SPEED.EXE',
    record: 'score', soon: '퀴즈 판을 만들고 있어요. 곧 열려요!',
    desc: '제한 시간 안에 영어 단어 카드를 보고 알맞은 뜻을 빠르게 골라요.',
    steps: ['영어 단어 카드가 나타나요.', '알맞은 뜻이나 그림을 빨리 눌러요.', '연속으로 맞히면 콤보 점수가 올라가요.'] },
];
export const GAME_IDS = GAMES.map(g => g.id);
export const getGame = id => GAMES.find(g => g.id === id) ?? null;
```

### 8.3 가짜 데이터 (`js/services/mock/fixtures.js`)

```js
export const MOCK_NOW = '2026-11-13T15:30:00+09:00';
export const HELP_THRESHOLD = 0.6;                 // 정답률 60% 미만이면 "도움 필요"
export const app = { season: 1 };

export const classes = [
  { id: 'c-01', school: '한빛초', grade: 4, room: 2, label: '4학년 2반', teacherId: 't-01', currentPackId: 'p-animals' },
];
export const teachers = [
  { id: 't-01', name: '박지수', email: 'teacher@school.example', classIds: ['c-01'], avatar: { label: '박', color: 'cobalt' } },
];
export const students = [  // 8.4 표의 24명
  { id: 's-07', classId: 'c-01', number: 7, name: '김하린', loginType: 'id', loginId: 'hanbit4-07', avatar: { label: '하', color: 'yellow' } },
  { id: 's-14', classId: 'c-01', number: 14, name: '이도윤', loginType: 'google', loginId: null, avatar: { label: '도', color: 'cobalt' } },
  // …
];
export const weekStats = [ // 학생별 이번 주 요약 (진짜 백엔드에서는 plays를 모아 계산) — 8.4 표
  { studentId: 's-07', weekStart: '2026-11-09', plays: { memory: 5, jewel: 3, listen: 6, speed: 0 }, accuracy: 0.88, lastPlayedAt: '2026-11-13T09:12:00+09:00' },
  // 기록 없는 학생: plays 모두 0, accuracy null, lastPlayedAt null
];
export const classWeekSummaries = [ // 지난주 비교용
  { classId: 'c-01', weekStart: '2026-11-02', avgAccuracy: 0.78 },
];
export const gameRecords = [ // 학생별·게임별 누적 기록 (김하린만)
  { studentId: 's-07', gameId: 'memory', plays: 12, best: { kind: 'time', value: 102000 }, lastPlayedAt: '2026-11-12T16:20:00+09:00' },
  { studentId: 's-07', gameId: 'jewel',  plays: 7,  best: { kind: 'score', value: 2340 }, lastPlayedAt: '2026-11-10T15:30:00+09:00' },
  { studentId: 's-07', gameId: 'listen', plays: 9,  best: { kind: 'correct', value: 18, total: 20 }, lastPlayedAt: '2026-11-13T09:12:00+09:00' },
  // speed: 기록 없음 (항목 자체가 없음)
];
export const progress = [ { studentId: 's-07', stars: 128, streakDays: 5 } ];
export const dailyPlans = [ // 오늘의 단어·미션
  { classId: 'c-01', date: '2026-11-13', wordId: 'w-rabbit', mission: { gameId: 'listen', starMultiplier: 2 } },
];
export const wordPacks = [
  { id: 'p-animals', code: 'ANIMALS', title: '동물', weekStart: '2026-11-09', wordIds: [/* 8.5 표 순서대로 20개 */] },
];
export const words = [ { id: 'w-rabbit', en: 'rabbit', ko: '토끼', packId: 'p-animals' } /* … 20개 */ ];
export const hardWords = [ // 반 전체 정답률 낮은 단어 (진짜 백엔드에서는 plays의 답을 모아 계산)
  { classId: 'c-01', weekStart: '2026-11-09', wordId: 'w-giraffe',  accuracy: 0.54 },
  { classId: 'c-01', weekStart: '2026-11-09', wordId: 'w-squirrel', accuracy: 0.61 },
  { classId: 'c-01', weekStart: '2026-11-09', wordId: 'w-turtle',   accuracy: 0.68 },
  { classId: 'c-01', weekStart: '2026-11-09', wordId: 'w-elephant', accuracy: 0.72 },
];
```

다음 단계의 저장 모양 (지금은 만들지 않음, 참고용)

```js
// plays: 게임 한 판 = 한 줄. weekStats·hardWords·gameRecords는 이것을 모아 계산한다.
{ id, studentId, classId, gameId, wordPackId, startedAt, endedAt, practice: false,
  result: { kind: 'time' | 'score' | 'correct', value, total? },
  answers: [ { wordId, correct: true, ms: 1800 } ] }
```

### 8.4 학생 24명 (모두 지어낸 이름)

주간 기록의 `plays` 순서는 [memory, jewel, listen, speed]. 날짜는 모두 2026년 11월, 한국 시간. 표의 줄 순서(`#`) = 대시보드 기본 순서. 학생 `number`(반 번호)는 id의 숫자다(`s-07` → 7번). 아이디 로그인 학생의 `loginId`는 `hanbit4-` + 두 자리 번호.

| # | id | 이름 | 아바타 | 로그인 | 아이디 | plays [m, j, l, s] | 판 | 정답률 | 마지막 학습 | 많이 한 게임 |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | s-07 | 김하린 | 하 / yellow | id | hanbit4-07 | 5, 3, 6, 0 | 14 | 0.88 | 13일 09:12 | listen |
| 2 | s-08 | 송다인 | 다 / cobalt | id | hanbit4-08 | 1, 3, 6, 2 | 12 | 0.95 | 13일 09:05 | listen |
| 3 | s-11 | 양지유 | 지 / cobalt | id | hanbit4-11 | 1, 2, 5, 1 | 9 | 0.90 | 13일 08:58 | listen |
| 4 | s-14 | 이도윤 | 도 / cobalt | google | — | 3, 5, 2, 1 | 11 | 0.91 | 13일 08:55 | jewel |
| 5 | s-02 | 고은서 | 은 / red | id | hanbit4-02 | 4, 2, 1, 2 | 9 | 0.92 | 13일 08:41 | memory |
| 6 | s-05 | 문하준 | 하 / red | id | hanbit4-05 | 3, 1, 2, 1 | 7 | 0.83 | 13일 08:32 | memory |
| 7 | s-09 | 신채원 | 채 / red | google | — | 3, 1, 2, 1 | 7 | 0.89 | 12일 17:10 | memory |
| 8 | s-12 | 박서아 | 서 / red | id | hanbit4-12 | 5, 1, 2, 1 | 9 | 0.76 | 12일 16:40 | memory |
| 9 | s-17 | 전소윤 | 소 / cobalt | id | hanbit4-17 | 4, 2, 2, 1 | 9 | 0.87 | 12일 16:15 | memory |
| 10 | s-03 | 권도현 | 도 / yellow | google | — | 1, 5, 2, 1 | 9 | 0.86 | 12일 15:20 | jewel |
| 11 | s-19 | 정하은 | 은 / yellow | id | hanbit4-19 | 4, 2, 1, 1 | 8 | 0.84 | 12일 13:05 | memory |
| 12 | s-16 | 장서준 | 서 / yellow | google | — | 1, 4, 2, 2 | 9 | 0.85 | 12일 12:30 | jewel |
| 13 | s-24 | 황수아 | 수 / cobalt | google | — | 3, 2, 1, 1 | 7 | 0.85 | 12일 10:45 | memory |
| 14 | s-18 | 조유나 | 유 / red | id | hanbit4-18 | 3, 1, 2, 1 | 7 | 0.82 | 11일 15:00 | memory |
| 15 | s-20 | 최준우 | 준 / paper | google | — | 2, 0, 1, 3 | 6 | 0.58 | 11일 14:20 | speed (도움 필요) |
| 16 | s-04 | 류건우 | 건 / cobalt | id | hanbit4-04 | 1, 1, 1, 3 | 6 | 0.79 | 11일 13:50 | speed |
| 17 | s-10 | 안주원 | 주 / yellow | id | hanbit4-10 | 1, 3, 1, 1 | 6 | 0.80 | 11일 09:40 | jewel |
| 18 | s-06 | 배시현 | 시 / yellow | google | — | 0, 1, 3, 1 | 5 | 0.77 | 10일 14:10 | listen |
| 19 | s-22 | 홍태오 | 태 / yellow | id | hanbit4-22 | 0, 1, 1, 3 | 5 | 0.78 | 10일 11:25 | speed |
| 20 | s-01 | 강민준 | 민 / cobalt | google | — | 1, 2, 0, 0 | 3 | 0.63 | 10일 10:30 | jewel |
| 21 | s-15 | 임지호 | 지 / red | id | hanbit4-15 | 0, 1, 1, 2 | 4 | 0.74 | 9일 13:15 | speed |
| 22 | s-13 | 오시우 | 시 / paper | id | hanbit4-13 | 0, 0, 0, 0 | 0 | — | — | — |
| 23 | s-21 | 윤지아 | 지 / paper | id | hanbit4-21 | 0, 0, 0, 0 | 0 | — | — | — |
| 24 | s-23 | 한예준 | 예 / paper | id | hanbit4-23 | 0, 0, 0, 0 | 0 | — | — | — |

이 표로 계산하면 나오는 값 (Review가 확인)

- 참여 21 / 24명, 기록 없는 학생 3명
- 평균 정답률 = 참여 학생 21명 정답률의 단순 평균 = 17.22 / 21 = **0.820 → 82%**, 지난주 78% → **▲ 4%p** (`Math.round(현재×100) − Math.round(지난주×100)`)
- 게임별 판 수 합계: memory **46**, listen 44, jewel 43, speed 29 → 가장 많이 한 게임 **카드 뒤집기 46판**
- 많이 한 게임별 학생 수: memory 8, jewel 5, listen 4, speed 4 (동점 없음)
- 도움 필요(60% 미만): 최준우 1명
- 시안의 8명(김하린, 이도윤, 박서아, 최준우, 정하은, 강민준, 윤지아, 한예준)은 이름·아이디·판 수·정답률·마지막 학습·많이 한 게임이 시안과 같다.

### 8.5 이번 주 단어 묶음 ANIMALS 20개 (질문 7)

| # | id | 영어 | 뜻 | | # | id | 영어 | 뜻 |
|---|---|---|---|---|---|---|---|---|
| 1 | w-rabbit | rabbit | 토끼 | | 11 | w-cow | cow | 소 |
| 2 | w-giraffe | giraffe | 기린 | | 12 | w-horse | horse | 말 |
| 3 | w-squirrel | squirrel | 다람쥐 | | 13 | w-duck | duck | 오리 |
| 4 | w-turtle | turtle | 거북 | | 14 | w-frog | frog | 개구리 |
| 5 | w-elephant | elephant | 코끼리 | | 15 | w-monkey | monkey | 원숭이 |
| 6 | w-cat | cat | 고양이 | | 16 | w-lion | lion | 사자 |
| 7 | w-dog | dog | 개 | | 17 | w-tiger | tiger | 호랑이 |
| 8 | w-bird | bird | 새 | | 18 | w-bear | bear | 곰 |
| 9 | w-fish | fish | 물고기 | | 19 | w-zebra | zebra | 얼룩말 |
| 10 | w-pig | pig | 돼지 | | 20 | w-snake | snake | 뱀 |

1–5번은 시안에 나온 단어(오늘의 단어, 자주 틀린 단어)다. 인트로 미리보기 카드의 `apple`은 단어 묶음과 상관없는 꾸밈 그림이라 그대로 둔다(동물 그림은 에셋 승인 뒤에 그린다).

### 8.6 데이터 접근 함수 (`js/services/index.js`가 내보내는 것)

`auth` — 모두 Promise

| 함수 | 입력 | 출력 | 가짜 동작 | 쓰는 곳 |
|---|---|---|---|---|
| `getCurrentUser()` | — | `User \| null` | sessionStorage `funeng.session`(`{ role, userId }`)을 읽어 fixtures에서 찾음 | 라우터 |
| `signInStudentWithGoogle()` | — | `AuthResult` | 0.9초 뒤 s-07로 로그인 | 학생 로그인 |
| `signInStudentWithId({ loginId, password })` | 문자열 2개 | `AuthResult` | 0.4초 뒤 s-07로 로그인(어떤 값이든). 빈 값이면 `{ ok:false, code:'EMPTY' }` | 학생 로그인 |
| `signInTeacherWithGoogle()` | — | `AuthResult` | 0.9초 뒤 t-01 | 교사 로그인 |
| `signInTeacherWithEmail({ email, password })` | 문자열 2개 | `AuthResult` | 0.4초 뒤 t-01. 빈 값이면 `EMPTY` | 교사 로그인 |
| `signOut()` | — | `void` | sessionStorage 지움 | 게임 선택, 대시보드 |

```js
// User
{ role: 'student', id: 's-07', name: '김하린', classId: 'c-01', classLabel: '4학년 2반', school: '한빛초',
  loginType: 'id', loginId: 'hanbit4-07', avatar: { label: '하', color: 'yellow' } }
{ role: 'teacher', id: 't-01', name: '박지수', classIds: ['c-01'], avatar: { label: '박', color: 'cobalt' } }
// AuthResult
{ ok: true, user: User, notice?: string }  |  { ok: false, code: 'EMPTY' | 'WRONG_CREDENTIALS' | 'NETWORK' | 'UNKNOWN' }
```

`data` — 모두 Promise, 깊은 복사본을 돌려줌

| 함수 | 입력 | 출력 | 쓰는 곳 |
|---|---|---|---|
| `getIntro()` | — | `{ season, pack: { code, wordCount }, todayWord: { id, en, ko }, classBestScore }` — `classBestScore`는 gameRecords 중 `score` 최고값(2340) | 인트로 |
| `getStudentHome(studentId)` | id | `{ asOf, student: User, stars, streakDays, pack: { code, wordCount }, mission: { gameId, starMultiplier } \| null, records: { memory, jewel, listen, speed } }` — 각 기록 `{ plays, best: { kind, value, total? } \| null, lastPlayedAt \| null }`, 기록이 없는 게임도 `{ plays: 0, best: null, lastPlayedAt: null }`로 채움 | 게임 선택, 게임 자리 |
| `getTeacherHome(teacherId)` | id | `{ teacher: User, classes: [{ id, label, school, studentCount }] }` | 대시보드 |
| `getClassWeekReport(classId, weekStart?)` | id, `YYYY-MM-DD`(없으면 `asOf`가 든 주의 월요일) | `{ asOf, class: { id, label, school }, range: { start, end }, summary: { totalStudents, activeStudents, avgAccuracy \| null, prevAvgAccuracy \| null, topGame: { gameId, plays } \| null }, rows: [{ student: { id, number, name, loginType, loginId, avatar }, lastPlayedAt \| null, weekPlays, accuracy \| null, topGameId \| null, needsHelp }], hardWords: [{ word: { id, en, ko }, accuracy }] }` — `range.end` = 월요일 + 4일(금), `rows`는 8.4 순서로 정렬해서 줌, `needsHelp = accuracy < HELP_THRESHOLD` | 대시보드 |
| `getWordPack(packId)` | id | `{ id, code, title, words: [{ id, en, ko }] }` — 지금 화면에서는 안 쓰지만 게임 단계용으로 만들어 둔다 | (다음 단계) |

`prefs` — 브라우저에만 저장, 동기 함수

| 함수 | 입력 | 출력 | 동작 |
|---|---|---|---|
| `getPrefs()` | — | `{ practiceMode: false, sound: true }` (기본값) | localStorage `funeng.prefs` 읽기. 읽기 실패(사생활 보호 모드 등)면 기본값 |
| `setPrefs(partial)` | `{ practiceMode? , sound? }` | 합친 결과 | 저장 실패해도 오류 없이 메모리에만 기억 |

다음 단계에서 추가할 함수 (이름만 예약, 지금은 만들지 않음): `data.savePlayResult(play)`, `data.listStudents(classId)`, `data.createStudent(input)`, `data.resetStudentPassword(studentId)`, `data.updateStudent(id, patch)`.

### 8.7 글자 만들기 (`js/lib/format.js`, 모두 Asia/Seoul 기준)

| 함수 | 예 |
|---|---|
| `formatDuration(ms)` | 102000 → "1분 42초", 42000 → "42초", 120000 → "2분" |
| `formatNumber(n)` | 2340 → "2,340" |
| `formatPercent(ratio)` | 0.88 → "88%" (반올림) |
| `formatBest(best, 'cart')` | time → "최고 1분 42초", score → "최고 2,340점", correct → "최고 18/20 정답", null → "아직 기록 없음" |
| `formatBest(best, 'stat')` | "1분 42초" / "2,340점" / "18 / 20" / "—" |
| `formatDaysAgo(iso, asOf)` | 같은 날 "오늘", 하루 전 "어제", 2–6일 전 "N일 전", 그보다 전 "M월 D일", null "아직 없음" |
| `formatLastStudy(iso, asOf)` | 같은 날 "오늘 09:12", 하루 전 "어제 16:40", 그보다 전 "11월 11일", null "—" |
| `formatWeekRange(range)` | "11월 9일(월) – 11월 13일(금)" |
| `formatPlays(n)` | "12번" (게임 선택), `formatGames(n)` "14판" (대시보드) |

날짜 비교는 두 시각을 Asia/Seoul의 `YYYY-MM-DD`로 바꾼 뒤 날 수 차이로 계산한다(기기 시간대가 달라도 같은 결과).

---

## 9. 접근성·반응형·움직임 기준

### 9.1 접근성

1. 글자 대비 4.5:1 이상 — DESIGN.md 색 표 그대로. 빨강·노랑·초록 위 글자는 검정, 코발트·밤색 위만 흰색.
2. 누를 곳 44×44px 이상, 진짜 `button` / `a` / `input`. 정해진 곳으로 가는 이동은 `a`, 동작(로그아웃·고르기·스위치·로그인)은 `button`. START처럼 고른 게임에 따라 가는 곳이 바뀌는 버튼은 시안대로 `button`.
3. 키보드만으로 인트로 → 학생 로그인 → 게임 선택 → START → 게임 고르기 → 로그아웃, 인트로 → 교사 로그인 → 대시보드(거르기·발음 듣기) → 로그아웃을 끝까지 할 수 있다.
4. 포커스: 4px 코발트 외곽선, 4px 띄움. 밤색 창 안은 노랑. `h1[tabindex="-1"]:focus`는 외곽선 없음(화면 바뀔 때 옮겨 간 포커스용).
5. 화면마다 `h1` 하나: 인트로 "Fun English", 학생 로그인 "학생 로그인", 교사 로그인 "선생님 로그인", 게임 선택 "오늘은 어떤 게임?", 게임 자리 게임 이름, 대시보드 "4학년 2반 학습 기록", 길을 잃었어요 "길을 잃었어요". 그 아래 구역은 `h2`(READY 게임 이름, 요약 칸 제목, 표 제목(sr-only), 자주 틀린 단어).
6. 화면이 바뀌면 `document.title`이 바뀌고(`○○ · Fun English`), `h1`로 포커스가 간다(첫 화면 제외).
7. 영어 단어에는 `lang="en"`. `<html lang="ko">`.
8. 정답·오답·오류·상태는 색 + 아이콘 + 문장. 스위치는 "켜짐/꺼짐" 글자, 도움 필요는 깃발 아이콘 + 글자, 기록 없음은 점선 태그 + 글자.
9. 꾸밈(망점, 스티커, 띠, 미리보기 창 안쪽, 아바타, 게임 그림)은 `aria-hidden="true"`.
10. 깜빡임은 초당 3회 이하(게임 자리 커서는 초당 1회).
11. 건너뛰기 링크가 첫 번째 탭 위치.
12. `<noscript>`: "이 게임은 자바스크립트를 켜야 열려요."

### 9.2 반응형

- 확인 너비: **360 / 768 / 1280px** (시안의 기준값 1380 · 1100 · 900 · 700 · 640 · 480 · 400px 유지).
- 어느 너비에서도 **화면 전체 가로 스크롤 없음**(`document.documentElement.scrollWidth <= window.innerWidth`). 대시보드 표만 자기 영역 안에서 옆으로 넘긴다.
- `min-height: 100dvh`(지원 안 하면 `100vh`).
- 화면별 바뀌는 점은 7장 각 화면의 "반응형"을 따른다.

### 9.3 움직임

| 움직임 | 시간 | 움직임 줄이기 켜면 |
|---|---|---|
| 버튼·카트리지 올림/누름 | 120ms | 즉시(1ms) |
| 스티커·체크·말풍선 튀어나오기 | 240ms, `--pop` | 멈춤(바로 보임) |
| 오류 알림 흔들림 | 320ms | 멈춤 |
| 주 버튼 흐르는 빛(올렸을 때) | 0.7s | 숨김 |
| 선택된 카트리지 빛 | 8초마다 | 숨김 |
| 인트로 검은 띠 흐름 | 48초 한 바퀴 | 멈춤 |
| 토스트 나타남 | 240ms | 즉시 |
| 게임 자리 커서 깜빡임 | 1초 | 멈춤(계속 보임) |
| READY로 스크롤(1100px 이하) | 부드럽게 | 즉시 |

`base.css`에 시안 386–389줄 규칙을 그대로 두고, 새 애니메이션(커서)도 포함되는지 확인한다. 자바스크립트는 `matchMedia('(prefers-reduced-motion: reduce)')`로 스크롤 방식을 고른다(`ctx.reduceMotion`).

### 9.4 터치 기기

- 올림 효과는 `@media (hover: hover)` 안에서만.
- iOS Safari에서 누름(`:active`) 효과가 보이도록 `app.js`에서 `document.addEventListener('touchstart', () => {}, { passive: true })`.

### 9.5 발음 듣기 (`ui/speech.js`)

- `speak(word)`: `speechSynthesis`가 없으면 토스트. 있으면 이전 소리 취소 → `SpeechSynthesisUtterance(word)`, `lang='en-US'`, `rate=0.85`, en-US 목소리가 있으면 그것을 고른다.
- 발음 듣기는 학습 내용이므로 **효과음 스위치와 상관없이** 항상 소리 난다.

---

## 10. Build 작업 순서

각 단계가 끝나면 로컬 서버(3.7절)로 열어 콘솔 오류가 없는지 보고 다음으로 간다.

1. **뼈대** — `.nojekyll`, `.gitignore`, `assets/favicon.svg`, `index.html`(글꼴, CSS 링크, 그림 모음, 건너뛰기 링크, `#app`, 토스트, `<noscript>`, `<script type="module" src="js/app.js">`), `css/tokens.css`, `css/base.css`.
2. **도구** — `lib/html.js`, `lib/format.js`, `ui/toast.js`, `ui/speech.js`, `content/games.js`.
3. **데이터 한 겹** — `services/mock/fixtures.js`(8.3–8.5 그대로), `services/mock/auth.js`, `services/mock/data.js`(집계 계산 포함), `services/prefs.js`, `services/index.js`. 브라우저 콘솔에서 `getClassWeekReport('c-01')` 결과가 8.4절의 계산 값과 같은지 확인.
4. **라우터** — `routes.js`, `router.js`, `app.js`. 화면 모듈은 처음엔 `h1`만 있는 빈 모듈로 두고 주소 이동·로그인 확인·없는 주소·제목·포커스를 먼저 확인.
5. **공통 CSS** — `components.css`, `bars.css` (6.2절 표대로 옮기기 + 6.2절 "고쳐야 하는 곳"), `ui/parts.js`.
6. **화면** — 인트로 → 학생 로그인(`ui/login-form.js` 포함) → 교사 로그인 → 게임 선택 → 게임 자리 → 대시보드 → 길을 잃었어요. 화면마다 시안과 나란히 열어 비교.
7. **마무리** — 360 / 768 / 1280px 확인, 키보드만으로 흐름 확인, 움직임 줄이기 확인, `README.md`에 3줄 추가, 11장 목록을 스스로 한 번 훑기.

Build가 하지 않는 것: git 커밋·푸시(Embed 단계), `design/`·`CLAUDE.md`·`instructions/`·`spec.md` 수정, 외부 라이브러리 추가.

---

## 11. Review 검증 목록

준비: 프로젝트를 임시 폴더에 복사해 `python3 -m http.server 8000`으로 띄움(Review 지침 참고) → `http://localhost:8000/`. 시안은 `http://localhost:8000/design/mockup.html`. 화면마다 "통과 / 실패(이유)"를 `review.md`에 적는다.

### A. 구조·배포

1. `index.html`, `.nojekyll`, `assets/favicon.svg`가 루트에 있고 4장 구조와 같다.
2. `index.html`·CSS·JS 어디에도 `/`로 시작하는 경로(`href="/…"`, `src="/…"`, `url(/…)`, `import '/…'`)가 없다.
3. 첫 로드부터 모든 화면을 돌 때까지 콘솔 오류 0개, 네트워크 404 0개(탭 아이콘 포함).
4. 외부 요청은 `fonts.googleapis.com`, `fonts.gstatic.com`뿐이다.
5. `git diff --stat`에 `design/`, `CLAUDE.md`, `instructions/`, `spec.md` 변경이 없다.

### B. 라우팅

6. 5.1절의 주소를 하나씩 직접 열면 해당 화면이 나온다(보호된 주소는 먼저 로그인).
7. 학생으로 로그인한 뒤 `#/select/jewel`, `#/play/speed`에서 새로고침해도 같은 화면(보석 게임 선택됨 / 스피드 퀴즈 자리)이다. 교사로 로그인한 뒤 `#/dashboard` 새로고침도 같다.
8. 브라우저 뒤로·앞으로 가기가 5.4절 표대로 움직인다. 로그인 성공 뒤 뒤로 가기를 누르면 로그인 폼이 아니라 그 전 화면(인트로)이 나온다.
9. 게임 선택에서 카트리지를 여러 번 바꿔도 `history.length`가 늘지 않고, 주소는 `#/select/<마지막 게임>`이다.
10. START → `#/play/<게임>` → "게임 고르기" → `#/select/<같은 게임>`, 그 카트리지가 선택돼 있다.
11. 5.5절 표의 주소마다 결과가 같다(`#/nope`, `#intro`, `#/play/abc` → 길을 잃었어요 / `#/select/abc` → 게임 선택 + 주소 `#/select` / `#/SELECT/` → 게임 선택).
12. 새 탭에서 로그인 없이 `#/select`, `#/play/memory` → 학생 로그인 + "먼저 로그인해 주세요." / `#/dashboard` → 교사 로그인 + 같은 토스트. 학생으로 로그인한 상태에서 `#/dashboard` → 교사 로그인.
13. 로그아웃 뒤 `#/select`를 열면 다시 학생 로그인으로 간다.
14. 화면이 바뀌면 `document.title`이 9.1절대로 바뀌고, 포커스가 `h1`에 있으며, 페이지 맨 위가 보인다.

### C. 화면별

15. **인트로**: 띠 글자가 `SEASON 1 · 4 GAMES · WORD PACK: ANIMALS · 20 · TODAY'S WORD: RABBIT 토끼 · CLASS BEST: 2,340 PTS`. 아래 띠 "rabbit 토끼 / 이번 주 단어 20개 · 게임 4가지". 듣기 버튼이 소리를 낸다(또는 미지원 토스트).
16. **학생 로그인 빈 칸**: 아무것도 안 쓰고 시작하기! → 알림 "아이디와 비밀번호를 모두 적어 주세요."가 흔들리며 나타나고, 두 칸 모두 `aria-invalid="true"`, 포커스가 아이디 칸. 아이디만 쓰고 다시 → 비밀번호 칸만 `true`, 포커스가 비밀번호 칸.
17. **학생 로그인 로딩**: 구글 버튼을 누른 직후 `aria-busy="true"`, 글자 "구글에 연결하는 중…", 스피너 보임 → 약 0.9초 뒤 7.2절 토스트와 함께 `#/select`. 로딩 중 여러 번 눌러도 한 번만 이동.
18. **보기/숨기기**: 비밀번호 칸 `type`이 `password` ↔ `text`, 버튼 글자 "보기" ↔ "숨기기", `aria-pressed` 바뀜.
19. **교사 로그인**: 빈 칸 문장 "이메일과 비밀번호를 모두 입력해 주세요.", 구글·이메일 둘 다 `#/dashboard`로, "비밀번호를 잊었어요" → 토스트.
20. **게임 선택 기본**: 듣고 고르기가 선택돼 있고 미션 스티커가 붙어 있다. 플레이어 "김하린 · 4학년 2반 · hanbit4-07", 별 128, 5일 연속.
21. **카트리지 기록**: 7.4절 표와 같다(최고 1분 42초 / 최고 2,340점 / 최고 18/20 정답 / 아직 기록 없음).
22. **READY**: 각 카트리지를 누르면 테마 색·라벨·이름·그림·설명·3단계·기록 3칸이 그 게임 것으로 바뀐다. 스피드 퀴즈만 첫 도전 띠가 보이고 기록 칸이 "— · 0번 · 아직 없음".
23. **스위치**: 연습 모드를 켜고 효과음을 끈 뒤 새로고침 → 그대로 유지. 게임 자리 화면의 "고른 설정" 칩도 "연습 모드 켜짐 · 효과음 꺼짐".
24. **게임 자리 4종**: 7.6절 표의 창 이름·라벨·h1·준비 문장이 맞고, 망점 원과 창 이름 칸 색이 게임 색이다.
25. **대시보드 요약**: 21 / 24명(칸 21개 채움), "3명은 이번 주 기록이 없어요", 82%, "▲ 지난주보다 4%p", 카드 뒤집기 46판, 범위 "이번 주 · 11월 9일(월) – 11월 13일(금)", 메뉴 학생 수 24.
26. **대시보드 표**: 24줄, 8.4절 순서, 시안에 있던 8명의 값이 시안과 같다. 최준우만 "도움 필요". 마지막 3줄은 흐린 "이번 주 기록 없음".
27. **거르기**: 전체 24 / 카드 뒤집기 8 / 보석 게임 5 / 듣고 고르기 4 / 스피드 퀴즈 4, 아래 "24명 중 N명 표시"가 맞게 바뀐다.
28. **자주 틀린 단어**: giraffe 54%, squirrel 61%, turtle 68%, elephant 72% 순서, 스피커 버튼마다 `aria-label`.
29. **학생 아이디 관리 / 만들기**: 토스트 "학생 아이디 관리는 다음 단계에서 만들어요."
30. **길을 잃었어요**: `LOST.EXE`, "길을 잃었어요", 처음으로 → 인트로.

### D. 데이터 한 겹

31. `js/screens/`, `js/ui/`, `js/router.js`, `js/app.js`에서 `services/mock`을 가져오는 곳이 없다(`grep -rn "services/mock\|/mock/" js/screens js/ui js/router.js js/app.js` 결과 없음).
32. `js/screens/`, `js/ui/`, `js/router.js`, `js/app.js`에 `localStorage`, `sessionStorage`, `fetch(`가 없다.
33. `auth`·`data` 함수가 모두 Promise를 돌려준다. 받은 값을 고쳐도 다음 호출 결과가 바뀌지 않는다(깊은 복사).
34. fixtures에 "1분 42초", "오늘 09:12" 같은 꾸민 글자가 없다(숫자·ISO 시각만). 비밀번호 필드가 없다.
35. 기기 시간대를 바꿔도(예: 브라우저 시간대를 UTC로) "오늘 09:12", "3일 전" 같은 글자가 같다. (어려우면 `format.js`가 `timeZone: 'Asia/Seoul'`을 쓰는지 코드로 확인)

### E. 안전·공개 저장소

36. 화면 마크업이 `html`` `로 만들어진다. `innerHTML`에 문자열을 직접 이어 붙이는 곳이 없다(`grep -rn "innerHTML" js`로 확인, 모두 `String(html…)`).
37. 인라인 이벤트(`onclick=` 등)가 없다.
38. API 키·비밀번호·토큰처럼 보이는 값이 없다. `.gitignore`에 `.env`, `.env.*`, `*.local.*`, `.DS_Store`가 있다.
39. 가짜 데이터의 이름이 8.4절의 지어낸 이름뿐이다.

### F. 반응형

40. 360 / 768 / 1280px에서 화면 7종 모두 가로 스크롤 없음(`document.documentElement.scrollWidth <= innerWidth`), 글자·버튼이 겹치거나 잘리지 않는다.
41. 1100px 이하 게임 선택에서 카트리지를 누르면 READY가 보이게 스크롤된다.
42. 대시보드 표는 360px에서 표 영역 안에서만 옆으로 넘어간다.

### G. 접근성

43. 키보드만으로 9.1절 3번의 두 흐름을 끝까지 할 수 있고, 모든 포커스가 보인다.
44. 첫 Tab이 "본문으로 건너뛰기"이고, 누르면 주소가 바뀌지 않고 `main`으로 포커스가 간다.
45. 화면마다 `h1`이 정확히 하나, 렌더된 문서에 같은 `id`가 두 번 나오지 않는다.
46. 누를 수 있는 모든 것이 44×44px 이상(DevTools로 상단 바 버튼·스피커·거르기 칩·비밀번호 보기 확인).
47. 알림이 `role="alert"`이고 오류일 때 문장이 들어간다. 잘못된 칸에 `aria-describedby`가 있다.

### H. 움직임

48. 움직임 줄이기를 켜면(DevTools 렌더링 → `prefers-reduced-motion: reduce`) 띠 흐름, 흐르는 빛, 튀어나오기, 흔들림, 커서 깜빡임이 모두 멈춘다. (켤 수 없으면 `base.css` 규칙으로 확인)
49. 터치 기기 흉내(DevTools 기기 모드)에서 버튼을 누른 뒤 떠 있는 상태로 남지 않는다.

### I. 디자인 일치

50. 1280px에서 시안과 앱의 화면 5개를 나란히 캡처해 비교 — 13장에 적힌 차이 말고는 색·글꼴·선·그림자·간격이 같다.
51. `tokens.css` 색 값이 DESIGN.md 색 표와 같다. 새 hex 색은 6.1절 "새로" 항목뿐이다.
52. `.sheen`은 학생 로그인(인트로), 시작하기!, START 세 곳에만 있다.
53. 마스코트 비트는 학생 로그인에만 나온다. 이모지 아이콘이 없다.

---

## 12. 사용자가 정할 것

> 모두 추천대로 하려면 **"모두 추천대로"** 라고만 답해 주셔도 됩니다. 바꾸고 싶은 번호만 따로 말씀해 주세요.

1. **만드는 방식** — 추천: **빌드 없이 HTML·CSS·자바스크립트 파일 그대로.** GitHub Pages에 올리면 바로 열리고, 설치할 도구가 없어 고치기 쉽습니다. 대안: Vite 같은 빌드 도구 + GitHub Actions 자동 배포(설치·설정이 늘고 Pages 설정을 바꿔야 함). (3.1절)
2. **화면 주소 방식** — 추천: **해시 주소** (`…/card-lab1/#/select`). 어느 화면에서 새로고침하거나 링크를 보내도 GitHub Pages에서 깨지지 않습니다. 시안에서 이미 확인한 방식입니다. 대안: 화면마다 HTML 파일 따로. (3.2절)
3. **게임 자리 화면 모양** — 추천: **A안** — 게임 그림 + "준비 중" 스티커 + "COMING SOON" + 놀이 방법 3단계 + 고른 설정 + "게임 고르기로" 버튼. 대안: B안(A안 + 흐린 게임 판 미리보기), C안(자리 화면 없이 시안처럼 알림만). (7.6절)
4. **로그인하지 않고 주소로 바로 들어오면** — 추천: **로그인 화면으로 보냄.** 가짜 로그인 상태는 탭을 닫을 때까지 기억해서 새로고침해도 그대로입니다. 대안: 이번 단계에서는 막지 않고 누구나 모든 화면을 바로 열 수 있게(예시 학생·선생님으로 자동 표시). (5.3–5.5절)
5. **마스코트 '비트'** — 추천: **그대로 둠** (학생 로그인 화면에만). 대안: 빼기, 또는 다른 캐릭터로 바꾸기(새 그림 필요).
6. **보석 게임의 영어 학습 방식** — 추천: **'단어 보석'** — 판에 영어 단어가 적힌 보석이 섞여 있고, 그 보석을 포함해 3개 이상 맞추면 발음과 뜻이 나오며, 목표 단어를 다 모으면 클리어. 시안에서 승인된 설명 그대로이고 그림 에셋이 따로 필요 없습니다. 대안: 그림 보석(같은 그림 3개를 맞추면 그 단어가 나옴, 동물 그림 20장 필요), 보상 퀴즈(평범한 보석 맞추기 + 콤보 때 짧은 단어 퀴즈). 이번 단계에서는 설명 문구에만 쓰이고, 판 크기·목표 수 같은 세부 규칙은 게임 단계에서 정합니다.
7. **이번 주 단어 묶음** — 추천: **ANIMALS 20개** (8.5절 목록: rabbit, giraffe, squirrel, turtle, elephant, cat, dog, bird, fish, pig, cow, horse, duck, frog, monkey, lion, tiger, bear, zebra, snake)를 가짜 데이터로 사용. 대안: 다른 주제나 개수(목록을 주시면 바꿉니다).
8. **가짜 학생·선생님 이름과 숫자** — 추천: **시안의 지어낸 이름·숫자를 그대로 쓰고, 표를 24명으로 채움** (새로 16명도 모두 지어낸 이름, 8.4절). 시안의 "24명 중 8명 표시"는 실제 앱에서는 어색해서 24명을 다 보여 줍니다. 대안: 시안처럼 8명만. 어느 쪽이든 공개 저장소라 실제 학생 이름은 넣지 않습니다.

---

## 13. 시안과 달라지는 점

| # | 시안 | 앱 | 이유 |
|---|---|---|---|
| 1 | 주소 `#intro`, `#student`, `#teacher`, `#select`, `#dashboard` | `#/`, `#/login/student`, `#/login/teacher`, `#/select(/:game)`, `#/dashboard`, `#/play/:game` | 게임 이름 같은 값을 주소에 담고 없는 주소를 구별하기 위해 |
| 2 | 오른쪽 아래 "시안 화면" 탐색 도구 | 없음 | 시안 전용 도구 |
| 3 | 오늘의 단어 띠 오른쪽 여백 180px, 토스트 `bottom: 84px` | 여백 없음, 토스트 `bottom: 24px` | 탐색 도구 자리였음 |
| 4 | START → 토스트 "시안은 여기까지예요" | START → 게임 자리 화면 | 이번 단계 범위 |
| 5 | 없음 | 게임 자리 화면 4종, 길을 잃었어요·오류 화면 | 이번 단계 범위, 없는 주소 처리 |
| 6 | 대시보드 표 8줄, "24명 중 8명 표시" | 24줄 전부, 최근 학습 순 + 기록 없는 학생 맨 아래 | 거르기 숫자와 요약 숫자가 실제로 맞게 (질문 8) |
| 7 | 값이 마크업·`GAMES` 안에 글자로 박혀 있음 ("1분 42초", "오늘 09:12") | 가짜 데이터는 `fixtures.js`에 숫자·시각으로, 글자는 `format.js`가 만듦 | 나중에 DB로 바꾸기 쉽게 |
| 8 | 로그인 상태 없음, 로그아웃은 인트로 링크 | 가짜 로그인 상태(탭 동안), 로그아웃은 버튼 + 토스트 | 새로고침 유지, 보호 주소 처리 (질문 4) |
| 9 | 구글 로그인 토스트 "시안이라 바로 넘어가요…" | "체험 화면이라 바로 넘어가요…" + 아이디·이메일 로그인에도 예시 사용자 안내 토스트 | 어떤 아이디로 들어가도 '김하린'이 나와서 헷갈리지 않게 |
| 10 | 시작하기!·대시보드로 가기에 로딩 상태 없음 | 0.4초 "들어가는 중…" 로딩 | 데이터 한 겹이 비동기라 두 번 누르기 방지 |
| 11 | 알림이 처음부터 `role="alert"`로 숨어 있다가 보임 | 빈 알림에 오류 때 문장을 넣음 + 칸에 `aria-describedby` | 화면 낭독기가 확실히 읽도록 |
| 12 | 화면 제목이 `h2`(인트로만 `h1`) | 화면마다 `h1` 하나, 모양은 같음 | 접근성 |
| 13 | `:hover` 효과가 모든 기기에 | `@media (hover: hover)`에서만 + iOS 누름 보정 | 태블릿에서 눌렀다 뗀 뒤 떠 있는 채로 남는 문제 |
| 14 | 밤색 창 안 포커스도 코발트 | 노랑 | 밤색 위 코발트는 잘 안 보임 |
| 15 | 보조 색 5개(`#ffe1d6`, `#fff4ef`, `#faf5ea`, `#6b6253`, `#0d0b14`)가 CSS에 흩어져 있음 | 같은 값을 토큰으로 묶음 | 토큰 한곳 관리 |
| 16 | 카트리지 모서리 14px(위)·6px(아래) — DESIGN.md에는 12px | 시안 값 14px 유지(`--r-cart`) | 승인된 모양 그대로. DESIGN.md 숫자만 다름 |
| 17 | 고른 카트리지·스위치 상태가 새로고침하면 처음으로 | 카트리지는 주소에, 스위치는 브라우저에 기억 | "새로고침해도 같은 화면" |
| 18 | 없음 | "본문으로 건너뛰기" 링크, `<noscript>` 안내, 탭 아이콘 | 접근성, 배포 |
| 19 | 화면 5개가 한 HTML에 모두 있고 숨김·보임 전환 | 한 번에 한 화면만 그림 (모양은 같음) | 화면별 파일로 나눠 관리 |
| 20 | 미션 sr 글 "별 두 배" | "별 2배" (숫자는 데이터에서) | 배수가 데이터로 바뀌므로 |

### Review 뒤에 바뀐 점 (2026-11-14, review.md 반영)

| # | spec 원래 값 | 바뀐 값 | 이유 |
|---|---|---|---|
| 21 | 게임 자리 화면: 900px 이하에서 한 칸 | **1100px 이하에서 한 칸** (창 안 그림/글 한 칸은 900px 그대로) | 901–1100px에서 글 칸이 좁아 제목이 창 밖으로 나감. 게임 선택 화면과 같은 기준 |
| 22 | `COMING SOON_` 줄바꿈 허용, 크기 28px | 줄바꿈 막음, 480px 이하 20px | 좁은 폭에서 두 줄로 꺾임 |
| 23 | 인트로 "게임 4가지" 스티커 위치 시안 값 | 900px 이하에서 화면 안쪽으로 이동 | 한 칸 배치에서 왼쪽이 잘림 |
| 24 | 발음: en-US 목소리 | en-US 기본 목소리 → 믿을 만한 목소리 → 없으면 브라우저 기본. 장난감 목소리 제외 | 첫 en-US 목소리가 장난감 목소리(Albert)로 골라짐 |
