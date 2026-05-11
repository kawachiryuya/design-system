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
  formatICCard,
  getSeat,
  getPassengerLabel,
  type Reservation,
  type SeatAssignment,
} from '../data/reservations';
import { formatDate } from '../utils/format';

const TOAST_MESSAGES: Record<string, string> = {
  'ic-saved': 'IC カードを登録しました',
  'seats-updated': '座席を変更しました',
  'partial-cancelled': '一部をキャンセルしました',
};

type CancelScope = 'all' | 'passengers' | 'legs';

// 編集中の座席（号車 + 席番）
interface SeatDraft {
  car: string; // input は string で保持
  seatNumber: string;
}

export const ReservationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialReservation = getReservation(id ?? '');
  const [reservation, setReservation] = useState<Reservation | undefined>(initialReservation);
  const [editingPassengerId, setEditingPassengerId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 座席変更: 編集中の legId と passengerId → draft マップ
  const [editingSeatsLegId, setEditingSeatsLegId] = useState<string | null>(null);
  const [seatDrafts, setSeatDrafts] = useState<Record<string, SeatDraft>>({});

  // キャンセル Modal 状態
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelScope, setCancelScope] = useState<CancelScope>('all');
  const [cancelTargetPassengers, setCancelTargetPassengers] = useState<Record<string, boolean>>({});
  const [cancelTargetLegs, setCancelTargetLegs] = useState<Record<string, boolean>>({});
  const [cancelStep, setCancelStep] = useState<1 | 2>(1);

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

  // 座席変更: 開く
  const openSeatEdit = (legId: string) => {
    const drafts: Record<string, SeatDraft> = {};
    reservation.passengers.forEach((p) => {
      const seat = getSeat(reservation, p.id, legId);
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

  // キャンセル Modal: 開閉
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
      // demo: 一覧へ戻す
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
          {reservation.legs.map((leg, legIdx) => {
            const isEditing = editingSeatsLegId === leg.id;
            const seatsForLeg = reservation.passengers
              .map((p) => ({ passenger: p, seat: getSeat(reservation, p.id, leg.id) }));
            const hasAnySeat = seatsForLeg.some((x) => x.seat);

            return (
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
                </div>

                {/* 座席ブロック（編集モード切替） */}
                {hasAnySeat && (
                  <div className="mt-3 pt-3 border-t border-border-muted">
                    {!isEditing ? (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <Typography variant="caption" color="muted">座席</Typography>
                          {isUpcoming && (
                            <Button
                              variant="tertiary"
                              size="small"
                              onClick={() => openSeatEdit(leg.id)}
                            >
                              座席を変更
                            </Button>
                          )}
                        </div>
                        <div className="space-y-1">
                          {seatsForLeg.map(({ passenger, seat }) =>
                            seat ? (
                              <div key={passenger.id} className="flex justify-between text-sm">
                                <span className="text-onSurface-muted">
                                  {getPassengerLabel(reservation.passengers, passenger.id)}
                                </span>
                                <span className="font-medium text-onSurface">
                                  {seat.car}号車 {seat.seatNumber}
                                </span>
                              </div>
                            ) : null,
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <Typography variant="caption" color="muted" className="block mb-2">
                          座席を変更
                        </Typography>
                        <div className="space-y-3">
                          {reservation.passengers.map((p) => {
                            const draft = seatDrafts[p.id] ?? { car: '', seatNumber: '' };
                            return (
                              <div key={p.id} className="flex items-end gap-2">
                                <div className="w-20 shrink-0">
                                  <Typography variant="caption" color="muted" className="block mb-1">
                                    {getPassengerLabel(reservation.passengers, p.id)}
                                  </Typography>
                                </div>
                                <div className="w-20">
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
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="tertiary" size="small" onClick={closeSeatEdit} fullWidth>
                            キャンセル
                          </Button>
                          <Button size="small" onClick={saveSeatEdit} fullWidth>
                            保存
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}

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
