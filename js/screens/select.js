// 게임 선택 — #/select, #/select/:game
import { html } from '../lib/html.js';
import { formatBest, formatPlays, formatDaysAgo, formatNumber } from '../lib/format.js';
import { GAMES, GAME_IDS, getGame } from '../content/games.js';
import { icon, art, logo, player, winBar } from '../ui/parts.js';

const THEMES = GAME_IDS.map((id) => `t-${id}`);

export const title = () => '게임 고르기';

export async function load(ctx) {
  const { data, prefs } = ctx.services;
  const home = await data.getStudentHome(ctx.user.id);
  return { home, prefs: prefs.getPrefs() };
}

// 기본 선택: 주소의 게임 → 오늘의 미션 게임 → memory
function pickGame(ctx, home) {
  if (ctx.params.game && getGame(ctx.params.game)) return ctx.params.game;
  const mission = home.mission && getGame(home.mission.gameId);
  return mission ? mission.id : 'memory';
}

function readyStats(home, gameId) {
  const r = home.records[gameId] || { plays: 0, best: null, lastPlayedAt: null };
  return {
    isNew: !r.plays,
    best: formatBest(r.plays ? r.best : null, 'stat'),
    plays: formatPlays(r.plays || 0),
    last: formatDaysAgo(r.lastPlayedAt, home.asOf),
  };
}

function cart(game, home, selectedId) {
  const r = home.records[game.id] || { plays: 0, best: null };
  const best = r.plays ? r.best : null;
  const mission = home.mission && home.mission.gameId === game.id ? home.mission : null;
  return html`
        <button class="cart t-${game.id}" type="button" data-game="${game.id}" aria-pressed="${game.id === selectedId ? 'true' : 'false'}">
          ${mission ? html`<span class="sticker" style="--rot:-6deg" aria-hidden="true"><span>오늘의 미션 ★×${mission.starMultiplier}</span></span>` : ''}
          <span class="cart__ridge" aria-hidden="true"></span>
          <span class="cart__label"><span><span class="cart__en" lang="en">${game.label}</span><span class="cart__name">${game.name}</span></span>${art(game.id, 'cart__art')}</span>
          <span class="cart__meta"><span class="skill">${game.skill}</span><span class="${best ? 'rec' : 'rec rec--empty'}">${formatBest(best, 'cart')}</span></span>
          <span class="cart__check" aria-hidden="true">${icon('i-check')}</span>
          ${mission ? html`<span class="sr-only">오늘의 미션, 별 ${mission.starMultiplier}배</span>` : ''}
        </button>`;
}

function switchRow({ id, label, sub, pref, on }) {
  return html`
        <div class="switch-row">
          <span id="${id}">${label}${sub ? html`<small>${sub}</small>` : ''}</span>
          <span class="sw"><span class="switch-state" aria-hidden="true">${on ? '켜짐' : '꺼짐'}</span><button type="button" class="switch" role="switch" aria-checked="${on ? 'true' : 'false'}" aria-labelledby="${id}" data-pref="${pref}"></button></span>
        </div>`;
}

