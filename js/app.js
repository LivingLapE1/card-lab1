// 시작점: 라우터 시작, 토스트·발음 듣기 공통 연결, 건너뛰기 링크, iOS 누름 표시 보정.

import { start } from './router.js';
import { routes, notFound } from './routes.js';
import { toast } from './ui/toast.js';
import { speak, initSpeech } from './ui/speech.js';

// 문서 전체에서 한 번에 처리한다 (화면을 새로 그려도 다시 연결할 필요 없음)
document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const skip = target.closest('.skip');
  if (skip) {
    event.preventDefault(); // 주소의 해시를 바꾸지 않는다
    const main = document.getElementById('main');
    if (main) main.focus();
    return;
  }

  const toastEl = target.closest('[data-toast]');
  if (toastEl) toast(toastEl.getAttribute('data-toast'));

  const speakEl = target.closest('[data-speak]');
  if (speakEl) speak(speakEl.getAttribute('data-speak'));
});

// iOS Safari에서 :active 누름 효과가 보이도록
document.addEventListener('touchstart', () => {}, { passive: true });

initSpeech();
start({ routes, notFound });
