// Main Game UI Application Controller

class GameApp {
    constructor() {
        this.board = null;
        this.currentMissionId = null;
        this.boardContainer = document.getElementById('game-grid');
        this.targetWordContainer = document.getElementById('target-word-display');
        this.scoreDisplay = document.getElementById('score-val');
        this.movesDisplay = document.getElementById('moves-val');
        this.missionTitle = document.getElementById('mission-title');
        this.missionDesc = document.getElementById('mission-desc');
        this.missionSelector = document.getElementById('mission-select');
        this.winModal = document.getElementById('win-modal');
        this.timeOverModal = document.getElementById('timeover-modal');

        // Wildcard Joker Gem Modal Elements
        this.wildcardModal = document.getElementById('wildcard-modal');
        this.wildcardQuickLetters = document.getElementById('wildcard-quick-letters');
        this.wildcardCustomInput = document.getElementById('wildcard-custom-input');
        this.btnWildcardSubmit = document.getElementById('btn-wildcard-custom-submit');
        this.wildcardResolve = null;
        this.isWildcardModalOpen = false;

        // Timer elements
        this.timerText = document.getElementById('timer-val');
        this.timerBar = document.getElementById('timer-bar-fill');
        this.timerInterval = null;
        this.timeLeft = 60;
        this.initialTime = 60;

        this.freeSwapMode = false;
        this.hintTimeout = null;

        this.init();
    }

    init() {
        this.loadMissionListUI();
        this.bindEvents();

        // 첫 번째 미션으로 시작
        const firstMission = window.levelManager.missions[0];
        if (firstMission) {
            this.startMission(firstMission.id);
        }
    }

