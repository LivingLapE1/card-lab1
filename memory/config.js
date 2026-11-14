// 게임 설정 (메모장으로 열어 따옴표 안의 값만 바꾸세요)
window.CONFIG = {
  // 반 전체 기록 저장소: 구글 시트 Apps Script "웹 앱 URL"
  // 비워 두면 기록이 이 기기(브라우저)에만 저장됩니다. 설치 방법: "교사용_설치_안내.md"
  RECORD_URL: "",

  // 메인 페이지 주소: "← 메인으로" 버튼이 이 주소로 이동합니다. 비워 두면 버튼이 숨겨집니다.
  MAIN_URL: "",

  // 메인 페이지에서 학생 이름(별명)을 넘겨받는 방법 (둘 중 하나만 맞으면 됩니다)
  // 1) 게임 주소 뒤에 붙여서 넘김:  index.html?nick=07김하늘
  NICK_PARAM: "nick",
  // 2) 메인 페이지가 같은 사이트에서 localStorage 또는 sessionStorage에 저장한 키 이름
  //    예: 메인 페이지가 localStorage.setItem("studentName", "07김하늘") 했다면 "studentName"
  NICK_STORAGE_KEY: ""
};
