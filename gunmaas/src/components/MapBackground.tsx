/**
 * インタラクティブなSVG地図背景
 * 鉄道路線・バス路線・デマンドゾーン・行き先ピンを表示
 */

import { destinations, type CategoryId } from '../data/destinations';
import { railLines, busRoutes, demandZones, type DemandZone } from '../data/railLines';

interface MapBackgroundProps {
  activeCat?: CategoryId;
  selectedPlaceId?: string | null;
  layers?: { network: boolean; demand: boolean };
  onPinClick?: (id: string) => void;
  onZoneClick?: (zone: DemandZone) => void;
}

export const MapBackground = ({
  activeCat = 'all',
  selectedPlaceId = null,
  layers = { network: true, demand: true },
  onPinClick,
  onZoneClick,
}: MapBackgroundProps) => {
  const filteredPlaces =
    activeCat === 'all' ? destinations : destinations.filter((p) => p.cat === activeCat);

  return (
    <svg
      viewBox="0 0 400 360"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full"
      style={{ background: '#E8F0E8' }}
    >
      {/* 地形グラデーション */}
      <defs>
        <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8D8C0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#E8F0E8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="130" fill="url(#mg)" />

      {/* 川 */}
      <path
        d="M180 320Q200 280 240 260Q280 240 330 250Q360 258 400 270"
        fill="none"
        stroke="#B8D4E3"
        strokeWidth="3"
        opacity="0.5"
      />

      {/* デマンドゾーン */}
      {layers.demand &&
        demandZones.map((z) => (
          <g
            key={z.id}
            onClick={() => onZoneClick?.(z)}
            className="cursor-pointer"
          >
            <ellipse
              cx={z.cx}
              cy={z.cy}
              rx={z.rx}
              ry={z.ry}
              fill={z.color}
              stroke={z.border}
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            <text
              x={z.cx}
              y={z.cy + 1}
              textAnchor="middle"
              fontSize="7"
              fill="#E07A5F"
              fontWeight="600"
              opacity="0.7"
            >
              {z.name}
            </text>
          </g>
        ))}

      {/* 鉄道路線 */}
      {layers.network &&
        railLines.map((l, i) => (
          <polyline
            key={i}
            points={l.points.map((p) => p.join(',')).join(' ')}
            fill="none"
            stroke={l.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={l.dash ? '6,4' : 'none'}
            opacity="0.6"
          />
        ))}

      {/* バス路線 */}
      {layers.network &&
        busRoutes.map((l, i) => (
          <polyline
            key={`b${i}`}
            points={l.points.map((p) => p.join(',')).join(' ')}
            fill="none"
            stroke={l.color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="3,3"
            opacity="0.45"
          />
        ))}

      {/* 行き先ピン */}
      {filteredPlaces.map((p) => {
        const sel = selectedPlaceId === p.id;
        return (
          <g
            key={p.id}
            onClick={() => onPinClick?.(p.id)}
            className="cursor-pointer"
          >
            {sel && <circle cx={p.x} cy={p.y} r="20" fill="#2D6A4F" opacity="0.12" />}
            <circle
              cx={p.x}
              cy={p.y}
              r={sel ? 16 : 13}
              fill="white"
              stroke={sel ? '#2D6A4F' : '#94A3B8'}
              strokeWidth={sel ? 2.5 : 1.5}
            />
            <text
              x={p.x}
              y={p.y + (sel ? 5 : 4)}
              textAnchor="middle"
              fontSize={sel ? 13 : 11}
            >
              {p.emoji}
            </text>
          </g>
        );
      })}

      {/* ピンラベル（観光・駅のみ） */}
      {filteredPlaces
        .filter((p) => ['駅・バス停', '観光'].includes(p.cat))
        .map((p) => (
          <text
            key={`l${p.id}`}
            x={p.x}
            y={p.y + 24}
            textAnchor="middle"
            fontSize="8"
            fill="#1C2833"
            fontWeight="600"
            opacity="0.6"
          >
            {p.name}
          </text>
        ))}

      {/* 県名ウォーターマーク */}
      <text x="75" y="315" fontSize="30" fill="#2D6A4F" opacity="0.05" fontWeight="900">
        つなぐパス
      </text>
    </svg>
  );
};
