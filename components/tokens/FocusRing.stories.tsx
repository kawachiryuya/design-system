import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../primitives/Button';
import { Input } from '../primitives/Input';
import { Link } from '../primitives/Link';
import { SegmentedControl } from '../composites/SegmentedControl';
import { Tabs } from '../composites/Tabs';

const meta: Meta = {
  title: 'Tokens/Focus Ring',
  parameters: {
    layout: 'padded',
    // Tokens/* は値の可視化であり UI ではない → 視覚回帰対象外 (§9-4 / test-runner の axe 除外と対)。
    // token 値の変化は利用側コンポーネントの snapshot で捕捉される。
    chromatic: { disableSnapshot: true },
  },
};
export default meta;
type Story = StoryObj;

const TOKENS = [
  {
    name: 'focus-ring',
    value: '外側 / 2px / すき間 2px / border.focus',
    description: '既定。外側に輪を出す余地がある部品 (Button / Link / 入力欄 / Checkbox 等)',
  },
  {
    name: 'focus-ring-inset',
    value: '内側 / 2px / border.focus',
    description: '枠の中に詰まっている・端で切れる要素 (NumberInput の ± / Tabs のタブ / メニューの項目 / フォーカスが来るだけの領域)',
  },
  {
    name: 'focus-ring-on-fill',
    value: '縁から 2px 内側 / 2px / onSurface.inverse (白)',
    description: '濃い塗りの内側 (SegmentedControl の選択中)',
  },
  { name: '--focus-ring-width', value: '2px', description: '輪の太さ。3 つの形で共通' },
  { name: '--focus-ring-offset', value: '2px', description: '外側の輪と要素のすき間 (塗らない = 下の面の色が見える)' },
];

export const Tokens: Story = {
  name: 'width / offset',
  parameters: {
    docs: {
      description: {
        story: 'フォーカスの輪の 3 つの形 (utility) と、それが読む CSS 変数。どの部品にどの形かの正本は AGENTS.md §3-2「フォーカスの規則」。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2">
      {TOKENS.map((e) => (
        <div
          key={e.name}
          className="grid items-center gap-4 py-3 px-4 rounded-md border border-border-subtle bg-surface"
          style={{ gridTemplateColumns: '200px 260px 1fr' }}
        >
          <code className="bg-surface-subtle text-onSurface px-2 py-1 rounded-sm font-mono text-xs">{e.name}</code>
          <code className="font-mono text-xs text-onSurface-subtle">{e.value}</code>
          <span className="text-sm text-onSurface">{e.description}</span>
        </div>
      ))}
    </div>
  ),
};

export const Samples: Story = {
  parameters: {
    docs: {
      description: {
        story: '本物の部品にフォーカスを強制表示した見本。外側 (Button / Input / Link) / 内側 (Tabs のタブ) / 濃い塗りの内側 (SegmentedControl の選択中)。',
      },
    },
    pseudo: {
      focusVisible: ['#fr-samples button', '#fr-samples input', '#fr-samples a', '#fr-samples [role="tab"]:nth-of-type(2)'],
    },
  },
  render: () => (
    <div id="fr-samples" className="flex gap-8 flex-wrap items-center p-6 bg-background rounded-md">
      <Button variant="primary">予約する</Button>
      <Input label="氏名" placeholder="山田 太郎" />
      <Link href="#sample">会社概要</Link>
      <Tabs
        ariaLabel="見本のタブ"
        defaultActiveId="a"
        tabs={[
          { id: 'a', label: '概要', content: null },
          { id: 'b', label: '設定', content: null },
        ]}
      />
      <SegmentedControl
        items={[
          { value: 'list', label: 'リスト' },
          { value: 'grid', label: 'グリッド' },
        ]}
        value="list"
        onChange={() => {}}
        aria-label="表示モード"
      />
    </div>
  ),
};
