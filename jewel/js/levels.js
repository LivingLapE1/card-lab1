// Levels and Mission Definitions

const COMMON_WORD_DICT = {
    'ANT': '개미 🐜',
    'CAT': '고양이 🐱',
    'DOG': '강아지 🐶',
    'SUN': '태양 ☀️',
    'CUP': '컵 🥛',
    'FOX': '여우 🦊',
    'PIG': '돼지 🐷',
    'BAT': '박쥐/배트 🦇',
    'CAR': '자동차 🚗',
    'HAT': '모자 🎩',
    'BUS': '버스 🚌',
    'BOX': '상자 📦',
    'EGG': '달걀 🥚',
    'BOY': '소년 👦',
    'TOY': '장난감 🧸',
    'BEE': '꿀벌 🐝',
    'COW': '소 🐮',
    'MAP': '지도 🗺️',
    'KEY': '열쇠 🔑',
    'PEN': '펜 🖊️',
    'FISH': '물고기 🐟',
    'STAR': '별 ⭐️',
    'BOOK': '책 📖',
    'TREE': '나무 🌳',
    'BIRD': '새 🐦',
    'DUCK': '오리 🦆',
    'LION': '사자 🦁',
    'MOON': '달 🌙',
    'BEAR': '곰 🐻',
    'FROG': '개구리 🐸',
    'MILK': '우유 🥛',
    'CAKE': '케이크 🎂',
    'DOLL': '인형 🪆',
    'BLUE': '파란색 💙',
    'PINK': '분홍색 💖',
    'RING': '반지 💍',
    'SHIP': '배 🚢',
    'SNOW': '눈 ❄️',
    'RAIN': '비 🌧️',
    'WIND': '바람 💨',
    'APPLE': '사과 🍎',
    'WATER': '물 💧',
    'SMILE': '미소 😊',
    'TIGER': '호랑이 🐯',
    'BREAD': '빵 🍞',
    'HOUSE': '집 🏠',
    'TRAIN': '기차 🚆',
    'PIZZA': '피자 🍕',
    'PENCIL': '연필 ✏️',
    'FLOWER': '꽃 🌸',
    'BANANA': '바나나 🍌',
    'RABBIT': '토끼 🐰'
};

