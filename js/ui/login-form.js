// 로그인 폼 공통 동작: 빈 칸 검사, 알림 흔들림, 비밀번호 보기/숨기기,
// 구글 버튼 로딩, 제출 중 표시, 두 번 누르기 막기.
//
// 마크업 약속
//   form              : <form novalidate> 안에 .alert(role="alert", id), .alert__text, input[required],
//                       제출 버튼 [type="submit"] 안에 .spin, .btn__text
//   구글 버튼          : .spin, .g-mark, .g-text
//   onSubmit / onClick: AuthResult({ ok, code?, ... })를 돌려주는 async 함수.
//                       성공했을 때의 이동·토스트는 화면이 맡는다.

const ERROR_MESSAGES = {
  WRONG_CREDENTIALS: '아이디나 비밀번호가 맞지 않아요. 선생님께 물어보세요.',
  NETWORK: '인터넷 연결을 확인하고 다시 해 봐요.',
};
const FALLBACK_ERROR = '지금은 들어갈 수 없어요. 잠시 뒤에 다시 해 봐요.';

// 한 화면의 구글 버튼과 폼이 함께 쓰는 잠금 (하나가 진행 중이면 다른 것도 막는다)
export function createLock() {
  return { busy: false };
}

// 로그인 시도 번호 (학생·교사 로그인 화면이 함께 쓴다)
let attemptSeq = 0;

// 로그인 흐름 지킴이.
// - 화면에 그대로 있으면(isAlive) 성공했을 때 onSuccess(이동·토스트)를 부른다.
// - 로딩 중에 화면을 떠났는데 나중에 성공하면, 이동하지 않고 그 로그인을 조용히 되돌린다(revert).
//   단, 그 사이 새 로그인 시도가 시작됐으면 새 시도가 결과를 정하므로 되돌리지 않는다.
// 돌려주는 함수: run(signIn) → AuthResult (bindLoginForm·bindGoogleButton의 onSubmit/onClick에서 쓴다)
export function guardSignIn({ isAlive, onSuccess, revert }) {
  return async (signIn) => {
    attemptSeq += 1;
    const attempt = attemptSeq;
    const result = await signIn();
    if (result && result.ok) {
      if (isAlive()) {
        onSuccess(result);
      } else if (attempt === attemptSeq) {
        try {
          await revert();
        } catch {
          /* 되돌리기에 실패해도 화면은 그대로 둔다 */
        }
      }
    }
    return result;
  };
}

function findAlert(form) {
  return form ? form.querySelector('.alert') : null;
}

export function showFormError(form, message) {
  const box = findAlert(form);
  if (!box) return;
  const text = box.querySelector('.alert__text');
  box.classList.remove('is-on');
  if (text) text.textContent = '';
  void box.offsetWidth; // 흔들림을 다시 시작하려고 다시 그리게 한다
  if (text) text.textContent = message;
  box.classList.add('is-on');
}

export function clearFormError(form) {
  const box = findAlert(form);
  if (!box) return;
  box.classList.remove('is-on');
  const text = box.querySelector('.alert__text');
  if (text) text.textContent = '';
}

function messageFor(code, emptyMessage) {
  if (code === 'EMPTY') return emptyMessage;
  return ERROR_MESSAGES[code] || FALLBACK_ERROR;
}

function markInvalid(input, invalid, alertId) {
  input.setAttribute('aria-invalid', invalid ? 'true' : 'false');
  if (invalid && alertId) input.setAttribute('aria-describedby', alertId);
  else input.removeAttribute('aria-describedby');
}

export function bindPasswordToggles(root) {
  const toggles = [...root.querySelectorAll('.pw__toggle')];
  const onClick = (event) => {
    const button = event.currentTarget;
    const input = document.getElementById(button.getAttribute('aria-controls'));
    if (!input) return;
    const reveal = input.type === 'password';
    input.type = reveal ? 'text' : 'password';
    button.textContent = reveal ? '숨기기' : '보기';
    button.setAttribute('aria-pressed', String(reveal));
  };
  toggles.forEach((b) => b.addEventListener('click', onClick));
  return () => toggles.forEach((b) => b.removeEventListener('click', onClick));
}

export function bindLoginForm(form, { emptyMessage, onSubmit, lock = createLock() }) {
  const fields = [...form.querySelectorAll('input[required]')];
  const alertBox = findAlert(form);
  const alertId = alertBox ? alertBox.id : '';
  const submit = form.querySelector('[type="submit"]');
  const label = submit ? submit.querySelector('.btn__text') : null;
  const idleText = label ? label.textContent : '';
  let done = false;

  const setBusy = (on) => {
    if (!submit) return;
    if (on) submit.setAttribute('aria-busy', 'true');
    else submit.removeAttribute('aria-busy');
    if (label) label.textContent = on ? '들어가는 중…' : idleText;
  };

  const onInput = (event) => {
    if (event.target.matches('input[required]')) markInvalid(event.target, false);
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();
    if (lock.busy || done) return;

    const empty = fields.filter((input) => !input.value.trim());
    fields.forEach((input) => markInvalid(input, empty.includes(input), alertId));
    if (empty.length) {
      showFormError(form, emptyMessage);
      empty[0].focus();
      return;
    }
    clearFormError(form);

    lock.busy = true;
    setBusy(true);
    let result;
    try {
      result = await onSubmit(Object.fromEntries(fields.map((input) => [input.name, input.value])));
    } catch {
      result = { ok: false, code: 'UNKNOWN' };
    }
    setBusy(false);
    if (result && result.ok) {
      done = true; // 이동하는 동안 다시 눌러도 한 번만 이동
      return;
    }
    lock.busy = false;
    showFormError(form, messageFor(result && result.code, emptyMessage));
  };

  form.addEventListener('input', onInput);
  form.addEventListener('submit', onFormSubmit);
  return () => {
    form.removeEventListener('input', onInput);
    form.removeEventListener('submit', onFormSubmit);
  };
}

export function bindGoogleButton(button, { onClick, lock = createLock(), emptyMessage = '' }) {
  const mark = button.querySelector('.g-mark');
  const text = button.querySelector('.g-text');
  const idleText = text ? text.textContent : '';
  let done = false;

  const setBusy = (on) => {
    if (on) button.setAttribute('aria-busy', 'true');
    else button.removeAttribute('aria-busy');
    if (mark) mark.hidden = on;
    if (text) text.textContent = on ? '구글에 연결하는 중…' : idleText;
  };

  const onButtonClick = async () => {
    if (lock.busy || done) return;
    lock.busy = true;
    setBusy(true);
    let result;
    try {
      result = await onClick();
    } catch {
      result = { ok: false, code: 'UNKNOWN' };
    }
    setBusy(false);
    if (result && result.ok) {
      done = true;
      return;
    }
    lock.busy = false;
    showFormError(button.closest('form'), messageFor(result && result.code, emptyMessage));
  };

  button.addEventListener('click', onButtonClick);
  return () => button.removeEventListener('click', onButtonClick);
}
