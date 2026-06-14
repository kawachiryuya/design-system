import React from 'react';
import { tv } from '../../_internal/tv';

/**
 * Center の max-width 段階。
 *
 * 段階ごとの想定用途:
 * - `form`      — 448px。Login / Signup / 設定 form 等の単列 form。
 * - `reading`   — 768px。Article / FAQ / 規約等の reading content (1 行 ~ 65 文字)。
 * - `wide`      — 896px。Help / 内側に grid を持つ反復構造。
 * - `marketing` — 1024px。Landing hero / Card grid (max 3 col) 等のマーケティング section。
 *
 * Shell-level の max-width (AppShell の `max-w-container-default = 1280px`) とは別軸。
 * Center は content-level の単列センタリング専用 primitive。
 *
 * 値は layout token `--layout-content-max-width-*` (rem 基準) を参照する。
 * shell-level (`--layout-container-max-width-*` = px) を「枠」、content-level を
 * 「枠の中の読み列」として責務分離し、content は rem で root font-size に追従させる
 * (本文 measure を保つ a11y 観点)。
 */
export type CenterMax = 'form' | 'reading' | 'wide' | 'marketing';

/** Center が描画する HTML 要素。semantic な意味タグを保つために `as` で切り替える。 */
export type CenterElement = 'div' | 'section' | 'article' | 'main';

/**
 * Center Props
 *
 * 単列コンテンツの水平センタリング (max-width + mx-auto) を担う primitive。
 * 垂直 padding やセクション間 spacing は Stack / `py-section-*` utility 等で別途与える。
 *
 * @example
 *   // Login form
 *   <Center max="form" className="py-12">
 *     <LoginForm />
 *   </Center>
 *
 * @example
 *   // Article 本文 (semantic な <article> として描画)
 *   <Center as="article" max="reading" className="py-8">
 *     <h1>...</h1>
 *     <p>...</p>
 *   </Center>
 *
 * @example
 *   // Landing の hero section
 *   <section className="bg-surface-secondary py-16">
 *     <Center max="marketing" className="text-center">
 *       <Typography variant="h1">...</Typography>
 *     </Center>
 *   </section>
 */
export interface CenterProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * 最大幅の段階。用途名で指定する。値は layout token `--layout-content-max-width-*`
   * (form 28rem / reading 48rem / wide 56rem / marketing 64rem) を参照。
   * 必須プロパティ — Center の存在意義そのものなので default を持たない。
   */
  max: CenterMax;
  /**
   * 描画する HTML 要素。
   * - `div` 汎用 (default)
   * - `section` ページ内のセクション (Landing 等)
   * - `article` 独立した記事本文 (Article / FAQ 等)
   * - `main` ページの主コンテンツ (AppShell 配下で 1 つだけ使う想定)
   * @default 'div'
   */
  as?: CenterElement;
  /** 子要素。 */
  children: React.ReactNode;
  /** 追加 CSS クラス (vertical padding / text-align 等、Center 本体の責務外を載せる)。 */
  className?: string;
}

/**
 * Center のスタイル定義 — `tailwind-variants` で max 段階を宣言的に保持。
 *
 * - base: `mx-auto w-full` (= 中央寄せ + 親に対して 100% width、max-width で頭打ち)
 * - max variant: content-level token utility `max-w-content-*` を 4 段階にマップ
 *   (値は `--layout-content-max-width-*` = form 28rem / reading 48rem / wide 56rem / marketing 64rem)。
 *
 * 注: shell-level の `--layout-container-max-width-*` (= AppShell 用、768/1280/1536/100% px)
 *     とは namespace を分けている。Center は content-level (rem)、container は shell-level (px) の責務分担。
 *     `wide` は両軸に存在するが値が異なる (content=896px / container=1536px) ため
 *     token は別 group で曖昧さを解消している。
 */
const centerVariants = tv({
  base: 'mx-auto w-full',
  variants: {
    max: {
      form:      'max-w-content-form',       // 28rem (448px)
      reading:   'max-w-content-reading',    // 48rem (768px)
      wide:      'max-w-content-wide',        // 56rem (896px)
      marketing: 'max-w-content-marketing',  // 64rem (1024px)
    },
  },
});

/**
 * Center — Atomic Design: Atom (Layout primitive)
 *
 * @see CenterProps for usage examples.
 */
export const Center: React.FC<CenterProps> = ({
  max,
  as: Tag = 'div',
  children,
  className,
  ...rest
}) => {
  return (
    <Tag {...rest} className={centerVariants({ max, className })}>
      {children}
    </Tag>
  );
};

Center.displayName = 'Center';
