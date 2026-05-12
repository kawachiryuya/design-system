import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon';
import { Input } from '@ds/primitives/Input/Input';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Badge } from '@ds/composites/Badge/Badge';
import { Card } from '@ds/composites/Card/Card';
import { NumberInput } from '@ds/composites/NumberInput/NumberInput';
import { Select } from '@ds/composites/Select/Select';
import { Checkbox } from '@ds/composites/Checkbox/Checkbox';
import { Radio } from '@ds/composites/Radio/Radio';
import { searchTrains, seatClasses, formatPassengers, calcTotalFare, type Train, type SeatAvailability } from '../data/trains';
import { stations } from '../data/stations';
import { formatDate } from '../utils/format';

const availabilityBadge = (status: SeatAvailability, label: string) => {
  switch (status) {
    case 'available':
      return <Badge variant="success" appearance="soft" size="small">○ {label}</Badge>;
    case 'few':
      return <Badge variant="warning" appearance="soft" size="small">△ {label}</Badge>;
    case 'sold-out':
      return <Badge variant="neutral" appearance="soft" size="small">{label} 満席</Badge>;
  }
};

const isAllSoldOut = (seats: Train['seats']) =>
  Object.values(seats).every((s) => s === 'sold-out');

type SortBy = 'departure' | 'arrival';
type TrainType = 'all' | 'のぞみ' | 'ひかり' | 'こだま';
type TimeBand = 'all' | 'morning' | 'afternoon' | 'evening';
type ModalType = 'sort' | 'type' | 'allFilters' | null;

const detectTrainType = (name: string): Exclude<TrainType, 'all'> | null => {
  if (name.startsWith('のぞみ')) return 'のぞみ';
  if (name.startsWith('ひかり')) return 'ひかり';
  if (name.startsWith('こだま')) return 'こだま';
  return null;
};

const matchesTimeBand = (departure: string, band: TimeBand): boolean => {
  if (band === 'all') return true;
  const hour = parseInt(departure.split(':')[0], 10);
  if (band === 'morning') return hour < 12;
  if (band === 'afternoon') return hour >= 12 && hour < 18;
  return hour >= 18;
};

const SEAT_TYPE_LIST: { id: string; label: string }[] = [
  { id: 'unreserved', label: '自由席' },
  { id: 'reserved', label: '普通車指定席' },
  { id: 'green', label: 'グリーン車' },
  { id: 'gran', label: 'グランクラス' },
];

const TRAIN_TYPES: { value: TrainType; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'のぞみ', label: 'のぞみ' },
  { value: 'ひかり', label: 'ひかり' },
  { value: 'こだま', label: 'こだま' },
];

