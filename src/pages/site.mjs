import { layout, frame, callBox } from '../lib/html.mjs';
import { esc, hash, won, josa, shuffle } from '../lib/util.mjs';
import { title, desc, clampDesc } from '../lib/seo.mjs';
import * as S from '../lib/schema.mjs';
import {
  courseRoll, stepCards, stepSet, statTiles, faqBlock, noticeBlock, stripProfile,
  longtail, hailStrip, siteLinks, topicLinks, docTopics, themeCards, spotPool,
} from '../lib/blocks.mjs';
import { SEC, ANCHOR, COURSE_ANCHOR, DOC_LINKS, CLS_ORDER, clsName, fa, fb, fk } from '../content/copy.mjs';
import { POSTS, METHOD_SLUG } from '../content/posts.mjs';

const at = (h, arr, slot = 0) => arr[parseInt(h.substr((slot * 3) % 29, 3), 16) % arr.length];
const baseCtx = (cfg, courses, place) => ({
  place, hours: cfg.hours, pay: cfg.pay, arrive: cfg.arrive,
  tel: cfg.tel, telLabel: cfg.telLabel,
  minPrice: `${won(Math.min(...courses.map((c) => c.price)))}원`,
});
const dt = (ctx, key) => docTopics(ctx, key, '11', esc(at(hash(key, 'dt'), SEC.topicHead, 8)), esc(at(hash(key, 'dt'), SEC.topicSub, 3)));
const notes = (list) => `<ul class="zn-notes">${list.map((p) => `<li><a href="/magazine/${p.slug}/"><b>${esc(p.title)}</b><span>${esc(p.summary)}</span><time datetime="${p.date}">${p.date}</time></a></li>`).join('\n')}</ul>`;

/* 모든 동의 열 토막 몫을 평균 낸 모양 — 대문 오른쪽에 걸어 둔다 */
function meanProfile(regions) {
  const spots = [];
  for (const r of regions) if (r.main) for (const g of r.gu) for (const s of g.spots) spots.push(s);
  const s = Array.from({ length: 10 }, (_, i) => spots.reduce((t, p) => t + p.x.s[i], 0) / spots.length);
  const w = s.indexOf(Math.max(...s));
  let t = 2;
  for (let i = 2; i <= 7; i++) if (s[i] < s[t]) t = i;
  const len = spots.reduce((q, p) => q + p.x.len, 0) / spots.length;
  return { s, w, t, len };
}

