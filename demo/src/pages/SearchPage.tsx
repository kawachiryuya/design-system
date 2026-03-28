import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon';
import { Input } from '@ds/primitives/Input/Input';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Divider } from '@ds/primitives/Divider/Divider';
import { NumberInput } from '@ds/composites/NumberInput/NumberInput';
import { Select } from '@ds/composites/Select/Select';
import { Card } from '@ds/composites/Card/Card';
import { stations } from '../data/stations';
import { seatClasses, formatPassengers, calcTotalFare } from '../data/trains';

export const SearchPage = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState('東京');
  const [to, setTo] = useState('新大阪');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const handleSearch = () => {
    navigate(`/results?${new URLSearchParams({ from, to, date, adults: String(adults), children: String(children) }).toString()}`);
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const unreserved = seatClasses.find((c) => c.id === 'unreserved')!;
  const unreservedPrice = Math.round(13320 * unreserved.priceMultiplier);

  const unreservedTotal = calcTotalFare(unreservedPrice, adults, children);

  const handleUnreserved = () => {
    navigate(`/confirm?from=${from}&to=${to}&date=${date}&class=unreserved&total=${unreservedTotal}&adults=${adults}&children=${children}`);
  };

  return (
    <div className="py-4">
      <Typography variant="h3" as="h1" className="mb-2">新幹線予約</Typography>
      <Typography variant="body-sm" color="muted" className="mb-6">出発地と目的地を選んで検索</Typography>

      <div className="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
      {/* 左カラム: メインフォーム */}
      <div className="col-span-12 lg:col-span-6">
        <Card padding="lg" className="space-y-5">
          {/* 出発駅 / 到着駅 */}
          <div className="flex flex-col lg:flex-row lg:items-end gap-2">
            <div className="flex-1">
              <Select label="出発駅" value={from} onChange={(e) => setFrom(e.target.value)} fullWidth>
                {stations.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>

            <Button
              iconOnly
              size="small"
              variant="tertiary"
              onClick={handleSwap}
              aria-label="出発駅と到着駅を入れ替え"
              className="self-center"
            >
              <Icon name="swap_vert" size="sm" color="primary" className="lg:hidden" />
              <Icon name="swap_horiz" size="sm" color="primary" className="hidden lg:block" />
            </Button>

            <div className="flex-1">
              <Select label="到着駅" value={to} onChange={(e) => setTo(e.target.value)} fullWidth>
                {stations.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
          </div>

          {/* 乗車日 */}
          <Input type="date" label="乗車日" id="date" value={date} onChange={(e) => setDate(e.target.value)} fullWidth />

          {/* 人数 */}
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              label="おとな"
              value={adults}
              onChange={setAdults}
              min={1}
              max={6}
              decrementLabel="おとなを減らす"
              incrementLabel="おとなを増やす"
            />
            <NumberInput
              label="こども"
              value={children}
              onChange={setChildren}
              min={0}
              max={6}
              decrementLabel="こどもを減らす"
              incrementLabel="こどもを増やす"
            />
          </div>

          {/* 検索ボタン */}
          <Button fullWidth onClick={handleSearch}>
            列車を検索する
          </Button>

          {/* または */}
          <Divider label="または" />

          {/* 自由席クイック購入 */}
          <div className="flex items-start justify-between">
            <div>
              <Typography variant="label" as="h2">自由席</Typography>
              <Typography variant="body-sm" color="muted" className="mt-1">
                座席指定なし・列車選択不要
              </Typography>
            </div>
            <div className="text-right shrink-0 ml-4">
              {(adults + children) > 1 && (
                <Typography variant="caption" color="muted">{formatPassengers(adults, children)}</Typography>
              )}
              <Typography variant="h5" weight="bold" as="p">¥{unreservedTotal.toLocaleString()}</Typography>
            </div>
          </div>
          <Button fullWidth variant="secondary" onClick={handleUnreserved}>
            自由席を購入する
          </Button>
        </Card>
      </div>

      {/* 右カラム: 案内情報 */}
      <div className="col-span-12 lg:col-span-6 hidden lg:block">
        <Card padding="lg">
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
    </div>
  );
};
