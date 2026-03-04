import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Select } from '@ds/composites/Select/Select';
import { Card } from '@ds/composites/Card/Card';
import { stations } from '../data/stations';

const timeSlots = [
  { value: '', label: '指定なし' },
  { value: 'early', label: '始発〜8:00' },
  { value: 'morning', label: '8:00〜12:00' },
  { value: 'afternoon', label: '12:00〜16:00' },
  { value: 'evening', label: '16:00〜最終' },
];

export const SearchPage = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState('東京');
  const [to, setTo] = useState('新大阪');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams({ from, to, date });
    if (timeSlot) params.set('time', timeSlot);
    navigate(`/results?${params.toString()}`);
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8 py-10">
      {/* 左カラム: メインフォーム */}
      <div className="col-span-12 lg:col-span-6">
        <Typography variant="h3" as="h1" className="mb-2">新幹線予約</Typography>
        <Typography variant="body-sm" color="muted" className="mb-6">出発地と目的地を選んで検索</Typography>

        <Card padding="lg" className="space-y-5">
          {/* 出発駅 / 到着駅 */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Select label="出発駅" value={from} onChange={(e) => setFrom(e.target.value)} fullWidth>
                {stations.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>

            <button
              type="button"
              onClick={handleSwap}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-inset transition-colors"
              aria-label="出発駅と到着駅を入れ替え"
            >
              <Icon name="swap_horiz" size="sm" color="primary" />
            </button>

            <div className="flex-1">
              <Select label="到着駅" value={to} onChange={(e) => setTo(e.target.value)} fullWidth>
                {stations.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
          </div>

          {/* 日付 / 時間帯 */}
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="date" className="text-sm font-medium text-onSurface">乗車日</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full rounded border border-border text-onSurface appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 hover:border-border-strong focus:border-border-focus focus:ring-border-focus bg-surface pl-3 pr-10 py-2 text-base"
              />
            </div>
            <div className="flex-1">
              <Select label="乗車時間帯" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} fullWidth>
                {timeSlots.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Select>
            </div>
          </div>

          {/* 検索ボタン */}
          <Button fullWidth onClick={handleSearch}>
            検索する
          </Button>
        </Card>
      </div>

      {/* 右カラム: 案内情報 */}
      <div className="col-span-12 lg:col-span-6 hidden lg:block">
        <Card padding="lg" className="mt-20">
          <Typography variant="label" as="h2" className="mb-3">ご利用案内</Typography>
          <ul className="text-sm text-onSurface-muted space-y-2">
            <li className="flex items-start gap-2">
              <Icon name="info" size="sm" color="inherit" />
              <span>乗車日の1ヶ月前から予約可能です</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="info" size="sm" color="inherit" />
              <span>座席は列車選択後にお選びいただけます</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="info" size="sm" color="inherit" />
              <span>キャンセルはマイページから手続きできます</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};
