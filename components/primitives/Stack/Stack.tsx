import React from 'react';
import { tv } from '../../_internal/tv';

/**
 * Stack の gap 段階。
 *
 * Tailwind spacing scale に紐づく 5 段、consumer の inventory に基づき
 * 4 / 8 / 12 / 16 / 24 px を選定。**グループ内**リズム専用。
 *
 * 段階ごとの想定用途:
 * - `xs` (4px)  — タイトル+補足 / icon+label 等、密着気味
 * - `sm` (8px)  — list item / form field 同士の標準ギャップ
 * - `md` (12px) — card 連続表示の標準ギャップ
 * - `lg` (16px) — form section の標準ギャップ
 * - `xl` (24px) — heading と body / 大ブロック間
 *
 * 注: page 内の **section 分割** (48px+) は Stack の責務ではなく `<Section>` (`py-section-*`)
 *     で表現する。旧 `2xl`(48) は section 値が Stack gap に化けた重複だったため削除した。
 *     Stack=グループ内リズム / Section=ページ構造、とスコープで責務分離する。
 */
export type StackGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Stack が描画する HTML 要素。semantic な意味タグを保つために `as` で切り替える。
 * `span` は inline 文脈で flex-col の縦並びをしたい稀なケース用 (block 用途の方が主)。
 */
export type StackElement = 'div' | 'span' | 'section' | 'article' | 'ul' | 'ol' | 'nav' | 'form';

/** Stack の cross-axis (= horizontal) alignment。 */
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';

/**
 * Stack Props
 *
 * 子要素を垂直方向に等間隔で並べる layout primitive。
 * `flex flex-col + gap-*` で実装し、`space-y-*` 流は採用しない
 * (fragment / 条件付き children で margin が壊れるため)。
 *
 * @example
 *   // form field 列 (sm = 8px 間隔)
 *   <Stack gap="sm" as="form">
 *     <Input label="メールアドレス" />
 *     <Input label="パスワード" />
 *     <Button>ログイン</Button>
 *   </Stack>
 *
 * @example
 *   // navigation list (ul として描画)
 *   <Stack gap="sm" as="ul" align="stretch">
 *     <li>...</li>
 *     <li>...</li>
 *   </Stack>
 *
 * @example
 *   // heading と本文ブロック間 (xl = 24px)
 *   <Stack gap="xl">
 *     <Typography variant="h2">...</Typography>
 *     <p>...</p>
 *   </Stack>
 */
export interface StackProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * 子要素間の垂直方向 gap。必須 — Stack の存在意義そのものなので default を持たない。
   */
  gap: StackGap;
  /**
   * 描画する HTML 要素。
   * - `div` 汎用 (default)
   * - `section` / `article` ページ構造の意味タグ
   * - `ul` / `ol` / `nav` リスト系の意味タグ (li 等を直接子に置く想定)
   * - `form` フォーム (`onSubmit` 等のイベントは rest props 経由で受け取れる)
   * @default 'div'
   */
  as?: StackElement;
  /**
   * 子要素の cross-axis (= horizontal) alignment。
   * - `start`   左寄せ (= items-start)
   * - `center`  中央寄せ (= items-center)
   * - `end`     右寄せ (= items-end)
   * - `stretch` 親幅いっぱい (= items-stretch、flex default)
   * @default 'stretch'
   */
  align?: StackAlign;
  /** 子要素。 */
  children: React.ReactNode;
  /** 追加 CSS クラス (padding / background 等、Stack 本体の責務外を載せる)。 */
  className?: string;
}

/**
 * Stack のスタイル定義 — `tailwind-variants` で gap × align を宣言的に保持。
 *
 * - base: `flex flex-col` (vertical stacking 固定)
 * - gap variant: Tailwind default `gap-{1,2,3,4,6}` を 5 段階にマップ (xs..xl = 4..24px)
 * - align variant: `items-*` で cross-axis 配置
 *
 * 注: `space-y-*` ではなく `gap-*` を採用する理由:
 *     (1) fragment (`<>...</>`) や条件付き children で `space-y-*` (= 兄弟への margin)
 *         が消える、(2) gap は flex/grid 仕様の正攻法、(3) 全モダンブラウザで Stage 4。
 */
const stackVariants = tv({
  base: 'flex flex-col',
  variants: {
    gap: {
      xs: 'gap-1',  // 4px
      sm: 'gap-2',  // 8px
      md: 'gap-3',  // 12px
      lg: 'gap-4',  // 16px
      xl: 'gap-6',  // 24px
    },
    align: {
      start:   'items-start',
      center:  'items-center',
      end:     'items-end',
      stretch: 'items-stretch',
    },
  },
  defaultVariants: {
    align: 'stretch',
  },
});

/**
 * Stack — Atomic Design: Atom (Layout primitive)
 *
 * @see StackProps for usage examples.
 */
export const Stack: React.FC<StackProps> = ({
  gap,
  as: Tag = 'div',
  align = 'stretch',
  children,
  className,
  ...rest
}) => {
  return (
    <Tag data-ds-root {...rest} className={stackVariants({ gap, align, className })}>
      {children}
    </Tag>
  );
};

Stack.displayName = 'Stack';
