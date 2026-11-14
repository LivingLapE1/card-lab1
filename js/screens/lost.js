// 길을 잃었어요 (없는 주소) / 화면을 불러오지 못했어요 (데이터 오류)
// 라우터가 data = { kind: 'notfound' | 'error' }로 바로 그린다.
import { html } from '../lib/html.js';
import { icon, logo, backButton, winBar } from '../ui/parts.js';

const isError = (d) => Boolean(d && d.kind === 'error');

export const title = (d) => (isError(d) ? '화면을 불러오지 못했어요' : '길을 잃었어요');

export function view(d) {
  const error = isError(d);
  return html`
<div class="screen" data-screen="lost">
  <header class="subbar">
    ${backButton({ href: '#/', text: '처음으로' })}
    ${logo()}
  </header>

  <main class="lost" id="main" tabindex="-1">
    <div class="halftone" aria-hidden="true"></div>
    <section class="win lost__win" aria-labelledby="lost-title">
      ${winBar(error ? 'ERROR.EXE' : 'LOST.EXE')}
      <div class="win__body lost__body">
        ${icon('i-alert', 'lost__icon')}
        <p class="lost__label" lang="en">${error ? 'ERROR' : 'ERROR 404'}</p>
        <h1 class="lost__title" id="lost-title" tabindex="-1">${error ? '화면을 불러오지 못했어요' : '길을 잃었어요'}</h1>
        <p class="lost__text">${error
          ? '잠시 뒤에 다시 해 봐요. 계속 안 되면 선생님께 알려 주세요.'
          : '이 주소에는 화면이 없어요. 처음 화면에서 다시 시작해요.'}</p>
        <div class="lost__actions">
          ${error
            ? html`<button class="btn btn--primary gloss" type="button" data-action="retry">다시 시도</button><a class="btn" href="#/" data-action="home">처음으로</a>`
            : html`<a class="btn btn--primary btn--xl gloss" href="#/" data-action="home">처음으로</a>`}
        </div>
      </div>
    </section>
  </main>
</div>`;
}

export function mount(root, _data, ctx) {
  const retry = root.querySelector('[data-action="retry"]');
  const homes = [...root.querySelectorAll('a[href="#/"]')];

  const onRetry = () => ctx.reload();
  // 지금 주소가 이미 #/ 이어도(인트로를 못 불러온 경우) 다시 그리도록 라우터로 이동한다
  const onHome = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    ctx.navigate('/');
  };

  if (retry) retry.addEventListener('click', onRetry);
  homes.forEach((a) => a.addEventListener('click', onHome));
  return () => {
    if (retry) retry.removeEventListener('click', onRetry);
    homes.forEach((a) => a.removeEventListener('click', onHome));
  };
}
