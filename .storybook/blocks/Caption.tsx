import React from 'react';

/**
 * Caption — Storybook Story 内で各サブ例にラベルを添える補助コンポーネント。
 *
 * `.stories.tsx` の States / EdgeCases で「これは Hover のサンプル」「これは fullWidth」のような
 * 短いキャプションをサブ例の上に添える用途で使う。`text-xs text-onSurface-muted` の小さな
 * グレーテキスト + 下にコンテンツを縦に並べる構造で、視覚カタログを読みやすくする。
 *
 * @example
 *   <Caption text="Hover">
 *     <Button id="btn-hover">Hover</Button>
 *   </Caption>
 *
 *   <Caption text="fullWidth + 長文 (折返し)">
 *     <Button fullWidth>長いラベル...</Button>
 *   </Caption>
 *
 * `.storybook/blocks/` 配下に置くのは:
 * - 複数コンポーネント (Button, Link, ...) の stories から再利用したい
 * - MDX block ヘルパー (DoDontExample 等) と同じ Storybook 補助ドメイン
 * - @sb-blocks エイリアスで `import { Caption } from '@sb-blocks/Caption'` できる
 */
export interface CaptionProps {
  /** 上部に表示する小ラベル (例: "Hover" / "fullWidth + 長文") */
  text: string;
  /** ラベル下に並ぶサンプル UI */
  children: React.ReactNode;
}

export const Caption: React.FC<CaptionProps> = ({ text, children }) => (
  <div className="flex flex-col gap-1 items-start">
    <span className="text-xs text-onSurface-muted">{text}</span>
    {children}
  </div>
);
