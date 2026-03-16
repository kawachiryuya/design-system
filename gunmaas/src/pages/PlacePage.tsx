/**
 * 行き先詳細ページ — 固定3タブ（基本情報/チケット/周辺）+ Hero内CTA
 */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography } from '@ds/primitives/Typography/Typography';
import { destinations } from '../data/destinations';
import { useTicketStore } from '../store/ticketStore';

type TabId = 'info' | 'tickets' | 'nearby';

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'info', label: '基本情報', icon: 'ℹ️' },
  { id: 'tickets', label: 'チケット', icon: '🎫' },
  { id: 'nearby', label: '周辺', icon: '📍' },
];

export const PlacePage = () => {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const { setDetailTicket } = useTicketStore();
  const [activeTab, setActiveTab] = useState<TabId>('info');

  const d = destinations.find((dest) => dest.id === placeId);
  if (!d) return <div className="text-center py-8 text-onSurface-subtle">行き先情報が見つかりません</div>;

  const info = d.info;

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Hero with CTA inside */}
      <div className="px-4 pt-4 pb-4 text-white flex-shrink-0" style={{ background: 'linear-gradient(160deg, #1B4332, #40916C)' }}>
        <div className="flex gap-3 items-center mt-1">
          <div
            className="w-[52px] h-[52px] rounded-lg flex items-center justify-center text-[28px] flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            {d.emoji}
          </div>
          <div>
            <div className="text-[10px] opacity-70 font-semibold">{d.cat} · {d.area}</div>
            <div className="text-[24px] font-black mt-0">{d.name}</div>
          </div>
        </div>
        <Typography variant="body-sm" color="inherit" as="div" className="opacity-85 mt-3 leading-relaxed">
          {d.tagline}
        </Typography>
        {/* CTA inside hero */}
        <button
          onClick={() => navigate(`/search?to=${encodeURIComponent(d.name)}`)}
          className="mt-4 w-full border-none rounded-lg py-3 text-[14px] font-bold cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.95)', color: '#2D6A4F' }}
        >
          🔍 この行き先へ経路検索
        </button>
      </div>

      {/* Fixed 3-tab bar */}
      <div className="flex bg-surface border-b border-border-muted sticky top-[42px] z-10 flex-shrink-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="flex-1 py-3 border-none bg-transparent cursor-pointer flex flex-col items-center gap-0 text-[12px] font-bold"
            style={{
              borderBottom: activeTab === t.id ? '2.5px solid #2D6A4F' : '2.5px solid transparent',
              color: activeTab === t.id ? '#2D6A4F' : '#94A3B8',
            }}
          >
            <span className="text-[14px]">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* ── 基本情報 ── */}
        {activeTab === 'info' && info && (
          <div className="bg-surface rounded-lg border border-border-muted overflow-hidden">
            <InfoRow icon="📍" label="住所" value={info.address} />
            <InfoRow icon="📞" label="電話番号" value={info.phone} primary />
            <InfoRow icon="🕐" label="営業時間" value={info.hours} last />
          </div>
        )}
        {activeTab === 'info' && !info && (
          <div className="text-center py-8">
            <Typography variant="body-sm" color="muted" as="div">基本情報はまだ登録されていません</Typography>
          </div>
        )}

        {/* ── チケット ── */}
        {activeTab === 'tickets' && (
          <div>
            {d.tickets.length > 0 && (
              <>
                <Typography variant="body-sm" as="div" weight="bold" className="mb-3">使えるチケット</Typography>
                {d.tickets.map((t, i) => (
                  <div
                    key={i}
                    onClick={() => setDetailTicket({ ...t, destName: d.name, destId: d.id })}
                    className="rounded-lg p-4 mb-2 cursor-pointer"
                    style={{
                      background: i === 0 ? '#F0FAF4' : 'white',
                      border: i === 0 ? '1.5px solid rgba(45,106,79,0.15)' : '1px solid var(--color-border-muted, #E2EDE6)',
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-3">
                        <Typography variant="body-sm" as="div" weight="bold">{t.name}</Typography>
                        <Typography variant="caption" color="muted" as="div" className="mt-1 leading-relaxed">
                          {t.desc}
                        </Typography>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[18px] font-black" style={{ color: '#2D6A4F' }}>{t.price}</div>
                        <Typography variant="caption" color="muted" as="div">{t.days}</Typography>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Booking options merged into tickets tab */}
            {d.booking.length > 0 && (
              <>
                <Typography variant="body-sm" as="div" weight="bold" className="mt-4 mb-3">予約・手配</Typography>
                {d.booking.map((b, i) => (
                  <div key={i} className="bg-surface rounded-lg p-4 border border-border-muted mb-2">
                    <Typography variant="body-sm" as="div" weight="bold">{b.type}</Typography>
                    <Typography variant="caption" color="muted" as="div" className="mt-1 leading-relaxed">
                      {b.desc}
                    </Typography>
                  </div>
                ))}
              </>
            )}

            {d.tickets.length === 0 && d.booking.length === 0 && (
              <div className="text-center py-8">
                <Typography variant="body-sm" color="muted" as="div">チケット情報はまだ登録されていません</Typography>
              </div>
            )}
          </div>
        )}

        {/* ── 周辺スポット ── */}
        {activeTab === 'nearby' && (
          <div>
            {d.spots.length > 0 ? (
              <>
                <Typography variant="body-sm" as="div" weight="bold" className="mb-3">周辺スポット</Typography>
                {d.spots.map((s, i) => (
                  <div key={i} className="bg-surface rounded-lg p-4 border border-border-muted mb-2 flex gap-3 items-start">
                    <div
                      className="w-10 h-10 rounded-sm bg-background flex items-center justify-center text-[20px] flex-shrink-0"
                    >
                      {s.emoji || '📍'}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <Typography variant="body-sm" as="div" weight="bold">{s.name}</Typography>
                        {s.dist && (
                          <span className="text-[11px] font-semibold" style={{ color: '#2D6A4F' }}>{s.dist}</span>
                        )}
                      </div>
                      <Typography variant="caption" color="muted" as="div" className="mt-1 leading-relaxed">
                        {s.desc}
                      </Typography>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-8">
                <Typography variant="body-sm" color="muted" as="div">周辺スポット情報はまだ登録されていません</Typography>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/** 基本情報セクションの行 */
const InfoRow = ({ icon, label, value, primary, last }: {
  icon: string; label: string; value: string; primary?: boolean; last?: boolean;
}) => (
  <div className={`px-4 py-3 flex gap-3 items-start ${last ? '' : 'border-b border-border-muted'}`}>
    <span className="text-[15px] flex-shrink-0">{icon}</span>
    <div>
      <Typography variant="caption" color="muted" as="div">{label}</Typography>
      <Typography
        variant="body-sm"
        as="div"
        weight="semibold"
        className="mt-0"
        style={primary ? { color: '#2D6A4F' } : undefined}
      >
        {value}
      </Typography>
    </div>
  </div>
);
