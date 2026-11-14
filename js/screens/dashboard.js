// 교사 대시보드 — #/dashboard
import { html } from '../lib/html.js';
import { formatLastStudy, formatGames, formatWeekRange, formatNumber, toPercentNumber } from '../lib/format.js';
import { GAMES, getGame } from '../content/games.js';
import { icon, art, logo, avatar, player, winBar } from '../ui/parts.js';

const ID_TOAST = '학생 아이디 관리는 다음 단계에서 만들어요.';

export const title = () => '학습 기록';

export async function load(ctx) {
  const { data } = ctx.services;
  const home = await data.getTeacherHome(ctx.user.id);
  const first = home.classes[0];
  if (!first) throw new Error('teacher has no class');
  const report = await data.getClassWeekReport(first.id);
  return { home, report };
}

// ---- 조각 ----

function delta(summary) {
  const { avgAccuracy: now, prevAvgAccuracy: prev } = summary;
  if (now === null || prev === null || prev === undefined) return '';
  const diff = Math.round(now * 100) - Math.round(prev * 100);
  if (diff > 0) return html`<p class="delta">▲ 지난주보다 ${diff}%p</p>`;
  if (diff < 0) return html`<p class="delta delta--down">▼ 지난주보다 ${-diff}%p</p>`;
  return html`<p class="delta delta--same">지난주와 같아요</p>`;
}

function kpis(summary) {
  const { totalStudents: total, activeStudents: active, avgAccuracy, topGame } = summary;
  const idle = total - active;
  const cells = Array.from({ length: total }, (_, i) => (i < active ? html`<i></i>` : html`<i class="off"></i>`));
  const top = topGame ? getGame(topGame.gameId) : null;
  return html`
      <div class="kpis">
        <section class="kpi kpi--yellow" aria-labelledby="k1">
          <h2 class="kpi__label" id="k1">이번 주 참여</h2>
          <p class="kpi__big num">${active}<small>/ ${total}명</small></p>
          <div class="pix" aria-hidden="true">${cells}</div>
          <p class="kpi__note">${idle > 0 ? `${idle}명은 이번 주 기록이 없어요` : '모두 참여했어요!'}</p>
        </section>
        <section class="kpi" aria-labelledby="k2">
          <h2 class="kpi__label" id="k2">평균 정답률</h2>
          ${active > 0 && avgAccuracy !== null
            ? html`<p class="kpi__big num">${toPercentNumber(avgAccuracy)}<small>%</small></p>${delta(summary)}`
            : html`<p class="kpi__big num">—</p>`}
        </section>
        <section class="kpi" aria-labelledby="k3">
          <h2 class="kpi__label" id="k3">가장 많이 한 게임</h2>
          ${top
            ? html`<div class="kpi__game">${art(top.id)}<p><b>${top.name}</b><span class="dot num">${formatNumber(topGame.plays)}</span>판</p></div>`
            : html`<p class="kpi__note kpi__empty">아직 없어요</p>`}
        </section>
      </div>`;
}

function row(r, asOf) {
  const s = r.student;
  const idle = r.weekPlays === 0;
  const pct = toPercentNumber(r.accuracy);
  const login = s.loginType === 'google'
    ? html`<span class="ltype" lang="en">GOOGLE</span>구글 계정`
    : html`<span class="ltype ltype--id" lang="en">ID</span>${s.loginId}`;
  let accuracy;
  if (idle) accuracy = html`<span class="idle-tag">이번 주 기록 없음</span>`;
  else if (r.accuracy === null) accuracy = '—';
  else {
    accuracy = html`<span class="acc"><span class="bar"><i style="width:${pct}%"></i></span><span class="num">${pct}%</span>${r.needsHelp
      ? html`<span class="flag">${icon('i-alert')}도움 필요</span>` : ''}</span>`;
  }
  const top = r.topGameId ? getGame(r.topGameId) : null;
  return html`
                  <tr${idle ? html` class="is-idle"` : ''} data-game="${r.topGameId || 'none'}"><td><span class="who">${avatar({ ...s.avatar, size: 'sm' })}${s.name}</span></td><td>${login}</td><td>${formatLastStudy(r.lastPlayedAt, asOf)}</td><td class="num">${formatGames(r.weekPlays)}</td><td>${accuracy}</td><td>${top ? top.name : '—'}</td></tr>`;
}

// 거르기: 'all'은 모두, 게임이면 그 게임을 가장 많이 한 학생만 (기록 없는 학생은 '전체'에서만)
function filterRows(rows, filter) {
  return filter === 'all' ? rows : rows.filter((r) => r.topGameId === filter);
}

function rowsMarkup(rows, asOf) {
  if (!rows.length) {
    return html`<tr><td class="tbl__empty" colspan="6">이 게임을 가장 많이 한 학생이 없어요.</td></tr>`;
  }
  return html`${rows.map((r) => row(r, asOf))}`;
}

