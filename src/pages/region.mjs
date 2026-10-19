import { layout, frame } from '../lib/html.mjs';
import { esc, hash, km2, won, josa } from '../lib/util.mjs';
import { title, desc, clampDesc } from '../lib/seo.mjs';
import * as S from '../lib/schema.mjs';
import {
  courseRoll, stepCards, stepSet, statTiles, faqBlock, noticeBlock, stripProfile,
  shapeKin, spotIndex, ruralList, dongNameList, guIndex, kinList, hailStrip,
  topicLinks, courseTopic, themeCards, spotPool, guPool,
} from '../lib/blocks.mjs';
import {
  SPOT_LEAD_A, SPOT_LEAD_B, SPOT_LEAD_C,
  GU_LEAD, SIDO_LEAD_MAIN, SIDO_LEAD_SUB, SEC,
  clsName, clsTalk, waistWord, bigWord, leanWord, cmpWord, fk, fa, fb, fp,
  ANCHOR, COURSE_ANCHOR, NEAR_ANCHOR, DOC_LINKS,
} from '../content/copy.mjs';

const at = (h, arr, slot = 0) => arr[parseInt(h.substr((slot * 3) % 29, 3), 16) % arr.length];

/** 리드·FAQ 틀에 넘기는 값 꾸러미. 전부 땅을 열 토막으로 잘라 얻은 숫자다. */
function spotCtx(ctx, sd, g, s) {
  const { cfg, courses, counts } = ctx;
  return {
    sd, g, s,
    nm: s.name, gu: g.name, sido: sd.name, area: km2(s.area),
    f0: fp(s.v[0]), f1: fp(s.v[1]), f2: fp(s.v[2]),
    a: fa(s.a), waistW: waistWord(s.a), bigW: bigWord(s.b), leanW: leanWord(s.v[0], s.v[2]),
    b: fb(s.b), clsN: clsName(s.cls), clsT: clsTalk(s.cls),
    rank: s.rank, gRank: s.gRank, bRank: s.bRank,
    allSpots: counts.spot, guN: g.spotCount,
    wide: s.x.w + 1, thin: s.x.t + 1, len: fk(s.x.len), seq: s.x.s.map((v) => v.toFixed(1)).join(', '),
    hi: g.hi, hiV: fa(g.hiV), lo: g.lo, loV: fa(g.loV),
    bHi: g.bHi, bHiV: fb(g.bHiV), bLo: g.bLo, bLoV: fb(g.bLoV),
    guA: fa(g.a), cmpGu: cmpWord(s.a, g.a),
    clsSame: (g.clsCount[s.cls] || 1) - 1,
    gf0: fp(g.v[0]), gf2: fp(g.v[2]), gcls: clsName(g.cls),
    rankPct: `${Math.max(1, Math.round((s.gRank / g.spotCount) * 100))}%`,
    place: `${g.name} ${s.name}`,
    hours: cfg.hours, pay: cfg.pay, arrive: cfg.arrive,
    tel: cfg.tel, telLabel: cfg.telLabel,
    minPrice: `${won(Math.min(...courses.map((c) => c.price)))}원`,
  };
}

