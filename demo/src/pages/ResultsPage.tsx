import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Badge } from '@ds/composites/Badge/Badge';
import { Card } from '@ds/composites/Card/Card';
import { searchTrains, type Train } from '../data/trains';

const seatsBadge = (seats: Train['seats']) => {
  switch (seats) {
    case 'available':
      return <Badge variant="success" appearance="soft" size="small">空席あり</Badge>;
    case 'few':
      return <Badge variant="warning" appearance="soft" size="small">残りわずか</Badge>;
    case 'sold-out':
      return <Badge variant="neutral" appearance="soft" size="small">満席</Badge>;
  }
};

export const ResultsPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const from = params.get('from') ?? '東京';
  const to = params.get('to') ?? '新大阪';
  const date = params.get('date') ?? '';
  const passengers = Number(params.get('passengers') ?? 1);

  const trains = searchTrains(from, to);

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
              <span className="font-medium text-onSurface">{from} → {to}<span className="text-onSurface-muted font-normal ml-2">{date} / {passengers}名</span></span>
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
                  <Typography variant="label" as="dd">{date}</Typography>
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
              <Typography variant="label" as="dd">{date}</Typography>
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
        {trains.map((train) => (
          <Card
            key={train.id}
            clickable={train.seats !== 'sold-out'}
            onClick={train.seats !== 'sold-out' ? () => handleSelect(train) : undefined}
            padding="md"
            className={train.seats === 'sold-out' ? 'opacity-60 bg-surface-inset' : ''}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <Typography variant="caption" color="muted">{train.name}</Typography>
                  <div className="flex items-baseline gap-2">
                    <Typography variant="h5" weight="bold" as="span">{train.departure}</Typography>
                    <Typography variant="caption" color="muted" as="span">→</Typography>
                    <Typography variant="h5" weight="bold" as="span">{train.arrival}</Typography>
                  </div>
                  <Typography variant="caption" color="muted" className="flex items-center gap-1 mt-1">
                    <Icon name="schedule" size="sm" color="inherit" />
                    {train.duration}
                  </Typography>
                </div>
              </div>

              <div className="text-right space-y-1">
                <Typography variant="h5" weight="bold" as="p">
                  ¥{train.price.toLocaleString()}
                </Typography>
                {seatsBadge(train.seats)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
