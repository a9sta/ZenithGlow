import { esc, hash, shuffle, won, josa } from './util.mjs';
import { frame, callBox } from './html.mjs';
import { ANCHOR, FAQ_POOL, STEP_SETS, NOTICE, SEC, COURSE_ANCHOR, DOC_LINKS, CLS_ORDER, clsName, fk, fa, fb } from '../content/copy.mjs';

const at = (h, arr, slot = 0) => arr[parseInt(h.substr((slot * 3) % 29, 3), 16) % arr.length];

/* ── 열 칸 막대 — 땅을 긴 방향으로 자른 열 토막의 몫 ────────────
   x 가 없는 곳(서브 지역 시도)에서는 부르지 않는다. */
export function stripProfile(x, { mini = false } = {}) {
  const top = Math.max(...x.s) || 1;
  const cols = x.s.map((v, i) => {
    const cls = i === x.w ? ' class="on"' : i === x.t ? ' class="th"' : '';
    return `<i${cls} style="height:${Math.max(4, Math.round((v / top) * 100))}%"><b>${v.toFixed(1)}</b></i>`;
  }).join('');
  const label = `열 토막 몫 ${x.s.map((v) => v.toFixed(1)).join(', ')} (퍼센트)`;
  if (mini) return `<div class="zn-pf zn-pf-mini" role="img" aria-label="${esc(label)}"><div class="zn-pf-c">${cols}</div></div>`;
  return `<figure class="zn-pf" role="img" aria-label="${esc(label)}"><div class="zn-pf-c">${cols}</div>
<figcaption class="zn-pf-cap"><span>첫 토막</span><span>긴 방향 ${esc(fk(x.len))}</span><span>열째 토막</span></figcaption></figure>`;
}

/* ── 예약 문의 띠 ───────────────────────────────────────────── */
export function hailStrip(cfg, place, seedKey) {
  const h = hash(seedKey, 'hs');
  const lines = [
    `${place}에서 필요한 것은 주소 한 줄과 고른 코스뿐이다. 나머지는 받는 중에 묻는다.`,
    `${place}${josa(place, '으로/로')} 나갈 수 있는 시각은 통화하는 동안 바로 답한다.`,
    `창구는 지역마다 나뉘어 있지 않다. ${place} 접수도 같은 번호가 받는다.`,
    `${place} 방문은 코스와 시각만 정하면 끝난다. 길게 설명할 것이 없다.`,
  ];
  return `<section class="zn-hail" aria-label="${esc(place)} 예약 문의">
  <p class="zn-hail-p">${esc(at(h, lines))}<span>${esc(at(h, SEC.askTail, 2).replace('@A', cfg.arrive).replace('@H', cfg.hours).replace('@P', cfg.pay))}</span></p>
  ${callBox(cfg, { size: 'l' })}
</section>`;
}

/* ── 코스 = 길이대로 늘인 막대 ─────────────────────────────────
   ★안내문마다 아홉 가지를 통째로 되풀이하면 그 덩어리가 본문에서 가장 커진다.
     동·시군구에서는 시드로 고른 셋만 보이고 나머지는 코스 안내문으로 보낸다. */
export function courseRoll(courses, seedKey, place, num = '01', { full = true } = {}) {
  const h = hash(seedKey, 'cr');
  const all = courses.map((c) => c.min);
  const lo = Math.min(...all), hi = Math.max(...all);
  const show = full ? courses : shuffle(courses.slice(), h).slice(0, 3);
  const withText = new Set(shuffle(show.map((c) => c.slug), h).slice(0, full ? 2 : 1));
  const rows = show.map((c) => {
    const line = at(hash(seedKey, c.slug), c.lines);
    const r = hi === lo ? 1 : ((c.min - lo) / (hi - lo)).toFixed(2);
    return `<li><a href="/course/${c.slug}/" style="--r:${r}"><span class="zn-cb-bar"><span>${esc(c.ko)}</span><em>${c.min}분</em></span><span class="zn-cb-p">${won(c.price)}원</span></a>${withText.has(c.slug) ? `<small>${esc(line)}</small>` : ''}</li>`;
  }).join('\n');
  const short = [
    `${place}에서 통화로 자주 나오는 셋만 걸었다. 나머지 여섯은 <a href="/course/">코스 쪽</a>에, 숫자는 <a href="/price/">비용 쪽</a>에 있다.`,
    `길이나 세기가 맞지 않으면 <a href="/course/">아홉 코스 전체</a>를 펼치면 된다. 값은 어디서나 <a href="/price/">한 장</a>이다.`,
    `${place}에서도 아홉 코스를 모두 고를 수 있다. <a href="/course/">전부 보기</a>, <a href="/price/">값만 보기</a>.`,
  ];
  const tail = full ? `${esc(at(h, SEC.courseTail, 2))} ${at(h, SEC.courseLink, 5)}` : at(h, short, 4);
  return frame('course', 'courses', full ? `${esc(place)}에서 고를 수 있는 아홉 코스` : `${esc(place)}에서 먼저 보는 코스 셋`,
    `<ul class="zn-cb">\n${rows}\n</ul>\n<p class="zn-sec-x">막대가 길수록 오래 받는 코스이다. ${tail}</p>`,
    esc(at(h, SEC.courseSub, 1)), num);
}

