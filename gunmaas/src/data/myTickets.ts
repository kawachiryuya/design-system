export type TicketStatus = 'active' | 'used' | 'expired';

export interface MyTicket {
  id: string;
  name: string;
  destName: string;
  destId: string;
  price: string;
  days: string;
  status: TicketStatus;
  purchasedAt: string;
  validUntil: string;
}

export const myTickets: MyTicket[] = [
  {
    id: 'mt-001',
    name: '緑川高原線フリーパス',
    destName: '緑川温泉',
    destId: 'midorikawa',
    price: '¥1,540',
    days: '2日間',
    status: 'active',
    purchasedAt: '2026-03-14',
    validUntil: '2026-03-15',
  },
  {
    id: 'mt-002',
    name: '中心市街地乗り放題券',
    destName: '中央駅',
    destId: 'chuo',
    price: '¥500',
    days: '1日間',
    status: 'used',
    purchasedAt: '2026-03-10',
    validUntil: '2026-03-10',
  },
  {
    id: 'mt-003',
    name: '石段温泉フリーパス',
    destName: '石段温泉',
    destId: 'ishidan',
    price: '¥1,500',
    days: '2日間',
    status: 'expired',
    purchasedAt: '2026-02-22',
    validUntil: '2026-02-23',
  },
];
