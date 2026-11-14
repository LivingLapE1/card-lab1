// 안전한 html`` 템플릿.
// ${} 로 넣는 값은 자동으로 이스케이프된다 (& < > " ').
// 값 규칙: SafeHtml → 그대로 / 배열 → 각 항목에 같은 규칙 후 이어 붙임 /
//          null·undefined·false → 빈 글자 / 그 밖 → String() 후 이스케이프

export class SafeHtml {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ESCAPES[ch]);
}

function toMarkup(value) {
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(toMarkup).join('');
  if (value === null || value === undefined || value === false) return '';
  return escapeHtml(value);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i += 1) {
    out += toMarkup(values[i]) + strings[i + 1];
  }
  return new SafeHtml(out);
}

// 우리가 직접 쓴 마크업만 그대로 넣을 때 쓴다. 바깥에서 온 값에는 쓰지 않는다.
export function raw(trusted) {
  return new SafeHtml(String(trusted));
}
