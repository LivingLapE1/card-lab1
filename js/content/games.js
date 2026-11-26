// 게임 4종 고정 정보 (데이터가 아니라 앱 내용).
// record: 'time'(짧을수록 좋음) | 'score' | 'correct'
// url: 실제 게임 주소(앱 기준 상대 경로, '/'로 시작하지 않음). 없으면 자리 화면(#/play/<게임>)으로 간다.
// pass: 게임 주소 뒤에 붙여 넘길 값 이름. nick=학생 이름, practice=연습 모드(1/0), sfx=효과음(1/0)

export const GAMES = [
  { id: 'memory', no: '01', label: '01 MEMORY', name: '카드 뒤집기', skill: '읽기', color: 'yellow', exe: 'MEMORY.EXE',
    record: 'time', url: 'memory/', pass: ['nick', 'practice', 'sfx'], soon: '카드 판을 만들고 있어요. 곧 열려요!',
    desc: '뒤집힌 카드를 두 장씩 열어 영어 단어와 그림의 짝을 찾아요.',
    steps: ['카드 두 장을 차례로 눌러 뒤집어요.', '단어와 그림의 뜻이 같으면 짝 성공!', '모든 짝을 찾으면 끝. 빠를수록 별이 많아요.'] },
  { id: 'jewel', no: '02', label: '02 JEWEL', name: '보석 게임', skill: '단어', color: 'night', exe: 'JEWEL.EXE',
    record: 'score', url: 'jewel/', pass: [], soon: '보석 판을 만들고 있어요. 곧 열려요!',
    desc: '같은 보석을 3개 이상 이어 터뜨리고, 보석 속 영어 단어를 모아요.',
    steps: ['이웃한 보석 두 개를 바꿔 3개 이상 맞춰요.', '단어 보석이 터지면 발음과 뜻이 나와요.', '목표 단어를 모두 모으면 스테이지 클리어!'] },
  { id: 'listen', no: '03', label: '03 LISTEN', name: '듣고 고르기', skill: '듣기', color: 'cobalt', exe: 'LISTEN.EXE',
    record: 'correct', url: 'listen/', pass: ['nick', 'practice', 'sfx'], soon: '듣기 판을 만들고 있어요. 곧 열려요!',
    desc: '영어 발음을 듣고 알맞은 그림 카드를 골라요.',
    steps: ['떨어지는 스피커를 눌러 영어 발음을 들어요.', '그림 카드 4장 중 알맞은 카드를 골라요. 기회는 2번!', '스피커가 땅에 닿기 전에 맞혀요. 다시 듣기는 몇 번이든 돼요.'] },
  { id: 'speed', no: '04', label: '04 SPEED', name: '스피드 퀴즈', skill: '순발력', color: 'red', exe: 'SPEED.EXE',
    record: 'score', soon: '퀴즈 판을 만들고 있어요. 곧 열려요!',
    desc: '제한 시간 안에 영어 단어 카드를 보고 알맞은 뜻을 빠르게 골라요.',
    steps: ['영어 단어 카드가 나타나요.', '알맞은 뜻이나 그림을 빨리 눌러요.', '연속으로 맞히면 콤보 점수가 올라가요.'] },
];

export const GAME_IDS = GAMES.map((g) => g.id);

export const getGame = (id) => GAMES.find((g) => g.id === id) ?? null;

// 실제 게임 주소를 만든다. 주소가 없는 게임이면 null.
// user: 로그인한 학생(name 사용), prefs: { practiceMode, sound }
export function gameUrl(game, { user, prefs } = {}) {
  if (!game || !game.url) return null;
  const values = {
    nick: user && user.name ? user.name : '',
    practice: prefs && prefs.practiceMode ? '1' : '0',
    sfx: prefs && prefs.sound === false ? '0' : '1',
  };
  const query = (game.pass || [])
    .filter((key) => key in values)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(values[key])}`)
    .join('&');
  return query ? `${game.url}?${query}` : game.url;
}
