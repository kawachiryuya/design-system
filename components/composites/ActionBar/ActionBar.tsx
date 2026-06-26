import React from 'react';
import { tv } from '../../_internal/tv';

/**
 * ActionBar の向き。
 *
 * - `responsive` (既定) — **container query** で切替: 閾値 (`collapseAt`) 以下は縦 full-width、
 *   以上は横 hug-content。判断基準は viewport ではなく **群自身の利用可能幅** なので、
 *   SplitPane / TwoColumn 内の狭い pane に置いても正しく縦に畳む。
 * - `vertical` — 常に縦 full-width。
 * - `horizontal` — 常に横 hug-content。
 */
export type ActionBarOrientation = 'responsive' | 'vertical' | 'horizontal';

/**
 * ActionBar の整列 (横並び時の main-axis 配置)。文脈で決まる数少ない「本物の判断」の 1 つ。
 *
 * - `end` (既定) — footer / フォーム下部。primary が右端に来る。
 * - `center` — 中央の終端画面 (予約完了など)。
 * - `start` — 左寄せ。
 * - `between` — 両端配置。
 *
 * 縦 full-width 時は整列は無関係 (全ボタンが全幅)。
 */
export type ActionBarAlign = 'start' | 'center' | 'end' | 'between';

/**
 * ActionBar の gap。Stack / Cluster と同一スケール。
 * @see ClusterGap
 */
export type ActionBarGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * `responsive` 時に縦→横へ切り替わる container 幅の閾値 (token)。
 *
 * モバイル列幅 (320–360px、幾何上は横が収まる) より上・デスクトップ中央列 (~440–500px) より
 * 下に置くことで、「小画面では primary を縦に立てる / 中央列では横に展開」へ自然に分岐する。
 * 閾値そのものが「小画面では primary を立てる」という制約の表明になっている。
 *
 * - `sm` — 20rem (320px)
 * - `md` (既定) — 25rem (400px)
 * - `lg` — 32rem (512px)
 */
export type ActionBarCollapseAt = 'sm' | 'md' | 'lg';

/**
 * ActionBar Props
 *
 * 複数の Button からなる**アクション群のレイアウトの確定的な帰結** (向き・幅・DOM順・整列・閾値) を
 * 内部に所有し、文脈で決まる本物の判断だけを小さな API として露出する composite。
 *
 * 露出する判断は 2 つだけ:
 * 1. **どれが primary か** — 子の `variant` で表現 (コンポーネントには決められない階層)。
 * 2. **`align`** — footer→`end` / 終端画面→`center` (機械的に決められない文脈依存)。
 *
 * それ以外 (縦横切替・full-width↔hug・DOM順・gap・container 閾値) は上記 2 つが決まった瞬間に
 * 一意に導出されるので内部が処理する。
 *
 * **DOM順 = 優先度昇順** (tertiary→secondary→primary) で children を置く。これにより
 * 縦 stack では primary が最下 (親指ゾーン)、横 row では primary が右端になり、**order CSS ゼロ**で
 * DOM=視覚=a11y (tab 順) が両ブレークポイントで一致する。
 *
 * @example
 *   // フォーム下部 (responsive, align=end が既定)。DOM順は優先度昇順。
 *   <ActionBar>
 *     <Button variant="tertiary">キャンセル</Button>
 *     <Button variant="primary">保存</Button>
 *   </ActionBar>
 *
 * @example
 *   // 予約完了画面 (中央終端 → align="center")。ホーム=secondary / 詳細=primary。
 *   <ActionBar align="center">
 *     <Button variant="secondary">ホームに戻る</Button>
 *     <Button variant="primary">予約詳細を見る</Button>
 *   </ActionBar>
 *
 * @example
 *   // 常に横並び (狭い pane でも畳ませたくない場合)
 *   <ActionBar orientation="horizontal">
 *     <Button variant="secondary">前へ</Button>
 *     <Button variant="primary">次へ</Button>
 *   </ActionBar>
 */
