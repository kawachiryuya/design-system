import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Tokens/Opacity',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

type Entry = { key: string; value: number; description: string; usedBy: string };

const ENTRIES: Entry[] = [
  { key: 'disabled',       value: 0.5,  description: '操作不能 (cursor-not-allowed と組合せ)', usedBy: 'Button / Input / Textarea / Select / Radio / Checkbox / Switch / Link / NumberInput' },
  { key: 'muted',          value: 0.7,  description: '控えめ表示 (装飾的 icon / 副次情報)',     usedBy: 'Link 外部リンクアイコン' },
  { key: 'spinner-track',  value: 0.25, description: 'spinner の円弧トラック (背景円)',         usedBy: 'Button (loading) / Spinner' },
  { key: 'spinner-spin',   value: 0.75, description: 'spinner の回転アーク',                    usedBy: 'Button (loading) / Spinner' },
];

export const Values: Story = {
  name: 'Semantic Opacity',
  parameters: {
    docs: {
      description: {
        story: '意味付けされた 4 値。Tailwind 既定の `opacity-0/5/10/.../100` も並存。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2">
      {ENTRIES.map((e) => (
        <div
          key={e.key}
          className="grid items-center gap-4 py-3 px-4 rounded-md border border-border-muted bg-surface"
          style={{ gridTemplateColumns: '180px 60px 80px 1fr' }}
        >
          <code className="bg-surface-inset text-onSurface px-2 py-1 rounded-sm font-mono text-xs">
            opacity-{e.key}
          </code>
          <code className="font-mono text-xs text-onSurface-muted">{e.value}</code>
          <div
            className="w-12 h-8 rounded-sm bg-surface-primary"
            style={{ opacity: e.value }}
            aria-label={`opacity ${e.value} のサンプル`}
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm text-onSurface">{e.description}</span>
            <span className="text-xs text-onSurface-muted">使用: {e.usedBy}</span>
          </div>
        </div>
      ))}
    </div>
  ),
};
