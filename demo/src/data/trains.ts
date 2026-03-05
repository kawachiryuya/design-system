export interface Train {
  id: string;
  name: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  seats: 'available' | 'few' | 'sold-out';
}

export interface SeatClass {
  id: string;
  label: string;
  description: string;
  priceMultiplier: number;
}

export const seatClasses: SeatClass[] = [
  { id: 'unreserved', label: '自由席', description: '座席指定なし・空いている席に着席', priceMultiplier: 0.85 },
  { id: 'reserved', label: '普通車指定席', description: '指定された座席でゆったり移動', priceMultiplier: 1 },
  { id: 'green', label: 'グリーン車', description: '広い座席とゆとりの空間', priceMultiplier: 1.5 },
  { id: 'gran', label: 'グランクラス', description: '最上級のおもてなし', priceMultiplier: 2.2 },
];

export type SeatStatus = 'available' | 'occupied';

export interface Seat {
  id: string;       // e.g. "3A"
  row: number;
  col: string;      // A, B, C, D, E
  status: SeatStatus;
}

/** 席種に応じた利用可能号車を返す */
export function carNumbersForClass(classId: string): number[] {
  switch (classId) {
    case 'green': return [8, 9];
    case 'gran': return [10];
    default: return [1, 2, 3, 4, 5, 6, 7];
  }
}

/** 号車番号ごとに決定的な occupied パターンを生成 */
function occupiedSeatsForCar(carNumber: number): Set<string> {
  const basePatterns: Record<number, string[]> = {
    1:  ['1B', '2D', '3A', '4C', '5E', '6B', '7D', '8A'],
    2:  ['1A', '2C', '3E', '4B', '5D', '6A', '7C', '8E'],
    3:  ['1D', '2B', '3C', '4E', '5A', '6D', '7B', '8C'],
    4:  ['1C', '2E', '3B', '4A', '5C', '6E', '7A', '8D'],
    5:  ['1E', '2A', '3D', '4B', '5B', '6C', '7E', '8A'],
    6:  ['1A', '1C', '2B', '3D', '4E', '5A', '6B', '8C'],
    7:  ['1B', '2C', '2E', '3A', '4D', '5C', '6E', '7A'],
    8:  ['1B', '2D', '3A', '4C', '5B', '6D', '7A', '8C'],
    9:  ['1A', '2C', '3B', '4D', '5A', '6C', '7D', '8B'],
    10: ['1B', '2A', '3D', '4C', '5B', '6A', '7C', '8D'],
  };
  return new Set(basePatterns[carNumber] ?? []);
}

/** 座席クラス・号車に応じたシートマップを生成 */
export function generateSeatMap(classId: string, carNumber: number): Seat[] {
  const cols = classId === 'reserved' ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C', 'D'];
  const rows = 8;
  const seats: Seat[] = [];
  const occupied = occupiedSeatsForCar(carNumber);

  for (let r = 1; r <= rows; r++) {
    for (const c of cols) {
      const id = `${r}${c}`;
      seats.push({
        id,
        row: r,
        col: c,
        status: occupied.has(id) ? 'occupied' : 'available',
      });
    }
  }
  return seats;
}

/** 検索結果のモックデータを生成 */
export function searchTrains(_from: string, _to: string): Train[] {
  const base = [
    { suffix: '1号', dep: '06:30', arr: '08:45', dur: '2時間15分', price: 13320, seats: 'available' as const },
    { suffix: '5号', dep: '07:00', arr: '09:20', dur: '2時間20分', price: 13320, seats: 'available' as const },
    { suffix: '11号', dep: '08:00', arr: '10:12', dur: '2時間12分', price: 13320, seats: 'few' as const },
    { suffix: '23号', dep: '09:30', arr: '11:45', dur: '2時間15分', price: 13320, seats: 'available' as const },
    { suffix: '37号', dep: '11:00', arr: '13:18', dur: '2時間18分', price: 13320, seats: 'available' as const },
    { suffix: '45号', dep: '12:30', arr: '14:42', dur: '2時間12分', price: 13320, seats: 'few' as const },
    { suffix: '59号', dep: '14:00', arr: '16:20', dur: '2時間20分', price: 13320, seats: 'sold-out' as const },
    { suffix: '67号', dep: '16:00', arr: '18:15', dur: '2時間15分', price: 13320, seats: 'available' as const },
  ];

  return base.map((t, i) => ({
    id: `train-${i}`,
    name: `のぞみ${t.suffix}`,
    departure: t.dep,
    arrival: t.arr,
    duration: t.dur,
    price: t.price,
    seats: t.seats,
  }));
}
