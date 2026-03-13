import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon/Icon';
import { Tabs, type TabItem } from '@ds/composites/Tabs/Tabs';
import { Card } from '@ds/composites/Card/Card';
import { destinations } from '../data/destinations';
import { FadeIn } from '../components/FadeIn';
import { DiscountBanner } from '../components/DiscountBanner';
import { PersonalDiscountBanner } from '../components/PersonalDiscountBanner';
import { useTicketStore } from '../store/ticketStore';


export const PlacePage = () => {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const d = destinations.find((dest) => dest.id === placeId);
  const [activeTab, setActiveTab] = useState('access');
  const { setDetailTicket, userProfile } = useTicketStore();

  if (!d) return null;

  // Build tab items dynamically based on available data
  const tabItems: TabItem[] = [];

  if (d.access.length > 0) {
    tabItems.push({
      id: 'access',
      label: '🚃 アクセス',
      content: (
        <div className="flex flex-col gap-2">
          {d.access.map((a, i) => (
            <FadeIn key={i} delay={i * 80}>
              <Card variant="outlined">
                <div className="p-4 flex gap-3 items-start">
                  <div
                    className="w-10 h-10 rounded-sm flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${d.color}10` }}
                  >
                    {a.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <Typography variant="body-sm" as="span" weight="bold" className="">
                        {a.mode}
                      </Typography>
                      <Typography variant="caption" as="span" weight="semibold" style={{ color: d.color }}>
                        {a.time}
                      </Typography>
                    </div>
                    <Typography variant="caption" color="muted" as="div" className="mt-1 leading-relaxed">
                      {a.detail}
                    </Typography>
                  </div>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      ),
    });
  }

  if (d.tickets.length > 0) {
    tabItems.push({
      id: 'tickets',
      label: '🎫 チケット',
      content: (
        <div className="flex flex-col gap-2">
          {d.tickets.map((t, i) => (
            <FadeIn key={i} delay={i * 80}>
              <Card
                variant="outlined"
                clickable
                onClick={() => setDetailTicket({ ...t, destName: d.name, destId: d.id })}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Typography variant="caption" as="span" weight="bold" className="tracking-wide text-accent">
                        {t.days}
                      </Typography>
                      <Typography variant="body-sm" as="div" weight="bold" className="mt-0">
                        {t.name}
                      </Typography>
                      <Typography variant="caption" color="muted" as="div" className="mt-1 leading-relaxed">
                        {t.desc}
                      </Typography>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <Typography variant="h4" as="div" weight="bold" color="primary" className="font-sans">
                        {t.price}
                      </Typography>
                    </div>
                  </div>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      ),
    });
  }

  if (d.spots.length > 0) {
    tabItems.push({
      id: 'spots',
      label: '📍 周辺',
      content: (
        <div className="flex flex-col gap-2">
          {d.spots.map((s, i) => (
            <FadeIn key={i} delay={i * 80}>
              <Card variant="outlined">
                <div className="p-3 flex gap-3 items-start">
                  <span className="text-lg flex-shrink-0">📍</span>
                  <div>
                    <Typography variant="body-sm" as="div" weight="bold" className="">
                      {s.name}
                    </Typography>
                    <Typography variant="caption" color="muted" as="div" className="mt-1 leading-relaxed">
                      {s.desc}
                    </Typography>
                  </div>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      ),
    });
  }

  if (d.booking.length > 0) {
    tabItems.push({
      id: 'booking',
      label: '📱 予約',
      content: (
        <div className="flex flex-col gap-2">
          {d.booking.map((b, i) => (
            <FadeIn key={i} delay={i * 80}>
              <Card variant="outlined">
                <div className="p-4">
                  <Typography variant="body-sm" as="div" weight="bold" className="">
                    {b.type}
                  </Typography>
                  <Typography variant="caption" color="muted" as="div" className="mt-1 leading-relaxed mb-3">
                    {b.desc}
                  </Typography>
                  <Button
                    fullWidth
                    size="small"
                    style={{ background: 'linear-gradient(135deg, #2D6A4F, #40916C)' }}
                  >
                    予約する
                  </Button>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      ),
    });
  }

  // Set initial tab to first available
  const initialTab = tabItems[0]?.id ?? 'access';
  if (activeTab !== initialTab && !tabItems.find((t) => t.id === activeTab)) {
    setActiveTab(initialTab);
  }

  return (
    <div>
      {/* Hero */}
      <div
        className="px-4 pt-5 pb-6 text-white relative overflow-hidden"
        style={{ background: d.gradient }}
      >
        <div className="absolute -top-8 -right-8 w-[120px] h-[120px] rounded-full bg-white/[0.06]" />

        <Button
          variant="tertiary"
          size="small"
          icon={<Icon name="arrow_back" size="sm" color="inherit" />}
          onClick={() => navigate(-1)}
          className="!text-white !bg-white/15 backdrop-blur-sm"
        >
          戻る
        </Button>

        <div className="flex items-center gap-3 mt-3">
          <span className="text-[40px]">{d.emoji}</span>
          <div>
            <div className="text-[10px] opacity-70 tracking-[1px] uppercase">
              {d.cat} · {d.area}
            </div>
            <Typography variant="h2" as="div" color="inherit" className="mt-0">
              {d.name}
            </Typography>
          </div>
        </div>

        <Typography variant="body-sm" color="inherit" as="div" className="opacity-80 mt-2 leading-relaxed">
          {d.tagline}
        </Typography>

        {d.discount && (
          userProfile.step >= 3 && d.discount.cond.includes(userProfile.city)
            ? <PersonalDiscountBanner discount={d.discount} />
            : <DiscountBanner discount={d.discount} />
        )}

        <Button
          fullWidth
          size="small"
          className="mt-4 !text-white !bg-white/20 backdrop-blur-sm"
          icon={<Icon name="arrow_forward" size="sm" color="inherit" />}
          onClick={() => navigate(`/search?from=${encodeURIComponent('現在地')}&to=${encodeURIComponent(d.name)}`)}
        >
          ここに行く
        </Button>
      </div>

      {/* Tabs */}
      <div className="sticky top-[42px] z-40">
        <Tabs
          tabs={tabItems}
          activeId={activeTab}
          onChange={setActiveTab}
          ariaLabel="行き先情報タブ"
        />
      </div>
    </div>
  );
};
