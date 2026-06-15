/**
 * Tailwind preset — design-system tokens
 *
 * 各 PJ の tailwind.config.js から `presets: [require('.../tokens/preset')]` で継承。
 * PJ 固有の追加は `theme.extend` に書く。
 *
 * 一次ソース: tokens/source/x.json → Style Dictionary → tokens/build/tokens.json
 */

const path = require('path');
const plugin = require('tailwindcss/plugin');

let t;
try {
  t = require(path.join(__dirname, 'build/tokens.json'));
} catch (e) {
  throw new Error(
    'Design tokens not built yet.\n' +
    'Run `npm run tokens:build` at the design-system repo root.\n' +
    `Looking for: ${path.join(__dirname, 'build/tokens.json')}`
  );
}

// セマンティック breakpoint (C-1 / #48): 役割名を breakpoint トークンから派生する
// (値の二重ハードコードを避ける)。
// - shell = AppShell が mobile↔PC (sidebar) に切り替わる点
// - cols  = 列レイアウト (TwoColumn 等) が stack↔grid に切り替わる点
// 注: CSS カスタムプロパティは media query 条件部に書けないため、breakpoint の役割は
//     本質的にビルド時管理 (dimension トークンと違い runtime :root override 不可)。
// consumer は自前 preset でこの派生先 (例 shell: '1280px') を override 可能。
const screens = { ...t.screens, shell: t.screens.lg, cols: t.screens.lg };

// fontFamily は CSS では comma-separated string、Tailwind では array が望ましい。
const splitFontFamily = (s) =>
  typeof s === 'string' ? s.split(/\s*,\s*/) : s;

// typography-semantic を Tailwind の theme.fontSize 形式に変換。
// 各 leaf は { 'font-size', 'line-height', 'letter-spacing' (任意) } のオブジェクト。
// font-weight はキーに含まれていても Tailwind の fontSize には注入しない
// (variant の weight 上書きを font-* ユーティリティで効かせるため)。
// ネストキーは kebab で連結: heading.display → 'heading-display'
const flattenSemanticTypo = (node, prefix = '', out = {}) => {
  if (node && typeof node === 'object' && node['font-size']) {
    const opts = {};
    if (node['line-height'])    opts.lineHeight    = String(node['line-height']);
    if (node['letter-spacing']) opts.letterSpacing = String(node['letter-spacing']);
    out[prefix.replace(/-$/, '')] = [node['font-size'], opts];
    return out;
  }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      flattenSemanticTypo(v, prefix + k + '-', out);
    }
  }
  return out;
};
const semanticTypo = t['typography-semantic']
  ? flattenSemanticTypo(t['typography-semantic'])
  : {};

/**
 * Spacing 名を Tailwind utility 名に変換する。
 *
 * ソースキー `0_5` (Style Dictionary の dot-path 干渉を避けるためアンダースコア表記、
 * tokens/source/spacing.json 参照) を Tailwind 標準の `0.5` 表記に戻す。
 * 結果として utility 名は `gap-0.5` / `w-0.5` 等の Tailwind 標準準拠形になる。
 */
