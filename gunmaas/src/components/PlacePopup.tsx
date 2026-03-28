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
  const isOut = place.outOfPref === true;

  return (
    <div
      className="absolute left-4 right-4"
      style={{ bottom: bottomOffset + 8, zIndex: 30 }}
    >
      <div className="bg-surface rounded-lg p-4" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
        {/* 県外バナー */}
        {isOut && (
          <div
            className="flex items-center gap-2 rounded-sm px-3 py-2 mb-3"
            style={{ background: '#F1F5F9' }}
          >
            <span className="text-[14px]">🔒</span>
            <Typography variant="caption" color="muted" as="div">
              このスポットは<strong>{place.prefMaas ?? '他県MaaS'}</strong>の管轄エリアです
            </Typography>
          </div>
        )}

        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center flex-1">
            <div
              className="w-[44px] h-[44px] rounded-sm flex items-center justify-center text-[22px]"
              style={{ background: isOut ? '#F1F5F9' : '#F0FAF4', ...(isOut ? { filter: 'grayscale(0.8)' } : {}) }}
            >
              {place.emoji}
            </div>
            <div>
              <Typography variant="caption" color={isOut ? 'muted' : 'primary'} as="div" weight="bold">
                {place.cat}
              </Typography>
              <Typography variant="body-sm" as="div" weight="bold">
                {place.name}
              </Typography>
              {place.ticket && (
                <Typography variant="caption" color={isOut ? 'muted' : 'primary'} as="div" weight="semibold" className="mt-0">
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
          {isOut ? (
            <>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {/* ダミーリンク */}}
              >
                {place.prefMaas ?? '他県MaaS'}で確認
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => navigate(`/place/${place.id}`)}
              >
                詳しく見る
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};
