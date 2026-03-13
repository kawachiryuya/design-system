import { useNavigate } from 'react-router-dom';
import { Card } from '@ds/composites/Card/Card';
import { Typography } from '@ds/primitives/Typography/Typography';
import type { Destination } from '../data/destinations';

interface DestinationCardProps {
  destination: Destination;
  /** リスト表示（SegmentPage用の横長カード） */
  variant?: 'compact' | 'list';
}

export const DestinationCard = ({ destination: d, variant = 'compact' }: DestinationCardProps) => {
  const navigate = useNavigate();

  if (variant === 'list') {
    return (
      <Card
        variant="outlined"
        clickable
        onClick={() => navigate(`/place/${d.id}`)}
        className="mb-2 transition-all duration-normal hover:translate-x-1"
      >
        <div className="flex items-center gap-3 p-4">
          <div
            className="w-12 h-12 rounded-sm flex items-center justify-center text-[26px] flex-shrink-0"
            style={{ background: d.gradient }}
          >
            {d.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <Typography variant="caption" as="span" weight="bold" className="tracking-wide" style={{ color: d.color }}>
              {d.cat} · {d.area}
            </Typography>
            <Typography variant="body-sm" as="div" weight="bold" className="mt-0">
              {d.name}
            </Typography>
            <Typography variant="caption" color="subtle" as="div" className="mt-0">
              {d.tagline}
            </Typography>
          </div>
          <span className="text-xl font-light" style={{ color: d.color }}>›</span>
        </div>
      </Card>
    );
  }

  // compact: horizontal scroll card (TopPage)
  return (
    <Card
      variant="outlined"
      clickable
      onClick={() => navigate(`/place/${d.id}`)}
      className="min-w-[155px] flex-shrink-0 snap-start transition-all duration-normal hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="p-3 pb-2 text-white" style={{ background: d.gradient }}>
        <span className="text-[26px]">{d.emoji}</span>
      </div>
      <div className="p-3 pt-2">
        <Typography variant="caption" as="span" weight="bold" className="tracking-wide" style={{ color: d.color }}>
          {d.cat}
        </Typography>
        <Typography variant="body-sm" as="div" weight="bold" className="">
          {d.name}
        </Typography>
        {d.tickets[0] && (
          <Typography variant="caption" color="subtle" as="div" className="mt-1">
            {d.tickets[0].price} 〜
          </Typography>
        )}
      </div>
    </Card>
  );
};
