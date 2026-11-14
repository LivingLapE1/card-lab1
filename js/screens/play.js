// 게임 자리 화면 4종 — #/play/:game (게임 판은 다음 단계에서 왼쪽 창 안에 만든다)
import { html } from '../lib/html.js';
import { getGame, gameUrl } from '../content/games.js';
import { icon, art, logo, player, backButton, winBar } from '../ui/parts.js';

export const title = (d) => `${d.game.name} 준비 중`;

export async function load(ctx) {
  const { data, prefs } = ctx.services;
  const game = getGame(ctx.params.game);
  if (!game) throw new Error(`unknown game: ${ctx.params.game}`);
  // 실제 게임이 있는 경우(#/play/memory 등 직접 접속): 자리 화면 대신 그 게임으로 보낸다.
  // 로그인 확인은 라우터가 이미 했다. 기록을 늘리지 않게 replace, 페이지가 바뀌므로 그리지 않고 기다린다.
  const url = gameUrl(game, { user: ctx.user, prefs: prefs.getPrefs() });
  if (url) {
    window.location.replace(url);
    return new Promise(() => {});
  }
  const home = await data.getStudentHome(ctx.user.id);
  return { game, home, prefs: prefs.getPrefs() };
}

const onOff = (on) => (on ? '켜짐' : '꺼짐');

export function view({ game: g, home, prefs }) {
  const s = home.student;
  const sub = `${s.classLabel} · ${s.loginType === 'google' ? '구글 계정' : s.loginId}`;
  const back = `#/select/${g.id}`;

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
        <a class="btn btn--primary btn--xl btn--block gloss" href="${back}">${icon('i-back', 'i--lg')}<span>게임 고르기로</span></a>
      </div>
    </aside>
  </main>
</div>`;
}