/* ── 대문 ─────────────────────────────────────────────────────── */
export function homePage(ctx) {
  const { cfg, siteUrl, courses, regions, counts, latestPosts } = ctx;
  const seed = 'home';
  const h = hash(seed, 'hm');
  const main = regions.filter((r) => r.main);
  const sub = regions.filter((r) => !r.main);
  const mean = meanProfile(regions);

  const hero = `<section class="zn-door" aria-label="첫 안내">
  <div>
    <p class="zn-door-sl">${esc(cfg.brand.slogan)}</p>
    <p class="zn-door-p">가게 문을 열어 두지 않는다. 걸려 온 전화에 적힌 주소로 관리사가 직접 간다. 서울·인천·경기·부산은 동마다 안내문이 있고, 대전·대구·울산과 고른 시·군은 시군구 한 장으로 묶었다.</p>
    ${callBox(cfg, { size: 'l' })}
  </div>
  <div>
    ${stripProfile(mean)}
  </div>
  <dl class="zn-door-f">
    <div><dt>전화 받는 시간</dt><dd>${esc(cfg.hours)}</dd></div>
    <div><dt>값 치르는 때</dt><dd>${esc(cfg.pay)}</dd></div>
    <div><dt>현관까지</dt><dd>${esc(cfg.arrive)}</dd></div>
    <div><dt>펼쳐 둔 쪽수</dt><dd>동 ${counts.spot}개 · 시군구 ${counts.gu}개</dd></div>
  </dl>
</section>`;

  const pick = (r) => {
    if (r.main) {
      return `<li><a class="zn-pick" href="/${r.slug}/"><span class="zn-pick-r"><b>${esc(r.name)}</b><em>허리 ${fa(r.a)}</em></span>${stripProfile(r.x, { mini: true })}<small>동 ${r.spotCount}개 · 시군구 ${r.gu.length}개</small></a></li>`;
    }
    return `<li><a class="zn-pick sub" href="/${r.slug}/"><span class="zn-pick-r"><b>${esc(r.name)}</b><em>평균 ${fa(r.avgA)}</em></span><small>시군구 ${r.gu.length}개를 한 장씩</small></a></li>`;
  };
  const areaBlock = frame('area', 'where', '지역을 누르면 안내문이 열린다',
    `<ul class="zn-picks">${[...main, ...sub].map(pick).join('\n')}</ul>
     <p class="zn-sec-x">카드 속 열 개의 기둥이 그 지역을 가장 긴 방향으로 열 토막 낸 모양이다. 주황 기둥은 가장 두꺼운 토막이고 흰 기둥은 가운데 여섯 토막 중 가장 얇은 토막이다. 위쪽 카드는 동 안내문까지, 아래쪽 카드는 시군구에서 끝난다.
       <a href="/area/">지역 전체 목록</a>은 따로 한 화면에 모았다.</p>`,
    '안내문의 깊이만 다를 뿐 부르는 방법과 값은 어느 지역이나 같다.', '01');

  const whyBlock = frame('why', 'method', '열 토막으로 자르는 까닭',
    `<div class="zn-lead brief">
      <p>땅을 한 숫자로 요약하면 넓이가 남는다. 그런데 같은 넓이라도 둥글게 뭉친 곳과 길쭉하게 늘어진 곳은 찾아가는 느낌이 전혀 다르다. 그래서 가장 길게 뻗은 방향을 찾아 <strong>같은 길이의 열 토막</strong>으로 자르고, 토막마다 땅이 몇 %인지 적었다.</p>
      <p>가운데가 굵은 곳은 어느 토막에서 출발해도 큰 덩어리를 만난다. 가운데가 가늘게 잘록한 곳은 두 덩어리가 가는 목으로 이어진 모양이어서, 주소에 적힌 동 이름이 어느 쪽 덩어리를 가리키는지가 중요해진다. 허리값이 가장 높은 동은 ${esc(counts.hiName)}이고 가장 낮은 동은 ${esc(counts.loName)}이다.</p>
      <p>전국 행정동 ${counts.featAll}개를 같은 순서로 잘랐고, 다시 돌려도 숫자는 달라지지 않는다. 자르는 순서는 <a href="/magazine/${METHOD_SLUG}/">이 글</a>에 적었다.</p>
    </div>`, null, '02');

  const postBlock = frame('note', 'notes', '통화 전에 읽으면 짧아지는 글',
    `${notes(latestPosts)}
     <p class="zn-sec-x"><a href="/magazine/">모든 글 보기</a></p>`,
    '다녀간 사람의 소감은 싣지 않았다. 읽고 나면 전화가 한 마디 줄어드는 내용만 골랐다.', '05');

  const { html: faqHtml, qa } = faqBlock(seed, baseCtx(cfg, courses, '지금 있는 곳'), 6, '06');

  const deep = [];
  for (const r of regions) if (r.main) for (const g of r.gu) for (const s of g.spots) deep.push({ label: `${g.name} ${s.name}`, href: `/${r.slug}/${g.slug}/${s.slug}/` });
  const guList = [];
  for (const r of regions) for (const g of r.gu) guList.push({ label: `${r.name} ${g.name}`, href: `/${r.slug}/${g.slug}/` });
  const courseAll = courses.map((c) => ({ label: c.ko, href: `/course/${c.slug}/` }));
  const sidoCourse = [];
  for (const r of regions) for (const c of courses) sidoCourse.push({ label: `${r.name} ${c.ko}`, href: `/${r.slug}/course/${c.slug}/` });
  const steps = stepSet(seed);
  const topics = topicLinks([
    { label: '코스 하나씩', items: courseAll, anchor: COURSE_ANCHOR },
    { label: '시도에서 받는 코스', items: sidoCourse, pick: 14, anchor: COURSE_ANCHOR },
    { label: '동 안내문 바로 열기', items: deep, pick: 18, anchor: ANCHOR },
    { label: '시군구 안내문', items: guList, pick: 16, anchor: ANCHOR },
    { label: '이어 읽을 문서', items: DOC_LINKS },
  ], seed, '09', esc(at(h, SEC.topicHead, 8)), esc(at(h, SEC.topicSub, 3)));
  const theme = themeCards({
    pool: spotPool(regions, { sidoLabel: true }), noun: '동', seedKey: seed, num: '08',
    heading: esc(at(h, SEC.themeHead, 4)), sub: esc(at(h, SEC.themeSub, 5)), cards: 6, per: 3,
  });

  const body = [
    hero,
    areaBlock,
    whyBlock,
    courseRoll(courses, seed, '부르는 곳', '03'),
    stepCards(seed, '04'),
    postBlock,
    faqHtml,
    noticeBlock(seed, '07'),
    theme.html,
    topics,
    hailStrip(cfg, '지금 있는 곳', seed),
  ].join('\n');

  return {
    path: '/',
    html: layout(ctx, {
      path: '/',
      title: title.home(),
      desc: clampDesc(desc.home()),
      h1: `${esc(cfg.brand.ko)} 출장마사지 홈타이 <span class="zn-h1-s">동 ${counts.spot}개와 시군구 ${counts.gu}개를 열 토막으로 쟀다</span>`,
      body,
      pageKind: 'home',
      crumbs: [{ name: '첫 화면', url: `${siteUrl}/` }],
      jsonld: [
        S.service({
          siteUrl, url: siteUrl + '/', cfg,
          name: `${cfg.brand.ko} 출장마사지 홈타이 방문`,
          desc: clampDesc(desc.home()),
          areaServed: { '@type': 'Country', name: '대한민국' },
          courses,
        }),
        S.itemList(`${siteUrl}/#sidolist`, '찾아가는 시도', regions.map((r) => ({ name: r.name, url: `${siteUrl}/${r.slug}/` }))),
        S.itemList(`${siteUrl}/#themes`, '허리 모양이 같은 동 모음', theme.list.map((x) => ({ name: x.name, url: `${siteUrl}${x.href}` }))),
        S.faqPage(`${siteUrl}/`, qa),
        S.howTo(`${siteUrl}/`, '전화 한 통으로 부르는 다섯 단계', steps, cfg),
      ],
    }),
  };
}

