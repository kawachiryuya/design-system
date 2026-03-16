import { useState, useRef } from "react";

// ═══════════════════════════════════════
// SHARED CONSTANTS
// ═══════════════════════════════════════
const C = {
  primary: "#2D6A4F", primaryLight: "#40916C", primaryDark: "#1B4332",
  accent: "#E07A5F", accentDark: "#C4623F",
  sand: "#F2CC8F", sandLight: "#FDF6E8",
  secondary: "#81B29A",
  text: "#1C2833", textMid: "#4A5568", gray: "#94A3B8", lightGray: "#CBD5E1",
  bg: "#F7FAF8", white: "#FFFFFF", border: "#E2EDE6",
  ticketBg: "#F0FAF4",
  mapBg: "#E8F0E8", mapWater: "#B8D4E3",
  demandZone1: "rgba(224,122,95,0.15)", demandZone1Border: "rgba(224,122,95,0.4)",
  demandZone2: "rgba(129,178,154,0.15)", demandZone2Border: "rgba(129,178,154,0.4)",
  success: "#16A34A", successBg: "#F0FDF4",
};
const font = "'Noto Sans JP', -apple-system, sans-serif";

// ═══════════════════════════════════════
// HOME TAB DATA
// ═══════════════════════════════════════
const places = [
  { id: "kusatsu", name: "草津温泉", emoji: "♨️", cat: "観光", x: 115, y: 65, ticket: "¥1,540〜" },
  { id: "shima", name: "四万温泉", emoji: "♨️", cat: "観光", x: 165, y: 105, ticket: "¥2,000〜" },
  { id: "ikaho", name: "伊香保温泉", emoji: "♨️", cat: "観光", x: 205, y: 155, ticket: "¥1,500〜" },
  { id: "minakami", name: "みなかみ", emoji: "🏔", cat: "観光", x: 215, y: 50, ticket: "¥3,500〜" },
  { id: "maebashi", name: "前橋駅", emoji: "🚉", cat: "駅・バス停", x: 240, y: 248, ticket: "¥500〜" },
  { id: "takasaki", name: "高崎駅", emoji: "🚉", cat: "駅・バス停", x: 195, y: 260, ticket: null },
  { id: "shibukawa", name: "渋川駅", emoji: "🚉", cat: "駅・バス停", x: 225, y: 190, ticket: null },
  { id: "kiryu", name: "桐生駅", emoji: "🚉", cat: "駅・バス停", x: 320, y: 235, ticket: null },
  { id: "akagi", name: "赤城山", emoji: "⛰️", cat: "観光", x: 270, y: 145, ticket: null },
  { id: "oze", name: "尾瀬", emoji: "🌿", cat: "観光", x: 250, y: 30, ticket: "¥4,000〜" },
  { id: "tomioka", name: "富岡製糸場", emoji: "🏛", cat: "観光", x: 135, y: 290, ticket: null },
  { id: "hospital", name: "前橋赤十字病院", emoji: "🏥", cat: "施設", x: 260, y: 230, ticket: null },
];
const railLines = [
  { name: "JR上越線", color: "#16A34A", points: [[195,260],[210,225],[225,190],[215,130],[215,50]], dash: false },
  { name: "JR吾妻線", color: "#F59E0B", points: [[225,190],[190,165],[165,140],[135,105],[115,80]], dash: false },
  { name: "JR両毛線", color: "#F59E0B", points: [[195,260],[240,248],[290,240],[320,235]], dash: false },
  { name: "上毛電鉄", color: "#DC2626", points: [[235,252],[270,245],[305,238],[320,235]], dash: true },
  { name: "わたらせ渓谷鐵道", color: "#7C3AED", points: [[320,235],[340,210],[350,175]], dash: true },
  { name: "上信電鉄", color: "#0891B2", points: [[195,260],[165,275],[130,290],[95,305]], dash: true },
];
const busRoutes = [
  { name: "草津高原線", color: "#2563EB", points: [[135,105],[120,85],[115,65]], dash: true },
  { name: "伊香保方面", color: "#2563EB", points: [[225,190],[215,170],[205,155]], dash: true },
];
const demandZones = [
  { id: "runrun", name: "るんるんバス", area: "富士見・芳賀地区", color: C.demandZone1, border: C.demandZone1Border, cx: 255, cy: 200, rx: 35, ry: 28, fare: "300円（市民200円）", booking: "前日までに予約" },
  { id: "furusato", name: "ふるさとバス", area: "大胡・宮城・粕川地区", color: C.demandZone2, border: C.demandZone2Border, cx: 300, cy: 195, rx: 30, ry: 25, fare: "300円（市民200円）", booking: "前日までに予約" },
  { id: "shibunori", name: "しぶのり", area: "渋川市内", color: C.demandZone1, border: C.demandZone1Border, cx: 225, cy: 170, rx: 28, ry: 22, fare: "300円（高齢者150円）", booking: "前日までに予約" },
];
const categories = [
  { id: "all", label: "すべて", emoji: "📍" },
  { id: "観光", label: "観光", emoji: "🗻" },
  { id: "駅・バス停", label: "駅・バス停", emoji: "🚉" },
  { id: "施設", label: "施設", emoji: "🏥" },
];

// ═══════════════════════════════════════
// SEARCH TAB DATA
// ═══════════════════════════════════════
const kusatsuRoutes = [
  { id: 1, dep: "13:20", arr: "15:12", dur: "1時間52分", cost: "¥3,481", transfers: 1,
    badges: ["早","楽"], badgeColors: ["#2563EB","#16A34A"],
    segments: [
      { type: "walk", from: "高崎駅", to: "高崎", dur: "3分", dist: "0.2km" },
      { type: "train", from: "高崎", to: "長野原草津口", line: "JR吾妻線・特急草津", dur: "1時間15分", stops: 8, color: "#F59E0B", depTime: "13:23", arrTime: "14:38" },
      { type: "walk", from: "長野原草津口", to: "長野原草津口/JRバス", dur: "3分", dist: "0.1km" },
      { type: "bus", from: "長野原草津口", to: "草津温泉BT", line: "JRバス関東", dur: "25分", stops: 22, color: "#2563EB", depTime: "14:51", arrTime: "15:16", ticketHint: "草津高原線フリーパス対象", toPlaceLink: { name: "草津温泉", id: "kusatsu" } },
      { type: "walk", from: "草津温泉BT", to: "草津温泉", dur: "4分", dist: "0.3km", toPlaceLink: { name: "草津温泉", id: "kusatsu" } },
    ],
    tickets: [
      { id: "t1", label: "おすすめ", name: "ぐんまワンデーローカルパス", price: "¥2,600", days: "1日間", desc: "JR区間+県内私鉄が乗り放題。バス区間は別途。", saving: null },
      { id: "t2", label: "バス区間をお得に", name: "草津高原線フリーパス", price: "¥1,540", days: "2日間", desc: "長野原草津口〜草津温泉BTの往復が2日間乗り放題。", saving: "往復で¥920お得" },
      { id: "t3", label: "チケットなし", name: "通常運賃（IC優先）", price: "¥3,481", days: "—", desc: "交通系ICカードでそのまま乗車。", saving: null },
    ],
    bestTicket: { name: "草津高原線フリーパス", price: "¥1,540", note: "バス区間2日間乗り放題" },
  },
  { id: 2, dep: "13:42", arr: "16:02", dur: "2時間20分", cost: "¥2,001", transfers: 1,
    badges: ["安","楽"], badgeColors: ["#EA580C","#16A34A"],
    segments: [
      { type: "walk", from: "高崎駅", to: "高崎", dur: "2分", dist: "0.1km" },
      { type: "train", from: "高崎", to: "長野原草津口", line: "JR吾妻線・普通", dur: "1時間40分", stops: 15, color: "#F59E0B", depTime: "13:44", arrTime: "15:24" },
      { type: "walk", from: "長野原草津口", to: "長野原草津口/JRバス", dur: "3分", dist: "0.1km" },
      { type: "bus", from: "長野原草津口", to: "草津温泉BT", line: "JRバス関東", dur: "25分", stops: 22, color: "#2563EB", depTime: "15:33", arrTime: "15:58", ticketHint: "草津高原線フリーパス対象", toPlaceLink: { name: "草津温泉", id: "kusatsu" } },
      { type: "walk", from: "草津温泉BT", to: "草津温泉", dur: "4分", dist: "0.3km", toPlaceLink: { name: "草津温泉", id: "kusatsu" } },
    ],
    tickets: [
      { id: "t4", label: "おすすめ", name: "草津高原線フリーパス", price: "¥1,540", days: "2日間", desc: "バス往復がお得に。", saving: "往復で¥920お得" },
      { id: "t5", label: "チケットなし", name: "通常運賃（IC優先）", price: "¥2,001", days: "—", desc: "交通系ICカードでそのまま乗車。", saving: null },
    ],
    bestTicket: { name: "草津高原線フリーパス", price: "¥1,540", note: "バス区間2日間乗り放題" },
  },
];
const maebashiRoutes = [
  { id: 10, dep: "14:32", arr: "15:02", dur: "30分", cost: "¥209", transfers: 0,
    badges: ["安","早","楽"], badgeColors: ["#EA580C","#2563EB","#16A34A"],
    segments: [
      { type: "walk", from: "前橋駅", to: "前橋", dur: "2分", dist: "0.1km" },
      { type: "train", from: "前橋", to: "高崎", line: "JR両毛線・高崎行", dur: "25分", stops: 3, color: "#F59E0B", depTime: "14:34", arrTime: "14:59" },
      { type: "walk", from: "高崎", to: "高崎駅", dur: "2分", dist: "0.1km" },
    ],
    tickets: [
      { id: "t10", label: "おすすめ", name: "中心市街地乗り放題券", price: "¥500", days: "1日間", desc: "前橋駅周辺バスが1日乗り放題。", saving: "バス往復で¥100以上お得" },
      { id: "t12", label: "チケットなし", name: "通常運賃（IC優先）", price: "¥209", days: "—", desc: "交通系ICカードでそのまま乗車。", saving: null },
    ],
    bestTicket: { name: "中心市街地乗り放題券", price: "¥500", note: "前橋バス1日乗り放題" },
    discount: { cond: "前橋市民", detail: "¥500 → ¥360（マイナンバーカード登録時）" },
  },
];
const fujimiRoutes = [
  { id: 99, dep: "15:12", arr: "17:59", dur: "2時間47分", cost: "¥6,355", transfers: 5,
    badges: [], badgeColors: [],
    segments: [
      { type: "walk", from: "富士見公民館", to: "タクシー乗車", dur: "1分", dist: "—" },
      { type: "train", from: "タクシー", to: "入曽駅", line: "タクシー（1.5km）", dur: "6分", stops: 0, color: "#6B7280", depTime: "15:12", arrTime: "15:18" },
      { type: "train", from: "入曽", to: "本川越", line: "西武新宿線", dur: "12分", stops: 4, color: "#2563EB", depTime: "15:30", arrTime: "15:42" },
      { type: "walk", from: "本川越", to: "川越駅", dur: "15分", dist: "1.2km" },
      { type: "train", from: "川越", to: "大宮", line: "JR川越線快速", dur: "22分", stops: 5, color: "#EA580C", depTime: "15:58", arrTime: "16:27" },
      { type: "train", from: "大宮", to: "高崎", line: "新幹線とき329号", dur: "33分", stops: 3, color: "#16A34A", depTime: "16:41", arrTime: "17:14" },
      { type: "train", from: "高崎", to: "前橋大島", line: "JR両毛線", dur: "18分", stops: 5, color: "#F59E0B", depTime: "17:22", arrTime: "17:40" },
      { type: "walk", from: "前橋大島駅", to: "タクシー乗車", dur: "1分", dist: "—" },
      { type: "train", from: "タクシー", to: "前橋赤十字病院", line: "タクシー（2km）", dur: "8分", stops: 0, color: "#6B7280", depTime: "17:51", arrTime: "17:59" },
    ],
    tickets: [{ id: "t99", label: "チケットなし", name: "通常運賃", price: "¥6,355", days: "—", desc: "埼玉県経由。現実的ではありません。", saving: null }],
    bestTicket: null,
  },
];
const scenarios = [
  { id: "kusatsu", label: "P1: 観光", from: "高崎駅", to: "草津温泉", showContext: false, routes: kusatsuRoutes },
  { id: "maebashi", label: "P2: 通勤", from: "前橋駅", to: "高崎駅", showContext: false, routes: maebashiRoutes },
  { id: "fujimi", label: "P3: 通院", from: "富士見公民館", to: "前橋赤十字病院", showContext: true, routes: fujimiRoutes },
];
const contextCard = {
  title: "このエリアでは「呼べば来るバス」が使えます",
  desc: "るんるんバス（富士見・芳賀地区）— 予約制の乗合バス。運賃300円（前橋市民200円）。",
  action: "予約する →",
  discount: "前橋市民・65歳以上の方は敬老割引パスで割引あり",
};

