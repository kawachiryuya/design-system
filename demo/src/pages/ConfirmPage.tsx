import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@kawachiryuya/design-system';
import { Icon } from '@kawachiryuya/design-system';
import { Input } from '@kawachiryuya/design-system';
import { Typography } from '@kawachiryuya/design-system';
import { Alert } from '@kawachiryuya/design-system';
import { Badge } from '@kawachiryuya/design-system';
import { Card } from '@kawachiryuya/design-system';
import { Checkbox } from '@kawachiryuya/design-system';
import { Radio } from '@kawachiryuya/design-system';
import { seatClasses, searchTrains, formatPassengers } from '../data/trains';
import { formatDate } from '../utils/format';

/** "3号車 1A,3号車 1B" → { car: "3号車", numbers: ["1A", "1B"] } */
const parseSeatLabels = (seatStr: string): { car: string; numbers: string[] } | null => {
  if (!seatStr) return null;
  const items = seatStr.split(',').map((s) => s.trim()).filter(Boolean);
  if (items.length === 0) return null;
  const first = items[0].match(/^(\d+号車)\s+(.+)$/);
  if (!first) return { car: '', numbers: items };
  const car = first[1];
  const numbers = items.map((it) => {
    const m = it.match(/^\d+号車\s+(.+)$/);
    return m ? m[1] : it;
  });
  return { car, numbers };
};

