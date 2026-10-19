import { esc } from './util.mjs';
import * as S from './schema.mjs';
import { STRIPMARK } from '../assets.mjs';

export const ASSET_V = '1';

/**
 * 공통 뼈대.
 *   머리 — 눈금자 띠 + 밑줄 글자 메뉴 + 네모 버튼
 *   발   — 출처·최신성·수집 경로 + AI 활용 고지
 * 전화번호는 callBox() 로만 찍는다. 라벨은 '예약 문의' 하나다.
 */
export function layout(ctx, opts) {
  const { cfg, siteUrl, latestPosts } = ctx;
  const {
    path, title, desc, h1, body, jsonld = [], geo, crumbs = [],
    noindex = false, pageKind = '', pageType = '', about = '', mainList = '',
  } = opts;
  const url = `${siteUrl}${path}`;
  const graph = S.graph([
    S.organization(cfg, siteUrl),
    S.website(cfg, siteUrl),
    crumbs.length ? S.breadcrumb(url, crumbs) : null,
    S.webpage({ url, siteUrl, title, desc, breadcrumbId: crumbs.length ? `${url}#crumb` : null, pageType, about, mainList }),
    ...jsonld,
  ]);

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
${cfg.naverVerification ? `<meta name="naver-site-verification" content="${esc(cfg.naverVerification)}"/>` : ''}
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1'}">
<meta name="format-detection" content="telephone=yes">
<meta name="author" content="${esc(cfg.brand.ko)}">
<meta name="theme-color" content="#0B2540">
${geo ? `<meta name="geo.region" content="${esc(geo.iso)}">
<meta name="geo.placename" content="${esc(geo.placename)}">
<meta name="geo.position" content="${geo.lat};${geo.lng}">
<meta name="ICBM" content="${geo.lat}, ${geo.lng}">` : '<meta name="geo.region" content="KR">'}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(cfg.brand.ko)} 출장마사지">
<meta property="og:locale" content="ko_KR">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${siteUrl}/assets/og.svg">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
<link rel="alternate" type="application/rss+xml" title="${esc(cfg.rssTitle)}" href="${siteUrl}/rss.xml">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/favicon.svg">
<link rel="manifest" href="/site.webmanifest">
<link rel="stylesheet" href="/assets/zn.css?v=${ASSET_V}">
<script type="application/ld+json">${graph}</script>
</head>
<body data-kind="${pageKind}">
<a class="hop" href="#main">본문으로 가기</a>
${header(ctx, path)}
${crumbs.length > 1 ? wayHtml(crumbs) : ''}
<main id="main">
<h1 class="zn-h1">${h1}</h1>
${body}
</main>
${footer(ctx, latestPosts)}
${floatBar(cfg)}
<script src="/assets/zn.js?v=${ASSET_V}" defer></script>
</body>
</html>`;
}

/** 예약 문의 버튼. size: s(머리) · m(본문) · l(아래 떠 있는 것) */
export function callBox(cfg, { size = 'm', bar = false } = {}) {
  return `<a class="callbox callbox-${size}${bar ? ' callbox-b' : ''}" href="tel:${cfg.telRaw}">
  <span class="callbox-i" aria-hidden="true"></span>
  <span class="callbox-t"><span class="callbox-k">${esc(cfg.telLabel)}</span><span class="callbox-v">${esc(cfg.tel)}</span></span>
</a>`;
}

function header(ctx, path) {
  const { cfg } = ctx;
  const on = (p) => (path === p || (p !== '/' && path.startsWith(p)) ? ' aria-current="page"' : '');
  const menu = [['/area/', '방문 지역'], ['/course/', '코스표'], ['/price/', '금액'], ['/guide/', '이용 순서'], ['/magazine/', '허리 기록']];
  return `<header class="zn-head">
  <div class="zn-head-in">
    <a class="zn-brand" href="/" aria-label="${esc(cfg.brand.ko)} 첫 화면">${STRIPMARK()}<b>${esc(cfg.brand.ko)}</b></a>
    <nav aria-label="주요 메뉴"><ul class="zn-nav">${menu.map(([h, t]) => `<li><a href="${h}"${on(h)}>${t}</a></li>`).join('')}</ul></nav>
    ${callBox(cfg, { size: 's' })}
  </div>
  <div class="zn-band" aria-hidden="true">${Array.from({ length: 10 }, () => '<i></i>').join('')}</div>
