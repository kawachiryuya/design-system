import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon/Icon';
import { allTickets } from '../data/destinations';
import { FadeIn } from '../components/FadeIn';
import { TicketListItem } from '../components/TicketListItem';

const categories = ['すべて', '観光', '通勤', '割引'] as const;
type Category = (typeof categories)[number];

const isMatch = (t: (typeof allTickets)[number], filter: Category) => {
  if (filter === 'すべて') return true;
  if (filter === '観光') return t.days.includes('日間') || t.days === '片道';
  if (filter === '通勤') return t.days.includes('月額') || t.days === '1日間';
  if (filter === '割引') return t.price.includes('OFF');
  return true;
};

export const TicketsPage = () => {
  const [filter, setFilter] = useState<Category>('すべて');
  const navigate = useNavigate();
  const filtered = allTickets.filter((t) => isMatch(t, filter));

  return (
    <div>
      {/* Hero */}
      <div
        className="px-4 pt-5 pb-6 text-white"
        style={{ background: 'linear-gradient(160deg, #1B4332, #2D6A4F)' }}
      >
        <Button
          variant="tertiary"
          size="small"
          icon={<Icon name="arrow_back" size="sm" color="inherit" />}
          onClick={() => navigate('/')}
          className="!text-white !bg-white/15 backdrop-blur-sm"
        >
          戻る
        </Button>
        <Typography variant="h3" as="div" color="inherit" className="mt-3">
          チケット一覧
        </Typography>
        <Typography variant="body-sm" color="inherit" as="div" className="opacity-75 mt-1">
          {allTickets.length}件のチケット
        </Typography>
      </div>

      {/* Filter chips */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap border transition-all duration-normal ${
              filter === cat
                ? 'bg-surface-primary text-onSurface-inverse border-transparent'
                : 'bg-surface text-onSurface border-border-muted hover:border-border-strong'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-4 pb-10">
        {filtered.map((t, i) => (
          <FadeIn key={`${t.destId}-${t.name}`} delay={i * 60}>
            <TicketListItem ticket={t} showBuy />
          </FadeIn>
        ))}
      </div>
    </div>
  );
};
