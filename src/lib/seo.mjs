/**
 * 타이틀·디스크립션 정본.
 * 토막을 잇는 기호는 ◈ 를 쓴다.
 *   제니스글로우 `{동} 출장마사지 홈타이 ◈ {구} {코스어} ◈ {행동어} 제니스글로우`
 * '마사지'는 제목에 한 번만 넣는다. '여성전용마사지'는 업소를 싣지 않아 쓰지 않는다.
 * 설명문은 100자 안쪽이고, 가운데 토막은 그 자리에서만 나오는 계산값(토막 몫·허리값·두꺼운 토막)으로 채운다.
 */
import { hash, km2, withJosa as J } from './util.mjs';
import { fk, fa, fb, clsName } from '../content/copy.mjs';

const at = (h, arr, slot = 0) => arr[parseInt(h.substr((slot * 3) % 29, 3), 16) % arr.length];

export const BRAND = '제니스글로우';
const KEY = '출장마사지 홈타이';

const COURSE_WORD = ['스웨디시', '아로마', '딥티슈', '타이', '경락', '건식', '림프', '지압', '스포츠'];
const ACT = ['바로 접수', '금액부터 확인', '새벽에도 접수', '통화 한 번', '도착 시각 확인'];

/* ── 제목 ─────────────────────────────────────────────────────────── */
export const title = {
  home: (c) => `${BRAND} ${KEY} ◈ 땅을 열 토막으로 자른 지역 안내 ◈ ${c ? `동 ${c.spot}곳` : '동 단위'} 후불`,
  areaHub: (c) => `${KEY} 방문 지역 ◈ 동 ${c.spot}곳 시군구 ${c.gu}곳 ◈ ${BRAND}`,
  sido: (sd) => `${sd.name} ${KEY} ◈ ${sd.main ? `동 ${sd.spotCount}곳 허리값 ${fa(sd.a)}` : `시군구 ${sd.gu.length}곳 허리값 ${fa(sd.a)}`} ◈ ${at(hash(sd.name, 'sdt'), ACT)} ${BRAND}`,
  gu: (sd, g) => {
    const h = hash(sd.name, g.name, 'gt');
    const unit = g.main && g.spotCount ? `동 ${g.spotCount}곳` : g.main ? `읍면 ${g.ruralCount}곳` : `행정동 ${g.dongCount}곳`;
    return `${g.name} ${KEY} ◈ ${sd.name} ${unit} 허리값 ${fa(g.a)} ◈ ${at(h, ACT, 0)} ${BRAND}`;
  },
  spot: (sd, g, s) => {
    const h = hash(sd.name, g.name, s.name, 'st');
    return `${s.name} ${KEY} ◈ ${g.name} ${at(h, COURSE_WORD, 0)} ◈ ${at(h, ACT, 1)} ${BRAND}`;
  },
  course: (c) => `${c.ko} ${KEY} ◈ ${c.min}분 ${c.price.toLocaleString('ko-KR')}원 ◈ 압 ${c.pressure} ${BRAND}`,
  sidoCourse: (sd, c) => `${sd.name} ${c.ko} ${KEY} ◈ ${sd.name} 방문 ◈ ${at(hash(sd.name, c.slug), ACT)} ${BRAND}`,
  page: (t) => `${t} ◈ ${BRAND} ${KEY}`,
  post: (p) => `${p.title} ◈ ${BRAND} 허리 기록`,
};

/* ── 디스크립션 ───────────────────────────────────────────────────── */
function spotMiddle(sd, g, s, h) {
  const [p0, , p2] = s.v;
  const frames = [
    () => `앞 세 토막 ${p0}%, 뒤 세 토막 ${p2}%로 잘리는 땅이다`,
    () => `허리값 ${fa(s.a)}, ${J(clsName(s.cls), '으로/로')} 읽힌다`,
    () => `가장 두꺼운 토막이 땅의 ${fb(s.b)}%를 차지한다`,
    () => `${g.name}에서 허리값이 ${s.gRank}번째로 높다`,
    () => `긴 방향 ${fk(s.x.len)}를 열 칸으로 나눈 ${clsName(s.cls)} 땅이다`,
    () => `땅 ${km2(s.area)}, 가운데 네 토막이 ${s.v[1]}%를 담는다`,
  ];
  return frames[parseInt(h.substr(6, 3), 16) % frames.length]();
}
const TAIL = [
  '후불로 계산한다',
  '선입금은 받지 않는다',
  '멀어도 값은 같다',
  '밤에도 같은 값이다',
  '계산은 마친 뒤 한 번',
];
const tailOf = (h) => TAIL[parseInt(h.substr(9, 3), 16) % TAIL.length];