const DEFAULT_PRESETS = [
    // [초급 1~5단계] 3글자 단어 - 6x6 보드, 1~2스왑 바로 완성 (60초)
    {
        id: 'easy-1',
        name: 'Level 1: ANT (개미)',
        difficulty: 'easy',
        words: ['ANT'],
        meanings: { 'ANT': '개미 🐜' },
        dummyLetters: ['O', 'P'],
        description: '1~2번만 블록을 바꿔서 가로 또는 세로로 ANT를 연결해보세요!',
        gridSize: 6,
        targetSwapDistance: 1,
        timeLimit: 60
    },
    {
        id: 'easy-2',
        name: 'Level 2: BOY (소년)',
        difficulty: 'easy',
        words: ['BOY'],
        meanings: { 'BOY': '소년 👦' },
        dummyLetters: ['P', 'X'],
        description: 'B, O, Y 글자를 연결해 멋진 소년을 완성하세요!',
        gridSize: 6,
        targetSwapDistance: 1,
        timeLimit: 60
    },
    {
        id: 'easy-3',
        name: 'Level 3: CAT (고양이)',
        difficulty: 'easy',
        words: ['CAT'],
        meanings: { 'CAT': '고양이 🐱' },
        dummyLetters: ['R', 'S'],
        description: 'C, A, T 글자를 연결해 귀여운 CAT을 완성하세요!',
        gridSize: 6,
        targetSwapDistance: 1,
        timeLimit: 60
    },
    {
        id: 'easy-4',
        name: 'Level 4: DOG (강아지)',
        difficulty: 'easy',
        words: ['DOG'],
        meanings: { 'DOG': '강아지 🐶' },
        dummyLetters: ['M', 'E'],
        description: 'D, O, G 글자를 연결해보세요!',
        gridSize: 6,
        targetSwapDistance: 1,
        timeLimit: 60
    },
    {
        id: 'easy-5',
        name: 'Level 5: SUN (태양)',
        difficulty: 'easy',
        words: ['SUN'],
        meanings: { 'SUN': '태양 ☀️' },
        dummyLetters: ['B', 'L'],
        description: '반짝이는 SUN을 만들어보세요!',
        gridSize: 6,
        targetSwapDistance: 2,
        timeLimit: 60
    },

    // [중급 6~10단계] 4글자 단어 - 7x7 보드, 뒤 2글자 스마트 결합 (90초)
    {
        id: 'med-1',
        name: 'Level 6: FISH (물고기)',
        difficulty: 'medium',
        words: ['FISH'],
        meanings: { 'FISH': '물고기 🐟' },
        dummyLetters: ['O'],
        description: '뒤의 S, H가 모여있습니다. F와 I를 연결해 FISH를 완성하세요!',
        gridSize: 7,
        targetSwapDistance: 2,
        timeLimit: 90
    },
    {
        id: 'med-2',
        name: 'Level 7: STAR (별)',
        difficulty: 'medium',
        words: ['STAR'],
        meanings: { 'STAR': '별 ⭐️' },
        dummyLetters: ['O'],
        description: '밤하늘에 빛나는 S-T-A-R를 완성해보세요!',
        gridSize: 7,
        targetSwapDistance: 2,
        timeLimit: 90
    },
    {
        id: 'med-3',
        name: 'Level 8: BOOK (책)',
        difficulty: 'medium',
        words: ['BOOK'],
        meanings: { 'BOOK': '책 📖' },
        dummyLetters: ['A'],
        description: '지혜가 담긴 B-O-O-K 단어를 완성해보세요!',
        gridSize: 7,
        targetSwapDistance: 2,
        timeLimit: 90
    },
    {
        id: 'med-4',
        name: 'Level 9: TREE (나무)',
        difficulty: 'medium',
        words: ['TREE'],
        meanings: { 'TREE': '나무 🌳' },
        dummyLetters: ['S'],
        description: '푸른 T-R-E-E 단어를 완성해보세요!',
        gridSize: 7,
        targetSwapDistance: 2,
        timeLimit: 90
    },
    {
        id: 'med-5',
        name: 'Level 10: MOON (달)',
        difficulty: 'medium',
        words: ['MOON'],
        meanings: { 'MOON': '달 🌙' },
        dummyLetters: ['T'],
        description: '은은한 빛의 M-O-O-N을 만들어보세요!',
        gridSize: 7,
        targetSwapDistance: 2,
        timeLimit: 90
    },

    // [고급 11~15단계] 5글자 단어 & 2개 단어 연계 미션 - 8x8 보드 (120초)
    {
        id: 'hard-1',
        name: 'Level 11: APPLE (사과)',
        difficulty: 'hard',
        words: ['APPLE'],
        meanings: { 'APPLE': '사과 🍎' },
        dummyLetters: ['O'],
        description: '5글자 단어 APPLE! 차례대로 정렬해 사과를 완성하세요.',
        gridSize: 8,
        targetSwapDistance: 3,
        timeLimit: 120
    },
    {
        id: 'hard-2',
        name: 'Level 12: WATER (물)',
        difficulty: 'hard',
        words: ['WATER'],
        meanings: { 'WATER': '물 💧' },
        dummyLetters: ['S'],
        description: '5글자 단어 WATER! 맑은 물방울 단어를 모아보세요.',
        gridSize: 8,
        targetSwapDistance: 3,
        timeLimit: 120
    },
    {
        id: 'hard-3',
        name: 'Level 13: DUAL [CAT & DOG]',
        difficulty: 'hard',
        words: ['CAT', 'DOG'],
        meanings: { 'CAT': '고양이 🐱', 'DOG': '강아지 🐶' },
        dummyLetters: [],
        description: '보드 유지 듀얼 미션! CAT과 DOG 두 단어를 모두 완성해보세요.',
        gridSize: 8,
        targetSwapDistance: 2,
        timeLimit: 120
    },
    {
        id: 'hard-4',
        name: 'Level 14: DUAL [SUN & MOON]',
        difficulty: 'hard',
        words: ['SUN', 'MOON'],
        meanings: { 'SUN': '해 ☀️', 'MOON': '달 🌙' },
        dummyLetters: [],
        description: '하늘의 해(SUN)와 달(MOON)을 보드에서 모두 연결하세요!',
        gridSize: 8,
        targetSwapDistance: 2,
        timeLimit: 120
    },
    {
        id: 'hard-5',
        name: 'Level 15: MASTER [FOX & BEAR]',
        difficulty: 'hard',
        words: ['FOX', 'BEAR'],
        meanings: { 'FOX': '여우 🦊', 'BEAR': '곰 🐻' },
        dummyLetters: [],
        description: '숲속 동물 친구들 FOX와 BEAR를 연속으로 완성하는 마스터 미션!',
        gridSize: 8,
        targetSwapDistance: 3,
        timeLimit: 120
    }
];

class LevelManager {
    constructor() {
        this.storageKey = 'gem_word_missions_v3';
        this.missions = this.loadMissions();
    }

