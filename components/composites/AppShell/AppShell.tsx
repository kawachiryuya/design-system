import React from 'react';

/**
 * AppShell の content max-width 段階。
 *
 * Shell-level の max-width (= ページ全体の左右余白を決める骨格)。
 * Content-level (`<Center>` の form / reading / wide / marketing) とは別軸で、
 * AppShell の内側に Center を入れ子にして両方効かせる構造。
 *
 * 値は layout token `--layout-container-max-width-*` を参照:
 * - `narrow`  768px  — settings / 単列 reading ページ等の控えめな shell
 * - `default` 1280px — 標準 SaaS app width (consumer 実装の標準値)
 * - `wide`    1536px — Dashboard / 横長 content
 * - `full`    100%   — 制約なし (special case)
 */
export type AppShellContentMax = 'narrow' | 'default' | 'wide' | 'full';

/**
 * AppShell の content 制約モード。
 *
 * - `contained` (既定) — main を `px-container` + `max-w-container[contentMax]` で包む。
 *   `<Center>` 忘れでも 1280px (default) で頭打ちする安全な backstop。本文は中で
 *   `<Center max="md">` 等を足して読み列を絞る (推奨パターン「AppShell > Center」)。
 * - `full` — wrapper (px + max-w) を外し full-bleed を可能にする。consumer が
 *   `<Section>` (full-width 背景) + `<Center>` (読み列) で組む。横 padding は外側ではなく
 *   内側 (Section/Center) が持つ。mobile の bottomNav クリアランス (下部) のみ残る。
 *
 * 2 層の役割分離: AppShell `contentMax` = shell フレーム (外側 cap) / Center `max` = 読み列 (内側)。
 */
export type AppShellLayout = 'contained' | 'full';

/**
 * AppShell Props
 *
 * Application shell の骨格を提供する composite。
 * mobile / PC で **構造そのものが変わる** タイプの layout:
 * - **mobile (< shell)**: Header (top) + subBar? + main + BottomNav (bottom fixed)
 * - **PC (>= shell)**: Sidebar (left) + 右 pane (subBar? + main)
 *
 * Header / Sidebar / BottomNav / subBar の **中身** は consumer 提供 (slot)。
 * AppShell は配置と breakpoint 制御 (semantic breakpoint `shell:` で mobile↔PC を切替) を担当する。
 * `shell` は breakpoint トークンから派生 (既定 = lg / 1024px、preset で override 可)。
 *
 * `PageTitleProvider` 等の context 共有は **consumer 側で実装**。AppShell は
 * router/state 依存を持ち込まず、純粋に slot-based。
 *
 * @example
 *   // 標準的な利用
 *   <AppShell
 *     header={<Header />}
 *     sidebar={<TopHeader />}
 *     bottomNav={<BottomNav />}
 *     subBar={<PageSubBar title="ホーム" />}
 *   >
 *     <Outlet />
 *   </AppShell>
 *
 * @example
 *   // settings / detail page で BottomNav を隠す
 *   <AppShell
 *     header={<Header />}
 *     sidebar={<TopHeader />}
 *     bottomNav={<BottomNav />}
 *     showBottomNav={false}
 *   >
 *     {children}
 *   </AppShell>
 *
 * @example
 *   // narrow shell (Settings 専用画面、reading 中心)
 *   <AppShell sidebar={<Sidebar />} contentMax="narrow">
 *     {children}
 *   </AppShell>
 *
 * @example
 *   // full-bleed (Landing 等): wrapper を外し Section(背景) + Center(読み列) で組む
 *   <AppShell sidebar={<Sidebar />} layout="full">
 *     <Section padding="lg" className="bg-surface-secondary">
 *       <Center max="xl">...hero...</Center>
 *     </Section>
 *   </AppShell>
 */
