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

type EditingChip = 'route' | 'date' | 'passengers' | null;

export const ResultsPage = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const from = params.get('from') ?? '東京';
  const to = params.get('to') ?? '新大阪';
  const date = params.get('date') ?? '';
  const adults = Number(params.get('adults') ?? 1);
  const children = Number(params.get('children') ?? 0);

  const [editing, setEditing] = useState<EditingChip>(null);
  // 編集中の値（保存ボタンで params に反映）
  const [editFrom, setEditFrom] = useState(from);
  const [editTo, setEditTo] = useState(to);
  const [editDate, setEditDate] = useState(date);
  const [editAdults, setEditAdults] = useState(adults);
  const [editChildren, setEditChildren] = useState(children);

  const trains = searchTrains(from, to);
  const cheapestMultiplier = Math.min(...seatClasses.map((c) => c.priceMultiplier));

  const handleSelect = (train: Train) => {
    navigate(`/seat?trainId=${train.id}&from=${from}&to=${to}&date=${date}&adults=${adults}&children=${children}`);
  };

  const openChip = (chip: EditingChip) => {
    // 開く時に最新値で初期化
    setEditFrom(from);
    setEditTo(to);
    setEditDate(date);
    setEditAdults(adults);
    setEditChildren(children);
    setEditing(editing === chip ? null : chip);
  };

  const saveRoute = () => {
    const next = new URLSearchParams(params);
    next.set('from', editFrom);
    next.set('to', editTo);
    setParams(next);
    setEditing(null);
  };

  const saveDate = () => {
    const next = new URLSearchParams(params);
    next.set('date', editDate);
    setParams(next);
    setEditing(null);
  };

  const savePassengers = () => {
    const next = new URLSearchParams(params);
    next.set('adults', String(editAdults));
    next.set('children', String(editChildren));
    setParams(next);
    setEditing(null);
  };

  const chipClass = (active: boolean) =>
    [
      'inline-flex items-center gap-1 px-3 h-9 rounded-full border text-sm font-medium transition-colors whitespace-nowrap',
      active
        ? 'border-border-primary bg-surface-secondary text-onSurface-primary'
        : 'border-border-default bg-surface text-onSurface hover:border-border-strong',
    ].join(' ');

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
      {/* 検索条件: Chip + インライン展開（SP） */}
      <div className="col-span-12 lg:hidden">
        <Card padding="sm">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className={chipClass(editing === 'route')} onClick={() => openChip('route')}>
              <Icon name="train" size="sm" color="inherit" />
              {from} → {to}
              <Icon name={editing === 'route' ? 'expand_less' : 'expand_more'} size="sm" color="inherit" />
            </button>
            <button type="button" className={chipClass(editing === 'date')} onClick={() => openChip('date')}>
              <Icon name="calendar_today" size="sm" color="inherit" />
              {formatDate(date)}
              <Icon name={editing === 'date' ? 'expand_less' : 'expand_more'} size="sm" color="inherit" />
            </button>
            <button type="button" className={chipClass(editing === 'passengers')} onClick={() => openChip('passengers')}>
              <Icon name="group" size="sm" color="inherit" />
              {formatPassengers(adults, children)}
              <Icon name={editing === 'passengers' ? 'expand_less' : 'expand_more'} size="sm" color="inherit" />
            </button>
          </div>

          {editing === 'route' && (
            <div className="mt-3 pt-3 border-t border-border-muted space-y-3">
              <Select label="出発駅" value={editFrom} onChange={(e) => setEditFrom(e.target.value)} fullWidth>
                {stations.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
              <Select label="到着駅" value={editTo} onChange={(e) => setEditTo(e.target.value)} fullWidth>
                {stations.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
              <div className="flex gap-2">
                <Button variant="tertiary" size="small" onClick={() => setEditing(null)} fullWidth>キャンセル</Button>
                <Button size="small" onClick={saveRoute} fullWidth>更新</Button>
              </div>
            </div>
          )}

          {editing === 'date' && (
            <div className="mt-3 pt-3 border-t border-border-muted space-y-3">
              <Input
                label="乗車日"
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                fullWidth
              />
              <div className="flex gap-2">
                <Button variant="tertiary" size="small" onClick={() => setEditing(null)} fullWidth>キャンセル</Button>
                <Button size="small" onClick={saveDate} fullWidth>更新</Button>
              </div>
            </div>
          )}

          {editing === 'passengers' && (
            <div className="mt-3 pt-3 border-t border-border-muted space-y-3">
              <NumberInput label="おとな" value={editAdults} onChange={setEditAdults} min={1} max={9} />
              <NumberInput label="こども" value={editChildren} onChange={setEditChildren} min={0} max={9} />
              <div className="flex gap-2">
                <Button variant="tertiary" size="small" onClick={() => setEditing(null)} fullWidth>キャンセル</Button>
                <Button size="small" onClick={savePassengers} fullWidth>更新</Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* 検索条件: デスクトップ（PC は今回触らない、後日見直し） */}
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
      <div className="col-span-12 lg:col-span-8 lg:order-1 space-y-3">
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
                  {/* 1行目: 発着時刻 + 所要時間 */}
                  <div className="flex items-center gap-2">
                    <Typography variant="h5" weight="bold" as="span">{train.departure}</Typography>
                    <Typography variant="caption" color="muted" as="span">→</Typography>
                    <Typography variant="h5" weight="bold" as="span">{train.arrival}</Typography>
                    <Typography variant="caption" color="muted" as="span">({train.duration})</Typography>
                  </div>
                  {/* 2行目: 列車名 */}
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

              {/* 席種ごとの空席状況 — 4 列、画面幅いっぱい */}
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
  );
};
