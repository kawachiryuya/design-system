import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Badge } from '@ds/composites/Badge/Badge';
import { Card } from '@ds/composites/Card/Card';
import { seatClasses } from '../data/trains';

export const SeatPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const from = params.get('from') ?? '東京';
  const to = params.get('to') ?? '新大阪';
  const date = params.get('date') ?? '';
  const trainId = params.get('trainId') ?? '';

  const [selectedClass, setSelectedClass] = useState('reserved');
  const basePrice = 13320;

  const selected = seatClasses.find((c) => c.id === selectedClass)!;
  const totalPrice = Math.round(basePrice * selected.priceMultiplier);

  const handleNext = () => {
    navigate(`/seatmap?trainId=${trainId}&from=${from}&to=${to}&date=${date}&class=${selectedClass}&price=${totalPrice}`);
  };

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
      {/* 左: 座席クラス選択 */}
      <div className="col-span-12 lg:col-span-8">
        {/* 列車サマリー */}
        <Card padding="md" className="mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Icon name="train" size="sm" color="primary" />
            <span className="font-semibold text-onSurface">{from} → {to}</span>
            <Typography variant="body-sm" color="muted" as="span">{date}</Typography>
          </div>
        </Card>

        <Typography variant="h5" as="h2" className="mb-4">座席クラスを選択</Typography>

        <div className="space-y-3">
          {seatClasses.map((cls) => {
            const isSelected = cls.id === selectedClass;
            const price = Math.round(basePrice * cls.priceMultiplier);

            return (
              <button
                key={cls.id}
                type="button"
                onClick={() => setSelectedClass(cls.id)}
                className={`w-full text-left rounded-lg border-2 p-4 transition-all ${
                  isSelected
                    ? 'border-border-primary bg-surface-secondary'
                    : 'border-border-muted bg-surface hover:border-border-strong'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-onSurface">{cls.label}</span>
                      {cls.id === 'green' && (
                        <Badge variant="primary" appearance="soft" size="small">人気</Badge>
                      )}
                    </div>
                    <Typography variant="body-sm" color="muted" className="mt-1">{cls.description}</Typography>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-onSurface">¥{price.toLocaleString()}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 右: 料金サマリー */}
      <div className="col-span-12 lg:col-span-4">
        <Card variant="filled" padding="md" className="sticky top-6">
          <Typography variant="label" as="h3" color="muted" className="mb-3">予約内容</Typography>
          <dl className="text-sm space-y-2 mb-4">
            <div className="flex justify-between">
              <dt className="text-onSurface-muted">座席クラス</dt>
              <dd className="font-medium text-onSurface">{selected.label}</dd>
            </div>
          </dl>
          <div className="border-t border-border-muted pt-4 mb-4">
            <Typography variant="body-sm" color="muted">合計金額</Typography>
            <p className="text-2xl font-bold text-onSurface">¥{totalPrice.toLocaleString()}</p>
          </div>
          <Button fullWidth onClick={handleNext}>
            座席を選択する
          </Button>
        </Card>
      </div>
    </div>
  );
};