/* ── 접수 흐름 = 화살표 다섯 칸 ────────────────────────────── */
export function stepSet(seedKey) {
  return at(hash(seedKey, 'st'), STEP_SETS);
}
export function stepCards(seedKey, num = '04') {
  const h = hash(seedKey, 'st');
  const steps = at(h, STEP_SETS);
  return frame('step', 'order', esc(at(h, SEC.stepTitle, 1)),
    `<ol class="zn-ch">\n${steps.map((s, i) => `<li><span class="zn-ch-t"><i>${i + 1}</i>${esc(s.t)}</span><p>${esc(s.d)}</p></li>`).join('\n')}\n</ol>`,
    esc(at(h, SEC.stepSub, 2)), num);
}

/* ── 이름 · 값 두 칸 — rows: [라벨, 값(HTML)] ───────────────── */
export function statTiles(rows) {
  return `<dl class="zn-kv">\n${rows.map((r) => `<div><dt>${esc(r[0])}</dt><dd>${r[1]}</dd></div>`).join('\n')}\n</dl>`;
}

/* ── 자주 묻는 것 — 접히는 상자. 질문은 h3 ───────────────────── */
export function faqBlock(seedKey, c, n = 5, num = '05') {
  const h = hash(seedKey, 'fq');
  const idx = shuffle(FAQ_POOL.map((_, i) => i), h).slice(0, n);
  const qa = idx.map((i) => {
    const item = FAQ_POOL[i];
    const av = item.a[parseInt(hash(seedKey, 'av', i).substr(0, 3), 16) % item.a.length];
    return { q: item.q(c), a: av(c) };
  });
  const html = frame('faq', 'asked', esc(at(h, SEC.faqTitle, 3)),
    `<div class="zn-asks asks">\n${qa.map((x, i) => `<details class="zn-q"${i === 0 ? ' open' : ''}><summary><h3>${esc(x.q)}</h3></summary><p>${esc(x.a)}</p></details>`).join('\n')}\n</div>`,
    esc(at(h, SEC.faqSub, 4)), num);
  return { html, qa };
}

/* ── 안내/주의 — 작은 카드 두 줄 ──────────────────────────────── */
export function noticeBlock(seedKey, num) {
  const h = hash(seedKey, 'nt');
  const items = shuffle(NOTICE, h).slice(0, 4);
  return frame('notice', 'mind', esc(at(h, SEC.noticeTitle, 5)),
    `<ul class="zn-nt">\n${items.map((t) => `<li>${esc(t)}</li>`).join('\n')}\n</ul>`, null, num);
}

/* ── 롱테일 링크 — 화살표 목록 ────────────────────────────────── */
export function longtail(pool, seedKey, n, label, heading, sub, num) {
  const h = hash(seedKey, 'lt');
  const picked = shuffle(pool, h).slice(0, n);
  const items = picked.map((p) => {
    const tpl = ANCHOR[parseInt(hash(seedKey, p.label).substr(0, 3), 16) % ANCHOR.length];
    return `<li><a href="${p.href}">${esc(tpl(p.label))}</a></li>`;
  }).join('');
  return frame('longtail', label, heading, `<ul class="zn-lk">${items}</ul>`, sub || esc(at(h, SEC.ltSub, 6)), num);
}

/* ── 롱테일 주제 묶음 — 이름표 붙은 상자마다 화살표 목록 ─────────── */
export function topicLinks(groups, seedKey, num, heading, sub) {
  const h = hash(seedKey, 'tp');
  const body = groups.filter((g) => g.items && g.items.length).map((g, gi) => {
    const picked = (g.pick ? shuffle(g.items, hash(seedKey, 'tp', gi)) : g.items).slice(0, g.pick || g.items.length);
    const li = picked.map((p) => {
      const base = p.labels ? p.labels[parseInt(hash(seedKey, p.href).substr(0, 3), 16) % p.labels.length] : p.label;
      const tpl = g.anchor ? g.anchor[parseInt(hash(seedKey, g.label, base).substr(0, 3), 16) % g.anchor.length] : null;
      return `<li><a href="${p.href}">${esc(tpl ? tpl(base) : base)}</a></li>`;
    }).join('');
    return `<div class="zn-rt">
      <p class="zn-rt-h">${esc(g.label)}</p>
      <ul class="zn-lk">${li}</ul>
    </div>`;
  }).join('\n');
  return frame('topic', 'ways in', heading, `<div class="zn-rts">${body}</div>`,
    sub || esc(at(h, SEC.ltSub, 6)), num);
}