/* ── 동 안내문 — 메인 네 시도에서만 낸다 ─────────────────────── */
export function spotPage(ctx, sd, g, s) {
  const { cfg, siteUrl, courses, regions } = ctx;
  const path = `/${sd.slug}/${g.slug}/${s.slug}/`;
  const url = `${siteUrl}${path}`;
  const seed = `${sd.name}/${g.name}/${s.name}`;
  const h = hash(seed, 'spot');
  const c = spotCtx(ctx, sd, g, s);

  const open = `<div class="zn-lead brief">
  <p>${at(h, SPOT_LEAD_A, 0)(c)}</p>
  <p>${at(h, SPOT_LEAD_B, 1)(c)}</p>
  <p>${at(h, SPOT_LEAD_C, 2)(c)}</p>
</div>`;

  const facts = frame('fact', 'measured', `${esc(s.name)}의 땅을 열 토막으로 자르면`,
    stripProfile(s.x) + statTiles([
      ['속한 곳', `<a href="/${sd.slug}/">${esc(sd.full)}</a> / <a href="/${sd.slug}/${g.slug}/">${esc(g.name)}</a>`],
      ['허리값', `${c.a}<small>${esc(c.waistW)}</small>`],
      ['두꺼운 토막 몫', `${c.b}%<small>${esc(c.bigW)}</small>`],
      ['앞·가운데·뒤', `${c.f0} · ${c.f1} · ${c.f2}<small>${esc(c.leanW)}</small>`],
      ['읽힌 꼴', `${esc(c.clsN)}<small>${esc(c.clsT)}</small>`],
      ['긴 방향 길이', `${esc(c.len)}<small>가장 두꺼운 토막은 ${c.wide}째, 가운데에서 가장 얇은 토막은 ${c.thin}째</small>`],
      ['차지한 넓이', km2(s.area)],
      ['허리값 순위', `${esc(g.name)} ${g.spotCount}곳 중 ${s.gRank}째<small>안내문을 낸 ${ctx.counts.spot}곳 중 ${s.rank}째</small>`],
      ['몰림 순위', `${ctx.counts.spot}곳 중 ${s.bRank}째`],
    ]),
    esc(at(h, SEC.factSub, 7)), '01');

  const { html: faqHtml, qa } = faqBlock(seed, c, 5, '05');

  const far = [];
  for (const r of regions) {
    if (r.slug === sd.slug) continue;
    if (r.main) for (const x of r.gu) for (const y of x.spots) far.push({ label: `${x.name} ${y.name}`, href: `/${r.slug}/${x.slug}/${y.slug}/` });
    else for (const x of r.gu) far.push({ label: `${r.name} ${x.name}`, href: `/${r.slug}/${x.slug}/` });
  }
  const sameSido = [];
  for (const x of sd.gu) {
    if (x.slug === g.slug) continue;
    for (const y of x.spots) sameSido.push({ label: `${x.name} ${y.name}`, href: `/${sd.slug}/${x.slug}/${y.slug}/` });
  }
  const steps = stepSet(seed);
  const topics = topicLinks([
    { label: '코스별로 바로', items: courseTopic(sd, courses), anchor: COURSE_ANCHOR },
    { label: `${sd.name}의 다른 동`, items: sameSido, pick: 18, anchor: ANCHOR },
    { label: '허리값이 가까운 시군구', items: g.kin.map((t) => ({ label: t.gu, href: `/${t.sidoSlug}/${t.slug}/` })), anchor: NEAR_ANCHOR },
    { label: '다른 시도로 건너가기', items: far, pick: 18, anchor: ANCHOR },
    { label: '이어 읽을 문서', items: DOC_LINKS },
  ], seed, '10', esc(at(h, SEC.topicHead, 8)), esc(at(h, SEC.topicSub, 3)));
  const theme = themeCards({
    pool: spotPool(regions, { sidoLabel: true, skipGu: `${sd.slug}/${g.slug}` }), noun: '동', seedKey: seed, num: '09',
    heading: esc(at(h, SEC.themeHead, 4)), sub: esc(at(h, SEC.themeSub, 5)), cards: 3, per: 4, prefer: [`c${s.cls}`],
  });

  const body = [
    open,
    facts,
    shapeKin(sd, g, s, seed, '02'),
    courseRoll(courses, seed, s.name, '03', { full: false }),
    stepCards(seed, '04'),
    hailStrip(cfg, `${g.name} ${s.name}`, seed),
    faqHtml,
    spotIndex(sd, g, seed, s.slug, '06'),
    guIndex(sd, seed, g.slug, '07', { pick: 12 }),
    noticeBlock(seed, '08'),
    theme.html,
    topics,
  ].join('\n');

  return {
    path,
    html: layout(ctx, {
      path,
      title: title.spot(sd, g, s),
      desc: clampDesc(desc.spot(sd, g, s)),
      h1: `${esc(g.name)} ${esc(s.name)} <span class="zn-h1-s">출장마사지 홈타이 · 허리값 ${esc(c.a)}, ${esc(c.clsN)}</span>`,
      body,
      pageKind: 'spot',
      about: `${url}#place`,
      geo: { iso: sd.iso, placename: `${sd.full} ${g.name} ${s.name}`, lat: s.lat, lng: s.lng },
      crumbs: [
        { name: '첫 화면', url: `${siteUrl}/` },
        { name: '지역 목록', url: `${siteUrl}/area/` },
        { name: sd.name, url: `${siteUrl}/${sd.slug}/` },
        { name: g.name, url: `${siteUrl}/${sd.slug}/${g.slug}/` },
        { name: s.name, url },
      ],
      jsonld: [
        S.place(`${url}#place`, `${sd.full} ${g.name} ${s.name}`, { lat: s.lat, lng: s.lng },
          { area: s.area, containedIn: { '@type': 'AdministrativeArea', name: `${sd.full} ${g.name}` } }),
        S.service({
          siteUrl, url, cfg,
          name: `${g.name} ${s.name} 방문 관리 — 출장마사지 홈타이`,
          desc: clampDesc(desc.spot(sd, g, s)),
          areaServed: { '@id': `${url}#place` },
          courses,
        }),
        S.itemList(`${url}#themes`, `${s.name}${josa(s.name, '과/와')} 허리가 비슷한 동`, theme.list.map((x) => ({ name: x.name, url: `${siteUrl}${x.href}` }))),
        S.faqPage(url, qa),
        S.howTo(url, `${g.name} ${s.name}에서 접수하는 다섯 단계`, steps, cfg),
      ],
    }),
  };
}

