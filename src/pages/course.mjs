import { layout, frame } from '../lib/html.mjs';
import { esc, hash, won, josa, km2, shuffle } from '../lib/util.mjs';
import { title, desc, clampDesc } from '../lib/seo.mjs';
import * as S from '../lib/schema.mjs';
import { statTiles, faqBlock, stepCards, stepSet, noticeBlock, hailStrip, courseRoll, topicLinks, guIndex, themeCards, spotPool, guPool } from '../lib/blocks.mjs';
import { SEC, ANCHOR, COURSE_ANCHOR, DOC_LINKS, fa, fp } from '../content/copy.mjs';

const at = (h, arr, slot = 0) => arr[parseInt(h.substr((slot * 3) % 29, 3), 16) % arr.length];

/* ★동 × 코스는 만들지 않는다. 1,232 × 9 이면 만 쪽을 넘는데 구역이 바뀌어도
   코스 설명이 같아 전부 얇은 조합 안내문이 된다(도어웨이로 읽힌다).
   코스는 전국 한 장 + 시도별 한 장까지만 낸다. */

const OIL_NOTE = {
  true: '피부에 오일을 바르는 코스이다. 끝난 뒤 몸을 닦는 시간이 따로 필요하니 곧장 나갈 일정은 잡지 않는 편이 낫다.',
  false: '오일 없이 진행한다. 끝나고 바로 씻지 않아도 되고 이불이나 수건이 번질 일도 없다.',
};
const PRESSURE_NOTE = [
  '표에 적힌 세기는 시작 지점이다. 몇 분 받다 보면 손과 몸이 서로 맞춰진다.',
  '아프다 싶으면 그 자리에서 말하면 된다. 말하는 즉시 세기를 줄인다.',
  '같은 세기도 컨디션에 따라 달리 느껴진다. 통화에서 그날 몸 상태를 먼저 말해 두면 좋다.',
];
const WHY = [
  (c) => `${c.for}에 어울리는 코스는 ${c.ko}이다.`,
  (c) => `${c.ko} 문의는 ${c.for}에 몰린다. 사정이 다르면 통화에서 다른 코스로 옮긴다.`,
  (c) => `구성은 ${c.for}${josa(c.for, '을/를')} 기준으로 짰다. 받다가 바꾸고 싶어져도 되고, 값은 처음 고른 코스로 끝까지 센다.`,
];

