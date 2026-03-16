/**
 * カテゴリフィルタチップ（すべて/観光/駅・バス停/施設）
 */
import { categories, type CategoryId } from '../data/destinations';

interface CategoryChipsProps {
  active: CategoryId;
  onChange: (id: CategoryId) => void;
}

export const CategoryChips = ({ active, onChange }: CategoryChipsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pointer-events-auto px-4 pt-3">
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className="flex items-center gap-1 px-3 py-2 rounded-full border-none text-[12px] font-semibold cursor-pointer flex-shrink-0 whitespace-nowrap"
          style={{
            background: active === c.id ? '#2D6A4F' : 'rgba(255,255,255,0.92)',
            color: active === c.id ? 'white' : '#1C2833',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <span className="text-[13px]">{c.emoji}</span> {c.label}
        </button>
      ))}
    </div>
  );
};
