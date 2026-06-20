import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Accordion, type AccordionItem } from './Accordion';
import { Caption } from '@sb-blocks/Caption';

/**
 * Accordion stories — VR 集約モデル (§5-3)
 *
 * 2 節構成: Playground / Overview。
 * type (single/multiple) と states (collapsed/expanded/disabled/hover/focus) を Overview に集約。
 * Controlled / 長文コンテンツ / FAQ ページ等の usage 合成は guideline の「使用例」へ移設。
 * size / icon prop は無し。
 */
const sampleFaq: AccordionItem[] = [
  { id: 'q1', title: '予約のキャンセルはいつまで可能ですか？', content: '出発時刻の 1 時間前までキャンセル可能です。' },
  { id: 'q2', title: '会員登録は無料ですか？', content: 'はい、完全に無料でご利用いただけます。' },
  { id: 'q3', title: '予約確認メールが届きません', content: '迷惑メールフォルダをご確認ください。' },
];

const meta: Meta<typeof Accordion> = {
  title: 'Composites/Accordion',
  component: Accordion,
  argTypes: {
    type: { control: 'radio', options: ['single', 'multiple'] },
  },
  args: {
    type: 'single',
    items: sampleFaq,
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から type を切替。最初の trigger を click → 展開を play test で検証。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstTrigger = canvas.getByRole('button', { name: /予約のキャンセル/ });
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(firstTrigger);
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// type (single 1つ開く / multiple 複数開く) + states。defaultOpenIds で開状態を静的に凍結。

export const Overview: Story = {
  parameters: {
    pseudo: {
      hover: ['#ac-hover button'],
      focusVisible: ['#ac-focus button'],
    },
    docs: {
      description: {
        story: '視覚回帰用の総覧。collapsed / expanded (defaultOpenIds) / disabled / type="multiple" (複数開く) と、trigger の hover / focus-visible (pseudo 強制) を集約。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-5">
      <Caption text="Collapsed (default)">
        <Accordion items={[{ id: 'a', title: 'タイトル', content: '中身' }]} />
      </Caption>
      <Caption text="Expanded (defaultOpenIds)">
        <Accordion items={[{ id: 'a', title: 'タイトル', content: '中身が表示されている状態' }]} defaultOpenIds={['a']} />
      </Caption>
      <Caption text="Disabled (item.disabled)">
        <Accordion items={[
          { id: 'a', title: '通常', content: '開閉可' },
          { id: 'b', title: '無効な項目', content: 'クリック不可', disabled: true },
          { id: 'c', title: '通常', content: '開閉可' },
        ]} />
      </Caption>
      <Caption text='type="multiple" (複数同時に開く、設定セクション等)'>
        <Accordion items={sampleFaq} type="multiple" defaultOpenIds={['q1', 'q2']} />
      </Caption>
      <Caption text="Trigger Hover (pseudo 強制)">
        <div id="ac-hover">
          <Accordion items={[{ id: 'a', title: 'Hover 中の trigger', content: '中身' }]} />
        </div>
      </Caption>
      <Caption text="Trigger Focus-visible (pseudo 強制)">
        <div id="ac-focus">
          <Accordion items={[{ id: 'a', title: 'Focus 中の trigger', content: '中身' }]} />
        </div>
      </Caption>
    </div>
  ),
};
