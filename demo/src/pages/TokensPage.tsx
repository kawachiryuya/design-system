/**
 * Tokens Showcase Page
 *
 * デザインシステムのトークン一覧を可視化する検証ページ。
 * AI / 人間が現在のシステム値を視覚的に確認するためのリファレンス。
 *
 * Phase 1 で導入した `@tokens`（Style Dictionary build 成果物）を実際に dogfooding。
 * 各値はソース `tokens/source/*.json` から `npm run tokens:build` で自動生成。
 */
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '@tokens';
import { Typography } from '@ds/primitives/Typography/Typography';

const PRIMITIVE_PALETTES = ['primary', 'neutral', 'success', 'error', 'warning', 'info'] as const;
const SEMANTIC_GROUPS = ['surface', 'on', 'border', 'state'] as const;

export const TokensPage = () => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-12">
      <header>
        <Typography variant="h1">Tokens Showcase</Typography>
        <p className="mt-2 text-onSurface-muted">
          Style Dictionary が <code className="bg-surface-inset px-1 rounded">tokens/source/</code> から自動生成。
          このページは <code className="bg-surface-inset px-1 rounded">@tokens</code> を直接 import して値を表示しています。
        </p>
      </header>

      {/* Primitive Colors */}
      <section className="space-y-4">
        <Typography variant="h2">Primitive Colors</Typography>
        <p className="text-onSurface-muted">10-step OKLCH ベースのカラースケール。</p>
        <div className="space-y-3">
          {PRIMITIVE_PALETTES.map((paletteName) => {
            const palette = COLORS[paletteName] as Record<string, string>;
            return (
              <div key={paletteName}>
                <div className="text-sm font-medium mb-1 capitalize">{paletteName}</div>
                <div className="grid grid-cols-10 gap-1">
                  {Object.entries(palette).map(([step, hex]) => (
                    <div key={step} className="space-y-1">
                      <div
                        className="h-12 rounded-xs border border-border-muted"
                        style={{ backgroundColor: hex }}
                        title={`${paletteName}-${step}: ${hex}`}
                      />
                      <div className="text-[10px] text-onSurface-muted text-center font-mono">{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Semantic Colors */}
      <section className="space-y-4">
        <Typography variant="h2">Semantic Colors</Typography>
        <p className="text-onSurface-muted">
          WHERE × WHAT 構造。プリミティブを参照（例: <code>surface.primary = primary.600</code>）。
        </p>
        {SEMANTIC_GROUPS.map((group) => {
          const tokens = COLORS[group] as Record<string, string>;
          return (
            <div key={group} className="space-y-2">
              <div className="text-sm font-medium capitalize">{group}</div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {Object.entries(tokens).map(([name, hex]) => (
                  <div key={name} className="flex items-center gap-2 p-2 rounded-sm border border-border-muted">
                    <div
                      className="h-8 w-8 rounded-xs border border-border-muted shrink-0"
                      style={{ backgroundColor: hex }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate">{name}</div>
                      <div className="text-[10px] text-onSurface-muted font-mono truncate">{hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Spacing */}
      <section className="space-y-4">
        <Typography variant="h2">Spacing</Typography>
        <p className="text-onSurface-muted">8px ベースのスケール。</p>
        <div className="space-y-1">
          {Object.entries(SPACING).map(([key, value]) => (
            <div key={key} className="flex items-center gap-3 text-sm">
              <div className="w-12 text-right font-mono text-onSurface-muted">{key}</div>
              <div className="bg-surface-primary h-4" style={{ width: value }} />
              <div className="font-mono text-xs text-onSurface-muted">{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Scale */}
      <section className="space-y-4">
        <Typography variant="h2">Typography Scale</Typography>
        <p className="text-onSurface-muted">font-size スケール（xs 〜 6xl）。</p>
        <div className="space-y-2">
          {Object.entries(TYPOGRAPHY['font-size']).map(([key, value]) => (
            <div key={key} className="flex items-baseline gap-4 border-b border-border-muted pb-1">
              <div className="w-16 text-xs font-mono text-onSurface-muted">{key}</div>
              <div style={{ fontSize: value }}>The quick brown fox jumps</div>
              <div className="ml-auto text-xs font-mono text-onSurface-muted">{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Radius */}
      <section className="space-y-4">
        <Typography variant="h2">Border Radius</Typography>
        <div className="flex flex-wrap gap-4">
          {Object.entries(RADIUS).map(([key, value]) => (
            <div key={key} className="flex flex-col items-center gap-1">
              <div
                className="h-16 w-16 bg-surface-primary"
                style={{ borderRadius: value }}
              />
              <div className="text-xs font-mono">{key}</div>
              <div className="text-[10px] text-onSurface-muted">{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Shadows */}
      <section className="space-y-4">
        <Typography variant="h2">Shadows</Typography>
        <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
          {Object.entries(SHADOWS).map(([key, value]) => (
            <div key={key} className="flex flex-col items-center gap-2">
              <div
                className="h-16 w-16 bg-surface rounded-md"
                style={{ boxShadow: value }}
              />
              <div className="text-xs font-mono">{key}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="pt-8 border-t border-border-muted text-sm text-onSurface-muted">
        Source: <code>tokens/source/</code> → Style Dictionary → <code>tokens/build/tokens.ts</code> → <code>@tokens</code>
      </footer>
    </div>
  );
};