export function view({ home, prefs }, ctx) {
  const selected = pickGame(ctx, home);
  const g = getGame(selected);
  const stats = readyStats(home, selected);
  const s = home.student;
  const sub = `${s.classLabel} · ${s.loginType === 'google' ? '구글 계정' : s.loginId}`;

  return html`
<div class="screen" data-screen="select">
  <header class="hud">
    ${logo()}
    ${player({ avatar: s.avatar, name: s.name, sub })}
    <p class="chip">${icon('i-star', 'i--star')}<span class="dot num">${formatNumber(home.stars)}</span><span class="sr-only">개의 별</span></p>
    ${home.streakDays > 0 ? html`<p class="chip">${icon('i-flame', 'i--flame')}<span>${home.streakDays}일 연속</span></p>` : ''}
    <button class="btn btn--sm" type="button" data-action="logout">${icon('i-door')}<span>로그아웃</span></button>
  </header>

  <main class="select" id="main" tabindex="-1">
    <div>
      <div class="select__head">
        <h1 class="h-xl" tabindex="-1">오늘은 어떤 게임?</h1>
        ${home.pack ? html`<p class="wordpack"><span class="dot" lang="en">${home.pack.code}</span>이번 주 단어 ${home.pack.wordCount}개</p>` : ''}
      </div>

      <div class="carts" role="group" aria-label="게임 고르기">
        ${GAMES.map((game) => cart(game, home, selected))}
      </div>
    </div>

    <aside class="win ready t-${selected}${stats.isNew ? ' is-new' : ''}" aria-labelledby="ready-name">
      ${winBar('READY.EXE')}
      <div class="ready__hero" aria-live="polite">
        <div><span class="cart__en" id="ready-en" lang="en">${g.label}</span><h2 class="ready__name" id="ready-name">${g.name}</h2></div>
        <svg class="ready__art" viewBox="0 0 120 96" aria-hidden="true"><use id="ready-use" href="#art-${g.id}"/></svg>
      </div>
      <div class="ready__body">
        <p class="ready__desc" id="ready-desc">${g.desc}</p>
        <div><p class="mini-h">이렇게 놀아요</p><ol class="steps" id="ready-steps">${g.steps.map((step) => html`<li>${step}</li>`)}</ol></div>
        <p class="first">${icon('i-star', 'i--star')}첫 도전이에요! 끝까지 하면 별 +5</p>
        <dl class="stats">
          <div><dt>최고 기록</dt><dd id="ready-best">${stats.best}</dd></div>
          <div><dt>해 본 횟수</dt><dd id="ready-plays">${stats.plays}</dd></div>
          <div><dt>마지막</dt><dd id="ready-last">${stats.last}</dd></div>
        </dl>
        ${switchRow({ id: 'lbl-practice', label: '연습 모드', sub: '시간 제한 없이 천천히', pref: 'practiceMode', on: prefs.practiceMode })}
        ${switchRow({ id: 'lbl-sound', label: '효과음', pref: 'sound', on: prefs.sound })}
        <button class="btn btn--primary btn--xl btn--block gloss sheen" type="button" data-action="start"><span class="dot" lang="en">START</span>${icon('i-arrow', 'i--lg')}</button>
      </div>
    </aside>
  </main>
</div>`;
}

export function mount(root, { home }, ctx) {
  const { auth, prefs } = ctx.services;
  const carts = [...root.querySelectorAll('.cart')];
  const ready = root.querySelector('.ready');
  const $ = (sel) => root.querySelector(sel);
  let current = (carts.find((c) => c.getAttribute('aria-pressed') === 'true') || carts[0]).dataset.game;
  let alive = true;

  // READY 창은 지우고 다시 만들지 않고 그 자리에서 글자만 바꾼다 (aria-live 영역 유지)
  function selectGame(id) {
    const g = getGame(id);
    if (!g) return;
    current = id;
    const stats = readyStats(home, id);
    carts.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.game === id)));
    ready.classList.remove(...THEMES);
    ready.classList.add(`t-${id}`);
    ready.classList.toggle('is-new', stats.isNew);
    $('#ready-en').textContent = g.label;
    $('#ready-name').textContent = g.name;
    $('#ready-use').setAttribute('href', `#art-${id}`);
    $('#ready-desc').textContent = g.desc;
    const items = [...$('#ready-steps').children];
    if (items.length === g.steps.length) items.forEach((li, i) => { li.textContent = g.steps[i]; });
    else $('#ready-steps').innerHTML = String(html`${g.steps.map((step) => html`<li>${step}</li>`)}`);
    $('#ready-best').textContent = stats.best;
    $('#ready-plays').textContent = stats.plays;
    $('#ready-last').textContent = stats.last;
  }

  const onCart = (event) => {
    const id = event.currentTarget.dataset.game;
    selectGame(id);
    ctx.setPathQuietly(`/select/${id}`);
    if (window.matchMedia('(max-width:1100px)').matches) {
      ready.scrollIntoView({ behavior: ctx.reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  const onSwitch = (event) => {
    const sw = event.currentTarget;
    const on = sw.getAttribute('aria-checked') !== 'true';
    sw.setAttribute('aria-checked', String(on));
    const state = sw.parentElement.querySelector('.switch-state');
    if (state) state.textContent = on ? '켜짐' : '꺼짐';
    prefs.setPrefs({ [sw.dataset.pref]: on });
  };

  const onStart = () => ctx.navigate(`/play/${current}`);

  const onLogout = async () => {
    await auth.signOut();
    if (!alive) return;
    ctx.navigate('/', { replace: true });
    ctx.toast('로그아웃했어요.');
  };

  const switches = [...root.querySelectorAll('.switch')];
  const start = root.querySelector('[data-action="start"]');
  const logout = root.querySelector('[data-action="logout"]');
  carts.forEach((c) => c.addEventListener('click', onCart));
  switches.forEach((s) => s.addEventListener('click', onSwitch));
  start.addEventListener('click', onStart);
  logout.addEventListener('click', onLogout);

  return () => {
    alive = false;
    carts.forEach((c) => c.removeEventListener('click', onCart));
    switches.forEach((s) => s.removeEventListener('click', onSwitch));
    start.removeEventListener('click', onStart);
    logout.removeEventListener('click', onLogout);
  };
}
