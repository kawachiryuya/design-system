import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Badge } from '@ds/composites/Badge/Badge';
import { Card } from '@ds/composites/Card/Card';
import { searchTrains, seatClasses, type Train, type SeatAvailability } from '../data/trains';
import { formatDate } from '../utils/format';

const availabilityBadge = (status: SeatAvailability, label: string) => {
  switch (status) {
    case 'available':
      return <Badge variant="success" appearance="soft" size="small">○ {label}</Badge>;
    case 'few':
      return <Badge variant="warning" appearance="soft" size="small">△ {label}</Badge>;
    case 'sold-out':
      return <Badge variant="neutral" appearance="soft" size="small">{label} 満席</Badge>;
  }
};

const isAllSoldOut = (seats: Train['seats']) =>
  Object.values(seats).every((s) => s === 'sold-out');

export const ResultsPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const from = params.get('from') ?? '東京';
  const to = params.get('to') ?? '新大阪';
  const date = params.get('date') ?? '';
  const passengers = Number(params.get('passengers') ?? 1);

  const trains = searchTrains(from, to);
  const cheapestMultiplier = Math.min(...seatClasses.map((c) => c.priceMultiplier));

  const handleSelect = (train: Train) => {
    navigate(`/seat?trainId=${train.id}&from=${from}&to=${to}&date=${date}&passengers=${passengers}`);
  };

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
      {/* 検索条件: モバイル（アコーディオン） */}
      <div className="col-span-12 lg:hidden">
        <Card padding="sm">
          <details>
            <summary className="flex items-center justify-between cursor-pointer list-none text-sm [&::-webkit-details-marker]:hidden">
              <span className="font-medium text-onSurface">{from} → {to}<span className="text-onSurface-muted font-normal ml-2">{formatDate(date)} / {passengers}名</span></span>
              <Icon name="expand_more" size="sm" color="neutral" />
            </summary>
            <div className="border-t border-border-muted mt-3 pt-3">
              <dl className="text-sm space-y-2">
                <div className="flex justify-between">
                  <Typography variant="body-sm" color="muted" as="dt">区間</Typography>
                  <Typography variant="label" as="dd">{from} → {to}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body-sm" color="muted" as="dt">乗車日</Typography>
                  <Typography variant="label" as="dd">{formatDate(date)}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body-sm" color="muted" as="dt">人数</Typography>
                  <Typography variant="label" as="dd">{passengers}名</Typography>
                </div>
              </dl>
              <Button fullWidth variant="secondary" size="small" onClick={() => navigate('/')} className="mt-4">
                条件変更
              </Button>
            </div>
          </details>
        </Card>
      </div>

      {/* 検索条件: デスクトップ */}
      <div className="col-span-12 lg:col-span-4 lg:order-2 hidden lg:block">
        <Card padding="md" className="sticky top-6">
          <Typography variant="label" as="h3" color="muted" className="mb-3">検索条件</Typography>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between">
              <Typography variant="body-sm" color="muted" as="dt">区間</Typography>
              <Typography variant="label" as="dd">{from} → {to}</Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="body-sm" color="muted" as="dt">乗車日</Typography>
              <Typography variant="label" as="dd">{formatDate(date)}</Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="body-sm" color="muted" as="dt">人数</Typography>
              <Typography variant="label" as="dd">{passengers}名</Typography>
            </div>
          </dl>
          <Button fullWidth variant="secondary" size="small" onClick={() => navigate('/')} className="mt-4">
            条件変更
          </Button>
        </Card>
      </div>

      {/* 結果一覧 */}
      <div className="col-span-12 lg:col-span-8 lg:order-1 space-y-3">
        {trains.map((train) => {
          const soldOut = isAllSoldOut(train.seats);
          const cheapest = Math.round(train.price * cheapestMultiplier);
          const totalCheapest = cheapest * passengers;

          return (
            <Card
              key={train.id}
              clickable={!soldOut}
              onClick={!soldOut ? () => handleSelect(train) : undefined}
              padding="md"
              className={soldOut ? 'opacity-60 bg-surface-inset' : ''}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  {/* 1行目: 発着時刻 + 所要時間 */}
                  <div className="flex items-center gap-2">
                    <Typography variant="h5" weight="bold" as="span">{train.departure}</Typography>
                    <Typography variant="caption" color="muted" as="span">→</Typography>
                    <Typography variant="h5" weight="bold" as="span">{train.arrival}</Typography>
                    <Typography variant="caption" color="muted" as="span">({train.duration})</Typography>
                  </div>
                  {/* 2行目: 列車名 */}
                  <Typography variant="body-sm" color="muted">{train.name}</Typography>
                  {/* 3行目: 席種ごとの空席状況 */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {availabilityBadge(train.seats.unreserved, '自由席')}
                    {availabilityBadge(train.seats.reserved, '指定席')}
                    {availabilityBadge(train.seats.green, 'グリーン')}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {soldOut ? (
                    <Typography variant="h5" weight="bold" as="p" color="muted">満席</Typography>
                  ) : (
                    <>
                      <Typography variant="h5" weight="bold" as="p">
                        ¥{totalCheapest.toLocaleString()}〜
                      </Typography>
                      {passengers > 1 && (
                        <Typography variant="caption" color="muted">
                          ¥{cheapest.toLocaleString()} × {passengers}名
                        </Typography>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
