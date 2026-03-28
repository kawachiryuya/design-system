/**
 * インタラクティブなSVG地図背景
 * 鉄道路線・バス路線・デマンドゾーン・行き先ピン・県境を表示
 */

import { destinations, type CategoryId } from '../data/destinations';
import { railLines, busRoutes, demandZones, prefBorder, neighborLabels, type DemandZone } from '../data/railLines';

interface MapBackgroundProps {
  activeCat?: CategoryId;
  selectedPlaceId?: string | null;
  layers?: { network: boolean; demand: boolean };
  onPinClick?: (id: string) => void;
  onZoneClick?: (zone: DemandZone) => void;
}

/** Category color map */
const catColors: Record<string, { fill: string; stroke: string; selStroke: string }> = {
  '観光': { fill: '#E8F5E9', stroke: '#2D6A4F', selStroke: '#1B5E20' },
  '駅・バス停': { fill: '#E3F2FD', stroke: '#1565C0', selStroke: '#0D47A1' },
  '施設': { fill: '#FFF3E0', stroke: '#E65100', selStroke: '#BF360C' },
};

const defaultCatColor = { fill: '#F5F5F5', stroke: '#616161', selStroke: '#424242' };

/** Convert prefBorder points to a closed polygon path covering top of SVG */
const borderPathD = (() => {
  const pts = prefBorder.map(([x, y]) => `${x},${y}`).join(' L');
  return `M0,0 L400,0 L400,${prefBorder[prefBorder.length - 1][1]} L${pts} L0,${prefBorder[0][1]} Z`;
})();

