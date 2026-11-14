// 가짜 데이터 전부 (spec 8.3–8.5).
// - 배열 하나 = 나중의 테이블(컬렉션) 하나. 모든 항목에 문자열 id.
// - 시각은 ISO 8601 + 한국 시간대, 날짜는 YYYY-MM-DD.
// - 비율은 0–1, 시간은 밀리초, 점수는 정수. 글자로 꾸민 값은 두지 않는다.
// - 비밀번호는 어디에도 두지 않는다.
// - 공개 저장소이므로 이름은 모두 지어낸 이름이다.

// 가짜 데이터의 "지금" (금요일 오후). 날짜가 지나도 화면이 시안과 똑같이 보이게 고정한다.
export const MOCK_NOW = '2026-11-13T15:30:00+09:00';
export const HELP_THRESHOLD = 0.6; // 정답률 60% 미만이면 "도움 필요"
export const app = { season: 1 };

export const classes = [
  { id: 'c-01', school: '한빛초', grade: 4, room: 2, label: '4학년 2반', teacherId: 't-01', currentPackId: 'p-animals' },
];

export const teachers = [
  { id: 't-01', name: '박지수', email: 'teacher@school.example', classIds: ['c-01'], avatar: { label: '박', color: 'cobalt' } },
];

// 학생 24명 (반 번호 순)
export const students = [
  { id: 's-01', classId: 'c-01', number: 1, name: '강민준', loginType: 'google', loginId: null, avatar: { label: '민', color: 'cobalt' } },
  { id: 's-02', classId: 'c-01', number: 2, name: '고은서', loginType: 'id', loginId: 'hanbit4-02', avatar: { label: '은', color: 'red' } },
  { id: 's-03', classId: 'c-01', number: 3, name: '권도현', loginType: 'google', loginId: null, avatar: { label: '도', color: 'yellow' } },
  { id: 's-04', classId: 'c-01', number: 4, name: '류건우', loginType: 'id', loginId: 'hanbit4-04', avatar: { label: '건', color: 'cobalt' } },
  { id: 's-05', classId: 'c-01', number: 5, name: '문하준', loginType: 'id', loginId: 'hanbit4-05', avatar: { label: '하', color: 'red' } },
  { id: 's-06', classId: 'c-01', number: 6, name: '배시현', loginType: 'google', loginId: null, avatar: { label: '시', color: 'yellow' } },
  { id: 's-07', classId: 'c-01', number: 7, name: '김하린', loginType: 'id', loginId: 'hanbit4-07', avatar: { label: '하', color: 'yellow' } },
  { id: 's-08', classId: 'c-01', number: 8, name: '송다인', loginType: 'id', loginId: 'hanbit4-08', avatar: { label: '다', color: 'cobalt' } },
  { id: 's-09', classId: 'c-01', number: 9, name: '신채원', loginType: 'google', loginId: null, avatar: { label: '채', color: 'red' } },
  { id: 's-10', classId: 'c-01', number: 10, name: '안주원', loginType: 'id', loginId: 'hanbit4-10', avatar: { label: '주', color: 'yellow' } },
  { id: 's-11', classId: 'c-01', number: 11, name: '양지유', loginType: 'id', loginId: 'hanbit4-11', avatar: { label: '지', color: 'cobalt' } },
  { id: 's-12', classId: 'c-01', number: 12, name: '박서아', loginType: 'id', loginId: 'hanbit4-12', avatar: { label: '서', color: 'red' } },
  { id: 's-13', classId: 'c-01', number: 13, name: '오시우', loginType: 'id', loginId: 'hanbit4-13', avatar: { label: '시', color: 'paper' } },
  { id: 's-14', classId: 'c-01', number: 14, name: '이도윤', loginType: 'google', loginId: null, avatar: { label: '도', color: 'cobalt' } },
  { id: 's-15', classId: 'c-01', number: 15, name: '임지호', loginType: 'id', loginId: 'hanbit4-15', avatar: { label: '지', color: 'red' } },
  { id: 's-16', classId: 'c-01', number: 16, name: '장서준', loginType: 'google', loginId: null, avatar: { label: '서', color: 'yellow' } },
  { id: 's-17', classId: 'c-01', number: 17, name: '전소윤', loginType: 'id', loginId: 'hanbit4-17', avatar: { label: '소', color: 'cobalt' } },
  { id: 's-18', classId: 'c-01', number: 18, name: '조유나', loginType: 'id', loginId: 'hanbit4-18', avatar: { label: '유', color: 'red' } },
  { id: 's-19', classId: 'c-01', number: 19, name: '정하은', loginType: 'id', loginId: 'hanbit4-19', avatar: { label: '은', color: 'yellow' } },
  { id: 's-20', classId: 'c-01', number: 20, name: '최준우', loginType: 'google', loginId: null, avatar: { label: '준', color: 'paper' } },
  { id: 's-21', classId: 'c-01', number: 21, name: '윤지아', loginType: 'id', loginId: 'hanbit4-21', avatar: { label: '지', color: 'paper' } },
  { id: 's-22', classId: 'c-01', number: 22, name: '홍태오', loginType: 'id', loginId: 'hanbit4-22', avatar: { label: '태', color: 'yellow' } },
  { id: 's-23', classId: 'c-01', number: 23, name: '한예준', loginType: 'id', loginId: 'hanbit4-23', avatar: { label: '예', color: 'paper' } },
  { id: 's-24', classId: 'c-01', number: 24, name: '황수아', loginType: 'google', loginId: null, avatar: { label: '수', color: 'cobalt' } },
];

