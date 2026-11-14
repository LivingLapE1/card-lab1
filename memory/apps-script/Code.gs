/**
 * 영어 단어 카드 게임 - 반 전체 기록 저장소 (Google Apps Script)
 * 구글 스프레드시트 > 확장 프로그램 > Apps Script 에 이 코드를 그대로 붙여 넣고
 * "웹 앱"으로 배포하세요. 자세한 방법은 "교사용_설치_안내.md" 참고.
 */
const SHEET_NAME = '기록';
const SEMS = ['3-1', '3-2', '4-1', '4-2'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.getRange('C:C').setNumberFormat('@'); // "3-1"이 날짜로 바뀌지 않게
    sh.appendRow(['시간', '별명', '학기', '레벨', '점수', '결과']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function semText_(v) {
  if (v instanceof Date) return (v.getMonth() + 1) + '-' + v.getDate();
  return String(v);
}

function rows_() {
  const values = sheet_().getDataRange().getValues();
  values.shift();
  return values.map(function (r) {
    return { nick: String(r[1]), sem: semText_(r[2]), level: Number(r[3]), score: Number(r[4]), ok: r[5] === '성공' };
  });
}

// 게임 결과 저장
function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const nick = String(d.nick || '').trim().slice(0, 12);
    const sem = String(d.sem || '');
    const level = Math.round(Number(d.level));
    const score = Math.round(Number(d.score));
    if (!nick || SEMS.indexOf(sem) < 0 || !(level >= 1 && level <= 5) || !(score >= 0 && score <= 5000)) {
      return json_({ ok: false });
    }
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      sheet_().appendRow([new Date(), nick, sem, level, score, d.cleared ? '성공' : '실패']);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false });
  }
}

// 순위 / 학생 진행 기록 불러오기
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'player') {
    const out = {};
    rows_().forEach(function (r) {
      if (r.nick !== p.nick || !r.ok) return;
      const s = out[r.sem] = out[r.sem] || { cleared: 0, best: {} };
      s.cleared = Math.max(s.cleared, r.level);
      s.best[r.level] = Math.max(s.best[r.level] || 0, r.score);
    });
    return json_(out);
  }
  if (p.action === 'rank') {
    const m = {};
    rows_().forEach(function (r) {
      if (r.sem !== p.sem || !r.ok) return;
      const x = m[r.nick] = m[r.nick] || { nick: r.nick, cleared: 0, best: {} };
      x.cleared = Math.max(x.cleared, r.level);
      x.best[r.level] = Math.max(x.best[r.level] || 0, r.score);
    });
    const list = Object.keys(m).map(function (k) {
      const x = m[k];
      let total = 0;
      Object.keys(x.best).forEach(function (l) { total += x.best[l]; });
      return { nick: x.nick, cleared: x.cleared, total: total };
    }).sort(function (a, b) { return b.total - a.total; }).slice(0, 40);
    return json_(list);
  }
  return json_({ ok: true });
}
