export interface AccessRoute {
  icon: string;
  mode: string;
  time: string;
  detail: string;
}

export interface Ticket {
  name: string;
  price: string;
  days: string;
  desc: string;
}

export interface Spot {
  name: string;
  emoji: string;
  dist: string;
  desc: string;
}

export interface Booking {
  type: string;
  desc: string;
}

export interface Discount {
  cond: string;
  detail: string;
  sub: string;
}

export interface PlaceInfo {
  address: string;
  phone: string;
  hours: string;
}

export interface Destination {
  id: string;
  name: string;
  cat: '観光' | '駅・バス停' | '施設';
  area: string;
  tagline: string;
  emoji: string;
  color: string;
  gradient: string;
  /** Map pin coordinates (SVG viewBox 0 0 400 360) */
  x: number;
  y: number;
  /** Quick ticket price display on map */
  ticket: string | null;
  access: AccessRoute[];
  tickets: Ticket[];
  spots: Spot[];
  booking: Booking[];
  discount: Discount | null;
  info: PlaceInfo | null;
}

export const destinations: Destination[] = [
  // ── 観光スポット ──
  {
    id: 'midorikawa',
    name: '緑川温泉',
    cat: '観光',
    area: '緑川・青葉',
    tagline: '標高1,200mに湧く名湯、四季折々の自然に囲まれた温泉郷',
    emoji: '♨️',
    color: '#2D6A4F',
    gradient: 'linear-gradient(160deg, #2D6A4F 0%, #52B788 100%)',
    x: 115, y: 65,
    ticket: '¥1,540〜',
    access: [
      { icon: '🚃', mode: '電車+バス', time: '約2時間', detail: '南口駅→緑川口（特急）→ 路線バス 25分' },
      { icon: '🚌', mode: '高速バス', time: '約3時間', detail: 'バスターミナル→緑川温泉BT 直行便' },
    ],
    tickets: [
      { name: '緑川高原線フリーパス', price: '¥1,540', days: '2日間', desc: '緑川口〜緑川温泉BT 乗り降り自由' },
      { name: 'ワンデーローカルパス', price: '¥2,600', days: '1日間', desc: '県内のJR線+私鉄が乗り放題' },
      { name: '緑川まるごとパス', price: '¥4,200', days: '3日間', desc: '交通+温泉入浴+飲食クーポンのセット' },
    ],
    spots: [
      { name: '湯の広場', emoji: '♨️', dist: '徒歩3分', desc: '温泉街のシンボル。毎分4,000Lの温泉が湧出' },
      { name: '西の散歩道', emoji: '🌿', dist: '徒歩8分', desc: '温泉の川が流れる幻想的な散歩道。足湯も無料' },
      { name: '湯もみ会館', emoji: '🎭', dist: '徒歩5分', desc: '名物「湯もみ」を体験・見学。毎日開催' },
      { name: '緑川スキー場', emoji: '⛷', dist: 'バス10分', desc: '冬季はスキー、夏季はハイキング' },
    ],
    booking: [],
    discount: null,
    info: {
      address: '〒XXX-XXXX 緑川郡緑川町',
      phone: '0XXX-XX-XXXX（緑川温泉観光協会）',
      hours: '湯の広場周辺: 24時間 / 各施設: 施設により異なる',
    },
  },
  {
    id: 'shima',
    name: '四方温泉',
    cat: '観光',
    area: '四方・奥山',
    tagline: '山あいに佇む秘湯、透き通るブルーの川が美しい',
    emoji: '♨️',
    color: '#5B8A72',
    gradient: 'linear-gradient(160deg, #5B8A72 0%, #7DB89E 100%)',
    x: 165, y: 105,
    ticket: '¥2,000〜',
    access: [
      { icon: '🚃', mode: '電車+バス', time: '約2.5時間', detail: '中央駅→四方口→路線バス 40分' },
    ],
    tickets: [
      { name: '四方温泉バスパス', price: '¥2,000', days: '2日間', desc: '四方口〜四方温泉 往復乗り放題' },
    ],
    spots: [
      { name: '青の渓谷', emoji: '💎', dist: '徒歩15分', desc: 'コバルトブルーの清流が見られる絶景スポット' },
    ],
    booking: [],
    discount: null,
    info: {
      address: '〒XXX-XXXX 四方郡四方町',
      phone: '0XXX-XX-XXXX',
      hours: '各施設により異なる',
    },
  },
  {
    id: 'ishidan',
    name: '石段温泉',
    cat: '観光',
    area: '北川',
    tagline: '365段の石段街が続く、古くから親しまれた名湯',
    emoji: '🏯',
    color: '#8B5E3C',
    gradient: 'linear-gradient(160deg, #8B5E3C 0%, #C49A6C 100%)',
    x: 205, y: 155,
    ticket: '¥1,500〜',
    access: [
      { icon: '🚌', mode: '石段ライナー', time: '約60分', detail: '中央駅東口→石段温泉 直通・座席予約制' },
    ],
    tickets: [
      { name: '石段温泉フリーパス', price: '¥1,500', days: '2日間', desc: '北川駅〜石段温泉 乗り降り自由' },
      { name: '石段ライナー', price: '¥2,000', days: '片道', desc: '中央駅〜石段温泉 直通・予約制' },
    ],
    spots: [
      { name: '石段通り', emoji: '🏮', dist: '徒歩すぐ', desc: '365段の石段沿いに温泉まんじゅう店や射的' },
      { name: '紅葉橋', emoji: '🍁', dist: '徒歩10分', desc: '紅葉の名所。秋はライトアップも' },
    ],
    booking: [{ type: '石段ライナー予約', desc: '事前座席予約制' }],
    discount: null,
    info: {
      address: '〒XXX-XXXX 北川市石段町',
      phone: '0XXX-XX-XXXX',
      hours: '石段通り: 9:00-21:00 / 各施設により異なる',
    },
  },
  {
    id: 'minakami',
    name: 'みなかみ高原',
    cat: '観光',
    area: '奥山',
    tagline: '利根川源流の大自然、ラフティングとスキーの聖地',
    emoji: '🏔',
    color: '#4A7C5E',
    gradient: 'linear-gradient(160deg, #4A7C5E 0%, #6BAF8D 100%)',
    x: 215, y: 50,
    ticket: '¥3,500〜',
    access: [
      { icon: '🚃', mode: '特急+バス', time: '約3時間', detail: '南口駅→みなかみ駅→シャトルバス' },
    ],
    tickets: [
      { name: 'みなかみアドベンチャーパス', price: '¥3,500', days: '1日間', desc: '交通+アクティビティ体験チケット' },
    ],
    spots: [
      { name: '利根川ラフティング', emoji: '🚣', dist: 'バス15分', desc: '初心者〜上級者コースあり' },
    ],
    booking: [{ type: 'ラフティング予約', desc: '前日までにWEB予約' }],
    discount: null,
    info: {
      address: '〒XXX-XXXX みなかみ郡みなかみ町',
      phone: '0XXX-XX-XXXX',
      hours: '季節により異なる',
    },
  },
  {
    id: 'akagi',
    name: '赤木山',
    cat: '観光',
    area: '中央市北部',
    tagline: '山頂の大沼と温泉が楽しめる百名山',
    emoji: '⛰️',
    color: '#3D7B4E',
    gradient: 'linear-gradient(160deg, #3D7B4E 0%, #5DA36A 100%)',
    x: 270, y: 145,
    ticket: null,
    access: [
      { icon: '🚌', mode: '路線バス', time: '約90分', detail: '中央駅→赤木山ビジターセンター' },
    ],
    tickets: [],
    spots: [
      { name: '大沼', emoji: '🏞️', dist: '徒歩すぐ', desc: '標高1,350mのカルデラ湖。ボートや釣りも' },
    ],
    booking: [],
    discount: null,
    info: {
      address: '〒XXX-XXXX 中央市赤木山町',
      phone: '0XXX-XX-XXXX',
      hours: 'ビジターセンター: 9:00-16:00',
    },
  },
  {
    id: 'oze',
    name: '尾沢湿原',
    cat: '観光',
    area: '奥山',
    tagline: '高山植物の宝庫、水芭蕉が咲く天空の楽園',
    emoji: '🌿',
    color: '#2D8A5E',
    gradient: 'linear-gradient(160deg, #2D8A5E 0%, #4FBB7E 100%)',
    x: 250, y: 30,
    ticket: '¥4,000〜',
    access: [
      { icon: '🚌', mode: 'シャトルバス', time: '約3.5時間', detail: '中央駅→尾沢口→シャトルバス' },
    ],
    tickets: [
      { name: '尾沢トレッキングパス', price: '¥4,000', days: '2日間', desc: '交通+入山料+ガイド付き' },
    ],
    spots: [
      { name: '水芭蕉の群生地', emoji: '🌸', dist: '徒歩30分', desc: '5-6月が見頃。尾沢の代名詞' },
    ],
    booking: [{ type: 'ガイド予約', desc: '要事前予約。少人数制' }],
    discount: null,
    info: {
      address: '〒XXX-XXXX 奥山郡尾沢村',
      phone: '0XXX-XX-XXXX',
      hours: '開山期間: 5月下旬〜10月中旬',
    },
  },
  {
    id: 'tomioka',
    name: '古絹工場',
    cat: '観光',
    area: '南部',
    tagline: '世界遺産に登録された近代産業の礎',
    emoji: '🏛',
    color: '#7A5C3E',
    gradient: 'linear-gradient(160deg, #7A5C3E 0%, #A17D55 100%)',
    x: 135, y: 290,
    ticket: null,
    access: [
      { icon: '🚃', mode: '南部鉄道', time: '約40分', detail: '南口駅→古絹駅 徒歩10分' },
    ],
    tickets: [],
    spots: [
      { name: '繰糸場', emoji: '🏗️', dist: '徒歩すぐ', desc: '明治時代の繰糸機械が残る国宝建築' },
    ],
    booking: [],
    discount: null,
    info: {
      address: '〒XXX-XXXX 南部市古絹町',
      phone: '0XXX-XX-XXXX',
      hours: '9:00-17:00（最終入場16:30）/ 月曜休',
    },
  },
  // ── 駅・バス停 ──
  {
    id: 'chuo',
    name: '中央駅',
    cat: '駅・バス停',
    area: '中央市',
    tagline: '県庁所在地、バス路線の中心',
    emoji: '🚉',
    color: '#81B29A',
    gradient: 'linear-gradient(160deg, #81B29A 0%, #40916C 100%)',
    x: 240, y: 248,
    ticket: '¥500〜',
    access: [
      { icon: '🚃', mode: 'JR東西線', time: '約15分', detail: '南口駅から各駅停車' },
      { icon: '🚃', mode: '中央電鉄', time: '徒歩10分', detail: '中央市駅から連絡' },
    ],
    tickets: [
      { name: '中心市街地乗り放題券', price: '¥500', days: '1日間', desc: '中央駅周辺200円区間のバスが乗り放題' },
      { name: 'サブスクパス Premium', price: '¥8,000', days: '月額', desc: 'つなぐポイント+乗りトククーポン付き' },
    ],
    spots: [
      { name: '旧迎賓館', emoji: '🏛️', dist: '徒歩15分', desc: '国指定重要文化財の迎賓館' },
      { name: '駅前モール', emoji: '🛒', dist: '徒歩すぐ', desc: '中央駅北口直結のショッピングモール' },
    ],
    booking: [{ type: 'タクシー予約', desc: '地図から乗降車地を指定して呼べる' }],
    discount: { cond: '中央市民', detail: '乗り放題券 ¥500 → ¥360', sub: 'マイナンバーカード登録で適用' },
    info: {
      address: '〒XXX-XXXX 中央市中央1-1',
      phone: '0XXX-XX-XXXX',
      hours: '駅舎: 5:00-24:00 / みどりの窓口: 6:00-21:00',
    },
  },
  {
    id: 'minamiGuchi',
    name: '南口駅',
    cat: '駅・バス停',
    area: '南口市',
    tagline: '新幹線停車駅、県の交通ハブ',
    emoji: '🚉',
    color: '#4A90A4',
    gradient: 'linear-gradient(160deg, #4A90A4 0%, #6DB5C8 100%)',
    x: 195, y: 260,
    ticket: null,
    access: [
      { icon: '🚃', mode: '新幹線', time: '約1時間', detail: '東京駅→南口駅' },
    ],
    tickets: [],
    spots: [],
    booking: [],
    discount: null,
    info: {
      address: '〒XXX-XXXX 南口市南口町',
      phone: '0XXX-XX-XXXX',
      hours: '駅舎: 4:30-25:00',
    },
  },
  {
    id: 'kitakawa-sta',
    name: '北川駅',
    cat: '駅・バス停',
    area: '北川市',
    tagline: '石段温泉・赤木山への玄関口',
    emoji: '🚉',
    color: '#6B8E9E',
    gradient: 'linear-gradient(160deg, #6B8E9E 0%, #8FB5C4 100%)',
    x: 225, y: 190,
    ticket: null,
    access: [
      { icon: '🚃', mode: 'JR東西線', time: '約25分', detail: '中央駅から各駅停車' },
    ],
    tickets: [],
    spots: [],
    booking: [],
    discount: null,
    info: {
      address: '〒XXX-XXXX 北川市駅前町',
      phone: '0XXX-XX-XXXX',
      hours: '駅舎: 5:00-23:00',
    },
  },
  {
    id: 'kiryu',
    name: '桐生駅',
    cat: '駅・バス停',
    area: '桐生市',
    tagline: '織物の街、わたらせ渓谷鐵道の起点',
    emoji: '🚉',
    color: '#7A6B8E',
    gradient: 'linear-gradient(160deg, #7A6B8E 0%, #9D8EB2 100%)',
    x: 320, y: 235,
    ticket: null,
    access: [
      { icon: '🚃', mode: 'JR東西線', time: '約45分', detail: '中央駅→桐生駅' },
    ],
    tickets: [],
    spots: [],
    booking: [],
    discount: null,
    info: {
      address: '〒XXX-XXXX 桐生市末広町',
      phone: '0XXX-XX-XXXX',
      hours: '駅舎: 5:00-23:00',
    },
  },
  // ── 施設 ──
  {
    id: 'kitakawa-hosp',
    name: '中央赤十字病院',
    cat: '施設',
    area: '中央市',
    tagline: '通院の移動をもっと気軽に',
    emoji: '🏥',
    color: '#E07A5F',
    gradient: 'linear-gradient(160deg, #E07A5F 0%, #F2CC8F 100%)',
    x: 260, y: 230,
    ticket: null,
    access: [
      { icon: '🚌', mode: '路線バス', time: '各方面', detail: '中央駅から市内各所へ' },
      { icon: '📱', mode: '呼べば来るバス', time: '予約制', detail: 'デマンド交通で自宅近くから乗車' },
    ],
    tickets: [
      { name: '高齢者割引パス', price: '50%OFF', days: '年度', desc: '65歳以上の中央市民対象の路線バス割引' },
    ],
    spots: [],
    booking: [
      { type: 'デマンド交通予約', desc: '出発・降車バス停と日時を選んで予約' },
      { type: 'タクシー予約', desc: '地図から乗降車地を指定' },
    ],
    discount: { cond: '中央市民65歳以上', detail: 'バス50%OFF、タクシー30〜50%OFF', sub: 'マイナンバーカード+IC登録で適用' },
    info: {
      address: '〒XXX-XXXX 中央市朝日町',
      phone: '0XXX-XX-XXXX',
      hours: '外来受付: 8:00-11:00 / 面会: 14:00-20:00',
    },
  },
];

export interface TicketWithDest extends Ticket {
  destName: string;
  destId: string;
}

export const allTickets: TicketWithDest[] = destinations.flatMap((d) =>
  d.tickets.map((t) => ({ ...t, destName: d.name, destId: d.id }))
);

/** Category filter definitions for map */
export const categories = [
  { id: 'all', label: 'すべて', emoji: '📍' },
  { id: '観光', label: '観光', emoji: '🗻' },
  { id: '駅・バス停', label: '駅・バス停', emoji: '🚉' },
  { id: '施設', label: '施設', emoji: '🏥' },
] as const;

export type CategoryId = (typeof categories)[number]['id'];