// 학생별 이번 주 요약 (진짜 백엔드에서는 plays를 모아 계산한다). 순서는 spec 8.4 표.
// 기록 없는 학생: plays 모두 0, accuracy null, lastPlayedAt null
const W = '2026-11-09';
export const weekStats = [
  { studentId: 's-07', weekStart: W, plays: { memory: 5, jewel: 3, listen: 6, speed: 0 }, accuracy: 0.88, lastPlayedAt: '2026-11-13T09:12:00+09:00' },
  { studentId: 's-08', weekStart: W, plays: { memory: 1, jewel: 3, listen: 6, speed: 2 }, accuracy: 0.95, lastPlayedAt: '2026-11-13T09:05:00+09:00' },
  { studentId: 's-11', weekStart: W, plays: { memory: 1, jewel: 2, listen: 5, speed: 1 }, accuracy: 0.90, lastPlayedAt: '2026-11-13T08:58:00+09:00' },
  { studentId: 's-14', weekStart: W, plays: { memory: 3, jewel: 5, listen: 2, speed: 1 }, accuracy: 0.91, lastPlayedAt: '2026-11-13T08:55:00+09:00' },
  { studentId: 's-02', weekStart: W, plays: { memory: 4, jewel: 2, listen: 1, speed: 2 }, accuracy: 0.92, lastPlayedAt: '2026-11-13T08:41:00+09:00' },
  { studentId: 's-05', weekStart: W, plays: { memory: 3, jewel: 1, listen: 2, speed: 1 }, accuracy: 0.83, lastPlayedAt: '2026-11-13T08:32:00+09:00' },
  { studentId: 's-09', weekStart: W, plays: { memory: 3, jewel: 1, listen: 2, speed: 1 }, accuracy: 0.89, lastPlayedAt: '2026-11-12T17:10:00+09:00' },
  { studentId: 's-12', weekStart: W, plays: { memory: 5, jewel: 1, listen: 2, speed: 1 }, accuracy: 0.76, lastPlayedAt: '2026-11-12T16:40:00+09:00' },
  { studentId: 's-17', weekStart: W, plays: { memory: 4, jewel: 2, listen: 2, speed: 1 }, accuracy: 0.87, lastPlayedAt: '2026-11-12T16:15:00+09:00' },
  { studentId: 's-03', weekStart: W, plays: { memory: 1, jewel: 5, listen: 2, speed: 1 }, accuracy: 0.86, lastPlayedAt: '2026-11-12T15:20:00+09:00' },
  { studentId: 's-19', weekStart: W, plays: { memory: 4, jewel: 2, listen: 1, speed: 1 }, accuracy: 0.84, lastPlayedAt: '2026-11-12T13:05:00+09:00' },
  { studentId: 's-16', weekStart: W, plays: { memory: 1, jewel: 4, listen: 2, speed: 2 }, accuracy: 0.85, lastPlayedAt: '2026-11-12T12:30:00+09:00' },
  { studentId: 's-24', weekStart: W, plays: { memory: 3, jewel: 2, listen: 1, speed: 1 }, accuracy: 0.85, lastPlayedAt: '2026-11-12T10:45:00+09:00' },
  { studentId: 's-18', weekStart: W, plays: { memory: 3, jewel: 1, listen: 2, speed: 1 }, accuracy: 0.82, lastPlayedAt: '2026-11-11T15:00:00+09:00' },
  { studentId: 's-20', weekStart: W, plays: { memory: 2, jewel: 0, listen: 1, speed: 3 }, accuracy: 0.58, lastPlayedAt: '2026-11-11T14:20:00+09:00' },
  { studentId: 's-04', weekStart: W, plays: { memory: 1, jewel: 1, listen: 1, speed: 3 }, accuracy: 0.79, lastPlayedAt: '2026-11-11T13:50:00+09:00' },
  { studentId: 's-10', weekStart: W, plays: { memory: 1, jewel: 3, listen: 1, speed: 1 }, accuracy: 0.80, lastPlayedAt: '2026-11-11T09:40:00+09:00' },
  { studentId: 's-06', weekStart: W, plays: { memory: 0, jewel: 1, listen: 3, speed: 1 }, accuracy: 0.77, lastPlayedAt: '2026-11-10T14:10:00+09:00' },
  { studentId: 's-22', weekStart: W, plays: { memory: 0, jewel: 1, listen: 1, speed: 3 }, accuracy: 0.78, lastPlayedAt: '2026-11-10T11:25:00+09:00' },
  { studentId: 's-01', weekStart: W, plays: { memory: 1, jewel: 2, listen: 0, speed: 0 }, accuracy: 0.63, lastPlayedAt: '2026-11-10T10:30:00+09:00' },
  { studentId: 's-15', weekStart: W, plays: { memory: 0, jewel: 1, listen: 1, speed: 2 }, accuracy: 0.74, lastPlayedAt: '2026-11-09T13:15:00+09:00' },
  { studentId: 's-13', weekStart: W, plays: { memory: 0, jewel: 0, listen: 0, speed: 0 }, accuracy: null, lastPlayedAt: null },
  { studentId: 's-21', weekStart: W, plays: { memory: 0, jewel: 0, listen: 0, speed: 0 }, accuracy: null, lastPlayedAt: null },
  { studentId: 's-23', weekStart: W, plays: { memory: 0, jewel: 0, listen: 0, speed: 0 }, accuracy: null, lastPlayedAt: null },
];

