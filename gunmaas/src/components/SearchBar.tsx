/**
 * ホームタブ用「どこに行く？」検索バー + サジェストパネル
 */
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@ds/primitives/Typography/Typography';
import { destinations } from '../data/destinations';

interface SearchBarProps {
  onClose?: () => void;
}

const searchHistory = [
  { emoji: '🕐', name: '緑川温泉', sub: '観光 · 緑川・青葉' },
  { emoji: '🕐', name: '中央駅', sub: '駅・バス停' },
  { emoji: '🕐', name: '石段温泉', sub: '観光 · 北川' },
];

export const SearchBar = ({ onClose }: SearchBarProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.length > 0
    ? destinations.filter((p) => p.name.includes(query))
    : [];

  const close = () => {
    setFocused(false);
    setQuery('');
    inputRef.current?.blur();
    onClose?.();
  };

  const navigateToSearch = (dest?: string) => {
    close();
    navigate(dest ? `/search?to=${dest}` : '/search');
  };

  return (
    <div className="pointer-events-auto">
      {/* Search input */}
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{
          background: focused ? 'white' : 'rgba(255,255,255,0.95)',
          borderRadius: focused ? '14px 14px 0 0' : 14,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        {focused ? (
          <button onClick={close} className="bg-transparent border-none text-base text-onSurface-subtle cursor-pointer p-0 flex-shrink-0">
            ←
          </button>
        ) : (
          <span className="text-base text-onSurface-subtle">🔍</span>
        )}
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="どこに行く？"
          className="flex-1 text-[14px] text-onSurface-primary border-none outline-none bg-transparent font-medium"
        />
        {!focused && (
          <button
            onClick={() => navigateToSearch()}
            className="text-white border-none rounded-sm px-4 py-2 text-[12px] font-bold cursor-pointer flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #E07A5F, #C4623F)' }}
          >
            経路を検索
          </button>
        )}
        {focused && query.length > 0 && (
          <button
            onClick={() => setQuery('')}
            className="bg-surface border-none rounded-full w-6 h-6 text-[12px] text-onSurface-subtle cursor-pointer flex items-center justify-center flex-shrink-0"
          >
            ✕
          </button>
        )}
      </div>

      {/* Suggest panel */}
      {focused && (
        <div
          className="bg-surface overflow-y-auto"
          style={{
            borderRadius: '0 0 14px 14px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            maxHeight: 320,
          }}
        >
          {query.length === 0 ? (
            <>
              <div className="px-4 pt-3 pb-1">
                <Typography variant="caption" color="muted" as="div" weight="bold">
                  最近の検索
                </Typography>
              </div>
              {searchHistory.map((h, i) => (
                <div
                  key={i}
                  onClick={() => navigateToSearch(h.name)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer border-t border-border-muted first:border-t-0"
                >
                  <span className="text-base text-onSurface-subtle">{h.emoji}</span>
                  <div className="flex-1">
                    <Typography variant="body-sm" as="div" weight="semibold">{h.name}</Typography>
                    <Typography variant="caption" color="muted" as="div">{h.sub}</Typography>
                  </div>
                  <span className="text-onSurface-disabled text-[14px]">›</span>
                </div>
              ))}
              <div className="px-4 pt-3 pb-1 border-t border-border-muted">
                <Typography variant="caption" color="muted" as="div" weight="bold">
                  人気の行き先
                </Typography>
              </div>
              {destinations.filter((p) => p.ticket).slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigateToSearch(p.name)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer border-t border-border-muted"
                >
                  <span className="text-base">{p.emoji}</span>
                  <div className="flex-1">
                    <Typography variant="body-sm" as="div" weight="semibold">{p.name}</Typography>
                    <Typography variant="caption" color="muted" as="div">{p.cat}</Typography>
                  </div>
                  {p.ticket && (
                    <Typography variant="caption" color="primary" as="div" weight="semibold">
                      🎫 {p.ticket}
                    </Typography>
                  )}
                </div>
              ))}
            </>
          ) : results.length > 0 ? (
            results.map((p) => (
              <div
                key={p.id}
                onClick={() => navigateToSearch(p.name)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer border-t border-border-muted first:border-t-0"
              >
                <span className="text-base">{p.emoji}</span>
                <div className="flex-1">
                  <Typography variant="body-sm" as="div" weight="semibold">{p.name}</Typography>
                  <Typography variant="caption" color="muted" as="div">{p.cat}</Typography>
                </div>
                <span className="text-onSurface-disabled text-[14px]">›</span>
              </div>
            ))
          ) : (
            <div className="text-center py-6 px-4">
              <Typography variant="caption" color="muted" as="div">
                「{query}」に一致する行き先がありません
              </Typography>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {focused && (
        <div
          onClick={close}
          className="fixed inset-0"
          style={{ background: 'rgba(0,0,0,0.2)', zIndex: -1 }}
        />
      )}
    </div>
  );
};
