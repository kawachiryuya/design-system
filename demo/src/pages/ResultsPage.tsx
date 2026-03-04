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

  const trains = searchTrains(from, to);

  const handleSelect = (train: Train) => {
    navigate(`/seat?trainId=${train.id}&from=${from}&to=${to}&date=${date}`);
  };

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
      {/* 検索条件サマリー */}
      <div className="col-span-12 flex items-center gap-3 mb-2">
        <div className="flex items-center gap-2 text-sm text-onSurface">
          <span className="font-semibold">{from}</span>
          <Icon name="arrow_forward" size="sm" color="primary" />
          <span className="font-semibold">{to}</span>
        </div>
        <Typography variant="body-sm" color="muted" as="span">{date}</Typography>
        <Button size="small" variant="tertiary" onClick={() => navigate('/')}>
          条件変更
        </Button>
      </div>

      {/* 結果一覧 */}
      <div className="col-span-12 lg:col-span-8 space-y-3">
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
                    <span className="text-lg font-bold text-onSurface">{train.departure}</span>
                    <Typography variant="caption" color="muted" as="span">→</Typography>
                    <span className="text-lg font-bold text-onSurface">{train.arrival}</span>
                  </div>
                  <Typography variant="caption" color="muted" className="flex items-center gap-1 mt-1">
                    <Icon name="schedule" size="sm" color="inherit" />
                    {train.duration}
                  </Typography>
                </div>
              </div>

              <div className="text-right space-y-1">
                <p className="text-lg font-bold text-onSurface">
                  ¥{train.price.toLocaleString()}
                </p>
                {seatsBadge(train.seats)}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* サイドパネル: フィルター等 */}
      <div className="col-span-12 lg:col-span-4 hidden lg:block">
        <Card padding="md" className="sticky top-6">
          <Typography variant="label" as="h3" color="muted" className="mb-3">検索条件</Typography>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between">
              <dt className="text-onSurface-muted">区間</dt>
              <dd className="font-medium text-onSurface">{from} → {to}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-onSurface-muted">乗車日</dt>
              <dd className="font-medium text-onSurface">{date}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
};