/* ── 시군구 안내문 ────────────────────────────────────────────── */
export function guPage(ctx, sd, g) {
  const { cfg, siteUrl, courses, regions } = ctx;
  const path = `/${sd.slug}/${g.slug}/`;
  const url = `${siteUrl}${path}`;
  const seed = `${sd.name}/${g.name}`;
  const h = hash(seed, 'gu');

  /* ★읍을 뺀 뒤로 '행정동이 전부 읍·면인 군'이 생겼다. 안내문을 낼 구역이 0이므로 갈래를 나눈다. */
  const mode = g.main ? (g.spotCount ? 'spot' : 'rural') : 'list';
  const c = {
    sido: sd.name, name: g.name, gu: g.name, mainSite: g.main, mode,
    unitN: mode === 'spot' ? g.spotCount : mode === 'rural' ? g.ruralCount : g.dongNames.length,
    spotCount: g.spotCount, dongCount: g.dongCount,
    ruralCount: g.ruralCount, eupCount: g.eupCount, myeonCount: g.myeonCount,
    area: km2(g.area),
    f0: fp(g.v[0]), f1: fp(g.v[1]), f2: fp(g.v[2]),
    a: fa(g.a), b: fb(g.b), wide: g.x.w + 1, clsN: clsName(g.cls), clsT: clsTalk(g.cls),
    hi: g.hi || '', hiV: g.hiV ? fa(g.hiV) : '', lo: g.lo || '', loV: g.loV ? fa(g.loV) : '',
    bHi: g.bHi || '', bHiV: g.bHiV ? fb(g.bHiV) : '',
    kinCount: g.kinCount,
    place: `${sd.name} ${g.name}`,
    hours: cfg.hours, pay: cfg.pay, arrive: cfg.arrive,
    tel: cfg.tel, telLabel: cfg.telLabel,
    minPrice: `${won(Math.min(...courses.map((x) => x.price)))}원`,
  };

  const i0 = parseInt(h.substr(0, 3), 16) % GU_LEAD.length;
  const i1 = (i0 + 1 + (parseInt(h.substr(9, 3), 16) % (GU_LEAD.length - 1))) % GU_LEAD.length;
  const open = `<div class="zn-lead brief">
  <p>${GU_LEAD[i0](c)}</p>
  <p>${GU_LEAD[i1](c)}</p>
</div>`;

  const rows = [
    ['속한 시도', `<a href="/${sd.slug}/">${esc(sd.full)}</a>`],
    ['행정동 전체', `${g.dongCount}구역`],
    mode === 'spot' ? ['쪽을 낸 동', `${g.spotCount}구역`]
      : mode === 'rural' ? ['동 쪽', '해당 없음<small>이 군은 읍·면으로만 이루어져 있다</small>']
        : ['쪽의 단위', '시군구까지<small>동 이름은 아래 목록에 있다</small>'],
    ['읍·면', g.ruralCount ? `${g.ruralCount}곳<small>쪽 없이 이름 한 줄씩 · 읍이 ${g.eupCount}곳, 면이 ${g.myeonCount}곳</small>` : '없음'],
    ['허리값', `${c.a}<small>${esc(waistWord(g.a))}</small>`],
    ['두꺼운 토막 몫', `${c.b}%<small>${esc(bigWord(g.b))}</small>`],
    ['앞·가운데·뒤', `${c.f0} · ${c.f1} · ${c.f2}<small>${esc(leanWord(g.v[0], g.v[2]))}</small>`],
    ['읽힌 꼴', `${esc(c.clsN)}<small>${esc(c.clsT)}</small>`],
    ['긴 방향 길이', `${esc(fk(g.x.len))}`],
    ['허리값이 가까운 곳', g.kin.length > 1 ? `${esc(g.kin[0].gu)} · ${esc(g.kin[1].gu)}<small>그 밖에 ${g.kinCount - 2}곳</small>` : g.kin.length ? esc(g.kin[0].gu) : '없음'],
    ['차지한 넓이', km2(g.area)],
  ];
  if (mode === 'spot' && g.hi) {
    rows.splice(8, 0,
      ['허리값이 가장 높은 동', `<a href="/${sd.slug}/${g.slug}/${g.hiSlug}/">${esc(g.hi)}</a><small>허리값 ${fa(g.hiV)}</small>`],
      ['허리값이 가장 낮은 동', `<a href="/${sd.slug}/${g.slug}/${g.loSlug}/">${esc(g.lo)}</a><small>허리값 ${fa(g.loV)}</small>`],
      ['한 토막에 가장 몰린 동', `<a href="/${sd.slug}/${g.slug}/${g.bHiSlug}/">${esc(g.bHi)}</a><small>${fb(g.bHiV)}%</small>`]);
  }
  const facts = frame('fact', 'measured', `${esc(g.name)}의 땅을 열 토막으로 자르면`, stripProfile(g.x) + statTiles(rows), esc(at(h, SEC.factSub, 7)), '01');

  const { html: faqHtml, qa } = faqBlock(seed, c, 5, '06');

  const far = [];
  for (const r of regions) for (const x of r.gu) {
    if (r.slug === sd.slug && x.slug === g.slug) continue;
    far.push({ label: `${r.name} ${x.name}`, href: `/${r.slug}/${x.slug}/` });
  }
  const steps = stepSet(seed);
  const sidoDeep = [];
  for (const x of sd.gu) for (const y of x.spots) if (x.slug !== g.slug) sidoDeep.push({ label: `${x.name} ${y.name}`, href: `/${sd.slug}/${x.slug}/${y.slug}/` });
  const topics = topicLinks([
    { label: '코스 이름으로', items: courseTopic(sd, courses), anchor: COURSE_ANCHOR },
    { label: '허리값이 가까운 시군구', items: g.kin.map((t) => ({ label: t.gu, href: `/${t.sidoSlug}/${t.slug}/` })), anchor: NEAR_ANCHOR },
    ...(sidoDeep.length ? [{ label: `${sd.name}의 다른 시군구 동`, items: sidoDeep, pick: 16, anchor: ANCHOR }] : []),
    { label: '다른 시도의 시군구', items: far, pick: 18, anchor: ANCHOR },
    { label: '이어 읽을 문서', items: DOC_LINKS },
  ], seed, '11', esc(at(h, SEC.topicHead, 8)), esc(at(h, SEC.topicSub, 3)));
  const theme = themeCards({
    pool: mode === 'spot'
      ? spotPool(regions.filter((r) => r.slug === sd.slug), { skipGu: `${sd.slug}/${g.slug}` })
      : guPool(regions, { sidoLabel: true, skip: `${sd.slug}/${g.slug}` }),
    noun: mode === 'spot' ? '동' : '시군구', seedKey: seed, num: '10',
    heading: esc(at(h, SEC.themeHead, 4)), sub: esc(at(h, SEC.themeSub, 5)), cards: 3, per: 4, prefer: [`c${g.cls}`],
  });

  const body = [
    open,
    facts,
    mode === 'spot' ? spotIndex(sd, g, seed, null, '02') : mode === 'list' ? dongNameList(g, seed, '02') : '',
    ruralList(g, seed, '03'),
    courseRoll(courses, seed, g.name, '04', { full: false }),
    hailStrip(cfg, `${sd.name} ${g.name}`, seed),
    kinList(sd, g, seed, '05'),
    stepCards(seed, '06'),
    faqHtml,
    noticeBlock(seed, '08'),
    guIndex(sd, seed, g.slug, '09', { pick: 20 }),
    theme.html,
    topics,
  ].join('\n');

  return {
    path,
    html: layout(ctx, {
      path,
      title: title.gu(sd, g),
      desc: clampDesc(desc.gu(sd, g)),
      h1: `${esc(sd.name)} ${esc(g.name)} <span class="zn-h1-s">출장마사지 홈타이 · ${mode === 'spot' ? `동 ${g.spotCount}구역, 허리값 ${esc(c.a)}` : mode === 'rural' ? `읍·면 ${g.ruralCount}곳, 허리값 ${esc(c.a)}` : `행정동 ${g.dongCount}구역, 허리값 ${esc(c.a)}`}</span>`,
      body,
      pageKind: 'gu',
      pageType: 'CollectionPage',
      about: `${url}#place`,
      mainList: g.spots.length ? `${url}#spotlist` : `${url}#sidogu`,
      geo: { iso: sd.iso, placename: `${sd.full} ${g.name}`, lat: g.lat, lng: g.lng },
      crumbs: [
        { name: '첫 화면', url: `${siteUrl}/` },
        { name: '지역 목록', url: `${siteUrl}/area/` },
        { name: sd.name, url: `${siteUrl}/${sd.slug}/` },
        { name: g.name, url },
      ],
      jsonld: [
        S.place(`${url}#place`, `${sd.full} ${g.name}`, { lat: g.lat, lng: g.lng },
          { area: g.area, containedIn: { '@type': 'AdministrativeArea', name: sd.full } }),
        S.service({
          siteUrl, url, cfg,
          name: `${sd.name} ${g.name} 방문 관리 — 출장마사지 홈타이`,
          desc: clampDesc(desc.gu(sd, g)),
          areaServed: { '@id': `${url}#place` },
          courses,
        }),
        g.spots.length
          ? S.itemList(`${url}#spotlist`, `${g.name} 동`, g.spots.map((s) => ({ name: s.name, url: `${siteUrl}/${sd.slug}/${g.slug}/${s.slug}/` })))
          : S.itemList(`${url}#sidogu`, `${sd.name}의 시군구`, sd.gu.map((x) => ({ name: x.name, url: `${siteUrl}/${sd.slug}/${x.slug}/` }))),
        S.itemList(`${url}#themes`, `${g.name}${josa(g.name, '과/와')} 허리가 비슷한 곳`, theme.list.map((x) => ({ name: x.name, url: `${siteUrl}${x.href}` }))),
        S.faqPage(url, qa),
        S.howTo(url, `${sd.name} ${g.name}에서 접수하는 다섯 단계`, steps, cfg),
      ].filter(Boolean),
    }),
  };
}

