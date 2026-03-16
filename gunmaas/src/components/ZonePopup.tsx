/**
 * デマンド交通ゾーンポップアップ
 */
import { Typography } from '@ds/primitives/Typography/Typography';
import { Button } from '@ds/primitives/Button/Button';
import type { DemandZone } from '../data/railLines';

interface ZonePopupProps {
  zone: DemandZone;
  onClose: () => void;
  bottomOffset: number;
}

export const ZonePopup = ({ zone, onClose, bottomOffset }: ZonePopupProps) => {
  return (
    <div
      className="absolute left-4 right-4"
      style={{ bottom: bottomOffset + 8, zIndex: 30 }}
    >
      <div className="bg-surface rounded-lg p-4" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center flex-1">
            <div
              className="w-[44px] h-[44px] rounded-sm flex items-center justify-center text-[22px]"
              style={{ background: '#FDF6E8' }}
            >
              📱
            </div>
            <div>
              <Typography variant="caption" as="div" weight="bold" className="text-[#E07A5F]">
                呼べば来るバス
              </Typography>
              <Typography variant="body-sm" as="div" weight="bold">
                {zone.name}
              </Typography>
              <Typography variant="caption" color="muted" as="div">
                {zone.area}
              </Typography>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-background border-none rounded-sm w-[28px] h-[28px] cursor-pointer text-[12px] text-onSurface-subtle"
          >
            ✕
          </button>
        </div>
        <div className="flex gap-4 mt-3 p-3 bg-background rounded-sm">
          <div>
            <Typography variant="caption" color="muted" as="div">運賃</Typography>
            <Typography variant="body-sm" as="div" weight="bold">{zone.fare}</Typography>
          </div>
          <div>
            <Typography variant="caption" color="muted" as="div">予約</Typography>
            <Typography variant="body-sm" as="div" weight="bold">{zone.booking}</Typography>
          </div>
        </div>
        <Button
          fullWidth
          className="mt-3"
          style={{ background: 'linear-gradient(135deg, #E07A5F, #C4623F)' }}
        >
          予約する
        </Button>
      </div>
    </div>
  );
};