/* ── 풀 ──────────────────────────────────────────────────────── */
export function spotPool(regions, { sidoLabel = false, skipGu = '' } = {}) {
  const out = [];
  for (const r of regions) if (r.main) for (const g of r.gu) {
    if (skipGu && `${r.slug}/${g.slug}` === skipGu) continue;
    for (const s of g.spots) out.push({ href: `/${r.slug}/${g.slug}/${s.slug}/`, label: `${sidoLabel ? `${r.name} ` : ''}${g.name} ${s.name}`, u: s });
  }
  return out;
}
export function guPool(regions, { sidoLabel = false, skip = '' } = {}) {
  const out = [];
  for (const r of regions) for (const g of r.gu) {
    if (skip && `${r.slug}/${g.slug}` === skip) continue;
    out.push({ href: `/${r.slug}/${g.slug}/`, label: `${sidoLabel ? `${r.name} ` : ''}${g.name}`, u: g });
  }
  return out;
}

/* ── 꼴로 묶은 칸 ─────────────────────────────────────────────── */
const CLS_HEAD = {
  dumbbell: '양끝이 두껍고 가운데가 패인', waist: '두툼한 곳 사이가 꺼진', wedge: '한쪽으로 몰려 좁아지는',
  head: '앞쪽 토막이 큰', belly: '배가 나온', spindle: '가운데만 부푼', even: '폭이 고른',
};
function themeDefs(noun) {
  const defs = CLS_ORDER.map((k) => ({
    k: `c${k}`, t: `${CLS_HEAD[k]} ${noun}`, f: (u) => u.cls === k,
    sort: k === 'dumbbell' || k === 'waist' ? (a, b) => a.a - b.a : (a, b) => b.a - a.a,
    m: (u) => `허리값 ${fa(u.a)}`,
  }));
  defs.push({ k: 'ahigh', t: `가운데가 꽉 찬 ${noun}`, f: () => true, sort: (a, b) => b.a - a.a, m: (u) => `허리값 ${fa(u.a)}` });
  defs.push({ k: 'alow', t: `가운데가 유난히 잘록한 ${noun}`, f: () => true, sort: (a, b) => a.a - b.a, m: (u) => `허리값 ${fa(u.a)}` });
  defs.push({ k: 'bhigh', t: `한 토막에 땅이 몰린 ${noun}`, f: () => true, sort: (a, b) => b.b - a.b, m: (u) => `큰 토막 ${fb(u.b)}%` });
  defs.push({ k: 'blow', t: `열 토막 폭이 가지런한 ${noun}`, f: () => true, sort: (a, b) => a.b - b.b, m: (u) => `큰 토막 ${fb(u.b)}%` });
  defs.push({ k: 'lenlong', t: `긴 방향으로 멀리 뻗은 ${noun}`, f: (u) => !!u.x, sort: (a, b) => b.x.len - a.x.len, m: (u) => `길이 ${fk(u.x.len)}` });
  defs.push({ k: 'lenshort', t: `긴 방향이 짧게 끝나는 ${noun}`, f: (u) => !!u.x, sort: (a, b) => a.x.len - b.x.len, m: (u) => `길이 ${fk(u.x.len)}` });
  return defs;
}

export function themeCards({ pool, noun, seedKey, num, heading, sub, cards = 4, per = 4, prefer = [] }) {
  const defs = themeDefs(noun).map((d) => ({ ...d, c: pool.filter((x) => d.f(x.u)) })).filter((d) => d.c.length >= per);
  if (!defs.length) return { html: '', list: [] };
  const order = shuffle(defs, hash(seedKey, 'tc'));
  const first = prefer.map((k) => order.find((d) => d.k === k)).filter(Boolean);
  const chosen = [...first, ...order.filter((d) => !first.includes(d))].slice(0, cards);
  const list = [];
  const body = chosen.map((d) => {
    const win = d.c.slice().sort((a, b) => d.sort(a.u, b.u) || a.label.localeCompare(b.label, 'ko')).slice(0, per * 3);
    const pick = shuffle(win, hash(seedKey, 'tc', d.k)).slice(0, per).sort((a, b) => d.sort(a.u, b.u) || a.label.localeCompare(b.label, 'ko'));
    for (const x of pick) list.push({ name: x.label, href: x.href });
    return `<div class="zn-tc"><h3>${esc(d.t)}</h3><ul>${pick.map((x) => `<li><a href="${x.href}">${esc(x.label)}</a><b>${esc(d.m(x.u))}</b></li>`).join('')}</ul></div>`;
  }).join('\n');
  return { html: frame('theme', 'by shape', heading, `<div class="zn-tcs">${body}</div>`, sub, num), list };
}

