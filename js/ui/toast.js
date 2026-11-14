// 토스트: index.html의 #toast 하나를 쓴다. 화면이 바뀌어도 남고, 2.8초 뒤 사라진다.

const SHOW_MS = 2800;
let hideTimer = 0;

export function toast(message) {
  const el = document.getElementById('toast');
  if (!el || !message) return;
  el.textContent = message;
  el.classList.add('is-on');
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => el.classList.remove('is-on'), SHOW_MS);
}
