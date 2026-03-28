import { useState } from "react";

const C = {
  primary: "#2D6A4F", accent: "#E07A5F", sand: "#F2CC8F", mist: "#81B29A",
  dark: "#1C2833", gray: "#5D6D7E", lightGray: "#95A5A6",
  bg: "#F7FAF8", white: "#FFFFFF", cardBorder: "#E8F0EC",
};

// ── Destination objects (OOUI core) ──
const destinations = [
  {
    id: "kusatsu", name: "草津温泉", cat: "温泉町", area: "草津・吾妻",
    heroColor: C.primary,
    access: [
      { mode: "電車+バス", detail: "東京→長野原草津口（特急 約2.5h）→ JRバス 25分" },
      { mode: "高速バス", detail: "新宿→草津温泉BT 約4時間" },
    ],
    tickets: [
      { name: "草津高原線フリーパス", price: "¥1,540", days: "2日間", cat: "観光" },
      { name: "ぐんまワンデーローカルパス", price: "¥2,600", days: "1日間", cat: "観光" },
    ],
    spots: ["湯畑", "西の河原公園", "熱乃湯", "草津国際スキー場"],
    booking: [],
    discount: null,
  },
  {
    id: "ikaho", name: "伊香保温泉", cat: "温泉町", area: "渋川",
    heroColor: "#8B5E3C",
    access: [{ mode: "直通バス", detail: "高崎駅→伊香保ライナー 約60分" }],
    tickets: [
      { name: "伊香保温泉フリーパス", price: "¥1,500", days: "2日間", cat: "観光" },
      { name: "伊香保ライナー", price: "¥2,000", days: "片道", cat: "観光" },
    ],
    spots: ["石段街", "伊香保露天風呂", "河鹿橋"],
    booking: [{ type: "伊香保ライナー予約", desc: "事前予約制・座席指定" }],
    discount: null,
  },
  {
    id: "maebashi", name: "前橋駅", cat: "駅", area: "前橋",
    heroColor: C.mist,
    access: [
      { mode: "JR両毛線", detail: "高崎駅から約15分" },
      { mode: "上毛電鉄", detail: "中央前橋駅（徒歩10分）" },
    ],
    tickets: [
      { name: "中心市街地乗り放題券", price: "¥500", days: "1日間", cat: "通勤" },
      { name: "前橋市内共通定期券", price: "¥8,560〜", days: "月額", cat: "通勤" },
      { name: "サブスクパス Premium", price: "¥8,000", days: "月額", cat: "通勤" },
    ],
    spots: ["前橋市役所", "けやきウォーク", "臨江閣"],
    booking: [{ type: "タクシー予約", desc: "地図から乗降車地を指定" }],
    discount: { condition: "前橋市民", detail: "乗り放題券 ¥500→¥360（マイナンバーカード登録時）" },
  },
  {
    id: "shibukawa-clinic", name: "渋川市内の病院", cat: "施設", area: "渋川",
    heroColor: C.accent,
    access: [
      { mode: "路線バス", detail: "渋川駅から各方面" },
      { mode: "呼べば来るバス", detail: "デマンド交通（予約制）・自宅近くのバス停から" },
    ],
    tickets: [
      { name: "渋川市高齢者割引パス（バス）", price: "50%OFF", days: "年度", cat: "割引" },
      { name: "渋川市高齢者割引パス（タクシー）", price: "30〜50%OFF", days: "年度", cat: "割引" },
    ],
    spots: [],
    booking: [
      { type: "デマンド交通予約", desc: "出発地・降車地・日時を選んで予約" },
      { type: "タクシー予約", desc: "地図から乗降車地を指定" },
    ],
    discount: { condition: "渋川市民・65歳以上", detail: "路線バス50%OFF、タクシー30〜50%OFF（マイナンバーカード登録時）" },
  },
];

const segments = [
  { id: "travel", icon: "🗻", title: "旅する", sub: "温泉・自然・ローカル鉄道を楽しむ", color: C.primary,
    dests: destinations.filter(d => d.cat === "温泉町") },
  { id: "daily", icon: "🚌", title: "暮らす", sub: "通勤・通学・通院をもっと自由に", color: C.mist,
    dests: destinations.filter(d => d.cat !== "温泉町") },
];

