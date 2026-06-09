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
   * 最大幅の段階。用途名で指定する。値は固定 (Tailwind default の max-w-md/3xl/4xl/5xl)。
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
 * - max variant: Tailwind default `max-w-*` を 4 段階にマップ。
 *
 * 注: layout token `--layout-container-max-width-*` (= AppShell 用、768/1280/1536/100%)
 *     とは namespace を分けている。Center は content-level、token は shell-level の責務分担。
 *     content-level の token category 追加 (`layout.content.max-width.*` 等) は
 *     揺れが顕在化したら検討する Phase B 以降の課題。
 */
const centerVariants = tv({
  base: 'mx-auto w-full',
  variants: {
    max: {
      form:      'max-w-md',   // 448px
      reading:   'max-w-3xl',  // 768px
      wide:      'max-w-4xl',  // 896px
      marketing: 'max-w-5xl',  // 1024px
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
