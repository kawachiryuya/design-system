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
  const seat = params.get('seat') ?? '';

  const seatClass = seatClasses.find((c) => c.id === seatClassId);
  const [agreed, setAgreed] = useState(false);

  const handleConfirm = () => {
    navigate('/complete');
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
            <Typography variant="label" as="h3" color="muted" className="mb-3">列車情報</Typography>
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
              {seat && (
                <div className="flex justify-between text-sm">
                  <span className="text-onSurface-muted">座席</span>
                  <span className="font-medium text-onSurface">{seat}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 flex justify-between items-center">
            <Typography variant="label" color="muted">合計金額</Typography>
            <span className="text-2xl font-bold text-onSurface">¥{total.toLocaleString()}</span>
          </div>
        </Card>

        {/* 同意 */}
        <div className="mt-6 space-y-4">
          <Checkbox
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            label="利用規約に同意する"
          />

          <div className="flex gap-3 justify-end">
            <Button variant="tertiary" onClick={() => navigate(-1)}>
              戻る
            </Button>
            <Button onClick={handleConfirm} disabled={!agreed}>
              予約を確定する
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