// 지난주 비교용
export const classWeekSummaries = [
  { classId: 'c-01', weekStart: '2026-11-02', avgAccuracy: 0.78 },
];

// 학생별·게임별 누적 기록 (김하린만). speed는 기록이 없어서 항목 자체가 없다.
export const gameRecords = [
  { studentId: 's-07', gameId: 'memory', plays: 12, best: { kind: 'time', value: 102000 }, lastPlayedAt: '2026-11-12T16:20:00+09:00' },
  { studentId: 's-07', gameId: 'jewel', plays: 7, best: { kind: 'score', value: 2340 }, lastPlayedAt: '2026-11-10T15:30:00+09:00' },
  { studentId: 's-07', gameId: 'listen', plays: 9, best: { kind: 'correct', value: 18, total: 20 }, lastPlayedAt: '2026-11-13T09:12:00+09:00' },
];

export const progress = [
  { studentId: 's-07', stars: 128, streakDays: 5 },
];

// 오늘의 단어·미션
export const dailyPlans = [
  { classId: 'c-01', date: '2026-11-13', wordId: 'w-rabbit', mission: { gameId: 'listen', starMultiplier: 2 } },
];

// 이번 주 단어 묶음 ANIMALS 20개 (spec 8.5 순서)
export const words = [
  { id: 'w-rabbit', en: 'rabbit', ko: '토끼', packId: 'p-animals' },
  { id: 'w-giraffe', en: 'giraffe', ko: '기린', packId: 'p-animals' },
  { id: 'w-squirrel', en: 'squirrel', ko: '다람쥐', packId: 'p-animals' },
  { id: 'w-turtle', en: 'turtle', ko: '거북', packId: 'p-animals' },
  { id: 'w-elephant', en: 'elephant', ko: '코끼리', packId: 'p-animals' },
  { id: 'w-cat', en: 'cat', ko: '고양이', packId: 'p-animals' },
  { id: 'w-dog', en: 'dog', ko: '개', packId: 'p-animals' },
  { id: 'w-bird', en: 'bird', ko: '새', packId: 'p-animals' },
  { id: 'w-fish', en: 'fish', ko: '물고기', packId: 'p-animals' },
  { id: 'w-pig', en: 'pig', ko: '돼지', packId: 'p-animals' },
  { id: 'w-cow', en: 'cow', ko: '소', packId: 'p-animals' },
  { id: 'w-horse', en: 'horse', ko: '말', packId: 'p-animals' },
  { id: 'w-duck', en: 'duck', ko: '오리', packId: 'p-animals' },
  { id: 'w-frog', en: 'frog', ko: '개구리', packId: 'p-animals' },
  { id: 'w-monkey', en: 'monkey', ko: '원숭이', packId: 'p-animals' },
  { id: 'w-lion', en: 'lion', ko: '사자', packId: 'p-animals' },
  { id: 'w-tiger', en: 'tiger', ko: '호랑이', packId: 'p-animals' },
  { id: 'w-bear', en: 'bear', ko: '곰', packId: 'p-animals' },
  { id: 'w-zebra', en: 'zebra', ko: '얼룩말', packId: 'p-animals' },
  { id: 'w-snake', en: 'snake', ko: '뱀', packId: 'p-animals' },
];

export const wordPacks = [
  { id: 'p-animals', code: 'ANIMALS', title: '동물', weekStart: '2026-11-09', wordIds: words.map((w) => w.id) },
];

// 반 전체 정답률이 낮은 단어 (진짜 백엔드에서는 plays의 답을 모아 계산한다)
export const hardWords = [
  { classId: 'c-01', weekStart: W, wordId: 'w-giraffe', accuracy: 0.54 },
  { classId: 'c-01', weekStart: W, wordId: 'w-squirrel', accuracy: 0.61 },
  { classId: 'c-01', weekStart: W, wordId: 'w-turtle', accuracy: 0.68 },
  { classId: 'c-01', weekStart: W, wordId: 'w-elephant', accuracy: 0.72 },
];