/* ── 시도 안내문 ──────────────────────────────────────────────── */
export function sidoPage(ctx, sd) {
  const { cfg, siteUrl, courses, regions } = ctx;
  const path = `/${sd.slug}/`;
  const url = `${siteUrl}${path}`;
  const seed = sd.name;
  const h = hash(seed, 'sd');
  const byB = sd.gu.slice().sort((a, b) => b.b - a.b || a.name.localeCompare(b.name, 'ko'));

  const c = {
    name: sd.name, full: sd.full, guCount: sd.gu.length,
    spotCount: sd.spotCount, dongCount: sd.dongCount, ruralCount: sd.ruralCount,
    f0: fp(sd.v[0]), f1: fp(sd.v[1]), f2: fp(sd.v[2]),
    avgA: fa(sd.avgA), hiName: sd.hiName, loName: sd.loName,
    place: sd.name,
    hours: cfg.hours, pay: cfg.pay, arrive: cfg.arrive,
    tel: cfg.tel, telLabel: cfg.telLabel,
    minPrice: `${won(Math.min(...courses.map((x) => x.price)))}원`,
  };

  const open = `<div class="zn-lead brief"><p>${at(h, sd.main ? SIDO_LEAD_MAIN : SIDO_LEAD_SUB, 0)(c)}</p></div>`;

  const link = (nm, slug) => (sd.main ? esc(nm) : `<a href="/${sd.slug}/${slug}/">${esc(nm)}</a>`);
  const factRows = [
    ['행정 명칭', esc(sd.full)],
    ['쪽을 낸 깊이', sd.main ? '시군구 밑에 동까지' : '시군구까지'],
    ['시군구', `${sd.gu.length}곳`],
    ['행정동 전체', `${sd.dongCount}구역`],
    sd.main ? ['쪽을 낸 동', `${sd.spotCount}구역`] : ['동 이름', '각 시군구 쪽에 적혀 있다'],
    ['읍·면', sd.ruralCount ? `${sd.ruralCount}곳<small>각 시군구 쪽에서 이름을 볼 수 있다</small>` : '없음'],
    ['허리값', `${fa(sd.a)}<small>${esc(waistWord(sd.a))}</small>`],
    ['두꺼운 토막 몫', `${fb(sd.b)}%<small>${esc(bigWord(sd.b))}</small>`],
    ['읽힌 꼴', `${esc(clsName(sd.cls))}<small>${esc(clsTalk(sd.cls))}</small>`],
    [sd.main ? '동 평균 허리값' : '시군구 평균 허리값', fa(sd.avgA)],
    [sd.main ? '허리값이 가장 높은 동' : '허리값이 가장 높은 시군구', `${link(sd.hiName, sd.hiSlug)}<small>${fa(sd.hiV)}</small>`],
    [sd.main ? '허리값이 가장 낮은 동' : '허리값이 가장 낮은 시군구', `${link(sd.loName, sd.loSlug)}<small>${fa(sd.loV)}</small>`],
  ];
  const facts = frame('fact', 'measured', `${esc(sd.name)}의 땅을 열 토막으로 자르면`,
    (sd.x ? stripProfile(sd.x) : '') + statTiles(factRows), esc(at(h, SEC.factSub, 7)), '01');

  const { html: faqHtml, qa } = faqBlock(seed, c, 4, '06');

  const csAnchor = [
    (x) => `${x.ko} 코스를 ${sd.name}에서`,
    (x) => `${sd.name}의 ${x.ko} 안내`,
    (x) => `${x.ko}, ${sd.name} 방문 기준`,
  ];
  const csLinks = frame('sidocourse', 'courses', `${esc(sd.name)}에서 받을 수 있는 코스`,
    `<ul class="zn-lk">${courses.map((x) => `<li><a href="/${sd.slug}/course/${x.slug}/">${esc(at(hash(sd.name, x.slug, 'cs'), csAnchor)(x))}</a></li>`).join('')}</ul>`,
    `어떤 코스를 고르든 ${esc(sd.name)} 어디서나 값표는 한 장이다. 코스마다 오래 풀어 주는 곳이 다르다.`, '04');

  let pickBlock = '';
  if (sd.main) {
    const all = [];
    for (const g of sd.gu) for (const s of g.spots) all.push({ g, s });
    all.sort((a, b) => b.s.b - a.s.b || a.s.name.localeCompare(b.s.name, 'ko'));
    pickBlock = frame('shrunk', 'steepest', `${esc(sd.name)}에서 한 토막에 땅이 가장 몰린 동`,
      `<ul class="zn-chips">\n${all.slice(0, 18).map((x) => `<li><a href="/${sd.slug}/${x.g.slug}/${x.s.slug}/">${esc(x.g.name)} ${esc(x.s.name)}<b>${fb(x.s.b)}%</b></a></li>`).join('\n')}\n</ul>`,
      '숫자가 클수록 땅 대부분이 한 토막에 모여 있다는 뜻이다. 이런 동은 번지까지 들은 뒤에야 가는 길이 정해진다. 여기 없는 동은 시군구 쪽에서 찾으면 된다.', '03');
  } else {
    pickBlock = frame('shrunk', 'steepest', `${esc(sd.name)}에서 한 토막에 땅이 가장 몰린 시군구`,
      `<ul class="zn-chips">\n${byB.slice(0, 12).map((g) => `<li><a href="/${sd.slug}/${g.slug}/">${esc(g.name)}<b>${fb(g.b)}%</b></a></li>`).join('\n')}\n</ul>`,
      '숫자가 클수록 시군구 땅이 한쪽 토막에 쏠려 있다.', '03');
  }

  const far = [];
  for (const r of regions) {
    if (r.slug === sd.slug) continue;
    for (const x of r.gu) far.push({ label: `${r.name} ${x.name}`, href: `/${r.slug}/${x.slug}/` });
  }
  const deep = [];
  for (const g of sd.gu) for (const x of g.spots) deep.push({ label: `${g.name} ${x.name}`, href: `/${sd.slug}/${g.slug}/${x.slug}/` });
  const steps = stepSet(seed);
  const topics = topicLinks([
    { label: `${sd.name}의 코스별 안내`, items: courseTopic(sd, courses), anchor: COURSE_ANCHOR },
    { label: '코스 설명만 따로', items: courses.map((x) => ({ label: x.ko, href: `/course/${x.slug}/` })), anchor: COURSE_ANCHOR },
    ...(deep.length ? [{ label: `${sd.name}의 동 안내`, items: deep, pick: 16, anchor: ANCHOR }] : []),
    { label: '다른 시도의 시군구', items: far, pick: 16, anchor: ANCHOR },
    { label: '이어 읽을 문서', items: DOC_LINKS },
  ], seed, '08', esc(at(h, SEC.topicHead, 8)), esc(at(h, SEC.topicSub, 3)));
  const theme = themeCards({
    pool: sd.main ? spotPool([sd]) : guPool(regions.filter((r) => r.slug !== sd.slug), { sidoLabel: true }),
    noun: sd.main ? '동' : '시군구', seedKey: seed, num: '07',
    heading: esc(at(h, SEC.themeHead, 4)), sub: esc(at(h, SEC.themeSub, 5)), cards: sd.main ? 6 : 5, per: 4,
  });

  const body = [
    open,
    facts,
    guIndex(sd, seed, null, '02'),
    pickBlock,
    csLinks,
    hailStrip(cfg, sd.name, seed),
    courseRoll(courses, seed, sd.name, '05', { full: false }),
    stepCards(seed, '06'),
    faqHtml,
    theme.html,
    topics,
  ].join('\n');

  return {
    path,
    html: layout(ctx, {
      path,
      title: title.sido(sd),
      desc: clampDesc(desc.sido(sd)),
      h1: `${esc(sd.name)} <span class="zn-h1-s">출장마사지 홈타이 · ${sd.main ? `동 ${sd.spotCount}구역, 허리값 ${fa(sd.a)}` : `시군구 ${sd.gu.length}곳, 평균 허리값 ${fa(sd.avgA)}`}</span>`,
      body,
      pageKind: 'sido',
      pageType: 'CollectionPage',
      about: `${url}#place`,
      mainList: `${url}#gulist`,
      geo: { iso: sd.iso, placename: sd.full, lat: sd.lat, lng: sd.lng },
      crumbs: [
        { name: '첫 화면', url: `${siteUrl}/` },
        { name: '지역 목록', url: `${siteUrl}/area/` },
        { name: sd.name, url },
      ],
      jsonld: [
        S.place(`${url}#place`, sd.full, { lat: sd.lat, lng: sd.lng }, { area: sd.area, alternateName: sd.alias }),
        S.service({
          siteUrl, url, cfg,
          name: `${sd.name} 방문 관리 — 출장마사지 홈타이`,
          desc: clampDesc(desc.sido(sd)),
          areaServed: { '@id': `${url}#place` },
          courses,
        }),
        S.itemList(`${url}#gulist`, `${sd.name} 시군구`, sd.gu.map((g) => ({ name: g.name, url: `${siteUrl}/${sd.slug}/${g.slug}/` }))),
        S.itemList(`${url}#courselist`, `${sd.name}에서 받는 코스`, courses.map((cc) => ({ name: `${sd.name} ${cc.ko}`, url: `${siteUrl}/${sd.slug}/course/${cc.slug}/` }))),
        S.itemList(`${url}#themes`, `${sd.name}에서 허리가 비슷한 곳`, theme.list.map((x) => ({ name: x.name, url: `${siteUrl}${x.href}` }))),
        S.faqPage(url, qa),
        S.howTo(url, `${sd.name}에서 접수하는 다섯 단계`, steps, cfg),
      ],
    }),
  };
}
