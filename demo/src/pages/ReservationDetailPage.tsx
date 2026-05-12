import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon';
import { Input } from '@ds/primitives/Input/Input';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Badge } from '@ds/composites/Badge/Badge';
import { Card } from '@ds/composites/Card/Card';
import { Checkbox } from '@ds/composites/Checkbox/Checkbox';
import { Radio } from '@ds/composites/Radio/Radio';
import {
  getReservation,
  brandLabel,
  paymentMethodLabel,
  formatICCard,
  getPassengerLabel,
  getStatusBadgeSpec,
  type Reservation,
  type SeatAssignment,
} from '../data/reservations';
import { formatPassengers } from '../data/trains';
import { formatDate, formatDateTime, calcDuration } from '../utils/format';

const TOAST_MESSAGES: Record<string, string> = {
  'ic-saved': 'IC カードを登録しました',
  'seats-updated': '座席を変更しました',
  'partial-cancelled': '一部をキャンセルしました',
};

type CancelScope = 'all' | 'passengers' | 'legs';

interface SeatDraft {
  car: string;
  seatNumber: string;
}

/** 区間 index → 縦線の Tailwind 背景クラス（区間ごとに色を切替） */
const legLineBgClass = (idx: number): string => {
  const palette = ['bg-surface-primary', 'bg-surface-success', 'bg-surface-info', 'bg-surface-warning'];
  return palette[idx % palette.length];
};

/** 区間 index → ドット（境界マーカー）の Tailwind 背景クラス */
const legDotBgClass = (idx: number): string => {
  const palette = ['bg-surface-primary', 'bg-surface-success', 'bg-surface-info', 'bg-surface-warning'];
  return palette[idx % palette.length];
};

