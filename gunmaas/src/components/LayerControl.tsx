/**
 * マップレイヤー切替コントロール（FABボタン + パネル）
 */
import { useState } from 'react';
import { Switch } from '@ds/composites/Switch/Switch';

interface Layers {
  network: boolean;
  demand: boolean;
}

interface LayerControlProps {
  layers: Layers;
  onToggle: (key: keyof Layers) => void;
  bottomOffset: number;
}

export const LayerControl = ({ layers, onToggle, bottomOffset }: LayerControlProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="absolute right-4 pointer-events-auto"
      style={{ bottom: bottomOffset + 12, zIndex: 22 }}
    >
      {open && (
        <div
          className="bg-surface rounded-lg p-3 mb-2"
          style={{
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            minWidth: 170,
            background: 'rgba(255,255,255,0.97)',
          }}
        >
          <div className="text-[11px] font-bold text-onSurface-primary mb-2">マップの表示</div>
          <Switch
            label="鉄道路線"
            checked={layers.network}
            onChange={() => onToggle('network')}
            size="small"
          />
          <div className="h-[1px] bg-border-muted my-2" />
          <Switch
            label="呼べば来るバス"
            checked={layers.demand}
            onChange={() => onToggle('demand')}
            size="small"
          />
        </div>
      )}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-[42px] h-[42px] rounded-sm cursor-pointer flex items-center justify-center ml-auto"
        style={{
          border: `1.5px solid ${open ? '#2D6A4F' : '#E2EDE6'}`,
          background: open ? '#F0FAF4' : 'rgba(255,255,255,0.95)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={open ? '#2D6A4F' : '#94A3B8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      </button>
    </div>
  );
};
