// 학생 로그인 — #/login/student
import { html } from '../lib/html.js';
import { icon, logo, backButton, winBar } from '../ui/parts.js';
import { bindLoginForm, bindGoogleButton, bindPasswordToggles, createLock, guardSignIn } from '../ui/login-form.js';

const EMPTY_MESSAGE = '아이디와 비밀번호를 모두 적어 주세요.';

export const title = () => '학생 로그인';

export function view() {
  return html`
<div class="screen" data-screen="student-login">
  <header class="subbar">
    ${backButton({ href: '#/', text: '처음으로' })}
    ${logo()}
    <a class="btn btn--sm" href="#/login/teacher" style="margin-left:auto">${icon('i-key')}<span>교사<span class="hide-sm"> 로그인</span></span></a>
  </header>

  <main class="login" id="main" tabindex="-1">
    <div class="halftone" aria-hidden="true"></div>
    <div class="login__grid">
      <div class="mascot">
        <p class="bubble"><span lang="en">Hello!</span>오늘도 같이 놀자!</p>
        <svg class="bit" viewBox="0 0 160 170" role="img" aria-label="마스코트 비트"><use href="#bit"/></svg>
      </div>

      <div class="win">
        ${winBar('LOGIN.EXE')}
        <form class="win__body form" id="form-student" novalidate>
          <h1 class="form__title" tabindex="-1">학생 로그인</h1>
          <p class="sub">어떻게 들어갈까요? 둘 중 하나를 골라요.</p>

          <button type="button" class="btn btn--block btn--google" data-role="google"><span class="spin" aria-hidden="true"></span><span class="g-mark" aria-hidden="true">G</span><span class="g-text">구글 계정으로 로그인</span></button>

          <p class="or">또는 선생님이 만든 아이디로</p>

          <div class="alert" id="st-alert" role="alert">${icon('i-alert')}<span class="alert__text"></span></div>

          <div class="field">
            <label for="st-id">아이디</label>
            <input class="input" id="st-id" name="loginId" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="예: hanbit4-07" required>
          </div>
          <div class="field">
            <label for="st-pw">비밀번호</label>
            <div class="pw">
              <input class="input" id="st-pw" name="password" type="password" autocomplete="current-password" placeholder="선생님이 알려 준 비밀번호" required>
              <button type="button" class="pw__toggle" aria-controls="st-pw" aria-pressed="false">보기</button>
            </div>
          </div>

          <button class="btn btn--primary btn--xl btn--block gloss sheen" type="submit"><span class="spin" aria-hidden="true"></span><span class="btn__text">시작하기!</span>${icon('i-arrow', 'i--lg')}</button>
          <p class="help">아이디가 생각나지 않으면 선생님께 물어보세요.</p>
        </form>
      </div>
    </div>
  </main>
</div>`;
}

export function mount(root, _data, ctx) {
  const { auth } = ctx.services;
  const form = root.querySelector('#form-student');
  const google = root.querySelector('[data-role="google"]');
  const lock = createLock();
  let alive = true;

  // 로그인한 뒤에는 원래 가려던 주소와 상관없이 게임 선택으로 (로그인 폼은 기록에서 바꿈).
  // 로딩 중에 화면을 떠났으면 이동하지 않고, 끝난 로그인은 조용히 되돌린다(토스트 없음).
  const run = guardSignIn({
    isAlive: () => alive,
    onSuccess: (result) => {
      if (result.notice) ctx.toast(result.notice);
      ctx.navigate('/select', { replace: true });
    },
    revert: () => auth.signOut(),
  });

  const offs = [
    bindPasswordToggles(root),
    bindLoginForm(form, {
      emptyMessage: EMPTY_MESSAGE,
      lock,
      onSubmit: ({ loginId, password }) => run(() => auth.signInStudentWithId({ loginId, password })),
    }),
    bindGoogleButton(google, {
      emptyMessage: EMPTY_MESSAGE,
      lock,
      onClick: () => run(() => auth.signInStudentWithGoogle()),
    }),
  ];

  return () => {
    alive = false; // 로딩 중에 떠나면 로딩이 끝나도 이동하지 않는다
    offs.forEach((off) => off());
  };
}