    loadMissions() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn('Failed to load levels from storage', e);
        }
        return JSON.parse(JSON.stringify(DEFAULT_PRESETS));
    }

    saveMissions() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.missions));
        } catch (e) {
            console.error('Failed to save levels', e);
        }
    }

    resetToDefault() {
        this.missions = JSON.parse(JSON.stringify(DEFAULT_PRESETS));
        this.saveMissions();
        return this.missions;
    }

    getMission(id) {
        return this.missions.find(m => m.id === id) || this.missions[0];
    }

    getAllMissions() {
        return this.missions;
    }

    addMission(missionData) {
        if (!missionData.id) {
            missionData.id = 'custom-' + Date.now();
        }
        if (typeof missionData.timeLimit === 'undefined') {
            missionData.timeLimit = 60;
        }
        this.missions.push(missionData);
        this.saveMissions();
        return missionData;
    }

    updateMission(id, updatedData) {
        const idx = this.missions.findIndex(m => m.id === id);
        if (idx !== -1) {
            this.missions[idx] = { ...this.missions[idx], ...updatedData };
            this.saveMissions();
            return this.missions[idx];
        }
        return null;
    }

    deleteMission(id) {
        this.missions = this.missions.filter(m => m.id !== id);
        if (this.missions.length === 0) {
            this.resetToDefault();
        } else {
            this.saveMissions();
        }
        return this.missions;
    }

    // 단계별 사전 단어 일괄 설정 (교사가 원하는 만큼 단어를 입력하면 레벨이 무제한 동적 확장 생성!)
    applyGradeWordBatch({ easyWords, medWords, hardWords, easyTime, medTime, hardTime }) {
        const newMissions = [];
        let levelCounter = 1;

        // 1. 초급 단어들 (3글자 중심 -> 6x6 보드)
        easyWords.forEach(word => {
            const w = word.trim().toUpperCase();
            if (!w) return;
            const meaning = COMMON_WORD_DICT[w] || `${w}`;
            newMissions.push({
                id: `custom-easy-${levelCounter}`,
                name: `Level ${levelCounter}: ${w}`,
                difficulty: 'easy',
                words: [w],
                meanings: { [w]: meaning },
                dummyLetters: ['O', 'P'],
                description: `1~2번만 블록을 바꿔서 ${w}를 완성해보세요!`,
                gridSize: 6,
                targetSwapDistance: 1,
                timeLimit: parseInt(easyTime, 10) || 60
            });
            levelCounter++;
        });

        // 2. 중급 단어들 (4글자 중심 -> 7x7 보드)
        medWords.forEach(word => {
            const w = word.trim().toUpperCase();
            if (!w) return;
            const meaning = COMMON_WORD_DICT[w] || `${w}`;
            newMissions.push({
                id: `custom-med-${levelCounter}`,
                name: `Level ${levelCounter}: ${w}`,
                difficulty: 'medium',
                words: [w],
                meanings: { [w]: meaning },
                dummyLetters: ['O'],
                description: `글자를 모아 ${w}를 완성해보세요!`,
                gridSize: 7,
                targetSwapDistance: 2,
                timeLimit: parseInt(medTime, 10) || 90
            });
            levelCounter++;
        });

        // 3. 고급 단어들 (5글자 이상 또는 듀얼 단어 -> 8x8 보드 자동 확장!)
        hardWords.forEach(item => {
            const trimmed = item.trim().toUpperCase();
            if (!trimmed) return;
            const parts = trimmed.split(/[+&]/).map(p => p.trim()).filter(Boolean);

            if (parts.length > 1) {
                const meanings = {};
                parts.forEach(p => meanings[p] = COMMON_WORD_DICT[p] || p);
                newMissions.push({
                    id: `custom-hard-${levelCounter}`,
                    name: `Level ${levelCounter}: DUAL [${parts.join(' & ')}]`,
                    difficulty: 'hard',
                    words: parts,
                    meanings: meanings,
                    dummyLetters: [],
                    description: `보드 유지 연속 미션! ${parts.join('와 ')}를 모두 완성하세요.`,
                    gridSize: 8,
                    targetSwapDistance: 2,
                    timeLimit: parseInt(hardTime, 10) || 120
                });
            } else {
                const w = parts[0];
                const meaning = COMMON_WORD_DICT[w] || `${w}`;
                newMissions.push({
                    id: `custom-hard-${levelCounter}`,
                    name: `Level ${levelCounter}: ${w}`,
                    difficulty: 'hard',
                    words: [w],
                    meanings: { [w]: meaning },
                    dummyLetters: ['O'],
                    description: `고난도 단어 ${w}! 전략적으로 완성해보세요.`,
                    gridSize: w.length >= 5 ? 8 : 7,
                    targetSwapDistance: 3,
                    timeLimit: parseInt(hardTime, 10) || 120
                });
            }
            levelCounter++;
        });

        if (newMissions.length > 0) {
            this.missions = newMissions;
            this.saveMissions();
            return true;
        }
        return false;
    }
}

window.COMMON_WORD_DICT = COMMON_WORD_DICT;
window.levelManager = new LevelManager();
