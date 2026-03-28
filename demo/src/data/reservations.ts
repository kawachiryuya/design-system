export interface Passenger {
  type: 'adult' | 'child';
  icCard?: string;
}

export interface Reservation {
  id: string;
  from: string;
  to: string;
  date: string;
  trainName: string;
  departure: string;
  arrival: string;
  seatClassLabel: string;
  seats: string[];
  total: number;
  passengers: Passenger[];
  status: 'upcoming' | 'completed';
}

export const reservations: Reservation[] = [
  {
    id: 'RD-001',
    from: '東京',
    to: '新大阪',
    date: '2026-04-05',
    trainName: 'のぞみ5号',
    departure: '07:00',
    arrival: '09:20',
    seatClassLabel: '普通車指定席',
    seats: ['3号車 5A', '3号車 5B', '3号車 5C'],
    total: 33300,
    passengers: [
      { type: 'adult', icCard: 'Suica ****1234' },
      { type: 'adult' },
      { type: 'child' },
    ],
    status: 'upcoming',
  },
  {
    id: 'RD-002',
    from: '新大阪',
    to: '東京',
    date: '2026-04-07',
    trainName: 'のぞみ24号',
    departure: '17:00',
    arrival: '19:15',
    seatClassLabel: 'グリーン車',
    seats: ['8号車 2A', '8号車 2B'],
    total: 39960,
    passengers: [
      { type: 'adult', icCard: 'PASMO ****5678' },
      { type: 'adult', icCard: 'Suica ****9012' },
    ],
    status: 'upcoming',
  },
  {
    id: 'RD-003',
    from: '東京',
    to: '名古屋',
    date: '2026-03-15',
    trainName: 'のぞみ11号',
    departure: '08:00',
    arrival: '09:40',
    seatClassLabel: '自由席',
    seats: [],
    total: 10170,
    passengers: [
      { type: 'adult', icCard: 'Suica ****1234' },
    ],
    status: 'completed',
  },
];

export function getReservation(id: string): Reservation | undefined {
  return reservations.find((r) => r.id === id);
}