export const ReservationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialReservation = getReservation(id ?? '');
  const [reservation, setReservation] = useState<Reservation | undefined>(initialReservation);
  const [editingPassengerId, setEditingPassengerId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [editingSeatsLegId, setEditingSeatsLegId] = useState<string | null>(null);
  const [seatDrafts, setSeatDrafts] = useState<Record<string, SeatDraft>>({});

  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelScope, setCancelScope] = useState<CancelScope>('all');
  const [cancelTargetPassengers, setCancelTargetPassengers] = useState<Record<string, boolean>>({});
  const [cancelTargetLegs, setCancelTargetLegs] = useState<Record<string, boolean>>({});
  const [cancelStep, setCancelStep] = useState<1 | 2>(1);

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

  const showToast = (key: keyof typeof TOAST_MESSAGES) => {
    setToastMessage(TOAST_MESSAGES[key]);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
  const adults = reservation.passengers.filter((p) => p.type === 'adult').length;
  const children = reservation.passengers.filter((p) => p.type === 'child').length;

  // 座席変更
  const openSeatEdit = (legId: string) => {
    const drafts: Record<string, SeatDraft> = {};
    reservation.passengers.forEach((p) => {
      const seat = reservation.seatAssignments.find((s) => s.passengerId === p.id && s.legId === legId);
      drafts[p.id] = {
        car: seat ? String(seat.car) : '',
        seatNumber: seat ? seat.seatNumber : '',
      };
    });
    setSeatDrafts(drafts);
    setEditingSeatsLegId(legId);
  };
  const closeSeatEdit = () => {
    setEditingSeatsLegId(null);
    setSeatDrafts({});
  };
  const saveSeatEdit = () => {
    if (!editingSeatsLegId) return;
    const legId = editingSeatsLegId;
    const nextAssignments: SeatAssignment[] = reservation.seatAssignments.filter(
      (s) => s.legId !== legId,
    );
    reservation.passengers.forEach((p) => {
      const d = seatDrafts[p.id];
      const car = parseInt(d?.car ?? '', 10);
      const seatNumber = (d?.seatNumber ?? '').trim();
      if (Number.isFinite(car) && car > 0 && seatNumber) {
        nextAssignments.push({ passengerId: p.id, legId, car, seatNumber });
      }
    });
    setReservation({ ...reservation, seatAssignments: nextAssignments });
    closeSeatEdit();
    showToast('seats-updated');
  };

  // キャンセル Modal
  const openCancel = () => {
    setCancelScope('all');
    setCancelStep(1);
    setCancelTargetPassengers({});
    setCancelTargetLegs({});
    setCancelOpen(true);
  };
  const closeCancel = () => setCancelOpen(false);

  const canProceedStep1 =
    cancelScope === 'all' ||
    (cancelScope === 'passengers' &&
      Object.values(cancelTargetPassengers).some(Boolean) &&
      Object.values(cancelTargetPassengers).filter(Boolean).length < reservation.passengers.length) ||
    (cancelScope === 'legs' &&
      Object.values(cancelTargetLegs).some(Boolean) &&
      Object.values(cancelTargetLegs).filter(Boolean).length < reservation.legs.length);

  const executeCancel = () => {
    if (cancelScope === 'all') {
      setCancelOpen(false);
      navigate('/reservations');
      return;
    }
    if (cancelScope === 'passengers') {
      const removedIds = new Set(
        Object.entries(cancelTargetPassengers)
          .filter(([, v]) => v)
          .map(([k]) => k),
      );
      setReservation({
        ...reservation,
        passengers: reservation.passengers.filter((p) => !removedIds.has(p.id)),
        seatAssignments: reservation.seatAssignments.filter((s) => !removedIds.has(s.passengerId)),
      });
    } else if (cancelScope === 'legs') {
      const removedIds = new Set(
        Object.entries(cancelTargetLegs)
          .filter(([, v]) => v)
          .map(([k]) => k),
      );
      setReservation({
        ...reservation,
        legs: reservation.legs.filter((l) => !removedIds.has(l.id)),
        seatAssignments: reservation.seatAssignments.filter((s) => !removedIds.has(s.legId)),
      });
    }
    setCancelOpen(false);
    showToast('partial-cancelled');
  };

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

        {/* 旅程 + タイムライン統合カード */}
        <Card padding="md">
          {/* ヘッダー: 日付・人数 / ステータス */}
          <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
            <Typography variant="body-sm" color="muted">
              {formatDate(firstLeg.date)} / {formatPassengers(adults, children)}
            </Typography>
            {(() => {
              const badge = getStatusBadgeSpec(reservation);
              return (
                <Badge variant={badge.variant} appearance="soft" size="small">
                  {badge.label}
                </Badge>
              );
            })()}
          </div>

          {/* 旅程主要情報: from → to（所要時間表記は省略、タイムラインから読み取れる） */}
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
              const isEditing = editingSeatsLegId === leg.id;
              const seatsForLeg = reservation.passengers
                .map((p) => ({
                  passenger: p,
                  seat: reservation.seatAssignments.find((s) => s.passengerId === p.id && s.legId === leg.id),
                }))
                .filter((x) => x.seat);
              const lineBg = legLineBgClass(legIdx);
              const dotBg = legDotBgClass(legIdx);

              return (
                <div key={leg.id}>
                  {/* 駅: 出発（leg index 0 のみ「発」、それ以外は前の leg の「着+次の出発」をマージ） */}
                  {legIdx === 0 && (
                    <div className="flex gap-3">
                      <Typography variant="body-sm" color="muted" className="w-12 shrink-0 pt-0.5">{leg.departure}</Typography>
                      <div className="flex flex-col items-center shrink-0">
                        <Badge variant="neutral" appearance="solid" size="small">発</Badge>
                      </div>
                      <Typography variant="h5" weight="bold" as="p" className="flex-1">{leg.from}</Typography>
                    </div>
                  )}

                  {/* 区間: 線 + 列車情報 + 席種 + 座席 */}
                  <div className="flex gap-3 pl-12 -ml-12">
                    {/* 時刻列はここでは空（line/content の高さに揃える） */}
                    <div className="w-12 shrink-0" />
                    {/* 縦線 */}
                    <div className="flex flex-col items-center shrink-0 self-stretch py-1">
                      <div className={`w-1 flex-1 ${lineBg} rounded-full`} />
                    </div>
                    {/* 列車・席種・座席情報 */}
                    <div className="flex-1 py-3 space-y-1.5">
                      <Typography variant="body" weight="bold" as="p">{leg.trainName}</Typography>

                      {/* 座席行: 席種テキスト + 座席番号 or 自由席キャプション */}
                      {!isEditing && (
                        <>
                          {seatsForLeg.length > 0 ? (
                            <>
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
                              {isUpcoming && (
                                <div>
                                  <Button
                                    variant="tertiary"
                                    size="small"
                                    onClick={() => openSeatEdit(leg.id)}
                                  >
                                    座席を変更
                                  </Button>
                                </div>
                              )}
                            </>
                          ) : leg.seatClassLabel.includes('自由') ? (
                            <Typography variant="body-sm" as="p">
                              <span className="text-onSurface-muted mr-2">{leg.seatClassLabel}</span>
                              <span className="text-onSurface-muted">座席指定なし</span>
                            </Typography>
                          ) : null}
                        </>
                      )}

                      {/* 座席変更編集モード */}
                      {isEditing && (
                        <div className="space-y-3 pt-1">
                          <Typography variant="caption" color="muted" className="block">
                            座席を変更
                          </Typography>
                          {reservation.passengers.map((p) => {
                            const draft = seatDrafts[p.id] ?? { car: '', seatNumber: '' };
                            return (
                              <div key={p.id} className="flex items-end gap-2">
                                <div className="w-16 shrink-0">
                                  <Typography variant="caption" color="muted" className="block mb-1">
                                    {getPassengerLabel(reservation.passengers, p.id)}
                                  </Typography>
                                </div>
                                <div className="w-16">
                                  <Input
                                    label="号車"
                                    value={draft.car}
                                    onChange={(e) =>
                                      setSeatDrafts((prev) => ({
                                        ...prev,
                                        [p.id]: { ...draft, car: e.target.value },
                                      }))
                                    }
                                    placeholder="3"
                                    fullWidth
                                  />
                                </div>
                                <div className="flex-1">
                                  <Input
                                    label="席番"
                                    value={draft.seatNumber}
                                    onChange={(e) =>
                                      setSeatDrafts((prev) => ({
                                        ...prev,
                                        [p.id]: { ...draft, seatNumber: e.target.value },
                                      }))
                                    }
                                    placeholder="5A"
                                    fullWidth
                                  />
                                </div>
                              </div>
                            );
                          })}
                          <div className="flex gap-2 mt-2">
                            <Button variant="tertiary" size="small" onClick={closeSeatEdit} fullWidth>
                              キャンセル
                            </Button>
                            <Button size="small" onClick={saveSeatEdit} fullWidth>
                              保存
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 駅: 中間 or 到着 */}
                  {!isLast ? (
                    /* 中間（乗り換え）駅: ○ + 駅名 + 着/発 時刻 + 乗り換え時間 */
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
                      {/* 乗り換え時間表記 */}
                      <div className="flex gap-3 pl-12 -ml-12 py-1">
                        <div className="w-12 shrink-0" />
                        <div className="w-3.5 shrink-0" />
                        <Typography variant="caption" color="muted" as="p" className="flex-1 pl-0.5">
                          乗り換え {calcDuration(leg.arrival, reservation.legs[legIdx + 1].departure)}
                        </Typography>
                      </div>
                    </>
                  ) : (
                    /* 到着駅: [着] Badge + 駅名 */
                    <div className="flex gap-3">
                      <Typography variant="body-sm" color="muted" className="w-12 shrink-0 pt-0.5">{leg.arrival}</Typography>
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

        {/* 予約情報（参照用） */}
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

        {/* 合計金額 */}
        <Card className="mt-4" padding="md">
          <div className="flex justify-between items-baseline">
            <Typography variant="label" as="h3" color="muted">合計金額</Typography>
            <Typography variant="h3" weight="bold" as="span">¥{reservation.total.toLocaleString()}</Typography>
          </div>
        </Card>

        {/* お支払い情報 */}
        <Card className="mt-4" padding="md">
          <Typography variant="label" as="h3" color="muted" className="mb-3">お支払い情報</Typography>
          {reservation.payment ? (
            <div>
              <Typography variant="label" as="p">
                {paymentMethodLabel(reservation.payment.method)}
              </Typography>
              <Typography variant="body" className="mt-1">
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

        {/* 乗客・ICカード */}
        <div id="ic-section" className="scroll-mt-4">
        <Card className="mt-4" padding="md">
          <Typography variant="label" as="h3" color="muted" className="mb-2">乗客・交通系ICカード</Typography>
          <Typography variant="body-sm" color="muted" className="mb-4">
            ICカードを登録すると、改札をタッチで通過できるようになります。
          </Typography>

          <div className="divide-y divide-border-muted">
            {reservation.passengers.map((passenger) => {
              const label = getPassengerLabel(reservation.passengers, passenger.id);
              const isEditing = editingPassengerId === passenger.id;

              return (
                <div key={passenger.id} className="py-3 first:pt-0 last:pb-0">
                  <Typography variant="label" as="p">{label}</Typography>
                  <div className="mt-2 flex items-center justify-between gap-2">
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
                  {isEditing && (
                    <div className="mt-3 flex gap-2 items-end">
                      <div className="flex-1">
                        <Input
                          label="ICカード番号"
                          placeholder="JE 0000 0000 0000 0000"
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

        {/* 予約管理 */}
        {isUpcoming && (
          <div className="mt-6 flex flex-col gap-2">
            <Button variant="secondary" onClick={() => alert('未実装')}>
              予約を変更する
            </Button>
            <Button variant="tertiary" onClick={openCancel}>
              予約をキャンセル
            </Button>
          </div>
        )}
      </div>

      {/* キャンセル Modal */}
      {cancelOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-modal-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
          onClick={closeCancel}
        >
          <div
            className="w-full sm:max-w-md max-h-[90vh] overflow-y-auto bg-surface rounded-t-xl sm:rounded-xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border-muted flex items-center justify-between">
              <Typography variant="h5" as="h2" id="cancel-modal-title">
                {cancelStep === 1 ? '予約をキャンセル' : 'キャンセル内容の確認'}
              </Typography>
              <Button
                iconOnly
                variant="tertiary"
                size="small"
                onClick={closeCancel}
                aria-label="閉じる"
                icon={<Icon name="close" size="sm" color="inherit" />}
              />
            </div>

            <div className="p-4">
              {cancelStep === 1 ? (
                <>
                  <Typography variant="body-sm" color="muted" className="mb-4">
                    キャンセルする範囲を選んでください。
                  </Typography>
                  <div className="space-y-3">
                    <Radio
                      label="予約全体をキャンセル"
                      name="cancel-scope"
                      checked={cancelScope === 'all'}
                      onChange={() => setCancelScope('all')}
                    />
                    <Radio
                      label="一部の乗客のみキャンセル"
                      name="cancel-scope"
                      checked={cancelScope === 'passengers'}
                      onChange={() => setCancelScope('passengers')}
                      disabled={reservation.passengers.length <= 1}
                    />
                    {cancelScope === 'passengers' && (
                      <div className="ml-7 mt-2 space-y-2">
                        {reservation.passengers.map((p) => (
                          <Checkbox
                            key={p.id}
                            label={getPassengerLabel(reservation.passengers, p.id)}
                            checked={Boolean(cancelTargetPassengers[p.id])}
                            onChange={(e) =>
                              setCancelTargetPassengers((prev) => ({
                                ...prev,
                                [p.id]: e.target.checked,
                              }))
                            }
                          />
                        ))}
                        <Typography variant="caption" color="muted" as="p">
                          ※ 予約全体は別の選択肢から
                        </Typography>
                      </div>
                    )}
                    <Radio
                      label="一部の区間のみキャンセル"
                      name="cancel-scope"
                      checked={cancelScope === 'legs'}
                      onChange={() => setCancelScope('legs')}
                      disabled={reservation.legs.length <= 1}
                    />
                    {cancelScope === 'legs' && (
                      <div className="ml-7 mt-2 space-y-2">
                        {reservation.legs.map((l, i) => (
                          <Checkbox
                            key={l.id}
                            label={`区間 ${i + 1}: ${l.from} → ${l.to}（${l.trainName}）`}
                            checked={Boolean(cancelTargetLegs[l.id])}
                            onChange={(e) =>
                              setCancelTargetLegs((prev) => ({
                                ...prev,
                                [l.id]: e.target.checked,
                              }))
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Typography variant="body-sm" color="muted" className="mb-3">
                    以下の内容でキャンセルします。
                  </Typography>
                  <div className="space-y-2 mb-4 p-3 bg-surface-inset rounded">
                    {cancelScope === 'all' && (
                      <Typography variant="body">予約 {reservation.id} を全てキャンセル</Typography>
                    )}
                    {cancelScope === 'passengers' && (
                      <>
                        <Typography variant="label" as="p">対象の乗客:</Typography>
                        {reservation.passengers
                          .filter((p) => cancelTargetPassengers[p.id])
                          .map((p) => (
                            <Typography variant="body-sm" key={p.id}>
                              ・{getPassengerLabel(reservation.passengers, p.id)}
                            </Typography>
                          ))}
                      </>
                    )}
                    {cancelScope === 'legs' && (
                      <>
                        <Typography variant="label" as="p">対象の区間:</Typography>
                        {reservation.legs
                          .filter((l) => cancelTargetLegs[l.id])
                          .map((l, i) => (
                            <Typography variant="body-sm" key={l.id}>
                              ・区間 {reservation.legs.findIndex((x) => x.id === l.id) + 1 || i + 1}: {l.from} → {l.to}
                            </Typography>
                          ))}
                      </>
                    )}
                  </div>
                  <Typography variant="caption" color="muted">
                    ※ デモ画面のため、実際の払戻処理は行われません。
                  </Typography>
                </>
              )}
            </div>

            <div className="p-4 border-t border-border-muted flex gap-2">
              {cancelStep === 1 ? (
                <>
                  <Button variant="tertiary" onClick={closeCancel} fullWidth>
                    やめる
                  </Button>
                  <Button
                    onClick={() => setCancelStep(2)}
                    fullWidth
                    disabled={!canProceedStep1}
                  >
                    次へ
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="tertiary" onClick={() => setCancelStep(1)} fullWidth>
                    戻る
                  </Button>
                  <Button variant="primary" onClick={executeCancel} fullWidth>
                    キャンセルを実行
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
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