/* ── 코스 한 장 ───────────────────────────────────────────────── */
export function coursePage(ctx, c) {
  const { cfg, siteUrl, courses, regions } = ctx;
  const path = `/course/${c.slug}/`;
  const url = `${siteUrl}${path}`;
  const seed = `course/${c.slug}`;
  const h = hash(seed, 'cp');

  const fc = {
    place: '계신 곳', hours: cfg.hours, pay: cfg.pay, arrive: cfg.arrive,
    tel: cfg.tel, telLabel: cfg.telLabel,
    minPrice: `${won(Math.min(...courses.map((x) => x.price)))}원`,
  };

  const open = `<div class="zn-lead brief">
  <p>${esc(at(h, WHY, 0)(c))} ${esc(c.lines[0])}</p>
  <p>${esc(c.lines[1])} ${esc(c.lines[2])}</p>
  <p>${esc(OIL_NOTE[String(c.oil)])} ${esc(at(h, PRESSURE_NOTE, 1))}</p>
</div>`;

  const facts = frame('fact', 'course', `${esc(c.ko)}의 시간과 금액`,
    statTiles([
      ['받는 시간', `${c.min}분`],
      ['금액', `${won(c.price)}원<small>어느 지역에서 걸어도 같다</small>`],
      ['압', esc(c.pressure)],
      ['손의 움직임', esc(c.tempo)],
      ['오래 머무는 곳', esc(c.focus)],
      ['오일', c.oil ? '바른다' : '쓰지 않는다'],
      ['방 준비', c.oil ? '수건 두 장과 누울 자리' : '누울 자리와 수건 한 장'],
      ['접수·도착', `${esc(cfg.hours)}<small>${esc(cfg.pay)}, 현관 앞까지 ${esc(cfg.arrive)}</small>`],
    ]), esc(at(h, SEC.factSub, 7)), '01');

  const others = courses.filter((x) => x.slug !== c.slug);
  const lo = Math.min(...courses.map((x) => x.min)), hi = Math.max(...courses.map((x) => x.min));
  const barRow = (x, me) => {
    const r = hi === lo ? 1 : ((x.min - lo) / (hi - lo)).toFixed(2);
    const inner = `<span class="zn-cb-bar"><span>${esc(x.ko)}</span><em>${x.min}분</em></span><span class="zn-cb-p">${won(x.price)}원</span>`;
    return `<li${me ? ' class="me"' : ''}>${me ? `<div class="zn-cb-a" style="--r:${r}">${inner}</div>` : `<a href="/course/${x.slug}/" style="--r:${r}">${inner}</a>`}<small>압 ${esc(x.pressure)} · ${x.oil ? '오일 바름' : '오일 없음'}</small></li>`;
  };
  const compare = frame('cmp', 'compare', '길이 막대로 아홉 코스 견주기',
    `<ul class="zn-cb">\n${barRow(c, true)}\n${others.map((x) => barRow(x, false)).join('\n')}\n</ul>`,
    '막대는 받는 시간이고 오른쪽 숫자는 금액이다. 오래 받는 것과 세게 받는 것은 서로 다른 칸이므로 시간과 압을 따로 읽으면 된다.', '02');

  const { html: faqHtml, qa } = faqBlock(seed, fc, 5, '04');

  const bySido = regions.map((r) => ({ label: `${r.name} ${c.ko}`, href: `/${r.slug}/course/${c.slug}/` }));
  const guList = [];
  for (const r of regions) for (const g of r.gu) guList.push({ label: `${r.name} ${g.name}`, href: `/${r.slug}/${g.slug}/` });
  const others2 = courses.filter((x) => x.slug !== c.slug).map((x) => ({ label: x.ko, href: `/course/${x.slug}/` }));
  const steps = stepSet(seed);
  const deepAll = [];
  for (const r of regions) if (r.main) for (const g of r.gu) for (const x of g.spots) deepAll.push({ label: `${g.name} ${x.name}`, href: `/${r.slug}/${g.slug}/${x.slug}/` });
  const topics = topicLinks([
    { label: `${c.ko} 지역별 안내`, items: bySido, anchor: COURSE_ANCHOR },
    { label: '다른 코스 설명', items: others2, anchor: COURSE_ANCHOR },
    { label: '시군구별 안내', items: guList, pick: 18, anchor: ANCHOR },
    { label: '동별 안내', items: deepAll, pick: 16, anchor: ANCHOR },
    { label: '이어 읽을 문서', items: DOC_LINKS },
  ], seed, '07', esc(at(h, SEC.topicHead, 8)), esc(at(h, SEC.topicSub, 3)));
  const theme = themeCards({
    pool: spotPool(regions, { sidoLabel: true }), noun: '동', seedKey: seed, num: '06',
    heading: esc(at(h, SEC.themeHead, 4)), sub: esc(at(h, SEC.themeSub, 5)), cards: 3, per: 4,
  });

  const body = [
    open,
    facts,
    hailStrip(cfg, c.ko, seed),
    compare,
    stepCards(seed, '03'),
    faqHtml,
    noticeBlock(seed, '05'),
    theme.html,
    topics,
  ].join('\n');

  return {
    path,
    html: layout(ctx, {
      path,
      title: title.course(c),
      desc: clampDesc(desc.course(c)),
      h1: `${esc(c.ko)} <span class="zn-h1-s">출장마사지 홈타이 · ${c.min}분 코스, ${won(c.price)}원 한 가지</span>`,
      body,
      pageKind: 'course',
      crumbs: [
        { name: '첫 화면', url: `${siteUrl}/` },
        { name: '코스표', url: `${siteUrl}/course/` },
        { name: c.ko, url },
      ],
      jsonld: [
        S.service({
          siteUrl, url, cfg,
          name: `${c.ko} 출장 방문 관리`,
          desc: clampDesc(desc.course(c)),
          areaServed: { '@type': 'Country', name: '대한민국' },
          courses: [c],
        }),
        S.itemList(`${url}#sidolist`, `${c.ko}를 받을 수 있는 시도`, regions.map((r) => ({ name: `${r.name} ${c.ko}`, url: `${siteUrl}/${r.slug}/course/${c.slug}/` }))),
        S.itemList(`${url}#themes`, `${c.ko}를 부르기 전에 살펴볼 동`, theme.list.map((x) => ({ name: x.name, url: `${siteUrl}${x.href}` }))),
        S.faqPage(url, qa),
        S.howTo(url, `${c.ko} 접수에서 도착까지 다섯 단계`, steps, cfg),
      ],
    }),
  };
}