/* ── 지역 허브 ────────────────────────────────────────────────── */
export function areaHub(ctx) {
  const { cfg, siteUrl, regions, counts, courses } = ctx;
  const seed = 'area';

  const open = `<div class="zn-lead brief">
  <p>찾아가는 지역을 시도별로 모았다. 시군구는 ${counts.gu}개이고 그 아래 동 ${counts.spot}개에 안내문이 달려 있다. 읍 ${counts.eup}곳과 면 ${counts.myeon}곳은 쪽을 만들지 않고 이름만 적었는데, 접수는 똑같이 받는다.</p>
  <p>서울·인천·경기·부산은 시군구를 누르면 동 목록이 이어진다. 나머지 시도는 시군구 한 장에 동 이름까지 적혀 있다. 문의가 몰리는 쪽만 한 단계 더 잘게 잘랐기 때문이다.</p>
</div>`;

  const blocks = regions.map((r, i) => frame(`sd-${r.slug}`, r.main ? 'to dong' : 'to district',
    `<a href="/${r.slug}/">${esc(r.name)}</a> ${r.main ? `동 ${r.spotCount}개` : `시군구 ${r.gu.length}개`}`,
    `<ul class="zn-chips">${r.gu.map((g) => `<li><a href="/${r.slug}/${g.slug}/">${esc(g.name)}<b>${fa(g.a)}</b></a></li>`).join('\n')}</ul>`,
    r.main
      ? `${r.name}${josa(r.name, "은/는")} 시군구를 먼저 눌러야 동 목록이 나온다. 이름 옆 작은 숫자는 시군구 전체의 허리값이다.`
      : `${r.name}${josa(r.name, '은/는')} 시군구에서 끝난다. 행정동 ${r.dongCount}개의 이름은 시군구마다 한 장 안에 적혀 있다.`,
    String(i + 1).padStart(2, '0'))).join('\n');

  const { html: faqHtml, qa } = faqBlock(seed, baseCtx(cfg, courses, '있는 곳'), 4, '90');

  const body = [open, hailStrip(cfg, '있는 곳', seed), blocks, faqHtml, stepCards(seed, '91')].join('\n');

  return {
    path: '/area/',
    html: layout(ctx, {
      path: '/area/',
      title: title.areaHub(counts),
      desc: clampDesc(desc.areaHub(counts)),
      h1: `지역 목록 <span class="zn-h1-s">시군구 ${counts.gu}개를 시도별로 펼쳤다</span>`,
      body,
      pageKind: 'areahub',
      crumbs: [{ name: '첫 화면', url: `${siteUrl}/` }, { name: '지역 목록', url: `${siteUrl}/area/` }],
      jsonld: [
        S.collectionPage({ url: `${siteUrl}/area/`, siteUrl, title: title.areaHub(counts), desc: clampDesc(desc.areaHub(counts)), listId: `${siteUrl}/area/#list` }),
        S.itemList(`${siteUrl}/area/#list`, '찾아가는 시도', regions.map((r) => ({ name: r.name, url: `${siteUrl}/${r.slug}/` }))),
        S.service({ siteUrl, url: `${siteUrl}/area/`, cfg, name: `${cfg.brand.ko} 찾아가는 지역`, desc: clampDesc(desc.areaHub(counts)), areaServed: { '@type': 'Country', name: '대한민국' }, courses }),
        S.faqPage(`${siteUrl}/area/`, qa),
        S.howTo(`${siteUrl}/area/`, '있는 곳에서 부르는 다섯 단계', stepSet(seed), cfg),
      ],
    }),
  };
}

/* ── 코스 허브 ────────────────────────────────────────────────── */
export function courseHub(ctx) {
  const { cfg, siteUrl, courses, regions } = ctx;
  const seed = 'coursehub';
  const byPrice = courses.slice().sort((a, b) => a.price - b.price);
  const byLen = courses.slice().sort((a, b) => a.min - b.min);
  const shortest = byLen[0];
  const longest = byLen[byLen.length - 1];

  const open = `<div class="zn-lead brief">
  <p>코스는 아홉 가지이고, 고를 것은 시간과 압, 오일을 쓸지 말지 이 세 가지다. 나머지 취향은 통화 중에 맞춘다.</p>
  <p>가장 짧은 코스는 ${shortest.min}분짜리 ${esc(shortest.ko)}이고 가장 긴 코스는 ${longest.min}분짜리 ${esc(longest.ko)}이다. 오래 받는다고 더 깊은 것은 아니고, 비싸다고 더 잘 맞는 것도 아니다.</p>
</div>`;

  const table = frame('all', 'table', '짧은 코스부터 긴 코스까지',
    `<div class="zn-tw"><table class="zn-t"><thead><tr><th scope="col">이름</th><th scope="col">시간</th><th scope="col">압</th><th scope="col">손놀림</th><th scope="col">오일</th><th scope="col" class="zn-t-w">금액</th></tr></thead>
     <tbody>${byLen.map((c) => `<tr><th scope="row"><a href="/course/${c.slug}/">${esc(c.ko)}</a></th><td>${c.min}분</td><td>${esc(c.pressure)}</td><td>${esc(c.tempo)}</td><td>${c.oil ? '바름' : '없음'}</td><td class="zn-t-w">${won(c.price)}원</td></tr>`).join('\n')}</tbody></table></div>`,
    '받는 시간이 짧은 순서로 세웠다. 지역이 달라져도 같은 표를 쓴다.', '01');

  const pickBy = frame('bycase', 'choose', '몸 상태로 고르기',
    `<ul class="zn-notes">${courses.map((c) => `<li><a href="/course/${c.slug}/"><b>${esc(c.ko)}</b><span>${esc(c.for)}</span></a></li>`).join('\n')}</ul>`,
    '고른 뒤에 바꿔도 된다. 금액은 마지막에 정한 코스로 센다.', '02');

  const { html: faqHtml, qa } = faqBlock(seed, baseCtx(cfg, courses, '있는 곳'), 4, '03');

  const pool = [];
  for (const r of regions) for (const c of courses) pool.push({ label: `${r.name} ${c.ko}`, href: `/${r.slug}/course/${c.slug}/` });

  const body = [open, table, pickBy, hailStrip(cfg, '코스 상담', seed), faqHtml, longtail(pool, seed, 24, 'by region', '시도에서 받는 코스', null, '04')].join('\n');
  const t = title.page(`코스 ${courses.length}가지 출장마사지 홈타이`);
  const d = clampDesc(`출장마사지 홈타이 코스 ${courses.length}가지의 시간, 압, 오일 여부를 한 표에 모았다. ${won(byPrice[0].price)}원부터이고 지역이 달라도 금액은 같다.`);

  return {
    path: '/course/',
    html: layout(ctx, {
      path: '/course/',
      title: t,
      desc: d,
      h1: `코스표 <span class="zn-h1-s">아홉 가지를 시간순으로 세웠다</span>`,
      body,
      pageKind: 'coursehub',
      crumbs: [{ name: '첫 화면', url: `${siteUrl}/` }, { name: '코스표', url: `${siteUrl}/course/` }],
      jsonld: [
        S.collectionPage({ url: `${siteUrl}/course/`, siteUrl, title: t, desc: d, listId: `${siteUrl}/course/#list` }),
        S.itemList(`${siteUrl}/course/#list`, '코스', courses.map((c) => ({ name: c.ko, url: `${siteUrl}/course/${c.slug}/` }))),
        S.aggregateOffer(`${siteUrl}/course/`, courses, cfg),
        S.service({ siteUrl, url: `${siteUrl}/course/`, cfg, name: `${cfg.brand.ko} 코스 ${courses.length}가지`, desc: d, areaServed: { '@type': 'Country', name: '대한민국' }, courses }),
        S.faqPage(`${siteUrl}/course/`, qa),
      ],
    }),
  };
}

