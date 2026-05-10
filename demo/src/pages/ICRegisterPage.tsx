import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@ds/primitives/Button/Button';
import { Input } from '@ds/primitives/Input/Input';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Icon } from '@ds/primitives/Icon';
import { Card } from '@ds/composites/Card/Card';
import { SegmentedControl } from '@ds/composites/SegmentedControl/SegmentedControl';
import { Alert } from '@ds/composites/Alert/Alert';
import { Badge } from '@ds/composites/Badge/Badge';
import { getReservation } from '../data/reservations';

type CardType = 'suica' | 'pasmo' | 'icoca' | 'kitaca';
type Mode = 'register' | 'later';

interface PassengerEntry {
  mode: Mode;
  cardType: CardType;
  cardNumber: string;
}

const IC_CARD_TYPES: { value: CardType; label: string }[] = [
  { value: 'suica', label: 'Suica' },
  { value: 'pasmo', label: 'PASMO' },
  { value: 'icoca', label: 'ICOCA' },
  { value: 'kitaca', label: 'Kitaca' },
];

export const ICRegisterPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const reservation = getReservation(id ?? '');

  const [entries, setEntries] = useState<PassengerEntry[]>(() =>
    reservation?.passengers.map<PassengerEntry>(() => ({
      mode: 'register',
      cardType: 'suica',
      cardNumber: '',
    })) ?? []
  );

  if (!reservation) {
    return (
      <div className="py-10 text-center">
        <Typography variant="h5" color="muted">予約が見つかりません</Typography>
        <Button variant="tertiary" onClick={() => navigate('/reservations')} className="mt-4">
          予約一覧へ
        </Button>
      </div>
    );
  }

  const updateEntry = (idx: number, partial: Partial<PassengerEntry>) => {
    setEntries((prev) => prev.map((e, i) => (i === idx ? { ...e, ...partial } : e)));
  };

  const handleSubmit = () => {
    // demo: 実際の保存はスキップ。query param で toast を予約詳細画面へ渡す
    navigate(`/reservations/${id}?toast=ic-saved`);
  };

  // 各 passenger のラベル（ReservationDetailPage と同じロジック）
  const getLabel = (index: number): string => {
    const passenger = reservation.passengers[index];
    const sameTypeCount = reservation.passengers.filter((p) => p.type === passenger.type).length;
    const sameTypeIdx = reservation.passengers.slice(0, index + 1).filter((p) => p.type === passenger.type).length;
    const base = passenger.type === 'adult' ? 'おとな' : 'こども';
    return sameTypeCount > 1 ? `${base} ${sameTypeIdx}` : base;
  };

  // 既に登録されている passenger のステータス
  const isAlreadyRegistered = (index: number): boolean =>
    Boolean(reservation.passengers[index].icCard);

  return (
    <div className="max-w-md mx-auto py-6">
      {/* breadcrumb-like nav */}
      <Link
        to={`/reservations/${id}`}
        className="inline-flex items-center gap-1 text-sm text-onSurface-muted mb-4 hover:text-onSurface"
      >
        <Icon name="arrow_back" size="sm" color="inherit" />
        予約詳細に戻る
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Icon name="contactless" size="lg" color="primary" />
        <Typography variant="h2" as="h1">ICカードを登録</Typography>
      </div>
      <Typography variant="body" color="muted" className="mb-4">
        当日改札にタッチして通過できます。乗客ごとに登録または「あとで」を選んでください。
      </Typography>

      <Alert variant="info">
        この登録は予約 <strong>{reservation.id}</strong> のみに適用されます。
      </Alert>

      {/* 各乗客カード */}
      <div className="mt-6 space-y-3">
        {reservation.passengers.map((p, idx) => {
          const entry = entries[idx];
          const label = getLabel(idx);
          const alreadyRegistered = isAlreadyRegistered(idx);

          return (
            <Card key={idx} variant="outlined" padding="md">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Typography variant="label" as="span">{label}</Typography>
                  {idx === 0 && (
                    <Typography variant="caption" color="muted" as="span" className="ml-2">
                      （予約者）
                    </Typography>
                  )}
                </div>
                {alreadyRegistered && (
                  <Badge variant="success" appearance="soft" size="small">登録済</Badge>
                )}
              </div>

              {alreadyRegistered ? (
                <Typography variant="body-sm" color="muted">
                  {p.icCard}（変更は予約詳細から行えます）
                </Typography>
              ) : (
                <>
                  {/* モード切替: 登録する / あとで */}
                  <SegmentedControl<Mode>
                    items={[
                      { value: 'register', label: '登録する' },
                      { value: 'later', label: 'あとで' },
                    ]}
                    value={entry.mode}
                    onChange={(v) => updateEntry(idx, { mode: v })}
                    aria-label={`${label} のIC カード設定`}
                  />

                  {entry.mode === 'register' && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <Typography variant="label" className="mb-1 block">カードの種類</Typography>
                        <SegmentedControl<CardType>
                          items={IC_CARD_TYPES}
                          value={entry.cardType}
                          onChange={(v) => updateEntry(idx, { cardType: v })}
                          aria-label="IC カードの種類"
                        />
                      </div>
                      <Input
                        label="カード番号"
                        placeholder="JE 0000 0000 0000 0000"
                        value={entry.cardNumber}
                        onChange={(e) => updateEntry(idx, { cardNumber: e.target.value })}
                        fullWidth
                        helpText="カード裏面の番号を入力"
                      />
                    </div>
                  )}

                  {entry.mode === 'later' && (
                    <Typography variant="body-sm" color="subtle" className="mt-3">
                      この乗客は予約詳細から後ほど登録できます
                    </Typography>
                  )}
                </>
              )}
            </Card>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-6 flex flex-col gap-2">
        <Button variant="primary" onClick={handleSubmit} fullWidth>
          設定を完了する
        </Button>
        <Button variant="tertiary" onClick={() => navigate(`/reservations/${id}`)} fullWidth>
          設定しない
        </Button>
      </div>

      <Typography variant="caption" color="subtle" className="block text-center mt-6">
        登録は予約ごとに必要です。アカウントには紐づきません。
      </Typography>
    </div>
  );
};
