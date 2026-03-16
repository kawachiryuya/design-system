/** Route segment in a journey */
export interface RouteSegment {
  type: 'walk' | 'train' | 'bus';
  from: string;
  to: string;
  dur: string;
  dist?: string;
  line?: string;
  stops?: number;
  color?: string;
  depTime?: string;
  arrTime?: string;
  ticketHint?: string;
  toPlaceLink?: { name: string; id: string };
}

/** Ticket suggestion for a route */
export interface TicketSuggestion {
  id: string;
  label: string;
  name: string;
  price: string;
  days: string;
  desc: string;
  saving: string | null;
}

/** A single route result */
export interface Route {
  id: number;
  dep: string;
  arr: string;
  dur: string;
  cost: string;
  transfers: number;
  badges: string[];
  badgeColors: string[];
  segments: RouteSegment[];
  tickets: TicketSuggestion[];
  bestTicket: { name: string; price: string; note: string } | null;
  discount?: { cond: string; detail: string };
}

/** Search scenario definition */
export interface Scenario {
  id: string;
  label: string;
  from: string;
  to: string;
  showContext: boolean;
  routes: Route[];
}

// ═══════════════════════════════════════
// P1: 観光 — 南口駅→緑川温泉
// ═══════════════════════════════════════
const midorikawaRoutes: Route[] = [
  {
    id: 1, dep: '13:20', arr: '15:12', dur: '1時間52分', cost: '¥3,481', transfers: 1,
    badges: ['早', '楽'], badgeColors: ['#2563EB', '#16A34A'],
    segments: [
      { type: 'walk', from: '南口駅', to: '南口', dur: '3分', dist: '0.2km' },
      { type: 'train', from: '南口', to: '緑川口', line: 'JR青葉線・特急みどり', dur: '1時間15分', stops: 8, color: '#F59E0B', depTime: '13:23', arrTime: '14:38' },
      { type: 'walk', from: '緑川口', to: '緑川口/バス停', dur: '3分', dist: '0.1km' },
      { type: 'bus', from: '緑川口', to: '緑川温泉BT', line: '緑川高原線バス', dur: '25分', stops: 22, color: '#2563EB', depTime: '14:51', arrTime: '15:16', ticketHint: '緑川高原線フリーパス対象', toPlaceLink: { name: '緑川温泉', id: 'midorikawa' } },
      { type: 'walk', from: '緑川温泉BT', to: '緑川温泉', dur: '4分', dist: '0.3km', toPlaceLink: { name: '緑川温泉', id: 'midorikawa' } },
    ],
    tickets: [
      { id: 't1', label: 'おすすめ', name: 'ワンデーローカルパス', price: '¥2,600', days: '1日間', desc: 'JR区間+県内私鉄が乗り放題。バス区間は別途。', saving: null },
      { id: 't2', label: 'バス区間をお得に', name: '緑川高原線フリーパス', price: '¥1,540', days: '2日間', desc: '緑川口〜緑川温泉BTの往復が2日間乗り放題。', saving: '往復で¥920お得' },
      { id: 't3', label: 'チケットなし', name: '通常運賃（IC優先）', price: '¥3,481', days: '—', desc: '交通系ICカードでそのまま乗車。', saving: null },
    ],
    bestTicket: { name: '緑川高原線フリーパス', price: '¥1,540', note: 'バス区間2日間乗り放題' },
  },
  {
    id: 2, dep: '13:42', arr: '16:02', dur: '2時間20分', cost: '¥2,001', transfers: 1,
    badges: ['安', '楽'], badgeColors: ['#EA580C', '#16A34A'],
    segments: [
      { type: 'walk', from: '南口駅', to: '南口', dur: '2分', dist: '0.1km' },
      { type: 'train', from: '南口', to: '緑川口', line: 'JR青葉線・普通', dur: '1時間40分', stops: 15, color: '#F59E0B', depTime: '13:44', arrTime: '15:24' },
      { type: 'walk', from: '緑川口', to: '緑川口/バス停', dur: '3分', dist: '0.1km' },
      { type: 'bus', from: '緑川口', to: '緑川温泉BT', line: '緑川高原線バス', dur: '25分', stops: 22, color: '#2563EB', depTime: '15:33', arrTime: '15:58', ticketHint: '緑川高原線フリーパス対象', toPlaceLink: { name: '緑川温泉', id: 'midorikawa' } },
      { type: 'walk', from: '緑川温泉BT', to: '緑川温泉', dur: '4分', dist: '0.3km', toPlaceLink: { name: '緑川温泉', id: 'midorikawa' } },
    ],
    tickets: [
      { id: 't4', label: 'おすすめ', name: '緑川高原線フリーパス', price: '¥1,540', days: '2日間', desc: 'バス往復がお得に。', saving: '往復で¥920お得' },
      { id: 't5', label: 'チケットなし', name: '通常運賃（IC優先）', price: '¥2,001', days: '—', desc: '交通系ICカードでそのまま乗車。', saving: null },
    ],
    bestTicket: { name: '緑川高原線フリーパス', price: '¥1,540', note: 'バス区間2日間乗り放題' },
  },
];