/* ── 비용 ─────────────────────────────────────────────────────── */
export function pricePage(ctx) {
  const { cfg, siteUrl, courses } = ctx;
  const seed = 'price';
  const sorted = courses.slice().sort((a, b) => a.price - b.price);
  const top = sorted[sorted.length - 1].price;

  const open = `<div class="zn-lead brief">
  <p>금액은 코스마다 하나뿐이고 아래 막대가 전부다. 여기 없는 이름으로 돈이 더 붙는 일은 없다.</p>
  <p>걸어서 5분 거리든 차로 한 시간 들어가는 마을이든 같은 코스는 같은 금액이다. 가는 길의 수고는 이쪽에서 감당한다.</p>
</div>`;

  const ladder = frame('tbl', 'prices', '금액이 낮은 코스부터',
    `<ul class="zn-bl">${sorted.map((c) => `<li><a href="/course/${c.slug}/"><span>${esc(c.ko)}</span><s><i style="width:${Math.round((c.price / top) * 100)}%"></i></s><b>${(c.price / 10000).toFixed(1)}만</b></a></li>`).join('\n')}</ul>
     <p class="zn-sec-x">막대 끝의 숫자는 만 원 단위로 줄여 적은 값이다. 정확한 금액과 시간은 코스 쪽에 있다.</p>`,
    '시간을 잘라서 파는 방식은 쓰지 않는다. 코스를 고르면 그 길이를 끝까지 채운다.', '01');

  const noExtra = frame('nox', 'never', '붙지 않는 항목',
    `<ul class="zn-lk">
      <li>이동 거리에 따른 교통비</li>
      <li>자정을 넘긴 시각의 할증</li>
      <li>명절이나 공휴일 가산</li>
      <li>예약금과 보증금 같은 선입금</li>
      <li>시각을 옮기거나 접을 때의 수수료</li>
      <li>주차 요금</li>
    </ul>`,
    '먼저 돈을 보내라는 문자나 전화가 왔다면 이쪽에서 보낸 것이 아니다.', '02');

  const pay = frame('how', 'payment', '치르는 방법',
    statTiles([
      ['언제', '관리가 끝난 그 자리에서'],
      ['무엇으로', '현금도 카드도 된다'],
      ['영수증', '말하면 그 자리에서 건넨다'],
      ['시간을 늘릴 때', '접수 때 알려 두면 늘어난 분량만 더해 센다'],
      ['둘이 받을 때', '인원수대로 센다. 함께 받는다고 덜어 주지는 않는다'],
    ]), null, '03');

  const { html: faqHtml, qa } = faqBlock(seed, baseCtx(cfg, courses, '있는 곳'), 4, '04');
  const d = clampDesc(`코스별 시간과 금액을 막대로 정리했다. ${won(sorted[0].price)}원부터이고 교통비, 밤 할증, 예약금이 없으며 마친 뒤 현금이나 카드로 치른다.`);

  const body = [open, ladder, noExtra, pay, hailStrip(cfg, '비용 확인', seed), faqHtml, dt(ctx, seed), siteLinks(ctx, seed)].join('\n');

  return {
    path: '/price/',
    html: layout(ctx, {
      path: '/price/',
      title: title.page(`금액 ${won(sorted[0].price)}원부터`),
      desc: d,
      h1: `금액 <span class="zn-h1-s">${won(sorted[0].price)}원에서 ${won(top)}원까지, 그 밖의 항목은 없다</span>`,
      body,
      pageKind: 'price',
      crumbs: [{ name: '첫 화면', url: `${siteUrl}/` }, { name: '금액', url: `${siteUrl}/price/` }],
      jsonld: [
        S.aggregateOffer(`${siteUrl}/price/`, courses, cfg),
        S.service({ siteUrl, url: `${siteUrl}/price/`, cfg, name: `${cfg.brand.ko} 코스별 비용`, desc: d, areaServed: { '@type': 'Country', name: '대한민국' }, courses }),
        S.faqPage(`${siteUrl}/price/`, qa),
      ],
    }),
  };
}

