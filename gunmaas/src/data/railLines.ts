/** Rail line polyline data for SVG map (viewBox 0 0 400 360) */
export interface RailLine {
  name: string;
  color: string;
  points: [number, number][];
  dash: boolean;
}

export const railLines: RailLine[] = [
  { name: 'JR東西線', color: '#16A34A', points: [[195,260],[210,225],[225,190],[215,130],[215,50]], dash: false },
  { name: 'JR青葉線', color: '#F59E0B', points: [[225,190],[190,165],[165,140],[135,105],[115,80]], dash: false },
  { name: 'JR両毛線', color: '#F59E0B', points: [[195,260],[240,248],[290,240],[320,235]], dash: false },
  { name: '中央電鉄', color: '#DC2626', points: [[235,252],[270,245],[305,238],[320,235]], dash: true },
  { name: 'わたらせ渓谷鐵道', color: '#7C3AED', points: [[320,235],[340,210],[350,175]], dash: true },
  { name: '南部鉄道', color: '#0891B2', points: [[195,260],[165,275],[130,290],[95,305]], dash: true },
];

export const busRoutes: RailLine[] = [
  { name: '緑川高原線', color: '#2563EB', points: [[135,105],[120,85],[115,65]], dash: true },
  { name: '石段方面', color: '#2563EB', points: [[225,190],[215,170],[205,155]], dash: true },
];

/** Demand transport zones */
export interface DemandZone {
  id: string;
  name: string;
  area: string;
  color: string;
  border: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  fare: string;
  booking: string;
}

export const demandZones: DemandZone[] = [
  {
    id: 'runrun',
    name: 'るんるんバス',
    area: '東部・緑が丘地区',
    color: 'rgba(224,122,95,0.15)',
    border: 'rgba(224,122,95,0.4)',
    cx: 255, cy: 200, rx: 35, ry: 28,
    fare: '300円（市民200円）',
    booking: '前日までに予約',
  },
  {
    id: 'furusato',
    name: 'ふるさとバス',
    area: '西部・大沢地区',
    color: 'rgba(129,178,154,0.15)',
    border: 'rgba(129,178,154,0.4)',
    cx: 300, cy: 195, rx: 30, ry: 25,
    fare: '300円（市民200円）',
    booking: '前日までに予約',
  },
  {
    id: 'kitanori',
    name: 'きたのり',
    area: '北川市内',
    color: 'rgba(224,122,95,0.15)',
    border: 'rgba(224,122,95,0.4)',
    cx: 225, cy: 170, rx: 28, ry: 22,
    fare: '300円（高齢者150円）',
    booking: '前日までに予約',
  },
];
