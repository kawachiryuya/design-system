import { useNavigate } from 'react-router-dom';
import { Card } from '@ds/composites/Card/Card';
import { Typography } from '@ds/primitives/Typography/Typography';
import type { Segment } from '../data/segments';

interface SegmentCardProps {
  segment: Segment;
}

export const SegmentCard = ({ segment: s }: SegmentCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      variant="outlined"
      clickable
      onClick={() => navigate(`/segment/${s.id}`)}
      className="flex-1 text-center transition-all duration-normal hover:-translate-y-1"
    >
      <div className="py-5 px-4" style={{ background: s.gradient }}>
        <div className="text-[34px] mb-1">{s.emoji}</div>
        <Typography variant="h5" as="div" weight="bold" className="">
          {s.title}
        </Typography>
        <Typography variant="caption" color="muted" as="div" className="mt-1">
          {s.sub}
        </Typography>
      </div>
    </Card>
  );
};