export const ConfirmPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const from = params.get('from') ?? '';
  const to = params.get('to') ?? '';
  const date = params.get('date') ?? '';
  const trainId = params.get('trainId') ?? '';
  const seatClassId = params.get('class') ?? 'reserved';
  const total = Number(params.get('total') ?? 0);
  const adults = Number(params.get('adults') ?? 1);
  const children = Number(params.get('children') ?? 0);
  const seatParam = params.get('seat') ?? '';
  const parsedSeats = parseSeatLabels(seatParam);

  const train = searchTrains(from, to).find((t) => t.id === trainId);
  const seatClass = seatClasses.find((c) => c.id === seatClassId);
  const isFreeSeat = seatClass?.label.includes('自由') ?? false;
  const [agreed, setAgreed] = useState(false);
  const [cardOption, setCardOption] = useState<'saved' | 'new'>('saved');

  const handleConfirm = () => {
    navigate(`/complete?adults=${adults}&children=${children}`);
  };

  const handleChangeSeats = () => {
    navigate(
      `/seatmap?trainId=${trainId}&from=${from}&to=${to}&date=${date}&class=${seatClassId}&price=${total}&adults=${adults}&children=${children}`,
    );
  };

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
      <div className="col-span-12 lg:col-span-8 lg:col-start-3">
        <Typography variant="h5" as="h2" className="mb-4">予約内容の確認</Typography>

        <Alert variant="info">
          予約確定後のキャンセルは、マイページから行えます。
        </Alert>

        {/* 旅程統合カード（単一 leg 版、ステータス Badge なし） */}
        <Card className="mt-4" padding="md">
          {/* ヘッダー: 日付・人数 */}
          <div className="mb-4">
            <Typography variant="body-sm" color="muted">
              {formatDate(date)} / {formatPassengers(adults, children)}
            </Typography>
          </div>

          {/* 旅程主要情報: from → to */}
          <div className="flex items-end justify-between gap-2 mb-2">
            <div className="text-center flex-1">
              <Typography variant="h3" weight="bold" as="p">{from}</Typography>
              <Typography variant="body" color="muted" as="p">{train?.departure ?? '--:--'}</Typography>
            </div>
            <div className="pb-2 shrink-0">
              <Icon name="arrow_forward" size="sm" color="neutral" />
            </div>
            <div className="text-center flex-1">
              <Typography variant="h3" weight="bold" as="p">{to}</Typography>
              <Typography variant="body" color="muted" as="p">{train?.arrival ?? '--:--'}</Typography>
            </div>
          </div>

          {/* タイムライン */}
          <div className="mt-4 pt-4 border-t border-border-muted">
            {/* 出発駅 */}
            <div className="flex gap-3 items-center">
              <Typography variant="body-sm" color="muted" className="w-12 shrink-0 text-right">
                {train?.departure ?? ''}
              </Typography>
              <div className="flex flex-col items-center shrink-0">
                <Badge variant="neutral" appearance="solid" size="small">発</Badge>
              </div>
              <Typography variant="h5" weight="bold" as="p" className="flex-1">{from}</Typography>
            </div>

            {/* 区間: 線 + 列車情報 + 座席 + 変更ボタン */}
            <div className="flex gap-3 pl-12 -ml-12">
              <div className="w-12 shrink-0" />
              <div className="flex flex-col items-center shrink-0 self-stretch py-1">
                <div className="w-1 flex-1 bg-surface-primary rounded-full" />
              </div>
              <div className="flex-1 py-3 space-y-1.5">
                <Typography variant="body" weight="bold" as="p">{train?.name ?? ''}</Typography>

                {parsedSeats && parsedSeats.numbers.length > 0 ? (
                  <>
                    <Typography variant="body-sm" as="p">
                      <span className="text-onSurface-muted mr-2">{seatClass?.label}</span>
                      {parsedSeats.car && `${parsedSeats.car} `}
                      {parsedSeats.numbers.join(', ')}
                    </Typography>
                    <div>
                      <Button variant="tertiary" size="small" onClick={handleChangeSeats}>
                        座席を変更
                      </Button>
                    </div>
                  </>
                ) : isFreeSeat ? (
                  <Typography variant="body-sm" as="p">
                    <span className="text-onSurface-muted mr-2">{seatClass?.label}</span>
                    <span className="text-onSurface-muted">座席指定なし</span>
                  </Typography>
                ) : null}
              </div>
            </div>

            {/* 到着駅 */}
            <div className="flex gap-3 items-center">
              <Typography variant="body-sm" color="muted" className="w-12 shrink-0 text-right">
                {train?.arrival ?? ''}
              </Typography>
              <div className="flex flex-col items-center shrink-0">
                <Badge variant="neutral" appearance="solid" size="small">着</Badge>
              </div>
              <Typography variant="h5" weight="bold" as="p" className="flex-1">{to}</Typography>
            </div>
          </div>
        </Card>

        {/* 合計金額 */}
        <Card className="mt-4" padding="md">
          <div className="flex justify-between items-baseline">
            <Typography variant="label" as="h3" color="muted">合計金額</Typography>
            <Typography variant="h3" weight="bold" as="span">¥{total.toLocaleString()}</Typography>
          </div>
        </Card>

        {/* お支払い方法 */}
        <Card className="mt-4" padding="md">
          <Typography variant="label" as="h3" color="muted" className="mb-4">お支払い方法</Typography>
          <div className="space-y-3">
            <Radio
              name="card"
              value="saved"
              size="medium"
              checked={cardOption === 'saved'}
              onChange={() => setCardOption('saved')}
              label="前回利用したカード"
            />
            {cardOption === 'saved' && (
              <div className="pl-8">
                <Typography variant="body-sm">Visa **** 1234　有効期限 12/28</Typography>
              </div>
            )}
            <Radio
              name="card"
              value="new"
              size="medium"
              checked={cardOption === 'new'}
              onChange={() => setCardOption('new')}
              label="新しいカードを登録"
            />
            {cardOption === 'new' && (
              <div className="pl-8 space-y-3">
                <Input label="カード番号" placeholder="0000 0000 0000 0000" fullWidth />
                <div className="flex gap-3">
                  <Input label="有効期限" placeholder="MM/YY" fullWidth />
                  <Input label="セキュリティコード" placeholder="000" fullWidth />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* 同意 + アクションボタン */}
        <div className="mt-6 space-y-4">
          <Checkbox
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            label="利用規約に同意する"
          />

          <div className="flex flex-col gap-2">
            <Button onClick={handleConfirm} disabled={!agreed} fullWidth>
              予約を確定する
            </Button>
            <div className="flex gap-2">
              <Button variant="tertiary" onClick={() => navigate(-1)} fullWidth>
                戻る
              </Button>
              <Button variant="tertiary" onClick={() => navigate('/')} fullWidth>
                予約をキャンセル
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
