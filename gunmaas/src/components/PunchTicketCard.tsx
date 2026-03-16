/**
 * パンチ穴デザインチケットカード
 * ヘッダーバンド（路線色）+ emoji + パンチ穴切り取り線 + 詳細
 */
import { Typography } from '@ds/primitives/Typography/Typography';

interface PunchTicketProps {
  name: string;
  area: string;
  emoji: string;
  price: string;
  validUntil: string;
  daysLeft?: string;
  status: string;
  color: string;
  isActive: boolean;
  onShowTicket?: () => void;
  onRepurchase?: () => void;
  onReceipt?: () => void;
  onCancel?: () => void;
}

export const PunchTicketCard = ({
  name, area, emoji, price, validUntil, daysLeft, status, color,
  isActive, onShowTicket, onRepurchase, onReceipt, onCancel,
}: PunchTicketProps) => {
  return (
    <div
      className="bg-surface rounded-lg overflow-hidden border border-border-muted mb-3"
      style={{ opacity: isActive ? 1 : 0.7 }}
    >
      {/* Color header band */}
      <div
        className="px-4 py-3 flex justify-between items-center"
        style={{ background: isActive ? `linear-gradient(135deg, ${color}, ${color}CC)` : 'var(--color-bg-default, #F7FAF8)' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-[22px]">{emoji}</span>
          <div>
            <div className="text-[15px] font-black" style={{ color: isActive ? 'white' : '#1C2833' }}>
              {name}
            </div>
            <div className="text-[11px] mt-0" style={{ color: isActive ? 'rgba(255,255,255,0.8)' : '#94A3B8' }}>
              {area}
            </div>
          </div>
        </div>
        {isActive && (
          <div className="rounded-sm px-3 py-1" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <span className="text-[11px] font-bold text-white">{status}</span>
          </div>
        )}
      </div>

      {/* Punch hole divider */}
      <div className="flex items-center" style={{ margin: '0 -4px' }}>
        <div className="w-4 h-4 rounded-full bg-background flex-shrink-0" style={{ marginLeft: -8 }} />
        <div className="flex-1 border-t-[2px] border-dashed border-border-muted" />
        <div className="w-4 h-4 rounded-full bg-background flex-shrink-0" style={{ marginRight: -8 }} />
      </div>

      {/* Details */}
      <div className="px-4 py-3 pb-4">
        <div className="flex justify-between items-baseline">
          <div>
            <Typography variant="caption" color="muted" as="div">
              {isActive ? '有効期限' : '利用日'}
            </Typography>
            <Typography variant="body-sm" as="div" weight="semibold">{validUntil}</Typography>
          </div>
          <div className="text-right">
            <Typography variant="caption" color="muted" as="div">購入金額</Typography>
            <span className="text-[16px] font-black" style={{ color: isActive ? '#2D6A4F' : '#94A3B8' }}>
              {price}
            </span>
          </div>
        </div>

        {/* Days left badge */}
        {isActive && daysLeft && (
          <div
            className="inline-block rounded-sm px-3 py-1 mt-3 text-[11px] font-bold"
            style={{
              background: daysLeft === '本日まで' ? '#FDF6E8' : '#F0FAF4',
              color: daysLeft === '本日まで' ? '#E07A5F' : '#2D6A4F',
            }}
          >
            ⏳ {daysLeft}
          </div>
        )}

        {/* Active ticket actions */}
        {isActive && (
          <>
            <button
              onClick={onShowTicket}
              className="mt-3 w-full border-none rounded-sm py-3 text-[13px] font-bold cursor-pointer text-white"
              style={{ background: 'linear-gradient(135deg, #2D6A4F, #40916C)' }}
            >
              チケットを表示する
            </button>
            <div className="text-center mt-2">
              <span
                onClick={onCancel}
                className="text-[12px] text-onSurface-subtle cursor-pointer"
              >
                取り消し・払い戻し
              </span>
            </div>
          </>
        )}

        {/* Past ticket actions */}
        {!isActive && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={onRepurchase}
              className="flex-1 rounded-sm py-2 text-[12px] font-semibold cursor-pointer"
              style={{ background: 'white', color: '#2D6A4F', border: '1.5px solid #2D6A4F' }}
            >
              もう一度購入
            </button>
            <button
              onClick={onReceipt}
              className="flex-1 rounded-sm py-2 text-[12px] font-semibold cursor-pointer"
              style={{ background: 'var(--color-bg-default, #F7FAF8)', color: '#94A3B8', border: '1px solid var(--color-border-muted, #E2EDE6)' }}
            >
              領収書
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
