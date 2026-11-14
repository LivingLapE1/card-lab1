// Match-3 Word Gem Board Engine

const GEM_COLORS = {
    'A': { bg: 'linear-gradient(135deg, #ff4e50, #f9d423)', border: '#ff3b3f', shadow: 'rgba(255, 78, 80, 0.6)', name: 'Ruby Amber' },
    'B': { bg: 'linear-gradient(135deg, #2193b0, #6dd5ed)', border: '#0083b0', shadow: 'rgba(33, 147, 176, 0.6)', name: 'Sapphire' },
    'C': { bg: 'linear-gradient(135deg, #11998e, #38ef7d)', border: '#0e8076', shadow: 'rgba(17, 153, 142, 0.6)', name: 'Emerald' },
    'D': { bg: 'linear-gradient(135deg, #f857a6, #ff5858)', border: '#d93b77', shadow: 'rgba(248, 87, 166, 0.6)', name: 'Rose Topaz' },
    'E': { bg: 'linear-gradient(135deg, #8a2387, #e94057)', border: '#6a1367', shadow: 'rgba(138, 35, 135, 0.6)', name: 'Amethyst' },
    'F': { bg: 'linear-gradient(135deg, #f7971e, #ffd200)', border: '#d98114', shadow: 'rgba(247, 151, 30, 0.6)', name: 'Citrine' },
    'G': { bg: 'linear-gradient(135deg, #00b09b, #96c93d)', border: '#028c7b', shadow: 'rgba(0, 176, 155, 0.6)', name: 'Jade' },
    'H': { bg: 'linear-gradient(135deg, #4e54c8, #8f94fb)', border: '#3b40a4', shadow: 'rgba(78, 84, 200, 0.6)', name: 'Tanzanite' },
    'I': { bg: 'linear-gradient(135deg, #00c6ff, #0072ff)', border: '#0059c7', shadow: 'rgba(0, 114, 255, 0.6)', name: 'Aquamarine' },
    'J': { bg: 'linear-gradient(135deg, #f12711, #f5af19)', border: '#c91f0c', shadow: 'rgba(241, 39, 17, 0.6)', name: 'Fire Opal' },
    'K': { bg: 'linear-gradient(135deg, #b20a2c, #fffbd5)', border: '#8b0520', shadow: 'rgba(178, 10, 44, 0.6)', name: 'Garnet' },
    'L': { bg: 'linear-gradient(135deg, #56ab2f, #a8e063)', border: '#3e8020', shadow: 'rgba(86, 171, 47, 0.6)', name: 'Peridot' },
    'M': { bg: 'linear-gradient(135deg, #614385, #516395)', border: '#472f63', shadow: 'rgba(97, 67, 133, 0.6)', name: 'Spinel' },
    'N': { bg: 'linear-gradient(135deg, #0ba360, #3cba92)', border: '#066d3f', shadow: 'rgba(11, 163, 96, 0.6)', name: 'Emerald Green' },
    'O': { bg: 'linear-gradient(135deg, #f77737, #fccc63)', border: '#d45d22', shadow: 'rgba(247, 119, 55, 0.6)', name: 'Topaz Orange' },
    'P': { bg: 'linear-gradient(135deg, #7f00ff, #e100ff)', border: '#6000c2', shadow: 'rgba(127, 0, 255, 0.6)', name: 'Violet Diamond' },
    'Q': { bg: 'linear-gradient(135deg, #ff0844, #ffb199)', border: '#cb0434', shadow: 'rgba(255, 8, 68, 0.6)', name: 'Morganite' },
    'R': { bg: 'linear-gradient(135deg, #e52d27, #b31217)', border: '#8b0b0f', shadow: 'rgba(229, 45, 39, 0.6)', name: 'Ruby Deep' },
    'S': { bg: 'linear-gradient(135deg, #1d976c, #93f9b9)', border: '#126649', shadow: 'rgba(29, 151, 108, 0.6)', name: 'Mint Emerald' },
    'T': { bg: 'linear-gradient(135deg, #1e3c72, #2a5298)', border: '#13284d', shadow: 'rgba(30, 60, 114, 0.6)', name: 'Deep Sapphire' },
    'U': { bg: 'linear-gradient(135deg, #6a11cb, #2575fc)', border: '#480991', shadow: 'rgba(106, 17, 203, 0.6)', name: 'Cobalt Violet' },
    'V': { bg: 'linear-gradient(135deg, #ff758c, #ff7eb3)', border: '#cc4b62', shadow: 'rgba(255, 117, 140, 0.6)', name: 'Pink Quartz' },
    'W': { bg: 'linear-gradient(135deg, #43e97b, #38f9d7)', border: '#25a855', shadow: 'rgba(67, 233, 123, 0.6)', name: 'Turquoise' },
    'X': { bg: 'linear-gradient(135deg, #485563, #29323c)', border: '#1a2026', shadow: 'rgba(72, 85, 99, 0.6)', name: 'Onyx Black' },
    'Y': { bg: 'linear-gradient(135deg, #ffe000, #799f0c)', border: '#c7ae00', shadow: 'rgba(255, 224, 0, 0.6)', name: 'Lemon Chryso' },
    'Z': { bg: 'linear-gradient(135deg, #7028e4, #e5b2ca)', border: '#4b15a3', shadow: 'rgba(112, 40, 228, 0.6)', name: 'Alexandrite' },
    '?': { bg: 'linear-gradient(135deg, #ff007f, #7928ca, #00d4ff)', border: '#ffffff', shadow: 'rgba(255, 0, 128, 0.8)', name: 'Magic Joker' }
};