// ═══════════════════════════════════════
// MYPAGE DATA
// ═══════════════════════════════════════
const REG_STATES = {
  none: { jre: false, ic: false, mynumber: false },
  jre_only: { jre: true, ic: false, mynumber: false },
  jre_ic: { jre: true, ic: true, mynumber: false },
  all: { jre: true, ic: true, mynumber: true },
};

// ═══════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════
function Badge({ text, color }) {
  return <span style={{ display: "inline-block", border: `1.5px solid ${color}`, color, borderRadius: 4, padding: "1px 6px", fontSize: 11, fontWeight: 700, marginLeft: 4 }}>{text}</span>;
}
function MenuItemRow({ icon, label, sub, highlight, danger }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", cursor: "pointer", background: highlight ? C.sandLight : "transparent" }}>
      <span style={{ fontSize: 17, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: danger ? C.accent : C.text }}>{label}</div>{sub && <div style={{ fontSize: 11, color: C.gray, marginTop: 1 }}>{sub}</div>}</div>
      <span style={{ color: C.lightGray, fontSize: 14 }}>›</span>
    </div>
  );
}
function Divider() { return <div style={{ height: 1, background: C.border, margin: "0 16px" }} />; }

// ═══════════════════════════════════════
// HOME TAB
// ═══════════════════════════════════════
function HomeTab({ onNavigateSearch, onOpenPlace }) {
  const [activeCat, setActiveCat] = useState("all");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [sheetHeight, setSheetHeight] = useState(52);
  const [layers, setLayers] = useState({ network: true, demand: true });
  const [layerPanel, setLayerPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const inputRef = useRef(null);
  const dragStart = useRef(null);
  const dragH = useRef(null);
  const SMIN = 52, SMID = 320, SMAX = 520;
  const filteredPlaces = activeCat === "all" ? places : places.filter(p => p.cat === activeCat);
  const filteredSheet = activeCat === "all" ? places.filter(p => p.ticket) : filteredPlaces;

  const searchHistory = [
    { emoji: "🕐", name: "草津温泉", sub: "観光 · 吾妻郡" },
    { emoji: "🕐", name: "前橋駅", sub: "駅・バス停" },
    { emoji: "🕐", name: "伊香保温泉", sub: "観光 · 渋川市" },
  ];
  const searchResults = searchQuery.length > 0
    ? places.filter(p => p.name.includes(searchQuery))
    : [];
  const closeSearch = () => { setSearchFocused(false); setSearchQuery(""); if (inputRef.current) inputRef.current.blur(); };

  const onTS = (e) => { dragStart.current = e.touches[0].clientY; dragH.current = sheetHeight; };
  const onTM = (e) => { if (!dragStart.current) return; setSheetHeight(Math.max(SMIN, Math.min(SMAX, dragH.current + (dragStart.current - e.touches[0].clientY)))); };
  const onTE = () => { dragStart.current = null; const h = sheetHeight; const snaps = [SMIN,SMID,SMAX]; snaps.sort((a,b) => Math.abs(h-a) - Math.abs(h-b)); setSheetHeight(snaps[0]); };
  const onMD = (e) => {
    dragStart.current = e.clientY; dragH.current = sheetHeight;
    const mm = (ev) => setSheetHeight(Math.max(SMIN, Math.min(SMAX, dragH.current + (dragStart.current - ev.clientY))));
    const mu = () => { dragStart.current = null; const h = sheetHeight; const snaps = [SMIN,SMID,SMAX]; snaps.sort((a,b) => Math.abs(h-a)-Math.abs(h-b)); setSheetHeight(snaps[0]); window.removeEventListener("mousemove",mm); window.removeEventListener("mouseup",mu); };
    window.addEventListener("mousemove",mm); window.addEventListener("mouseup",mu);
  };
  const handleTap = () => { if (sheetHeight <= SMIN+10) setSheetHeight(SMID); else if (sheetHeight >= SMAX-10) setSheetHeight(SMIN); };
  const selectP = (p) => { setSelectedPlace(p); setSelectedZone(null); if (sheetHeight > SMIN+10) setSheetHeight(SMIN); };

  return (
    <div style={{ position: "relative", height: "calc(100vh - 48px)", overflow: "hidden", background: C.mapBg }}>
      {/* MAP */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <svg viewBox="0 0 400 360" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", background: C.mapBg }}>
          <defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C8D8C0" stopOpacity="0.5"/><stop offset="100%" stopColor={C.mapBg} stopOpacity="0"/></linearGradient></defs>
          <rect x="0" y="0" width="400" height="130" fill="url(#mg)"/>
          <path d="M180 320Q200 280 240 260Q280 240 330 250Q360 258 400 270" fill="none" stroke={C.mapWater} strokeWidth="3" opacity="0.5"/>
          {layers.demand && demandZones.map(z => (<g key={z.id} onClick={() => { setSelectedZone(z); setSelectedPlace(null); if(sheetHeight>SMIN+10)setSheetHeight(SMIN); }} style={{cursor:"pointer"}}><ellipse cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry} fill={z.color} stroke={z.border} strokeWidth="1.5" strokeDasharray="4,3"/><text x={z.cx} y={z.cy+1} textAnchor="middle" fontSize="7" fill={C.accent} fontWeight="600" opacity="0.7">{z.name}</text></g>))}
          {layers.network && railLines.map((l,i) => (<polyline key={i} points={l.points.map(p=>p.join(",")).join(" ")} fill="none" stroke={l.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={l.dash?"6,4":"none"} opacity="0.6"/>))}
          {layers.network && busRoutes.map((l,i) => (<polyline key={`b${i}`} points={l.points.map(p=>p.join(",")).join(" ")} fill="none" stroke={l.color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3,3" opacity="0.45"/>))}
          {filteredPlaces.map(p => { const sel = selectedPlace?.id===p.id; return (<g key={p.id} onClick={()=>selectP(p)} style={{cursor:"pointer"}}>{sel && <circle cx={p.x} cy={p.y} r="20" fill={C.primary} opacity="0.12"/>}<circle cx={p.x} cy={p.y} r={sel?16:13} fill={C.white} stroke={sel?C.primary:C.gray} strokeWidth={sel?2.5:1.5}/><text x={p.x} y={p.y+(sel?5:4)} textAnchor="middle" fontSize={sel?13:11}>{p.emoji}</text></g>); })}
          {filteredPlaces.filter(p=>["駅・バス停","観光"].includes(p.cat)).map(p => (<text key={`l${p.id}`} x={p.x} y={p.y+24} textAnchor="middle" fontSize="8" fill={C.text} fontWeight="600" opacity="0.6">{p.name}</text>))}
          <text x="75" y="315" fontSize="30" fill={C.primary} opacity="0.05" fontWeight="900">群馬県</text>
        </svg>
      </div>
      {/* TOP OVERLAY */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, pointerEvents: "none" }}>
        <div style={{ height: 10 }} />
        <div style={{ padding: "0 16px", pointerEvents: "auto" }}>
          <div style={{ background: searchFocused ? C.white : "rgba(255,255,255,0.95)", borderRadius: searchFocused ? "14px 14px 0 0" : 14, padding: "12px 16px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 10 }}>
            {searchFocused ? (
              <button onClick={closeSearch} style={{ background: "none", border: "none", fontSize: 16, color: C.gray, cursor: "pointer", padding: 0, flexShrink: 0 }}>←</button>
            ) : (
              <span style={{ fontSize: 16, color: C.gray }}>🔍</span>
            )}
            <input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { setSearchFocused(true); setSelectedPlace(null); setSelectedZone(null); }}
              placeholder="どこに行く？"
              style={{ flex: 1, fontSize: 14, color: C.text, border: "none", outline: "none", background: "transparent", fontFamily: font, fontWeight: 500 }}
            />
            {!searchFocused && (
              <button onClick={() => onNavigateSearch()} style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`, color: C.white, border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: font, flexShrink: 0 }}>経路を検索</button>
            )}
            {searchFocused && searchQuery.length > 0 && (
              <button onClick={() => setSearchQuery("")} style={{ background: C.bg, border: "none", borderRadius: "50%", width: 24, height: 24, fontSize: 12, color: C.gray, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
            )}
          </div>
          {/* Suggest panel */}
          {searchFocused && (
            <div style={{ background: C.white, borderRadius: "0 0 14px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", maxHeight: 320, overflowY: "auto" }}>
              {searchQuery.length === 0 ? (
                <div>
                  <div style={{ padding: "12px 16px 6px", fontSize: 11, fontWeight: 700, color: C.gray }}>最近の検索</div>
                  {searchHistory.map((h, i) => (
                    <div key={i} onClick={() => { closeSearch(); onNavigateSearch(h.name); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", cursor: "pointer", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                      <span style={{ fontSize: 16, color: C.gray }}>{h.emoji}</span>
                      <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{h.name}</div><div style={{ fontSize: 11, color: C.gray }}>{h.sub}</div></div>
                      <span style={{ color: C.lightGray, fontSize: 14 }}>›</span>
                    </div>
                  ))}
                  <div style={{ padding: "12px 16px 6px", fontSize: 11, fontWeight: 700, color: C.gray, borderTop: `1px solid ${C.border}` }}>人気の行き先</div>
                  {places.filter(p => p.ticket).slice(0, 3).map((p, i) => (
                    <div key={p.id} onClick={() => { closeSearch(); onNavigateSearch(p.name); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", cursor: "pointer", borderTop: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: 16 }}>{p.emoji}</span>
                      <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{p.name}</div><div style={{ fontSize: 11, color: C.gray }}>{p.cat}</div></div>
                      {p.ticket && <div style={{ fontSize: 11, color: C.primary, fontWeight: 600 }}>🎫 {p.ticket}</div>}
                    </div>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  {searchResults.map((p, i) => (
                    <div key={p.id} onClick={() => { closeSearch(); onNavigateSearch(p.name); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                      <span style={{ fontSize: 16 }}>{p.emoji}</span>
                      <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{p.name}</div><div style={{ fontSize: 11, color: C.gray }}>{p.cat}</div></div>
                      <span style={{ color: C.lightGray, fontSize: 14 }}>›</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "24px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 13, color: C.gray }}>「{searchQuery}」に一致する行き先がありません</div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Category chips - hide when search is focused */}
        {!searchFocused && (
        <div style={{ padding: "10px 16px 0", display: "flex", gap: 6, overflowX: "auto", pointerEvents: "auto" }}>
          {categories.map(c => (<button key={c.id} onClick={()=>{setActiveCat(c.id);setSelectedPlace(null);setSelectedZone(null);}} style={{ display:"flex",alignItems:"center",gap:4,padding:"6px 12px",borderRadius:20,border:"none",background:activeCat===c.id?C.primary:"rgba(255,255,255,0.92)",color:activeCat===c.id?C.white:C.text,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font,flexShrink:0,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",whiteSpace:"nowrap"}}><span style={{fontSize:13}}>{c.emoji}</span> {c.label}</button>))}
        </div>
        )}
      </div>
      {/* Search overlay backdrop */}
      {searchFocused && <div onClick={closeSearch} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 15 }} />}
      {/* PLACE POPUP */}
      {selectedPlace && (<div style={{ position: "absolute", bottom: sheetHeight+8, left: 16, right: 16, zIndex: 30 }}>
        <div style={{ background: C.white, borderRadius: 16, padding: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: C.ticketBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{selectedPlace.emoji}</div>
              <div><div style={{ fontSize: 10, color: C.primary, fontWeight: 700 }}>{selectedPlace.cat}</div><div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{selectedPlace.name}</div>{selectedPlace.ticket && <div style={{ fontSize: 12, color: C.primary, fontWeight: 600, marginTop: 2 }}>🎫 {selectedPlace.ticket}</div>}</div>
            </div>
            <button onClick={()=>setSelectedPlace(null)} style={{ background: C.bg, border: "none", borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontSize: 12, color: C.gray }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button onClick={() => onNavigateSearch()} style={{ flex: 1, background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`, color: C.white, border: "none", borderRadius: 10, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: font }}>ここへ行く</button>
            <button onClick={() => onOpenPlace && onOpenPlace(selectedPlace.id)} style={{ flex: 1, background: C.white, color: C.primary, border: `1.5px solid ${C.primary}`, borderRadius: 10, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: font }}>詳しく見る</button>
          </div>
        </div>
      </div>)}
      {/* ZONE POPUP */}
      {selectedZone && (<div style={{ position: "absolute", bottom: sheetHeight+8, left: 16, right: 16, zIndex: 30 }}>
        <div style={{ background: C.white, borderRadius: 16, padding: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: C.sandLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📱</div>
              <div><div style={{ fontSize: 10, color: C.accent, fontWeight: 700 }}>呼べば来るバス</div><div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{selectedZone.name}</div><div style={{ fontSize: 12, color: C.textMid }}>{selectedZone.area}</div></div>
            </div>
            <button onClick={()=>setSelectedZone(null)} style={{ background: C.bg, border: "none", borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontSize: 12, color: C.gray }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12, padding: "10px 12px", background: C.bg, borderRadius: 10 }}>
            <div><div style={{fontSize:10,color:C.gray}}>運賃</div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{selectedZone.fare}</div></div>
            <div><div style={{fontSize:10,color:C.gray}}>予約</div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{selectedZone.booking}</div></div>
          </div>
          <button style={{ marginTop: 12, width: "100%", background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`, color: C.white, border: "none", borderRadius: 10, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: font }}>予約する</button>
        </div>
      </div>)}
      {/* LAYER CONTROL - bottom right */}
      <div style={{ position: "absolute", bottom: sheetHeight + 12, right: 16, zIndex: 22, pointerEvents: "auto" }}>
        {layerPanel && (
          <div style={{ background: "rgba(255,255,255,0.97)", borderRadius: 14, padding: "12px 14px", marginBottom: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", minWidth: 170 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text, marginBottom: 8 }}>マップの表示</div>
            {[
              { key: "network", icon: "🚃", label: "鉄道路線" },
              { key: "demand", icon: "📱", label: "呼べば来るバス" },
            ].map(l => (
              <div key={l.key} onClick={() => setLayers(prev => ({ ...prev, [l.key]: !prev[l.key] }))} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 0", cursor: "pointer",
                borderTop: l.key !== "network" ? `1px solid ${C.border}` : "none",
              }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: layers[l.key] ? C.ticketBg : C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, border: `1.5px solid ${layers[l.key] ? C.primary : C.border}` }}>{l.icon}</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text, flex: 1 }}>{l.label}</span>
                <div style={{ width: 36, height: 20, borderRadius: 10, background: layers[l.key] ? C.primary : C.lightGray, padding: 2, cursor: "pointer", transition: "background 0.2s" }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: C.white, transform: layers[l.key] ? "translateX(16px)" : "translateX(0)", transition: "transform 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                </div>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => setLayerPanel(prev => !prev)} style={{
          width: 42, height: 42, borderRadius: 12, border: `1.5px solid ${layerPanel ? C.primary : C.border}`,
          background: layerPanel ? C.ticketBg : "rgba(255,255,255,0.95)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)", marginLeft: "auto",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={layerPanel ? C.primary : C.gray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </button>
      </div>
      {/* BOTTOM SHEET */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 25, height: sheetHeight, maxHeight: SMAX, background: C.white, borderRadius: "20px 20px 0 0", boxShadow: "0 -4px 24px rgba(0,0,0,0.08)", transition: dragStart.current?"none":"height 0.35s cubic-bezier(0.32,0.72,0,1)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE} onMouseDown={onMD} onClick={handleTap} style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px", cursor: "grab", flexShrink: 0 }}><div style={{ width: 36, height: 4, borderRadius: 2, background: C.lightGray }}/></div>
        <div style={{ padding: "0 20px 8px", flexShrink: 0 }}><div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>{activeCat==="all"?"人気の行き先":`${categories.find(c=>c.id===activeCat)?.emoji} ${categories.find(c=>c.id===activeCat)?.label}`}</div><div style={{ fontSize: 11, color: C.gray, marginTop: 1 }}>{filteredSheet.length}件</div></div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}>
          {filteredSheet.map(p => (<div key={p.id} onClick={()=>selectP(p)} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px", background: selectedPlace?.id===p.id?C.ticketBg:C.white, borderRadius: 14, marginBottom: 8, border: selectedPlace?.id===p.id?`1.5px solid ${C.primary}30`:`1px solid ${C.border}`, cursor: "pointer" }}><div style={{ width:42,height:42,borderRadius:12,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>{p.emoji}</div><div style={{ flex:1 }}><div style={{ fontSize:14,fontWeight:700,color:C.text }}>{p.name}</div><div style={{ fontSize:11,color:C.gray }}>{p.cat}</div></div>{p.ticket && <div style={{ fontSize:11,color:C.primary,fontWeight:600 }}>🎫 {p.ticket}</div>}<span style={{ color:C.lightGray,fontSize:14 }}>›</span></div>))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// PLACE DETAIL PAGE (行き先オブジェクト)
// ═══════════════════════════════════════
const placeData = {
  kusatsu: {
    name: "草津温泉", emoji: "♨️", cat: "観光", area: "吾妻郡草津町",
    desc: "日本三名泉のひとつ。湯畑を中心とした温泉街で、毎分32,300リットル以上の湧出量は日本一。",
    tabs: {
      info: {
        address: "〒377-1711 群馬県吾妻郡草津町草津",
        phone: "0279-88-0800（草津温泉観光協会）",
        hours: "湯畑周辺: 24時間 / 各施設: 施設により異なる",
        access: [
          { from: "高崎駅", method: "JR吾妻線 → JRバス", dur: "約2時間", cost: "¥3,481" },
          { from: "東京駅", method: "新幹線+JR吾妻線+バス", dur: "約3時間", cost: "¥5,690" },
          { from: "長野原草津口", method: "JRバス関東", dur: "約25分", cost: "¥710" },
        ],
        booking: [
          { type: "JRバス関東", desc: "長野原草津口 → 草津温泉BT（予約不要・ICカード利用可）" },
          { type: "タクシー", desc: "長野原草津口駅前から約25分。料金目安¥6,000前後。" },
          { type: "レンタカー", desc: "関越道渋川伊香保ICから約90分。駐車場あり（天狗山P 無料）。" },
        ],
      },
      tickets: [
        { name: "草津高原線フリーパス", price: "¥1,540", days: "2日間", desc: "長野原草津口〜草津温泉BTの往復が2日間乗り放題。" },
        { name: "ぐんまワンデーローカルパス", price: "¥2,600", days: "1日間", desc: "県内JR+私鉄が1日乗り放題。バス区間は別途。" },
        { name: "草津温泉まるごとパス", price: "¥4,200", days: "3日間", desc: "交通+温泉入浴+飲食クーポンのセット。" },
      ],
      nearby: [
        { name: "湯畑", emoji: "♨️", dist: "徒歩3分", desc: "草津のシンボル。毎分4,000リットルの温泉が湧出。" },
        { name: "西の河原公園", emoji: "🌿", dist: "徒歩8分", desc: "温泉の川が流れる公園。足湯も無料。" },
        { name: "湯もみショー", emoji: "🎭", dist: "徒歩5分", desc: "草津名物。毎日開催（冬季は要確認）。" },
        { name: "草津国際スキー場", emoji: "⛷", dist: "バス10分", desc: "冬季はスキー、夏季はハイキング。" },
      ],
    },
  },
};

function PlaceDetailPage({ placeId, onBack, onNavigateSearch }) {
  const [activeTab, setActiveTab] = useState("info");
  const place = placeData[placeId];
  if (!place) return <div style={{ padding: 32, textAlign: "center", color: C.gray }}>行き先情報が見つかりません</div>;
  const tabs = [
    { id: "info", label: "基本情報", icon: "ℹ️" },
    { id: "tickets", label: "チケット", icon: "🎫" },
    { id: "nearby", label: "周辺", icon: "📍" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, background: C.bg, zIndex: 350, display: "flex", flexDirection: "column" }}>
      {/* Hero with CTA inside */}
      <div style={{ background: `linear-gradient(160deg, ${C.primaryDark}, ${C.primaryLight})`, padding: "16px 16px 16px", color: C.white, flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "6px 14px", color: C.white, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: font }}>← 戻る</button>
          <div style={{ fontSize: 11, opacity: 0.7 }}>行き先詳細</div>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{place.emoji}</div>
          <div><div style={{ fontSize: 10, opacity: 0.7, fontWeight: 600 }}>{place.cat} · {place.area}</div><div style={{ fontSize: 24, fontWeight: 900, marginTop: 2 }}>{place.name}</div></div>
        </div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 10, lineHeight: 1.6 }}>{place.desc}</div>
        {/* CTA inside hero */}
        <button onClick={() => { if (onNavigateSearch) onNavigateSearch(place.name); }} style={{ marginTop: 14, width: "100%", background: "rgba(255,255,255,0.95)", color: C.primary, border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: font }}>🔍 この行き先へ経路検索</button>
      </div>
      {/* Tabs */}
      <div style={{ display: "flex", background: C.white, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 10, flexShrink: 0 }}>
        {tabs.map(t => (<button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, padding: "10px 0 8px", border: "none", background: "none", cursor: "pointer", borderBottom: activeTab === t.id ? `2.5px solid ${C.primary}` : "2.5px solid transparent", color: activeTab === t.id ? C.primary : C.gray, fontWeight: 700, fontSize: 12, fontFamily: font, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}><span style={{ fontSize: 14 }}>{t.icon}</span>{t.label}</button>))}
      </div>
      {/* Tab content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {activeTab === "info" && <div>
          <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>📍</span>
              <div><div style={{ fontSize: 10, color: C.gray }}>住所</div><div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginTop: 1 }}>{place.tabs.info.address}</div></div>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>📞</span>
              <div><div style={{ fontSize: 10, color: C.gray }}>電話番号</div><div style={{ fontSize: 13, fontWeight: 600, color: C.primary, marginTop: 1 }}>{place.tabs.info.phone}</div></div>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>🕐</span>
              <div><div style={{ fontSize: 10, color: C.gray }}>営業時間</div><div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginTop: 1 }}>{place.tabs.info.hours}</div></div>
            </div>
          </div>
        </div>}
        {activeTab === "tickets" && <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>使えるチケット</div>
          {place.tabs.tickets.map((t, i) => (<div key={i} style={{ background: i === 0 ? C.ticketBg : C.white, borderRadius: 14, padding: "14px 16px", border: i === 0 ? `1.5px solid ${C.primary}25` : `1px solid ${C.border}`, marginBottom: 8 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><div style={{ flex: 1, paddingRight: 12 }}><div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{t.name}</div><div style={{ fontSize: 12, color: C.textMid, marginTop: 4, lineHeight: 1.5 }}>{t.desc}</div></div><div style={{ textAlign: "right", flexShrink: 0 }}><div style={{ fontSize: 18, fontWeight: 800, color: C.primary }}>{t.price}</div><div style={{ fontSize: 10, color: C.gray }}>{t.days}</div></div></div></div>))}
          {/* Booking options merged into tickets */}
          {place.tabs.info.booking && place.tabs.info.booking.length > 0 && <>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginTop: 12, marginBottom: 10 }}>予約・手配</div>
            {place.tabs.info.booking.map((b, i) => (<div key={i} style={{ background: C.white, borderRadius: 14, padding: "14px 16px", border: `1px solid ${C.border}`, marginBottom: 8 }}><div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{b.type}</div><div style={{ fontSize: 12, color: C.textMid, marginTop: 4, lineHeight: 1.5 }}>{b.desc}</div></div>))}
          </>}
        </div>}
        {activeTab === "nearby" && <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>周辺スポット</div>
          {place.tabs.nearby.map((s, i) => (<div key={i} style={{ background: C.white, borderRadius: 14, padding: "14px 16px", border: `1px solid ${C.border}`, marginBottom: 8, display: "flex", gap: 12, alignItems: "flex-start" }}><div style={{ width: 40, height: 40, borderRadius: 10, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{s.emoji}</div><div style={{ flex: 1 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{s.name}</div><div style={{ fontSize: 11, color: C.primary, fontWeight: 600 }}>{s.dist}</div></div><div style={{ fontSize: 12, color: C.textMid, marginTop: 3, lineHeight: 1.5 }}>{s.desc}</div></div></div>))}
        </div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// PURCHASE FLOW
// ═══════════════════════════════════════
function PurchaseFlow({ ticket, route, onClose, onComplete, onGoToTicket }) {
  // Steps: initial -> auth -> confirm -> complete
  const [step, setStep] = useState("initial");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mynumberRegistered, setMynumberRegistered] = useState(false);
  const [icRegistered, setIcRegistered] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showMynumberFlow, setShowMynumberFlow] = useState(false);

  const hasDiscount = route?.discount && !mynumberRegistered;
  const discountPrice = "¥360"; // dummy
  const finalPrice = mynumberRegistered && route?.discount ? discountPrice : ticket.price;

  const Overlay = ({ children, showBack, onBackStep }) => (
    <div style={{ position: "fixed", inset: 0, maxWidth: 420, margin: "0 auto", background: C.bg, zIndex: 400, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        {showBack ? (
          <button onClick={onBackStep} style={{ background: "none", border: "none", fontSize: 14, color: C.primary, fontWeight: 600, cursor: "pointer", fontFamily: font, padding: 0 }}>← 戻る</button>
        ) : <div />}
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>チケット購入</div>
        <button onClick={onClose} style={{ background: "none", border: `2px solid ${C.lightGray}`, borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 12, color: C.gray, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );

  // ── Step: Initial (ticket overview) ──
  if (step === "initial") return (
    <Overlay>
      <div style={{ padding: "20px 24px 28px" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4 }}>{ticket.name}</div>
        <div style={{ fontSize: 13, color: C.textMid, lineHeight: 1.6, marginBottom: 16 }}>{ticket.desc}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "12px 16px", background: C.bg, borderRadius: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 14, color: C.textMid }}>金額</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: C.primary }}>{ticket.price}</span>
        </div>
        {ticket.days !== "—" && <div style={{ fontSize: 12, color: C.gray, marginBottom: 20 }}>有効期間: {ticket.days}</div>}
        <button onClick={() => setStep(isLoggedIn ? "confirm" : "auth")} style={{ width: "100%", background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`, color: C.white, border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: font }}>
          {isLoggedIn ? "購入手続きへ" : "ログインして購入する"}
        </button>
        <button onClick={onClose} style={{ width: "100%", background: "none", color: C.gray, border: "none", padding: "12px 0", fontSize: 13, cursor: "pointer", fontFamily: font, marginTop: 4 }}>キャンセル</button>
      </div>
    </Overlay>
  );

  // ── Step: Auth (dummy login/register) ──
  if (step === "auth") return (
    <Overlay showBack onBackStep={() => setStep("initial")}>
      <div style={{ padding: "20px 24px 28px" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 16 }}>JRE IDでログイン</div>
        {/* Dummy login form */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: C.textMid, fontWeight: 600, marginBottom: 4 }}>メールアドレス</div>
          <input type="email" placeholder="example@email.com" defaultValue="mitsuki.t@email.com" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: font, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: C.textMid, fontWeight: 600, marginBottom: 4 }}>パスワード</div>
          <input type="password" placeholder="••••••••" defaultValue="password123" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: font, outline: "none", boxSizing: "border-box" }} />
        </div>
        <button onClick={() => { setIsLoggedIn(true); setStep("confirm"); }} style={{ width: "100%", background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`, color: C.white, border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: font }}>ログイン</button>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <span style={{ fontSize: 13, color: C.gray }}>アカウントをお持ちでない方 </span>
          <span onClick={() => { setIsLoggedIn(true); setStep("confirm"); }} style={{ fontSize: 13, color: C.primary, fontWeight: 600, cursor: "pointer" }}>新規登録</span>
        </div>
      </div>
    </Overlay>
  );

  // ── Step: Confirm (payment, IC card, mynumber discount) ──
  if (step === "confirm") return (
    <Overlay showBack onBackStep={() => setStep("initial")}>
      <div style={{ padding: "20px 24px 28px" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 16 }}>購入内容の確認</div>

        {/* Ticket info */}
        <div style={{ background: C.ticketBg, borderRadius: 14, padding: "14px 16px", border: `1.5px solid ${C.primary}25`, marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{ticket.name}</div>
          <div style={{ fontSize: 12, color: C.textMid, marginTop: 2 }}>{ticket.days !== "—" ? `有効期間: ${ticket.days}` : ""}</div>
        </div>

        {/* Mynumber discount banner */}
        {hasDiscount && !showMynumberFlow && (
          <div style={{ background: C.sandLight, borderRadius: 12, padding: "12px 14px", border: `1px solid ${C.sand}`, marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>マイナンバーカードを登録すると割引</div>
                <div style={{ fontSize: 12, color: C.textMid, marginTop: 2 }}>{ticket.price} → <span style={{ color: C.accent, fontWeight: 800 }}>{discountPrice}</span>（{route.discount.cond}割引）</div>
                <button onClick={() => setShowMynumberFlow(true)} style={{ marginTop: 8, background: C.white, color: C.primary, border: `1.5px solid ${C.primary}`, borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: font }}>今すぐ登録して割引を適用</button>
              </div>
            </div>
          </div>
        )}
        {/* Mynumber registration (dummy inline flow) */}
        {showMynumberFlow && !mynumberRegistered && (
          <div style={{ background: C.white, borderRadius: 14, padding: "16px", border: `1.5px solid ${C.primary}`, marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>🪪 マイナンバーカード登録</div>
            <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.6, marginBottom: 12 }}>スマートフォンでマイナンバーカードを読み取ります。NFC対応端末が必要です。</div>
            <div style={{ background: C.bg, borderRadius: 10, padding: "20px", textAlign: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 32 }}>📱</div>
              <div style={{ fontSize: 13, color: C.textMid, marginTop: 8 }}>カードをスマートフォンの背面にかざしてください</div>
            </div>
            <button onClick={() => { setMynumberRegistered(true); setShowMynumberFlow(false); }} style={{ width: "100%", background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: C.white, border: "none", borderRadius: 10, padding: "12px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: font }}>読み取り完了（デモ）</button>
          </div>
        )}
        {/* Mynumber registered confirmation */}
        {mynumberRegistered && (
          <div style={{ background: C.successBg, borderRadius: 12, padding: "10px 14px", border: `1.5px solid ${C.success}30`, marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 16 }}>✅</span>
            <div><div style={{ fontSize: 13, fontWeight: 700, color: C.success }}>前橋市民割引が適用されました</div><div style={{ fontSize: 12, color: C.textMid, marginTop: 1 }}>{ticket.price} → {discountPrice}</div></div>
          </div>
        )}

        {/* Price */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 16px", background: C.bg, borderRadius: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 14, color: C.textMid }}>お支払い金額</span>
          <div style={{ textAlign: "right" }}>
            {mynumberRegistered && route?.discount && <div style={{ fontSize: 12, color: C.gray, textDecoration: "line-through" }}>{ticket.price}</div>}
            <span style={{ fontSize: 24, fontWeight: 800, color: C.primary }}>{finalPrice}</span>
          </div>
        </div>

        {/* Payment method */}
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>決済方法</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
          {[
            { id: "card", icon: "💳", label: "クレジットカード", sub: "Visa ****-4242" },
            { id: "applepay", icon: "🍎", label: "Apple Pay", sub: null },
          ].map(pm => (
            <div key={pm.id} onClick={() => setPaymentMethod(pm.id)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
              background: paymentMethod === pm.id ? C.ticketBg : C.white,
              borderRadius: 12, border: paymentMethod === pm.id ? `1.5px solid ${C.primary}` : `1px solid ${C.border}`,
              cursor: "pointer",
            }}>
              <span style={{ fontSize: 18 }}>{pm.icon}</span>
              <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{pm.label}</div>{pm.sub && <div style={{ fontSize: 11, color: C.gray }}>{pm.sub}</div>}</div>
              <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${paymentMethod === pm.id ? C.primary : C.lightGray}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {paymentMethod === pm.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.primary }} />}
              </div>
            </div>
          ))}
        </div>

        {/* IC card */}
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>利用するICカード</div>
        <div style={{ background: C.white, borderRadius: 12, padding: "12px 14px", border: `1px solid ${C.border}`, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          {icRegistered ? (
            <>
              <span style={{ fontSize: 18 }}>💳</span>
              <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Suica ****-1234</div><div style={{ fontSize: 11, color: C.gray }}>登録済み</div></div>
              <span style={{ fontSize: 12, color: C.primary, fontWeight: 600, cursor: "pointer" }}>変更</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 18, color: C.gray }}>💳</span>
              <div style={{ flex: 1 }}><div style={{ fontSize: 14, color: C.textMid }}>ICカード未登録</div><div style={{ fontSize: 11, color: C.gray }}>QRコードで利用できます</div></div>
              <span style={{ fontSize: 12, color: C.primary, fontWeight: 600, cursor: "pointer" }}>登録する</span>
            </>
          )}
        </div>

        {/* Confirm button */}
        <button onClick={() => setStep("complete")} style={{ width: "100%", background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`, color: C.white, border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: font }}>購入を確定する</button>
      </div>
    </Overlay>
  );

  // ── Step: Complete ──
  if (step === "complete") return (
    <Overlay>
      <div style={{ padding: "40px 24px 32px", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.successBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 32 }}>✅</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 4 }}>購入が完了しました</div>
        <div style={{ fontSize: 13, color: C.gray, marginBottom: 20 }}>チケットタブに追加されました</div>

        <div style={{ background: C.ticketBg, borderRadius: 14, padding: "16px", border: `1.5px solid ${C.primary}25`, marginBottom: 20, textAlign: "left" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{ticket.name}</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <div><div style={{ fontSize: 10, color: C.gray }}>金額</div><div style={{ fontSize: 16, fontWeight: 800, color: C.primary }}>{finalPrice}</div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 10, color: C.gray }}>有効期間</div><div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{ticket.days}</div></div>
          </div>
          {mynumberRegistered && route?.discount && (
            <div style={{ marginTop: 8, fontSize: 11, color: C.success, fontWeight: 600 }}>✓ 前橋市民割引適用済み</div>
          )}
        </div>

        <button onClick={onComplete} style={{ width: "100%", background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: C.white, border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: font, marginBottom: 8 }}>ルート詳細に戻る</button>
        <button onClick={onGoToTicket} style={{ width: "100%", background: C.white, color: C.primary, border: `1.5px solid ${C.primary}`, borderRadius: 12, padding: "12px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: font }}>チケットを確認する</button>
      </div>
    </Overlay>
  );

  return null;
}

// ═══════════════════════════════════════
// SEARCH TAB
// ═══════════════════════════════════════
function SearchTab({ presetDest, onGoToTicket }) {
  const [screen, setScreen] = useState("input");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeSort, setActiveSort] = useState("早");
  const [purchaseModal, setPurchaseModal] = useState(null);
  const [purchaseRoute, setPurchaseRoute] = useState(null);

  const startPurchase = (ticket) => {
    setPurchaseModal(ticket);
    setPurchaseRoute(selectedRoute);
    // Close the detail bottom sheet
    setSheetOpen(false);
    setTimeout(() => { setSelectedRoute(null); setScreen("results"); }, 300);
  };
  const closePurchase = () => { setPurchaseModal(null); setPurchaseRoute(null); };
  const completePurchase = () => {
    // Re-open the route detail
    const route = purchaseRoute;
    closePurchase();
    if (route) { setSelectedRoute(route); setScreen("detail"); setTimeout(() => setSheetOpen(true), 50); }
  };
  const [scenarioId, setScenarioId] = useState("kusatsu");
  const [placeDetail, setPlaceDetail] = useState(null);
  const [customDest, setCustomDest] = useState(presetDest || null);
  const [lastPreset, setLastPreset] = useState(presetDest);
  // Sync when presetDest changes from parent
  if (presetDest !== lastPreset) {
    setLastPreset(presetDest);
    if (presetDest) {
      setCustomDest(presetDest);
      setScreen("input");
      setSelectedRoute(null);
      setSheetOpen(false);
    }
  }
  const scenario = scenarios.find(s => s.id === scenarioId);
  const displayDest = customDest || scenario.to;

  const openDetail = (r) => { setSelectedRoute(r); setScreen("detail"); setTimeout(()=>setSheetOpen(true),50); };
  const closeDetail = () => { setSheetOpen(false); setTimeout(()=>{setScreen("results");setSelectedRoute(null);},300); };
  const switchScenario = (id) => { setScenarioId(id); setScreen("input"); setSelectedRoute(null); setSheetOpen(false); setPlaceDetail(null); setCustomDest(null); };
  const openPlaceDetail = (id) => { setPlaceDetail(id); closeDetail(); };

  const SearchInput = ({compact}) => (
    <div style={{ background: compact ? C.white : C.bg, padding: compact ? "10px 16px" : "20px 16px 16px" }}>
      {!compact && <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 14 }}>経路検索</div>}
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        {/* Origin */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={C.primary}/><circle cx="12" cy="9" r="2.5" fill={C.white}/></svg>
          <div style={{ flex: 1, fontSize: 14, color: C.text, fontWeight: 500 }}>{customDest ? "現在地" : scenario.from}</div>
        </div>
        {/* Destination */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={C.accent}/><circle cx="12" cy="9" r="2.5" fill={C.white}/></svg>
          <div style={{ flex: 1, fontSize: 14, color: C.text, fontWeight: 500 }}>{displayDest}</div>
        </div>
        {/* DateTime */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px" }}>
          <div style={{ width: 22, height: 22, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div style={{ flex: 1, fontSize: 14, color: C.text }}>3月15日（日）14:38 <span style={{ fontSize: 12, color: C.primary, fontWeight: 600 }}>出発</span></div>
        </div>
      </div>
      {!compact && <button onClick={() => setScreen("results")} style={{ marginTop: 12, background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`, color: C.white, border: "none", borderRadius: 12, padding: "13px 0", fontWeight: 700, fontSize: 15, cursor: "pointer", width: "100%", fontFamily: font }}>経路を検索</button>}
    </div>
  );

  const RouteCard = ({route}) => (
    <div onClick={()=>openDetail(route)} style={{ background:C.white,borderRadius:14,padding:"16px",marginBottom:10,border:`1px solid ${C.border}`,cursor:"pointer" }}>
      {/* Time + badges */}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
        <div>
          <span style={{ fontSize:20,fontWeight:800,color:C.text }}>{route.dep}</span>
          <span style={{ fontSize:14,color:C.gray,margin:"0 6px" }}>→</span>
          <span style={{ fontSize:20,fontWeight:800,color:C.text }}>{route.arr}</span>
          <span style={{ fontSize:12,color:C.textMid,marginLeft:8 }}>({route.dur})</span>
        </div>
        <div>{route.badges.map((b,i)=><Badge key={b} text={b} color={route.badgeColors[i]}/>)}</div>
      </div>
      {/* Cost + transfers */}
      <div style={{ fontSize:13,color:C.textMid,marginBottom:route.bestTicket?12:0 }}>
        {route.cost}　乗換{route.transfers}回
      </div>
      {/* Ticket info - prominent frame */}
      {route.bestTicket && (
        <div style={{ background:C.ticketBg,borderRadius:10,padding:"10px 14px",border:`1.5px solid ${C.primary}25` }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <div style={{ display:"flex",alignItems:"center",gap:6 }}>
              <span style={{ fontSize:14 }}>🎫</span>
              <span style={{ fontSize:13,fontWeight:700,color:C.primary }}>{route.bestTicket.name}</span>
            </div>
            <span style={{ fontSize:16,fontWeight:800,color:C.primary }}>{route.bestTicket.price}</span>
          </div>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4 }}>
            <span style={{ fontSize:11,color:C.textMid }}>{route.bestTicket.note}</span>
            {route.tickets.filter(t=>t.label!=="チケットなし").length>1 && <span style={{ fontSize:11,color:C.primary,fontWeight:600 }}>他{route.tickets.filter(t=>t.label!=="チケットなし").length-1}件 →</span>}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ height: "calc(100vh - 48px)", overflowY: "auto", background: C.bg }}>
      {/* Scenario switcher */}
      {screen === "input" && <div style={{ padding: "12px 16px 0", display: "flex", gap: 6 }}>{scenarios.map(s => (<button key={s.id} onClick={()=>switchScenario(s.id)} style={{ flex:1,padding:"8px 6px",borderRadius:10,border:`1.5px solid ${scenarioId===s.id?C.primary:C.border}`,background:scenarioId===s.id?C.ticketBg:C.white,color:scenarioId===s.id?C.primary:C.gray,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:font,textAlign:"center" }}>{s.label}</button>))}</div>}
      {screen !== "input" && <div style={{ background:C.white,padding:"6px 16px",display:"flex",gap:4 }}>{scenarios.map(s=>(<button key={s.id} onClick={()=>switchScenario(s.id)} style={{ padding:"4px 8px",borderRadius:6,border:scenarioId===s.id?`1.5px solid ${C.primary}`:`1px solid ${C.border}`,background:scenarioId===s.id?C.ticketBg:C.white,color:scenarioId===s.id?C.primary:C.gray,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:font }}>{s.label}</button>))}</div>}

      {screen === "input" && <SearchInput />}
      {screen !== "input" && (
        <>
          <SearchInput compact />
          <div style={{ display:"flex",background:C.white,borderBottom:`1px solid ${C.border}` }}>{["早","安","楽"].map(t=>(<button key={t} onClick={()=>setActiveSort(t)} style={{ flex:1,padding:"10px 0",border:"none",background:"none",cursor:"pointer",borderBottom:activeSort===t?`2.5px solid ${C.primary}`:"2.5px solid transparent",color:activeSort===t?C.primary:C.gray,fontWeight:700,fontSize:14,fontFamily:font }}>{t}</button>))}</div>
          <div style={{ padding: "12px 16px 80px" }}>
            {scenario.showContext && (<div style={{ background:C.sandLight,borderRadius:14,padding:"16px",marginBottom:12,border:`1.5px solid ${C.sand}` }}><div style={{ display:"flex",gap:10,alignItems:"flex-start" }}><span style={{ fontSize:22,flexShrink:0 }}>📱</span><div style={{ flex:1 }}><div style={{ fontWeight:800,fontSize:14,color:C.text,marginBottom:4 }}>{contextCard.title}</div><div style={{ fontSize:12,color:C.textMid,lineHeight:1.6 }}>{contextCard.desc}</div><div style={{ fontSize:11,color:C.accent,fontWeight:600,marginTop:4 }}>💡 {contextCard.discount}</div><button style={{ marginTop:10,background:`linear-gradient(135deg,${C.accent},${C.accentDark})`,color:C.white,border:"none",borderRadius:10,padding:"10px 0",fontWeight:700,fontSize:13,cursor:"pointer",width:"100%",fontFamily:font }}>{contextCard.action}</button></div></div></div>)}
            {scenario.showContext && (<div style={{ background:C.white,borderRadius:10,padding:"10px 14px",marginBottom:12,border:`1px solid ${C.border}`,display:"flex",gap:8,alignItems:"flex-start" }}><span style={{ fontSize:14 }}>⚠️</span><div style={{ fontSize:12,color:C.gray,lineHeight:1.5 }}>直通の公共交通ルートが見つかりませんでした。上記の「呼べば来るバス」のご利用をおすすめします。</div></div>)}
            {scenario.routes.map((r,i) => <RouteCard key={r.id} route={r} delay={100+i*100} />)}
          </div>
        </>
      )}

      {/* Detail Bottom Sheet */}
      {selectedRoute && (<><div onClick={closeDetail} style={{ position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.3)",zIndex:200,opacity:sheetOpen?1:0,transition:"opacity 0.3s",pointerEvents:sheetOpen?"auto":"none" }}/><div style={{ position:"fixed",left:0,right:0,bottom:0,maxWidth:420,margin:"0 auto",background:C.white,borderRadius:"20px 20px 0 0",zIndex:300,maxHeight:"88vh",overflowY:"auto",transform:sheetOpen?"translateY(0)":"translateY(100%)",transition:"transform 0.35s cubic-bezier(0.32,0.72,0,1)",boxShadow:"0 -8px 40px rgba(0,0,0,0.12)" }}>
        <div style={{ display:"flex",justifyContent:"center",padding:"10px 0 4px" }}><div style={{ width:36,height:4,borderRadius:2,background:C.lightGray }}/></div>
        <div style={{ padding:"8px 20px 14px" }}><div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}><div><div><span style={{ fontSize:22,fontWeight:800,color:C.text }}>{selectedRoute.dep}</span><span style={{ fontSize:14,color:C.gray,margin:"0 6px" }}>→</span><span style={{ fontSize:22,fontWeight:800,color:C.text }}>{selectedRoute.arr}</span><span style={{ fontSize:12,color:C.textMid,marginLeft:8 }}>({selectedRoute.dur})</span></div><div style={{ fontSize:13,color:C.textMid,marginTop:4 }}>{selectedRoute.cost}　乗換{selectedRoute.transfers}回</div></div><button onClick={closeDetail} style={{ background:"none",border:`2px solid ${C.lightGray}`,borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:14,color:C.gray,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>✕</button></div></div>
        {/* Timeline */}
        <div style={{ padding: "8px 20px 16px" }}>
          {/* Origin node */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 4 }}>
            <div style={{ width: 28, display: "flex", justifyContent: "center" }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: C.primary, border: `2px solid ${C.white}`, boxShadow: `0 0 0 2px ${C.primary}` }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{selectedRoute.segments[0]?.from || "出発地"}</div>
              <div style={{ fontSize: 11, color: C.gray }}>{selectedRoute.dep} 出発</div>
            </div>
          </div>

          {/* Segments */}
          {selectedRoute.segments.map((seg, i) => (
            <div key={i}>
              {seg.type === "walk" ? (
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "4px 0" }}>
                  <div style={{ width: 28, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 2, height: 24, background: C.lightGray, borderStyle: "dashed" }} />
                  </div>
                  <div style={{ fontSize: 12, color: C.gray }}>徒歩 {seg.dur}（{seg.dist}）</div>
                </div>
              ) : (
                <div style={{ marginBottom: 2 }}>
                  {/* Departure station dot */}
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 28, display: "flex", justifyContent: "center" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: seg.color, border: `2px solid ${C.white}`, boxShadow: `0 0 0 2px ${seg.color}` }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{seg.from}</div>
                      <div style={{ fontSize: 11, color: C.gray }}>{seg.depTime} 発</div>
                    </div>
                  </div>
                  {/* Line bar + info */}
                  <div style={{ display: "flex", gap: 12, padding: "4px 0" }}>
                    <div style={{ width: 28, display: "flex", justifyContent: "center" }}>
                      <div style={{ width: 4, borderRadius: 2, background: seg.color, minHeight: 48 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{seg.line}</div>
                      <div style={{ fontSize: 11, color: C.gray }}>{seg.stops > 0 ? `${seg.stops}駅 · ` : ""}{seg.dur}</div>
                      {seg.ticketHint && (
                        <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 4, background: C.ticketBg, borderRadius: 6, padding: "3px 8px" }}>
                          <span style={{ fontSize: 11 }}>🎫</span>
                          <span style={{ fontSize: 11, color: C.primary, fontWeight: 600 }}>{seg.ticketHint}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Arrival station dot (show for intermediate stations, not for final destination) */}
                  {i < selectedRoute.segments.length - 1 && (
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 28, display: "flex", justifyContent: "center" }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: seg.color, border: `2px solid ${C.white}`, boxShadow: `0 0 0 2px ${seg.color}` }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{seg.to.split("/")[0]}</div>
                        <div style={{ fontSize: 11, color: C.gray }}>{seg.arrTime} 着</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Destination node */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 4 }}>
            <div style={{ width: 28, display: "flex", justifyContent: "center" }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: C.accent, border: `2px solid ${C.white}`, boxShadow: `0 0 0 2px ${C.accent}` }} />
            </div>
            <div style={{ flex: 1 }}>
              {(() => {
                const lastSeg = selectedRoute.segments[selectedRoute.segments.length - 1];
                const destName = lastSeg?.to || "目的地";
                const hasLink = lastSeg?.toPlaceLink;
                return (
                  <>
                    {hasLink ? (
                      <div onClick={() => openPlaceDetail(hasLink.id)} style={{ fontSize: 14, fontWeight: 700, color: C.primary, cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 3 }}>
                        {destName.split("/")[0]} ↗ <span style={{ fontSize: 11, fontWeight: 400, color: C.gray, textDecoration: "none" }}>詳細を見る</span>
                      </div>
                    ) : (
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{destName.split("/")[0]}</div>
                    )}
                    <div style={{ fontSize: 11, color: C.gray }}>{selectedRoute.arr} 到着</div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
        {/* Ticket suggestions */}
        <div style={{ borderTop:`6px solid ${C.bg}` }}><div style={{ padding:"18px 20px 8px" }}><div style={{ fontSize:15,fontWeight:800,color:C.text,marginBottom:2 }}>🎫 このルートで使えるチケット</div><div style={{ fontSize:11,color:C.gray,marginBottom:14 }}>おすすめを比較できます</div>{selectedRoute.discount && <div style={{ background:C.sandLight,borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",gap:6,alignItems:"flex-start" }}><span style={{ fontSize:13 }}>💡</span><div><span style={{ fontSize:12,fontWeight:700,color:C.text }}>{selectedRoute.discount.cond}の方: </span><span style={{ fontSize:12,color:C.accent,fontWeight:700 }}>{selectedRoute.discount.detail}</span></div></div>}</div>
        <div style={{ padding:"0 20px 20px",display:"flex",flexDirection:"column",gap:10 }}>{selectedRoute.tickets.map((t,i)=>(<div key={t.id} style={{ background:i===0?C.ticketBg:C.white,borderRadius:14,padding:"16px",border:i===0?`1.5px solid ${C.primary}30`:`1px solid ${C.border}` }}><div style={{ display:"inline-block",background:i===0?C.primary:C.bg,color:i===0?C.white:C.gray,borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:700,marginBottom:8 }}>{t.label}</div><div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}><div style={{ flex:1,paddingRight:12 }}><div style={{ fontSize:15,fontWeight:700,color:C.text }}>{t.name}</div><div style={{ fontSize:12,color:C.textMid,marginTop:4,lineHeight:1.6 }}>{t.desc}</div>{t.saving && <div style={{ marginTop:6,fontSize:12,color:C.accent,fontWeight:700 }}>💡 {t.saving}</div>}</div><div style={{ textAlign:"right",flexShrink:0 }}><div style={{ fontSize:20,fontWeight:800,color:C.primary }}>{t.price}</div><div style={{ fontSize:10,color:C.gray }}>{t.days}</div>{t.label!=="チケットなし" && <button onClick={()=>startPurchase(t)} style={{ marginTop:8,background:i===0?`linear-gradient(135deg,${C.accent},${C.accentDark})`:C.white,color:i===0?C.white:C.primary,border:i===0?"none":`1.5px solid ${C.primary}`,borderRadius:8,padding:"7px 16px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:font }}>購入</button>}</div></div></div>))}</div></div>
      </div></>)}
      {/* ═══ Purchase Flow (multi-step) ═══ */}
      {purchaseModal && <PurchaseFlow ticket={purchaseModal} route={purchaseRoute} onClose={closePurchase} onComplete={completePurchase} onGoToTicket={() => { closePurchase(); if (onGoToTicket) onGoToTicket(); }} />}

      {/* ═══ Place Detail Page ═══ */}
      {placeDetail && <PlaceDetailPage placeId={placeDetail} onBack={() => setPlaceDetail(null)} onNavigateSearch={(dest) => { setPlaceDetail(null); setCustomDest(dest); setScreen("results"); }} />}
    </div>
  );
}

// ═══════════════════════════════════════
// MYPAGE TAB
// ═══════════════════════════════════════
function MyPageTab() {
  const [regState, setRegState] = useState("none");
  const [expanded, setExpanded] = useState(null);
  const reg = REG_STATES[regState];
  const cc = [reg.jre,reg.ic,reg.mynumber].filter(Boolean).length;
  const steps = [
    { key:"jre",done:reg.jre,icon:"👤",title:"JRE ID",benefit:"チケットの購入・管理ができるようになります",action:"ログイン / 新規登録",
      registered:reg.jre?{detail:"mitsuki.t@email.com",actions:[{label:"メールアドレスの変更",icon:"✉️"},{label:"パスワードの変更",icon:"🔑"},{label:"電話番号の登録・変更",icon:"📞"},{label:"クレジットカード情報",icon:"💳"},{label:"退会",icon:"🚪",danger:true}]}:null },
    { key:"ic",done:reg.ic,icon:"💳",title:"交通系ICカード",benefit:"チケットをICカードで利用できます",action:"登録",requires:!reg.jre?"JRE IDログインが必要です":null,
      registered:reg.ic?{detail:"Suica  ****-****-****-1234",actions:[{label:"カードを変更",icon:"🔄"},{label:"カードを追加",icon:"➕"},{label:"登録を解除",icon:"🗑",danger:true}]}:null },
    { key:"mynumber",done:reg.mynumber,icon:"🪪",title:"マイナンバーカード",benefit:"地域の割引が自動で適用されます",action:"登録",requires:!reg.jre?"JRE IDログインが必要です":null,
      registered:reg.mynumber?{detail:"前橋市民（群馬県前橋市）",subDetail:"敬老割引: 対象（65歳以上）",actions:[{label:"登録情報を確認",icon:"📋"},{label:"登録を解除",icon:"🗑",danger:true}]}:null },
  ];

  return (
    <div style={{ height: "calc(100vh - 48px)", overflowY: "auto", background: C.bg }}>
      {/* Demo switcher */}
      <div style={{ padding: "12px 16px 0" }}><div style={{ background:C.white,borderRadius:12,padding:"10px 14px",border:`1.5px dashed ${C.lightGray}` }}><div style={{ fontSize:10,color:C.gray,fontWeight:600,marginBottom:6 }}>🔧 デモ用: 登録状態を切り替え</div><div style={{ display:"flex",gap:4,flexWrap:"wrap" }}>{[{key:"none",label:"未登録"},{key:"jre_only",label:"JRE IDのみ"},{key:"jre_ic",label:"+ICカード"},{key:"all",label:"全て完了"}].map(s=>(<button key={s.key} onClick={()=>{setRegState(s.key);setExpanded(null);}} style={{ padding:"5px 10px",borderRadius:8,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:font,border:regState===s.key?`1.5px solid ${C.primary}`:`1px solid ${C.border}`,background:regState===s.key?C.ticketBg:C.white,color:regState===s.key?C.primary:C.gray }}>{s.label}</button>))}</div></div></div>
      {/* Profile */}
      <div style={{ padding: "16px 16px 0" }}><div style={{ background:C.white,borderRadius:16,padding:"20px",border:`1px solid ${C.border}` }}>
        <div style={{ display:"flex",gap:14,alignItems:"center" }}>
          {reg.jre ? (
            <div style={{ width:100,height:100,borderRadius:14,background:C.white,border:`1.5px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden" }}>
              {/* Mini QR code (SVG pattern) */}
              <svg width="82" height="82" viewBox="0 0 48 48">
                <rect width="48" height="48" fill="white"/>
                <rect x="4" y="4" width="12" height="12" rx="2" fill={C.primaryDark}/>
                <rect x="6" y="6" width="8" height="8" rx="1" fill="white"/>
                <rect x="8" y="8" width="4" height="4" fill={C.primaryDark}/>
                <rect x="32" y="4" width="12" height="12" rx="2" fill={C.primaryDark}/>
                <rect x="34" y="6" width="8" height="8" rx="1" fill="white"/>
                <rect x="36" y="8" width="4" height="4" fill={C.primaryDark}/>
                <rect x="4" y="32" width="12" height="12" rx="2" fill={C.primaryDark}/>
                <rect x="6" y="34" width="8" height="8" rx="1" fill="white"/>
                <rect x="8" y="36" width="4" height="4" fill={C.primaryDark}/>
                <rect x="20" y="4" width="3" height="3" fill={C.primaryDark}/>
                <rect x="20" y="10" width="3" height="3" fill={C.primaryDark}/>
                <rect x="24" y="8" width="3" height="3" fill={C.primaryDark}/>
                <rect x="20" y="20" width="3" height="3" fill={C.primaryDark}/>
                <rect x="24" y="20" width="3" height="3" fill={C.primaryDark}/>
                <rect x="20" y="24" width="3" height="3" fill={C.primaryDark}/>
                <rect x="28" y="20" width="3" height="3" fill={C.primaryDark}/>
                <rect x="32" y="20" width="3" height="3" fill={C.primaryDark}/>
                <rect x="36" y="24" width="3" height="3" fill={C.primaryDark}/>
                <rect x="40" y="28" width="3" height="3" fill={C.primaryDark}/>
                <rect x="20" y="32" width="3" height="3" fill={C.primaryDark}/>
                <rect x="24" y="36" width="3" height="3" fill={C.primaryDark}/>
                <rect x="32" y="32" width="3" height="3" fill={C.primaryDark}/>
                <rect x="36" y="36" width="3" height="3" fill={C.primaryDark}/>
                <rect x="40" y="32" width="3" height="3" fill={C.primaryDark}/>
                <rect x="40" y="40" width="3" height="3" fill={C.primaryDark}/>
              </svg>
            </div>
          ) : (
            <div style={{ width:60,height:60,borderRadius:"50%",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,border:`2px dashed ${C.lightGray}`,flexShrink:0 }}>👤</div>
          )}
          <div style={{ flex:1 }}>
            {reg.jre ? <>
              <div style={{ fontSize:18,fontWeight:800,color:C.text }}>田中 美月</div>
              <div style={{ fontSize:12,color:C.gray,marginTop:2 }}>ID: D2503-2846</div>
            </> : <>
              <div style={{ fontSize:16,fontWeight:700,color:C.text }}>ゲスト</div>
              <div style={{ fontSize:12,color:C.gray,marginTop:2 }}>ログインするとチケットが購入できます</div>
            </>}
          </div>
        </div>
      </div></div>
      {/* Steps */}
      <div style={{ padding:"16px 16px 0" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4 }}>
          <div style={{ fontSize:13,fontWeight:700,color:C.text }}>{cc===3?"登録済みの情報":"GunMaaSをもっと便利に使おう"}</div>
          <div style={{ fontSize:11,color:cc===3?C.primary:C.gray,fontWeight:600 }}>{cc===3?"✓ すべて完了":`${cc} / 3`}</div>
        </div>
        {cc<3 && <div style={{ fontSize:11,color:C.textMid,marginBottom:8,lineHeight:1.5 }}>登録を進めると、チケット購入や割引が使えるようになります</div>}
        <div style={{ display:"flex",gap:4,marginBottom:12 }}>{[0,1,2].map(i=>(<div key={i} style={{ flex:1,height:4,borderRadius:2,background:i<cc?C.primary:C.border }}/>))}</div>
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>{steps.map((step,i)=>{const isExp=expanded===step.key;return(<div key={step.key} style={{ background:C.white,borderRadius:14,overflow:"hidden",border:`1px solid ${C.border}`,opacity:step.requires?0.55:1 }}>
          <div onClick={()=>step.done&&!step.requires&&setExpanded(prev=>prev===step.key?null:step.key)} style={{ display:"flex",gap:12,alignItems:"center",padding:"14px 16px",cursor:step.done?"pointer":"default" }}>
            <div style={{ width:36,height:36,borderRadius:10,flexShrink:0,background:step.done?C.bg:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:step.done?14:18,color:step.done?C.primary:C.text }}>{step.done?"✓":step.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                <span style={{ fontSize:14,fontWeight:700,color:C.text }}>{step.title}</span>
                {step.done && <span style={{ fontSize:10,color:C.primary,fontWeight:600 }}>登録済み</span>}
              </div>
              {step.done&&step.registered&&<div style={{ fontSize:12,color:C.gray,marginTop:1 }}>{step.registered.detail}</div>}
              {!step.done&&!step.requires&&<div style={{ fontSize:12,color:C.textMid,marginTop:1 }}>{step.benefit}</div>}
              {step.requires&&<div style={{ fontSize:11,color:C.gray,marginTop:1 }}>🔒 {step.requires}</div>}
            </div>
            {step.done?<span style={{ fontSize:12,color:C.gray,transform:isExp?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s" }}>▼</span>:!step.requires?<button onClick={e=>e.stopPropagation()} style={{ background:i===0&&!reg.jre?`linear-gradient(135deg,${C.accent},${C.accentDark})`:C.white,color:i===0&&!reg.jre?C.white:C.primary,border:i===0&&!reg.jre?"none":`1.5px solid ${C.primary}`,borderRadius:8,padding:"6px 14px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:font,flexShrink:0 }}>{step.action}</button>:null}
          </div>
          {step.done&&isExp&&step.registered&&<div style={{ borderTop:`1px solid ${C.border}`,background:C.white }}>{step.registered.subDetail&&<div style={{ padding:"10px 16px",background:C.sandLight,fontSize:12,color:C.accent,fontWeight:600 }}>💡 {step.registered.subDetail}</div>}{step.registered.actions.map((act,ai)=>(<div key={ai}><div style={{ display:"flex",alignItems:"center",gap:10,padding:"12px 16px 12px 64px",cursor:"pointer" }}><span style={{ fontSize:14 }}>{act.icon}</span><span style={{ fontSize:13,fontWeight:600,color:act.danger?C.accent:C.text,flex:1 }}>{act.label}</span><span style={{ color:C.lightGray,fontSize:12 }}>›</span></div>{ai<step.registered.actions.length-1&&<div style={{ height:1,background:C.border,marginLeft:64 }}/>}</div>))}</div>}
        </div>);})}</div></div>
      {/* Child demand */}
      <div style={{ padding:"16px 16px 0" }}><div style={{ fontSize:13,fontWeight:700,color:C.text,marginBottom:10 }}>その他の登録</div><div style={{ background:C.white,borderRadius:14,overflow:"hidden",border:`1px solid ${C.border}` }}><div style={{ display:"flex",alignItems:"center",gap:12,padding:"13px 16px",cursor:"pointer",opacity:reg.jre?1:0.55 }}><span style={{ fontSize:17 }}>👶</span><div style={{ flex:1 }}><div style={{ fontSize:14,fontWeight:600,color:C.text }}>こどもデマンド利用登録・変更</div>{reg.jre?<div style={{ fontSize:11,color:C.gray,marginTop:1 }}>お子さまのデマンド交通利用を登録</div>:<div style={{ fontSize:11,color:C.gray,marginTop:1 }}>🔒 JRE IDログインが必要です</div>}</div><span style={{ color:C.lightGray,fontSize:14 }}>›</span></div></div></div>
      {/* Support */}
      <div style={{ padding:"16px 16px 0" }}><div style={{ fontSize:13,fontWeight:700,color:C.text,marginBottom:10 }}>サポート</div><div style={{ background:C.white,borderRadius:14,overflow:"hidden",border:`1px solid ${C.border}` }}><MenuItemRow icon="📖" label="はじめ方ガイド" sub="GunMaaSの使い方をステップで紹介" highlight={!reg.jre} /><Divider /><MenuItemRow icon="❓" label="よくある質問" /><Divider /><MenuItemRow icon="💬" label="お問い合わせ" /></div></div>
      {/* Legal */}
      <div style={{ padding:"16px 16px 0" }}><div style={{ fontSize:13,fontWeight:700,color:C.text,marginBottom:10 }}>その他</div><div style={{ background:C.white,borderRadius:14,overflow:"hidden",border:`1px solid ${C.border}` }}><MenuItemRow icon="📄" label="利用規約" /><Divider /><MenuItemRow icon="🔒" label="プライバシーポリシー" /><Divider /><MenuItemRow icon="🏛" label="運営情報" sub="群馬県新モビリティサービス推進協議会" /></div></div>
      {reg.jre && <div style={{ padding:"16px" }}><button style={{ width:"100%",background:C.white,color:C.accent,border:`1px solid ${C.border}`,borderRadius:14,padding:"14px 0",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:font }}>ログアウト</button></div>}
      <div style={{ height: 24 }} />
    </div>
  );
}

// ═══════════════════════════════════════
// TICKET TAB
// ═══════════════════════════════════════
function TicketTab() {
  const [ticketView, setTicketView] = useState("active");
  const activeTickets = [
    { id: "at1", name: "草津高原線フリーパス", area: "長野原草津口 〜 草津温泉BT", price: "¥1,540", validUntil: "2026/03/16 23:59", daysLeft: "本日まで", status: "利用中", color: C.primary, emoji: "♨️" },
    { id: "at2", name: "中心市街地乗り放題券", area: "前橋駅周辺200円区間", price: "¥500", validUntil: "2026/03/20 23:59", daysLeft: "あと4日", status: "利用中", color: C.secondary, emoji: "🚌" },
  ];
  const pastTickets = [
    { id: "pt1", name: "ぐんまワンデーローカルパス", area: "県内JR+私鉄全線", price: "¥2,600", validUntil: "2026/03/08", status: "使用済み", color: C.gray, emoji: "🚃" },
    { id: "pt2", name: "草津高原線フリーパス", area: "長野原草津口 〜 草津温泉BT", price: "¥1,540", validUntil: "2026/02/22", status: "使用済み", color: C.gray, emoji: "♨️" },
    { id: "pt3", name: "中心市街地乗り放題券", area: "前橋駅周辺200円区間", price: "¥500", validUntil: "2026/02/15", status: "期限切れ", color: C.gray, emoji: "🚌" },
  ];
  const TicketCard = ({ ticket, isActive }) => (
    <div style={{ background: C.white, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, marginBottom: 12, opacity: isActive ? 1 : 0.7 }}>
      <div style={{ background: isActive ? `linear-gradient(135deg, ${ticket.color}, ${ticket.color}CC)` : C.bg, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>{ticket.emoji}</span>
          <div><div style={{ fontSize: 15, fontWeight: 800, color: isActive ? C.white : C.text }}>{ticket.name}</div><div style={{ fontSize: 11, color: isActive ? "rgba(255,255,255,0.8)" : C.gray, marginTop: 1 }}>{ticket.area}</div></div>
        </div>
        {isActive && <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 8, padding: "4px 10px" }}><div style={{ fontSize: 11, fontWeight: 700, color: C.white }}>{ticket.status}</div></div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", margin: "0 -4px" }}><div style={{ width: 16, height: 16, borderRadius: "50%", background: C.bg, flexShrink: 0, marginLeft: -8 }} /><div style={{ flex: 1, borderTop: `2px dashed ${C.border}` }} /><div style={{ width: 16, height: 16, borderRadius: "50%", background: C.bg, flexShrink: 0, marginRight: -8 }} /></div>
      <div style={{ padding: "12px 16px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div><div style={{ fontSize: 10, color: C.gray }}>{isActive ? "有効期限" : "利用日"}</div><div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{ticket.validUntil}</div></div>
          <div style={{ textAlign: "right" }}><div style={{ fontSize: 10, color: C.gray }}>購入金額</div><div style={{ fontSize: 16, fontWeight: 800, color: isActive ? C.primary : C.gray }}>{ticket.price}</div></div>
        </div>
        {isActive && ticket.daysLeft && <div style={{ marginTop: 10, display: "inline-block", background: ticket.daysLeft === "本日まで" ? C.sandLight : C.ticketBg, borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: ticket.daysLeft === "本日まで" ? C.accent : C.primary }}>⏳ {ticket.daysLeft}</div>}
        {isActive && <button style={{ marginTop: 12, width: "100%", background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: C.white, border: "none", borderRadius: 10, padding: "11px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: font }}>チケットを表示する</button>}
        {isActive && <div style={{ marginTop: 8, textAlign: "center" }}><span style={{ fontSize: 12, color: C.gray, cursor: "pointer" }}>取り消し・払い戻し</span></div>}
        {!isActive && <div style={{ marginTop: 10, display: "flex", gap: 8 }}><button style={{ flex: 1, background: C.white, color: C.primary, border: `1.5px solid ${C.primary}`, borderRadius: 8, padding: "8px 0", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font }}>もう一度購入</button><button style={{ flex: 1, background: C.bg, color: C.gray, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 0", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font }}>領収書</button></div>}
      </div>
    </div>
  );
  return (
    <div style={{ height: "calc(100vh - 48px)", overflowY: "auto", background: C.bg }}>
      <div style={{ background: C.white, padding: "16px 16px 0", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 12 }}>マイチケット</div>
        <div style={{ display: "flex" }}>{[{ id: "active", label: `利用中 (${activeTickets.length})` }, { id: "past", label: `過去 (${pastTickets.length})` }].map(t => (<button key={t.id} onClick={() => setTicketView(t.id)} style={{ flex: 1, padding: "10px 0", border: "none", background: "none", cursor: "pointer", borderBottom: ticketView === t.id ? `2.5px solid ${C.primary}` : "2.5px solid transparent", color: ticketView === t.id ? C.primary : C.gray, fontWeight: 700, fontSize: 14, fontFamily: font }}>{t.label}</button>))}</div>
      </div>
      <div style={{ padding: "16px" }}>
        {ticketView === "active" && activeTickets.map(t => <TicketCard key={t.id} ticket={t} isActive />)}
        {ticketView === "past" && pastTickets.map(t => <TicketCard key={t.id} ticket={t} isActive={false} />)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// ROOT: TAB NAVIGATION
// ═══════════════════════════════════════
export default function GunMaaSPrototype() {
  const [activeTab, setActiveTab] = useState("home");
  const [homePlaceDetail, setHomePlaceDetail] = useState(null);
  const [searchDest, setSearchDest] = useState(null);
  const tabs = [
    { id: "home", icon: "🏠", label: "ホーム" },
    { id: "search", icon: "🔍", label: "検索" },
    { id: "ticket", icon: "🎫", label: "チケット" },
    { id: "mypage", icon: "👤", label: "マイページ" },
  ];
  const navigateToSearch = (dest) => { setSearchDest(dest || null); setActiveTab("search"); };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", height: "100vh", fontFamily: font, position: "relative", overflow: "hidden", boxShadow: "0 0 60px rgba(0,0,0,0.06)" }}>
      {/* Tab content */}
      <div style={{ height: "calc(100vh - 48px)", overflow: "hidden", position: "relative" }}>
        {activeTab === "home" && <HomeTab onNavigateSearch={navigateToSearch} onOpenPlace={(id) => setHomePlaceDetail(id)} />}
        {activeTab === "search" && <SearchTab key={searchDest || "default"} presetDest={searchDest} onGoToTicket={() => setActiveTab("ticket")} />}
        {activeTab === "ticket" && <TicketTab />}
        {activeTab === "mypage" && <MyPageTab />}
        {/* Place detail overlay from home */}
        {activeTab === "home" && homePlaceDetail && <PlaceDetailPage placeId={homePlaceDetail} onBack={() => setHomePlaceDetail(null)} onNavigateSearch={(dest) => { setHomePlaceDetail(null); navigateToSearch(dest); }} />}
      </div>

      {/* Tab bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 48, background: C.white, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-around", alignItems: "center", zIndex: 50 }}>
        {tabs.map(t => (
          <div key={t.id} onClick={() => setActiveTab(t.id)} style={{ textAlign: "center", cursor: "pointer", flex: 1 }}>
            <div style={{ fontSize: 18, opacity: activeTab === t.id ? 1 : 0.35 }}>{t.icon}</div>
            <div style={{ fontSize: 9, color: activeTab === t.id ? C.primary : C.gray, fontWeight: activeTab === t.id ? 700 : 400, marginTop: 1 }}>{t.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
