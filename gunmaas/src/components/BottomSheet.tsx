/**
 * ドラッグ可能なボトムシート（3段スナップ）
 * ホームタブ・検索タブで共用
 */
import { useRef, type ReactNode } from 'react';

interface BottomSheetProps {
  height: number;
  onHeightChange: (h: number) => void;
  snapPoints?: [number, number, number]; // [min, mid, max]
  children: ReactNode;
}

export const BottomSheet = ({
  height,
  onHeightChange,
  snapPoints = [52, 320, 520],
  children,
}: BottomSheetProps) => {
  const [SMIN, SMID, SMAX] = snapPoints;
  const dragStart = useRef<number | null>(null);
  const dragH = useRef<number>(height);

  const snapToNearest = (h: number) => {
    const snaps = [...snapPoints];
    snaps.sort((a, b) => Math.abs(h - a) - Math.abs(h - b));
    onHeightChange(snaps[0]);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    dragStart.current = e.touches[0].clientY;
    dragH.current = height;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (dragStart.current === null) return;
    const next = Math.max(SMIN, Math.min(SMAX, dragH.current + (dragStart.current - e.touches[0].clientY)));
    onHeightChange(next);
  };
  const onTouchEnd = () => {
    if (dragStart.current === null) return;
    dragStart.current = null;
    snapToNearest(height);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    dragStart.current = e.clientY;
    dragH.current = height;
    const onMM = (ev: MouseEvent) => {
      const next = Math.max(SMIN, Math.min(SMAX, dragH.current + (dragStart.current! - ev.clientY)));
      onHeightChange(next);
    };
    const onMU = () => {
      dragStart.current = null;
      snapToNearest(height);
      window.removeEventListener('mousemove', onMM);
      window.removeEventListener('mouseup', onMU);
    };
    window.addEventListener('mousemove', onMM);
    window.addEventListener('mouseup', onMU);
  };

  const handleTap = () => {
    if (height <= SMIN + 10) onHeightChange(SMID);
    else if (height >= SMAX - 10) onHeightChange(SMIN);
  };

  return (
    <div
      className="absolute bottom-0 left-0 right-0 bg-surface flex flex-col overflow-hidden"
      style={{
        height,
        maxHeight: SMAX,
        borderRadius: '20px 20px 0 0',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
        transition: dragStart.current ? 'none' : 'height 0.35s cubic-bezier(0.32,0.72,0,1)',
        zIndex: 25,
      }}
    >
      {/* Handle bar */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onClick={handleTap}
        className="flex justify-center pt-[10px] pb-3 cursor-grab flex-shrink-0"
      >
        <div className="w-[36px] h-[5px] rounded-full bg-neutral-300" />
      </div>
      {children}
    </div>
  );
};
