import React from 'react';
import { tv } from '../../_internal/tv';

/**
 * Cluster の gap 段階。Stack と同一 6 段。
 *
 * 段階ごとの想定用途 (horizontal context):
 * - `xs`  (4px)  — icon + label / breadcrumb separator / 密接した inline elements
 * - `sm`  (8px)  — menu items / button row / chip group の標準ギャップ
 * - `md`  (12px) — 中密度の inline list / 反復要素
 * - `lg`  (16px) — section header (title + actions) / 視覚的な分離
 * - `xl`  (24px) — 大ブロック inline / 余裕を持たせた配置
 * - `2xl` (48px) — Stack との API 対称性のため保持 (horizontal では稀な用途)
 *
 * Stack と同一スケールを採用することで、両 primitive を併用する場面で
 * gap の選定基準を統一できる。
 */
export type ClusterGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Cluster が描画する HTML 要素。Stack より絞り、form / article は対象外 (用途が垂直方向)。
 * `span` は inline 文脈 (記事 meta / breadcrumb / icon+label 等) で使う。
 * `display: flex` で span が flex-container 化するのは browser 標準挙動。
 */
export type ClusterElement = 'div' | 'span' | 'section' | 'ul' | 'ol' | 'nav';

/** Cluster の cross-axis (= vertical) alignment。 */
export type ClusterAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

/** Cluster の main-axis (= horizontal) alignment。 */
export type ClusterJustify = 'start' | 'center' | 'end' | 'between' | 'around';

/**
 * Cluster Props
 *
 * 子要素を水平方向に並べ、画面端で自動折り返しする layout primitive。
 * `flex flex-wrap + gap-*` で実装。**常に折り返す** (Cluster の定義的特徴)。
 *
 * non-wrap が必要な場面は plain `flex items-center gap-N` を直接書く方が軽量
 * (Cluster で表現する意味が薄い)。
 *
 * @example
 *   // icon + label (xs = 4px、密接)
 *   <Cluster gap="xs" align="center">
 *     <Icon name="clock" />
 *     <span>5 分</span>
 *   </Cluster>
 *
 * @example
 *   // navigation menu (semantic な nav として、折り返しありで)
 *   <Cluster gap="sm" as="nav" align="center">
 *     <Link>ホーム</Link>
 *     <Link>予約一覧</Link>
 *     <Link>マイページ</Link>
 *   </Cluster>
 *
 * @example
 *   // header pattern (title 左 + action 右、wrap あり)
 *   <Cluster gap="md" justify="between" align="center">
 *     <Typography variant="h2">予約一覧</Typography>
 *     <Button>新規予約</Button>
 *   </Cluster>
 *
 * @example
 *   // FilterChip group (wrap が効く)
 *   <Cluster gap="sm" as="ul">
 *     <li><FilterChip /></li>
 *     <li><FilterChip /></li>
 *   </Cluster>
 */
export interface ClusterProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * 子要素間の gap。必須 — Cluster の存在意義そのものなので default を持たない。
   * Stack と同一スケール、選定基準も共通。
   */
  gap: ClusterGap;
  /**
   * 描画する HTML 要素。
   * - `div` 汎用 (default)
   * - `section` ページ構造の意味タグ
   * - `ul` / `ol` リスト系 (li を直接子に置く想定)
   * - `nav` ナビゲーション (Link 等を直接子に置く想定)
   * @default 'div'
   */
  as?: ClusterElement;
  /**
   * cross-axis (= vertical) alignment。icon + text の縦中央揃え等。
   * - `start`    上揃え
   * - `center`   中央揃え (default)
   * - `end`      下揃え
   * - `stretch`  親高さに揃える
   * - `baseline` テキスト baseline 揃え (typography mixing で有効)
   * @default 'center'
   */
  align?: ClusterAlign;
  /**
   * main-axis (= horizontal) alignment。
   * - `start`    左寄せ (default)
   * - `center`   中央寄せ
   * - `end`      右寄せ
   * - `between`  両端配置 (header の title + action 等)
   * - `around`   各要素の周囲に等間隔
   * @default 'start'
   */
  justify?: ClusterJustify;
  /** 子要素。 */
  children: React.ReactNode;
  /** 追加 CSS クラス。 */
  className?: string;
}

/**
 * Cluster のスタイル定義 — `tailwind-variants` で gap × align × justify を保持。
 *
 * - base: `flex flex-wrap` (horizontal stacking + 常に折り返す)
 * - gap: Stack と同じ Tailwind default `gap-{1,2,3,4,6,12}` の 6 段階
 * - align: `items-*` で cross-axis (= vertical) 配置
 * - justify: `justify-*` で main-axis (= horizontal) 配置
 */
const clusterVariants = tv({
  base: 'flex flex-wrap',
  variants: {
    gap: {
      xs:    'gap-1',   // 4px
      sm:    'gap-2',   // 8px
      md:    'gap-3',   // 12px
      lg:    'gap-4',   // 16px
      xl:    'gap-6',   // 24px
      '2xl': 'gap-12',  // 48px
    },
    align: {
      start:    'items-start',
      center:   'items-center',
      end:      'items-end',
      stretch:  'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start:   'justify-start',
      center:  'justify-center',
      end:     'justify-end',
      between: 'justify-between',
      around:  'justify-around',
    },
  },
  defaultVariants: {
    align:   'center',
    justify: 'start',
  },
});

/**
 * Cluster — Atomic Design: Atom (Layout primitive)
 *
 * @see ClusterProps for usage examples.
 */
export const Cluster: React.FC<ClusterProps> = ({
  gap,
  as: Tag = 'div',
  align = 'center',
  justify = 'start',
  children,
  className,
  ...rest
}) => {
  return (
    <Tag {...rest} className={clusterVariants({ gap, align, justify, className })}>
      {children}
    </Tag>
  );
};

Cluster.displayName = 'Cluster';
