import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Select } from '@ds/composites/Select/Select';
import { Card } from '@ds/composites/Card/Card';
import { stations } from '../data/stations';
import { seatClasses } from '../data/trains';

export const SearchPage = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState('東京');
  const [to, setTo] = useState('新大阪');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });

  const handleSearch = () => {
    navigate(`/results?${new URLSearchParams({ from, to, date }).toString()}`);
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const unreserved = seatClasses.find((c) => c.id === 'unreserved')!;
  const unreservedPrice = Math.round(13320 * unreserved.priceMultiplier);

  const handleUnreserved = () => {
    navigate(`/confirm?from=${from}&to=${to}&date=${date}&class=unreserved&total=${unreservedPrice}`);
  };

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8 py-4">
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

          {/* 乗車日 */}
          <div className="flex flex-col gap-1">
            <label htmlFor="date" className="text-sm font-medium text-onSurface">乗車日</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full rounded border border-border text-onSurface appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 hover:border-border-strong focus:border-border-focus focus:ring-border-focus bg-surface pl-3 pr-10 py-2 text-base"
            />
          </div>

          {/* 検索ボタン */}
          <Button fullWidth onClick={handleSearch}>
            列車を検索する
          </Button>

          {/* または */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-border-muted" />
            <Typography variant="caption" color="muted">または</Typography>
            <div className="flex-1 border-t border-border-muted" />
          </div>

          {/* 自由席クイック購入 */}
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="label" as="h2">自由席</Typography>
              <Typography variant="body-sm" color="muted" className="mt-1">
                座席指定なし・列車選択不要
              </Typography>
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className="text-lg font-bold text-onSurface">¥{unreservedPrice.toLocaleString()}</p>
            </div>
          </div>
          <Button fullWidth variant="secondary" onClick={handleUnreserved}>
            自由席を購入する
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
              <span>自由席は検索画面から直接購入できます</span>
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
