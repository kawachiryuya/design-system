import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Alert } from '@ds/composites/Alert/Alert';
import { Card } from '@ds/composites/Card/Card';
import { Checkbox } from '@ds/composites/Checkbox/Checkbox';
import { seatClasses } from '../data/trains';

export const ConfirmPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const from = params.get('from') ?? '';
  const to = params.get('to') ?? '';
  const date = params.get('date') ?? '';
  const seatClassId = params.get('class') ?? 'reserved';
  const total = Number(params.get('total') ?? 0);
  const passengers = Number(params.get('passengers') ?? 1);
  const seatParam = params.get('seat') ?? '';
  const seats = seatParam ? seatParam.split(',') : [];

  const seatClass = seatClasses.find((c) => c.id === seatClassId);
  const [agreed, setAgreed] = useState(false);

  const handleConfirm = () => {
    navigate(`/complete?passengers=${passengers}`);
  };

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
      <div className="col-span-12 lg:col-span-8">
        <Typography variant="h5" as="h2" className="mb-4">予約内容の確認</Typography>

        <Alert variant="info">
          予約確定後のキャンセルは、マイページから行えます。
        </Alert>

        {/* 予約詳細 */}
        <Card className="mt-4 divide-y divide-border-muted">
          <div className="p-4">
            <Typography variant="label" as="h3" color="muted" className="mb-3">予約情報</Typography>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-onSurface-muted">区間</span>
                <span className="font-medium text-onSurface flex items-center gap-1">
                  {from}
                  <Icon name="arrow_forward" size="sm" color="inherit" />
                  {to}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-onSurface-muted">乗車日</span>
                <span className="font-medium text-onSurface">{date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-onSurface-muted">座席クラス</span>
                <span className="font-medium text-onSurface">{seatClass?.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-onSurface-muted">人数</span>
                <span className="font-medium text-onSurface">{passengers}名</span>
              </div>
              {seats.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-onSurface-muted">座席</span>
                  <span className="font-medium text-onSurface text-right">
                    {seats.map((s, i) => (
                      <span key={i} className="block">{s}</span>
                    ))}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 flex justify-between items-center">
            <Typography variant="label" color="muted">合計金額</Typography>
            <Typography variant="h3" weight="bold" as="span">¥{total.toLocaleString()}</Typography>
          </div>
        </Card>

        {/* 同意 */}
        <div className="mt-6 space-y-4">
          <Checkbox
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            label="利用規約に同意する"
          />

          <div className="hidden lg:flex gap-3 justify-end">
            <Button variant="tertiary" onClick={() => navigate(-1)}>
              戻る
            </Button>
            <Button onClick={handleConfirm} disabled={!agreed}>
              予約を確定する
            </Button>
          </div>
        </div>
      </div>

      {/* モバイル固定 CTA */}
      <div className="fixed bottom-16 left-0 right-0 lg:hidden z-40 bg-surface border-t border-border-muted shadow-sm"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <Typography variant="caption" color="muted">合計</Typography>
            <Typography variant="h5" weight="bold" as="p">¥{total.toLocaleString()}</Typography>
          </div>
          <Button onClick={handleConfirm} disabled={!agreed}>
            予約を確定する
          </Button>
        </div>
      </div>
      {/* モバイル固定 CTA 分のスペーサー */}
      <div className="col-span-12 h-16 lg:hidden" />
    </div>
  );
};
