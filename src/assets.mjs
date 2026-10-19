import fs from 'node:fs';
import path from 'node:path';

/**
 * 손으로 쓴 CSS·JS·SVG. 빌드 도구도, 바깥 글꼴도, 바깥 스크립트도 쓰지 않는다.
 * 이 사이트의 장치는 열 칸짜리 막대다. 머리 밑 띠, 지역 카드의 작은 막대,
 * 코스 길이 막대, 안내문 맨 위의 큰 막대가 모두 같은 열 칸 문법을 쓴다.
 * 스크립트에 무작위는 없다.
 */
export const THEME = {
  paper: '#E4F1FB', card: '#F7FBFE', soft: '#D2E6F5',
  ink: '#0B2540', dim: '#4A6580',
  acc: '#D9481F', accDk: '#B03512', accSoft: '#FBDCD2',
  line: '#AFCDE4', onAcc: '#FFFFFF',
};

const CSS = (t) => `:root{
  --paper:${t.paper};--card:${t.card};--soft:${t.soft};--ink:${t.ink};--dim:${t.dim};
  --acc:${t.acc};--accDk:${t.accDk};--accSoft:${t.accSoft};--line:${t.line};--onAcc:${t.onAcc};
  --w:1040px;
  --sans:system-ui,-apple-system,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",sans-serif;
  --mono:ui-monospace,"SFMono-Regular",Menlo,Consolas,monospace;
}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;color-scheme:light}
body{margin:0;font-family:var(--sans);color:var(--ink);background:var(--paper);
  line-height:1.8;font-size:16.5px;letter-spacing:-.005em;padding-bottom:84px}
@media (min-width:900px){body{padding-bottom:0}}
img,svg{max-width:100%}
a{color:var(--accDk);text-decoration:none}
a:hover{text-decoration:underline;text-underline-offset:3px}
:focus-visible{outline:3px solid var(--acc);outline-offset:2px}
strong{font-weight:800}
.hop{position:absolute;left:-9999px}
.hop:focus{position:fixed;left:12px;top:12px;z-index:70;background:var(--acc);color:var(--onAcc);padding:10px 16px}

/* ── 머리 = 남색 띠 + 열 칸 막대 ───────────────────── */
.zn-head{position:sticky;top:0;z-index:30;background:var(--ink);color:#fff}
.zn-head-in{max-width:var(--w);margin:0 auto;padding:9px 20px;display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.zn-brand{display:inline-flex;align-items:center;gap:9px;color:#fff}
.zn-brand:hover{text-decoration:none}
.zn-mk{width:30px;height:30px;flex:none}
.zn-brand b{font-size:18px;font-weight:800;letter-spacing:-.03em}
.zn-nav{margin:0;padding:0;list-style:none;display:flex;gap:4px;order:3;width:100%;overflow-x:auto}
@media (min-width:880px){.zn-nav{order:0;width:auto;margin-left:auto}}
.zn-nav a{display:block;padding:4px 12px;border-radius:999px;font-size:14px;font-weight:700;color:#C3D8EC;white-space:nowrap}
.zn-nav a:hover{background:rgba(255,255,255,.12);color:#fff;text-decoration:none}
.zn-nav a[aria-current]{background:#fff;color:var(--ink)}
.zn-head .callbox{margin-left:auto}
@media (min-width:880px){.zn-head .callbox{margin-left:0}}
.zn-band{display:flex;align-items:flex-end;height:11px;background:var(--soft)}
.zn-band i{flex:1;background:var(--acc);border-right:2px solid var(--soft)}
.zn-band i:nth-child(1){height:46%}.zn-band i:nth-child(2){height:78%}.zn-band i:nth-child(3){height:100%}
.zn-band i:nth-child(4){height:92%}.zn-band i:nth-child(5){height:70%}.zn-band i:nth-child(6){height:58%}
.zn-band i:nth-child(7){height:74%}.zn-band i:nth-child(8){height:86%}.zn-band i:nth-child(9){height:52%}
.zn-band i:nth-child(10){height:28%;border-right:0}

/* ── 예약 문의 버튼 ────────────────────────────────── */
.callbox{display:inline-flex;align-items:center;gap:10px;background:var(--accDk);color:#fff;
  padding:8px 18px 8px 13px;border-radius:999px;line-height:1.15}
.zn-head .callbox{background:var(--acc)}
.callbox:hover{text-decoration:none;background:#8D2A0C}
.callbox-i{width:15px;height:15px;flex:none;border:2px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg)}
.callbox-t{display:flex;flex-direction:column}
.callbox-k{font-size:10.5px;letter-spacing:.06em;opacity:.9}
.callbox-v{font-family:var(--mono);font-weight:800;font-size:15px}
.callbox-s{padding:5px 14px 5px 10px}
.callbox-s .callbox-v{font-size:13px}
.callbox-s .callbox-k{display:none}
.callbox-l{padding:11px 24px 11px 17px}
.callbox-l .callbox-v{font-size:19px}

/* ── 현재 위치 ─────────────────────────────────────── */
.zn-way{max-width:var(--w);margin:0 auto;padding:12px 20px 0}
.zn-way ol{list-style:none;display:flex;flex-wrap:wrap;gap:4px 6px;margin:0;padding:0;font-size:12px;color:var(--dim)}
.zn-way li+li::before{content:"›";margin-right:6px;color:var(--dim)}
.zn-way a{color:var(--dim)}

/* ── 본문 ──────────────────────────────────────────── */
main{max-width:var(--w);margin:0 auto;padding:16px 20px 64px}
.zn-h1{margin:12px 0 20px;font-size:clamp(25px,4.6vw,38px);line-height:1.28;font-weight:800;letter-spacing:-.035em}
.zn-h1-s{display:block;margin-top:8px;font-size:14px;font-weight:700;letter-spacing:0;color:var(--accDk)}
.zn-lead{max-width:46rem;margin:0 0 26px}
.zn-lead p{margin:0 0 .9em}
.zn-sec-x{margin:14px 0 0;font-size:14px;color:var(--dim)}

/* ── 칸 틀 = 제목 + 오른쪽 끝 속 빈 번호 ───────────── */
.zn-sec{margin:46px 0 0}
.zn-sec-h{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;padding-bottom:6px;border-bottom:3px solid var(--ink)}
.zn-sec-h h2{margin:0;font-size:21px;font-weight:800;letter-spacing:-.03em;line-height:1.35}
.zn-n{flex:none;font-family:var(--mono);font-size:34px;line-height:.9;font-weight:800;color:transparent;-webkit-text-stroke:1.4px var(--line)}
.zn-sec-s{margin:10px 0 0;font-size:14px;color:var(--dim);max-width:44rem}
.zn-sec-b{margin-top:18px}

/* ── 첫 화면 ───────────────────────────────────────── */
.zn-door{background:var(--ink);color:#EAF3FB;border-radius:6px;padding:24px 22px 20px;display:grid;gap:20px}
@media (min-width:860px){.zn-door{grid-template-columns:1.1fr .9fr;align-items:end;padding:30px 30px 24px}}
.zn-door-sl{margin:0 0 12px;font-size:clamp(20px,3.4vw,27px);font-weight:800;letter-spacing:-.03em;line-height:1.45;color:#fff}
.zn-door-p{margin:0 0 18px;font-size:15.5px;color:#C3D8EC;max-width:36rem}
.zn-door .zn-pf-c i{background:#27496D}
.zn-door .zn-pf-c i.on{background:var(--acc)}
.zn-door .zn-pf-c i.th{background:#fff}
.zn-door .zn-pf-c b,.zn-door .zn-pf-cap{color:#9DB8D2}
.zn-door .zn-pf-c{background-image:linear-gradient(90deg,transparent 20%,rgba(255,255,255,.07) 20% 80%,transparent 80%)}
.zn-door-f{grid-column:1/-1;margin:2px 0 0;padding-top:14px;border-top:1px solid #27496D;display:grid;grid-template-columns:repeat(2,1fr);gap:8px 14px}
@media (min-width:720px){.zn-door-f{grid-template-columns:repeat(4,1fr)}}
.zn-door-f dt{font-size:11.5px;color:#9DB8D2}
.zn-door-f dd{margin:1px 0 0;font-weight:800;font-size:15px;color:#fff}

/* ── 열 칸 막대(안내문 맨 위·작은 것) ──────────────── */
.zn-pf{margin:0 0 22px}
.zn-pf-c{display:flex;align-items:flex-end;gap:3px;height:132px;padding-top:18px;
  background-image:linear-gradient(90deg,transparent 20%,rgba(255,255,255,.6) 20% 80%,transparent 80%)}
.zn-pf-c i{flex:1;position:relative;background:var(--line);min-height:3px;font-style:normal}
.zn-pf-c i.on{background:var(--acc)}
.zn-pf-c i.th{background:var(--ink)}
.zn-pf-c b{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);padding-bottom:2px;font-family:var(--mono);font-size:10.5px;font-weight:600;color:var(--dim);white-space:nowrap}
.zn-pf-cap{display:flex;justify-content:space-between;margin-top:6px;font-size:11.5px;color:var(--dim)}
.zn-pf-mini{margin:0}
.zn-pf-mini .zn-pf-c{height:40px;gap:2px;padding-top:0;background-image:none}
.zn-pf-mini b{display:none}
.zn-pf-na{display:flex;align-items:center;height:40px;font-size:12px;color:var(--dim);border-bottom:2px dashed var(--line)}

/* ── 지역 고르기 = 카드 격자 ───────────────────────── */
.zn-picks{list-style:none;margin:0;padding:0;display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(210px,1fr))}
.zn-pick{display:grid;gap:8px;height:100%;padding:13px 14px 12px;background:var(--card);border:1px solid var(--line);border-top:4px solid var(--ink);color:var(--ink)}
.zn-pick.sub{border-top-color:var(--line)}
.zn-pick:hover{text-decoration:none;border-color:var(--acc);border-top-color:var(--acc)}
.zn-pick b{font-size:17px;font-weight:800}
.zn-pick small{display:block;font-size:12.5px;color:var(--dim)}
.zn-pick em{font-style:normal;font-family:var(--mono);font-weight:800;color:var(--accDk);font-size:13px}
.zn-pick-r{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.zn-key{margin:14px 0 0;font-size:14px;color:var(--dim);max-width:46rem}

/* ── 이름·값 칸 ────────────────────────────────────── */
.zn-kv{margin:0;display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(210px,1fr))}
.zn-kv div{background:var(--card);border:1px solid var(--line);border-top:3px solid var(--acc);padding:9px 12px 10px}
.zn-kv dt{font-size:12px;color:var(--dim);letter-spacing:.01em}
.zn-kv dd{margin:2px 0 0;font-weight:800;font-size:16px;line-height:1.5;overflow-wrap:anywhere}
.zn-kv small{display:block;font-weight:400;font-size:12.5px;color:var(--dim);line-height:1.55;margin-top:2px}

/* ── 코스 = 길이대로 늘인 막대 ─────────────────────── */
.zn-cb{list-style:none;margin:0;padding:0;display:grid;gap:9px}
.zn-cb a,.zn-cb-a{display:flex;align-items:center;gap:12px;color:var(--ink)}
.zn-cb a:hover{text-decoration:none}
.zn-cb-bar{flex:none;width:calc(36% + var(--r) * 38%);display:flex;justify-content:space-between;align-items:center;gap:8px;
  background:var(--ink);color:#fff;padding:7px 12px;border-radius:3px;font-size:14.5px;font-weight:700;min-width:0}
.zn-cb a:hover .zn-cb-bar{background:var(--accDk)}
.zn-cb li.me .zn-cb-bar{background:var(--acc)}
.zn-cb-bar em{font-style:normal;font-family:var(--mono);font-size:12.5px;color:#BFD6EA}
.zn-cb-p{margin-left:auto;font-family:var(--mono);font-weight:800;font-size:15px;white-space:nowrap}
.zn-cb small{display:block;margin:2px 0 0;font-size:13px;color:var(--dim);padding-left:2px}
@media (max-width:620px){.zn-cb-bar{width:auto;flex:1}}

/* ── 큰 표(코스 허브·비용) ─────────────────────────── */
.zn-tw{overflow-x:auto}
.zn-t{width:100%;border-collapse:collapse;font-size:15px;background:var(--card)}
.zn-t th,.zn-t td{padding:9px 12px;text-align:left;border-bottom:1px solid var(--line);vertical-align:top}
.zn-t thead th{background:var(--ink);color:#fff;font-size:12.5px;font-weight:700}
.zn-t tbody th{font-weight:800}
.zn-t .zn-t-w{text-align:right;white-space:nowrap;font-family:var(--mono)}
.zn-t tr.zn-me{background:var(--accSoft)}

/* ── 접수 = 화살표 다섯 칸 ─────────────────────────── */
.zn-ch{list-style:none;margin:0;padding:0;display:grid;gap:12px}
@media (min-width:900px){.zn-ch{grid-template-columns:repeat(5,1fr);gap:6px}}
.zn-ch-t{display:block;background:var(--ink);color:#fff;font-weight:800;font-size:15px;padding:8px 22px 8px 14px;
  clip-path:polygon(0 0,calc(100% - 14px) 0,100% 50%,calc(100% - 14px) 100%,0 100%)}
.zn-ch li:nth-child(odd) .zn-ch-t{background:var(--accDk)}
.zn-ch-t i{font-style:normal;font-family:var(--mono);font-size:12px;opacity:.75;margin-right:7px}
.zn-ch p{margin:8px 4px 0 0;font-size:14px;line-height:1.7;color:var(--dim)}

/* ── 물음 = 접히는 상자 ────────────────────────────── */
.zn-asks{display:grid;gap:8px}
.zn-q{background:var(--card);border:1px solid var(--line);border-left:5px solid var(--ink)}
.zn-q[open]{border-left-color:var(--acc)}
.zn-q summary{list-style:none;cursor:pointer;padding:11px 44px 11px 14px;position:relative}
.zn-q summary::-webkit-details-marker{display:none}
.zn-q summary::after{content:"+";position:absolute;right:14px;top:50%;transform:translateY(-50%);font-family:var(--mono);font-size:20px;font-weight:800;color:var(--accDk)}
.zn-q[open] summary::after{content:"−"}
.zn-q h3{display:inline;margin:0;font-size:16px;font-weight:800;line-height:1.55}
.zn-q p{margin:0;padding:0 16px 14px 14px;font-size:15px;color:var(--dim)}

/* ── 안내 = 두 칸 카드 ─────────────────────────────── */
.zn-nt{list-style:none;margin:0;padding:0;display:grid;gap:10px}
@media (min-width:760px){.zn-nt{grid-template-columns:1fr 1fr}}
.zn-nt li{background:var(--card);border:1px solid var(--line);padding:11px 14px 12px;font-size:14.5px;line-height:1.7;position:relative}
.zn-nt li::before{content:"";display:block;width:26px;height:4px;background:var(--acc);margin-bottom:8px}
.zn-nt-g{margin:0 0 6px}

/* ── 롱테일 = 화살표 목록 ──────────────────────────── */
.zn-lk{list-style:none;margin:0;padding:0;columns:2 230px;column-gap:26px}
.zn-lk li{break-inside:avoid;padding:3px 0 3px 17px;position:relative;font-size:14.5px;line-height:1.55}
.zn-lk li::before{content:"";position:absolute;left:2px;top:.72em;width:7px;height:7px;border-top:2px solid var(--acc);border-right:2px solid var(--acc);transform:rotate(45deg)}
.zn-rts{display:grid;gap:18px}
@media (min-width:860px){.zn-rts{grid-template-columns:1fr 1fr}}
.zn-rt{background:var(--card);border:1px solid var(--line);padding:12px 14px 10px}
.zn-rt-h{margin:0 0 6px;font-size:13px;font-weight:800;letter-spacing:.01em;color:var(--ink);padding-bottom:5px;border-bottom:2px solid var(--soft)}
.zn-rt .zn-lk{columns:1}
@media (min-width:1000px){.zn-rt .zn-lk{columns:2 190px;column-gap:18px}}

/* ── 알약(시군구·닮은 곳) ──────────────────────────── */
.zn-chips{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.zn-chips a{display:inline-flex;align-items:center;gap:8px;padding:5px 7px 5px 13px;border-radius:999px;background:var(--card);border:1px solid var(--line);color:var(--ink);font-size:14.5px;font-weight:700}
.zn-chips a:hover{text-decoration:none;border-color:var(--acc);background:var(--accSoft)}
.zn-chips a[aria-current]{background:var(--ink);color:#fff;border-color:var(--ink)}
.zn-chips b{font-family:var(--mono);font-size:11.5px;font-weight:700;color:var(--ink);background:var(--soft);border-radius:999px;padding:1px 8px}
.zn-chips a[aria-current] b{background:#27496D;color:#fff}
.zn-nm{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:4px 0;font-size:14.5px}
.zn-nm li{padding-right:11px;margin-right:11px;border-right:1px solid var(--line);line-height:1.4}
.zn-nm li:last-child{border-right:0}

/* ── 동 목록 = 값 길이를 재는 줄 ───────────────────── */
.zn-bl{list-style:none;margin:0;padding:0;display:grid;gap:4px 18px}
@media (min-width:700px){.zn-bl{grid-template-columns:1fr 1fr}}
@media (min-width:980px){.zn-bl{grid-template-columns:1fr 1fr 1fr}}
.zn-bl a{display:grid;grid-template-columns:7.2rem 1fr 2.6rem;align-items:center;gap:8px;padding:5px 2px;color:var(--ink);font-size:14.5px;border-bottom:1px solid var(--soft)}
.zn-bl a:hover{text-decoration:none;background:var(--card)}
.zn-bl a[aria-current]{background:var(--accSoft)}
.zn-bl span{font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.zn-bl s{display:block;height:7px;background:var(--soft);text-decoration:none;position:relative}
.zn-bl s i{position:absolute;left:0;top:0;bottom:0;background:var(--ink)}
.zn-bl b{font-family:var(--mono);font-size:12px;font-weight:700;text-align:right;color:var(--dim)}

/* ── 모양 묶음 카드 ────────────────────────────────── */
.zn-tcs{display:grid;gap:14px}
@media (min-width:760px){.zn-tcs{grid-template-columns:1fr 1fr}}
.zn-tc{background:var(--card);border:1px solid var(--line)}
.zn-tc h3{margin:0;padding:8px 14px;background:var(--ink);color:#fff;font-size:14.5px;font-weight:800}
.zn-tc ul{list-style:none;margin:0;padding:4px 14px 8px}
.zn-tc li{display:flex;justify-content:space-between;gap:12px;padding:5px 0;border-top:1px solid var(--soft);font-size:14.5px}
.zn-tc li:first-child{border-top:0}
.zn-tc li b{flex:none;font-family:var(--mono);font-size:12.5px;color:var(--dim);font-weight:600;text-align:right}

/* ── 글 목록·글 ────────────────────────────────────── */
.zn-notes{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.zn-notes a{display:grid;gap:3px;padding:13px 16px;background:var(--card);border:1px solid var(--line);border-left:5px solid var(--acc);color:var(--ink)}
.zn-notes a:hover{text-decoration:none;border-color:var(--ink);border-left-color:var(--ink)}
.zn-notes b{font-size:16px;font-weight:800}
.zn-notes span{font-size:13.5px;color:var(--dim)}
.zn-notes time{font-family:var(--mono);font-size:12px;color:var(--dim)}
.zn-piece{max-width:44rem;font-size:17px}
.zn-piece h2{margin:32px 0 10px;font-size:19px;font-weight:800;padding-left:12px;border-left:5px solid var(--acc)}
.zn-piece p{margin:0 0 1.05em}
.zn-piece ul{margin:0 0 1.05em;padding-left:1.1em;color:var(--dim)}
.zn-doc{max-width:44rem;counter-reset:d}
.zn-doc section{padding:12px 0 12px 44px;position:relative;border-bottom:1px solid var(--line)}
.zn-doc section::before{counter-increment:d;content:counter(d);position:absolute;left:0;top:14px;width:28px;height:28px;border-radius:50%;background:var(--ink);color:#fff;text-align:center;line-height:28px;font-family:var(--mono);font-size:12px;font-weight:800}
.zn-doc h2{margin:0 0 3px;font-size:16px;font-weight:800;color:var(--ink)}
.zn-doc p{margin:0;font-size:15px;color:var(--dim)}
.zn-dated{margin:0 0 16px;font-size:12px;color:var(--dim);font-family:var(--mono)}
.zn-list{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.zn-list li{background:var(--card);border:1px solid var(--line);padding:9px 14px;font-size:15px}
.zn-list li::first-line{font-weight:700}

/* ── 예약 문의 띠 ──────────────────────────────────── */
.zn-hail{margin:42px 0 0;background:var(--soft);border-radius:6px;border:1px solid var(--line);padding:16px 18px;
  display:flex;flex-wrap:wrap;gap:14px 24px;align-items:center;justify-content:space-between;overflow:hidden;position:relative}
.zn-hail::before{content:"";position:absolute;left:0;top:0;bottom:0;width:7px;background:var(--acc)}
.zn-hail-p{margin:0 0 0 8px;max-width:34rem;font-weight:700;font-size:15.5px;line-height:1.7}
.zn-hail-p span{display:block;margin-top:2px;font-weight:400;font-size:13px;color:var(--dim)}

/* ── 발 ────────────────────────────────────────────── */
.zn-foot{margin-top:40px;background:var(--ink);color:#C3D8EC}
.zn-foot a{color:#fff}
.zn-foot-top{max-width:var(--w);margin:0 auto;padding:28px 20px 18px;display:grid;gap:18px;border-bottom:1px solid #27496D}
@media (min-width:860px){.zn-foot-top{grid-template-columns:1.3fr 1fr;align-items:center}}
.zn-foot-nm{margin:0 0 6px;font-size:22px;font-weight:800;letter-spacing:-.03em;color:#fff}
.zn-foot-say{margin:0;font-size:14px;color:#9DB8D2;max-width:34rem}
.zn-foot-run{margin:8px 0 0;font-size:12px;color:#9DB8D2}
.zn-foot-mid{max-width:var(--w);margin:0 auto;padding:22px 20px 14px;display:grid;gap:24px}
@media (min-width:860px){.zn-foot-mid{grid-template-columns:1.2fr 1fr}}
.zn-foot-h{margin:0 0 7px;font-size:12px;letter-spacing:.06em;font-weight:700;color:#7E9CBA}
.zn-pipes{margin:0 0 16px;display:flex;flex-wrap:wrap;gap:3px 0;font-size:14px}
.zn-pipes a{padding:0 10px;border-left:1px solid #27496D}
.zn-pipes a:first-child{padding-left:0;border-left:0}
.zn-foot-ul{list-style:none;margin:0 0 16px;padding:0;display:grid;gap:7px;font-size:14px}
.zn-foot-ul time{display:block;font-family:var(--mono);font-size:11px;color:#7E9CBA}
.zn-foot-sm{margin:6px 0 0;font-size:12px;color:#9DB8D2}
.zn-foot-sm a{text-decoration:underline}
.zn-foot-end{max-width:var(--w);margin:0 auto;padding:12px 20px 30px;border-top:1px solid #27496D}
.zn-biz{margin:0 0 8px;font-size:12px;color:#9DB8D2}
.zn-pale{opacity:.75}
.zn-ai{margin:0 0 8px;font-size:12px;color:#9DB8D2;line-height:1.72}
.zn-cr{margin:0;font-size:11.5px;color:#7E9CBA}

/* ── 아래 붙은 줄 ──────────────────────────────────── */
.zn-bar{position:fixed;left:0;right:0;bottom:0;z-index:40;background:var(--card);border-top:3px solid var(--ink);
  padding:8px 14px calc(8px + env(safe-area-inset-bottom));display:flex;align-items:center;justify-content:space-between;gap:10px;
  transition:transform .2s}
.zn-bar.down{transform:translateY(110%)}
.zn-bar-s{font-size:11.5px;line-height:1.35;max-width:9rem;color:var(--dim);font-weight:700}
@media (min-width:900px){.zn-bar{display:none}}
@media print{.zn-bar,.zn-head,.zn-hail{display:none}}
`;

