import { destinations, type Destination } from './destinations';

export interface Segment {
  id: string;
  emoji: string;
  title: string;
  sub: string;
  color: string;
  gradient: string;
  dests: Destination[];
}

export const segments: Segment[] = [
  {
    id: 'travel',
    emoji: '🗻',
    title: '旅する',
    sub: '温泉・自然・鉄道旅',
    color: '#2D6A4F',
    gradient: 'linear-gradient(135deg, rgba(45,106,79,0.09), rgba(64,145,108,0.06))',
    dests: destinations.filter((d) => d.cat === '温泉町'),
  },
  {
    id: 'daily',
    emoji: '🚌',
    title: '暮らす',
    sub: '通勤・通院・おでかけ',
    color: '#81B29A',
    gradient: 'linear-gradient(135deg, rgba(129,178,154,0.09), rgba(64,145,108,0.06))',
    dests: destinations.filter((d) => d.cat !== '温泉町'),
  },
];
