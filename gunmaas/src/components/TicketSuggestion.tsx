/**
 * チケット比較セクション（ルート詳細ボトムシート内）
 */
import { Typography } from '@ds/primitives/Typography/Typography';
import type { Route, TicketSuggestion as TicketSuggestionType } from '../data/routes';

interface TicketSuggestionProps {
  route: Route;
  onPurchase: (ticket: TicketSuggestionType) => void;
}

export const TicketSuggestion = ({ route, onPurchase }: TicketSuggestionProps) => {
  return (
    <div style={{ borderTop: '6px solid var(--color-bg-default, #F7FAF8)' }}>
      <div className="px-5 pt-4 pb-2">
        <Typography variant="body" as="div" weight="bold" className="mb-0">
          🎫 このルートで使えるチケット
        </Typography>
        <Typography variant="caption" color="muted" as="div" className="mb-3">
          おすすめを比較できます
        </Typography>

        {/* Discount banner */}
        {route.discount && (
          <div
            className="rounded-sm p-3 mb-3 flex gap-2 items-start"
            style={{ background: '#FDF6E8', border: '1px solid #F2CC8F' }}
          >
            <span className="text-[13px] flex-shrink-0">💡</span>
            <div>
              <span className="text-[12px] font-bold text-onSurface-primary">{route.discount.cond}の方: </span>
              <span className="text-[12px] font-bold" style={{ color: '#E07A5F' }}>{route.discount.detail}</span>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pb-5 flex flex-col gap-3">
        {route.tickets.map((t, i) => (
          <div
            key={t.id}
            className="rounded-lg p-4"
            style={{
              background: i === 0 ? '#F0FAF4' : 'white',
              border: i === 0 ? '1.5px solid rgba(45,106,79,0.19)' : '1px solid var(--color-border-muted, #E2EDE6)',
            }}
          >
            {/* Label badge */}
            <div
              className="inline-block rounded-[6px] px-2 py-0 text-[10px] font-bold mb-2"
              style={{
                background: i === 0 ? '#2D6A4F' : 'var(--color-bg-default, #F7FAF8)',
                color: i === 0 ? 'white' : '#94A3B8',
              }}
            >
              {t.label}
            </div>

            <div className="flex justify-between items-start">
              <div className="flex-1 pr-3">
                <Typography variant="body" as="div" weight="bold">{t.name}</Typography>
                <Typography variant="caption" color="muted" as="div" className="mt-1 leading-relaxed">
                  {t.desc}
                </Typography>
                {t.saving && (
                  <div className="mt-1 text-[12px] font-bold" style={{ color: '#E07A5F' }}>
                    💡 {t.saving}
                  </div>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[20px] font-black" style={{ color: '#2D6A4F' }}>{t.price}</div>
                <Typography variant="caption" color="muted" as="div">{t.days}</Typography>
                {t.label !== 'チケットなし' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onPurchase(t); }}
                    className="mt-2 border-none rounded-sm px-4 py-2 text-[12px] font-bold cursor-pointer"
                    style={{
                      background: i === 0 ? 'linear-gradient(135deg, #E07A5F, #C4623F)' : 'white',
                      color: i === 0 ? 'white' : '#2D6A4F',
                      border: i === 0 ? 'none' : '1.5px solid #2D6A4F',
                    }}
                  >
                    購入
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