function hardList(hardWords) {
  const list = hardWords.slice(0, 4);
  if (!list.length) return html`<p class="hard-empty">아직 틀린 단어 기록이 없어요.</p>`;
  return html`
            <ol class="hard">
              ${list.map(({ word, accuracy }) => {
                const pct = toPercentNumber(accuracy);
                return html`<li><button class="btn btn--sm btn--icon" type="button" data-speak="${word.en}" aria-label="${word.en} 발음 듣기">${icon('i-speaker')}</button><span><b lang="en">${word.en}</b><small>${word.ko}</small></span><span class="pct num">${pct}%</span><span class="bar"><i style="width:${pct}%"></i></span></li>`;
              })}
            </ol>`;
}

export function view({ home, report }) {
  const t = home.teacher;
  const cls = home.classes[0];
  const { summary, rows, asOf } = report;

  return html`
<div class="screen" data-screen="dashboard">
  <header class="subbar subbar--dash">
    ${logo({ teacher: true })}
    ${player({ avatar: t.avatar, name: `${t.name} 선생님`, sub: `${cls.school} ${cls.label}` })}
    <button class="btn btn--sm" type="button" data-action="logout">${icon('i-door')}<span class="hide-sm" aria-hidden="true">로그아웃</span><span class="sr-only">로그아웃</span></button>
  </header>

  <main class="dash" id="main" tabindex="-1">
    <nav class="side" aria-label="대시보드 메뉴">
      <a href="#/dashboard" aria-current="page"><span>학습 기록</span>${icon('i-arrow')}</a>
      <button type="button" data-toast="${ID_TOAST}"><span>학생 아이디 관리</span><span class="count">${summary.totalStudents}<span class="sr-only">명</span></span></button>
    </nav>

    <div>
      <div class="dash__head">
        <div><h1 class="h-lg" tabindex="-1">${report.class.label} 학습 기록</h1><p class="range">이번 주 · ${formatWeekRange(report.range)}</p></div>
        <button class="btn btn--primary gloss" type="button" data-toast="${ID_TOAST}">${icon('i-plus')}<span>학생 아이디 만들기</span></button>
      </div>
${kpis(summary)}
      <div class="dash__grid">
        <section class="win" aria-labelledby="tbl-title">
          ${winBar('STUDENTS.EXE')}
          <div class="win__body tbl">
            <h2 class="sr-only" id="tbl-title">학생별 학습 기록</h2>
            <div class="filters" role="group" aria-label="많이 한 게임으로 보기">
              <button class="fchip" type="button" data-filter="all" aria-pressed="true">전체</button>
              ${GAMES.map((g) => html`<button class="fchip" type="button" data-filter="${g.id}" aria-pressed="false">${g.name}</button>`)}
            </div>
            <div class="table-wrap" tabindex="0" role="region" aria-label="학생별 학습 기록 표, 옆으로 넘겨 볼 수 있어요">
              <table>
                <thead><tr><th scope="col">학생</th><th scope="col">로그인</th><th scope="col">마지막 학습</th><th scope="col">이번 주</th><th scope="col">정답률</th><th scope="col">많이 한 게임</th></tr></thead>
                <tbody id="rows">${rowsMarkup(rows, asOf)}
                </tbody>
              </table>
            </div>
            <p class="tbl__foot" aria-live="polite">${rows.length}명 중 <b id="row-count" class="num">${rows.length}</b>명 표시</p>
          </div>
        </section>

        <section class="win" aria-labelledby="hw-title">
          ${winBar('WORDS.EXE')}
          <div class="win__body">
            <h2 class="hard-h" id="hw-title">자주 틀린 단어</h2>
            <p class="hard-sub">반 전체 정답률이 낮은 순서</p>
            ${hardList(report.hardWords)}
          </div>
        </section>
      </div>
    </div>
  </main>
</div>`;
}

export function mount(root, { report }, ctx) {
  const { auth } = ctx.services;
  const chips = [...root.querySelectorAll('.fchip')];
  const tbody = root.querySelector('#rows');
  const count = root.querySelector('#row-count');
  const logout = root.querySelector('[data-action="logout"]');
  let alive = true;

  const onFilter = (event) => {
    const chip = event.currentTarget;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    const shown = filterRows(report.rows, chip.dataset.filter);
    tbody.innerHTML = String(rowsMarkup(shown, report.asOf));
    count.textContent = String(shown.length);
  };

  const onLogout = async () => {
    await auth.signOut();
    if (!alive) return;
    ctx.navigate('/', { replace: true });
    ctx.toast('로그아웃했어요.');
  };

  chips.forEach((c) => c.addEventListener('click', onFilter));
  logout.addEventListener('click', onLogout);
  return () => {
    alive = false;
    chips.forEach((c) => c.removeEventListener('click', onFilter));
    logout.removeEventListener('click', onLogout);
  };
}
