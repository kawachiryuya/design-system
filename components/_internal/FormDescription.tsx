import React from 'react';

/**
 * FormDescription — 内部ユーティリティ
 *
 * Radio / Checkbox / Switch 等の **per-option 補足説明** を統一描画する。
 * `<span aria-describedby>` 用、a11y 観点では各 input の `aria-describedby` に
 * `id` を紐付ける運用 (input 側で属性を組立てる)。
 *
 * 階層上の位置付け:
 * - `<Label>` (Primitive): form control の **識別子** (`<label htmlFor>`)
 * - `<FormDescription>` (internal、本ファイル): per-option **補足** (`<span aria-describedby>`)
 * - `<FormMessage>` (internal): group-level **helpText / errorMessage** (`<p aria-describedby>`)
 *
 * 外部に公開しない (Radio.tsx / Checkbox.tsx / Switch.tsx 内部で使用)。
 */
export interface FormDescriptionProps {
  /** description 要素の id (input 側で `aria-describedby` 用に参照) */
  id?: string;
  /** description テキスト */
  children: React.ReactNode;
}

export const FormDescription: React.FC<FormDescriptionProps> = ({ id, children }) => (
  <span id={id} className="text-body-sm text-onSurface-soft">
    {children}
  </span>
);
