// 予約データモデル
// - Passenger: 乗客（ICカードは乗客に紐づく）
// - Leg: 乗車区間（乗り換えで複数になりうる。デモは全て単一 leg）
// - SeatAssignment: (passenger × leg) ごとの座席。自由席の leg では空。

export type ICCardType = 'suica' | 'pasmo' | 'icoca' | 'kitaca' | 'unknown';

export interface ICCard {
  type: ICCardType;
  /** マスク済み番号（下4桁等。e.g. "****1234"） */
  maskedNumber: string;
}

export interface Passenger {
  id: string; // 'P-001'
  type: 'adult' | 'child';
  icCard?: ICCard;
}

export interface Leg {
  id: string; // 'LEG-001'
  trainName: string;
  from: string;
  to: string;
  date: string; // 'YYYY-MM-DD'
  departure: string; // 'HH:mm'
  arrival: string;
  seatClassLabel: string;
}

export interface SeatAssignment {
  passengerId: string;
  legId: string;
  car: number;
  /** 座席番号（行+列）。e.g. '5A' */
  seatNumber: string;
}

export interface Payment {
  method: 'card';
  brand: 'visa' | 'mastercard' | 'amex' | 'jcb';
  last4: string;
  expiry: string;
}

export interface Reservation {
  id: string;
  passengers: Passenger[];
  legs: Leg[];
  seatAssignments: SeatAssignment[];
  total: number;
  payment?: Payment;
  status: 'upcoming' | 'completed';
}

// ---------- helpers ----------

export const brandLabel = (brand: Payment['brand']): string => {
  switch (brand) {
    case 'visa': return 'Visa';
    case 'mastercard': return 'Mastercard';
    case 'amex': return 'American Express';
    case 'jcb': return 'JCB';
  }
};

const icBrandLabel = (type: ICCardType): string => {
  switch (type) {
    case 'suica': return 'Suica';
    case 'pasmo': return 'PASMO';
    case 'icoca': return 'ICOCA';
    case 'kitaca': return 'Kitaca';
    case 'unknown': return 'IC カード';
  }
};

/** 表示用文字列 e.g. 'Suica ****1234' */
export const formatICCard = (ic: ICCard): string =>
  `${icBrandLabel(ic.type)} ${ic.maskedNumber}`;

/** 指定 leg × passenger の座席を取得 */
export const getSeat = (
  reservation: Reservation,
  passengerId: string,
  legId: string,
): SeatAssignment | undefined =>
  reservation.seatAssignments.find(
    (s) => s.passengerId === passengerId && s.legId === legId,
  );

/** 「おとな」「おとな 1」「こども」等のラベル。同 type が複数いる時に番号付け。 */
export const getPassengerLabel = (passengers: Passenger[], passengerId: string): string => {
  const idx = passengers.findIndex((p) => p.id === passengerId);
  if (idx < 0) return '';
  const p = passengers[idx];
  const sameTypeCount = passengers.filter((q) => q.type === p.type).length;
  const sameTypeIdx = passengers.slice(0, idx + 1).filter((q) => q.type === p.type).length;
  const base = p.type === 'adult' ? 'おとな' : 'こども';
  return sameTypeCount > 1 ? `${base} ${sameTypeIdx}` : base;
};

/** 旅程サマリ（単一 leg は先頭、複数 leg は最初と最後を結合） */
export interface TripSummary {
  from: string;
  to: string;
  date: string;
  trainName: string;
  departure: string;
  arrival: string;
  seatClassLabel: string;
  /** 乗り換えありかどうか */
  hasTransfer: boolean;
}

export const getTripSummary = (reservation: Reservation): TripSummary => {
  const legs = reservation.legs;
  const first = legs[0];
  const last = legs[legs.length - 1];
  const hasTransfer = legs.length > 1;
  return {
    from: first.from,
    to: last.to,
    date: first.date,
    trainName: hasTransfer ? `${first.trainName} ほか` : first.trainName,
    departure: first.departure,
    arrival: last.arrival,
    seatClassLabel: hasTransfer ? '複数区間' : first.seatClassLabel,
    hasTransfer,
  };
};

// ---------- mock data ----------

export const reservations: Reservation[] = [
  {
    id: 'RD-001',
    passengers: [
      { id: 'P-001', type: 'adult', icCard: { type: 'suica', maskedNumber: '****1234' } },
      { id: 'P-002', type: 'adult' },
      { id: 'P-003', type: 'child' },
    ],
    legs: [
      {
        id: 'LEG-001',
        trainName: 'のぞみ5号',
        from: '東京',
        to: '新大阪',
        date: '2026-06-05',
        departure: '07:00',
        arrival: '09:20',
        seatClassLabel: '普通車指定席',
      },
    ],
    seatAssignments: [
      { passengerId: 'P-001', legId: 'LEG-001', car: 3, seatNumber: '5A' },
      { passengerId: 'P-002', legId: 'LEG-001', car: 3, seatNumber: '5B' },
      { passengerId: 'P-003', legId: 'LEG-001', car: 3, seatNumber: '5C' },
    ],
    total: 33300,
    payment: { method: 'card', brand: 'visa', last4: '1234', expiry: '12/28' },
    status: 'upcoming',
  },
  {
    id: 'RD-002',
    passengers: [
      { id: 'P-001', type: 'adult', icCard: { type: 'pasmo', maskedNumber: '****5678' } },
      { id: 'P-002', type: 'adult', icCard: { type: 'suica', maskedNumber: '****9012' } },
    ],
    legs: [
      {
        id: 'LEG-001',
        trainName: 'のぞみ24号',
        from: '新大阪',
        to: '東京',
        date: '2026-06-07',
        departure: '17:00',
        arrival: '19:15',
        seatClassLabel: 'グリーン車',
      },
    ],
    seatAssignments: [
      { passengerId: 'P-001', legId: 'LEG-001', car: 8, seatNumber: '2A' },
      { passengerId: 'P-002', legId: 'LEG-001', car: 8, seatNumber: '2B' },
    ],
    total: 39960,
    payment: { method: 'card', brand: 'mastercard', last4: '5678', expiry: '08/27' },
    status: 'upcoming',
  },
  {
    id: 'RD-003',
    passengers: [
      { id: 'P-001', type: 'adult', icCard: { type: 'suica', maskedNumber: '****1234' } },
    ],
    legs: [
      {
        id: 'LEG-001',
        trainName: 'のぞみ11号',
        from: '東京',
        to: '名古屋',
        date: '2026-03-15',
        departure: '08:00',
        arrival: '09:40',
        seatClassLabel: '自由席',
      },
    ],
    seatAssignments: [], // 自由席のため座席指定なし
    total: 10170,
    payment: { method: 'card', brand: 'visa', last4: '1234', expiry: '12/28' },
    status: 'completed',
  },
];

export function getReservation(id: string): Reservation | undefined {
  return reservations.find((r) => r.id === id);
}
