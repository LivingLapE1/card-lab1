// 데이터 한 겹의 입구. 화면 코드는 이 파일에서 auth, data, prefs만 가져온다.
// 지금은 가짜(mock) 구현을 내보낸다.
// 백엔드를 붙일 때는 js/services/<백엔드이름>/ 에 같은 함수(같은 입력·출력 모양)를 만들고
// 아래 auth·data 내보내기 줄만 그쪽으로 바꾼다. 화면 코드는 그대로 둔다.

export { auth } from './mock/auth.js';
export { data } from './mock/data.js';
export { prefs } from './prefs.js';