function getGemStyle(letter) {
    const l = (letter || 'A').toUpperCase();
    return GEM_COLORS[l] || { bg: 'linear-gradient(135deg, #4b6cb7, #182848)', border: '#283e6b', shadow: 'rgba(75, 108, 183, 0.5)', name: 'Gem' };
}

class GameBoard {
    constructor(mission, options = {}) {
        this.mission = mission;
        // 단어의 최대 글자 수 및 단어 수에 따라 보드 크기를 유연하게 자동 확장!
        const words = (mission && mission.words) ? mission.words : ['ANT'];
        const maxWordLength = Math.max(...words.map(w => w.length));
        const wordCount = words.length;
        let calculatedSize = 6;

        if (wordCount >= 2) {
            // 2개 이상 단어: 7x7 ~ 8x8로 확장하여 공간 확보
            calculatedSize = Math.max(7, Math.min(8, maxWordLength + 3));
        } else if (maxWordLength >= 6) {
            calculatedSize = 8;
        } else if (maxWordLength >= 4) {
            calculatedSize = 7;
        } else {
            calculatedSize = 6;
        }

        // 교사가 직접 설정한 크기가 있으면 그것을 존중하되, 단어가 넘치지 않게 최소 크기 보장
        this.size = mission.gridSize ? Math.max(mission.gridSize, calculatedSize) : calculatedSize;
        this.currentWordIndex = 0;
        this.targetWord = mission.words[0].toUpperCase();
        this.allWords = mission.words.map(w => w.toUpperCase());
        this.completedWords = [];
        this.freeSwapMode = options.freeSwapMode || false;

        // 힌트 보석(Wildcard Joker Gem) 활성화 조건:
        // 글자수가 4자 이상이거나, 목표 단어가 2개 이상이거나, 고급 난이도일 때 활성화!
        this.allowWildcard = (maxWordLength >= 4 || wordCount >= 2 || (mission && mission.difficulty === 'hard'));
        this.onPromptWildcard = options.onPromptWildcard || null;

        // 풀(Alphabet Pool): 목표 단어 알파벳 + 더미 알파벳
        this.pool = this.computeLetterPool();

        this.grid = []; // 2D array [row][col]
        this.selectedTile = null;
        this.isProcessing = false;
        this.score = 0;
        this.combo = 0;
        this.moveCount = 0;
        this.onStateChange = options.onStateChange || (() => {});
        this.onWordCompleted = options.onWordCompleted || (() => {});
        this.onMissionCompleted = options.onMissionCompleted || (() => {});

        this.initBoard();
    }

    computeLetterPool() {
        const letters = new Set();
        // 1. 미션에 포함된 모든 목표 단어(예: CAT & DOG 둘 다)의 글자들을 풀에 등록!
        for (const word of this.allWords) {
            for (const char of word) {
                letters.add(char);
            }
        }

        // 2. 글자 풀 크기 제어: 총 글자 수가 너무 많아지지 않도록 조절
        const defaultDummies = ['O', 'P', 'X', 'B', 'M', 'S'];
        let candidateDummies = [];

        if (this.mission.dummyLetters && Array.isArray(this.mission.dummyLetters) && this.mission.dummyLetters.length > 0) {
            candidateDummies = this.mission.dummyLetters.map(d => d.toUpperCase()).filter(d => !letters.has(d));
        }
        defaultDummies.forEach(d => {
            if (!letters.has(d) && !candidateDummies.includes(d)) {
                candidateDummies.push(d);
            }
        });

        // 만약 목표 글자만으로 이미 5개 이상이면 더미는 최대 1개만 추가, 미만이면 5개까지 보충
        const targetPoolSize = Math.max(5, letters.size <= 4 ? 5 : letters.size + 1);
        let dIdx = 0;
        while (letters.size < targetPoolSize && dIdx < candidateDummies.length) {
            letters.add(candidateDummies[dIdx++]);
        }

        return Array.from(letters);
    }

