/**
 * デマンド交通コンテキストカード
 * P3（通院）シナリオなど直通ルートが無い場合に表示
 */
import { Typography } from '@ds/primitives/Typography/Typography';
import { contextCard } from '../data/routes';

export const ContextCard = () => {
  return (
    <div
      className="rounded-lg p-4 mb-3"
      style={{ background: '#FDF6E8', border: '1.5px solid #F2CC8F' }}
    >
      <div className="flex gap-3 items-start">
        <span className="text-[22px] flex-shrink-0">📱</span>
        <div className="flex-1">
          <Typography variant="body-sm" as="div" weight="bold" className="mb-1">
            {contextCard.title}
          </Typography>
          <Typography variant="caption" color="muted" as="div" className="leading-relaxed">
            {contextCard.desc}
          </Typography>
          <div className="text-[11px] font-semibold mt-1" style={{ color: '#E07A5F' }}>
            💡 {contextCard.discount}
          </div>
          <button
            className="mt-3 w-full border-none rounded-sm py-3 text-[13px] font-bold cursor-pointer text-white"
            style={{ background: 'linear-gradient(135deg, #E07A5F, #C4623F)' }}
          >
            {contextCard.action}
          </button>
        </div>
      </div>
    </div>
  );
};
