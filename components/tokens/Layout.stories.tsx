import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import layoutToken from '../../tokens/source/layout.json';

const meta: Meta = {
  title: 'Tokens/Layout',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

type LeafEntry = { value: string; type: string; description?: string };

const L = layoutToken.layout as {
  container: {
    'padding-x': Record<'mobile' | 'tablet' | 'desktop', LeafEntry>;
    'padding-y': Record<'mobile' | 'tablet' | 'desktop', LeafEntry>;
    'max-width': Record<'narrow' | 'default' | 'wide' | 'full', LeafEntry>;
  };
  section: {
    gap: Record<'sm' | 'md' | 'lg', LeafEntry>;
    'padding-y': Record<'sm' | 'md' | 'lg', LeafEntry>;
  };
  grid: {
    columns: Record<'mobile' | 'tablet' | 'desktop', LeafEntry>;
    gutter: Record<'mobile' | 'tablet' | 'desktop', LeafEntry>;
  };
};

const KeyBadge: React.FC<{ k: string }> = ({ k }) => (
  <code className="bg-surface-inset text-onSurface px-[6px] py-[2px] rounded-sm font-mono text-xs inline-block">
    {k}
  </code>
);

/** Tailwind JIT が動的クラス名を検出できないため、static な lookup table を用意。 */
const SECTION_GAP_CLASS = {
  sm: 'gap-section-sm',
  md: 'gap-section-md',
  lg: 'gap-section-lg',
} as const;

const SECTION_PADDING_Y_CLASS = {
  sm: 'py-section-sm',
  md: 'py-section-md',
  lg: 'py-section-lg',
} as const;

// ── Container ──────────────────────────────────────────────

export const Container: Story = {
  parameters: {
    docs: {
      description: {
        story: '大外 page wrapper の padding (breakpoint 内蔵) と max-width。`px-container` / `py-container` は単一 class で mobile / tablet / desktop の値が自動切替。`max-w-container` は 4 variant (narrow / default / wide / full)。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="text-heading-sm m-0 text-onSurface">container.padding-x (左右 padding)</h3>
        <p className="m-0 text-body-sm text-onSurface-muted">utility: <code className="font-mono text-xs">px-container</code> (単一 class、breakpoint で値が自動切替)</p>
        <div className="flex flex-col gap-2">
          {(['mobile', 'tablet', 'desktop'] as const).map((bp) => (
            <div key={bp} className="flex items-center gap-4 py-2 px-3 rounded-md border border-border-subtle bg-surface">
              <KeyBadge k={bp} />
              <code className="font-mono text-xs text-onSurface">{L.container['padding-x'][bp].value}</code>
              <span className="text-xs text-onSurface-muted">{L.container['padding-x'][bp].description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-heading-sm m-0 text-onSurface">container.padding-y (上下 padding)</h3>
        <p className="m-0 text-body-sm text-onSurface-muted">utility: <code className="font-mono text-xs">py-container</code></p>
        <div className="flex flex-col gap-2">
          {(['mobile', 'tablet', 'desktop'] as const).map((bp) => (
            <div key={bp} className="flex items-center gap-4 py-2 px-3 rounded-md border border-border-subtle bg-surface">
              <KeyBadge k={bp} />
              <code className="font-mono text-xs text-onSurface">{L.container['padding-y'][bp].value}</code>
              <span className="text-xs text-onSurface-muted">{L.container['padding-y'][bp].description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-heading-sm m-0 text-onSurface">container.max-width (4 variant)</h3>
        <p className="m-0 text-body-sm text-onSurface-muted">utility: <code className="font-mono text-xs">max-w-container[-narrow|-wide|-full]</code></p>
        <div className="flex flex-col gap-3">
          {(['narrow', 'default', 'wide', 'full'] as const).map((variant) => {
            const entry = L.container['max-width'][variant];
            const utility = variant === 'default' ? 'max-w-container' : `max-w-container-${variant}`;
            return (
              <div key={variant} className="rounded-md border border-border-subtle bg-surface p-3">
                <div className="flex items-center gap-3 mb-2">
                  <KeyBadge k={variant} />
                  <code className="font-mono text-xs text-onSurface-muted">{utility}</code>
                  <code className="font-mono text-xs text-onSurface">{entry.value}</code>
                </div>
                <p className="m-0 text-xs text-onSurface-muted mb-2">{entry.description}</p>
                {/* 視覚プレビュー: max-width に応じた帯 (story 内で確認できるよう iframe 内に縮尺表示) */}
                <div className="bg-surface-inset h-4 rounded-sm relative overflow-hidden">
                  <div
                    className="h-full bg-surface-primary rounded-sm"
                    style={{
                      width: variant === 'full' ? '100%' : `${Math.min(parseInt(entry.value, 10) / 1536 * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  ),
};

// ── Section ────────────────────────────────────────────────

export const Section: Story = {
  parameters: {
    docs: {
      description: {
        story: 'section 間 / section 内の垂直余白。density で sm / md / lg の 3 段。gap は flex/grid の子要素間、padding-y は section 自体の上下。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="text-heading-sm m-0 text-onSurface">section.gap (section 間の垂直余白)</h3>
        <p className="m-0 text-body-sm text-onSurface-muted">utility: <code className="font-mono text-xs">gap-section-{'{sm|md|lg}'}</code> / <code className="font-mono text-xs">space-y-section-{'{sm|md|lg}'}</code></p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <div key={size} className="rounded-md border border-border-subtle bg-surface p-4">
              <div className="flex items-center gap-2 mb-3">
                <KeyBadge k={size} />
                <code className="font-mono text-xs text-onSurface">{L.section.gap[size].value}</code>
              </div>
              <div className={`flex flex-col ${SECTION_GAP_CLASS[size]}`}>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="bg-surface-inset h-6 rounded-sm" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-heading-sm m-0 text-onSurface">section.padding-y (section 自体の上下 padding)</h3>
        <p className="m-0 text-body-sm text-onSurface-muted">utility: <code className="font-mono text-xs">py-section-{'{sm|md|lg}'}</code></p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <div key={size} className="rounded-md border border-border-subtle bg-surface">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border-subtle">
                <KeyBadge k={size} />
                <code className="font-mono text-xs text-onSurface">{L.section['padding-y'][size].value}</code>
              </div>
              <div className={`px-4 ${SECTION_PADDING_Y_CLASS[size]} bg-surface-inset`}>
                <div className="bg-surface-primary h-8 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};

// ── Grid ───────────────────────────────────────────────────

export const Grid: Story = {
  parameters: {
    docs: {
      description: {
        story: '12-col 表記体系。`grid-base` 単一 class で mobile 4 cols / tablet 8 cols / desktop 12 cols + gutter が自動切替。子要素は Tailwind の `col-span-N` (1〜12) + `sm:` / `lg:` prefix で responsive 配置。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="text-heading-sm m-0 text-onSurface">grid.columns (カラム数)</h3>
        <div className="flex flex-col gap-2">
          {(['mobile', 'tablet', 'desktop'] as const).map((bp) => (
            <div key={bp} className="flex items-center gap-4 py-2 px-3 rounded-md border border-border-subtle bg-surface">
              <KeyBadge k={bp} />
              <code className="font-mono text-xs text-onSurface">{L.grid.columns[bp].value} cols</code>
              <span className="text-xs text-onSurface-muted">{L.grid.columns[bp].description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-heading-sm m-0 text-onSurface">grid.gutter (カラム間 gap)</h3>
        <div className="flex flex-col gap-2">
          {(['mobile', 'tablet', 'desktop'] as const).map((bp) => (
            <div key={bp} className="flex items-center gap-4 py-2 px-3 rounded-md border border-border-subtle bg-surface">
              <KeyBadge k={bp} />
              <code className="font-mono text-xs text-onSurface">{L.grid.gutter[bp].value}</code>
              <span className="text-xs text-onSurface-muted">{L.grid.gutter[bp].description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-heading-sm m-0 text-onSurface">grid-base 実例</h3>
        <p className="m-0 text-body-sm text-onSurface-muted">
          viewport を狭めて columns が切替わるのを確認できる。子要素の <code className="font-mono text-xs">col-span-N</code> も合わせて responsive prefix で指定。
        </p>

        <div className="text-xs text-onSurface-muted mt-2">例 1: 全幅 1 つ (mobile から desktop まで全幅)</div>
        <div className="grid-base">
          <div className="col-span-full bg-surface-primary h-12 rounded-sm flex items-center justify-center text-onSurface-inverse text-xs">col-span-full</div>
        </div>

        <div className="text-xs text-onSurface-muted mt-2">例 2: 2 分割 (mobile では全幅、tablet 以上で 2 等分)</div>
        <div className="grid-base">
          <div className="col-span-4 md:col-span-4 lg:col-span-6 bg-surface-primary h-12 rounded-sm flex items-center justify-center text-onSurface-inverse text-xs">A</div>
          <div className="col-span-4 md:col-span-4 lg:col-span-6 bg-surface-success h-12 rounded-sm flex items-center justify-center text-onSurface-inverse text-xs">B</div>
        </div>

        <div className="text-xs text-onSurface-muted mt-2">例 3: 3 分割 (mobile では縦並び、desktop で 3 等分)</div>
        <div className="grid-base">
          <div className="col-span-4 md:col-span-8 lg:col-span-4 bg-surface-primary h-12 rounded-sm flex items-center justify-center text-onSurface-inverse text-xs">A</div>
          <div className="col-span-4 md:col-span-4 lg:col-span-4 bg-surface-success h-12 rounded-sm flex items-center justify-center text-onSurface-inverse text-xs">B</div>
          <div className="col-span-4 md:col-span-4 lg:col-span-4 bg-surface-warning h-12 rounded-sm flex items-center justify-center text-onSurface-inverse text-xs">C</div>
        </div>

        <div className="text-xs text-onSurface-muted mt-2">例 4: Main + Sidebar (mobile では縦、desktop で 8:4)</div>
        <div className="grid-base">
          <div className="col-span-4 md:col-span-8 lg:col-span-8 bg-surface-primary h-24 rounded-sm flex items-center justify-center text-onSurface-inverse text-xs">Main (col-span 8)</div>
          <div className="col-span-4 md:col-span-8 lg:col-span-4 bg-surface-secondary h-24 rounded-sm flex items-center justify-center text-onSurface-primary text-xs">Sidebar (col-span 4)</div>
        </div>
      </section>
    </div>
  ),
};
