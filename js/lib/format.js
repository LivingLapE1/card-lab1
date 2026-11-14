// 날짜·시간·숫자·기록 글자 만들기.
// 데이터 한 겹(services)은 숫자·ISO 시각만 돌려주고, 사람이 읽는 글자는 여기서 만든다.
// 날짜는 모두 Asia/Seoul 기준으로 계산한다(기기 시간대가 달라도 같은 결과).

const TZ = 'Asia/Seoul';
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const seoulFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const numberFormatter = new Intl.NumberFormat('ko-KR');

// ISO 시각 → 서울 기준 { year, month, day, hour, minute } (hour·minute은 두 자리 글자)
function seoulParts(iso) {
  const parts = {};
  for (const p of seoulFormatter.formatToParts(new Date(iso))) parts[p.type] = p.value;
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: String(Number(parts.hour) % 24).padStart(2, '0'),
    minute: parts.minute.padStart(2, '0'),
  };
}

// 서울 기준 날짜를 '날 번호'로 (두 날짜의 날 수 차이를 구할 때 쓴다)
function seoulDayNumber(iso) {
  const { year, month, day } = seoulParts(iso);
  return Math.round(Date.UTC(year, month - 1, day) / 86400000);
}

function daysBetween(iso, asOf) {
  return seoulDayNumber(asOf) - seoulDayNumber(iso);
}

// 'YYYY-MM-DD' → { month, day, weekday }
function parseDateOnly(ymd) {
  const [y, m, d] = ymd.split('-').map(Number);
  return { month: m, day: d, weekday: WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()] };
}

// 102000 → "1분 42초", 42000 → "42초", 120000 → "2분"
export function formatDuration(ms) {
  const total = Math.max(0, Math.round(ms / 1000));
  const min = Math.floor(total / 60);
  const sec = total % 60;
  if (min && sec) return `${min}분 ${sec}초`;
  if (min) return `${min}분`;
  return `${sec}초`;
}

// 2340 → "2,340"
export function formatNumber(n) {
  return numberFormatter.format(n);
}

// 0.88 → "88%"
export function formatPercent(ratio) {
  if (ratio === null || ratio === undefined) return '—';
  return `${Math.round(ratio * 100)}%`;
}

// 0.88 → 88 (막대 너비 등에 쓰는 0–100 정수)
export function toPercentNumber(ratio) {
  if (ratio === null || ratio === undefined) return 0;
  return Math.min(100, Math.max(0, Math.round(ratio * 100)));
}

// best = { kind: 'time' | 'score' | 'correct', value, total? } | null
// mode 'cart' → 카트리지 글자, 'stat' → READY 기록 칸 글자
export function formatBest(best, mode = 'cart') {
  const cart = mode === 'cart';
  if (!best) return cart ? '아직 기록 없음' : '—';
  switch (best.kind) {
    case 'time':
      return cart ? `최고 ${formatDuration(best.value)}` : formatDuration(best.value);
    case 'score':
      return cart ? `최고 ${formatNumber(best.value)}점` : `${formatNumber(best.value)}점`;
    case 'correct':
      return cart ? `최고 ${best.value}/${best.total} 정답` : `${best.value} / ${best.total}`;
    default:
      return cart ? '아직 기록 없음' : '—';
  }
}

// 같은 날 "오늘", 하루 전 "어제", 2–6일 전 "N일 전", 그보다 전 "M월 D일", null "아직 없음"
export function formatDaysAgo(iso, asOf) {
  if (!iso) return '아직 없음';
  const diff = daysBetween(iso, asOf);
  if (diff <= 0) return '오늘';
  if (diff === 1) return '어제';
  if (diff <= 6) return `${diff}일 전`;
  const { month, day } = seoulParts(iso);
  return `${month}월 ${day}일`;
}

// 같은 날 "오늘 09:12", 하루 전 "어제 16:40", 그보다 전 "11월 11일", null "—"
export function formatLastStudy(iso, asOf) {
  if (!iso) return '—';
  const diff = daysBetween(iso, asOf);
  const { month, day, hour, minute } = seoulParts(iso);
  if (diff <= 0) return `오늘 ${hour}:${minute}`;
  if (diff === 1) return `어제 ${hour}:${minute}`;
  return `${month}월 ${day}일`;
}

// { start: '2026-11-09', end: '2026-11-13' } → "11월 9일(월) – 11월 13일(금)"
export function formatWeekRange(range) {
  const s = parseDateOnly(range.start);
  const e = parseDateOnly(range.end);
  return `${s.month}월 ${s.day}일(${s.weekday}) – ${e.month}월 ${e.day}일(${e.weekday})`;
}

// 게임 선택: "12번"
export function formatPlays(n) {
  return `${n}번`;
}

// 대시보드: "14판"
export function formatGames(n) {
  return `${n}판`;
}