    loadMissionListUI() {
        if (!this.missionSelector) return;
        this.missionSelector.innerHTML = '';
        const missions = window.levelManager.getAllMissions();

        missions.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.id;
            const diffSymbol = m.difficulty === 'easy' ? '🟢' : m.difficulty === 'medium' ? '🟡' : '🔴';
            const timeInfo = m.timeLimit ? ` [${m.timeLimit}초]` : ' [무제한]';
            opt.textContent = `${diffSymbol} ${m.name} (${m.words.join(', ')})${timeInfo}`;
            this.missionSelector.appendChild(opt);
        });

        if (this.currentMissionId) {
            this.missionSelector.value = this.currentMissionId;
        }
    }

    bindEvents() {
        if (this.missionSelector) {
            this.missionSelector.addEventListener('change', (e) => {
                this.startMission(e.target.value);
            });
        }

        // 재시작 버튼
        const btnRestart = document.getElementById('btn-restart');
        if (btnRestart) {
            btnRestart.addEventListener('click', () => {
                if (this.currentMissionId) {
                    this.startMission(this.currentMissionId);
                }
            });
        }

        // 힌트 버튼
        const btnHint = document.getElementById('btn-hint');
        if (btnHint) {
            btnHint.addEventListener('click', () => {
                this.showHint();
            });
        }

        // 사운드 토글
        const btnSound = document.getElementById('btn-sound-toggle');
        if (btnSound) {
            btnSound.addEventListener('click', () => {
                window.soundEngine.soundEnabled = !window.soundEngine.soundEnabled;
                btnSound.textContent = window.soundEngine.soundEnabled ? '🔊 효과음 ON' : '🔇 효과음 OFF';
                btnSound.classList.toggle('off', !window.soundEngine.soundEnabled);
            });
        }

        // 발음 토글
        const btnSpeech = document.getElementById('btn-speech-toggle');
        if (btnSpeech) {
            btnSpeech.addEventListener('click', () => {
                window.soundEngine.speechEnabled = !window.soundEngine.speechEnabled;
                btnSpeech.textContent = window.soundEngine.speechEnabled ? '🗣️ 발음 ON' : '🤐 발음 OFF';
                btnSpeech.classList.toggle('off', !window.soundEngine.speechEnabled);
            });
        }

        // 자유 스왑 모드 토글
        const chkFreeSwap = document.getElementById('chk-free-swap');
        if (chkFreeSwap) {
            chkFreeSwap.addEventListener('change', (e) => {
                this.freeSwapMode = e.target.checked;
                if (this.board) {
                    this.board.freeSwapMode = this.freeSwapMode;
                }
            });
        }

        // 승리 모달 버튼
        const btnNextLevel = document.getElementById('btn-next-level');
        if (btnNextLevel) {
            btnNextLevel.addEventListener('click', () => {
                this.winModal.classList.remove('active');
                this.goToNextMission();
            });
        }

        const btnPlayAgain = document.getElementById('btn-play-again');
        if (btnPlayAgain) {
            btnPlayAgain.addEventListener('click', () => {
                this.winModal.classList.remove('active');
                this.startMission(this.currentMissionId);
            });
        }

        const btnHearWord = document.getElementById('btn-hear-word');
        if (btnHearWord) {
            btnHearWord.addEventListener('click', () => {
                if (this.board && this.board.mission) {
                    this.board.mission.words.forEach(w => window.soundEngine.speakWord(w));
                }
            });
        }

        // 타임오버 모달 버튼
        const btnRetryTimeover = document.getElementById('btn-retry-timeover');
        if (btnRetryTimeover) {
            btnRetryTimeover.addEventListener('click', () => {
                this.timeOverModal.classList.remove('active');
                this.startMission(this.currentMissionId);
            });
        }

        // 와일드카드 모달 직접 입력 제출 버튼
        if (this.btnWildcardSubmit) {
            this.btnWildcardSubmit.addEventListener('click', () => {
                const char = (this.wildcardCustomInput ? this.wildcardCustomInput.value : '').trim().toUpperCase();
                if (char && /^[A-Z]$/.test(char)) {
                    this.finishWildcardPrompt(char);
                } else {
                    alert('알파벳 한 글자(A~Z)를 입력해주세요!');
                }
            });
        }

        // 와일드카드 직접 입력란 엔터 키 지원
        if (this.wildcardCustomInput) {
            this.wildcardCustomInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (this.btnWildcardSubmit) {
                        this.btnWildcardSubmit.click();
                    }
                }
            });
        }
    }

    startMission(missionId) {
        this.stopTimer();
        this.currentMissionId = missionId;
        if (this.missionSelector) {
            this.missionSelector.value = missionId;
        }

        const mission = window.levelManager.getMission(missionId);
        if (!mission) return;

        // 헤더 정보 업데이트
        if (this.missionTitle) this.missionTitle.textContent = mission.name;
        if (this.missionDesc) this.missionDesc.textContent = mission.description || '';

        // 타이머 초기화 (기본 60초 또는 미션 설정값)
        this.initialTime = (typeof mission.timeLimit !== 'undefined') ? mission.timeLimit : 60;
        this.timeLeft = this.initialTime;
        this.updateTimerDisplay();
        this.startTimer();

        // 게임 보드 생성 (4자 이상 시 마법 힌트 보석 프롬프트 핸들러 연결)
        this.board = new window.GameBoard(mission, {
            freeSwapMode: this.freeSwapMode,
            onPromptWildcard: (tile) => this.showWildcardPrompt(tile),
            onStateChange: (event, data) => this.handleBoardStateChange(event, data),
            onWordCompleted: (word) => this.handleWordCompleted(word),
            onMissionCompleted: (result) => this.handleMissionCompleted(result)
        });

        this.renderTargetWordUI();
        this.renderGrid();
        this.updateStats();

        // 시작 단어 발음 들려주기
        setTimeout(() => {
            window.soundEngine.speakWord(this.board.targetWord);
        }, 400);

        this.resetHintTimer();
    }

    // --- 타이머 기능 ---
    startTimer() {
        this.stopTimer();
        if (this.initialTime <= 0) {
            if (this.timerText) this.timerText.textContent = '무제한';
            if (this.timerBar) this.timerBar.style.width = '100%';
            return;
        }

        this.timerInterval = setInterval(() => {
            // 애니메이션 중이거나 힌트 보석 모달 열려있을 때는 시간 일시 정지 배려
            if (!this.board || this.board.isProcessing || this.isWildcardModalOpen) return;

            this.timeLeft--;
            this.updateTimerDisplay();

            // 10초 이하 경고음
            if (this.timeLeft <= 10 && this.timeLeft > 0) {
                window.soundEngine.playTick();
            }

            if (this.timeLeft <= 0) {
                this.stopTimer();
                this.handleTimeOver();
            }
        }, 1000);
    }

    // --- 마법의 힌트 보석 (와일드카드) 변신 팝업 UI 제어 ---
    showWildcardPrompt(tile) {
        return new Promise((resolve) => {
            this.wildcardResolve = resolve;
            this.isWildcardModalOpen = true;

            if (this.wildcardModal) {
                this.wildcardModal.classList.add('active');
            }

            if (this.wildcardCustomInput) {
                this.wildcardCustomInput.value = '';
                setTimeout(() => this.wildcardCustomInput.focus(), 120);
            }

            // 추천 글자 버튼 목록 구성: 현재 목표 단어 철자들 및 미션 내 모든 단어 철자들
            if (this.wildcardQuickLetters && this.board) {
                this.wildcardQuickLetters.innerHTML = '';

                const currentTargetLetters = this.board.targetWord.split('');
                const extraLetters = [];
                this.board.allWords.forEach(w => {
                    for (let c of w) {
                        if (!currentTargetLetters.includes(c) && !extraLetters.includes(c)) {
                            extraLetters.push(c);
                        }
                    }
                });

                const allSuggested = [...currentTargetLetters, ...extraLetters];
                allSuggested.forEach(char => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'wildcard-letter-btn';
                    const style = window.getGemStyle(char);
                    btn.style.background = style.bg;
                    btn.style.borderColor = style.border;
                    btn.style.boxShadow = `0 4px 12px ${style.shadow}`;
                    btn.textContent = char;

                    btn.addEventListener('click', () => {
                        this.finishWildcardPrompt(char);
                    });

                    this.wildcardQuickLetters.appendChild(btn);
                });
            }
        });
    }

    finishWildcardPrompt(char) {
        const cleanChar = (char || '').trim().toUpperCase();
        if (!cleanChar || !/^[A-Z]$/.test(cleanChar)) return;

        if (this.wildcardModal) {
            this.wildcardModal.classList.remove('active');
        }
        this.isWildcardModalOpen = false;

        if (this.wildcardResolve) {
            const resolveFn = this.wildcardResolve;
            this.wildcardResolve = null;
            resolveFn(cleanChar);
        }
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        if (!this.timerText) return;
        if (this.initialTime <= 0) {
            this.timerText.textContent = '무제한 ♾️';
            if (this.timerBar) this.timerBar.style.width = '100%';
            return;
        }

        const mins = Math.floor(this.timeLeft / 60);
        const secs = this.timeLeft % 60;
        this.timerText.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        const pct = Math.max(0, Math.min(100, (this.timeLeft / this.initialTime) * 100));
        if (this.timerBar) {
            this.timerBar.style.width = `${pct}%`;
            if (pct <= 25) {
                this.timerBar.className = 'timer-bar-fill danger';
            } else if (pct <= 50) {
                this.timerBar.className = 'timer-bar-fill warning';
            } else {
                this.timerBar.className = 'timer-bar-fill normal';
            }
        }
    }

    handleTimeOver() {
        window.soundEngine.playGameOver();
        if (this.timeOverModal) {
            this.timeOverModal.classList.add('active');
        }
    }

    // --- 타겟 단어 트래커 UI ---
    renderTargetWordUI() {
        if (!this.targetWordContainer || !this.board) return;
        this.targetWordContainer.innerHTML = '';

        const mission = this.board.mission;
        const currentTarget = this.board.targetWord;

        mission.words.forEach(w => {
            const wordBox = document.createElement('div');
            const isDone = this.board.completedWords.includes(w);
            const isCurrent = (w === currentTarget) && !isDone;

            wordBox.className = `target-word-box ${isDone ? 'completed' : ''} ${isCurrent ? 'active-target' : ''}`;

            const meaning = (mission.meanings && mission.meanings[w]) ? mission.meanings[w] : '';

            let letterBoxesHtml = '';
            for (let char of w) {
                const style = window.getGemStyle(char);
                letterBoxesHtml += `
                    <div class="target-letter-gem" style="background: ${style.bg}; border-color: ${style.border};">
                        ${char}
                    </div>
                `;
            }

            wordBox.innerHTML = `
                <div class="target-word-letters">
                    ${letterBoxesHtml}
                </div>
                <div class="target-word-meta">
                    <span class="word-text">${w}</span>
                    <span class="word-meaning">${meaning}</span>
                    ${isDone ? '<span class="status-check">✅ 완성!</span>' : isCurrent ? '<span class="status-target">🎯 목표</span>' : '<span class="status-wait">대기</span>'}
                </div>
            `;

            wordBox.addEventListener('click', () => {
                window.soundEngine.speakWord(w);
            });

            this.targetWordContainer.appendChild(wordBox);
        });
    }

    renderGrid() {
        if (!this.boardContainer || !this.board) return;

        const size = this.board.size;
        this.boardContainer.innerHTML = '';
        this.boardContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        this.boardContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const tile = this.board.grid[r][c];
                const tileEl = document.createElement('div');
                tileEl.className = 'gem-tile';
                tileEl.id = `tile-el-${r}-${c}`;
                tileEl.dataset.row = r;
                tileEl.dataset.col = c;

                this.updateTileElement(tileEl, tile);

                // 마우스 드래그 및 터치 스와이프
                let startX = 0;
                let startY = 0;
                let isDragging = false;

                tileEl.addEventListener('mousedown', (e) => {
                    startX = e.clientX;
                    startY = e.clientY;
                    isDragging = true;
                });

                tileEl.addEventListener('mouseup', (e) => {
                    if (!isDragging) return;
                    isDragging = false;
                    const diffX = e.clientX - startX;
                    const diffY = e.clientY - startY;
                    const threshold = 25;

                    if (Math.abs(diffX) > threshold || Math.abs(diffY) > threshold) {
                        this.clearHints();
                        let targetR = r;
                        let targetC = c;
                        if (Math.abs(diffX) > Math.abs(diffY)) {
                            targetC += diffX > 0 ? 1 : -1;
                        } else {
                            targetR += diffY > 0 ? 1 : -1;
                        }
                        if (targetR >= 0 && targetR < this.board.size && targetC >= 0 && targetC < this.board.size) {
                            this.board.selectedTile = this.board.grid[r][c];
                            this.board.handleTileClick(targetR, targetC);
                            return;
                        }
                    }

                    this.clearHints();
                    this.board.handleTileClick(r, c);
                });

                tileEl.addEventListener('touchstart', (e) => {
                    const touch = e.touches[0];
                    startX = touch.clientX;
                    startY = touch.clientY;
                }, { passive: true });

                tileEl.addEventListener('touchend', (e) => {
                    const touch = e.changedTouches[0];
                    const diffX = touch.clientX - startX;
                    const diffY = touch.clientY - startY;
                    const threshold = 25;

                    if (Math.abs(diffX) > threshold || Math.abs(diffY) > threshold) {
                        this.clearHints();
                        let targetR = r;
                        let targetC = c;
                        if (Math.abs(diffX) > Math.abs(diffY)) {
                            targetC += diffX > 0 ? 1 : -1;
                        } else {
                            targetR += diffY > 0 ? 1 : -1;
                        }
                        if (targetR >= 0 && targetR < this.board.size && targetC >= 0 && targetC < this.board.size) {
                            this.board.selectedTile = this.board.grid[r][c];
                            this.board.handleTileClick(targetR, targetC);
                            return;
                        }
                    }

                    this.clearHints();
                    this.board.handleTileClick(r, c);
                });

                this.boardContainer.appendChild(tileEl);
            }
        }
    }

    updateTileElement(el, tile) {
        if (!tile || !tile.letter) {
            el.className = 'gem-tile empty';
            el.style.background = 'transparent';
            el.style.borderColor = 'transparent';
            el.style.boxShadow = 'none';
            el.innerHTML = '';
            return;
        }

        // 마법의 힌트 보석 (와일드카드 Joker Gem: ?)
        if (tile.letter === '?' || tile.isWildcard) {
            const style = window.getGemStyle('?');
            el.className = 'gem-tile wildcard-gem';
            el.style.background = style.bg;
            el.style.borderColor = style.border;
            el.style.boxShadow = `0 0 16px ${style.shadow}, inset 0 2px 6px rgba(255,255,255,0.85)`;
            el.innerHTML = `
                <span class="gem-shine"></span>
                <span class="gem-letter wildcard-pulse">?</span>
            `;

            if (this.board.selectedTile && this.board.selectedTile.row === tile.row && this.board.selectedTile.col === tile.col) {
                el.classList.add('selected');
            }
            if (tile.matched) {
                el.classList.add('pop-match');
            }
            return;
        }

        const targetWord = (this.board && this.board.targetWord) ? this.board.targetWord : '';
        const isTargetLetter = targetWord.includes(tile.letter);

        const style = window.getGemStyle(tile.letter);
        el.className = 'gem-tile';
        el.style.background = style.bg;
        el.style.borderColor = style.border;
        el.style.boxShadow = `0 6px 12px ${style.shadow}, inset 0 2px 4px rgba(255,255,255,0.6)`;

        if (isTargetLetter) {
            el.classList.add('target-word-gem');
        } else {
            // 목표 단어가 아닌 방해 더미 글자는 살짝 톤다운하여 시각적 혼란 방지
            el.classList.add('dummy-gem');
        }

        el.innerHTML = `
            <span class="gem-shine"></span>
            <span class="gem-letter">${tile.letter}</span>
        `;

        if (this.board.selectedTile && this.board.selectedTile.row === tile.row && this.board.selectedTile.col === tile.col) {
            el.classList.add('selected');
        }

        if (tile.matched) {
            el.classList.add('pop-match');
        }

        if (tile.isWordPart) {
            el.classList.add('word-sparkle');
        }
    }

    syncAllTiles() {
        if (!this.board) return;
        const size = this.board.size;
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const el = document.getElementById(`tile-el-${r}-${c}`);
                if (el) {
                    el.style.transform = '';
                    el.style.transition = '';
                    el.style.zIndex = '';
                    this.updateTileElement(el, this.board.grid[r][c]);
                }
            }
        }
        this.updateStats();
    }

    updateStats() {
        if (this.scoreDisplay && this.board) this.scoreDisplay.textContent = this.board.score;
        if (this.movesDisplay && this.board) this.movesDisplay.textContent = this.board.moveCount;
    }

    // --- 스왑 슬라이딩 애니메이션 및 상태 핸들러 ---
    handleBoardStateChange(event, data) {
        this.resetHintTimer();

        if (event === 'tile_selected') {
            const el = document.getElementById(`tile-el-${data.tile.row}-${data.tile.col}`);
            if (el) el.classList.add('selected');
        } else if (event === 'tile_deselected') {
            document.querySelectorAll('.gem-tile.selected').forEach(el => el.classList.remove('selected'));
        } else if (event === 'tile_transformed') {
            // 마법의 힌트 보석이 새로운 알파벳으로 변신했을 때 빛나는 연출!
            this.syncAllTiles();
            const el = document.getElementById(`tile-el-${data.tile.row}-${data.tile.col}`);
            if (el) {
                el.classList.add('transform-sparkle');
                setTimeout(() => el.classList.remove('transform-sparkle'), 650);
            }
        } else if (event === 'swap_anim_start') {
            // 보석 2개가 서로 부드럽게 위치를 바꾸는 물리적 슬라이딩 애니메이션 실행!
            this.animateSwap(data.tileA, data.tileB, false);
        } else if (event === 'swap_anim_rollback') {
            // 무효 이동 시 다시 제자리로 돌아오는 모션
            this.animateSwapRollback(data.tileA, data.tileB);
        } else if (event === 'swap_anim_confirm' || event === 'swap_anim_end' || event === 'board_refilled') {
            this.syncAllTiles();
        } else if (event === 'tiles_matched') {
            this.syncAllTiles();
            // 매칭된 위치에 플로팅 점수 표시
            if (data.matches && data.matches.length > 0) {
                const centerTile = data.matches[Math.floor(data.matches.length / 2)];
                const comboText = data.combo > 1 ? `COMBO x${data.combo}! ` : '';
                this.showFloatingScore(centerTile.row, centerTile.col, `+${data.gainedScore} ${comboText}`, data.combo > 1);
            }
        } else if (event === 'word_formed') {
            this.renderTargetWordUI();
            this.highlightCompletedWordOnBoard(data);
        } else if (event === 'next_word_ready') {
            this.renderTargetWordUI();
            this.syncAllTiles();
            setTimeout(() => {
                window.soundEngine.speakWord(data.word);
            }, 600);
        }
    }

    // 완성된 단어의 정확한 위치를 보드 위에서 눈에 띄게 보여주고, 철자 및 단어를 순차적으로 낭독
    highlightCompletedWordOnBoard(data) {
        const { word, tiles, wordScore } = data;
        const gridEl = this.boardContainer;
        if (!gridEl || !tiles || tiles.length === 0) return;

        // 1. 보드 전체에 스포트라이트 활성화 (다른 타일 딤 처리)
        gridEl.classList.add('word-spotlight-active');

        // 2. 완성된 타일 요소들 수집 및 골든 포커스 부여
        const tileElements = tiles.map(t => document.getElementById(`tile-el-${t.row}-${t.col}`)).filter(Boolean);
        tileElements.forEach(el => {
            el.classList.add('word-focus-tile');
        });

        // 3. 음성 낭독 (철자 하나씩 읽으며 통통 튀고 -> 전체 단어 낭독)
        window.soundEngine.spellAndReadWord(word, (index, char) => {
            if (tileElements[index]) {
                const el = tileElements[index];
                el.classList.remove('spelling-bounce');
                void el.offsetWidth; // 트리거 리플로우
                el.classList.add('spelling-bounce');
            }
        });

        // 4. 플로팅 보너스 점수 표시
        const midTile = tiles[Math.floor(tiles.length / 2)];
        this.showFloatingScore(midTile.row, midTile.col, `+${wordScore} 🌟 WORD COMPLETE!`, true);

        // 5. 전체 단어 축하 배너 출력 (전체 낭독 시점에 맞춤)
        setTimeout(() => {
            this.showWordBanner(word, wordScore);
        }, word.length * 480);

        // 6. 감상이 끝난 후 스포트라이트 정리
        const cleanupDuration = word.length * 480 + 1500;
        setTimeout(() => {
            gridEl.classList.remove('word-spotlight-active');
            tileElements.forEach(el => {
                el.classList.remove('word-focus-tile');
                el.classList.remove('spelling-bounce');
            });
        }, cleanupDuration);
    }

    // 두 타일의 실제 물리적 위치를 교차시키는 슬라이딩 애니메이션
    animateSwap(tileA, tileB, isRollback = false) {
        const elA = document.getElementById(`tile-el-${tileA.row}-${tileA.col}`);
        const elB = document.getElementById(`tile-el-${tileB.row}-${tileB.col}`);
        if (!elA || !elB) return;

        const rectA = elA.getBoundingClientRect();
        const rectB = elB.getBoundingClientRect();
        const deltaX = rectB.left - rectA.left;
        const deltaY = rectB.top - rectA.top;

        elA.style.zIndex = '15';
        elB.style.zIndex = '15';
        elA.style.transition = 'transform 0.24s cubic-bezier(0.25, 1, 0.5, 1)';
        elB.style.transition = 'transform 0.24s cubic-bezier(0.25, 1, 0.5, 1)';

        elA.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        elB.style.transform = `translate(${-deltaX}px, ${-deltaY}px)`;
    }

    animateSwapRollback(tileA, tileB) {
        const elA = document.getElementById(`tile-el-${tileA.row}-${tileA.col}`);
        const elB = document.getElementById(`tile-el-${tileB.row}-${tileB.col}`);
        if (!elA || !elB) return;

        elA.style.transition = 'transform 0.2s ease-out';
        elB.style.transition = 'transform 0.2s ease-out';
        elA.style.transform = 'translate(0px, 0px)';
        elB.style.transform = 'translate(0px, 0px)';
    }

    // 보석 파괴 시 위로 떠오르는 획득 점수 텍스트 팝업
    showFloatingScore(row, col, text, isGold = false) {
        const tileEl = document.getElementById(`tile-el-${row}-${col}`);
        if (!tileEl) return;

        const rect = tileEl.getBoundingClientRect();
        const floatEl = document.createElement('div');
        floatEl.className = `floating-score ${isGold ? 'gold' : ''}`;
        floatEl.textContent = text;
        floatEl.style.left = `${rect.left + rect.width / 2}px`;
        floatEl.style.top = `${rect.top}px`;

        document.body.appendChild(floatEl);

        setTimeout(() => {
            floatEl.remove();
        }, 900);
    }

    showWordBanner(word, bonusScore = 0) {
        const banner = document.createElement('div');
        banner.className = 'word-celebration-banner';
        const meaning = (this.board.mission.meanings && this.board.mission.meanings[word]) ? this.board.mission.meanings[word] : '';
        banner.innerHTML = `
            <div class="banner-content">
                <div class="banner-title">✨ 단어 완성! ✨</div>
                <div class="banner-word">${word}</div>
                <div class="banner-sub">${meaning}</div>
                ${bonusScore > 0 ? `<div class="banner-score">+${bonusScore} BONUS!</div>` : ''}
            </div>
        `;
        document.body.appendChild(banner);

        setTimeout(() => {
            banner.classList.add('fade-out');
            setTimeout(() => banner.remove(), 400);
        }, 1400);
    }

    handleWordCompleted(word) {
        this.renderTargetWordUI();
    }

    // 미션 클리어: 빠른 클리어 시간 보너스 계산 및 승리 팝업
    handleMissionCompleted(result) {
        this.stopTimer();
        clearTimeout(this.hintTimeout);

        // 빠른 시간 해결 보너스 계산! (남은 초당 25점 추가)
        const timeBonus = (this.initialTime > 0) ? Math.max(0, this.timeLeft * 25) : 0;
        const totalFinalScore = result.score + timeBonus;

        const winTitle = document.getElementById('win-title');
        const winWordList = document.getElementById('win-words-summary');
        const winScore = document.getElementById('win-score');
        const winMoves = document.getElementById('win-moves');
        const winTimeBonus = document.getElementById('win-time-bonus');

        if (winTitle) winTitle.textContent = `🎉 ${result.mission.name} 클리어!`;
        if (winScore) winScore.textContent = totalFinalScore.toLocaleString();
        if (winMoves) winMoves.textContent = result.moves;
        if (winTimeBonus) {
            winTimeBonus.textContent = timeBonus > 0 ? `+${timeBonus.toLocaleString()}점 (${this.timeLeft}초 남음 x 25점)` : '없음';
        }

        if (winWordList) {
            winWordList.innerHTML = '';
            result.mission.words.forEach(w => {
                const meaning = (result.mission.meanings && result.mission.meanings[w]) || '';
                const item = document.createElement('div');
                item.className = 'win-word-card';
                item.innerHTML = `<strong>${w}</strong> <span>${meaning}</span> <button class="btn-speaker" onclick="window.soundEngine.speakWord('${w}')">🔊</button>`;
                winWordList.appendChild(item);
            });
        }

        setTimeout(() => {
            this.winModal.classList.add('active');
        }, 800);
    }

    goToNextMission() {
        const missions = window.levelManager.getAllMissions();
        const currentIdx = missions.findIndex(m => m.id === this.currentMissionId);
        if (currentIdx !== -1 && currentIdx + 1 < missions.length) {
            this.startMission(missions[currentIdx + 1].id);
        } else {
            this.startMission(missions[0].id);
        }
    }

    showHint() {
        if (!this.board || this.board.isProcessing) return;
        this.clearHints();

        const hint = this.board.findHint();
        if (hint) {
            const elA = document.getElementById(`tile-el-${hint.tileA.row}-${hint.tileA.col}`);
            const elB = document.getElementById(`tile-el-${hint.tileB.row}-${hint.tileB.col}`);

            if (elA) elA.classList.add('hint-pulse');
            if (elB) elB.classList.add('hint-pulse');

            const hintTip = document.getElementById('hint-tooltip');
            if (hintTip) {
                hintTip.textContent = hint.message;
                hintTip.classList.add('active');
                setTimeout(() => hintTip.classList.remove('active'), 3500);
            }
        } else {
            alert('현재 바로 매칭할 수 있는 블록이 없습니다. 다른 블록을 움직여보세요!');
        }
    }

    clearHints() {
        document.querySelectorAll('.hint-pulse').forEach(el => el.classList.remove('hint-pulse'));
        const hintTip = document.getElementById('hint-tooltip');
        if (hintTip) hintTip.classList.remove('active');
    }

    resetHintTimer() {
        clearTimeout(this.hintTimeout);
        this.hintTimeout = setTimeout(() => {
            if (this.board && !this.board.isProcessing) {
                const hint = this.board.findHint();
                if (hint) {
                    const elA = document.getElementById(`tile-el-${hint.tileA.row}-${hint.tileA.col}`);
                    const elB = document.getElementById(`tile-el-${hint.tileB.row}-${hint.tileB.col}`);
                    if (elA) elA.classList.add('hint-pulse');
                    if (elB) elB.classList.add('hint-pulse');
                }
            }
        }, 7000);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.gameApp = new GameApp();
    window.teacherApp = new window.TeacherManager();
});
