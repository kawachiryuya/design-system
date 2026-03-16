/**
 * ピンタップ時のポップアップカード
 */
import { useNavigate } from 'react-router-dom';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Button } from '@ds/primitives/Button/Button';
import type { Destination } from '../data/destinations';

interface PlacePopupProps {
  place: Destination;
  onClose: () => void;
  bottomOffset: number;
}

export const PlacePopup = ({ place, onClose, bottomOffset }: PlacePopupProps) => {
  const navigate = useNavigate();

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
              style={{ background: '#F0FAF4' }}
            >
              {place.emoji}
            </div>
            <div>
              <Typography variant="caption" color="primary" as="div" weight="bold">
                {place.cat}
              </Typography>
              <Typography variant="body-sm" as="div" weight="bold">
                {place.name}
              </Typography>
              {place.ticket && (
                <Typography variant="caption" color="primary" as="div" weight="semibold" className="mt-0">
                  🎫 {place.ticket}
                </Typography>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-background border-none rounded-sm w-[28px] h-[28px] cursor-pointer text-[12px] text-onSurface-subtle"
          >
            ✕
          </button>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            className="flex-1"
            onClick={() => navigate(`/search?to=${place.name}`)}
            style={{ background: 'linear-gradient(135deg, #E07A5F, #C4623F)' }}
          >
            ここへ行く
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => navigate(`/place/${place.id}`)}
          >
            詳しく見る
          </Button>
        </div>
      </div>
    </div>
  );
};
