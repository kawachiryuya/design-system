import { useState } from "react";

const tokens = {
  color: {
    primary: "#2D6A4F", primaryLight: "#40916C", accent: "#E07A5F",
    sand: "#F2CC8F", secondary: "#81B29A", text: "#1C2833",
    gray: "#5D6D7E", lightGray: "#95A5A6", bg: "#F7FAF8",
    white: "#FFFFFF", cardBorder: "#E8F0EC",
  },
  space: { xs: 4, sm: 8, md: 16, lg: 24, xl: 40 },
  radius: { sm: 8, md: 14, lg: 20 },
  font: { family: "'Noto Sans JP', -apple-system, sans-serif" },
  type: {
    display: { size: 30, weight: 800, lh: 1.2 },
    h1: { size: 24, weight: 700, lh: 1.3 },
    h2: { size: 18, weight: 700, lh: 1.3 },
    h3: { size: 15, weight: 600, lh: 1.4 },
    body: { size: 14, weight: 400, lh: 1.7 },
    caption: { size: 12, weight: 400, lh: 1.5 },
    overline: { size: 11, weight: 700, lh: 1.3, ls: 0.5 },
  },
};

const C = tokens.color;

const colorData = [
  { name: "フォレストグリーン", var: "--color-primary", hex: C.primary, role: "Primary" },
  { name: "赤城グリーン", var: "--color-primary-light", hex: C.primaryLight, role: "Primary Light" },
  { name: "温泉テラコッタ", var: "--color-accent", hex: C.accent, role: "Accent" },
  { name: "湯畑サンド", var: "--color-sand", hex: C.sand, role: "Sub-accent" },
  { name: "渋川ミスト", var: "--color-secondary", hex: C.secondary, role: "Secondary" },
  { name: "尾瀬ダーク", var: "--color-text", hex: C.text, role: "Text" },
  { name: "利根スカイ", var: "--color-bg", hex: C.bg, role: "Background" },
];

const sections = ["カラー", "タイポグラフィ", "スペーシング", "コンポーネント"];

