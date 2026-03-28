import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════
   GunMaaS — Final Hi-Fi Prototype (Phase 5)
   Aesthetic: Organic/Natural meets Honest Clarity
   Font: Zen Maru Gothic (warm rounded JP) + DM Sans (clean latin)
   ══════════════════════════════════════════════ */

const C = {
  primary: "#2D6A4F", primaryLight: "#40916C", primaryDark: "#1B4332",
  accent: "#E07A5F", accentDark: "#C4623F",
  sand: "#F2CC8F", sandLight: "#F9E8C9",
  secondary: "#81B29A", secondaryLight: "#A7D7C5",
  text: "#1C2833", textMid: "#4A5568", gray: "#94A3B8",
  bg: "#F8FAF8", white: "#FFFFFF", border: "#E2EDE6",
  overlay: "rgba(27,67,50,0.7)",
};

const font = {
  display: "'Zen Maru Gothic', 'Noto Sans JP', sans-serif",
  body: "'DM Sans', 'Noto Sans JP', sans-serif",
};

// ── Destination Data ──
const destinations = [
  {
    id: "kusatsu", name: "草津温泉", cat: "温泉町", area: "草津・吾妻",
    tagline: "日本三名泉のひとつ、標高1,200mの温泉郷",
    emoji: "♨️", color: C.primary, gradient: `linear-gradient(160deg, #2D6A4F 0%, #52B788 100%)`,
    access: [
      { icon: "🚃", mode: "電車+バス", time: "約3時間", detail: "東京→長野原草津口（特急）→ JRバス 25分" },
      { icon: "🚌", mode: "高速バス", time: "約4時間", detail: "バスタ新宿→草津温泉BT 直行便" },
    ],
    tickets: [
      { name: "草津高原線フリーパス", price: "¥1,540", days: "2日間", desc: "長野原草津口〜草津温泉BT 乗り降り自由" },
      { name: "ぐんまワンデーローカルパス", price: "¥2,600", days: "1日間", desc: "群馬県内のJR線+私鉄が乗り放題" },
    ],
    spots: [
      { name: "湯畑", desc: "草津のシンボル。毎分4,000Lの温泉が湧出" },
      { name: "西の河原公園", desc: "温泉の川が流れる幻想的な散歩道" },
      { name: "熱乃湯", desc: "草津名物「湯もみ」を体験・見学" },
    ],
    booking: [],
    discount: null,
  },
  {
    id: "ikaho", name: "伊香保温泉", cat: "温泉町", area: "渋川",
    tagline: "365段の石段街が続く、万葉集にも詠まれた古湯",
    emoji: "🏯", color: "#8B5E3C", gradient: `linear-gradient(160deg, #8B5E3C 0%, #C49A6C 100%)`,
    access: [{ icon: "🚌", mode: "伊香保ライナー", time: "約60分", detail: "高崎駅東口→伊香保温泉 直通・座席予約制" }],
    tickets: [
      { name: "伊香保温泉フリーパス", price: "¥1,500", days: "2日間", desc: "渋川駅〜伊香保温泉 乗り降り自由" },
      { name: "伊香保ライナー", price: "¥2,000", days: "片道", desc: "高崎駅〜伊香保温泉 直通・予約制" },
    ],
    spots: [
      { name: "石段街", desc: "365段の石段沿いに温泉まんじゅう店や射的" },
      { name: "河鹿橋", desc: "紅葉の名所。秋はライトアップも" },
    ],
    booking: [{ type: "伊香保ライナー予約", desc: "事前座席予約制" }],
    discount: null,
  },
  {
    id: "maebashi", name: "前橋駅", cat: "駅", area: "前橋",
    tagline: "群馬県の県庁所在地、バス路線の中心",
    emoji: "🚉", color: C.secondary, gradient: `linear-gradient(160deg, #81B29A 0%, #40916C 100%)`,
    access: [
      { icon: "🚃", mode: "JR両毛線", time: "約15分", detail: "高崎駅から各駅停車" },
      { icon: "🚃", mode: "上毛電鉄", time: "徒歩10分", detail: "中央前橋駅から連絡" },
    ],
    tickets: [
      { name: "中心市街地乗り放題券", price: "¥500", days: "1日間", desc: "前橋駅周辺200円区間のバスが乗り放題" },
      { name: "サブスクパス Premium", price: "¥8,000", days: "月額", desc: "GunMaaSポイント+乗りトククーポン付き" },
    ],
    spots: [
      { name: "臨江閣", desc: "国指定重要文化財の迎賓館" },
      { name: "けやきウォーク", desc: "前橋駅北口直結のショッピングモール" },
    ],
    booking: [{ type: "タクシー予約", desc: "地図から乗降車地を指定して呼べる" }],
    discount: { cond: "前橋市民", detail: "乗り放題券 ¥500 → ¥360", sub: "マイナンバーカード登録で適用" },
  },
  {
    id: "shibukawa-hosp", name: "渋川の病院へ", cat: "施設", area: "渋川",
    tagline: "通院の移動をもっと気軽に",
    emoji: "🏥", color: C.accent, gradient: `linear-gradient(160deg, #E07A5F 0%, #F2CC8F 100%)`,
    access: [
      { icon: "🚌", mode: "路線バス", time: "各方面", detail: "渋川駅から市内各所へ" },
      { icon: "📱", mode: "呼べば来るバス", time: "予約制", detail: "デマンド交通で自宅近くから乗車" },
    ],
    tickets: [
      { name: "渋川市高齢者割引パス", price: "50%OFF", days: "年度", desc: "65歳以上の渋川市民対象の路線バス割引" },
    ],
    spots: [],
    booking: [
      { type: "デマンド交通予約", desc: "出発・降車バス停と日時を選んで予約" },
      { type: "タクシー予約", desc: "地図から乗降車地を指定" },
    ],
    discount: { cond: "渋川市民65歳以上", detail: "バス50%OFF、タクシー30〜50%OFF", sub: "マイナンバーカード+IC登録で適用" },
  },
];

