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

// typography-semantic → `.type-{role}` の合成クラス (text style、#109 Typo-2)。
// 各 leaf { font-size, font-weight, line-height, letter-spacing? } を 1 クラスにまとめる。
// ネストキーは kebab で連結: page-title → 'type-page-title'、control.md → 'type-control-md'。
// components 層 (addComponents) に置くので、utilities 層の `font-bold` 等で weight だけを上書きできる
// (Typography の weight prop)。出荷コンポーネントは primitive の text-{size} / leading-* / tracking-* を
// 直接書かず、必ずこの type-* を使う (eslint で禁止、AGENTS §3-7)。
const flattenSemanticTypo = (node, prefix = '', out = {}) => {
  if (node && typeof node === 'object' && node['font-size']) {
    const decl = { fontSize: String(node['font-size']) };
    if (node['line-height'])    decl.lineHeight    = String(node['line-height']);
    if (node['font-weight'])    decl.fontWeight    = String(node['font-weight']);
    if (node['letter-spacing']) decl.letterSpacing = String(node['letter-spacing']);
    out[`.type-${prefix.replace(/-$/, '')}`] = decl;
    return out;
  }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      flattenSemanticTypo(v, prefix + k + '-', out);
    }
  }
  return out;
};
const typeStyles = t['typography-semantic'] ? flattenSemanticTypo(t['typography-semantic']) : {};

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
    // Tailwind 既定の `px` (1px) はここで落ちる。`mt-px` / `-mb-px` は CSS を生成しない (check:utilities が弾く、#125)。
    // 1px が要るときは `mt-[1px]` と値を書く。
    spacing: tailwindSpacing,
    colors: {
      // Primitive palette は **hue 名** で表現 (2 層アーキテクチャの純度を保つため)。
      // brand / 機能色の役割名は semantic-colors.json (surface.primary / onSurface.success 等)
      // で担う。semantic が参照する 6 hue のみ (予備 hue は #109 で削除、必要になった時に足す)。
      teal:    t.color.teal,
      neutral: t.color.neutral,
      green:   t.color.green,
      red:     t.color.red,
      orange:  t.color.orange,
      blue:    t.color.blue,
      white: t.color.base.white,
      black: t.color.base.black,
      transparent: t.color.base.transparent,
      // Tailwind 既定の特殊値。theme.colors を上書きすると既定ごと消えるため明示的に残す
      // (text-inherit / text-current / ring-current 等が CSS を生成しなくなっていた #109)。
      inherit: 'inherit',
      current: 'currentColor',
    },
    fontSize: t.typography['font-size'],
    // token は regular / medium / bold。Tailwind 慣用の `font-normal` は regular の
    // alias として残す (`rounded` ≒ `rounded-md` と同じ DEFAULT/alias の手法)。上書きで消すと
    // 「書いても CSS が出ない」silent break になる (#109)。
    fontWeight: { ...t.typography['font-weight'], normal: t.typography['font-weight'].regular },
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
    // inner-*: 枠線 1px (Tailwind の `border`) の内側の角丸。丸い枠の中に詰まった要素
    // (Accordion の見出し / NumberInput の ±) の角を枠に沿わせ、内側のフォーカスの輪が枠の丸みで欠けないようにする (DDR-2 #131)。
    // 1px は部品の枠線の太さ (border width の token は無いので、ここ 1 か所にだけ置く)。
    borderRadius: {
      ...t.radius,
      DEFAULT: t.radius.md,
      'inner-sm': `calc(${t.radius.sm} - 1px)`,
      'inner-md': `calc(${t.radius.md} - 1px)`,
    },
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

      // ── Focus ring ──
      // フォーカスの輪は box-shadow (ring) でなく outline で描く。utility は下の plugins の
      // `.focus-ring` / `.focus-ring-inset` / `.focus-ring-on-fill` (DDR-2 #131、AGENTS §3-2「フォーカスの規則」)。
      // ── Semantic color tokens (WHERE × WHAT) ──
      // CSS 変数経由で resolve（実体は tokens/build/variables.css）
      backgroundColor: {
        background: 'var(--color-bg-default)',
        surface: {
          // 面の階層: default (= bg-surface、カード等の既定の面) → subtle (default の中の入れ子区画)。
          // `default` キーも置き、bg-surface / bg-surface-default のどちらでも生成する (#107 の DEFAULT 問題の回避)。
          DEFAULT: 'var(--color-surface-default)',
          default: 'var(--color-surface-default)',
          subtle:  'var(--color-surface-subtle)',
          // 特殊役割 (階層軸とは別)
          overlay: 'var(--color-surface-overlay)',
          // 役割色 (brand / functional)。{role} = solid、{role}-muted = 薄い面 (Container ペア)
          primary:         'var(--color-surface-primary)',
          'primary-muted': 'var(--color-surface-primary-muted)',
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
          'neutral-muted':  'var(--color-surface-neutral-muted)',
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
          // 階層は default / subtle の 2 段 (#109)。primary = brand 色テキスト (リンク等) で階層軸とは別。
          // disabled は state 軸 (操作不能、legible 要件免除)。
          DEFAULT:  'var(--color-on-surface-default)',
          default:  'var(--color-on-surface-default)',
          subtle:   'var(--color-on-surface-subtle)',
          primary:  'var(--color-on-surface-primary)',
          success:  'var(--color-on-surface-success)',
          error:    'var(--color-on-surface-error)',
          warning:  'var(--color-on-surface-warning)',
          info:     'var(--color-on-surface-info)',
          disabled: 'var(--color-on-surface-disabled)',
          inverse:  'var(--color-on-surface-inverse)',
        },
      },
      borderColor: {
        border: {
          // 中性の強度軸 subtle / default / strong。`border-border-default` (トークン名どおりの綴り) も生成する (#107)
          DEFAULT:  'var(--color-border-default)',
          default:  'var(--color-border-default)',
          subtle:   'var(--color-border-subtle)',
          strong:   'var(--color-border-strong)',
          // brand の枠線 (塗り surface.primary と同じ 600)。Button secondary / Badge outline primary / FilterChip active。focus ring は border-focus (700)
          'primary-strong': 'var(--color-border-primary-strong)',
          // role × 強度: {role}-muted (薄い面 surface.{role}-muted の縁) / {role}-strong (強い枠: validation / Badge outline)
          'success-muted':  'var(--color-border-success-muted)',
          'success-strong': 'var(--color-border-success-strong)',
          'error-muted':    'var(--color-border-error-muted)',
          'error-strong':   'var(--color-border-error-strong)',
          'warning-muted':  'var(--color-border-warning-muted)',
          'warning-strong': 'var(--color-border-warning-strong)',
          'info-muted':     'var(--color-border-info-muted)',
          'info-strong':    'var(--color-border-info-strong)',
          // Interactive (強度軸とは独立)
          focus:    'var(--color-border-focus)',
        },
      },
      ringColor: {
        border: {
          focus:   'var(--color-border-focus)',
          // border.primary は border 強度軸 refactor (subtle/default/strong) で廃止。
          // teal.700 (= border-focus) と同色のため alias 継続、consumer 側の `ring-border-primary` は引き続き有効。
          primary: 'var(--color-border-focus)',
          // border.error は border-error-strong (red.600) のエイリアス。consumer 側で
          // `ring-border-error` が複数 component (Button / Input / Select / Checkbox / Radio / Textarea)
          // から参照されているため alias 継続。
          error:   'var(--color-border-error-strong)',
        },
        // 旧 `ring-surface` は surface.default (= white) を指す alias。
        surface: 'var(--color-surface-default)',
      },
      divideColor: {
        // divide-border / divide-border-subtle 等は borderColor から自動派生する。
        // 旧 alias `divide-border-muted` (= border.subtle) は #109 で廃止 (muted は role の薄い面を指す語に統一)。
        border: {
          DEFAULT: 'var(--color-border-default)',
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
    // ── container queries (@container / @[Npx]: 変種) ──
    // ActionBar 等、利用可能幅 (= 群自身の container 幅) で縦横を切替える composite の前提。
    // viewport media query では SplitPane / TwoColumn 内の狭い pane で破綻するため container 基準にする。
    // preset 経由で mode② (consumer ビルド) に継承され、mode① は styles:build が
    // components/ をスキャンして dist/styles.css に precompile する (両モード対応の要)。
    require('@tailwindcss/container-queries'),
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
    // ── Semantic typography: `.type-{role}` (hero/page/section/item-title / body / control / label / caption) ──
    // 例: <p className="type-body">…</p> / <h2 className="type-section-title">…</h2>
    // size + line-height + weight (+ 字間) をセットで持つ text style。components 層なので
    // `type-section-title font-normal` のように weight だけ utility で上書きできる。
    plugin(function ({ addComponents }) {
      addComponents(typeStyles);
    }),
    // ── フォーカスの輪: `.focus-ring` / `.focus-ring-inset` / `.focus-ring-on-fill` (DDR-2 #131) ──
    // 規則 (正本は AGENTS §3-2「フォーカスの規則」): 輪は border.focus の 2px。外側に出す余地があれば
    // 「外側＋すき間 2px」(focus-ring)、無ければ「内側」(focus-ring-inset)。濃い塗りの内側は白で、縁から 2px 内側 (focus-ring-on-fill)。
    // - 出る条件 (:focus-visible) を class の中に持つ。部品は `focus-visible:` を付けずに 1 つ書くだけ。
    //   文字の入力欄はブラウザがクリックでも :focus-visible にするので、入力欄は「クリックでも出る」。
    // - outline で描く: すき間を塗らない (下の面の色が見える)、ホバーの box-shadow と別の層、
    //   forced-colors (Windows ハイコントラスト) でも消えない。
    // - 値は CSS 変数 (--focus-ring-width / --focus-ring-offset / --color-border-focus) 経由で、利用側が上書きできる。
    // - `[data-ds-hide-focus-ring]` の中では出さない (#157): ポインタ (指・マウス) で開いた重なり (Menu など) は、
    //   開いた直後に項目へフォーカスを移すが、輪はキーボードの現在地なので、キーが押されるまで出さない。
    //   `:focus-visible` の判断はブラウザごとに違う (iOS の Safari は指で開いても出す) ので、部品が属性で決める。
    //   `:where()` で包むので詳細度は変わらない
    plugin(function ({ addComponents }) {
      const width = 'var(--focus-ring-width)';
      const offset = 'var(--focus-ring-offset)';
      const shown = '&:focus-visible:not(:where([data-ds-hide-focus-ring], [data-ds-hide-focus-ring] *))';
      // 隠すときは、ブラウザ既定の輪 (outline-style: auto) も出さない
      const hidden = '&:focus-visible:where([data-ds-hide-focus-ring], [data-ds-hide-focus-ring] *)';
      addComponents({
        '.focus-ring': {
          [hidden]: { outline: 'none' },
          [shown]: {
            outline: `${width} solid var(--color-border-focus)`,
            outlineOffset: offset,
          },
        },
        '.focus-ring-inset': {
          [hidden]: { outline: 'none' },
          [shown]: {
            outline: `${width} solid var(--color-border-focus)`,
            outlineOffset: `calc(-1 * ${width})`,
          },
        },
        '.focus-ring-on-fill': {
          [hidden]: { outline: 'none' },
          [shown]: {
            outline: `${width} solid var(--color-on-surface-inverse)`,
            outlineOffset: `calc(-1 * (${width} + ${offset}))`,
          },
        },
      });
    }),
    // ── 出荷する非 utility の部品の CSS (Checkbox / Radio / ProgressBar) ──
    // 正本はここだけ。preset を通るビルド (モード 2 の利用側・Storybook・配信の dist/styles.css) の
    // すべてに同じ規則が入る。以前は styles/components.css にあり、Storybook と dist だけが @import していたので、
    // モード 2 の利用側では選んだ Radio の点・Checkbox のチェックの絵が出なかった (#178)。
    // - components 層 (addComponents): utilities より前に出るので、`checked:bg-surface-primary` や
    //   `checked:hover:shadow-[…]` などの utility との順序は以前と同じ (utility が後)。
    // - `.ds-checkbox` / `.ds-radio` は content にそのクラスが出てこなければ捨てられる (使わない利用側は払わない)。
    //   `@keyframes` はクラスを持たないので常に出る。
    // - 届いていることは check:preset-styles (モード 2) と check:styles (モード 1) が、
    //   scripts/component-css-rules.mjs の一覧 (セレクタと効いている宣言) で確かめる。ここを変えたら一覧も変える。
    plugin(function ({ addComponents }) {
      // チェックの絵は data URL の SVG なので、CSS 変数を読めない。白 (onSurface.inverse の既定値) を直に持つ
      const svg = (body) =>
        `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E${body}%3C/svg%3E")`;
      const mark = {
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
      addComponents({
        '.ds-checkbox:checked': {
          backgroundImage: svg(
            "%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2.5-2.5a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E"
          ),
          ...mark,
        },
        '.ds-checkbox:indeterminate': {
          backgroundColor: 'var(--color-surface-primary)',
          borderColor: 'var(--color-surface-primary)',
          backgroundImage: svg("%3Crect x='3' y='7' width='10' height='2' rx='1'/%3E"),
          ...mark,
        },
        // 選んだ Radio の点: 塗り (surface.primary / error) の内側 3px を白で抜く。
        // Checkbox のチェックの絵 (data URL の SVG で CSS 変数を読めない、白) と揃えて固定の白にする。
        // token (onSurface.inverse) に揃えるのは、Checkbox を別の描き方にするときに 2 つまとめて (#178)
        '.ds-radio:checked': {
          boxShadow: 'inset 0 0 0 3px white',
        },
        // ProgressBar の indeterminate が animate-[indeterminate_1.5s_ease-in-out_infinite] (arbitrary) で参照する。
        // Tailwind は animation の値は出すが @keyframes 本体は出さないので、ここで定義する
        '@keyframes indeterminate': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
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

        // -- content.max-width: Center 用の content-level 幅 (sm/md/lg/xl) --
        // shell-level の max-w-container (px) とは別軸。content 側は rem 基準で
        // root font-size に追従し、本文 measure を保つ (a11y)。
        '.max-w-content-sm': { maxWidth: 'var(--layout-content-max-width-sm)' },
        '.max-w-content-md': { maxWidth: 'var(--layout-content-max-width-md)' },
        '.max-w-content-lg': { maxWidth: 'var(--layout-content-max-width-lg)' },
        '.max-w-content-xl': { maxWidth: 'var(--layout-content-max-width-xl)' },

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

        // -- gap-grid: grid.gutter トークン由来の gap (breakpoint 内蔵 16/16/24) --
        // .grid-base と同じ gutter を、12カラム格子に乗らない fr テンプレート
        // (TwoColumn の 2fr_1fr 等) にも適用するための単独 gap utility。
        '.gap-grid': {
          gap: 'var(--layout-grid-gutter-mobile)',
          '@media (min-width: 768px)': { gap: 'var(--layout-grid-gutter-tablet)' },
          '@media (min-width: 1024px)': { gap: 'var(--layout-grid-gutter-desktop)' },
        },
      });
    }),
  ],
};
