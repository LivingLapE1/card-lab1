// 발음 듣기: 브라우저 음성 합성(speechSynthesis, en-US).
// 학습 내용이므로 효과음 스위치와 상관없이 항상 소리 낸다.

import { toast } from './toast.js';

const UNSUPPORTED = '이 브라우저에서는 발음 듣기를 쓸 수 없어요.';

// 고르지 않는 목소리: macOS·iPadOS의 장난감·효과 목소리와 Eloquence 목소리.
// (목록에서 알파벳 순서로 앞에 있어서, 첫 en-US 목소리를 고르면 이런 목소리가 걸린다)
const NOVELTY = new Set([
  'albert', 'bad news', 'bahh', 'bells', 'boing', 'bubbles', 'cellos', 'fred', 'good news',
  'jester', 'junior', 'kathy', 'organ', 'ralph', 'superstar', 'trinoids', 'whisper', 'wobble',
  'zarvox', 'eddy', 'flo', 'grandma', 'grandpa', 'reed', 'rocko', 'sandy', 'shelley',
]);

// 믿을 만한 목소리 (앞에 있을수록 먼저 고른다)
const TRUSTED = [
  'samantha', 'alex', 'ava', 'allison', 'susan', 'tom', 'nicky', 'evan', 'joelle', 'nathan', 'noelle', 'zoe',
  'google us english',
  'microsoft aria', 'microsoft jenny', 'microsoft guy', 'microsoft ana', 'microsoft zira', 'microsoft david', 'microsoft mark',
];

// "Samantha (Enhanced)", "Eddy (English (US))" → "samantha", "eddy"
function baseName(voice) {
  return String(voice.name || '').toLowerCase().replace(/\s*\(.*$/, '').trim();
}

const isUS = (v) => /^en[-_]us$/i.test(v.lang || '');
const isNovelty = (v) => NOVELTY.has(baseName(v));

// 목소리 목록 → 고를 목소리 | null (null이면 목소리를 정하지 않고 lang만 둔다)
// ① en-US이면서 기본 목소리 → ② 믿을 만한 이름 순서 → ③ 없음
export function chooseVoice(voices) {
  const usable = (voices || []).filter((v) => isUS(v) && !isNovelty(v));
  const byDefault = usable.find((v) => v.default);
  if (byDefault) return byDefault;
  for (const name of TRUSTED) {
    const matches = usable.filter((v) => {
      const base = baseName(v);
      return base === name || base.startsWith(`${name} `);
    });
    if (matches.length) return matches.find((v) => v.localService) || matches[0];
  }
  return null;
}

let voice = null;

function supported() {
  return typeof window !== 'undefined'
    && 'speechSynthesis' in window
    && typeof window.SpeechSynthesisUtterance === 'function';
}

function pickVoice() {
  voice = chooseVoice(window.speechSynthesis.getVoices());
}

// 목소리 목록은 늦게 도착하는 브라우저가 있어서 미리 듣고 있는다
export function initSpeech() {
  if (!supported()) return;
  pickVoice();
  const synth = window.speechSynthesis;
  if (typeof synth.addEventListener === 'function') synth.addEventListener('voiceschanged', pickVoice);
  else synth.onvoiceschanged = pickVoice;
}

export function speak(word) {
  if (!word) return;
  if (!supported()) {
    toast(UNSUPPORTED);
    return;
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  if (!voice) pickVoice();
  const utter = new window.SpeechSynthesisUtterance(word);
  utter.lang = 'en-US';
  utter.rate = 0.85;
  if (voice) utter.voice = voice;
  synth.speak(utter);
}
