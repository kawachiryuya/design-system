import React from 'react';
import { AppShell, Button, Card, Input, Checkbox } from '@kawachiryuya/design-system';

/**
 * mode①(no-Tailwind) 検証アプリ。
 *
 * - DS コンポーネント (AppShell / Button / Card / Input / Checkbox) は styles.css の
 *   焼き込み済み utility で自己完結する (このファイルに Tailwind class は書かない)。
 * - 自前の chrome (sidebar / header / bottomNav の中身) は no-Tailwind 消費者と同じく
 *   素の inline style + token CSS 変数 (var(--color-*)) で組む。
 *
 * 確認ポイント:
 *  1. responsive: ≥1024px(shell) で sidebar 表示・header/bottomNav 非表示 / <1024px で逆。
 *  2. 見た目一致: Button の border/ring/surface 色、Card の枠線、フォームの枠線が Storybook と一致。
 */

// ── 自前 chrome のスタイル (token 変数を素の CSS で参照。Tailwind は使わない) ──
const brand: React.CSSProperties = { fontWeight: 700, fontSize: 18, color: 'var(--color-on-default)' };
const navLink: React.CSSProperties = {
  display: 'block',
  padding: '8px 12px',
  borderRadius: 8,
  color: 'var(--color-on-soft)',
  textDecoration: 'none',
  fontSize: 14,
};
const sectionTitle: React.CSSProperties = { fontSize: 22, fontWeight: 700, margin: '0 0 4px' };
const sectionLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--color-on-muted)',
  margin: '24px 0 8px',
};
const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' };
const cardGrid: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 16 };

const NAV = ['ダッシュボード', 'プロジェクト', 'メンバー', '設定'];

const Sidebar = () => (
  <div
    style={{
      width: 240,
      height: '100%',
      boxSizing: 'border-box',
      padding: 16,
      borderRight: '1px solid var(--color-border-default)',
      background: 'var(--color-surface-layer-1)',
    }}
  >
    <div style={{ ...brand, marginBottom: 24 }}>Acme DS</div>
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {NAV.map((n, i) => (
        <a key={n} href="#" style={{ ...navLink, ...(i === 0 ? { background: 'var(--color-surface-secondary)', color: 'var(--color-on-primary)' } : null) }}>
          {n}
        </a>
      ))}
    </nav>
  </div>
);

const Header = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderBottom: '1px solid var(--color-border-default)',
      background: 'var(--color-surface-layer-1)',
    }}
  >
    <span style={brand}>Acme DS</span>
    <span style={{ fontSize: 13, color: 'var(--color-on-muted)' }}>mode① / mobile</span>
  </div>
);

const BottomNav = () => (
  <div
    style={{
      display: 'flex',
      borderTop: '1px solid var(--color-border-default)',
      background: 'var(--color-surface-layer-1)',
    }}
  >
    {NAV.map((n) => (
      <a key={n} href="#" style={{ flex: 1, textAlign: 'center', padding: '10px 4px', fontSize: 12, color: 'var(--color-on-soft)', textDecoration: 'none' }}>
        {n}
      </a>
    ))}
  </div>
);

const SubBar = () => (
  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', fontSize: 14, color: 'var(--color-on-muted)' }}>
    ダッシュボード / 概要
  </div>
);

export const App = () => {
  const variants = ['primary', 'secondary', 'tertiary', 'destructive'] as const;
  const sizes = ['sm', 'md', 'lg'] as const;
  return (
    <AppShell header={<Header />} sidebar={<Sidebar />} bottomNav={<BottomNav />} subBar={<SubBar />}>
      <h1 style={sectionTitle}>mode① — no-Tailwind 消費の実証</h1>
      <p style={{ margin: 0, color: 'var(--color-on-soft)', fontSize: 14 }}>
        この画面は <code>styles.css</code> + <code>variables.css</code> の 2 ファイルだけで描画されています
        (Tailwind は未使用)。ウィンドウ幅を 1024px の上下で変えると、サイドバー / ヘッダー / 下部ナビの出し分けが切り替わります。
      </p>

      <div style={sectionLabel}>Buttons — variant × size</div>
      {sizes.map((size) => (
        <div key={size} style={{ ...row, marginBottom: 8 }}>
          {variants.map((variant) => (
            <Button key={variant} variant={variant} size={size}>
              {variant} / {size}
            </Button>
          ))}
        </div>
      ))}
      <div style={{ ...row, marginTop: 8 }}>
        <Button variant="primary" disabled>disabled</Button>
        <Button variant="primary" loading>loading</Button>
      </div>

      <div style={sectionLabel}>Cards — variant</div>
      <div style={cardGrid}>
        {(['elevated', 'outlined', 'filled'] as const).map((v) => (
          <Card key={v} variant={v} padding="md">
            <div style={{ width: 220 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Card / {v}</div>
              <div style={{ fontSize: 14, color: 'var(--color-on-soft)' }}>
                枠線・影・背景が Storybook と一致するか確認する面。
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={sectionLabel}>Form — Input + Checkbox</div>
      <Card variant="outlined" padding="lg">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="email" style={{ fontSize: 14, fontWeight: 600 }}>メールアドレス</label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <Checkbox label="利用規約に同意する" description="送信前に内容を確認してください。" />
          <div style={row}>
            <Button variant="primary">送信</Button>
            <Button variant="tertiary">キャンセル</Button>
          </div>
        </div>
      </Card>
    </AppShell>
  );
};