export interface ActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 向き。`responsive` は container query で縦↔横を切替える。
   * @default 'responsive'
   */
  orientation?: ActionBarOrientation;
  /**
   * 横並び時の整列。footer→`end` / 中央終端画面→`center`。縦 full-width 時は無関係。
   * @default 'end'
   */
  align?: ActionBarAlign;
  /**
   * `responsive` 時に縦→横へ切り替わる container 幅の閾値。
   * @default 'md'
   */
  collapseAt?: ActionBarCollapseAt;
  /**
   * ボタン間の gap。Stack / Cluster と同一スケール。
   * @default 'sm'
   */
  gap?: ActionBarGap;
  /**
   * アクション (Button 群)。**DOM順は優先度昇順** (tertiary→secondary→primary) で置く。
   * primary は通常 1 つ (2 つ以上は dev warn)。
   */
  children: React.ReactNode;
}

/**
 * ActionBar のスタイル定義 — `tailwind-variants` で orientation × align × gap を保持。
 *
 * **幅の挙動は flex の `align-items: stretch` (既定) に委ねる**:
 * - 縦 (`flex-col`): 子は cross 軸 (横) に stretch → 自動で full-width。
 * - 横 (`flex-row`): 子は main 軸 = content 幅 → 自動で hug (Button の `min-w` だけが効く)。
 *
 * これにより子要素に `w-full` / `w-auto` を当てずに済み (width のカスケード衝突を回避)、
 * 切り替えるのは `flex-direction` のみになる (`responsive` は container query で上書き)。
 */
const actionBarVariants = tv({
  base: 'flex',
  variants: {
    orientation: {
      // responsive の base は縦。container query (collapseClasses) が閾値以上で横へ上書きする。
      responsive: 'flex-col',
      vertical: 'flex-col',
      horizontal: 'flex-row',
    },
    align: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    },
    gap: {
      xs: 'gap-1', // 4px
      sm: 'gap-2', // 8px
      md: 'gap-3', // 12px
      lg: 'gap-4', // 16px
      xl: 'gap-6', // 24px
      '2xl': 'gap-12', // 48px
    },
  },
  defaultVariants: {
    orientation: 'responsive',
    align: 'end',
    gap: 'sm',
  },
});

/**
 * `responsive` 時に container 幅が閾値以上で横並びへ上書きする container-query クラス。
 * `flex-col md:flex-row` と同型 (base=縦 / 変種=横)。JIT が拾えるよう静的リテラルで保持する。
 */
const collapseClasses: Record<ActionBarCollapseAt, string> = {
  sm: '@[20rem]:flex-row', // 320px
  md: '@[25rem]:flex-row', // 400px
  lg: '@[32rem]:flex-row', // 512px
};

// primary ≤ 1 の dev warn (#98 Phase 2)。warn-once で重複出力を抑える。本番ビルドでは no-op。
const warnedPrimary = new Set<string>();
function warnMultiplePrimary(children: React.ReactNode): void {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') return;
  const count = React.Children.toArray(children).filter(
    (child) =>
      React.isValidElement(child) &&
      (child.props as { variant?: string }).variant === 'primary',
  ).length;
  if (count <= 1) return;
  const key = `primary:${count}`;
  if (warnedPrimary.has(key)) return;
  warnedPrimary.add(key);
  console.warn(
    `[design-system] ActionBar: primary は 1 つまでを推奨します (${count} 個検出)。` +
      'アクション群の階層を明確にするため primary は 1 つに絞ってください ' +
      '(#98 Phase 2: warn のみ、hard gate は将来)。',
  );
}

/**
 * ActionBar — Atomic Design: Composite (Layout)
 *
 * 内部構造 (2 層):
 * - outer (`@container`): 利用可能幅の container query 文脈を確立する (要素は自分の幅を query できないため、
 *   応答する内側 flex の祖先として container を置く)。
 * - inner (`flex`): orientation / align / gap を適用。`responsive` は `@[Npx]:flex-row` で横へ切替える。
 *
 * @see ActionBarProps for usage examples.
 */
export const ActionBar: React.FC<ActionBarProps> = ({
  orientation = 'responsive',
  align = 'end',
  collapseAt = 'md',
  gap = 'sm',
  children,
  className,
  ...rest
}) => {
  warnMultiplePrimary(children);
  const inner = actionBarVariants({ orientation, align, gap });
  // container query での縦→横切替は responsive のときだけ (vertical / horizontal は固定)。
  const responsive = orientation === 'responsive' ? collapseClasses[collapseAt] : '';
  return (
    <div data-ds-root {...rest} className={['@container', className].filter(Boolean).join(' ')}>
      <div className={[inner, responsive].filter(Boolean).join(' ')}>{children}</div>
    </div>
  );
};

ActionBar.displayName = 'ActionBar';