const segments = [
  { id: "travel", emoji: "🗻", title: "旅する", sub: "温泉・自然・鉄道旅", color: C.primary, grad: `linear-gradient(135deg, ${C.primary}18, ${C.primaryLight}10)`, dests: destinations.filter(d => d.cat === "温泉町") },
  { id: "daily", emoji: "🚌", title: "暮らす", sub: "通勤・通院・おでかけ", color: C.secondary, grad: `linear-gradient(135deg, ${C.secondary}18, ${C.primaryLight}10)`, dests: destinations.filter(d => d.cat !== "温泉町") },
];

const allTickets = destinations.flatMap(d => d.tickets.map(t => ({ ...t, destName: d.name, destId: d.id })));

const tabDefs = [
  { key: "access", label: "アクセス", icon: "🚃" },
  { key: "tickets", label: "チケット", icon: "🎫" },
  { key: "spots", label: "周辺", icon: "📍" },
  { key: "booking", label: "予約", icon: "📱" },
];

// ── Animation helper ──
function FadeIn({ children, delay = 0, style = {} }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.5s ease, transform 0.5s ease", ...style }}>
      {children}
    </div>
  );
}

export default function GunMaaSFinal() {
  const [page, setPage] = useState("top");
  const [dest, setDest] = useState(null);
  const [seg, setSeg] = useState(null);
  const [activeTab, setActiveTab] = useState("access");
  const [ticketFilter, setTicketFilter] = useState("すべて");
  const scrollRef = useRef(null);

  const go = (p, d = null, s = null) => {
    setPage(p);
    if (d) setDest(d);
    if (s) setSeg(s);
    if (p === "place") setActiveTab("access");
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  // ── Search Bar ──
  const SearchBar = ({ overlay }) => (
    <div style={{ background: overlay ? "rgba(255,255,255,0.95)" : C.white, borderRadius: 18, padding: "16px 18px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", backdropFilter: "blur(8px)" }}>
      <div style={{ fontSize: 10, color: C.gray, fontWeight: 600, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase", fontFamily: font.body }}>経路検索</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2.5px solid ${C.primary}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.primary }} />
          </div>
          <input placeholder="出発地を入力" style={{ flex: 1, padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none", fontFamily: font.body, color: C.text, boxSizing: "border-box", background: C.bg }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 20, height: 20, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: `8px solid ${C.accent}` }} />
          </div>
          <input placeholder="目的地を入力" style={{ flex: 1, padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none", fontFamily: font.body, color: C.text, boxSizing: "border-box", background: C.bg }} />
        </div>
        <button style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`, color: C.white, border: "none", borderRadius: 10, padding: "12px 0", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: font.body, width: "100%", letterSpacing: 0.5 }}>経路を検索</button>
      </div>
    </div>
  );

  // ── Header ──
  const Header = () => (
    <div style={{ background: C.white, borderBottom: `1.5px solid ${C.border}`, padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => go("top")}>
        <div style={{ width: 30, height: 30, borderRadius: 10, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontWeight: 800, fontSize: 13, fontFamily: font.body }}>G</div>
        <div>
          <span style={{ fontWeight: 800, fontSize: 15, color: C.primary, fontFamily: font.display }}>Gun</span>
          <span style={{ fontWeight: 800, fontSize: 15, color: C.text, fontFamily: font.display }}>MaaS</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.textMid, fontFamily: font.body, fontWeight: 500 }}>
        <span style={{ cursor: "pointer" }} onClick={() => go("tickets")}>チケット</span>
        <span style={{ cursor: "pointer" }}>FAQ</span>
      </div>
    </div>
  );

  // ── Back Button ──
  const Back = ({ onBack, light }) => (
    <button onClick={onBack} style={{ background: light ? "rgba(255,255,255,0.15)" : `${C.primary}10`, border: "none", borderRadius: 10, padding: "7px 14px", color: light ? C.white : C.primary, fontSize: 12, cursor: "pointer", fontFamily: font.body, fontWeight: 600, backdropFilter: light ? "blur(4px)" : "none", display: "flex", alignItems: "center", gap: 4 }}>
      <span style={{ fontSize: 14 }}>←</span> 戻る
    </button>
  );

  // ── TOP PAGE ──
  const TopPage = () => (
    <div>
      {/* Hero */}
      <div style={{ background: `linear-gradient(160deg, ${C.primaryDark} 0%, ${C.primary} 40%, ${C.primaryLight} 100%)`, padding: "44px 18px 24px", color: C.white, position: "relative", overflow: "hidden" }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -60, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: -30, left: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
        <div style={{ position: "absolute", top: 30, right: 20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.02)" }} />

        <FadeIn>
          <div style={{ fontSize: 10, opacity: 0.6, letterSpacing: 3, fontFamily: font.body, fontWeight: 600, textTransform: "uppercase" }}>Gunma Mobility as a Service</div>
        </FadeIn>
        <FadeIn delay={100}>
          <div style={{ fontSize: 34, fontWeight: 900, marginTop: 8, fontFamily: font.display, letterSpacing: -0.5, lineHeight: 1.15 }}>
            群馬を、<br />つながる。
          </div>
        </FadeIn>
        <FadeIn delay={200}>
          <div style={{ fontSize: 13, opacity: 0.75, marginTop: 8, marginBottom: 24, fontFamily: font.body, lineHeight: 1.6 }}>
            スマホひとつで、群馬のすべての移動がつながります
          </div>
        </FadeIn>
        <FadeIn delay={300}>
          <SearchBar overlay />
        </FadeIn>
      </div>

      {/* Destinations */}
      <div style={{ padding: "28px 18px 12px" }}>
        <FadeIn delay={400}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: C.text, fontWeight: 700, fontFamily: font.display }}>人気の行き先</div>
            <span style={{ fontSize: 11, color: C.primary, fontWeight: 600, cursor: "pointer", fontFamily: font.body }}>すべて →</span>
          </div>
        </FadeIn>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, scrollSnapType: "x mandatory" }}>
          {destinations.map((d, i) => (
            <FadeIn key={d.id} delay={450 + i * 80} style={{ scrollSnapAlign: "start" }}>
              <div onClick={() => go("place", d)} style={{
                minWidth: 155, background: C.white, borderRadius: 16, overflow: "hidden", cursor: "pointer",
                border: `1.5px solid ${C.border}`, transition: "all 0.25s ease", flexShrink: 0,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = d.color; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ background: d.gradient, padding: "14px 14px 10px", color: C.white }}>
                  <div style={{ fontSize: 26 }}>{d.emoji}</div>
                </div>
                <div style={{ padding: "10px 14px 14px" }}>
                  <div style={{ fontSize: 10, color: d.color, fontWeight: 700, fontFamily: font.body, letterSpacing: 0.3, marginBottom: 2 }}>{d.cat}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFamily: font.display }}>{d.name}</div>
                  {d.tickets[0] && <div style={{ fontSize: 11, color: C.gray, fontFamily: font.body, marginTop: 4 }}>{d.tickets[0].price} 〜</div>}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Segments */}
      <div style={{ padding: "12px 18px" }}>
        <FadeIn delay={700}>
          <div style={{ fontSize: 13, color: C.text, fontWeight: 700, fontFamily: font.display, marginBottom: 12 }}>あなたの目的は？</div>
        </FadeIn>
        <div style={{ display: "flex", gap: 10 }}>
          {segments.map((s, i) => (
            <FadeIn key={s.id} delay={750 + i * 100} style={{ flex: 1 }}>
              <div onClick={() => go("segment", null, s)} style={{
                background: s.grad, borderRadius: 16, padding: "22px 16px", cursor: "pointer",
                border: `1.5px solid ${C.border}`, textAlign: "center", transition: "all 0.25s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ fontSize: 34, marginBottom: 6 }}>{s.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 17, color: C.text, fontFamily: font.display }}>{s.title}</div>
                <div style={{ fontSize: 11, color: C.textMid, marginTop: 3, fontFamily: font.body }}>{s.sub}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Tickets */}
      <div style={{ padding: "20px 18px 36px" }}>
        <FadeIn delay={900}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: C.text, fontWeight: 700, fontFamily: font.display }}>人気のチケット</div>
            <span style={{ fontSize: 11, color: C.primary, fontWeight: 600, cursor: "pointer", fontFamily: font.body }} onClick={() => go("tickets")}>すべて見る →</span>
          </div>
        </FadeIn>
        {allTickets.slice(0, 3).map((t, i) => (
          <FadeIn key={i} delay={950 + i * 80}>
            <div style={{ background: C.white, borderRadius: 14, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${C.border}`, marginBottom: 8, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
            >
              <div>
                <div style={{ fontSize: 10, color: C.accent, fontWeight: 700, fontFamily: font.body, letterSpacing: 0.3 }}>{t.destName}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: font.display, marginTop: 2 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: C.gray, fontFamily: font.body, marginTop: 2 }}>{t.days}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 19, fontWeight: 800, color: C.primary, fontFamily: font.body }}>{t.price}</div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );

  // ── SEGMENT PAGE ──
  const SegmentPage = () => {
    if (!seg) return null;
    return (
      <div>
        <div style={{ background: seg.id === "travel" ? `linear-gradient(160deg, ${C.primaryDark}, ${C.primaryLight})` : `linear-gradient(160deg, #3D7A6A, ${C.secondaryLight})`, padding: "20px 18px 24px", color: C.white }}>
          <Back onBack={() => go("top")} light />
          <div style={{ fontSize: 38, marginTop: 12 }}>{seg.emoji}</div>
          <div style={{ fontSize: 26, fontWeight: 900, fontFamily: font.display, marginTop: 4 }}>{seg.title}</div>
          <div style={{ fontSize: 13, opacity: 0.8, fontFamily: font.body, marginTop: 4 }}>{seg.sub}</div>
        </div>
        <div style={{ padding: "20px 18px" }}>
          <SearchBar />
          <div style={{ marginTop: 20, fontSize: 13, color: C.text, fontWeight: 700, fontFamily: font.display, marginBottom: 12 }}>行き先を選ぶ</div>
          {seg.dests.map((d, i) => (
            <FadeIn key={d.id} delay={i * 100}>
              <div onClick={() => go("place", d)} style={{
                background: C.white, borderRadius: 16, padding: "18px", marginBottom: 10, cursor: "pointer",
                border: `1.5px solid ${C.border}`, display: "flex", gap: 14, alignItems: "center", transition: "all 0.25s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = d.color; e.currentTarget.style.transform = "translateX(4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: d.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{d.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: d.color, fontWeight: 700, fontFamily: font.body, letterSpacing: 0.3 }}>{d.cat} · {d.area}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: font.display, marginTop: 1 }}>{d.name}</div>
                  <div style={{ fontSize: 12, color: C.gray, fontFamily: font.body, marginTop: 2 }}>{d.tagline}</div>
                </div>
                <div style={{ color: d.color, fontSize: 20, fontWeight: 300 }}>›</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    );
  };

  // ── PLACE PAGE (Object View) ──
  const PlacePage = () => {
    if (!dest) return null;
    const d = dest;
    const tabs = tabDefs.filter(t =>
      t.key === "access" ? d.access.length > 0 :
      t.key === "tickets" ? d.tickets.length > 0 :
      t.key === "spots" ? d.spots.length > 0 :
      d.booking.length > 0
    );

    return (
      <div>
        <div style={{ background: d.gradient, padding: "20px 18px 24px", color: C.white, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <Back onBack={() => go("top")} light />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
            <div style={{ fontSize: 40 }}>{d.emoji}</div>
            <div>
              <div style={{ fontSize: 10, opacity: 0.7, letterSpacing: 1, fontFamily: font.body, textTransform: "uppercase" }}>{d.cat} · {d.area}</div>
              <div style={{ fontSize: 26, fontWeight: 900, fontFamily: font.display, marginTop: 2 }}>{d.name}</div>
            </div>
          </div>
          <div style={{ fontSize: 13, opacity: 0.8, fontFamily: font.body, marginTop: 8, lineHeight: 1.5 }}>{d.tagline}</div>
          {d.discount && (
            <div style={{ marginTop: 14, background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 14px", backdropFilter: "blur(4px)", display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, fontFamily: font.body }}>{d.discount.cond}の方</div>
                <div style={{ fontSize: 12, opacity: 0.9, fontFamily: font.body, marginTop: 1 }}>{d.discount.detail}</div>
                <div style={{ fontSize: 10, opacity: 0.7, fontFamily: font.body, marginTop: 2 }}>{d.discount.sub}</div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: C.white, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 42, zIndex: 50 }}>
          {tabs.map(tab => {
            const active = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                flex: 1, padding: "11px 0", border: "none", background: "none", cursor: "pointer",
                borderBottom: active ? `2.5px solid ${d.color}` : "2.5px solid transparent",
                color: active ? d.color : C.gray, fontWeight: 600, fontSize: 12, fontFamily: font.body,
                transition: "all 0.2s",
              }}>
                {tab.icon} {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div style={{ padding: "18px" }}>
          {activeTab === "access" && d.access.map((a, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div style={{ background: C.white, borderRadius: 14, padding: "16px", marginBottom: 10, border: `1px solid ${C.border}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${d.color}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: C.text, fontFamily: font.display }}>{a.mode}</span>
                    <span style={{ fontSize: 12, color: d.color, fontWeight: 600, fontFamily: font.body }}>{a.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.textMid, fontFamily: font.body, marginTop: 4, lineHeight: 1.5 }}>{a.detail}</div>
                </div>
              </div>
            </FadeIn>
          ))}

          {activeTab === "tickets" && d.tickets.map((t, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div style={{ background: C.white, borderRadius: 14, padding: "16px", marginBottom: 10, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: C.accent, fontWeight: 700, fontFamily: font.body, letterSpacing: 0.3 }}>{t.days}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: font.display, marginTop: 2 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: C.textMid, fontFamily: font.body, marginTop: 4, lineHeight: 1.5 }}>{t.desc}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: C.primary, fontFamily: font.body }}>{t.price}</div>
                    <button style={{ marginTop: 6, background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`, color: C.white, border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: font.body }}>購入</button>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}

          {activeTab === "spots" && d.spots.map((s, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div style={{ background: C.white, borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: `1px solid ${C.border}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ fontSize: 18, flexShrink: 0 }}>📍</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.text, fontFamily: font.display }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: C.textMid, fontFamily: font.body, marginTop: 2, lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            </FadeIn>
          ))}

          {activeTab === "booking" && d.booking.map((b, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div style={{ background: C.white, borderRadius: 14, padding: "16px", marginBottom: 10, border: `1px solid ${C.border}` }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.text, fontFamily: font.display }}>{b.type}</div>
                <div style={{ fontSize: 12, color: C.textMid, fontFamily: font.body, marginTop: 4, lineHeight: 1.5, marginBottom: 12 }}>{b.desc}</div>
                <button style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: C.white, border: "none", borderRadius: 10, padding: "12px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: font.body, width: "100%", letterSpacing: 0.5 }}>予約する</button>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    );
  };

  // ── TICKETS PAGE ──
  const TicketsPage = () => {
    const cats = ["すべて", "観光", "通勤", "割引"];
    const isMatch = t => {
      if (ticketFilter === "すべて") return true;
      if (ticketFilter === "観光") return t.days.includes("日間") || t.days === "片道";
      if (ticketFilter === "通勤") return t.days.includes("月額") || t.days === "1日間";
      if (ticketFilter === "割引") return t.price.includes("OFF");
      return true;
    };
    const filtered = allTickets.filter(isMatch);

    return (
      <div>
        <div style={{ background: `linear-gradient(160deg, ${C.primaryDark}, ${C.primary})`, padding: "20px 18px 24px", color: C.white }}>
          <Back onBack={() => go("top")} light />
          <div style={{ fontSize: 24, fontWeight: 900, fontFamily: font.display, marginTop: 12 }}>チケット一覧</div>
          <div style={{ fontSize: 13, opacity: 0.75, fontFamily: font.body, marginTop: 4 }}>{allTickets.length}件のチケット</div>
        </div>
        <div style={{ padding: "14px 18px 8px", display: "flex", gap: 7, overflowX: "auto" }}>
          {cats.map(cat => (
            <button key={cat} onClick={() => setTicketFilter(cat)} style={{
              background: ticketFilter === cat ? C.primary : C.white,
              color: ticketFilter === cat ? C.white : C.text,
              border: `1.5px solid ${ticketFilter === cat ? C.primary : C.border}`,
              borderRadius: 20, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer",
              whiteSpace: "nowrap", fontFamily: font.body, transition: "all 0.2s",
            }}>{cat}</button>
          ))}
        </div>
        <div style={{ padding: "10px 18px 36px" }}>
          {filtered.map((t, i) => (
            <FadeIn key={i} delay={i * 60}>
              <div onClick={() => { const d = destinations.find(dd => dd.id === t.destId); if (d) go("place", d); }}
                style={{ background: C.white, borderRadius: 14, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${C.border}`, marginBottom: 8, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
              >
                <div>
                  <div style={{ fontSize: 10, color: C.accent, fontWeight: 700, fontFamily: font.body, letterSpacing: 0.3 }}>{t.destName} · {t.days}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: font.display, marginTop: 2 }}>{t.name}</div>
                  {t.desc && <div style={{ fontSize: 11, color: C.gray, fontFamily: font.body, marginTop: 3, lineHeight: 1.4 }}>{t.desc}</div>}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                  <div style={{ fontSize: 19, fontWeight: 800, color: C.primary, fontFamily: font.body }}>{t.price}</div>
                  <button onClick={e => e.stopPropagation()} style={{ marginTop: 4, background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`, color: C.white, border: "none", borderRadius: 8, padding: "5px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: font.body }}>購入</button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    );
  };

  // ── Bottom Nav ──
  const BottomNav = () => (
    <div style={{ position: "sticky", bottom: 0, background: C.white, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-around", padding: "6px 0 10px", zIndex: 100 }}>
      {[
        { icon: "🏠", label: "ホーム", p: "top" },
        { icon: "🔍", label: "検索", p: "top" },
        { icon: "🎫", label: "チケット", p: "tickets" },
        { icon: "👤", label: "マイページ", p: "top" },
      ].map((item, i) => {
        const isActive = (item.p === "top" && page === "top" && item.label === "ホーム") || (item.p === "tickets" && page === "tickets");
        return (
          <div key={i} onClick={() => go(item.p)} style={{ textAlign: "center", cursor: "pointer", transition: "opacity 0.2s" }}>
            <div style={{ fontSize: 19, opacity: isActive ? 1 : 0.4 }}>{item.icon}</div>
            <div style={{ fontSize: 9, color: isActive ? C.primary : C.gray, marginTop: 1, fontWeight: isActive ? 700 : 400, fontFamily: font.body }}>{item.label}</div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div ref={scrollRef} style={{ maxWidth: 420, margin: "0 auto", background: C.bg, minHeight: "100vh", fontFamily: font.body, position: "relative", boxShadow: "0 0 60px rgba(0,0,0,0.06)", overflowY: "auto" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Zen+Maru+Gothic:wght@400;500;700;900&display=swap" rel="stylesheet" />
      <Header />
      {page === "top" && <TopPage />}
      {page === "segment" && <SegmentPage />}
      {page === "place" && <PlacePage />}
      {page === "tickets" && <TicketsPage />}
      <BottomNav />
    </div>
  );
}