// ═══════════════════════════════════════
// P2: 通勤 — 中央駅→南口駅
// ═══════════════════════════════════════
const chuoRoutes: Route[] = [
  {
    id: 10, dep: '14:32', arr: '15:02', dur: '30分', cost: '¥209', transfers: 0,
    badges: ['安', '早', '楽'], badgeColors: ['#EA580C', '#2563EB', '#16A34A'],
    segments: [
      { type: 'walk', from: '中央駅', to: '中央', dur: '2分', dist: '0.1km' },
      { type: 'train', from: '中央', to: '南口', line: 'JR東西線・南口行', dur: '25分', stops: 3, color: '#16A34A', depTime: '14:34', arrTime: '14:59' },
      { type: 'walk', from: '南口', to: '南口駅', dur: '2分', dist: '0.1km' },
    ],
    tickets: [
      { id: 't10', label: 'おすすめ', name: '中心市街地乗り放題券', price: '¥500', days: '1日間', desc: '中央駅周辺バスが1日乗り放題。', saving: 'バス往復で¥100以上お得' },
      { id: 't12', label: 'チケットなし', name: '通常運賃（IC優先）', price: '¥209', days: '—', desc: '交通系ICカードでそのまま乗車。', saving: null },
    ],
    bestTicket: { name: '中心市街地乗り放題券', price: '¥500', note: '中央駅バス1日乗り放題' },
    discount: { cond: '中央市民', detail: '¥500 → ¥360（マイナンバーカード登録時）' },
  },
];

// ═══════════════════════════════════════
// P3: 通院 — 東部公民館→中央赤十字病院
// ═══════════════════════════════════════
const hospitalRoutes: Route[] = [
  {
    id: 99, dep: '15:12', arr: '17:59', dur: '2時間47分', cost: '¥6,355', transfers: 5,
    badges: [], badgeColors: [],
    segments: [
      { type: 'walk', from: '東部公民館', to: 'タクシー乗車', dur: '1分', dist: '—' },
      { type: 'train', from: 'タクシー', to: '入曽駅', line: 'タクシー（1.5km）', dur: '6分', stops: 0, color: '#6B7280', depTime: '15:12', arrTime: '15:18' },
      { type: 'train', from: '入曽', to: '本川越', line: '私鉄新宿線', dur: '12分', stops: 4, color: '#2563EB', depTime: '15:30', arrTime: '15:42' },
      { type: 'walk', from: '本川越', to: '川越駅', dur: '15分', dist: '1.2km' },
      { type: 'train', from: '川越', to: '大宮', line: 'JR川越線快速', dur: '22分', stops: 5, color: '#EA580C', depTime: '15:58', arrTime: '16:27' },
      { type: 'train', from: '大宮', to: '南口', line: '新幹線とき329号', dur: '33分', stops: 3, color: '#16A34A', depTime: '16:41', arrTime: '17:14' },
      { type: 'train', from: '南口', to: '中央大島', line: 'JR東西線', dur: '18分', stops: 5, color: '#F59E0B', depTime: '17:22', arrTime: '17:40' },
      { type: 'walk', from: '中央大島駅', to: 'タクシー乗車', dur: '1分', dist: '—' },
      { type: 'train', from: 'タクシー', to: '中央赤十字病院', line: 'タクシー（2km）', dur: '8分', stops: 0, color: '#6B7280', depTime: '17:51', arrTime: '17:59' },
    ],
    tickets: [
      { id: 't99', label: 'チケットなし', name: '通常運賃', price: '¥6,355', days: '—', desc: '他県経由。現実的ではありません。', saving: null },
    ],
    bestTicket: null,
  },
];

/** Context card for demand transport areas */
export const contextCard = {
  title: 'このエリアでは「呼べば来るバス」が使えます',
  desc: 'るんるんバス（東部・緑が丘地区）— 予約制の乗合バス。運賃300円（中央市民200円）。',
  action: '予約する →',
  discount: '中央市民・65歳以上の方は敬老割引パスで割引あり',
};

export const scenarios: Scenario[] = [
  { id: 'midorikawa', label: 'P1: 観光', from: '南口駅', to: '緑川温泉', showContext: false, routes: midorikawaRoutes },
  { id: 'chuo', label: 'P2: 通勤', from: '中央駅', to: '南口駅', showContext: false, routes: chuoRoutes },
  { id: 'hospital', label: 'P3: 通院', from: '東部公民館', to: '中央赤十字病院', showContext: true, routes: hospitalRoutes },
];
