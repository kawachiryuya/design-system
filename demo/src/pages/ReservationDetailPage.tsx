import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon';
import { Input } from '@ds/primitives/Input/Input';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Badge } from '@ds/composites/Badge/Badge';
import { Card } from '@ds/composites/Card/Card';
import {
  getReservation,
  brandLabel,
  formatICCard,
  getSeat,
  getPassengerLabel,
} from '../data/reservations';
import { formatDate } from '../utils/format';

const TOAST_MESSAGES: Record<string, string> = {
  'ic-saved': 'IC カードを登録しました',
};

export const ReservationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const reservation = getReservation(id ?? '');
  const [editingPassengerId, setEditingPassengerId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // toast クエリ取り込み → 表示 → URL から削除
  useEffect(() => {
    const toastKey = searchParams.get('toast');
    if (toastKey && TOAST_MESSAGES[toastKey]) {
      setToastMessage(TOAST_MESSAGES[toastKey]);
      const next = new URLSearchParams(searchParams);
      next.delete('toast');
      setSearchParams(next, { replace: true });
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const firstLeg = reservation.legs[0];
  const lastLeg = reservation.legs[reservation.legs.length - 1];

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
      <div className="col-span-12 lg:col-span-8 lg:col-start-3">
        <div className="flex items-center gap-3 mb-6">
          <Button
            iconOnly
            variant="tertiary"
            size="small"
            onClick={() => navigate('/reservations')}
            aria-label="戻る"
            icon={<Icon name="arrow_back" size="sm" color="inherit" />}
          />
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
                  {firstLeg.from}
                  <Icon name="arrow_forward" size="sm" color="inherit" />
                  {lastLeg.to}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-onSurface-muted">乗車日</span>
                <span className="font-medium text-onSurface">{formatDate(firstLeg.date)}</span>
              </div>
            </div>
          </div>

          {/* leg ごとの区間カード */}
          {reservation.legs.map((leg, legIdx) => (
            <div key={leg.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Typography variant="label" as="h3" color="muted">
                  {reservation.legs.length > 1 ? `区間 ${legIdx + 1}` : '乗車情報'}
                </Typography>
                <Typography variant="caption" color="muted">{leg.seatClassLabel}</Typography>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-onSurface-muted">列車</span>
                  <span className="font-medium text-onSurface">{leg.trainName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-onSurface-muted">区間</span>
                  <span className="font-medium text-onSurface flex items-center gap-1">
                    {leg.from}
                    <Icon name="arrow_forward" size="sm" color="inherit" />
                    {leg.to}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-onSurface-muted">時刻</span>
                  <span className="font-medium text-onSurface">{leg.departure}→{leg.arrival}</span>
                </div>
                {(() => {
                  const seatsForLeg = reservation.passengers
                    .map((p) => ({ passenger: p, seat: getSeat(reservation, p.id, leg.id) }))
                    .filter((x) => x.seat);
                  if (seatsForLeg.length === 0) return null;
                  return (
                    <div className="flex justify-between text-sm">
                      <span className="text-onSurface-muted">座席</span>
                      <span className="font-medium text-onSurface text-right">
                        {seatsForLeg.map(({ passenger, seat }) => (
                          <span key={passenger.id} className="block">
                            {seat!.car}号車 {seat!.seatNumber}
                            <span className="text-onSurface-muted text-xs ml-1">
                              （{getPassengerLabel(reservation.passengers, passenger.id)}）
                            </span>
                          </span>
                        ))}
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>
          ))}

          <div className="p-4 flex justify-between items-center">
            <Typography variant="label" color="muted">合計金額</Typography>
            <Typography variant="h3" weight="bold" as="span">¥{reservation.total.toLocaleString()}</Typography>
          </div>
        </Card>

        {/* お支払い情報（IC の上に配置） */}
        <Card className="mt-4" padding="md">
          <Typography variant="label" as="h3" color="muted" className="mb-3">お支払い情報</Typography>
          {reservation.payment ? (
            <div>
              <Typography variant="body">
                {brandLabel(reservation.payment.brand)} **** {reservation.payment.last4}
              </Typography>
              <Typography variant="caption" color="muted">
                有効期限 {reservation.payment.expiry}
              </Typography>
            </div>
          ) : (
            <Typography variant="body-sm" color="muted">支払い情報未登録</Typography>
          )}
        </Card>

        {/* 乗客・ICカード（CompletePage からの anchor link 用） */}
        <div id="ic-section" className="scroll-mt-4">
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
              const label = getPassengerLabel(reservation.passengers, passenger.id);
              const isEditing = editingPassengerId === passenger.id;

              return (
                <div key={passenger.id} className="py-3 first:pt-0 last:pb-0">
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
                          <Typography variant="body-sm">{formatICCard(passenger.icCard)}</Typography>
                          {isUpcoming && (
                            <Button
                              variant="tertiary"
                              size="small"
                              onClick={() => setEditingPassengerId(isEditing ? null : passenger.id)}
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
                              onClick={() => setEditingPassengerId(isEditing ? null : passenger.id)}
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
                      <Button size="small" onClick={() => setEditingPassengerId(null)}>
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

        {/* 領収書 */}
        <Card className="mt-4" padding="md">
          <Typography variant="label" as="h3" color="muted" className="mb-2">領収書</Typography>
          <Typography variant="body-sm" color="muted" className="mb-3">
            PDF 形式でダウンロードできます。
          </Typography>
          <Button variant="secondary" size="small" onClick={() => alert('未実装')}>
            領収書を発行する
          </Button>
        </Card>

        {/* 予約管理: ラベル・背景なしの裸ボタン */}
        {isUpcoming && (
          <div className="mt-6 flex flex-col gap-2">
            <Button variant="secondary" onClick={() => alert('未実装')}>
              予約を変更する
            </Button>
            <Button variant="tertiary" onClick={() => alert('未実装')}>
              予約をキャンセル
            </Button>
          </div>
        )}
      </div>

      {/* Toast (簡易実装、3 秒で自動消失) */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-md shadow-lg bg-neutral-800 text-onSurface-inverse"
        >
          <Icon name="check_circle" size="sm" color="inherit" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
