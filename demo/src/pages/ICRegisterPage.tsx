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
import { getReservation, formatICCard, getPassengerLabel } from '../data/reservations';

type Mode = 'register' | 'later';

interface PassengerEntry {
  mode: Mode;
  cardNumber: string;
}

export const ICRegisterPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const reservation = getReservation(id ?? '');

  const [entries, setEntries] = useState<Record<string, PassengerEntry>>(() => {
    const init: Record<string, PassengerEntry> = {};
    reservation?.passengers.forEach((p) => {
      init[p.id] = { mode: 'later', cardNumber: '' };
    });
    return init;
  });

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

  const updateEntry = (passengerId: string, partial: Partial<PassengerEntry>) => {
    setEntries((prev) => ({ ...prev, [passengerId]: { ...prev[passengerId], ...partial } }));
  };

  // 登録対象の人数（register モード × 番号入力済み）
  const registerCount = reservation
    ? reservation.passengers.filter(
        (p) => !p.icCard && entries[p.id]?.mode === 'register' && entries[p.id]?.cardNumber.trim() !== '',
      ).length
    : 0;

  const handleSubmit = () => {
    // demo: 実際の保存はスキップ。toast で予約詳細画面に通知
    navigate(`/reservations/${id}?toast=ic-saved`);
  };

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
          const entry = entries[p.id];
          const label = getPassengerLabel(reservation.passengers, p.id);
          const alreadyRegistered = Boolean(p.icCard);

          return (
            <Card key={p.id} variant="outlined" padding="md">
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

              {alreadyRegistered && p.icCard ? (
                <Typography variant="body-sm" color="muted">
                  {formatICCard(p.icCard)}（変更は予約詳細から行えます）
                </Typography>
              ) : (
                <>
                  {/* モード切替: 登録する / あとで（有効領域を 2 分割） */}
                  <div className="[&>[role=group]]:w-full [&>[role=group]>button]:flex-1">
                    <SegmentedControl<Mode>
                      items={[
                        { value: 'register', label: '登録する' },
                        { value: 'later', label: 'あとで' },
                      ]}
                      value={entry.mode}
                      onChange={(v) => updateEntry(p.id, { mode: v })}
                      aria-label={`${label} のIC カード設定`}
                    />
                  </div>

                  {entry.mode === 'register' && (
                    <div className="mt-4">
                      <Input
                        label="ICカード番号"
                        placeholder="JE 0000 0000 0000 0000"
                        value={entry.cardNumber}
                        onChange={(e) => updateEntry(p.id, { cardNumber: e.target.value })}
                        fullWidth
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

      {/* CTA: 主（登録する）+ 副（設定しない） */}
      <div className="mt-6 flex flex-col gap-2">
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={registerCount === 0}
          fullWidth
        >
          {registerCount > 0
            ? `${registerCount}名のICカードを登録する`
            : 'ICカードを登録する'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate(`/reservations/${id}`)}
          fullWidth
        >
          設定しない
        </Button>
      </div>
    </div>
  );
};
