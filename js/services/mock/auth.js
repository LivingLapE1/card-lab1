// 가짜 로그인. 진짜 확인은 하지 않는다.
// - 학생은 예시 학생(s-07), 교사는 예시 선생님(t-01)으로 들어간다.
// - 로그인 상태는 sessionStorage에 역할과 id만 둔다(탭을 닫으면 사라짐).
// - 모든 함수는 Promise를 돌려준다.
// AuthResult = { ok: true, user, notice? } | { ok: false, code: 'EMPTY' | 'WRONG_CREDENTIALS' | 'NETWORK' | 'UNKNOWN' }

import { toUser } from './data.js';

const SESSION_KEY = 'funeng.session';
const DEMO_STUDENT_ID = 's-07';
const DEMO_TEACHER_ID = 't-01';
const GOOGLE_DELAY = 900;
const FORM_DELAY = 400;

const NOTICE_GOOGLE = '체험 화면이라 바로 넘어가요. 진짜 구글 로그인은 백엔드를 정한 뒤 연결해요.';

// sessionStorage를 못 쓰는 환경(사생활 보호 모드 등)에서는 메모리에만 기억한다
let memorySession = null;

function readSession() {
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return memorySession;
  }
}

function writeSession(session) {
  memorySession = session;
  try {
    if (session) window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* 메모리에만 기억 */
  }
}

const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });
const isBlank = (value) => typeof value !== 'string' || value.trim() === '';

function signInAs(role, userId, notice) {
  const user = toUser(role, userId);
  if (!user) return { ok: false, code: 'UNKNOWN' };
  writeSession({ role, userId });
  return notice ? { ok: true, user, notice } : { ok: true, user };
}

async function getCurrentUser() {
  const session = readSession();
  if (!session || !session.role || !session.userId) return null;
  return toUser(session.role, session.userId);
}

async function signInStudentWithGoogle() {
  await wait(GOOGLE_DELAY);
  return signInAs('student', DEMO_STUDENT_ID, NOTICE_GOOGLE);
}

async function signInStudentWithId({ loginId, password } = {}) {
  if (isBlank(loginId) || isBlank(password)) return { ok: false, code: 'EMPTY' };
  await wait(FORM_DELAY);
  const name = toUser('student', DEMO_STUDENT_ID)?.name ?? '';
  return signInAs('student', DEMO_STUDENT_ID, `체험 화면이라 예시 학생 ‘${name}’으로 들어가요.`);
}

async function signInTeacherWithGoogle() {
  await wait(GOOGLE_DELAY);
  return signInAs('teacher', DEMO_TEACHER_ID, NOTICE_GOOGLE);
}

async function signInTeacherWithEmail({ email, password } = {}) {
  if (isBlank(email) || isBlank(password)) return { ok: false, code: 'EMPTY' };
  await wait(FORM_DELAY);
  const name = toUser('teacher', DEMO_TEACHER_ID)?.name ?? '';
  return signInAs('teacher', DEMO_TEACHER_ID, `체험 화면이라 예시 선생님 ‘${name}’로 들어가요.`);
}

async function signOut() {
  writeSession(null);
}

export const auth = Object.freeze({
  getCurrentUser,
  signInStudentWithGoogle,
  signInStudentWithId,
  signInTeacherWithGoogle,
  signInTeacherWithEmail,
  signOut,
});
