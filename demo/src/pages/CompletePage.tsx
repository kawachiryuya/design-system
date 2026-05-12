import { useNavigate } from 'react-router-dom';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Badge } from '@ds/composites/Badge/Badge';
import { Card } from '@ds/composites/Card/Card';
import {
  getReservation,
  getStatusBadgeSpec,
  getSeat,
} from '../data/reservations';
import { formatPassengers } from '../data/trains';
import { formatDate, formatDateTime, calcDuration } from '../utils/format';

const legLineBgClass = (idx: number): string => {
  const palette = ['bg-surface-primary', 'bg-surface-success', 'bg-surface-info', 'bg-surface-warning'];
  return palette[idx % palette.length];
};
const legDotBgClass = (idx: number): string => {
  const palette = ['bg-surface-primary', 'bg-surface-success', 'bg-surface-info', 'bg-surface-warning'];
  return palette[idx % palette.length];
};

export const CompletePage = () => {
  const navigate = useNavigate();
  // demo では既存の予約データ（RD-001）に遷移
  const bookingId = 'RD-001';
  const reservation = getReservation(bookingId);

  if (!reservation) {
    return (
      <div className="py-10 text-center">
        <Typography variant="h5" color="muted">予約が見つかりません</Typography>
      </div>
    );
  }

  const adults = reservation.passengers.filter((p) => p.type === 'adult').length;
  const children = reservation.passengers.filter((p) => p.type === 'child').length;
  const firstLeg = reservation.legs[0];
  const lastLeg = reservation.legs[reservation.legs.length - 1];
  const badge = getStatusBadgeSpec(reservation);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
      <div className="col-span-12 lg:col-span-8 lg:col-start-3 py-10">
        {/* 完了メッセージ */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-surface-success-muted flex items-center justify-center mb-4">
            <Icon name="check_circle" size="lg" color="success" />
          </div>
          <Typography variant="h4" as="h1" className="mb-2">
            ご予約が完了しました
          </Typography>
          <Typography variant="body-sm" color="muted">
            ご予約ありがとうございます。確認メールをお送りしました。
          </Typography>
        </div>

        {/* 旅程統合カード */}
        <Card padding="md">
          {/* ヘッダー: 日付・人数 / ステータス */}
          <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
            <Typography variant="body-sm" color="muted">
              {formatDate(firstLeg.date)} / {formatPassengers(adults, children)}
            </Typography>
            <Badge variant={badge.variant} appearance="soft" size="small">
              {badge.label}
            </Badge>
          </div>

          {/* 旅程主要情報: from → to */}
          <div className="flex items-end justify-between gap-2 mb-2">
            <div className="text-center flex-1">
              <Typography variant="h3" weight="bold" as="p">{firstLeg.from}</Typography>
              <Typography variant="body" color="muted" as="p">{firstLeg.departure}</Typography>
            </div>
            <div className="pb-2 shrink-0">
              <Icon name="arrow_forward" size="sm" color="neutral" />
            </div>
            <div className="text-center flex-1">
              <Typography variant="h3" weight="bold" as="p">{lastLeg.to}</Typography>
              <Typography variant="body" color="muted" as="p">{lastLeg.arrival}</Typography>
            </div>
          </div>

          {/* タイムライン本体 */}
          <div className="mt-4 pt-4 border-t border-border-muted">
            {reservation.legs.map((leg, legIdx) => {
              const isLast = legIdx === reservation.legs.length - 1;
              const seatsForLeg = reservation.passengers
                .map((p) => ({
                  passenger: p,
                  seat: getSeat(reservation, p.id, leg.id),
                }))
                .filter((x) => x.seat);
              const lineBg = legLineBgClass(legIdx);
              const dotBg = legDotBgClass(legIdx);

              return (
                <div key={leg.id}>
                  {/* 出発駅（leg 0 のみ） */}
                  {legIdx === 0 && (
                    <div className="flex gap-3 items-center">
                      <Typography variant="body-sm" color="muted" className="w-12 shrink-0 text-right">
                        {leg.departure}
                      </Typography>
                      <div className="flex flex-col items-center shrink-0">
                        <Badge variant="neutral" appearance="solid" size="small">発</Badge>
                      </div>
                      <Typography variant="h5" weight="bold" as="p" className="flex-1">{leg.from}</Typography>
                    </div>
                  )}

                  {/* 区間: 線 + 列車情報 + 座席 */}
                  <div className="flex gap-3 pl-12 -ml-12">
                    <div className="w-12 shrink-0" />
                    <div className="flex flex-col items-center shrink-0 self-stretch py-1">
                      <div className={`w-1 flex-1 ${lineBg} rounded-full`} />
                    </div>
                    <div className="flex-1 py-3 space-y-1.5">
                      <Typography variant="body" weight="bold" as="p">{leg.trainName}</Typography>
                      {seatsForLeg.length > 0 ? (
                        <Typography variant="body-sm" as="p">
                          <span className="text-onSurface-muted mr-2">{leg.seatClassLabel}</span>
                          {seatsForLeg.map(({ seat }, i) => (
                            <span key={i}>
                              {i === 0 ? `${seat!.car}号車 ` : ''}
                              {seat!.seatNumber}
                              {i < seatsForLeg.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </Typography>
                      ) : leg.seatClassLabel.includes('自由') ? (
                        <Typography variant="body-sm" as="p">
                          <span className="text-onSurface-muted mr-2">{leg.seatClassLabel}</span>
                          <span className="text-onSurface-muted">座席指定なし</span>
                        </Typography>
                      ) : null}
                    </div>
                  </div>

                  {/* 中間駅 or 到着駅 */}
                  {!isLast ? (
                    <>
                      <div className="flex gap-3 items-center">
                        <div className="w-12 shrink-0 text-right">
                          <Typography variant="body-sm" color="muted" as="p">{leg.arrival}</Typography>
                          <Typography variant="body-sm" color="muted" as="p">{reservation.legs[legIdx + 1].departure}</Typography>
                        </div>
                        <div className="flex flex-col items-center shrink-0">
                          <div className={`w-3.5 h-3.5 rounded-full border-2 ${dotBg.replace('bg-', 'border-')} bg-surface`} />
                        </div>
                        <Typography variant="h5" weight="bold" as="p" className="flex-1">{leg.to}</Typography>
                      </div>
                      <div className="flex gap-3 pl-12 -ml-12 py-1">
                        <div className="w-12 shrink-0" />
                        <div className="w-3.5 shrink-0" />
                        <Typography variant="caption" color="muted" as="p" className="flex-1 pl-0.5">
                          乗り換え {calcDuration(leg.arrival, reservation.legs[legIdx + 1].departure)}
                        </Typography>
                      </div>
                    </>
                  ) : (
                    <div className="flex gap-3 items-center">
                      <Typography variant="body-sm" color="muted" className="w-12 shrink-0 text-right">{leg.arrival}</Typography>
                      <div className="flex flex-col items-center shrink-0">
                        <Badge variant="neutral" appearance="solid" size="small">着</Badge>
                      </div>
                      <Typography variant="h5" weight="bold" as="p" className="flex-1">{leg.to}</Typography>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* 予約情報（予約番号・予約日時 ＝ 確定の証） */}
        <Card className="mt-4" padding="md">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-onSurface-muted">予約番号</span>
              <span className="font-medium text-onSurface">{reservation.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-onSurface-muted">予約日時</span>
              <span className="font-medium text-onSurface">{formatDateTime(reservation.bookedAt)}</span>
            </div>
          </div>
        </Card>

        {/* 次のアクション */}
        <div className="flex flex-col gap-2 max-w-md mx-auto w-full mt-6">
          <Button
            variant="primary"
            size="medium"
            fullWidth
            onClick={() => navigate(`/reservations/${bookingId}/ic-register`)}
          >
            ICカード設定を続ける
          </Button>
          <Button
            variant="secondary"
            size="medium"
            fullWidth
            onClick={() => navigate(`/reservations/${bookingId}`)}
          >
            予約詳細をみる
          </Button>
        </div>
      </div>
    </div>
  );
};
