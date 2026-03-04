import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Card } from '@ds/composites/Card/Card';
import { generateSeatMap, carNumbersForClass, seatClasses } from '../data/trains';

export const SeatMapPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const from = params.get('from') ?? '東京';
  const to = params.get('to') ?? '新大阪';
  const date = params.get('date') ?? '';
  const trainId = params.get('trainId') ?? '';
  const classId = params.get('class') ?? 'reserved';
  const price = Number(params.get('price') ?? 0);

  const seatClass = seatClasses.find((c) => c.id === classId);
  const availableCars = carNumbersForClass(classId);
  const [selectedCar, setSelectedCar] = useState(availableCars[0]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const seatMap = useMemo(() => generateSeatMap(classId, selectedCar), [classId, selectedCar]);
  const cols = classId === 'reserved' ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C', 'D'];
  const aisleAfter = 'B';
  const rows = [...new Set(seatMap.map((s) => s.row))].sort((a, b) => a - b);

  const handleCarChange = (car: number) => {
    setSelectedCar(car);
    setSelectedSeat(null);
  };

  const handleNext = () => {
    const seatLabel = selectedSeat ? `${selectedCar}号車 ${selectedSeat}` : '';
    navigate(`/confirm?trainId=${trainId}&from=${from}&to=${to}&date=${date}&class=${classId}&total=${price}&seat=${encodeURIComponent(seatLabel)}`);
  };

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
      {/* 左: シートマップ */}
      <div className="col-span-12 lg:col-span-8">
        {/* 列車 + 席種サマリー */}
        <Card padding="md" className="mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Icon name="train" size="sm" color="primary" />
            <span className="font-semibold text-onSurface">{from} → {to}</span>
            <Typography variant="body-sm" color="muted" as="span">{date}</Typography>
            <Typography variant="body-sm" color="muted" as="span">/ {seatClass?.label}</Typography>
          </div>
        </Card>

        <Typography variant="h5" as="h2" className="mb-4">座席を選択</Typography>

        {/* 号車切り替え */}
        <div className="flex gap-1 mb-4 overflow-x-auto">
          {availableCars.map((car) => (
            <button
              key={car}
              type="button"
              onClick={() => handleCarChange(car)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                car === selectedCar
                  ? 'bg-surface-primary text-onSurface-inverse'
                  : 'bg-surface border border-border-muted text-onSurface hover:border-border-strong'
              }`}
            >
              {car}号車
            </button>
          ))}
        </div>

        {/* シートマップ */}
        <Card padding="md">
          {/* 凡例 */}
          <div className="flex items-center gap-4 mb-4 text-xs text-onSurface-muted">
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
          <div className="flex items-center justify-center gap-1 mb-2">
            {cols.map((c) => (
              <div key={c} className="flex items-center">
                <div className="w-8 text-center text-xs font-semibold text-onSurface-muted">{c}</div>
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
                  const isSelected = selectedSeat === seat.id;
                  const isOccupied = seat.status === 'occupied';

                  return (
                    <div key={seat.id} className="flex items-center">
                      <button
                        type="button"
                        disabled={isOccupied}
                        onClick={() => setSelectedSeat(isSelected ? null : seat.id)}
                        className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                          isOccupied
                            ? 'bg-surface-inset text-onSurface-disabled cursor-not-allowed'
                            : isSelected
                              ? 'bg-surface-primary text-onSurface-inverse'
                              : 'bg-surface border border-border-default text-onSurface hover:border-border-strong'
                        }`}
                        aria-label={`座席 ${seat.id}${isOccupied ? ' 予約済み' : ''}`}
                      >
                        {row}
                      </button>
                      {col === aisleAfter && <div className="w-6" />}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {selectedSeat && (
            <Typography variant="body-sm" className="mt-4">
              選択中: <span className="font-semibold">{selectedCar}号車 {selectedSeat}</span>
            </Typography>
          )}
        </Card>
      </div>

      {/* 右: 料金サマリー */}
      <div className="col-span-12 lg:col-span-4">
        <Card variant="filled" padding="md" className="sticky top-6">
          <Typography variant="label" as="h3" color="muted" className="mb-3">予約内容</Typography>
          <dl className="text-sm space-y-2 mb-4">
            <div className="flex justify-between">
              <dt className="text-onSurface-muted">座席クラス</dt>
              <dd className="font-medium text-onSurface">{seatClass?.label}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-onSurface-muted">号車</dt>
              <dd className="font-medium text-onSurface">{selectedCar}号車</dd>
            </div>
            {selectedSeat && (
              <div className="flex justify-between">
                <dt className="text-onSurface-muted">座席</dt>
                <dd className="font-medium text-onSurface">{selectedSeat}</dd>
              </div>
            )}
          </dl>
          <div className="border-t border-border-muted pt-4 mb-4">
            <Typography variant="body-sm" color="muted">合計金額</Typography>
            <p className="text-2xl font-bold text-onSurface">¥{price.toLocaleString()}</p>
          </div>
          <Button fullWidth onClick={handleNext} disabled={!selectedSeat}>
            予約内容の確認へ
          </Button>
        </Card>
      </div>
    </div>
  );
};