export const ResultsPage = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const from = params.get('from') ?? '東京';
  const to = params.get('to') ?? '新大阪';
  const date = params.get('date') ?? '';
  const adults = Number(params.get('adults') ?? 1);
  const children = Number(params.get('children') ?? 0);

  // フィルタ状態
  const [sortBy, setSortBy] = useState<SortBy>('departure');
  const [trainType, setTrainType] = useState<TrainType>('all');
  const [timeBand, setTimeBand] = useState<TimeBand>('all');
  const [requiredSeatTypes, setRequiredSeatTypes] = useState<Record<string, boolean>>({});
  const [hideSoldOut, setHideSoldOut] = useState(false);

  // Modal 管理
  const [openModal, setOpenModal] = useState<ModalType>(null);

  // allFilters Modal 用の編集 state（保存型）
  const [editFrom, setEditFrom] = useState(from);
  const [editTo, setEditTo] = useState(to);
  const [editDate, setEditDate] = useState(date);
  const [editAdults, setEditAdults] = useState(adults);
  const [editChildren, setEditChildren] = useState(children);
  const [editSortBy, setEditSortBy] = useState<SortBy>(sortBy);
  const [editTrainType, setEditTrainType] = useState<TrainType>(trainType);
  const [editTimeBand, setEditTimeBand] = useState<TimeBand>(timeBand);
  const [editRequiredSeatTypes, setEditRequiredSeatTypes] = useState<Record<string, boolean>>(requiredSeatTypes);
  const [editHideSoldOut, setEditHideSoldOut] = useState(hideSoldOut);

  const openAllFilters = () => {
    // 現在値を edit state にコピー
    setEditFrom(from);
    setEditTo(to);
    setEditDate(date);
    setEditAdults(adults);
    setEditChildren(children);
    setEditSortBy(sortBy);
    setEditTrainType(trainType);
    setEditTimeBand(timeBand);
    setEditRequiredSeatTypes({ ...requiredSeatTypes });
    setEditHideSoldOut(hideSoldOut);
    setOpenModal('allFilters');
  };

  const closeModal = () => setOpenModal(null);

  const resetAllFilters = () => {
    // フィルタ系のみリセット（検索条件は触らない）
    setEditSortBy('departure');
    setEditTrainType('all');
    setEditTimeBand('all');
    setEditRequiredSeatTypes({});
    setEditHideSoldOut(false);
  };

  const saveAllFilters = () => {
    // 検索条件 → URL params
    const next = new URLSearchParams(params);
    next.set('from', editFrom);
    next.set('to', editTo);
    next.set('date', editDate);
    next.set('adults', String(editAdults));
    next.set('children', String(editChildren));
    setParams(next);
    // リスト操作 → state
    setSortBy(editSortBy);
    setTrainType(editTrainType);
    setTimeBand(editTimeBand);
    setRequiredSeatTypes(editRequiredSeatTypes);
    setHideSoldOut(editHideSoldOut);
    closeModal();
  };

  // 列車一覧（フィルタ + ソート適用）
  const trains = [...searchTrains(from, to)]
    .filter((t) => {
      if (trainType !== 'all' && detectTrainType(t.name) !== trainType) return false;
      if (!matchesTimeBand(t.departure, timeBand)) return false;
      const requiredKeys = Object.entries(requiredSeatTypes).filter(([, v]) => v).map(([k]) => k);
      if (requiredKeys.length > 0) {
        const ok = requiredKeys.every((k) => {
          const s = t.seats[k];
          return s === 'available' || s === 'few';
        });
        if (!ok) return false;
      }
      if (hideSoldOut && isAllSoldOut(t.seats)) return false;
      return true;
    })
    .sort((a, b) => {
      const key = sortBy === 'arrival' ? 'arrival' : 'departure';
      return a[key].localeCompare(b[key]);
    });

  const cheapestMultiplier = Math.min(...seatClasses.map((c) => c.priceMultiplier));

  const handleSelect = (train: Train) => {
    navigate(`/seat?trainId=${train.id}&from=${from}&to=${to}&date=${date}&adults=${adults}&children=${children}`);
  };

  // chip スタイル
  const chipClass = (active: boolean) =>
    [
      'inline-flex items-center gap-1 px-3 h-9 rounded-full border text-sm font-medium transition-colors whitespace-nowrap',
      active
        ? 'border-border-primary bg-surface-secondary text-onSurface-primary'
        : 'border-border-default bg-surface text-onSurface hover:border-border-strong',
    ].join(' ');

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
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
              <Typography variant="label" as="dd">{formatDate(date)}</Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="body-sm" color="muted" as="dt">人数</Typography>
              <Typography variant="label" as="dd">{formatPassengers(adults, children)}</Typography>
            </div>
          </dl>
          <Button fullWidth variant="secondary" size="small" onClick={() => navigate('/')} className="mt-4">
            条件変更
          </Button>
        </Card>
      </div>

      {/* 結果一覧 */}
      <div className="col-span-12 lg:col-span-8 lg:order-1">
        {/* 1 行フィルターバー: チューナー（一括）+ 並び順 + 種別 + 満席を非表示 */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 mb-2 items-center">
          <button
            type="button"
            className={`${chipClass(false)} !px-2`}
            onClick={openAllFilters}
            aria-label="すべての条件・絞り込み"
          >
            <Icon name="tune" size="sm" color="inherit" />
          </button>
          <button type="button" className={chipClass(sortBy !== 'departure')} onClick={() => setOpenModal('sort')}>
            <span>並び順: {sortBy === 'departure' ? '出発時刻順' : '到着時刻順'}</span>
            <Icon name="expand_more" size="sm" color="inherit" />
          </button>
          <button type="button" className={chipClass(trainType !== 'all')} onClick={() => setOpenModal('type')}>
            <span>種別: {trainType === 'all' ? 'すべて' : trainType}</span>
            <Icon name="expand_more" size="sm" color="inherit" />
          </button>
          <button type="button" className={chipClass(hideSoldOut)} onClick={() => setHideSoldOut(!hideSoldOut)}>
            <span>満席を非表示</span>
          </button>
        </div>

        {/* 検索結果件数 */}
        <Typography variant="caption" color="muted" as="p" className="mb-2">
          {trains.length} 件
        </Typography>

        {/* 結果カード一覧 */}
        <div className="space-y-3">
        {trains.map((train) => {
          const soldOut = isAllSoldOut(train.seats);
          const cheapest = Math.round(train.price * cheapestMultiplier);
          const totalCheapest = calcTotalFare(cheapest, adults, children);

          return (
            <Card
              key={train.id}
              clickable={!soldOut}
              onClick={!soldOut ? () => handleSelect(train) : undefined}
              padding="md"
              className={soldOut ? 'opacity-60 bg-surface-inset' : ''}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Typography variant="h5" weight="bold" as="span">{train.departure}</Typography>
                    <Typography variant="caption" color="muted" as="span">→</Typography>
                    <Typography variant="h5" weight="bold" as="span">{train.arrival}</Typography>
                    <Typography variant="caption" color="muted" as="span">({train.duration})</Typography>
                  </div>
                  <Typography variant="body-sm" color="muted">{train.name}</Typography>
                </div>

                <div className="text-right shrink-0">
                  {soldOut ? (
                    <Typography variant="h5" weight="bold" as="p" color="muted">満席</Typography>
                  ) : (
                    <Typography variant="h5" weight="bold" as="p">
                      ¥{totalCheapest.toLocaleString()}〜
                    </Typography>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1">
                {[
                  { id: 'unreserved', label: '自由' },
                  { id: 'reserved', label: '指定' },
                  { id: 'green', label: 'グリーン' },
                  { id: 'gran', label: 'グラン' },
                ].map((cls) => {
                  const status = train.seats[cls.id];
                  return (
                    <div key={cls.id} className="flex justify-center">
                      {status ? (
                        <div className="w-full [&>span]:w-full [&>span]:justify-center">
                          {availabilityBadge(status, cls.label)}
                        </div>
                      ) : (
                        <span className="text-xs text-onSurface-subtle">-</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
        </div>
      </div>

      {/* ===== Modals ===== */}

      {/* 並び順 Modal（chip 直接、単一選択 → 即閉じる） */}
      {openModal === 'sort' && (
        <ModalShell title="並び順" onClose={closeModal}>
          <div className="p-4 space-y-2">
            <Radio
              label="出発時刻順"
              name="sortBy"
              checked={sortBy === 'departure'}
              onChange={() => { setSortBy('departure'); closeModal(); }}
            />
            <Radio
              label="到着時刻順"
              name="sortBy"
              checked={sortBy === 'arrival'}
              onChange={() => { setSortBy('arrival'); closeModal(); }}
            />
          </div>
        </ModalShell>
      )}

      {/* 種別 Modal */}
      {openModal === 'type' && (
        <ModalShell title="種別" onClose={closeModal}>
          <div className="p-4 space-y-2">
            {TRAIN_TYPES.map((chip) => (
              <Radio
                key={chip.value}
                label={chip.label}
                name="trainType"
                checked={trainType === chip.value}
                onChange={() => { setTrainType(chip.value); closeModal(); }}
              />
            ))}
          </div>
        </ModalShell>
      )}

      {/* すべての条件・絞り込み Modal（保存型） */}
      {openModal === 'allFilters' && (
        <ModalShell title="すべての条件・絞り込み" onClose={closeModal}>
          <div className="p-4 space-y-6">
            {/* 検索条件 */}
            <section className="space-y-3">
              <Typography variant="label" as="h3" color="muted">検索条件</Typography>
              <Input
                label="乗車日"
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                fullWidth
              />
              <div className="grid grid-cols-2 gap-2">
                <Select label="出発駅" value={editFrom} onChange={(e) => setEditFrom(e.target.value)} fullWidth>
                  {stations.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
                <Select label="到着駅" value={editTo} onChange={(e) => setEditTo(e.target.value)} fullWidth>
                  {stations.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
              <NumberInput label="おとな" value={editAdults} onChange={setEditAdults} min={1} max={9} />
              <NumberInput label="こども" value={editChildren} onChange={setEditChildren} min={0} max={9} />
            </section>

            {/* 並び順 */}
            <section>
              <Typography variant="label" as="h3" color="muted" className="mb-2">並び順</Typography>
              <div className="space-y-2">
                <Radio label="出発時刻順" name="editSortBy" checked={editSortBy === 'departure'} onChange={() => setEditSortBy('departure')} />
                <Radio label="到着時刻順" name="editSortBy" checked={editSortBy === 'arrival'} onChange={() => setEditSortBy('arrival')} />
              </div>
            </section>

            {/* 種別 */}
            <section>
              <Typography variant="label" as="h3" color="muted" className="mb-2">種別</Typography>
              <div className="space-y-2">
                {TRAIN_TYPES.map((chip) => (
                  <Radio
                    key={chip.value}
                    label={chip.label}
                    name="editTrainType"
                    checked={editTrainType === chip.value}
                    onChange={() => setEditTrainType(chip.value)}
                  />
                ))}
              </div>
            </section>

            {/* 時間帯 */}
            <section>
              <Typography variant="label" as="h3" color="muted" className="mb-2">時間帯（出発）</Typography>
              <div className="space-y-2">
                <Radio label="すべて" name="editTimeBand" checked={editTimeBand === 'all'} onChange={() => setEditTimeBand('all')} />
                <Radio label="朝(〜 11:59)" name="editTimeBand" checked={editTimeBand === 'morning'} onChange={() => setEditTimeBand('morning')} />
                <Radio label="昼(12:00 〜 17:59)" name="editTimeBand" checked={editTimeBand === 'afternoon'} onChange={() => setEditTimeBand('afternoon')} />
                <Radio label="夜(18:00 〜)" name="editTimeBand" checked={editTimeBand === 'evening'} onChange={() => setEditTimeBand('evening')} />
              </div>
            </section>

            {/* 席種 */}
            <section>
              <Typography variant="label" as="h3" color="muted" className="mb-2">空きあり必須の席種</Typography>
              <div className="space-y-2">
                {SEAT_TYPE_LIST.map((c) => (
                  <Checkbox
                    key={c.id}
                    label={c.label}
                    checked={Boolean(editRequiredSeatTypes[c.id])}
                    onChange={(e) =>
                      setEditRequiredSeatTypes((prev) => ({ ...prev, [c.id]: e.target.checked }))
                    }
                  />
                ))}
              </div>
            </section>

            {/* 満席 */}
            <section>
              <Checkbox
                label="満席を非表示にする"
                checked={editHideSoldOut}
                onChange={(e) => setEditHideSoldOut(e.target.checked)}
              />
            </section>
          </div>

          <div className="p-4 border-t border-border-muted flex gap-2 sticky bottom-0 bg-surface">
            <Button variant="tertiary" onClick={resetAllFilters} fullWidth>
              リセット
            </Button>
            <Button onClick={saveAllFilters} fullWidth>
              この条件で絞り込む
            </Button>
          </div>
        </ModalShell>
      )}
    </div>
  );
};

const ModalShell = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <div
    role="dialog"
    aria-modal="true"
    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
    onClick={onClose}
  >
    <div
      className="w-full sm:max-w-md max-h-[90vh] overflow-y-auto bg-surface rounded-t-xl sm:rounded-xl shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b border-border-muted flex items-center justify-between sticky top-0 bg-surface z-10">
        <Typography variant="h5" as="h2">{title}</Typography>
        <Button
          iconOnly
          variant="tertiary"
          size="small"
          onClick={onClose}
          aria-label="閉じる"
          icon={<Icon name="close" size="sm" color="inherit" />}
        />
      </div>
      {children}
    </div>
  </div>
);
