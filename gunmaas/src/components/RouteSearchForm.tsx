/**
 * 経路検索フォーム（出発地/目的地/日時のピンアイコン付き表示）
 * compact=true: 結果画面上部の縮小版
 * compact=false: 入力画面のフル版（検索ボタン付き）
 */

interface RouteSearchFormProps {
  from: string;
  to: string;
  compact?: boolean;
  onSearch?: () => void;
}

export const RouteSearchForm = ({ from, to, compact = false, onSearch }: RouteSearchFormProps) => {
  return (
    <div style={{ background: compact ? 'white' : 'var(--color-bg-default, #F7FAF8)', padding: compact ? '10px 16px' : '20px 16px 16px' }}>
      {!compact && <div className="text-[20px] font-black text-onSurface-primary mb-3">経路検索</div>}
      <div className="bg-surface rounded-lg border border-border-muted overflow-hidden">
        {/* Origin */}
        <div className="flex items-center gap-3 px-3 py-3 border-b border-border-muted">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#2D6A4F" />
            <circle cx="12" cy="9" r="2.5" fill="white" />
          </svg>
          <div className="flex-1 text-[14px] text-onSurface-primary font-medium">{from}</div>
        </div>
        {/* Destination */}
        <div className="flex items-center gap-3 px-3 py-3 border-b border-border-muted">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#E07A5F" />
            <circle cx="12" cy="9" r="2.5" fill="white" />
          </svg>
          <div className="flex-1 text-[14px] text-onSurface-primary font-medium">{to}</div>
        </div>
        {/* DateTime */}
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="w-[22px] h-[22px] flex-shrink-0 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="flex-1 text-[14px] text-onSurface-primary">
            3月15日（日）14:38 <span className="text-[12px] font-semibold" style={{ color: '#2D6A4F' }}>出発</span>
          </div>
        </div>
      </div>
      {!compact && onSearch && (
        <button
          onClick={onSearch}
          className="mt-3 w-full border-none rounded-lg py-3 text-[15px] font-bold cursor-pointer text-white"
          style={{ background: 'linear-gradient(135deg, #E07A5F, #C4623F)' }}
        >
          経路を検索
        </button>
      )}
    </div>
  );
};
