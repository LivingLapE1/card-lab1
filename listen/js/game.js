// 03 LISTEN — 듣고 고르기
// 하늘에서 스피커(낙하산)가 떨어진다 → 누르면 단어 발음이 나오고 하늘이 멈춘다
// → 같은 묶음(발음이 비슷한 단어) 그림 카드 4장 중 하나를 고른다 → 틀려도 다시 들을 수 있다.
// 주소 옵션(포털 play 화면이 넘겨 줌): ?nick=이름&practice=1|0&sfx=1|0

(function () {
  'use strict';

  // ── 설정 ──
  const params = new URLSearchParams(location.search);
  const PRACTICE = params.get('practice') === '1';
  const SFX = params.get('sfx') !== '0';
  const NICK = (params.get('nick') || '').slice(0, 20);

  const TOTAL = 10;                       // 한 레벨 문제 수
  const LIVES = 3;                        // 연습 모드에는 목숨이 없다
  const PTS_FIRST = 10, PTS_RETRY = 5;

  // 레벨 9개: 초급(서로 다른 소리) · 중급(끝소리가 같은 단어) · 고급(최소 대립쌍)
  // set: 단어 모음 번호(words.js), sky: 하늘에 동시에 떠 있는 스피커 수, fall: 꼭대기 → 땅까지 걸리는 시간(초)
  const TIERS = { easy: '초급', mid: '중급', hard: '고급' };
  const TIER_DESC = { easy: '소리가 확실히 다른 단어', mid: '끝소리가 같은 단어', hard: '소리 하나만 다른 단어' };
  const LEVELS = [
    { tier: 'easy', set: 0, sky: 2, fall: 10 }, { tier: 'easy', set: 1, sky: 2, fall: 9 }, { tier: 'easy', set: 2, sky: 3, fall: 9 },
    { tier: 'mid', set: 0, sky: 3, fall: 9 }, { tier: 'mid', set: 1, sky: 3, fall: 8 }, { tier: 'mid', set: 2, sky: 3, fall: 7 },
    { tier: 'hard', set: 0, sky: 3, fall: 8 }, { tier: 'hard', set: 1, sky: 3, fall: 7 }, { tier: 'hard', set: 2, sky: 4, fall: 7 },
  ];
  const PRACTICE_SLOW = 1.5;              // 연습 모드는 1.5배 천천히 떨어진다
  // ⚠ 테스트용: true면 모든 레벨이 열린다. 본체에 결합하기 전에 반드시 false로 되돌린다.
  const TEST_UNLOCK_ALL = false;
  let cfg = LEVELS[0], levelNo = 1;
  const fallSec = () => cfg.fall * (PRACTICE ? PRACTICE_SLOW : 1);
  // 좁은 화면에서는 스피커가 겹치지 않을 만큼만 띄운다 (스피커 하나에 폭 약 100px)
  const skyMax = () => Math.max(1, Math.min(cfg.sky, Math.floor(sky.clientWidth / 100)));
  const spawnSec = () => Math.max(2, fallSec() / (skyMax() + 0.8)); // 다음 스피커가 나오는 간격

  // 진행 기록: 이 기기(브라우저)에 학생 이름별로 저장. cleared = 깬 레벨 수, stars[레벨] = 최고 별
  const STORE_KEY = 'fun-english-listen-v1';
  function loadProgress() {
    try { const all = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; return all[NICK || '_'] || { cleared: 0, stars: {} }; }
    catch (e) { return { cleared: 0, stars: {} }; }
  }
  function saveProgress() {
    try {
      const all = JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {};
      all[NICK || '_'] = progress;
      localStorage.setItem(STORE_KEY, JSON.stringify(all));
    } catch (e) { /* 저장을 못 해도 게임은 계속 */ }
  }
  const progress = loadProgress();
  const MAX_TRIES = 2;                    // 스피커 하나에 고를 수 있는 기회 (연습 모드는 제한 없음)
  const BUSY_PACE = 0.3;                  // 카드를 고르는 동안 다른 스피커가 떨어지는 빠르기 (평소의 30%)

  // ── 화면 요소 ──
  const $ = (id) => document.getElementById(id);
  const sky = $('sky'), cardsEl = $('cards'), msgEl = $('msg'), replayBtn = $('btn-replay');
  const hudQ = $('hud-q'), hudScore = $('hud-score'), hudHearts = $('hud-hearts');
  const ovStart = $('ov-start'), ovResult = $('ov-result'), skyHint = $('sky-hint'), hudLevel = $('hud-level');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.parent === window) {
    // 단독으로 열었을 때: 메인 링크를 같은 창에서 열기
    document.querySelectorAll('a[target="_top"]').forEach((a) => a.removeAttribute('target'));
  }
  if (PRACTICE) {
    $('start-note').textContent = '연습 모드: 시간 제한이 없어요. 땅에 내려앉은 스피커도 눌러서 들을 수 있어요. (키보드: 1–4 고르기, R 다시 듣기)';
    hudHearts.closest('.stat').hidden = true;
  }

  // ── 발음 ──
  // 브라우저 음성 합성(녹음 파일 없음) — 가장 자연스러운 영어 목소리를 점수로 고른다
  const NOVELTY = new Set(['albert', 'bad news', 'bahh', 'bells', 'boing', 'bubbles', 'cellos', 'fred', 'good news', 'jester', 'junior',
    'kathy', 'organ', 'ralph', 'superstar', 'trinoids', 'whisper', 'wobble', 'zarvox', 'eddy', 'flo', 'grandma', 'grandpa', 'reed', 'rocko', 'sandy', 'shelley']);
  const canSpeak = 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
  let voice = null;
  function voiceScore(v) {
    const name = String(v.name || '').toLowerCase();
    const lang = String(v.lang || '').toLowerCase().replace('_', '-');
    if (!lang.startsWith('en')) return -1;
    if (NOVELTY.has(name.replace(/\s*\(.*$/, '').trim())) return -1;
    let s = 0;
    if (/natural|neural|online|enhanced|premium/.test(name)) s += 100; // 신경망 목소리 (Edge·Windows 11·macOS)
    if (/^google/.test(name)) s += 70;                                    // 크롬의 Google 목소리
    if (/samantha|ava|allison|aria|jenny|guy|ana/.test(name)) s += 30;
    if (lang === 'en-us') s += 20; else if (lang === 'en-gb') s += 12; else s += 5;
    if (/zira|david|mark/.test(name)) s += 5;                             // 예전 윈도 목소리: 마지막 후보
    return s;
  }
  function pickVoice() {
    let best = null, bestScore = -1;
    for (const v of speechSynthesis.getVoices()) {
      const s = voiceScore(v);
      if (s > bestScore) { best = v; bestScore = s; }
    }
    voice = best;
  }
  if (canSpeak) {
    pickVoice();
    speechSynthesis.addEventListener ? speechSynthesis.addEventListener('voiceschanged', pickVoice) : (speechSynthesis.onvoiceschanged = pickVoice);
  }
  const hasEnglishVoice = () => canSpeak && (voice || (pickVoice(), voice));

  let speakTimer = 0;
  function stopAll() {
    clearTimeout(speakTimer);
    if (canSpeak) speechSynthesis.cancel();
  }
  function speakTTS(word) {
    if (!canSpeak) { say('이 브라우저에서는 발음 듣기를 쓸 수 없어요.', 'bad'); return; }
    if (!hasEnglishVoice()) warnNoVoice();
    // cancel 바로 뒤에 speak하면 크롬이 첫소리를 자르는 일이 있어 잠깐 쉰다
    speakTimer = setTimeout(() => {
      const u = new SpeechSynthesisUtterance(word);
      u.lang = voice ? voice.lang : 'en-US';
      if (voice) u.voice = voice;
      u.rate = 0.85;
      u.pitch = 1.05;
      u.volume = 1;
      speechSynthesis.speak(u);
    }, 60);
  }
  function speak(word) {
    if (!word) return;
    stopAll();
    speakTTS(word);
  }
  let warned = false;
  function warnNoVoice() {
    if (warned) return;
    warned = true;
    const n = document.createElement('p');
    n.className = 'voice-warn';
    n.innerHTML = '<svg aria-hidden="true"><use href="#i-alert"/></svg><span>이 컴퓨터에 영어 목소리가 없어서 발음이 어색하게 들릴 수 있어요. 크롬이나 엣지 브라우저로 열거나, 윈도 설정에서 영어 음성을 설치해 주세요.</span>';
    document.querySelector('.app').prepend(n);
  }

  // ── 효과음 (WebAudio 짧은 삑 소리, 효과음 스위치를 따른다) ──
  let actx = null;
  function beep(notes) {
    if (!SFX) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      let t = actx.currentTime;
      notes.forEach(([freq, dur]) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = 'square'; o.frequency.value = freq;
        g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur);
        t += dur * 0.9;
      });
    } catch (e) { /* 소리를 못 내도 게임은 계속 */ }
  }
  const sfx = {
    right: () => beep([[660, 0.09], [880, 0.09], [1320, 0.16]]),
    wrong: () => beep([[220, 0.14], [180, 0.18]]),
    miss: () => beep([[300, 0.1], [200, 0.1], [120, 0.22]]),
    tap: () => beep([[520, 0.05]]),
  };

  // ── 그림 ──
  const SPEAKER_SVG = `<svg viewBox="0 0 88 112" aria-hidden="true">
    <g class="spk__chute" stroke="#141414" stroke-width="3" stroke-linejoin="round">
      <path d="M6 34Q6 4 44 4t38 30q-9-6-19 0-9-6-19 0-10-6-19 0-9-6-19 0z" fill="var(--red)"/>
      <path d="M25 34Q30 4 44 4t19 30q-9-6-19 0-10-6-19 0z" fill="var(--paper-2)"/>
      <path d="M6 34l18 22M82 34L64 56M44 34v22" fill="none" stroke-width="2"/>
    </g>
    <g class="spk__box" stroke="#141414" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
      <rect x="22" y="60" width="50" height="46" rx="6" fill="#141414"/>
      <rect class="spk__plate" x="18" y="56" width="50" height="46" rx="6" fill="var(--paper-2)"/>
      <path d="M24 72h7l10-8v30l-10-8h-7z" fill="var(--cobalt)"/>
      <g class="spk__waves" fill="none"><path d="M47 72q4 7 0 14"/><path d="M53 67q8 12 0 24"/><path d="M59 62q12 17 0 34"/></g>
    </g>
    <ellipse cx="25" cy="60" rx="4" ry="1.6" fill="#fff" opacity=".9"/>
  </svg>`;
  const pic = (en) => window.listenPic(en);
  const BACK_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-speaker" style="color:var(--paper-2)" stroke="var(--paper-2)" fill="none" stroke-width="2.5" stroke-linecap="round"/></svg>';

  // ── 상태 ──
  let st = null;          // 한 판 상태
  let rafId = 0, lastTs = 0;

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }


  // 초급 카드 4장: 정답 + 같은 레벨의 다른 단어 3장
  // 4장의 첫 글자와 끝 두 글자가 모두 달라서 소리가 확실히 구별된다
  function easyChoices(target, words) {
    const others = words.filter((w) => w.en !== target.en);
    const head = (w) => w.en[0], tail = (w) => w.en.slice(-2);
    for (let attempt = 0; attempt < 80; attempt++) {
      const picks = shuffle(others.slice()).slice(0, 3);
      const four = [target, ...picks];
      if (new Set(four.map(head)).size === 4 && new Set(four.map(tail)).size === 4) return shuffle(four);
    }
    return shuffle([target, ...shuffle(others.slice()).slice(0, 3)]);
  }

  // 문제 10개: 그 레벨의 12단어에서 고루 뽑는다 (같은 단어는 한 번만)
  // 초급: 그 레벨 단어 중 소리가 확실히 다른 4장 / 중급·고급: 같은 묶음 4장
  function makeQuestions() {
    if (cfg.tier === 'easy') {
      const words = window.LISTEN_WORDS.easy[cfg.set];
      return shuffle(words.slice()).slice(0, TOTAL).map((w) => ({ ...w, choices: easyChoices(w, words) }));
    }
    const groups = window.LISTEN_WORDS[cfg.tier][cfg.set];
    const pool = groups.map((g, gi) => shuffle(g.map((w) => ({ w, gi }))));
    const qs = [];
    let gi = Math.floor(Math.random() * pool.length);
    while (qs.length < TOTAL) {
      const g = pool[gi % pool.length];
      if (g.length) {
        const { w, gi: idx } = g.pop();
        qs.push({ ...w, choices: shuffle(groups[idx].slice()) });
      }
      gi++;
    }
    return shuffle(qs);
  }

  function newGame(level) {
    levelNo = level;
    cfg = LEVELS[level - 1];
    st = {
      queue: makeQuestions(),
      spawned: 0, resolved: 0, correct: 0, firstTry: 0, score: 0, lives: LIVES,
      speakers: [], active: null, tries: 0, spawnClock: 0,
      missed: [], running: true, locked: false,
    };
    sky.querySelectorAll('.spk,.float').forEach((n) => n.remove());
    skyHint.hidden = true;
    ovStart.hidden = true;
    ovResult.hidden = true;
    hudLevel.textContent = `LV.${level} ${TIERS[cfg.tier]}`;
    renderHud();
    showIdleCards();
    say('떨어지는 스피커를 눌러 단어를 들어요.');
    replayBtn.disabled = true;
    lastTs = 0;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);
  }

  // ── HUD ──
  function renderHud() {
    hudQ.textContent = `${Math.min(st.resolved, TOTAL)}/${TOTAL}`;
    hudScore.textContent = st.score;
    hudHearts.innerHTML = Array.from({ length: LIVES }, (_, i) =>
      `<svg class="heart${i < st.lives ? '' : ' off'}" viewBox="0 0 26 24"><use href="#i-heart"/></svg>`).join('');
    hudHearts.setAttribute('aria-label', `남은 기회 ${st.lives}개`);
  }

  function say(text, kind) {
    const icon = kind === 'good' ? '<svg aria-hidden="true"><use href="#i-check"/></svg>'
      : kind === 'bad' ? '<svg aria-hidden="true"><use href="#i-alert"/></svg>' : '';
    msgEl.className = 'tray__msg' + (kind ? ` is-${kind}` : '');
    msgEl.innerHTML = icon + `<span>${text}</span>`;
  }

  // ── 하늘 / 스피커 ──
  function skySize() { return { w: sky.clientWidth, h: sky.clientHeight - 34 /* 땅 높이 */ }; }

  function spawn() {
    const word = st.queue[st.spawned++];
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'spk';
    el.innerHTML = SPEAKER_SVG;
    el.setAttribute('aria-label', `스피커 ${st.spawned}번: 눌러서 단어 듣기`);
    const { w } = skySize();
    // 다른 스피커와 겹치지 않는 가로 위치
    let x = 0, tries = 0;
    do { x = 8 + Math.random() * Math.max(1, w - 104); tries++; }
    while (tries < 12 && st.speakers.some((s) => Math.abs(s.x - x) < 110));
    const sp = { el, word, x, y: -120, landed: false, done: false };
    el.addEventListener('click', () => openSpeaker(sp));
    sky.appendChild(el);
    st.speakers.push(sp);
    place(sp);
  }

  function place(sp) { sp.el.style.transform = `translate(${sp.x}px, ${sp.y}px)`; }

  function tick(ts) {
    if (!st || !st.running) return;
    const dt = lastTs ? Math.min(0.05, (ts - lastTs) / 1000) : 0;
    lastTs = ts;
    const busy = Boolean(st.active || st.locked); // 카드를 고르는 중
    const { h } = skySize();
    const spkH = sky.querySelector('.spk') ? sky.querySelector('.spk').offsetHeight : 112;
    const floor = h - spkH + 6;
    // 새 스피커: 카드를 고르는 동안에는 나오지 않는다
    if (!busy) {
      st.spawnClock += dt;
      const flying = st.speakers.filter((s) => !s.done).length;
      if (st.spawned < TOTAL && flying < skyMax() && (st.spawnClock >= spawnSec() || flying === 0)) {
        st.spawnClock = 0;
        spawn();
      }
    }
    // 떨어지기: 고르는 동안 들은 스피커는 멈추고, 다른 스피커는 아주 천천히 떨어진다
    const pace = busy ? BUSY_PACE : 1;
    for (const sp of st.speakers) {
      if (sp.done || sp.landed || sp === st.active) continue;
      sp.y += ((h + 120) / fallSec()) * pace * dt;
      if (sp.y >= floor) {
        sp.y = floor;
        if (PRACTICE) { sp.landed = true; sp.el.classList.add('is-landed'); }
        else missSpeaker(sp);
      }
      place(sp);
    }
    if (st.running) rafId = requestAnimationFrame(tick);
  }

  function setOthersDim(on) {
    for (const s of st.speakers) {
      if (s.done || s === st.active) continue;
      s.el.classList.toggle('is-dim', on);
      s.el.disabled = on;
    }
  }

  function openSpeaker(sp) {
    if (sp.done || st.locked) return;
    if (st.active === sp) { speak(sp.word.en); return; }
    if (st.active) return;
    st.active = sp;
    st.tries = 0;
    sp.el.classList.add('is-on');
    setOthersDim(true);
    sfx.tap();
    speak(sp.word.en);
    showChoices(sp.word);
    replayBtn.disabled = false;
    say('잘 듣고 알맞은 그림을 골라요!');
  }

  function missSpeaker(sp) {
    sp.done = true;
    sp.el.classList.add('is-miss');
    sp.el.disabled = true;
    floatText(sp, 'MISS', true);
    st.lives -= 1;
    st.missed.push(sp.word);
    st.resolved += 1;
    sfx.miss();
    // 다른 단어를 고르는 중이면 안내 문장을 덮어쓰지 않는다 (하늘의 MISS 표시와 하트로 알린다)
    if (!st.active && !st.locked) say(`놓쳤어요! 방금 단어는 <b lang="en">${sp.word.en}</b>(${sp.word.ko})였어요.`, 'bad');
    renderHud();
    setTimeout(() => sp.el.remove(), 500);
    checkEnd();
  }

  function floatText(sp, text, miss) {
    const f = document.createElement('span');
    f.className = 'float' + (miss ? ' float--miss' : '');
    f.textContent = text;
    f.style.left = `${sp.x + 44}px`;
    f.style.top = `${Math.max(10, sp.y + 30)}px`;
    sky.appendChild(f);
    setTimeout(() => f.remove(), 950);
  }

  // ── 그림 카드 ──
  function showIdleCards() {
    cardsEl.classList.remove('is-reveal');
    cardsEl.innerHTML = [1, 2, 3, 4].map((n) =>
      `<button class="card card--back" type="button" disabled aria-hidden="true" tabindex="-1"><span class="card__no">${n}</span>${BACK_SVG}</button>`).join('');
  }

  function showChoices(word) {
    const choices = word.choices;
    cardsEl.classList.remove('is-reveal');
    cardsEl.innerHTML = choices.map((w, i) =>
      `<button class="card" type="button" data-en="${w.en}" aria-label="${i + 1}번 그림: ${w.ko}">
        <span class="card__no">${i + 1}</span>${pic(w.en)}<span class="card__word" lang="en">${w.en}</span></button>`).join('');
    cardsEl.querySelectorAll('.card').forEach((c) => c.addEventListener('click', () => choose(c)));
    const first = cardsEl.querySelector('.card');
    if (first && document.activeElement && document.activeElement.classList.contains('spk')) first.focus({ preventScroll: true });
  }

  function choose(card) {
    const sp = st.active;
    if (!sp || st.locked || card.disabled) return;
    const target = sp.word;
    if (card.dataset.en === target.en) {
      // 정답
      st.locked = true;
      const first = st.tries === 0;
      const pts = first ? PTS_FIRST : PTS_RETRY;
      st.correct += 1; if (first) st.firstTry += 1;
      st.score += pts; st.resolved += 1;
      card.classList.add('is-right');
      cardsEl.querySelectorAll('.card').forEach((c) => { c.disabled = true; });
      sfx.right();
      say(`정답! <b lang="en">${target.en}</b> = ${target.ko}${first ? ' · 한 번에 맞혔어요!' : ''}`, 'good');
      setTimeout(() => speak(target.en), 350);
      sp.done = true;
      sp.el.classList.remove('is-on');
      sp.el.classList.add('is-gone');
      floatText(sp, `+${pts}`);
      renderHud();
      const game = st;
      setTimeout(() => {
        if (st !== game) return;
        sp.el.remove();
        st.active = null;
        st.locked = false;
        setOthersDim(false);
        replayBtn.disabled = true;
        if (!checkEnd()) { showIdleCards(); say('다음 스피커를 눌러 들어요.'); }
      }, reduceMotion ? 700 : 1300);
    } else {
      st.tries += 1;
      if (st.tries === 1) st.missed.push(target);
      card.classList.add('is-wrong');
      card.disabled = true;
      sfx.wrong();
      if (PRACTICE || st.tries < MAX_TRIES) {
        // 첫 번째 오답 — 다시 들을 수 있다
        say(`괜찮아요! 다시 들어 보고 골라요.${PRACTICE ? '' : ' (기회 1번 남았어요)'}`, 'bad');
        setTimeout(() => speak(target.en), 450);
      } else {
        // 두 번째 오답 — 하트 1개를 잃고, 정답을 보여 주며 한 번 더 들려준다
        failSpeaker(sp);
      }
    }
  }

  function failSpeaker(sp) {
    const target = sp.word;
    st.locked = true;
    st.lives -= 1;
    st.resolved += 1;
    cardsEl.querySelectorAll('.card').forEach((c) => {
      c.disabled = true;
      if (c.dataset.en === target.en) c.classList.add('is-answer');
    });
    say(`정답은 <b lang="en">${target.en}</b>(${target.ko})였어요. 소리를 한 번 더 들어 봐요!`, 'bad');
    setTimeout(() => speak(target.en), 450);
    sp.done = true;
    sp.el.classList.remove('is-on');
    sp.el.classList.add('is-miss');
    floatText(sp, '-1', true);
    renderHud();
    const game = st;
    setTimeout(() => {
      if (st !== game) return;
      sp.el.remove();
      st.active = null;
      st.locked = false;
      setOthersDim(false);
      replayBtn.disabled = true;
      if (!checkEnd()) { showIdleCards(); say('다음 스피커를 눌러 들어요.'); }
    }, reduceMotion ? 1600 : 2400);
  }

  // ── 끝 ──
  function checkEnd() {
    const over = (!PRACTICE && st.lives <= 0) || st.resolved >= TOTAL;
    if (!over) return false;
    if (st.ended) return true;
    st.ended = true;
    st.running = false;
    cancelAnimationFrame(rafId);
    const game = st;
    setTimeout(() => { if (st === game) showResult(); }, 700);
    return true;
  }

  const starRow = (n, cls) => `<span class="${cls}">${[0, 1, 2].map((i) =>
    `<svg viewBox="0 0 24 24" aria-hidden="true" style="fill:${i < n ? 'var(--yellow)' : 'var(--paper-3)'}"><use href="#i-star"/></svg>`).join('')}</span>`;

  function showResult() {
    const c = st.correct;
    // 클리어 = 하트가 남은 채로 10문제를 모두 끝냄 (연습 모드는 끝까지 하면 클리어)
    const cleared = st.resolved >= TOTAL && (PRACTICE || st.lives > 0);
    const stars = !cleared ? 0 : st.firstTry >= 9 ? 3 : st.firstTry >= 6 ? 2 : 1;
    // 연습 모드 기록은 남기지 않는다: 깨도 다음 레벨이 열리지 않고 별도 저장하지 않는다
    const wasCleared = progress.cleared;
    if (cleared && !PRACTICE) {
      progress.cleared = Math.max(progress.cleared, levelNo);
      progress.stars[levelNo] = Math.max(progress.stars[levelNo] || 0, stars);
      saveProgress();
    }
    const unlockedNow = !PRACTICE && cleared && levelNo < LEVELS.length && levelNo > wasCleared;
    // 다음 레벨 버튼: 다음 레벨이 이미 열려 있을 때만 (TEST_UNLOCK_ALL이면 항상)
    const hasNext = cleared && levelNo < LEVELS.length && (TEST_UNLOCK_ALL || levelNo + 1 <= progress.cleared + 1);
    $('result-label').textContent = `LV.${levelNo} ${TIERS[cfg.tier]} · ${cleared ? 'CLEAR!' : 'GAME OVER'}`;
    $('result-title').textContent = !cleared ? '다시 해 볼까요?' : stars >= 2 ? `${NICK ? NICK + ', ' : ''}잘했어요!` : '클리어! 한 번 더?';
    $('result-stars').innerHTML = starRow(stars, 'result__stars-in') + `<span class="sr-only">별 ${stars}개</span>`;
    const note = unlockedNow ? `레벨 ${levelNo + 1}(${TIERS[LEVELS[levelNo].tier]})이 열렸어요!`
      : PRACTICE && cleared ? '연습 모드라서 기록은 남지 않아요. 연습 모드를 끄고 깨면 다음 레벨이 열려요.' : '';
    $('result-unlock').hidden = !note;
    $('result-unlock').textContent = note;
    $('btn-next').hidden = !hasNext;
    $('btn-again').classList.toggle('btn--primary', !hasNext);
    $('result-correct').textContent = c;
    $('result-detail').innerHTML = `한 번에 맞힌 단어 <b class="num">${st.firstTry}</b>개 · 점수 <b class="num">${st.score}</b>점`;
    // 틀렸거나 놓친 단어 다시 듣기
    const seen = new Set();
    const review = st.missed.filter((w) => !seen.has(w.en) && seen.add(w.en));
    $('review').hidden = review.length === 0;
    $('review-list').innerHTML = review.map((w) =>
      `<button class="review__item" type="button" data-en="${w.en}" aria-label="${w.en} ${w.ko} 다시 듣기">${pic(w.en)}<span><span lang="en">${w.en}</span><br><small>${w.ko}</small></span></button>`).join('');
    $('review-list').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => speak(b.dataset.en)));
    ovResult.hidden = false;
    (hasNext ? $('btn-next') : $('btn-again')).focus();
  }

  // ── 레벨 고르기 (차례대로 열림: 깬 레벨 + 다음 레벨 하나) ──
  function renderLevels() {
    const box = $('levels');
    const next = Math.min(progress.cleared + 1, LEVELS.length);
    box.innerHTML = Object.keys(TIERS).map((tier) => {
      const items = LEVELS.map((L, i) => ({ L, no: i + 1 })).filter((x) => x.L.tier === tier).map(({ L, no }) => {
        const open = TEST_UNLOCK_ALL || no <= next, done = no <= progress.cleared, now = no === next && !done;
        const sub = `스피커 ${L.sky}개 · ${PRACTICE ? '천천히' : L.fall + '초'}`;
        return `<button class="lv${open ? '' : ' is-locked'}${now ? ' is-now' : ''}" type="button" data-lv="${no}"
            aria-label="레벨 ${no} ${TIERS[tier]}${open ? (done ? ', 깬 레벨' : ', 도전') : ', 잠김'}">
          <span class="lv__num">${String(no).padStart(2, '0')}</span>
          <span class="lv__sub">${sub}</span>
          ${open ? starRow(progress.stars[no] || 0, 'lv__stars') : '<span class="lv__lock" aria-hidden="true">LOCK</span>'}
          ${now ? '<span class="lv__now" aria-hidden="true">도전!</span>' : ''}
        </button>`;
      }).join('');
      return `<section class="tier tier--${tier}"><h3 class="tier__h"><span>${TIERS[tier]}</span><small>${TIER_DESC[tier]}</small></h3><div class="tier__row">${items}</div></section>`;
    }).join('');
    box.querySelectorAll('.lv').forEach((b) => b.addEventListener('click', () => {
      const no = Number(b.dataset.lv);
      if (b.classList.contains('is-locked')) { flashLock(`레벨 ${next}부터 차례대로 깨요!`); return; }
      if (canSpeak) speechSynthesis.cancel(); // 일부 브라우저는 사용자 동작 뒤에야 음성이 열린다
      newGame(no);
    }));
    $('levels-lead').textContent = TEST_UNLOCK_ALL
      ? '[테스트] 모든 레벨이 열려 있어요.'
      : progress.cleared >= LEVELS.length
        ? '모든 레벨을 깼어요! 연습하고 싶은 레벨을 골라요.'
        : `레벨 ${next}에 도전해요! 레벨은 차례대로 열려요.`;
  }
  function flashLock(text) {
    const n = $('levels-lead');
    n.textContent = text;
    n.classList.remove('is-shake'); void n.offsetWidth; n.classList.add('is-shake');
  }
  function openLevels() {
    stopAll();
    if (st) { st.running = false; cancelAnimationFrame(rafId); }
    st = null;
    sky.querySelectorAll('.spk,.float').forEach((n) => n.remove());
    skyHint.hidden = false;
    replayBtn.disabled = true;
    showIdleCards();
    say('떨어지는 스피커를 눌러 단어를 들어요.');
    renderLevels();
    ovResult.hidden = true;
    ovStart.hidden = false;
    const first = $('levels').querySelector('.lv.is-now') || $('levels').querySelector('.lv:not(.is-locked)');
    if (first) first.focus();
  }

  // ── 버튼·키보드 ──
  $('btn-again').addEventListener('click', () => newGame(levelNo));
  $('btn-next').addEventListener('click', () => newGame(levelNo + 1));
  $('btn-levels').addEventListener('click', openLevels);
  $('btn-hud-levels').addEventListener('click', openLevels);
  replayBtn.addEventListener('click', () => { if (st && st.active) speak(st.active.word.en); });

  document.addEventListener('keydown', (e) => {
    if (!st || !st.running || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'r' || e.key === 'R') { if (st.active) { e.preventDefault(); speak(st.active.word.en); } return; }
    const n = Number(e.key);
    if (n >= 1 && n <= 4 && st.active) {
      const card = cardsEl.querySelectorAll('.card')[n - 1];
      if (card) { e.preventDefault(); choose(card); }
    }
  });

  // 별 반짝이 바탕
  (function stars() {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 26; i++) {
      const s = document.createElement('i');
      s.className = 'star' + (i % 5 === 0 ? ' star--y' : '');
      s.style.left = `${Math.random() * 100}%`;
      s.style.top = `${Math.random() * 80}%`;
      frag.appendChild(s);
    }
    sky.insertBefore(frag, sky.firstChild);
  })();

  // 시작 전: 빈 카드 + 레벨 고르기
  st = { lives: LIVES, resolved: 0, score: 0 };
  renderHud();
  st = null;
  openLevels();
})();
