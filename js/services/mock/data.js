// 가짜 데이터 읽기 함수: fixtures → 화면이 받을 모양 (집계 계산 포함).
// - 모든 함수는 Promise를 돌려준다(가짜도). 나중에 네트워크로 바뀌어도 화면 코드는 그대로다.
// - 돌려줄 때 깊은 복사를 해서, 화면이 값을 고쳐도 fixtures 원본은 바뀌지 않는다.
// - 돌려주는 값은 날것(숫자, ISO 시각, id)이다. 글자 모양은 js/lib/format.js가 만든다.

import { GAME_IDS } from '../../content/games.js';
import {
  MOCK_NOW, HELP_THRESHOLD, app, classes, teachers, students, weekStats, classWeekSummaries,
  gameRecords, progress, dailyPlans, wordPacks, words, hardWords,
} from './fixtures.js';

const clone = (value) => (typeof structuredClone === 'function'
  ? structuredClone(value)
  : JSON.parse(JSON.stringify(value)));

function notFound(what, id) {
  const err = new Error(`${what} not found: ${id}`);
  err.code = 'NOT_FOUND';
  return err;
}

// ---- 날짜 도우미 (Asia/Seoul 기준 YYYY-MM-DD) ----
const seoulDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
});

function seoulDate(iso) {
  const parts = {};
  for (const p of seoulDateFormatter.formatToParts(new Date(iso))) parts[p.type] = p.value;
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function addDays(ymd, days) {
  const [y, m, d] = ymd.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return t.toISOString().slice(0, 10);
}

// 그 날이 든 주의 월요일
function mondayOf(ymd) {
  const [y, m, d] = ymd.split('-').map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0 = 일요일
  return addDays(ymd, -((dow + 6) % 7));
}

// ---- 사용자 모양 (auth.js와 함께 쓴다) ----
export function toUser(role, id) {
  if (role === 'student') {
    const s = students.find((x) => x.id === id);
    if (!s) return null;
    const c = classes.find((x) => x.id === s.classId);
    return {
      role: 'student', id: s.id, name: s.name, classId: s.classId,
      classLabel: c ? c.label : '', school: c ? c.school : '',
      loginType: s.loginType, loginId: s.loginId, avatar: clone(s.avatar),
    };
  }
  if (role === 'teacher') {
    const t = teachers.find((x) => x.id === id);
    if (!t) return null;
    return { role: 'teacher', id: t.id, name: t.name, classIds: [...t.classIds], avatar: clone(t.avatar) };
  }
  return null;
}

function packSummary(packId) {
  const pack = wordPacks.find((p) => p.id === packId);
  return pack ? { code: pack.code, wordCount: pack.wordIds.length } : null;
}

function wordById(wordId) {
  const w = words.find((x) => x.id === wordId);
  return w ? { id: w.id, en: w.en, ko: w.ko } : null;
}

function planFor(classId, date) {
  return dailyPlans.find((p) => p.classId === classId && p.date === date) ?? null;
}

// ---- 공개 함수 ----

async function getIntro() {
  const cls = classes[0]; // 로그인 전이라 반을 알 수 없어 첫 번째 반을 쓴다 (백엔드 단계에서 다시 정함)
  const plan = planFor(cls.id, seoulDate(MOCK_NOW));
  const pack = wordPacks.find((p) => p.id === cls.currentPackId);
  const todayWord = plan ? wordById(plan.wordId) : (pack ? wordById(pack.wordIds[0]) : null);
  const scores = gameRecords.filter((r) => r.best && r.best.kind === 'score').map((r) => r.best.value);
  return clone({
    season: app.season,
    pack: packSummary(cls.currentPackId),
    todayWord,
    classBestScore: scores.length ? Math.max(...scores) : null,
  });
}

async function getStudentHome(studentId) {
  const student = toUser('student', studentId);
  if (!student) throw notFound('student', studentId);
  const cls = classes.find((c) => c.id === student.classId);
  const prog = progress.find((p) => p.studentId === studentId);
  const plan = planFor(student.classId, seoulDate(MOCK_NOW));
  const records = {};
  for (const gameId of GAME_IDS) {
    const r = gameRecords.find((x) => x.studentId === studentId && x.gameId === gameId);
    records[gameId] = r
      ? { plays: r.plays, best: r.best ?? null, lastPlayedAt: r.lastPlayedAt ?? null }
      : { plays: 0, best: null, lastPlayedAt: null };
  }
  return clone({
    asOf: MOCK_NOW,
    student,
    stars: prog ? prog.stars : 0,
    streakDays: prog ? prog.streakDays : 0,
    pack: cls ? packSummary(cls.currentPackId) : null,
    mission: plan && plan.mission ? plan.mission : null,
    records,
  });
}

async function getTeacherHome(teacherId) {
  const teacher = toUser('teacher', teacherId);
  if (!teacher) throw notFound('teacher', teacherId);
  const list = teacher.classIds
    .map((id) => classes.find((c) => c.id === id))
    .filter(Boolean)
    .map((c) => ({
      id: c.id, label: c.label, school: c.school,
      studentCount: students.filter((s) => s.classId === c.id).length,
    }));
  return clone({ teacher, classes: list });
}

async function getClassWeekReport(classId, weekStart) {
  const cls = classes.find((c) => c.id === classId);
  if (!cls) throw notFound('class', classId);
  const start = weekStart || mondayOf(seoulDate(MOCK_NOW));
  const prevStart = addDays(start, -7);

  const rows = students
    .filter((s) => s.classId === classId)
    .map((s) => {
      const ws = weekStats.find((w) => w.studentId === s.id && w.weekStart === start);
      const plays = ws ? ws.plays : {};
      const weekPlays = GAME_IDS.reduce((sum, id) => sum + (plays[id] || 0), 0);
      let topGameId = null;
      for (const id of GAME_IDS) {
        if ((plays[id] || 0) > 0 && (topGameId === null || plays[id] > plays[topGameId])) topGameId = id;
      }
      const accuracy = ws && typeof ws.accuracy === 'number' ? ws.accuracy : null;
      return {
        student: { id: s.id, number: s.number, name: s.name, loginType: s.loginType, loginId: s.loginId, avatar: s.avatar },
        lastPlayedAt: ws ? ws.lastPlayedAt : null,
        weekPlays,
        plays: GAME_IDS.reduce((o, id) => ({ ...o, [id]: plays[id] || 0 }), {}),
        accuracy,
        topGameId,
        needsHelp: accuracy !== null && accuracy < HELP_THRESHOLD,
      };
    })
    // 마지막 학습이 최근인 순 → 기록 없는 학생은 맨 아래(번호 순)
    .sort((a, b) => {
      if (a.lastPlayedAt && b.lastPlayedAt) return Date.parse(b.lastPlayedAt) - Date.parse(a.lastPlayedAt);
      if (a.lastPlayedAt) return -1;
      if (b.lastPlayedAt) return 1;
      return a.student.number - b.student.number;
    });

  const active = rows.filter((r) => r.weekPlays > 0);
  const withAccuracy = active.filter((r) => r.accuracy !== null);
  const avgAccuracy = withAccuracy.length
    ? withAccuracy.reduce((sum, r) => sum + r.accuracy, 0) / withAccuracy.length
    : null;
  const prev = classWeekSummaries.find((w) => w.classId === classId && w.weekStart === prevStart);

  let topGame = null;
  for (const id of GAME_IDS) {
    const total = rows.reduce((sum, r) => sum + r.plays[id], 0);
    if (total > 0 && (topGame === null || total > topGame.plays)) topGame = { gameId: id, plays: total };
  }

  const hard = hardWords
    .filter((h) => h.classId === classId && h.weekStart === start)
    .slice()
    .sort((a, b) => a.accuracy - b.accuracy)
    .map((h) => ({ word: wordById(h.wordId), accuracy: h.accuracy }))
    .filter((h) => h.word);

  return clone({
    asOf: MOCK_NOW,
    class: { id: cls.id, label: cls.label, school: cls.school },
    range: { start, end: addDays(start, 4) },
    summary: {
      totalStudents: rows.length,
      activeStudents: active.length,
      avgAccuracy,
      prevAvgAccuracy: prev ? prev.avgAccuracy : null,
      topGame,
    },
    rows: rows.map(({ plays, ...row }) => row),
    hardWords: hard,
  });
}

// 지금 화면에서는 쓰지 않지만 게임 단계용으로 만들어 둔다
async function getWordPack(packId) {
  const pack = wordPacks.find((p) => p.id === packId);
  if (!pack) throw notFound('word pack', packId);
  return clone({
    id: pack.id, code: pack.code, title: pack.title,
    words: pack.wordIds.map(wordById).filter(Boolean),
  });
}

export const data = Object.freeze({
  getIntro,
  getStudentHome,
  getTeacherHome,
  getClassWeekReport,
  getWordPack,
});
