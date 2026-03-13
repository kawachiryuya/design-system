import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@ds/primitives/Input/Input';
import { Button } from '@ds/primitives/Button/Button';
import { Typography } from '@ds/primitives/Typography/Typography';
import { destinations } from '../data/destinations';

interface RouteSearchFormProps {
  overlay?: boolean;
  defaultFrom?: string;
  defaultTo?: string;
}

/** 候補リストに使うキーワード（行き先名 + エリア） */
const suggestions = [
  '現在地',
  ...destinations.flatMap((d) => [d.name, d.area]),
].filter((v, i, arr) => arr.indexOf(v) === i); // dedupe

export const RouteSearchForm = ({ overlay, defaultFrom = '現在地', defaultTo = '' }: RouteSearchFormProps) => {
  const navigate = useNavigate();
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [focusedField, setFocusedField] = useState<'from' | 'to' | null>(null);
  const blurTimeout = useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    navigate(`/search?${params.toString()}`);
  };

  const getFiltered = (query: string) => {
    if (!query) return suggestions;
    return suggestions.filter((s) => s.includes(query));
  };

  const handleBlur = () => {
    blurTimeout.current = setTimeout(() => setFocusedField(null), 150);
  };

  const handleFocus = (field: 'from' | 'to') => {
    clearTimeout(blurTimeout.current);
    setFocusedField(field);
  };

  const selectSuggestion = (value: string, field: 'from' | 'to') => {
    if (field === 'from') setFrom(value);
    else setTo(value);
    setFocusedField(null);
  };

  const currentQuery = focusedField === 'from' ? from : to;
  const filtered = focusedField ? getFiltered(currentQuery) : [];

  return (
    <div
      className="rounded-lg p-4 shadow-md relative"
      style={{
        background: overlay ? 'rgba(255,255,255,0.95)' : 'var(--color-surface-default)',
        backdropFilter: overlay ? 'blur(8px)' : undefined,
      }}
    >
      <div className="text-[10px] text-onSurface-subtle font-semibold tracking-widest uppercase mb-2">
        経路検索
      </div>
      <div className="flex flex-col gap-2">
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-[2.5px] border-onSurface-primary flex items-center justify-center flex-shrink-0">
              <div className="w-[6px] h-[6px] rounded-full bg-surface-primary" />
            </div>
            <Input
              placeholder="出発地を入力"
              size="small"
              fullWidth
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              onFocus={() => handleFocus('from')}
              onBlur={handleBlur}
            />
          </div>
          {focusedField === 'from' && filtered.length > 0 && (
            <SuggestionList
              items={filtered}
              onSelect={(v) => selectSuggestion(v, 'from')}
            />
          )}
        </div>
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <div
                className="w-0 h-0"
                style={{
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '8px solid var(--gm-accent)',
                }}
              />
            </div>
            <Input
              placeholder="目的地を入力"
              size="small"
              fullWidth
              value={to}
              onChange={(e) => setTo(e.target.value)}
              onFocus={() => handleFocus('to')}
              onBlur={handleBlur}
            />
          </div>
          {focusedField === 'to' && filtered.length > 0 && (
            <SuggestionList
              items={filtered}
              onSelect={(v) => selectSuggestion(v, 'to')}
            />
          )}
        </div>
        <Button
          fullWidth
          size="small"
          className="!bg-accent !hover:bg-accent-dark"
          style={{ background: 'linear-gradient(135deg, var(--gm-accent), var(--gm-accent-dark))' }}
          onClick={handleSearch}
        >
          経路を検索
        </Button>
      </div>
    </div>
  );
};

/** サジェストドロップダウン */
const SuggestionList = ({
  items,
  onSelect,
}: {
  items: string[];
  onSelect: (value: string) => void;
}) => (
  <div className="absolute left-6 right-0 top-full z-50 mt-1 bg-surface border border-border-muted rounded-sm shadow-lg max-h-[180px] overflow-y-auto">
    {items.map((item) => (
      <button
        key={item}
        type="button"
        className="w-full text-left px-3 py-2 hover:bg-surface-secondary transition-colors cursor-pointer"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onSelect(item)}
      >
        <Typography variant="body-sm" as="span">
          {item}
        </Typography>
      </button>
    ))}
  </div>
);
