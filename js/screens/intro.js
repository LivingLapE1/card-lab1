// 인트로 — #/
import { html } from '../lib/html.js';
import { formatNumber } from '../lib/format.js';
import { GAMES } from '../content/games.js';
import { icon } from '../ui/parts.js';

export const titleSuffix = false; // 이 화면만 " · Fun English"를 붙이지 않는다
export const title = () => 'Fun English · 초등 영어 단어 게임';

export async function load(ctx) {
  return ctx.services.data.getIntro();
}

function ribbonText(d) {
  const parts = [
    html`★ SEASON ${d.season} &nbsp;`,
    html`★ <b>${GAMES.length} GAMES</b> &nbsp;`,
  ];
  if (d.pack) parts.push(html`★ WORD PACK: ${d.pack.code} · ${d.pack.wordCount} &nbsp;`);
  if (d.todayWord) parts.push(html`★ TODAY'S WORD: <b>${d.todayWord.en.toUpperCase()}</b> <i class="ko">${d.todayWord.ko}</i> &nbsp;`);
  if (d.classBestScore !== null && d.classBestScore !== undefined) parts.push(html`★ CLASS BEST: <b>${formatNumber(d.classBestScore)}</b> PTS &nbsp;`);
  return parts;
}

// 미리보기 창은 꾸밈이므로 데이터가 아니라 여기에 고정한다
const preview = html`
    <div class="intro__stage" aria-label="카드 뒤집기 게임 미리보기" role="img">
      <div class="win win--night" aria-hidden="true">
        <div class="win__bar"><i class="win__box"></i><span class="win__title">FUNENG.EXE</span><i class="win__box"></i></div>
        <div class="win__body mm scan">
          <div class="mm__hud"><p>PAIRS <span>3/8</span></p><p>TIME <span>0:48</span></p><p>★ <span>12</span></p></div>
          <div class="mm__grid">
            <div class="mcard mcard--back">?</div>
            <div class="mcard mcard--face mcard--match"><span class="mcard__word">apple</span></div>
            <div class="mcard mcard--back mcard--flip">?</div>
            <div class="mcard mcard--back">?</div>
            <div class="mcard mcard--back">?</div>
            <div class="mcard mcard--back">?</div>
            <div class="mcard mcard--face mcard--match"><svg viewBox="0 0 48 48"><use href="#apple"/></svg></div>
            <div class="mcard mcard--back">?</div>
          </div>
          <p class="mm__combo">COMBO x3 <span>+300</span></p>
        </div>
      </div>
      <div class="sticker sticker--round intro__new" aria-hidden="true"><span>NEW!<br>보석<br>게임</span></div>
      <div class="sticker intro__count" aria-hidden="true"><span>게임 ${GAMES.length}가지</span></div>
    </div>`;

export function view(d) {
  const ribbon = ribbonText(d);
  const word = d.todayWord;
  return html`
<div class="screen" data-screen="intro">
  <div class="ribbon" aria-hidden="true">
    <div class="ribbon__track">
      <span>${ribbon}</span>
      <span>${ribbon}</span>
    </div>
  </div>

  <header class="topbar">
    <p class="tag"><span class="mode" lang="en">SEASON ${d.season}</span><span class="tag__text">초등 영어 단어 게임</span></p>
    <a class="btn btn--sm" href="#/login/teacher">${icon('i-key')}<span>교사 로그인</span></a>
  </header>

  <main class="intro" id="main" tabindex="-1">
    <div class="halftone" aria-hidden="true"></div>
    <div class="intro__copy">
      <h1 class="poster" lang="en" tabindex="-1"><span>Fun</span><span class="outline">English</span></h1>
      <p class="lead">카드를 뒤집고, 보석을 맞추고, 듣고 고르고, 빠르게 맞혀요. 네 가지 게임으로 영어 단어랑 친해지는 시간!</p>
      <div class="cta-row">
        <a class="btn btn--primary btn--xl gloss sheen" href="#/login/student"><span>학생 로그인</span>${icon('i-arrow', 'i--lg')}</a>
        <p class="hint">구글 계정이나 선생님이 만들어 준 아이디로 들어가요</p>
      </div>
    </div>
${preview}
  </main>

  <footer class="today">
    <span class="today__label" lang="en">TODAY'S WORD</span>
    ${word ? html`
    <span class="today__word" lang="en">${word.en}</span>
    <span class="today__mean">${word.ko}</span>
    <button class="btn btn--sm" type="button" data-speak="${word.en}" aria-label="${word.en} 발음 듣기">${icon('i-speaker')}<span>듣기</span></button>` : ''}
    <p class="today__right">이번 주 단어 <b class="dot num">${d.pack ? d.pack.wordCount : 0}</b>개 · 게임 <b class="dot num">${GAMES.length}</b>가지</p>
  </footer>
</div>`;
}
