// 여러 화면이 같이 쓰는 마크업 조각. 모두 SafeHtml을 돌려준다.

import { html } from '../lib/html.js';

// 선 아이콘: <svg class="i …" aria-hidden="true"><use href="#id"/></svg>
export function icon(id, extraClass = '') {
  const cls = extraClass ? `i ${extraClass}` : 'i';
  return html`<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
}

// 게임 그림 120×96
export function art(gameId, className = '') {
  return html`<svg class="${className}" viewBox="0 0 120 96" aria-hidden="true"><use href="#art-${gameId}"/></svg>`;
}

// 창 제목줄
export function winBar(title) {
  return html`<div class="win__bar"><i class="win__box"></i><span class="win__title" lang="en">${title}</span><i class="win__box"></i></div>`;
}

// 로고: 첫 화면(#/)으로 가는 링크. 로그인 상태는 그대로 둔다.
// (teacher: TEACHER 태그, hideEnglishOnSmall: 640px 이하 "English" 숨김)
// 화면 낭독기 이름은 TEACHER 태그가 있어도 "Fun English 첫 화면으로"로 같다.
export function logo({ teacher = false, hideEnglishOnSmall = false } = {}) {
  const outline = hideEnglishOnSmall ? 'outline hide-sm' : 'outline';
  return html`<a class="logo" href="#/" aria-label="Fun English 첫 화면으로"><span lang="en">Fun</span> <span class="${outline}" lang="en">English</span>${teacher ? html` <span class="mode" lang="en">TEACHER</span>` : ''}</a>`;
}

// 아바타 (color: yellow는 클래스 없음, cobalt / red / paper)
export function avatar({ label, color = 'yellow', size } = {}) {
  let cls = 'avatar';
  if (color && color !== 'yellow') cls += ` avatar--${color}`;
  if (size === 'sm') cls += ' avatar--sm';
  return html`<span class="${cls}" aria-hidden="true">${label}</span>`;
}

// 플레이어 표시: 아바타 + 이름 + 설명
export function player({ avatar: av, name, sub }) {
  return html`<div class="player">${avatar(av)}<p><b>${name}</b>${sub ? html`<small>${sub}</small>` : ''}</p></div>`;
}

// 뒤로 버튼 (480px 이하는 아이콘만, 이름은 aria-label)
export function backButton({ href, text }) {
  return html`<a class="btn btn--sm" href="${href}" aria-label="${text}">${icon('i-back')}<span class="back-text">${text}</span></a>`;
}
