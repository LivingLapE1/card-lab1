# Build 지침 — 좁은 화면에서도 Fun English 로고 보이기

> 담당: Build 서브에이전트 (opus, 추론 강도 high — CSS 몇 줄과 상단 바 배치만 바꾸는 작은 작업이라 high로 충분)
> 사용자 요청: 2026-11-14 "좁은 화면에서도 로고가 보이고 눌리게 하기"

## 1. 배경

- 왼쪽 위 "Fun English" 로고는 이제 첫 화면(`#/`)으로 가는 링크다 (`js/ui/parts.js`의 `logo()`, `<a class="logo" href="#/">`).
- 그런데 좁은 화면에서는 원래 디자인 때문에 로고가 숨겨지거나 잘린다:
  1. **게임 선택(hud)**: `css/bars.css` 28–34줄 — 900px 이하에서 `.hud .logo{display:none}`
  2. **게임 자리 화면(subbar--play)**: `css/screens/play.css` 32–33줄 — 480px 이하에서 `.subbar--play .logo{display:none}`
  3. **교사 대시보드**: `css/bars.css` 36줄 `.subbar .hide-sm{display:none}` — 640px 이하에서 "English"가 숨겨져 "Fun TEACHER"만 보임
- 사용자는 **모든 폭(360px까지)에서 모든 화면의 로고가 보이고 눌리기**를 원한다.

## 2. 할 일

1. 위 세 곳에서 로고가 **항상 "Fun English" 전체로 보이게** 한다. 인트로를 뺀 6개 화면(학생 로그인, 교사 로그인, 게임 선택, 게임 자리 화면, 교사 대시보드, 길을 잃었어요) 모두.
2. 자리가 모자라면 이렇게 푼다 (순서대로 고려):
   - 로고 글자를 줄인다 (좁은 폭에서 20–22px 정도, 노란 외곽선·그림자 비율 유지).
   - 상단 바를 두 줄로 접는다. 예: 게임 선택 hud는 1줄에 로고 + 로그아웃, 2줄에 플레이어 + 별 + 연속 학습. 지금도 hud는 `flex-wrap`으로 접히니, 로고가 1줄 왼쪽 맨 앞에 오도록 순서·여백을 정한다.
   - 덜 중요한 것을 줄인다: 버튼 글자를 아이콘만 남기기(화면 낭독기용 이름은 유지), 플레이어 이름 옆 설명 숨기기, `TEACHER`·게임 라벨 같은 `.mode` 태그를 좁은 폭에서만 숨기기 등.
   - 로고 자체를 숨기는 방법은 쓰지 않는다.
3. 로고의 누르는 영역은 계속 44px 이상, 포커스 외곽선이 보여야 한다.
4. 넓은 화면(1100px 이상)의 모양은 지금과 같게 둔다.

## 3. 수정 범위 (꼭 지킬 것)

- 고칠 수 있는 파일: `css/bars.css`, `css/screens/play.css`, 꼭 필요하면 `css/screens/select.css`·`css/screens/dashboard.css`·`js/ui/parts.js`·상단 바를 그리는 `js/screens/*.js`.
- `jewel/`, `memory/`, `CLAUDE.md`, `spec.md`, `review.md`, `design/`, `instructions/`는 고치지 않는다.
- git 커밋·푸시·add·reset·stash를 하지 않는다.

## 4. 확인 방법

임시 폴더에 복사해서 띄운다 (바탕화면 폴더에서 띄운 서버는 파일을 못 읽는다. 위치는 작업 요청 메시지에 있다).

```bash
rsync -a --delete --exclude .git "<프로젝트 폴더>/" "<임시 폴더>/build-site/"
cd "<임시 폴더>" && python3 -m http.server 8701 --bind 127.0.0.1 --directory "<임시 폴더>/build-site"
```

- 360 / 400 / 480 / 640 / 768 / 900 / 1024 / 1280px에서 6개 화면 모두: 로고가 "Fun English" 전체로 보임, 누르면 `#/`, 가로 스크롤 없음, 상단 바 안의 것들이 겹치거나 잘리지 않음.
- 1280px에서 바꾸기 전과 모양이 같은지 (게임 선택, 대시보드, 자리 화면).
- 키보드 Tab으로 로고에 가고 포커스가 보이는지.
- `node --check` (JS를 고쳤다면). 서버는 끝나면 끈다. 캐시 주의.

## 5. 끝나면 보고할 것 (짧게)

고친 파일과 내용, 폭별로 상단 바가 어떻게 바뀌었는지, 확인 결과, 알고 있는 문제.