/** Convert prefBorder to a polyline string */
const borderPolyline = prefBorder.map(([x, y]) => `${x},${y}`).join(' ');

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
      <defs>
        {/* 地形グラデーション — 北側山岳 */}
        <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A8C8A0" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#C8D8C0" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#E8F0E8" stopOpacity="0" />
        </linearGradient>

        {/* 南部平野グラデーション */}
        <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8F0E8" stopOpacity="0" />
          <stop offset="100%" stopColor="#D4E4D0" stopOpacity="0.3" />
        </linearGradient>

        {/* 等高線パターン */}
        <pattern id="contour" patternUnits="userSpaceOnUse" width="40" height="20">
          <path d="M0 15 Q10 10 20 15 Q30 20 40 15" fill="none" stroke="#9AB89A" strokeWidth="0.5" opacity="0.3" />
        </pattern>

        {/* 田園パターン（南部平野） */}
        <pattern id="fields" patternUnits="userSpaceOnUse" width="20" height="20">
          <rect width="20" height="20" fill="none" />
          <line x1="0" y1="0" x2="20" y2="0" stroke="#B8CCB0" strokeWidth="0.3" opacity="0.25" />
          <line x1="0" y1="0" x2="0" y2="20" stroke="#B8CCB0" strokeWidth="0.3" opacity="0.25" />
        </pattern>

        {/* 県外エリアクリップ */}
        <clipPath id="outOfPrefClip">
          <path d={borderPathD} />
        </clipPath>
      </defs>

      {/* ── 地形レイヤー ── */}
      {/* 北部山岳グラデーション（上端から） */}
      <rect x="0" y="0" width="400" height="200" fill="url(#mg)" />

      {/* 等高線テクスチャ（上端から県境付近まで） */}
      <rect x="0" y="0" width="400" height="180" fill="url(#contour)" opacity="0.5" />

      {/* 南部平野 */}
      <rect x="0" y="220" width="400" height="140" fill="url(#pg)" />
      <rect x="0" y="240" width="400" height="120" fill="url(#fields)" />

      {/* 山岳の陰影（県境の上下に広がる） */}
      <ellipse cx="60" cy="50" rx="50" ry="30" fill="#90B888" opacity="0.12" />
      <ellipse cx="180" cy="40" rx="60" ry="25" fill="#90B888" opacity="0.1" />
      <ellipse cx="320" cy="55" rx="55" ry="28" fill="#90B888" opacity="0.1" />
      <ellipse cx="100" cy="120" rx="60" ry="35" fill="#90B888" opacity="0.15" />
      <ellipse cx="180" cy="135" rx="45" ry="28" fill="#90B888" opacity="0.1" />
      <ellipse cx="300" cy="140" rx="55" ry="30" fill="#90B888" opacity="0.1" />

      {/* ── 河川レイヤー ── */}
      {/* 利根川（メイン） */}
      <path
        d="M215 100 Q210 130 205 160 Q200 190 210 220 Q225 248 245 262 Q275 280 320 300 Q360 310 400 315"
        fill="none"
        stroke="#8BB8D0"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      {/* 利根川ハイライト */}
      <path
        d="M215 100 Q210 130 205 160 Q200 190 210 220 Q225 248 245 262 Q275 280 320 300 Q360 310 400 315"
        fill="none"
        stroke="#A8D0E8"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
      />
      {/* 支流1: 吾妻川 */}
      <path
        d="M100 125 Q130 140 160 155 Q180 165 205 175"
        fill="none"
        stroke="#8BB8D0"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
      {/* 支流2: 渡良瀬川 */}
      <path
        d="M350 170 Q330 200 310 220 Q290 235 270 248"
        fill="none"
        stroke="#8BB8D0"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
      {/* 支流3: 烏川 */}
      <path
        d="M60 260 Q100 268 140 274 Q170 278 200 272"
        fill="none"
        stroke="#8BB8D0"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.25"
      />

      {/* ── 県境レイヤー ── */}
      {/* 県外エリア グレーアウト */}
      <path d={borderPathD} fill="rgba(200,200,200,0.3)" />

      {/* 県境線 */}
      <polyline
        points={borderPolyline}
        fill="none"
        stroke="#94A3B8"
        strokeWidth="2"
        strokeDasharray="6,4"
        opacity="0.7"
      />

      {/* 隣接県ラベル */}
      {neighborLabels.map((n) => (
        <text
          key={n.name}
          x={n.x}
          y={n.y}
          textAnchor="middle"
          fontSize="8"
          fill="#64748B"
          fontWeight="600"
          opacity="0.6"
          letterSpacing="0.5"
        >
          {n.name}
        </text>
      ))}

      {/* ── デマンドゾーン ── */}
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

      {/* ── 鉄道路線 ── */}
      {layers.network &&
        railLines.map((l, i) => (
          <g key={i}>
            {/* 路線ライン */}
            <polyline
              points={l.points.map((p) => p.join(',')).join(' ')}
              fill="none"
              stroke={l.color}
              strokeWidth={l.dash ? 2 : 3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={l.dash ? '6,4' : 'none'}
              opacity="0.6"
            />
            {/* 主要駅ドット */}
            {l.points.map(([px, py], j) => (
              <circle
                key={j}
                cx={px}
                cy={py}
                r="2.5"
                fill="white"
                stroke={l.color}
                strokeWidth="1"
                opacity="0.7"
              />
            ))}
          </g>
        ))}

      {/* 路線ラベル */}
      {layers.network && (
        <>
          <text x="222" y="150" fontSize="6" fill="#16A34A" fontWeight="600" opacity="0.5" transform="rotate(-82, 222, 150)">JR東西線</text>
          <text x="155" y="142" fontSize="6" fill="#F59E0B" fontWeight="600" opacity="0.5" transform="rotate(-25, 155, 142)">JR青葉線</text>
          <text x="265" y="254" fontSize="6" fill="#F59E0B" fontWeight="600" opacity="0.5" transform="rotate(-5, 265, 254)">JR両毛線</text>
          <text x="290" y="230" fontSize="6" fill="#DC2626" fontWeight="600" opacity="0.5" transform="rotate(-5, 290, 230)">中央電鉄</text>
          <text x="348" y="198" fontSize="6" fill="#7C3AED" fontWeight="600" opacity="0.5" transform="rotate(-55, 348, 198)">わたらせ</text>
          <text x="130" y="282" fontSize="6" fill="#0891B2" fontWeight="600" opacity="0.5" transform="rotate(10, 130, 282)">南部鉄道</text>
        </>
      )}

      {/* ── バス路線 ── */}
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

      {/* ── 行き先ピン ── */}
      {filteredPlaces.map((p) => {
        const sel = selectedPlaceId === p.id;
        const isOut = p.outOfPref === true;
        const cc = catColors[p.cat] ?? defaultCatColor;
        const r = sel ? 16 : isOut ? 11 : 14;
        return (
          <g
            key={p.id}
            onClick={() => onPinClick?.(p.id)}
            className="cursor-pointer"
          >
            {/* 選択時リング */}
            {sel && <circle cx={p.x} cy={p.y} r="22" fill={isOut ? '#64748B' : cc.selStroke} opacity="0.12" />}
            {/* ドロップシャドウ */}
            {!isOut && (
              <circle cx={p.x} cy={p.y + 1.5} r={r} fill="black" opacity="0.08" />
            )}
            {/* ピン本体 */}
            <circle
              cx={p.x}
              cy={p.y}
              r={r}
              fill={isOut ? '#E2E8F0' : cc.fill}
              stroke={sel ? cc.selStroke : isOut ? '#94A3B8' : cc.stroke}
              strokeWidth={sel ? 2.5 : isOut ? 1 : 2}
              opacity={isOut ? 0.7 : 1}
            />
            {/* emoji */}
            <text
              x={p.x}
              y={p.y + (sel ? 5 : isOut ? 3.5 : 4.5)}
              textAnchor="middle"
              fontSize={sel ? 14 : isOut ? 9 : 12}
              opacity={isOut ? 0.5 : 1}
              style={isOut ? { filter: 'grayscale(1)' } : undefined}
            >
              {p.emoji}
            </text>
            {/* 県外ロックバッジ */}
            {isOut && !sel && (
              <text
                x={p.x + 8}
                y={p.y - 6}
                fontSize="7"
                opacity="0.6"
              >
                🔒
              </text>
            )}
          </g>
        );
      })}

      {/* ── ピンラベル ── */}
      {filteredPlaces
        .filter((p) => ['駅・バス停', '観光'].includes(p.cat))
        .map((p) => {
          const isOut = p.outOfPref === true;
          const cc = catColors[p.cat] ?? defaultCatColor;
          const labelY = p.y + (isOut ? 20 : 26);
          const textLen = p.name.length * (isOut ? 6.5 : 7.5);
          return (
            <g key={`l${p.id}`}>
              {/* ラベル背景ピル */}
              {!isOut && (
                <rect
                  x={p.x - textLen / 2 - 3}
                  y={labelY - 8}
                  width={textLen + 6}
                  height={12}
                  rx="6"
                  fill="white"
                  opacity="0.75"
                />
              )}
              <text
                x={p.x}
                y={labelY}
                textAnchor="middle"
                fontSize={isOut ? 7 : 7.5}
                fill={isOut ? '#94A3B8' : cc.stroke}
                fontWeight="700"
                opacity={isOut ? 0.5 : 0.85}
              >
                {p.name}
              </text>
            </g>
          );
        })}

      {/* ── 県南部の境界（埼玉方面）── */}
      <line x1="0" y1="330" x2="400" y2="340" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.4" />
      <text x="200" y="352" textAnchor="middle" fontSize="8" fill="#64748B" fontWeight="600" opacity="0.4">
        埼玉県 MaaS
      </text>

      {/* 東部境界（栃木方面） */}
      <line x1="370" y1="98" x2="385" y2="340" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.4" />
      <text x="392" y="220" textAnchor="middle" fontSize="7" fill="#64748B" fontWeight="600" opacity="0.4" transform="rotate(90, 392, 220)">
        栃木県 MaaS
      </text>

      {/* ── GunMaaS ロゴ（地図アトリビューション風） ── */}
      <g opacity="0.5">
        <rect x="4" y="340" width="68" height="16" rx="3" fill="white" opacity="0.7" />
        <text x="8" y="352" fontSize="9" fill="#2D6A4F" fontWeight="800" letterSpacing="0.5">
          GunMaaS
        </text>
      </g>
    </svg>
  );
};