const allTickets = destinations.flatMap(d => d.tickets.map(t => ({ ...t, dest: d.name })));
const filterCats = ["すべて", "観光", "通勤", "割引"];

const tabDefs = [
  { key: "access", label: "アクセス", icon: "🚃" },
  { key: "tickets", label: "チケット", icon: "🎫" },
  { key: "spots", label: "周辺", icon: "📍" },
  { key: "booking", label: "予約", icon: "📱" },
];

export default function GunMaaSv2() {
  const [page, setPage] = useState("top");
  const [dest, setDest] = useState(null);
  const [seg, setSeg] = useState(null);
  const [ticketFilter, setTicketFilter] = useState("すべて");
  const [activeTab, setActiveTab] = useState("access");

  const go = (p, d = null, s = null) => { setPage(p); if (d) setDest(d); if (s) setSeg(s); if (p === "place") setActiveTab("access"); };

  // ── Header ──
  const Nav = () => (
    <div style={{ background: C.white, borderBottom: `2px solid ${C.primary}`, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }} onClick={() => go("top")}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontWeight: 800, fontSize: 12 }}>G</div>
        <span style={{ fontWeight: 700, fontSize: 16, color: C.primary }}>GunMaaS</span>
      </div>
      <div style={{ display: "flex", gap: 14, fontSize: 12, color: C.gray }}>
        <span style={{ cursor: "pointer" }} onClick={() => go("tickets")}>チケット</span>
        <span style={{ cursor: "pointer" }}>はじめ方</span>
        <span style={{ cursor: "pointer" }}>FAQ</span>
      </div>
    </div>
  );

  // ── Search Bar ──
  const Search = ({ dark }) => (
    <div style={{ background: dark ? "rgba(255,255,255,0.92)" : C.white, borderRadius: 14, padding: "14px 16px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
      <div style={{ fontSize: 11, color: C.gray, fontWeight: 600, marginBottom: 8 }}>経路検索</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${C.primary}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.primary }} />
          </div>
          <input placeholder="出発地を入力" style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 18, height: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `7px solid ${C.accent}` }} />
          </div>
          <input placeholder="目的地を入力" style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        </div>
        <button style={{ background: C.accent, color: C.white, border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 700, fontSize: 13, cursor: "pointer", width: "100%" }}>経路を検索</button>
      </div>
    </div>
  );

  // ── Destination Card ──
  const DestCard = ({ d, compact }) => (
    <div onClick={() => go("place", d)} style={{
      background: C.white, borderRadius: 14, padding: compact ? "14px" : "18px", cursor: "pointer",
      border: `1.5px solid ${C.cardBorder}`, transition: "all 0.2s",
      minWidth: compact ? 150 : "auto", flexShrink: compact ? 0 : 1,
      boxShadow: "0 1px 6px rgba(0,0,0,0.03)",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = d.heroColor; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.07)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.cardBorder; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.03)"; }}
    >
      <div style={{ fontSize: 10, color: d.heroColor, fontWeight: 700, marginBottom: 2, letterSpacing: 0.5 }}>{d.cat} · {d.area}</div>
      <div style={{ fontSize: compact ? 15 : 17, fontWeight: 700, color: C.dark, marginBottom: 4 }}>{d.name}</div>
      {!compact && d.tickets.length > 0 && (
        <div style={{ fontSize: 12, color: C.gray }}>{d.tickets[0].name} {d.tickets[0].price}</div>
      )}
      {d.discount && !compact && (
        <div style={{ marginTop: 6, background: `${C.sand}66`, borderRadius: 6, padding: "4px 8px", fontSize: 11, color: C.accent, fontWeight: 600 }}>
          💡 {d.discount.condition}なら割引あり
        </div>
      )}
    </div>
  );

  // ── TOP PAGE ──
  const TopPage = () => (
    <div>
      <div style={{ background: `linear-gradient(150deg, ${C.primary} 0%, ${C.mist} 100%)`, padding: "40px 16px 20px", color: C.white, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: 2, marginBottom: 6 }}>GUNMA MOBILITY AS A SERVICE</div>
        <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, letterSpacing: -0.5 }}>群馬を、つながる。</div>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 20 }}>スマホひとつで、群馬のすべての移動がつながります</div>
        <Search dark />
      </div>

      {/* Destination cards - OOUI core */}
      <div style={{ padding: "24px 16px 8px" }}>
        <div style={{ fontSize: 12, color: C.gray, fontWeight: 700, marginBottom: 10 }}>人気の行き先</div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
          {destinations.slice(0, 4).map(d => <DestCard key={d.id} d={d} compact />)}
        </div>
      </div>

      {/* 2 Segments */}
      <div style={{ padding: "16px 16px 8px" }}>
        <div style={{ fontSize: 12, color: C.gray, fontWeight: 700, marginBottom: 10 }}>あなたの目的は？</div>
        <div style={{ display: "flex", gap: 10 }}>
          {segments.map(s => (
            <div key={s.id} onClick={() => go("segment", null, s)} style={{
              flex: 1, background: C.white, borderRadius: 14, padding: "20px 16px", cursor: "pointer",
              border: `1.5px solid ${C.cardBorder}`, textAlign: "center", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.cardBorder; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ fontSize: 32, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: C.dark }}>{s.title}</div>
              <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular tickets */}
      <div style={{ padding: "16px 16px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: C.gray, fontWeight: 700 }}>人気のチケット</span>
          <span style={{ fontSize: 11, color: C.primary, cursor: "pointer", fontWeight: 600 }} onClick={() => go("tickets")}>すべて見る →</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {allTickets.slice(0, 3).map((t, i) => (
            <div key={i} style={{ background: C.white, borderRadius: 10, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${C.cardBorder}` }}>
              <div>
                <div style={{ fontSize: 10, color: C.accent, fontWeight: 700 }}>{t.cat} · {t.dest}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>{t.name}</div>
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: C.primary }}>{t.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── SEGMENT PAGE ──
  const SegmentPage = () => {
    if (!seg) return null;
    return (
      <div>
        <div style={{ background: `linear-gradient(135deg, ${seg.color} 0%, ${seg.color}BB 100%)`, padding: "24px 16px", color: C.white }}>
          <button onClick={() => go("top")} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, padding: "5px 10px", color: C.white, fontSize: 12, cursor: "pointer", marginBottom: 12 }}>← トップへ</button>
          <div style={{ fontSize: 32, marginBottom: 2 }}>{seg.icon}</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{seg.title}</div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>{seg.sub}</div>
        </div>
        <div style={{ padding: "20px 16px" }}>
          <Search />
          <div style={{ marginTop: 16, fontSize: 12, color: C.gray, fontWeight: 700, marginBottom: 10 }}>行き先を選ぶ</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {seg.dests.map(d => <DestCard key={d.id} d={d} />)}
          </div>
        </div>
      </div>
    );
  };

  // ── PLACE PAGE (Object Single View) ──
  const PlacePage = () => {
    if (!dest) return null;
    const d = dest;
    return (
      <div>
        <div style={{ background: `linear-gradient(135deg, ${d.heroColor} 0%, ${d.heroColor}CC 100%)`, padding: "24px 16px", color: C.white }}>
          <button onClick={() => go("top")} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, padding: "5px 10px", color: C.white, fontSize: 12, cursor: "pointer", marginBottom: 12 }}>← 戻る</button>
          <div style={{ fontSize: 10, opacity: 0.7, letterSpacing: 1 }}>{d.cat} · {d.area}</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 2 }}>{d.name}</div>
          {d.discount && (
            <div style={{ marginTop: 10, background: "rgba(255,255,255,0.18)", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
              💡 {d.discount.condition}の方: {d.discount.detail}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid #eee`, background: C.white, position: "sticky", top: 42, zIndex: 50 }}>
          {tabDefs.map(tab => {
            const hasContent = tab.key === "access" ? d.access.length > 0
              : tab.key === "tickets" ? d.tickets.length > 0
              : tab.key === "spots" ? d.spots.length > 0
              : d.booking.length > 0;
            if (!hasContent) return null;
            const active = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                flex: 1, padding: "10px 0", border: "none", background: "none", cursor: "pointer",
                borderBottom: active ? `2px solid ${d.heroColor}` : "2px solid transparent",
                color: active ? d.heroColor : C.lightGray, fontWeight: 600, fontSize: 12,
              }}>
                {tab.icon} {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div style={{ padding: "16px" }}>
          {activeTab === "access" && d.access.map((a, i) => (
            <div key={i} style={{ background: C.white, borderRadius: 10, padding: "14px", marginBottom: 8, border: `1px solid ${C.cardBorder}` }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.dark, marginBottom: 2 }}>{a.mode}</div>
              <div style={{ fontSize: 12, color: C.gray }}>{a.detail}</div>
            </div>
          ))}

          {activeTab === "tickets" && d.tickets.map((t, i) => (
            <div key={i} style={{ background: C.white, borderRadius: 10, padding: "14px", marginBottom: 8, border: `1px solid ${C.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 10, color: C.accent, fontWeight: 700 }}>{t.cat} · {t.days}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>{t.name}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.primary }}>{t.price}</div>
                <button style={{ marginTop: 4, background: C.accent, color: C.white, border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>購入</button>
              </div>
            </div>
          ))}

          {activeTab === "spots" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {d.spots.map((s, i) => (
                <div key={i} style={{ background: C.white, borderRadius: 10, padding: "12px 16px", border: `1px solid ${C.cardBorder}`, fontSize: 13, fontWeight: 600, color: C.dark }}>
                  📍 {s}
                </div>
              ))}
            </div>
          )}

          {activeTab === "booking" && d.booking.map((b, i) => (
            <div key={i} style={{ background: C.white, borderRadius: 10, padding: "14px", marginBottom: 8, border: `1px solid ${C.cardBorder}` }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.dark, marginBottom: 2 }}>{b.type}</div>
              <div style={{ fontSize: 12, color: C.gray, marginBottom: 8 }}>{b.desc}</div>
              <button style={{ background: C.primary, color: C.white, border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%" }}>予約する</button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── TICKETS PAGE ──
  const TicketsPage = () => {
    const filtered = ticketFilter === "すべて" ? allTickets : allTickets.filter(t => t.cat === ticketFilter);
    return (
      <div>
        <div style={{ background: C.primary, padding: "20px 16px", color: C.white }}>
          <button onClick={() => go("top")} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, padding: "5px 10px", color: C.white, fontSize: 12, cursor: "pointer", marginBottom: 10 }}>← トップへ</button>
          <div style={{ fontSize: 22, fontWeight: 800 }}>チケット一覧</div>
        </div>
        <div style={{ padding: "12px 16px", display: "flex", gap: 6, overflowX: "auto" }}>
          {filterCats.map(cat => (
            <button key={cat} onClick={() => setTicketFilter(cat)} style={{
              background: ticketFilter === cat ? C.primary : C.white,
              color: ticketFilter === cat ? C.white : C.dark,
              border: `1px solid ${ticketFilter === cat ? C.primary : "#ddd"}`,
              borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            }}>{cat}</button>
          ))}
        </div>
        <div style={{ padding: "8px 16px 32px", display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((t, i) => (
            <div key={i} style={{ background: C.white, borderRadius: 10, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${C.cardBorder}` }}>
              <div>
                <div style={{ fontSize: 10, color: C.accent, fontWeight: 700 }}>{t.cat} · {t.dest}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>{t.name}</div>
                <div style={{ fontSize: 11, color: C.gray, marginTop: 1 }}>{t.days}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.primary }}>{t.price}</div>
                <button style={{ marginTop: 4, background: C.accent, color: C.white, border: "none", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>購入</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", background: C.bg, minHeight: "100vh", fontFamily: "'Noto Sans JP', -apple-system, sans-serif", boxShadow: "0 0 48px rgba(0,0,0,0.06)" }}>
      <Nav />
      {page === "top" && <TopPage />}
      {page === "segment" && <SegmentPage />}
      {page === "place" && <PlacePage />}
      {page === "tickets" && <TicketsPage />}
      <div style={{ position: "sticky", bottom: 0, background: C.white, borderTop: "1px solid #eee", display: "flex", justifyContent: "space-around", padding: "6px 0 10px", zIndex: 100 }}>
        {[
          { icon: "🏠", label: "ホーム", p: "top" },
          { icon: "🔍", label: "検索", p: "top" },
          { icon: "🎫", label: "チケット", p: "tickets" },
          { icon: "👤", label: "マイページ", p: "top" },
        ].map((item, i) => (
          <div key={i} onClick={() => go(item.p)} style={{ textAlign: "center", cursor: "pointer", opacity: page === item.p && item.label === "ホーム" ? 1 : 0.5 }}>
            <div style={{ fontSize: 18 }}>{item.icon}</div>
            <div style={{ fontSize: 9, color: C.dark, marginTop: 1 }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