export default function StyleGuide() {
  const [active, setActive] = useState("カラー");

  const SectionNav = () => (
    <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.cardBorder}`, background: C.white, position: "sticky", top: 0, zIndex: 50 }}>
      {sections.map(s => (
        <button key={s} onClick={() => setActive(s)} style={{
          flex: 1, padding: "12px 0", border: "none", background: "none", cursor: "pointer",
          borderBottom: active === s ? `2px solid ${C.primary}` : "2px solid transparent",
          color: active === s ? C.primary : C.lightGray, fontWeight: 600, fontSize: 13,
          fontFamily: tokens.font.family,
        }}>{s}</button>
      ))}
    </div>
  );

  const ColorSection = () => (
    <div style={{ padding: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4 }}>カラーシステム</h2>
      <p style={{ fontSize: 13, color: C.gray, marginBottom: 20 }}>群馬の自然と温泉文化から導出した7色パレット</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {colorData.map(c => (
          <div key={c.hex} style={{ display: "flex", alignItems: "center", gap: 12, background: C.white, borderRadius: 12, padding: "12px 14px", border: `1px solid ${C.cardBorder}` }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: c.hex, flexShrink: 0, border: c.hex === C.bg ? `1px solid ${C.cardBorder}` : "none" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{c.name}</div>
              <div style={{ fontSize: 11, color: C.gray }}>{c.role} · {c.hex}</div>
            </div>
            <code style={{ fontSize: 11, color: C.lightGray, background: C.bg, padding: "2px 6px", borderRadius: 4 }}>{c.var}</code>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, background: C.white, borderRadius: 12, padding: 16, border: `1px solid ${C.cardBorder}` }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 8 }}>使用比率ガイドライン</div>
        <div style={{ display: "flex", height: 32, borderRadius: 8, overflow: "hidden" }}>
          <div style={{ width: "70%", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: C.gray }}>BG 70%</div>
          <div style={{ width: "15%", background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: C.white }}>15%</div>
          <div style={{ width: "10%", background: C.secondary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: C.white }}>10%</div>
          <div style={{ width: "5%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: C.white }}>5%</div>
        </div>
      </div>
    </div>
  );

  const TypeSection = () => (
    <div style={{ padding: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4 }}>タイポグラフィ</h2>
      <p style={{ fontSize: 13, color: C.gray, marginBottom: 20 }}>Noto Sans JP — ウェイトで階層表現</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Object.entries(tokens.type).map(([key, t]) => (
          <div key={key} style={{ background: C.white, borderRadius: 12, padding: "14px 16px", border: `1px solid ${C.cardBorder}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <code style={{ fontSize: 11, color: C.primary, fontWeight: 600, background: `${C.primary}10`, padding: "2px 6px", borderRadius: 4 }}>{key}</code>
              <span style={{ fontSize: 11, color: C.lightGray }}>{t.size}px · w{t.weight} · lh {t.lh}</span>
            </div>
            <div style={{ fontSize: t.size, fontWeight: t.weight, lineHeight: t.lh, color: C.text, letterSpacing: t.ls || 0 }}>
              {key === "display" ? "群馬を、つながる。" :
               key === "overline" ? "温泉町 · 草津エリア" :
               "草津温泉の湯畑を中心に広がる温泉街"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SpaceSection = () => (
    <div style={{ padding: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4 }}>スペーシング & レイディアス</h2>
      <p style={{ fontSize: 13, color: C.gray, marginBottom: 20 }}>4pxベースのスケール</p>

      <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 10 }}>Spacing</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {Object.entries(tokens.space).map(([key, val]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, background: C.white, borderRadius: 10, padding: "10px 14px", border: `1px solid ${C.cardBorder}` }}>
            <code style={{ fontSize: 12, color: C.primary, fontWeight: 600, width: 70 }}>space-{key}</code>
            <div style={{ width: val, height: 20, background: `${C.primary}30`, borderRadius: 3 }} />
            <span style={{ fontSize: 12, color: C.gray }}>{val}px</span>
          </div>
        ))}
      </div>

      <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 10 }}>Border Radius</div>
      <div style={{ display: "flex", gap: 12 }}>
        {Object.entries(tokens.radius).map(([key, val]) => (
          <div key={key} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: val, background: `${C.primary}15`, border: `2px solid ${C.primary}`, margin: "0 auto 8px" }} />
            <code style={{ fontSize: 11, color: C.primary, fontWeight: 600 }}>{key}</code>
            <div style={{ fontSize: 11, color: C.gray }}>{val}px</div>
          </div>
        ))}
      </div>
    </div>
  );

  const ComponentSection = () => (
    <div style={{ padding: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4 }}>UIコンポーネント</h2>
      <p style={{ fontSize: 13, color: C.gray, marginBottom: 20 }}>実際の描画で確認できるコンポーネント一覧</p>

      {/* Buttons */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 10 }}>ボタン</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={{ background: C.accent, color: C.white, border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: tokens.font.family }}>購入する</button>
          <button style={{ background: C.white, color: C.primary, border: `1.5px solid ${C.primary}`, borderRadius: 8, padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: tokens.font.family }}>詳細を見る</button>
          <button style={{ background: "transparent", color: C.primary, border: "none", padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: tokens.font.family, textDecoration: "underline" }}>すべて見る</button>
        </div>
      </div>

      {/* Filter Chips */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 10 }}>フィルターチップ</div>
        <div style={{ display: "flex", gap: 6 }}>
          {["すべて", "観光", "通勤", "割引"].map((label, i) => (
            <span key={label} style={{
              background: i === 0 ? C.primary : C.white, color: i === 0 ? C.white : C.text,
              border: `1px solid ${i === 0 ? C.primary : "#ddd"}`, borderRadius: 20, padding: "5px 14px",
              fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: tokens.font.family,
            }}>{label}</span>
          ))}
        </div>
      </div>

      {/* Destination Card */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 10 }}>行き先カード (DestinationCard)</div>
        <div style={{ background: C.white, borderRadius: 14, padding: 18, border: `1.5px solid ${C.cardBorder}`, maxWidth: 300 }}>
          <div style={{ fontSize: 11, color: C.primary, fontWeight: 700, letterSpacing: 0.5, marginBottom: 2 }}>温泉町 · 草津エリア</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 4 }}>草津温泉</div>
          <div style={{ fontSize: 12, color: C.gray }}>草津高原線フリーパス ¥1,540</div>
        </div>
      </div>

      {/* Destination Card with discount */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 10 }}>行き先カード (割引あり)</div>
        <div style={{ background: C.white, borderRadius: 14, padding: 18, border: `1.5px solid ${C.cardBorder}`, maxWidth: 300 }}>
          <div style={{ fontSize: 11, color: C.secondary, fontWeight: 700, letterSpacing: 0.5, marginBottom: 2 }}>駅 · 前橋エリア</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 4 }}>前橋駅</div>
          <div style={{ fontSize: 12, color: C.gray, marginBottom: 6 }}>中心市街地乗り放題券 ¥500</div>
          <div style={{ background: `${C.sand}66`, borderRadius: 6, padding: "4px 8px", fontSize: 11, color: C.accent, fontWeight: 600 }}>
            💡 前橋市民なら割引あり
          </div>
        </div>
      </div>

      {/* Segment Card */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 10 }}>セグメントカード</div>
        <div style={{ display: "flex", gap: 10 }}>
          {[{ icon: "🗻", title: "旅する", color: C.primary }, { icon: "🚌", title: "暮らす", color: C.secondary }].map(s => (
            <div key={s.title} style={{ flex: 1, background: C.white, borderRadius: 14, padding: "18px 14px", border: `1.5px solid ${C.cardBorder}`, textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{s.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 10 }}>タブバー (行き先オブジェクト用)</div>
        <div style={{ display: "flex", borderBottom: `1px solid #eee`, background: C.white, borderRadius: "10px 10px 0 0" }}>
          {[
            { icon: "🚃", label: "アクセス", active: true },
            { icon: "🎫", label: "チケット", active: false },
            { icon: "📍", label: "周辺", active: false },
            { icon: "📱", label: "予約", active: false },
          ].map(tab => (
            <div key={tab.label} style={{
              flex: 1, padding: "10px 0", textAlign: "center",
              borderBottom: tab.active ? `2px solid ${C.primary}` : "2px solid transparent",
              color: tab.active ? C.primary : C.lightGray, fontWeight: 600, fontSize: 12,
            }}>{tab.icon} {tab.label}</div>
          ))}
        </div>
      </div>

      {/* Discount Banner */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 10 }}>割引バナー (条件付き表示)</div>
        <div style={{ background: `${C.sand}66`, borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
          <span style={{ marginRight: 6 }}>💡</span>
          <span style={{ color: C.text, fontWeight: 600 }}>前橋市民の方:</span>
          <span style={{ color: C.gray }}> 乗り放題券が ¥500→¥360 に（マイナンバーカード登録時）</span>
        </div>
      </div>

      {/* Search Bar */}
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 10 }}>検索バー</div>
        <div style={{ background: C.white, borderRadius: 14, padding: "14px 16px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 11, color: C.gray, fontWeight: 600, marginBottom: 8 }}>経路検索</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${C.primary}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.primary }} />
              </div>
              <input placeholder="出発地を入力" style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, outline: "none", fontFamily: tokens.font.family, boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 20, height: 20, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: `8px solid ${C.accent}` }} />
              </div>
              <input placeholder="目的地を入力" style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, outline: "none", fontFamily: tokens.font.family, boxSizing: "border-box" }} />
            </div>
            <button style={{ background: C.accent, color: C.white, border: "none", borderRadius: 8, padding: "11px 0", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: tokens.font.family, width: "100%" }}>経路を検索</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", background: C.bg, minHeight: "100vh", fontFamily: tokens.font.family }}>
      <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryLight} 100%)`, padding: "24px 20px 16px", color: C.white }}>
        <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: 2, marginBottom: 4 }}>GUNMAAS DESIGN SYSTEM</div>
        <div style={{ fontSize: 24, fontWeight: 800 }}>スタイルガイド</div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>Phase 4: ビジュアルアイデンティティ</div>
      </div>
      <SectionNav />
      {active === "カラー" && <ColorSection />}
      {active === "タイポグラフィ" && <TypeSection />}
      {active === "スペーシング" && <SpaceSection />}
      {active === "コンポーネント" && <ComponentSection />}
    </div>
  );
}