    getRandomLetter() {
        return this.pool[Math.floor(Math.random() * this.pool.length)];
    }

    initBoard() {
        let attempts = 0;
        let success = false;

        while (!success && attempts < 100) {
            attempts++;
            this.grid = [];
            for (let r = 0; r < this.size; r++) {
                this.grid[r] = [];
                for (let c = 0; c < this.size; c++) {
                    let letter;
                    // 시작 시 3개 매치 발생 방지
                    do {
                        letter = this.getRandomLetter();
                    } while (
                        (r >= 2 && this.grid[r - 1][c].letter === letter && this.grid[r - 2][c].letter === letter) ||
                        (c >= 2 && this.grid[r][c - 1].letter === letter && this.grid[r][c - 2].letter === letter)
                    );

                    this.grid[r][c] = {
                        id: `tile-${r}-${c}-${Math.random()}`,
                        row: r,
                        col: c,
                        letter: letter,
                        matched: false,
                        isWordPart: false
                    };
                }
            }

            // 시작하자마자 목표 단어가 이미 완성되어 있으면 다시 생성
            if (this.checkTargetWordOnBoard().found) {
                continue;
            }

            // 난이도 및 단어 개수에 따른 스마트 패턴 주입!
            if (this.allWords.length >= 2) {
                // 2개 이상 단어: 보드에 2개 단어를 상단과 하단에 각각 스마트 배치!
                this.injectDualWordPattern();
            } else if (this.mission.difficulty === 'easy' || this.targetWord.length <= 3) {
                this.injectEasyPattern();
            } else {
                // 4글자 이상 단어: 뒤 2글자를 이미 결합하고 앞 글자를 1~2스왑 거리로 유도
                this.injectClusteredWordPattern();
            }

            // 주입 후 이미 완성되었는지 재확인
            if (!this.checkTargetWordOnBoard().found) {
                success = true;
            }
        }

        // 4자 이상 또는 다중 단어일 경우 보드 군데군데 힌트 보석(?) 1~2개 배치!
        if (this.allowWildcard) {
            this.injectWildcardGems();
        }

        this.combo = 0;
    }

