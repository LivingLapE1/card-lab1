// Web Audio API & Web Speech API Sound Engine
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.soundEnabled = true;
        this.speechEnabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.2, pitchBend = 0) {
        if (!this.soundEnabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        if (pitchBend !== 0) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(10, freq + pitchBend), now + duration);
        }

        gain.gain.setValueAtTime(gainVal, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
    }

    playSelect() {
        this.playTone(523.25, 'sine', 0.08, 0.2, 50); // C5
    }

    playSwap() {
        this.playTone(440, 'triangle', 0.1, 0.15, -100);
    }

    playInvalid() {
        this.playTone(220, 'sawtooth', 0.15, 0.1, -40);
    }

    playMatch(combo = 1) {
        if (!this.soundEnabled) return;
        this.init();
        if (!this.ctx) return;

        // Gem crack / pop sound with rising pitch for combos
        const baseFreq = 400 + Math.min(combo * 70, 600);
        const now = this.ctx.currentTime;

        // Two harmonized oscillators
        [baseFreq, baseFreq * 1.25].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = idx === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.18);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.2);
        });
    }

    playWordSuccess() {
        if (!this.soundEnabled) return;
        this.init();
        if (!this.ctx) return;

        // Fanfare arpeggio (C5 - E5 - G5 - C6)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);

                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + 0.35);
            }, i * 90);
        });
    }

    playTick() {
        this.playTone(880, 'sine', 0.04, 0.08, -50);
    }

    playGameOver() {
        if (!this.soundEnabled) return;
        this.init();
        if (!this.ctx) return;
        const notes = [392, 349.23, 329.63, 261.63];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 'sawtooth', 0.25, 0.15, -30);
            }, i * 160);
        });
    }

    speakLetter(letter) {
        if (!this.speechEnabled || !window.speechSynthesis) return;
        try {
            const utter = new SpeechSynthesisUtterance(letter);
            utter.lang = 'en-US';
            utter.rate = 1.0;
            utter.pitch = 1.1;
            window.speechSynthesis.speak(utter);
        } catch (e) {
            console.warn('Speech error:', e);
        }
    }

    speakWord(word) {
        if (!this.speechEnabled || !window.speechSynthesis) return;
        try {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(word);
            utter.lang = 'en-US';
            utter.rate = 0.88;
            utter.pitch = 1.05;
            window.speechSynthesis.speak(utter);
        } catch (e) {
            console.warn('Speech synthesis error:', e);
        }
    }

    // 단어 완성 시: 보드의 철자를 하나씩 읽으며 화면과 동기화한 뒤 전체 단어 낭독
    async spellAndReadWord(word, onLetterCallback) {
        if (!this.speechEnabled || !window.speechSynthesis) {
            if (onLetterCallback) {
                for (let i = 0; i < word.length; i++) {
                    onLetterCallback(i, word[i]);
                    await new Promise(r => setTimeout(r, 400));
                }
            }
            return;
        }

        window.speechSynthesis.cancel();

        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            if (onLetterCallback) onLetterCallback(i, char);
            
            this.playTone(500 + i * 80, 'sine', 0.1, 0.15); // 경쾌한 음계
            
            const utterChar = new SpeechSynthesisUtterance(char);
            utterChar.lang = 'en-US';
            utterChar.rate = 1.0;
            utterChar.pitch = 1.1;
            window.speechSynthesis.speak(utterChar);

            await new Promise(r => setTimeout(r, 480));
        }

        // 잠시 후 전체 단어 낭독
        await new Promise(r => setTimeout(r, 200));
        this.playWordSuccess();
        const utterWord = new SpeechSynthesisUtterance(word);
        utterWord.lang = 'en-US';
        utterWord.rate = 0.85;
        utterWord.pitch = 1.05;
        window.speechSynthesis.speak(utterWord);
    }
}

window.soundEngine = new SoundEngine();
