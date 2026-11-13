import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import colorsToken from '../../tokens/source/colors.json';
import semanticColors from '../../tokens/source/semantic-colors.json';

/**
 * Color token の視覚回帰用 swatch (Chromatic 専用、人が読むカタログではない)。
 *
 * なぜ要るか (#109 Color-4): Chromatic の pixel 比較はアンチエイリアスを吸収する既定閾値
 * (`diffThreshold` 0.063) を持つため、token 値の微調整 (例: #006F50 → #008555、RGB で +22 程度) は
 * 部品の snapshot では「unchanged」に吸収され検出できなかった (#115 で 67 snapshot 中 1 件)。
 * ここでは文字も角丸も無い平坦な色面だけを並べ、`diffThreshold: 0` で撮る。平坦面にはアンチエイリアスが
 * 無いので閾値 0 でも誤検知せず、1 色でも値が変われば差分になる。
 *
 * - Tokens/* は撮影対象外 (AGENTS §9-4) だが、この story だけ明示的な例外 (値の変化を機械検出する目的)
 * - 色は CSS 変数 (`var(--color-…)`) で塗る。消費者が受け取る変数チェーン (semantic → primitive) をそのまま撮る
 * - 並び順は token の定義順。token の追加 / 削除も差分として現れる
 */
const meta: Meta = {
  title: 'Tokens/Color/Regression',
  parameters: {
    layout: 'padded',
    chromatic: { disableSnapshot: false, diffThreshold: 0 },
    docs: {
      description: {
        component:
          'Chromatic 専用の平坦な swatch。token 値の微調整を `diffThreshold: 0` で検出する (AGENTS §9-4)。人が読むカタログは Tokens/Color/Primitive と Tokens/Color/Semantic。',
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
const HUES = Object.keys(colorsToken.color).filter((h) => h !== 'base');
const SEMANTIC = Object.entries(semanticColors.color).flatMap(([group, tokens]) =>
  Object.keys(tokens).map((key) => `${group}.${key}`),
);
/** token path → CSS 変数名 (Style Dictionary の name/kebab と同じ: onSurface → on-surface) */
const cssVar = (path: string) =>
  `--color-${path.replace(/\./g, '-').replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;

/** 平坦な色面。文字・角丸・枠線なし (アンチエイリアスを出さない)。 */
const Swatch: React.FC<{ variable: string; title: string }> = ({ variable, title }) => (
  <div
    role="img"
    aria-label={title}
    title={title}
    className="h-8 w-8 flex-none"
    style={{ background: `var(${variable})` }}
  />
);

export const Swatches: Story = {
  parameters: {
    docs: {
      description: {
        story: 'primitive 6 hue × 10 段 + semantic 全 token を平坦な正方形で並べる。文字なし、閾値 0。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2 bg-surface p-2" data-testid="color-regression">
      {HUES.map((hue) => (
        <div key={hue} className="flex gap-0" data-hue={hue}>
          {STEPS.map((s) => (
            <Swatch key={s} variable={`--color-${hue}-${s}`} title={`${hue}.${s}`} />
          ))}
        </div>
      ))}
      <div className="flex flex-wrap gap-0 w-[320px]" data-group="semantic">
        {SEMANTIC.map((path) => (
          <Swatch key={path} variable={cssVar(path)} title={path} />
        ))}
      </div>
    </div>
  ),
};
