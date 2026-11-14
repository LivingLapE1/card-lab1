// 해시 주소 라우터.
// 주소 해석 → 로그인 확인 → 데이터 불러오기 → 화면 바꾸기 → 제목·스크롤·포커스 처리.

import { auth, data, prefs } from './services/index.js';
import { toast } from './ui/toast.js';
import { speak } from './ui/speech.js';

const SUFFIX = ' · Fun English';
const LOGIN_FOR_ROLE = { student: '/login/student', teacher: '/login/teacher' };

let table = { routes: [], notFound: null };
let renderId = 0;
let cleanup = null;
let firstPaint = true;

// ---- 주소 해석 (spec 5.2) ----
// '#', '?' 뒤 버리기, 소문자, 끝의 '/' 지우기('/'만 남으면 그대로), 빈 값은 '/'
export function parsePath(hash) {
  let path = String(hash || '').replace(/^#/, '');
  path = path.split('?')[0].toLowerCase();
  if (path === '') return '/';
  if (path.length > 1) path = path.replace(/\/+$/, '');
  return path === '' ? '/' : path;
}

const segments = (path) => (path === '/' ? [] : path.slice(1).split('/'));

// 경로 조각을 routes의 패턴과 차례로 맞춘다.
// 결과: { route, params, redirect? } | null
export function matchPath(path, routes) {
  if (!path.startsWith('/')) return null; // 시안 주소(#intro 등)는 없는 주소
  const segs = segments(path);
  for (const route of routes) {
    const pattern = segments(route.path);
    if (pattern.length !== segs.length) continue;
    const params = {};
    let same = true;
    let badParam = false;
    for (let i = 0; i < pattern.length; i += 1) {
      const part = pattern[i];
      if (part.startsWith(':')) {
        const name = part.slice(1);
        const allowed = route.params?.[name];
        if (allowed && !allowed.includes(segs[i])) badParam = true;
        else params[name] = segs[i];
      } else if (part !== segs[i]) {
        same = false;
        break;
      }
    }
    if (!same) continue;
    if (badParam) {
      // 예: #/select/abc → 게임 선택(기본 선택) + 주소를 #/select로 조용히 바꿈
      if (route.onBadParam) return { route: findRoute(routes, route.onBadParam), params: {}, redirect: route.onBadParam };
      continue;
    }
    return { route, params };
  }
  return null;
}

function findRoute(routes, path) {
  return routes.find((r) => r.path === path) ?? null;
}

// ---- 공개 함수 ----

export function start({ routes, notFound }) {
  table = { routes, notFound };
  window.addEventListener('hashchange', () => { render(); });
  render();
}

// '#' 없는 경로를 받아 이동. replace면 지금 기록을 바꾼다.
export function navigate(path, { replace = false } = {}) {
  const target = `#${path}`;
  if (location.hash === target) {
    render(); // 같은 주소면 hashchange가 안 생기므로 직접 다시 그린다
    return;
  }
  if (replace) location.replace(target);
  else location.hash = target;
}

// 주소만 바꾸고 화면은 다시 그리지 않는다 (기록도 늘지 않음)
export function setPathQuietly(path) {
  history.replaceState(history.state, '', `#${path}`);
}

export function reload() {
  render();
}

// ---- 그리기 ----

function reduceMotion() {
  return typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function makeCtx(params, user) {
  return {
    params,
    user,
    services: { auth, data, prefs },
    navigate,
    setPathQuietly,
    reload,
    toast,
    speak,
    reduceMotion: reduceMotion(),
  };
}

async function render() {
  renderId += 1;
  const id = renderId;
  const path = parsePath(location.hash);
  const found = matchPath(path, table.routes);

  let user = null;
  try {
    user = await auth.getCurrentUser();
  } catch {
    user = null;
  }
  if (id !== renderId) return;

  if (!found || !found.route) {
    const ctx = makeCtx({}, user);
    paint(table.notFound, { kind: 'notfound' }, ctx);
    return;
  }

  const { route, params, redirect } = found;

  // 로그인 확인: 필요한 역할이 아니면 그 역할의 로그인 화면으로
  if (route.role && (!user || user.role !== route.role)) {
    navigate(LOGIN_FOR_ROLE[route.role], { replace: true });
    toast('먼저 로그인해 주세요.');
    return;
  }

  if (redirect) setPathQuietly(redirect);

  const ctx = makeCtx(params, user);
  const mod = route.screen;
  let result;
  try {
    result = mod.load ? await mod.load(ctx) : undefined;
  } catch (err) {
    if (id !== renderId) return;
    console.error('[router] 화면 데이터를 불러오지 못했어요:', err);
    paint(table.notFound, { kind: 'error' }, ctx);
    return;
  }
  if (id !== renderId) return; // 그 사이 다른 주소로 바뀌었으면 이 결과는 버린다

  try {
    paint(mod, result, ctx);
  } catch (err) {
    console.error('[router] 화면을 그리지 못했어요:', err);
    paint(table.notFound, { kind: 'error' }, ctx);
  }
}

function paint(mod, result, ctx) {
  if (cleanup) {
    const fn = cleanup;
    cleanup = null;
    try { fn(); } catch (err) { console.error(err); }
  }

  const app = document.getElementById('app');
  app.innerHTML = String(mod.view(result, ctx));

  const title = mod.title ? mod.title(result, ctx) : '';
  document.title = mod.titleSuffix === false ? title : `${title}${SUFFIX}`;

  window.scrollTo(0, 0);

  const h1 = app.querySelector('h1');
  if (h1) {
    if (!h1.hasAttribute('tabindex')) h1.setAttribute('tabindex', '-1');
    if (!firstPaint) h1.focus({ preventScroll: true });
  }
  firstPaint = false;

  const root = app.firstElementChild;
  const off = mod.mount ? mod.mount(root, result, ctx) : null;
  cleanup = typeof off === 'function' ? off : null;
}
