import { useNavigate } from 'react-router-dom';
import { Icon } from '@ds/primitives/Icon';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Badge } from '@ds/composites/Badge/Badge';
import { Card } from '@ds/composites/Card/Card';
import { Tabs } from '@ds/composites/Tabs/Tabs';
import {
  reservations,
  getTripSummary,
  statusPastLabel,
  type Reservation,
} from '../data/reservations';
import { formatPassengers } from '../data/trains';
import { formatDate, calcDuration } from '../utils/format';

const countByType = (passengers: Reservation['passengers']) => {
  const adults = passengers.filter((p) => p.type === 'adult').length;
  const children = passengers.filter((p) => p.type === 'child').length;
  return { adults, children };
};

interface ReservationCardProps {
  reservation: Reservation;
  showStatusBadge: boolean;
  onClick: () => void;
}

const ReservationCard = ({
  reservation: r,
  showStatusBadge,
  onClick,
}: ReservationCardProps) => {
  const { adults, children } = countByType(r.passengers);
  const unregisteredIc = r.passengers.filter((p) => !p.icCard).length;
  const trip = getTripSummary(r);
  const duration = calcDuration(trip.departure, trip.arrival);

  return (
    <Card clickable onClick={onClick} padding="md">
      <div className="space-y-1">
        {/* 過去タブのみ: status Badge */}
        {showStatusBadge && (
          <div className="flex items-center gap-2">
            <Badge
              variant={r.status === 'cancelled' ? 'error' : 'neutral'}
              appearance="soft"
              size="small"
            >
              {statusPastLabel(r.status)}
            </Badge>
          </div>
        )}

        {/* 主役: from → to */}
        <div className="flex items-center gap-1">
          <Typography variant="h5" weight="bold" as="span">{trip.from}</Typography>
          <Icon name="arrow_forward" size="sm" color="neutral" />
          <Typography variant="h5" weight="bold" as="span">{trip.to}</Typography>
        </div>

        {/* 日時行 */}
        <Typography variant="body-sm" color="muted" as="p">
          {formatDate(trip.date)} {trip.departure}→{trip.arrival}（{duration}）
        </Typography>

        {/* 人数 */}
        <Typography variant="body-sm" color="muted">
          {formatPassengers(adults, children)}
        </Typography>

        {/* IC 未登録警告（upcoming のみ） */}
        {unregisteredIc > 0 && r.status === 'upcoming' && (
          <div className="flex items-center gap-1 pt-1">
            <Icon name="contactless" size="sm" color="warning" />
            <Typography variant="caption" color="warning">
              ICカード未登録 {unregisteredIc}名
            </Typography>
          </div>
        )}
      </div>
    </Card>
  );
};

const ReservationList = ({
  items,
  showStatusBadge,
  emptyMessage,
}: {
  items: Reservation[];
  showStatusBadge: boolean;
  emptyMessage: string;
}) => {
  const navigate = useNavigate();
  if (items.length === 0) {
    return (
      <div className="py-10 text-center">
        <Typography variant="body" color="muted">{emptyMessage}</Typography>
      </div>
    );
  }
  return (
    <div className="space-y-3 pt-4">
      {items.map((r) => (
        <ReservationCard
          key={r.id}
          reservation={r}
          showStatusBadge={showStatusBadge}
          onClick={() => navigate(`/reservations/${r.id}`)}
        />
      ))}
    </div>
  );
};

export const ReservationsPage = () => {
  // これから: 乗車日が近い順（asc）。 過去: 直近に乗ったもの順（desc）
  const tripDate = (r: Reservation): string => getTripSummary(r).date;
  const upcoming = reservations
    .filter((r) => r.status === 'upcoming')
    .sort((a, b) => tripDate(a).localeCompare(tripDate(b)));
  const past = reservations
    .filter((r) => r.status !== 'upcoming')
    .sort((a, b) => tripDate(b).localeCompare(tripDate(a)));

  return (
    <div className="py-4">
      <Typography variant="h3" as="h1" className="mb-6">予約一覧</Typography>

      <Tabs
        tabs={[
          {
            id: 'upcoming',
            label: 'これから',
            content: (
              <ReservationList
                items={upcoming}
                showStatusBadge={false}
                emptyMessage="これからの予約はありません"
              />
            ),
          },
          {
            id: 'past',
            label: '過去',
            content: (
              <ReservationList
                items={past}
                showStatusBadge
                emptyMessage="過去の予約はありません"
              />
            ),
          },
        ]}
        defaultActiveId="upcoming"
      />
    </div>
  );
};
