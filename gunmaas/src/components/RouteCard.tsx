/**
 * ルート候補カード（時刻+バッジ+チケット情報）
 */
import { Typography } from '@ds/primitives/Typography/Typography';
import type { Route } from '../data/routes';

interface RouteCardProps {
  route: Route;
  onClick: () => void;
}

export const RouteCard = ({ route, onClick }: RouteCardProps) => {
  const otherTickets = route.tickets.filter((t) => t.label !== 'チケットなし').length;

  return (
    <div
      onClick={onClick}
      className="bg-surface rounded-lg p-4 mb-3 border border-border-muted cursor-pointer"
    >
      {/* Time + badges */}
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-baseline gap-1">
          <span className="text-[20px] font-black text-onSurface-primary">{route.dep}</span>
          <span className="text-[14px] text-onSurface-subtle mx-1">→</span>
          <span className="text-[20px] font-black text-onSurface-primary">{route.arr}</span>
          <span className="text-[12px] text-onSurface-subtle ml-2">({route.dur})</span>
        </div>
        <div className="flex gap-1">
          {route.badges.map((b, i) => (
            <span
              key={b}
              className="inline-block rounded-[4px] px-1 py-0 text-[11px] font-bold"
              style={{ border: `1.5px solid ${route.badgeColors[i]}`, color: route.badgeColors[i] }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Cost + transfers */}
      <Typography variant="body-sm" color="muted" as="div" className={route.bestTicket ? 'mb-3' : ''}>
        {route.cost}　乗換{route.transfers}回
      </Typography>

      {/* Best ticket info */}
      {route.bestTicket && (
        <div
          className="rounded-sm p-3"
          style={{ background: '#F0FAF4', border: '1.5px solid rgba(45,106,79,0.15)' }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-[14px]">🎫</span>
              <span className="text-[13px] font-bold" style={{ color: '#2D6A4F' }}>
                {route.bestTicket.name}
              </span>
            </div>
            <span className="text-[16px] font-black" style={{ color: '#2D6A4F' }}>
              {route.bestTicket.price}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <Typography variant="caption" color="muted" as="span">
              {route.bestTicket.note}
            </Typography>
            {otherTickets > 1 && (
              <span className="text-[11px] font-semibold" style={{ color: '#2D6A4F' }}>
                他{otherTickets - 1}件 →
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
