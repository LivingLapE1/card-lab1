// 연습 모드·효과음 설정. 브라우저(localStorage)에만 저장하는 동기 함수.
// 읽기·저장이 실패해도(사생활 보호 모드 등) 오류 없이 메모리에만 기억한다.

const KEY = 'funeng.prefs';
const DEFAULTS = Object.freeze({ practiceMode: false, sound: true });

let fallback = { ...DEFAULTS };

function clean(value) {
  const v = value && typeof value === 'object' ? value : {};
  return {
    practiceMode: typeof v.practiceMode === 'boolean' ? v.practiceMode : DEFAULTS.practiceMode,
    sound: typeof v.sound === 'boolean' ? v.sound : DEFAULTS.sound,
  };
}

function getPrefs() {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? clean(JSON.parse(raw)) : { ...fallback };
  } catch {
    return { ...fallback };
  }
}

function setPrefs(partial = {}) {
  const next = clean({ ...getPrefs(), ...partial });
  fallback = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* 메모리에만 기억 */
  }
  return { ...next };
}

export const prefs = Object.freeze({ getPrefs, setPrefs });
