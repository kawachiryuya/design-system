/**
 * マイチケットページ — 利用中/過去サブタブ + パンチ穴チケットカード
 */
import { useState } from 'react';
import { Typography } from '@ds/primitives/Typography/Typography';
import { useTicketStore } from '../store/ticketStore';
import { PunchTicketCard } from '../components/PunchTicketCard';

// Demo data with richer fields for the punch-hole design
const activeTicketData = [
  { id: 'at1', name: '緑川高原線フリーパス', area: '緑川口 〜 緑川温泉BT', price: '¥1,540', validUntil: '2026/03/16 23:59', daysLeft: '本日まで', status: '利用中', color: '#2D6A4F', emoji: '♨️' },
  { id: 'at2', name: '中心市街地乗り放題券', area: '中央駅周辺200円区間', price: '¥500', validUntil: '2026/03/20 23:59', daysLeft: 'あと4日', status: '利用中', color: '#81B29A', emoji: '🚌' },
];

const pastTicketData = [
  { id: 'pt1', name: 'ワンデーローカルパス', area: '県内JR+私鉄全線', price: '¥2,600', validUntil: '2026/03/08', status: '使用済み', color: '#94A3B8', emoji: '🚃' },
  { id: 'pt2', name: '緑川高原線フリーパス', area: '緑川口 〜 緑川温泉BT', price: '¥1,540', validUntil: '2026/02/22', status: '使用済み', color: '#94A3B8', emoji: '♨️' },
  { id: 'pt3', name: '中心市街地乗り放題券', area: '中央駅周辺200円区間', price: '¥500', validUntil: '2026/02/15', status: '期限切れ', color: '#94A3B8', emoji: '🚌' },
];

export const MyTicketsPage = () => {
  const [ticketView, setTicketView] = useState<'active' | 'past'>('active');
  // Include dynamically purchased tickets from store
  const { tickets: storeTickets } = useTicketStore();
  const dynamicActive = storeTickets
    .filter((t) => t.status === 'active')
    .map((t) => ({
      id: t.id, name: t.name, area: t.destName, price: t.price,
      validUntil: t.validUntil, daysLeft: undefined, status: '利用中',
      color: '#2D6A4F', emoji: '🎫',
    }));

  const allActive = [...dynamicActive, ...activeTicketData];

  return (
    <div className="bg-background" style={{ minHeight: 'calc(100dvh - 42px - 64px)' }}>
      {/* Header with sub-tabs */}
      <div className="bg-surface px-4 pt-4 pb-0 border-b border-border-muted">
        <div className="text-[20px] font-black text-onSurface-primary mb-3">マイチケット</div>
        <div className="flex">
          {[
            { id: 'active' as const, label: `利用中 (${allActive.length})` },
            { id: 'past' as const, label: `過去 (${pastTicketData.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTicketView(t.id)}
              className="flex-1 py-3 border-none bg-transparent cursor-pointer text-[14px] font-bold"
              style={{
                borderBottom: ticketView === t.id ? '2.5px solid #2D6A4F' : '2.5px solid transparent',
                color: ticketView === t.id ? '#2D6A4F' : '#94A3B8',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket list */}
      <div className="p-4">
        {ticketView === 'active' && allActive.map((t) => (
          <PunchTicketCard
            key={t.id}
            name={t.name}
            area={t.area}
            emoji={t.emoji}
            price={t.price}
            validUntil={t.validUntil}
            daysLeft={t.daysLeft}
            status={t.status}
            color={t.color}
            isActive
          />
        ))}
        {ticketView === 'past' && pastTicketData.map((t) => (
          <PunchTicketCard
            key={t.id}
            name={t.name}
            area={t.area}
            emoji={t.emoji}
            price={t.price}
            validUntil={t.validUntil}
            status={t.status}
            color={t.color}
            isActive={false}
          />
        ))}

        {ticketView === 'active' && allActive.length === 0 && (
          <div className="text-center py-10">
            <div className="text-[40px] mb-3">🎫</div>
            <Typography variant="body-sm" color="muted" as="div">
              有効なチケットはありません
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};
