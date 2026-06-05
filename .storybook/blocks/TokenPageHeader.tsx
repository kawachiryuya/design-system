import React from 'react';
import { Typography } from '../../components/primitives/Typography/Typography';

/**
 * Tokens 系 story の共通ヘッダー。
 *
 * 全 Tokens story (Color/Spacing/Radius/Shadow/Animation/Breakpoints/Typography/
 * Z-Index/Opacity/Focus Ring 等) で h1 + 説明 + 利用 utility 例 + 補足 (optional)
 * の構成を統一する。
 *
 * 見出し・余白感は Primitives の `.guideline.mdx` (`.sbdocs h1/h2` のスタイル) に
 * 寄せている — token stories は canvas モード (`.sbdocs` 外) で描画されるため、
 * Typography component で同等の視覚を再現する。
 *
 * @example
 *   <TokenPageHeader title="Spacing" intro="8px 基準のスケール。" utility={`p-{key} / m-{key} / gap-{key}`} />
 */
export interface TokenPageHeaderProps {
  /** ページタイトル (例: "Spacing", "Border Radius") */
  title: string;
  /** 簡潔な紹介文 */
  intro: React.ReactNode;
  /** 主な利用 utility class パターン (例: "p-{key} / gap-{key}") */
  utility?: string;
  /** 補足情報。utility より下に表示 */
  children?: React.ReactNode;
}

export const TokenPageHeader: React.FC<TokenPageHeaderProps> = ({
  title,
  intro,
  utility,
  children,
}) => (
  <header className="mb-12 max-w-prose flex flex-col gap-4">
    <Typography variant="h1" as="h1">
      {title}
    </Typography>
    <Typography variant="body-lg" color="muted">
      {intro}
    </Typography>
    {utility && (
      <Typography variant="body-sm" color="muted">
        利用 utility:{' '}
        <code className="bg-surface-inset text-onSurface px-[6px] py-[1px] rounded-sm font-mono text-xs">
          {utility}
        </code>
      </Typography>
    )}
    {children && (
      <Typography variant="body-sm" color="muted">
        {children}
      </Typography>
    )}
  </header>
);

/**
 * Tokens story 内のサブセクション見出し (例: 「トークン値」「視覚サンプル」)。
 * Primitives の `.sbdocs h3` 相当 (text-heading-md + 上下余白)。
 */
export const TokenSectionHeading: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Typography variant="h3" as="h3" className="mt-10 mb-4">
    {children}
  </Typography>
);
