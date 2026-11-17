// 03 LISTEN — 단어 묶음과 그림 카드
// 초급 = 레벨마다 새 단어 12개(서로 다른 소리끼리 카드), 중급 = 끝소리가 같은 묶음, 고급 = 최소 대립쌍 묶음.
// 그림은 DESIGN.md 그림 체계: 3px 검정 외곽선, 팔레트 단색 채움, 그라데이션·이모지 없음.
// 형식: { en: 영어 단어, ko: 한글 뜻, svg: 64×64 안쪽 그림 }

(function () {
  const K = 'stroke="#141414" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
  const Y = 'var(--yellow)', R = 'var(--red)', B = 'var(--cobalt)', G = 'var(--green)';
  const P = 'var(--paper-2)', T = 'var(--paper-3)', N = 'var(--night)', I = '#141414';
  const hi = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".8"/>`;

  const PICS = {
    // ── 묶음 1: -at / -ap ──
    cat: `<g ${K}><path d="M14 30 15 9l11 10q6-2 12 0L49 9l1 21q2 20-18 22Q12 50 14 30z" fill="${Y}"/>
      <path d="M32 36l-3-3h6z" fill="${R}"/><path d="M8 34h11M9 40l10-3M56 34H45M55 40l-10-3M32 36v4q-3 3-6 1M32 40q3 3 6 1" fill="none" stroke-width="2.5"/></g>
      <circle cx="24" cy="28" r="3" fill="${I}"/><circle cx="40" cy="28" r="3" fill="${I}"/>${hi(20, 20, 2, 3)}`,
    hat: `<g ${K}><ellipse cx="32" cy="48" rx="27" ry="8" fill="${B}"/><path d="M17 47V18q15-6 30 0v29q-15 5-30 0z" fill="${B}"/>
      <path d="M17 38q15 5 30 0v7q-15 5-30 0z" fill="${R}"/></g>${hi(22, 24, 2, 5)}`,
    bat: `<g ${K}><path d="M12 56q-4-4 0-8L42 14q8-8 13-3t-3 13L18 54q-4 4-6 2z" fill="${T}"/><path d="M14 46l6 6" fill="none"/>
      <circle cx="14" cy="16" r="8" fill="${P}"/><path d="M9 11q5 5 0 11M19 11q-5 5 0 11" fill="none" stroke="${R}" stroke-width="2"/></g>${hi(46, 15, 2, 4)}`,
    cap: `<g ${K}><path d="M10 40q0-24 24-24t22 24z" fill="${R}"/><path d="M8 40h50q4 0 4 4t-4 4H22q-12 0-14-8z" fill="${R}"/>
      <path d="M34 16v-3" fill="none"/><path d="M28 40q2-14 6-24" fill="none" stroke-width="2.5"/></g>${hi(20, 28, 2, 5)}`,

    // ── 묶음 2: sh- / ch- ──
    ship: `<g ${K}><path d="M24 14v12h14V18z" fill="${Y}"/><path d="M14 26h34v10H14z" fill="${P}"/>
      <path d="M6 36h52l-7 14H13z" fill="${R}"/><path d="M4 56q5-4 10 0t10 0 10 0 10 0 10 0 6 0" fill="none" stroke="${B}"/></g>
      <circle cx="22" cy="31" r="2" fill="${I}"/><circle cx="31" cy="31" r="2" fill="${I}"/><circle cx="40" cy="31" r="2" fill="${I}"/>`,
    sheep: `<g ${K}><path d="M50 52v6M40 52v6M24 52v6M16 52v6" fill="none"/>
      <path d="M14 36q-6-8 2-14 2-8 10-6 6-6 13 0 8-2 10 6 7 6 2 14 4 9-6 14-6 6-14 2-6 4-14 0-8 2-10-6-6-4-3-10z" fill="${P}"/>
      <path d="M4 26q0-8 8-8t8 8q0 10-8 10T4 26z" fill="${N}"/></g><circle cx="10" cy="25" r="2" fill="#fff"/>`,
    chip: `<g ${K}><path d="M8 46q6-10 18-10t30 6q-4 10-18 10T8 46z" fill="${Y}"/><path d="M10 32q8-10 22-9t24 7q-6 9-20 9T10 32z" fill="${Y}"/>
      <path d="M14 18q8-8 20-7t20 7q-6 8-18 8T14 18z" fill="${Y}"/></g>
      <g fill="${R}"><circle cx="24" cy="17" r="1.5"/><circle cx="40" cy="19" r="1.5"/><circle cx="30" cy="31" r="1.5"/><circle cx="44" cy="33" r="1.5"/><circle cx="22" cy="45" r="1.5"/><circle cx="38" cy="46" r="1.5"/></g>`,
    chick: `<g ${K}><path d="M26 54v6M38 54v6M22 60h8M34 60h8" fill="none" stroke="${R}"/><ellipse cx="32" cy="40" rx="18" ry="15" fill="${Y}"/>
      <circle cx="32" cy="20" r="11" fill="${Y}"/><path d="M42 19l8 3-8 3z" fill="${R}"/><path d="M22 40q6 6 12 2" fill="none"/></g>
      <circle cx="35" cy="17" r="2.2" fill="${I}"/>${hi(26, 14, 2, 3)}`,

    // ── 묶음 3: -air / -ear ──
    bear: `<g ${K}><circle cx="15" cy="16" r="8" fill="${T}"/><circle cx="49" cy="16" r="8" fill="${T}"/><circle cx="32" cy="34" r="22" fill="${T}"/>
      <ellipse cx="32" cy="42" rx="10" ry="8" fill="${P}"/><path d="M28 39h8l-4 4z" fill="${I}"/></g>
      <circle cx="24" cy="30" r="3" fill="${I}"/><circle cx="40" cy="30" r="3" fill="${I}"/>${hi(20, 22, 2, 3)}`,
    pear: `<g ${K}><path d="M32 12q8 0 8 12 0 6 6 12 6 8 0 16-14 10-28 0-6-8 0-16 6-6 6-12 0-12 8-12z" fill="${G}"/>
      <path d="M32 12q0-4 2-8" fill="none"/><path d="M34 8q8-4 14 0-6 5-14 0z" fill="${G}"/></g>${hi(25, 38, 2.5, 6)}`,
    chair: `<g ${K}><path d="M18 6h8v28h-8zM18 34h30v8H18z" fill="${B}"/><path d="M20 42v18M46 42v18M24 42v14M42 42v14" fill="none"/></g>${hi(21, 12, 1.5, 4)}`,
    hair: `<g ${K}><path d="M10 40Q6 8 32 6t22 34q-4 14-8 18l-2-24H20l-2 24q-6-6-8-18z" fill="${R}"/>
      <path d="M20 30q0 24 12 24t12-24q-6-6-12-2-6-4-12 2z" fill="${P}"/><path d="M18 28q8-12 14-12t14 12q-10-6-14 0-4-6-14 0z" fill="${R}"/></g>
      <circle cx="27" cy="38" r="2" fill="${I}"/><circle cx="37" cy="38" r="2" fill="${I}"/><path d="M28 46q4 3 8 0" fill="none" ${K} stroke-width="2.5"/>`,

    // ── 묶음 4: -an ──
    fan: `<g ${K}><path d="M32 40v14M20 58h24" fill="none"/><circle cx="32" cy="24" r="19" fill="${P}"/>
      <path d="M32 24q-2-14 8-12 4 8-8 12zM32 24q12 6 6 14-8-2-6-14zM32 24q-10 8-14 0 2-10 14 0z" fill="${B}"/></g><circle cx="32" cy="24" r="3" fill="${I}"/>`,
    van: `<g ${K}><path d="M4 46V20q0-6 6-6h30q6 0 10 6l8 12v14z" fill="${B}"/><path d="M42 20h6l7 11H42z" fill="${P}"/>
      <path d="M10 20h12v11H10zM26 20h12v11H26z" fill="${P}"/><circle cx="16" cy="48" r="6" fill="${N}"/><circle cx="46" cy="48" r="6" fill="${N}"/></g>
      <circle cx="16" cy="48" r="2" fill="#fff"/><circle cx="46" cy="48" r="2" fill="#fff"/>`,
    pan: `<g ${K}><path d="M38 34l20 20q2 4-2 4L34 38" fill="${R}"/><circle cx="26" cy="28" r="20" fill="${N}"/><circle cx="26" cy="28" r="14" fill="#3d3558"/></g>${hi(18, 20, 2, 5)}`,
    man: `<g ${K}><circle cx="32" cy="14" r="9" fill="${P}"/><path d="M18 50V30q0-6 6-6h16q6 0 6 6v20" fill="${B}"/>
      <path d="M24 50h16v10h-6v-6h-4v6h-6z" fill="${N}"/><path d="M18 30v16M46 30v16" fill="none"/></g>
      <circle cx="29" cy="13" r="1.8" fill="${I}"/><circle cx="35" cy="13" r="1.8" fill="${I}"/>`,

    // ── 묶음 5: -ee / -ea ──
    bee: `<g ${K}><ellipse cx="22" cy="20" rx="9" ry="12" fill="${P}" transform="rotate(-20 22 20)"/><ellipse cx="38" cy="18" rx="9" ry="12" fill="${P}" transform="rotate(20 38 18)"/>
      <ellipse cx="32" cy="40" rx="18" ry="14" fill="${Y}"/><path d="M24 28v24M34 27v26" fill="none" stroke-width="5"/><path d="M50 40l7 0" fill="none"/></g>
      <circle cx="18" cy="38" r="2" fill="${I}"/>`,
    key: `<g ${K}><circle cx="18" cy="32" r="12" fill="${Y}"/><path d="M28 28h30v8H52v8h-6v-8h-6v6h-6v-6h-6z" fill="${Y}"/></g><circle cx="18" cy="32" r="4" fill="${P}" ${K}/>${hi(13, 26, 2, 3)}`,
    tea: `<g ${K}><path d="M22 6q-4 5 0 10M32 4q-4 5 0 10M42 6q-4 5 0 10" fill="none" stroke-width="2.5"/>
      <path d="M48 28q10 0 10 8t-10 8" fill="none"/><path d="M12 22h38v14q0 16-19 16T12 36z" fill="${R}"/><ellipse cx="31" cy="56" rx="26" ry="5" fill="${P}"/></g>${hi(18, 30, 2, 5)}`,
    tree: `<g ${K}><path d="M27 40h10v20H27z" fill="${T}"/><path d="M32 4q16 0 18 16 10 6 4 18-6 8-22 6-16 2-22-6-6-12 4-18 2-16 18-16z" fill="${G}"/></g>${hi(22, 16, 3, 5)}`,

    // ── 묶음 6: -ouse / -oon ──
    mouse: `<g ${K}><path d="M50 46q10 2 10-6" fill="none"/><path d="M8 48q0-22 22-22t22 22z" fill="${T}"/>
      <circle cx="20" cy="22" r="8" fill="${T}"/><path d="M4 48q4-6 10-4" fill="none"/></g>
      <circle cx="20" cy="22" r="4" fill="${R}"/><circle cx="14" cy="40" r="2" fill="${I}"/><circle cx="8" cy="46" r="2.5" fill="${R}"/>`,
    house: `<g ${K}><path d="M12 30h40v28H12z" fill="${P}"/><path d="M6 32 32 8l26 24z" fill="${R}"/><path d="M27 42h10v16H27z" fill="${B}"/>
      <path d="M16 38h8v8h-8zM40 38h8v8h-8z" fill="${Y}"/></g>`,
    moon: `<g ${K}><path d="M40 8a24 24 0 1 0 16 38A20 20 0 0 1 40 8z" fill="${Y}"/>
      <path d="M50 12l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="${Y}" stroke-width="2"/></g>${hi(20, 26, 2, 6)}`,
    spoon: `<g ${K}><ellipse cx="22" cy="20" rx="12" ry="16" fill="${P}" transform="rotate(-40 22 20)"/><path d="M28 28l28 28q2 4-2 4L24 32" fill="${T}"/></g>${hi(18, 14, 2, 5)}`,
  };

  const PK = 'var(--red-tint)';
  Object.assign(PICS, {
    // ── 중급 추가 그림 ──
    rat: PICS.mouse,
    cake: `<g ${K}><path d="M32 8v10" fill="none"/><path d="M32 4q3 3 0 5-3-2 0-5z" fill="${Y}" stroke-width="2"/>
      <path d="M10 30h44v24H10z" fill="${P}"/><path d="M10 30h44v8q-4 6-8 0-4 6-8 0-4 6-8 0-4 6-8 0-4 6-8 0-4 6-4 0z" fill="${R}"/>
      <path d="M14 18h36l4 12H10z" fill="${Y}"/><circle cx="32" cy="16" r="3" fill="${R}"/><path d="M6 56h52" fill="none"/></g>`,
    lake: `<g ${K}><path d="M14 28l10-16 10 16z" fill="${T}"/><path d="M28 28l12-20 12 20z" fill="${P}"/>
      <ellipse cx="32" cy="44" rx="28" ry="14" fill="${G}"/><ellipse cx="32" cy="45" rx="20" ry="8" fill="${B}"/></g>
      <path d="M20 45h8M34 48h8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`,
    snake: `<g ${K}><path d="M13 15l-7 3 5 3" fill="none" stroke="${R}" stroke-width="2.5"/>
      <path d="M48 52q-14 6-26 0-14-8-4-16 10-6 22-2 12 2 10-10-2-10-16-10-12 0-16 6l-6-4q6-10 22-10 22 0 24 16 2 18-16 16-12-2-18 2-4 4 4 6 10 2 22-2z" fill="${G}"/></g>
      <circle cx="18" cy="13" r="2.2" fill="${I}"/>`,
    rake: `<g ${K}><path d="M50 6L22 44" fill="none" stroke="${T}" stroke-width="6"/><path d="M50 6L22 44" fill="none" stroke-width="1"/>
      <path d="M8 40l26 18 3-4-26-18z" fill="${R}"/><path d="M10 44l-4 6M16 48l-4 6M22 52l-4 6M28 56l-4 6" fill="none"/></g>`,
    car: `<g ${K}><path d="M4 46V36q0-4 4-5l8-2 8-12h18l10 12h4q4 0 4 4v13z" fill="${R}"/><path d="M26 20h7v10H20zM37 20h4l8 10H37z" fill="${P}"/>
      <circle cx="18" cy="47" r="7" fill="${N}"/><circle cx="46" cy="47" r="7" fill="${N}"/></g>
      <circle cx="18" cy="47" r="2.5" fill="#fff"/><circle cx="46" cy="47" r="2.5" fill="#fff"/>`,
    star: `<g ${K}><path d="M32 5l8 17 18 2-13 12 4 19-17-10-17 10 4-19L6 24l18-2z" fill="${Y}"/></g>
      <circle cx="26" cy="32" r="2.2" fill="${I}"/><circle cx="38" cy="32" r="2.2" fill="${I}"/><path d="M28 39q4 3 8 0" fill="none" ${K} stroke-width="2.5"/>`,
    jar: `<g ${K}><path d="M18 18h28v4q6 4 6 12v18q0 6-6 6H18q-6 0-6-6V34q0-8 6-12z" fill="${P}"/>
      <path d="M14 38h36v14q0 4-4 4H18q-4 0-4-4z" fill="${Y}"/><path d="M16 8h32v10H16z" fill="${R}"/></g>${hi(20, 30, 2, 5)}`,
    guitar: `<g ${K}><path d="M38 26L56 8l4 4-18 18" fill="${T}"/>
      <path d="M30 22q8-6 12 0t-2 12q8 6 0 16t-20 6Q6 52 8 40t10-12q2-8 12-6z" fill="${Y}"/>
      <path d="M50 10l2 2M54 6l2 2" fill="none"/></g><circle cx="27" cy="38" r="5" fill="${N}" ${K}/>
      <path d="M18 48l28-28" stroke="#141414" stroke-width="1.5"/>`,
    balloon: `<g ${K}><path d="M32 46q2 6-4 10t0 6" fill="none" stroke-width="2"/><ellipse cx="32" cy="24" rx="17" ry="20" fill="${R}"/>
      <path d="M29 44h6l-3 4z" fill="${R}"/></g>${hi(25, 16, 3, 6)}`,
    raccoon: `<g ${K}><path d="M12 22l2-14 12 8zM52 22l-2-14-12 8z" fill="${T}"/><ellipse cx="32" cy="36" rx="24" ry="20" fill="${T}"/>
      <path d="M10 34q6-8 14-4 8 2 16 0 8-4 14 4-4 8-14 6-8-2-16 0-10 2-14-6z" fill="${N}"/>
      <ellipse cx="32" cy="48" rx="10" ry="7" fill="${P}"/><path d="M29 44h6l-3 3z" fill="${I}"/></g>
      <circle cx="22" cy="34" r="3" fill="#fff"/><circle cx="42" cy="34" r="3" fill="#fff"/><circle cx="22" cy="34" r="1.5" fill="${I}"/><circle cx="42" cy="34" r="1.5" fill="${I}"/>`,
    bed: `<g ${K}><path d="M6 14h8v42H6zM50 28h8v28h-8z" fill="${B}"/><path d="M14 34h36v12H14z" fill="${P}"/>
      <path d="M16 26h14v8H16z" fill="${P}"/><path d="M28 32h22v14H28z" fill="${R}"/></g>`,
    sled: `<g ${K}><path d="M6 44h44q8 0 8-8" fill="none" stroke-width="4"/><path d="M14 44v-8M42 44v-8" fill="none"/>
      <path d="M8 28h44v8H8z" fill="${R}"/></g><path d="M14 32h32" stroke="#fff" stroke-width="2" opacity=".7"/>`,
    bread: `<g ${K}><path d="M8 50V30q-4-14 12-16 6-6 12 0 6-6 12 0 16 2 12 16v20z" fill="${T}"/>
      <path d="M8 30q24 6 48 0" fill="none"/><path d="M20 22l4 6M32 20v7M44 22l-4 6" fill="none" stroke-width="2.5"/></g>`,
    head: `<g ${K}><ellipse cx="10" cy="34" rx="4" ry="6" fill="${P}"/><ellipse cx="54" cy="34" rx="4" ry="6" fill="${P}"/>
      <ellipse cx="32" cy="34" rx="22" ry="24" fill="${P}"/><path d="M10 28q2-22 22-22t22 22q-10-10-22-8-12-2-22 8z" fill="${N}"/></g>
      <circle cx="24" cy="34" r="2.5" fill="${I}"/><circle cx="40" cy="34" r="2.5" fill="${I}"/><path d="M26 44q6 5 12 0" fill="none" ${K}/>`,

    // ── 고급 추가 그림 ──
    rock: `<g ${K}><path d="M6 52q-2-14 8-22 4-14 18-14 12 0 18 12 10 6 8 24z" fill="${T}"/>
      <path d="M24 26l4 8-4 6M40 32l-3 6" fill="none" stroke-width="2.5"/></g>${hi(20, 32, 2, 4)}`,
    lock: `<g ${K}><path d="M20 28V18q0-12 12-12t12 12v10" fill="none" stroke-width="5"/><path d="M20 28V18q0-12 12-12t12 12v10" fill="none" stroke="${T}" stroke-width="2"/>
      <rect x="12" y="28" width="40" height="30" rx="5" fill="${Y}"/><path d="M32 38a4 4 0 1 1 0 .1zM32 42v8" fill="${I}"/></g>${hi(18, 36, 2, 5)}`,
    sock: `<g ${K}><path d="M20 4h22v34q0 6-4 10l-8 8q-8 6-14 0t0-14l4-4z" fill="${R}"/><path d="M20 4h22v8H20z" fill="${P}"/>
      <path d="M20 22h22" fill="none" stroke="${P}" stroke-width="4"/></g>`,
    clock: `<g ${K}><circle cx="32" cy="34" r="24" fill="${P}"/><circle cx="32" cy="34" r="24" fill="none" stroke="${B}" stroke-width="5"/>
      <circle cx="32" cy="34" r="26.5" fill="none"/><path d="M32 34V18M32 34l10 6" fill="none" stroke-width="3.5"/>
      <path d="M32 13v3M53 34h-3M32 55v-3M11 34h3" fill="none"/></g><circle cx="32" cy="34" r="2.5" fill="${I}"/>`,
    can: `<g ${K}><path d="M14 14v38q0 6 18 6t18-6V14" fill="${T}"/><path d="M14 22q18 6 36 0v24q-18 6-36 0z" fill="${B}"/>
      <ellipse cx="32" cy="14" rx="18" ry="6" fill="${P}"/></g><path d="M22 32h20M24 38h16" stroke="#fffdf7" stroke-width="3" stroke-linecap="round"/>`,
    cab: `<g ${K}><path d="M24 8h16v8H24z" fill="${P}"/><path d="M4 46V36q0-4 4-5l8-2 8-12h18l10 12h4q4 0 4 4v13z" fill="${Y}"/>
      <path d="M26 20h7v10H20zM37 20h4l8 10H37z" fill="${P}"/><path d="M4 38h56" fill="none" stroke-dasharray="4 4"/>
      <circle cx="18" cy="47" r="7" fill="${N}"/><circle cx="46" cy="47" r="7" fill="${N}"/></g>
      <text x="32" y="15" text-anchor="middle" font-family="Silkscreen,monospace" font-size="6" font-weight="700" fill="#141414">TAXI</text>`,
    pig: `<g ${K}><path d="M14 20l2-12 10 8zM50 20l-2-12-10 8z" fill="${PK}"/><circle cx="32" cy="34" r="22" fill="${PK}"/>
      <ellipse cx="32" cy="40" rx="10" ry="7" fill="${PK}"/></g>
      <circle cx="28" cy="40" r="2" fill="${R}"/><circle cx="36" cy="40" r="2" fill="${R}"/><circle cx="23" cy="28" r="2.5" fill="${I}"/><circle cx="41" cy="28" r="2.5" fill="${I}"/>`,
    wig: `<g ${K}><path d="M28 50h8v6H28zM18 58h28" fill="${T}"/><ellipse cx="32" cy="34" rx="14" ry="16" fill="${T}"/>
      <path d="M14 42q-6-6-2-12-4-8 4-12 0-10 10-10 6-6 12 0 10 0 10 10 8 4 4 12 4 6-2 12-4-8-6-14-8 4-20 2-6 0-10 4-2 4-6 8z" fill="${Y}"/></g>`,
    fig: `<g ${K}><path d="M32 8q4 6 10 12 12 12 6 26-6 12-16 12T16 46q-6-14 6-26 6-6 10-12z" fill="${N}"/>
      <path d="M32 8q2-4 6-4" fill="none"/><path d="M36 8q8-4 14 2-8 4-14-2z" fill="${G}"/></g>
      <path d="M22 40q4 10 10 12" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".7" fill="none"/>`,
    dig: `<g ${K}><path d="M4 56q12-14 28-12t28 12z" fill="${T}"/><path d="M44 6l-12 24" fill="none" stroke-width="5"/>
      <path d="M40 4h10" fill="none" stroke-width="5"/><path d="M26 28l12 6-4 12q-8 4-14-2z" fill="${P}"/></g>
      <g fill="${T}" ${K} stroke-width="2"><circle cx="12" cy="40" r="3"/><circle cx="18" cy="34" r="2.5"/></g>`,

    // ── 중급 추가 (-ug, -ox, -ing) ──
    bug: `<g ${K}><path d="M14 30l-8-4M14 40H5M16 50l-8 4M50 30l8-4M50 40h9M48 50l8 4M26 14l-4-8M38 14l4-8" fill="none" stroke-width="2.5"/>
      <circle cx="32" cy="20" r="9" fill="${N}"/><ellipse cx="32" cy="40" rx="20" ry="18" fill="${R}"/><path d="M32 22v36" fill="none"/></g>
      <g fill="${I}"><circle cx="22" cy="34" r="4"/><circle cx="42" cy="34" r="4"/><circle cx="24" cy="48" r="3.5"/><circle cx="40" cy="48" r="3.5"/></g>${hi(20, 28, 2, 3)}`,
    mug: `<g ${K}><path d="M46 22q12 0 12 12t-12 12" fill="none" stroke-width="5"/><path d="M46 22q12 0 12 12t-12 12" fill="none" stroke="${B}" stroke-width="1.5"/>
      <path d="M12 12h36v38q0 8-8 8H20q-8 0-8-8z" fill="${B}"/></g>
      <path d="M30 40q-8-6-6-10 2-4 6 0 4-4 6 0 2 4-6 10z" fill="${Y}" ${K} stroke-width="2"/>${hi(18, 22, 2, 6)}`,
    rug: `<g ${K}><path d="M10 14h44v36H10z" fill="${R}"/><path d="M18 22h28v20H18z" fill="${Y}"/><path d="M32 26l8 6-8 6-8-6z" fill="${B}"/>
      <path d="M14 50v8M20 50v8M26 50v8M32 50v8M38 50v8M44 50v8M50 50v8M14 14V6M20 14V6M26 14V6M32 14V6M38 14V6M44 14V6M50 14V6" fill="none" stroke-width="2"/></g>`,
    jug: `<g ${K}><path d="M40 22q14-2 14 12t-12 14" fill="none" stroke-width="5"/><path d="M18 8h22l-2 8q12 10 8 30-2 12-14 12t-16-12q-4-20 8-30l-12-4z" fill="${G}"/>
      <path d="M16 30q16 6 30 0" fill="none" stroke-width="2.5"/></g>${hi(22, 36, 2, 6)}`,
    box: `<g ${K}><path d="M8 24l24-10 24 10v28L32 62 8 52z" fill="${T}"/><path d="M8 24l24 10 24-10M32 34v28" fill="none"/>
      <path d="M8 24L2 34l24 10 6-10zM56 24l6 10-24 10-6-10z" fill="${T}"/><path d="M26 22l12-5" fill="none" stroke="${R}" stroke-width="4"/></g>`,
    fox: `<g ${K}><path d="M8 8l14 14h20L56 8l-2 26q-6 20-22 24Q16 54 10 34z" fill="${R}"/>
      <path d="M12 34q8 4 14 0l6 22q-14-2-20-22zM52 34q-8 4-14 0l-6 22q14-2 20-22z" fill="${P}"/></g>
      <circle cx="24" cy="30" r="2.5" fill="${I}"/><circle cx="40" cy="30" r="2.5" fill="${I}"/><path d="M29 50h6l-3 4z" fill="${I}" ${K} stroke-width="2"/>`,
    ox: `<g ${K}><path d="M14 22Q2 20 4 6q6 10 16 10M50 22q12-2 10-16-6 10-16 10" fill="${P}"/>
      <path d="M14 18h36q6 10 0 22l-4 14q-14 8-28 0l-4-14q-6-12 0-22z" fill="${T}"/><ellipse cx="32" cy="48" rx="13" ry="8" fill="${P}"/>
      <path d="M26 54q6 8 12 0" fill="none" stroke="${Y}" stroke-width="3"/></g>
      <circle cx="23" cy="30" r="2.5" fill="${I}"/><circle cx="41" cy="30" r="2.5" fill="${I}"/><circle cx="27" cy="47" r="2" fill="${I}"/><circle cx="37" cy="47" r="2" fill="${I}"/>`,
    socks: `<g ${K}><g transform="translate(-8 2) scale(.82)"><path d="M20 4h22v34q0 6-4 10l-8 8q-8 6-14 0t0-14l4-4z" fill="${B}"/><path d="M20 4h22v8H20z" fill="${P}"/></g>
      <g transform="translate(22 8) scale(.82)"><path d="M20 4h22v34q0 6-4 10l-8 8q-8 6-14 0t0-14l4-4z" fill="${B}"/><path d="M20 4h22v8H20z" fill="${P}"/></g></g>`,
    ring: `<g ${K}><circle cx="32" cy="40" r="17" fill="none" stroke-width="9"/><circle cx="32" cy="40" r="17" fill="none" stroke="${Y}" stroke-width="4"/>
      <path d="M22 18l6-10h8l6 10-10 8z" fill="${B}"/><path d="M22 18h20M28 8l4 18 4-18" fill="none" stroke-width="2"/></g>`,
    king: `<g ${K}><circle cx="32" cy="40" r="17" fill="${P}"/><path d="M14 26l2-18 9 9 7-11 7 11 9-9 2 18z" fill="${Y}"/>
      <path d="M18 46q14 18 28 0q-2 10-14 12-12-2-14-12z" fill="${T}"/></g>
      <circle cx="26" cy="38" r="2.2" fill="${I}"/><circle cx="38" cy="38" r="2.2" fill="${I}"/><circle cx="32" cy="16" r="2.5" fill="${R}"/>`,
    swing: `<g ${K}><path d="M6 58L14 6h36l8 52M14 6h36" fill="none" stroke-width="4"/><path d="M24 6v36M40 6v36" fill="none" stroke-width="2"/>
      <path d="M20 42h24v6H20z" fill="${R}"/></g>`,
    wing: `<g ${K} transform="translate(6 8) scale(.85)"><path d="M8 20q8-14 24-12 22 4 24 24-10-4-16 0 4 8-4 14-4 8-14 8 4-8-2-12-10 6-16 2 6-6 4-12-8 0-12 2 2-10 12-14z" fill="${P}"/>
      <path d="M22 18q12 2 20 14M18 28q10 2 16 10" fill="none" stroke-width="2"/></g>`,

    // ── 고급 추가 (s/th, 첫 자음, 모음) ──
    mouth: `<g ${K}><path d="M4 32q12-14 28-8 16-6 28 8-12 22-28 22T4 32z" fill="${R}"/><path d="M10 32q22 6 44 0q-4 10-22 10T10 32z" fill="${P}"/></g>
      <path d="M18 34v5M26 35v6M34 35v6M42 35v5M50 34v3" stroke="#141414" stroke-width="2"/>`,
    moose: `<g ${K}><path d="M18 22Q4 22 4 8l6 4 2-8 4 8 4-6v12M46 22q14 0 14-14l-6 4-2-8-4 8-4-6v12" fill="${Y}"/>
      <path d="M20 18h24l4 18q0 22-16 22T16 36z" fill="${T}"/><ellipse cx="32" cy="48" rx="12" ry="9" fill="${N}"/></g>
      <circle cx="25" cy="30" r="2.5" fill="${I}"/><circle cx="39" cy="30" r="2.5" fill="${I}"/><circle cx="28" cy="48" r="2" fill="#fff"/><circle cx="36" cy="48" r="2" fill="#fff"/>`,
    moth: `<g ${K}><path d="M30 14q-6-8-12-8M34 14q6-8 12-8" fill="none" stroke-width="2.5"/>
      <path d="M30 22Q12 6 6 18q-2 12 12 16-10 8-4 16 6 6 16-8zM34 22Q52 6 58 18q2 12-12 16 10 8 4 16-6 6-16-8z" fill="${T}"/>
      <ellipse cx="32" cy="32" rx="4" ry="18" fill="${N}"/></g><circle cx="16" cy="20" r="3" fill="${N}"/><circle cx="48" cy="20" r="3" fill="${N}"/>`,
    boat: `<g ${K}><path d="M10 26l-6-12M54 26l6-12" fill="none" stroke-width="3"/><path d="M4 30h56l-8 16H12z" fill="${T}"/>
      <path d="M2 54q5-4 10 0t10 0 10 0 10 0 10 0 10 0" fill="none" stroke="${B}"/></g><path d="M8 36h48" stroke="#141414" stroke-width="2"/>`,
    goat: `<g ${K}><path d="M24 16q-6-12-14-8 8 2 10 10M40 16q6-12 14-8-8 2-10 10" fill="${T}"/><path d="M14 22l-8 4 8 4M50 22l8 4-8 4" fill="${P}"/>
      <path d="M16 18h32q2 18-6 28H22q-8-10-6-28z" fill="${P}"/><path d="M26 46h12l-6 14z" fill="${P}"/></g>
      <circle cx="25" cy="28" r="2.2" fill="${I}"/><circle cx="39" cy="28" r="2.2" fill="${I}"/><path d="M29 38h6" stroke="#141414" stroke-width="2.5" stroke-linecap="round"/>`,
    coat: `<g ${K}><path d="M24 6l8 8 8-8 16 8 4 30-8 2-2-14v28H14V32l-2 14-8-2 4-30z" fill="${B}"/><path d="M24 6l8 16 8-16M32 22v36" fill="none"/></g>
      <g fill="${Y}" ${K} stroke-width="2"><circle cx="36" cy="30" r="2.5"/><circle cx="36" cy="40" r="2.5"/><circle cx="36" cy="50" r="2.5"/></g>`,
    note: `<g ${K}><path d="M26 46V10l26-4v34" fill="none" stroke-width="4"/><path d="M26 10l26-4v8l-26 4z" fill="${I}"/>
      <ellipse cx="18" cy="48" rx="9" ry="7" fill="${N}" transform="rotate(-20 18 48)"/><ellipse cx="44" cy="42" rx="9" ry="7" fill="${N}" transform="rotate(-20 44 42)"/></g>`,
    bell: `<g ${K}><path d="M32 4v6" fill="none"/><path d="M14 46q4-6 4-18 0-16 14-18 14 2 14 18 0 12 4 18z" fill="${Y}"/><path d="M8 46h48v6H8z" fill="${Y}"/>
      <circle cx="32" cy="58" r="4" fill="${R}"/></g>${hi(24, 24, 2, 6)}`,
    ball: `<g ${K}><circle cx="32" cy="32" r="26" fill="${P}"/><path d="M32 6q-14 26 0 52Q46 32 32 6z" fill="${R}"/>
      <path d="M8 22q24 8 48 0M8 42q24-8 48 0" fill="none" stroke="${B}" stroke-width="4"/><circle cx="32" cy="32" r="26" fill="none"/></g>${hi(20, 18, 3, 5)}`,
    bowl: `<g ${K}><path d="M24 22Q20 8 30 4M36 22q-2-14 8-18" fill="none" stroke="${T}" stroke-width="4"/>
      <path d="M8 26q24-8 48 0 0 26-24 28Q8 52 8 26z" fill="${R}"/><path d="M8 26q24 8 48 0-24-10-48 0z" fill="${P}"/><path d="M24 56h16" fill="none" stroke-width="4"/></g>`,
    bull: `<g ${K}><path d="M14 20Q4 22 2 10q8 6 14 4M50 20q10 2 12-10-8 6-14 4" fill="${P}"/>
      <path d="M14 14h36q6 14 0 24l-4 12q-14 8-28 0l-4-12q-6-10 0-24z" fill="${N}"/><ellipse cx="32" cy="46" rx="12" ry="8" fill="${R}"/>
      <path d="M20 22l8 4M44 22l-8 4" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M27 54q5 8 10 0" fill="none" stroke="${Y}" stroke-width="3"/></g>
      <circle cx="24" cy="30" r="2.5" fill="#fff"/><circle cx="40" cy="30" r="2.5" fill="#fff"/><circle cx="28" cy="46" r="2" fill="${I}"/><circle cx="36" cy="46" r="2" fill="${I}"/>`,
  });

  const W = (en, ko) => ({ en, ko });
  // 레벨마다 3묶음(12단어). 같은 단계 안에서는 레벨끼리 단어가 하나도 겹치지 않는다.
  // 중급: 끝소리가 같은 단어 (첫소리만 다름) — [레벨 4, 레벨 5, 레벨 6]
  const MID = [
    [ // 짧고 쉬운 끝소리
      [W('cat', '고양이'), W('hat', '모자'), W('bat', '야구 방망이'), W('rat', '쥐')],
      [W('bug', '벌레'), W('mug', '머그컵'), W('rug', '깔개'), W('jug', '물병')],
      [W('box', '상자'), W('fox', '여우'), W('ox', '황소'), W('socks', '양말')],
    ],
    [
      [W('bee', '벌'), W('key', '열쇠'), W('tea', '차'), W('tree', '나무')],
      [W('car', '자동차'), W('star', '별'), W('jar', '병'), W('guitar', '기타')],
      [W('ring', '반지'), W('king', '왕'), W('swing', '그네'), W('wing', '날개')],
    ],
    [ // 긴 단어가 섞인 끝소리
      [W('cake', '케이크'), W('lake', '호수'), W('snake', '뱀'), W('rake', '갈퀴')],
      [W('moon', '달'), W('spoon', '숟가락'), W('balloon', '풍선'), W('raccoon', '너구리')],
      [W('bed', '침대'), W('sled', '썰매'), W('bread', '빵'), W('head', '머리')],
    ],
  ];
  // 고급: 최소 대립쌍 (소리 하나만 다름) — [레벨 7, 레벨 8, 레벨 9]
  const HARD = [
    [ // 첫 자음이 다름
      [W('pig', '돼지'), W('wig', '가발'), W('fig', '무화과'), W('dig', '땅을 파다')],
      [W('boat', '보트'), W('goat', '염소'), W('coat', '외투'), W('note', '음표')],
      [W('bear', '곰'), W('pear', '배(과일)'), W('hair', '머리카락'), W('chair', '의자')],
    ],
    [ // 끝 자음·모음이 다름
      [W('cap', '야구 모자'), W('cat', '고양이'), W('can', '깡통'), W('cab', '택시')],
      [W('bell', '종'), W('ball', '공'), W('bowl', '그릇'), W('bull', '황소')],
      [W('ship', '배'), W('sheep', '양'), W('chip', '감자칩'), W('chick', '병아리')],
    ],
    [ // 한국 학생이 특히 헷갈리는 소리: f·p·v / r·l / s·th
      [W('fan', '선풍기'), W('pan', '프라이팬'), W('van', '승합차'), W('man', '남자')],
      [W('rock', '바위'), W('lock', '자물쇠'), W('sock', '양말'), W('clock', '시계')],
      [W('mouse', '생쥐'), W('mouth', '입'), W('moose', '무스(큰 사슴)'), W('moth', '나방')],
    ],
  ];

  // ── 초급 전용 그림 (중급·고급과 겹치지 않는 새 단어, 초등 3~6학년) ──
  Object.assign(PICS, {
    // 레벨 1
    apple: `<g ${K}><path d="M32 18c-4-4-20-4-20 12 0 14 10 24 20 20 10 4 20-6 20-20 0-16-16-16-20-12z" fill="${R}"/>
      <path d="M32 18q0-6 4-10" fill="none"/><path d="M35 12q6-7 14-5-4 7-14 5z" fill="${G}"/></g>${hi(20, 28, 3, 6)}`,
    egg: `<g ${K}><path d="M10 34q-4-14 10-18 6-10 18-6 14-2 16 12 8 10-2 18-8 10-22 8Q8 50 10 34z" fill="${P}"/><circle cx="32" cy="32" r="10" fill="${Y}"/></g>${hi(28, 28, 2.5, 3)}`,
    dog: `<g ${K}><path d="M14 14q-10 4-8 22 4 4 10-2M50 14q10 4 8 22-4 4-10-2" fill="${N}"/>
      <path d="M16 16q16-10 32 0 6 20-4 34-12 8-24 0-10-14-4-34z" fill="${T}"/><ellipse cx="32" cy="42" rx="10" ry="8" fill="${P}"/>
      <path d="M28 37h8l-4 4z" fill="${I}"/><path d="M32 48q-3 5 0 7 3-2 0-7z" fill="${R}" stroke-width="2"/></g>
      <circle cx="25" cy="28" r="2.5" fill="${I}"/><circle cx="39" cy="28" r="2.5" fill="${I}"/>`,
    sun: `<g ${K}><path d="M32 2v10M32 52v10M2 32h10M52 32h10M11 11l7 7M46 46l7 7M11 53l7-7M46 18l7-7" fill="none" stroke-width="4"/>
      <circle cx="32" cy="32" r="15" fill="${Y}"/></g><circle cx="27" cy="30" r="2" fill="${I}"/><circle cx="37" cy="30" r="2" fill="${I}"/>
      <path d="M27 36q5 4 10 0" fill="none" ${K} stroke-width="2.5"/>`,
    book: `<g ${K}><path d="M14 8h36v48H14z" fill="${B}"/><path d="M18 12h28v8H18z" fill="${Y}"/><path d="M14 56q-4 0-4-4V12q0-4 4-4" fill="${P}"/>
      <path d="M14 8v48" fill="none"/></g><path d="M22 30h20M22 36h14" stroke="#fffdf7" stroke-width="3" stroke-linecap="round"/>`,
    milk: `<g ${K}><path d="M18 22l6-12h16l6 12v36H18z" fill="${P}"/><path d="M24 10h16l-2-6H26z" fill="${B}"/><path d="M18 22h28" fill="none"/>
      <path d="M18 34h28v14H18z" fill="${B}"/></g><text x="32" y="45" text-anchor="middle" font-family="Silkscreen,monospace" font-size="8" font-weight="700" fill="#fffdf7">MILK</text>`,
    duck: `<g ${K}><path d="M8 38q0 16 24 16t24-12q0-8-8-8H30q-2-6 2-12" fill="${Y}"/><circle cx="30" cy="18" r="10" fill="${Y}"/>
      <path d="M38 18l12 2-10 6z" fill="${R}"/><path d="M22 42q10 6 20 0" fill="none" stroke-width="2.5"/></g><circle cx="31" cy="15" r="2.2" fill="${I}"/>
      <path d="M4 60q6-4 12 0t12 0 12 0 12 0 12 0" fill="none" stroke="${B}" stroke-width="3"/>`,
    fish: `<g ${K}><path d="M46 32l14-14v28z" fill="${B}"/><path d="M6 32q14-20 40-6 4 6 0 12Q20 52 6 32z" fill="${B}"/>
      <path d="M28 20q6-8 12-2" fill="${B}"/><path d="M30 26q4 6 0 12" fill="none" stroke-width="2.5"/></g><circle cx="16" cy="30" r="3" fill="#fff" ${K} stroke-width="2"/>`,
    lion: `<g ${K}><path d="M32 4l6 6 8-2 2 8 8 2-2 8 6 6-6 6 2 8-8 2-2 8-8-2-6 6-6-6-8 2-2-8-8-2 2-8-6-6 6-6-2-8 8-2 2-8 8 2z" fill="${R}"/>
      <circle cx="32" cy="34" r="16" fill="${Y}"/><path d="M28 38h8l-4 4z" fill="${I}"/><path d="M32 42q-4 4-7 2M32 42q4 4 7 2" fill="none" stroke-width="2"/></g>
      <circle cx="26" cy="30" r="2.2" fill="${I}"/><circle cx="38" cy="30" r="2.2" fill="${I}"/>`,
    hand: `<g ${K}><path d="M20 58V34l-8-10q-2-4 2-6t6 2l4 6V10q0-4 4-4t4 4v18-22q0-4 4-4t4 4v22-16q0-4 4-4t4 4v18-10q0-4 4-4t3 4v22q0 14-10 20z" fill="${P}"/></g>`,
    pencil: `<g ${K}><path d="M12 44L44 12l8 8-32 32z" fill="${Y}"/><path d="M12 44l-6 14 14-6z" fill="${T}"/><path d="M6 58l3-6 3 3z" fill="${I}"/>
      <path d="M44 12l4-4q3-3 6 0l2 2q3 3 0 6l-4 4z" fill="${R}"/><path d="M18 46L48 16" fill="none" stroke-width="2"/></g>`,
    house: PICS.house,

    // 레벨 2
    tiger: `<g ${K}><circle cx="14" cy="14" r="7" fill="${Y}"/><circle cx="50" cy="14" r="7" fill="${Y}"/><path d="M8 32q0-22 24-22t24 22q0 24-24 24T8 32z" fill="${Y}"/>
      <path d="M32 10v8M24 12l2 7M40 12l-2 7M8 30h8M8 38h7M56 30h-8M56 38h-7" fill="none" stroke-width="3.5"/>
      <ellipse cx="32" cy="42" rx="10" ry="8" fill="${P}"/><path d="M28 38h8l-4 4z" fill="${I}"/></g>
      <circle cx="24" cy="30" r="2.5" fill="${I}"/><circle cx="40" cy="30" r="2.5" fill="${I}"/>`,
    rabbit: `<g ${K}><path d="M20 30Q12 4 22 4t8 26M44 30q8-26-2-26t-8 26" fill="${P}"/><path d="M22 26q-4-14 0-18M42 26q4-14 0-18" fill="none" stroke="${R}" stroke-width="2.5"/>
      <ellipse cx="32" cy="42" rx="18" ry="16" fill="${P}"/><path d="M29 44h6l-3 3z" fill="${R}"/></g>
      <circle cx="25" cy="38" r="2.5" fill="${I}"/><circle cx="39" cy="38" r="2.5" fill="${I}"/>`,
    frog: `<g ${K}><circle cx="20" cy="18" r="9" fill="${G}"/><circle cx="44" cy="18" r="9" fill="${G}"/><path d="M6 40q0-18 26-18t26 18q0 16-26 16T6 40z" fill="${G}"/>
      <path d="M18 42q14 10 28 0" fill="none"/></g><circle cx="20" cy="18" r="4" fill="#fff"/><circle cx="44" cy="18" r="4" fill="#fff"/>
      <circle cx="21" cy="18" r="2" fill="${I}"/><circle cx="45" cy="18" r="2" fill="${I}"/>`,
    horse: `<g ${K}><path d="M44 6l-4 10q-14 0-22 14L8 44q-2 6 4 8l8-2 6-8q6 2 10 0l4 18h14l-2-26q2-14-6-22z" fill="${T}"/>
      <path d="M44 6q12 8 10 28l-4-2q2-14-8-20z" fill="${N}"/><path d="M40 8l2-6 4 6" fill="${T}"/></g>
      <circle cx="30" cy="26" r="2.5" fill="${I}"/><circle cx="13" cy="46" r="1.8" fill="${I}"/>`,
    umbrella: `<g ${K}><path d="M32 30v22q0 6-6 6t-6-6" fill="none" stroke-width="4"/><path d="M4 32Q6 6 32 6t28 26q-7-6-14 0-7-6-14 0-7-6-14 0-7-6-14 0z" fill="${R}"/>
      <path d="M32 6q-10 10-10 26M32 6q10 10 10 26" fill="none" stroke-width="2"/></g>`,
    flower: `<g ${K}><path d="M32 40v20M32 52q-12-8-16-2 8 6 16 2z" fill="${G}"/>
      <g fill="${R}"><circle cx="32" cy="12" r="9"/><circle cx="46" cy="22" r="9"/><circle cx="41" cy="38" r="9"/><circle cx="23" cy="38" r="9"/><circle cx="18" cy="22" r="9"/></g>
      <circle cx="32" cy="26" r="8" fill="${Y}"/></g>`,
    banana: `<g ${K}><path d="M50 8l4 4q4 26-18 40-12 6-26 2l-2-4q16 2 28-8 14-14 10-30z" fill="${Y}"/><path d="M50 8l4-4 3 3-3 5z" fill="${T}"/>
      <path d="M48 16q2 20-14 32" fill="none" stroke-width="2"/></g>`,
    carrot: `<g ${K}><path d="M30 18q-10 0-14 10L8 56q4 4 8 0l22-26q6-10-8-12z" fill="${R}"/>
      <path d="M34 16q4-12 14-12-2 10-12 14zM36 20q10-4 20 0-8 8-18 4z" fill="${G}"/><path d="M18 34l6 3M14 44l5 2" fill="none" stroke-width="2"/></g>`,
    train: `<g ${K}><path d="M14 10h10v12H14z" fill="${N}"/><path d="M8 22h30v24H8z" fill="${B}"/><path d="M38 14h18v32H38z" fill="${R}"/>
      <path d="M42 20h10v10H42z" fill="${P}"/><path d="M4 46h56" fill="none"/>
      <circle cx="16" cy="50" r="6" fill="${N}"/><circle cx="32" cy="50" r="6" fill="${N}"/><circle cx="48" cy="50" r="6" fill="${N}"/></g>`,
    bike: `<g ${K}><circle cx="14" cy="42" r="11" fill="none"/><circle cx="50" cy="42" r="11" fill="none"/>
      <path d="M14 42l12-20h18l6 20M26 22l8 20h-20M34 42l10-20M22 18h10M44 22l-2-8h6" fill="none" stroke="${R}" stroke-width="4"/>
      <path d="M14 42l12-20h18l6 20M26 22l8 20h-20M34 42l10-20" fill="none" stroke-width="1"/></g>`,
    shoes: `<g ${K}><path d="M4 30q4-2 6-8h10q2 6 10 8l8 4q4 4 0 8H4z" fill="${B}"/><path d="M4 42h34v4H4z" fill="${P}"/>
      <path d="M26 42q4-2 6-8h10q2 6 10 8l8 4q4 4 0 8H26z" fill="${B}"/><path d="M26 54h34v4H26z" fill="${P}"/></g>`,
    window: `<g ${K}><path d="M10 8h44v44H10z" fill="${B}"/><path d="M16 14h14v14H16zM34 14h14v14H34zM16 32h14v14H16zM34 32h14v14H34z" fill="${P}"/>
      <path d="M6 52h52v6H6z" fill="${T}"/></g><path d="M19 17l6 6M37 17l6 6" stroke="#fff" opacity=".8" stroke-width="2"/>`,

    // 레벨 3
    elephant: `<g ${K}><path d="M20 18Q2 14 4 32q2 14 16 10M44 18q18-4 16 14-2 14-16 10" fill="${T}"/>
      <path d="M18 24q0-16 14-16t14 16q0 10-6 16v8q0 10 6 12-8 2-12-6V42h-4q-12-4-12-18z" fill="${T}"/></g>
      <circle cx="25" cy="26" r="2.5" fill="${I}"/><circle cx="39" cy="26" r="2.5" fill="${I}"/>`,
    dolphin: `<g ${K}><path d="M6 44q8-30 36-30 10 0 16 6l-8 2q2 10-4 18 6 2 8 10-10 0-14-6-14 6-28 0z" fill="${B}"/>
      <path d="M30 16l6-10 4 10" fill="${B}"/><path d="M24 34q8 4 18 0" fill="none" stroke-width="2"/></g><circle cx="46" cy="22" r="2.2" fill="#fff"/>
      <path d="M2 56q6-4 12 0t12 0 12 0 12 0 12 0" fill="none" stroke="${B}" stroke-width="3"/>`,
    penguin: `<g ${K}><path d="M24 56l-6 4h10zM40 56l6 4H36z" fill="${Y}"/><path d="M32 4q16 0 18 22 2 24-6 30H20q-8-6-6-30Q16 4 32 4z" fill="${N}"/>
      <path d="M32 18q12 2 12 18t-12 20q-12-2-12-20t12-18z" fill="${P}"/><path d="M28 18h8l-4 6z" fill="${Y}"/></g>
      <circle cx="26" cy="13" r="2.5" fill="#fff"/><circle cx="38" cy="13" r="2.5" fill="#fff"/>`,
    giraffe: `<g ${K}><path d="M36 10l-2-6M44 10l2-6" fill="none"/><path d="M30 12q10-6 20 0 4 6-2 10l-6 2-2 34H26l2-36q-6-4 2-10z" fill="${Y}"/>
      <path d="M48 18q6 2 6 6l-8 0z" fill="${Y}"/></g><g fill="${T}" ${K} stroke-width="2"><circle cx="32" cy="34" r="3"/><circle cx="35" cy="44" r="3"/><circle cx="31" cy="52" r="2.5"/><circle cx="38" cy="26" r="2.5"/></g>
      <circle cx="42" cy="14" r="2.2" fill="${I}"/>`,
    computer: `<g ${K}><path d="M6 8h52v34H6z" fill="${N}"/><path d="M11 13h42v24H11z" fill="${B}"/><path d="M26 42h12v8H26z" fill="${T}"/>
      <path d="M8 54h48l2 6H6z" fill="${P}"/></g><path d="M16 20h18M16 26h24M16 32h12" stroke="#fffdf7" stroke-width="2.5" stroke-linecap="round"/>`,
    camera: `<g ${K}><path d="M22 14l4-6h12l4 6" fill="${N}"/><rect x="6" y="14" width="52" height="38" rx="5" fill="${N}"/>
      <circle cx="32" cy="33" r="13" fill="${P}"/><circle cx="32" cy="33" r="8" fill="${B}"/><path d="M46 20h6v5h-6z" fill="${Y}"/></g>${hi(29, 30, 2, 3)}`,
    rainbow: `<g ${K}><path d="M4 48a28 28 0 0 1 56 0h-8a20 20 0 0 0-40 0z" fill="${R}"/><path d="M12 48a20 20 0 0 1 40 0h-7a13 13 0 0 0-26 0z" fill="${Y}"/>
      <path d="M19 48a13 13 0 0 1 26 0h-7a6 6 0 0 0-12 0z" fill="${G}"/>
      <path d="M2 54q0-8 8-8 4-6 10 0 6 0 6 8zM38 54q0-8 8-8 4-6 10 0 6 0 6 8z" fill="${P}"/></g>`,
    volcano: `<g ${K}><path d="M26 14q-6-4-2-10 6 0 6 6 4-6 10-2 2 6-4 8" fill="${P}" stroke-width="2.5"/>
      <path d="M4 58l18-36h20l18 36z" fill="${T}"/><path d="M22 22h20l-4 8-3-4-3 10-3-8-3 4z" fill="${R}"/></g>`,
    robot: `<g ${K}><path d="M32 4v6" fill="none"/><circle cx="32" cy="4" r="2.5" fill="${R}"/><rect x="16" y="10" width="32" height="22" rx="4" fill="${P}"/>
      <rect x="12" y="34" width="40" height="24" rx="4" fill="${B}"/><path d="M6 38v14M58 38v14" fill="none" stroke-width="4"/>
      <path d="M24 26h16" fill="none"/><rect x="26" y="40" width="12" height="8" rx="2" fill="${Y}"/></g>
      <circle cx="25" cy="19" r="3" fill="${B}"/><circle cx="39" cy="19" r="3" fill="${B}"/>`,
    rocket: `<g ${K}><path d="M24 50q-6 8 8 12 14-4 8-12" fill="${Y}"/><path d="M22 36L10 50l14-2M42 36l12 14-14-2" fill="${R}"/>
      <path d="M32 4q12 10 10 44H22Q20 14 32 4z" fill="${P}"/><circle cx="32" cy="24" r="6" fill="${B}"/></g>${hi(28, 16, 1.5, 4)}`,
    pumpkin: `<g ${K}><path d="M32 16q2-8 8-10" fill="none" stroke="${G}" stroke-width="5"/><path d="M32 16q2-8 8-10" fill="none" stroke-width="1"/>
      <ellipse cx="32" cy="38" rx="26" ry="20" fill="${R}"/><path d="M32 18q-10 20 0 40M32 18q10 20 0 40M18 22q-8 16 0 32M46 22q8 16 0 32" fill="none" stroke-width="2.5"/></g>`,
    sandwich: `<g ${K}><path d="M6 46L32 10l26 36z" fill="${T}"/><path d="M8 46h48l-2 6H10z" fill="${G}"/><path d="M10 52h44v4H10z" fill="${R}"/>
      <path d="M10 56h44l-4 4H14z" fill="${T}"/><path d="M14 40l18-24 18 24" fill="none" stroke="${Y}" stroke-width="3"/></g>`,
  });

  // 초급: 레벨마다 서로 다른 12단어 (소리가 확실히 다른 단어끼리 카드로 나온다) — [레벨 1, 레벨 2, 레벨 3]
  const EASY = [
    [W('apple', '사과'), W('egg', '달걀'), W('dog', '개'), W('sun', '해'), W('book', '책'), W('milk', '우유'),
      W('duck', '오리'), W('fish', '물고기'), W('lion', '사자'), W('hand', '손'), W('pencil', '연필'), W('house', '집')],
    [W('tiger', '호랑이'), W('rabbit', '토끼'), W('frog', '개구리'), W('horse', '말'), W('umbrella', '우산'), W('flower', '꽃'),
      W('banana', '바나나'), W('carrot', '당근'), W('train', '기차'), W('bike', '자전거'), W('shoes', '신발'), W('window', '창문')],
    [W('elephant', '코끼리'), W('dolphin', '돌고래'), W('penguin', '펭귄'), W('giraffe', '기린'), W('computer', '컴퓨터'), W('camera', '카메라'),
      W('rainbow', '무지개'), W('volcano', '화산'), W('robot', '로봇'), W('rocket', '로켓'), W('pumpkin', '호박'), W('sandwich', '샌드위치')],
  ];

  window.LISTEN_WORDS = { easy: EASY, mid: MID, hard: HARD };
  window.listenPic = (en) => `<svg viewBox="0 0 64 64" aria-hidden="true">${PICS[en] || ''}</svg>`;
})();