/* ── 시작 전에 ──────────────────────────────────────────────── */
export function guidePage(ctx) {
  const { cfg, siteUrl, courses } = ctx;
  const seed = 'guide';

  const open = `<div class="zn-lead brief">
  <p>처음 전화하는 사람을 기준으로 추렸다. 통화 한 번이면 접수가 끝나므로 오래 읽을 필요는 없다.</p>
</div>`;

  const what = frame('need', 'ready', '방에 마련해 둘 것',
    `<ul class="zn-lk">
      <li>누울 자리 하나. 침대도 바닥도 괜찮다</li>
      <li>수건 두 장. 오일을 쓰지 않는 코스라면 한 장이어도 된다</li>
      <li>닫을 수 있는 문이 달린 방. 가족이 집에 있어도 상관없다</li>
    </ul>
    <p class="zn-sec-x">매트와 오일, 향초는 관리사의 가방에 들어 있다. 따로 살 것은 없다.</p>`,
    null, '01');

  const timing = frame('when', 'hours', '언제 걸어도 되는가',
    statTiles([
      ['전화 받는 시간', `${esc(cfg.hours)}<small>새벽에 걸어도 같은 번호가 받는다</small>`],
      ['현관 앞까지', `보통 ${esc(cfg.arrive)}<small>골목 깊숙한 집이면 조금 더 걸린다</small>`],
      ['시각 바꾸기', '언제든 된다. 비용은 붙지 않는다'],
      ['접을 때', '관리사가 이미 문 앞에 있다면 그 사실만 말해 주면 된다'],
      ['전화가 몰리는 때', '주말 앞뒤의 밤'],
      ['한가한 때', '평일 낮에는 거의 곧바로 나간다'],
    ]), null, '02');

  const refuse = frame('no', 'declined', '접수를 받지 못하는 경우',
    `<ul class="zn-lk">
      <li>성적인 말이 섞인 통화는 그 자리에서 끊는다</li>
      <li>열이 있거나 부어오른 상처가 있는 몸은 날을 다시 잡는다</li>
      <li>주소의 끝자리를 알려 주지 않으면 사람을 보낼 수 없다</li>
      <li>관리사의 개인 연락처를 묻는 요청은 받지 않는다</li>
      <li>병원이 먼저인 증상은 병원을 권한다</li>
      <li>만 19세가 되지 않은 사람은 이용할 수 없다</li>
    </ul>`,
    '받지 못한 접수에는 어떤 비용도 매기지 않는다.', '03');

  const { html: faqHtml, qa } = faqBlock(seed, baseCtx(cfg, courses, '부르는 곳'), 6, '05');
  const d = clampDesc('처음 전화하는 사람을 위해 준비물, 전화 받는 시간, 접수를 받지 못하는 경우, 값 치르는 방법을 차례로 적었다.');

  const body = [open, what, timing, stepCards(seed, '04'), refuse, hailStrip(cfg, '처음 이용', seed), faqHtml, noticeBlock(seed, '06'), dt(ctx, seed), siteLinks(ctx, seed)].join('\n');

  return {
    path: '/guide/',
    html: layout(ctx, {
      path: '/guide/',
      title: title.page('처음 부르는 사람을 위한 안내'),
      desc: d,
      h1: `처음이라면 <span class="zn-h1-s">전화를 끊는 순간 접수가 끝난다</span>`,
      body,
      pageKind: 'guide',
      crumbs: [{ name: '첫 화면', url: `${siteUrl}/` }, { name: '처음이라면', url: `${siteUrl}/guide/` }],
      jsonld: [
        S.howTo(`${siteUrl}/guide/`, '처음 부를 때 거치는 다섯 단계', stepSet(seed), cfg),
        S.service({ siteUrl, url: `${siteUrl}/guide/`, cfg, name: `${cfg.brand.ko} 이용 안내`, desc: d, areaServed: { '@type': 'Country', name: '대한민국' }, courses }),
        S.faqPage(`${siteUrl}/guide/`, qa),
      ],
    }),
  };
}

