// 교사 로그인 — #/login/teacher
import { html } from '../lib/html.js';
import { icon, logo, backButton, winBar } from '../ui/parts.js';
import { bindLoginForm, bindGoogleButton, bindPasswordToggles, createLock, guardSignIn } from '../ui/login-form.js';

const EMPTY_MESSAGE = '이메일과 비밀번호를 모두 입력해 주세요.';

export const title = () => '선생님 로그인';

export function view() {
  return html`
<div class="screen" data-screen="teacher-login">
  <header class="subbar">
    ${backButton({ href: '#/', text: '처음으로' })}
    ${logo({ teacher: true })}
  </header>

  <main class="login login--teacher" id="main" tabindex="-1">
    <div class="halftone" aria-hidden="true"></div>
    <div class="login__grid">
      <div class="win win--cobalt">
        ${winBar('TEACHER.EXE')}
        <div class="win__body tl">
          <form class="form" id="form-teacher" novalidate>
            <h1 class="form__title" tabindex="-1">선생님 로그인</h1>
            <p class="sub">학생들의 학습 기록을 보고, 학생 아이디를 만들어요.</p>

            <button type="button" class="btn btn--block btn--google" data-role="google"><span class="spin" aria-hidden="true"></span><span class="g-mark" aria-hidden="true">G</span><span class="g-text">구글 계정으로 로그인</span></button>

            <p class="or">또는 이메일로</p>

            <div class="alert" id="tc-alert" role="alert">${icon('i-alert')}<span class="alert__text"></span></div>

            <div class="field">
              <label for="tc-mail">이메일</label>
              <input class="input" id="tc-mail" name="email" type="email" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="teacher@school.example" required>
            </div>
            <div class="field">
              <label for="tc-pw">비밀번호</label>
              <div class="pw">
                <input class="input" id="tc-pw" name="password" type="password" autocomplete="current-password" required>
                <button type="button" class="pw__toggle" aria-controls="tc-pw" aria-pressed="false">보기</button>
              </div>
            </div>

            <button class="btn btn--cobalt btn--xl btn--block gloss" type="submit"><span class="spin" aria-hidden="true"></span><span class="btn__text">대시보드로 가기</span>${icon('i-arrow', 'i--lg')}</button>
            <p class="help"><button type="button" class="linkbtn" data-toast="비밀번호 찾기는 로그인 방식을 정한 뒤 연결해요.">비밀번호를 잊었어요</button></p>
          </form>

          <aside class="notes" aria-labelledby="notes-title">
            <h2 class="notes__title" id="notes-title">대시보드에서 할 수 있어요</h2>
            <p class="note"><b>01</b>학생별 학습 기록과 정답률, 자주 틀린 단어를 봐요.</p>
            <p class="note"><b>02</b>학생 아이디를 만들고 비밀번호를 다시 정해 줘요.</p>
          </aside>
        </div>
      </div>
    </div>
  </main>
</div>`;
}

export function mount(root, _data, ctx) {
  const { auth } = ctx.services;
  const form = root.querySelector('#form-teacher');
  const google = root.querySelector('[data-role="google"]');
  const lock = createLock();
  let alive = true;

  // 로딩 중에 화면을 떠났으면 이동하지 않고, 끝난 로그인은 조용히 되돌린다(토스트 없음).
  const run = guardSignIn({
    isAlive: () => alive,
    onSuccess: (result) => {
      if (result.notice) ctx.toast(result.notice);
      ctx.navigate('/dashboard', { replace: true });
    },
    revert: () => auth.signOut(),
  });

  const offs = [
    bindPasswordToggles(root),
    bindLoginForm(form, {
      emptyMessage: EMPTY_MESSAGE,
      lock,
      onSubmit: ({ email, password }) => run(() => auth.signInTeacherWithEmail({ email, password })),
    }),
    bindGoogleButton(google, {
      emptyMessage: EMPTY_MESSAGE,
      lock,
      onClick: () => run(() => auth.signInTeacherWithGoogle()),
    }),
  ];

  return () => {
    alive = false; // 로딩 중에 떠나면 로딩이 끝나도 이동하지 않는다
    offs.forEach((off) => off());
  };
}