const JS = `(function(){
  /* 발이 화면에 들어오면 아래 붙은 줄을 내린다. 그 밖의 일은 하지 않는다 —
     화면을 흔드는 무작위가 없어야 같은 주소에서 같은 화면이 나온다. */
  var bar=document.querySelector('.zn-bar'),ft=document.querySelector('.zn-foot');
  if(!bar||!ft||!('IntersectionObserver' in window))return;
  new IntersectionObserver(function(es){
    es.forEach(function(e){bar.classList.toggle('down',e.isIntersecting);});
  },{rootMargin:'0px 0px -40px 0px'}).observe(ft);
})();`;

/* 마크 — 허리가 잘록한 열 칸 막대 */
const BARS = [15, 21, 26, 19, 11, 9, 14, 20, 17, 8];
const MARK = (c, hi) => BARS.map((h, i) => `<rect x="${1.5 + i * 3}" y="${29 - h}" width="2.2" height="${h}" fill="${i === 2 ? hi : c}"/>`).join('');
const FAVICON = (t) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="${t.ink}"/>${MARK('#FFFFFF', t.acc)}</svg>`;
const LOGO = (t, cfg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 48"><rect width="270" height="48" fill="${t.paper}"/><g transform="translate(8,8)"><rect width="32" height="32" rx="6" fill="${t.ink}"/>${MARK('#FFFFFF', t.acc)}</g><text x="50" y="26" font-family="system-ui,sans-serif" font-size="18" font-weight="800" fill="${t.ink}">${cfg.brand.ko}</text><text x="50" y="38" font-family="ui-monospace,monospace" font-size="9" letter-spacing="3" fill="${t.dim}">${cfg.brand.en.toUpperCase()}</text></svg>`;