export interface AppShellProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Mobile-only top header slot。viewport < lg で表示、>= lg で hidden。
   * 中身は consumer の Header コンポーネント (ブランド / メニュー構造は product 固有)。
   */
  header?: React.ReactNode;
  /**
   * PC-only left sidebar slot。viewport >= lg で表示、< lg で hidden。
   * 中身は consumer の Sidebar コンポーネント。`<aside>` でラップして semantic を保つ。
   */
  sidebar?: React.ReactNode;
  /**
   * Mobile-only bottom fixed nav slot。viewport < lg で表示、>= lg で hidden。
   * 中身は consumer の BottomNav コンポーネント (内部で `fixed bottom-0` 想定)。
   */
  bottomNav?: React.ReactNode;
  /**
   * 任意の sub-bar slot (PageSubBar / Breadcrumb / step indicator 等)。
   * main の上に挿入される。mobile / PC 両方で表示。
   */
  subBar?: React.ReactNode;
  /**
   * BottomNav を実際に表示するか。`false` でも `bottomNav` slot は受け取るが描画しない、
   * mobile main の下部クリアランス (`pb-20`) も無効化する。
   * @default true
   */
  showBottomNav?: boolean;
  /**
   * Content の max-width 段階 (`layout="contained"` 時の cap)。layout token `max-w-container[*]` を内部で利用。
   * @default 'default'
   */
  contentMax?: AppShellContentMax;
  /**
   * content 制約モード。`contained` は `px + max-w` で包む安全な既定、`full` は wrapper を外して
   * full-bleed を可能にする (consumer が Section + Center で組む)。
   * @default 'contained'
   */
  layout?: AppShellLayout;
  /** main slot に入れる子要素 (router の `<Outlet />` 等)。 */
  children: React.ReactNode;
}

const maxWidthClasses: Record<AppShellContentMax, string> = {
  narrow:  'max-w-container-narrow',
  default: 'max-w-container',
  wide:    'max-w-container-wide',
  full:    'max-w-container-full',
};

/**
 * AppShell — Atomic Design: Composite (Layout)
 *
 * 内部構造 (mobile↔PC の切替は semantic breakpoint `shell:`):
 * - outer: `min-h-screen flex flex-col shell:flex-row bg-background` (mobile = 縦積み、PC = 横並び)
 * - header: AppShell が `shell:hidden` でラップ
 * - sidebar: AppShell が `hidden shell:block` でラップ (`<aside>`)
 * - right pane (`flex-1 min-w-0 flex flex-col`): subBar + main
 * - main inner (`layout="contained"` 既定): `mx-auto` + `px-container` + `max-w-container[*]` + `pt/pb`
 *   - bottomNav あり時: mobile `pb-20` (h-16 nav + 16px gap)、`shell:pb-8` に戻る
 *   - bottomNav なし時: `py-container` (token 由来)
 * - main inner (`layout="full"`): wrapper (px + max-w) を外し `flex-1 w-full` のみ。
 *   mobile の bottomNav クリアランス (`pb-20 shell:pb-0`) だけ残す。横幅は内側 Section/Center が所有
 * - bottomNav: AppShell が `shell:hidden` でラップ
 *
 * @see AppShellProps for usage examples.
 */
export const AppShell: React.FC<AppShellProps> = ({
  header,
  sidebar,
  bottomNav,
  subBar,
  showBottomNav = true,
  contentMax = 'default',
  layout = 'contained',
  children,
  className,
  ...rest
}) => {
  const renderBottomNav = bottomNav !== undefined && showBottomNav;
  // 構造的な切替点は semantic breakpoint `shell:` を使う (C-1 / #48)。
  // bottomNav clearance (pb) も shell の切替に同期させる (mobile は nav 分の余白、shell 以上で通常)。
  const mainPaddingY = renderBottomNav
    ? 'pt-4 sm:pt-6 shell:pt-8 pb-20 shell:pb-8'  // bottomNav clearance on mobile
    : 'py-container';
  // full モードは wrapper (px + max-w) を外す。横/縦 padding は内側 (Section/Center) が持つが、
  // mobile の bottomNav クリアランス (下部) だけは shell の責務として残す。
  const fullPaddingY = renderBottomNav ? 'pb-20 shell:pb-0' : '';
  const mainInnerClass =
    layout === 'full'
      ? ['flex-1 w-full', fullPaddingY].filter(Boolean).join(' ')
      : ['flex-1 w-full mx-auto px-container', maxWidthClasses[contentMax], mainPaddingY].join(' ');
  return (
    <div data-ds-root
      {...rest}
      className={['min-h-screen flex flex-col shell:flex-row bg-background', className].filter(Boolean).join(' ')}
    >
      {header && <div className="shell:hidden">{header}</div>}
      {sidebar && <aside className="hidden shell:block">{sidebar}</aside>}
      <div className="flex-1 min-w-0 flex flex-col">
        {subBar}
        <main className="flex-1 flex flex-col">
          <div className={mainInnerClass}>
            {children}
          </div>
        </main>
      </div>
      {renderBottomNav && <div className="shell:hidden">{bottomNav}</div>}
    </div>
  );
};

AppShell.displayName = 'AppShell';
