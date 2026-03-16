/**
 * ルート詳細タイムライン（着色ノード+セグメント情報）
 */
import { Typography } from '@ds/primitives/Typography/Typography';
import type { Route } from '../data/routes';

interface RouteTimelineProps {
  route: Route;
  onPlaceClick?: (id: string) => void;
}

export const RouteTimeline = ({ route, onPlaceClick }: RouteTimelineProps) => {
  const lastSeg = route.segments[route.segments.length - 1];
  const destName = lastSeg?.to || '目的地';
  const destLink = lastSeg?.toPlaceLink;

  return (
    <div className="px-5 py-2 pb-4">
      {/* Origin node */}
      <div className="flex gap-3 items-center mb-1">
        <div className="w-[28px] flex justify-center">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: '#2D6A4F', border: '2px solid white', boxShadow: '0 0 0 2px #2D6A4F' }}
          />
        </div>
        <div className="flex-1">
          <Typography variant="body-sm" as="div" weight="bold">
            {route.segments[0]?.from || '出発地'}
          </Typography>
          <Typography variant="caption" color="muted" as="div">
            {route.dep} 出発
          </Typography>
        </div>
      </div>

      {/* Segments */}
      {route.segments.map((seg, i) => (
        <div key={i}>
          {seg.type === 'walk' ? (
            /* Walk segment */
            <div className="flex gap-3 items-start py-1">
              <div className="w-[28px] flex flex-col items-center">
                <div className="w-[2px] h-6" style={{ background: '#CBD5E1', borderStyle: 'dashed' }} />
              </div>
              <Typography variant="caption" color="muted" as="div">
                徒歩 {seg.dur}{seg.dist ? `（${seg.dist}）` : ''}
              </Typography>
            </div>
          ) : (
            /* Transit segment */
            <div className="mb-0">
              {/* Departure station */}
              <div className="flex gap-3 items-center">
                <div className="w-[28px] flex justify-center">
                  <div
                    className="w-[10px] h-[10px] rounded-full"
                    style={{ background: seg.color, border: '2px solid white', boxShadow: `0 0 0 2px ${seg.color}` }}
                  />
                </div>
                <div className="flex-1">
                  <Typography variant="body-sm" as="div" weight="bold">{seg.from}</Typography>
                  <Typography variant="caption" color="muted" as="div">{seg.depTime} 発</Typography>
                </div>
              </div>

              {/* Line bar + info */}
              <div className="flex gap-3 py-1">
                <div className="w-[28px] flex justify-center">
                  <div className="w-1 rounded-[2px] min-h-[48px]" style={{ background: seg.color }} />
                </div>
                <div className="flex-1">
                  <Typography variant="body-sm" as="div" weight="semibold">{seg.line}</Typography>
                  <Typography variant="caption" color="muted" as="div">
                    {seg.stops && seg.stops > 0 ? `${seg.stops}駅 · ` : ''}{seg.dur}
                  </Typography>
                  {seg.ticketHint && (
                    <div
                      className="inline-flex items-center gap-1 rounded-[6px] px-2 py-0 mt-1"
                      style={{ background: '#F0FAF4' }}
                    >
                      <span className="text-[11px]">🎫</span>
                      <span className="text-[11px] font-semibold" style={{ color: '#2D6A4F' }}>
                        {seg.ticketHint}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Arrival station (intermediate only) */}
              {i < route.segments.length - 1 && (
                <div className="flex gap-3 items-center">
                  <div className="w-[28px] flex justify-center">
                    <div
                      className="w-[10px] h-[10px] rounded-full"
                      style={{ background: seg.color, border: '2px solid white', boxShadow: `0 0 0 2px ${seg.color}` }}
                    />
                  </div>
                  <div className="flex-1">
                    <Typography variant="body-sm" as="div" weight="bold">
                      {seg.to.split('/')[0]}
                    </Typography>
                    <Typography variant="caption" color="muted" as="div">{seg.arrTime} 着</Typography>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Destination node */}
      <div className="flex gap-3 items-center mt-1">
        <div className="w-[28px] flex justify-center">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: '#E07A5F', border: '2px solid white', boxShadow: '0 0 0 2px #E07A5F' }}
          />
        </div>
        <div className="flex-1">
          {destLink ? (
            <div
              onClick={() => onPlaceClick?.(destLink.id)}
              className="cursor-pointer"
              style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: 3 }}
            >
              <Typography variant="body-sm" as="span" weight="bold" color="primary">
                {destName.split('/')[0]} ↗
              </Typography>
              <Typography variant="caption" color="muted" as="span" className="ml-1" style={{ textDecoration: 'none' }}>
                詳細を見る
              </Typography>
            </div>
          ) : (
            <Typography variant="body-sm" as="div" weight="bold">
              {destName.split('/')[0]}
            </Typography>
          )}
          <Typography variant="caption" color="muted" as="div">
            {route.arr} 到着
          </Typography>
        </div>
      </div>
    </div>
  );
};
