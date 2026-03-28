import { useNavigate } from 'react-router-dom';
import { Icon } from '@ds/primitives/Icon';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Badge } from '@ds/composites/Badge/Badge';
import { Card } from '@ds/composites/Card/Card';
import { reservations, type Reservation } from '../data/reservations';
import { formatPassengers } from '../data/trains';
import { formatDate } from '../utils/format';

const statusBadge = (status: Reservation['status']) => {
  switch (status) {
    case 'upcoming':
      return <Badge variant="primary" appearance="soft" size="small">予約済み</Badge>;
    case 'completed':
      return <Badge variant="neutral" appearance="soft" size="small">乗車済み</Badge>;
  }
};

const countByType = (passengers: Reservation['passengers']) => {
  const adults = passengers.filter((p) => p.type === 'adult').length;
  const children = passengers.filter((p) => p.type === 'child').length;
  return { adults, children };
};

export const ReservationsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="py-4">
      <Typography variant="h3" as="h1" className="mb-6">予約一覧</Typography>

      <div className="space-y-3">
        {reservations.map((r) => {
          const { adults, children } = countByType(r.passengers);
          const unregisteredIc = r.passengers.filter((p) => !p.icCard).length;

          return (
            <Card
              key={r.id}
              clickable
              onClick={() => navigate(`/reservations/${r.id}`)}
              padding="md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {statusBadge(r.status)}
                    <Typography variant="caption" color="muted">{r.id}</Typography>
                  </div>
                  <div className="flex items-center gap-1">
                    <Typography variant="h5" weight="bold" as="span">{r.from}</Typography>
                    <Icon name="arrow_forward" size="sm" color="neutral" />
                    <Typography variant="h5" weight="bold" as="span">{r.to}</Typography>
                  </div>
                  <Typography variant="body-sm" color="muted">
                    {formatDate(r.date)} {r.departure}→{r.arrival}
                  </Typography>
                  <Typography variant="body-sm" color="muted">
                    {r.seatClassLabel} / {formatPassengers(adults, children)}
                  </Typography>
                  {unregisteredIc > 0 && r.status === 'upcoming' && (
                    <div className="flex items-center gap-1 mt-1">
                      <Icon name="contactless" size="sm" color="warning" />
                      <Typography variant="caption" color="warning">ICカード未登録 {unregisteredIc}名</Typography>
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <Typography variant="h5" weight="bold" as="p">¥{r.total.toLocaleString()}</Typography>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
