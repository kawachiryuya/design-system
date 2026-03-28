import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Card } from '@ds/composites/Card/Card';
import { SegmentedControl } from '@ds/composites/SegmentedControl/SegmentedControl';
import { ToggleButton } from '@ds/composites/ToggleButton/ToggleButton';
import { generateSeatMap, carNumbersForClass, seatClasses, searchTrains } from '../data/trains';
import { formatDate } from '../utils/format';

export const SeatMapPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const from = params.get('from') ?? '東京';
  const to = params.get('to') ?? '新大阪';
  const date = params.get('date') ?? '';
  const trainId = params.get('trainId') ?? '';
  const classId = params.get('class') ?? 'reserved';
  const price = Number(params.get('price') ?? 0);
  const adults = Number(params.get('adults') ?? 1);
  const children = Number(params.get('children') ?? 0);
  const totalPassengers = adults + children;

  const train = searchTrains(from, to).find((t) => t.id === trainId);
  const seatClass = seatClasses.find((c) => c.id === classId);
  const availableCars = carNumbersForClass(classId);
  const [selectedCar, setSelectedCar] = useState(availableCars[0]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const seatMap = useMemo(() => generateSeatMap(classId, selectedCar), [classId, selectedCar]);
  const cols = classId === 'reserved' ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C', 'D'];
  const aisleAfter = 'B';
  const rows = [...new Set(seatMap.map((s) => s.row))].sort((a, b) => a - b);

  const handleCarChange = (car: number) => {
    setSelectedCar(car);
    setSelectedSeats([]);
  };

  const handleSeatClick = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : prev.length < totalPassengers
          ? [...prev, seatId]
          : prev,
    );
  };

  const handleNext = () => {
    const seatLabel = selectedSeats.map((s) => `${selectedCar}号車 ${s}`).join(',');
    navigate(`/confirm?trainId=${trainId}&from=${from}&to=${to}&date=${date}&class=${classId}&total=${price}&adults=${adults}&children=${children}&seat=${encodeURIComponent(seatLabel)}`);
  };

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
      {/* 左: シートマップ */}
      <div className="col-span-12 lg:col-span-8">
        {/* 列車 + 席種サマリー */}
        <Card padding="md" className="mb-6 space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Icon name="train" size="sm" color="primary" />
            <span className="font-semibold text-onSurface">{train?.name}（{from} → {to}）</span>
          </div>
          <Typography variant="body-sm" color="muted" className="pl-6">
            {formatDate(date)} {train?.departure}→{train?.arrival} {seatClass?.label}
          </Typography>
        </Card>

        <Typography variant="h5" as="h2" className="mb-4">座席を選択</Typography>

        {/* 号車切り替え */}
        <div className="mb-4">
          <SegmentedControl
            items={availableCars.map((car) => ({ value: car, label: `${car}号車` }))}
            value={selectedCar}
            onChange={handleCarChange}
            aria-label="号車選択"
          />
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
                  const isSelected = selectedSeats.includes(seat.id);
                  const isOccupied = seat.status === 'occupied';

                  return (
                    <div key={seat.id} className="flex items-center">
                      <ToggleButton
                        selected={isSelected}
                        disabled={isOccupied}
                        onClick={() => handleSeatClick(seat.id)}
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

          {selectedSeats.length > 0 && (
            <Typography variant="body-sm" className="mt-4">
              選択中 ({selectedSeats.length}/{totalPassengers}): <span className="font-semibold">{selectedSeats.join(', ')}</span>
            </Typography>
          )}
        </Card>
      </div>

      {/* 右: 座席情報サマリー */}
      <div className="col-span-12 lg:col-span-4">
        <Card variant="filled" padding="md" className="sticky top-6">
          <Typography variant="label" as="h3" color="muted" className="mb-3">選択中の座席</Typography>
          <dl className="text-sm space-y-2 mb-4">
            <div className="flex justify-between">
              <Typography variant="body-sm" color="muted" as="dt">座席クラス</Typography>
              <Typography variant="label" as="dd">{seatClass?.label}</Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="body-sm" color="muted" as="dt">号車</Typography>
              <Typography variant="label" as="dd">{selectedCar}号車</Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="body-sm" color="muted" as="dt">座席</Typography>
              <Typography variant="label" as="dd">
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : '未選択'}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="body-sm" color="muted" as="dt">人数</Typography>
              <Typography variant="label" as="dd">{selectedSeats.length} / {totalPassengers}名</Typography>
            </div>
          </dl>
          <div className="hidden lg:block">
            <Button fullWidth onClick={handleNext} disabled={selectedSeats.length !== totalPassengers}>
              予約内容の確認へ
            </Button>
          </div>
        </Card>
      </div>

      {/* モバイル固定 CTA */}
      <div className="fixed bottom-16 left-0 right-0 lg:hidden z-40 bg-surface border-t border-border-muted shadow-xs"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <Typography variant="caption" color="muted">
              {selectedSeats.length > 0 ? selectedSeats.join(', ') : '座席を選択してください'}
            </Typography>
            <Typography variant="label">{selectedSeats.length} / {totalPassengers}席選択中</Typography>
          </div>
          <Button onClick={handleNext} disabled={selectedSeats.length !== totalPassengers}>
            予約内容の確認へ
          </Button>
        </div>
      </div>
      {/* モバイル固定 CTA 分のスペーサー */}
      <div className="col-span-12 h-16 lg:hidden" />
    </div>
  );
};