/* ── 소개 ─────────────────────────────────────────────────────── */
export function companyPage(ctx) {
  const { cfg, siteUrl, counts, data } = ctx;
  const seed = 'company';
  const classLine = CLS_ORDER.map((k, i) => `${clsName(k)} ${counts.clsCount[i]}곳`).join(' · ');

  const open = `<div class="zn-lead brief">
  <p>${esc(cfg.brand.ko)}(${esc(cfg.brand.en)})는 매장 없이 방문으로만 일한다. 업소를 줄 세워 보여 주는 목록이 아니라, 전화를 받는 쪽과 찾아가는 쪽이 같은 곳이다.</p>
  <p>이름은 가장 높은 지점을 뜻하는 말에서 왔다. 안내문 맨 위에서도 열 개의 기둥 가운데 가장 높은 기둥부터 눈에 들어오도록 만들었다.</p>
</div>`;

  const line = frame('line', 'limits', '하는 일과 하지 않는 일',
    `<ul class="zn-lk">
      <li>하는 일: 굳은 근육을 손으로 풀어 주는 관리</li>
      <li>하지 않는 일: 성적인 서비스. 어떤 형태로도 하지 않는다</li>
      <li>하지 않는 일: 병을 진단하거나 치료하는 행위. 병원의 몫이다</li>
      <li>받지 않는 사람: 만 19세가 되지 않은 사람</li>
      <li>싣지 않는 것: 후기와 별점. 진짜인지 가려낼 방법이 없다</li>
      <li>싣지 않는 것: 사람 사진. 사진 속 인물과 다른 사람이 갈 수 있다</li>
      <li>받지 않는 돈: 방문 전에 내는 모든 돈</li>
    </ul>`, null, '01');

  const how = frame('data', 'sources', '열 토막은 이렇게 잘랐다',
    `<div class="zn-lead brief">
      <p>공개된 행정동 경계 ${counts.featAll}개를 시도마다 한 장의 평면 위에 올렸다. 그다음 땅이 가장 길게 뻗은 방향을 찾고, 그 방향의 양 끝 사이를 같은 길이로 열 칸 나누어 칸마다 들어 있는 땅의 넓이를 쟀다.</p>
      <p>열 칸의 넓이를 합쳐 100으로 맞추면 칸마다 몫이 나온다. 두꺼운 쪽 끝이 늘 첫 토막이 되도록 방향을 정했기 때문에 모든 지역이 같은 쪽에서 읽힌다. 셋째부터 여덟째 토막 가운데 가장 얇은 칸을 가장 두꺼운 칸으로 나눈 값이 허리값이며, 낮을수록 가운데가 잘록하다.</p>
      <p>허리 모양은 일곱 갈래로 나눴다. ${esc(classLine)}. 한 토막에 몰린 땅이 가장 큰 곳은 ${esc(counts.bHiName)}으로 ${fb(counts.bq.max)}%가 한 토막에 들어 있다.</p>
      <p>이 숫자는 행정 경계의 모양만 잰 것이다. 집이 어디에 모여 있는지, 길이 얼마나 막히는지는 말해 주지 않으니 그 점을 감안해서 읽어야 한다.</p>
    </div>
    ${statTiles([
      ['내려받은 곳', esc(data.source)],
      ['내려받은 판', esc(data.version)],
      ['재려는 것', esc(data.axis)],
      ['계산 순서', esc(data.method)],
      ['쪽을 두는 범위', esc(data.coverageFrom)],
      ['쪽의 수', `시도 ${counts.sido}개 아래 시군구 ${counts.gu}개, 그 아래 동 ${counts.spot}개`],
      ['쪽 없이 이름만', `읍 ${counts.eup}곳과 면 ${counts.myeon}곳<small>시군구 쪽 목록에 한 줄씩 적었다</small>`],
      ['허리값이 가장 높은 동', esc(counts.hiName)],
      ['허리값이 가장 낮은 동', esc(counts.loName)],
    ])}`, null, '02');

  const d = clampDesc(`${cfg.brand.ko}가 하는 일과 하지 않는 일, 그리고 지역 안내문의 열 토막 몫과 허리값을 어떤 자료와 순서로 얻었는지 적었다.`);
  const body = [open, line, how, hailStrip(cfg, '문의', seed), dt(ctx, seed), siteLinks(ctx, seed)].join('\n');

  return {
    path: '/company/',
    html: layout(ctx, {
      path: '/company/',
      title: title.page(`${cfg.brand.ko} 소개`),
      desc: d,
      h1: `${esc(cfg.brand.ko)} 소개 <span class="zn-h1-s">지키는 선과 숫자를 얻는 순서</span>`,
      body,
      pageKind: 'company',
      crumbs: [{ name: '첫 화면', url: `${siteUrl}/` }, { name: '소개', url: `${siteUrl}/company/` }],
      jsonld: [S.aboutPage({ url: `${siteUrl}/company/`, siteUrl, title: title.page(`${cfg.brand.ko} 소개`), desc: d })],
    }),
  };
}

/* ── 이용약관 ─────────────────────────────────────────────────── */
const TERMS = [
  ['제1조 (목적)', '이 약관은 제니스글로우(이하 "회사")가 이용자가 지정한 장소에 관리사를 보내 관리를 제공할 때의 조건과 절차, 회사와 이용자 각자의 책임을 정하기 위해 만들었다.'],
  ['제2조 (접수)', '접수는 화면에 적힌 전화번호로 거는 통화로만 받는다. 게시판, 채팅, 전자우편으로는 받지 않는다. 통화에서 코스, 주소, 시각이 정해지면 접수가 끝난 것으로 본다.'],
  ['제3조 (관리의 내용)', '회사는 이용자가 정한 장소에서 관리사가 뭉친 근육을 손으로 푸는 관리를 한다. 질병의 진단이나 치료, 성적인 행위는 하지 않는다.'],
  ['제4조 (연령)', '만 19세 이상만 이용할 수 있다. 보호자가 함께 있더라도 나이가 되지 않으면 접수하지 않는다.'],
  ['제5조 (화면 속 숫자의 성격)', '화면에 나오는 열 토막 몫, 허리값, 두꺼운 토막 몫, 허리 모양은 공개된 행정동 경계를 가장 긴 방향으로 열 칸 나누어 칸별 넓이를 계산한 값이다. 실제 도로 사정이나 이동 시간을 약속하는 숫자가 아니며, 지역의 땅 모양을 참고하도록 적어 둔 자료이다.'],
  ['제6조 (금액과 치르는 방법)', '금액은 코스별 비용 쪽에 적힌 대로이며 지역에 따라 달라지지 않는다. 대금은 관리가 끝난 자리에서 현금이나 카드 중 편한 쪽으로 치른다. 예약금, 보증금처럼 먼저 받는 돈은 이름을 바꾸어도 받지 않는다.'],
  ['제7조 (일정 변경과 취소)', '관리사가 출발하기 전이라면 시각을 바꾸거나 취소해도 위약금이 없다. 이미 현관 앞에 도착했다면 그 사실을 바로 알려야 한다.'],
  ['제8조 (거절과 중단)', '다음 사유가 있으면 접수를 거절하거나 진행 중인 관리를 멈출 수 있다. 1. 성적인 행위를 요구하는 경우. 2. 관리사에게 거친 말이나 손찌검을 하거나 관리사의 사적인 연락처를 캐묻는 경우. 3. 방문할 주소의 끝자리를 알려 주지 않는 경우. 4. 발열이나 낫지 않은 상처 때문에 관리가 맞지 않는 경우.'],
  ['제9조 (이용자의 준비)', '이용자는 관리를 받을 공간과 수건을 마련하고, 관리에 영향을 줄 건강 상태를 통화에서 밝혀야 한다. 멍이 쉽게 드는 체질이라면 경락 코스를 정하기 전에 알려야 한다.'],
  ['제10조 (후기와 평점)', '회사는 후기와 평점을 받지도 게시하지도 않는다. 화면의 문장은 특정 이용자의 경험을 옮긴 것이 아니다.'],
  ['제11조 (도중에 멈춘 경우)', '이용자의 요청이나 몸 상태 때문에 멈추면 지나간 시간만큼만 센다. 시작한 지 10분이 되지 않았다면 받지 않는다. 제8조에 따라 회사가 멈춘 경우에도 그때까지의 시간은 금액에 포함한다.'],
  ['제12조 (책임)', '관리 중 회사의 잘못으로 손해가 생기면 회사가 배상한다. 이용자가 밝히지 않은 건강 상태로 생긴 손해, 천재지변이나 통신 장애로 늦어진 일에 대해서는 책임지지 않는다.'],
  ['제13조 (약관 개정)', '약관을 고치면 화면에 먼저 알리고 알린 날부터 적용한다. 개정 뒤에 접수하면 바뀐 내용에 동의한 것으로 본다.'],
];

