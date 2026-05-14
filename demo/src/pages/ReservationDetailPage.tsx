import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@kawachiryuya/design-system';
import { Icon } from '@kawachiryuya/design-system';
import { Input } from '@kawachiryuya/design-system';
import { Typography } from '@kawachiryuya/design-system';
import { Badge } from '@kawachiryuya/design-system';
import { Card } from '@kawachiryuya/design-system';
import { NumberInput } from '@kawachiryuya/design-system';
import { SegmentedControl } from '@kawachiryuya/design-system';
import { ToggleButton } from '@kawachiryuya/design-system';
import { generateSeatMap, carNumbersForClass } from '../data/trains';
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
  'passengers-updated': '人数を変更しました',
  'legs-updated': '区間を変更しました',
};

type ModifyScope = 'passengers' | 'seats' | 'train';

interface SeatDraft {
  car: string;
  seatNumber: string;
}

/** 席種ラベル → seatClassId (trains.ts と整合) */
const seatClassLabelToId = (label: string): string => {
  if (label.includes('自由')) return 'unreserved';
  if (label.includes('グランクラス')) return 'gran';
  if (label.includes('グリーン')) return 'green';
  return 'reserved';
};

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

  // 予約を変更 Modal
  const [modifyOpen, setModifyOpen] = useState(false);
  const [modifyScope, setModifyScope] = useState<ModifyScope>('passengers');
  /** 変更後に残る人数（初期値 = 現在の人数） */
  const [remainAdults, setRemainAdults] = useState(0);
  const [remainChildren, setRemainChildren] = useState(0);
  const [modifyStep, setModifyStep] = useState<1 | 2>(1);

  // 予約全体キャンセル confirm Modal（小さな destructive 確認のみ）
  const [wholeCancelOpen, setWholeCancelOpen] = useState(false);

  // 再配置フロー（人数キャンセル後 or 座席変更）
  const [reseatLegIds, setReseatLegIds] = useState<string[]>([]);
  const [reseatIndex, setReseatIndex] = useState(0);
  const [reseatSelectedCar, setReseatSelectedCar] = useState<number>(1);
  const [reseatSelectedSeats, setReseatSelectedSeats] = useState<string[]>([]);
  const [reseatOrigin, setReseatOrigin] = useState<'passengers' | 'seats'>('seats');

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

  // 現在の乗客人数
  const currentAdults = reservation.passengers.filter((p) => p.type === 'adult').length;
  const currentChildren = reservation.passengers.filter((p) => p.type === 'child').length;

  // 予約を変更 Modal
  const openModify = () => {
    setModifyScope('passengers');
    setModifyStep(1);
    setRemainAdults(currentAdults);
    setRemainChildren(currentChildren);
    setModifyOpen(true);
  };
  const closeModify = () => setModifyOpen(false);

  /** キャンセル対象の人数（現在 - 残る人数）。Step 1 を通過するには 1 名以上必要 */
  const removeAdultsCount = currentAdults - remainAdults;
  const removeChildrenCount = currentChildren - remainChildren;
  const totalRemoveCount = removeAdultsCount + removeChildrenCount;
  const canProceedStep1 =
    (modifyScope === 'passengers' &&
      totalRemoveCount > 0 &&
      totalRemoveCount < reservation.passengers.length) ||
    modifyScope === 'seats' ||
    modifyScope === 'train';

  const executeModify = () => {
    if (modifyScope === 'seats' || modifyScope === 'train') {
      // 'seats' は座席ブロックの inline 編集に誘導 / 'train' は未実装
      setModifyOpen(false);
      if (modifyScope === 'train') {
        alert('列車の変更は未実装です');
      }
      return;
    }
    if (modifyScope === 'passengers') {
      // 末尾から該当人数を除外
      const adults = reservation.passengers.filter((p) => p.type === 'adult');
      const childrenList = reservation.passengers.filter((p) => p.type === 'child');
      const removedIds = new Set<string>([
        ...adults.slice(adults.length - removeAdultsCount).map((p) => p.id),
        ...childrenList.slice(childrenList.length - removeChildrenCount).map((p) => p.id),
      ]);
      const remainingSeatAssignments = reservation.seatAssignments.filter(
        (s) => !removedIds.has(s.passengerId),
      );
      const updatedReservation = {
        ...reservation,
        passengers: reservation.passengers.filter((p) => !removedIds.has(p.id)),
        seatAssignments: remainingSeatAssignments,
      };
      setReservation(updatedReservation);
      setModifyOpen(false);
      // 残乗客の座席を持つ leg を再配置フローの対象に
      const legsWithSeats = updatedReservation.legs
        .filter((leg) => remainingSeatAssignments.some((s) => s.legId === leg.id))
        .map((l) => l.id);
      if (legsWithSeats.length > 0) {
        setReseatLegIds(legsWithSeats);
        setReseatIndex(0);
        setReseatOrigin('passengers');
        // 最初の leg の現在の座席を初期選択にセット
        const firstLegId = legsWithSeats[0];
        const seatsForFirstLeg = remainingSeatAssignments.filter((s) => s.legId === firstLegId);
        if (seatsForFirstLeg.length > 0) {
          setReseatSelectedCar(seatsForFirstLeg[0].car);
          setReseatSelectedSeats(seatsForFirstLeg.map((s) => s.seatNumber));
        } else {
          const leg = updatedReservation.legs.find((l) => l.id === firstLegId);
          const cars = carNumbersForClass(seatClassLabelToId(leg?.seatClassLabel ?? ''));
          setReseatSelectedCar(cars[0]);
          setReseatSelectedSeats([]);
        }
      } else {
        showToast('passengers-updated');
      }
      return;
    }
    setModifyOpen(false);
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
            <Button variant="secondary" onClick={openModify}>
              予約を変更する
            </Button>
            <Button variant="tertiary" onClick={() => setWholeCancelOpen(true)}>
              予約をキャンセル
            </Button>
          </div>
        )}
      </div>

      {/* 全体キャンセル confirm Modal */}
      {wholeCancelOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="whole-cancel-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
          onClick={() => setWholeCancelOpen(false)}
        >
          <div
            className="w-full sm:max-w-md bg-surface rounded-t-xl sm:rounded-xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border-muted">
              <Typography variant="h5" as="h2" id="whole-cancel-title">予約をキャンセル</Typography>
            </div>
            <div className="p-4 space-y-2">
              <Typography variant="body">
                予約 <strong>{reservation.id}</strong> をすべてキャンセルします。よろしいですか？
              </Typography>
              <Typography variant="caption" color="muted" as="p">
                ※ デモ画面のため、実際の払戻処理は行われません。
              </Typography>
            </div>
            <div className="p-4 border-t border-border-muted flex gap-2">
              <Button variant="tertiary" onClick={() => setWholeCancelOpen(false)} fullWidth>
                やめる
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setWholeCancelOpen(false);
                  navigate('/reservations');
                }}
                fullWidth
              >
                キャンセルを実行
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 予約を変更 Modal */}
      {modifyOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-modal-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
          onClick={closeModify}
        >
          <div
            className="w-full sm:max-w-md max-h-[90vh] overflow-y-auto bg-surface rounded-t-xl sm:rounded-xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border-muted flex items-center justify-between">
              <Typography variant="h5" as="h2" id="cancel-modal-title">
                {modifyStep === 1 ? '予約を変更' : '変更内容の確認'}
              </Typography>
              <Button
                iconOnly
                variant="tertiary"
                size="small"
                onClick={closeModify}
                aria-label="閉じる"
                icon={<Icon name="close" size="sm" color="inherit" />}
              />
            </div>

            <div className="p-4">
              {modifyStep === 1 ? (
                /* Step 1: Action Sheet - 頻度順（列車→座席→人数→区間） */
                <div className="flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    size="medium"
                    fullWidth
                    onClick={() => alert('列車の変更は未実装です')}
                  >
                    列車を変更
                  </Button>

                  <Button
                    variant="secondary"
                    size="medium"
                    fullWidth
                    onClick={() => {
                      // 全 leg を順次見直すフロー（再配置 Modal を起動）
                      const allLegIds = reservation.legs
                        .filter((leg) => reservation.seatAssignments.some((s) => s.legId === leg.id))
                        .map((l) => l.id);
                      if (allLegIds.length === 0) {
                        setModifyOpen(false);
                        return;
                      }
                      setModifyOpen(false);
                      setReseatLegIds(allLegIds);
                      setReseatIndex(0);
                      setReseatOrigin('seats');
                      const firstLegId = allLegIds[0];
                      const seatsForFirst = reservation.seatAssignments.filter((s) => s.legId === firstLegId);
                      if (seatsForFirst.length > 0) {
                        setReseatSelectedCar(seatsForFirst[0].car);
                        setReseatSelectedSeats(seatsForFirst.map((s) => s.seatNumber));
                      } else {
                        const firstLeg = reservation.legs.find((l) => l.id === firstLegId);
                        const cars = carNumbersForClass(seatClassLabelToId(firstLeg?.seatClassLabel ?? ''));
                        setReseatSelectedCar(cars[0]);
                        setReseatSelectedSeats([]);
                      }
                    }}
                  >
                    座席を変更
                  </Button>

                  {reservation.passengers.length > 1 && (
                    <Button
                      variant="secondary"
                      size="medium"
                      fullWidth
                      onClick={() => {
                        setModifyScope('passengers');
                        setRemainAdults(currentAdults);
                        setRemainChildren(currentChildren);
                        setModifyStep(2);
                      }}
                    >
                      人数を変更
                    </Button>
                  )}

                  <Button
                    variant="secondary"
                    size="medium"
                    fullWidth
                    onClick={() => alert('区間の変更（発着駅から再選択するフロー）は未実装です')}
                  >
                    区間を変更
                  </Button>
                </div>
              ) : (
                /* Step 2: 選んだ scope に応じた操作画面 */
                <div className="space-y-4">
                  {modifyScope === 'passengers' && (
                    <>
                      <Typography variant="body-sm" color="muted">
                        キャンセル後に残る人数を指定してください。
                      </Typography>
                      <NumberInput
                        label="おとな"
                        value={remainAdults}
                        onChange={setRemainAdults}
                        min={0}
                        max={currentAdults}
                      />
                      {currentChildren > 0 && (
                        <NumberInput
                          label="こども"
                          value={remainChildren}
                          onChange={setRemainChildren}
                          min={0}
                          max={currentChildren}
                        />
                      )}
                      <Typography variant="caption" color="muted" as="p">
                        実行後、残る乗客の座席を順次取り直します。
                      </Typography>
                    </>
                  )}
                  <Typography variant="caption" color="muted" as="p">
                    ※ デモ画面のため、実際の払戻処理は行われません。
                  </Typography>
                </div>
              )}
            </div>

            {modifyStep === 2 && (
              <div className="p-4 border-t border-border-muted flex gap-2">
                <Button variant="tertiary" onClick={() => setModifyStep(1)} fullWidth>
                  戻る
                </Button>
                <Button
                  variant="primary"
                  onClick={executeModify}
                  fullWidth
                  disabled={!canProceedStep1}
                >
                  変更を実行
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 座席の再配置 Modal（一部キャンセル後の B 単独路線フロー） */}
      {reseatLegIds.length > 0 && (() => {
        const legId = reseatLegIds[reseatIndex];
        const leg = reservation.legs.find((l) => l.id === legId);
        if (!leg) return null;
        const isLast = reseatIndex === reseatLegIds.length - 1;
        const passengerCount = reservation.passengers.length;

        const seatClassId = seatClassLabelToId(leg.seatClassLabel);
        const availableCars = carNumbersForClass(seatClassId);
        const cols = seatClassId === 'reserved' ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C', 'D'];
        const aisleAfter = 'B';

        const seatMap = generateSeatMap(seatClassId, reseatSelectedCar);
        const rows = [...new Set(seatMap.map((s) => s.row))].sort((a, b) => a - b);

        // 現在の座席（残乗客分） — 比較用
        const currentSeatsForLeg = reservation.seatAssignments
          .filter((s) => s.legId === legId)
          .map((s) => ({ car: s.car, seatNumber: s.seatNumber }));

        const onCarChange = (car: number) => {
          setReseatSelectedCar(car);
          setReseatSelectedSeats([]);
        };

        const onSeatClick = (seatNumber: string) => {
          if (reseatSelectedSeats.includes(seatNumber)) {
            setReseatSelectedSeats(reseatSelectedSeats.filter((s) => s !== seatNumber));
          } else if (reseatSelectedSeats.length < passengerCount) {
            setReseatSelectedSeats([...reseatSelectedSeats, seatNumber]);
          }
        };

        const advanceToNext = () => {
          if (isLast) {
            setReseatLegIds([]);
            setReseatIndex(0);
            setReseatSelectedSeats([]);
            showToast(reseatOrigin === 'seats' ? 'seats-updated' : 'passengers-updated');
            return;
          }
          // 次の leg へ
          const nextIndex = reseatIndex + 1;
          const nextLegId = reseatLegIds[nextIndex];
          setReseatIndex(nextIndex);
          // 次の leg の現在の座席を初期選択にセット
          const seatsForNextLeg = reservation.seatAssignments.filter((s) => s.legId === nextLegId);
          if (seatsForNextLeg.length > 0) {
            setReseatSelectedCar(seatsForNextLeg[0].car);
            setReseatSelectedSeats(seatsForNextLeg.map((s) => s.seatNumber));
          } else {
            const nextLeg = reservation.legs.find((l) => l.id === nextLegId);
            const cars = carNumbersForClass(seatClassLabelToId(nextLeg?.seatClassLabel ?? ''));
            setReseatSelectedCar(cars[0]);
            setReseatSelectedSeats([]);
          }
        };

        const saveAndNext = () => {
          // 選択座席 = 人数分でなければ保存しない
          if (reseatSelectedSeats.length !== passengerCount) return;
          const nextAssignments = reservation.seatAssignments.filter((s) => s.legId !== legId);
          reservation.passengers.forEach((p, i) => {
            nextAssignments.push({
              passengerId: p.id,
              legId,
              car: reseatSelectedCar,
              seatNumber: reseatSelectedSeats[i],
            });
          });
          setReservation({ ...reservation, seatAssignments: nextAssignments });
          advanceToNext();
        };

        return (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reseat-modal-title"
            className="fixed inset-0 z-50 flex items-end sm:items-stretch justify-center bg-black/40"
          >
            <div className="w-full sm:max-w-2xl max-h-full flex flex-col bg-surface sm:rounded-xl shadow-xl overflow-hidden">
              <div className="p-4 border-b border-border-muted shrink-0">
                <Typography variant="h5" as="h2" id="reseat-modal-title">座席の再配置</Typography>
                <div className="mt-1 flex items-baseline justify-between gap-2 flex-wrap">
                  <Typography variant="body-sm" color="muted">
                    {leg.from} → {leg.to}（{leg.trainName}・{leg.seatClassLabel}）
                  </Typography>
                  {reseatLegIds.length > 1 && (
                    <Typography variant="caption" color="muted">
                      {reseatIndex + 1} / {reseatLegIds.length} 区間
                    </Typography>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <Typography variant="caption" color="muted" as="p" className="mb-2">号車</Typography>
                  <SegmentedControl
                    items={availableCars.map((car) => ({ value: car, label: `${car}号車` }))}
                    value={reseatSelectedCar}
                    onChange={onCarChange}
                    aria-label="号車選択"
                  />
                </div>

                {/* 凡例 */}
                <div className="flex items-center gap-4 text-xs text-onSurface-muted">
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded border border-border-default bg-surface" />
                    <span>空席</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded bg-surface-primary" />
                    <span>選択中</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded bg-surface-inset" />
                    <span>予約済み</span>
                  </div>
                </div>

                {/* 列ヘッダー */}
                <div className="flex items-center justify-center gap-1">
                  {cols.map((c) => (
                    <div key={c} className="flex items-center">
                      <div className="w-10 text-center text-xs font-semibold text-onSurface-muted">{c}</div>
                      {c === aisleAfter && <div className="w-6" />}
                    </div>
                  ))}
                </div>

                {/* 座席グリッド */}
                <div className="space-y-1">
                  {rows.map((row) => (
                    <div key={row} className="flex items-center justify-center gap-1">
                      {cols.map((col) => {
                        const seat = seatMap.find((s) => s.row === row && s.col === col);
                        if (!seat) return null;
                        const isSelected = reseatSelectedSeats.includes(seat.id);
                        const isOccupied = seat.status === 'occupied';
                        return (
                          <div key={seat.id} className="flex items-center">
                            <ToggleButton
                              selected={isSelected}
                              disabled={isOccupied}
                              onClick={() => onSeatClick(seat.id)}
                              aria-label={`座席 ${seat.id}${isOccupied ? ' 予約済み' : ''}`}
                            >
                              {row}
                            </ToggleButton>
                            {col === aisleAfter && <div className="w-6" />}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* 現在 vs 選択 の対比 */}
                <div className="p-3 border border-border-muted rounded space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-onSurface-muted">現在の座席</span>
                    <span className="font-medium text-onSurface">
                      {currentSeatsForLeg.length > 0
                        ? currentSeatsForLeg.map((s) => `${s.car}号車 ${s.seatNumber}`).join(', ')
                        : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-onSurface-muted">選択中</span>
                    <span className="font-medium text-onSurface">
                      {reseatSelectedSeats.length > 0
                        ? `${reseatSelectedCar}号車 ${reseatSelectedSeats.join(', ')}（${reseatSelectedSeats.length} / ${passengerCount} 名）`
                        : `未選択（${passengerCount} 名分）`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border-muted flex gap-2 shrink-0">
                <Button variant="tertiary" onClick={advanceToNext} fullWidth>
                  このまま{isLast ? '完了' : '次へ'}
                </Button>
                <Button
                  onClick={saveAndNext}
                  fullWidth
                  disabled={reseatSelectedSeats.length !== passengerCount}
                >
                  {isLast ? '保存して完了' : '保存して次へ'}
                </Button>
              </div>
            </div>
          </div>
        );
      })()}

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
