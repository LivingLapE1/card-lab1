// 주소 목록: 주소 ↔ 화면 모듈 ↔ 필요한 로그인 (spec 5.1)

import { GAME_IDS } from './content/games.js';
import * as intro from './screens/intro.js';
import * as studentLogin from './screens/student-login.js';
import * as teacherLogin from './screens/teacher-login.js';
import * as select from './screens/select.js';
import * as play from './screens/play.js';
import * as dashboard from './screens/dashboard.js';
import * as lost from './screens/lost.js';

export const routes = [
  { path: '/', screen: intro },
  { path: '/login/student', screen: studentLogin },
  { path: '/login/teacher', screen: teacherLogin },
  { path: '/select', screen: select, role: 'student' },
  // 게임 이름이 틀리면 게임 선택(기본 선택)을 그리고 주소를 #/select로 조용히 바꾼다
  { path: '/select/:game', screen: select, role: 'student', params: { game: GAME_IDS }, onBadParam: '/select' },
  // 게임이 틀리거나 없으면 길을 잃었어요
  { path: '/play/:game', screen: play, role: 'student', params: { game: GAME_IDS } },
  { path: '/dashboard', screen: dashboard, role: 'teacher' },
];

// 그 밖의 모든 주소 + 데이터를 못 불러왔을 때의 오류 화면
export const notFound = lost;