/** 코스 묶음 — 시도별 코스 안내문으로 가는 롱테일. */
export function courseTopic(sd, courses) {
  return courses.map((c) => ({ label: `${sd.name} ${c.ko}`, href: `/${sd.slug}/course/${c.slug}/` }));
}

/* ── 같은 시군구 안에서 허리가 가까운 동 ───────────────────────── */
export function shapeKin(sd, g, s, seedKey, num) {
  const pool = g.spots.filter((x) => x.slug !== s.slug);
  if (!pool.length) return '';
  const rank = (o) => (o.cls === s.cls ? 0 : 1);
  const sorted = pool.slice().sort((a, b) => rank(a) - rank(b) || Math.abs(a.a - s.a) - Math.abs(b.a - s.a) || a.name.localeCompare(b.name, 'ko'));
  const pick = sorted.slice(0, 8);
  return frame('kin', 'near shape', `${esc(g.name)} 안에서 허리값이 ${esc(s.name)}에 가까운 동`,
    `<ul class="zn-chips">\n${pick.map((x) => `<li><a href="/${sd.slug}/${g.slug}/${x.slug}/">${esc(x.name)}<b>${fa(x.a)}</b></a></li>`).join('\n')}\n</ul>`,
    esc(at(hash(seedKey, 'lk'), SEC.kinSub)), num);
}

/* ── 시군구 안의 동 목록 — 이름 옆 허리값 막대 ──────────────────── */
export function spotIndex(sd, g, seedKey, currentSlug, num) {
  const list = g.spots.slice().sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  const body = list.map((s) => `<li><a href="/${sd.slug}/${g.slug}/${s.slug}/"${s.slug === currentSlug ? ' aria-current="page"' : ''}><span>${esc(s.name)}</span><s><i style="width:${Math.max(2, Math.round(s.a))}%"></i></s><b>${fa(s.a)}</b></a></li>`).join('\n');
  return frame('spotidx', 'places', `${esc(g.name)}의 동 ${g.spotCount}곳과 허리값`,
    `<ul class="zn-bl">\n${body}\n</ul>`,
    esc(at(hash(seedKey, 'sx'), SEC.spotIdxSub)), num);
}

/* ── 시군구 안의 읍·면 목록 ────────────────────────────────────
   ★읍은 2026-10-13 지시로 안내문을 내지 않는다. 면과 함께 이름만 올린다. */
export function ruralList(g, seedKey, num) {
  if (!g.ruralCount) return '';
  const label = g.eupCount && g.myeonCount ? `읍 ${g.eupCount}·면 ${g.myeonCount}`
    : g.eupCount ? `읍 ${g.eupCount}` : `면 ${g.myeonCount}`;
  return frame('rural', 'rural', `${esc(g.name)}에서 이름만 올린 ${esc(label)}`,
    `<ul class="zn-nm">\n${g.rural.map((m) => `<li>${esc(m.name)}</li>`).join('\n')}\n</ul>`,
    esc(at(hash(seedKey, 'ru'), SEC.ruralSub)), num);
}

/* ── 서브 지역 시군구 안의 동 이름 ──────────────────── */
export function dongNameList(g, seedKey, num) {
  if (!g.dongNames || !g.dongNames.length) return '';
  const names = shuffle(g.dongNames.slice(), hash(seedKey, 'dnl'));
  return frame('dongidx', 'dong', `${esc(g.name)} 안의 동 이름 ${g.dongNames.length}개`,
    `<ul class="zn-nm">\n${names.map((d) => `<li>${esc(d)}</li>`).join('\n')}\n</ul>`,
    esc(at(hash(seedKey, 'dn'), SEC.dongSub)), num);
}

/* ── 시도 안의 시군구 목록 ──────────────────────────────────────
   ★깊이 들어온 쪽에서는 시드로 고른 일부만 걸고 나머지는 시도 안내문으로 보낸다. */
