import { useState } from "react";

const colors = {
  primary: "#2D6A4F",
  accent: "#E07A5F",
  sand: "#F2CC8F",
  mist: "#81B29A",
  dark: "#1C2833",
  gray: "#5D6D7E",
  lightBg: "#F8FAF9",
  white: "#FFFFFF",
  cardHover: "#EBF5EB",
};

const segments = [
  {
    id: "travel",
    icon: "🗻",
    title: "観光で来た",
    sub: "温泉・自然・ローカル鉄道を楽しむ",
    desc: "草津・伊香保・四万・みなかみのエリアガイド、フリーパス、モデルコース",
    color: colors.primary,
    pages: [
      { name: "草津温泉エリア", detail: "アクセス・フリーパス・湯畑周辺ガイド" },
      { name: "伊香保温泉エリア", detail: "伊香保ライナー予約・石段街ガイド" },
      { name: "四万温泉エリア", detail: "フリーパス・積善館周辺ガイド" },
      { name: "みなかみエリア", detail: "周遊2日間フリー乗車券・アクティビティ" },
    ],
  },
  {
    id: "daily",
    icon: "🚌",
    title: "群馬で暮らす",
    sub: "通勤・通学・通院をもっと自由に",
    desc: "経路検索、サブスクパス、定期券、タクシー予約",
    color: colors.mist,
    pages: [
      { name: "通勤・通学ガイド", detail: "経路検索 + 定期券・サブスク比較" },
      { name: "タクシー予約", detail: "地図から乗降車地指定・新幹線連携" },
      { name: "サブスクパス", detail: "3プラン比較・乗りトクパス" },
    ],
  },
  {
    id: "senior",
    icon: "🤝",
    title: "ご高齢の方",
    sub: "自分の力で、気軽にお出かけ",
    desc: "呼べば来るバス、敬老割引パス、タッチ会員",
    color: colors.accent,
    pages: [
      { name: "バスを呼ぶ", detail: "デマンド交通の予約（大きなボタンUI）" },
      { name: "割引パス", detail: "敬老割引・高齢者割引の一覧と取得" },
      { name: "タッチ会員", detail: "スマホなしでも使える方法" },
    ],
  },
];

const tickets = [
  { name: "草津高原線フリーパス", cat: "観光", area: "草津", price: "¥1,540", days: "2日間" },
  { name: "伊香保温泉フリーパス", cat: "観光", area: "伊香保", price: "¥1,500", days: "2日間" },
  { name: "ぐんまワンデーローカルパス", cat: "観光", area: "県内全域", price: "¥2,600", days: "1日間" },
  { name: "中心市街地乗り放題券", cat: "通勤", area: "前橋", price: "¥500", days: "1日間" },
  { name: "サブスクパス Premium", cat: "通勤", area: "県内", price: "¥8,000", days: "月額" },
  { name: "前橋市敬老割引パス", cat: "割引", area: "前橋", price: "10%OFF", days: "年度" },
  { name: "渋川市高齢者割引パス", cat: "割引", area: "渋川", price: "50%OFF", days: "年度" },
];

const filterCats = ["すべて", "観光", "通勤", "割引"];

