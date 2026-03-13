import { useSearchParams, useNavigate } from 'react-router-dom';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon/Icon';
import { Card } from '@ds/composites/Card/Card';
import { Badge } from '@ds/composites/Badge/Badge';
import { destinations } from '../data/destinations';
import { FadeIn } from '../components/FadeIn';
import { RouteSearchForm } from '../components/RouteSearchForm';
import { DiscountBanner } from '../components/DiscountBanner';
import { useTicketStore } from '../store/ticketStore';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setDetailTicket } = useTicketStore();
  const from = searchParams.get('from') ?? '';
  const to = searchParams.get('to') ?? '';

  const hasQuery = from.length > 0 || to.length > 0;

  // Match destinations by name, area, or tagline (exclude "現在地" from matching)
  const matched = hasQuery
    ? destinations.filter((d) => {
        const haystack = `${d.name} ${d.area} ${d.tagline} ${d.cat}`;
        const keywords = [from, to].filter((kw) => kw && kw !== '現在地');
        if (keywords.length === 0) return false;
        return keywords.some((kw) => haystack.includes(kw));
      })
    : [];

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
          経路検索
        </Typography>
        <Typography variant="body-sm" color="inherit" as="div" className="opacity-75 mt-1">
          出発地と目的地を入力して検索
        </Typography>
      </div>

      {/* Search Form */}
      <div className="px-4 -mt-3 relative z-10">
        <RouteSearchForm defaultFrom={from} defaultTo={to} />
      </div>

      {/* Results */}
      <div className="px-4 pt-5 pb-10">
        {hasQuery && matched.length > 0 && (
          <Typography variant="body-sm" as="div" weight="bold" className="mb-3">
            検索結果（{matched.length}件）
          </Typography>
        )}

        {hasQuery && matched.length === 0 && (
          <FadeIn>
            <div className="text-center py-12">
              <Icon name="search" size="lg" color="disabled" />
              <Typography variant="body-sm" color="disabled" as="div" className="mt-3">
                該当する経路が見つかりませんでした
              </Typography>
              <Typography variant="caption" color="subtle" as="div" className="mt-1">
                行き先名やエリア名で検索してみてください
              </Typography>
            </div>
          </FadeIn>
        )}

        {matched.map((d, di) => (
          <FadeIn key={d.id} delay={di * 100}>
            <div className="mb-6">
              {/* Destination header */}
              <div
                className="flex items-center gap-2 mb-3 cursor-pointer"
                onClick={() => navigate(`/place/${d.id}`)}
              >
                <span className="text-xl">{d.emoji}</span>
                <Typography variant="body-sm" as="span" weight="bold">
                  {d.name}
                </Typography>
                <Badge variant="primary" size="small">
                  {d.area}
                </Badge>
                <Icon name="chevron_right" size="sm" color="primary" />
              </div>

              {/* Discount banner */}
              {d.discount && (
                <FadeIn delay={di * 100 + 50}>
                  <div className="mb-3">
                    <DiscountBanner discount={d.discount} />
                  </div>
                </FadeIn>
              )}

              {/* Tickets (primary) */}
              {d.tickets.length > 0 && (
                <>
                  <Typography variant="caption" as="div" weight="bold" className="mb-2 tracking-wide text-accent">
                    🎫 おトクなチケット
                  </Typography>
                  {d.tickets.map((t, ti) => (
                    <FadeIn key={ti} delay={di * 100 + ti * 60 + 80}>
                      <Card
                        variant="outlined"
                        clickable
                        className="mb-2"
                        onClick={() => setDetailTicket({ ...t, destName: d.name, destId: d.id })}
                      >
                        <div className="p-3 flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Badge variant="info" appearance="outline" size="small">
                                {t.days}
                              </Badge>
                            </div>
                            <Typography variant="body-sm" as="div" weight="bold" className="mt-1">
                              {t.name}
                            </Typography>
                            <Typography variant="caption" color="muted" as="div" className="mt-1 leading-relaxed">
                              {t.desc}
                            </Typography>
                          </div>
                          <div className="text-right flex-shrink-0 ml-3">
                            <Typography variant="h5" as="div" weight="bold" color="primary" className="font-sans">
                              {t.price}
                            </Typography>
                          </div>
                        </div>
                      </Card>
                    </FadeIn>
                  ))}
                </>
              )}

              {/* Access routes (secondary) */}
              {d.access.length > 0 && (
                <>
                  <Typography variant="caption" as="div" weight="bold" color="muted" className="mt-3 mb-2">
                    🚃 アクセス方法
                  </Typography>
                  {d.access.map((a, ai) => (
                    <FadeIn key={ai} delay={di * 100 + ai * 60 + 200}>
                      <div className="flex items-center gap-3 py-2 border-b border-border-muted last:border-b-0">
                        <span className="text-lg flex-shrink-0">{a.icon}</span>
                        <div className="flex-1 min-w-0">
                          <Typography variant="caption" as="span" weight="bold">
                            {a.mode}
                          </Typography>
                          <Typography variant="caption" color="muted" as="div" className="leading-snug">
                            {a.detail}
                          </Typography>
                        </div>
                        <Badge variant="neutral" size="small">
                          {a.time}
                        </Badge>
                      </div>
                    </FadeIn>
                  ))}
                </>
              )}
            </div>
          </FadeIn>
        ))}

        {!hasQuery && (
          <FadeIn>
            <div className="text-center py-12">
              <Icon name="search" size="lg" color="disabled" />
              <Typography variant="body-sm" color="disabled" as="div" className="mt-3">
                経路を検索しましょう
              </Typography>
              <Typography variant="caption" color="subtle" as="div" className="mt-1">
                緑川、石段、中央 などで検索できます
              </Typography>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
};