export function termsPage(ctx) {
  const { cfg, siteUrl } = ctx;
  const body = [
    `<div class="zn-lead brief"><p>${esc(cfg.brand.ko)} 이용약관 전문이다. 접수 전화를 건 순간부터 이 내용을 따르는 것으로 본다.</p></div>`,
    frame('terms', 'terms', '약관 전문', `<div class="zn-doc">${TERMS.map(([t, d]) => `<section><h2>${esc(t)}</h2><p>${esc(d)}</p></section>`).join('')}</div>`, null, '01'),
    hailStrip(cfg, '약관 문의', 'terms'),
    dt(ctx, 'terms'),
    siteLinks(ctx, 'terms'),
  ].join('\n');
  return {
    path: '/terms/',
    html: layout(ctx, {
      path: '/terms/',
      title: title.page('이용약관'),
      desc: clampDesc(`${cfg.brand.ko} 출장 방문 관리의 이용약관 전문이다. 접수, 관리 내용, 금액과 치르는 방법, 일정 변경과 취소를 ${TERMS.length}개 조문으로 적었다.`),
      h1: `이용약관 <span class="zn-h1-s">조문 ${TERMS.length}개 전문</span>`,
      body,
      pageKind: 'terms',
      crumbs: [{ name: '첫 화면', url: `${siteUrl}/` }, { name: '이용약관', url: `${siteUrl}/terms/` }],
    }),
  };
}

/* ── 개인정보처리방침 ─────────────────────────────────────────── */
const PRIVACY = [
  ['1. 받아 적는 항목', '접수 통화에서 적는 것은 방문할 주소, 연락이 닿는 번호, 고른 코스, 원하는 시각 네 가지이다. 이름, 생년월일, 주민등록번호는 묻지 않는다.'],
  ['2. 쓰는 목적', '적어 둔 내용은 관리사를 배정하고 출발과 도착을 알리는 데에만 쓴다. 그 뒤에 광고 문자를 보내거나 먼저 전화하는 일은 없다.'],
  ['3. 번호를 보는 사람', '접수에서 알게 된 번호는 방문이 끝날 때까지 접수 담당자와 배정된 관리사만 볼 수 있다.'],
  ['4. 보관 기간', '방문이 문제없이 끝나면 그날 안에 지운다. 다툼이 생긴 건만 정리될 때까지 따로 보관한다.'],
  ['5. 제3자 제공', '다른 업체에 넘기거나 처리를 맡기지 않는다. 법령에 따른 수사기관의 정당한 요청이 있을 때만 예외로 한다.'],
  ['6. 자동으로 모이는 정보', '이 사이트는 미리 만들어 둔 파일을 보여 줄 뿐이다. 로그인, 장바구니, 댓글이 없고 광고 추적이나 방문 분석 스크립트도 넣지 않았으며 쿠키도 쓰지 않는다.'],
  ['7. 이용자의 권리', '회사가 가진 자신의 정보를 보여 달라거나 지워 달라고 요청할 수 있다. 화면의 번호로 전화하면 그 통화에서 바로 처리한다.'],
  ['8. 담당자', '운영자 표기가 정해지면 이 항목과 화면 맨 아래에 함께 올린다. 그전에는 화면의 번호가 문의 창구이다.'],
];

