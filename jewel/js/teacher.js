// Teacher Management and Mission Customizer

class TeacherManager {
    constructor() {
        this.levelMgr = window.levelManager;
        this.currentEditingId = null;
        this.initUI();
    }

    initUI() {
        const teacherBtn = document.getElementById('btn-teacher');
        const modal = document.getElementById('teacher-modal');
        const closeBtn = document.getElementById('btn-close-teacher');

        if (teacherBtn && modal) {
            teacherBtn.addEventListener('click', () => {
                this.populateGradeSetupInputs();
                this.renderMissionList();
                modal.classList.add('active');
            });
        }

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        // 탭 전환 이벤트 바인딩
        const tabBtns = document.querySelectorAll('.teacher-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const targetTab = btn.dataset.tab;
                document.querySelectorAll('.teacher-tab-content').forEach(c => c.classList.remove('active'));
                const contentEl = document.getElementById(targetTab);
                if (contentEl) contentEl.classList.add('active');
            });
        });

        // 1. 단계별 단어 코스 일괄 적용 버튼
        const btnApplyGradeCourse = document.getElementById('btn-apply-grade-course');
        if (btnApplyGradeCourse) {
            btnApplyGradeCourse.addEventListener('click', () => {
                this.applyGradeWordsFromForm();
            });
        }

        // 2. 기본값 복원 버튼
        const btnResetCourse = document.getElementById('btn-reset-course-default');
        if (btnResetCourse) {
            btnResetCourse.addEventListener('click', () => {
                if (confirm('모든 미션을 기본 권장 프리셋으로 초기화하시겠습니까?')) {
                    this.levelMgr.resetToDefault();
                    this.populateGradeSetupInputs();
                    this.renderMissionList();
                    if (window.gameApp) {
                        window.gameApp.loadMissionListUI();
                        window.gameApp.startMission(this.levelMgr.missions[0].id);
                    }
                    alert('기본 설정으로 복원되었습니다.');
                }
            });
        }

        // 새 미션 추가 버튼 (정밀 편집 탭)
        const btnNewMission = document.getElementById('btn-new-mission');
        if (btnNewMission) {
            btnNewMission.addEventListener('click', () => {
                this.openEditForm(null);
            });
        }

        // 미션 저장 폼 제출
        const editForm = document.getElementById('form-edit-mission');
        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveCurrentForm();
            });
        }

        const btnCancelEdit = document.getElementById('btn-cancel-edit');
        if (btnCancelEdit) {
            btnCancelEdit.addEventListener('click', () => {
                document.getElementById('editor-panel').classList.add('hidden');
                document.getElementById('mission-list-panel').classList.remove('hidden');
            });
        }

        // JSON 내보내기/불러오기
        const btnExport = document.getElementById('btn-export-json');
        if (btnExport) {
            btnExport.addEventListener('click', () => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.levelMgr.missions, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `word_gem_missions_${new Date().toISOString().slice(0,10)}.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
            });
        }

        const importInput = document.getElementById('input-import-json');
        if (importInput) {
            importInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const imported = JSON.parse(event.target.result);
                        if (Array.isArray(imported) && imported.length > 0) {
                            this.levelMgr.missions = imported;
                            this.levelMgr.saveMissions();
                            this.renderMissionList();
                            this.populateGradeSetupInputs();
                            if (window.gameApp) {
                                window.gameApp.loadMissionListUI();
                                window.gameApp.startMission(this.levelMgr.missions[0].id);
                            }
                            alert('미션 목록을 성공적으로 불러왔습니다!');
                        } else {
                            alert('올바르지 않은 미션 파일 형식입니다.');
                        }
                    } catch (err) {
                        alert('JSON 파일을 파싱하는 데 실패했습니다: ' + err.message);
                    }
                };
                reader.readAsText(file);
                importInput.value = '';
            });
        }
    }

    // 현재 등록된 미션들을 바탕으로 단계별 단어 입력창 기본값 채우기
    populateGradeSetupInputs() {
        const easyWordsInput = document.getElementById('course-easy-words');
        const medWordsInput = document.getElementById('course-med-words');
        const hardWordsInput = document.getElementById('course-hard-words');
        const easyTimeInput = document.getElementById('course-easy-time');
        const medTimeInput = document.getElementById('course-med-time');
        const hardTimeInput = document.getElementById('course-hard-time');

        if (!easyWordsInput) return;

        const missions = this.levelMgr.getAllMissions();
        const easyList = [];
        const medList = [];
        const hardList = [];

        missions.forEach(m => {
            const wordStr = m.words.join(' & ');
            if (m.difficulty === 'easy') easyList.push(wordStr);
            else if (m.difficulty === 'medium') medList.push(wordStr);
            else if (m.difficulty === 'hard') hardList.push(wordStr);
        });

        easyWordsInput.value = easyList.length > 0 ? easyList.join(', ') : 'ANT, CAT, DOG, SUN';
        medWordsInput.value = medList.length > 0 ? medList.join(', ') : 'FISH, STAR, BOOK, TREE';
        hardWordsInput.value = hardList.length > 0 ? hardList.join(', ') : 'APPLE, WATER, CAT & DOG';

        if (easyTimeInput) easyTimeInput.value = 60;
        if (medTimeInput) medTimeInput.value = 90;
        if (hardTimeInput) hardTimeInput.value = 120;
    }

    // 단계별 단어 일괄 적용 실행
    applyGradeWordsFromForm() {
        const easyWords = document.getElementById('course-easy-words').value.split(',').map(s => s.trim()).filter(Boolean);
        const medWords = document.getElementById('course-med-words').value.split(',').map(s => s.trim()).filter(Boolean);
        const hardWords = document.getElementById('course-hard-words').value.split(',').map(s => s.trim()).filter(Boolean);

        const easyTime = parseInt(document.getElementById('course-easy-time').value, 10) || 60;
        const medTime = parseInt(document.getElementById('course-med-time').value, 10) || 90;
        const hardTime = parseInt(document.getElementById('course-hard-time').value, 10) || 120;

        if (easyWords.length === 0 && medWords.length === 0 && hardWords.length === 0) {
            alert('적어도 한 단계 이상의 단어를 입력해주세요.');
            return;
        }

        const success = this.levelMgr.applyGradeWordBatch({
            easyWords,
            medWords,
            hardWords,
            easyTime,
            medTime,
            hardTime
        });

        if (success) {
            this.renderMissionList();
            if (window.gameApp) {
                window.gameApp.loadMissionListUI();
                window.gameApp.startMission(this.levelMgr.missions[0].id);
            }
            alert('🎉 단계별 단어 미션이 성공적으로 생성 및 적용되었습니다!');
            document.getElementById('teacher-modal').classList.remove('active');
        }
    }

    renderMissionList() {
        const container = document.getElementById('teacher-mission-items');
        if (!container) return;

        container.innerHTML = '';
        const missions = this.levelMgr.getAllMissions();

        missions.forEach((m, idx) => {
            const card = document.createElement('div');
            card.className = `teacher-card diff-${m.difficulty}`;

            const wordsBadge = m.words.map(w => `<span class="badge word-badge">${w}</span>`).join(' ');
            const diffLabel = m.difficulty === 'easy' ? '🟢 초급 (1~2스왑)' : m.difficulty === 'medium' ? '🟡 중급 (분산배치)' : '🔴 상급 (고난도)';
            const timeLimitText = m.timeLimit ? `⏱️ 제한시간: ${m.timeLimit}초` : '⏱️ 제한시간 없음';

            card.innerHTML = `
                <div class="card-header">
                    <div>
                        <span class="card-num">#${idx + 1}</span>
                        <strong>${m.name}</strong>
                    </div>
                    <span class="badge badge-diff">${diffLabel}</span>
                </div>
                <div class="card-body">
                    <div class="card-words">단어: ${wordsBadge}</div>
                    <div class="card-desc">${m.description || ''}</div>
                    <div class="card-details">
                        <span>보드: ${m.gridSize}x${m.gridSize}</span> | 
                        <span>${timeLimitText}</span> | 
                        <span>더미: ${(m.dummyLetters || []).join(', ') || '자동'}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-sm btn-play" data-action="play" data-id="${m.id}">🎮 지금 플레이</button>
                    <button class="btn btn-sm btn-outline" data-action="edit" data-id="${m.id}">✏️ 수정</button>
                    <button class="btn btn-sm btn-danger" data-action="delete" data-id="${m.id}">🗑️ 삭제</button>
                </div>
            `;

            card.querySelector('[data-action="play"]').addEventListener('click', () => {
                document.getElementById('teacher-modal').classList.remove('active');
                if (window.gameApp) {
                    window.gameApp.startMission(m.id);
                }
            });

            card.querySelector('[data-action="edit"]').addEventListener('click', () => {
                this.openEditForm(m.id);
            });

            card.querySelector('[data-action="delete"]').addEventListener('click', () => {
                if (confirm(`'${m.name}' 미션을 삭제하시겠습니까?`)) {
                    this.levelMgr.deleteMission(m.id);
                    this.renderMissionList();
                    if (window.gameApp) {
                        window.gameApp.loadMissionListUI();
                    }
                }
            });

            container.appendChild(card);
        });
    }

    openEditForm(missionId) {
        this.currentEditingId = missionId;
        const listPanel = document.getElementById('mission-list-panel');
        const editorPanel = document.getElementById('editor-panel');
        const formTitle = document.getElementById('editor-title');

        listPanel.classList.add('hidden');
        editorPanel.classList.remove('hidden');

        if (missionId) {
            const m = this.levelMgr.getMission(missionId);
            formTitle.textContent = `미션 상세 수정: ${m.name}`;
            document.getElementById('edit-name').value = m.name || '';
            document.getElementById('edit-words').value = (m.words || []).join(', ');
            document.getElementById('edit-meanings').value = Object.entries(m.meanings || {}).map(([k, v]) => `${k}:${v}`).join(', ');
            document.getElementById('edit-difficulty').value = m.difficulty || 'easy';
            document.getElementById('edit-grid-size').value = m.gridSize || 6;
            document.getElementById('edit-dummies').value = (m.dummyLetters || []).join(', ');
            document.getElementById('edit-desc').value = m.description || '';
            document.getElementById('edit-swap-dist').value = m.targetSwapDistance || 1;
            document.getElementById('edit-time-limit').value = typeof m.timeLimit !== 'undefined' ? m.timeLimit : 60;
        } else {
            formTitle.textContent = '새 단어 미션 추가';
            document.getElementById('edit-name').value = '새로운 미션';
            document.getElementById('edit-words').value = 'CUP';
            document.getElementById('edit-meanings').value = 'CUP:컵 🥛';
            document.getElementById('edit-difficulty').value = 'easy';
            document.getElementById('edit-grid-size').value = 6;
            document.getElementById('edit-dummies').value = 'A, B';
            document.getElementById('edit-desc').value = '글자를 연결해 컵을 완성하세요!';
            document.getElementById('edit-swap-dist').value = 1;
            document.getElementById('edit-time-limit').value = 60;
        }
    }

    saveCurrentForm() {
        const name = document.getElementById('edit-name').value.trim();
        const rawWords = document.getElementById('edit-words').value.trim();
        const rawMeanings = document.getElementById('edit-meanings').value.trim();
        const difficulty = document.getElementById('edit-difficulty').value;
        const gridSize = parseInt(document.getElementById('edit-grid-size').value, 10) || 6;
        const rawDummies = document.getElementById('edit-dummies').value.trim();
        const desc = document.getElementById('edit-desc').value.trim();
        const swapDist = parseInt(document.getElementById('edit-swap-dist').value, 10) || 1;
        const timeLimit = parseInt(document.getElementById('edit-time-limit').value, 10);

        if (!name || !rawWords) {
            alert('미션 이름과 목표 단어를 입력해주세요.');
            return;
        }

        const words = rawWords.split(',').map(w => w.trim().toUpperCase()).filter(w => w.length > 0);
        if (words.length === 0) {
            alert('목표 단어를 1개 이상 입력해주세요.');
            return;
        }

        const meanings = {};
        rawMeanings.split(',').forEach(pair => {
            const parts = pair.split(':');
            if (parts.length >= 2) {
                meanings[parts[0].trim().toUpperCase()] = parts.slice(1).join(':').trim();
            }
        });
        words.forEach(w => {
            if (!meanings[w]) {
                meanings[w] = window.COMMON_WORD_DICT[w] || w;
            }
        });

        const dummyLetters = rawDummies
            ? rawDummies.split(',').map(d => d.trim().toUpperCase()).filter(d => d.length === 1)
            : [];

        const missionData = {
            name,
            difficulty,
            words,
            meanings,
            dummyLetters,
            description: desc,
            gridSize,
            targetSwapDistance: swapDist,
            timeLimit: isNaN(timeLimit) ? 60 : timeLimit
        };

        if (this.currentEditingId) {
            this.levelMgr.updateMission(this.currentEditingId, missionData);
        } else {
            this.levelMgr.addMission(missionData);
        }

        document.getElementById('editor-panel').classList.add('hidden');
        document.getElementById('mission-list-panel').classList.remove('hidden');

        this.renderMissionList();
        if (window.gameApp) {
            window.gameApp.loadMissionListUI();
        }
        alert('미션이 성공적으로 저장되었습니다!');
    }
}

window.TeacherManager = TeacherManager;
