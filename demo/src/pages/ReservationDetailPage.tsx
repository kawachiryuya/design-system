import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon';
import { Input } from '@ds/primitives/Input/Input';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Badge } from '@ds/composites/Badge/Badge';
import { Card } from '@ds/composites/Card/Card';
import { getReservation } from '../data/reservations';
import { formatDate } from '../utils/format';

export const ReservationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const reservation = getReservation(id ?? '');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  if (!reservation) {
    return (
      <div className="py-10 text-center">
        <Typography variant="h5" color="muted">予約が見つかりません</Typography>
        <Button variant="tertiary" onClick={() => navigate('/reservations')} className="mt-4">
          予約一覧に戻る
        </Button>
      </div>
    );
  }

  const isUpcoming = reservation.status === 'upcoming';

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
      <div className="col-span-12 lg:col-span-8 lg:col-start-3">
        <div className="flex items-center gap-3 mb-6">
          <Button iconOnly variant="tertiary" size="small" onClick={() => navigate('/reservations')} aria-label="戻る">
            <Icon name="arrow_back" size="sm" color="inherit" />
          </Button>
          <Typography variant="h5" as="h2">予約詳細</Typography>
        </div>

        {/* 予約情報 */}
        <Card className="divide-y divide-border-muted">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Typography variant="label" as="h3" color="muted">予約情報</Typography>
              <Badge
                variant={isUpcoming ? 'primary' : 'neutral'}
                appearance="soft"
                size="small"
              >
                {isUpcoming ? '予約済み' : '乗車済み'}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-onSurface-muted">予約番号</span>
                <span className="font-medium text-onSurface">{reservation.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-onSurface-muted">区間</span>
                <span className="font-medium text-onSurface flex items-center gap-1">
                  {reservation.from}
                  <Icon name="arrow_forward" size="sm" color="inherit" />
                  {reservation.to}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-onSurface-muted">列車</span>
                <span className="font-medium text-onSurface">{reservation.trainName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-onSurface-muted">乗車日時</span>
                <span className="font-medium text-onSurface">{formatDate(reservation.date)} {reservation.departure}→{reservation.arrival}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-onSurface-muted">座席クラス</span>
                <span className="font-medium text-onSurface">{reservation.seatClassLabel}</span>
              </div>
              {reservation.seats.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-onSurface-muted">座席</span>
                  <span className="font-medium text-onSurface text-right">
                    {reservation.seats.map((s, i) => (
                      <span key={i} className="block">{s}</span>
                    ))}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 flex justify-between items-center">
            <Typography variant="label" color="muted">合計金額</Typography>
            <Typography variant="h3" weight="bold" as="span">¥{reservation.total.toLocaleString()}</Typography>
          </div>
        </Card>

        {/* 乗客・ICカード */}
        <Card className="mt-4" padding="md">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="contactless" size="sm" color="primary" />
            <Typography variant="label" as="h3" color="muted">乗客・交通系ICカード</Typography>
          </div>
          <Typography variant="body-sm" color="muted" className="mb-4">
            ICカードを登録すると、改札をタッチで通過できるようになります。
          </Typography>

          <div className="divide-y divide-border-muted">
            {reservation.passengers.map((passenger, index) => {
              const adultIndex = reservation.passengers.slice(0, index + 1).filter((p) => p.type === passenger.type).length;
              const typeCount = reservation.passengers.filter((p) => p.type === passenger.type).length;
              const label = passenger.type === 'adult'
                ? `おとな${typeCount > 1 ? ` ${adultIndex}` : ''}`
                : `こども${typeCount > 1 ? ` ${adultIndex}` : ''}`;
              const isEditing = editingIndex === index;

              return (
                <div key={index} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="label" as="span">{label}</Typography>
                      {index === 0 && (
                        <Typography variant="caption" color="muted" as="span" className="ml-2">（予約者）</Typography>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {passenger.icCard ? (
                        <>
                          <Typography variant="body-sm">{passenger.icCard}</Typography>
                          {isUpcoming && (
                            <Button
                              variant="tertiary"
                              size="small"
                              onClick={() => setEditingIndex(isEditing ? null : index)}
                            >
                              {isEditing ? 'キャンセル' : '変更'}
                            </Button>
                          )}
                        </>
                      ) : (
                        <>
                          <Badge variant="warning" appearance="soft" size="small">未登録</Badge>
                          {isUpcoming && (
                            <Button
                              variant="secondary"
                              size="small"
                              onClick={() => setEditingIndex(isEditing ? null : index)}
                            >
                              {isEditing ? 'キャンセル' : '登録する'}
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {isEditing && (
                    <div className="mt-3 flex gap-2 items-end">
                      <div className="flex-1">
                        <Input
                          label="ICカード番号"
                          placeholder="JE00 0000 0000 0000 0"
                          defaultValue=""
                          fullWidth
                        />
                      </div>
                      <Button size="small" onClick={() => setEditingIndex(null)}>
                        保存
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
