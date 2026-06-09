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
 * - `default` 1280px — 標準 SaaS app width (rail-demo の現状値)
 * - `wide`    1536px — Dashboard / 横長 content
 * - `full`    100%   — 制約なし (special case)
 */
export type AppShellContentMax = 'narrow' | 'default' | 'wide' | 'full';

/**
 * AppShell Props
 *
 * Application shell の骨格を提供する composite。
 * mobile / PC で **構造そのものが変わる** タイプの layout:
 * - **mobile (< lg)**: Header (top) + subBar? + main + BottomNav (bottom fixed)
 * - **PC (>= lg)**: Sidebar (left) + 右 pane (subBar? + main)
 *
 * Header / Sidebar / BottomNav / subBar の **中身** は consumer 提供 (slot)。
 * AppShell は配置と breakpoint 制御 (lg:hidden / hidden lg:block) を担当する。
 *
 * `PageTitleProvider` 等の context 共有は **consumer 側で実装**。AppShell は
 * router/state 依存を持ち込まず、純粋に slot-based。
 *
 * @example
 *   // 標準的な利用 (rail-demo を踏襲)
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
   * Content の max-width 段階。layout token `max-w-container[*]` を内部で利用。
   * @default 'default'
   */
  contentMax?: AppShellContentMax;
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
 * 内部構造:
 * - outer: `min-h-screen flex flex-col lg:flex-row bg-background` (mobile = 縦積み、PC = 横並び)
 * - header: AppShell が `lg:hidden` でラップ
 * - sidebar: AppShell が `hidden lg:block` でラップ (`<aside>`)
 * - right pane (`flex-1 min-w-0 flex flex-col`): subBar + main
 * - main inner: `mx-auto` + `px-container` (token 由来) + `max-w-container[*]` + `pt/pb`
 *   - bottomNav あり時: mobile `pb-20` (h-16 nav + 16px gap)、lg で `pb-8` に戻る
 *   - bottomNav なし時: `py-container` (token 由来)
 * - bottomNav: AppShell が `lg:hidden` でラップ
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
  children,
  className,
  ...rest
}) => {
  const renderBottomNav = bottomNav !== undefined && showBottomNav;
  const mainPaddingY = renderBottomNav
    ? 'pt-4 sm:pt-6 lg:pt-8 pb-20 lg:pb-8'  // bottomNav clearance on mobile
    : 'py-container';
  return (
    <div
      {...rest}
      className={['min-h-screen flex flex-col lg:flex-row bg-background', className].filter(Boolean).join(' ')}
    >
      {header && <div className="lg:hidden">{header}</div>}
      {sidebar && <aside className="hidden lg:block">{sidebar}</aside>}
      <div className="flex-1 min-w-0 flex flex-col">
        {subBar}
        <main className="flex-1 flex flex-col">
          <div
            className={[
              'flex-1 w-full mx-auto px-container',
              maxWidthClasses[contentMax],
              mainPaddingY,
            ].join(' ')}
          >
            {children}
          </div>
        </main>
      </div>
      {renderBottomNav && <div className="lg:hidden">{bottomNav}</div>}
    </div>
  );
};

AppShell.displayName = 'AppShell';