</header>`;
}

function wayHtml(crumbs) {
  return `<nav class="zn-way" aria-label="현재 위치"><ol>${crumbs
    .map((c, i) => (i === crumbs.length - 1
      ? `<li><span aria-current="page">${esc(c.name)}</span></li>`
      : `<li><a href="${c.url.replace(/^https?:\/\/[^/]+/, '')}">${esc(c.name)}</a></li>`))
    .join('')}</ol></nav>`;
}

/** 발 — 어두운 바탕에 위쪽 소개·번호, 아래쪽 링크 두 줄, 맨 아래 고지 */
function footer(ctx, latestPosts = []) {
  const { cfg, regions, counts, data, updated } = ctx;
  const b = cfg.business || {};
  const biz = [
    b.name ? `상호 ${esc(b.name)}` : '',
    b.owner ? `대표 ${esc(b.owner)}` : '',
    b.regNo ? `사업자등록번호 ${esc(b.regNo)}` : '',
    b.address ? `주소 ${esc(b.address)}` : '',
    b.privacyOfficer ? `개인정보 담당자 ${esc(b.privacyOfficer)}` : '',
    b.email ? `문의 ${esc(b.email)}` : '',
  ].filter(Boolean).join(' · ');
  const byKo = (a, b) => (a.name < b.name ? -1 : 1);
  const main = regions.filter((r) => r.main).sort(byKo);
  const sub = regions.filter((r) => !r.main).sort(byKo);

  return `<footer class="zn-foot">
  <div class="zn-foot-top">
    <section aria-label="${esc(cfg.brand.ko)} 소개">
      <p class="zn-foot-nm">${esc(cfg.brand.ko)}</p>
      <p class="zn-foot-say">가게를 두지 않고 전화가 오면 관리사가 그 주소로 직접 간다. 시군구 ${counts.gu}곳과 동 ${counts.spot}구역 어디에서든 접수 번호는 하나이다.</p>
    </section>
    <div class="zn-foot-call">
      ${callBox(cfg, { size: 'm' })}
      <p class="zn-foot-run">${esc(cfg.hours)} · ${esc(cfg.pay)} · 선입금 없음</p>
    </div>
  </div>
  <div class="zn-foot-mid">
    <nav aria-label="지역 바로가기">
      <h2 class="zn-foot-h">동 단위로 여는 시도</h2>
      <p class="zn-pipes">${main.map((r) => `<a href="/${r.slug}/">${esc(r.name)}</a>`).join('')}</p>
      <h2 class="zn-foot-h">시군구 단위로 여는 시도</h2>
      <p class="zn-pipes">${sub.map((r) => `<a href="/${r.slug}/">${esc(r.name)}</a>`).join('')}</p>
      <p class="zn-foot-sm"><a href="/area/">방문 지역 전체</a> · 읍·면 ${counts.rural}곳은 이름으로만 올렸다</p>
    </nav>
    <div>
      <h2 class="zn-foot-h">문서 모음</h2>
      <p class="zn-pipes"><a href="/guide/">이용 순서</a><a href="/price/">금액</a><a href="/course/">코스표</a><a href="/company/">운영 소개</a><a href="/terms/">이용약관</a><a href="/privacy/">개인정보처리방침</a></p>
      <h2 class="zn-foot-h">새로 쓴 기록</h2>
      <ul class="zn-foot-ul">${latestPosts.slice(0, 3).map((p) => `<li><a href="${p.path}">${esc(p.title)}</a><time datetime="${p.date}">${p.date}</time></li>`).join('')}</ul>
      <h2 class="zn-foot-h">기계가 읽는 주소</h2>
      <p class="zn-pipes"><a href="/rss.xml">구독 피드</a><a href="/sitemap.xml">전체 주소록</a><a href="/llms.txt">AI용 안내문</a></p>
      <p class="zn-foot-sm">최근 갱신 <time datetime="@@LM@@">@@LM@@</time></p>
    </div>
  </div>
  <div class="zn-foot-end">
    ${biz ? `<p class="zn-biz">${biz}</p>` : '<p class="zn-biz zn-pale">운영자 표기는 확정되는 대로 이 줄에 적는다.</p>'}
    <p class="zn-ai">지역마다 적은 열 토막 몫과 허리값은 공개된 행정동 경계를 프로그램이 직접 잘라 계산한 숫자이다. 문장은 <strong>AI 도구의 도움으로 초안을 만든 뒤</strong> 사람이 다듬어 올렸다. 후기·체험담·별점은 받지도 싣지도 않으며 인물 사진도 쓰지 않는다. 바탕 자료: ${esc(data.source)}</p>
    <p class="zn-cr">© ${esc(updated.slice(0, 4))} ${esc(cfg.brand.ko)}. 의료 행위를 하는 곳이 아니며 성적인 서비스는 하지 않는다.</p>
  </div>
</footer>`;
}

/** 화면 아래에 붙어 다니는 띠 */
function floatBar(cfg) {
  return `<div class="zn-bar">
  <span class="zn-bar-s">도착까지<br>${esc(cfg.arrive.replace(/^접수 후 /, ''))}</span>
  ${callBox(cfg, { size: 'l' })}
</div>`;
}

/**
 * 칸 틀 — 왼쪽 제목, 오른쪽 끝에 속이 빈 큰 번호, 굵은 밑줄. 부제는 그 아래 한 줄.
 */
export function frame(id, label, h2, inner, sub, n) {
  return `<section class="zn-sec" id="${id}" aria-labelledby="${id}-h">
  <header class="zn-sec-h">
    <h2 id="${id}-h">${h2}</h2>
    ${n ? `<span class="zn-n" aria-hidden="true">${esc(n)}</span>` : ''}
  </header>
  ${sub ? `<p class="zn-sec-s">${sub}</p>` : ''}
  <div class="zn-sec-b">${inner}</div>
</section>`;
}
