import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Typography } from '@ds/primitives/Typography/Typography';
import { scenarios, type Route, type TicketSuggestion as TSType } from '../data/routes';
import { RouteSearchForm } from '../components/RouteSearchForm';
import { RouteCard } from '../components/RouteCard';
import { RouteTimeline } from '../components/RouteTimeline';
import { TicketSuggestion } from '../components/TicketSuggestion';
import { ContextCard } from '../components/ContextCard';
import { useTicketStore } from '../store/ticketStore';

type Screen = 'input' | 'results' | 'detail';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setDetailTicket } = useTicketStore();

  const presetTo = searchParams.get('to') ?? '';

  const [screen, setScreen] = useState<Screen>('input');
  const [scenarioId, setScenarioId] = useState('midorikawa');
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeSort, setActiveSort] = useState('早');

  // Sync preset destination from URL
  useEffect(() => {
    if (presetTo) {
      // Try to match a scenario by destination name
      const matched = scenarios.find((s) => s.to.includes(presetTo));
      if (matched) setScenarioId(matched.id);
      setScreen('results');
    }
  }, [presetTo]);

  const scenario = scenarios.find((s) => s.id === scenarioId) ?? scenarios[0];

  const switchScenario = (id: string) => {
    setScenarioId(id);
    setScreen('input');
    setSelectedRoute(null);
    setSheetOpen(false);
  };

  const openDetail = (route: Route) => {
    setSelectedRoute(route);
    setScreen('detail');
    setTimeout(() => setSheetOpen(true), 50);
  };

  const closeDetail = () => {
    setSheetOpen(false);
    setTimeout(() => {
      setScreen('results');
      setSelectedRoute(null);
    }, 300);
  };

  const handlePurchase = (ticket: TSType) => {
    setDetailTicket({
      name: ticket.name,
      price: ticket.price,
      days: ticket.days,
      desc: ticket.desc,
      destName: scenario.to,
      destId: scenario.id,
    });
    setSheetOpen(false);
    setTimeout(() => {
      setSelectedRoute(null);
      setScreen('results');
    }, 300);
  };

  return (
    <div className="bg-background" style={{ height: 'calc(100dvh - 42px - 64px)', overflowY: 'auto' }}>
      {/* Scenario switcher */}
      {screen === 'input' ? (
        <div className="flex gap-2 px-4 pt-3">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => switchScenario(s.id)}
              className="flex-1 py-2 px-1 rounded-sm text-[11px] font-semibold cursor-pointer text-center"
              style={{
                border: `1.5px solid ${scenarioId === s.id ? '#2D6A4F' : 'var(--color-border-muted, #E2EDE6)'}`,
                background: scenarioId === s.id ? '#F0FAF4' : 'white',
                color: scenarioId === s.id ? '#2D6A4F' : '#94A3B8',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-surface flex gap-1 px-4 py-1">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => switchScenario(s.id)}
              className="py-1 px-2 rounded-[6px] text-[10px] font-semibold cursor-pointer"
              style={{
                border: scenarioId === s.id ? '1.5px solid #2D6A4F' : '1px solid var(--color-border-muted, #E2EDE6)',
                background: scenarioId === s.id ? '#F0FAF4' : 'white',
                color: scenarioId === s.id ? '#2D6A4F' : '#94A3B8',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Input screen */}
      {screen === 'input' && (
        <RouteSearchForm
          from={scenario.from}
          to={scenario.to}
          onSearch={() => setScreen('results')}
        />
      )}

      {/* Results / detail screens share compact form + sort tabs */}
      {screen !== 'input' && (
        <>
          <RouteSearchForm from={scenario.from} to={scenario.to} compact />

          {/* Sort tabs */}
          <div className="flex bg-surface border-b border-border-muted">
            {['早', '安', '楽'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveSort(t)}
                className="flex-1 py-3 border-none bg-transparent cursor-pointer text-[14px] font-bold"
                style={{
                  borderBottom: activeSort === t ? '2.5px solid #2D6A4F' : '2.5px solid transparent',
                  color: activeSort === t ? '#2D6A4F' : '#94A3B8',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Route cards */}
          <div className="px-4 pt-3 pb-20">
            {/* Context card for demand transport scenarios */}
            {scenario.showContext && <ContextCard />}
            {scenario.showContext && (
              <div className="bg-surface rounded-sm p-3 mb-3 border border-border-muted flex gap-2 items-start">
                <span className="text-[14px]">⚠️</span>
                <Typography variant="caption" color="muted" as="div" className="leading-relaxed">
                  直通の公共交通ルートが見つかりませんでした。上記の「呼べば来るバス」のご利用をおすすめします。
                </Typography>
              </div>
            )}
            {scenario.routes.map((r) => (
              <RouteCard key={r.id} route={r} onClick={() => openDetail(r)} />
            ))}
          </div>
        </>
      )}

      {/* Detail bottom sheet overlay */}
      {selectedRoute && (
        <>
          {/* Backdrop */}
          <div
            onClick={closeDetail}
            className="fixed top-0 left-0 right-0 bottom-0"
            style={{
              background: 'rgba(0,0,0,0.3)',
              zIndex: 200,
              opacity: sheetOpen ? 1 : 0,
              transition: 'opacity 0.3s',
              pointerEvents: sheetOpen ? 'auto' : 'none',
            }}
          />
          {/* Sheet */}
          <div
            className="fixed left-0 right-0 bottom-0 max-w-[420px] mx-auto bg-surface overflow-y-auto"
            style={{
              borderRadius: '20px 20px 0 0',
              zIndex: 300,
              maxHeight: '88vh',
              transform: sheetOpen ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.35s cubic-bezier(0.32,0.72,0,1)',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.12)',
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-border-muted" />
            </div>

            {/* Route summary header */}
            <div className="px-5 py-2 pb-3 flex justify-between items-start">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[22px] font-black text-onSurface-primary">{selectedRoute.dep}</span>
                  <span className="text-[14px] text-onSurface-subtle mx-1">→</span>
                  <span className="text-[22px] font-black text-onSurface-primary">{selectedRoute.arr}</span>
                  <span className="text-[12px] text-onSurface-subtle ml-2">({selectedRoute.dur})</span>
                </div>
                <Typography variant="body-sm" color="muted" as="div" className="mt-1">
                  {selectedRoute.cost}　乗換{selectedRoute.transfers}回
                </Typography>
              </div>
              <button
                onClick={closeDetail}
                className="bg-transparent rounded-full w-8 h-8 cursor-pointer flex items-center justify-center flex-shrink-0 text-[14px] text-onSurface-subtle"
                style={{ border: '2px solid #CBD5E1' }}
              >
                ✕
              </button>
            </div>

            {/* Timeline */}
            <RouteTimeline
              route={selectedRoute}
              onPlaceClick={(id) => {
                closeDetail();
                setTimeout(() => navigate(`/place/${id}`), 350);
              }}
            />

            {/* Ticket suggestions */}
            <TicketSuggestion route={selectedRoute} onPurchase={handlePurchase} />
          </div>
        </>
      )}
    </div>
  );
};