export function guIndex(sd, seedKey, currentSlug, num, { pick = 0 } = {}) {
  let list = sd.gu;
  if (pick && sd.gu.length > pick) {
    const keep = new Set(shuffle(sd.gu.map((g) => g.slug), hash(seedKey, 'gi')).slice(0, pick));
    if (currentSlug) keep.add(currentSlug);
    list = sd.gu.filter((g) => keep.has(g.slug));
  }
  list = list.slice().sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  const items = list.map((g) => `<li><a href="/${sd.slug}/${g.slug}/"${g.slug === currentSlug ? ' aria-current="page"' : ''}>${esc(g.name)}<b>${fa(g.a)}</b></a></li>`).join('\n');
  const partial = list.length < sd.gu.length;
  return frame('guidx', 'districts', partial ? `${esc(sd.name)} 시군구 ${sd.gu.length}곳 중 ${list.length}곳` : `${esc(sd.name)}의 시군구 ${sd.gu.length}곳 전부`,
    `<ul class="zn-chips">\n${items}\n</ul>${partial ? `\n<p class="zn-sec-x">나머지 시군구는 <a href="/${sd.slug}/">${esc(sd.name)} 안내문</a>에 모두 있다.</p>` : ''}`,
    esc(at(hash(seedKey, 'gi'), SEC.guIdxSub)), num);
}

/* ── 허리값이 가까운 시군구 ───────────────────────────────────── */
export function kinList(sd, g, seedKey, num) {
  if (!g.kinCount) return '';
  const items = g.kin.map((t) => `<li><a href="/${t.sidoSlug}/${t.slug}/">${esc(t.gu)}<b>${fa(t.a)}${t.same ? '' : ' · 다른 시도'}</b></a></li>`).join('\n');
  return frame('kin2', 'alike', `허리값이 ${esc(g.name)}에 가까운 시군구`,
    `<ul class="zn-chips">\n${items}\n</ul>`,
    esc(at(hash(seedKey, 'kl'), SEC.nearSub)), num);
}

/* ── 아래쪽 안내 링크 ─────────────────────────────────────────── */
export function siteLinks(ctx, seedKey) {
  const { regions } = ctx;
  const h = hash(seedKey, 'sl');
  const all = [];
  for (const r of regions) for (const g of r.gu) for (const s of g.spots) all.push({ r, g, s });
  const spots = shuffle(all, h).slice(0, 12);
  return frame('also', 'more', '여기서 더 둘러보기',
    `<ul class="zn-lk">
      <li><a href="/area/">갈 수 있는 곳 전체</a></li><li><a href="/guide/">이용 순서</a></li><li><a href="/price/">금액표</a></li><li><a href="/course/">코스표</a></li><li><a href="/magazine/">허리 기록</a></li>
      ${shuffle(regions, hash(seedKey, 'sd')).map((r) => `<li><a href="/${r.slug}/">${esc(r.name)}</a></li>`).join('')}
      ${spots.map((x) => `<li><a href="/${x.r.slug}/${x.g.slug}/${x.s.slug}/">${esc(x.g.name)} ${esc(x.s.name)}</a></li>`).join('')}
    </ul>`,
    '시도 밑은 시군구이고, 서울·인천·경기·부산만 거기서 동으로 한 층 더 내려간다. 다른 지역의 동과 읍·면은 이름만 적었다.');
}

/** 문서·글 안내문에 다는 주제 묶음 */
export function docTopics(ctx, seedKey, num, heading, sub) {
  const { regions, courses } = ctx;
  const courseAll = courses.map((c) => ({ label: c.ko, href: `/course/${c.slug}/` }));
  const sidoCourse = [];
  for (const r of regions) for (const c of courses) sidoCourse.push({ label: `${r.name} ${c.ko}`, href: `/${r.slug}/course/${c.slug}/` });
  const guList = [];
  for (const r of regions) for (const g of r.gu) guList.push({ label: `${r.name} ${g.name}`, href: `/${r.slug}/${g.slug}/` });
  const deep = [];
  for (const r of regions) if (r.main) for (const g of r.gu) for (const s of g.spots) deep.push({ label: `${g.name} ${s.name}`, href: `/${r.slug}/${g.slug}/${s.slug}/` });
  return topicLinks([
    { label: '코스별 안내', items: courseAll, anchor: COURSE_ANCHOR },
    { label: '시도 + 코스 조합', items: sidoCourse, pick: 12, anchor: COURSE_ANCHOR },
    { label: '시군구 안내', items: guList, pick: 14, anchor: ANCHOR },
    { label: '동 안내로 건너가기', items: deep, pick: 14, anchor: ANCHOR },
    { label: '이어 읽을 문서', items: DOC_LINKS },
  ], seedKey, num, heading, sub);
}
