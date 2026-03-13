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

export interface Destination {
  id: string;
  name: string;
  cat: string;
  area: string;
  tagline: string;
  emoji: string;
  color: string;
  gradient: string;
  access: AccessRoute[];
  tickets: Ticket[];
  spots: Spot[];
  booking: Booking[];
  discount: Discount | null;
}

export const destinations: Destination[] = [
  {
    id: 'midorikawa',
    name: '緑川温泉',
    cat: '温泉町',
    area: '緑川・青葉',
    tagline: '標高1,200mに湧く名湯、四季折々の自然に囲まれた温泉郷',
    emoji: '♨️',
    color: '#2D6A4F',
    gradient: 'linear-gradient(160deg, #2D6A4F 0%, #52B788 100%)',
    access: [
      { icon: '🚃', mode: '電車+バス', time: '約3時間', detail: '都心→緑川口（特急）→ 路線バス 25分' },
      { icon: '🚌', mode: '高速バス', time: '約4時間', detail: 'バスターミナル→緑川温泉BT 直行便' },
    ],
    tickets: [
      { name: '緑川高原線フリーパス', price: '¥1,540', days: '2日間', desc: '緑川口〜緑川温泉BT 乗り降り自由' },
      { name: 'ワンデーローカルパス', price: '¥2,600', days: '1日間', desc: '県内のJR線+私鉄が乗り放題' },
    ],
    spots: [
      { name: '湯の広場', desc: '温泉街のシンボル。毎分4,000Lの温泉が湧出' },
      { name: '西の散歩道', desc: '温泉の川が流れる幻想的な散歩道' },
      { name: '湯もみ会館', desc: '名物「湯もみ」を体験・見学' },
    ],
    booking: [],
    discount: null,
  },
  {
    id: 'ishidan',
    name: '石段温泉',
    cat: '温泉町',
    area: '北川',
    tagline: '365段の石段街が続く、古くから親しまれた名湯',
    emoji: '🏯',
    color: '#8B5E3C',
    gradient: 'linear-gradient(160deg, #8B5E3C 0%, #C49A6C 100%)',
    access: [
      { icon: '🚌', mode: '石段ライナー', time: '約60分', detail: '中央駅東口→石段温泉 直通・座席予約制' },
    ],
    tickets: [
      { name: '石段温泉フリーパス', price: '¥1,500', days: '2日間', desc: '北川駅〜石段温泉 乗り降り自由' },
      { name: '石段ライナー', price: '¥2,000', days: '片道', desc: '中央駅〜石段温泉 直通・予約制' },
    ],
    spots: [
      { name: '石段通り', desc: '365段の石段沿いに温泉まんじゅう店や射的' },
      { name: '紅葉橋', desc: '紅葉の名所。秋はライトアップも' },
    ],
    booking: [{ type: '石段ライナー予約', desc: '事前座席予約制' }],
    discount: null,
  },
  {
    id: 'chuo',
    name: '中央駅',
    cat: '駅',
    area: '中央市',
    tagline: '県庁所在地、バス路線の中心',
    emoji: '🚉',
    color: '#81B29A',
    gradient: 'linear-gradient(160deg, #81B29A 0%, #40916C 100%)',
    access: [
      { icon: '🚃', mode: 'JR東西線', time: '約15分', detail: '南口駅から各駅停車' },
      { icon: '🚃', mode: '中央電鉄', time: '徒歩10分', detail: '中央市駅から連絡' },
    ],
    tickets: [
      { name: '中心市街地乗り放題券', price: '¥500', days: '1日間', desc: '中央駅周辺200円区間のバスが乗り放題' },
      { name: 'サブスクパス Premium', price: '¥8,000', days: '月額', desc: 'つなぐポイント+乗りトククーポン付き' },
    ],
    spots: [
      { name: '旧迎賓館', desc: '国指定重要文化財の迎賓館' },
      { name: '駅前モール', desc: '中央駅北口直結のショッピングモール' },
    ],
    booking: [{ type: 'タクシー予約', desc: '地図から乗降車地を指定して呼べる' }],
    discount: { cond: '中央市民', detail: '乗り放題券 ¥500 → ¥360', sub: 'マイナンバーカード登録で適用' },
  },
  {
    id: 'kitakawa-hosp',
    name: '北川の病院へ',
    cat: '施設',
    area: '北川',
    tagline: '通院の移動をもっと気軽に',
    emoji: '🏥',
    color: '#E07A5F',
    gradient: 'linear-gradient(160deg, #E07A5F 0%, #F2CC8F 100%)',
    access: [
      { icon: '🚌', mode: '路線バス', time: '各方面', detail: '北川駅から市内各所へ' },
      { icon: '📱', mode: '呼べば来るバス', time: '予約制', detail: 'デマンド交通で自宅近くから乗車' },
    ],
    tickets: [
      { name: '北川市高齢者割引パス', price: '50%OFF', days: '年度', desc: '65歳以上の北川市民対象の路線バス割引' },
    ],
    spots: [],
    booking: [
      { type: 'デマンド交通予約', desc: '出発・降車バス停と日時を選んで予約' },
      { type: 'タクシー予約', desc: '地図から乗降車地を指定' },
    ],
    discount: { cond: '北川市民65歳以上', detail: 'バス50%OFF、タクシー30〜50%OFF', sub: 'マイナンバーカード+IC登録で適用' },
  },
];

export interface TicketWithDest extends Ticket {
  destName: string;
  destId: string;
}

export const allTickets: TicketWithDest[] = destinations.flatMap((d) =>
  d.tickets.map((t) => ({ ...t, destName: d.name, destId: d.id }))
);
