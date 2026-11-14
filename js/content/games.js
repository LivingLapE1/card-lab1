// 게임 4종 고정 정보 (데이터가 아니라 앱 내용).
// record: 'time'(짧을수록 좋음) | 'score' | 'correct'

export const GAMES = [
  { id: 'memory', no: '01', label: '01 MEMORY', name: '카드 뒤집기', skill: '읽기', color: 'yellow', exe: 'MEMORY.EXE',
    record: 'time', soon: '카드 판을 만들고 있어요. 곧 열려요!',
    desc: '뒤집힌 카드를 두 장씩 열어 영어 단어와 그림의 짝을 찾아요.',
    steps: ['카드 두 장을 차례로 눌러 뒤집어요.', '단어와 그림의 뜻이 같으면 짝 성공!', '모든 짝을 찾으면 끝. 빠를수록 별이 많아요.'] },
  { id: 'jewel', no: '02', label: '02 JEWEL', name: '보석 게임', skill: '단어', color: 'night', exe: 'JEWEL.EXE',
    record: 'score', soon: '보석 판을 만들고 있어요. 곧 열려요!',
    desc: '같은 보석을 3개 이상 이어 터뜨리고, 보석 속 영어 단어를 모아요.',
    steps: ['이웃한 보석 두 개를 바꿔 3개 이상 맞춰요.', '단어 보석이 터지면 발음과 뜻이 나와요.', '목표 단어를 모두 모으면 스테이지 클리어!'] },
  { id: 'listen', no: '03', label: '03 LISTEN', name: '듣고 고르기', skill: '듣기', color: 'cobalt', exe: 'LISTEN.EXE',
    record: 'correct', soon: '듣기 판을 만들고 있어요. 곧 열려요!',
    desc: '영어 발음을 듣고 알맞은 그림 카드를 골라요.',
    steps: ['스피커를 눌러 단어를 들어요.', '그림 카드 4장 중 하나를 골라요.', '틀려도 괜찮아요. 다시 들을 수 있어요.'] },
  { id: 'speed', no: '04', label: '04 SPEED', name: '스피드 퀴즈', skill: '순발력', color: 'red', exe: 'SPEED.EXE',
    record: 'score', soon: '퀴즈 판을 만들고 있어요. 곧 열려요!',
    desc: '제한 시간 안에 영어 단어 카드를 보고 알맞은 뜻을 빠르게 골라요.',
    steps: ['영어 단어 카드가 나타나요.', '알맞은 뜻이나 그림을 빨리 눌러요.', '연속으로 맞히면 콤보 점수가 올라가요.'] },
];

export const GAME_IDS = GAMES.map((g) => g.id);

export const getGame = (id) => GAMES.find((g) => g.id === id) ?? null;
