import { useParams, useNavigate } from 'react-router-dom';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon/Icon';
import { segments } from '../data/segments';
import { FadeIn } from '../components/FadeIn';
import { DestinationCard } from '../components/DestinationCard';
import { RouteSearchForm } from '../components/RouteSearchForm';

export const SegmentPage = () => {
  const { segmentId } = useParams();
  const navigate = useNavigate();
  const seg = segments.find((s) => s.id === segmentId);

  if (!seg) return null;

  const heroGradient =
    seg.id === 'travel'
      ? 'linear-gradient(160deg, #1B4332, #40916C)'
      : 'linear-gradient(160deg, #3D7A6A, #A7D7C5)';

  return (
    <div>
      {/* Hero */}
      <div className="px-4 pt-5 pb-6 text-white" style={{ background: heroGradient }}>
        <Button
          variant="tertiary"
          size="small"
          icon={<Icon name="arrow_back" size="sm" color="inherit" />}
          onClick={() => navigate('/')}
          className="!text-white !bg-white/15 backdrop-blur-sm"
        >
          戻る
        </Button>
        <div className="text-[38px] mt-3">{seg.emoji}</div>
        <Typography variant="h2" as="div" color="inherit" className="mt-1">
          {seg.title}
        </Typography>
        <Typography variant="body-sm" color="inherit" as="div" className="opacity-80 mt-1">
          {seg.sub}
        </Typography>
      </div>

      {/* Content */}
      <div className="px-4 pt-5">
        <RouteSearchForm />
        <Typography variant="body-sm" as="div" weight="bold" className="mt-5 mb-3">
          行き先を選ぶ
        </Typography>
        {seg.dests.map((d, i) => (
          <FadeIn key={d.id} delay={i * 100}>
            <DestinationCard destination={d} variant="list" />
          </FadeIn>
        ))}
      </div>
    </div>
  );
};