    // 4글자, 5글자 이상 레벨에서 어떤 글자로도 변신 가능한 마법의 힌트 보석(?)을 보드 군데군데 배치
    injectWildcardGems() {
        if (!this.allowWildcard) return;

        // 목표 단어의 철자들을 집합으로 추출
        const targetLetters = new Set();
        this.allWords.forEach(w => {
            for (const char of w) targetLetters.add(char);
        });

        // 1순위 후보: 목표 단어 철자가 아닌 더미 글자 타일들
        const candidates = [];
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const tile = this.grid[r][c];
                if (!targetLetters.has(tile.letter) && tile.letter !== '?') {
                    candidates.push(tile);
                }
            }
        }

        // 후보가 부족하면 전체 칸 중 미완성 상태인 칸
        if (candidates.length < 2) {
            for (let r = 0; r < this.size; r++) {
                for (let c = 0; c < this.size; c++) {
                    if (this.grid[r][c].letter !== '?') {
                        candidates.push(this.grid[r][c]);
                    }
                }
            }
        }

        // 셔플 후 1~2개 타일을 힌트 보석으로 교체
        candidates.sort(() => Math.random() - 0.5);
        const countToInject = Math.min(2, Math.max(1, Math.floor(this.size / 3)));
        for (let i = 0; i < countToInject && i < candidates.length; i++) {
            candidates[i].letter = '?';
            candidates[i].isWildcard = true;
        }
    }

    // 2개 단어 미션 스마트 배치:
    // 1번째 단어(CAT)는 상단, 2번째 단어(DOG)는 하단에 각각 1~2스왑 거리로 준비해두어
    // 1번째 단어를 맞춘 후 보드가 유지된 채로 2번째 단어를 매끄럽게 이어서 맞출 수 있도록 함!
    injectDualWordPattern() {
        if (this.allWords.length < 2) return;
        const word1 = this.allWords[0];
        const word2 = this.allWords[1];

        // 1. 단어 1 (상단 row 1~2)
        const r1 = 1;
        const len1 = word1.length;
        const startC1 = Math.max(0, Math.floor((this.size - len1) / 2));
        const miss1 = len1 - 1;
        for (let i = 0; i < len1; i++) {
            if (i !== miss1) {
                this.grid[r1][startC1 + i].letter = word1[i];
            } else {
                const dummies = this.pool.filter(l => l !== word1[i]);
                this.grid[r1][startC1 + i].letter = dummies[0] || 'O';
            }
        }
        const swapR1 = (r1 + 1 < this.size) ? r1 + 1 : r1 - 1;
        this.grid[swapR1][startC1 + miss1].letter = word1[miss1];

        // 2. 단어 2 (하단 row size - 2)
        const r2 = Math.max(r1 + 2, this.size - 2);
        const len2 = word2.length;
        const startC2 = Math.max(0, Math.floor((this.size - len2) / 2));
        const miss2 = len2 - 1;
        for (let i = 0; i < len2; i++) {
            if (i !== miss2) {
                this.grid[r2][startC2 + i].letter = word2[i];
            } else {
                const dummies = this.pool.filter(l => l !== word2[i]);
                this.grid[r2][startC2 + i].letter = dummies[0] || 'O';
            }
        }
        const swapR2 = (r2 - 1 >= 0) ? r2 - 1 : r2 + 1;
        this.grid[swapR2][startC2 + miss2].letter = word2[miss2];
    }

    // 초급: 1번의 스왑으로 즉시 단어를 완성할 수 있는 배치 주입
    injectEasyPattern() {
        const word = this.targetWord;
        const len = word.length;
        if (len > this.size) return;

        const isHorizontal = Math.random() < 0.6;
        const swapDistance = this.mission.targetSwapDistance || 1;

        if (isHorizontal) {
            const r = Math.floor(Math.random() * (this.size - 2)) + 1;
            const startC = Math.floor(Math.random() * (this.size - len + 1));
            const missIdx = len - 1;

            for (let i = 0; i < len; i++) {
                if (i !== missIdx) {
                    this.grid[r][startC + i].letter = word[i];
                } else {
                    const dummies = this.pool.filter(l => l !== word[i]);
                    this.grid[r][startC + i].letter = dummies[Math.floor(Math.random() * dummies.length)];
                }
            }

            const targetC = startC + missIdx;
            let swapR = r + 1 < this.size ? r + 1 : r - 1;
            let swapC = targetC;

            if (swapDistance === 1) {
                this.grid[swapR][swapC].letter = word[missIdx];
            } else {
                swapR = Math.min(this.size - 1, Math.max(0, r + 2));
                this.grid[swapR][swapC].letter = word[missIdx];
            }
        } else {
            const c = Math.floor(Math.random() * (this.size - 2)) + 1;
            const startR = Math.floor(Math.random() * (this.size - len + 1));
            const missIdx = len - 1;

            for (let i = 0; i < len; i++) {
                if (i !== missIdx) {
                    this.grid[startR + i][c].letter = word[i];
                } else {
                    const dummies = this.pool.filter(l => l !== word[i]);
                    this.grid[startR + i][c].letter = dummies[Math.floor(Math.random() * dummies.length)];
                }
            }

            const targetR = startR + missIdx;
            let swapC = c + 1 < this.size ? c + 1 : c - 1;
            this.grid[targetR][swapC].letter = word[missIdx];
        }
    }

    // 4글자 이상 단어 전용 스마트 클러스터링 배치:
    // "뒤에 2글자는 이미 나란히 붙어있게(또는 1스왑) 조합해두고, 첫 글자/앞 글자를 인근에 배치하여 수월하게 완성 가능"
    injectClusteredWordPattern() {
        const word = this.targetWord;
        const len = word.length;
        if (len > this.size) return;

        const isHorizontal = Math.random() < 0.65; // 가로 기준 우선

        if (isHorizontal) {
            const r = Math.floor(Math.random() * (this.size - 2)) + 1;
            const startC = Math.max(0, Math.floor((this.size - len) / 2));

            // 뒤의 2글자 (예: FISH의 S와 H)는 같은 줄에 이미 나란히 연속 배치!
            this.grid[r][startC + len - 2].letter = word[len - 2];
            this.grid[r][startC + len - 1].letter = word[len - 1];

            // 2번째 글자 (예: I)는 그 바로 앞 줄의 위나 아래 1칸에 배치 (1번 스왑으로 S, H 앞에 연결 가능)
            const midC = startC + len - 3;
            const swapR = (r + 1 < this.size) ? r + 1 : r - 1;
            this.grid[swapR][midC].letter = word[len - 3];
            
            // 빈 자리에는 더미 글자 배치
            const dummies = this.pool.filter(l => !word.includes(l));
            const dummyLetter = dummies.length > 0 ? dummies[0] : 'O';
            this.grid[r][midC].letter = dummyLetter;

            // 첫 글자 (예: F)는 1~2칸 거리 (바로 앞 칸 또는 인접 행)에 배치
            if (len >= 4 && startC > 0) {
                // startC - 1 위치에 첫 글자 배치
                this.grid[r][startC - 1].letter = word[0];
            } else {
                // 바로 위나 아래
                const firstR = (r - 1 >= 0) ? r - 1 : r + 1;
                this.grid[firstR][startC].letter = word[0];
            }
        } else {
            // 세로 방향
            const c = Math.floor(Math.random() * (this.size - 2)) + 1;
            const startR = Math.max(0, Math.floor((this.size - len) / 2));

            // 뒤의 2글자는 세로로 연속 배치!
            this.grid[startR + len - 2][c].letter = word[len - 2];
            this.grid[startR + len - 1][c].letter = word[len - 1];

            const midR = startR + len - 3;
            const swapC = (c + 1 < this.size) ? c + 1 : c - 1;
            this.grid[midR][swapC].letter = word[len - 3];

            const dummies = this.pool.filter(l => !word.includes(l));
            const dummyLetter = dummies.length > 0 ? dummies[0] : 'O';
            this.grid[midR][c].letter = dummyLetter;

            const firstC = (c - 1 >= 0) ? c - 1 : c + 1;
            this.grid[startR][firstC].letter = word[0];
        }
    }

    // 타일 선택 및 스왑 처리
    async handleTileClick(row, col) {
        if (this.isProcessing) return;

        const clicked = this.grid[row][col];
        if (!clicked) return;

        if (!this.selectedTile) {
            // 첫 번째 타일 선택
            this.selectedTile = clicked;
            window.soundEngine.playSelect();
            this.onStateChange('tile_selected', { tile: clicked });
            return;
        }

        // 이미 선택된 타일을 다시 클릭한 경우 취소
        if (this.selectedTile.row === row && this.selectedTile.col === col) {
            this.selectedTile = null;
            this.onStateChange('tile_deselected', null);
            return;
        }

        // 두 타일이 인접한지 확인
        const rDiff = Math.abs(this.selectedTile.row - row);
        const cDiff = Math.abs(this.selectedTile.col - col);
        const isAdjacent = (rDiff === 1 && cDiff === 0) || (rDiff === 0 && cDiff === 1);

        if (!isAdjacent) {
            // 인접하지 않으면 새로 선택
            this.selectedTile = clicked;
            window.soundEngine.playSelect();
            this.onStateChange('tile_selected', { tile: clicked });
            return;
        }

        // 스왑 실행
        const tileA = this.selectedTile;
        const tileB = clicked;
        this.selectedTile = null;

        await this.trySwap(tileA, tileB);
    }

    async trySwap(tileA, tileB) {
        this.isProcessing = true;
        this.moveCount++;
        window.soundEngine.playSwap();

        const hasWildcard = (tileA.letter === '?' || tileA.isWildcard || tileB.letter === '?' || tileB.isWildcard);

        // 1. 시각적 슬라이딩 애니메이션 시작 알림
        this.onStateChange('swap_anim_start', { tileA, tileB });
        await this.delay(250);

        // 2. 가상 스왑 수행 (데이터 교환)
        this.swapGridLetters(tileA, tileB);

        // 3. 힌트 보석(와일드카드)이 포함된 경우:
        // 와일드카드는 어떤 글자로도 변신 가능하므로 이동 후 사용자에게 글자를 선택/입력받음!
        if (hasWildcard) {
            this.onStateChange('swap_anim_confirm', { tileA, tileB });
            await this.delay(60);

            // 움직인 와일드카드 타일 확인 및 변신 처리
            const wildcardTiles = [tileA, tileB].filter(t => t.letter === '?' || t.isWildcard);
            for (const wt of wildcardTiles) {
                if (this.onPromptWildcard) {
                    const chosenLetter = await this.onPromptWildcard(wt);
                    if (chosenLetter) {
                        wt.letter = chosenLetter.toUpperCase();
                        wt.isWildcard = false;
                        window.soundEngine.playMatch(2);
                        this.onStateChange('tile_transformed', { tile: wt });
                        await this.delay(200);
                    }
                }
            }

            // 변신 후 목표 단어가 완성되었는지 확인!
            const postWildcardWordCheck = this.checkTargetWordOnBoard();
            if (postWildcardWordCheck.found) {
                await this.handleWordCompletion(postWildcardWordCheck);
                this.isProcessing = false;
                return;
            }

            // 변신 후 3-매치 연쇄 폭발 처리
            await this.processMatchesAndCascades();

            // 연쇄 폭발 후에도 단어가 완성되었는지 최종 확인
            const finalCheck = this.checkTargetWordOnBoard();
            if (finalCheck.found) {
                await this.handleWordCompletion(finalCheck);
            }

            this.isProcessing = false;
            return;
        }

        // 일반 타일 간의 스왑:
        const wordCheck = this.checkTargetWordOnBoard();
        const matches = this.findMatches();
        const isValidMove = wordCheck.found || matches.length > 0 || this.freeSwapMode;

        if (!isValidMove) {
            // 유효하지 않은 이동: 다시 원위치로 롤백 애니메이션
            window.soundEngine.playInvalid();
            this.swapGridLetters(tileA, tileB); // 데이터 원복
            this.onStateChange('swap_anim_rollback', { tileA, tileB });
            await this.delay(220);
            this.onStateChange('swap_anim_end', null);
            this.isProcessing = false;
            return;
        }

        // 유효한 이동: 스왑 확정 및 DOM 동기화
        this.onStateChange('swap_anim_confirm', { tileA, tileB });
        await this.delay(50);

        // 먼저 타겟 단어가 완성되었는지 확인!
        if (wordCheck.found) {
            await this.handleWordCompletion(wordCheck);
            this.isProcessing = false;
            return;
        }

        // 일반 3-매치 처리 루프 (연쇄 폭발/낙하)
        await this.processMatchesAndCascades();

        // 연쇄 폭발 후에도 단어가 만들어졌는지 최종 확인!
        const postCheck = this.checkTargetWordOnBoard();
        if (postCheck.found) {
            await this.handleWordCompletion(postCheck);
        }

        this.isProcessing = false;
    }

    swapGridLetters(tA, tB) {
        const tempLetter = tA.letter;
        tA.letter = tB.letter;
        tB.letter = tempLetter;

        const tempWildcard = !!tA.isWildcard;
        tA.isWildcard = !!tB.isWildcard;
        tB.isWildcard = tempWildcard;
    }

    // 보드 상에 3개 이상 연속된 동일 알파벳 매치 찾기
    findMatches() {
        const matchedTiles = new Set();

        // 가로 검사
        for (let r = 0; r < this.size; r++) {
            let matchLen = 1;
            for (let c = 1; c <= this.size; c++) {
                if (c < this.size && this.grid[r][c].letter === this.grid[r][c - 1].letter) {
                    matchLen++;
                } else {
                    if (matchLen >= 3) {
                        for (let k = c - matchLen; k < c; k++) {
                            matchedTiles.add(this.grid[r][k]);
                        }
                    }
                    matchLen = 1;
                }
            }
        }

        // 세로 검사
        for (let c = 0; c < this.size; c++) {
            let matchLen = 1;
            for (let r = 1; r <= this.size; r++) {
                if (r < this.size && this.grid[r][c].letter === this.grid[r - 1][c].letter) {
                    matchLen++;
                } else {
                    if (matchLen >= 3) {
                        for (let k = r - matchLen; k < r; k++) {
                            matchedTiles.add(this.grid[k][c]);
                        }
                    }
                    matchLen = 1;
                }
            }
        }

        return Array.from(matchedTiles);
    }

    // 타겟 단어 완성 여부 검사 (가로 또는 세로 연속 배열)
    // 아직 완성되지 않은 목표 단어들(CAT, DOG 등) 중 보드 위에 완성된 단어가 있는지 검사
    checkTargetWordOnBoard() {
        const remainingWords = this.allWords.filter(w => !this.completedWords.includes(w));
        if (remainingWords.length === 0) return { found: false };

        // 현재 타겟 단어를 가장 먼저 검사하고, 남은 다른 단어도 순차 검사
        const wordsToCheck = [
            this.targetWord,
            ...remainingWords.filter(w => w !== this.targetWord)
        ];

        for (const target of wordsToCheck) {
            const len = target.length;
            if (!target || len === 0 || len > this.size) continue;

            // 가로 검사 (왼쪽 -> 오른쪽)
            for (let r = 0; r < this.size; r++) {
                for (let c = 0; c <= this.size - len; c++) {
                    let match = true;
                    const tiles = [];
                    for (let i = 0; i < len; i++) {
                        if (this.grid[r][c + i].letter !== target[i]) {
                            match = false;
                            break;
                        }
                        tiles.push(this.grid[r][c + i]);
                    }
                    if (match) {
                        return { found: true, word: target, direction: 'horizontal', tiles };
                    }
                }
            }

            // 세로 검사 (위 -> 아래)
            for (let c = 0; c < this.size; c++) {
                for (let r = 0; r <= this.size - len; r++) {
                    let match = true;
                    const tiles = [];
                    for (let i = 0; i < len; i++) {
                        if (this.grid[r + i][c].letter !== target[i]) {
                            match = false;
                            break;
                        }
                        tiles.push(this.grid[r + i][c]);
                    }
                    if (match) {
                        return { found: true, word: target, direction: 'vertical', tiles };
                    }
                }
            }
        }

        return { found: false };
    }

    // 단어 완성 시 처리
    async handleWordCompletion(wordResult) {
        // 해당 타일 완성 플래그 설정
        wordResult.tiles.forEach(t => t.isWordPart = true);
        
        // 단어 완성 점수
        const wordScore = 1000 + wordResult.word.length * 250;
        this.score += wordScore;

        // UI에 단어 완성 알림 (UI에서 완성된 위치 스포트라이트 및 철자별 음성 낭독 실행)
        this.onStateChange('word_formed', { ...wordResult, wordScore });

        // 완성 목록에 추가
        if (!this.completedWords.includes(wordResult.word)) {
            this.completedWords.push(wordResult.word);
        }
        this.onWordCompleted(wordResult.word);

        // 철자 읽기 및 스포트라이트를 충분히 감상할 수 있도록 시간 대기
        const readingDuration = wordResult.word.length * 480 + 1600;
        await this.delay(readingDuration);

        // 하이라이트 플래그 해제 (보드의 타일은 터뜨리지 않고 그대로 보존!)
        wordResult.tiles.forEach(t => t.isWordPart = false);

        // 아직 완성하지 못한 단어가 남아있는지 확인
        const remainingWords = this.allWords.filter(w => !this.completedWords.includes(w));

        if (remainingWords.length > 0) {
            // 다음 목표 단어로 전환 (★ 새로운 보석을 만들지 않고 현재 보드 그대로 진행!)
            this.targetWord = remainingWords[0];
            this.currentWordIndex = this.allWords.indexOf(this.targetWord);

            this.onStateChange('next_word_ready', {
                word: this.targetWord,
                index: this.currentWordIndex,
                total: this.allWords.length,
                completedWords: this.completedWords
            });
            // ★ 보드 타일 터뜨림 및 리필 없음 (clearAndRefillWordTiles 호출하지 않음!)
        } else {
            // 모든 단어 완성 -> 미션 성공 클리어!
            this.onMissionCompleted({
                mission: this.mission,
                score: this.score,
                moves: this.moveCount
            });
        }
    }

    async clearAndRefillWordTiles(wordTiles) {
        wordTiles.forEach(t => {
            t.letter = null;
            t.isWordPart = false;
        });
        await this.applyGravityAndRefill();
    }

    // 매칭 제거 및 낙하 연쇄 루프
    async processMatchesAndCascades() {
        let cascadeCount = 0;

        while (true) {
            const matches = this.findMatches();
            if (matches.length === 0) break;

            cascadeCount++;
            this.combo++;
            
            // 점수 계산: 3매치 100점 기본, 4개 이상 매치 보너스 + 콤보 배수
            const baseScore = 100 * this.combo;
            const extraScore = Math.max(0, matches.length - 3) * 60 * this.combo;
            const gainedScore = baseScore + extraScore;
            this.score += gainedScore;

            window.soundEngine.playMatch(this.combo);

            // 매칭된 타일 표시 및 애니메이션
            matches.forEach(t => t.matched = true);
            this.onStateChange('tiles_matched', { matches, combo: this.combo, gainedScore });
            await this.delay(260);

            // 타일 비우기
            matches.forEach(t => {
                t.letter = null;
                t.matched = false;
            });

            // 중력 적용 및 새 타일 리필
            await this.applyGravityAndRefill();

            // 중간에 목표 단어가 완성되었는지도 검사!
            const wordCheck = this.checkTargetWordOnBoard();
            if (wordCheck.found) {
                return; // 루프 종료하고 상위에서 단어 처리
            }
        }

        this.combo = 0;
    }

    // 중력 낙하 및 상단 새 블록 리필
    async applyGravityAndRefill() {
        let moved = false;

        // 열(col)별로 아래로 떨어뜨리기
        for (let c = 0; c < this.size; c++) {
            let emptyRow = this.size - 1;
            for (let r = this.size - 1; r >= 0; r--) {
                if (this.grid[r][c].letter !== null) {
                    if (emptyRow !== r) {
                        this.grid[emptyRow][c].letter = this.grid[r][c].letter;
                        this.grid[emptyRow][c].isWildcard = !!this.grid[r][c].isWildcard;
                        this.grid[r][c].letter = null;
                        this.grid[r][c].isWildcard = false;
                        moved = true;
                    }
                    emptyRow--;
                }
            }

            // 빈 상단 칸에 새 알파벳 리필
            for (let r = emptyRow; r >= 0; r--) {
                // 4글자 이상 레벨에서 보드에 힌트 보석(?)이 하나도 없으면 약 15% 확률로 힌트 보석 리필
                if (this.allowWildcard && this.countWildcards() === 0 && Math.random() < 0.15) {
                    this.grid[r][c].letter = '?';
                    this.grid[r][c].isWildcard = true;
                } else {
                    this.grid[r][c].letter = this.getRandomLetter();
                    this.grid[r][c].isWildcard = false;
                }
                moved = true;
            }
        }

        this.onStateChange('board_refilled', null);
        await this.delay(220);
    }

    countWildcards() {
        let count = 0;
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c] && (this.grid[r][c].letter === '?' || this.grid[r][c].isWildcard)) {
                    count++;
                }
            }
        }
        return count;
    }

    // 힌트 찾기: 1번 스왑으로 단어를 완성하거나 3매치를 만들 수 있는 수 탐색
    findHint() {
        const target = this.targetWord;

        // 1순위: 단어 완성 스왑 찾기
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                // 오른쪽과 스왑 시뮬레이션
                if (c + 1 < this.size) {
                    this.swapGridLetters(this.grid[r][c], this.grid[r][c + 1]);
                    const wordRes = this.checkTargetWordOnBoard();
                    this.swapGridLetters(this.grid[r][c], this.grid[r][c + 1]); // 복구
                    if (wordRes.found) {
                        return {
                            type: 'word',
                            tileA: this.grid[r][c],
                            tileB: this.grid[r][c + 1],
                            message: `💡 '${target}' 단어를 완성할 수 있는 블록을 바꿔보세요!`
                        };
                    }
                }
                // 아래와 스왑 시뮬레이션
                if (r + 1 < this.size) {
                    this.swapGridLetters(this.grid[r][c], this.grid[r + 1][c]);
                    const wordRes = this.checkTargetWordOnBoard();
                    this.swapGridLetters(this.grid[r][c], this.grid[r + 1][c]); // 복구
                    if (wordRes.found) {
                        return {
                            type: 'word',
                            tileA: this.grid[r][c],
                            tileB: this.grid[r + 1][c],
                            message: `💡 '${target}' 단어를 완성할 수 있는 블록을 바꿔보세요!`
                        };
                    }
                }
            }
        }

        // 2순위: 일반 3-매치 스왑 찾기
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (c + 1 < this.size) {
                    this.swapGridLetters(this.grid[r][c], this.grid[r][c + 1]);
                    const matches = this.findMatches();
                    this.swapGridLetters(this.grid[r][c], this.grid[r][c + 1]);
                    if (matches.length > 0) {
                        return {
                            type: 'match',
                            tileA: this.grid[r][c],
                            tileB: this.grid[r][c + 1],
                            message: `💡 같은 글자 3개를 맞추어 블록을 정리해보세요!`
                        };
                    }
                }
                if (r + 1 < this.size) {
                    this.swapGridLetters(this.grid[r][c], this.grid[r + 1][c]);
                    const matches = this.findMatches();
                    this.swapGridLetters(this.grid[r][c], this.grid[r + 1][c]);
                    if (matches.length > 0) {
                        return {
                            type: 'match',
                            tileA: this.grid[r][c],
                            tileB: this.grid[r + 1][c],
                            message: `💡 같은 글자 3개를 맞추어 블록을 정리해보세요!`
                        };
                    }
                }
            }
        }

        return null;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

window.GameBoard = GameBoard;
window.getGemStyle = getGemStyle;