/* ── 시도 × 코스 ──────────────────────────────────────────────── */
export function sidoCoursePage(ctx, sd, c) {
  const { cfg, siteUrl, courses, regions } = ctx;
  const path = `/${sd.slug}/course/${c.slug}/`;
  const url = `${siteUrl}${path}`;
  const seed = `${sd.name}/course/${c.slug}`;
  const h = hash(seed, 'sc');

  const fc = {
    place: sd.name, hours: cfg.hours, pay: cfg.pay, arrive: cfg.arrive,
    tel: cfg.tel, telLabel: cfg.telLabel,
    minPrice: `${won(Math.min(...courses.map((x) => x.price)))}원`,
  };

  const openLines = [
    `${sd.name}에서 어디로 걸어도 ${c.ko}의 값은 ${c.min}분에 ${won(c.price)}원 하나다.`,
    `${sd.name}에서 ${c.ko}를 찾으면 시군구나 동을 따지지 않고 같은 길이와 같은 값을 알려 준다.`,
    `문의가 ${sd.name}에서 왔다고 구성이 달라지지는 않는다. ${c.ko}는 ${c.min}분, ${won(c.price)}원이다.`,
  ];
  const secondMain = [
    `${sd.name}의 동 ${sd.spotCount}곳은 저마다 땅을 열 토막으로 자른 값이 있다. 평균 허리값은 ${fa(sd.avgA)}이다.`,
    `${sd.name}에서 허리값이 가장 높은 동은 ${sd.hiName}, 가장 낮은 동은 ${sd.loName}이다. 동마다 안내문이 따로 있다.`,
    `${sd.name} 전체를 가장 긴 방향으로 열 토막 내면 앞 세 토막이 ${fp(sd.v[0])}, 뒤 세 토막이 ${fp(sd.v[2])}를 차지한다.`,
  ];
  const secondSub = [
    `${sd.name}${josa(sd.name, '은/는')} 시군구 ${sd.gu.length}곳 단위로 안내문을 냈고, 동 이름은 각 시군구 쪽 목록에 있다.`,
    `${sd.name} 시군구 ${sd.gu.length}곳의 평균 허리값은 ${fa(sd.avgA)}이고 행정동은 모두 ${sd.dongCount}곳이다.`,
    `${sd.name}에서는 시군구가 가장 작은 쪽 단위이다. 읍·면·동 이름은 전화로 한 번만 말하면 된다.`,
  ];
  const second = at(h, sd.main ? secondMain : secondSub, 6);

  const open = `<div class="zn-lead brief">
  <p>${esc(at(h, openLines, 0))}</p>
  <p>${esc(second)}</p>
  <p>${esc(c.lines[(parseInt(h.substr(3, 3), 16)) % c.lines.length])}</p>
</div>`;

  const facts = frame('fact', 'course', `${esc(sd.name)}에서 받는 ${esc(c.ko)}`,
    statTiles([
      ['대상 지역', `<a href="/${sd.slug}/">${esc(sd.full)}</a>`],
      ['쪽의 깊이', sd.main ? `시군구 ${sd.gu.length}곳 아래 동 ${sd.spotCount}곳` : `시군구 ${sd.gu.length}곳까지`],
      ['받는 시간', `${c.min}분`],
      ['금액', `${won(c.price)}원<small>${esc(sd.name)} 어디서나 같다</small>`],
      ['압과 손놀림', `${esc(c.pressure)}<small>${esc(c.tempo)}</small>`],
      ['오래 머무는 곳', esc(c.focus)],
      ['오일', c.oil ? '바른다' : '쓰지 않는다'],
      ['이 지역 평균 허리값', `${fa(sd.avgA)}<small>${esc(sd.main ? `동 ${sd.spotCount}곳을 평균한 값` : `시군구 ${sd.gu.length}곳을 평균한 값`)}</small>`],
      ['차지한 넓이', km2(sd.area)],
    ]), esc(at(h, SEC.factSub, 7)), '01');

  const { html: faqHtml, qa } = faqBlock(seed, fc, 4, '05');

  /* ★시군구가 한두 곳뿐인 서브 시도는 이것만으로 링크가 스무 개가 안 된다.
     다른 시도의 같은 코스 안내문을 함께 걸어 얇은 안내문이 생기지 않게 한다. */
  const guHere = sd.gu.map((g) => ({ label: `${g.name}`, href: `/${sd.slug}/${g.slug}/` }));
  const deepHere = [];
  for (const g of sd.gu) for (const x of g.spots) deepHere.push({ label: `${g.name} ${x.name}`, href: `/${sd.slug}/${g.slug}/${x.slug}/` });
  const otherCourse = courses.filter((x) => x.slug !== c.slug)
    .map((x) => ({ label: `${sd.name} ${x.ko}`, href: `/${sd.slug}/course/${x.slug}/` }));
  const sameCourse = regions.filter((r) => r.slug !== sd.slug)
    .map((r) => ({ label: `${r.name} ${c.ko}`, href: `/${r.slug}/course/${c.slug}/` }));
  const steps = stepSet(seed);
  const topics = topicLinks([
    { label: `${sd.name}의 다른 코스`, items: otherCourse, anchor: COURSE_ANCHOR },
    { label: `다른 시도에서 받는 ${c.ko}`, items: sameCourse, anchor: COURSE_ANCHOR },
    { label: '코스 설명만 따로', items: courses.map((x) => ({ label: x.ko, href: `/course/${x.slug}/` })), anchor: COURSE_ANCHOR },
    { label: `${sd.name}의 시군구`, items: guHere, pick: 16, anchor: ANCHOR },
    ...(deepHere.length ? [{ label: `${sd.name}의 동 안내`, items: deepHere, pick: 14, anchor: ANCHOR }] : []),
    { label: '이어 읽을 문서', items: DOC_LINKS },
  ], seed, '08', esc(at(h, SEC.topicHead, 8)), esc(at(h, SEC.topicSub, 3)));
  const theme = themeCards({
    pool: sd.main ? spotPool([sd]) : guPool(regions.filter((r) => r.slug !== sd.slug), { sidoLabel: true }),
    noun: sd.main ? '동' : '시군구', seedKey: seed, num: '07',
    heading: esc(at(h, SEC.themeHead, 4)), sub: esc(at(h, SEC.themeSub, 5)), cards: 4, per: 4,
  });

  /* ★서브 시도의 시도×코스는 지역 고유 내용이 적어 얇아진다. 그 시도에 든
     행정동 이름을 그대로 깔아 쪽마다 다른 살을 붙인다(시군구 쪽에도 있는 목록이다). */
  const subNames = [];
  if (!sd.main) for (const g of sd.gu) {
    for (const d of (g.dongNames || [])) subNames.push(`${g.name} ${d}`);
    for (const m of (g.rural || [])) subNames.push(`${g.name} ${m.name}`);
  }
  /* ★한 시도의 코스 쪽 7~9장이 같은 이름 목록을 통째로 이고 있으면 그 덩어리 하나로
     쪽끼리 겹침이 60%%를 넘는다. 쪽마다 시드로 다른 묶음을 보이고 전부는 시도 쪽에 둔다. */
  const nameShow = subNames.length
    ? shuffle(subNames, hash(seed, 'sn')).slice(0, Math.max(10, Math.round(subNames.length * 0.42)))
    : [];
  const namesBlock = nameShow.length
    ? frame('sidodong', 'dong', `${esc(sd.name)} 행정동 중 이름 ${nameShow.length}개`,
        `<ul class="zn-nm">${nameShow.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>`
        + `<p class="zn-sec-x">${esc(sd.name)}의 행정동은 모두 ${subNames.length}곳이다. 나머지는 <a href="/${sd.slug}/">${esc(sd.name)} 안내문</a>에서 시군구별로 이어진다.</p>`,
        '이 가운데 아무 이름이나 불러도 접수가 된다. 전화로 한 번만 말하면 된다.', '03')
    : '';

  const body = [
    open,
    facts,
    hailStrip(cfg, `${sd.name} ${c.ko}`, seed),
    courseRoll(courses, seed, sd.name, '02', { full: false }),
    namesBlock,
    guIndex(sd, seed, null, '04', { pick: 14 }),
    faqHtml,
    stepCards(seed, '06'),
    theme.html,
    topics,
  ].join('\n');

  return {
    path,
    html: layout(ctx, {
      path,
      title: title.sidoCourse(sd, c),
      desc: clampDesc(desc.sidoCourse(sd, c)),
      h1: `${esc(sd.name)} ${esc(c.ko)} <span class="zn-h1-s">출장마사지 홈타이 · ${c.min}분 코스를 ${esc(sd.name)}에서</span>`,
      body,
      pageKind: 'sidocourse',
      about: `${siteUrl}/${sd.slug}/`,
      geo: { iso: sd.iso, placename: sd.full, lat: sd.lat, lng: sd.lng },
      crumbs: [
        { name: '첫 화면', url: `${siteUrl}/` },
        { name: '지역 목록', url: `${siteUrl}/area/` },
        { name: sd.name, url: `${siteUrl}/${sd.slug}/` },
        { name: c.ko, url },
      ],
      jsonld: [
        S.service({
          siteUrl, url, cfg,
          name: `${sd.name} ${c.ko} 출장 방문 관리`,
          desc: clampDesc(desc.sidoCourse(sd, c)),
          areaServed: { '@type': 'AdministrativeArea', name: sd.full },
          courses: [c],
        }),
        S.itemList(`${url}#gulist`, `${sd.name}에서 ${c.ko}를 받는 시군구`, sd.gu.map((x) => ({ name: x.name, url: `${siteUrl}/${sd.slug}/${x.slug}/` }))),
        S.itemList(`${url}#themes`, `${sd.name} ${c.ko} 전에 살펴볼 곳`, theme.list.map((x) => ({ name: x.name, url: `${siteUrl}${x.href}` }))),
        S.faqPage(url, qa),
        S.howTo(url, `${sd.name} ${c.ko} 접수에서 도착까지`, steps, cfg),
      ],
    }),
  };
}
