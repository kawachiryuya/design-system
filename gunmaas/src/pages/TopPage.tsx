import { useNavigate } from 'react-router-dom';
import { Typography } from '@ds/primitives/Typography/Typography';
import { destinations, allTickets } from '../data/destinations';
import { segments } from '../data/segments';
import { FadeIn } from '../components/FadeIn';
import { DestinationCard } from '../components/DestinationCard';
import { SegmentCard } from '../components/SegmentCard';
import { TicketListItem } from '../components/TicketListItem';
import { RouteSearchForm } from '../components/RouteSearchForm';

export const TopPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <div
        className="px-4 pt-10 pb-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1B4332 0%, #2D6A4F 40%, #40916C 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-10 w-[200px] h-[200px] rounded-full bg-white/[0.04]" />
        <div className="absolute -bottom-8 -left-8 w-[140px] h-[140px] rounded-full bg-white/[0.03]" />
        <div className="absolute top-8 right-5 w-20 h-20 rounded-full bg-white/[0.02]" />

        <FadeIn>
          <div className="text-[10px] opacity-60 tracking-[3px] font-semibold uppercase">
            Regional Mobility as a Service
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <div className="text-[34px] font-black mt-2 tracking-tight leading-[1.15]">
            まちを、<br />つなぐ。
          </div>
        </FadeIn>
        <FadeIn delay={200}>
          <Typography variant="body-sm" color="inherit" as="div" className="opacity-75 mt-2 mb-6">
            スマホひとつで、すべての移動がつながります
          </Typography>
        </FadeIn>
        <FadeIn delay={300}>
          <RouteSearchForm overlay />
        </FadeIn>
      </div>

      {/* Segments */}
      <div className="px-4 pt-6 pb-3">
        <FadeIn delay={400}>
          <Typography variant="body-sm" as="div" weight="bold" className="mb-3">
            あなたの目的は？
          </Typography>
        </FadeIn>
        <div className="flex gap-2">
          {segments.map((s, i) => (
            <FadeIn key={s.id} delay={450 + i * 100} className="flex-1">
              <SegmentCard segment={s} />
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Destinations */}
      <div className="px-4 py-3">
        <FadeIn delay={650}>
          <div className="flex justify-between items-baseline mb-3">
            <Typography variant="body-sm" as="div" weight="bold" className="">
              人気の行き先
            </Typography>
            <Typography variant="caption" color="primary" as="span" weight="semibold" className="cursor-pointer">
              すべて →
            </Typography>
          </div>
        </FadeIn>
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollSnapType: 'x mandatory' }}>
          {destinations.map((d, i) => (
            <FadeIn key={d.id} delay={700 + i * 80}>
              <DestinationCard destination={d} />
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Popular Tickets */}
      <div className="px-4 pt-5 pb-10">
        <FadeIn delay={900}>
          <div className="flex justify-between items-baseline mb-3">
            <Typography variant="body-sm" as="div" weight="bold" className="">
              人気のチケット
            </Typography>
            <Typography
              variant="caption"
              color="primary"
              as="span"
              weight="semibold"
              className="cursor-pointer"
              onClick={() => navigate('/tickets')}
            >
              すべて見る →
            </Typography>
          </div>
        </FadeIn>
        {allTickets.slice(0, 3).map((t, i) => (
          <FadeIn key={i} delay={950 + i * 80}>
            <TicketListItem ticket={t} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
};