const OG = (t, cfg) => {
  const hs = [120, 190, 250, 225, 160, 130, 170, 215, 180, 90];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${t.ink}"/>
${hs.map((h, i) => `<rect x="${120 + i * 96}" y="${300 - h}" width="84" height="${h}" fill="${i === 2 ? t.acc : '#27496D'}"/>`).join('\n')}
<text x="120" y="390" font-family="system-ui,sans-serif" font-size="52" font-weight="800" fill="#FFFFFF">${cfg.brand.ko} 출장마사지 홈타이</text>
<text x="120" y="442" font-family="system-ui,sans-serif" font-size="26" fill="#9DB8D2">${cfg.brand.slogan}</text>
<text x="120" y="490" font-family="ui-monospace,monospace" font-size="20" fill="#9DB8D2">서울 · 인천 · 경기 · 부산 동까지 · ${cfg.hours} · ${cfg.pay}</text>
<rect x="120" y="520" width="440" height="80" rx="40" fill="${t.acc}"/>
<text x="164" y="552" font-family="ui-monospace,monospace" font-size="14" letter-spacing="4" fill="${t.onAcc}">${cfg.telLabel}</text>
<text x="164" y="584" font-family="ui-monospace,monospace" font-size="28" font-weight="700" fill="${t.onAcc}">${cfg.tel}</text>
</svg>`;
};

export function writeAssets(dist, cfg) {
  const dir = path.join(dist, 'assets');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'zn.css'), CSS(THEME));
  fs.writeFileSync(path.join(dir, 'zn.js'), JS);
  fs.writeFileSync(path.join(dir, 'favicon.svg'), FAVICON(THEME));
  fs.writeFileSync(path.join(dir, 'logo.svg'), LOGO(THEME, cfg));
  fs.writeFileSync(path.join(dir, 'og.svg'), OG(THEME, cfg));
}
export const STRIPMARK = (t = THEME) => `<svg class="zn-mk" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><rect width="32" height="32" rx="6" fill="${t.acc}"/>${MARK('#FFFFFF', t.ink)}</svg>`;
