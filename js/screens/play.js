// 게임 자리 화면 4종 — #/play/:game (보석 게임 및 카드 뒤집기 실제 게임 판 구동)
import { html } from '../lib/html.js';
import { getGame } from '../content/games.js';
import { icon, art, logo, player, backButton, winBar } from '../ui/parts.js';

export const title = (d) => (d.game.url ? `${d.game.name} 플레이` : `${d.game.name} 준비 중`);

export async function load(ctx) {
  const { data, prefs } = ctx.services;
  const game = getGame(ctx.params.game);
  if (!game) throw new Error(`unknown game: ${ctx.params.game}`);
  const home = await data.getStudentHome(ctx.user.id);
  return { game, home, prefs: prefs.getPrefs() };
}

const onOff = (on) => (on ? '켜짐' : '꺼짐');

export function view({ game: g, home, prefs }) {
  const s = home.student;
  const sub = `${s.classLabel} · ${s.loginType === 'google' ? '구글 계정' : s.loginId}`;
  const back = `#/select/${g.id}`;
  const hasGameUrl = Boolean(g.url);

  // 학생 이름과 설정을 게임 쿼리 스트링으로 전달
  const q = new URLSearchParams({
    nick: s.name || '',
    practice: prefs.practiceMode ? '1' : '0',
    sfx: prefs.sound ? '1' : '0'
  }).toString();
  const gameSrc = hasGameUrl ? `${g.url}?${q}` : '';

  return html`
<div class="screen" data-screen="play">
  <header class="subbar subbar--play">
    ${backButton({ href: back, text: '게임 고르기' })}
    ${logo()}
    <span class="mode" lang="en">${g.label}</span>
    ${player({ avatar: s.avatar, name: s.name, sub })}
  </header>

  <main class="play t-${g.id}" id="main" tabindex="-1">
    <div class="halftone" aria-hidden="true"></div>

    ${hasGameUrl ? html`
    <section class="win win--night play-game-frame-win t-${g.id}" aria-labelledby="play-title">
      ${winBar(g.exe)}
      <div class="win__body play-game-frame__body">
        <iframe src="${gameSrc}" class="game-play-iframe" title="${g.name}" allow="autoplay; speech"></iframe>
      </div>
    </section>
    ` : html`
    <section class="win win--night soon t-${g.id}" aria-labelledby="play-title">
      ${winBar(g.exe)}
      <div class="win__body scan soon__body">
        <div class="soon__art">
          <div class="soon__plate">${art(g.id, 'soon__img')}</div>
          <span class="sticker sticker--round soon__sticker" aria-hidden="true"><span>준비 중</span></span>
        </div>
        <div class="soon__copy">
          <p class="soon__label" lang="en">${g.label}</p>
          <h1 class="soon__title" id="play-title" tabindex="-1">${g.name}</h1>
          <p class="soon__coming"><span aria-hidden="true" lang="en">COMING SOON<span class="soon__cursor">_</span></span><span class="sr-only">곧 열려요</span></p>
          <p class="soon__desc">${g.desc}</p>
          <p class="soon__ready">${g.soon}</p>
        </div>
      </div>
    </section>
    `}

    <aside class="win guide" aria-labelledby="guide-title">
      ${winBar('GUIDE.EXE')}
      <div class="win__body guide__body">
        <div>
          <h2 class="mini-h" id="guide-title">이렇게 놀 거예요</h2>
          <ol class="steps">${g.steps.map((step) => html`<li>${step}</li>`)}</ol>
        </div>
        <div>
          <h2 class="mini-h">고른 설정</h2>
          <ul class="guide__chips">
            <li class="chip">연습 모드 ${onOff(prefs.practiceMode)}</li>
            <li class="chip">효과음 ${onOff(prefs.sound)}</li>
          </ul>
        </div>
        ${hasGameUrl ? html`
        <a class="btn btn--secondary btn--lg btn--block" href="${gameSrc}" target="_blank" rel="noopener">
          <span>새 창에서 전체화면으로 ↗</span>
        </a>
        ` : ''}
        <a class="btn btn--primary btn--xl btn--block gloss" href="${back}">${icon('i-back', 'i--lg')}<span>게임 고르기로</span></a>
      </div>
    </aside>
  </main>
</div>`;
}