const tailwindSpacing = Object.fromEntries(
  Object.entries(t.spacing).map(([k, v]) => [k.replace(/_/g, '.'), v])
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    // ── Core (overrides Tailwind defaults) ──
    spacing: tailwindSpacing,
    colors: {
      // Primitive palette は **hue 名** で表現 (2 層アーキテクチャの純度を保つため)。
      // brand / 機能色の役割名は semantic-colors.json (surface.primary / on.success 等)
      // で担う。13 palette × 10 shade で hue wheel を 30° 刻みで埋める。
      teal:    t.color.teal,
      neutral: t.color.neutral,
      green:   t.color.green,
      red:     t.color.red,
      orange:  t.color.orange,
      blue:    t.color.blue,
      yellow:  t.color.yellow,
      lime:    t.color.lime,
      cyan:    t.color.cyan,
      sky:     t.color.sky,
      violet:  t.color.violet,
      purple:  t.color.purple,
      pink:    t.color.pink,
      white: t.color.base.white,
      black: t.color.base.black,
      transparent: t.color.base.transparent,
    },
    fontSize: t.typography['font-size'],
    fontWeight: t.typography['font-weight'],
    lineHeight: t.typography['line-height'],
    letterSpacing: t.typography['letter-spacing'],
    fontFamily: {
      sans: splitFontFamily(t.typography['font-family'].sans),
      mono: splitFontFamily(t.typography['font-family'].mono),
    },
    // size scale (xs/sm/md/lg/...) を持つカテゴリは `md` を default として宣言。
    // source token の構造は手を加えず、Tailwind 側で DEFAULT エイリアスを足す形に統一。
    // 利用側: `shadow` ≒ `shadow-md`、`rounded` ≒ `rounded-md` で動く。
    boxShadow:    { ...t.shadow, DEFAULT: t.shadow.md },
    borderRadius: { ...t.radius, DEFAULT: t.radius.md },
    screens,
    transitionDuration: t.duration,
    transitionTimingFunction: t.easing,

    extend: {
      // ── Semantic z-index layers ──
      // Tailwind の `z-{key}` utility に semantic layer (dropdown/sticky/...) を追加。
      // Tailwind 既定の `z-0/10/20/30/40/50` も並存 (上書きせず extend)。
      // 例: `<div className="z-modal">`、`<div className="z-toast">`
      zIndex: t['z-index'],

      // ── Semantic opacity values ──
      // disabled / muted / spinner-track / spinner-spin を意味付け。
      // Tailwind 既定の opacity-0/5/10/.../100 も並存。
      // 例: `<button className="opacity-disabled">`、SVG `<circle className="opacity-spinner-track" />`
      opacity: t.opacity,

      // ── Focus ring (a11y semantic) ──
      // ring-width / ring-offset-width を semantic 化。
      // 例: `focus-visible:ring-focus focus-visible:ring-offset-focus`
      ringWidth:       { focus: t['focus-ring'].width  },
      ringOffsetWidth: { focus: t['focus-ring'].offset },
      // Semantic typography (heading / body / label / caption)
      // 例: <p className="text-heading-xl">…</p>
      // 注: font-weight は意図的に含めない (variant の weight 上書きを font-* で効かせるため)
      fontSize: semanticTypo,

      // ── Semantic color tokens (WHERE × WHAT) ──
      // CSS 変数経由で resolve（実体は tokens/build/variables.css）
      backgroundColor: {
        background: 'var(--color-bg-default)',
        surface: {
          // Layer 階層 (Carbon 流の numeric 命名、ページ→入れ子の深さ):
          //   DEFAULT (= bg-surface) は layer-1 alias で利用最頻度を簡潔に保つ
          DEFAULT:   'var(--color-surface-layer-1)',
          'layer-1': 'var(--color-surface-layer-1)',
          'layer-2': 'var(--color-surface-layer-2)',
          'layer-3': 'var(--color-surface-layer-3)',
          // 特殊役割 (depth 軸とは別)
          inset:   'var(--color-surface-inset)',
          overlay: 'var(--color-surface-overlay)',
          // 役割色 (brand / functional)
          primary:   'var(--color-surface-primary)',
          secondary: 'var(--color-surface-secondary)',
          success:         'var(--color-surface-success)',
          'success-muted': 'var(--color-surface-success-muted)',
          error:           'var(--color-surface-error)',
          'error-muted':   'var(--color-surface-error-muted)',
          warning:         'var(--color-surface-warning)',
          'warning-muted': 'var(--color-surface-warning-muted)',
          info:            'var(--color-surface-info)',
          'info-muted':    'var(--color-surface-info-muted)',
          disabled:  'var(--color-surface-disabled)',
          skeleton:  'var(--color-surface-skeleton)',
          neutral:        'var(--color-surface-neutral)',
          'neutral-strong': 'var(--color-surface-neutral-strong)',
        },
        state: {
          // State layer (Material 3 流): 中性 overlay (汎用) + brand/error tinted overlay (白系背景用)
          hover:  'var(--color-state-hover)',
          active: 'var(--color-state-active)',
          'hover-primary':  'var(--color-state-hover-primary)',
          'active-primary': 'var(--color-state-active-primary)',
          'hover-error':    'var(--color-state-hover-error)',
          'active-error':   'var(--color-state-active-error)',
        },
      },
      textColor: {
        onSurface: {
          // 階層軸 (default → soft → muted) — hierarchy 名称で
          // primary/secondary/tertiary の役割名 (`primary` = brand) との衝突を回避。
          // disabled は state 軸 (操作不能、legible 要件免除) で hierarchy とは別軌道
          DEFAULT:  'var(--color-on-default)',
          soft:     'var(--color-on-soft)',
          muted:    'var(--color-on-muted)',
          // 役割 (functional / state)
          primary:  'var(--color-on-primary)',
          success:  'var(--color-on-success)',
          error:    'var(--color-on-error)',
          warning:  'var(--color-on-warning)',
          info:     'var(--color-on-info)',
          disabled: 'var(--color-on-disabled)',
          inverse:  'var(--color-on-inverse)',
        },
      },
      borderColor: {
        border: {
          // 強度軸 (intensity scale、neutral)
          DEFAULT:  'var(--color-border-default)',
          subtle:   'var(--color-border-subtle)',
          strong:   'var(--color-border-strong)',
          emphasis: 'var(--color-border-emphasis)',
          // Functional roles × intensity
          'success-subtle':   'var(--color-border-success-subtle)',
          'success-emphasis': 'var(--color-border-success-emphasis)',
          'error-subtle':     'var(--color-border-error-subtle)',
          'error-emphasis':   'var(--color-border-error-emphasis)',
          'warning-subtle':   'var(--color-border-warning-subtle)',
          'warning-emphasis': 'var(--color-border-warning-emphasis)',
          'info-subtle':      'var(--color-border-info-subtle)',
          'info-emphasis':    'var(--color-border-info-emphasis)',
          // Interactive (intensity axis とは独立)
          focus:    'var(--color-border-focus)',
        },
      },
      ringColor: {
        border: {
          focus:   'var(--color-border-focus)',
          // border.primary は border 強度軸 refactor (subtle/default/strong/emphasis) で廃止。
          // teal.700 (= border-focus) と同色のため alias 継続、consumer 側の `ring-border-primary` は引き続き有効。
          primary: 'var(--color-border-focus)',
          // border.error は border-error-emphasis (red.600) のエイリアス。consumer 側で
          // `ring-border-error` が複数 component (Button / Input / Select / Checkbox / Radio / Textarea)
          // から参照されているため alias 継続。
          error:   'var(--color-border-error-emphasis)',
        },
        // surface.default は廃止済 (Carbon 流の layer-1/2/3 numeric 体系に移行、CHANGELOG `Surface layer 階層化` 参照)。
        // 旧 `ring-surface` は layer-1 (= white) を指していたため、現行命名で同等の参照に更新。
        surface: 'var(--color-surface-layer-1)',
      },
      divideColor: {
        border: {
          DEFAULT: 'var(--color-border-default)',
          // border.muted は border-subtle (neutral.200) のエイリアス。consumer 側で
          // `divide-border-muted` が継続利用されているため alias 継続。
          muted:   'var(--color-border-subtle)',
        },
      },
    },
  },

  // ── Layout (container / section / grid) ──
  // page-level layout frame の semantic utility。Tailwind の `container` plugin と
  // 同じ手法で、単一 utility class 内に breakpoint 別 @media を内蔵する。
  // CSS 変数経由なので product 側は :root で値を 1 行 override 可能。
  // 詳細: components/tokens/Layout.guideline.mdx
  plugins: [
    // ── prefers-reduced-motion (a11y / WCAG 2.3.3) ──
    // animation / transition トークンを多用するため、視覚過敏・前庭障害ユーザー向けに
    // OS の「視差効果を減らす」設定時はアニメーションをほぼ無効化する。
    // preset 経由で consumer の `@tailwind base` にも注入され、Storybook と出荷先の双方に効く。
    plugin(function ({ addBase }) {
      addBase({
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
            scrollBehavior: 'auto !important',
          },
        },
      });
    }),
    plugin(function ({ addUtilities }) {
      addUtilities({
        // -- container: 大外 page wrapper の左右 / 上下 padding (breakpoint 内蔵) --
        '.px-container': {
          paddingLeft:  'var(--layout-container-padding-x-mobile)',
          paddingRight: 'var(--layout-container-padding-x-mobile)',
          '@media (min-width: 768px)': {
            paddingLeft:  'var(--layout-container-padding-x-tablet)',
            paddingRight: 'var(--layout-container-padding-x-tablet)',
          },
          '@media (min-width: 1024px)': {
            paddingLeft:  'var(--layout-container-padding-x-desktop)',
            paddingRight: 'var(--layout-container-padding-x-desktop)',
          },
        },
        '.py-container': {
          paddingTop:    'var(--layout-container-padding-y-mobile)',
          paddingBottom: 'var(--layout-container-padding-y-mobile)',
          '@media (min-width: 768px)': {
            paddingTop:    'var(--layout-container-padding-y-tablet)',
            paddingBottom: 'var(--layout-container-padding-y-tablet)',
          },
          '@media (min-width: 1024px)': {
            paddingTop:    'var(--layout-container-padding-y-desktop)',
            paddingBottom: 'var(--layout-container-padding-y-desktop)',
          },
        },

        // -- container.max-width: narrow / default / wide / full の 4 variant --
        '.max-w-container':        { maxWidth: 'var(--layout-container-max-width-default)' },
        '.max-w-container-narrow': { maxWidth: 'var(--layout-container-max-width-narrow)' },
        '.max-w-container-wide':   { maxWidth: 'var(--layout-container-max-width-wide)' },
        '.max-w-container-full':   { maxWidth: 'var(--layout-container-max-width-full)' },

        // -- content.max-width: Center 用の content-level 幅 (form/reading/wide/marketing) --
        // shell-level の max-w-container (px) とは別軸。content 側は rem 基準で
        // root font-size に追従し、本文 measure を保つ (a11y)。
        '.max-w-content-form':      { maxWidth: 'var(--layout-content-max-width-form)' },
        '.max-w-content-reading':   { maxWidth: 'var(--layout-content-max-width-reading)' },
        '.max-w-content-wide':      { maxWidth: 'var(--layout-content-max-width-wide)' },
        '.max-w-content-marketing': { maxWidth: 'var(--layout-content-max-width-marketing)' },

        // -- section: gap / padding-y の sm/md/lg density variant --
        '.gap-section-sm': { gap: 'var(--layout-section-gap-sm)' },
        '.gap-section-md': { gap: 'var(--layout-section-gap-md)' },
        '.gap-section-lg': { gap: 'var(--layout-section-gap-lg)' },
        '.py-section-sm': {
          paddingTop: 'var(--layout-section-padding-y-sm)',
          paddingBottom: 'var(--layout-section-padding-y-sm)',
        },
        '.py-section-md': {
          paddingTop: 'var(--layout-section-padding-y-md)',
          paddingBottom: 'var(--layout-section-padding-y-md)',
        },
        '.py-section-lg': {
          paddingTop: 'var(--layout-section-padding-y-lg)',
          paddingBottom: 'var(--layout-section-padding-y-lg)',
        },
        '.space-y-section-sm > * + *': { marginTop: 'var(--layout-section-gap-sm)' },
        '.space-y-section-md > * + *': { marginTop: 'var(--layout-section-gap-md)' },
        '.space-y-section-lg > * + *': { marginTop: 'var(--layout-section-gap-lg)' },

        // -- grid: 12-col 表記体系 (mobile 4 / tablet 8 / desktop 12 cols + gutter 内蔵) --
        // 子要素は Tailwind 既定の col-span-N (1〜12) と sm:/lg: prefix で組合せ。
        '.grid-base': {
          display: 'grid',
          gridTemplateColumns: 'repeat(var(--layout-grid-columns-mobile), minmax(0, 1fr))',
          gap: 'var(--layout-grid-gutter-mobile)',
          '@media (min-width: 768px)': {
            gridTemplateColumns: 'repeat(var(--layout-grid-columns-tablet), minmax(0, 1fr))',
            gap: 'var(--layout-grid-gutter-tablet)',
          },
          '@media (min-width: 1024px)': {
            gridTemplateColumns: 'repeat(var(--layout-grid-columns-desktop), minmax(0, 1fr))',
            gap: 'var(--layout-grid-gutter-desktop)',
          },
        },
      });
    }),
  ],
};