export function privacyPage(ctx) {
  const { cfg, siteUrl } = ctx;
  const body = [
    `<div class="zn-lead brief"><p>받아 적는 항목이 네 개뿐이라 방침도 짧다.</p></div>`,
    frame('pp', 'privacy', '방침 전문', `<div class="zn-doc">${PRIVACY.map(([t, d]) => `<section><h2>${esc(t)}</h2><p>${esc(d)}</p></section>`).join('')}</div>`, null, '01'),
    hailStrip(cfg, '개인정보 문의', 'privacy'),
    dt(ctx, 'privacy'),
    siteLinks(ctx, 'privacy'),
  ].join('\n');
  return {
    path: '/privacy/',
    html: layout(ctx, {
      path: '/privacy/',
      title: title.page('개인정보처리방침'),
      desc: clampDesc('접수 통화에서 받아 적는 항목과 쓰는 목적, 보관 기간을 정리했다. 쿠키와 추적 스크립트를 쓰지 않는 정적 사이트이다.'),
      h1: `개인정보처리방침 <span class="zn-h1-s">받아 적는 것은 네 가지</span>`,
      body,
      pageKind: 'privacy',
      crumbs: [{ name: '첫 화면', url: `${siteUrl}/` }, { name: '개인정보처리방침', url: `${siteUrl}/privacy/` }],
    }),
  };
}

/* ── 글 목록 ──────────────────────────────────────────────────── */
export function magazineIndex(ctx) {
  const { cfg, siteUrl } = ctx;
  const list = POSTS.slice().sort((a, b) => b.date.localeCompare(a.date));
  const body = [
    `<div class="zn-lead brief"><p>전화하기 전에 알아 두면 통화가 짧아지는 이야기만 모았다. 소감과 별점은 올리지 않는다.</p></div>`,
    frame('list', 'notes', `글 ${list.length}편`, notes(list), '새 글은 RSS로도 나간다.', '01'),
    hailStrip(cfg, '접수', 'magazine'),
    dt(ctx, 'magazine'),
    siteLinks(ctx, 'magazine'),
  ].join('\n');
  const d = clampDesc(`전화하기 전에 정해 두면 편한 것들을 ${list.length}편으로 적었다. 후기와 체험담은 두지 않는다.`);
  return {
    path: '/magazine/',
    html: layout(ctx, {
      path: '/magazine/',
      title: title.page('허리 기록 글 모음'),
      desc: d,
      h1: `허리 기록 <span class="zn-h1-s">읽을 글 ${list.length}편</span>`,
      body,
      pageKind: 'magazine',
      crumbs: [{ name: '첫 화면', url: `${siteUrl}/` }, { name: '허리 기록', url: `${siteUrl}/magazine/` }],
      jsonld: [
        S.collectionPage({ url: `${siteUrl}/magazine/`, siteUrl, title: title.page('허리 기록 글 모음'), desc: d, listId: `${siteUrl}/magazine/#list` }),
        S.itemList(`${siteUrl}/magazine/#list`, '허리 기록', list.map((p) => ({ name: p.title, url: `${siteUrl}/magazine/${p.slug}/` }))),
      ],
    }),
  };
}

export function postPage(ctx, p) {
  const { cfg, siteUrl } = ctx;
  const path = `/magazine/${p.slug}/`;
  const url = `${siteUrl}${path}`;
  const html = p.body.map((b) => {
    if (typeof b === 'string') return `<p>${b.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`;
    if (b[0] === 'h3') return `<h2>${esc(b[1])}</h2>`;
    if (b[0] === 'ul') return `<ul>${b[1].map((x) => `<li>${esc(x)}</li>`).join('\n')}</ul>`;
    return '';
  }).join('\n');

  const others = POSTS.filter((x) => x.slug !== p.slug).slice(0, 4);
  const body = [
    `<p class="zn-dated"><time datetime="${p.date}">${p.date}</time> · ${esc(cfg.brand.ko)} 허리 기록</p>`,
    `<article class="zn-piece">${html}</article>`,
    hailStrip(cfg, '접수', p.slug),
    frame('more', 'next', '다음에 읽을 글', notes(others), null, '01'),
    dt(ctx, p.slug),
    siteLinks(ctx, p.slug),
  ].join('\n');

  return {
    path,
    html: layout(ctx, {
      path,
      title: title.post(p),
      desc: clampDesc(desc.post(p)),
      h1: esc(p.title),
      body,
      pageKind: 'post',
      crumbs: [
        { name: '첫 화면', url: `${siteUrl}/` },
        { name: '허리 기록', url: `${siteUrl}/magazine/` },
        { name: p.title, url },
      ],
      jsonld: [S.article({ url, siteUrl, title: p.title, desc: p.summary, date: p.date, cfg })],
    }),
  };
}

/* ── 404 ──────────────────────────────────────────────────────── */
export function notFound(ctx) {
  const { cfg, regions } = ctx;
  const sd = shuffle(regions, hash('404', 'sd'));
  const body = [
    `<div class="zn-lead brief"><p>이 주소에는 안내문이 없다. 주소가 바뀌었거나 처음부터 만든 적이 없는 곳이다. 아래에서 다시 고르면 된다.</p></div>`,
    frame('back', 'back', '여기서 다시 시작',
      `<ul class="zn-chips"><li><a href="/">첫 화면</a></li><li><a href="/area/">지역 목록</a></li><li><a href="/course/">코스표</a></li><li><a href="/price/">금액</a></li><li><a href="/guide/">처음이라면</a></li>${sd.map((r) => `<li><a href="/${r.slug}/">${esc(r.name)}</a></li>`).join('')}</ul>`, null, '01'),
    hailStrip(cfg, '바로 접수', '404'),
  ].join('\n');
  return {
    path: '/404.html',
    html: layout(ctx, {
      path: '/404.html',
      title: title.page('없는 주소'),
      desc: '이 주소로 만든 안내문이 없다. 아래에서 다시 고르면 된다.',
      h1: '없는 주소',
      body,
      noindex: true,
      pageKind: '404',
    }),
  };
}