export default function GunMaaSWireframe() {
  const [currentPage, setCurrentPage] = useState("top");
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [ticketFilter, setTicketFilter] = useState("すべて");
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");

  const navigate = (page, seg = null) => {
    setCurrentPage(page);
    if (seg) setSelectedSegment(seg);
  };

  const Header = () => (
    <div style={{ background: colors.white, borderBottom: `2px solid ${colors.primary}`, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => navigate("top")}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: colors.primary, display: "flex", alignItems: "center", justifyContent: "center", color: colors.white, fontWeight: 800, fontSize: 14 }}>G</div>
        <span style={{ fontWeight: 700, fontSize: 18, color: colors.primary, letterSpacing: -0.5 }}>GunMaaS</span>
      </div>
      <div style={{ display: "flex", gap: 16, fontSize: 13, color: colors.gray }}>
        <span style={{ cursor: "pointer" }} onClick={() => navigate("tickets")}>チケット</span>
        <span style={{ cursor: "pointer" }} onClick={() => navigate("top")}>はじめ方</span>
        <span style={{ cursor: "pointer" }}>FAQ</span>
      </div>
    </div>
  );

  const SearchBar = () => (
    <div style={{ background: `${colors.white}E6`, borderRadius: 16, padding: "16px 20px", margin: "0 20px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
      <div style={{ fontSize: 12, color: colors.gray, marginBottom: 8, fontWeight: 600 }}>経路検索</div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input placeholder="出発地" value={searchFrom} onChange={e => setSearchFrom(e.target.value)} style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: `1px solid #ddd`, fontSize: 14, outline: "none" }} />
        <div style={{ fontSize: 18 }}>→</div>
        <input placeholder="目的地" value={searchTo} onChange={e => setSearchTo(e.target.value)} style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: `1px solid #ddd`, fontSize: 14, outline: "none" }} />
        <button style={{ background: colors.accent, color: colors.white, border: "none", borderRadius: 8, padding: "10px 16px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>検索</button>
      </div>
    </div>
  );

  const TopPage = () => (
    <div>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.mist} 100%)`, padding: "48px 20px 24px", color: colors.white, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", bottom: -50, left: -20, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 8, letterSpacing: 2 }}>GUNMA MOBILITY AS A SERVICE</div>
        <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, letterSpacing: -1 }}>群馬を、つながる。</div>
        <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 24 }}>スマホひとつで、群馬のすべての移動がつながります</div>
        <SearchBar />
      </div>

      {/* Segment cards */}
      <div style={{ padding: "32px 20px 16px" }}>
        <div style={{ fontSize: 13, color: colors.gray, fontWeight: 600, marginBottom: 16 }}>あなたはどなた？</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {segments.map(seg => (
            <div key={seg.id} onClick={() => navigate("segment", seg)} style={{ background: colors.white, borderRadius: 16, padding: "20px", cursor: "pointer", border: `2px solid transparent`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", transition: "all 0.2s", display: "flex", gap: 16, alignItems: "center" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = seg.color; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}
            >
              <div style={{ fontSize: 36, width: 56, height: 56, borderRadius: 16, background: `${seg.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{seg.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 17, color: colors.dark, marginBottom: 2 }}>{seg.title}</div>
                <div style={{ fontSize: 13, color: colors.gray }}>{seg.sub}</div>
              </div>
              <div style={{ color: seg.color, fontSize: 20, fontWeight: 300 }}>›</div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular tickets */}
      <div style={{ padding: "16px 20px 32px" }}>
        <div style={{ fontSize: 13, color: colors.gray, fontWeight: 600, marginBottom: 12 }}>人気のチケット</div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
          {tickets.slice(0, 4).map((t, i) => (
            <div key={i} onClick={() => navigate("tickets")} style={{ minWidth: 160, background: colors.white, borderRadius: 12, padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", cursor: "pointer", flexShrink: 0 }}>
              <div style={{ fontSize: 11, color: colors.accent, fontWeight: 700, marginBottom: 4 }}>{t.cat}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.dark, marginBottom: 8, lineHeight: 1.3 }}>{t.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: colors.primary }}>{t.price}</span>
                <span style={{ fontSize: 11, color: colors.gray }}>{t.days}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SegmentPage = () => {
    if (!selectedSegment) return null;
    const seg = selectedSegment;
    return (
      <div>
        <div style={{ background: `linear-gradient(135deg, ${seg.color} 0%, ${seg.color}CC 100%)`, padding: "32px 20px", color: colors.white }}>
          <button onClick={() => navigate("top")} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, padding: "6px 12px", color: colors.white, fontSize: 13, cursor: "pointer", marginBottom: 16 }}>← トップへ</button>
          <div style={{ fontSize: 36, marginBottom: 4 }}>{seg.icon}</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{seg.title}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>{seg.desc}</div>
        </div>
        <div style={{ padding: "24px 20px" }}>
          {seg.id === "travel" && <SearchBar />}
          <div style={{ marginTop: seg.id === "travel" ? 24 : 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {seg.pages.map((pg, i) => (
              <div key={i} style={{ background: colors.white, borderRadius: 12, padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", borderLeft: `4px solid ${seg.color}` }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: colors.dark, marginBottom: 4 }}>{pg.name}</div>
                <div style={{ fontSize: 13, color: colors.gray }}>{pg.detail}</div>
              </div>
            ))}
          </div>
          {seg.id === "senior" && (
            <div style={{ marginTop: 20, background: colors.sand, borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: colors.dark, marginBottom: 4 }}>スマホが難しい方へ</div>
              <div style={{ fontSize: 13, color: colors.gray }}>タッチ会員なら、交通系ICカードだけで割引サービスが使えます。お近くの窓口でご登録いただけます。</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const TicketsPage = () => {
    const filtered = ticketFilter === "すべて" ? tickets : tickets.filter(t => t.cat === ticketFilter);
    return (
      <div>
        <div style={{ background: colors.primary, padding: "24px 20px", color: colors.white }}>
          <button onClick={() => navigate("top")} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, padding: "6px 12px", color: colors.white, fontSize: 13, cursor: "pointer", marginBottom: 12 }}>← トップへ</button>
          <div style={{ fontSize: 24, fontWeight: 800 }}>チケット一覧</div>
        </div>
        <div style={{ padding: "16px 20px", display: "flex", gap: 8, overflowX: "auto" }}>
          {filterCats.map(cat => (
            <button key={cat} onClick={() => setTicketFilter(cat)} style={{
              background: ticketFilter === cat ? colors.primary : colors.white,
              color: ticketFilter === cat ? colors.white : colors.dark,
              border: `1px solid ${ticketFilter === cat ? colors.primary : "#ddd"}`,
              borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            }}>{cat}</button>
          ))}
        </div>
        <div style={{ padding: "8px 20px 32px", display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((t, i) => (
            <div key={i} style={{ background: colors.white, borderRadius: 12, padding: "16px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: colors.accent, fontWeight: 700, marginBottom: 2 }}>{t.cat} · {t.area}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: colors.dark }}>{t.name}</div>
                <div style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>{t.days}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: colors.primary }}>{t.price}</div>
                <button style={{ marginTop: 4, background: colors.accent, color: colors.white, border: "none", borderRadius: 6, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>購入</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", background: colors.lightBg, minHeight: "100vh", fontFamily: "'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif", position: "relative", boxShadow: "0 0 48px rgba(0,0,0,0.08)" }}>
      <Header />
      {currentPage === "top" && <TopPage />}
      {currentPage === "segment" && <SegmentPage />}
      {currentPage === "tickets" && <TicketsPage />}

      {/* Bottom nav */}
      <div style={{ position: "sticky", bottom: 0, background: colors.white, borderTop: "1px solid #eee", display: "flex", justifyContent: "space-around", padding: "8px 0 12px", zIndex: 100 }}>
        {[
          { icon: "🏠", label: "ホーム", page: "top" },
          { icon: "🔍", label: "検索", page: "top" },
          { icon: "🎫", label: "チケット", page: "tickets" },
          { icon: "👤", label: "マイページ", page: "top" },
        ].map((item, i) => (
          <div key={i} onClick={() => navigate(item.page)} style={{ textAlign: "center", cursor: "pointer", opacity: currentPage === item.page && item.label === "ホーム" ? 1 : 0.5 }}>
            <div style={{ fontSize: 20 }}>{item.icon}</div>
            <div style={{ fontSize: 10, color: colors.dark, marginTop: 2 }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