export const desc = {
  home: () =>
    '서울·인천·경기·부산은 동까지, 그 밖의 지정 지역은 시군구까지 담은 출장마사지 홈타이 안내. 땅을 열 토막으로 잘라 허리를 쟀다.',
  areaHub: (c) =>
    `출장마사지 홈타이가 닿는 동 ${c.spot}곳과 시군구 ${c.gu}곳. 곳마다 열 토막 몫과 허리값을 적었다.`,
  sido: (sd) =>
    sd.main
      ? `${sd.name} ${KEY} 방문. 시군구 ${sd.gu.length}곳과 동 ${sd.spotCount}곳을 열었고 평균 허리값은 ${fa(sd.avgA)}이다.`
      : `${sd.name} ${KEY} 방문. 시군구 ${sd.gu.length}곳까지 열었고 동 이름은 그 안에 있다. 후불, 밤에도 접수.`,
  gu: (sd, g) => {
    const h = hash(sd.name, g.name, 'gd');
    const mid = g.main && g.spotCount
      ? [
        `동 ${g.spotCount}곳을 열었고 허리값은 ${fa(g.a)}이다`,
        `허리값이 가장 높은 곳은 ${g.hi}, 가장 낮은 곳은 ${g.lo}이다`,
        `앞 세 토막 ${g.v[0]}%, 뒤 세 토막 ${g.v[2]}%인 ${clsName(g.cls)} 땅이다`,
        `두꺼운 토막 몫이 가장 큰 곳은 ${g.bHi}(${fb(g.bHiV)}%)이다`,
      ][parseInt(h.substr(3, 3), 16) % 4]
      : g.main
        ? [
          `행정동 ${g.dongCount}곳이 전부 읍·면이라 이 한 장에서 받는다`,
          `읍 ${g.eupCount}곳과 면 ${g.myeonCount}곳은 이름으로 올렸다`,
          `땅 ${km2(g.area)}에 허리값 ${fa(g.a)}, ${clsName(g.cls)}로 읽힌다`,
        ][parseInt(h.substr(3, 3), 16) % 3]
        : [
          `행정동 ${g.dongCount}곳이 들어 있고 모양은 ${clsName(g.cls)}이다`,
          `허리값 ${fa(g.a)}, 넓이 ${km2(g.area)}인 땅이다`,
          g.ruralCount ? `동과 읍·면 ${g.ruralCount}곳 모두 찾아간다` : `동 ${g.dongNames.length}곳 어디나 한 번호로 받는다`,
        ][parseInt(h.substr(3, 3), 16) % 3];
    return `${sd.name} ${g.name} ${KEY}. ${mid}. ${tailOf(h)}.`;
  },
  spot: (sd, g, s) => {
    const h = hash(sd.name, g.name, s.name, 'sd');
    return `${sd.name} ${g.name} ${s.name} ${KEY}. ${spotMiddle(sd, g, s, h)}. ${tailOf(h)}.`;
  },
  course: (c) =>
    `${c.ko} 출장 방문. ${c.focus}에 시간을 몰아 쓰고 압은 ${c.pressure}이다. ${c.min}분 ${c.price.toLocaleString('ko-KR')}원, 지역에 따라 달라지지 않는다.`,
  sidoCourse: (sd, c) =>
    `${sd.name} ${c.ko} ${KEY}. ${c.focus}${J(c.focus, '을/를').slice(c.focus.length)} 오래 다룬다. ${sd.name} 어디서나 ${c.min}분 ${c.price.toLocaleString('ko-KR')}원.`,
  post: (p) => p.summary,
};

/** 설명이 예산을 넘으면 문장 단위로 자른다. */
export function clampDesc(s, limit = 100) {
  if (s.length <= limit) return s;
  const parts = s.split(/(?<=\.)\s+/);
  let out = '';
  for (const p of parts) {
    if ((out + p).length > limit) break;
    out += (out ? ' ' : '') + p;
  }
  return out || s.slice(0, limit - 1) + '…';
}
